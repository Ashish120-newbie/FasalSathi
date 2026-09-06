import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TreatmentRequest {
  diseaseName: string;
  cropName: string;
}

interface TreatmentDetail {
  biological: string;
  chemical: string;
  organic: string;
  manual: string;
}

const PROMPT = (diseaseName: string, cropName: string) =>
  `You are an agricultural expert. For ${diseaseName} affecting ${cropName}, provide REAL, SPECIFIC treatment options in this exact JSON format, no extra text:
{
  "biological": "specific biological control method or beneficial organism, if applicable",
  "chemical": "specific chemical name/class and general application guidance (not exact dosage — recommend checking product label)",
  "organic": "specific organic/low-risk option (e.g. neem oil, Bacillus thuringiensis, specific concentration guidance)",
  "manual": "any physical/manual control method if relevant, otherwise empty string"
}
Only include real, established agricultural practices. If you are not confident about a specific chemical name, say to consult a local agriculture officer for that field instead of guessing.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { diseaseName, cropName }: TreatmentRequest = await req.json();

    if (!diseaseName || !cropName) {
      return new Response(
        JSON.stringify({ error: "diseaseName and cropName are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Treatment detail service is not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
          contents: [{ role: "user", parts: [{ text: PROMPT(diseaseName, cropName) }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.error("[treatment-detail] Gemini fetch failed:", (fetchErr as Error)?.message);
      return new Response(
        JSON.stringify({ error: "Could not reach the treatment service." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    clearTimeout(timeout);

    if (!geminiResp.ok) {
      const errorBody = await geminiResp.text().catch(() => "<unreadable>");
      console.error("[treatment-detail] Gemini API error:", geminiResp.status, errorBody.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "The treatment service returned an error." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResp.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "No treatment details were generated." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    let treatment: TreatmentDetail;
    try {
      treatment = JSON.parse(jsonStr);
    } catch {
      console.error("[treatment-detail] Failed to parse Gemini JSON:", jsonStr.slice(0, 200));
      return new Response(
        JSON.stringify({ error: "Could not parse the treatment response." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ treatment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("treatment-detail error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
