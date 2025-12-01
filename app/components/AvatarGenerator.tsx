"use client";

import { useState } from "react";

interface AvatarGeneratorProps {
  userPfp: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AvatarGenerator({ userPfp }: AvatarGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  async function generate() {
    if (!userPfp) return;

    setLoading(true);
    setShowConfetti(false);

    const blob = await fetch(userPfp).then((r) => r.blob());
    const form = new FormData();
    form.append("pfp", blob, "pfp.png");

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    setTimeout(() => {
      setImage(data.output);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }, 1300);

    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center mt-6 relative">

      {/* CONFETTI */}
      {showConfetti && (
        <>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="confetti-dot"
              style={{
                left: `${20 + Math.random() * 60}%`,
                background: ["#00aaff", "#74a7ff", "#29f3c3"][i % 3],
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </>
      )}

      {/* ----------------------- CARD ----------------------- */}
     <div
  style={{ width: 340, height: 340 }}
  className="
    relative rounded-[34px] overflow-hidden
    bg-white/5 backdrop-blur-xl
    border border-[#00bfff44]
    shadow-[0_0_40px_#009dff22]
    select-none
  "
>
        {/* BEFORE GENERATE */}
        {!image && userPfp && (
          <>
            <img
              src={userPfp}
              className="absolute w-full h-full object-cover opacity-40"
              style={{
                transform: "scale(1.18)",
                filter: "blur(14px) saturate(80%) brightness(0.8)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          </>
        )}

        {/* AFTER GENERATE */}
        {image && (
          <img
            src={image}
            className="absolute w-full h-full object-cover"
            style={{
              pointerEvents: "none",
              userSelect: "none",
              touchAction: "none",
            }}
          />
        )}
      </div>

      {/* -------- BUTTON BELOW FRAME (FIXED) -------- */}
     {/* BEFORE GENERATE */}
{!image && userPfp && (
  <button
    onClick={generate}
    disabled={loading}
    className="
      mt-5 w-[160px] h-[44px] rounded-full
      font-semibold text-[15px] text-white
      bg-linear-to-r from-[#00d8ff] to-[#0077ff]
      shadow-[0_0_22px_#009dff66]
      hover:brightness-110 active:scale-95 transition-all
    "
  >
    {loading ? "Generating…" : "Generate"}
  </button>
)}

{/* AFTER GENERATE */}
{image && (
  <button
    className="
      mt-5 w-[160px] h-[44px] rounded-full
      font-bold text-[15px] text-white tracking-wide
      bg-linear-to-r from-[#00faff] to-[#0094ff]
      shadow-[0_0_28px_#00e0ffaa]
      hover:brightness-125 active:scale-95 transition-all
    "
  >
    Mint
  </button>
)}

      {/* SHARE BUTTON */}
      {image && (
        <button
          className="
            mt-5 px-5 py-2.5 text-sm font-semibold
            rounded-full
            bg-linear-to-r from-[#74A7FF] to-[#3C6DFF]
            text-white shadow-[0_4px_14px_rgba(0,0,0,0.45)]
            hover:scale-105 active:scale-95
            transition-all
          "
        >
          Share to Farcaster
        </button>
      )}
    </div>
  );
}