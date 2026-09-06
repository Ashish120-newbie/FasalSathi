import { AlertTriangle, SprayCan, Droplets, Scale } from 'lucide-react';
import { useState } from 'react';
import { cropName, crops } from '@/data/crops';
import type { CropId } from '@/data/types';
import { useLang } from '@/lib/lang';
import { useHomeLang } from '@/data/i18n-home';

interface PestOption {
  id: string;
  label: string;
  labelHi: string;
  productName: string;
  dosagePerLiterWater: number; // ml or g per liter of spray water
  unit: 'ml' | 'g';
}

// Standard label-rate dosages per liter of spray water (common product examples)
const pestOptions: PestOption[] = [
  { id: 'aphids', label: 'Aphids', labelHi: 'माहू (एफिड्स)', productName: 'Imidacloprid 17.8% SL', dosagePerLiterWater: 0.3, unit: 'ml' },
  { id: 'whitefly', label: 'Whitefly', labelHi: 'सफेद मक्खी', productName: 'Imidacloprid 17.8% SL', dosagePerLiterWater: 0.3, unit: 'ml' },
  { id: 'fungal-blight', label: 'Fungal blight', labelHi: 'फफूंद झुलसा', productName: 'Mancozeb 75% WP', dosagePerLiterWater: 2, unit: 'g' },
  { id: 'bollworm', label: 'Bollworm', labelHi: 'सुंडी (बॉलवर्म)', productName: 'Cypermethrin 10% EC', dosagePerLiterWater: 1, unit: 'ml' },
  { id: 'thrips', label: 'Thrips', labelHi: 'थ्रिप्स', productName: 'Imidacloprid 17.8% SL', dosagePerLiterWater: 0.3, unit: 'ml' },
  { id: 'leaf-miner', label: 'Leaf miner', labelHi: 'पत्ती सुरंगक', productName: 'Cypermethrin 10% EC', dosagePerLiterWater: 1, unit: 'ml' },
];

const WATER_PER_ACRE_L = 200; // standard knapsack/boom sprayer volume per acre
const HECTARE_TO_ACRE = 2.471;

export function PesticideCalculatorScreen() {
  const { t, lang } = useLang();
  const ht = useHomeLang();
  const [cropId, setCropId] = useState<CropId>('wheat');
  const [area, setArea] = useState('1');
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [pestId, setPestId] = useState('aphids');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const acres = Math.max(Number(area) || 0, 0) * (unit === 'hectares' ? HECTARE_TO_ACRE : 1);
  const pest = pestOptions.find((p) => p.id === pestId) ?? pestOptions[0];

  const waterRequiredL = acres * WATER_PER_ACRE_L;
  const productAmountRaw = pest.dosagePerLiterWater * waterRequiredL; // in ml or g
  const productAmountDisplay = productAmountRaw >= 1000
    ? { value: (productAmountRaw / 1000).toFixed(2), unit: pest.unit === 'ml' ? 'L' : 'kg' }
    : { value: productAmountRaw.toFixed(0), unit: pest.unit };

  function handleCalculate() {
    if (!area || Number(area) <= 0) {
      setError(lang === 'hi' ? 'कृपया खेत का सही आकार दर्ज करें।' : 'Please enter a valid farm size.');
      setSubmitted(false);
      return;
    }
    setError('');
    setSubmitted(true);
  }

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
        <p className="mt-1 text-[11px] text-forest-400">
          {lang === 'hi'
            ? 'नोट: खुराक कीट के प्रकार पर आधारित है, फसल जानकारी के लिए है।'
            : 'Note: dosage is based on pest type — crop is for your reference.'}
        </p>

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
          {pestOptions.map((p) => <option key={p.id} value={p.id}>{lang === 'hi' ? p.labelHi : p.label}</option>)}
        </select>
        <p className="mt-1 text-[11px] text-forest-400">
          {lang === 'hi' ? 'अनुशंसित उत्पाद' : 'Recommended product'}: {pest.productName}
        </p>

        {error && <p className="mt-2 text-[13px] font-medium text-red-600">{error}</p>}
      </div>

      <button onClick={handleCalculate} className="btn-amber mt-6 w-full">
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
                <p className="text-2xl font-bold text-forest-800">{productAmountDisplay.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-forest-500">
                  {pest.productName} ({productAmountDisplay.unit})
                </p>
              </div>
              <div className="rounded-lg bg-forest-50 px-3 py-4 text-center">
                <Droplets size={16} className="mx-auto mb-1 text-forest-400" />
                <p className="text-2xl font-bold text-forest-800">{Math.round(waterRequiredL)}</p>
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
                {pest.dosagePerLiterWater} {pest.unit} {lang === 'hi' ? 'प्रति लीटर पानी' : 'per liter of water'} × {Math.round(waterRequiredL)} L = <span className="font-bold text-forest-900">{productAmountDisplay.value} {productAmountDisplay.unit}</span>
              </p>
              <p className="mt-1 text-[13px] leading-5 text-forest-600">
                {lang === 'hi' ? 'कुल पानी की आवश्यकता' : 'Total water needed'}: <span className="font-bold text-forest-900">{Math.round(waterRequiredL)} L</span> ({WATER_PER_ACRE_L} L/{lang === 'hi' ? 'एकड़' : 'acre'})
              </p>
            </div>

            <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-700" />
              <span>{lang === 'hi' ? 'हमेशा उत्पाद लेबल का पालन करें — यह एक सामान्य अनुमान है।' : 'Always follow the product label — this is a general estimate based on standard rates.'}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}