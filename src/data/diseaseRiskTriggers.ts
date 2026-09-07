export type RiskLevel = 'high' | 'moderate';

export interface DiseaseRiskResult {
  diseaseId: string;
  level: RiskLevel;
  reasonEn: string;
  reasonHi: string;
}

interface WeatherInput {
  temp: number;
  humidity: number;
  hasRecentRain: boolean;
}

interface RiskTrigger {
  reasonEn: string;
  reasonHi: string;
  evaluate: (w: WeatherInput) => RiskLevel | null;
}

export const diseaseRiskTriggers: Record<string, RiskTrigger> = {
  'wheat-yellow-rust': {
    reasonEn: 'Cool, humid conditions favor Yellow Rust in wheat',
    reasonHi: 'ठंडी, आर्द्र परिस्थितियां गेहूं में पीला रस्ट को बढ़ावा देती हैं',
    evaluate: (w) => (w.temp >= 10 && w.temp <= 20 && w.humidity > 70 ? 'high' : null),
  },
  'rice-blast': {
    reasonEn: 'High humidity and warm temperatures favor Rice Blast',
    reasonHi: 'उच्च आर्द्रता और गर्म तापमान धान ब्लास्ट को बढ़ावा देते हैं',
    evaluate: (w) => (w.humidity > 80 && w.temp >= 20 && w.temp <= 28 ? 'high' : null),
  },
  'cotton-leaf-curl': {
    reasonEn: 'Warm, dry conditions favor whitefly activity that spreads Cotton Leaf Curl Virus',
    reasonHi: 'गर्म, शुष्क परिस्थितियां व्हाइटफ्लाई गतिविधि को बढ़ावा देती हैं जो कपास लीफ कर्ल वायरस फैलाती है',
    evaluate: (w) => (w.temp > 30 ? 'moderate' : null),
  },
  'tomato-early-blight': {
    reasonEn: 'Moderate humidity and warm temperatures favor Early Blight in tomato',
    reasonHi: 'मध्यम आर्द्रता और गर्म तापमान टमाटर में अर्ली ब्लाइट को बढ़ावा देते हैं',
    evaluate: (w) => (w.humidity > 60 && w.temp >= 24 && w.temp <= 29 ? 'moderate' : null),
  },
  'potato-late-blight': {
    reasonEn: 'Cool, wet conditions with high humidity favor Late Blight in potato',
    reasonHi: 'ठंडी, गीली परिस्थितियां और उच्च आर्द्रता आलू में लेट ब्लाइट को बढ़ावा देती हैं',
    evaluate: (w) =>
      w.temp >= 10 && w.temp <= 20 && w.humidity > 85 && w.hasRecentRain ? 'high' : null,
  },
  'onion-purple-blotch': {
    reasonEn: 'Warm, humid conditions favor Purple Blotch in onion',
    reasonHi: 'गर्म, आर्द्र परिस्थितियां प्याज में पर्पल ब्लॉच को बढ़ावा देती हैं',
    evaluate: (w) => (w.humidity > 70 && w.temp >= 20 && w.temp <= 30 ? 'moderate' : null),
  },
  'chili-anthracnose': {
    reasonEn: 'High humidity, warm temperatures, and recent rain favor Anthracnose in chili',
    reasonHi: 'उच्च आर्द्रता, गर्म तापमान और हाल की बारिश मिर्च में एंथ्रेक्नोज को बढ़ावा देती हैं',
    evaluate: (w) =>
      w.humidity > 75 && w.temp >= 25 && w.temp <= 30 && w.hasRecentRain ? 'high' : null,
  },
  'banana-panama-wilt': {
    reasonEn: 'Recent heavy rain or waterlogging increases Panama Wilt risk in banana',
    reasonHi: 'हाल की भारी बारिश या जलभराव केले में पनामा विल्ट जोखिम बढ़ाता है',
    evaluate: (w) => (w.hasRecentRain ? 'moderate' : null),
  },
  'maize-turcicum-blight': {
    reasonEn: 'Humid, warm conditions favor Turcicum Leaf Blight in maize',
    reasonHi: 'आर्द्र, गर्म परिस्थितियां मक्का में टर्सिकम लीफ ब्लाइट को बढ़ावा देती हैं',
    evaluate: (w) => (w.humidity > 70 && w.temp >= 20 && w.temp <= 27 ? 'moderate' : null),
  },
};

export function evaluateDiseaseRisks(weather: WeatherInput): DiseaseRiskResult[] {
  const results: DiseaseRiskResult[] = [];
  for (const [diseaseId, trigger] of Object.entries(diseaseRiskTriggers)) {
    const level = trigger.evaluate(weather);
    if (level) {
      results.push({
        diseaseId,
        level,
        reasonEn: trigger.reasonEn,
        reasonHi: trigger.reasonHi,
      });
    }
  }
  results.sort((a, b) => (a.level === 'high' ? 0 : 1) - (b.level === 'high' ? 0 : 1));
  return results;
}

export function hasRecentRain(hourly: { rainMm: number; pop: number }[]): boolean {
  return hourly.some((h) => h.rainMm > 0.5 || h.pop > 0.5);
}
