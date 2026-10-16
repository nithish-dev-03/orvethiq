import { useState, type FC, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { message } from "antd"
import { authService } from "../services/authService"

export const ResetPasswordPage: FC = () => {
  const [identity, setIdentity] = useState("")
  const [newPassphrase, setNewPassphrase] = useState("")
  const [confirmPassphrase, setConfirmPassphrase] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLoading(true)

    try {
      const result = await authService.resetPassword({
        identity,
        newPassphrase,
        confirmPassphrase,
      })

      if (result.success) {
        setIsSuccess(true)
        message.success(result.message || "Password reset successfully!")
      } else {
        setErrorMsg(result.message)
      }
    } catch {
      setErrorMsg("Failed to connect to authentication server. Please verify connectivity.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card-container">
      {/* Decorative ambient blurred spots */}
      <div className="auth-card-blur-1" />
      <div className="auth-card-blur-2" />

      <div className="auth-card" style={{ padding: 0 }}>
        {/* Top Geometric Ambient Bar */}
        <div className="auth-ambient-bar" />

        <div style={{ padding: "32px 28px" }}>
          {/* Visual Indicator: Orbital Key Architecture */}
          <div className="auth-card-meta">
            <div className="auth-orbital-box">
              <svg className="auth-orbital-svg" fill="none" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="21"
                  stroke="currentColor"
                  strokeDasharray="2 4"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="16"
                  stroke="currentColor"
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                />
                <circle cx="24" cy="8" fill="currentColor" r="1.5" />
                <circle cx="40" cy="24" fill="currentColor" fillOpacity="0.5" r="1" />
              </svg>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: "var(--primary)", position: "relative", zIndex: 2 }}
              >
                lock_reset
              </span>
            </div>

            <div className="auth-tag" style={{ background: "var(--surface-container-high)" }}>
              <span className="auth-status-dot-tertiary" style={{ width: 6, height: 6 }} />
              <span>AUTH-ROUTER / REV-04</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="auth-title">Reset your passphrase</h1>
          <p className="auth-subtitle">
            Enter your verified account email or corporate identifier to receive an authenticated
            cryptographic recovery sequence.
          </p>

          {/* Error Banner */}
          {errorMsg && (
            <div className="auth-banner-error" role="alert">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Feedback Banner */}
          {isSuccess ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="auth-banner-success">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 22, color: "var(--primary)", marginTop: 2 }}
                >
                  check_circle
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--on-surface)",
                      marginBottom: 4,
                    }}
                  >
                    Password Reset Successfully
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 12.5,
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.5,
                    }}
                  >
                    Your master passphrase has been updated with high-entropy cryptographic hashing. You can now sign in with your new credentials.
                  </p>
                </div>
              </div>

              <Link
                to="/signin"
                className="auth-submit-btn"
                style={{ textDecoration: "none", justifyContent: "center", gap: 8 }}
              >
                <span>Sign in with new password</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </Link>
            </div>
          ) : (
            /* Recovery Form */
            <form onSubmit={handleSubmit} noValidate>
              {/* Registered Identifier */}
              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label htmlFor="recovery-id" className="auth-label">
                    Registered Identifier
                  </label>
                  <span className="auth-label" style={{ color: "var(--outline)", fontSize: 10 }}>
                    Username / EMAIL
                  </span>
                </div>
                <div className="auth-input-wrapper">
                  <div className="auth-input-prefix">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      alternate_email
                    </span>
                  </div>
                  <input
                    id="recovery-id"
                    type="text"
                    className="auth-input"
                    placeholder="operator@orvethiq.internal"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* New Passphrase */}
              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label htmlFor="recovery-new-pass" className="auth-label">
                    New Passphrase
                  </label>
                </div>
                <div className="auth-input-wrapper">
                  <div className="auth-input-prefix">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      key
                    </span>
                  </div>
                  <input
                    id="recovery-new-pass"
                    type={showNewPassword ? "text" : "password"}
                    className="auth-input"
                    style={{ paddingRight: 40 }}
                    placeholder="••••••••••••••••"
                    value={newPassphrase}
                    onChange={(e) => setNewPassphrase(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {showNewPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Passphrase */}
              <div className="auth-form-group">
                <div className="auth-label-row">
                  <label htmlFor="recovery-confirm-pass" className="auth-label">
                    Confirm Passphrase
                  </label>
                </div>
                <div className="auth-input-wrapper">
                  <div className="auth-input-prefix">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      lock
                    </span>
                  </div>
                  <input
                    id="recovery-confirm-pass"
                    type={showConfirmPassword ? "text" : "password"}
                    className="auth-input"
                    style={{ paddingRight: 40 }}
                    placeholder="••••••••••••••••"
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                style={{ marginTop: 8 }}
              >
                <span>{isLoading ? "Generating security token..." : "Update password ↵"}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  lock_reset
                </span>
              </button>
            </form>
          )}

          {/* Navigation Back */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link
              to="/signin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--on-surface-variant)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--on-surface)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--on-surface-variant)")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_back
              </span>
              <span>Return to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
