import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateScanRequest {
  farmId: string;
  cropId: string;
  growthStage: string;
  imageBase64: string;
  imageContentType: string;
  notes?: string;
  symptoms?: string[];
  weather?: {
    temperatureC?: number;
    humidityPct?: number;
    rainfallMm?: number;
    conditions?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const url = new URL(req.url);
    const path = url.pathname.replace("/scan-management", "") || "/";

    if (req.method === "POST" && path === "/") {
      return await createScan(req, supabase, userId);
    }

    if (req.method === "GET" && path === "/") {
      return await listScans(supabase, userId, url);
    }

    if (req.method === "GET" && path.startsWith("/")) {
      const scanId = path.slice(1);
      return await getScan(supabase, userId, scanId);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("scan-management error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function createScan(
  req: Request,
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<Response> {
  const body: CreateScanRequest = await req.json();

  if (!body.farmId || !body.cropId || !body.growthStage || !body.imageBase64) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: farmId, cropId, growthStage, imageBase64" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const contentType = body.imageContentType || "image/jpeg";
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    return new Response(
      JSON.stringify({ error: "Unsupported image type. Use JPEG, PNG, or WebP." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const base64Data = body.imageBase64.split(",")[1] || body.imageBase64;
  const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  if (imageBytes.length > 10 * 1024 * 1024) {
    return new Response(
      JSON.stringify({ error: "Image too large. Maximum size is 10 MB." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("scan-images")
    .upload(fileName, imageBytes, { contentType, upsert: false });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return new Response(
      JSON.stringify({ error: "Failed to store image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { data: urlData } = supabase.storage
    .from("scan-images")
    .getPublicUrl(fileName);

  const { data: scan, error: scanError } = await supabase
    .from("crop_scans")
    .insert({
      user_id: userId,
      farm_id: body.farmId,
      crop_id: body.cropId,
      image_url: urlData.publicUrl,
      image_path: fileName,
      growth_stage: body.growthStage,
      notes: body.notes || null,
      status: "pending",
    })
    .select("id, farm_id, crop_id, image_url, image_path, growth_stage, notes, status, created_at")
    .single();

  if (scanError) {
    console.error("Scan insert error:", scanError);
    await supabase.storage.from("scan-images").remove([fileName]);
    return new Response(
      JSON.stringify({ error: "Failed to create scan record" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (body.symptoms && body.symptoms.length > 0) {
    const symptomRows = body.symptoms.map((s) => ({ scan_id: scan.id, symptom: s }));
    await supabase.from("symptoms").insert(symptomRows);
  }

  if (body.weather) {
    await supabase.from("weather_context").insert({
      scan_id: scan.id,
      temperature_c: body.weather.temperatureC ?? null,
      humidity_pct: body.weather.humidityPct ?? null,
      rainfall_mm: body.weather.rainfallMm ?? null,
      conditions: body.weather.conditions ?? null,
    });
  }

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "scan_complete",
    title: "Scan uploaded successfully",
    body: "Your crop scan has been saved and is ready for diagnosis.",
    related_scan_id: scan.id,
  });

  return new Response(JSON.stringify({ scan }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function listScans(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  url: URL
): Promise<Response> {
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const { data: scans, error } = await supabase
    .from("crop_scans")
    .select(`
      id, farm_id, crop_id, image_url, growth_stage, notes, status, created_at,
      diagnoses (id, disease_name, confidence_score, confidence_level, severity, source),
      expert_reviews (id, status, officer_id, reviewed_at, corrected_diagnosis, note)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("List scans error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve scans" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ scans }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getScan(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  scanId: string
): Promise<Response> {
  const { data: scan, error } = await supabase
    .from("crop_scans")
    .select(`
      id, farm_id, crop_id, image_url, image_path, growth_stage, notes, status, created_at,
      diagnoses (id, disease_name, confidence_score, confidence_level, description, severity, affected_region, treatment, source, created_at),
      symptoms (id, symptom, created_at),
      weather_context (id, temperature_c, humidity_pct, rainfall_mm, conditions, recorded_at),
      expert_reviews (id, status, officer_id, reviewed_at, corrected_diagnosis, note, created_at)
    `)
    .eq("id", scanId)
    .maybeSingle();

  if (error) {
    console.error("Get scan error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve scan" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!scan) {
    return new Response(
      JSON.stringify({ error: "Scan not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ scan }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
