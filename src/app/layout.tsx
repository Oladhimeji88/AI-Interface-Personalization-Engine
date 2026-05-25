import type { Metadata, Viewport } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import { AIProvider } from "@/providers/AIProvider";
import "./globals.css";

// Inter — the gold standard for professional tech UIs
// Used by Figma, Linear, Vercel, Stripe, GitHub, Notion
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Syne — display-only for hero headings
const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

// JetBrains Mono — code, metrics, labels, chart axes
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Omega — AI Interface Personalization Engine",
    template: "%s | Omega",
  },
  description:
    "Omega is an AI-native operating layer that dynamically reconstructs your interface based on behaviour, cognitive state, and emotional context.",
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
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="antialiased">
        <AIProvider>{children}</AIProvider>
      </body>
    </html>
  );
}
