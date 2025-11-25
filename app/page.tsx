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
    <main className="min-h-screen bg-[#f5f6f7] flex flex-col items-center px-5 py-6">

      {/* WALLET CENTER */}
      <div className="w-full flex justify-center mb-6">
        <div className="px-4 py-2 rounded-full bg-[#e6a93e] text-white text-sm font-semibold shadow">
          {address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

      {/* GENERATOR */}
      <div className="w-full max-w-md">
        <AvatarGenerator userPfp={pfp} />
      </div>

      {/* FOOTER */}
      <p className="text-sm text-[#7d7d7d] mt-4">Only mint with $jesse</p>

      <a
        href="https://basescan.org/token/0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59"
        target="_blank"
        className="text-sm text-[#7d7d7d] underline mt-1"
      >
        $jesse : 0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59
      </a>

    </main>
  );
}
