import type { CropId } from './types';

export interface CropInfo {
  season: string;
  water: string;
  soil: string;
  tip: string;
}

export const cropInfo: Record<CropId, CropInfo> = {
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
};
