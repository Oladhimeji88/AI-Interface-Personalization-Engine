"use client";

import { useEffect } from "react";
import { setGlobalTheme } from "@atlaskit/tokens";

export function AtlaskitThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setGlobalTheme({
      colorMode: "dark",
      dark: "dark",
      light: "light",
      spacing: "spacing",
      typography: "typography",
    });
  }, []);

  return <>{children}</>;
}
