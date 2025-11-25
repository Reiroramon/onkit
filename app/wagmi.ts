"use client";

import { createConfig, http } from "@wagmi/core";
import { base } from "viem/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(), // default wagmi transport
  },
  connectors: [
    farcasterMiniApp(), // <-- FIXED: no arguments allowed
  ],
  multiInjectedProviderDiscovery: false,
});
