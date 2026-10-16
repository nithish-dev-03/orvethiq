import { useState, type FC, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { message } from "antd"
import { authService } from "../services/authService"

export const SignInPage: FC = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [trustSession, setTrustSession] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Validation indicator
  const isValidIdentifier = identifier.trim().length >= 3

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLoading(true)

    try {
      const result = await authService.signIn({
        identifier,
        password,
        trustSession,
      })

      if (result.success) {
        message.success(result.message || "Signed in successfully!")
        setTimeout(() => {
          navigate("/")
        }, 600)
      } else {
        setErrorMsg(result.message)
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card-container">
      {/* Decorative ambient blurred spots */}
      <div className="auth-card-blur-1" />
      <div className="auth-card-blur-2" />

      <div className="auth-card">
        {/* Card Header Meta */}
        <div className="auth-card-meta">
          <div className="auth-tag">
            <span className="auth-tag-dot animate-pulse-subtle" />
            <span>AUTH // login</span>
          </div>

          <div className="auth-meta-hint">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, color: "var(--outline)" }}
            >
              lock
            </span>
            <span>FIDO2 READY</span>
          </div>
        </div>

        {/* Header Text */}
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Enter your credentials or authenticate via enterprise identity provider.
        </p>

        {/* Error Banner */}
        {errorMsg && (
          <div className="auth-banner-error" role="alert">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Identity Field */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="signin-identity" className="auth-label">
                Work Email or Handle
              </label>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="signin-identity"
                type="text"
                className="auth-input"
                placeholder="operator@orvethiq.internal"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
              {isValidIdentifier && (
                <div className="auth-input-badge">
                  <span className="auth-input-badge-dot" />
                  <span>VALID</span>
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="signin-password" className="auth-label">
                Master Password
              </label>
              <Link
                to="/reset-password"
                className="auth-label"
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Forgot?
              </Link>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                style={{ paddingRight: 40 }}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Trust Session Checkbox */}
          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              className="auth-checkbox-input"
              checked={trustSession}
              onChange={(e) => setTrustSession(e.target.checked)}
            />
            <span className="auth-checkbox-label">
              Keep active for 30 days{" "}
              <span style={{ color: "var(--outline)", fontFamily: "var(--mono)", fontSize: 11 }}>
                (FIDO2 Trusted Environment)
              </span>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? "Authenticating..." : "Sign in to workspace"}</span>
            <div className="auth-btn-shortcut">
              <span>Enter</span>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                keyboard_return
              </span>
            </div>
          </button>
        </form>

        {/* Footer Actions */}
        <div className="auth-card-links">
          <div className="auth-card-link-text">
            <span>Need organization access? </span>
            <Link to="/create-account" className="auth-link-highlight">
              Create account
            </Link>
          </div>

          <div className="auth-security-notice">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, color: "var(--tertiary)" }}
            >
              shield
            </span>
            <span>Zero-knowledge workspace protocol • End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
