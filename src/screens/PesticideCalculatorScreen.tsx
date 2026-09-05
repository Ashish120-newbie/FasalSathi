import { AlertTriangle, SprayCan, Droplets, Scale } from 'lucide-react';
import { useState } from 'react';
import { cropName, crops } from '@/data/crops';
import type { CropId } from '@/data/types';
import { useLang } from '@/lib/lang';
import { useHomeLang } from '@/data/i18n-home';

interface PestOption {
  id: string;
  label: string;
  ratePerAcre: number;
  unit: string;
}

const pestOptions: PestOption[] = [
  { id: 'aphids', label: 'Aphids', ratePerAcre: 0.5, unit: 'L' },
  { id: 'whitefly', label: 'Whitefly', ratePerAcre: 0.6, unit: 'L' },
  { id: 'fungal-blight', label: 'Fungal blight', ratePerAcre: 1.0, unit: 'L' },
  { id: 'bollworm', label: 'Bollworm', ratePerAcre: 0.8, unit: 'L' },
  { id: 'thrips', label: 'Thrips', ratePerAcre: 0.4, unit: 'L' },
  { id: 'leaf-miner', label: 'Leaf miner', ratePerAcre: 0.5, unit: 'L' },
];

const WATER_PER_ACRE_L = 200;

export function PesticideCalculatorScreen() {
  const { t, lang } = useLang();
  const ht = useHomeLang();
  const [cropId, setCropId] = useState<CropId>('wheat');
  const [area, setArea] = useState('1');
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [pestId, setPestId] = useState('aphids');
  const [concentration, setConcentration] = useState('10');
  const [submitted, setSubmitted] = useState(false);

  const acres = Math.max(Number(area) || 0, 0) * (unit === 'hectares' ? 2.471 : 1);
  const pest = pestOptions.find((p) => p.id === pestId) ?? pestOptions[0];
  const conc = Math.max(Number(concentration) || 0, 0);

  const dosage = acres * pest.ratePerAcre;
  const waterRequired = acres * WATER_PER_ACRE_L;
  const productAmount = conc > 0 ? (dosage * conc) / 10 : dosage;

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <p className="text-[13px] font-medium text-forest-400">{ht.homePesticideCalc}</p>
        <h1 className="heading-display mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{ht.homePesticideCalc}</h1>
        <p className="mt-2 text-[14px] leading-6 text-forest-400">
          {lang === 'hi'
            ? 'फसल और कीट के आधार पर छिड़काव का अनुमान पाएं।'
            : 'Get a spray estimate based on crop and pest type.'}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">{t.calcFarmDetails}</h2>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">{t.calcCropType}</label>
        <select value={cropId} onChange={(e) => setCropId(e.target.value as CropId)} className="select-field">
          {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.emoji} {cropName(crop.id, lang)}</option>)}
        </select>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">{t.calcFarmSize}</label>
        <div className="flex gap-2">
          <input inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} className="input-field" placeholder="1" />
          <select value={unit} onChange={(e) => setUnit(e.target.value as 'acres' | 'hectares')} className="select-field max-w-[140px]">
            <option value="acres">{t.calcAcres}</option>
            <option value="hectares">{t.calcHectares}</option>
          </select>
        </div>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">
          {lang === 'hi' ? 'कीट या रोग का प्रकार' : 'Pest or disease type'}
        </label>
        <select value={pestId} onChange={(e) => setPestId(e.target.value)} className="select-field">
          {pestOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">
          {lang === 'hi' ? 'उत्पाद सांद्रता (% या g/L)' : 'Product concentration (% or g/L)'}
        </label>
        <input inputMode="decimal" value={concentration} onChange={(e) => setConcentration(e.target.value)} className="input-field" placeholder="10" />
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="btn-amber mt-6 w-full"
      >
        {lang === 'hi' ? 'गणना करें' : 'Calculate'}
      </button>

      {submitted && (
        <>
          <div className="my-8 border-t border-forest-100" />

          <div className="rounded-2xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3E4]">
                <SprayCan size={20} strokeWidth={1.75} className="text-[#2F5233]" />
              </div>
              <div>
                <p className="section-label">{t.calcEstimatedNeed}</p>
                <p className="mt-0.5 text-[13px] text-forest-400">{t.calcFor} {area || 0} {unit === 'acres' ? t.calcAcres.toLowerCase() : t.calcHectares.toLowerCase()}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-forest-50 px-3 py-4 text-center">
                <Scale size={16} className="mx-auto mb-1 text-forest-400" />
                <p className="text-2xl font-bold text-forest-800">{productAmount.toFixed(2)}</p>
                <p className="mt-0.5 text-[11px] font-medium text-forest-500">
                  {lang === 'hi' ? 'उत्पाद मात्रा (L)' : 'Product amount (L)'}
                </p>
              </div>
              <div className="rounded-lg bg-forest-50 px-3 py-4 text-center">
                <Droplets size={16} className="mx-auto mb-1 text-forest-400" />
                <p className="text-2xl font-bold text-forest-800">{Math.round(waterRequired)}</p>
                <p className="mt-0.5 text-[11px] font-medium text-forest-500">
                  {lang === 'hi' ? 'पानी (L)' : 'Water (L)'}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-forest-50 px-3 py-3">
              <p className="text-[13px] font-semibold text-forest-800">
                {lang === 'hi' ? 'अनुशंसित खुराक' : 'Recommended dosage'}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-forest-600">
                {dosage.toFixed(2)} {pest.unit} {lang === 'hi' ? 'प्रति एकड़' : 'per acre'} × {acres.toFixed(2)} {unit === 'acres' ? t.calcAcres.toLowerCase() : t.calcHectares.toLowerCase()} = <span className="font-bold text-forest-900">{productAmount.toFixed(2)} {pest.unit}</span>
              </p>
              <p className="mt-1 text-[13px] leading-5 text-forest-600">
                {lang === 'hi' ? 'छिड़काव के लिए कुल पानी' : 'Total water for spraying'}: <span className="font-bold text-forest-900">{Math.round(waterRequired)} L</span>
              </p>
            </div>

            <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-700" />
              <span>{lang === 'hi' ? 'हमेशा उत्पाद लेबल का पालन करें — यह एक सामान्य अनुमान है।' : 'Always follow the product label — this is a general estimate.'}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
