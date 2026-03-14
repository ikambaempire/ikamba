// graphic-generator edge function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite graphic design AI that creates agency-quality, hyper-realistic marketing graphics.

You MUST follow these rules for EVERY design you generate:

VISUAL QUALITY:
- Hyper-realistic photographic quality — images must look like real photographs, NOT AI-generated
- Cinematic lighting with dramatic contrast, studio lighting, and high dynamic range
- Professional depth of field with realistic bokeh
- Ultra-sharp textures — fabric, metal, glass, skin, nature must feel tangible
- Rich, accurate color grading matching the requested brand tone
- NO cartoon, illustration, or plastic AI look — photographic realism ONLY

TYPOGRAPHY & LAYOUT:
- Include ALL text the user specifies with PERFECT legibility
- Use professional typographic hierarchy: headline large and bold, supporting text smaller
- Font pairing must be elegant — one display font, one body font
- Text must be aesthetically integrated into the composition, not floating randomly
- Professional margins, alignment, and visual balance following grid-based design
- Text contrast must ensure readability against background

COMPOSITION:
- Follow professional design principles: rule of thirds, visual hierarchy, focal points
- Create depth with layering, foreground/background elements, atmospheric perspective
- Use professional color palettes that match the style requested
- Include subtle design elements: gradients, overlays, textures, light flares where appropriate
- The design must be COMPLETE and READY TO USE — not just an image with text slapped on

DESIGN STYLES:
- Corporate Clean: structured grid, sans-serif typography, blue/navy/white, corporate photography
- NGO Storytelling: warm earth tones, emotive human photography, serif headlines, organic feel
- Luxury Brand: minimal, serif fonts, gold/black/white, generous whitespace, refined elegance
- Tech Modern: gradients, geometric shapes, futuristic, neon accents, sans-serif, dark backgrounds
- Editorial Magazine: bold headline typography, dramatic photography, editorial grid, asymmetric layouts
- Cinematic Campaign: movie-poster style, dramatic lighting, epic landscapes, impactful typography

OUTPUT: Generate one stunning, complete graphic design that rivals top creative agency work.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, editImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (editImage) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: editImage } },
        ],
      });
    } else {
      messages.push({ role: "user", content: prompt });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Design generation failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    const textContent = message?.content || "";
    const images = message?.images || [];

    return new Response(JSON.stringify({ text: textContent, images }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("graphic-generator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
