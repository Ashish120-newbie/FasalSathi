import { ArrowLeft, Check, ClipboardCheck, MessageSquare, Sprout, X } from 'lucide-react';
import { useState } from 'react';
import { cropName } from '@/data/crops';
import type { ScanRecord } from '@/data/types';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { LeafImage } from '@/components/LeafImage';
import { useLang } from '@/lib/lang';

interface QueueScreenProps { scans: ScanRecord[]; onBack: () => void; onUpdate: (scan: ScanRecord) => void; }

export function QueueScreen({ scans, onBack, onUpdate }: QueueScreenProps) {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<ScanRecord | null>(null);
  const pending = scans.filter((scan) => scan.escalated && scan.officerReview?.status === 'pending');

  function update(status: 'approved' | 'corrected') {
    if (!selected) return;
    onUpdate({
      ...selected,
      officerReview: {
        status,
        officerName: 'Dr. Meera Nair',
        reviewedAt: Date.now(),
        correctedDiagnosis: status === 'corrected' ? 'Nutrient deficiency — needs field visit' : selected.result.diseaseName,
        note: status === 'corrected' ? 'Please collect a soil sample and check the lower leaves.' : 'AI suggestion confirmed after review.',
      },
    });
    setSelected(null);
  }

  return (
    <section className="screen-container animate-fade-in px-4">
      <button onClick={onBack} className="mb-4 mt-3 flex items-center gap-2 text-sm font-bold text-forest-600 hover:text-forest-700 transition-colors">
        <ArrowLeft size={18} /> {t.queueBack}
      </button>

      <div className="mb-6">
        <p className="text-sm font-medium text-forest-500">{t.queueOfficerView}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-900">{t.queueTitle}</h1>
        <p className="mt-1.5 text-sm leading-6 text-forest-500">{t.queueSubtitle}</p>
      </div>

      <div className="mb-6 flex items-baseline gap-3 border-b border-forest-100 pb-4">
        <ClipboardCheck size={20} className="text-amber-600" />
        <div>
          <p className="text-2xl font-bold text-amber-950">{pending.length}</p>
          <p className="text-xs font-medium text-amber-800">{t.queueCasesWaiting}</p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="py-12 text-center">
          <Sprout className="mx-auto text-success-500" size={36} />
          <p className="mt-4 font-semibold text-forest-800">{t.queueClear}</p>
          <p className="mt-1 text-sm text-forest-500">{t.queueClearDesc}</p>
        </div>
      ) : (
        <div className="divide-y divide-forest-100">
          {pending.map((scan) => (
            <article key={scan.id} className="py-4">
              <div className="flex gap-3">
                <div className="w-20 shrink-0"><LeafImage src={scan.imageDataUrl || undefined} compact /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-forest-500">{cropName(scan.cropId, lang)} · {new Date(scan.createdAt).toLocaleDateString('en-IN')}</p>
                  <h2 className="mt-1 text-base font-bold text-forest-900">{t.queueAIGuess}: {scan.result.diseaseName}</h2>
                  <div className="mt-2"><ConfidenceBadge level={scan.result.level} confidence={scan.result.confidence} /></div>
                </div>
              </div>
              <button onClick={() => setSelected(scan)} className="btn-secondary mt-3 flex w-full items-center justify-center gap-2">
                <MessageSquare size={17} /> {t.queueReviewCase}
              </button>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-forest-950/40 sm:items-center sm:justify-center" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-5 sm:rounded-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-forest-400">{t.queueCaseReview}</p>
                <h2 className="text-xl font-extrabold text-forest-900">{cropName(selected.cropId, lang)} {t.queueScan}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-forest-500 hover:bg-forest-50 transition-colors" aria-label="Close">
                <X size={21} />
              </button>
            </div>
            <div className="mt-4"><LeafImage src={selected.imageDataUrl || undefined} region={selected.result.affectedRegion} affectedArea={selected.result.affectedArea} /></div>
            <div className="mt-4 rounded-lg bg-forest-50 px-4 py-3">
              <p className="section-label">{t.queueAIBestGuess}</p>
              <p className="mt-1 text-lg font-bold text-forest-900">{selected.result.diseaseName}</p>
              <p className="mt-0.5 text-sm text-forest-600">{selected.result.confidence}% {t.queueConfidenceVerify}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => update('corrected')} className="flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100 transition-colors">
                <X size={16} /> {t.queueCorrect}
              </button>
              <button onClick={() => update('approved')} className="flex items-center justify-center gap-2 rounded-lg bg-forest-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-forest-700 transition-colors">
                <Check size={16} /> {t.queueApprove}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
