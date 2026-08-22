import type { Crop, CropId, GrowthStage } from './types';
import type { Language } from './i18n';

export const crops: Crop[] = [
  { id: 'wheat', name: 'Wheat', emoji: '🌾', stages: ['seedling', 'vegetative', 'flowering', 'grain-filling', 'maturity'] },
  { id: 'rice', name: 'Rice', emoji: '🌿', stages: ['seedling', 'vegetative', 'flowering', 'grain-filling', 'maturity'] },
  { id: 'cotton', name: 'Cotton', emoji: '☁️', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'potato', name: 'Potato', emoji: '🥔', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'sugarcane', name: 'Sugarcane', emoji: '🎋', stages: ['seedling', 'vegetative', 'maturity'] },
  { id: 'maize', name: 'Maize', emoji: '🌽', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'soybean', name: 'Soybean', emoji: '🫘', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'groundnut', name: 'Groundnut', emoji: '🥜', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'mustard', name: 'Mustard', emoji: '🌼', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'chickpea', name: 'Chickpea', emoji: '🟡', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'onion', name: 'Onion', emoji: '🧅', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'chili', name: 'Chili', emoji: '🌶️', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'banana', name: 'Banana', emoji: '🍌', stages: ['seedling', 'vegetative', 'maturity'] },
  { id: 'brinjal', name: 'Brinjal', emoji: '🍆', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
  { id: 'okra', name: 'Okra', emoji: '🟢', stages: ['seedling', 'vegetative', 'flowering', 'maturity'] },
];

export const growthStages: { id: GrowthStage; name: string }[] = [
  { id: 'seedling', name: 'Seedling' },
  { id: 'vegetative', name: 'Growing / Vegetative' },
  { id: 'flowering', name: 'Flowering' },
  { id: 'grain-filling', name: 'Grain filling' },
  { id: 'maturity', name: 'Maturity / Harvest' },
];

export const cropById = (id: CropId) => crops.find((crop) => crop.id === id) ?? crops[0];
export const stageName = (id: GrowthStage) => growthStages.find((stage) => stage.id === id)?.name ?? id;

const cropNameTranslations: Record<CropId, Record<Language, string>> = {
  wheat: { en: 'Wheat', hi: 'गेहूं', bn: 'গম', te: 'గోధుమ', mr: 'गहू', ta: 'கோதுமை' },
  rice: { en: 'Rice', hi: 'धान', bn: 'ধান', te: 'వరి', mr: 'तांदूळ', ta: 'நெல்' },
  cotton: { en: 'Cotton', hi: 'कपास', bn: 'তুলা', te: 'పత్తి', mr: 'कापूस', ta: 'பருத்தி' },
  tomato: { en: 'Tomato', hi: 'टमाटर', bn: 'টমেটো', te: 'టమాట', mr: 'टोमॅटो', ta: 'தக்காளி' },
  potato: { en: 'Potato', hi: 'आलू', bn: 'আলু', te: 'బంగాళదుంప', mr: 'बटाटा', ta: 'உருளைக்கிழங்கு' },
  sugarcane: { en: 'Sugarcane', hi: 'गन्ना', bn: 'আখ', te: 'చెరకు', mr: 'ऊस', ta: 'கரும்பு' },
  maize: { en: 'Maize', hi: 'मक्का', bn: 'ভুট্টা', te: 'మొక్కజొన్ను', mr: 'मका', ta: 'மக்காச்சோளம்' },
  soybean: { en: 'Soybean', hi: 'सोयाबीन', bn: 'সয়াবিন', te: 'సోయాబీన్', mr: 'सोयाबीन', ta: 'சோயாபீன்ஸ்' },
  groundnut: { en: 'Groundnut', hi: 'मूंगफली', bn: 'চিনাবাদাম', te: 'వేరుశనగ', mr: 'भुईमूग', ta: 'நிலக்கடலை' },
  mustard: { en: 'Mustard', hi: 'सरसों', bn: 'সরিষা', te: 'ఆవాలు', mr: 'मोहरी', ta: 'கடுகு' },
  chickpea: { en: 'Chickpea', hi: 'चना', bn: 'ছোলা', te: 'శనగ', mr: 'हरभरा', ta: 'கடலை' },
  onion: { en: 'Onion', hi: 'प्याज', bn: 'পেঁয়াজ', te: 'ఉల్లిపాయ', mr: 'कांदा', ta: 'வெங்காய்' },
  chili: { en: 'Chili', hi: 'मिर्च', bn: 'মরিচ', te: 'మిరప', mr: 'मिरची', ta: 'மிளகாய்' },
  banana: { en: 'Banana', hi: 'केला', bn: 'কলা', te: 'అరటి', mr: 'केळी', ta: 'வாழை' },
  brinjal: { en: 'Brinjal', hi: 'बैंगन', bn: 'বেগুন', te: 'వంకాయ', mr: 'वांगे', ta: 'கத்தரிக்காய்' },
  okra: { en: 'Okra', hi: 'भिंडी', bn: 'ঢেঁড়শ', te: 'బెండకాయ', mr: 'भेंडी', ta: 'வெண்டைக்காய்' },
};

const stageNameTranslations: Record<GrowthStage, Record<Language, string>> = {
  'seedling': { en: 'Seedling', hi: 'अंकुरण', bn: 'চারা', te: 'మొలక', mr: 'रोपटी', ta: 'நாற்று' },
  'vegetative': { en: 'Growing / Vegetative', hi: 'वानस्पतिक वृद्धि', bn: 'উদ্ভিদ বৃদ্ধি', te: 'వృద్ధి', mr: 'वाढीचा टप्पा', ta: 'வளர்ச்சி' },
  'flowering': { en: 'Flowering', hi: 'फूल आना', bn: 'ফুল ফোটা', te: 'పుష్పించే', mr: 'फुलण्याचा टप्पा', ta: 'பூக்கும்' },
  'grain-filling': { en: 'Grain filling', hi: 'दाना भराई', bn: 'শস্য ভরাট', te: 'గింజ నింపు', mr: 'दाणा भरणी', ta: 'மணி நிரப்பம்' },
  'maturity': { en: 'Maturity / Harvest', hi: 'परिपक्वता / कटाई', bn: 'পরিপক্বতা / ফসল কাটা', te: 'పంట కోత', mr: 'पिकण्याचा टप्पा', ta: 'அறுவடை' },
};

export function cropName(id: CropId, lang: Language): string {
  return cropNameTranslations[id]?.[lang] ?? cropNameTranslations[id]?.en ?? id;
}

export function stageLabel(id: GrowthStage, lang: Language): string {
  return stageNameTranslations[id]?.[lang] ?? stageNameTranslations[id]?.en ?? id;
}
