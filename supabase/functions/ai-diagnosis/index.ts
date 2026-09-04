import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DiagnosisRequest {
  imageBase64: string;
  imageContentType: string;
  cropType: string;
  growthStage: string;
  language?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
};

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Local fallback when Gemini API key is unavailable ──
interface FallbackDisease {
  name: string;
  confidence: number;
  affected_area: string;
  recommendation: string;
}

const FALLBACK_DISEASES: Record<string, FallbackDisease[]> = {
  Wheat: [
    {
      name: "Yellow Rust",
      confidence: 45,
      affected_area: "Yellow-orange powdery stripes on leaves",
      recommendation: "Inspect leaves for yellow-orange powdery stripes. If confirmed, remove badly affected leaves and improve field airflow. Spray Propiconazole 25 EC at 1 ml per litre of water if the disease is spreading. Consult your local agricultural officer for confirmation.",
    },
    {
      name: "Nitrogen Deficiency",
      confidence: 35,
      affected_area: "Uniform yellowing starting from older leaves",
      recommendation: "Check for uniform yellowing from older leaves. If confirmed, apply Urea in two split doses and add well-rotted farmyard manure. A soil test before the next crop will give the best guidance.",
    },
  ],
  Rice: [
    {
      name: "Rice Blast",
      confidence: 45,
      affected_area: "Spindle-shaped grey spots with brown edges on leaves",
      recommendation: "Look for diamond-shaped grey spots with brown edges. If confirmed, apply Tricyclazole 75 WP at 0.6 g per litre of water. Avoid excess nitrogen fertilizer and maintain proper spacing between plants. Consult your local agricultural officer if spreading fast.",
    },
  ],
  Cotton: [
    {
      name: "Cotton Leaf Curl Virus",
      confidence: 45,
      affected_area: "Upward curling of leaves with thickened veins",
      recommendation: "Check for upward leaf curling and thickened veins. Control whiteflies early with recommended insecticide. Remove and destroy infected plants. Use certified virus-resistant seeds next season. Consult your local agricultural officer for large-scale infection.",
    },
  ],
  Tomato: [
    {
      name: "Early Blight",
      confidence: 45,
      affected_area: "Dark brown circular spots with ring patterns on lower leaves",
      recommendation: "Look for dark brown circular spots with ring patterns on lower leaves. If confirmed, spray Mancozeb 75 WP at 2 g per litre of water. Remove infected leaves and avoid watering over the leaves. Add mulch to prevent soil splash.",
    },
  ],
  Potato: [
    {
      name: "Late Blight",
      confidence: 45,
      affected_area: "Water-soaked dark patches on leaves",
      recommendation: "Check for water-soaked dark patches on leaves, especially in cool wet weather. If confirmed, spray Metalaxyl + Mancozeb at 2 g per litre immediately. Remove infected plant parts and avoid irrigation during cloudy wet weather. Consult your local agricultural officer immediately.",
    },
  ],
};

