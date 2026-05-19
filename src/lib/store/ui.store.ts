import { create } from "zustand";

interface UIState {
  commandPaletteOpen: boolean;
  aiAssistantOpen: boolean;
  sidebarCollapsed: boolean;
  focusMode: boolean;
  notificationCount: number;
  activePage: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  toasts: Toast[];

  // Actions
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  toggleSidebar: () => void;
  toggleFocusMode: () => void;
  setActivePage: (page: string) => void;
  setBreadcrumbs: (crumbs: Array<{ label: string; href: string }>) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info" | "ai";
  title: string;
  description?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
  commandPaletteOpen: false,
  aiAssistantOpen: false,
  sidebarCollapsed: false,
  focusMode: false,
  notificationCount: 3,
  activePage: "dashboard",
  breadcrumbs: [],
  toasts: [],

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  openAIAssistant: () => set({ aiAssistantOpen: true }),
  closeAIAssistant: () => set({ aiAssistantOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  setActivePage: (page) => set({ activePage: page }),
  setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),

  addToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ].slice(-5),
    })),

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
