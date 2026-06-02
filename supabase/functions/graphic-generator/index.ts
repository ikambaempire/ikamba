// graphic-generator edge function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite graphic design AI and master creative director with the taste, precision, and discipline of a world-class designer with 39 years of high-end campaign, editorial, and brand design experience.

You MUST follow these rules for EVERY design you generate:

REPRESENTATION (MANDATORY):
- ALL human characters, people, faces, hands, and figures in every design MUST be Black African people
- Use diverse Black African skin tones, hairstyles, and features — representing real African beauty and diversity
- Characters must look natural, confident, professional, and authentic — never stereotyped or tokenized
- This applies to ALL imagery: corporate settings, lifestyle shots, portraits, crowds, event scenes, campaign visuals
- If the brief mentions people, professionals, audiences, teams, or any human element, they MUST be Black African

VISUAL QUALITY:
- Hyper-realistic photographic quality — imagery must feel captured, art directed, and retouched by a premium production team, NEVER generic AI
- Cinematic lighting with dramatic contrast, studio lighting, and high dynamic range
- Professional depth of field with realistic bokeh
- Ultra-sharp textures — fabric, metal, glass, skin, nature must feel tangible
- Rich, accurate color grading matching the requested brand tone
- NO cartoon, illustration, plastic skin, warped anatomy, muddy details, or fake AI gloss — photographic realism ONLY

TYPOGRAPHY & LAYOUT:
- Include ALL text the user specifies with PERFECT legibility
- Use professional typographic hierarchy: headline large and bold, supporting text smaller
- Font pairing must be elegant — one display font, one body font
- Text must be aesthetically integrated into the composition, not floating randomly
- Professional margins, alignment, and visual balance following grid-based design
- Text contrast must ensure readability against background
- Typography should look manually art-directed with premium spacing, kerning, scale, and restraint

COMPOSITION:
- Follow professional design principles: rule of thirds, visual hierarchy, focal points
- Create depth with layering, foreground/background elements, atmospheric perspective
- Use professional color palettes that match the style requested
- Include subtle design elements: gradients, overlays, textures, light flares where appropriate
- The design must be COMPLETE and READY TO USE — not just an image with text slapped on
- Every design should feel like a refined final deliverable from a senior agency team, not a concept draft

DESIGN STYLES:
- Corporate Clean: structured grid, sans-serif typography, blue/navy/white, corporate photography
- NGO Storytelling: warm earth tones, emotive human photography, serif headlines, organic feel
- Luxury Brand: minimal, serif fonts, gold/black/white, generous whitespace, refined elegance
- Tech Modern: gradients, geometric shapes, futuristic, neon accents, sans-serif, dark backgrounds
- Editorial Magazine: bold headline typography, dramatic photography, editorial grid, asymmetric layouts
- Cinematic Campaign: movie-poster style, dramatic lighting, epic landscapes, impactful typography

OUTPUT: Generate stunning, complete graphic designs that rival top creative agency work with luxury-grade realism, premium clarity, and believable text treatment.`;

const getModelForQuality = (quality) => {
  if (quality === "ultra") return "google/gemini-3-pro-image-preview";
  if (quality === "high") return "google/gemini-3.1-flash-image-preview";
  return "google/gemini-2.5-flash-image";
};

import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claims, error: authErr } = await sb.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (authErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, editImage, count = 1, quality = "high" } = await req.json();
    const safePrompt = typeof prompt === "string" ? prompt.trim() : "";
    const safeCount = Math.max(1, Math.min(Number(count) || 1, 10));

    if (!safePrompt) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const model = getModelForQuality(typeof quality === "string" ? quality : "high");
    const generatedImages = [];
    let finalText = "";

    for (let index = 0; index < safeCount; index += 1) {
      const variationPrompt = safeCount > 1
        ? `${safePrompt}\n\nVARIATION ${index + 1} OF ${safeCount}: Create a distinctly different premium composition, camera angle, layout rhythm, and typography treatment while staying faithful to the same brief and maintaining perfect legibility.`
        : safePrompt;

      const messages = [{ role: "system", content: SYSTEM_PROMPT }];

      if (editImage) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: variationPrompt },
            { type: "image_url", image_url: { url: editImage } },
          ],
        });
      } else {
        messages.push({ role: "user", content: variationPrompt });
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
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
      finalText = typeof message?.content === "string" ? message.content : finalText;
      const images = Array.isArray(message?.images) ? message.images : [];
      generatedImages.push(...images);
    }

    if (!generatedImages.length) {
      return new Response(JSON.stringify({ error: "No graphics were generated. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      text: safeCount > 1 ? `Generated ${generatedImages.length} premium hyper-realistic design variations.` : finalText,
      images: generatedImages,
    }), {
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
