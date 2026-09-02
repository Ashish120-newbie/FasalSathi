import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    cropType?: string;
    growthStage?: string;
    diagnosis?: string;
    confidence?: number;
    confidenceLevel?: string;
    recommendation?: string;
    source?: string;
  };
}

const SYSTEM_PROMPT = `You are FasalSathi, a friendly AI farm assistant for smallholder farmers in India. You help farmers with crop diseases, fertilizer use, pest control, general farming questions, AND government schemes, subsidies, insurance, credit, and agricultural support programmes.

SCOPE:
You can answer ANY general farming, agriculture, or agricultural-scheme-related question. This includes but is not limited to:
- Crop diseases, pests, and treatment
- Fertilizer and nutrient management
- Irrigation and water management
- Government schemes (PM-KISAN, PMFBY, Kisan Credit Card, Soil Health Card, fertilizer subsidy, PKVY organic farming, PMKSY micro-irrigation, FRP for sugarcane, MKSP for women farmers, etc.)
- Subsidies, insurance, credit facilities, and application processes
- Weather-related crop advice
- Soil health and testing

If asked about something completely unrelated to farming or agriculture, politely redirect back to farming.

RULES:
1. When a farmer asks about a specific government scheme, give a REAL, DIRECT answer: briefly explain what the scheme offers, basic eligibility, and the general application process (e.g., "apply via the PM-KISAN portal or your nearest Common Service Centre with your Aadhaar and land records"). Do NOT deflect or give a generic capability description.
2. After answering a scheme question, suggest: "You can also check the Schemes tab in the FasalSathi app for more details and to check your eligibility."
3. When the farmer has an active diagnosis, reference their specific crop, disease, and growth stage to give relevant advice.
4. Give practical, actionable advice that a farmer can follow with common resources.
5. Keep answers SHORT and SIMPLE — 2 to 4 sentences. Use plain language a farmer with basic literacy can understand. Avoid technical jargon.
6. DEFER TO A HUMAN for things that are genuinely high-stakes or uncertain: exact chemical dosages beyond standard recommendations, large-scale yield risks, unfamiliar diseases, or disputed eligibility cases. For general "how do I apply" questions about well-known public schemes, give a direct factual answer — these are safe, in-scope, and NOT something to deflect.
7. Never invent specific pesticide brand dosages. If asked about chemical amounts, reference what the app's diagnosis or fertilizer calculator already shows, and recommend consulting an officer for anything beyond that.
8. Be warm and encouraging. The farmer may be worried about their crop.
9. If you don't know something, say so honestly rather than guessing.`;

