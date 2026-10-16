import { type FC } from "react"
import { Outlet, Link } from "react-router-dom"
import { Tooltip } from "antd"
import { useTheme } from "../hooks/useTheme"
import logoImg from "../assets/orvethiq_logo.png"

export const AuthLayout: FC = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="auth-page-wrapper">
      {/* Ambient Blueprint & Glow Background */}
      <div className="auth-ambient-bg" aria-hidden="true">
        <div className="auth-ambient-glow" />
        <div className="auth-ambient-grid" />
      </div>

      {/* Header */}
      <header className="auth-header">
        <Link to="/" className="auth-brand" aria-label="Orvethiq Home">
          <div className="auth-brand-icon-box">
            <img
              src={logoImg}
              alt="Orvethiq Logo"
              style={{ width: 22, height: 22, objectFit: "contain" }}
            />
          </div>
          <span className="auth-brand-title">Orvethiq</span>
        </Link>

        <div className="auth-header-actions">
          {/* Status pill from Stitch */}
          <div className="auth-idp-pill" title="Identity Provider Gateway Connected">
            <span className="auth-idp-dot animate-pulse-subtle" />
            <span>IDP GATEWAY</span>
          </div>

          {/* Theme switcher */}
          <Tooltip title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}>
            <button
              onClick={toggleTheme}
              type="button"
              className="auth-brand-icon-box"
              aria-label="Toggle color theme"
              style={{ cursor: "pointer", border: "1px solid var(--outline-variant-25)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: "var(--on-surface-variant)" }}
              >
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main Form Slot */}
      <main className="auth-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="auth-footer-links">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="auth-status-dot-tertiary" />
            <span className="auth-footer-link" style={{ cursor: "default" }}>
              System Operational
            </span>
          </div>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="auth-footer-link"
          >
            Privacy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="auth-footer-link"
          >
            Terms of Protocol
          </a>
          <span style={{ color: "var(--outline)" }}>SOC2 Type II Certified</span>
        </div>

        <div className="auth-footer-shortcuts">
          <span className="auth-kbd">Tab</span>
          <span>navigate</span>
          <span className="auth-kbd" style={{ marginLeft: 8 }}>
            ↵
          </span>
          <span>submit</span>
        </div>
      </footer>
    </div>
  )
}
