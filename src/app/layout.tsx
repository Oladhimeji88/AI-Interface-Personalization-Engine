import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import { AIProvider } from "@/providers/AIProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AIPE — AI Interface Personalization Engine",
    template: "%s | AIPE",
  },
  description:
    "An AI-native operating layer that dynamically reconstructs any digital interface based on your behavior, preferences, and emotional state.",
  keywords: [
    "AI",
    "interface personalization",
    "adaptive UI",
    "machine learning",
    "UX automation",
  ],
  authors: [{ name: "AIPE" }],
  creator: "AIPE",
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} dark`}
    >
      <body className="antialiased">
        <AIProvider>{children}</AIProvider>
      </body>
    </html>
  );
}
