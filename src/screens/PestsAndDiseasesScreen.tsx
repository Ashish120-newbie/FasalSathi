import { useMemo, useState } from 'react';
import { ChevronDown, Leaf, Search } from 'lucide-react';
import { diseases } from '@/data/diseases';
import { crops, cropById, cropName } from '@/data/crops';
import type { CropId, Disease } from '@/data/types';
import type { Language } from '@/data/i18n';
import { useLang } from '@/lib/lang';
import { useBatchTranslation } from '@/lib/useBatchTranslation';
import { libraryLabels } from '@/data/libraryLabels';

const severityStyles: Record<Disease['severity'], { bg: string; text: string; border: string }> = {
  mild: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  severe: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

function SeverityBadge({ severity, label }: { severity: Disease['severity']; label: string }) {
  const s = severityStyles[severity];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
      {label}
    </span>
  );
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

function DiseaseCard({ disease, lang }: { disease: Disease; lang: Language }) {
  const [expanded, setExpanded] = useState(false);
  const crop = cropById(disease.cropId);
  const labels = libraryLabels[lang];

  const severityLabel =
    disease.severity === 'mild' ? labels.mild :
    disease.severity === 'moderate' ? labels.moderate :
    labels.severe;

  const texts = useMemo(
    () => [disease.name, disease.description, ...disease.symptoms, ...disease.treatment],
    [disease],
  );
  const translated = useBatchTranslation(texts, lang, expanded);

  const translatedName = translated[0] ?? disease.name;
  const translatedDesc = translated[1] ?? disease.description;
  const translatedSymptoms = disease.symptoms.map((_, i) => translated[2 + i] ?? disease.symptoms[i]);
  const translatedTreatment = disease.treatment.map((_, i) => translated[2 + disease.symptoms.length + i] ?? disease.treatment[i]);

  return (
    <div className="overflow-hidden rounded-xl border border-forest-100 bg-white">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-forest-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{crop.emoji}</span>
            <h3 className="truncate text-[15px] font-semibold text-forest-900">{translatedName}</h3>
          </div>
          <p className="mt-0.5 text-[12px] text-forest-400">{cropName(disease.cropId, lang)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SeverityBadge severity={disease.severity} label={severityLabel} />
          <ChevronDown
            size={18}
            className={`text-forest-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-forest-100 px-4 py-4">
          <p className="text-sm leading-6 text-forest-600">{translatedDesc}</p>

          <div className="mt-4">
            <h4 className="text-[13px] font-semibold text-forest-800">
              {labels.symptoms}
            </h4>
            <BulletList items={translatedSymptoms} />
          </div>

          <div className="mt-4">
            <h4 className="text-[13px] font-semibold text-forest-800">
              {labels.treatment}
            </h4>
            <BulletList items={translatedTreatment} />
          </div>
        </div>
      )}
    </div>
  );
}

export function PestsAndDiseasesScreen() {
  const { t, lang } = useLang();
  const [selectedCrop, setSelectedCrop] = useState<CropId | 'all'>('all');
  const [query, setQuery] = useState('');

  const cropsWithDiseases = useMemo(
    () => crops.filter((c) => diseases.some((d) => d.cropId === c.id)),
    []
  );

  const filtered = useMemo(() => {
    let list = diseases;
    if (selectedCrop !== 'all') {
      list = list.filter((d) => d.cropId === selectedCrop);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCrop, query]);

  return (
    <section className="screen-container animate-fade-in px-4">
      <h1 className="heading-display pt-4 text-[28px] font-bold leading-tight tracking-tight text-forest-900">
        {t.padTitle}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-forest-500">{t.padSubtitle}</p>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-forest-100 bg-white px-3 py-2.5">
        <Search size={18} className="shrink-0 text-forest-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.padSearch}
          className="w-full bg-transparent text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCrop('all')}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            selectedCrop === 'all'
              ? 'border-forest-600 bg-forest-600 text-white'
              : 'border-forest-200 bg-white text-forest-600 hover:bg-forest-50'
          }`}
        >
          <span className="flex items-center gap-1.5"><Leaf size={14} /> {libraryLabels[lang].allCrops}</span>
        </button>
        {cropsWithDiseases.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              selectedCrop === c.id
                ? 'border-forest-600 bg-forest-600 text-white'
                : 'border-forest-200 bg-white text-forest-600 hover:bg-forest-50'
            }`}
          >
            <span className="flex items-center gap-1.5">{c.emoji} {cropName(c.id, lang)}</span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-[12px] text-forest-400">
        {filtered.length} {libraryLabels[lang].entries}
      </p>

      <div className="mt-3 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-forest-100 bg-forest-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-forest-600">{t.padNoResults}</p>
          </div>
        ) : (
          filtered.map((d) => <DiseaseCard key={d.id} disease={d} lang={lang} />)
        )}
      </div>
    </section>
  );
}
