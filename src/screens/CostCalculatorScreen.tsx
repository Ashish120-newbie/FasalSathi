import { Calculator, Plus, Trash2, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { cropName, crops } from '@/data/crops';
import type { CropId } from '@/data/types';
import { useLang } from '@/lib/lang';
import { useHomeLang } from '@/data/i18n-home';

interface CostLine {
  id: string;
  label: string;
  amount: string;
}

const defaultCategories: { id: string; label: string }[] = [
  { id: 'seeds', label: 'Seeds' },
  { id: 'fertilizer', label: 'Fertilizer' },
  { id: 'pesticide', label: 'Pesticide' },
  { id: 'labor', label: 'Labor' },
  { id: 'irrigation', label: 'Irrigation' },
  { id: 'other', label: 'Other' },
];

export function CostCalculatorScreen() {
  const { t, lang } = useLang();
  const ht = useHomeLang();
  const [cropId, setCropId] = useState<CropId>('wheat');
  const [area, setArea] = useState('1');
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [expectedYield, setExpectedYield] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [lines, setLines] = useState<CostLine[]>(
    defaultCategories.map((c) => ({ id: c.id, label: c.label, amount: '' }))
  );
  const [customCount, setCustomCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const acres = Math.max(Number(area) || 0, 0) * (unit === 'hectares' ? 2.471 : 1);

  const amounts = lines.map((l) => Number(l.amount) || 0);
  const total = amounts.reduce((sum, v) => sum + v, 0);
  const perAcre = acres > 0 ? total / acres : 0;

  const yieldPerAcreQuintal = Math.max(Number(expectedYield) || 0, 0);
  const pricePerQuintal = Math.max(Number(expectedPrice) || 0, 0);
  const hasRevenueInputs = yieldPerAcreQuintal > 0 && pricePerQuintal > 0;
  const totalYieldQuintal = yieldPerAcreQuintal * acres;
  const totalRevenue = totalYieldQuintal * pricePerQuintal;
  const netProfit = totalRevenue - total;
  const isProfitable = netProfit >= 0;

  function updateLine(id: string, amount: string) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, amount } : l)));
  }

  function addCustom() {
    const n = customCount + 1;
    setCustomCount(n);
    setLines((prev) => [...prev, { id: `custom-${n}`, label: `Other ${n}`, amount: '' }]);
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

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
        <p className="text-[13px] font-medium text-forest-400">{ht.homeCostCalc}</p>
        <h1 className="heading-display mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{ht.homeCostCalc}</h1>
        <p className="mt-2 text-[14px] leading-6 text-forest-400">
          {lang === 'hi'
            ? 'अपने खेत की लागत, कमाई और मुनाफे का अनुमान लगाएं।'
            : 'Estimate your field\'s cost, revenue, and profit.'}
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

        {error && <p className="mt-2 text-[13px] font-medium text-red-600">{error}</p>}
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">
          {lang === 'hi' ? 'अनुमानित कमाई (वैकल्पिक)' : 'Expected earnings (optional)'}
        </h2>
        <p className="mt-1 text-[13px] text-forest-400">
          {lang === 'hi'
            ? 'मुनाफे का अनुमान देखने के लिए यह भरें।'
            : 'Fill this in to see a profit estimate.'}
        </p>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">
          {lang === 'hi' ? 'अनुमानित उपज (क्विंटल प्रति एकड़)' : 'Expected yield (quintal per acre)'}
        </label>
        <input
          inputMode="decimal"
          value={expectedYield}
          onChange={(e) => setExpectedYield(e.target.value)}
          className="input-field"
          placeholder={lang === 'hi' ? 'जैसे 20' : 'e.g. 20'}
        />

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">
          {lang === 'hi' ? 'अनुमानित बिक्री मूल्य (₹ प्रति क्विंटल)' : 'Expected selling price (₹ per quintal)'}
        </label>
        <input
          inputMode="decimal"
          value={expectedPrice}
          onChange={(e) => setExpectedPrice(e.target.value)}
          className="input-field"
          placeholder={lang === 'hi' ? 'जैसे 2450' : 'e.g. 2450'}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">
          {lang === 'hi' ? 'लागत श्रेणियां' : 'Cost categories'}
        </h2>
        <div className="mt-4 space-y-3">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[12px] font-medium text-forest-600">{line.label}</label>
                <div className="relative">
                  <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
                  <input
                    inputMode="decimal"
                    value={line.amount}
                    onChange={(e) => updateLine(line.id, e.target.value)}
                    className="input-field pl-8"
                    placeholder="0"
                  />
                </div>
              </div>
              {line.id.startsWith('custom-') && (
                <button
                  onClick={() => removeLine(line.id)}
                  className="mt-5 rounded-lg p-2 text-forest-400 hover:bg-forest-50"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addCustom}
          className="mt-4 flex items-center gap-2 rounded-lg border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 hover:bg-forest-50"
        >
          <Plus size={16} /> {lang === 'hi' ? 'श्रेणी जोड़ें' : 'Add category'}
        </button>
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
                <Calculator size={20} strokeWidth={1.75} className="text-[#2F5233]" />
              </div>
              <div>
                <p className="section-label">{t.calcEstimatedNeed}</p>
                <p className="mt-0.5 text-[13px] text-forest-400">{t.calcFor} {area || 0} {unit === 'acres' ? t.calcAcres.toLowerCase() : t.calcHectares.toLowerCase()}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-forest-50 px-3 py-4 text-center">
                <p className="text-2xl font-bold text-forest-800">₹{total.toLocaleString('en-IN')}</p>
                <p className="mt-0.5 text-[11px] font-medium text-forest-500">
                  {lang === 'hi' ? 'कुल लागत' : 'Total cost'}
                </p>
              </div>
              <div className="rounded-lg bg-forest-50 px-3 py-4 text-center">
                <p className="text-2xl font-bold text-forest-800">₹{perAcre.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <p className="mt-0.5 text-[11px] font-medium text-forest-500">
                  {lang === 'hi' ? 'प्रति एकड़' : 'Per acre'}
                </p>
              </div>
            </div>

            {hasRevenueInputs && (
              <div className="mt-4 rounded-xl border border-forest-100 p-4">
                <div className="flex items-center gap-2">
                  {isProfitable ? (
                    <TrendingUp size={18} className="text-emerald-600" />
                  ) : (
                    <TrendingDown size={18} className="text-red-600" />
                  )}
                  <p className="text-[13px] font-semibold text-forest-800">
                    {lang === 'hi' ? 'कमाई का अनुमान' : 'Earnings estimate'}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2.5">
                    <span className="text-[13px] font-medium text-forest-700">
                      {lang === 'hi' ? 'कुल उपज' : 'Total yield'}
                    </span>
                    <span className="text-[13px] font-bold text-forest-900">
                      {totalYieldQuintal.toFixed(1)} {lang === 'hi' ? 'क्विंटल' : 'quintal'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2.5">
                    <span className="text-[13px] font-medium text-forest-700">
                      {lang === 'hi' ? 'अनुमानित आय' : 'Expected revenue'}
                    </span>
                    <span className="text-[13px] font-bold text-forest-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${isProfitable ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <span className={`text-[13px] font-semibold ${isProfitable ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isProfitable
                        ? (lang === 'hi' ? 'अनुमानित मुनाफा' : 'Estimated profit')
                        : (lang === 'hi' ? 'अनुमानित नुकसान' : 'Estimated loss')}
                    </span>
                    <span className={`text-[14px] font-bold ${isProfitable ? 'text-emerald-800' : 'text-red-800'}`}>
                      ₹{Math.abs(netProfit).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-4 text-forest-400">
                  {lang === 'hi'
                    ? 'यह अनुमान आपके द्वारा दर्ज उपज और मूल्य पर आधारित है — मंडी टैब में मौजूदा भाव देखें।'
                    : 'This estimate is based on the yield and price you entered — check the Mandi tab for current rates.'}
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="text-[13px] font-semibold text-forest-800">
                {lang === 'hi' ? 'लागत विवरण' : 'Cost breakdown'}
              </p>
              <div className="mt-3 space-y-2">
                {lines
                  .filter((l) => (Number(l.amount) || 0) > 0)
                  .map((line) => {
                    const amt = Number(line.amount) || 0;
                    const pct = total > 0 ? (amt / total) * 100 : 0;
                    return (
                      <div key={line.id} className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2.5">
                        <span className="text-[13px] font-medium text-forest-700">{line.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-bold text-forest-900">₹{amt.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] font-medium text-forest-500">{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                {lines.every((l) => !((Number(l.amount) || 0) > 0)) && (
                  <p className="text-[13px] text-forest-400">
                    {lang === 'hi' ? 'कोई राशि दर्ज नहीं है।' : 'No amounts entered.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}