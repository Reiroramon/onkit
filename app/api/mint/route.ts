import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    return NextResponse.json({ ok: true, message: "Mint endpoint active" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Mint failed" }, { status: 500 });
  }
}
