import { createContext } from "react"
import type { ThemeContextValue } from "../types"

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const THEME_STORAGE_KEY = "orvethiq-theme"

export function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}
