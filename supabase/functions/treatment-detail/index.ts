import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// treatment-detail: diagnosis-type-aware prompt for pests/diseases and nutrient deficiencies

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TreatmentRequest {
  diseaseName: string;
  cropName: string;
  confidenceScore?: number;
  confidenceLevel?: 'high' | 'medium' | 'low';
  diagnosisData?: unknown;
}

interface TreatmentResponse {
  isConfident: boolean;
  type: 'pest_disease' | 'nutrient_deficiency';
  bullets: string[];
  deficientNutrient?: string;
  correctiveAction?: string;
  applicationGuidance?: string;
}

const HIGH_CONFIDENCE_THRESHOLD = 70;

function isNutrientDeficiency(diseaseName: string): boolean {
  const lower = diseaseName.toLowerCase();
  return lower.includes('deficiency') ||
    lower.includes('nutrient') ||
    lower.includes('nitrogen deficiency') ||
    lower.includes('phosphorus deficiency') ||
    lower.includes('potassium deficiency') ||
    lower.includes('iron deficiency') ||
    lower.includes('zinc deficiency') ||
    lower.includes('magnesium deficiency') ||
    lower.includes('calcium deficiency') ||
    lower.includes('sulfur deficiency') ||
    lower.includes('boron deficiency') ||
    lower.includes('manganese deficiency');
}

function buildLowConfidencePrompt(diseaseName: string, cropName: string, dataContext: string): string {
  return `You are an agricultural advisor helping a farmer in India. A crop scan was attempted for ${cropName} but the result for "${diseaseName}" has LOW confidence.${dataContext}
The identification is NOT confident enough to recommend a specific treatment. Do NOT guess any treatment or name any chemical.

Write 4–6 short bullet points in plain, simple language for a farmer with no technical background. The bullets should:
1. State clearly that the identification is not confident enough for a specific treatment recommendation.
2. Advise the farmer to consult their nearest agriculture officer or call the Kisan helpline (1800 180 1551 or toll-free 14410) for confirmation BEFORE applying any treatment.
3. Suggest taking a clearer photo of the affected plant (close-up of leaves/stem, good lighting) and scanning again.
4. Warn against applying any pesticide or fungicide without confirming the problem first, as the wrong treatment can waste money and harm the crop.

Return ONLY this JSON, no extra text:
{
  "bullets": ["bullet 1 text", "bullet 2 text", ...]
}`;
}

function buildPestDiseasePrompt(diseaseName: string, cropName: string, dataContext: string): string {
  return `You are an agricultural expert helping a farmer in India. A crop scan for ${cropName} identified "${diseaseName}" with HIGH confidence.${dataContext}
Provide REAL, SPECIFIC treatment options as 4–6 bullet points in plain, simple language for a farmer with no technical background.

The bullets MUST include:
1. One ORGANIC/BIOLOGICAL option — name a specific product or method (e.g., "neem oil spray at 2% concentration", "Bacillus thuringiensis application"). Include application frequency (e.g., "spray every 7–10 days until symptoms subside").
2. One CHEMICAL option — name the actual active ingredient or product type (e.g., "imidacloprid-based insecticide", "copper oxychloride fungicide", "mancozeb 75% WP"). Include basic dosage guidance and frequency. Add a note to check the product label for exact dosage.
3. One MECHANICAL/PHYSICAL control step if relevant (e.g., "remove and destroy affected leaves", "handpick visible pests and drop them in soapy water"). If not relevant, include a general sanitation step instead.
4. A brief safety/harvest note (e.g., wear gloves when spraying, observe waiting period before harvest).

Each bullet should be a single sentence, practical and directly actionable. Do NOT hedge or add disclaimers — the diagnosis is confident.

Return ONLY this JSON, no extra text:
{
  "bullets": ["bullet 1 text", "bullet 2 text", ...]
}`;
}

