"use client";

import { useEffect } from "react";
import {
  PageLayout,
  TopNavigation,
  LeftSidebarWithoutResize,
  Content,
  Main,
} from "@atlaskit/page-layout";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ToastRenderer } from "@/components/ui/ToastRenderer";
import { useUIStore } from "@/lib/store/ui.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleCommandPalette } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "f") {
        e.preventDefault();
        useUIStore.getState().toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandPalette]);

  return (
    <PageLayout>
      <TopNavigation isFixed>
        <TopBar />
      </TopNavigation>

      <Content>
        <LeftSidebarWithoutResize width={240}>
          <Sidebar />
        </LeftSidebarWithoutResize>

        <Main>
          <div className="page-enter">{children}</div>
        </Main>
      </Content>

      <CommandPalette />
      <ToastRenderer />
    </PageLayout>
  );
}
