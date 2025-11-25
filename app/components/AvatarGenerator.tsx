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

    const form = new FormData();
    const blob = await fetch(userPfp).then((r) => r.blob());
    form.append("pfp", blob, "pfp.png");

    const res = await fetch("/api/generate", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setImage(data.output);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <button onClick={generate} className="btn-primary">
        {loading ? "Generating..." : "Generate Avatar"}
      </button>

      {image && (
        <>
          <div className="generated-image">
            <img src={image} className="rounded-xl" />
          </div>

          <button className="btn-mint">Mint 230 $JESSE</button>
        </>
      )}
    </div>
  );
}
