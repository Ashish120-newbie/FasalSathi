import type { Language } from './i18n';

type ConditionMap = Record<string, Partial<Record<Language, string>>>;

const weatherConditions: ConditionMap = {
  'clear sky': { hi: 'साफ आसमान', bn: 'পরিষ্কার আকাশ', te: 'స్పష్టమైన ఆకాశం', mr: 'स्वच्छ आकाश', ta: '�ெளிந்த வானம்' },
  'few clouds': { hi: 'थोड़े बादल', bn: 'কয়েকটি মেঘ', te: 'కొన్ని మేఘాలు', mr: 'थोडे ढग', ta: 'சில மேகங்கள்' },
  'scattered clouds': { hi: 'बिखरे बादल', bn: 'বিক্ষিপ্ত মেঘ', te: 'చెదురుగా మేఘాలు', mr: 'विखुरलेले ढग', ta: 'சிதறிய மேகங்கள்' },
  'broken clouds': { hi: 'टूटे बादल', bn: 'বিচ্ছিন্ন মেঘ', te: 'ముక్కలైన మేఘాలు', mr: 'तुटलेले ढग', ta: 'உடைந்த மேகங்கள்' },
  'overcast clouds': { hi: 'घने बादल', bn: 'মেঘাচ্ছন্ন', te: 'మేఘాలతో నిండిన', mr: 'ढगाळ आभाळ', ta: 'மேகமூட்டம்' },
  'shower rain': { hi: 'बौछार', bn: 'ঝাপটা', te: 'జల్లు', mr: 'झडण', ta: 'தூறல் மழை' },
  'rain': { hi: 'बारिश', bn: 'বৃষ্টি', te: 'వర్షం', mr: 'पाऊस', ta: 'மழை' },
  'light rain': { hi: 'हल्की बारिश', bn: 'হালকা বৃষ্টি', te: 'తేలికపాటి వర్షం', mr: 'हलके पाऊस', ta: 'லேசான மழை' },
  'moderate rain': { hi: 'मध्यम बारिश', bn: 'মৃদু বৃষ্টি', te: 'మధ్యమ వర్షం', mr: 'मध्यम पाऊस', ta: 'மிதமான மழை' },
  'heavy rain': { hi: 'भारी बारिश', bn: 'ভারী বৃষ্টি', te: 'భారీ వర్షం', mr: 'जोरदार पाऊस', ta: 'கனமழை' },
  'light intensity drizzle': { hi: 'हल्की बूंदाबारी', bn: 'হালকা গুঁড়ি গুঁড়ি', te: 'తేలికపాటి చినుకు', mr: 'हलकी धुरकी', ta: 'லேசான தூறல்' },
  'drizzle': { hi: 'बूंदाबारी', bn: 'গুঁড়ি গুঁড়ি', te: 'చినుకు', mr: 'धुरकी', ta: 'தூறல்' },
  'heavy intensity drizzle': { hi: 'भारी बूंदाबारी', bn: 'ভারী গুঁড়ি গুঁড়ি', te: 'భారీ చినుకు', mr: 'जोरदार धुरकी', ta: 'கன தூறல்' },
  'thunderstorm': { hi: 'गरज बिजली', bn: 'বজ্রঝড়', te: 'ఉరుముతో కూడిన వర్షం', mr: 'गडगडाट', ta: 'இடியுடன் மழை' },
  'thunderstorm with light rain': { hi: 'हल्की बारिश के साथ गरज', bn: 'হালকা বৃষ্টিসহ বজ্রঝড়', te: 'తేలికపాటి వర్షంతో ఉరుము', mr: 'हलक्या पावसासह गडगडाट', ta: 'லேசான மழையுடன் இடி' },
  'thunderstorm with rain': { hi: 'बारिश के साथ गरज', bn: 'বৃষ্টিসহ বজ্রঝড়', te: 'వర్షంతో ఉరుము', mr: 'पावसासह गडगडाट', ta: 'மழையுடன் இடி' },
  'thunderstorm with heavy rain': { hi: 'भारी बारिश के साथ गरज', bn: 'ভারী বৃষ্টিসহ বজ্রঝড়', te: 'భారీ వర్షంతో ఉరుము', mr: 'जोरदार पावसासह गडगडाट', ta: 'கனமழையுடன் இடி' },
  'snow': { hi: 'बर्फबारी', bn: 'তুষারপাত', te: 'మంచు', mr: 'हिमपात', ta: 'பனி' },
  'light snow': { hi: 'हल्की बर्फबारी', bn: 'হালকা তুষারপাত', te: 'తేలికపాటి మంచు', mr: 'हलका हिमपात', ta: 'லேசான பனி' },
  'heavy snow': { hi: 'भारी बर्फबारी', bn: 'ভারী তুষারপাত', te: 'భారీ మంచు', mr: 'जोरदार हिमपात', ta: 'கன பனி' },
  'mist': { hi: 'कोहरा', bn: '�ুয়াশা', te: 'పొగమంచు', mr: 'धुक्याचे आच्छादन', ta: 'மூடுபனி' },
  'fog': { hi: 'घना कोहरा', bn: 'ঘন কুয়াশা', te: 'దట్టమైన పొగమంచు', mr: 'घन धुकं', ta: 'அடர் மூடுபனி' },
  'haze': { hi: 'धुंध', bn: 'লঘু কুয়াশা', te: 'పొగజాబ', mr: 'धुक्याची लहर', ta: 'புகைமூட்டம்' },
  'smoke': { hi: 'धुआं', bn: 'ধোঁয়া', te: 'పొగ', mr: 'धूर', ta: 'புகை' },
  'dust': { hi: 'धूल', bn: 'ধুলো', te: 'ధూళి', mr: 'धूळ', ta: 'தூசு' },
  'sand': { hi: 'रेत', bn: 'বালি', te: 'ఇసుక', mr: 'वाळू', ta: 'மணல்' },
  'tornado': { hi: 'बवंडर', bn: 'টর্নেডো', te: 'సుడిగాలి', mr: 'वावटळ', ta: 'சுழலுந்தலை' },
  'squalls': { hi: 'झोंके', bn: 'ঝোঁক', te: 'గాలి పోట్లు', mr: 'वाऱ्याचे झोके', ta: 'காற்று வேகம்' },
};

export function translateWeatherCondition(condition: string, lang: Language): string {
  if (lang === 'en') return condition;
  const key = condition.toLowerCase().trim();
  const entry = weatherConditions[key];
  if (entry && entry[lang]) return entry[lang]!;
  return condition;
}
