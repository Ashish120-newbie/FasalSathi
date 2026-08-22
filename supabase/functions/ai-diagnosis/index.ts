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
      console.error("[ai-diagnosis] GEMINI_API_KEY is not set in edge function secrets.");
      return jsonResponse({
        error: "AI diagnosis is not available — the Gemini API key is missing. Please contact the app administrator to add the GEMINI_API_KEY secret, or call the Kisan helpline at 1800-180-1551 for help.",
        code: "API_KEY_MISSING",
      }, 503);
    }

    // Single Gemini call: first detect if image is a crop, then diagnose if it is
    const prompt = `First, determine if this image shows any part of a crop plant — including leaves, fruit, stems, stalks, or tubers. If it does NOT show any part of a crop or plant, respond with JSON: {"is_crop": false}. If it DOES show a plant or crop, analyze the visible plant part (leaf, fruit, stem, or tuber) for disease, pest damage, or nutrient deficiency given crop type: ${cropType} and growth stage: ${growthStage}, and respond with JSON: {"is_crop": true, "diagnosis": "<disease, pest, or deficiency name, or 'Healthy' if no issue>", "confidence": <0-100>, "affected_area": "<describe the affected area and what plant part it is on, e.g. 'spots on fruit surface', 'rot on tuber', 'lesions on stem', 'discoloration on leaf'>", "recommendation": "<treatment advice in ${languageName}, 2-3 sentences>"}. Respond ONLY in JSON, no other text.`;

    const geminiModel = "gemini-2.0-flash";
    console.log("[ai-diagnosis] Using Gemini model:", geminiModel);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

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
      console.error("[ai-diagnosis] Gemini API fetch failed:", fetchErr);
      return jsonResponse({
        error: "Could not reach the Gemini API. Please check your internet connection and try again.",
        code: "GEMINI_FETCH_FAILED",
      }, 502);
    }

    clearTimeout(timeout);

    if (!geminiResp.ok) {
      const errText = await geminiResp.text().catch(() => "");
      console.error("[ai-diagnosis] Gemini API error:", geminiResp.status, errText);
      const friendly = geminiResp.status === 429
        ? "The AI service is very busy right now. Please wait a moment and try again."
        : "The AI diagnosis service is temporarily unavailable. Please try again in a moment, or call the Kisan helpline at 1800-180-1551 for help.";
      return jsonResponse({ error: friendly, code: "GEMINI_API_ERROR" }, 502);
    }

    const geminiData = await geminiResp.json();
    const textContent: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let result: { is_crop?: boolean; diagnosis?: string; confidence?: number; affected_area?: string; recommendation?: string };
    try {
      const cleaned = textContent.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("[ai-diagnosis] Failed to parse Gemini JSON response:", textContent);
      return jsonResponse({
        error: "The Gemini API returned an unparseable response. Please try again.",
        code: "PARSE_ERROR",
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
    const recommendation = result.recommendation || "";

    return jsonResponse({
      is_crop: true,
      diagnosis,
      confidence,
      affected_area: affectedArea,
      recommendation,
    });

  } catch (err) {
    console.error("[ai-diagnosis] Edge function error:", err);
    return jsonResponse({
      error: "Diagnosis service encountered an internal error. Please try again.",
      code: "INTERNAL_ERROR",
    }, 500);
  }
});