// ── Scheme knowledge for fallback and as supplementary context for Gemini ──
const SCHEME_KNOWLEDGE: Record<string, { summary: string; eligibility: string; application: string }> = {
  "pm-kisan": {
    summary: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) provides ₹6,000 per year to eligible landholding farmer families in three instalments of ₹2,000 each, paid directly to bank accounts.",
    eligibility: "Landholding farmer families with cultivable land up to 2 hectares, excluding institutional farmers, income tax payers, and constitutional post holders.",
    application: "Apply via the PM-KISAN portal (pmkisan.gov.in) or your nearest Common Service Centre (CSC) with your Aadhaar card, land ownership records (patwa/khatauni/patta), and bank account details. Complete e-KYC verification, and the State/Nodal officers will verify and approve your name.",
  },
  "pmfby": {
    summary: "PMFBY (Pradhan Mantri Fasal Bima Yojana) is affordable crop insurance protecting farmers against crop loss from natural calamities, pests, and diseases. Farmer premium is capped at 1.5% for Rabi, 2% for Kharif, and 5% for commercial/horticultural crops.",
    eligibility: "All farmers growing notified crops in notified areas, including loanee and non-loanee farmers. Tenant farmers and sharecroppers are also eligible.",
    application: "Contact your bank, Primary Agricultural Credit Society (PACS), or visit the PMFBY portal (pmfby.gov.in). Provide land details and crop information, pay the applicable farmer premium share, and coverage begins immediately.",
  },
  "kcc": {
    summary: "Kisan Credit Card (KCC) provides flexible short-term credit for crop cultivation and allied activities at concessional interest rates (around 4% with interest subvention and prompt repayment incentive). Credit limit up to ₹3 lakh.",
    eligibility: "All farmers including individual farmers, tenant farmers, sharecroppers, and SHGs engaged in crop cultivation and allied activities.",
    application: "Visit your nearest bank branch or cooperative society with your Aadhaar card, land ownership or tenancy records, bank account details, and a passport-size photograph. Fill out the KCC application form, and the bank will verify land records and issue the card with an approved credit limit.",
  },
  "soil health card": {
    summary: "Soil Health Card Scheme provides free soil testing and field-specific nutrient recommendations for 12 parameters including NPK, pH, and micronutrients, renewed every 2 years.",
    eligibility: "All farmers with cultivable land, including individual and joint landholders.",
    application: "Contact your village agriculture officer or visit the nearest soil testing laboratory. Submit soil samples from your farm (the officer will assist), and the card with nutrient status and fertilizer recommendations will be issued.",
  },
  "fertilizer subsidy": {
    summary: "Nutrient Based Subsidy (NBS) makes phosphatic and potassic fertilizers (DAP, SSP, MOP, complex fertilizers) available at affordable prices. Urea is subsidized at a fixed MRP of ₹268 per 45 kg bag.",
    eligibility: "All farmers purchasing fertilizers from registered dealers and cooperative societies.",
    application: "No separate application needed — visit a registered fertilizer dealer or cooperative society and purchase at the subsidized price. The subsidy is applied automatically. Ensure purchases are recorded against your Aadhaar/land records.",
  },
  "nbs": {
    summary: "Nutrient Based Subsidy (NBS) makes phosphatic and potassic fertilizers (DAP, SSP, MOP, complex fertilizers) available at affordable prices. Urea is subsidized at a fixed MRP of ₹268 per 45 kg bag.",
    eligibility: "All farmers purchasing fertilizers from registered dealers and cooperative societies.",
    application: "No separate application needed — visit a registered fertilizer dealer or cooperative society and purchase at the subsidized price. The subsidy is applied automatically.",
  },
  "pkvy": {
    summary: "Paramparagat Krishi Vikas Yojana (PKVY) supports farmers to adopt organic farming through cluster-based training, certification, and market linkage. Provides ₹50,000 per hectare over three years.",
    eligibility: "Farmer groups or clusters of at least 20 farmers with a minimum 50 acres total area, willing to adopt organic farming practices.",
    application: "Form a cluster of at least 20 farmers, register with the local agriculture department, and enroll in the PGS organic certification system. You'll receive assistance for organic inputs and training, with PGS certification after 3 years.",
  },
  "pmksy": {
    summary: "PMKSY — Per Drop More Crop provides financial assistance for installing drip and sprinkler irrigation systems. Subsidy is 55% for small and marginal farmers, 45% for others.",
    eligibility: "All farmers with cultivable land and a water source suitable for micro irrigation, up to 5 hectares per beneficiary.",
    application: "Visit the PMKSY portal (pmksy.gov.in) or your district agriculture office. Register with land records and water source details, get a quote from an empanelled micro-irrigation supplier, and submit for subsidy approval.",
  },
  "micro irrigation": {
    summary: "PMKSY — Per Drop More Crop provides financial assistance for installing drip and sprinkler irrigation systems. Subsidy is 55% for small and marginal farmers, 45% for others.",
    eligibility: "All farmers with cultivable land and a water source suitable for micro irrigation, up to 5 hectares per beneficiary.",
    application: "Visit the PMKSY portal (pmksy.gov.in) or your district agriculture office. Register with land records and water source details, get a quote from an empanelled micro-irrigation supplier, and submit for subsidy approval.",
  },
  "kisan credit card": {
    summary: "Kisan Credit Card (KCC) provides flexible short-term credit for crop cultivation and allied activities at concessional interest rates (around 4% with interest subvention). Credit limit up to ₹3 lakh.",
    eligibility: "All farmers including individual farmers, tenant farmers, sharecroppers, and SHGs engaged in crop cultivation and allied activities.",
    application: "Visit your nearest bank branch or cooperative society with your Aadhaar card, land ownership or tenancy records, bank account details, and a passport-size photograph. Fill out the KCC application form, and the bank will verify and issue the card.",
  },
  "mksp": {
    summary: "Mahila Kisan Sashaktikaran Pariyojana (MKSP) empowers women farmers through training, capacity building, and support for sustainable agriculture practices.",
    eligibility: "Women farmers and women Self Help Groups (SHGs) engaged in agriculture, particularly from small and marginal holdings.",
    application: "Join or form a women Self Help Group (SHG) in your village, then contact the implementing NGO or State Rural Livelihoods Mission (SRLM) to enroll in the MKSP program.",
  },
  "frp": {
    summary: "Fair and Remunerative Price (FRP) for Sugarcane is the assured minimum price paid to sugarcane farmers by sugar mills. The FRP is ₹340 per quintal for 2024-25 season.",
    eligibility: "Sugarcane growers supplying cane to registered sugar mills or cooperative factories.",
    application: "Register with your nearest sugar mill or cooperative factory, sign a cane supply agreement for the crushing season, and supply sugarcane as per the mill schedule. Payment is made directly to your bank account at the FRP or higher.",
  },
};

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[-_\s]+/g, " ").trim();
}

