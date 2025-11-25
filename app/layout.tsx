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
    <main className="flex flex-col items-center gap-5 pb-12 px-5">

      {/* HEADER */}
      <div className="w-full max-w-lg flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          {pfp && (
            <img
              src={pfp}
              className="w-12 h-12 rounded-full shadow-md border border-black/20"
            />
          )}
        </div>

        <div
          className="px-4 py-2 rounded-xl bg-[#e6a93e] text-[#3b352c] text-sm font-semibold shadow-[0_0_12px_rgba(230,169,62,0.35)]"
        >
          {address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-white tracking-wide mt-3">
        ONKIT AVATAR
      </h1>
      <p className="text-sm text-[#c8c9c9] tracking-widest mb-2">
        AI BLENDED GENERATION
      </p>

      {/* MAIN CARD */}
      <div
        className="w-full max-w-lg rounded-3xl p-6 shadow-xl mt-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(55,60,64,0.6) 0%, rgba(38,43,46,0.8) 100%)",
          boxShadow:
            "0 6px 18px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.06)"
        }}
      >
        {/* Avatar Preview */}
        <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5">
          <AvatarGenerator userPfp={pfp} />
        </div>

        {/* LABEL */}
        <div className="flex justify-between text-[#d8d8d8] text-sm mb-2">
          <span>MINT PROGRESS</span>
          <span>1,441 / 10,000</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#3b3f43] overflow-hidden">
          <div
            className="h-full bg-[#cc6545]"
            style={{ width: "14.41%" }}
          ></div>
        </div>

        <div className="flex justify-between text-[#868b8e] text-xs mt-2">
          <span>14.4% MINTED</span>
          <span>8,559 LEFT</span>
        </div>

        {/* GENERATE or MINT BUTTON */}
        <button
          className="w-full mt-6 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 text-lg
                     shadow-[inset_0_2px_3px_rgba(255,255,255,0.09),0_4px_12px_rgba(0,0,0,0.3)]
                     transition-all"
          style={{
            background:
              "linear-gradient(180deg, #cc6545 0%, #b95339 100%)"
          }}
          onClick={() => setIsGenerating(true)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating...
              <div className="spinner border-white"></div>
            </>
          ) : (
            <>
              ⚡ MINT NOW
            </>
          )}
        </button>
      </div>

      {/* BOTTOM */}
      <p className="text-[#86837c] text-sm mt-3">Only mint with $jesse</p>

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
