import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Meta Ads Audit Tool — Demo",
  description: "Meta Ads performance audit tool demo. Flags poor ROAS, ad fatigue, audience overlap, and low-CTR creatives. By Tanvir Tuhin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
