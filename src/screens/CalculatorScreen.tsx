import { Check, Droplets, Scale } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cropName, crops, growthStages, stageLabel } from '@/data/crops';
import { getFertilizerPlan } from '@/data/fertilizer';
import type { CropId, GrowthStage } from '@/data/types';
import { useLang } from '@/lib/lang';

export function CalculatorScreen() {
  const { t, lang } = useLang();
  const [cropId, setCropId] = useState<CropId>('wheat');
  const [area, setArea] = useState('1');
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [stage, setStage] = useState<GrowthStage>('vegetative');
  const plan = useMemo(() => getFertilizerPlan(cropId, stage), [cropId, stage]);
  const factor = Math.max(Number(area) || 0, 0) * (unit === 'hectares' ? 2.471 : 1);

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-6">
        <p className="text-sm font-medium text-forest-500">{t.calcPlanNext}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-900">{t.calcTitle}</h1>
        <p className="mt-1.5 text-sm leading-6 text-forest-500">{t.calcSubtitle}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-forest-900">{t.calcFarmDetails}</h2>

        <label className="mt-4 mb-2 block text-sm font-semibold text-forest-800">{t.calcCropType}</label>
        <select value={cropId} onChange={(event) => setCropId(event.target.value as CropId)} className="select-field">
          {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.emoji} {cropName(crop.id, lang)}</option>)}
        </select>

        <label className="mt-4 mb-2 block text-sm font-semibold text-forest-800">{t.calcFarmSize}</label>
        <div className="flex gap-2">
          <input inputMode="decimal" value={area} onChange={(event) => setArea(event.target.value)} className="input-field" placeholder="1" />
          <select value={unit} onChange={(event) => setUnit(event.target.value as 'acres' | 'hectares')} className="select-field max-w-[140px]">
            <option value="acres">{t.calcAcres}</option>
            <option value="hectares">{t.calcHectares}</option>
          </select>
        </div>

        <label className="mt-4 mb-2 block text-sm font-semibold text-forest-800">{t.calcGrowthStage}</label>
        <select value={stage} onChange={(event) => setStage(event.target.value as GrowthStage)} className="select-field">
          {growthStages.map((item) => <option key={item.id} value={item.id}>{stageLabel(item.id, lang)}</option>)}
        </select>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <p className="section-label">{t.calcEstimatedNeed}</p>
        <p className="mt-1 text-sm text-forest-500">{t.calcFor} {area || 0} {unit === 'acres' ? t.calcAcres.toLowerCase() : t.calcHectares.toLowerCase()}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{Math.round(plan.npk.n * factor)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcNitrogen}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{Math.round(plan.npk.p * factor)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcPhosphate}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{Math.round(plan.npk.k * factor)}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcPotash}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-forest-900">{t.calcProductQty}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['Urea', plan.unitsPerAcre.urea, 'kg'], ['DAP', plan.unitsPerAcre.dap, 'kg'], ['MOP', plan.unitsPerAcre.mop, 'kg']].map(([name, value, suffix]) => (
            <div key={name} className="rounded-lg border border-forest-100 bg-white px-2 py-3">
              <Scale size={16} className="mb-1.5 text-forest-400" />
              <p className="text-xs font-semibold text-forest-600">{name}</p>
              <p className="mt-1 text-lg font-bold text-forest-900">{Math.round(Number(value) * factor)}<span className="ml-1 text-xs font-medium text-forest-500">{suffix}</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-forest-900">{t.calcSchedule}</h2>
        <div className="mt-4 space-y-4">
          {plan.schedule.map((item) => (
            <div key={item.timing} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-forest-100 text-forest-700"><Check size={12} /></span>
              <div>
                <p className="text-sm font-semibold text-forest-900">{item.timing}</p>
                <p className="mt-0.5 text-sm leading-5 text-forest-600">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
          <Droplets size={15} className="mt-0.5 shrink-0 text-amber-700" />{t.calcWaterAfter}
        </div>
      </div>
    </section>
  );
}
