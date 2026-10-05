import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrizeBond Pakistan - Draw Results & Schedule 2026",
  description:
    "Official Prize Bond Draw Results, 2026 Schedules, and Instant Gazette Verification Portal of Pakistan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are Prize Bonds in Pakistan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prize Bonds are capital-guaranteed financial security certificates issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP)."
          }
        },
        {
          "@type": "Question",
          "name": "How can I check a Prize Bond?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can check your Prize Bond by entering your 6-digit serial number on our automated online checker tool."
          }
        }
      ]
    })
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "Video Guide: How to Buy, Hold, & Claim Prize Bonds in Pakistan",
      "description": "Watch our expert guide on purchasing bonds from SBP field offices and filing claims.",
      "thumbnailUrl": "https://prizebond-pakistan.vercel.app/thumbnail.jpg",
      "uploadDate": "2026-08-15T08:00:00+05:00",
      "duration": "PT3M40S"
    })
  }}
/>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}