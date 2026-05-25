import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import { AIProvider } from "@/providers/AIProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AIPE — AI Interface Personalization Engine",
    template: "%s | AIPE",
  },
  description:
    "An AI-native operating layer that dynamically reconstructs any digital interface based on your behavior, preferences, and emotional state.",
  keywords: ["AI", "interface personalization", "adaptive UI", "machine learning", "UX automation"],
  authors: [{ name: "AIPE" }],
  creator: "AIPE",
};

export const viewport: Viewport = {
  themeColor: "#080913",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="antialiased">
        <AIProvider>{children}</AIProvider>
      </body>
    </html>
  );
}
