import { RouterProvider } from "react-router-dom"
import { ConfigProvider, theme as antdTheme } from "antd"
import { router } from "./routes"
import { ThemeProvider } from "./theme/ThemeProvider"
import { useTheme } from "./hooks/useTheme"

function AppContent() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#a5b4fc" : "#5969c9",
          colorBgBase: isDark ? "#111318" : "#f7f8fa",
          colorBgContainer: isDark ? "#1e2025" : "#ffffff",
          colorTextBase: isDark ? "#e2e2e9" : "#191b22",
          colorBorder: isDark ? "rgba(69, 70, 80, 0.35)" : "rgba(133, 139, 151, 0.35)",
          borderRadius: 8,
          fontFamily: "var(--sans)",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App