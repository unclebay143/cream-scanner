import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

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
    "cream scanner",
    "AI cream scanner",
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
    url: "https://www.creamscanner.com",
    siteName: "Cream Scanner",
    images: [
      {
        url: "/og-image.png",
        alt: "Cream Scanner AI Results",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
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
        <script
          defer
          data-website-id={process.env.NEXT_PUBLIC_DATA_FAST_WEBSITE_ID}
          data-domain='creamscanner.com'
          src='https://datafa.st/js/script.js'
        ></script>
        <div className={`flex flex-col min-h-screen bg-[#FFA94D]/10`}>
          <Header />
          <Suspense
            fallback={
              <div className='flex justify-center items-center grow h-auto'>
                Loading...
              </div>
            }
          >
            {children}
            <Toaster />
          </Suspense>
          <Footer />
        </div>
      </body>
    </html>
  );
}
