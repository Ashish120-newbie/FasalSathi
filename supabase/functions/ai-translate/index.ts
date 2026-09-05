import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TranslateRequest {
  texts: string[];
  targetLang: string;
  sourceLang?: string;
}

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { texts, targetLang, sourceLang } = (await req.json()) as TranslateRequest;

    if (!texts || !Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return new Response(
        JSON.stringify({ error: "texts (string[]) and targetLang are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Translation service not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const targetLangName = LANG_NAMES[targetLang] ?? targetLang;
    const sourceLangName = sourceLang ? LANG_NAMES[sourceLang] ?? sourceLang : "English";

    const prompt = `You are a professional agricultural translator. Translate the following agricultural text${sourceLang ? ` from ${sourceLangName}` : ""} to ${targetLangName}. 

Rules:
- Keep technical terms (pesticide names, fertilizer names, chemical compounds) as-is if no standard ${targetLangName} translation exists.
- Preserve the meaning and tone exactly.
- Keep any bullet points or list structure.
- Output ONLY the translated text, nothing else.
- Translate each text block separately, separated by "|||DELIMITER|||".

Texts to translate:
${texts.map((t, i) => `[${i + 1}] ${t}`).join("\n\n")}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let geminiResp: Response;
    try {
      geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
        }),
        signal: controller.signal,
      });
    } catch {
      clearTimeout(timeout);
      return new Response(
        JSON.stringify({ error: "Translation request failed." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    clearTimeout(timeout);

    if (!geminiResp.ok) {
      return new Response(
        JSON.stringify({ error: "Translation service error." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const geminiData = await geminiResp.json();
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "Translation returned empty." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const translated = rawText.split("|||DELIMITER|||").map((s) => s.trim());

    return new Response(
      JSON.stringify({ translations: translated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("ai-translate error:", err);
    return new Response(
      JSON.stringify({ error: "Translation failed." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
