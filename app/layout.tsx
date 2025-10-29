import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Footer } from "@/components/footer";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cream Scanner | AI Ingredient Analyzer",
  description:
    "Scan skincare creams and analyze ingredients for safety, risks, and recommendations using Gemini AI. Instantly get verdicts, risk metrics, and ingredient breakdowns.",
  generator: "Gemini AI, Next.js, unclebigbay143",
  keywords: [
    "skincare",
    "cream analyzer",
    "ingredient scanner",
    "AI skincare",
    "Gemini AI",
    "toxicity",
    "allergy",
    "safety",
    "recommendations",
    "unclebigbay143",
  ],
  authors: [{ name: "unclebigbay143", url: "https://x.com/unclebigbay143" }],
  openGraph: {
    title: "Cream Scanner | AI Ingredient Analyzer",
    description:
      "Scan skincare creams and analyze ingredients for safety, risks, and recommendations using Gemini AI.",
    url: "https://cream-scanner.app",
    siteName: "Cream Scanner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cream Scanner AI Results",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <div className={`flex flex-col min-h-screen bg-[#FFA94D]/10`}>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
