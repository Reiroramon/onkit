"use client";

export default function GenerateAnimation() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">

      {/* Glow kiri (biru) */}
      <div className="absolute w-40 h-40 rounded-full bg-blue-500/40 blur-3xl animate-[left-glow_1.3s_ease-out]" />

      {/* Glow kanan (cyan) */}
      <div className="absolute w-40 h-40 rounded-full bg-cyan-400/40 blur-3xl animate-[right-glow_1.3s_ease-out]" />

      {/* Flash center */}
      <div className="absolute w-20 h-20 rounded-full bg-cyan-300/80 blur-xl animate-[center-flash_1.3s_ease-out]" />

      {/* Swirl outline */}
      <div className="absolute w-32 h-32 border-2 border-cyan-400/60 rounded-full animate-[swirl_1.4s_ease-out]" />
    </div>
  );
}
