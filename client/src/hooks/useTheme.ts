import { useContext } from "react"
import { ThemeContext, getInitialTheme } from "../theme/ThemeContext"
import type { ThemeContextValue } from "../types"

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    const initial = getInitialTheme()
    return {
      theme: initial,
      toggleTheme: () => {},
    }
  }
  return context
}
