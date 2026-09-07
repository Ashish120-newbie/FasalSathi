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
  homeWeatherUpdated: string;
  homeWeatherUpdatedAgo: string;
  homeWeatherLoadError: string;
  homeWeatherRetry: string;
  homeWeatherLoading: string;
  homeWeatherTitle: string;
  homeFarmingAdvisory: string;
  homeAdvisorySpray: string;
  homeAdvisoryFertilizer: string;
  homeAdvisorySow: string;
  homeAdvisoryDisclaimer: string;
  advisorySprayWind: string;
  advisorySprayHot: string;
  advisorySprayRain: string;
  advisorySprayGood: string;
  advisorySprayGoodDry: string;
  advisorySprayFair: string;
  advisorySprayFairDry: string;
  advisoryFertilizerRain: string;
  advisoryFertilizerGood: string;
  advisorySowHotDry: string;
  advisorySowRain: string;
  advisorySowGood: string;
  advisorySowSuitableDry: string;
  advisorySowCheck: string;
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
    homeWeatherUpdated: 'Updated', homeWeatherUpdatedAgo: 'min ago', homeWeatherLoadError: "Couldn't load weather — tap to retry", homeWeatherRetry: 'Retry', homeWeatherLoading: 'Loading weather...',
    homeWeatherTitle: 'Weather', homeFarmingAdvisory: 'Farming Advisory', homeAdvisorySpray: 'Spray', homeAdvisoryFertilizer: 'Fertilizer', homeAdvisorySow: 'Sow', homeAdvisoryDisclaimer: 'Based on general weather guidelines. Always check pesticide/fertilizer product labels for specific recommendations.',
    advisorySprayWind: 'Too windy — spray drift risk', advisorySprayHot: 'Too hot — pesticide may evaporate before absorption', advisorySprayRain: 'Rain expected soon — spray will wash off, wait until after', advisorySprayGood: 'Good conditions for spraying', advisorySprayGoodDry: 'Good conditions for spraying — low humidity, spray early morning or evening', advisorySprayFair: 'Fair conditions — monitor weather before spraying', advisorySprayFairDry: 'Fair conditions — monitor weather before spraying — low humidity, spray early morning or evening', advisoryFertilizerRain: 'Heavy rain expected — fertilizer may wash away, apply after rain passes', advisoryFertilizerGood: 'Good to apply fertilizer — no heavy rain expected in 24 hours', advisorySowHotDry: 'Hot, dry conditions ahead — germination may be poor, consider waiting for rain', advisorySowRain: 'Heavy rain expected — risk of seed rot, wait for drier conditions', advisorySowGood: 'Good conditions for sowing — moderate temps with rain expected aids germination', advisorySowSuitableDry: 'Temperature is suitable but little rain ahead — ensure soil moisture before sowing', advisorySowCheck: 'Check local soil moisture and forecast before sowing',
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
    homeWeatherUpdated: 'अपडेटेड', homeWeatherUpdatedAgo: 'मिनट पहले', homeWeatherLoadError: 'मौसम लोड नहीं हुआ — फिर से कोशिश करने के लिए टैप करें', homeWeatherRetry: 'फिर से कोशिश करें', homeWeatherLoading: 'मौसम लोड हो रहा है...',
    homeWeatherTitle: 'मौसम', homeFarmingAdvisory: 'कृषि सलाह', homeAdvisorySpray: 'छिड़काव', homeAdvisoryFertilizer: 'खाद', homeAdvisorySow: 'बुवाई', homeAdvisoryDisclaimer: 'सामान्य मौसम दिशानिर्देशों पर आधारित। खास सलाह के लिए हमेशा कीटनाशक/खाद के लेबल देखें।',
    advisorySprayWind: 'बहुत तेज़ हवा — छिड़काव बहने का खतरा', advisorySprayHot: 'बहुत गर्मी — कीटनाशक सोखने से पहले उड़ सकता है', advisorySprayRain: 'जल्द बारिश की संभावना — छिड़काव धुल जाएगा, बाद में करें', advisorySprayGood: 'छिड़काव के लिए अच्छी परिस्थितियाँ', advisorySprayGoodDry: 'छिड़काव के लिए अच्छी परिस्थितियाँ — नमी कम है, सुबह जल्दी या शाम को छिड़काव करें', advisorySprayFair: 'ठीक परिस्थितियाँ — छिड़काव से पहले मौसम पर नज़र रखें', advisorySprayFairDry: 'ठीक परिस्थितियाँ — मौसम पर नज़र रखें — नमी कम है, सुबह जल्दी या शाम को छिड़काव करें', advisoryFertilizerRain: 'तेज़ बारिश की संभावना — खाद बह सकती है, बारिश के बाद डालें', advisoryFertilizerGood: 'खाद डालना अच्छा रहेगा — 24 घंटों में तेज़ बारिश की संभावना नहीं', advisorySowHotDry: 'गर्म और सूखा मौसम — अंकुरण कम हो सकता है, बारिश तक रुकने पर विचार करें', advisorySowRain: 'तेज़ बारिश की संभावना — बीज सड़ने का खतरा, सूखे मौसम तक रुकें', advisorySowGood: 'बुवाई के लिए अच्छी परिस्थितियाँ — सामान्य तापमान और बारिश से अंकुरण में मदद मिलेगी', advisorySowSuitableDry: 'तापमान उपयुक्त है लेकिन बारिश कम है — बुवाई से पहले मिट्टी की नमी सुनिश्चित करें', advisorySowCheck: 'बुवाई से पहले स्थानीय मिट्टी की नमी और मौसम का पूर्वानुमान देखें',
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
    homeWeatherUpdated: 'আপডেটেড', homeWeatherUpdatedAgo: 'মিনিট আগে', homeWeatherLoadError: 'আবহাওয়া লোড হয়নি — আবার চেষ্টা করতে ট্যাপ করুন', homeWeatherRetry: 'আবার চেষ্টা করুন', homeWeatherLoading: 'আবহাওয়া লোড হচ্ছে...',
    homeWeatherTitle: 'আবহাওয়া', homeFarmingAdvisory: 'কৃষি পরামর্শ', homeAdvisorySpray: 'স্প্রে', homeAdvisoryFertilizer: 'সার', homeAdvisorySow: 'বপন', homeAdvisoryDisclaimer: 'সাধারণ আবহাওয়ার নির্দেশিকার উপর ভিত্তি করে। নির্দিষ্ট পরামর্শের জন্য কীটনাশক/সারের লেবেল দেখুন।',
    advisorySprayWind: 'বাতাস খুব বেশি — স্প্রে ছড়িয়ে যাওয়ার ঝুঁকি', advisorySprayHot: 'খুব গরম — শোষণের আগে কীটনাশক বাষ্পীভূত হতে পারে', advisorySprayRain: 'শীঘ্রই বৃষ্টির সম্ভাবনা — স্প্রে ধুয়ে যাবে, পরে করুন', advisorySprayGood: 'স্প্রে করার জন্য ভালো পরিস্থিতি', advisorySprayGoodDry: 'স্প্রে করার জন্য ভালো পরিস্থিতি — আর্দ্রতা কম, ভোরে বা সন্ধ্যায় স্প্রে করুন', advisorySprayFair: 'মোটামুটি পরিস্থিতি — স্প্রে করার আগে আবহাওয়া দেখুন', advisorySprayFairDry: 'মোটামুটি পরিস্থিতি — আবহাওয়া দেখুন — আর্দ্রতা কম, ভোরে বা সন্ধ্যায় স্প্রে করুন', advisoryFertilizerRain: 'ভারী বৃষ্টির সম্ভাবনা — সার ধুয়ে যেতে পারে, বৃষ্টি থামার পর দিন', advisoryFertilizerGood: 'সার প্রয়োগের ভালো সময় — ২৪ ঘণ্টায় ভারী বৃষ্টির সম্ভাবনা নেই', advisorySowHotDry: 'গরম ও শুষ্ক আবহাওয়া — অঙ্কুরোদ্গম কম হতে পারে, বৃষ্টির জন্য অপেক্ষা করুন', advisorySowRain: 'ভারী বৃষ্টির সম্ভাবনা — বীজ পচে যাওয়ার ঝুঁকি, শুষ্ক আবহাওয়ার জন্য অপেক্ষা করুন', advisorySowGood: 'বপনের জন্য ভালো পরিস্থিতি — মাঝারি তাপমাত্রা ও বৃষ্টি অঙ্কুরোদ্গমে সাহায্য করবে', advisorySowSuitableDry: 'তাপমাত্রা উপযুক্ত কিন্তু বৃষ্টি কম — বপনের আগে মাটির আর্দ্রতা নিশ্চিত করুন', advisorySowCheck: 'বপনের আগে স্থানীয় মাটির আর্দ্রতা ও আবহাওয়ার পূর্বাভাস দেখুন',
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
    homeWeatherUpdated: 'అప్‌డేట్', homeWeatherUpdatedAgo: 'నిమిషాల క్రితం', homeWeatherLoadError: 'వాతావరణం లోడ్ కాలేదు — మళ్లీ ప్రయత్నించడానికి ట్యాప్ చేయండి', homeWeatherRetry: 'మళ్లీ ప్రయత్నించండి', homeWeatherLoading: 'వాతావరణం లోడ్ అవుతోంది...',
    homeWeatherTitle: 'వాతావరణం', homeFarmingAdvisory: 'వ్యవసాయ సలహా', homeAdvisorySpray: 'స్ప్రే', homeAdvisoryFertilizer: 'ఎరువు', homeAdvisorySow: 'విత్తనం', homeAdvisoryDisclaimer: 'సాధారణ వాతావరణ మార్గదర్శకాల ఆధారంగా. నిర్దిష్ట సలహా కోసం పురుగుమందు/ఎరువు లేబుళ్లను ఎల్లప్పుడూ తనిఖీ చేయండి.',
    advisorySprayWind: 'గాలి చాలా బలంగా ఉంది — స్ప్రే కొట్టుకుపోయే ప్రమాదం', advisorySprayHot: 'చాలా వేడిగా ఉంది — శోషణకు ముందే పురుగుమందు ఆవిరైపోవచ్చు', advisorySprayRain: 'త్వరలో వర్షం — స్ప్రే కొట్టుకుపోతుంది, తర్వాత చేయండి', advisorySprayGood: 'స్ప్రే చేయడానికి మంచి పరిస్థితులు', advisorySprayGoodDry: 'స్ప్రే చేయడానికి మంచి పరిస్థితులు — తేమ తక్కువగా ఉంది, ఉదయం లేదా సాయంత్రం చేయండి', advisorySprayFair: 'సరైన పరిస్థితులు — స్ప్రేకు ముందు వాతావరణాన్ని గమనించండి', advisorySprayFairDry: 'సరైన పరిస్థితులు — వాతావరణాన్ని గమనించండి — తేమ తక్కువగా ఉంది, ఉదయం లేదా సాయంత్రం చేయండి', advisoryFertilizerRain: 'భారీ వర్షం — ఎరువు కొట్టుకుపోవచ్చు, వర్షం తగ్గిన తర్వాత వేయండి', advisoryFertilizerGood: 'ఎరువు వేయడానికి మంచి సమయం — 24 గంటల్లో భారీ వర్షం లేదు', advisorySowHotDry: 'వేడి, పొడి పరిస్థితులు — మొలకెత్తడం తక్కువగా ఉండవచ్చు, వర్షం కోసం వేచి ఉండండి', advisorySowRain: 'భారీ వర్షం — విత్తనాలు కుళ్లే ప్రమాదం, పొడి పరిస్థితుల కోసం వేచి ఉండండి', advisorySowGood: 'విత్తడానికి మంచి పరిస్థితులు — మితమైన ఉష్ణోగ్రతలు, వర్షం మొలకెత్తడానికి సహాయపడతాయి', advisorySowSuitableDry: 'ఉష్ణోగ్రత అనుకూలంగా ఉంది కానీ వర్షం తక్కువ — విత్తే ముందు నేల తేమను నిర్ధారించండి', advisorySowCheck: 'విత్తే ముందు స్థానిక నేల తేమ మరియు వాతావరణ సూచనను తనిఖీ చేయండి',
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
    homeWeatherUpdated: 'अपडेट', homeWeatherUpdatedAgo: 'मिनिटांपूर्वी', homeWeatherLoadError: 'हवामान लोड झाले नाही — पुन्हा प्रयत्न करण्यासाठी टॅप करा', homeWeatherRetry: 'पुन्हा प्रयत्न करा', homeWeatherLoading: 'हवामान लोड होत आहे...',
    homeWeatherTitle: 'हवामान', homeFarmingAdvisory: 'शेतीविषयक सल्ला', homeAdvisorySpray: 'फवारणी', homeAdvisoryFertilizer: 'खत', homeAdvisorySow: 'पेरणी', homeAdvisoryDisclaimer: 'सामान्य हवामान मार्गदर्शक तत्त्वांवर आधारित. विशिष्ट सल्ल्यासाठी नेहमी कीटकनाशक/खताची लेबले तपासा.',
    advisorySprayWind: 'वारा खूप जोरात — फवारणी वाहून जाण्याचा धोका', advisorySprayHot: 'खूप उष्ण — शोषण्यापूर्वी कीटकनाशकाचे बाष्पीभवन होऊ शकते', advisorySprayRain: 'लवकरच पाऊस अपेक्षित — फवारणी वाहून जाईल, नंतर करा', advisorySprayGood: 'फवारणीसाठी चांगली परिस्थिती', advisorySprayGoodDry: 'फवारणीसाठी चांगली परिस्थिती — आर्द्रता कमी, सकाळी लवकर किंवा संध्याकाळी फवारणी करा', advisorySprayFair: 'समाधानकारक परिस्थिती — फवारणीपूर्वी हवामानावर लक्ष ठेवा', advisorySprayFairDry: 'समाधानकारक परिस्थिती — हवामानावर लक्ष ठेवा — आर्द्रता कमी, सकाळी लवकर किंवा संध्याकाळी फवारणी करा', advisoryFertilizerRain: 'मुसळधार पाऊस अपेक्षित — खत वाहून जाऊ शकते, पाऊस थांबल्यावर द्या', advisoryFertilizerGood: 'खत देण्यासाठी चांगली वेळ — 24 तासांत मुसळधार पावसाची शक्यता नाही', advisorySowHotDry: 'उष्ण, कोरडी परिस्थिती — उगवण कमी होऊ शकते, पावसाची वाट पाहण्याचा विचार करा', advisorySowRain: 'मुसळधार पाऊस अपेक्षित — बीज कुजण्याचा धोका, कोरड्या परिस्थितीची वाट पहा', advisorySowGood: 'पेरणीसाठी चांगली परिस्थिती — मध्यम तापमान आणि पावसामुळे उगवणीस मदत होईल', advisorySowSuitableDry: 'तापमान योग्य आहे पण पाऊस कमी — पेरणीपूर्वी जमिनीतील ओलावा सुनिश्चित करा', advisorySowCheck: 'पेरणीपूर्वी स्थानिक जमिनीतील ओलावा आणि हवामानाचा अंदाज तपासा',
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
    homeWeatherUpdated: 'புதுப்பிக்கப்பட்டது', homeWeatherUpdatedAgo: 'நிமிடங்களுக்கு முன்', homeWeatherLoadError: 'வானிலை ஏற்ற முடியவில்லை — மீண்டும் முயற்சிக்க தட்டவும்', homeWeatherRetry: 'மீண்டும் முயற்சிக்கவும்', homeWeatherLoading: 'வானிலை ஏற்றப்படுகிறது...',
    homeWeatherTitle: 'வானிலை', homeFarmingAdvisory: 'விவசாய ஆலோசனை', homeAdvisorySpray: 'தெளிப்பு', homeAdvisoryFertilizer: 'உரம்', homeAdvisorySow: 'விதைப்பு', homeAdvisoryDisclaimer: 'பொதுவான வானிலை வழிகாட்டுதல்களின் அடிப்படையில். குறிப்பிட்ட பரிந்துரைகளுக்கு பூச்சிக்கொல்லி/உர லேபிள்களை எப்போதும் சரிபார்க்கவும்.',
    advisorySprayWind: 'காற்று அதிகமாக உள்ளது — தெளிப்பு விலகிச் செல்லும் ஆபத்து', advisorySprayHot: 'மிகவும் வெப்பம் — உறிஞ்சப்படுவதற்கு முன் பூச்சிக்கொல்லி ஆவியாகலாம்', advisorySprayRain: 'விரைவில் மழை — தெளிப்பு கழுவப்படும், பிறகு செய்யவும்', advisorySprayGood: 'தெளிப்புக்கு நல்ல நிலை', advisorySprayGoodDry: 'தெளிப்புக்கு நல்ல நிலை — ஈரப்பதம் குறைவு, அதிகாலையில் அல்லது மாலையில் தெளிக்கவும்', advisorySprayFair: 'சாதாரண நிலை — தெளிப்பதற்கு முன் வானிலையை கவனிக்கவும்', advisorySprayFairDry: 'சாதாரண நிலை — வானிலையை கவனிக்கவும் — ஈரப்பதம் குறைவு, அதிகாலையில் அல்லது மாலையில் தெளிக்கவும்', advisoryFertilizerRain: 'கனமழை எதிர்பார்க்கப்படுகிறது — உரம் அடித்துச் செல்லப்படலாம், மழைக்குப் பிறகு இடவும்', advisoryFertilizerGood: 'உரம் இட நல்ல நேரம் — 24 மணிநேரத்தில் கனமழை இல்லை', advisorySowHotDry: 'வெப்பமான, வறண்ட நிலை — முளைப்பு குறையலாம், மழைக்காக காத்திருக்கவும்', advisorySowRain: 'கனமழை எதிர்பார்க்கப்படுகிறது — விதை அழுகும் ஆபத்து, வறண்ட நிலைக்காக காத்திருக்கவும்', advisorySowGood: 'விதைப்புக்கு நல்ல நிலை — மிதமான வெப்பமும் மழையும் முளைப்புக்கு உதவும்', advisorySowSuitableDry: 'வெப்பநிலை ஏற்றது ஆனால் மழை குறைவு — விதைப்பதற்கு முன் மண் ஈரப்பதத்தை உறுதி செய்யவும்', advisorySowCheck: 'விதைப்பதற்கு முன் உள்ளூர் மண் ஈரப்பதம் மற்றும் வானிலை முன்னறிவிப்பை சரிபார்க்கவும்',
  },
};

export function useHomeLang(): HomeTranslationKey {
  const { lang } = useLang();
  return homeTranslations[lang] ?? homeTranslations.en;
}
