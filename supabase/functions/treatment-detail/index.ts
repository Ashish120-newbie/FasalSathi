import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// treatment-detail: redeployed to pick up refreshed GEMINI_API_KEY secret

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
  bullets: string[];
}

const HIGH_CONFIDENCE_THRESHOLD = 70;

const PROMPT = (
  diseaseName: string,
  cropName: string,
  isConfident: boolean,
  diagnosisData?: unknown,
) => {
  const dataContext = diagnosisData
    ? `\nAdditional diagnosis data (for context, may be incomplete):\n${JSON.stringify(diagnosisData).slice(0, 800)}\n`
    : '';

  if (!isConfident) {
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
};

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

    const geminiModel = "gemini-flash-latest";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
    console.log("[treatment-detail] Calling Gemini API:", geminiUrl.replace(geminiApiKey, "***"));

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.error("[treatment-detail] Gemini fetch timed out after 15s");
      controller.abort();
    }, 15000);

    let geminiResp: Response;
    try {
      geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: PROMPT(diseaseName, cropName, isConfident, diagnosisData) }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const errMsg = (fetchErr as Error)?.message ?? String(fetchErr);
      const isAbort = (fetchErr as Error)?.name === "AbortError";
      console.error("[treatment-detail] Gemini fetch failed:", {
        error: errMsg,
        isAbort,
        stack: (fetchErr as Error)?.stack?.slice(0, 500),
      });
      return jsonResponse(
        { error: isAbort ? "Gemini API timed out after 15 seconds." : `Gemini fetch failed: ${errMsg}` },
        502,
      );
    }
    clearTimeout(timeout);

    console.log("[treatment-detail] Gemini response status:", geminiResp.status, geminiResp.statusText);

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

    let parsed: { bullets?: string[] };
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("[treatment-detail] Failed to parse extracted JSON:", (parseErr as Error).message, "| extracted:", jsonStr.slice(0, 300), "| raw:", rawText.slice(0, 300));
      return jsonResponse({ error: "Could not parse the treatment response from Gemini." }, 502);
    }

    const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((b) => typeof b === 'string' && b.trim()) : [];

    if (bullets.length === 0) {
      console.error("[treatment-detail] No valid bullets found. Parsed:", JSON.stringify(parsed).slice(0, 500));
      return jsonResponse({ error: "No treatment details were generated (no valid bullets)." }, 502);
    }

    const result: TreatmentResponse = { isConfident, bullets };
    console.log("[treatment-detail] Success! Returning", bullets.length, "bullets.");

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
