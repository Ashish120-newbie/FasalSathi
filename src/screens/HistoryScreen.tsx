import { CalendarDays, ChevronRight, ClipboardList, ShieldAlert } from 'lucide-react';
import { cropName, stageLabel } from '@/data/crops';
import type { ScanRecord } from '@/data/types';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { LeafImage } from '@/components/LeafImage';
import { useLang } from '@/lib/lang';

interface HistoryScreenProps { scans: ScanRecord[]; onOpen: (scan: ScanRecord) => void; }

export function HistoryScreen({ scans, onOpen }: HistoryScreenProps) {
  const { t, lang } = useLang();
  const localeMap: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN', ta: 'ta-IN' };
  const locale = localeMap[lang] || 'en-IN';

  return <section className="screen-container animate-fade-in px-4"><div className="mb-6 pt-4"><p className="text-sm font-semibold text-forest-500">{t.histSavedActivity}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-forest-900">{t.histTitle}</h1><p className="mt-2 text-sm leading-6 text-forest-600">{t.histSubtitle}</p></div>{scans.length === 0 ? <div className="card py-12 text-center"><ClipboardList className="mx-auto text-forest-300" size={40} /><p className="mt-4 font-bold text-forest-800">{t.histNoScans}</p><p className="mt-1 text-sm text-forest-500">{t.histNoScansDesc}</p></div> : <div className="space-y-3">{scans.map((scan) => <button key={scan.id} onClick={() => onOpen(scan)} className="card flex w-full items-center gap-3 text-left hover:border-forest-300 hover:shadow-md"><div className="w-20 shrink-0">{scan.imageDataUrl ? <LeafImage src={scan.imageDataUrl} compact /> : <LeafImage compact />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 text-xs font-semibold text-forest-500"><CalendarDays size={13} /> {new Date(scan.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}</div><h2 className="mt-1 truncate font-display text-lg font-extrabold text-forest-900">{cropName(scan.cropId, lang)} · {scan.result.diseaseName}</h2><p className="mt-1 text-xs text-forest-500">{stageLabel(scan.growthStage, lang)}</p><div className="mt-2 flex flex-wrap gap-1.5"><ConfidenceBadge level={scan.result.level} confidence={scan.result.confidence} />{scan.escalated && <span className="chip bg-amber-50 px-2 py-1 text-xs text-amber-800"><ShieldAlert size={13} /> {t.histSentToOfficer}</span>}</div></div><ChevronRight className="shrink-0 text-forest-400" size={19} /></button>)}</div>}</section>;
}
