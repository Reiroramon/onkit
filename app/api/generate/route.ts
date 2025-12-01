import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const pfp = form.get("pfp") as File;

    if (!pfp) {
      return NextResponse.json({ error: "Missing PFP" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Convert PFP → base64
    const pfpBase64 = Buffer.from(await pfp.arrayBuffer()).toString("base64");

    // Load creator style
    const creatorPath = path.join(process.cwd(), "public/creator.png");
    const creatorBytes = await fs.readFile(creatorPath);
    const creatorBase64 = Buffer.from(creatorBytes).toString("base64");

    console.log("⚡ STEP 1: Generating prompt...");

    //
    // STEP 1 — Ask GPT-4.1 to build the final strong prompt
    //
    const promptResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_image",
                image_url: `data:image/png;base64,${creatorBase64}`,
              },
              {
                type: "input_image",
                image_url: `data:image/png;base64,${pfpBase64}`,
              },
              {
                type: "input_text",
                text: `
                  Make a SINGLE ultra-detailed prompt for gpt-image-1 that blends:
                  - Onkit style from creator.png
                  - identity traits from pfp user

                  Use this identity rule:

                  Generate a character in full Onkit art style 
                  BUT fully influenced by the user's PFP identity.

                  Keep only:
                  - Onkit line style
                  - Onkit shading
                  - Onkit proportions

                  EVERYTHING ELSE MUST FOLLOW THE USER PFP:
                  - hair shape and color
                  - skin tone
                  - expression and facial attitude
                  - clothing style, colors, patterns, logos
                  - accessories (cigarette, headset, glasses, jewelry)
                  - overall personality and vibe

                  BACKGROUND:
                  - detect the dominant color palette of the user's PFP
                  - recreate the aura, mood and energy of that PFP
                  - NOT the literal background, but the same vibe
                  - use Onkit-style gradients and glows

                  NEGATIVE PROMPT:
                  avoid realism,
                  avoid muddy blending,
                  avoid pixel-art,
                  avoid ignoring user identity

                  Return ONLY the final improved prompt text. No explanation.
                `,
              },
            ],
          },
        ],
      }),
    });

    const promptJson = await promptResponse.json();

    // FIX: Extract final prompt correctly
    const finalPrompt =
      promptJson.output?.[0]?.content?.[0]?.text || "";

    if (!finalPrompt) {
      console.error("❌ Prompt generation failed", promptJson);
      return NextResponse.json(
        { error: "Failed to generate prompt", details: promptJson },
        { status: 500 }
      );
    }

    console.log("✔ Final Prompt:", finalPrompt.substring(0, 140), "...");

    //
    // STEP 2 — Generate final image
    //
    console.log("⚡ STEP 2: Generating image with gpt-image-1...");

    const imageResponse = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: finalPrompt,
          size: "1024x1024",
        }),
      }
    );

    const imageJson = await imageResponse.json();
    const base64 = imageJson.data?.[0]?.b64_json;

    if (!base64) {
      console.error("❌ NO IMAGE GENERATED:", imageJson);
      return NextResponse.json(
        { error: "No image generated", details: imageJson },
        { status: 500 }
      );
    }

    console.log("✔ Image Generated!");

    return NextResponse.json({
      output: `data:image/png;base64,${base64}`,
    });
  } catch (err: any) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