function localFallbackDiagnosis(cropType: string, growthStage: string, languageName: string): Response {
  const cropDiseases = FALLBACK_DISEASES[cropType] ?? [];
  if (cropDiseases.length === 0) {
    return jsonResponse({
      is_crop: true,
      diagnosis: "Unable to determine",
      confidence: 0,
      affected_area: "Could not analyze the image without the AI service",
      recommendation: `The AI diagnosis service is temporarily unavailable. Please try again later, or consult your local agricultural officer for help with your ${cropType} crop. You can also call the Kisan helpline at 1800-180-1551.`,
    });
  }

  const primary = cropDiseases[0];
  return jsonResponse({
    is_crop: true,
    diagnosis: primary.name,
    confidence: primary.confidence,
    affected_area: primary.affected_area,
    recommendation: `Note: AI image analysis is temporarily unavailable — this is a preliminary assessment based on common ${cropType} conditions in the ${growthStage} stage. ${primary.recommendation} Please consult your local agricultural officer for a confirmed diagnosis. (Language: ${languageName})`,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: DiagnosisRequest = await req.json();
    const { imageBase64, imageContentType, cropType, growthStage } = body;
    const language = body.language || "en";
    const languageName = LANGUAGE_NAMES[language] || "English";

    if (!imageBase64 || !imageContentType) {
      return jsonResponse({ error: "Image data is required.", code: "INVALID_IMAGE" }, 400);
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("[ai-diagnosis] GEMINI_API_KEY is not set — using local fallback diagnosis.");
      return localFallbackDiagnosis(cropType, growthStage, languageName);
    }

    // Single Gemini call: first detect if image is a crop, then diagnose if it is
    const prompt = `You are a plant pathology expert. First, determine if this image shows any part of a crop plant — including leaves, fruit, stems, stalks, or tubers. If it does NOT show any part of a crop or plant, respond with JSON: {"is_crop": false}. If it DOES show a plant or crop, analyze the visible plant part for disease, pest damage, or nutrient deficiency. The farmer indicated the crop might be ${cropType} at the ${growthStage} stage, but you should identify the actual crop from the photo. Respond ONLY in this exact JSON format, no extra text:
{"is_crop": true, "crop_name": "<detected crop name, e.g. Wheat>", "diagnosis": "<disease, pest, or deficiency name, or 'Healthy' if no issue found>", "confidence": <0-100>, "description": "<1-2 sentence description of the issue>", "affected_area": "<describe the affected area and what plant part it is on>", "recommendation": "<2-3 sentence practical treatment recommendation in ${languageName}>"}
If you cannot confidently identify the crop or issue, set confidence to a low value and give general care guidance instead.`;

    const geminiModel = "gemini-flash-latest";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    let geminiResp: Response;
    try {
      geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: imageContentType, data: imageBase64 } },
            ],
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const errName = (fetchErr as Error)?.name || "Unknown";
      const errMsg = (fetchErr as Error)?.message || String(fetchErr);
      console.error("[ai-diagnosis] GEMINI_FETCH_FAILED:", errName, errMsg);
      return jsonResponse({
        error: "Could not reach the Gemini API. Please check your internet connection and try again.",
        code: "GEMINI_FETCH_FAILED",
        debug: { stage: "gemini_fetch", errorName: errName, errorMessage: errMsg, model: geminiModel },
      }, 502);
    }

    clearTimeout(timeout);

    if (!geminiResp.ok) {
      const geminiErrorBody = await geminiResp.text().catch(() => "<could not read body>");
      console.error("[ai-diagnosis] GEMINI_API_ERROR:", geminiResp.status, geminiErrorBody.slice(0, 500));
      const friendly = geminiResp.status === 429
        ? "The AI service is very busy right now. Please wait a moment and try again."
        : "The AI diagnosis service is temporarily unavailable. Please try again in a moment, or call the Kisan helpline at 1800-180-1551 for help.";
      return jsonResponse({
        error: friendly,
        code: "GEMINI_API_ERROR",
        debug: { stage: "gemini_api", status: geminiResp.status, body: geminiErrorBody.slice(0, 500), model: geminiModel },
      }, 502);
    }

    const geminiData = await geminiResp.json();
    const textContent: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let result: { is_crop?: boolean; crop_name?: string; diagnosis?: string; confidence?: number; description?: string; affected_area?: string; recommendation?: string };
    try {
      const cleaned = textContent.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[ai-diagnosis] PARSE_ERROR:", (parseErr as Error)?.message, "raw text:", textContent.slice(0, 500));
      return jsonResponse({
        error: "The Gemini API returned an unparseable response. Please try again.",
        code: "PARSE_ERROR",
        debug: { stage: "parse", rawText: textContent.slice(0, 500) },
      }, 502);
    }

    // Case 1: Not a crop image
    if (result.is_crop === false) {
      return jsonResponse({
        is_crop: false,
      });
    }

    // Case 2: Valid crop diagnosis
    const diagnosis = result.diagnosis || "Unknown";
    const confidence = Math.max(0, Math.min(100, Math.round(result.confidence ?? 0)));
    const affectedArea = result.affected_area || "";
    const cropName = result.crop_name || "";
    const description = result.description || "";
    let recommendation = result.recommendation || "";

    // If Gemini says the crop is healthy, replace treatment with a positive message
    if (diagnosis.toLowerCase() === "healthy") {
      recommendation = "No issues detected. Your crop looks healthy!";
    }

    return jsonResponse({
      is_crop: true,
      crop_name: cropName,
      diagnosis,
      confidence,
      description,
      affected_area: affectedArea,
      recommendation,
    });

  } catch (err) {
    console.error("[ai-diagnosis] INTERNAL_ERROR:", err);
    return jsonResponse({
      error: "Diagnosis service encountered an internal error. Please try again.",
      code: "INTERNAL_ERROR",
      debug: { stage: "internal", errorName: (err as Error)?.name, errorMessage: (err as Error)?.message || String(err) },
    }, 500);
  }
});
