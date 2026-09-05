export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta';

export const languages: { id: Language; label: string; nativeLabel: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { id: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { id: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { id: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export interface TranslationKey {
  // App
  appName: string;
  appTagline: string;
  // Nav
  navScan: string;
  navFertilizer: string;
  navSchemes: string;
  navHistory: string;
  navHelpline: string;
  // Scan screen
  scanGreeting: string;
  scanTitle: string;
  scanSubtitle: string;
  scanQuickDiagnosis: string;
  scanScanALeaf: string;
  scanClearPhotos: string;
  scanTakePhoto: string;
  scanChangePhoto: string;
  scanPhotoReady: string;
  scanDiagnosisFailed: string;
  scanTellAboutCrop: string;
  scanThisHelpsImprove: string;
  scanCropType: string;
  scanGrowthStage: string;
  scanAnalysing: string;
  scanAnalysingLong: string;
  scanAnalyseThis: string;
  scanUseSample: string;
  scanPhotoStays: string;
  // Diagnosis screen
  diagNewScan: string;
  diagCropCheck: string;
  diagCropHealthReport: string;
  diagGetExpertOpinion: string;
  diagLikelyIssue: string;
  diagWhatYouCanDo: string;
  diagSimpleSteps: string;
  diagUncertain: string;
  diagUncertainDesc: string;
  diagNotified: string;
  diagOfflineMode: string;
  diagOfflineDesc: string;
  diagAIDisclaimer: string;
  diagEscalate: string;
  diagStartAnother: string;
  diagAskAI: string;
  diagAskAIAbout: string;
  diagAboutIssue: string;
  diagPrevention: string;
  diagPreventionDesc: string;
  diagTreatment: string;
  diagTreatmentDesc: string;
  diagTreatmentFallback: string;
  // Calculator
  calcPlanNext: string;
  calcTitle: string;
  calcSubtitle: string;
  calcFarmDetails: string;
  calcCropType: string;
  calcFarmSize: string;
  calcAcres: string;
  calcHectares: string;
  calcGrowthStage: string;
  calcEstimatedNeed: string;
  calcFor: string;
  calcNitrogen: string;
  calcPhosphate: string;
  calcPotash: string;
  calcProductQty: string;
  calcSchedule: string;
  calcWaterAfter: string;
  // History
  histSavedActivity: string;
  histTitle: string;
  histSubtitle: string;
  histNoScans: string;
  histNoScansDesc: string;
  histSentToOfficer: string;
  // Helpline
  helpFreeGovt: string;
  helpTitle: string;
  helpSubtitle: string;
  helpKCC: string;
  helpFreeHelpline: string;
  helpMinistry: string;
  helpCall: string;
  helpTollFree: string;
  helpWhatAsk: string;
  helpAdvisorsReady: string;
  helpCropDiseases: string;
  helpFertilizer: string;
  helpWeather: string;
  helpAnimal: string;
  helpLocalLang: string;
  helpLocalLangDesc: string;
  helpLocalLangBody: string;
  helpEscalatedNote: string;
  // Schemes
  schemesSupport: string;
  schemesTitle: string;
  schemesSubtitle: string;
  schemesRecommended: string;
  schemesBasedOn: string;
  schemesSearchPlaceholder: string;
  schemesFilters: string;
  schemesClearAll: string;
  schemesCrop: string;
  schemesState: string;
  schemesCategory: string;
  schemesFarmerCat: string;
  schemesAllCrops: string;
  schemesAllStates: string;
  schemesAllCategories: string;
  schemesAllFarmerTypes: string;
  schemesFound: string;
  schemesVerified: string;
  schemesWhoCanApply: string;
  schemesMainBenefit: string;
  schemesMore: string;
  schemesViewDetails: string;
  schemesVisit: string;
  schemesNoMatch: string;
  schemesNoMatchDesc: string;
  schemesClearFilters: string;
  // Queue
  queueBack: string;
  queueOfficerView: string;
  queueTitle: string;
  queueSubtitle: string;
  queueCasesWaiting: string;
  queueClear: string;
  queueClearDesc: string;
  queueAIGuess: string;
  queueReviewCase: string;
  queueCaseReview: string;
  queueScan: string;
  queueAIBestGuess: string;
  queueConfidenceVerify: string;
  queueCorrect: string;
  queueApprove: string;
  // Chat
  chatTitle: string;
  chatSubtitle: string;
  chatClose: string;
  chatPlaceholder: string;
  chatSend: string;
  chatWelcome: string;
  chatWelcomeNoCtx: string;
  chatSuggestion1: string;
  chatSuggestion2: string;
  chatSuggestion3: string;
  chatErrorConnect: string;
  chatErrorProcess: string;
  // Scan errors
  scanNotACrop: string;
  scanErrNetwork: string;
  scanErrApiKeyMissing: string;
  scanErrKindwiseFetch: string;
  scanErrKindwiseApi: string;
  scanErrParse: string;
  scanErrInternal: string;
  scanErrServiceUnavailable: string;
 scanErrInvalidImage: string;
  // Common
  commonBack: string;
  commonMoreTools: string;
  commonWorksOffline: string;
  commonWorksOfflineDesc: string;
  commonNotifications: string;
  commonOpenMenu: string;
  commonCloseMenu: string;
  commonAskAI: string;
  commonOfficerQueue: string;
  schemesVerifiedDate: string;
}

export const translations: Record<Language, TranslationKey> = {
  en: {
    appName: 'FasalSathi', appTagline: 'Fasal ki pehchaan, sahi samadhaan',
    navScan: 'Scan', navFertilizer: 'Fertilizer', navSchemes: 'Schemes', navHistory: 'History', navHelpline: 'Helpline',
    scanGreeting: 'Good morning, farmer', scanTitle: 'Check your crop health', scanSubtitle: 'Take a clear photo of an affected leaf, fruit, or plant part. FasalSathi will help you understand what your crop needs.',
    scanQuickDiagnosis: 'Quick diagnosis', scanScanALeaf: 'Scan a crop', scanClearPhotos: 'Clear photos give better results.',
    scanTakePhoto: 'Take photo or upload', scanChangePhoto: 'Change photo', scanPhotoReady: 'Photo ready', scanDiagnosisFailed: 'Diagnosis failed',
    scanTellAboutCrop: 'Tell us about the crop', scanThisHelpsImprove: 'This helps improve the diagnosis',
    scanCropType: 'Crop type', scanGrowthStage: 'Growth stage', scanAnalysing: 'Analysing your photo...', scanAnalysingLong: 'Analysing your photo — this can take up to 30 seconds...', scanAnalyseThis: 'Analyse this crop', scanUseSample: 'Use sample photo & analyse',
    scanPhotoStays: 'Your photo stays on this device first, even without internet.',
    diagNewScan: 'New scan', diagCropCheck: 'crop check', diagCropHealthReport: 'Your crop health report', diagGetExpertOpinion: "Let's get an expert opinion",
    diagLikelyIssue: 'Likely issue', diagWhatYouCanDo: 'What you can do', diagSimpleSteps: 'Simple steps for your field',
    diagUncertain: 'Uncertain — flagged for expert review', diagUncertainDesc: 'The photo is not clear enough to safely identify the issue. We will not guess. Your case has been saved and sent to an agricultural officer.',
    diagNotified: "You'll be notified after review",
    diagOfflineMode: 'Offline knowledge mode', diagOfflineDesc: 'AI photo analysis is unavailable, so this result is based on general crop knowledge. For an exact diagnosis, add a Kindwise API key or call the Kisan helpline.',
    diagAIDisclaimer: 'This is an AI-assisted suggestion, not a final agricultural prescription. For severe damage, contact your nearest agriculture officer.',
    diagEscalate: 'Not sure? Escalate to expert', diagStartAnother: 'Start another scan', diagAskAI: 'Ask AI Assistant', diagAskAIAbout: 'Ask AI Assistant about this',
    diagAboutIssue: 'About this issue', diagPrevention: 'Prevention', diagPreventionDesc: 'Steps to prevent future occurrences', diagTreatment: 'Treatment', diagTreatmentDesc: 'What to do right now for an active infestation', diagTreatmentFallback: 'For active treatment options, consult your nearest agriculture officer or the Kisan helpline.',
    calcPlanNext: 'Plan your next application', calcTitle: 'Fertilizer calculator', calcSubtitle: 'Get a starting estimate based on crop and growth stage. A soil test gives the most accurate advice.',
    calcFarmDetails: 'Your farm details', calcCropType: 'Crop type', calcFarmSize: 'Farm size', calcAcres: 'Acres', calcHectares: 'Hectares', calcGrowthStage: 'Growth stage',
    calcEstimatedNeed: 'Estimated need', calcFor: 'For', calcNitrogen: 'kg Nitrogen', calcPhosphate: 'kg Phosphate', calcPotash: 'kg Potash',
    calcProductQty: 'Approx. product quantities', calcSchedule: 'Application schedule', calcWaterAfter: 'Water after applying fertilizer, unless rain is expected within 24 hours.',
    histSavedActivity: 'Your saved activity', histTitle: 'Case history', histSubtitle: 'Your scan reports stay on this device for easy reference.',
    histNoScans: 'No scans yet', histNoScansDesc: 'Your crop checks will appear here.', histSentToOfficer: 'Sent to officer',
    helpFreeGovt: 'Free government helpline', helpTitle: 'Talk to an expert', helpSubtitle: 'Sometimes the best diagnosis comes from a human. Call the Kisan Call Centre — a free service from the Government of India.',
    helpKCC: 'Kisan Call Centre', helpFreeHelpline: 'Free farmer helpline', helpMinistry: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    helpCall: 'Call', helpTollFree: 'Toll-free · Available 6 AM–10 PM, 7 days a week',
    helpWhatAsk: 'What you can ask about', helpAdvisorsReady: 'The advisors are ready to help with',
    helpCropDiseases: 'Crop diseases and pests', helpFertilizer: 'Which fertilizer or pesticide to use', helpWeather: 'Weather-related crop problems', helpAnimal: 'Animal husbandry and fisheries',
    helpLocalLang: 'Local language support', helpLocalLangDesc: 'Assistance is provided in your local language',
    helpLocalLangBody: 'Advisors speak local languages. If the first advisor cannot resolve your question, your call can be escalated to subject-matter experts from state agriculture departments, ICAR institutions, KVKs, and agricultural universities.',
    helpEscalatedNote: 'If your FasalSathi scan was flagged for expert review, you can also call this helpline with your case details for immediate human advice.',
    schemesSupport: 'Support available for you', schemesTitle: 'Government schemes', schemesSubtitle: 'Find benefits, insurance and support programmes for farmers.',
    schemesRecommended: 'Recommended for you', schemesBasedOn: 'Based on your profile',
    schemesSearchPlaceholder: 'Search schemes...', schemesFilters: 'Filters', schemesClearAll: 'Clear all',
    schemesCrop: 'Crop', schemesState: 'State', schemesCategory: 'Category', schemesFarmerCat: 'Farmer Category',
    schemesAllCrops: 'All crops', schemesAllStates: 'All states', schemesAllCategories: 'All categories', schemesAllFarmerTypes: 'All farmer types',
    schemesFound: 'schemes found', schemesVerified: 'Verified list',
    schemesWhoCanApply: 'Who can apply', schemesMainBenefit: 'Main benefit', schemesMore: 'more',
    schemesViewDetails: 'View details', schemesVisit: 'Visit', schemesNoMatch: 'No schemes match those filters', schemesNoMatchDesc: 'Try selecting all crops or states.', schemesClearFilters: 'Clear all filters',
    queueBack: 'Back to scan', queueOfficerView: 'Agricultural officer view', queueTitle: 'Review queue', queueSubtitle: 'Low-confidence cases are held here so no farmer receives a risky guess.',
    queueCasesWaiting: 'cases waiting for review', queueClear: 'Queue is clear', queueClearDesc: 'New uncertain scans will appear here.',
    queueAIGuess: 'AI guess', queueReviewCase: 'Review this case', queueCaseReview: 'Case review', queueScan: 'scan',
    queueAIBestGuess: 'AI best guess', queueConfidenceVerify: 'confidence — verify against the photo',
    queueCorrect: 'Correct diagnosis', queueApprove: 'Approve guess',
    chatTitle: 'AI Farm Assistant', chatSubtitle: 'Ask about your crops, diseases, or farming', chatClose: 'Close chat', chatPlaceholder: 'Ask about your crop...', chatSend: 'Send message',
    chatWelcome: 'Hi! I\'m your FasalSathi assistant. I can see your crop details. Ask me anything about your diagnosis, treatment, or farming questions.',
    chatWelcomeNoCtx: 'Hi! I\'m your FasalSathi assistant. Ask me anything about your crops, diseases, fertilizer, or farming.',
    chatSuggestion1: 'What should I do about this disease?', chatSuggestion2: 'Is this treatment safe for organic farming?', chatSuggestion3: 'How can I prevent this next season?',
    chatErrorConnect: 'I could not connect right now. Please check your internet and try again, or call the Kisan helpline at 1800-180-1551.', chatErrorProcess: 'I could not process that. Please try again.',
    scanNotACrop: "This doesn't look like a crop photo. Please take a clear photo of the affected leaf, fruit, or plant part.",
    scanErrNetwork: 'Could not connect to the diagnosis service. Please check your internet connection and try again.',
    scanErrApiKeyMissing: 'AI diagnosis is not available — the Kindwise API key is missing. Please contact the app administrator, or call the Kisan helpline at 1800-180-1551.',
    scanErrKindwiseFetch: 'Could not reach the Kindwise crop.health API. Please check your internet connection and try again.',
    scanErrKindwiseApi: 'The Kindwise crop.health API returned an error. Please try again in a moment.',
    scanErrParse: 'The diagnosis service returned an unexpected response. Please try again.',
    scanErrInternal: 'Diagnosis service encountered an internal error. Please try again.',
    scanErrServiceUnavailable: 'AI diagnosis is not available right now. Please try again later, or call the Kisan helpline at 1800-180-1551.',
    scanErrInvalidImage: 'Could not read the image. Please try a different photo.',
    commonBack: 'Back', commonMoreTools: 'More tools', commonWorksOffline: 'FasalSathi works offline', commonWorksOfflineDesc: 'Your scans are saved on this phone first and sync when a connection is available.',
    commonNotifications: 'Notifications', commonOpenMenu: 'Open menu', commonCloseMenu: 'Close menu', commonAskAI: 'Ask AI assistant', commonOfficerQueue: 'Officer review queue', schemesVerifiedDate: 'Verified: ', 
  },
  hi: {
    appName: 'FasalSathi', appTagline: 'फसल की पहचान, सही समाधान',
    navScan: 'स्कैन', navFertilizer: 'खाद', navSchemes: 'योजनाएं', navHistory: 'इतिहास', navHelpline: 'हेल्पलाइन',
    scanGreeting: 'सुप्रभात, किसान', scanTitle: 'अपनी फसल का स्वास्थ्य जांचें', scanSubtitle: 'प्रभावित पत्ती, फल, या पौधे के हिस्से की एक स्पष्ट फोटो लें। FasalSathi आपको समझने में मदद करेगा कि आपकी फसल को क्या चाहिए।',
    scanQuickDiagnosis: 'त्वरित निदान', scanScanALeaf: 'फसल स्कैन करें', scanClearPhotos: 'स्पष्ट फोटो से बेहतर परिणाम मिलते हैं।',
    scanTakePhoto: 'फोटो लें या अपलोड करें', scanChangePhoto: 'फोटो बदलें', scanPhotoReady: 'फोटो तैयार', scanDiagnosisFailed: 'निदान विफल',
    scanTellAboutCrop: 'फसल के बारे में बताएं', scanThisHelpsImprove: 'इससे निदान में सुधार होता है',
    scanCropType: 'फसल का प्रकार', scanGrowthStage: 'वृद्धि चरण', scanAnalysing: 'आपकी फोटो का विश्लेषण हो रहा है...', scanAnalysingLong: 'आपकी फोटो का विश्लेषण हो रहा है — इसमें 30 सेकंड तक लग सकते हैं...', scanAnalyseThis: 'इस फसल का विश्लेषण करें', scanUseSample: 'नमूना फोटो उपयोग करें और विश्लेषण करें',
    scanPhotoStays: 'आपकी फोटो इस डिवाइस पर पहले रहती है, बिना इंटरनेट के भी।',
    diagNewScan: 'नया स्कैन', diagCropCheck: 'फसल जांच', diagCropHealthReport: 'आपकी फसल स्वास्थ्य रिपोर्ट', diagGetExpertOpinion: 'विशेषज्ञ की राय लें',
    diagLikelyIssue: 'संभावित समस्या', diagWhatYouCanDo: 'आप क्या कर सकते हैं', diagSimpleSteps: 'अपने खेत के लिए आसान कदम',
    diagUncertain: 'अनिश्चित — विशेषज्ञ समीक्षा के लिए भेजा', diagUncertainDesc: 'फोटो समस्या की सुरक्षित पहचान के लिए पर्याप्त स्पष्ट नहीं है। हम अनुमान नहीं लगाएंगे। आपका मामला सहेजा गया है और कृषि अधिकारी को भेजा गया है।',
    diagNotified: 'समीक्षा के बाद आपको सूचित किया जाएगा',
    diagOfflineMode: 'ऑफलाइन ज्ञान मोड', diagOfflineDesc: 'AI फोटो विश्लेषण उपलब्ध नहीं है, इसलिए यह परिणाम सामान्य फसल ज्ञान पर आधारित है। सटीक निदान के लिए Kisan हेल्पलाइन पर कॉल करें।',
    diagAIDisclaimer: 'यह AI-सहायता सुझाव है, अंतिम कृषि नुस्खा नहीं। गंभीर क्षति के लिए अपने निकटतम कृषि अधिकारी से संपर्क करें।',
    diagEscalate: 'सुनिश्चित नहीं? विशेषज्ञ को भेजें', diagStartAnother: 'एक और स्कैन शुरू करें', diagAskAI: 'AI सहायक से पूछें', diagAskAIAbout: 'इसके बारे में AI सहायक से पूछें',
    diagAboutIssue: 'इस समस्या के बारे में', diagPrevention: 'रोकथाम', diagPreventionDesc: 'भविष्य में इसे रोकने के कदम', diagTreatment: 'उपचार', diagTreatmentDesc: 'अभी क्या करें', diagTreatmentFallback: 'सक्रिय उपचार विकल्पों के लिए अपने निकटतम कृषि अधिकारी या किसान हेल्पलाइन से संपर्क करें।',
    calcPlanNext: 'अपनी अगली खाद योजना बनाएं', calcTitle: 'खाद कैलकुलेटर', calcSubtitle: 'फसल और वृद्धि चरण के आधार पर अनुमान पाएं। मिट्टी परीक्षण सबसे सटीक सलाह देता है।',
    calcFarmDetails: 'आपके खेत की जानकारी', calcCropType: 'फसल का प्रकार', calcFarmSize: 'खेत का आकार', calcAcres: 'एकड़', calcHectares: 'हेक्टेयर', calcGrowthStage: 'वृद्धि चरण',
    calcEstimatedNeed: 'अनुमानित आवश्यकता', calcFor: 'के लिए', calcNitrogen: 'किग्रा नाइट्रोजन', calcPhosphate: 'किग्रा फॉस्फेट', calcPotash: 'किग्रा पोटाश',
    calcProductQty: 'अनुमानित उत्पाद मात्रा', calcSchedule: 'अनुप्रयोग कार्यक्रम', calcWaterAfter: '24 घंटे में बारिश की संभावना न हो तो खाद डालने के बाद पानी दें।',
    histSavedActivity: 'आपकी सहेजी गई गतिविधि', histTitle: 'मामला इतिहास', histSubtitle: 'आपकी स्कैन रिपोर्ट आसान संदर्भ के लिए इस डिवाइस पर रहती हैं।',
    histNoScans: 'अभी तक कोई स्कैन नहीं', histNoScansDesc: 'आपकी फसल जांच यहां दिखाई देगी।', histSentToOfficer: 'अधिकारी को भेजा',
    helpFreeGovt: 'मुफ्त सरकारी हेल्पलाइन', helpTitle: 'विशेषज्ञ से बात करें', helpSubtitle: 'कभी-कभी सबसे अच्छा निदान इंसान से आता है। किसान कॉल सेंटर पर कॉल करें — भारत सरकार की मुफ्त सेवा।',
    helpKCC: 'किसान कॉल सेंटर', helpFreeHelpline: 'मुफ्त किसान हेल्पलाइन', helpMinistry: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    helpCall: 'कॉल करें', helpTollFree: 'टोल-फ्री · सुबह 6 बजे से रात 10 बजे तक, सप्ताह के 7 दिन',
    helpWhatAsk: 'आप किस बारे में पूछ सकते हैं', helpAdvisorsReady: 'सलाहकार मदद के लिए तैयार हैं',
    helpCropDiseases: 'फसल रोग और कीट', helpFertilizer: 'कौन सी खाद या कीटनाशक उपयोग करें', helpWeather: 'मौसम संबंधी फसल समस्याएं', helpAnimal: 'पशुपालन और मत्स्य पालन',
    helpLocalLang: 'स्थानीय भाषा सहायता', helpLocalLangDesc: 'आपकी स्थानीय भाषा में सहायता दी जाती है',
    helpLocalLangBody: 'सलाहकार स्थानीय भाषाएं बोलते हैं। यदि पहले सलाहकार आपका प्रश्न हल नहीं कर सकते, तो आपकी कॉल राज्य कृषि विभाग, ICAR, KVK और कृषि विश्वविद्यालयों के विशेषज्ञों तक भेजी जा सकती है।',
    helpEscalatedNote: 'यदि आपका FasalSathi स्कैन विशेषज्ञ समीक्षा के लिए भेजा गया था, तो आप तुरंत मानवीय सलाह के लिए इस हेल्पलाइन पर कॉल कर सकते हैं।',
    schemesSupport: 'आपके लिए उपलब्ध सहायता', schemesTitle: 'सरकारी योजनाएं', schemesSubtitle: 'किसानों के लिए लाभ, बीमा और सहायता कार्यक्रम खोजें।',
    schemesRecommended: 'आपके लिए अनुशंसित', schemesBasedOn: 'आपकी प्रोफ़ाइल के आधार पर',
    schemesSearchPlaceholder: 'योजनाएं खोजें...', schemesFilters: 'फ़िल्टर', schemesClearAll: 'सभी साफ़ करें',
    schemesCrop: 'फसल', schemesState: 'राज्य', schemesCategory: 'श्रेणी', schemesFarmerCat: 'किसान श्रेणी',
    schemesAllCrops: 'सभी फसलें', schemesAllStates: 'सभी राज्य', schemesAllCategories: 'सभी श्रेणियां', schemesAllFarmerTypes: 'सभी किसान प्रकार',
    schemesFound: 'योजनाएं मिलीं', schemesVerified: 'सत्यापित सूची',
    schemesWhoCanApply: 'कौन आवेदन कर सकता है', schemesMainBenefit: 'मुख्य लाभ', schemesMore: 'और',
    schemesViewDetails: 'विवरण देखें', schemesVisit: 'विज़िट करें', schemesNoMatch: 'कोई योजना इन फ़िल्टर से मेल नहीं खाती', schemesNoMatchDesc: 'सभी फसलें या राज्य चुनकर देखें।', schemesClearFilters: 'सभी फ़िल्टर साफ़ करें',
    queueBack: 'स्कैन पर वापस', queueOfficerView: 'कृषि अधिकारी दृश्य', queueTitle: 'समीक्षा कतार', queueSubtitle: 'कम आत्मविश्वास वाले मामले यहां रखे जाते हैं ताकि किसान को जोखिम भरा अनुमान न मिले।',
    queueCasesWaiting: 'मामले समीक्षा की प्रतीक्षा में', queueClear: 'कतार खाली है', queueClearDesc: 'नए अनिश्चित स्कैन यहां दिखाई देंगे।',
    queueAIGuess: 'AI अनुमान', queueReviewCase: 'इस मामले की समीक्षा करें', queueCaseReview: 'मामला समीक्षा', queueScan: 'स्कैन',
    queueAIBestGuess: 'AI सर्वश्रेष्ठ अनुमान', queueConfidenceVerify: 'आत्मविश्वास — फोटो से जांचें',
    queueCorrect: 'निदान सुधारें', queueApprove: 'अनुमान स्वीकारें',
    chatTitle: 'AI फार्म सहायक', chatSubtitle: 'अपनी फसल, रोग, या खेती के बारे में पूछें', chatClose: 'चैट बंद करें', chatPlaceholder: 'अपनी फसल के बारे में पूछें...', chatSend: 'संदेश भेजें',
    chatWelcome: 'नमस्ते! मैं आपका FasalSathi सहायक हूं। मैं आपकी फसल की जानकारी देख सकता हूं। निदान, उपचार, या खेती के बारे में कुछ भी पूछें।',
    chatWelcomeNoCtx: 'नमस्ते! मैं आपका FasalSathi सहायक हूं। फसल, रोग, खाद, या खेती के बारे में कुछ भी पूछें।',
    chatSuggestion1: 'इस रोग के लिए मुझे क्या करना चाहिए?', chatSuggestion2: 'क्या यह उपचार जैविक खेती के लिए सुरक्षित है?', chatSuggestion3: 'अगली बार इसे कैसे रोकूं?',
    chatErrorConnect: 'अभी कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें, या किसान हेल्पलाइन 1800-180-1551 पर कॉल करें।', chatErrorProcess: 'मैं इसे संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।',
    scanNotACrop: 'यह फसल की फोटो नहीं लगती। कृपया प्रभावित पत्ती, फल, या पौधे के हिस्से की एक स्पष्ट फोटो लें।',
    scanErrNetwork: 'निदान सेवा से कनेक्ट नहीं हो सका। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें।',
    scanErrApiKeyMissing: 'AI निदान उपलब्ध नहीं है — Kindwise API कुंजी गायब है। कृपया ऐप व्यवस्थापक से संपर्क करें, या किसान हेल्पलाइन 1800-180-1551 पर कॉल करें।',
    scanErrKindwiseFetch: 'Kindwise crop.health API तक नहीं पहुंच सका। कृपया अपना इंटरनेट जांचें और पुनः प्रयास करें।',
    scanErrKindwiseApi: 'Kindwise crop.health API ने त्रुटि दी। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
    scanErrParse: 'निदान सेवा ने अप्रत्याशित प्रतिक्रिया दी। कृपया पुनः प्रयास करें।',
    scanErrInternal: 'निदान सेवा में आंतरिक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    scanErrServiceUnavailable: 'AI निदान अभी उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें, या किसान हेल्पलाइन 1800-180-1551 पर कॉल करें।',
    scanErrInvalidImage: 'छवि पढ़ी नहीं जा सकी। कृपया दूसरी फोटो आज़माएं।',
    commonBack: 'वापस', commonMoreTools: 'अधिक उपकरण', commonWorksOffline: 'FasalSathi ऑफलाइन काम करता है', commonWorksOfflineDesc: 'आपके स्कैन इस फोन पर पहले सहेजे जाते हैं और कनेक्शन उपलब्ध होने पर सिंक होते हैं।',
    commonNotifications: 'सूचनाएं', commonOpenMenu: 'मेन्यू खोलें', commonCloseMenu: 'मेन्यू बंद करें', commonAskAI: 'AI सहायक से पूछें', commonOfficerQueue: 'अधिकारी समीक्षा कतार', schemesVerifiedDate: 'सत्यापित: ', 
  },
  bn: {
    appName: 'FasalSathi', appTagline: 'ফসলের পরিচয়, সঠিক সমাধান',
    navScan: 'স্ক্যান', navFertilizer: 'সার', navSchemes: 'প্রকল্প', navHistory: 'ইতিহাস', navHelpline: 'হেল্পলাইন',
    scanGreeting: 'সুপ্রভাত, কৃষক', scanTitle: 'আপনার ফসলের স্বাস্থ্য পরীক্ষা করুন', scanSubtitle: 'আক্রান্ত পাতা, ফল, বা গাছের অংশের একটি পরিষ্কার ছবি নিন। FasalSathi আপনাকে বুঝতে সাহায্য করবে আপনার ফসলের কী প্রয়োজন।',
    scanQuickDiagnosis: 'দ্রুত নির্ণয়', scanScanALeaf: 'ফসল স্ক্যান করুন', scanClearPhotos: 'পরিষ্কার ছবিতে ভালো ফলাফল পাওয়া যায়।',
    scanTakePhoto: 'ছবি নিন বা আপলোড করুন', scanChangePhoto: 'ছবি পরিবর্তন করুন', scanPhotoReady: 'ছবি প্রস্তুত', scanDiagnosisFailed: 'নির্ণয় ব্যর্থ',
    scanTellAboutCrop: 'ফসল সম্পর্কে বলুন', scanThisHelpsImprove: 'এটি নির্ণয় উন্নত করতে সাহায্য করে',
    scanCropType: 'ফসলের ধরন', scanGrowthStage: 'বৃদ্ধির পর্যায়', scanAnalysing: 'আপনার ছবি বিশ্লেষণ হচ্ছে...', scanAnalysingLong: 'আপনার ছবি বিশ্লেষণ হচ্ছে — এতে 30 সেকেন্ড পর্যন্ত সময় লাগতে পারে...', scanAnalyseThis: 'এই ফসল বিশ্লেষণ করুন', scanUseSample: 'নমুনা ছবি ব্যবহার করুন ও বিশ্লেষণ করুন',
    scanPhotoStays: 'আপনার ছবি ইন্টারনেট ছাড়াই এই ডিভাইসে থাকে।',
    diagNewScan: 'নতুন স্ক্যান', diagCropCheck: 'ফসল পরীক্ষা', diagCropHealthReport: 'আপনার ফসল স্বাস্থ্য প্রতিবেদন', diagGetExpertOpinion: 'বিশেষজ্ঞের মতামত নিন',
    diagLikelyIssue: 'সম্ভাব্য সমস্যা', diagWhatYouCanDo: 'আপনি কী করতে পারেন', diagSimpleSteps: 'আপনার খেতের জন্য সহজ পদক্ষেপ',
    diagUncertain: 'অনিশ্চিত — বিশেষজ্ঞ পর্যালোচনায় পাঠানো হয়েছে', diagUncertainDesc: 'ছবি সমস্যা নিরাপদভাবে শনাক্ত করার জন্য যথেষ্ট পরিষ্কার নয়। আমরা অনুমান করব না। আপনার মামলা সংরক্ষিত হয়েছে এবং কৃষি অফিসারের কাছে পাঠানো হয়েছে।',
    diagNotified: 'পর্যালোচনার পরে আপনাকে জানানো হবে',
    diagOfflineMode: 'অফলাইন জ্ঞান মোড', diagOfflineDesc: 'AI ফটো বিশ্লেষণ অনুপলব্ধ, তাই এই ফলাফল সাধারণ ফসল জ্ঞানের উপর ভিত্তি করে। সঠিক নির্ণয়ের জন্য Kisan হেল্পলাইনে কল করুন।',
    diagAIDisclaimer: 'এটি একটি AI-সহায়তা পরামর্শ, চূড়ান্ত কৃষি নির্দেশ নয়। গুরুতর ক্ষতির জন্য আপনার নিকটতম কৃষি অফিসারের সাথে যোগাযোগ করুন।',
    diagEscalate: 'নিশ্চিত নন? বিশেষজ্ঞের কাছে পাঠান', diagStartAnother: 'আরেকটি স্ক্যান শুরু করুন', diagAskAI: 'AI সহকারীকে জিজ্ঞাসা করুন', diagAskAIAbout: 'এই বিষয়ে AI সহকারীকে জিজ্ঞাসা করুন',
    diagAboutIssue: 'এই সমস্যা সম্পর্কে', diagPrevention: 'প্রতিরোধ', diagPreventionDesc: 'ভবিষ্যতে এটি রোধ করার পদক্ষেপ', diagTreatment: 'চিকিৎসা', diagTreatmentDesc: 'এখন কী করবেন', diagTreatmentFallback: 'সক্রিয় চিকিৎসার বিকল্পের জন্য আপনার নিকটতম কৃষি অফিসার বা কিসান হেল্পলাইনে যোগাযোগ করুন।',
    calcPlanNext: 'আপনার পরবর্তী সার পরিকল্পনা করুন', calcTitle: 'সার ক্যালকুলেটর', calcSubtitle: 'ফসল এবং বৃদ্ধির পর্যায়ের উপর ভিত্তি করে অনুমান পান। মাটি পরীক্ষা সবচেয়ে নির্ভুল পরামর্শ দেয়।',
    calcFarmDetails: 'আপনার খামারের তথ্য', calcCropType: 'ফসলের ধরন', calcFarmSize: 'খামারের আকার', calcAcres: 'একর', calcHectares: 'হেক্টর', calcGrowthStage: 'বৃদ্ধির পর্যায়',
    calcEstimatedNeed: 'আনুমানিক প্রয়োজন', calcFor: 'জন্য', calcNitrogen: 'কেজি নাইট্রোজেন', calcPhosphate: 'কেজি ফসফেট', calcPotash: 'কেজি পটাশ',
    calcProductQty: 'আনুমানিক পণ্যের পরিমাণ', calcSchedule: 'প্রয়োগের সময়সূচি', calcWaterAfter: '২৪ ঘন্টায় বৃষ্টির সম্ভাবনা না থাকলে সার দেওয়ার পরে পানি দিন।',
    histSavedActivity: 'আপনার সংরক্ষিত কার্যকলাপ', histTitle: 'মামলার ইতিহাস', histSubtitle: 'আপনার স্ক্যান প্রতিবেদন সহজ রেফারেন্সের জন্য এই ডিভাইসে থাকে।',
    histNoScans: 'এখনও কোনো স্ক্যান নেই', histNoScansDesc: 'আপনার ফসল পরীক্ষা এখানে দেখা যাবে।', histSentToOfficer: 'অফিসারের কাছে পাঠানো',
    helpFreeGovt: 'বিনামূল্য সরকারি হেল্পলাইন', helpTitle: 'বিশেষজ্ঞের সাথে কথা বলুন', helpSubtitle: 'কখনও সবচেয়ে ভালো নির্ণয় মানুষের কাছ থেকে আসে। কিসান কল সেন্টারে কল করুন — ভারত সরকারের বিনামূল্য সেবা।',
    helpKCC: 'কিসান কল সেন্টার', helpFreeHelpline: 'বিনামূল্য কৃষক হেল্পলাইন', helpMinistry: 'কৃষি ও কৃষক কল্যাণ মন্ত্রণালয়, ভারত সরকার',
    helpCall: 'কল করুন', helpTollFree: 'টোল-ফ্রি · সকাল ৬টা থেকে রাত ১০টা পর্যন্ত, সপ্তাহে ৭ দিন',
    helpWhatAsk: 'আপনি কী সম্পর্কে জিজ্ঞাসা করতে পারেন', helpAdvisorsReady: 'উপদেষ্টারা সাহায্য করতে প্রস্তুত',
    helpCropDiseases: 'ফসল রোগ ও পোকামাকড়', helpFertilizer: 'কোন সার বা কীটনাশক ব্যবহার করবেন', helpWeather: 'আবহাওয়া সংক্রান্ত ফসল সমস্যা', helpAnimal: 'পশুপালন ও মৎস্য চাষ',
    helpLocalLang: 'স্থানীয় ভাষা সহায়তা', helpLocalLangDesc: 'আপনার স্থানীয় ভাষায় সহায়তা দেওয়া হয়',
    helpLocalLangBody: 'উপদেষ্টারা স্থানীয় ভাষায় কথা বলেন। প্রথম উপদেষ্টা আপনার প্রশ্ন সমাধান করতে না পারলে, রাজ্য কৃষি বিভাগ, ICAR, KVK এবং কৃষি বিশ্ববিদ্যালয়ের বিশেষজ্ঞদের কাছে পাঠানো হতে পারে।',
    helpEscalatedNote: 'আপনার FasalSathi স্ক্যান বিশেষজ্ঞ পর্যালোচনার জন্য পাঠানো হলে, আপনি এই হেল্পলাইনে কল করে তাৎক্ষণিক মানবিক পরামর্শ নিতে পারেন।',
    schemesSupport: 'আপনার জন্য উপলব্ধ সহায়তা', schemesTitle: 'সরকারি প্রকল্প', schemesSubtitle: 'কৃষকদের জন্য সুবিধা, বীমা ও সহায়তা কর্মসূচি খুঁজুন।',
    schemesRecommended: 'আপনার জন্য সুপারিশকৃত', schemesBasedOn: 'আপনার প্রোফাইলের উপর ভিত্তি করে',
    schemesSearchPlaceholder: 'প্রকল্প খুঁজুন...', schemesFilters: 'ফিল্টার', schemesClearAll: 'সব মুছুন',
    schemesCrop: 'ফসল', schemesState: 'রাজ্য', schemesCategory: 'বিভাগ', schemesFarmerCat: 'কৃষক বিভাগ',
    schemesAllCrops: 'সব ফসল', schemesAllStates: 'সব রাজ্য', schemesAllCategories: 'সব বিভাগ', schemesAllFarmerTypes: 'সব কৃষক প্রকার',
    schemesFound: 'প্রকল্প পাওয়া গেছে', schemesVerified: 'যাচাইকৃত তালিকা',
    schemesWhoCanApply: 'কারা আবেদন করতে পারেন', schemesMainBenefit: 'প্রধান সুবিধা', schemesMore: 'আরও',
    schemesViewDetails: 'বিস্তারিত দেখুন', schemesVisit: 'ভিজিট করুন', schemesNoMatch: 'এই ফিল্টারে কোনো প্রকল্প মেলেনি', schemesNoMatchDesc: 'সব ফসল বা রাজ্য নির্বাচন করে দেখুন।', schemesClearFilters: 'সব ফিল্টার মুছুন',
    queueBack: 'স্ক্যানে ফিরে যান', queueOfficerView: 'কৃষি অফিসার দৃশ্য', queueTitle: 'পর্যালোচনা সারি', queueSubtitle: 'কম আত্মবিশ্বাসের মামলাগুলি এখানে রাখা হয় যাতে কোনো কৃষক ঝুঁকিপূর্ণ অনুমান না পান।',
    queueCasesWaiting: 'মামলা পর্যালোচনার অপেক্ষায়', queueClear: 'সারি খালি', queueClearDesc: 'নতুন অনিশ্চিত স্ক্যান এখানে দেখা যাবে।',
    queueAIGuess: 'AI অনুমান', queueReviewCase: 'এই মামলাটি পর্যালোচনা করুন', queueCaseReview: 'মামলা পর্যালোচনা', queueScan: 'স্ক্যান',
    queueAIBestGuess: 'AI সেরা অনুমান', queueConfidenceVerify: 'আত্মবিশ্বাস — ছবির সাথে যাচাই করুন',
    queueCorrect: 'নির্ণয় সংশোধন করুন', queueApprove: 'অনুমান অনুমোদন করুন',
    chatTitle: 'AI ফার্ম সহকারী', chatSubtitle: 'আপনার ফসল, রোগ, বা কৃষি সম্পর্কে জিজ্ঞাসা করুন', chatClose: 'চ্যাট বন্ধ করুন', chatPlaceholder: 'আপনার ফসল সম্পর্কে জিজ্ঞাসা করুন...', chatSend: 'বার্তা পাঠান',
    chatWelcome: 'হ্যালো! আমি আপনার FasalSathi সহকারী। আমি আপনার ফসলের তথ্য দেখতে পাচ্ছি। নির্ণয়, চিকিৎসা, বা কৃষি সম্পর্কে কিছু জিজ্ঞাসা করুন।',
    chatWelcomeNoCtx: 'হ্যালো! আমি আপনার FasalSathi সহকারী। ফসল, রোগ, সার, বা কৃষি সম্পর্কে কিছু জিজ্ঞাসা করুন।',
    chatSuggestion1: 'এই রোগের জন্য আমার কী করা উচিত?', chatSuggestion2: 'এই চিকিৎসা কি জৈব চাষের জন্য নিরাপদ?', chatSuggestion3: 'পরেরবার কীভাবে এটি প্রতিরোধ করব?',
    chatErrorConnect: 'এখন সংযোগ করা যায়নি। কৃপয়া আপনার ইন্টারনেট পরীক্ষা করুন এবং আবার চেষ্টা করুন, বা কিসান হেল্পলাইন 1800-180-1551 এ কল করুন।', chatErrorProcess: 'আমি এটি প্রক্রিয়া করতে পারিনি। কৃপয়া আবার চেষ্টা করুন।',
    scanNotACrop: 'এটি ফসলের ছবি বলে মনে হচ্ছে না। অনুগ্রহ করে আক্রান্ত পাতা, ফল, বা গাছের অংশের একটি পরিষ্কার ছবি নিন।',
    scanErrNetwork: 'নির্ণয় পরিষেবার সাথে সংযুক্ত হওয়া যায়নি। কৃপয়া আপনার ইন্টারনেট পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
    scanErrApiKeyMissing: 'AI নির্ণয় উপলব্ধ নয় — Kindwise API কী অনুপস্থিত। কৃপয়া অ্যাপ প্রশাসকের সাথে যোগাযোগ করুন, বা কিসান হেল্পলাইন 1800-180-1551 এ কল করুন।',
    scanErrKindwiseFetch: 'Kindwise crop.health API-তে পৌঁছানো গেল না। কৃপয়া আপনার ইন্টারনেট পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
    scanErrKindwiseApi: 'Kindwise crop.health API ত্রুটি দিয়েছে। কৃপয়া একটু পরে আবার চেষ্টা করুন।',
    scanErrParse: 'নির্ণয় পরিষেবা অপ্রত্যাশিত প্রতিক্রিয়া দিয়েছে। কৃপয়া আবার চেষ্টা করুন।',
    scanErrInternal: 'নির্ণয় পরিষেবায় অভ্যন্তরীণ ত্রুটি হয়েছে। কৃপয়া আবার চেষ্টা করুন।',
    scanErrServiceUnavailable: 'AI নির্ণয় এখন উপলব্ধ নয়। কৃপয়া পরে আবার চেষ্টা করুন, বা কিসান হেল্পলাইন 1800-180-1551 এ কল করুন।',
    scanErrInvalidImage: 'ছবিটি পড়া যায়নি। কৃপয়া অন্য একটি ছবি চেষ্টা করুন।',
    commonBack: 'ফিরে যান', commonMoreTools: 'আরও সরঞ্জাম', commonWorksOffline: 'FasalSathi অফলাইনে কাজ করে', commonWorksOfflineDesc: 'আপনার স্ক্যান এই ফোনে প্রথমে সংরক্ষিত হয় এবং সংযোগ উপলব্ধ হলে সিঙ্ক হয়।',
    commonNotifications: 'বিজ্ঞপ্তি', commonOpenMenu: 'মেনু খুলুন', commonCloseMenu: 'মেনু বন্ধ করুন', commonAskAI: 'AI সহকারীকে জিজ্ঞাসা করুন', commonOfficerQueue: 'অফিসার পর্যালোচনা সারি', schemesVerifiedDate: 'যাচাইকৃত: ', 
  },
  te: {
    appName: 'FasalSathi', appTagline: 'పంట గుర్తింపు, సరైన పరిష్కారం',
    navScan: 'స్కాన్', navFertilizer: 'ఎరువు', navSchemes: 'పథకాలు', navHistory: 'చరిత్ర', navHelpline: 'హెల్ప్‌లైన్',
    scanGreeting: 'శుభోదయం, రైతు', scanTitle: 'మీ పంట ఆరోగ్యాన్ని తనిఖీ చేయండి', scanSubtitle: 'ప్రభావిత ఆకు, పండు, లేదా మొక్క భాగం యొక్క స్పష్టమైన ఫోటో తీయండి. FasalSathi మీ పంటకు ఏమి అవసరమో అర్థం చేసుకోవడంలో సహాయపడుతుంది.',
    scanQuickDiagnosis: 'త్వరిత నిర్ధారణ', scanScanALeaf: 'పంటను స్కాన్ చేయండి', scanClearPhotos: 'స్పష్టమైన ఫోటోలు మంచి ఫలితాలను ఇస్తాయి.',
    scanTakePhoto: 'ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి', scanChangePhoto: 'ఫోటో మార్చండి', scanPhotoReady: 'ఫోటో సిద్ధం', scanDiagnosisFailed: 'నిర్ధారణ విఫలమైంది',
    scanTellAboutCrop: 'పంట గురించి చెప్పండి', scanThisHelpsImprove: 'ఇది నిర్ధారణను మెరుగుపరచడంలో సహాయపడుతుంది',
    scanCropType: 'పంట రకం', scanGrowthStage: 'ఎదుగు దశ', scanAnalysing: 'మీ ఫోటోను విశ్లేషిస్తోంది...', scanAnalysingLong: 'మీ ఫోటోను విశ్లేషిస్తోంది — ఇందుకు 30 సెకన్ల వరకు పట్టవచ్చు...', scanAnalyseThis: 'ఈ పంటను విశ్లేషించండి', scanUseSample: 'నమూనా ఫోటో ఉపయోగించి విశ్లేషించండి',
    scanPhotoStays: 'మీ ఫోటో ఇంటర్నెట్ లేకుండానే ఈ పరికరంలో ఉంటుంది.',
    diagNewScan: 'కొత్త స్కాన్', diagCropCheck: 'పంట తనిఖీ', diagCropHealthReport: 'మీ పంట ఆరోగ్య నివేదిక', diagGetExpertOpinion: 'నిపుణుడి అభిప్రాయం తీసుకోండి',
    diagLikelyIssue: 'సాధ్యమైన సమస్య', diagWhatYouCanDo: 'మీరు ఏమి చేయవచ్చు', diagSimpleSteps: 'మీ పొలం కోసం సులభమైన దశలు',
    diagUncertain: 'అనిశ్చితం — నిపుణుడి సమీక్షకు పంపబడింది', diagUncertainDesc: 'ఫోటో సమస్యను సురక్షితంగా గుర్తించడానికి స్పష్టంగా లేదు. మేము ఊహించము. మీ కేసు సేవ్ చేయబడింది మరియు వ్యవసాయ అధికారికి పంపబడింది.',
    diagNotified: 'సమీక్ష తర్వాత మీకు తెలియజేస్తారు',
    diagOfflineMode: 'ఆఫ్‌లైన్ జ్ఞాన మోడ్', diagOfflineDesc: 'AI ఫోటో విశ్లేషణ అందుబాటులో లేదు, కాబట్టి ఈ ఫలితం సాధారణ పంట జ్ఞానంపై ఆధారపడి ఉంది. ఖచ్చితమైన నిర్ధారణ కోసం Kisan హెల్ప్‌లైన్‌కు కాల్ చేయండి.',
    diagAIDisclaimer: 'ఇది AI-సహాయ సూచన, తుది వ్యవసాయ ప్రిస్క్రిప్షన్ కాదు. తీవ్రమైన నష్టం కోసం మీ సమీప వ్యవసాయ అధికారిని సంప్రదించండి.',
    diagEscalate: 'ఖచ్చితం కాదా? నిపుణుడికి పంపండి', diagStartAnother: 'మరొక స్కాన్ ప్రారంభించండి', diagAskAI: 'AI సహాయకుడిని అడగండి', diagAskAIAbout: 'దీని గురించి AI సహాయకుడిని అడగండి',
    diagAboutIssue: 'ఈ సమస్య గురించి', diagPrevention: 'నివారణ', diagPreventionDesc: 'భవిష్యత్తులో దీన్ని నివారించడానికి చర్యలు', diagTreatment: 'చికిత్స', diagTreatmentDesc: 'ఇప్పుడు ఏమి చేయాలి', diagTreatmentFallback: 'సక్రియ చికిత్స ఎంపికల కోసం మీ సమీప వ్యవసాయ అధికారి లేదా కిసాన్ హెల్ప్‌లైన్‌ను సంప్రదించండి.',
    calcPlanNext: 'మీ తదుపరి ఎరువు ప్రణాళిక చేయండి', calcTitle: 'ఎరువు కాలిక్యులేటర్', calcSubtitle: 'పంట మరియు ఎదుగు దశ ఆధారంగా అంచనా పొందండి. నేల పరీక్ష అత్యంత కచ్చితమైన సలహా ఇస్తుంది.',
    calcFarmDetails: 'మీ పొలం వివరాలు', calcCropType: 'పంట రకం', calcFarmSize: 'పొలం పరిమాణం', calcAcres: 'ఎకరాలు', calcHectares: 'హెక్టార్లు', calcGrowthStage: 'ఎదుగు దశ',
    calcEstimatedNeed: 'అంచనా అవసరం', calcFor: 'కోసం', calcNitrogen: 'కేజీ నత్రజని', calcPhosphate: 'కేజీ ఫాస్ఫేట్', calcPotash: 'కేజీ పొటాష్',
    calcProductQty: 'అంచనా ఉత్పత్తి పరిమాణాలు', calcSchedule: 'అప్లికేషన్ షెడ్యూల్', calcWaterAfter: '24 గంటలలో వర్షం అవకాశం లేకపోతే ఎరువు వేసిన తర్వాత నీరు పెట్టండి.',
    histSavedActivity: 'మీ సేవ్ చేసిన కార్యాచరణ', histTitle: 'కేసు చరిత్ర', histSubtitle: 'మీ స్కాన్ నివేదికలు సులభ సూచన కోసం ఈ పరికరంలో ఉంటాయి.',
    histNoScans: 'ఇంకా స్కాన్ లేవు', histNoScansDesc: 'మీ పంట తనిఖీలు ఇక్కడ కనిపిస్తాయి.', histSentToOfficer: 'అధికారికి పంపబడింది',
    helpFreeGovt: 'ఉచిత ప్రభుత్వ హెల్ప్‌లైన్', helpTitle: 'నిపుణుడితో మాట్లాడండి', helpSubtitle: 'కొన్నిసార్లు ఉత్తమ నిర్ధారణ మనిషి నుండి వస్తుంది. కిసాన్ కాల్ సెంటర్‌కు కాల్ చేయండి — భారత ప్రభుత్వ ఉచిత సేవ.',
    helpKCC: 'కిసాన్ కాల్ సెంటర్', helpFreeHelpline: 'ఉచిత రైతు హెల్ప్‌లైన్', helpMinistry: 'వ్యవసాయ & రైతు సంక్షేమ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
    helpCall: 'కాల్ చేయండి', helpTollFree: 'టోల్-ఫ్రీ · ఉదయం 6 గం. నుండి రాత్రి 10 గం. వరకు, వారంలో 7 రోజులు',
    helpWhatAsk: 'మీరు దేని గురించి అడగవచ్చు', helpAdvisorsReady: 'సలహాదారులు సహాయం చేయడానికి సిద్ధంగా ఉన్నారు',
    helpCropDiseases: 'పంట వ్యాధులు మరియు పురుగులు', helpFertilizer: 'ఏ ఎరువు లేదా పురుగుమందు ఉపయోగించాలి', helpWeather: 'వాతావరణ సంబంధిత పంట సమస్యలు', helpAnimal: 'పశువుల పెంపకం మరియు మత్స్య పరిశ్రమ',
    helpLocalLang: 'స్థానిక భాషా మద్దతు', helpLocalLangDesc: 'మీ స్థానిక భాషలో సహాయం అందించబడుతుంది',
    helpLocalLangBody: 'సలహాదారులు స్థానిక భాషలు మాట్లాడతారు. మొదటి సలహాదారు మీ ప్రశ్నను పరిష్కరించలేకపోతే, రాష్ట్ర వ్యవసాయ శాఖలు, ICAR, KVK మరియు వ్యవసాయ విశ్వవిద్యాలయాల నిపుణులకు మీ కాల్ ఎస్కలేట్ చేయబడవచ్చు.',
    helpEscalatedNote: 'మీ FasalSathi స్కాన్ నిపుణుడి సమీక్షకు పంపబడితే, తక్షణ మానవ సలహా కోసం ఈ హెల్ప్‌లైన్‌కు కాల్ చేయవచ్చు.',
    schemesSupport: 'మీకోసం అందుబాటులో ఉన్న సహాయం', schemesTitle: 'ప్రభుత్వ పథకాలు', schemesSubtitle: 'రైతుల కోసం ప్రయోజనాలు, బీమా మరియు సహాయ కార్యక్రమాలను కనుగొనండి.',
    schemesRecommended: 'మీకోసం సిఫార్సు చేయబడింది', schemesBasedOn: 'మీ ప్రొఫైల్ ఆధారంగా',
    schemesSearchPlaceholder: 'పథకాలను శోధించండి...', schemesFilters: 'ఫిల్టర్లు', schemesClearAll: 'అన్నీ క్లియర్ చేయండి',
    schemesCrop: 'పంట', schemesState: 'రాష్ట్రం', schemesCategory: 'వర్గం', schemesFarmerCat: 'రైతు వర్గం',
    schemesAllCrops: 'అన్ని పంటలు', schemesAllStates: 'అన్ని రాష్ట్రాలు', schemesAllCategories: 'అన్ని వర్గాలు', schemesAllFarmerTypes: 'అన్ని రైతు రకాలు',
    schemesFound: 'పథకాలు కనుగొనబడ్డాయి', schemesVerified: 'ధృవీకరించబడిన జాబితా',
    schemesWhoCanApply: 'ఎవరు దరఖాస్తు చేయవచ్చు', schemesMainBenefit: 'ప్రధాన ప్రయోజనం', schemesMore: 'మరిన్ని',
    schemesViewDetails: 'వివరాలు చూడండి', schemesVisit: 'సందర్శించండి', schemesNoMatch: 'ఆ ఫిల్టర్‌లతో ఏ పథకాలు సరిపోలలేదు', schemesNoMatchDesc: 'అన్ని పంటలు లేదా రాష్ట్రాలు ఎంచుకోవడం ప్రయత్నించండి.', schemesClearFilters: 'అన్ని ఫిల్టర్లు క్లియర్ చేయండి',
    queueBack: 'స్కాన్‌కు తిరిగి వెళ్ళండి', queueOfficerView: 'వ్యవసాయ అధికారి వీక్షణ', queueTitle: 'సమీక్ష క్యూ', queueSubtitle: 'తక్కువ విశ్వాసం కేసులు ఇక్కడ ఉంచబడతాయి తద్వారా ఏ రైతుకు ప్రమాదకరమైన ఊహ అందదు.',
    queueCasesWaiting: 'సమీక్ష కోసం వేచి ఉన్న కేసులు', queueClear: 'క్యూ ఖాళీ', queueClearDesc: 'కొత్త అనిశ్చిత స్కాన్‌లు ఇక్కడ కనిపిస్తాయి.',
    queueAIGuess: 'AI ఊహ', queueReviewCase: 'ఈ కేసు సమీక్షించండి', queueCaseReview: 'కేసు సమీక్ష', queueScan: 'స్కాన్',
    queueAIBestGuess: 'AI ఉత్తమ ఊహ', queueConfidenceVerify: 'విశ్వాసం — ఫోటోతో ధృవీకరించండి',
    queueCorrect: 'నిర్ధారణ సవరించండి', queueApprove: 'ఊహను ఆమోదించండి',
    chatTitle: 'AI ఫార్మ్ సహాయకుడు', chatSubtitle: 'మీ పంటలు, వ్యాధులు, లేదా వ్యవసాయం గురించి అడగండి', chatClose: 'చాట్ మూసివేయండి', chatPlaceholder: 'మీ పంట గురించి అడగండి...', chatSend: 'సందేశం పంపండి',
    chatWelcome: 'నమస్తే! నేను మీ FasalSathi సహాయకుడిని. మీ పంట వివరాలు చూడగలను. నిర్ధారణ, చికిత్స, లేదా వ్యవసాయం గురించి ఏదైనా అడగండి.',
    chatWelcomeNoCtx: 'నమస్తే! నేను మీ FasalSathi సహాయకుడిని. పంటలు, వ్యాధులు, ఎరువు, లేదా వ్యవసాయం గురించి ఏదైనా అడగండి.',
    chatSuggestion1: 'ఈ వ్యాధి గురించి నేను ఏమి చేయాలి?', chatSuggestion2: 'ఈ చికిత్స సేంద్రీయ వ్యవసాయానికి సురక్షితమా?', chatSuggestion3: 'తదుపరి సీజన్‌లో దీనిని ఎలా నివారించాలి?',
    chatErrorConnect: 'ఇప్పుడు కనెక్ట్ కాలేదు. దయచేసి మీ ఇంటర్నెట్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి, లేదా కిసాన్ హెల్ప్‌లైన్ 1800-180-1551 కు కాల్ చేయండి.', chatErrorProcess: 'నేను దానిని ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.',
    scanNotACrop: 'ఇది పంట ఫోటో లాగా కనిపించడం లేదు. దయచేసి ప్రభావిత ఆకు, పండు, లేదా మొక్క భాగం యొక్క స్పష్టమైన ఫోటో తీయండి.',
    scanErrNetwork: 'నిర్ధారణ సేవకు కనెక్ట్ కాలేదు. దయచేసి మీ ఇంటర్నెట్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    scanErrApiKeyMissing: 'AI నిర్ధారణ అందుబాటులో లేదు — Kindwise API కీ లేదు. దయచేసి యాప్ నిర్వాహకుడిని సంప్రదించండి, లేదా కిసాన్ హెల్ప్‌లైన్ 1800-180-1551 కు కాల్ చేయండి.',
    scanErrKindwiseFetch: 'Kindwise crop.health API కి చేరుకోలేకపోయాను. దయచేసి మీ ఇంటర్నెట్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    scanErrKindwiseApi: 'Kindwise crop.health API లో లోపం వచ్చింది. దయచేసి కొద్దిగా ఆగి మళ్లీ ప్రయత్నించండి.',
    scanErrParse: 'నిర్ధారణ సేవ ఊహించని ప్రతిస్పందన ఇచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    scanErrInternal: 'నిర్ధారణ సేవలో అంతర్గత లోపం వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    scanErrServiceUnavailable: 'AI నిర్ధారణ ఇప్పుడు అందుబాటులో లేదు. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి, లేదా కిసాన్ హెల్ప్‌లైన్ 1800-180-1551 కు కాల్ చేయండి.',
    scanErrInvalidImage: 'చిత్రం చదవడం సాధ్యం కాలేదు. దయచేసి మరొక ఫోటో ప్రయత్నించండి.',
    commonBack: 'వెనుకకు', commonMoreTools: 'మరిన్ని సాధనాలు', commonWorksOffline: 'FasalSathi ఆఫ్‌లైన్‌లో పనిచేస్తుంది', commonWorksOfflineDesc: 'మీ స్కాన్‌లు ముందుగా ఈ ఫోన్‌లో సేవ్ అవుతాయి మరియు కనెక్షన్ అందుబాటులో ఉన్నప్పుడు సింక్ అవుతాయి.',
    commonNotifications: 'నోటిఫికేషన్‌లు', commonOpenMenu: 'మెను తెరవండి', commonCloseMenu: 'మెను మూసివేయండి', commonAskAI: 'AI సహాయకుడిని అడగండి', commonOfficerQueue: 'అధికారి సమీక్ష క్యూ', schemesVerifiedDate: 'ధృవీకరించబడింది: ', 
  },
  mr: {
    appName: 'FasalSathi', appTagline: 'पिकाची ओळख, योग्य उपाय',
    navScan: 'स्कॅन', navFertilizer: 'खत', navSchemes: 'योजना', navHistory: 'इतिहास', navHelpline: 'हेल्पलाइन',
    scanGreeting: 'सुप्रभात, शेतकरी', scanTitle: 'तुमच्या पिकाचे आरोग्य तपासा', scanSubtitle: 'बाधित पान, फळ, किंवा झाडाच्या भागाची स्पष्ट फोटो घ्या. FasalSathi तुम्हाला समजून घेण्यास मदत करेल की तुमच्या पिकाला काय हवे आहे.',
    scanQuickDiagnosis: 'त्वरित निदान', scanScanALeaf: 'पीक स्कॅन करा', scanClearPhotos: 'स्पष्ट फोटो देतात चांगले निकाल.',
    scanTakePhoto: 'फोटो घ्या किंवा अपलोड करा', scanChangePhoto: 'फोटो बदला', scanPhotoReady: 'फोटो तयार', scanDiagnosisFailed: 'निदान अयशस्वी',
    scanTellAboutCrop: 'पीक सांगा', scanThisHelpsImprove: 'यामुळे निदान सुधारते',
    scanCropType: 'पीक प्रकार', scanGrowthStage: 'वाढीचा टप्पा', scanAnalysing: 'तुमची फोटो विश्लेषण होत आहे...', scanAnalysingLong: 'तुमची फोटो विश्लेषण होत आहे — यात 30 सेकंद लागू शकतात...', scanAnalyseThis: 'या पिकाचे विश्लेषण करा', scanUseSample: 'नमुना फोटो वापरा आणि विश्लेषण करा',
    scanPhotoStays: 'तुमची फोटो इंटरनेटविना या डिव्हाइसवर आधी राहते.',
    diagNewScan: 'नवीन स्कॅन', diagCropCheck: 'पीक तपासणी', diagCropHealthReport: 'तुमचा पीक आरोग्य अहवाल', diagGetExpertOpinion: 'तज्ज्ञांचे मत घ्या',
    diagLikelyIssue: 'संभाव्य समस्या', diagWhatYouCanDo: 'तुम्ही काय करू शकता', diagSimpleSteps: 'तुमच्या शेतासाठी सोप्या पायऱ्या',
    diagUncertain: 'अनिश्चित — तज्ज्ञ समीक्षेसाठी पाठवले', diagUncertainDesc: 'फोटो समस्या सुरक्षितपणे ओळखण्यासाठी पुरेसा स्पष्ट नाही. आम्ही अंदाज वापरणार नाही. तुमचा बाबती जतन केली आहे आणि कृषी अधिकाऱ्याला पाठवली आहे.',
    diagNotified: 'समीक्षेनंतर तुम्हाला कळवले जाईल',
    diagOfflineMode: 'ऑफलाइन ज्ञान मोड', diagOfflineDesc: 'AI फोटो विश्लेषण उपलब्ध नाही, म्हणून हा निकाल सामान्य पीक ज्ञानावर आधारित आहे. अचूक निदानासाठी Kisan हेल्पलाइनवर कॉल करा.',
    diagAIDisclaimer: 'हा AI-सहाय्यक सूचना आहे, अंतिम कृषी प्रिस्क्रिप्शन नाही. गंभीर नुकसानीसाठी तुमच्या जवळच्या कृषी अधिकाऱ्याशी संपर्क करा.',
    diagEscalate: 'नक्की नाही? तज्ज्ञांकडे पाठवा', diagStartAnother: 'आणखी एक स्कॅन सुरू करा', diagAskAI: 'AI सहाय्यकाला विचारा', diagAskAIAbout: 'याबद्दल AI सहाय्यकाला विचारा',
    diagAboutIssue: 'या समस्येबद्दल', diagPrevention: 'प्रतिबंध', diagPreventionDesc: 'भविष्यात हे टाळण्यासाठी उपाय', diagTreatment: 'उपचार', diagTreatmentDesc: 'आता काय करावे', diagTreatmentFallback: 'सक्रिय उपचार पर्यायांसाठी तुमच्या जवळच्या कृषी अधिकाऱ्याशी किंवा किसान हेल्पलाईनशी संपर्क करा.',
    calcPlanNext: 'तुमची पुढील खत योजना बनवा', calcTitle: 'खत कॅल्क्युलेटर', calcSubtitle: 'पीक आणि वाढीच्या टप्प्यावर आधारित अंदाज मिळवा. माती चाचणी सर्वात अचूक सल्ला देते.',
    calcFarmDetails: 'तुमच्या शेताची माहिती', calcCropType: 'पीक प्रकार', calcFarmSize: 'शेताचा आकार', calcAcres: 'एकर', calcHectares: 'हेक्टर', calcGrowthStage: 'वाढीचा टप्पा',
    calcEstimatedNeed: 'अंदाजे गरज', calcFor: 'साठी', calcNitrogen: 'किलो नायट्रोजन', calcPhosphate: 'किलो फॉस्फेट', calcPotash: 'किलो पोटॅश',
    calcProductQty: 'अंदाजे उत्पादन प्रमाण', calcSchedule: 'अनुप्रयोग वेळापत्रक', calcWaterAfter: '24 तासांत पाऊस पडण्याची शक्यता नसल्यास खत टाकल्यानंतर पाणी द्या.',
    histSavedActivity: 'तुमची जतन केलेली क्रिया', histTitle: 'बाबती इतिहास', histSubtitle: 'तुमचे स्कॅन अहवाल सोप्या संदर्भासाठी या डिव्हाइसवर राहतात.',
    histNoScans: 'अद्याप कोणतेही स्कॅन नाही', histNoScansDesc: 'तुमच्या पीक तपासणी येथे दिसतील.', histSentToOfficer: 'अधिकाऱ्याला पाठवले',
    helpFreeGovt: 'मोफत सरकारी हेल्पलाइन', helpTitle: 'तज्ज्ञाशी बोला', helpSubtitle: 'कधीकधी सर्वोत्तम निदान मानवाकडून येते. किसान कॉल सेंटरवर कॉल करा — भारत सरकारची मोफत सेवा.',
    helpKCC: 'किसान कॉल सेंटर', helpFreeHelpline: 'मोफत शेतकरी हेल्पलाइन', helpMinistry: 'कृषी आणि शेतकरी कल्याण मंत्रालय, भारत सरकार',
    helpCall: 'कॉल करा', helpTollFree: 'टोल-फ्री · सकाळ 6 ते रात्री 10, आठवड्याचे 7 दिवस',
    helpWhatAsk: 'तुम्ही कशाबद्दल विचारू शकता', helpAdvisorsReady: 'सल्लागार मदतीसाठी तयार आहेत',
    helpCropDiseases: 'पीक रोग आणि कीड', helpFertilizer: 'कोणते खत किंवा कीटनाशक वापरावे', helpWeather: 'हवामानाशी संबंधित पीक समस्या', helpAnimal: 'पशुसंवर्धन आणि मत्स्यपालन',
    helpLocalLang: 'स्थानिक भाषा समर्थन', helpLocalLangDesc: 'तुमच्या स्थानिक भाषेत मदत दिली जाते',
    helpLocalLangBody: 'सल्लागार स्थानिक भाषा बोलतात. पहिला सल्लागार तुमचा प्रश्न सोडवू शकला नाही, तर राज्य कृषी विभाग, ICAR, KVK आणि कृषी विद्यापीठांच्या तज्ज्ञांकडे तुमचा कॉल पाठवला जाऊ शकतो.',
    helpEscalatedNote: 'तुमचा FasalSathi स्कॅन तज्ज्ञ समीक्षेसाठी पाठवला असल्यास, तात्काळ मानवी सल्ल्यासाठी तुम्ही या हेल्पलाइनवर कॉल करू शकता.',
    schemesSupport: 'तुमच्यासाठी उपलब्ध मदत', schemesTitle: 'सरकारी योजना', schemesSubtitle: 'शेतकऱ्यांसाठी फायदे, विमा आणि मदत कार्यक्रम शोधा.',
    schemesRecommended: 'तुमच्यासाठी शिफारस केलेले', schemesBasedOn: 'तुमच्या प्रोफाइलवर आधारित',
    schemesSearchPlaceholder: 'योजना शोधा...', schemesFilters: 'फिल्टर', schemesClearAll: 'सर्व साफ करा',
    schemesCrop: 'पीक', schemesState: 'राज्य', schemesCategory: 'श्रेणी', schemesFarmerCat: 'शेतकरी श्रेणी',
    schemesAllCrops: 'सर्व पीक', schemesAllStates: 'सर्व राज्ये', schemesAllCategories: 'सर्व श्रेणी', schemesAllFarmerTypes: 'सर्व शेतकरी प्रकार',
    schemesFound: 'योजना सापडल्या', schemesVerified: 'प्रमाणित यादी',
    schemesWhoCanApply: 'कोण अर्ज करू शकते', schemesMainBenefit: 'मुख्य फायदा', schemesMore: 'आणखी',
    schemesViewDetails: 'तपशील पहा', schemesVisit: 'भेट द्या', schemesNoMatch: 'त्या फिल्टरशी कोणत्याही योजना जुळत नाहीत', schemesNoMatchDesc: 'सर्व पीक किंवा राज्ये निवडून पहा.', schemesClearFilters: 'सर्व फिल्टर साफ करा',
    queueBack: 'स्कॅनवर परत जा', queueOfficerView: 'कृषी अधिकारी दृश्य', queueTitle: 'समीक्षा रांग', queueSubtitle: 'कमी आत्मविश्वासाच्या बाबती येथे ठेवल्या जातात जेणेकरून शेतकऱ्याला धोकादायक अंदाज मिळणार नाही.',
    queueCasesWaiting: 'समीक्षेची वाट पाहत बाबती', queueClear: 'रांग रिकामी', queueClearDesc: 'नवीन अनिश्चित स्कॅन येथे दिसतील.',
    queueAIGuess: 'AI अंदाज', queueReviewCase: 'ही बाबती समीक्षा करा', queueCaseReview: 'बाबती समीक्षा', queueScan: 'स्कॅन',
    queueAIBestGuess: 'AI सर्वोत्तम अंदाज', queueConfidenceVerify: 'आत्मविश्वास — फोटोसह तपासा',
    queueCorrect: 'निदान सुधारा', queueApprove: 'अंदाज मंजूर करा',
    chatTitle: 'AI फार्म सहाय्यक', chatSubtitle: 'तुमच्या पिकांबद्दल, रोगांबद्दल, किंवा शेतीबद्दल विचारा', chatClose: 'चॅट बंद करा', chatPlaceholder: 'तुमच्या पिकाबद्दल विचारा...', chatSend: 'संदेश पाठवा',
    chatWelcome: 'नमस्कार! मी तुमचा FasalSathi सहाय्यक आहे. मला तुमच्या पिकाची माहिती दिसत आहे. निदान, उपचार, किंवा शेतीबद्दल काहीही विचारा.',
    chatWelcomeNoCtx: 'नमस्कार! मी तुमचा FasalSathi सहाय्यक आहे. पीक, रोग, खत, किंवा शेतीबद्दल काहीही विचारा.',
    chatSuggestion1: 'या रोगाबद्दल मी काय करावे?', chatSuggestion2: 'हा उपचार सेंद्रिय शेतीसाठी सुरक्षित आहे का?', chatSuggestion3: 'पुढच्या वर्षी हे कसे टाळावे?',
    chatErrorConnect: 'आता कनेक्ट होऊ शकले नाही. कृपया तुमचे इंटरनेट तपासा आणि पुन्हा प्रयत्न करा, किंवा किसान हेल्पलाइन 1800-180-1551 वर कॉल करा.', chatErrorProcess: 'मला हे प्रक्रिया करता आले नाही. कृपया पुन्हा प्रयत्न करा.',
    scanNotACrop: 'ही फसलाची फोटो वाटत नाही. कृपया प्रभावित पान, फळ, किंवा झाडाच्या भागाची स्पष्ट फोटो घ्या.',
    scanErrNetwork: 'निदान सेवेशी कनेक्ट होऊ शकले नाही. कृपया तुमचे इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.',
    scanErrApiKeyMissing: 'AI निदान उपलब्ध नाही — Kindwise API की गहाळ आहे. कृपया अॅप व्यवस्थापकांशी संपर्क करा, किंवा किसान हेल्पलाइन 1800-180-1551 वर कॉल करा.',
    scanErrKindwiseFetch: 'Kindwise crop.health API पर्यंत पोहोचले नाही. कृपया तुमचे इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.',
    scanErrKindwiseApi: 'Kindwise crop.health API ने त्रुटी दिली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
    scanErrParse: 'निदान सेवेने अनपेक्षित प्रतिसाद दिला. कृपया पुन्हा प्रयत्न करा.',
    scanErrInternal: 'निदान सेवेत अंतर्गत त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    scanErrServiceUnavailable: 'AI निदान आता उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा, किंवा किसान हेल्पलाइन 1800-180-1551 वर कॉल करा.',
    scanErrInvalidImage: 'प्रतिमा वाचता आली नाही. कृपया दुसरी फोटो वापरून पाहा.',
    commonBack: 'मागे', commonMoreTools: 'अधिक साधने', commonWorksOffline: 'FasalSathi ऑफलाइन काम करते', commonWorksOfflineDesc: 'तुमची स्कॅन आधी या फोनवर जतन होतात आणि कनेक्शन उपलब्ध असल्यास सिंक होतात.',
    commonNotifications: 'सूचना', commonOpenMenu: 'मेन्यू उघडा', commonCloseMenu: 'मेन्यू बंद करा', commonAskAI: 'AI सहाय्यकाला विचारा', commonOfficerQueue: 'अधिकारी समीक्षा रांग', schemesVerifiedDate: 'प्रमाणित: ', 
  },
  ta: {
    appName: 'FasalSathi', appTagline: 'பயிர் அடையாளம், சரியான தீர்வு',
    navScan: 'ஸ்கேன்', navFertilizer: 'உரம்', navSchemes: 'திட்டங்கள்', navHistory: 'வரலாறு', navHelpline: 'ஹெல்ப்லைன்',
    scanGreeting: 'காலை வணக்கம், விவசாயி', scanTitle: 'உங்கள் பயிரின் ஆரோக்கியத்தை சரிபார்க்கவும்', scanSubtitle: 'பாதிக்கப்பட்ட இலை, கனி, அல்லது செடியின் பகுதியின் தெளிவான புகைப்படத்தை எடுக்கவும். FasalSathi உங்கள் பயிருக்கு என்ன தேவை என்பதைப் புரிந்துகொள்ள உதவும்.',
    scanQuickDiagnosis: 'விரைவான கண்டறிதல்', scanScanALeaf: 'பயிரை ஸ்கேன் செய்யவும்', scanClearPhotos: 'தெளிவான புகைப்படங்கள் சிறந்த முடிவுகளைத் தரும்.',
    scanTakePhoto: 'புகைப்படம் எடுக்கவும் அல்லது பதிவேற்றவும்', scanChangePhoto: 'புகைப்படத்தை மாற்றவும்', scanPhotoReady: 'புகைப்படம் தயார்', scanDiagnosisFailed: 'கண்டறிதல் தோல்வி',
    scanTellAboutCrop: 'பயிரைப் பற்றி சொல்லுங்கள்', scanThisHelpsImprove: 'இது கண்டறிதலை மேம்படுத்த உதவுகிறது',
    scanCropType: 'பயிர் வகை', scanGrowthStage: 'வளர்ச்சி நிலை', scanAnalysing: 'உங்கள் புகைப்படம் ஆய்வாகிறது...', scanAnalysingLong: 'உங்கள் புகைப்படம் ஆய்வாகிறது — இதில் 30 விநாடிகள் வரை ஆகலாம்...', scanAnalyseThis: 'இந்த பயிரை ஆய்வு செய்யவும்', scanUseSample: 'மாதிரி புகைப்படம் பயன்படுத்தி ஆய்வு செய்யவும்',
    scanPhotoStays: 'இணையம் இல்லாமலே உங்கள் புகைப்படம் இந்த சாதனத்தில் இருக்கும்.',
    diagNewScan: 'புதிய ஸ்கேன்', diagCropCheck: 'பயிர் சரிபார்ப்பு', diagCropHealthReport: 'உங்கள் பயிர் ஆரோக்கிய அறிக்கை', diagGetExpertOpinion: 'நிபுணரின் கருத்தை பெறுங்கள்',
    diagLikelyIssue: 'சாத்தியமான பிரச்சினை', diagWhatYouCanDo: 'நீங்கள் என்ன செய்யலாம்', diagSimpleSteps: 'உங்கள் வயலுக்கான எளிய படிகள்',
    diagUncertain: 'நிச்சயமற்றது — நிபுணர் மதிப்பாய்வுக்கு அனுப்பப்பட்டது', diagUncertainDesc: 'புகைப்படம் பிரச்சினையை பாதுகாப்பாக அடையாளம் காண போதுமான தெளிவாக இல்லை. நாங்கள் யூகிக்க மாட்டோம். உங்கள் வழக்கு சேமிக்கப்பட்டது மற்றும் வேளாண் அதிகாரிக்கு அனுப்பப்பட்டது.',
    diagNotified: 'மதிப்பாய்வுக்குப் பிறகு உங்களுக்கு தெரிவிக்கப்படும்',
    diagOfflineMode: 'ஆஃப்லைன் அறிவு நிலை', diagOfflineDesc: 'AI புகைப்பட பகுப்பாய்வு கிடைக்கவில்லை, எனவே இந்த முடிவு பொதுவான பயிர் அறிவின் அடிப்படையில் உள்ளது. துல்லியமான கண்டறிதலுக்கு Kisan ஹெல்ப்லைனை அழைக்கவும்.',
    diagAIDisclaimer: 'இது AI-உதவி பரிந்துரை, இறுதி வேளாண் பரிந்நுரை அல்ல. கடுமையான சேதத்திற்கு உங்கள் அருகிலுள்ள வேளாண் அதிகாரியை தொடர்பு கொள்ளவும்.',
    diagEscalate: 'உறுதியாக இல்லையா? நிபுணருக்கு அனுப்பவும்', diagStartAnother: 'மற்றொரு ஸ்கேனைத் தொடங்கவும்', diagAskAI: 'AI உதவியாளரிடம் கேளுங்கள்', diagAskAIAbout: 'இதைப் பற்றி AI உதவியாளரிடம் கேளுங்கள்',
    diagAboutIssue: 'இந்த பிரச்சனை பற்றி', diagPrevention: 'தடுப்பு', diagPreventionDesc: 'எதிர்காலத்தில் இதைத் தடுக்க நடவடிக்கைகள்', diagTreatment: 'சிகிச்சை', diagTreatmentDesc: 'இப்போது என்ன செய்ய வேண்டும்', diagTreatmentFallback: 'செயலில் சிகிச்சை விருப்பங்களுக்கு, உங்கள் அருகிலுள்ள வேளாண் அதிகாரியை அல்லது கிசான் ஹெல்ப்லைனை தொடர்பு கொள்ளவும்.',
    calcPlanNext: 'உங்கள் அடுத்த உர திட்டத்தை உருவாக்கவும்', calcTitle: 'உர கால்குலேட்டர்', calcSubtitle: 'பயிர் மற்றும் வளர்ச்சி நிலை அடிப்படையில் மதிப்பீட்டைப் பெறவும். மண் பரிசோதனை மிகச் சரியான ஆலோசனையைத் தரும்.',
    calcFarmDetails: 'உங்கள் வயல் விவரங்கள்', calcCropType: 'பயிர் வகை', calcFarmSize: 'வயல் அளவு', calcAcres: 'ஏக்கர்', calcHectares: 'ஹெக்டேர்', calcGrowthStage: 'வளர்ச்சி நிலை',
    calcEstimatedNeed: 'மதிப்பிடப்பட்ட தேவை', calcFor: 'க்கு', calcNitrogen: 'கிலோ நைட்ரஜன்', calcPhosphate: 'கிலோ பாஸ்பேட்', calcPotash: 'கிலோ பொட்டாஷ்',
    calcProductQty: 'தோராயமான தயாரிப்பு அளவு', calcSchedule: 'பயன்பாட்டு அட்டவணை', calcWaterAfter: '24 மணிநேரத்தில் மழை வர வாய்ப்பில்லை என்றால் உரமிட்ட பிறகு நீர் பாய்க்கவும்.',
    histSavedActivity: 'உங்கள் சேமித்த செயல்பாடு', histTitle: 'வழக்கு வரலாறு', histSubtitle: 'உங்கள் ஸ்கேன் அறிக்கைகள் எளிய குறிப்புக்காக இந்த சாதனத்தில் இருக்கும்.',
    histNoScans: 'இன்னும் ஸ்கேன் இல்லை', histNoScansDesc: 'உங்கள் பயிர் சரிபார்ப்புகள் இங்கே தோன்றும்.', histSentToOfficer: 'அதிகாரிக்கு அனுப்பப்பட்டது',
    helpFreeGovt: 'இலவச அரசாங்க ஹெல்ப்லைன்', helpTitle: 'நிபுணருடன் பேசுங்கள்', helpSubtitle: 'சில நேரங்களில் சிறந்த கண்டறிதல் மனிதனிடமிருந்து வரும். கிசான் கால் சென்டரை அழைக்கவும் — இந்திய அரசாங்கத்தின் இலவச சேவை.',
    helpKCC: 'கிசான் கால் சென்டர்', helpFreeHelpline: 'இலவச விவசாயி ஹெல்ப்லைன்', helpMinistry: 'வேளாண்மை & விவசாயிகள் நலத்துறை அமைச்சகம், இந்திய அரசாங்கம்',
    helpCall: 'அழைக்கவும்', helpTollFree: 'டோல்-ஃப்ரீ · காலை 6 மணி முதல் இரவு 10 மணி வரை, வாரம் 7 நாட்கள்',
    helpWhatAsk: 'நீங்கள் எதைப் பற்றி கேட்கலாம்', helpAdvisorsReady: 'ஆலோசகர்கள் உதவ தயாராக உள்ளனர்',
    helpCropDiseases: 'பயிர் நோய்கள் மற்றும் பூச்சிகள்', helpFertilizer: 'எந்த உரம் அல்லது பூச்சிக்கொல்லி பயன்படுத்துவது', helpWeather: 'வானிலை தொடர்பான பயிர் பிரச்சினைகள்', helpAnimal: 'கால்நடை வளர்ப்பு மற்றும் மீன்வளர்ப்பு',
    helpLocalLang: 'உள்ளூர் மொழி ஆதரவு', helpLocalLangDesc: 'உங்கள் உள்ளூர் மொழியில் உதவி வழங்கப்படுகிறது',
    helpLocalLangBody: 'ஆலோசகர்கள் உள்ளூர் மொழிகளில் பேசுவார்கள். முதல் ஆலோசகர் உங்கள் கேள்வியை தீர்க்க முடியவில்லை என்றால், மாநில வேளாண் துறைகள், ICAR, KVK மற்றும் வேளாண் பல்கலைக்கழகங்களின் நிபுணர்களுக்கு உங்கள் அழைப்பு மேம்படுத்தப்படலாம்.',
    helpEscalatedNote: 'உங்கள் FasalSathi ஸ்கேன் நிபுணர் மதிப்பாய்வுக்கு அனுப்பப்பட்டிருந்தால், உடனடி மனித ஆலோசனைக்கு இந்த ஹெல்ப்லைனை அழைக்கலாம்.',
    schemesSupport: 'உங்களுக்காக கிடைக்கும் உதவி', schemesTitle: 'அரசாங்க திட்டங்கள்', schemesSubtitle: 'விவசாயிகளுக்கான நன்மைகள், காப்பீடு மற்றும் ஆதரவு திட்டங்களைக் கண்டறியவும்.',
    schemesRecommended: 'உங்களுக்காக பரிந்துரைக்கப்பட்டது', schemesBasedOn: 'உங்கள் சுயவிவரத்தின் அடிப்படையில்',
    schemesSearchPlaceholder: 'திட்டங்களைத் தேடவும்...', schemesFilters: 'வடிகட்டிகள்', schemesClearAll: 'அனைத்தையும் அழி',
    schemesCrop: 'பயிர்', schemesState: 'மாநிலம்', schemesCategory: 'பிரிவு', schemesFarmerCat: 'விவசாயி பிரிவு',
    schemesAllCrops: 'அனைத்து பயிர்கள்', schemesAllStates: 'அனைத்து மாநிலங்கள்', schemesAllCategories: 'அனைத்து பிரிவுகள்', schemesAllFarmerTypes: 'அனைத்து விவசாயி வகைகள்',
    schemesFound: 'திட்டங்கள் காணப்பட்டன', schemesVerified: 'சரிபார்க்கப்பட்ட பட்டியல்',
    schemesWhoCanApply: 'யார் விண்ணப்பிக்கலாம்', schemesMainBenefit: 'முக்கிய நன்மை', schemesMore: 'மேலும்',
    schemesViewDetails: 'விவரங்களைப் பார்க்கவும்', schemesVisit: 'சந்திக்கவும்', schemesNoMatch: 'அந்த வடிகட்டிகளுடன் எந்த திட்டமும் பொருந்தவில்லை', schemesNoMatchDesc: 'அனைத்து பயிர்கள் அல்லது மாநிலங்களைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.', schemesClearFilters: 'அனைத்து வடிகட்டிகளையும் அழி',
    queueBack: 'ஸ்கேனுக்குத் திரும்பவும்', queueOfficerView: 'வேளாண் அதிகாரி காட்சி', queueTitle: 'மதிப்பாய்வு வரிசை', queueSubtitle: 'குறைந்த நம்பிக்கை வழக்குகள் இங்கே வைக்கப்படுகின்றன அதனால் எந்த விவசாயிக்கும் ஆபத்தான யூகம் கிடைக்காது.',
    queueCasesWaiting: 'மதிப்பாய்வுக்காக காத்திருக்கும் வழக்குகள்', queueClear: 'வரிசை காலி', queueClearDesc: 'புதிய நிச்சயமற்ற ஸ்கேன்கள் இங்கே தோன்றும்.',
    queueAIGuess: 'AI யூகம்', queueReviewCase: 'இந்த வழக்கை மதிப்பாய்விடவும்', queueCaseReview: 'வழக்கு மதிப்பாய்வு', queueScan: 'ஸ்கேன்',
    queueAIBestGuess: 'AI சிறந்த யூகம்', queueConfidenceVerify: 'நம்பிக்கை — புகைப்படத்துடன் சரிபார்க்கவும்',
    queueCorrect: 'கண்டறிதலை திருத்தவும்', queueApprove: 'யூகத்தை ஒப்புதல் அளிக்கவும்',
    chatTitle: 'AI ஃபார்ம் உதவியாளர்', chatSubtitle: 'உங்கள் பயிர்கள், நோய்கள், அல்லது வேளாண்மை பற்றி கேளுங்கள்', chatClose: 'அரட்டையை மூடவும்', chatPlaceholder: 'உங்கள் பயிரைப் பற்றி கேளுங்கள்...', chatSend: 'செய்தி அனுப்பவும்',
    chatWelcome: 'வணக்கம்! நான் உங்கள் FasalSathi உதவியாளர். உங்கள் பயிர் விவரங்களை பார்க்க முடியும். கண்டறிதல், சிகிச்சை, அல்லது வேளாண்மை பற்றி ஏதேனும் கேளுங்கள்.',
    chatWelcomeNoCtx: 'வணக்கம்! நான் உங்கள் FasalSathi உதவியாளர். பயிர்கள், நோய்கள், உரம், அல்லது வேளாண்மை பற்றி ஏதேனும் கேளுங்கள்.',
    chatSuggestion1: 'இந்த நோய்க்கு நான் என்ன செய்ய வேண்டும்?', chatSuggestion2: 'இந்த சிகிச்சை இயற்கை வேளாண்மைக்கு பாதுகாப்பானதா?', chatSuggestion3: 'அடுத்த பருவத்தில் இதை எப்படி தடுப்பது?',
    chatErrorConnect: 'இப்போது இணைக்க முடியவில்லை. உங்கள் இணையத்தை சரிபார்த்து மீண்டும் முயற்சிக்கவும், அல்லது கிசான் ஹெல்ப்லைன் 1800-180-1551 க்கு அழைக்கவும்.', chatErrorProcess: 'நான் அதை செயல்படுத்த முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    scanNotACrop: 'இது பயிர் புகைப்படம் போல் தெரியவில்லை. பாதிக்கப்பட்ட இலை, கனி, அல்லது செடியின் பகுதியின் தெளிவான புகைப்படத்தை எடுக்கவும்.',
    scanErrNetwork: 'கண்டறிதல் சேவையுடன் இணைக்க முடியவில்லை. உங்கள் இணையத்தை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    scanErrApiKeyMissing: 'AI கண்டறிதல் கிடைக்கவில்லை — Kindwise API விசை இல்லை. ஆப் நிர்வாகியை தொடர்பு கொள்ளவும், அல்லது கிசான் ஹெல்ப்லைன் 1800-180-1551 க்கு அழைக்கவும்.',
    scanErrKindwiseFetch: 'Kindwise crop.health API க்கு செல்ல முடியவில்லை. உங்கள் இணையத்தை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    scanErrKindwiseApi: 'Kindwise crop.health API பிழையை வழங்கியது. சற்று நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.',
    scanErrParse: 'கண்டறிதல் சேவை எதிர்பாராத பதிலை வழங்கியது. மீண்டும் முயற்சிக்கவும்.',
    scanErrInternal: 'கண்டறிதல் சேவையில் உள் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    scanErrServiceUnavailable: 'AI கண்டறிதல் இப்போது கிடைக்கவில்லை. பிறகு மீண்டும் முயற்சிக்கவும், அல்லது கிசான் ஹெல்ப்லைன் 1800-180-1551 க்கு அழைக்கவும்.',
    scanErrInvalidImage: 'படத்தை படிக்க முடியவில்லை. வேறு புகைப்படத்தை முயற்சிக்கவும்.',
    commonBack: 'பின்செல்', commonMoreTools: 'மேலும் கருவிகள்', commonWorksOffline: 'FasalSathi ஆஃப்லைனில் வேலை செய்கிறது', commonWorksOfflineDesc: 'உங்கள் ஸ்கேன்கள் முதலில் இந்த ஃபோனில் சேமிக்கப்படுகின்றன மற்றும் இணைப்பு கிடைக்கும்போது ஒத்திசைக்கப்படுகின்றன.',
    commonNotifications: 'அறிவிப்புகள்', commonOpenMenu: 'மெனுவைத் திறக்கவும்', commonCloseMenu: 'மெனுவை மூடவும்', commonAskAI: 'AI உதவியாளரிடம் கேளுங்கள்', commonOfficerQueue: 'அதிகாரி மதிப்பாய்வு வரிசை', schemesVerifiedDate: 'சரிபார்க்கப்பட்டது: ', 
  },
};
