import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const pfp = form.get("pfp") as File;

    if (!pfp) {
      return NextResponse.json({ error: "Missing PFP" }, { status: 400 });
    }

    const buffer = Buffer.from(await pfp.arrayBuffer());
    const base64 = buffer.toString("base64");

    // 🚀 FIX: gunakan model Cloudflare vision yang benar
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-vision-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "input_image",
                  image: base64,
                },
                {
                  type: "text",
                  text: `
Analyze this avatar and return ONLY raw JSON:

{
 "hair_color": "",
 "hair_style": "",
 "skin_tone": "",
 "expression": "",
 "vibe": "",
 "clothing": "",
 "accessories": [],
 "background_palette": []
}

Do not explain. JSON only.
                  `
                }
              ]
            }
          ]
        }),
      }
    );

    const json = await cfRes.json();
    console.log("CF RAW:", json);

    const text =
      json?.result?.response ||
      json?.result?.output_text ||
      json?.result?.message;

    if (!text) {
      return NextResponse.json(
        { error: "No text output", raw: json },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse JSON", text },
        { status: 500 }
      );
    }

    return NextResponse.json({ traits: parsed });

  } catch (err: any) {
    console.error("Trait Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
