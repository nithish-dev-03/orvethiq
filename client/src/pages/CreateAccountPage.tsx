import { useState, useMemo, type FC, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { message } from "antd"
import { authService } from "../services/authService"

export const CreateAccountPage: FC = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [passphrase, setPassphrase] = useState("archival-prism-99x!")
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Calculate entropy and strength
  const { entropyBits, strengthLabel, activeBars } = useMemo(() => {
    const len = passphrase.length
    if (len === 0) {
      return { entropyBits: 0, strengthLabel: "Empty", activeBars: 0 }
    }
    const hasNumbers = /\d/.test(passphrase)
    const hasSymbols = /[^A-Za-z0-9]/.test(passphrase)
    const hasUpper = /[A-Z]/.test(passphrase)
    const hasLower = /[a-z]/.test(passphrase)

    let score = 0
    if (len >= 8) score += 1
    if (len >= 14) score += 1
    if (hasNumbers && (hasUpper || hasLower)) score += 1
    if (hasSymbols) score += 1

    const bits = Math.min(128, Math.round(len * 4.2 + (hasSymbols ? 20 : 0) + (hasNumbers ? 12 : 0)))

    let label = "Weak"
    if (score >= 4) label = "Strong"
    else if (score >= 2) label = "Moderate"

    return {
      entropyBits: bits,
      strengthLabel: label,
      activeBars: Math.min(4, Math.max(1, score)),
    }
  }, [passphrase])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLoading(true)

    try {
      const result = await authService.createAccount({
        fullName,
        email,
        namespace: "",
        passphrase,
        acceptTerms,
      })

      if (result.success) {
        message.success(result.message)
        setTimeout(() => {
          navigate("/")
        }, 800)
      } else {
        setErrorMsg(result.message)
      }
    } catch {
      setErrorMsg("Failed to initialize workspace. Please retry.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card-container">
      {/* Ambient background blur */}
      <div className="auth-card-blur-1" style={{ top: -70, left: -40, width: 220, height: 220 }} />

      <div className="auth-card">
        {/* Header Metadata */}
        <div className="auth-card-meta">
          <div className="auth-tag">
            <span className="auth-tag-dot" />
            <span>PUBLIC BETA // V3.1</span>
          </div>

          <div className="auth-meta-hint">
            <span>ZERO-DATA RETENTION</span>
          </div>
        </div>

        {/* Titles */}
        <h1 className="auth-title">Create your Orvethiq account</h1>
        <p className="auth-subtitle">
          Start building, reasoning, and exploring with high-depth intelligence.
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="create-fullname" className="auth-label">
                Full Name
              </label>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="create-fullname"
                type="text"
                className="auth-input"
                style={{ fontFamily: "var(--sans)" }}
                placeholder="e.g. Ada Lovelace"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Work Email */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="create-email" className="auth-label">
                Work Email
              </label>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="create-email"
                type="email"
                className="auth-input"
                style={{ fontFamily: "var(--sans)" }}
                placeholder="ada@acme-labs.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          {/* Master Passphrase */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="create-passphrase" className="auth-label">
                Master Passphrase
              </label>
              <span
                className="auth-label"
                style={{
                  color: strengthLabel === "Strong" ? "var(--primary)" : "var(--tertiary)",
                  fontSize: 11,
                }}
              >
                {strengthLabel}
              </span>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="create-passphrase"
                type={showPassphrase ? "text" : "password"}
                className="auth-input"
                style={{ paddingRight: 40 }}
                placeholder="Create a resilient passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setShowPassphrase(!showPassphrase)}
                aria-label={showPassphrase ? "Hide passphrase" : "Show passphrase"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {showPassphrase ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {/* Entropy Segments */}
            <div className="auth-entropy-grid">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`auth-entropy-bar ${idx < activeBars ? "active" : ""} ${
                    strengthLabel === "Strong" && idx < activeBars ? "strong" : ""
                  }`}
                />
              ))}
            </div>
            <div className="auth-entropy-meta">
              <span>Entropy: {entropyBits} bits</span>
              <span>Argon2id Hash</span>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              className="auth-checkbox-input"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span className="auth-checkbox-label">
              I accept the{" "}
              <span style={{ color: "var(--on-surface)", textDecoration: "underline" }}>
                Terms of Protocol
              </span>
              ,{" "}
              <span style={{ color: "var(--on-surface)", textDecoration: "underline" }}>
                Zero-Data Retention Guarantee
              </span>
              , and{" "}
              <span style={{ color: "var(--on-surface)", textDecoration: "underline" }}>
                Privacy Policy
              </span>
              .
            </span>
          </label>

          {/* Submit CTA */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? "Provisioning..." : "Initialize workspace"}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              keyboard_return
            </span>
          </button>
        </form>

        {/* Existing account prompt */}
        <div className="auth-card-links">
          <p className="auth-card-link-text">
            Already have an existing workspace?{" "}
            <Link to="/signin" className="auth-link-highlight">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
