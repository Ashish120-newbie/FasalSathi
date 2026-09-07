import { useMemo, useState } from 'react';
import { ChevronDown, Search, Sprout } from 'lucide-react';
import { crops, cropName } from '@/data/crops';
import { cultivationTips, type CultivationTipCategory } from '@/data/cultivationTips';
import type { CropId } from '@/data/types';
import type { Language } from '@/data/i18n';
import { useLang } from '@/lib/lang';
import { useBatchTranslation } from '@/lib/useBatchTranslation';
import { libraryLabels } from '@/data/libraryLabels';

const categoryOrder: (keyof CultivationTipCategory)[] = [
  'sowing',
  'spacing',
  'irrigation',
  'fertilization',
  'pestWatch',
  'harvest',
  'storage',
];

function categoryLabel(key: keyof CultivationTipCategory, t: ReturnType<typeof useLang>['t']): string {
  switch (key) {
    case 'sowing': return t.ctSowing;
    case 'spacing': return t.ctSpacing;
    case 'irrigation': return t.ctIrrigation;
    case 'fertilization': return t.ctFertilization;
    case 'pestWatch': return t.ctPestWatch;
    case 'harvest': return t.ctHarvest;
    case 'storage': return t.ctStorage;
  }
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400" />
          <p className="text-sm leading-6 text-forest-800">{item}</p>
        </li>
      ))}
    </ul>
  );
}

function TipCategoryBlock({ label, tips }: { label: string; tips: string[] }) {
  if (!tips || tips.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1.5">
        <Sprout size={14} className="text-forest-500" />
        <h4 className="text-[13px] font-semibold text-forest-800">{label}</h4>
      </div>
      <BulletList items={tips} />
    </div>
  );
}

function CropTipCard({ cropId, lang, t }: { cropId: CropId; lang: Language; t: ReturnType<typeof useLang>['t'] }) {
  const [expanded, setExpanded] = useState(false);
  const crop = crops.find((c) => c.id === cropId)!;
  const tips = cultivationTips[cropId];
  if (!tips) return null;

  const allTexts = useMemo(() => {
    const texts: string[] = [];
    for (const catKey of categoryOrder) {
      for (const tip of tips[catKey]) {
        texts.push(tip);
      }
    }
    return texts;
  }, [tips]);

  const translatedTexts = useBatchTranslation(allTexts, lang, expanded);

  const translatedTips = useMemo<CultivationTipCategory>(() => {
    const result = {} as CultivationTipCategory;
    let idx = 0;
    for (const catKey of categoryOrder) {
      const arr: string[] = [];
      for (let i = 0; i < tips[catKey].length; i++) {
        arr.push(translatedTexts[idx] ?? tips[catKey][i]);
        idx++;
      }
      result[catKey] = arr;
    }
    return result;
  }, [tips, translatedTexts]);

  return (
    <div className="overflow-hidden rounded-xl border border-forest-100 bg-white">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-forest-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{crop.emoji}</span>
            <h3 className="truncate text-[15px] font-semibold text-forest-900">{cropName(cropId, lang)}</h3>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-forest-400">{categoryOrder.length} {libraryLabels[lang].categories}</p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-forest-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-forest-100 px-4 py-4">
          {categoryOrder.map((catKey) => (
            <TipCategoryBlock
              key={catKey}
              label={categoryLabel(catKey, t)}
              tips={translatedTips[catKey]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CultivationTipsScreen() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');

  const cropsWithTips = useMemo(
    () => crops.filter((c) => cultivationTips[c.id]),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cropsWithTips;
    return cropsWithTips.filter((c) => cropName(c.id, lang).toLowerCase().includes(q));
  }, [cropsWithTips, query, lang]);

  return (
    <section className="screen-container animate-fade-in px-4">
      <h1 className="heading-display pt-4 text-[28px] font-bold leading-tight tracking-tight text-forest-900">
        {t.ctTitle}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-forest-500">{t.ctSubtitle}</p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-forest-100 bg-white px-3 py-2.5">
        <Search size={18} className="shrink-0 text-forest-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.ctSearch}
          className="w-full bg-transparent text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none"
        />
      </div>

      <p className="mt-3 text-[12px] text-forest-400">
        {filtered.length} {libraryLabels[lang].crops}
      </p>

      <div className="mt-3 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-forest-100 bg-forest-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-forest-600">{t.ctNoResults}</p>
          </div>
        ) : (
          filtered.map((c) => <CropTipCard key={c.id} cropId={c.id} lang={lang} t={t} />)
        )}
      </div>
    </section>
  );
}
