import { Camera, Check, ChevronRight, ImagePlus, Info, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { classifyCropImage } from '@/data/classifier';
import { cropById, cropName, crops, growthStages, stageLabel } from '@/data/crops';
import type { CropId, GrowthStage, ScanRecord } from '@/data/types';
import { addScan } from '@/data/storage';
import { useLang } from '@/lib/lang';
import { supabase } from '@/lib/supabase';

interface ScanScreenProps { onResult: (scan: ScanRecord) => void; }

function compressImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height / width) * maxDim);
            width = maxDim;
          } else {
            width = Math.round((width / height) * maxDim);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('no ctx')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
    compressImage(file, 1024).then(setImageDataUrl).catch(() => {
      const reader = new FileReader();
      reader.onload = () => setImageDataUrl(typeof reader.result === 'string' ? reader.result : '');
      reader.readAsDataURL(file);
    });
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
        const friendlyMessage = ERROR_CODE_TO_KEY[err.code]
          ? t[ERROR_CODE_TO_KEY[err.code] as keyof typeof t]
          : err.message;
        const rawDetails = err.debug ? `\nRaw error: ${JSON.stringify(err.debug)}` : '';
        setError(`${friendlyMessage}${rawDetails}`);
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

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-6">
        <p className="text-sm font-medium text-forest-500">{t.scanGreeting}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-900">{t.scanTitle}</h1>
        <p className="mt-1.5 max-w-md text-sm leading-6 text-forest-500">{t.scanSubtitle}</p>
      </div>

      <div className="mt-8">
        <p className="section-label">{t.scanQuickDiagnosis}</p>
        <h2 className="mt-1 text-lg font-bold text-forest-900">{t.scanScanALeaf}</h2>
        <p className="mt-0.5 text-sm leading-5 text-forest-500">{t.scanClearPhotos}</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-base font-semibold text-amber-950 hover:bg-amber-500 transition-colors"
        >
          <Camera size={19} /> {imageDataUrl ? t.scanChangePhoto : t.scanTakePhoto}
        </button>
        <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
      </div>

      {fileName && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-success-200 bg-success-50 px-3 py-2.5 text-sm text-success-800">
          <Check size={16} className="shrink-0" />
          <div className="min-w-0">
            <p className="font-bold">{t.scanPhotoReady}</p>
            <p className="truncate text-xs">{fileName}</p>
          </div>
        </div>
      )}

      {notACrop && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="font-medium leading-6">{t.scanNotACrop}</p>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-3 text-sm text-error-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">{t.scanDiagnosisFailed}</p>
            <p className="mt-0.5 text-xs leading-5">{error}</p>
          </div>
        </div>
      )}

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-lg font-bold text-forest-900">{t.scanTellAboutCrop}</h2>
        <p className="mt-0.5 text-sm text-forest-500">{t.scanThisHelpsImprove}</p>

        <label className="mt-5 mb-2 block text-sm font-semibold text-forest-800">{t.scanCropType}</label>
        <div className="scrollbar-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setCropId(crop.id)}
              className={`flex min-w-[72px] flex-col items-center gap-1 rounded-lg border px-2.5 py-2 transition-colors ${cropId === crop.id ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-100 bg-white text-forest-500 hover:border-forest-200 hover:bg-forest-50'}`}
            >
              <span className="text-xl leading-none">{crop.emoji}</span>
              <span className="text-xs font-medium">{cropName(crop.id, lang)}</span>
            </button>
          ))}
        </div>

        <label className="mt-5 mb-2 block text-sm font-semibold text-forest-800">{t.scanGrowthStage}</label>
        <select value={growthStage} onChange={(event) => setGrowthStage(event.target.value as GrowthStage)} className="select-field">
          {growthStages.map((stage) => <option key={stage.id} value={stage.id}>{stageLabel(stage.id, lang)}</option>)}
        </select>
      </div>

      <button
        onClick={handleScan}
        disabled={scanning || !imageDataUrl}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-forest-700 disabled:cursor-wait disabled:opacity-60 transition-colors"
      >
        {scanning
          ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {t.scanAnalysingLong}</>
          : <><ImagePlus size={19} /> {t.scanAnalyseThis} <ChevronRight size={17} /></>}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-forest-400">
        <Info size={13} /> {t.scanPhotoStays}
      </p>
    </section>
  );
}
