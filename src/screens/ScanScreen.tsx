import { Camera, Check, ChevronRight, ImagePlus, Info, Sprout, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { classifyCropImage } from '@/data/classifier';
import { cropById, cropName, crops, growthStages, stageLabel } from '@/data/crops';
import type { CropId, GrowthStage, ScanRecord } from '@/data/types';
import { addScan } from '@/data/storage';
import { useLang } from '@/lib/lang';
import { supabase } from '@/lib/supabase';

interface ScanScreenProps { onResult: (scan: ScanRecord) => void; }

const ERROR_CODE_TO_KEY: Record<string, string> = {
  NETWORK_ERROR: 'scanErrNetwork',
  API_KEY_MISSING: 'scanErrApiKeyMissing',
  GEMINI_FETCH_FAILED: 'scanErrGeminiFetch',
  GEMINI_API_ERROR: 'scanErrGeminiApi',
  PARSE_ERROR: 'scanErrParse',
  INTERNAL_ERROR: 'scanErrInternal',
  SERVICE_UNAVAILABLE: 'scanErrServiceUnavailable',
  INVALID_IMAGE: 'scanErrInvalidImage',
  NOT_A_PLANT: 'scanNotACrop',
};

export function ScanScreen({ onResult }: ScanScreenProps) {
  const { t, lang } = useLang();
  const [cropId, setCropId] = useState<CropId>('wheat');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('vegetative');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [notACrop, setNotACrop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setError('');
    setNotACrop(false);
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  }

  async function saveSubmission(params: {
    isCrop: boolean;
    diagnosis?: string;
    confidence?: number;
    affectedArea?: string;
    recommendation?: string;
    status: string;
  }) {
    try {
      await supabase.from('submissions').insert({
        image_data: imageDataUrl,
        crop_type: cropById(cropId).name,
        growth_stage: growthStage,
        is_crop: params.isCrop,
        diagnosis: params.diagnosis ?? null,
        confidence: params.confidence ?? null,
        affected_area: params.affectedArea ?? null,
        recommendation: params.recommendation ?? null,
        language: lang,
        status: params.status,
      });
    } catch (err) {
      console.error('Failed to save submission to database:', err);
    }
  }

  async function handleScan() {
    if (!imageDataUrl) return;
    setScanning(true);
    setError('');
    setNotACrop(false);
    try {
      const outcome = await classifyCropImage(cropId, growthStage, imageDataUrl, lang);

      if (outcome.error) {
        const err = outcome.error;
        if (ERROR_CODE_TO_KEY[err.code]) {
          setError(t[ERROR_CODE_TO_KEY[err.code] as keyof typeof t]);
        } else {
          setError(err.message);
        }
        return;
      }

      if (outcome.notACrop) {
        setNotACrop(true);
        await saveSubmission({ isCrop: false, status: 'rejected' });
        return;
      }

      if (outcome.result) {
        const result = outcome.result;
        const scan: ScanRecord = {
          id: `scan-${Date.now()}`,
          imageDataUrl,
          cropId,
          growthStage,
          result,
          createdAt: Date.now(),
          escalated: result.level === 'low',
          officerReview: result.level === 'low' ? { status: 'pending', officerName: 'Awaiting review' } : undefined,
        };
        addScan(scan);
        await saveSubmission({
          isCrop: true,
          diagnosis: result.diseaseName,
          confidence: result.confidence,
          affectedArea: result.affectedArea,
          recommendation: result.recommendation,
          status: 'valid',
        });
        onResult(scan);
      }
    } catch {
      setError(t.scanErrInternal);
    } finally {
      setScanning(false);
    }
  }

  return <section className="screen-container animate-fade-in px-4">
    <div className="mb-6 pt-4"><p className="text-sm font-semibold text-forest-500">{t.scanGreeting}</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-forest-900">{t.scanTitle}</h1><p className="mt-2 max-w-md text-sm leading-6 text-forest-600">{t.scanSubtitle}</p></div>
    <div className="mb-5 rounded-2xl border border-forest-200 bg-forest-700 p-5 text-white shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-moss-200">{t.scanQuickDiagnosis}</p><h2 className="mt-2 font-display text-2xl font-extrabold">{t.scanScanALeaf}</h2><p className="mt-1 text-sm leading-5 text-forest-100">{t.scanClearPhotos}</p></div><div className="rounded-2xl bg-white/10 p-3"><Sprout size={30} className="text-amber-300" /></div></div><button onClick={() => inputRef.current?.click()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 font-bold text-amber-950 hover:bg-amber-300 active:scale-[0.99]"><Camera size={20} /> {imageDataUrl ? t.scanChangePhoto : t.scanTakePhoto}</button><input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} /></div>
    {fileName && <div className="mb-5 flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 p-3 text-sm text-success-800"><div className="rounded-lg bg-success-100 p-2"><Check size={18} /></div><div className="min-w-0"><p className="font-bold">{t.scanPhotoReady}</p><p className="truncate text-xs">{fileName}</p></div></div>}
    {notACrop && <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="rounded-lg bg-amber-100 p-2"><AlertCircle size={20} /></div><p className="font-semibold leading-6">{t.scanNotACrop}</p></div>}
    {error && <div className="mb-5 flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 p-3 text-sm text-error-800"><div className="rounded-lg bg-error-100 p-2"><AlertCircle size={18} /></div><div><p className="font-bold">{t.scanDiagnosisFailed}</p><p className="mt-0.5 text-xs leading-5">{error}</p></div></div>}
    <div className="card mb-5"><div className="mb-4 flex items-center gap-2"><div className="rounded-lg bg-moss-100 p-2 text-forest-700"><Info size={18} /></div><div><h2 className="font-display text-lg font-extrabold text-forest-900">{t.scanTellAboutCrop}</h2><p className="text-xs text-forest-500">{t.scanThisHelpsImprove}</p></div></div><label className="mb-2 block text-sm font-bold text-forest-800">{t.scanCropType}</label><div className="scrollbar-hide -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1">{crops.map((crop) => <button key={crop.id} onClick={() => setCropId(crop.id)} className={`flex min-w-[88px] flex-col items-center gap-1 rounded-xl border px-3 py-2.5 ${cropId === crop.id ? 'border-forest-500 bg-forest-100 text-forest-800' : 'border-forest-100 bg-white text-forest-500'}`}><span className="text-2xl">{crop.emoji}</span><span className="text-xs font-bold">{cropName(crop.id, lang)}</span></button>)}</div><label className="mb-2 block text-sm font-bold text-forest-800">{t.scanGrowthStage}</label><select value={growthStage} onChange={(event) => setGrowthStage(event.target.value as GrowthStage)} className="select-field">{growthStages.map((stage) => <option key={stage.id} value={stage.id}>{stageLabel(stage.id, lang)}</option>)}</select></div>
    <button onClick={handleScan} disabled={scanning || !imageDataUrl} className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70">{scanning ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {t.scanAnalysing}</> : <><ImagePlus size={20} /> {t.scanAnalyseThis} <ChevronRight size={18} /></>}</button>
    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-forest-500"><Info size={14} /> {t.scanPhotoStays}</p>
  </section>;
}
