"use client";

import { useAccount, useConnect } from "wagmi";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import AvatarGenerator from "./components/AvatarGenerator";
import GenerateAnimation from "./components/GenerateAnimation";
import { erc20Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

const JESSE_TOKEN = "0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  const [pfp, setPfp] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  const { data: jesseBalanceRaw } = useReadContract({
    address: JESSE_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const jesseBalance = jesseBalanceRaw
    ? Number(formatUnits(jesseBalanceRaw, 18)).toFixed(2)
    : "0.00";

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
      {/* BACKGROUND HEX GRID */}
      <div className="hex-overlay absolute inset-0 z-0" />

      {/* WALLET */}
      {address && (
        <div className="relative flex justify-center mt-1 z-10">
          <div className="onkit-wallet">
            {address.slice(0, 6)}…{address.slice(-4)}

            {/* PARTICLES */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* LOGO */}
      <h1 className="font-onkit onkit-seq text-[72px] md:text-[90px]">
        <span>O</span>
        <span>n</span>
        <span>k</span>
        <span>i</span>
        <span>t</span>
      </h1>

      {/* GENERATOR FRAME */}
      <div className="relative">
        <AvatarGenerator
          userPfp={pfp}
          loading={loading}
          setLoading={setLoading}
          generatedImage={generatedImage}
          setGeneratedImage={setGeneratedImage}
        />

        {/* LOADING ANIMATION */}
        {loading && (
          <div className="absolute inset-0 z-9999 flex items-center justify-center pointer-events-none">
            <GenerateAnimation />
          </div>
        )}
      </div>

      {/* BALANCE */}
      <p className="text-[#71C7FF] font-semibold text-sm mt-4 drop-shadow-[0_0_6px_#0094ff]">
        Balance: {jesseBalance} $jesse
      </p>

      {/* BUY LINK */}
      <a
        href="https://zora.co/@jessepollak"
        target="_blank"
        className="text-[#6eeeff] underline text-sm mt-3 hover:brightness-150 transition flex items-center gap-2"
      >
        Buy $jesse →
      </a>

      {/* COIN */}
      <img src="/icons/jesse-coin.png" className="holo-coin" />
    </main>
  );
}
