"use client";

import { useState } from "react";

interface AvatarGeneratorProps {
  userPfp: string;
}

export default function AvatarGenerator({ userPfp }: AvatarGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  async function generate() {
    if (!userPfp) return;

    setLoading(true);
    const blob = await fetch(userPfp).then((r) => r.blob());

    const form = new FormData();
    form.append("pfp", blob, "pfp.png");

    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    setImage(data.output);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center">

      {/* BLUR PFP 400×400 */}
      {!image && (
        <div
          className="relative mt-10" // <-- membuat jarak dari wallet (TIDAK MEPET)
          style={{
            width: "400px",
            height: "400px",
          }}
        >
          <img
            src={userPfp}
            className="w-full h-full object-cover blur-xl opacity-70 rounded-2xl"
          />

          {/* Generate Button CENTERED */}
          <button
            onClick={generate}
            disabled={loading}
            className="
              absolute top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2
              px-6 py-3 rounded-xl bg-[#cc6545] text-white 
              text-lg font-semibold shadow-md
              hover:opacity-90 disabled:opacity-50
            "
          >
            {loading ? "Generating..." : "Generate Onkit"}
          </button>
        </div>
      )}

      {/* RESULT */}
      {image && (
        <img
          src={image}
          className="w-full max-w-md rounded-2xl shadow-lg mt-6"
        />
      )}
    </div>
  );
}
