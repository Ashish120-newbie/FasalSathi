import { ArrowLeft, CheckCircle2, ChevronRight, Info, MessageCircle, PhoneCall, ShieldAlert, WifiOff } from 'lucide-react';
import { cropById, cropName } from '@/data/crops';
import { diseaseById } from '@/data/diseases';
import type { ScanRecord } from '@/data/types';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { LeafImage } from '@/components/LeafImage';
import { useLang } from '@/lib/lang';

interface DiagnosisScreenProps { scan: ScanRecord; onBack: () => void; onEscalate: () => void; onAskAI: () => void; }

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((step, index) => (
        <li key={index} className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400" />
          <p className="text-sm leading-6 text-forest-800">{step}</p>
        </li>
      ))}
    </ul>
  );
}

export function DiagnosisScreen({ scan, onBack, onEscalate, onAskAI }: DiagnosisScreenProps) {
  const { t, lang } = useLang();
  const disease = diseaseById(scan.result.diseaseId);
  const crop = cropById(scan.cropId);
  const lowConfidence = scan.result.level === 'low';
  const isOffline = scan.result.source === 'offline';
  const isHealthy = scan.result.diseaseName.toLowerCase() === 'healthy';
  const displayCropName = scan.result.detectedCropName || cropName(scan.cropId, lang);

  const hasAIData = Boolean(scan.result.preventionSteps?.length || scan.result.treatmentSteps?.length);
  const preventionSteps = scan.result.preventionSteps ?? (hasAIData ? [] : disease.treatment);
  const treatmentSteps = scan.result.treatmentSteps ?? [];
  const aboutDescription = scan.result.description || (!hasAIData ? disease.description : '');

  return (
    <section className="screen-container animate-slide-up px-4">
      <button onClick={onBack} className="mt-4 flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-700 transition-colors">
        <ArrowLeft size={17} /> {t.diagNewScan}
      </button>

      <div className="mt-6">
        <p className="text-[13px] font-medium text-forest-400">{crop.emoji} {displayCropName} {t.diagCropCheck}</p>
        <h1 className="heading-display mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{lowConfidence ? t.diagGetExpertOpinion : t.diagCropHealthReport}</h1>
      </div>

      {lowConfidence ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <ShieldAlert size={20} className="shrink-0 text-amber-700" />
            <div>
              <h2 className="text-base font-bold text-amber-950">{t.diagUncertain}</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900/80">{t.diagUncertainDesc}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-amber-900">
            <PhoneCall size={16} /> {t.diagNotified}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <LeafImage src={scan.imageDataUrl || undefined} region={scan.result.affectedRegion} affectedArea={scan.result.affectedArea} />
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="section-label">{t.diagLikelyIssue}</p>
                <h2 className="mt-1 text-xl font-bold text-forest-900">{scan.result.diseaseName}</h2>
              </div>
              <ConfidenceBadge level={scan.result.level} confidence={scan.result.confidence} />
            </div>
          </div>

          {isOffline && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <WifiOff size={17} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{t.diagOfflineMode}</p>
                <p className="mt-0.5 text-xs leading-5">{t.diagOfflineDesc}</p>
              </div>
            </div>
          )}

          {aboutDescription && (
            <div className="mt-6">
              <h2 className="text-[20px] font-semibold text-forest-900">{t.diagAboutIssue}</h2>
              <p className="mt-2 text-sm leading-6 text-forest-600">{aboutDescription}</p>
            </div>
          )}

          <div className="my-8 border-t border-forest-100" />

          <div>
            <h2 className="text-[20px] font-semibold text-forest-900">{isHealthy ? 'Crop Health' : t.diagWhatYouCanDo}</h2>
            <p className="mt-0.5 text-[13px] text-forest-400">{isHealthy ? 'Great news from your scan' : t.diagSimpleSteps}</p>

            {isHealthy ? (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success-600" />
                <p className="text-sm leading-6 text-forest-700">{scan.result.recommendation}</p>
              </div>
            ) : (
              <>
                {preventionSteps.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-[15px] font-semibold text-forest-800">{t.diagPrevention}</h3>
                    <p className="text-[12px] text-forest-400">{t.diagPreventionDesc}</p>
                    <BulletList items={preventionSteps} />
                  </div>
                )}

                <div className="mt-5">
                  <h3 className="text-[15px] font-semibold text-forest-800">{t.diagTreatment}</h3>
                  <p className="text-[12px] text-forest-400">{t.diagTreatmentDesc}</p>
                  {treatmentSteps.length > 0 ? (
                    <BulletList items={treatmentSteps} />
                  ) : (
                    <p className="mt-2 rounded-lg bg-forest-50 px-3 py-2.5 text-sm leading-6 text-forest-700">{t.diagTreatmentFallback}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <button onClick={onAskAI} className="mt-6 flex w-full items-center justify-between rounded-lg bg-forest-600 px-4 py-2.5 text-left font-semibold text-white hover:bg-forest-700 transition-colors">
            <span className="flex items-center gap-2"><MessageCircle size={18} /> {t.diagAskAIAbout}</span>
            <ChevronRight size={17} />
          </button>

          <div className="mt-4 flex gap-2 rounded-lg border border-forest-100 bg-forest-50 px-3 py-2.5 text-xs leading-5 text-forest-600">
            <Info size={15} className="mt-0.5 shrink-0 text-forest-400" />
            <p>{t.diagAIDisclaimer}</p>
          </div>
        </>
      )}

      {lowConfidence && (
        <button onClick={onAskAI} className="mt-6 flex w-full items-center justify-between rounded-lg bg-forest-600 px-4 py-2.5 text-left font-semibold text-white hover:bg-forest-700 transition-colors">
          <span className="flex items-center gap-2"><MessageCircle size={18} /> {t.diagAskAI}</span>
          <ChevronRight size={17} />
        </button>
      )}

      {!lowConfidence && (
        <button onClick={onEscalate} className="mt-4 flex w-full items-center justify-between rounded-lg border border-forest-200 bg-white px-4 py-2.5 text-left font-semibold text-forest-700 hover:bg-forest-50 transition-colors">
          <span className="flex items-center gap-2"><ShieldAlert size={18} /> {t.diagEscalate}</span>
          <ChevronRight size={17} />
        </button>
      )}

      {lowConfidence && (
        <button onClick={onBack} className="btn-primary mt-4 flex w-full items-center justify-center gap-2">
          <CheckCircle2 size={18} /> {t.diagStartAnother}
        </button>
      )}
    </section>
  );
}
