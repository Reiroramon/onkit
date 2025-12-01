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

    // GET USER PFP
    const blob = await fetch(userPfp).then((r) => r.blob());
    const form = new FormData();
    form.append("pfp", blob, "pfp.png");

    // CALL API
    const res = await fetch("/api/generate", { method: "POST", body: form });
    const data = await res.json();

    // SIMPAN IMAGE DI PAGE.TSX
    if (data.output) setGeneratedImage(data.output);

    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center mt-6 relative">
      {/* FRAME */}
      <div
        style={{ width: 340, height: 340 }}
        className="
          relative rounded-[34px] overflow-hidden
          bg-white/5 backdrop-blur-xl
          border border-[#00bfff44]
          shadow-[0_0_40px_#009dff22]
        "
      >
        {/* INITIAL + LOADING */}
        {!generatedImage && userPfp && (
          <img
            src={userPfp}
            className="absolute w-full h-full object-cover opacity-40 blur-xl"
          />
        )}

        {/* FINAL OUTPUT */}
        {generatedImage && (
          <img
            src={generatedImage}
            className="absolute w-full h-full object-cover"
          />
        )}
      </div>

      {/* GENERATE BUTTON */}
      {!generatedImage && (
        <button
          onClick={generate}
          disabled={loading}
          className="
            mt-5 w-[160px] h-[44px] rounded-full
            font-semibold text-[15px] text-white
            bg-linear-to-r from-[#00d8ff] to-[#0077ff]
            shadow-[0_0_22px_#009dff66]
            transition-all
          "
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      )}

      {/* MINT BUTTON */}
      {generatedImage && (
        <button
          className="
            mt-5 w-[160px] h-[44px] rounded-full
            font-bold text-[15px] text-white tracking-wide
            bg-linear-to-r from-[#00faff] to-[#0094ff]
          "
        >
          Mint
        </button>
      )}
    </div>
  );
}
