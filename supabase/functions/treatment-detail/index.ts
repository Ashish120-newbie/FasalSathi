import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

interface TreatmentBullet {
  text: string;
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      diseaseName,
      cropName,
      confidenceScore,
      confidenceLevel,
      diagnosisData,
    }: TreatmentRequest = await req.json();

    if (!diseaseName || !cropName) {
      return new Response(
        JSON.stringify({ error: "diseaseName and cropName are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const isConfident =
      (confidenceLevel === 'high' || confidenceLevel === 'medium') ||
      (typeof confidenceScore === 'number' && confidenceScore >= HIGH_CONFIDENCE_THRESHOLD);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Treatment detail service is not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

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
      console.error("[treatment-detail] Gemini fetch failed:", (fetchErr as Error)?.message);
      return new Response(
        JSON.stringify({ error: "Could not reach the treatment service." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    clearTimeout(timeout);

    if (!geminiResp.ok) {
      const errorBody = await geminiResp.text().catch(() => "<unreadable>");
      console.error("[treatment-detail] Gemini API error:", geminiResp.status, errorBody.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "The treatment service returned an error." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiData = await geminiResp.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "No treatment details were generated." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
    } catch {
      console.error("[treatment-detail] Failed to parse Gemini JSON:", jsonStr.slice(0, 200));
      return new Response(
        JSON.stringify({ error: "Could not parse the treatment response." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((b) => typeof b === 'string' && b.trim()) : [];

    if (bullets.length === 0) {
      return new Response(
        JSON.stringify({ error: "No treatment details were generated." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result: TreatmentResponse = { isConfident, bullets };

    return new Response(
      JSON.stringify({ treatment: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("treatment-detail error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
