import { Check, ChevronRight, ImagePlus, Info, AlertCircle, Cloud, CloudRain, Sun, Store, BookOpen, Calculator, Bug, Wallet, Sprout, BookMarked, ShieldAlert, Phone, PhoneCall, Users, Wheat, Clock, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { classifyCropImage } from '@/data/classifier';
import type { CropId, GrowthStage, ScanRecord } from '@/data/types';
import { addScan, loadScans } from '@/data/storage';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useHomeLang } from '@/data/i18n-home';
import type { View } from '@/components/AppShell';
import { ScanIcon, LeafWatermark } from '@/components/BrandIcons';
import { getWeatherByLocation, getUserLocation, type WeatherResult } from '@/lib/weatherService';

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
  KINDWISE_FETCH_FAILED: 'scanErrKindwiseFetch',
  KINDWISE_API_ERROR: 'scanErrKindwiseApi',
  PARSE_ERROR: 'scanErrParse',
  INTERNAL_ERROR: 'scanErrInternal',
  SERVICE_UNAVAILABLE: 'scanErrServiceUnavailable',
  INVALID_IMAGE: 'scanErrInvalidImage',
  NOT_A_PLANT: 'scanNotACrop',
};

interface WeatherData {
  temp: string;
  condition: string;
  location: string;
  forecast: { day: string; icon: typeof Sun; temp: string; condition: string }[];
  updatedAt: number;
}

const fallbackWeather: WeatherData = {
  temp: '29°',
  condition: 'Sunny · Light breeze from west',
  location: 'Pune, Maharashtra',
  forecast: [
    { day: 'Today', icon: Sun, temp: '29°C', condition: 'Sunny' },
    { day: 'Tomorrow', icon: Cloud, temp: '27°C', condition: 'Cloudy' },
    { day: 'Wed', icon: CloudRain, temp: '24°C', condition: 'Light rain expected' },
  ],
  updatedAt: Date.now(),
};

function pickWeatherIcon(condition: string): typeof Sun {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain;
  if (c.includes('cloud') || c.includes('overcast')) return Cloud;
  return Sun;
}

function formatUpdatedAgo(updatedAt: number, lang: string): string {
  const mins = Math.max(1, Math.round((Date.now() - updatedAt) / 60000));
  if (lang === 'hi') return `${mins} मिनट पहले`;
  if (lang === 'bn') return `${mins} মিনিট আগে`;
  if (lang === 'te') return `${mins} నిమిషాల క్రితం`;
  if (lang === 'mr') return `${mins} मिनिटांपूर्वी`;
  if (lang === 'ta') return `${mins} நிமிடங்களுக்கு முன்`;
  return `${mins} min ago`;
}

function WeatherSkeleton() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-forest-100 to-forest-200 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-20 rounded bg-forest-300/40" />
          <div className="mt-2 h-4 w-28 rounded bg-forest-300/40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-forest-300/40" />
          <div className="h-7 w-12 rounded bg-forest-300/40" />
        </div>
      </div>
      <div className="mt-3 h-3 w-40 rounded bg-forest-300/30" />
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 rounded-xl bg-forest-300/25 px-2 py-2.5 text-center">
            <div className="mx-auto h-2.5 w-12 rounded bg-forest-300/40" />
            <div className="mx-auto mt-2 h-5 w-5 rounded-full bg-forest-300/40" />
            <div className="mx-auto mt-2 h-3 w-10 rounded bg-forest-300/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScanSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-24 rounded bg-forest-200/60" />
      <div className="h-5 w-40 rounded bg-forest-200/60" />
      <div className="h-3 w-56 rounded bg-forest-200/40" />
      <div className="h-11 w-full rounded-xl bg-forest-200/50" />
    </div>
  );
}

