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
    <div className="w-full flex flex-col items-center mt-6">

      {/* CARTOON FRAME */}
      <div
        className="
          relative
          bg-[#60707E]
          border-[5px] border-black
          rounded-[28px]
          shadow-[10px_10px_0_#000]
          flex items-center justify-center
        "
        style={{ width: "330px", height: "330px" }}
      >

        {/* BEFORE GENERATE */}
        {!image && userPfp && (
          <>
            <img
              src={userPfp}
              className="
                absolute inset-0 z-0 rounded-[28px]
              "
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.4,
                transform: "scale(1.05)",
                filter: "grayscale(40%) contrast(80%)",
              }}
            />

            <button
              onClick={generate}
              disabled={loading}
              className="
                absolute bottom-6 left-1/2 -translate-x-1/2
                bg-[#D46A42]
                text-black font-bold
                px-6 py-2
                rounded-xl
                border-4 border-black
                shadow-[4px_4px_0_#000]
                active:shadow-[2px_2px_0_#000]
                active:translate-x-[2px]
                active:translate-y-[2px]
                transition-all
                text-sm
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
            className="
              w-full h-full object-cover
              rounded-[28px]
              border-[5px] border-black
            "
          />
        )}
      </div>

      {/* COST TEXT */}
      <p className="text-black font-bold mt-4 text-sm">
        Cost: <span className="text-[#D46A42]">$jesse</span>
      </p>

      {/* SHARE BUTTON */}
      {image && (
        <button
          className="
            mt-4
            bg-[#EFB548]
            text-black font-bold
            px-5 py-2
            rounded-xl
            border-4 border-black
            shadow-[4px_4px_0_#000]
            active:shadow-[2px_2px_0_#000]
            active:translate-x-[2px]
            active:translate-y-[2px]
            transition-all
            text-sm
          "
        >
          Share to Farcaster
        </button>
      )}
    </div>
  );
}
