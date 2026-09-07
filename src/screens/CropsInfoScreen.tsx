import { useMemo, useState } from 'react';
import { ChevronDown, Search, Sprout } from 'lucide-react';
import { crops, cropName } from '@/data/crops';
import { cropInfo } from '@/data/cropInfo';
import { useLang } from '@/lib/lang';
import { useBatchTranslation } from '@/lib/useBatchTranslation';
import { libraryLabels } from '@/data/libraryLabels';

function displayLabel(key: string, lang: ReturnType<typeof useLang>['lang']): { emoji: string; name: string } {
  const crop = crops.find((c) => c.id === key);
  if (crop) {
    return { emoji: crop.emoji, name: cropName(crop.id, lang) };
  }
  const pretty = key.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  return { emoji: '🌱', name: pretty };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <h4 className="text-[13px] font-semibold text-forest-800">{label}</h4>
      <p className="mt-1 text-sm leading-6 text-forest-600">{value}</p>
    </div>
  );
}

function CropCard({ cropKey, lang }: { cropKey: string; lang: ReturnType<typeof useLang>['lang'] }) {
  const [expanded, setExpanded] = useState(false);
  const info = cropInfo[cropKey];
  const { emoji, name } = displayLabel(cropKey, lang);

  const texts = useMemo(() => [info.season, info.water, info.soil, info.tip], [info]);
  const translated = useBatchTranslation(texts, lang, expanded);
  const labels = libraryLabels[lang];

  return (
    <div className="overflow-hidden rounded-xl border border-forest-100 bg-white">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-forest-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{emoji}</span>
            <h3 className="truncate text-[15px] font-semibold text-forest-900">{name}</h3>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-forest-400">{translated[0]}</p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-forest-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-forest-100 px-4 py-4">
          <DetailRow label={labels.season} value={translated[0]} />
          <DetailRow label={labels.waterNeeds} value={translated[1]} />
          <DetailRow label={labels.soil} value={translated[2]} />
          <div className="mt-4 rounded-lg bg-forest-50 px-3 py-2.5">
            <div className="flex items-start gap-2">
              <Sprout size={16} className="mt-0.5 shrink-0 text-forest-600" />
              <div>
                <h4 className="text-[13px] font-semibold text-forest-800">
                  {labels.practicalTip}
                </h4>
                <p className="mt-1 text-sm leading-6 text-forest-600">{translated[3]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CropsInfoScreen() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');

  const allKeys = useMemo(() => Object.keys(cropInfo), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allKeys;
    return allKeys.filter((key) => displayLabel(key, lang).name.toLowerCase().includes(q));
  }, [allKeys, query, lang]);

  return (
    <section className="screen-container animate-fade-in px-4">
      <h1 className="heading-display pt-4 text-[28px] font-bold leading-tight tracking-tight text-forest-900">
        {t.ciTitle}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-forest-500">{t.ciSubtitle}</p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-forest-100 bg-white px-3 py-2.5">
        <Search size={18} className="shrink-0 text-forest-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.ciSearch}
          className="w-full bg-transparent text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none"
        />
      </div>

      <p className="mt-3 text-[12px] text-forest-400">
        {filtered.length} {libraryLabels[lang].crops}
      </p>

      <div className="mt-3 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-forest-100 bg-forest-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-forest-600">{t.ciNoResults}</p>
          </div>
        ) : (
          filtered.map((key) => <CropCard key={key} cropKey={key} lang={lang} />)
        )}
      </div>
    </section>
  );
}
