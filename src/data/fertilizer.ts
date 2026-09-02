import type { CropId, FertilizerPlan, GrowthStage } from './types';

const baseNpk: Record<CropId, { n: number; p: number; k: number }> = {
  wheat: { n: 120, p: 60, k: 40 },
  rice: { n: 100, p: 50, k: 50 },
  cotton: { n: 100, p: 50, k: 50 },
  tomato: { n: 120, p: 80, k: 100 },
  potato: { n: 150, p: 75, k: 100 },
  sugarcane: { n: 250, p: 115, k: 115 },
  maize: { n: 120, p: 60, k: 40 },
  soybean: { n: 30, p: 60, k: 40 },
  groundnut: { n: 25, p: 50, k: 50 },
  mustard: { n: 80, p: 40, k: 40 },
  chickpea: { n: 20, p: 50, k: 30 },
  onion: { n: 100, p: 60, k: 80 },
  chili: { n: 100, p: 60, k: 60 },
  banana: { n: 200, p: 90, k: 200 },
  brinjal: { n: 100, p: 60, k: 60 },
  okra: { n: 80, p: 50, k: 50 },
};

const schedules: Record<CropId, { timing: string; action: string }[]> = {
  wheat: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium with basal dose' }, { timing: '21–25 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '45–50 days', action: 'Apply remaining nitrogen' }],
  rice: [{ timing: 'At transplanting', action: 'Apply full phosphorus and half potassium' }, { timing: '20–25 days', action: 'Apply half nitrogen as top dressing' }, { timing: '40–45 days', action: 'Apply remaining nitrogen and potassium' }],
  cotton: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium' }, { timing: '30–35 days', action: 'Apply half nitrogen near the plant row' }, { timing: '60–70 days', action: 'Apply remaining nitrogen before flowering' }],
  tomato: [{ timing: 'At transplanting', action: 'Mix compost and full phosphorus in the planting hole' }, { timing: '20–25 days', action: 'Apply first nitrogen and potassium dose' }, { timing: '45–50 days', action: 'Repeat during fruit setting' }],
  potato: [{ timing: 'At planting', action: 'Apply full phosphorus and potassium in furrows' }, { timing: '25–30 days', action: 'Apply half nitrogen during earthing up' }, { timing: '45 days', action: 'Apply remaining nitrogen' }],
  sugarcane: [{ timing: 'At planting', action: 'Apply full phosphorus and potassium in furrow' }, { timing: '45–60 days', action: 'Apply half nitrogen before earthing up' }, { timing: '90–100 days', action: 'Apply remaining nitrogen' }],
  maize: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium with basal dose' }, { timing: '25–30 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '45–50 days', action: 'Apply remaining nitrogen' }],
  soybean: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium as basal dose' }, { timing: '30–35 days', action: 'Apply remaining nitrogen if needed' }],
  groundnut: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium with basal dose' }, { timing: '30 days', action: 'Apply gypsum for calcium supply' }],
  mustard: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium with basal dose' }, { timing: '30–35 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '50–55 days', action: 'Apply remaining nitrogen' }],
  chickpea: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium with basal dose' }, { timing: '35–40 days', action: 'Apply remaining nitrogen if needed' }],
  onion: [{ timing: 'At transplanting', action: 'Apply full phosphorus and half potassium' }, { timing: '30 days', action: 'Apply half nitrogen as top dressing' }, { timing: '60 days', action: 'Apply remaining nitrogen and potassium' }],
  chili: [{ timing: 'At transplanting', action: 'Apply full phosphorus and half potassium' }, { timing: '25–30 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '50–60 days', action: 'Apply remaining nitrogen and potassium' }],
  banana: [{ timing: 'At planting', action: 'Apply full phosphorus and half potassium in pit' }, { timing: '60–90 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '150–180 days', action: 'Apply remaining nitrogen and potassium' }],
  brinjal: [{ timing: 'At transplanting', action: 'Apply full phosphorus and half potassium' }, { timing: '25–30 days', action: 'Apply half nitrogen as first top dressing' }, { timing: '50–55 days', action: 'Apply remaining nitrogen and potassium' }],
  okra: [{ timing: 'At sowing', action: 'Apply full phosphorus and potassium as basal dose' }, { timing: '25–30 days', action: 'Apply half nitrogen as top dressing' }, { timing: '45–50 days', action: 'Apply remaining nitrogen' }],
};

export function getFertilizerPlan(cropId: CropId, growthStage: GrowthStage): FertilizerPlan {
  const npk = baseNpk[cropId];
  const factor = growthStage === 'seedling' ? 0.25 : growthStage === 'maturity' ? 0 : 0.5;
  return {
    cropId,
    growthStage,
    npk: { n: Math.round(npk.n * factor), p: Math.round(npk.p * factor), k: Math.round(npk.k * factor) },
    unitsPerAcre: { urea: Math.round(npk.n * factor * 2.17), dap: Math.round(npk.p * factor * 2.17), mop: Math.round(npk.k * factor * 1.67) },
    schedule: schedules[cropId],
  };
}
