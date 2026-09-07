import { useEffect, useState } from 'react';
import { ChevronDown, CheckCircle2, CloudRain, RefreshCw, ShieldAlert } from 'lucide-react';
import { diseaseById } from '@/data/diseases';
import { cropById, cropName } from '@/data/crops';
import {
  evaluateDiseaseRisks,
  hasRecentRain,
  type DiseaseRiskResult,
  type RiskLevel,
} from '@/data/diseaseRiskTriggers';
import type { Language } from '@/data/i18n';
import { useLang } from '@/lib/lang';
import { getWeatherByLocation, getUserLocation } from '@/lib/weatherService';

const riskStyles: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

function RiskBadge({ level, label }: { level: RiskLevel; label: string }) {
  const s = riskStyles[level];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}
    >
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

function AlertCard({
  risk,
  lang,
  t,
}: {
  risk: DiseaseRiskResult;
  lang: Language;
  t: ReturnType<typeof useLang>['t'];
}) {
  const [expanded, setExpanded] = useState(false);
  const disease = diseaseById(risk.diseaseId);
  const crop = cropById(disease.cropId);
  const riskLabel = risk.level === 'high' ? t.paHigh : t.paModerate;
  const reason = lang === 'hi' ? risk.reasonHi : risk.reasonEn;

  return (
    <div className="overflow-hidden rounded-xl border border-forest-100 bg-white">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-forest-50/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base">{crop.emoji}</span>
            <h3 className="truncate text-[15px] font-semibold text-forest-900">{disease.name}</h3>
          </div>
          <p className="mt-0.5 text-[12px] text-forest-400">{cropName(disease.cropId, lang)}</p>
          <p className="mt-1 text-[12px] leading-5 text-forest-500">{reason}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RiskBadge level={risk.level} label={riskLabel} />
          <ChevronDown
            size={18}
            className={`text-forest-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-forest-100 px-4 py-4">
          <p className="text-sm leading-6 text-forest-600">{disease.description}</p>

          <div className="mt-4">
            <h4 className="text-[13px] font-semibold text-forest-800">
              {lang === 'hi' ? 'लक्षण' : 'Symptoms'}
            </h4>
            <BulletList items={disease.symptoms} />
          </div>

          <div className="mt-4">
            <h4 className="text-[13px] font-semibold text-forest-800">
              {lang === 'hi' ? 'उपचार' : 'Treatment'}
            </h4>
            <BulletList items={disease.treatment} />
          </div>
        </div>
      )}
    </div>
  );
}

export function PestAlertScreen() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [risks, setRisks] = useState<DiseaseRiskResult[]>([]);
  const [weatherInfo, setWeatherInfo] = useState<{ temp: number; humidity: number; location: string } | null>(null);

  async function fetchRisks() {
    setLoading(true);
    setWeatherError(false);
    try {
      const { lat, lon } = await getUserLocation();
      const result = await getWeatherByLocation(lat, lon);
      if ('error' in result) {
        setWeatherError(true);
        setRisks([]);
      } else {
        const rain = hasRecentRain(result.hourly);
        const evaluated = evaluateDiseaseRisks({
          temp: result.temp,
          humidity: result.humidity,
          hasRecentRain: rain,
        });
        setRisks(evaluated);
        setWeatherInfo({
          temp: result.temp,
          humidity: result.humidity,
          location: result.location,
        });
      }
    } catch {
      setWeatherError(true);
      setRisks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRisks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="screen-container animate-fade-in px-4">
      <h1 className="heading-display pt-4 text-[28px] font-bold leading-tight tracking-tight text-forest-900">
        {t.paTitle}
      </h1>
      <p className="mt-1.5 text-[14px] leading-6 text-forest-500">{t.paSubtitle}</p>

      {weatherInfo && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-2.5 text-[13px] text-forest-600">
          <CloudRain size={16} className="shrink-0 text-forest-400" />
          <span>
            {weatherInfo.location}: {weatherInfo.temp}°C, {weatherInfo.humidity}% humidity
          </span>
        </div>
      )}

      {loading ? (
        <div className="mt-6 flex flex-col items-center gap-3 py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-forest-200 border-t-forest-600" />
          <p className="text-sm text-forest-500">{t.paLoading}</p>
        </div>
      ) : weatherError ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-amber-800">{t.paWeatherError}</p>
          <button
            onClick={fetchRisks}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <RefreshCw size={14} /> {t.paRetry}
          </button>
        </div>
      ) : risks.length === 0 ? (
        <div className="mt-6 rounded-xl border border-success-200 bg-success-50 px-4 py-8 text-center">
          <CheckCircle2 size={32} className="mx-auto text-success-500" />
          <p className="mt-3 text-sm font-medium text-success-700">{t.paNoRisk}</p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-[12px] text-forest-400">
            {risks.length} {lang === 'hi' ? 'अलर्ट' : 'alerts'}
          </p>
          <div className="mt-3 space-y-3">
            {risks.map((r) => (
              <AlertCard key={r.diseaseId} risk={r} lang={lang} t={t} />
            ))}
          </div>
        </>
      )}

      {!loading && !weatherError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl bg-forest-50 px-3 py-3 text-[12px] leading-5 text-forest-500">
          <ShieldAlert size={14} className="mt-0.5 shrink-0 text-forest-400" />
          <p>{t.paDisclaimer}</p>
        </div>
      )}

      <div className="pb-6" />
    </section>
  );
}
