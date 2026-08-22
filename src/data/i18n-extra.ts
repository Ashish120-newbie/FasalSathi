import type { Language } from './i18n';
import type { ConfidenceLevel } from './types';
import type { SchemeCategory, FarmerCategory } from './schemes';

type LangMap = Record<Language, string>;

export const confidenceLabels: Record<ConfidenceLevel, LangMap> = {
  high: { en: 'High confidence', hi: 'उच्च आत्मविश्वास', bn: 'উচ্চ নিশ্চয়তা', te: 'అధిక విశ్వాసం', mr: 'उच्च आत्मविश्वास', ta: 'அதிக நம்பிக்கை' },
  medium: { en: 'Medium confidence', hi: 'मध्यम आत्मविश्वास', bn: 'মাঝারি নিশ্চয়তা', te: 'మధ్యమ విశ్వాసం', mr: 'मध्यम आत्मविश्वास', ta: 'நடுத்தர நம்பிக்கை' },
  low: { en: 'Needs expert review', hi: 'विशेषज्ञ समीक्षा आवश्यक', bn: 'বিশেষজ্ঞ পর্যালোচনা প্রয়োজন', te: 'నిపుణుడి సమీక్ష అవసరం', mr: 'तज्ज्ञ समीक्षा आवश्यक', ta: 'நிபுணர் மதிப்பாய்வு தேவை' },
};

export const schemeCategoryLabels: Record<SchemeCategory, LangMap> = {
  income_support: { en: 'Income Support', hi: 'आय सहायता', bn: 'আয় সহায়তা', te: 'ఆదాయ సహాయం', mr: 'उत्पन्न सहाय्य', ta: 'வருமான உதவி' },
  insurance: { en: 'Insurance', hi: 'बीमा', bn: 'বীমা', te: 'బీమా', mr: 'विमा', ta: 'காப்பீடு' },
  credit: { en: 'Credit & Loans', hi: 'क्रेडिट और ऋण', bn: 'ঋণ ও ক্রেডিট', te: 'రుణ సౌకర్యం', mr: 'कर्ज आणि क्रेडिट', ta: 'கடன் மற்றும் கடன் வசதி' },
  subsidy: { en: 'Subsidy', hi: 'सब्सिडी', bn: 'ভর্তুকি', te: 'రాయితీ', mr: 'अनुदान', ta: 'மானியம்' },
  soil_health: { en: 'Soil Health', hi: 'मिट्टी स्वास्थ्य', bn: 'মাটির স্বাস্থ্য', te: 'నేల ఆరోగ్యం', mr: 'माती आरोग्य', ta: 'மண் ஆரோக்கியம்' },
  organic_farming: { en: 'Organic Farming', hi: 'जैविक खेती', bn: 'জৈব চাষ', te: 'సేంద్రీయ వ్యవసాయం', mr: 'सेंद्रीय शेती', ta: 'இயற்கை வேளாண்மை' },
  irrigation: { en: 'Irrigation', hi: 'सिंचाई', bn: 'সেচ', te: 'నీటిపారుదల', mr: 'सिंचन', ta: 'நீர்ப்பாசனம்' },
  price_support: { en: 'Price Support', hi: 'मूल्य समर्थन', bn: 'মূল্য সহায়তা', te: 'ధర మద్దతు', mr: 'किंमत सहाय्य', ta: 'விலை ஆதரவு' },
};

export const farmerCategoryLabels: Record<FarmerCategory, LangMap> = {
  all: { en: 'All Farmers', hi: 'सभी किसान', bn: 'সকল কৃষক', te: 'అన్ని రైతులు', mr: 'सर्व शेतकरी', ta: 'அனைத்து விவசாயிகளும்' },
  small_marginal: { en: 'Small & Marginal', hi: 'छोटे और सीमांत', bn: 'ক্ষুদ্র ও প্রান্তিক', te: 'చిన్న మరియు సాహసిక', mr: 'लहान आणि सीमांत', ta: 'சிறு மற்றும் எல்லைப்புற விவசாயிகள்' },
  large: { en: 'Large Farmers', hi: 'बड़े किसान', bn: 'বড় কৃষক', te: 'పెద్ద రైతులు', mr: 'मोठे शेतकरी', ta: 'பெரிய விவசாயிகள்' },
  tenant: { en: 'Tenant / Sharecropper', hi: 'बटाईदार / पट्टेदार', bn: 'বর্গাচাষী / ভাড়াটিয়া', te: 'కౌలుదారు / పట్టాదారు', mr: 'भाडेकरू / भागीदार', ta: 'குத்தகைதாரர் / பங்குதாரர்' },
  women: { en: 'Women Farmers', hi: 'महिला किसान', bn: 'নারী কৃষক', te: 'మహిళా రైతులు', mr: 'महिला शेतकरी', ta: 'பெண் விவசாயிகள்' },
  organic: { en: 'Organic Farmers', hi: 'जैविक किसान', bn: 'জৈব কৃষক', te: 'సేంద్రీయ రైతులు', mr: 'सेंद्रीय शेतकरी', ta: 'இயற்கை விவசாயிகள்' },
};

