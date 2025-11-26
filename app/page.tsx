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
        px-5 pt-10 pb-12
      "
      style={{
        background: "#56616E", // flat matte sesuai karakter
      }}
    >

      {/* WALLET TAG – Cartoon style */}
      <div className="w-full flex justify-center mb-6">
        <div
          className="
            bg-[#EFB548]
            text-black font-bold
            px-5 py-2
            rounded-full
            border-4 border-black
            shadow-[4px_4px_0_#000]
            text-sm
          "
        >
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connecting…"}
        </div>
      </div>

      {/* TITLE */}
      <h1 className="font-onkit onkit-seq text-[110px]" data-text="Onkit">
        <span>O</span>
        <span>n</span>
        <span>k</span>
        <span>i</span>
        <span>t</span>
      </h1>

      {/* GENERATOR (cartoon card) */}
      <AvatarGenerator userPfp={pfp} />

      {/* COST INFO */}
      <div className="mt-6 text-black text-sm font-bold">
        Only mint with{" "}
        <span className="text-[#D46A42] font-extrabold">$jesse</span>
      </div>

      {/* TOKEN ADDRESS LINK */}
      <a
        href="https://basescan.org/token/0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59"
        target="_blank"
        className="
          text-black mt-1 text-xs font-bold
          underline 
        "
      >
        Contract: 0x50f8...0d59
      </a>

    </main>
  );
}
