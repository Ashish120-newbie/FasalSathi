import { Check, ChevronRight, ImagePlus, Info, AlertCircle, Cloud, CloudRain, Sun, Store, BookOpen, Bug, Calculator, SprayCan, Sprout, Leaf, ShieldAlert, Phone, PhoneCall, Users, Wheat, Clock, RefreshCw, RotateCw, Camera, CheckCircle2, AlertTriangle, XCircle, Droplets, FlaskConical, Sprout as SproutIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { classifyCropImage } from '@/data/classifier';
import type { CropId, GrowthStage, ScanRecord } from '@/data/types';
import { addScan, loadScans } from '@/data/storage';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useHomeLang } from '@/data/i18n-home';
import type { View } from '@/components/AppShell';
import { ScanIcon } from '@/components/BrandIcons';
import { getWeatherByLocation, getUserLocation, type WeatherResult, type WeatherHourlyEntry } from '@/lib/weatherService';

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
  windKph: number;
  humidity: number;
  hourly: WeatherHourlyEntry[];
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
  windKph: 8,
  humidity: 55,
  hourly: [
    { pop: 0, rainMm: 0, temp: 29 },
    { pop: 0, rainMm: 0, temp: 28 },
    { pop: 10, rainMm: 0, temp: 27 },
    { pop: 20, rainMm: 0.5, temp: 26 },
  ],
};

type AdvisoryStatus = 'good' | 'caution' | 'avoid';

interface Advisory {
  status: AdvisoryStatus;
  message: string;
}

function computeAdvisories(data: WeatherData): { spray: Advisory; fertilizer: Advisory; sow: Advisory } {
  const temp = parseInt(data.temp, 10);
  const wind = data.windKph;
  const humidity = data.humidity;
  const hourly = data.hourly;

  const rainNext6h = hourly.slice(0, 2).some((h) => h.pop > 50 || h.rainMm > 0.5);
  const heavyRainNext24h = hourly.slice(0, 8).some((h) => h.rainMm > 10);
  const anyRainNext3Days = hourly.some((h) => h.pop > 30 || h.rainMm > 0.2);
  const maxTempForecast = Math.max(temp, ...hourly.map((h) => h.temp));

  // Spray advisory
  let spray: Advisory;
  if (wind > 15) {
    spray = { status: 'avoid', message: 'Too windy — spray drift risk' };
  } else if (temp > 30) {
    spray = { status: 'avoid', message: 'Too hot — pesticide may evaporate before absorption' };
  } else if (rainNext6h) {
    spray = { status: 'avoid', message: 'Rain expected soon — spray will wash off, wait until after' };
  } else if (wind >= 3 && wind <= 15 && temp <= 30) {
    let msg = 'Good conditions for spraying';
    if (humidity < 40) msg += ' — low humidity, spray early morning or evening';
    spray = { status: 'good', message: msg };
  } else {
    let msg = 'Fair conditions — monitor weather before spraying';
    if (humidity < 40) msg += ' — low humidity, spray early morning or evening';
    spray = { status: 'caution', message: msg };
  }

  // Fertilizer advisory
  let fertilizer: Advisory;
  if (heavyRainNext24h) {
    fertilizer = { status: 'avoid', message: 'Heavy rain expected — fertilizer may wash away, apply after rain passes' };
  } else {
    fertilizer = { status: 'good', message: 'Good to apply fertilizer — no heavy rain expected in 24 hours' };
  }

  // Sowing advisory
  let sow: Advisory;
  if (maxTempForecast > 35 && !anyRainNext3Days) {
    sow = { status: 'avoid', message: 'Hot, dry conditions ahead — germination may be poor, consider waiting for rain' };
  } else if (heavyRainNext24h) {
    sow = { status: 'avoid', message: 'Heavy rain expected — risk of seed rot, wait for drier conditions' };
  } else if (temp >= 15 && temp <= 32 && anyRainNext3Days) {
    sow = { status: 'good', message: 'Good conditions for sowing — moderate temps with rain expected aids germination' };
  } else if (temp >= 15 && temp <= 32) {
    sow = { status: 'caution', message: 'Temperature is suitable but little rain ahead — ensure soil moisture before sowing' };
  } else {
    sow = { status: 'caution', message: 'Check local soil moisture and forecast before sowing' };
  }

  return { spray, fertilizer, sow };
}

