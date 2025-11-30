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
  title: "AI Growth Command Center",
  description:
    "Zero-cost agent that curates trending AI narratives and deploys cross-platform monetization playbooks for rapid audience growth.",
  metadataBase: new URL("https://agentic-666622a5.vercel.app"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "AI Growth Command Center",
    description:
      "Deploy unified AI automation campaigns across LinkedIn, TikTok, YouTube Shorts, Pinterest, Instagram, Facebook, and Google without paid tools.",
    url: "https://agentic-666622a5.vercel.app",
    siteName: "AI Growth Command Center",
    images: [
      {
        url: "/og-cover.svg",
        width: 1200,
        height: 630,
        alt: "AI Growth Command Center dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Growth Command Center",
    description:
      "Map the loudest AI trends and spin up zero-cost multi-platform campaigns in minutes.",
    images: ["/og-cover.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
