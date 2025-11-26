"use client";

import { useState } from "react";

interface AvatarGeneratorProps {
  userPfp: string;
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

      {/* CARD */}
      <div
        className="
          relative rounded-2xl overflow-hidden
          border border-white/10
          bg-white/5 backdrop-blur-xl
          shadow-[0_20px_40px_rgba(0,0,0,0.45)]
          hover:shadow-[0_0_25px_#00aaff55]
          transition-all
        "
        style={{ width: "330px", height: "330px" }}
      >
        {/* PREVIEW BEFORE GENERATE */}
        {!image && userPfp && (
          <>
            <img
              src={userPfp}
              className={`absolute w-full h-full object-cover opacity-40 ${
                loading ? "rotate-slow" : ""
              }`}
              style={{
                filter: "blur(14px) saturate(80%) brightness(0.8)",
                transform: "scale(1.18)",
              }}
            />

            <button
              onClick={generate}
              disabled={loading}
              className="
                absolute bottom-6 left-1/2 -translate-x-1/2
                px-7 py-2.5 text-sm font-semibold rounded-full
                bg-linear-to-r from-[#00aaff] to-[#0088ff]
                hover:brightness-110 active:scale-95
                shadow-[0_4px_14px_rgba(0,0,0,0.5)]
                transition-all
              "
            >
              {loading ? "Blending…" : "Mint with $jesse →"}
            </button>
          </>
        )}

        {/* AFTER GENERATE */}
        {image && (
          <img
            src={image}
            className="
              w-full h-full object-cover
              rounded-2xl
              shadow-[0_0_35px_#00aaff33]
            "
          />
        )}
      </div>

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