function AdvisoryRow({ icon: Icon, label, advisory }: { icon: typeof Sun; label: string; advisory: Advisory }) {
  const statusConfig: Record<AdvisoryStatus, { icon: typeof Sun; color: string; bg: string; text: string }> = {
    good: { icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50', text: 'text-success-800' },
    caution: { icon: AlertTriangle, color: 'text-warning-600', bg: 'bg-warning-50', text: 'text-warning-800' },
    avoid: { icon: XCircle, color: 'text-error-600', bg: 'bg-error-50', text: 'text-error-800' },
  };
  const s = statusConfig[advisory.status];
  const StatusIcon = s.icon;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-forest-100 bg-white p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50">
        <Icon size={18} className="text-forest-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-forest-800">{label}</p>
        <p className="mt-0.5 text-[12px] leading-5 text-forest-600">{advisory.message}</p>
      </div>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.bg}`}>
        <StatusIcon size={16} className={s.color} />
      </div>
    </div>
  );
}

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
          windKph: result.windKph,
          humidity: result.humidity,
          hourly: result.hourly,
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
    { icon: FlaskConical, label: ht.homeFertilizerCalc, view: 'calculator' as View, isNew: false, iconBg: 'bg-[#E3EDD3]', iconColor: 'text-[#2F5233]' },
    { icon: SprayCan, label: ht.homePesticideCalc, view: 'pesticide-calc' as View, isNew: false, iconBg: 'bg-[#FBE8CE]', iconColor: 'text-[#8A5A1E]' },
    { icon: Calculator, label: ht.homeCostCalc, view: 'cost-calc' as View, isNew: false, iconBg: 'bg-[#F5E6C8]', iconColor: 'text-[#7A5B12]' }
  ];

  const library = [
    { icon: Leaf, label: ht.homeCrops, view: 'crops' as View, isNew: false, iconBg: 'bg-[#DCEBC7]', iconColor: 'text-[#3B6D11]' },
    { icon: BookOpen, label: ht.homeCultivationTips, view: 'cultivation-tips' as View, isNew: false, iconBg: 'bg-[#F5E6C8]', iconColor: 'text-[#7A5B12]' },
    { icon: Bug, label: ht.homePestsDiseases, view: 'pests-diseases' as View, isNew: false, iconBg: 'bg-[#F7D9D9]', iconColor: 'text-[#A32D2D]' },
    { icon: ShieldAlert, label: ht.homePestsDiseaseAlert, view: 'pests-disease-alert' as View, isNew: false, iconBg: 'bg-[#FBE8CE]', iconColor: 'text-[#8A5A1E]' }
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
              className="press-scale mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F5233] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#2F5233]/90 transition-colors duration-200"
            >
              <Camera size={20} /> {imageDataUrl ? t.scanChangePhoto : t.scanTakePhoto}
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
            <div className={`rounded-2xl bg-[#1E3A21] p-4 text-white transition-all duration-500 ${weatherVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.97]'} ${weatherVisible ? 'animate-weather-in' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-forest-100">{ht.homeWeatherLocation}</p>
                  <p className="mt-0.5 text-[15px] font-semibold">{weather.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun size={28} strokeWidth={1.75} className="text-amber-200" />
                  <span className="text-[28px] font-bold leading-none">{weather.temp}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] text-forest-100">{weather.condition}</p>
                <p className="flex items-center gap-1 text-[11px] text-forest-200">
                  <RotateCw size={11} strokeWidth={1.75} /> {ht.homeWeatherUpdated} {formatUpdatedAgo(weather.updatedAt, lang)}
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
            {weather && !weatherError && weather.hourly.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-forest-100">Farming Advisory</p>
                <div className="mt-2 space-y-2">
                  <AdvisoryRow icon={Droplets} label="Spray" advisory={computeAdvisories(weather).spray} />
                  <AdvisoryRow icon={FlaskConical} label="Fertilizer" advisory={computeAdvisories(weather).fertilizer} />
                  <AdvisoryRow icon={SproutIcon} label="Sow" advisory={computeAdvisories(weather).sow} />
                </div>
                <p className="mt-2 text-[10px] leading-4 text-forest-200">Based on general weather guidelines. Always check pesticide/fertilizer product labels for specific recommendations.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tools */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="heading-display text-[20px] font-bold text-[#1E3A21]">{ht.homeTools}</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {tools.map(({ icon: Icon, label, view, isNew, iconBg, iconColor }) => (
            <button
              key={label}
              onClick={() => onNavigate(view)}
              className="card-lift relative flex flex-col items-center rounded-2xl border border-[#E5E0D3] bg-white p-4 text-center hover:border-[#2F5233]/30"
            >
              {isNew && (
                <span className="absolute -top-2 -right-2 rounded-full bg-[#E8A33D] px-2 py-0.5 text-[10px] font-medium text-[#412402]">{ht.homeNew}</span>
              )}
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={20} strokeWidth={1.75} className={iconColor} />
              </div>
              <span className="mt-2 text-[12px] font-medium leading-tight text-[#1E3A21]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Library */}
      <div className="mt-8 border-t border-forest-100" />
      <div className="mt-6">
        <h2 className="heading-display text-[20px] font-bold text-[#1E3A21]">{ht.homeLibrary}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {library.map(({ icon: Icon, label, view, isNew, iconBg, iconColor }) => (
            <div key={label} className="relative bg-[#EEF3E4] rounded-2xl p-4 flex items-center justify-between">
              {isNew && (
                <span className="absolute -top-2 -right-2 bg-[#E8A33D] text-[#412402] text-[10px] font-medium px-2 py-0.5 rounded-full">{ht.homeNew}</span>
              )}
              <button
                onClick={() => onNavigate(view)}
                className="card-lift flex w-full items-center justify-between"
              >
                <span className="text-[14px] font-semibold leading-tight text-[#1E3A21]">{label}</span>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon size={20} strokeWidth={1.75} className={iconColor} />
                </div>
              </button>
            </div>
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
          <h3 className="heading-display mt-1 flex items-center gap-2 text-[18px] font-bold text-forest-900">
            <Phone size={18} className="text-forest-600" /> {t.helpFreeHelpline}
          </h3>
          <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpMinistry}</p>
          <a
            href="tel:18001801551"
            className="press-scale mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-3.5 text-base font-bold text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(120,60,0,0.15),0_6px_16px_rgba(247,168,32,0.35),0_2px_4px_rgba(0,0,0,0.08)] hover:from-amber-400 hover:to-amber-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(120,60,0,0.2),0_8px_20px_rgba(247,168,32,0.4),0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200"
          >
            <PhoneCall size={20} /> {t.helpCall} 1800-180-1551
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
