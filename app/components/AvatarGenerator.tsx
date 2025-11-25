"use client";

import { useState } from "react";

interface AvatarGeneratorProps {
  userPfp: string;
}

export default function AvatarGenerator({ userPfp }: AvatarGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  async function generate() {
    if (!userPfp) return;

    setLoading(true);

    const form = new FormData();
    const blob = await fetch(userPfp).then((r) => r.blob());
    form.append("pfp", blob, "pfp.png");

    const res = await fetch("/api/generate", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setImage(data.output);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center">

      {/* INITIAL BLURRED PFP (300x300, centered) */}
      {!image && userPfp && (
        <div className="relative w-[300px] h-[300px] mb-6 rounded-2xl overflow-hidden">
          <img
            src={userPfp}
            className="w-full h-full object-cover blur-xl scale-110 opacity-70"
          />

          {/* BUTTON IN CENTER OF BLUR */}
          <button
            onClick={generate}
            disabled={loading}
            className="absolute inset-0 flex items-center justify-center
                       bg-black/30 text-white font-semibold text-lg rounded-2xl
                       hover:bg-black/40 transition"
          >
            {loading ? "Generating..." : "Generate Onkit"}
          </button>
        </div>
      )}

      {/* OUTPUT IMAGE */}
      {image && (
        <img
          src={image}
          className="w-full rounded-2xl shadow-lg"
        />
      )}
    </div>
  );
}
