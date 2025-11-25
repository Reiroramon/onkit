import { NextResponse } from "next/server";
import OpenAI from "openai";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const pfp = form.get("pfp") as File;

    if (!pfp)
      return NextResponse.json({ error: "Missing PFP" }, { status: 400 });

    // Load creator file as Blob
    const creatorPath = path.join(process.cwd(), "public/creator.png");
    const creatorArrayBuffer = await fs.promises.readFile(creatorPath);
    const creatorBlob = new Blob([creatorArrayBuffer], { type: "image/png" });

    // Blank mask (white full mask)
    const maskBlob = new Blob(
      [new Uint8Array([255, 255, 255])],
      { type: "image/png" }
    );

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });

    const prompt = `
Blend the user's PFP with the creator avatar.
Keep hoodie, headset, cigarette, pose, silhouette.
Apply PFP traits: color tone, hair, face accent.
Match creator art style exactly.
`;

    // EDIT ENDPOINT — compatible with Uploadable |= Blob
    const result = await client.images.edit({
      model: "gpt-image-1",
      prompt,
      image: creatorBlob,
      mask: maskBlob,
      size: "1024x1024"
    });

    return NextResponse.json({
      output: result.data?.[0]?.url ?? null
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
