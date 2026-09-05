import type { CropId, FertilizerPlan, StageResult } from './types';

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

interface StageSplit {
  timing: string;
  note: string;
  n: number;
  p: number;
  k: number;
}

const stageSplits: Record<CropId, StageSplit[]> = {
  wheat: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium with basal dose', n: 0, p: 1, k: 1 },
    { timing: '21–25 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, k: 0, p: 0 },
    { timing: '45–50 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
  rice: [
    { timing: 'At transplanting', note: 'Apply full phosphorus and half potassium', n: 0, p: 1, k: 0.5 },
    { timing: '20–25 days', note: 'Apply half nitrogen as top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '40–45 days', note: 'Apply remaining nitrogen and potassium', n: 0.5, p: 0, k: 0.5 },
  ],
  cotton: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium', n: 0, p: 1, k: 1 },
    { timing: '30–35 days', note: 'Apply half nitrogen near the plant row', n: 0.5, p: 0, k: 0 },
    { timing: '60–70 days', note: 'Apply remaining nitrogen before flowering', n: 0.5, p: 0, k: 0 },
  ],
  tomato: [
    { timing: 'At transplanting', note: 'Mix compost and full phosphorus in the planting hole', n: 0, p: 1, k: 0.5 },
    { timing: '20–25 days', note: 'Apply first nitrogen and potassium dose', n: 0.5, p: 0, k: 0.25 },
    { timing: '45–50 days', note: 'Repeat during fruit setting', n: 0.5, p: 0, k: 0.25 },
  ],
  potato: [
    { timing: 'At planting', note: 'Apply full phosphorus and potassium in furrows', n: 0, p: 1, k: 1 },
    { timing: '25–30 days', note: 'Apply half nitrogen during earthing up', n: 0.5, p: 0, k: 0 },
    { timing: '45 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
  sugarcane: [
    { timing: 'At planting', note: 'Apply full phosphorus and potassium in furrow', n: 0, p: 1, k: 1 },
    { timing: '45–60 days', note: 'Apply half nitrogen before earthing up', n: 0.5, p: 0, k: 0 },
    { timing: '90–100 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
  maize: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium with basal dose', n: 0, p: 1, k: 1 },
    { timing: '25–30 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '45–50 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
  soybean: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium as basal dose', n: 0, p: 1, k: 1 },
    { timing: '30–35 days', note: 'Apply remaining nitrogen if needed', n: 1, p: 0, k: 0 },
  ],
  groundnut: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium with basal dose', n: 0, p: 1, k: 1 },
    { timing: '30 days', note: 'Apply gypsum for calcium supply', n: 1, p: 0, k: 0 },
  ],
  mustard: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium with basal dose', n: 0, p: 1, k: 1 },
    { timing: '30–35 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '50–55 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
  chickpea: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium with basal dose', n: 0, p: 1, k: 1 },
    { timing: '35–40 days', note: 'Apply remaining nitrogen if needed', n: 1, p: 0, k: 0 },
  ],
  onion: [
    { timing: 'At transplanting', note: 'Apply full phosphorus and half potassium', n: 0, p: 1, k: 0.5 },
    { timing: '30 days', note: 'Apply half nitrogen as top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '60 days', note: 'Apply remaining nitrogen and potassium', n: 0.5, p: 0, k: 0.5 },
  ],
  chili: [
    { timing: 'At transplanting', note: 'Apply full phosphorus and half potassium', n: 0, p: 1, k: 0.5 },
    { timing: '25–30 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '50–60 days', note: 'Apply remaining nitrogen and potassium', n: 0.5, p: 0, k: 0.5 },
  ],
  banana: [
    { timing: 'At planting', note: 'Apply full phosphorus and half potassium in pit', n: 0, p: 1, k: 0.5 },
    { timing: '60–90 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '150–180 days', note: 'Apply remaining nitrogen and potassium', n: 0.5, p: 0, k: 0.5 },
  ],
  brinjal: [
    { timing: 'At transplanting', note: 'Apply full phosphorus and half potassium', n: 0, p: 1, k: 0.5 },
    { timing: '25–30 days', note: 'Apply half nitrogen as first top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '50–55 days', note: 'Apply remaining nitrogen and potassium', n: 0.5, p: 0, k: 0.5 },
  ],
  okra: [
    { timing: 'At sowing', note: 'Apply full phosphorus and potassium as basal dose', n: 0, p: 1, k: 1 },
    { timing: '25–30 days', note: 'Apply half nitrogen as top dressing', n: 0.5, p: 0, k: 0 },
    { timing: '45–50 days', note: 'Apply remaining nitrogen', n: 0.5, p: 0, k: 0 },
  ],
};

const UREA_N_FRACTION = 0.46;
const DAP_P_FRACTION = 0.46;
const MOP_K_FRACTION = 0.60;

export function getSupportedCrops(): CropId[] {
  return Object.keys(baseNpk) as CropId[];
}

export function getFertilizerPlan(cropId: CropId, landSizeAcres: number): FertilizerPlan {
  const npk = baseNpk[cropId];
  const splits = stageSplits[cropId];
  const acres = Math.max(landSizeAcres, 0);

  const totalN = npk.n * acres;
  const totalP = npk.p * acres;
  const totalK = npk.k * acres;

  const stages: StageResult[] = splits.map((s) => {
    const n = Math.round(totalN * s.n);
    const p = Math.round(totalP * s.p);
    const k = Math.round(totalK * s.k);
    return {
      timing: s.timing,
      note: s.note,
      n,
      p,
      k,
      ureaKg: Math.round(n / UREA_N_FRACTION),
      dapKg: Math.round(p / DAP_P_FRACTION),
      mopKg: Math.round(k / MOP_K_FRACTION),
    };
  });

  const totalUrea = Math.round(totalN / UREA_N_FRACTION);
  const totalDap = Math.round(totalP / DAP_P_FRACTION);
  const totalMop = Math.round(totalK / MOP_K_FRACTION);

  return {
    cropId,
    landSizeAcres: acres,
    totalNpk: { n: Math.round(totalN), p: Math.round(totalP), k: Math.round(totalK) },
    totalFertilizerKg: { urea: totalUrea, dap: totalDap, mop: totalMop },
    stages,
    note: 'These are general recommendations based on standard crop requirements. A soil test gives the most accurate advice. Water after applying fertilizer, unless rain is expected within 24 hours.',
  };
}
