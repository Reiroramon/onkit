"use client";

interface AvatarGeneratorProps {
  userPfp: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  generatedImage: string;
  setGeneratedImage: (v: string) => void;
}

export default function AvatarGenerator({
  userPfp,
  loading,
  setLoading,
  generatedImage,
  setGeneratedImage,
}: AvatarGeneratorProps) {

  async function generate() {
    if (!userPfp) return;

    setLoading(true);
    setGeneratedImage("");

    try {
      // Convert PFP
      const blob = await fetch(userPfp).then(r => r.blob());
      const form = new FormData();
      form.append("pfp", blob, "pfp.png");

      // STEP 1 — Extract traits
      const traitsRes = await fetch("/api/extract_traits", {
        method: "POST",
        body: form,
      });

      const traitsJson = await traitsRes.json();

      if (!traitsJson.traits) {
        alert("Trait extraction failed");
        setLoading(false);
        return;
      }

      console.log("Traits:", traitsJson.traits);

      // STEP 2 — Generate avatar
      const genRes = await fetch("/api/generate_avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traits: traitsJson.traits }),
      });

      const genJson = await genRes.json();

      if (!genJson.output) {
        alert("Avatar generation failed");
        setLoading(false);
        return;
      }

      setGeneratedImage(genJson.output);
    } catch (err) {
      alert("Unexpected error generating avatar.");
    }

    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center mt-6 relative">

      <div
        style={{ width: 340, height: 340 }}
        className="relative rounded-[34px] overflow-hidden bg-white/5 backdrop-blur-xl border border-[#00bfff44]"
      >
        {!generatedImage && userPfp && (
          <img src={userPfp} className="absolute w-full h-full object-cover opacity-40 blur-xl" />
        )}

        {generatedImage && (
          <img src={generatedImage} className="absolute w-full h-full object-cover" />
        )}
      </div>

      {!generatedImage && (
        <button
          disabled={loading}
          onClick={generate}
          className="mt-5 w-[160px] h-[44px] rounded-full bg-linear-to-r from-[#00d8ff] to-[#0077ff]"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      )}

      {generatedImage && (
        <button className="mt-5 w-[160px] h-[44px] rounded-full bg-linear-to-r from-[#00faff] to-[#0094ff]">
          Mint
        </button>
      )}
    </div>
  );
}
