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
  profilePersonalDetails: string;
  profileEdit: string;
  profileSave: string;
  profileCancel: string;
  profileName: string;
  profilePhone: string;
  profileLocation: string;
  profileVillage: string;
  profileDistrict: string;
  profileState: string;
  profileLandSize: string;
  profileAcres: string;
  profilePrimaryCrops: string;
  profilePreferredLang: string;
  profileUpdated: string;
  profileSaveError: string;
  profilePhoneError: string;
  profileLandError: string;
  profileNoCrops: string;
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
    profilePersonalDetails: 'Personal Details', profileEdit: 'Edit', profileSave: 'Save', profileCancel: 'Cancel',
    profileName: 'Name', profilePhone: 'Phone number', profileLocation: 'Location',
    profileVillage: 'Village', profileDistrict: 'District', profileState: 'State',
    profileLandSize: 'Land size', profileAcres: 'acres', profilePrimaryCrops: 'Primary crops', profilePreferredLang: 'Preferred language',
    profileUpdated: 'Profile updated', profileSaveError: 'Could not save profile. Please try again.', profilePhoneError: 'Phone number must be exactly 10 digits', profileLandError: 'Land size must be a positive number', profileNoCrops: 'No crops selected',
  },
  hi: {
    navHome: 'होम', navMandi: 'मंडी', navProfile: 'प्रोफ़ाइल',
    homeWeatherLocation: 'आपका स्थान',
    homeTools: 'उपकरण', homeLibrary: 'लाइब्रेरी',
    homeFertilizerCalc: 'खाद कैलकुलेटर', homePesticideCalc: 'कीटनाशक कैलकुलेटर', homeCostCalc: 'लागत कैलकुलेटर',
    homeCrops: 'फसलें', homeCultivationTips: 'खेती युक्तियां', homePestsDiseases: 'कीट और रोग', homePestsDiseaseAlert: 'कीट और रोग अलर्ट',
    homeNew: 'नया', comingSoon: 'जल्द आ रहा है', comingSoonDesc: 'यह सुविधा जल्द उपलब्ध होगी। कृपया बाद में जांचें।',
    profileTitle: 'प्रोफ़ाइल', profileLogout: 'लॉग आउट',
    profilePersonalDetails: 'व्यक्तिगत विवरण', profileEdit: 'संपादित करें', profileSave: 'सहेजें', profileCancel: 'रद्द करें',
    profileName: 'नाम', profilePhone: 'फ़ोन नंबर', profileLocation: 'स्थान',
    profileVillage: 'गाँव', profileDistrict: 'ज़िला', profileState: 'राज्य',
    profileLandSize: 'भूमि आकार', profileAcres: 'एकड़', profilePrimaryCrops: 'मुख्य फसलें', profilePreferredLang: 'पसंदीदा भाषा',
    profileUpdated: 'प्रोफ़ाइल अपडेट हुआ', profileSaveError: 'प्रोफ़ाइल सहेजी नहीं जा सकी। कृपया पुनः प्रयास करें।', profilePhoneError: 'फ़ोन नंबर 10 अंकों का होना चाहिए', profileLandError: 'भूमि आकार एक सकारात्मक संख्या होनी चाहिए', profileNoCrops: 'कोई फसल चयनित नहीं',
  },
  bn: {
    navHome: 'হোম', navMandi: 'মণ্ডি', navProfile: 'প্রোফাইল',
    homeWeatherLocation: 'আপনার অবস্থান',
    homeTools: 'টুলস', homeLibrary: 'লাইব্রেরি',
    homeFertilizerCalc: 'সার ক্যালকুলেটর', homePesticideCalc: 'কীটনাশক ক্যালকুলেটর', homeCostCalc: 'খরচ ক্যালকুলেটর',
    homeCrops: 'ফসল', homeCultivationTips: 'চাষ পদ্ধতি', homePestsDiseases: 'কীট ও রোগ', homePestsDiseaseAlert: 'কীট ও রোগ সতর্কতা',
    homeNew: 'নতুন', comingSoon: 'শীঘ্রই আসছে', comingSoonDesc: 'এই বৈশিষ্ট্যটি পথে আছে। অনুগ্রহ করে পরে আবার দেখুন।',
    profileTitle: 'প্রোফাইল', profileLogout: 'লগআউট',
    profilePersonalDetails: 'ব্যক্তিগত বিবরণ', profileEdit: 'সম্পাদনা', profileSave: 'সংরক্ষণ', profileCancel: 'বাতিল',
    profileName: 'নাম', profilePhone: 'ফোন নম্বর', profileLocation: 'অবস্থান',
    profileVillage: 'গ্রাম', profileDistrict: 'জেলা', profileState: 'রাজ্য',
    profileLandSize: 'জমির পরিমাণ', profileAcres: 'একর', profilePrimaryCrops: 'প্রধান ফসল', profilePreferredLang: 'পছন্দের ভাষা',
    profileUpdated: 'প্রোফাইল আপডেট হয়েছে', profileSaveError: 'প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', profilePhoneError: 'ফোন নম্বর ঠিক ১০ সংখ্যার হতে হবে', profileLandError: 'জমির পরিমাণ একটি ধনাত্মক সংখ্যা হতে হবে', profileNoCrops: 'কোনো ফসল নির্বাচিত নেই',
  },
  te: {
    navHome: 'హోమ్', navMandi: 'మండి', navProfile: 'ప్రొఫైల్',
    homeWeatherLocation: 'మీ స్థానం',
    homeTools: 'సాధనాలు', homeLibrary: 'లైబ్రరీ',
    homeFertilizerCalc: 'ఎరువు కాలిక్యులేటర్', homePesticideCalc: 'పురుగుమందు కాలిక్యులేటర్', homeCostCalc: 'ఖర్చు కాలిక్యులేటర్',
    homeCrops: 'పంటలు', homeCultivationTips: 'సాగు చిట్కాలు', homePestsDiseases: 'పురుగులు & వ్యాధులు', homePestsDiseaseAlert: 'పురుగులు & వ్యాధుల హెచ్చరిక',
    homeNew: 'కొత్త', comingSoon: 'త్వరలో వస్తోంది', comingSoonDesc: 'ఈ ఫీచర్ రాబోతోంది. దయచేసి తర్వాత తనిఖీ చేయండి.',
    profileTitle: 'ప్రొఫైల్', profileLogout: 'లాగ్అవుట్',
    profilePersonalDetails: 'వ్యక్తిగత వివరాలు', profileEdit: 'సవరించు', profileSave: 'భద్రపరచు', profileCancel: 'రద్దు',
    profileName: 'పేరు', profilePhone: 'ఫోన్ నంబర్', profileLocation: 'స్థానం',
    profileVillage: 'గ్రామం', profileDistrict: 'జిల్లా', profileState: 'రాష్ట్రం',
    profileLandSize: 'భూమి పరిమాణం', profileAcres: 'ఎకరాలు', profilePrimaryCrops: 'ప్రధాన పంటలు', profilePreferredLang: 'ప్రాధాన్యత భాష',
    profileUpdated: 'ప్రొఫైల్ నవీకరించబడింది', profileSaveError: 'ప్రొఫైల్‌ను సేవ్ చేయడం సాధ్యం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.', profilePhoneError: 'ఫోన్ నంబర్ ఖచ్చితంగా 10 అంకెలు ఉండాలి', profileLandError: 'భూమి పరిమాణం ధనాత్మక సంఖ్య అయి ఉండాలి', profileNoCrops: 'ఎటువంటి పంటలు ఎంచుకోబడలేదు',
  },
  mr: {
    navHome: 'होम', navMandi: 'मंडी', navProfile: 'प्रोफाइल',
    homeWeatherLocation: 'तुमचे स्थान',
    homeTools: 'साधने', homeLibrary: 'लायब्ररी',
    homeFertilizerCalc: 'खत कॅलक्युलेटर', homePesticideCalc: 'कीटनाशक कॅलक्युलेटर', homeCostCalc: 'खर्च कॅलक्युलेटर',
    homeCrops: 'पीक', homeCultivationTips: 'लागवड टिप्स', homePestsDiseases: 'कीड आणि रोग', homePestsDiseaseAlert: 'कीड आणि रोग अलर्ट',
    homeNew: 'नवीन', comingSoon: 'लवकरच येत आहे', comingSoonDesc: 'हे फीचर लवकरच उपलब्ध होईल. कृपया नंतर तपासा.',
    profileTitle: 'प्रोफाइल', profileLogout: 'लॉगआउट',
    profilePersonalDetails: 'वैयक्तिक तपशील', profileEdit: 'संपादित करा', profileSave: 'जतन करा', profileCancel: 'रद्द करा',
    profileName: 'नाव', profilePhone: 'फोन नंबर', profileLocation: 'स्थान',
    profileVillage: 'गाव', profileDistrict: 'जिल्हा', profileState: 'राज्य',
    profileLandSize: 'जमीन आकार', profileAcres: 'एकर', profilePrimaryCrops: 'प्रमुख पीक', profilePreferredLang: 'पसंतीची भाषा',
    profileUpdated: 'प्रोफाइल अपडेट झाले', profileSaveError: 'प्रोफाइल जतन करता आले नाही. कृपया पुन्हा प्रयत्न करा.', profilePhoneError: 'फोन नंबर नक्की १० अंकी असावा', profileLandError: 'जमीन आकार सकारात्मक संख्या असावी', profileNoCrops: 'कोणतेही पीक निवडले नाही',
  },
  ta: {
    navHome: 'ஹோம்', navMandi: 'மண்டி', navProfile: 'சுயவிவரம்',
    homeWeatherLocation: 'உங்கள் இடம்',
    homeTools: 'கருவிகள்', homeLibrary: 'நூலகம்',
    homeFertilizerCalc: 'உர கால்குலேட்டர்', homePesticideCalc: 'பூச்சிக்கொல்லி கால்குலேட்டர்', homeCostCalc: 'செலவு கால்குலேட்டர்',
    homeCrops: 'பயிர்கள்', homeCultivationTips: 'சாகுபடி குறிப்புகள்', homePestsDiseases: 'பூச்சிகள் & நோய்கள்', homePestsDiseaseAlert: 'பூச்சிகள் & நோய்கள் எச்சரிக்கை',
    homeNew: 'புதியது', comingSoon: 'விரைவில் வருகிறது', comingSoonDesc: 'இந்த அம்சம் வரப்போகிறது. தயவு செய்து பிறகு சரிபார்க்கவும்.',
    profileTitle: 'சுயவிவரம்', profileLogout: 'வெளியேறு',
    profilePersonalDetails: 'தனிப்பட்ட விவரங்கள்', profileEdit: 'திருத்து', profileSave: 'சேமி', profileCancel: 'ரத்து',
    profileName: 'பெயர்', profilePhone: 'தொலைபேசி எண்', profileLocation: 'இடம்',
    profileVillage: 'கிராமம்', profileDistrict: 'மாவட்டம்', profileState: 'மாநிலம்',
    profileLandSize: 'நில அளவு', profileAcres: 'ஏக்கர்', profilePrimaryCrops: 'முக்கிய பயிர்கள்', profilePreferredLang: 'விருப்ப மொழி',
    profileUpdated: 'சுயவிவரம் புதுப்பிக்கப்பட்டது', profileSaveError: 'சுயவிவரத்தை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.', profilePhoneError: 'தொலைபேசி எண் சரியாக 10 இலக்கங்கள் இருக்க வேண்டும்', profileLandError: 'நில அளவு ஒரு நேர்மறை எண்ணாக இருக்க வேண்டும்', profileNoCrops: 'எந்தப் பயிர்களும் தேர்ந்தெடுக்கப்படவில்லை',
  },
};

export function useHomeLang(): HomeTranslationKey {
  const { lang } = useLang();
  return homeTranslations[lang] ?? homeTranslations.en;
}