function buildNutrientDeficiencyPrompt(diseaseName: string, cropName: string, dataContext: string): string {
  return `You are an agricultural expert helping a farmer in India. A crop scan for ${cropName} identified "${diseaseName}" with HIGH confidence.${dataContext}
This is a NUTRIENT or MINERAL DEFICIENCY, not a pest or fungal disease. Do NOT recommend pesticides, fungicides, insecticides, or biological pest control. Instead, focus on correcting the nutrient deficiency.

Provide practical, specific guidance for a farmer with no technical background. Your response must include:

1. "deficientNutrient": Name the likely deficient nutrient (e.g., "Nitrogen", "Iron", "Zinc", "Potassium").
2. "correctiveAction": The specific fertilizer or amendment to correct it (e.g., "Apply urea at 25 kg per acre", "Apply zinc sulfate at 10 kg per acre as a soil application", "Spray 0.5% ferrous sulfate solution on leaves"). Name a real product or amendment the farmer can buy.
3. "applicationGuidance": How and when to apply it (e.g., "Apply in two split doses 15 days apart", "Spray on leaves in the early morning or evening, repeat after 10 days if symptoms persist").
4. "bullets": 3–5 additional practical bullet points covering:
   - How to confirm the deficiency (e.g., soil testing, leaf symptoms to watch for)
   - Preventive measures for future crops (e.g., crop rotation, organic matter addition)
   - A note on avoiding over-application, which can cause toxicity or lockout of other nutrients
   - When to consult a soil testing lab or agriculture officer for precise dosage

Each bullet should be a single sentence, practical and directly actionable. Do NOT hedge or add disclaimers — the diagnosis is confident.

Return ONLY this JSON, no extra text:
{
  "deficientNutrient": "nutrient name",
  "correctiveAction": "specific fertilizer/amendment and dose",
  "applicationGuidance": "how and when to apply",
  "bullets": ["bullet 1 text", "bullet 2 text", ...]
}`;
}

function buildPrompt(
  diseaseName: string,
  cropName: string,
  isConfident: boolean,
  diagnosisData?: unknown,
): { prompt: string; type: 'pest_disease' | 'nutrient_deficiency' } {
  const dataContext = diagnosisData
    ? `\nAdditional diagnosis data (for context, may be incomplete):\n${JSON.stringify(diagnosisData).slice(0, 800)}\n`
    : '';

  if (!isConfident) {
    return { prompt: buildLowConfidencePrompt(diseaseName, cropName, dataContext), type: 'pest_disease' };
  }

  if (isNutrientDeficiency(diseaseName)) {
    return { prompt: buildNutrientDeficiencyPrompt(diseaseName, cropName, dataContext), type: 'nutrient_deficiency' };
  }

  return { prompt: buildPestDiseasePrompt(diseaseName, cropName, dataContext), type: 'pest_disease' };
}

