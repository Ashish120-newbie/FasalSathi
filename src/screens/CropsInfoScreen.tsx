import { useMemo, useState } from 'react';
import { ChevronDown, Search, Sprout } from 'lucide-react';
import { crops, cropName } from '@/data/crops';
import { cropInfo } from '@/data/cropInfo';
import type { CropId } from '@/data/types';
import { useLang } from '@/lib/lang';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <h4 className="text-[13px] font-semibold text-forest-800">{label}</h4>
      <p className="mt-1 text-sm leading-6 text-forest-600">{value}</p>
    </div>
  );
}

function CropCard({ cropId }: { cropId: CropId }) {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const crop = crops.find((c) => c.id === cropId)!;
  const info = cropInfo[cropId];

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
          <p className="mt-0.5 truncate text-[12px] text-forest-400">{info.season}</p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-forest-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-forest-100 px-4 py-4">
          <DetailRow label={lang === 'hi' ? 'मौसम' : 'Season'} value={info.season} />
          <DetailRow label={lang === 'hi' ? 'जल आवश्यकता' : 'Water needs'} value={info.water} />
          <DetailRow label={lang === 'hi' ? 'मिट्टी' : 'Soil'} value={info.soil} />
          <div className="mt-4 rounded-lg bg-forest-50 px-3 py-2.5">
            <div className="flex items-start gap-2">
              <Sprout size={16} className="mt-0.5 shrink-0 text-forest-600" />
              <div>
                <h4 className="text-[13px] font-semibold text-forest-800">
                  {lang === 'hi' ? 'व्यावहारिक सुझाव' : 'Practical tip'}
                </h4>
                <p className="mt-1 text-sm leading-6 text-forest-600">{info.tip}</p>
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return crops;
    return crops.filter((c) => cropName(c.id, lang).toLowerCase().includes(q));
  }, [query, lang]);

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
        {filtered.length} {lang === 'hi' ? 'फसलें' : 'crops'}
      </p>

      <div className="mt-3 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-forest-100 bg-forest-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-forest-600">{t.ciNoResults}</p>
          </div>
        ) : (
          filtered.map((c) => <CropCard key={c.id} cropId={c.id} />)
        )}
      </div>
    </section>
  );
}
