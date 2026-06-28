/**
 * sidebar 折叠状态 —— 持久化到 localStorage 的小 zustand store。
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  /** 已折叠的 Part id 列表 */
  collapsed: string[]
  /** 移动端 sidebar 是否打开 */
  mobileOpen: boolean
  toggleCollapsed: (partId: string) => void
  setMobileOpen: (open: boolean) => void
  isCollapsed: (partId: string) => boolean
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: [],
      mobileOpen: false,
      toggleCollapsed: (partId) =>
        set((s) => ({
          collapsed: s.collapsed.includes(partId)
            ? s.collapsed.filter((id) => id !== partId)
            : [...s.collapsed, partId],
        })),
      setMobileOpen: (open) => set({ mobileOpen: open }),
      isCollapsed: (partId) => get().collapsed.includes(partId),
    }),
    {
      name: "vite-mastery-sidebar",
      /** 移动端开关不持久化 */
      partialize: (state) => ({ collapsed: state.collapsed }),
    }
  )
)
