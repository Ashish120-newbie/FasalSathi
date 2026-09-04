import { Camera, Check, ChevronRight, ImagePlus, Info, AlertCircle, Cloud, CloudRain, Sun, Store, BookOpen, Calculator, Bug, Wallet, Sprout, BookMarked, ShieldAlert, Phone, PhoneCall, Users, Wheat, Clock } from 'lucide-react';
import { useRef, useState } from 'react';
import { classifyCropImage } from '@/data/classifier';
import type { CropId, GrowthStage, ScanRecord } from '@/data/types';
import { addScan } from '@/data/storage';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useHomeLang } from '@/data/i18n-home';
import type { View } from '@/components/AppShell';

interface HomeScreenProps {
  onResult: (scan: ScanRecord) => void;
  onNavigate: (view: View) => void;
}

function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${part}, ${name}` : `${part}, farmer`;
}

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

const dummyForecast = [
  { day: 'Today', icon: Sun, temp: '29°C', condition: 'Sunny' },
  { day: 'Tomorrow', icon: Cloud, temp: '27°C', condition: 'Cloudy' },
  { day: 'Wed', icon: CloudRain, temp: '24°C', condition: 'Light rain expected' },
];

export function HomeScreen({ onResult, onNavigate }: HomeScreenProps) {
  const { t, lang } = useLang();
  const ht = useHomeLang();
  const { profile } = useAuth();
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
        crop_type: 'auto-detect',
        growth_stage: 'vegetative' as GrowthStage,
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
      const cropId: CropId = 'wheat';
      const growthStage: GrowthStage = 'vegetative';
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

  const tools = [
    { icon: Calculator, label: ht.homeFertilizerCalc, view: 'calculator' as View, isNew: false },
    { icon: Bug, label: ht.homePesticideCalc, view: 'pesticide-calc' as View, isNew: true },
    { icon: Wallet, label: ht.homeCostCalc, view: 'cost-calc' as View, isNew: true },
  ];

  const library = [
    { icon: Sprout, label: ht.homeCrops, view: 'crops' as View },
    { icon: BookMarked, label: ht.homeCultivationTips, view: 'cultivation-tips' as View },
    { icon: Bug, label: ht.homePestsDiseases, view: 'pests-diseases' as View },
    { icon: ShieldAlert, label: ht.homePestsDiseaseAlert, view: 'pests-disease-alert' as View },
  ];

  const helplineTopics = [
    { icon: Sprout, label: t.helpCropDiseases },
    { icon: Wheat, label: t.helpFertilizer },
    { icon: Clock, label: t.helpWeather },
    { icon: Users, label: t.helpAnimal },
  ];

  return (
    <section className="screen-container animate-fade-in px-4">
      {/* Greeting + Scan */}
      <div className="pt-8">
        <p className="text-[13px] font-medium text-forest-400">{getGreeting(profile?.display_name)}</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{t.scanTitle}</h1>
        <p className="mt-2 max-w-md text-[14px] leading-6 text-forest-400">{t.scanSubtitle}</p>
      </div>

      <div className="mt-8">
        <p className="section-label">{t.scanQuickDiagnosis}</p>
        <h2 className="mt-1 text-[20px] font-semibold text-forest-900">{t.scanScanALeaf}</h2>
        <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.scanClearPhotos}</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-amber-400 px-5 py-2.5 text-[15px] font-semibold text-amber-950 hover:bg-amber-500 transition-colors"
        >
          <Camera size={18} /> {imageDataUrl ? t.scanChangePhoto : t.scanTakePhoto}
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

      {imageDataUrl && (
        <button
          onClick={handleScan}
          disabled={scanning}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-forest-600 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-forest-700 disabled:cursor-wait disabled:opacity-60 transition-colors"
        >
          {scanning
            ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> {t.scanAnalysingLong}</>
            : <><ImagePlus size={18} /> {t.scanAnalyseThis} <ChevronRight size={16} /></>}
        </button>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-forest-400">
        <Info size={12} /> {t.scanPhotoStays}
      </p>

      {/* Weather Forecast */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium text-indigo-100">{ht.homeWeatherLocation}</p>
              <p className="mt-0.5 text-[15px] font-semibold">{profile?.district ? `${profile.district}, ${profile.state ?? ''}` : 'Pune, Maharashtra'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={28} className="text-amber-200" />
              <span className="text-[28px] font-bold leading-none">29°</span>
            </div>
          </div>
          <p className="mt-2 text-[13px] text-indigo-100">Sunny · Light breeze from west</p>
          <div className="mt-4 flex gap-2">
            {dummyForecast.map((f) => (
              <div key={f.day} className="flex-1 rounded-xl bg-white/15 px-2 py-2.5 text-center backdrop-blur-sm">
                <p className="text-[11px] font-medium text-indigo-100">{f.day}</p>
                <f.icon size={20} className="mx-auto mt-1 text-white" />
                <p className="mt-1 text-[13px] font-semibold">{f.temp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="text-[20px] font-semibold text-forest-900">{ht.homeTools}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {tools.map(({ icon: Icon, label, view, isNew }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="flex flex-col items-center rounded-2xl border border-forest-100 bg-white p-3 text-center transition-colors hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Icon size={22} className="text-indigo-700" />
              </div>
              <span className="mt-2 text-[12px] font-medium leading-tight text-forest-800">{label}</span>
              {isNew && (
                <span className="mt-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">{ht.homeNew}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="text-[20px] font-semibold text-forest-900">{ht.homeLibrary}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {library.map(({ icon: Icon, label, view }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="flex items-center justify-between rounded-2xl bg-indigo-50 px-4 py-4 transition-colors hover:bg-indigo-100/60"
            >
              <span className="text-[14px] font-semibold text-indigo-900">{label}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-200/60">
                <Icon size={18} className="text-indigo-800" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helpline */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <p className="text-[13px] font-medium text-forest-400">{t.helpFreeGovt}</p>
        <h2 className="mt-1 text-[20px] font-semibold text-forest-900">{t.helpTitle}</h2>
        <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpSubtitle}</p>

        <div className="mt-4">
          <p className="section-label">{t.helpKCC}</p>
          <h3 className="mt-1 text-[18px] font-semibold text-forest-900">{t.helpFreeHelpline}</h3>
          <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpMinistry}</p>
          <a
            href="tel:18001801551"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-base font-semibold text-amber-950 hover:bg-amber-500 transition-colors"
          >
            <Phone size={19} /> {t.helpCall} 1800-180-1551
          </a>
          <p className="mt-2 text-center text-xs text-forest-400">{t.helpTollFree}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-[18px] font-semibold text-forest-900">{t.helpWhatAsk}</h3>
          <p className="mt-0.5 text-[13px] text-forest-400">{t.helpAdvisorsReady}</p>
          <div className="mt-3 space-y-3">
            {helplineTopics.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon size={17} className="shrink-0 text-forest-500" />
                <p className="text-sm leading-5 text-forest-800">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[18px] font-semibold text-forest-900">{t.helpLocalLang}</h3>
          <p className="mt-0.5 text-[13px] text-forest-400">{t.helpLocalLangDesc}</p>
          <p className="mt-3 text-[14px] leading-6 text-forest-700">{t.helpLocalLangBody}</p>
        </div>

        <div className="mt-6 flex gap-2 rounded-lg border border-forest-100 bg-forest-50 px-3 py-2.5 text-xs leading-5 text-forest-600">
          <PhoneCall size={15} className="mt-0.5 shrink-0 text-forest-400" />
          <p>{t.helpEscalatedNote}</p>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