export function HomeScreen({ onResult, onNavigate }: HomeScreenProps) {
  const { t, lang } = useLang();
  const ht = useHomeLang();
  const { profile } = useAuth();
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [notACrop, setNotACrop] = useState(false);
  const [recentScans, setRecentScans] = useState<ScanRecord[] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const [weatherVisible, setWeatherVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const scans = loadScans();
    setRecentScans(scans.slice(0, 3));
  }, []);

  async function fetchWeather() {
    setWeatherLoading(true);
    setWeatherError(false);
    setWeatherVisible(false);
    try {
      const { lat, lon } = await getUserLocation();
      const result = await getWeatherByLocation(lat, lon);
      if ('error' in result) {
        setWeatherError(true);
        setWeather(fallbackWeather);
        requestAnimationFrame(() => setWeatherVisible(true));
      } else {
        const w: WeatherData = {
          temp: `${result.temp}°`,
          condition: `${result.condition} · ${result.windDescription}`,
          location: result.location,
          forecast: result.forecast.map((f) => ({
            day: f.label,
            icon: pickWeatherIcon(f.condition),
            temp: `${f.maxTemp}°C`,
            condition: f.condition,
          })),
          updatedAt: Date.now(),
        };
        setWeather(w);
        requestAnimationFrame(() => setWeatherVisible(true));
      }
    } catch {
      setWeatherError(true);
      setWeather(fallbackWeather);
      requestAnimationFrame(() => setWeatherVisible(true));
    } finally {
      setWeatherLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {/* Hero image */}
      <div className="relative mt-6 overflow-hidden rounded-2xl">
        <img
          src="https://images.pexels.com/photos/20445181/pexels-photo-20445181.jpeg?auto=compress&cs=tinysrgb&h=400&w=940"
          alt="Farmer tending to a lush wheat field"
          className="h-36 w-full object-cover sm:h-44"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="greeting-text text-white/80">{getGreeting(profile?.display_name)}</p>
          <h1 className="heading-display mt-0.5 text-[22px] font-bold leading-tight text-white sm:text-[26px]">{t.scanTitle}</h1>
        </div>
      </div>

      <p className="mt-3 max-w-md text-[14px] leading-6 text-forest-400">{t.scanSubtitle}</p>

      {/* Scan card */}
      <div className="mt-6">
        {recentScans === null ? (
          <ScanSkeleton />
        ) : (
          <div className="animate-fade-in">
            <p className="section-label">{t.scanQuickDiagnosis}</p>
            <h2 className="heading-display mt-1 text-[20px] font-bold text-forest-900">{t.scanScanALeaf}</h2>
            <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.scanClearPhotos}</p>
            <button
              onClick={() => inputRef.current?.click()}
              className="press-scale mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-3 text-[15px] font-semibold text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(120,60,0,0.15),0_6px_16px_rgba(247,168,32,0.35),0_2px_4px_rgba(0,0,0,0.08)] hover:from-amber-400 hover:to-amber-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(120,60,0,0.2),0_8px_20px_rgba(247,168,32,0.4),0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
            >
              <ScanIcon size={20} /> {imageDataUrl ? t.scanChangePhoto : t.scanTakePhoto}
            </button>
            <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
          </div>
        )}
      </div>

      {fileName && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-3 py-2.5 text-sm text-success-800 animate-fade-in">
          <Check size={16} className="shrink-0" />
          <div className="min-w-0">
            <p className="font-bold">{t.scanPhotoReady}</p>
            <p className="truncate text-xs">{fileName}</p>
          </div>
        </div>
      )}

      {notACrop && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900 animate-fade-in">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="font-medium leading-6">{t.scanNotACrop}</p>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-error-200 bg-error-50 px-3 py-3 text-sm text-error-800 animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">{t.scanDiagnosisFailed}</p>
              <p className="mt-0.5 text-xs leading-5">{error}</p>
            </div>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-error-300 bg-white px-4 py-2 text-[13px] font-semibold text-error-700 hover:bg-error-100 disabled:opacity-60 transition-colors"
          >
            {scanning
              ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-error-300 border-t-error-700" /> Retrying...</>
              : <>Retry analysis</>}
          </button>
        </div>
      )}

      {imageDataUrl && (
        <button
          onClick={handleScan}
          disabled={scanning}
          className="press-scale mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(44,98,64,0.25)] hover:bg-forest-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_16px_rgba(44,98,64,0.3)] disabled:cursor-wait disabled:opacity-60 transition-all duration-200"
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
        {weatherLoading ? (
          <WeatherSkeleton />
        ) : weather && (
          <>
            {weatherError && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800 animate-fade-in">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-medium">Unable to fetch weather, showing last known data</span>
                <button onClick={fetchWeather} className="ml-auto shrink-0 rounded-lg p-1 text-amber-700 hover:bg-amber-100 transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            )}
            <div className={`rounded-2xl bg-gradient-to-br from-forest-700 to-teal-700 p-4 text-white shadow-[0_4px_14px_rgba(44,98,64,0.2)] transition-all duration-500 ${weatherVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.97]'} ${weatherVisible ? 'animate-weather-in' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-forest-100">{ht.homeWeatherLocation}</p>
                  <p className="mt-0.5 text-[15px] font-semibold">{weather.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun size={28} className="text-amber-200" />
                  <span className="text-[28px] font-bold leading-none">{weather.temp}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] text-forest-100">{weather.condition}</p>
                <p className="flex items-center gap-1 text-[11px] text-forest-200">
                  <Clock size={11} /> {ht.homeWeatherUpdated} {formatUpdatedAgo(weather.updatedAt, lang)}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                {weather.forecast.map((f) => (
                  <div key={f.day} className="flex-1 rounded-xl bg-white/15 px-2 py-2.5 text-center backdrop-blur-sm">
                    <p className="text-[11px] font-medium text-forest-100">{f.day}</p>
                    <f.icon size={20} className="mx-auto mt-1 text-white" />
                    <p className="mt-1 text-[13px] font-semibold">{f.temp}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tools */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="heading-display text-[20px] font-bold text-forest-900">{ht.homeTools}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {tools.map(({ icon: Icon, label, view, isNew }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="card-lift flex flex-col items-center rounded-2xl border border-forest-100 bg-white p-3 text-center hover:border-forest-200"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-50">
                <Icon size={22} className="text-forest-600" />
              </div>
              <span className="mt-2 text-[12px] font-medium leading-tight text-forest-800">{label}</span>
              {isNew && (
                <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{ht.homeNew}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="heading-display text-[20px] font-bold text-forest-900">{ht.homeLibrary}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {library.map(({ icon: Icon, label, view }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="card-lift relative flex items-center justify-between rounded-2xl bg-forest-50 px-4 py-4 hover:bg-forest-100/60 overflow-hidden"
            >
              <LeafWatermark size={36} className="absolute -bottom-1 -right-1 text-forest-600 pointer-events-none" />
              <span className="relative text-[14px] font-semibold text-forest-800">{label}</span>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-forest-200/60">
                <Icon size={18} className="text-forest-700" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helpline */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <p className="text-[13px] font-medium text-forest-400">{t.helpFreeGovt}</p>
        <h2 className="heading-display mt-1 text-[20px] font-bold text-forest-900">{t.helpTitle}</h2>
        <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpSubtitle}</p>

        <div className="mt-4">
          <p className="section-label">{t.helpKCC}</p>
          <h3 className="heading-display mt-1 text-[18px] font-bold text-forest-900">{t.helpFreeHelpline}</h3>
          <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpMinistry}</p>
          <a
            href="tel:18001801551"
            className="press-scale mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-base font-semibold text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(120,60,0,0.15),0_4px_12px_rgba(247,168,32,0.3)] hover:bg-amber-500 transition-all"
          >
            <Phone size={19} /> {t.helpCall} 1800-180-1551
          </a>
          <p className="mt-2 text-center text-xs text-forest-400">{t.helpTollFree}</p>
        </div>

        <div className="mt-6">
          <h3 className="heading-display text-[18px] font-bold text-forest-900">{t.helpWhatAsk}</h3>
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
          <h3 className="heading-display text-[18px] font-bold text-forest-900">{t.helpLocalLang}</h3>
          <p className="mt-0.5 text-[13px] text-forest-400">{t.helpLocalLangDesc}</p>
          <p className="mt-3 text-[14px] leading-6 text-forest-700">{t.helpLocalLangBody}</p>
        </div>

        <div className="mt-6 flex gap-2 rounded-xl border border-forest-100 bg-forest-50 px-3 py-2.5 text-xs leading-5 text-forest-600">
          <PhoneCall size={15} className="mt-0.5 shrink-0 text-forest-400" />
          <p>{t.helpEscalatedNote}</p>
        </div>
      </div>

      <div className="h-4" />
    </section>
  );
}
