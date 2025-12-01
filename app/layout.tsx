import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Onkit Avatar",
  description: "AI Blended NFT Generator + Mint",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* PARTICLES MUST BE INSIDE BODY */}
        <div className="onkit-particles">
  {/* Sparkles */}
  {Array.from({ length: 20 }).map((_, i) => (
    <span
      key={`spark-${i}`}
      className="sparkle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${6 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * -20}s`,
      }}
    />
  ))}

  {/* Streaks */}
  {Array.from({ length: 10 }).map((_, i) => (
    <span
      key={`streak-${i}`}
      className="streak"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${5 + Math.random() * 12}s`,
        animationDelay: `${Math.random() * -15}s`,
      }}
    />
  ))}
</div>
        {/* MAIN APP */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
