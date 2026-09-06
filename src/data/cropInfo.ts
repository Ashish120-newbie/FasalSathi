import type { CropId } from './types';

export interface CropInfo {
  season: string;
  water: string;
  soil: string;
  tip: string;
}

export const cropInfo: Record<string, CropInfo> = {
  // Original 16 Crops
  wheat: { season: 'Rabi (Oct–Nov sowing, Mar–Apr harvest)', water: '4–6 irrigations, moderate need', soil: 'Well-drained loam, pH 6.0–7.5', tip: 'First irrigation at 20–25 days is the most critical for yield.' },
  rice: { season: 'Kharif (Jun–Jul sowing, Oct–Nov harvest)', water: 'High — standing water 5cm during vegetative stage', soil: 'Clayey loam, retains water well', tip: 'Transplant 25–30 day old seedlings for best establishment.' },
  cotton: { season: 'Kharif (Apr–May sowing, Oct–Jan harvest)', water: 'Moderate, drought-tolerant but yield-sensitive at flowering', soil: 'Black cotton soil (regur) or well-drained loam', tip: 'Avoid waterlogging — cotton roots are highly sensitive to it.' },
  tomato: { season: 'Year-round (varies by region), best in Rabi', water: 'Frequent light watering, avoid wetting leaves', soil: 'Well-drained sandy loam, pH 6.0–7.0', tip: 'Stake or support plants to reduce fruit rot from soil contact.' },
  potato: { season: 'Rabi (Oct–Nov planting, Jan–Feb harvest)', water: 'Regular, light irrigation — sensitive to both drought and waterlogging', soil: 'Loose, well-drained sandy loam', tip: 'Earthing up (mounding soil) at 25–30 days improves tuber size.' },
  sugarcane: { season: 'Year-round planting, 10–12 month crop', water: 'High — needs 250–300cm total over the season', soil: 'Deep, well-drained loam to clay loam', tip: 'Timely earthing up prevents lodging (crop falling over).' },
  maize: { season: 'Kharif and Rabi both possible', water: 'Moderate, sensitive at tasseling/silking stage', soil: 'Well-drained loam, pH 5.5–7.5', tip: 'Never let the crop face water stress during flowering — biggest yield risk.' },
  soybean: { season: 'Kharif (Jun–Jul sowing)', water: 'Moderate, rain-fed in most regions', soil: 'Well-drained loam, pH 6.0–7.5', tip: 'Being a legume, it fixes its own nitrogen — avoid over-fertilizing with N.' },
  groundnut: { season: 'Kharif and Rabi (irrigated)', water: 'Moderate, critical during pegging/pod formation', soil: 'Well-drained sandy loam', tip: 'Apply gypsum at flowering — greatly improves pod filling.' },
  mustard: { season: 'Rabi (Oct sowing, Feb–Mar harvest)', water: 'Low-moderate, 2–3 irrigations sufficient', soil: 'Well-drained loam', tip: 'First irrigation at 25–30 days after sowing is most important.' },
  chickpea: { season: 'Rabi (Oct–Nov sowing)', water: 'Low — mostly rain-fed, avoid overwatering', soil: 'Well-drained loam, pH 6.0–7.5', tip: 'Avoid irrigation close to flowering — encourages excess vegetative growth over pods.' },
  onion: { season: 'Rabi or Kharif depending on region', water: 'Frequent light irrigation, stop 2–3 weeks before harvest', soil: 'Well-drained sandy loam, pH 6.0–7.0', tip: 'Stopping irrigation before harvest helps bulbs cure and store longer.' },
  chili: { season: 'Year-round, peak Kharif/Rabi transition', water: 'Regular, moderate — avoid waterlogging', soil: 'Well-drained sandy loam, pH 6.0–7.0', tip: 'Remove early flower buds to encourage stronger plant establishment first.' },
  banana: { season: 'Year-round planting', water: 'High, consistent — very sensitive to drought', soil: 'Deep, rich loam with good drainage', tip: 'Propping mature plants prevents wind/fruit-weight damage.' },
  brinjal: { season: 'Year-round, best Kharif and Rabi', water: 'Regular, moderate', soil: 'Well-drained loam, pH 5.5–6.5', tip: 'Regular harvesting of mature fruits encourages continuous flowering.' },
  okra: { season: 'Kharif and summer crop', water: 'Moderate, regular watering in dry spells', soil: 'Well-drained sandy loam', tip: 'Harvest pods young (3–4 days after flowering) — overripe pods turn fibrous.' },

  // New 20 Crops
  sunflower: { season: 'Rabi and Zaid (Spring)', water: 'Low to moderate, drought-tolerant', soil: 'Well-drained sandy loam to clay', tip: 'Ensure adequate spacing to allow large flower heads to develop without lodging.' },
  sorghum: { season: 'Kharif and Rabi', water: 'Low, highly drought-resistant', soil: 'Wide range, prefers heavy loam', tip: 'Harvest when seeds are hard and moisture content is around 12% to prevent spoilage.' },
  pearl_millet: { season: 'Kharif', water: 'Very low, thrives in arid regions', soil: 'Light sandy soils, well-drained', tip: 'Highly sensitive to waterlogging; ensure fields do not pool water after heavy rains.' },
  pigeon_pea: { season: 'Kharif', water: 'Moderate, deep taproot provides drought tolerance', soil: 'Well-drained loam, pH 6.5–7.5', tip: 'Avoid continuous cropping in the same field to reduce the risk of Fusarium wilt.' },
  black_gram: { season: 'Kharif and Zaid', water: 'Low, rain-fed', soil: 'Heavy clay loam', tip: 'Seed treatment with Rhizobium culture significantly boosts nitrogen fixation.' },
  green_gram: { season: 'Kharif and Zaid', water: 'Low, sensitive to waterlogging', soil: 'Well-drained loamy soil', tip: 'Harvest promptly when pods turn black to prevent shattering in the field.' },
  sesame: { season: 'Kharif and Zaid', water: 'Low, susceptible to excess moisture', soil: 'Well-drained light loam', tip: 'Thinning 15 days after sowing is critical to ensure proper plant density.' },
  castor: { season: 'Kharif', water: 'Low to moderate, drought-tolerant', soil: 'Deep, well-drained sandy loam', tip: 'Nipping the main shoot encourages branching and increases overall seed yield.' },
  linseed: { season: 'Rabi', water: 'Low, mostly rain-fed', soil: 'Clay loam, retains moisture well', tip: 'Maintain weed-free conditions during the first 30 days as early growth is slow.' },
  safflower: { season: 'Rabi', water: 'Low, extremely drought-tolerant due to deep roots', soil: 'Deep, well-drained heavy soil', tip: 'Avoid sowing in fields with a history of severe soil-borne diseases.' },
  tea: { season: 'Perennial', water: 'High, evenly distributed rainfall essential', soil: 'Acidic (pH 4.5–5.5), deep, well-drained', tip: "Regular pruning is necessary to maintain the 'plucking table' and stimulate new shoot growth." },
  coffee: { season: 'Perennial', water: 'High, requires distinct dry spell for flowering', soil: 'Deep, rich organic loam', tip: 'Maintain appropriate shade tree cover to regulate temperature and prevent over-bearing.' },
  rubber: { season: 'Perennial', water: 'High and uniform throughout the year', soil: 'Deep, well-drained lateritic soils', tip: 'Adopt scientific tapping methods to maximize yield while preserving the economic life of the tree.' },
  coconut: { season: 'Perennial', water: 'High, requires well-distributed rainfall or irrigation', soil: 'Sandy, coastal, or well-drained red loam', tip: 'Apply organic manure and fertilizer in trenches around the base to improve root absorption.' },
  cashew: { season: 'Perennial', water: 'Moderate, highly drought-tolerant once established', soil: 'Poor, degraded sandy or laterite soils', tip: 'Pruning lower branches and dead wood improves aeration and reduces pest incidence.' },
  black_pepper: { season: 'Perennial', water: 'High, requires humid conditions', soil: 'Rich, well-drained forest loam', tip: 'Ensure proper support trees (standards) are planted well in advance of the pepper vines.' },
  cardamom: { season: 'Perennial', water: 'High, prefers continuous soil moisture', soil: 'Rich organic forest soil, pH 5.5–6.5', tip: 'Maintain 50–60% filtered shade; direct sunlight severely impacts growth and yield.' },
  ginger: { season: 'Kharif (Apr–May planting)', water: 'Moderate, highly sensitive to waterlogging', soil: 'Well-drained sandy loam, rich in humus', tip: 'Use disease-free seed rhizomes and treat with fungicide before planting to prevent soft rot.' },
  turmeric: { season: 'Kharif (May–Jun planting)', water: 'Moderate, requires consistent moisture during growth', soil: 'Well-drained friable loam', tip: 'Boiling and drying the harvested rhizomes correctly is crucial for achieving market-grade color.' },
  garlic: { season: 'Rabi (Oct–Nov planting)', water: 'Moderate, frequent light irrigations', soil: 'Well-drained loam, pH 6.5–7.5', tip: 'Stop irrigation two weeks prior to harvest to ensure proper curing of the bulbs.' }
};