import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AIProvider } from "@/providers/AIProvider";
import "@atlaskit/css-reset";
import "@atlaskit/tokens/css/atlassian-light.css";
import "@atlaskit/tokens/css/atlassian-dark.css";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
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
  themeColor: "#1D2125",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-color-mode="dark"
      data-theme="dark"
      className={`${jakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <AIProvider>{children}</AIProvider>
      </body>
    </html>
  );
}
