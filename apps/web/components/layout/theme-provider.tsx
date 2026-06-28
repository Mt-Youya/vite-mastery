"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { THEME_STORAGE_KEY } from "./theme-constants"
import type { ReactNode } from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return value === "light" || value === "dark" || value === "system" ? value : "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  const syncTheme = useCallback((nextTheme: Theme) => {
    const resolved = resolveTheme(nextTheme)
    setThemeState(nextTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      syncTheme(nextTheme)
    },
    [syncTheme]
  )

  useEffect(() => {
    syncTheme(readStoredTheme())
  }, [syncTheme])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (readStoredTheme() === "system") syncTheme("system")
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [syncTheme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) syncTheme(readStoredTheme())
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [syncTheme])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return value
}
