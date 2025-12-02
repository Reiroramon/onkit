import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function buildPrompt(t: any) {
  return `
ONKIT CHARACTER RENDERING — FOLLOW STRICTLY:

STYLE:
- clean thick cartoon outlines
- smooth shading
- neon cyan/blue glow edges
- semi-gloss highlight on lines
- HD, sharp lines, no artifacts
- keep proportions similar to base image
- head slightly bigger, cute aesthetic

APPLY USER TRAITS:
Hair: ${t.hair_color}, ${t.hair_style}
Skin tone: ${t.skin_tone}
Expression: ${t.expression}
Vibe: ${t.vibe}
Clothing: ${t.clothing}
Accessories: ${t.accessories.join(", ")}

BACKGROUND PALETTE:
${t.background_palette.join(", ")}

Ensure the output remains consistent with Onkit style.
Keep body pose identical to base CC0 image.
No extreme changes, only adapt traits.
`;
}

export async function POST(req: Request) {
  try {
    const { traits } = await req.json();

    if (!traits)
      return NextResponse.json({ error: "Missing traits" }, { status: 400 });

    const cc0Path = path.join(process.cwd(), "public/creator.png");
    const buf = await fs.readFile(cc0Path);
    const base64 = buf.toString("base64");

    const prompt = buildPrompt(traits);

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-img2img-1.0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: [`data:image/png;base64,${base64}`],
          strength: 0.65, // best balance for “retain base CC0 but follow traits”
          num_inference_steps: 40,
        }),
      }
    );

    const json = await cfRes.json();

    if (!json?.result?.image) {
      return NextResponse.json(
        { error: "Generation failed", raw: json },
        { status: 500 }
      );
    }

    return NextResponse.json({
      output: `data:image/png;base64,${json.result.image}`,
    });

  } catch (err: any) {
    console.error("Avatar Gen Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
