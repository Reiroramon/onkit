"use client";

import { useAccount, useConnect } from "wagmi";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import AvatarGenerator from "./components/AvatarGenerator";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const [pfp, setPfp] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function init() {
      await sdk.actions.ready?.();

      const fc = connectors.find((c) => c.id === "farcasterMiniApp");
      if (!isConnected && fc) connect({ connector: fc });

      const context = await sdk.context;
      if (context?.user?.pfpUrl) setPfp(context.user.pfpUrl);
    }

    init();
  }, [isConnected, connect, connectors]);

  return (
    <main className="flex flex-col items-center gap-6 px-6 py-8">

      {/* HEADER */}
      <div className="w-full max-w-lg flex items-center justify-between">
        
        {/* User PFP */}
        {pfp && (
          <img
            src={pfp}
            className="w-12 h-12 rounded-full shadow-md border border-black/10"
          />
        )}

        {/* Wallet Badge */}
        <div
          className="px-4 py-2 rounded-xl bg-[#e6a93e] text-[#332f27] text-sm font-semibold shadow-[0_0_12px_rgba(230,169,62,0.35)]"
        >
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-lg rounded-2xl p-6 shadow-xl"
           style={{
             background: "linear-gradient(165deg, #7d7a73 0%, #6f6c65 100%)",
             boxShadow:
               "0 6px 18px rgba(0,0,0,0.32), inset 0 1px 1px rgba(255,255,255,0.06)"
           }}
      >
        <h1 className="text-[#86837c] text-xl font-semibold text-center tracking-wide mb-4">
          Onkit
        </h1>

        <div className="flex justify-center mb-4">
          <AvatarGenerator userPfp={pfp} />
        </div>

        {/* Generate Button */}
        <button
          className="w-full py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-3
                     shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.2)]
                     transition-all"
          style={{
            background: "linear-gradient(180deg, #cc6545 0%, #b95339 100%)"
          }}
          onClick={() => setIsGenerating(true)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating…
              <div className="spinner border-white"></div>
            </>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {/* Bottom Text */}
      <p className="text-[#86837c] text-sm mt-2">Only mint with $jesse</p>

      {/* Contract */}
      <a
        href="https://basescan.org/token/0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59"
        target="_blank"
        className="text-[#86837c] underline underline-offset-2 text-sm"
      >
        $jesse : 0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59
      </a>

    </main>
  );
}
