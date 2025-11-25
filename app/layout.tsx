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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
