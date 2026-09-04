import type { Language } from './i18n';
import { useLang } from '@/lib/lang';

export interface HomeTranslationKey {
  navHome: string;
  navMandi: string;
  navProfile: string;
  homeWeatherLocation: string;
  homeTools: string;
  homeLibrary: string;
  homeFertilizerCalc: string;
  homePesticideCalc: string;
  homeCostCalc: string;
  homeCrops: string;
  homeCultivationTips: string;
  homePestsDiseases: string;
  homePestsDiseaseAlert: string;
  homeNew: string;
  comingSoon: string;
  comingSoonDesc: string;
  profileTitle: string;
  profileLogout: string;
}

const homeTranslations: Record<Language, HomeTranslationKey> = {
  en: {
    navHome: 'Home', navMandi: 'Mandi', navProfile: 'Profile',
    homeWeatherLocation: 'Your location',
    homeTools: 'Tools', homeLibrary: 'Library',
    homeFertilizerCalc: 'Fertilizer calculator', homePesticideCalc: 'Pesticide calculator', homeCostCalc: 'Cost calculator',
    homeCrops: 'Crops', homeCultivationTips: 'Cultivation Tips', homePestsDiseases: 'Pests & Diseases', homePestsDiseaseAlert: 'Pests & Disease Alert',
    homeNew: 'New', comingSoon: 'Coming soon', comingSoonDesc: 'This feature is on the way. Please check back later.',
    profileTitle: 'Profile', profileLogout: 'Logout',
  },
  hi: {
    navHome: 'होम', navMandi: 'मंडी', navProfile: 'प्रोफ़ाइल',
    homeWeatherLocation: 'आपका स्थान',
    homeTools: 'उपकरण', homeLibrary: 'लाइब्रेरी',
    homeFertilizerCalc: 'खाद कैलकुलेटर', homePesticideCalc: 'कीटनाशक कैलकुलेटर', homeCostCalc: 'लागत कैलकुलेटर',
    homeCrops: 'फसलें', homeCultivationTips: 'खेती युक्तियां', homePestsDiseases: 'कीट और रोग', homePestsDiseaseAlert: 'कीट और रोग अलर्ट',
    homeNew: 'नया', comingSoon: 'जल्द आ रहा है', comingSoonDesc: 'यह सुविधा जल्द उपलब्ध होगी। कृपया बाद में जांचें।',
    profileTitle: 'प्रोफ़ाइल', profileLogout: 'लॉग आउट',
  },
  bn: {
    navHome: 'হোম', navMandi: 'মণ্ডি', navProfile: 'প্রোফাইল',
    homeWeatherLocation: 'আপনার অবস্থান',
    homeTools: 'টুলস', homeLibrary: 'লাইব্রেরি',
    homeFertilizerCalc: 'সার ক্যালকুলেটর', homePesticideCalc: 'কীটনাশক ক্যালকুলেটর', homeCostCalc: 'খরচ ক্যালকুলেটর',
    homeCrops: 'ফসল', homeCultivationTips: 'চাষ পদ্ধতি', homePestsDiseases: 'কীট ও রোগ', homePestsDiseaseAlert: 'কীট ও রোগ সতর্কতা',
    homeNew: 'নতুন', comingSoon: 'শীঘ্রই আসছে', comingSoonDesc: 'এই বৈশিষ্ট্যটি পথে আছে। অনুগ্রহ করে পরে আবার দেখুন।',
    profileTitle: 'প্রোফাইল', profileLogout: 'লগআউট',
  },
  te: {
    navHome: 'హోమ్', navMandi: 'మండి', navProfile: 'ప్రొఫైల్',
    homeWeatherLocation: 'మీ స్థానం',
    homeTools: 'సాధనాలు', homeLibrary: 'లైబ్రరీ',
    homeFertilizerCalc: 'ఎరువు కాలిక్యులేటర్', homePesticideCalc: 'పురుగుమందు కాలిక్యులేటర్', homeCostCalc: 'ఖర్చు కాలిక్యులేటర్',
    homeCrops: 'పంటలు', homeCultivationTips: 'సాగు చిట్కాలు', homePestsDiseases: 'పురుగులు & వ్యాధులు', homePestsDiseaseAlert: 'పురుగులు & వ్యాధుల హెచ్చరిక',
    homeNew: 'కొత్త', comingSoon: 'త్వరలో వస్తోంది', comingSoonDesc: 'ఈ ఫీచర్ రాబోతోంది. దయచేసి తర్వాత తనిఖీ చేయండి.',
    profileTitle: 'ప్రొఫైల్', profileLogout: 'లాగ్అవుట్',
  },
  mr: {
    navHome: 'होम', navMandi: 'मंडी', navProfile: 'प्रोफाइल',
    homeWeatherLocation: 'तुमचे स्थान',
    homeTools: 'साधने', homeLibrary: 'लायब्ररी',
    homeFertilizerCalc: 'खत कॅलक्युलेटर', homePesticideCalc: 'कीटनाशक कॅलक्युलेटर', homeCostCalc: 'खर्च कॅलक्युलेटर',
    homeCrops: 'पीक', homeCultivationTips: 'लागवड टिप्स', homePestsDiseases: 'कीड आणि रोग', homePestsDiseaseAlert: 'कीड आणि रोग अलर्ट',
    homeNew: 'नवीन', comingSoon: 'लवकरच येत आहे', comingSoonDesc: 'हे फीचर लवकरच उपलब्ध होईल. कृपया नंतर तपासा.',
    profileTitle: 'प्रोफाइल', profileLogout: 'लॉगआउट',
  },
  ta: {
    navHome: 'ஹோம்', navMandi: 'மண்டி', navProfile: 'சுயவிவரம்',
    homeWeatherLocation: 'உங்கள் இடம்',
    homeTools: 'கருவிகள்', homeLibrary: 'நூலகம்',
    homeFertilizerCalc: 'உர கால்குலேட்டர்', homePesticideCalc: 'பூச்சிக்கொல்லி கால்குலேட்டர்', homeCostCalc: 'செலவு கால்குலேட்டர்',
    homeCrops: 'பயிர்கள்', homeCultivationTips: 'சாகுபடி குறிப்புகள்', homePestsDiseases: 'பூச்சிகள் & நோய்கள்', homePestsDiseaseAlert: 'பூச்சிகள் & நோய்கள் எச்சரிக்கை',
    homeNew: 'புதியது', comingSoon: 'விரைவில் வருகிறது', comingSoonDesc: 'இந்த அம்சம் வரப்போகிறது. தயவு செய்து பிறகு சரிபார்க்கவும்.',
    profileTitle: 'சுயவிவரம்', profileLogout: 'வெளியேறு',
  },
};

export function useHomeLang(): HomeTranslationKey {
  const { lang } = useLang();
  return homeTranslations[lang] ?? homeTranslations.en;
}
