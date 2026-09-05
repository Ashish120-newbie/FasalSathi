import { Check, Droplets, Scale } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cropName, crops } from '@/data/crops';
import { getFertilizerPlan, getSupportedCrops } from '@/data/fertilizer';
import type { CropId } from '@/data/types';
import { useLang } from '@/lib/lang';

export function CalculatorScreen() {
  const { t, lang } = useLang();
  const supportedCrops = useMemo(() => getSupportedCrops(), []);
  const cropOptions = useMemo(
    () => crops.filter((c) => supportedCrops.includes(c.id)),
    [supportedCrops]
  );
  const [cropId, setCropId] = useState<CropId>(supportedCrops[0] ?? 'wheat');
  const [area, setArea] = useState('1');
  const plan = useMemo(() => getFertilizerPlan(cropId, Number(area) || 0), [cropId, area]);

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <p className="text-[13px] font-medium text-forest-400">{t.calcPlanNext}</p>
        <h1 className="heading-display mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{t.calcTitle}</h1>
        <p className="mt-2 text-[14px] leading-6 text-forest-400">{t.calcSubtitle}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">{t.calcFarmDetails}</h2>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">{t.calcCropType}</label>
        <select value={cropId} onChange={(e) => setCropId(e.target.value as CropId)} className="select-field">
          {cropOptions.map((crop) => <option key={crop.id} value={crop.id}>{crop.emoji} {cropName(crop.id, lang)}</option>)}
        </select>

        <label className="mt-4 mb-2 block text-[13px] font-semibold text-forest-700">{t.calcFarmSize}</label>
        <div className="flex gap-2">
          <input inputMode="decimal" value={area} onChange={(e) => setArea(e.target.value)} className="input-field" placeholder="1" />
          <span className="flex items-center rounded-xl border border-forest-200 bg-forest-50 px-4 text-sm font-medium text-forest-700">{t.calcAcres}</span>
        </div>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <p className="section-label">{t.calcEstimatedNeed}</p>
        <p className="mt-1 text-[13px] text-forest-400">{t.calcFor} {area || 0} {t.calcAcres.toLowerCase()}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{plan.totalNpk.n}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcNitrogen}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{plan.totalNpk.p}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcPhosphate}</p>
          </div>
          <div className="rounded-lg bg-forest-50 px-2 py-3">
            <p className="text-2xl font-bold text-forest-800">{plan.totalNpk.k}</p>
            <p className="mt-0.5 text-[11px] font-medium text-forest-500">{t.calcPotash}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">{t.calcProductQty}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['Urea', plan.totalFertilizerKg.urea], ['DAP', plan.totalFertilizerKg.dap], ['MOP', plan.totalFertilizerKg.mop]].map(([name, value]) => (
            <div key={name as string} className="rounded-lg border border-forest-100 bg-white px-2 py-3">
              <Scale size={16} className="mb-1.5 text-forest-400" />
              <p className="text-xs font-semibold text-forest-600">{name}</p>
              <p className="mt-1 text-lg font-bold text-forest-900">{value}<span className="ml-1 text-xs font-medium text-forest-500">kg</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-forest-900">{t.calcSchedule}</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-forest-100">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-forest-50 text-forest-600">
              <tr>
                <th className="px-3 py-2 font-semibold">Timing</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th className="px-3 py-2 text-right font-semibold">Urea</th>
                <th className="px-3 py-2 text-right font-semibold">DAP</th>
                <th className="px-3 py-2 text-right font-semibold">MOP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {plan.stages.map((stage, i) => (
                <tr key={i} className="bg-white align-top">
                  <td className="px-3 py-3 font-semibold text-forest-900 whitespace-nowrap">{stage.timing}</td>
                  <td className="px-3 py-3 leading-5 text-forest-600">{stage.note}</td>
                  <td className="px-3 py-3 text-right font-bold text-forest-800">{stage.ureaKg}<span className="font-normal text-forest-400"> kg</span></td>
                  <td className="px-3 py-3 text-right font-bold text-forest-800">{stage.dapKg}<span className="font-normal text-forest-400"> kg</span></td>
                  <td className="px-3 py-3 text-right font-bold text-forest-800">{stage.mopKg}<span className="font-normal text-forest-400"> kg</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
          <Droplets size={15} className="mt-0.5 shrink-0 text-amber-700" />{t.calcWaterAfter}
        </div>
        {plan.note && (
          <div className="mt-3 flex gap-2 rounded-lg bg-forest-50 px-3 py-2.5 text-xs leading-5 text-forest-700">
            <Check size={15} className="mt-0.5 shrink-0 text-forest-500" />{plan.note}
          </div>
        )}
      </div>
    </section>
  );
}
