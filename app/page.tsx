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

      // auto connect
      const fc = connectors.find((c) => c.id === "farcasterMiniApp");
      if (!isConnected && fc) {
        connect({ connector: fc });
      }

      // get PFP
      const context = await sdk.context;
      if (context?.user?.pfpUrl) setPfp(context.user.pfpUrl);
    }
    init();
  }, [isConnected, connect, connectors]);

  return (
    <main className="px-6 py-8 flex flex-col items-center gap-8">

      {/* HEADER */}
      <div className="w-full max-w-xl flex items-center justify-between">
        {pfp && (
          <img
            src={pfp}
            className="w-12 h-12 rounded-full border border-black/20"
          />
        )}

        <div className="wallet-badge text-sm">
          {address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : "Connecting..."}
        </div>
      </div>

      {/* MAIN BOX */}
      <div className="matte-box w-full max-w-xl flex flex-col items-center gap-6">
        <h1 className="text-[#86837c] text-xl font-semibold">Onkit</h1>

        <AvatarGenerator userPfp={pfp} />

        <button
          className="btn-generate w-full flex justify-center items-center gap-3"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating...
              <div className="spinner"></div>
            </>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      <p className="text-[#86837c] text-sm">Only mint with $jesse</p>

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
