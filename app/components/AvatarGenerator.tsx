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
    const blob = await fetch(userPfp).then((r) => r.blob());

    const form = new FormData();
    form.append("pfp", blob, "pfp.png");

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    setImage(data.output);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center mt-4">

      {/* FRAME */}
      <div
        className="
          relative
          rounded-[24px]
          overflow-hidden
          bg-[#3b4652]
          border border-[#505c68]
          shadow-[0_4px_10px_rgba(0,0,0,0.35)]
          flex items-center justify-center
        "
        style={{ width: "340px", height: "340px" }}
      >

        {/* BEFORE GENERATE */}
        {!image && userPfp && (
          <>
            {/* BLUR PFP — cartoon muted */}
            <img
              src={userPfp}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(22px)",
                opacity: 0.55,
                transform: "scale(1.22)",
              }}
              className="absolute inset-0 z-0"
            />

            {/* BUTTON — cartoon orange */}
            <button
              onClick={generate}
              disabled={loading}
              className="
                absolute bottom-6 left-1/2 -translate-x-1/2
                px-7 py-3
                font-semibold
                rounded-xl
                text-base
                text-white
                bg-[#e68a57]
                hover:bg-[#d66a3d]
                active:scale-95
                shadow-[0_3px_6px_rgba(0,0,0,0.35)]
                transition-all
                z-20
              "
            >
              {loading ? "Generating..." : "Generate Onkit"}
            </button>
          </>
        )}

        {/* AFTER GENERATE */}
        {image && (
          <img
            src={image}
            className="w-full h-full object-cover rounded-[24px] z-10"
          />
        )}
      </div>

      {/* COST TEXT */}
      <p className="text-gray-300 text-sm mt-3">Cost: 230 $jesse</p>

      {/* SHARE BUTTON */}
      {image && (
        <button
          className="
            mt-4 px-5 py-3 text-sm rounded-xl font-medium
            bg-[#d9dde0] text-[#2d3440]
            shadow hover:bg-white
            active:scale-95 transition
          "
        >
          Share to Farcaster 🚀
        </button>
      )}
    </div>
  );
}