function findSchemeMatch(text: string): { summary: string; eligibility: string; application: string } | null {
  const lower = text.toLowerCase();
  const normalized = normalizeText(text);
  for (const [key, data] of Object.entries(SCHEME_KNOWLEDGE)) {
    const normKey = normalizeText(key);
    if (lower.includes(key) || normalized.includes(normKey)) return data;
  }
  // Check for generic scheme questions (include common misspellings)
  if (lower.includes("scheme") || lower.includes("yojana") || lower.includes("yojna") || lower.includes("subsidy") || lower.includes("benefit") || lower.includes("government") || lower.includes("apply for")) {
    return null; // triggers the generic scheme guidance
  }
  return null;
}

// ── Knowledge-based fallback (works without API key) ──
function knowledgeBasedReply(userText: string, context?: ChatRequest["context"]): string {
  const text = userText.toLowerCase();
  const crop = context?.cropType ?? "your crop";
  const diagnosis = context?.diagnosis ?? "";
  const recommendation = context?.recommendation ?? "";
  const stage = context?.growthStage ?? "";

  // ── Scheme questions ──
  const schemeMatch = findSchemeMatch(userText);
  if (schemeMatch) {
    return `${schemeMatch.summary} Eligibility: ${schemeMatch.eligibility} To apply: ${schemeMatch.application} You can also check the Schemes tab in the FasalSathi app for more details and to check your eligibility.`;
  }
  // Generic scheme question that didn't match a specific scheme
  if (text.includes("scheme") || text.includes("yojana") || text.includes("yojna") || text.includes("subsidy") || text.includes("government") || text.includes("benefit")) {
    return `FasalSathi has information on several government schemes including PM-KISAN (income support of ₹6,000/year), PMFBY (crop insurance), Kisan Credit Card (low-interest credit), Soil Health Card (free soil testing), fertilizer subsidies, PKVY (organic farming support), and PMKSY (micro-irrigation subsidy). Check the Schemes tab in the app to see which ones you're eligible for and get full details on how to apply. You can also ask me about any specific scheme by name!`;
  }

  // Disease-specific knowledge
  const diseaseKnowledge: Record<string, string> = {
    "yellow rust": `Yellow Rust appears as yellow-orange powdery stripes on wheat leaves, especially in cool humid weather. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Remove badly affected leaves and improve airflow between plants. If the disease covers a large area of your field, please consult your local agricultural officer.`,
    "rice blast": `Rice Blast causes diamond-shaped grey spots with brown edges and can damage the whole crop quickly. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Avoid excess nitrogen fertilizer and maintain proper spacing between plants. Since this is a severe disease, please consult your local agricultural officer if it is spreading fast.`,
    "cotton leaf curl virus": `Cotton Leaf Curl Virus is spread by whiteflies and causes leaves to curl upward with thickened veins. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Control whiteflies early and remove infected plants. For large-scale infection, please consult your local agricultural officer.`,
    "early blight": `Early Blight causes dark brown circular spots with ring patterns on tomato leaves, starting from the lower leaves. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Remove infected leaves and avoid watering over the leaves. Add mulch to prevent soil splash.`,
    "late blight": `Late Blight spreads fast in cool wet conditions, causing water-soaked dark patches on potato leaves. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Remove infected plant parts and avoid irrigation during cloudy wet weather. Since this is severe, please consult your local agricultural officer immediately.`,
    "nitrogen deficiency": `Nitrogen Deficiency shows as uniform yellowing starting from older leaves with slow thin growth. ${recommendation ? `The recommended action is: ${recommendation}. ` : ""}Apply Urea in split doses and add well-rotted farmyard manure. A soil test before the next crop will give the best guidance.`,
  };

  // Organic farming question — check before disease-specific so it takes priority
  if (text.includes("organic")) {
    return `For organic farming, use neem oil sprays, compost, and cow dung-based fertilizers instead of chemicals. ${diagnosis ? `For your ${diagnosis}, try neem oil solution (5 ml per litre of water) as a natural spray. ` : ""}If the problem is severe, please consult your local agricultural officer for organic-certified treatments.`;
  }

  // Check if asking about the diagnosed disease
  if (diagnosis) {
    const diagLower = diagnosis.toLowerCase();
    for (const [key, answer] of Object.entries(diseaseKnowledge)) {
      if (diagLower.includes(key) || key.includes(diagLower)) {
        if (text.includes("why") || text.includes("how") || text.includes("what") || text.includes("tell") || text.includes("about") || text.includes("disease") || text.includes("treat") || text.includes("prevent") || text.includes("should i do")) {
          return answer;
        }
      }
    }
  }

  // General farming questions
  if (text.includes("prevent") || text.includes("next season")) {
    return `To prevent ${diagnosis ? diagnosis.toLowerCase() : "crop diseases"} next season: use certified disease-resistant seeds, maintain proper plant spacing for airflow, rotate crops, and remove infected plant debris after harvest. ${stage ? `Since your crop is in the ${stage.toLowerCase()} stage, focus on field hygiene now. ` : ""}A soil test before the next crop is always a good idea.`;
  }
  if (text.includes("fertilizer") || text.includes("fertiliser") || text.includes("npk") || text.includes("urea") || text.includes("dap") || text.includes("mop")) {
    return `For ${crop}, use the FasalSathi fertilizer calculator on the Fertilizer tab to get the right NPK amounts based on growth stage. ${stage ? `In the ${stage.toLowerCase()} stage, balanced nutrition is important. ` : ""}Always do a soil test first for the most accurate recommendation. For specific dosage beyond what the calculator shows, please consult your local agricultural officer.`;
  }
  if (text.includes("water") || text.includes("irrigation")) {
    return `Water ${crop} deeply but less often rather than shallow daily watering. ${stage ? `In the ${stage.toLowerCase()} stage, maintain consistent soil moisture. ` : ""}Avoid overhead watering if you see leaf spots, as wet leaves encourage fungal diseases. Water early morning so leaves dry during the day.`;
  }
  if (text.includes("weather") || text.includes("rain") || text.includes("temperature")) {
    return `Weather affects crop health greatly. Cool humid conditions favor fungal diseases like rust and blight. Heavy rain can wash away fertilizer and spread disease. ${diagnosis ? `Your ${diagnosis} may be weather-related. ` : ""}Check local weather forecasts and adjust irrigation accordingly.`;
  }
  if (text.includes("pest") || text.includes("insect") || text.includes("bug") || text.includes("whitefly") || text.includes("aphid")) {
    return `Common pests include whiteflies, aphids, and borers. Use neem oil spray (5 ml per litre) as a safe first step. ${diagnosis && diagnosis.toLowerCase().includes("virus") ? `Since your diagnosis is virus-related, controlling the insect carrier (like whiteflies) is critical. ` : ""}For severe infestations, please consult your local agricultural officer for recommended insecticides.`;
  }
  if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("namaste")) {
    return `Hello! I'm your FasalSathi assistant. ${diagnosis ? `I can see you have a ${diagnosis} diagnosis for your ${crop}. ` : `I can help with crop diseases, fertilizer, government schemes, and farming questions. `}Ask me anything!`;
  }
  if (text.includes("thank")) {
    return `You're welcome! I'm always here to help with your farming questions. If you need more detailed advice, please consult your local agricultural officer.`;
  }
  if (text.includes("safe") || text.includes("chemical") || text.includes("pesticide") || text.includes("spray") || text.includes("dosage") || text.includes("dose")) {
    return `For chemical safety: always follow the dosage on the product label, wear gloves and a mask when spraying, and never mix chemicals. ${recommendation ? `Your app recommends: ${recommendation}. ` : ""}For any dosage beyond what is shown in the app, please consult your local agricultural officer.`;
  }

  // Default response with context
  if (diagnosis) {
    return `I can see your ${crop} has been diagnosed with ${diagnosis} at ${context?.confidenceLevel ?? "medium"} confidence. ${recommendation ? `The recommendation is: ${recommendation}. ` : ""}You can ask me about treatment, prevention, organic options, government schemes, or any farming question.`;
  }
  return `I can help with crop diseases, fertilizer recommendations, pest control, government schemes and subsidies, and general farming questions. ${crop !== "your crop" ? `For your ${crop}, ` : ""}ask me about treatment, prevention, watering, schemes, or any farming topic!`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: ChatRequest = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    // If no API key at all, use the knowledge-based fallback immediately
    if (!geminiApiKey) {
      const reply = lastUserMessage
        ? knowledgeBasedReply(lastUserMessage.text, context)
        : "I'm your FasalSathi assistant. Ask me about your crops, diseases, government schemes, or farming!";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build context preamble
    let contextPreamble = "";
    if (context) {
      const parts: string[] = [];
      if (context.cropType) parts.push(`Crop: ${context.cropType}`);
      if (context.growthStage) parts.push(`Growth stage: ${context.growthStage}`);
      if (context.diagnosis) parts.push(`Diagnosed condition: ${context.diagnosis}`);
      if (context.confidenceLevel) parts.push(`Confidence: ${context.confidenceLevel} (${context.confidence ?? 0}%)`);
      if (context.recommendation) parts.push(`Initial recommendation: ${context.recommendation}`);
      if (parts.length > 0) {
        contextPreamble = `\n\nFARMER'S CURRENT CONTEXT:\n${parts.join("\n")}\nUse this context when relevant to answer their questions.`;
      }
    }

    // Build scheme knowledge reference for Gemini
    const schemeReference = `\n\nGOVERNMENT SCHEMES IN FASALSATHI APP:\nThe app's Schemes tab contains detailed information on these schemes. When a farmer asks about any of these, give a direct factual answer and suggest they check the Schemes tab for full details and eligibility checking:\n${Object.entries(SCHEME_KNOWLEDGE).map(([key, d]) => `- ${key}: ${d.summary}`).join("\n")}`;

    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const geminiModel = "gemini-flash-latest";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let geminiResp: Response;
    try {
      geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + contextPreamble + schemeReference }] },
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 800 }
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.error("[ai-chat] Gemini fetch failed:", (fetchErr as Error)?.name, (fetchErr as Error)?.message);
      const reply = lastUserMessage
        ? knowledgeBasedReply(lastUserMessage.text, context)
        : "I couldn't connect to the AI service right now. Please check your internet and try again, or call the Kisan helpline at 1800-180-1551.";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    clearTimeout(timeout);

    if (!geminiResp.ok) {
      const errorBody = await geminiResp.text().catch(() => "<unreadable>");
      console.error("[ai-chat] Gemini API error:", geminiResp.status, errorBody.slice(0, 500));
      const reply = lastUserMessage
        ? knowledgeBasedReply(lastUserMessage.text, context)
        : geminiResp.status === 429
          ? "I'm getting too many questions right now. Please wait a moment and try again."
          : "I couldn't connect to the AI service right now. Please try again in a moment, or call the Kisan helpline at 1800-180-1551.";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiResp.json();
    const replyText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    if (!replyText) {
      console.error("[ai-chat] Gemini returned empty reply text");
      const reply = lastUserMessage
        ? knowledgeBasedReply(lastUserMessage.text, context)
        : "I couldn't generate a response. Please try rephrasing your question, or call the Kisan helpline at 1800-180-1551.";
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ai-chat error:", err);
    return new Response(JSON.stringify({ reply: "Something went wrong. Please try asking again." }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
