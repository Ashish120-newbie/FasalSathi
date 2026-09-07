import type { CropId } from './types';

export interface CultivationTipCategory {
  sowing: string[];
  spacing: string[];
  irrigation: string[];
  fertilization: string[];
  pestWatch: string[];
  harvest: string[];
  storage: string[];
}

export const cultivationTips: Partial<Record<CropId, CultivationTipCategory>> = {
  wheat: {
    sowing: [
      'Use certified disease-resistant seed varieties (e.g. HD-2967, PBW-343 depending on region).',
      'Sow at 5-6 cm depth — too shallow risks poor germination, too deep delays emergence.',
      'Ideal sowing window: mid-October to end of November for irrigated wheat.',
      'Treat seed with fungicide (e.g. Carbendazim) before sowing to prevent seed-borne diseases.',
      'Ensure fine, well-leveled seedbed for uniform germination.',
    ],
    spacing: [
      'Maintain row spacing of 20-22.5 cm for optimal tillering.',
      'Seed rate of 100-125 kg/hectare depending on variety and sowing method.',
      'Line sowing gives better yield than broadcasting — use a seed drill if available.',
      'Adjust seed rate upward by 20-25% for late sowing to compensate for reduced tillering.',
    ],
    irrigation: [
      'First irrigation (CRI stage) at 20-25 days after sowing is the most critical for yield.',
      'Total of 4-6 irrigations needed across the growing season depending on soil type.',
      'Critical stages for irrigation: crown root initiation, tillering, flowering, and grain filling.',
      'Avoid irrigation during grain hardening stage — it can delay maturity and cause lodging.',
      'Light, frequent irrigation is better than heavy, infrequent watering on sandy soils.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium at sowing as basal dose.',
      'Split nitrogen into 2-3 doses: basal, first top dressing at 21-25 days, second at 45-50 days.',
      'A soil test before sowing gives the most accurate fertilizer recommendation.',
      'Apply zinc sulfate if soil test shows deficiency — common in wheat-growing regions.',
    ],
    pestWatch: [
      'Watch for yellow rust in cool, humid weather — check leaves weekly during vegetative stage.',
      'Monitor for aphids during the grain-filling stage, especially in warm spells.',
      'Check for termite damage in sandy soils, particularly after irrigation.',
      'Watch for loose smut symptoms at flowering — remove and destroy affected plants.',
    ],
    harvest: [
      'Harvest when grains are hard and moisture content is around 12-14%.',
      'Avoid delayed harvesting — increases shattering losses and exposes grain to birds/weather.',
      'Harvest in the morning when grain moisture is slightly higher to reduce shattering.',
      'Use a combine harvester where available to reduce labor and grain loss.',
    ],
    storage: [
      'Dry grain to below 12% moisture before storage to prevent fungal growth.',
      'Store in clean, dry containers or bags, away from direct ground contact.',
      'Fumigate storage structures before filling to prevent pest infestation.',
      'Check stored grain periodically for insect activity, especially in humid months.',
    ],
  },
  rice: {
    sowing: [
      'Use 25-30 day old, healthy seedlings for transplanting.',
      'Puddle the field well before transplanting for better root establishment and weed control.',
      'Soak seeds for 24 hours and incubate for sprouting before nursery sowing.',
      'Use a nursery area of about 1/10th the size of the main field.',
    ],
    spacing: [
      'Maintain 2-3 seedlings per hill, spaced 20x15 cm apart.',
      'Wider spacing in fertile soils reduces disease pressure and improves airflow.',
      'Transplant in rows for easier weeding and better light penetration.',
    ],
    irrigation: [
      'Keep standing water at 2-5 cm during vegetative growth.',
      'Drain the field 7-10 days before harvest to help even ripening.',
      'Alternate wetting and drying (AWD) can save 15-20% water without yield loss.',
      'Avoid water stress during flowering — most sensitive stage for yield.',
    ],
    fertilization: [
      'Apply full phosphorus and half potassium at transplanting.',
      'Split nitrogen: half at transplanting/tillering, remainder at panicle initiation.',
      'Apply the remaining potassium at panicle initiation for better grain filling.',
      'Avoid excess nitrogen — it increases susceptibility to pests and lodging.',
    ],
    pestWatch: [
      'Monitor for rice blast in humid conditions — check leaves and neck of panicle.',
      'Watch for stem borer and leaf folder throughout the season.',
      'Check for brown planthopper buildup, especially in dense, over-fertilized crops.',
      'Avoid excess nitrogen — it directly increases pest and disease susceptibility.',
    ],
    harvest: [
      'Harvest at 80-85% grain maturity for best milling quality and minimal breakage.',
      'Dry harvested grain promptly to below 14% moisture for storage.',
      'Avoid harvesting during rain — increases spoilage and quality loss.',
      'Thresh promptly after harvest to prevent grain discoloration.',
    ],
    storage: [
      'Dry paddy to 12-14% moisture before storage.',
      'Store in moisture-proof containers or elevated storage to avoid ground dampness.',
      'Regularly inspect for weevils and other storage pests.',
      'Avoid mixing old and new stock to reduce pest cross-contamination.',
    ],
  },
  cotton: {
    sowing: [
      'Sow with the onset of monsoon for rain-fed cotton.',
      'Treat seeds with fungicide before sowing to prevent seedling diseases.',
      'Use delinted seed for more uniform germination.',
      'Ensure soil moisture is adequate at sowing to avoid poor stand establishment.',
    ],
    spacing: [
      'Maintain 60-90 cm row spacing for good sunlight penetration.',
      'Wider spacing reduces humidity and disease buildup within the canopy.',
      'Thin to one healthy plant per hill 2-3 weeks after emergence.',
    ],
    irrigation: [
      'Cotton is drought-tolerant but yield-sensitive at flowering — avoid stress then.',
      'Avoid waterlogging — cotton roots are highly sensitive to excess water.',
      'Critical irrigation stages: squaring, flowering, and boll development.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium at sowing.',
      'Split nitrogen: half near the plant row at 30-35 days, remainder before flowering.',
      'Avoid excess nitrogen — promotes vegetative growth over boll formation.',
    ],
    pestWatch: [
      'Monitor for bollworm and whitefly regularly, especially during flowering.',
      'Watch for pink bollworm near boll formation stage — use pheromone traps.',
      'Check for mealybug infestation, particularly in dry conditions.',
      'Scout weekly during peak pest season (July-September in most regions).',
    ],
    harvest: [
      'Pick cotton promptly when bolls open fully to maintain fiber quality.',
      'Multiple pickings (2-3 rounds) give better overall yield and quality than a single harvest.',
      'Pick in dry weather to avoid fiber staining and quality loss.',
      'Store picked cotton in clean, dry bags immediately after picking.',
    ],
    storage: [
      'Store seed cotton in a dry, ventilated area away from moisture.',
      'Avoid compressing cotton too tightly, which can cause quality deterioration.',
      'Sell or process promptly to avoid prolonged storage-related quality loss.',
    ],
  },
  tomato: {
    sowing: [
      'Raise seedlings in a nursery for 25-30 days before transplanting.',
      'Harden seedlings for a few days (reduce watering) before transplanting to reduce shock.',
      'Transplant in the evening or on a cloudy day to reduce transplant stress.',
    ],
    spacing: [
      'Space plants 45-60 cm apart depending on variety and staking method.',
      'Stake or cage plants early to keep fruit off the ground and reduce rot.',
      'Maintain 90-120 cm between rows for easy access and airflow.',
    ],
    irrigation: [
      'Water at the base, not overhead, to reduce fungal disease risk.',
      'Maintain consistent soil moisture — irregular watering causes fruit cracking and blossom end rot.',
      'Reduce watering slightly as fruit begins to ripen for better flavor.',
    ],
    fertilization: [
      'Mix compost and full phosphorus into the planting hole at transplanting.',
      'Apply nitrogen and potassium in split doses at 20-25 days and again at fruit setting.',
      'Calcium supplementation helps prevent blossom end rot in fast-growing fruit.',
    ],
    pestWatch: [
      'Watch for early blight on lower leaves first — remove affected leaves promptly.',
      'Monitor for fruit borer during fruiting stage.',
      'Mulch to reduce soil-splash-related disease spread.',
      'Check for whitefly, which spreads viral diseases in tomato.',
    ],
    harvest: [
      'Harvest at the breaker stage (color change starting) for longer shelf life and transport.',
      'Handle fruit gently to avoid bruising during picking.',
      'Harvest every 2-3 days during peak season to avoid overripening on the vine.',
    ],
    storage: [
      'Store harvested tomatoes at room temperature, away from direct sunlight, for best flavor.',
      'Avoid refrigerating unripe tomatoes — it can affect ripening and flavor.',
      'Sort out any damaged fruit promptly to prevent spread of rot in storage.',
    ],
  },
  potato: {
    sowing: [
      'Plant disease-free, certified seed tubers only.',
      'Cut larger tubers into pieces with at least 2 eyes each before planting, and let cut surfaces heal for a day.',
      'Plant when soil temperature is moderate — avoid extreme heat at planting.',
    ],
    spacing: [
      'Plant at 20-25 cm spacing within rows, 60 cm between rows.',
      'Plant at a depth of 5-8 cm for good tuber development space.',
    ],
    irrigation: [
      'Maintain regular light irrigation — sensitive to both drought and waterlogging.',
      'Stop irrigation 10-15 days before harvest to help skin set and reduce rot risk.',
      'Critical irrigation stages: tuber initiation and bulking.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium in furrows at planting.',
      'Apply half nitrogen during earthing up (25-30 days), remainder at 45 days.',
      'Potassium is especially important for tuber quality and storage life.',
    ],
    pestWatch: [
      'Watch for late blight in cool, wet conditions — spreads very fast, act immediately.',
      'Earth up at 25-30 days to protect developing tubers from sunlight and pests.',
      'Monitor for aphids, which spread viral diseases between plants.',
      'Check for potato tuber moth, especially near harvest time.',
    ],
    harvest: [
      'Harvest when the foliage has died back naturally.',
      'Harvest on a dry day to reduce disease spread and skin damage.',
      'Handle tubers carefully during digging to avoid bruising.',
    ],
    storage: [
      'Cure tubers in a cool, dark, well-ventilated place for a few days before storage.',
      'Store at 4-7°C for long-term storage, away from light to prevent greening.',
      'Check stored tubers periodically and remove any showing rot.',
    ],
  },
  sugarcane: {
    sowing: [
      'Use healthy, disease-free setts (stem cuttings) with 2-3 buds each.',
      'Treat setts with fungicide before planting to prevent early rot.',
      'Plant in furrows with adequate moisture for quick sprouting.',
    ],
    spacing: [
      'Maintain 90-120 cm row spacing for mechanized operations.',
      'Wider spacing improves airflow and reduces lodging risk later in the season.',
    ],
    irrigation: [
      'Needs high, consistent water — 250-300 cm total over the season.',
      'Critical irrigation stages: germination, tillering, and grand growth phase.',
      'Reduce irrigation frequency as the crop approaches maturity to boost sugar content.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium in furrow at planting.',
      'Split nitrogen: half before earthing up (45-60 days), remainder at 90-100 days.',
      'Ensure adequate potassium — it is critical for sugar accumulation.',
    ],
    pestWatch: [
      'Earth up at 45-60 days to prevent lodging and support root development.',
      'Remove dried lower leaves periodically to reduce pest habitat.',
      'Watch for early shoot borer in the initial growth stage.',
      'Monitor for red rot, especially in waterlogged conditions.',
    ],
    harvest: [
      'Harvest when sugar content peaks, usually 10-12 months after planting.',
      'Avoid delayed harvesting — sugar content declines after peak maturity.',
      'Process or deliver to mill promptly after cutting to avoid sugar loss.',
    ],
    storage: [
      'Sugarcane deteriorates quickly after cutting — avoid storage delays before processing.',
      'If delay is unavoidable, keep cut cane shaded and moist.',
    ],
  },
  maize: {
    sowing: [
      'Sow at 3-5 cm depth in well-prepared soil.',
      'Both Kharif and Rabi sowing are possible depending on region and irrigation access.',
      'Ensure good seed-to-soil contact for uniform germination.',
    ],
    spacing: [
      'Maintain 60-75 cm row spacing, 20-25 cm within rows.',
      'Proper spacing ensures good sunlight and airflow for each plant, reducing disease risk.',
    ],
    irrigation: [
      'Never let the crop face water stress during tasseling/silking — the most yield-sensitive stage.',
      'Maintain consistent moisture through grain filling for best cob development.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium with basal dose at sowing.',
      'Split nitrogen: half as first top dressing at 25-30 days, remainder at 45-50 days.',
      'Apply nitrogen in split doses for efficient uptake and reduced leaching loss.',
    ],
    pestWatch: [
      'Scout regularly for fall armyworm, a major maize pest — check whorls for damage.',
      'Watch for stem borer in the early growth stage.',
      'Monitor for leaf blight in humid weather.',
    ],
    harvest: [
      'Harvest when husks turn brown and kernels are hard.',
      'Check kernel moisture — ideal harvest moisture is around 20-25% before drying.',
    ],
    storage: [
      'Dry harvested cobs/kernels thoroughly (to below 13% moisture) before storage.',
      'Store in pest-proof containers to prevent weevil infestation.',
    ],
  },
  soybean: {
    sowing: [
      'Treat seeds with Rhizobium culture before sowing to boost nitrogen fixation.',
      'Sow with the onset of monsoon for optimal germination.',
      'Use fresh, high-germination seed — soybean seed viability drops quickly.',
    ],
    spacing: [
      'Maintain 30-45 cm row spacing depending on variety.',
      'Avoid overly dense planting — reduces airflow and increases disease risk.',
    ],
    irrigation: [
      'Mostly rain-fed; ensure adequate moisture during pod-filling stage.',
      'Avoid waterlogging, which soybean tolerates poorly.',
    ],
    fertilization: [
      'Apply full phosphorus, potassium and a small starter dose of nitrogen at sowing.',
      'Avoid over-fertilizing with nitrogen — soybean fixes its own nitrogen as a legume.',
      'Additional nitrogen only if plants show visible deficiency symptoms.',
    ],
    pestWatch: [
      'Control weeds in the first 30 days — soybean is a poor early competitor.',
      'Watch for yellow mosaic virus, spread by whiteflies.',
      'Monitor for stem fly and defoliating caterpillars during vegetative growth.',
    ],
    harvest: [
      'Harvest promptly at maturity to avoid pod shattering losses.',
      'Harvest when pods rattle and leaves have mostly dropped.',
    ],
    storage: [
      'Dry seed to below 12% moisture before storage.',
      'Store in cool, dry, pest-free conditions to maintain seed viability.',
    ],
  },
  groundnut: {
    sowing: [
      'Use healthy, well-graded seed for uniform germination.',
      'Sow at the start of monsoon for Kharif crop, or with irrigation for Rabi.',
      'Treat seed with Rhizobium and fungicide before sowing.',
    ],
    spacing: [
      'Maintain 30 cm row spacing, 10-15 cm within rows.',
      'Ensure loose, well-aerated soil for easy pegging (pod formation into soil).',
    ],
    irrigation: [
      'Avoid water stress during flowering and pegging stage — most critical period.',
      'Reduce irrigation slightly near maturity to aid pod development.',
    ],
    fertilization: [
      'Apply full phosphorus, potassium and starter nitrogen with basal dose.',
      'Apply gypsum at flowering — greatly improves pod filling and kernel quality.',
      'Avoid excess nitrogen — groundnut fixes its own as a legume crop.',
    ],
    pestWatch: [
      'Watch for Tikka leaf spot, especially in humid weather.',
      'Rotate with a cereal crop to reduce soil-borne disease buildup.',
      'Monitor for leaf miner and aphid activity during vegetative growth.',
    ],
    harvest: [
      'Harvest when leaves start yellowing and pods show mature veining inside.',
      'Dig carefully to minimize pod loss in the soil.',
    ],
    storage: [
      'Dry pods thoroughly before storage to prevent aflatoxin contamination.',
      'Store in a cool, dry, well-ventilated space away from moisture.',
    ],
  },
  mustard: {
    sowing: [
      'Sow at the right time — delayed sowing significantly reduces yield.',
      'Ideal sowing window is early-to-mid October in most regions.',
      'Ensure adequate soil moisture at sowing for uniform germination.',
    ],
    spacing: [
      'Thin seedlings to maintain 10-15 cm spacing for better branching.',
      'Maintain 30 cm row spacing for good airflow.',
    ],
    irrigation: [
      'First irrigation at 25-30 days after sowing is the most critical.',
      '2-3 irrigations are usually sufficient for the whole season.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium with basal dose at sowing.',
      'Split nitrogen: half as first top dressing at 30-35 days, remainder at 50-55 days.',
    ],
    pestWatch: [
      'Watch for aphid infestation, especially during flowering — a major yield-limiting pest.',
      'Monitor for white rust in cool, humid conditions.',
    ],
    harvest: [
      'Harvest when pods turn yellow-brown and seeds rattle inside.',
      'Avoid delayed harvest — increases shattering losses significantly.',
    ],
    storage: [
      'Dry seed thoroughly before storage to prevent mold.',
      'Store in airtight containers to preserve oil content and quality.',
    ],
  },
  chickpea: {
    sowing: [
      'Treat seed with Rhizobium and fungicide before sowing.',
      'Sow after the monsoon retreats, typically October-November.',
      'Ensure good soil moisture at sowing for uniform germination.',
    ],
    spacing: [
      'Maintain 30 cm row spacing, 10 cm within rows.',
      'Avoid overly dense planting to reduce humidity around plants.',
    ],
    irrigation: [
      'Avoid excess irrigation — it promotes vegetative growth over pod formation.',
      'A single light irrigation at flowering, if needed, is usually sufficient.',
    ],
    fertilization: [
      'Apply full phosphorus, potassium and starter nitrogen with basal dose.',
      'Additional nitrogen only if plants show visible deficiency.',
    ],
    pestWatch: [
      'Monitor for pod borer, a major pest at flowering — use pheromone traps if available.',
      'Avoid growing in the same field consecutively to reduce Fusarium wilt buildup.',
    ],
    harvest: [
      'Harvest when plants turn yellow-brown and pods are dry.',
      'Thresh promptly after harvest to avoid moisture damage.',
    ],
    storage: [
      'Store dried seed in a cool, dry, pest-free environment.',
      'Check periodically for bruchid beetle infestation during storage.',
    ],
  },
  onion: {
    sowing: [
      'Use healthy transplants, ideally 6-8 weeks old.',
      'Raise seedlings in a well-prepared, weed-free nursery bed.',
    ],
    spacing: [
      'Maintain 15 cm row spacing, 10 cm within rows.',
      'Proper spacing improves bulb size and uniformity.',
    ],
    irrigation: [
      'Maintain frequent light irrigation, but avoid waterlogging.',
      'Stop irrigation 2-3 weeks before harvest to help bulbs cure properly.',
    ],
    fertilization: [
      'Apply full phosphorus and half potassium at transplanting.',
      'Split nitrogen: half at 30 days, remainder along with the rest of potassium at 60 days.',
    ],
    pestWatch: [
      'Watch for purple blotch in warm, humid weather.',
      'Avoid overhead irrigation, especially in the evening, to reduce disease risk.',
      'Ensure good field drainage to prevent bulb rot.',
    ],
    harvest: [
      'Harvest when tops fall over and start drying naturally.',
      'Handle bulbs carefully to avoid bruising during harvest.',
    ],
    storage: [
      'Cure harvested bulbs in shade for a few days before storage.',
      'Store in a cool, dry, well-ventilated place to extend shelf life significantly.',
    ],
  },
  chili: {
    sowing: [
      'Raise seedlings in a nursery for 4-6 weeks before transplanting.',
      'Remove early flower buds after transplanting to help root establishment first.',
    ],
    spacing: [
      'Maintain 45-60 cm row spacing depending on variety.',
      'Stake plants in windy areas to prevent lodging under fruit weight.',
    ],
    irrigation: [
      'Maintain consistent soil moisture — water stress causes flower drop and small fruit.',
      'Avoid waterlogging, which promotes root rot and bacterial wilt.',
      'Reduce irrigation slightly as fruit turns red to improve quality and color.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium at transplanting as basal dose.',
      'Split nitrogen into 2-3 doses: basal, at 30 days, and at first fruit set.',
      'Avoid excess nitrogen — promotes vegetative growth over fruit production.',
    ],
    pestWatch: [
      'Monitor for thrips, which cause leaf curling and transmit viral diseases.',
      'Watch for fruit borer during fruiting — a major yield-limiting pest.',
      'Check for aphids and mites, especially in dry conditions.',
      'Use neem-based sprays as an early organic intervention before escalating to chemicals.',
    ],
    harvest: [
      'Harvest green chilies when fully sized but still firm, red chilies when fully colored.',
      'Pick regularly to encourage continued flowering and fruiting.',
      'Handle carefully to avoid bruising, which reduces shelf life.',
    ],
    storage: [
      'Store fresh chilies in a cool, dry place or refrigerate for short-term use.',
      'For dried chili, sun-dry thoroughly to below 10% moisture before storage.',
      'Store dried chilies in airtight containers away from moisture and light to preserve color.',
    ],
  },
  banana: {
    sowing: [
      'Use disease-free tissue culture plantlets or healthy suckers for planting.',
      'Plant at the beginning of the monsoon or with irrigation for best establishment.',
      'Apply well-rotted farmyard manure in the pit before planting.',
    ],
    spacing: [
      'Maintain 2x2 m spacing for most varieties — closer spacing reduces bunch size.',
      'Wider spacing improves airflow and reduces Sigatoka leaf spot pressure.',
    ],
    irrigation: [
      'Banana needs consistent, high water throughout its growth cycle.',
      'Drip irrigation is ideal — improves yield and water use efficiency.',
      'Avoid water stress during flowering and bunch filling stages.',
    ],
    fertilization: [
      'Apply nitrogen in frequent small doses — banana is a heavy nitrogen feeder.',
      'Apply full phosphorus and potassium at planting, then top-dress potassium at flowering.',
      'Apply farmyard manure or compost regularly to maintain soil organic matter.',
    ],
    pestWatch: [
      'Watch for Sigatoka leaf spot in humid conditions — remove affected leaves.',
      'Monitor for banana aphid, which spreads Banana Bunchy Top virus.',
      'Check for rhizome weevil, especially in poorly drained soils.',
      'Remove and destroy infected plants to prevent disease spread.',
    ],
    harvest: [
      'Harvest when fruits are plump and angles are rounding — maturity varies by variety.',
      'Cut the bunch with a portion of the stalk attached to reduce handling damage.',
      'Support the bunch during harvest to prevent fruit bruising.',
    ],
    storage: [
      'Ripen fruits at room temperature — avoid direct sunlight.',
      'For longer storage, harvest slightly green and store at 13-14°C.',
      'Avoid storing near other ripe fruits unless rapid ripening is desired.',
    ],
  },
  brinjal: {
    sowing: [
      'Raise seedlings in a nursery for 4-6 weeks before transplanting.',
      'Harden seedlings by reducing watering a few days before transplanting.',
    ],
    spacing: [
      'Maintain 60-75 cm row spacing, 45-60 cm within rows depending on variety.',
      'Proper spacing improves airflow and reduces pest and disease pressure.',
    ],
    irrigation: [
      'Maintain consistent soil moisture — water stress causes poor fruit set and bitter fruit.',
      'Avoid overhead irrigation to reduce fungal disease risk.',
      'Critical irrigation stages: flowering and fruit development.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium at transplanting as basal dose.',
      'Split nitrogen: half at 25-30 days, remainder at first fruit set.',
      'Top-dress with nitrogen after each major harvest to sustain flowering.',
    ],
    pestWatch: [
      'Monitor for shoot and fruit borer — the most damaging brinjal pest.',
      'Watch for aphids and jassids, which suck plant sap and reduce vigor.',
      'Use pheromone traps and regular scouting for early borer detection.',
    ],
    harvest: [
      'Harvest when fruit is glossy and firm, before seeds harden and skin dulls.',
      'Cut fruit with a short stem attached to extend shelf life.',
      'Pick regularly to encourage continued fruiting.',
    ],
    storage: [
      'Store fresh brinjal in a cool place or refrigerate for short-term use.',
      'Avoid storing at very low temperatures — causes chilling injury and browning.',
      'Handle carefully to prevent bruising and skin damage.',
    ],
  },
  okra: {
    sowing: [
      'Sow seeds directly in the field at 2-3 cm depth.',
      'Soak seeds overnight before sowing to improve germination rate.',
      'Ideal sowing time is at the onset of monsoon or in early summer with irrigation.',
    ],
    spacing: [
      'Maintain 45-60 cm row spacing, 20-30 cm within rows.',
      'Thin seedlings to one plant per hill after establishment.',
    ],
    irrigation: [
      'Maintain moderate, consistent soil moisture for tender pod development.',
      'Avoid water stress during flowering — causes flower drop and tough pods.',
      'Light, frequent irrigation is better than heavy watering on lighter soils.',
    ],
    fertilization: [
      'Apply full phosphorus and potassium at sowing as basal dose.',
      'Split nitrogen: half at 20-25 days, remainder at 40-45 days.',
      'Top-dress lightly after each picking to sustain pod production.',
    ],
    pestWatch: [
      'Monitor for fruit borer, which damages pods directly.',
      'Watch for aphids and whitefly, which suck sap and spread viral diseases.',
      'Check for yellow vein mosaic virus — remove and destroy infected plants.',
    ],
    harvest: [
      'Harvest pods when tender, about 4-5 days after flowering — delayed harvest makes pods tough.',
      'Pick every 2-3 days during peak season to maintain quality and encourage fruiting.',
      'Use scissors or a knife to cut pods to avoid damaging the plant.',
    ],
    storage: [
      'Store fresh okra in a cool place or refrigerate for short-term use.',
      'Avoid storing below 7°C — causes chilling injury and browning.',
      'Use within 2-3 days for best quality, as pods toughen quickly after harvest.',
    ],
  },
};
