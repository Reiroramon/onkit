"use client";

import { useAccount, useConnect } from "wagmi";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import AvatarGenerator from "./components/AvatarGenerator";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const [pfp, setPfp] = useState("");
  const [balance, setBalance] = useState(260); // DEMO: dynamic nanti

  const enoughBalance = balance >= 230;

  useEffect(() => {
    async function init() {
      await sdk.actions.ready?.();
      const fc = connectors.find((c) => c.id === "farcasterMiniApp");
      if (!isConnected && fc) connect({ connector: fc });

      const ctx = await sdk.context;
      if (ctx?.user?.pfpUrl) setPfp(ctx.user.pfpUrl);
    }
    init();
  }, [isConnected, connect, connectors]);

  return (
    <main
      className="
        min-h-screen w-full 
        relative overflow-hidden
        flex flex-col items-center
        px-6 pt-14 pb-20 text-white
        bg-linear-to-b from-[#001f3f] to-[#000000]
      "
    >
      {/* HEX OVERLAY */}
      <div className="hex-overlay absolute inset-0 z-0" />

      {/* WALLET BAR */}
      <div className="relative z-10 mb-8">
        <div
          className="
            px-5 py-2 text-sm font-medium rounded-full
            bg-white/10 backdrop-blur-lg
            border border-white/20
            shadow-[0_4px_12px_rgba(0,0,0,0.45)]
          "
        >
          {address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

      {/* HEADLINE */}
      <h1
        className="
          text-3xl font-bold tracking-tight text-center
          opacity-0 animate-[slideIn_0.7s_ease-out_forwards]
        "
      >
        Mint your Jesse-blended NFT now
      </h1>

      {/* BALANCE */}
      <div className="mt-4 mb-4 text-white/70 text-sm">
        Balance:{" "}
        <span className={enoughBalance ? "pulse-green font-semibold" : "text-red-400 font-semibold"}>
          {balance} $jesse
        </span>
      </div>

      {/* NFT GENERATOR */}
      <AvatarGenerator userPfp={pfp} />

      {/* CONTRACT LINK */}
      <a
        href="https://basescan.org/token/0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59"
        target="_blank"
        className="text-white/50 underline text-xs mt-6 hover:text-white transition"
      >
        Contract: 0x50f8...0d59
      </a>

      {/* slide animation */}
      <style>{`
        @keyframes slideIn {
          0% { opacity:0; transform:translateY(20px); }
          100% { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </main>
  );
}