export const fertilizerProductLabels: LangMap = {
  en: { urea: 'Urea', dap: 'DAP', mop: 'MOP', kg: 'kg' },
  hi: { urea: 'यूरिया', dap: 'DAP', mop: 'MOP', kg: 'किग्रा' },
  bn: { urea: 'ইউরিয়া', dap: 'DAP', mop: 'MOP', kg: 'কেজি' },
  te: { urea: 'యూరియా', dap: 'DAP', mop: 'MOP', kg: 'కేజీ' },
  mr: { urea: 'युरिया', dap: 'DAP', mop: 'MOP', kg: 'किलो' },
  ta: { urea: 'யூரியா', dap: 'DAP', mop: 'MOP', kg: 'கிலோ' },
};

export const schemeDetailLabels = {
  benefits: { en: 'Benefits', hi: 'लाभ', bn: 'সুবিধা', te: 'ప్రయోజనాలు', mr: 'फायदे', ta: 'நன்மைகள்' } as LangMap,
  eligibility: { en: 'Eligibility', hi: 'पात्रता', bn: 'যোগ্যতা', te: 'అర్హత', mr: 'पात्रता', ta: 'தகுதி' } as LangMap,
  farmerCategories: { en: 'Farmer Categories', hi: 'किसान श्रेणियां', bn: 'কৃষক বিভাগ', te: 'రైతు వర్గాలు', mr: 'शेतकरी श्रेणी', ta: 'விவசாயி வகைகள்' } as LangMap,
  farmSizeCriteria: { en: 'Farm Size Criteria', hi: 'खेत आकार मानदंड', bn: 'খামার আকারের মানদণ্ড', te: 'పొలం పరిమాణం ప్రమాణాలు', mr: 'शेत आकार मानदंड', ta: 'விவசாய நில அளவு அளவுகோல்' } as LangMap,
  noFarmSize: { en: 'No specific size requirement', hi: 'कोई विशिष्ट आकार आवश्यकता नहीं', bn: 'কোনো নির্দিষ্ট আকারের প্রয়োজন নেই', te: 'నిర్దిష్ట పరిమాణం అవసరం లేదు', mr: 'विशिष्ट आकार आवश्यकता नाही', ta: 'குறிப்பிட்ட அளவு தேவையில்லை' } as LangMap,
  requiredDocuments: { en: 'Required Documents', hi: 'आवश्यक दस्तावेज़', bn: 'প্রয়োজনীয় নথিপত্র', te: 'అవసరమైన పత్రాలు', mr: 'आवश्यक कागदपत्रे', ta: 'தேவையான ஆவணங்கள்' } as LangMap,
  applicationProcess: { en: 'Application Process', hi: 'आवेदन प्रक्रिया', bn: 'আবেদন প্রক্রিয়া', te: 'దరఖాస్తు ప్రక్రియ', mr: 'अर्ज प्रक्रिया', ta: 'விண்ணப்ப செயல்முறை' } as LangMap,
  sourceVerification: { en: 'Source & Verification', hi: 'स्रोत और सत्यापन', bn: 'উৎস ও যাচাই', te: 'మూలం & ధృవీకరణ', mr: 'स्रोत आणि प्रमाणीकरण', ta: 'மூலம் மற்றும் சரிபார்ப்பு' } as LangMap,
  lastVerified: { en: 'Last verified', hi: 'अंतिम सत्यापन', bn: 'সর্বশেষ যাচাই', te: 'చివరి ధృవీకరణ', mr: 'शेवटचे प्रमाणीकरण', ta: 'கடைசியாக சரிபார்க்கப்பட்டது' } as LangMap,
  active: { en: 'Active', hi: 'सक्रिय', bn: 'সক্রিয়', te: 'క్రియాశీల', mr: 'सक्रिय', ta: 'செயலில்' } as LangMap,
  inactive: { en: 'Inactive', hi: 'निष्क्रिय', bn: 'নিষ্ক্রিয়', te: 'క్రియాహీన', mr: 'निष्क्रिय', ta: 'செயலற்ற' } as LangMap,
  allCrops: { en: 'All Crops', hi: 'सभी फसलें', bn: 'সব ফসল', te: 'అన్ని పంటలు', mr: 'सर्व पीक', ta: 'அனைத்து பயிர்களும்' } as LangMap,
  verifyNote: { en: 'Please verify eligibility and current details on the official government website.', hi: 'कृपया आधिकारिक सरकारी वेबसाइट पर पात्रता और वर्तमान विवरण सत्यापित करें।', bn: 'অনুগ্রহ করে সরকারি ওয়েবসাইটে যোগ্যতা ও বর্তমান তথ্য যাচাই করুন।', te: 'దయచేసి అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లో అర్హత మరియు ప్రస్తుత వివరాలను ధృవీకరించండి.', mr: 'कृपया अधिकृत सरकारी वेबसाइटवर पात्रता आणि सद्याची माहिती तपासा.', ta: 'அதிகாரப்பூர்வ அரசு இணையதளத்தில் தகுதி மற்றும் தற்போதைய விவரங்களை சரிபார்க்கவும்.' } as LangMap,
  saved: { en: 'Saved', hi: 'सहेजा गया', bn: 'সংরক্ষিত', te: 'సేవ్ చేయబడింది', mr: 'जतन केले', ta: 'சேமிக்கப்பட்டது' } as LangMap,
  saveScheme: { en: 'Save scheme', hi: 'योजना सहेजें', bn: 'প্রকল্প সংরক্ষণ করুন', te: 'పథకాన్ని సేవ్ చేయండి', mr: 'योजना जतन करा', ta: 'திட்டத்தை சேமிக்கவும்' } as LangMap,
  officialWebsite: { en: 'Official website', hi: 'आधिकारिक वेबसाइट', bn: 'অফিসিয়াল ওয়েবসাইট', te: 'అధికారిక వెబ్‌సైట్', mr: 'अधिकृत वेबसाइट', ta: 'அதிகாரப்பூர்வ இணையதளம்' } as LangMap,
  closeDetails: { en: 'Close details', hi: 'विवरण बंद करें', bn: 'বিস্তারিত বন্ধ করুন', te: 'వివరాలు మూసివేయండి', mr: 'तपशील बंद करा', ta: 'விவரங்களை மூடவும்' } as LangMap,
  removeBookmark: { en: 'Remove bookmark', hi: 'बुकमार्क हटाएं', bn: 'বুকমার্ক সরান', te: 'బుక్‌మార్క్ తీసివేయండి', mr: 'बुकमार्क काढा', ta: 'புக்மார்க்கை அகற்றவும்' } as LangMap,
};

