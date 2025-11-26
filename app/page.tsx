"use client";

import { useAccount, useConnect } from "wagmi";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import AvatarGenerator from "./components/AvatarGenerator";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const [pfp, setPfp] = useState("");

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
        min-h-screen 
        flex flex-col items-center 
        px-5 pt-8 pb-10
        text-white
      "
      style={{
        background: "linear-gradient(180deg, #3b4652 0%, #2f373f 100%)",
      }}
    >
      {/* WALLET TOP */}
      <div className="w-full flex justify-center mb-6">
        <div
          className="
            px-5 py-2 
            rounded-full 
            bg-[#44515d] 
            text-white text-sm font-medium 
            border border-[#596672]
            shadow-[0_2px_4px_rgba(0,0,0,0.25)]
          "
        >
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

 <h1 className="font-onkit onkit-seq text-[110px]" data-text="Onkit">
  <span>O</span>
  <span>n</span>
  <span>k</span>
  <span>i</span>
  <span>t</span>
</h1>


      {/* GENERATOR */}
      <AvatarGenerator userPfp={pfp} />

      {/* COST */}
      <div className="mt-6 text-center text-gray-300 text-sm">
        Only mint with{" "}
        <span className="text-[#f6b27a] font-semibold">$jesse</span>
      </div>

      <a
        href="https://basescan.org/token/0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59"
        target="_blank"
        className="text-[#b6c7d3] underline text-xs mt-1"
      >
        $jesse : 0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59
      </a>
    </main>
  );
}