function jsonResponse(body: unknown, status: number) {
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
    const rawBody = await req.text();
    console.log("[treatment-detail] Raw request body length:", rawBody.length);

    let body: TreatmentRequest;
    try {
      body = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error("[treatment-detail] Failed to parse request JSON:", (parseErr as Error).message, "| raw:", rawBody.slice(0, 300));
      return jsonResponse({ error: "Invalid JSON in request body." }, 400);
    }

    const { diseaseName, cropName, confidenceScore, confidenceLevel, diagnosisData } = body;
    console.log("[treatment-detail] Parsed request:", { diseaseName, cropName, confidenceScore, confidenceLevel });

    if (!diseaseName || !cropName) {
      console.error("[treatment-detail] Missing required fields:", { diseaseName: !!diseaseName, cropName: !!cropName });
      return jsonResponse({ error: "diseaseName and cropName are required." }, 400);
    }

    const isConfident =
      (confidenceLevel === 'high' || confidenceLevel === 'medium') ||
      (typeof confidenceScore === 'number' && confidenceScore >= HIGH_CONFIDENCE_THRESHOLD);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    console.log("[treatment-detail] GEMINI_API_KEY found:", Boolean(geminiApiKey), geminiApiKey ? `starts with: ${geminiApiKey.slice(0, 4)}...` : "(not set)");

    if (!geminiApiKey) {
      console.error("[treatment-detail] GEMINI_API_KEY is not set in environment variables.");
      return jsonResponse({ error: "Treatment detail service is not configured (missing API key)." }, 503);
    }

    const { prompt, type: diagnosisType } = buildPrompt(diseaseName, cropName, isConfident, diagnosisData);
    console.log("[treatment-detail] Diagnosis type:", diagnosisType, "| isConfident:", isConfident);

    const geminiModel = "gemini-flash-latest";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
    const geminiBody = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
    });

    const GEMINI_TIMEOUT_MS = 25000;
    const MAX_ATTEMPTS = 2;

    let geminiResp: Response | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.error(`[treatment-detail] Gemini fetch timed out after ${GEMINI_TIMEOUT_MS / 1000}s (attempt ${attempt}/${MAX_ATTEMPTS})`);
        controller.abort();
      }, GEMINI_TIMEOUT_MS);

      try {
        console.log(`[treatment-detail] Calling Gemini API (attempt ${attempt}/${MAX_ATTEMPTS}):`, geminiUrl.replace(geminiApiKey, "***"));
        geminiResp = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: geminiBody,
          signal: controller.signal,
        });
        clearTimeout(timeout);
        console.log(`[treatment-detail] Gemini response status (attempt ${attempt}):`, geminiResp.status, geminiResp.statusText);
        break;
      } catch (fetchErr) {
        clearTimeout(timeout);
        const errMsg = (fetchErr as Error)?.message ?? String(fetchErr);
        const isAbort = (fetchErr as Error)?.name === "AbortError";
        console.error(`[treatment-detail] Gemini fetch failed (attempt ${attempt}/${MAX_ATTEMPTS}):`, {
          error: errMsg,
          isAbort,
          stack: (fetchErr as Error)?.stack?.slice(0, 500),
        });
        lastError = isAbort ? `Gemini API timed out after ${GEMINI_TIMEOUT_MS / 1000} seconds.` : `Gemini fetch failed: ${errMsg}`;

        if (attempt < MAX_ATTEMPTS) {
          console.log("[treatment-detail] Waiting 1s before retry...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    if (!geminiResp) {
      return jsonResponse({ error: lastError ?? "Gemini fetch failed after retries." }, 502);
    }

    if (!geminiResp.ok) {
      const errorBody = await geminiResp.text().catch(() => "<unreadable>");
      console.error("[treatment-detail] Gemini API returned error:", {
        status: geminiResp.status,
        statusText: geminiResp.statusText,
        body: errorBody.slice(0, 1000),
      });
      return jsonResponse(
        { error: `Gemini API error (${geminiResp.status}): ${errorBody.slice(0, 500)}` },
        502,
      );
    }

    const rawGeminiBody = await geminiResp.text().catch(() => "<unreadable>");
    let geminiData: unknown;
    try {
      geminiData = JSON.parse(rawGeminiBody);
    } catch (jsonErr) {
      console.error("[treatment-detail] Failed to parse Gemini response JSON:", {
        error: (jsonErr as Error).message,
        status: geminiResp.status,
        rawBody: rawGeminiBody.slice(0, 1000),
      });
      return jsonResponse({ error: "Gemini response was not valid JSON." }, 502);
    }

    const geminiResponse = geminiData as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const rawText: string = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    console.log("[treatment-detail] Gemini generated text length:", rawText.length, "| preview:", rawText.slice(0, 200));

    if (!rawText) {
      console.error("[treatment-detail] Gemini returned empty text. Full response:", JSON.stringify(geminiData).slice(0, 800));
      return jsonResponse({ error: "No treatment details were generated (empty Gemini response)." }, 502);
    }

    let jsonStr = rawText;
    const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    } else {
      const braceStart = rawText.indexOf("{");
      const braceEnd = rawText.lastIndexOf("}");
      if (braceStart !== -1 && braceEnd !== -1) {
        jsonStr = rawText.slice(braceStart, braceEnd + 1);
      }
    }

    let parsed: {
      bullets?: string[];
      deficientNutrient?: string;
      correctiveAction?: string;
      applicationGuidance?: string;
    };
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[treatment-detail] Failed to parse extracted JSON:", (parseErr as Error).message, "| extracted:", jsonStr.slice(0, 300), "| raw:", rawText.slice(0, 300));
      return jsonResponse({ error: "Could not parse the treatment response from Gemini." }, 502);
    }

    const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((b) => typeof b === 'string' && b.trim()) : [];

    const result: TreatmentResponse = {
      isConfident,
      type: diagnosisType,
      bullets,
      ...(parsed.deficientNutrient ? { deficientNutrient: parsed.deficientNutrient } : {}),
      ...(parsed.correctiveAction ? { correctiveAction: parsed.correctiveAction } : {}),
      ...(parsed.applicationGuidance ? { applicationGuidance: parsed.applicationGuidance } : {}),
    };

    if (diagnosisType === 'nutrient_deficiency' && !result.deficientNutrient && bullets.length === 0) {
      console.error("[treatment-detail] Nutrient deficiency response missing all fields. Parsed:", JSON.stringify(parsed).slice(0, 500));
      return jsonResponse({ error: "No treatment details were generated (empty nutrient deficiency response)." }, 502);
    }

    if (diagnosisType === 'pest_disease' && bullets.length === 0) {
      console.error("[treatment-detail] No valid bullets found. Parsed:", JSON.stringify(parsed).slice(0, 500));
      return jsonResponse({ error: "No treatment details were generated (no valid bullets)." }, 502);
    }

    console.log("[treatment-detail] Success! Returning", bullets.length, "bullets, type:", diagnosisType);

    return jsonResponse({ treatment: result }, 200);
  } catch (err) {
    console.error("[treatment-detail] Unhandled error:", {
      message: (err as Error)?.message,
      name: (err as Error)?.name,
      stack: (err as Error)?.stack?.slice(0, 800),
    });
    return jsonResponse({ error: `Internal error: ${(err as Error)?.message ?? "unknown"}` }, 500);
  }
});
