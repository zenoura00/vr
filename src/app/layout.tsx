import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "VR Factory Tour - Felicity Solar",
  description: "Experience Felicity Solar's state-of-the-art manufacturing facility in immersive 360° virtual reality. Explore our solar panel production lines, quality control, and innovation labs.",
  keywords: "Felicity Solar, VR Tour, Factory Tour, Solar Panels, Manufacturing, Virtual Reality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased" suppressHydrationWarning>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