export const commonSelectLanguage: LangMap = {
  en: 'Select language', hi: 'भाषा चुनें', bn: 'ভাষা নির্বাচন করুন', te: 'భాష ఎంచుకోండి', mr: 'भाषा निवडा', ta: 'மொழியை தேர்ந்தெடுக்கவும்',
};

export const chatContextLabels = {
  crop: { en: 'Crop', hi: 'फसल', bn: 'ফসল', te: 'పంట', mr: 'पीक', ta: 'பயிர்' } as LangMap,
  growthStage: { en: 'Growth stage', hi: 'वृद्धि चरण', bn: 'বৃদ্ধির পর্যায়', te: 'ఎదుగు దశ', mr: 'वाढीचा टप्पा', ta: 'வளர்ச்சி நிலை' } as LangMap,
  diagnosis: { en: 'Diagnosed condition', hi: 'निदान की गई स्थिति', bn: 'নির্ণয় করা অবস্থা', te: 'నిర్ధారించబడిన స్థితి', mr: 'निदान केलेली स्थिती', ta: 'கண்டறியப்பட்ட நிலை' } as LangMap,
  confidence: { en: 'Confidence', hi: 'आत्मविश्वास', bn: 'নিশ্চয়তা', te: 'విశ్వాసం', mr: 'आत्मविश्वास', ta: 'நம்பிக்கை' } as LangMap,
  recommendation: { en: 'Recommendation', hi: 'अनुशंसा', bn: 'সুপারিশ', te: 'సూచన', mr: 'शिफारस', ta: 'பரிந்துரை' } as LangMap,
  contextPrefix: { en: 'Here is my current context', hi: 'मेरी वर्तमान स्थिति यहाँ है', bn: 'আমার বর্তমান প্রেক্ষাপট এখানে', te: 'నా ప్రస్తుత సందర్భం ఇక్కడ', mr: 'माझी सद्याची स्थिती इथे आहे', ta: 'எனது தற்போதைய சூழல் இங்கே' } as LangMap,
};

export function getConfidenceLabel(level: ConfidenceLevel, lang: Language): string {
  return confidenceLabels[level][lang];
}

export function getSchemeCategoryLabel(cat: SchemeCategory, lang: Language): string {
  return schemeCategoryLabels[cat][lang];
}

export function getFarmerCategoryLabel(cat: FarmerCategory, lang: Language): string {
  return farmerCategoryLabels[cat][lang];
}
