import type { FC } from "react"
import { Link } from "react-router-dom"

export const PageNotFound: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        textAlign: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "var(--surface-container-low)",
          border: "1px solid var(--outline-variant-30)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-container)",
          marginBottom: 20,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
          explore_off
        </span>
      </div>

      <h1
        className="font-display-lg"
        style={{
          fontSize: 48,
          color: "var(--on-surface)",
          margin: "0 0 10px 0",
          fontWeight: 600,
        }}
      >
        404
      </h1>
      <h2
        className="font-headline-sm"
        style={{ color: "var(--on-surface)", margin: "0 0 10px 0" }}
      >
        Page Not Found
      </h2>
      <p
        className="font-body-md"
        style={{
          color: "var(--on-surface-variant)",
          maxWidth: 380,
          margin: "0 0 28px 0",
        }}
      >
        The requested path does not exist in the Orvethiq workspace.
      </p>

      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 18px",
          borderRadius: 8,
          background: "var(--surface-container)",
          border: "1px solid var(--outline-variant-35)",
          color: "var(--on-surface)",
          textDecoration: "none",
          fontWeight: 500,
          fontSize: 13,
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-container-high)"
          e.currentTarget.style.borderColor = "var(--primary-container)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-container)"
          e.currentTarget.style.borderColor = "var(--outline-variant-35)"
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          arrow_back
        </span>
        <span>Return to Workspace</span>
      </Link>
    </div>
  )
}