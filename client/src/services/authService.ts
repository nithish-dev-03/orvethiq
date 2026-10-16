import type {
  AuthResult,
  CreateAccountFormData,
  IAuthService,
  ResetPasswordFormData,
  SignInFormData,
} from "../types"

// Base URL for the backend API.
// Defaults to empty string to use Vite's dev server proxy (/login -> http://localhost:8000/login)
const API_BASE_URL = import.meta.env.VITE_API_URL || ""

interface BackendResponse {
  status: boolean
  message: string
  data?: {
    id?: number
    user_name?: string
  }
}

/**
 * Auth Service connected to FastAPI backend:
 * - POST /login
 * - POST /register
 */
export class RealAuthService implements IAuthService {
  async signIn(data: SignInFormData): Promise<AuthResult> {
    const identifier = data.identifier.trim()
    if (!identifier) {
      return { success: false, message: "Please enter your work email or handle." }
    }

    if (!data.password) {
      return { success: false, message: "Password is required." }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: identifier,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errMsg =
          errorData?.detail?.message ||
          errorData?.message ||
          `Server returned error ${response.status}`
        return { success: false, message: errMsg }
      }

      const res: BackendResponse = await response.json()

      if (res.status) {
        return {
          success: true,
          message: res.message || "User logged in successfully!",
          user: {
            id: identifier,
            name: identifier.split("@")[0] || "Operator",
            email: identifier.includes("@") ? identifier : `${identifier}@orvethiq.internal`,
            namespace: identifier.split("@")[0],
          },
        }
      }

      return {
        success: false,
        message: res.message || "Invalid credentials.",
      }
    } catch {
      return {
        success: false,
        message: "Unable to connect to backend server. Make sure FastAPI server is running on port 8000.",
      }
    }
  }

  async createAccount(data: CreateAccountFormData): Promise<AuthResult> {
    const fullName = data.fullName.trim()
    const email = data.email.trim()
    const namespace = data.namespace?.trim() || ""
    const passphrase = data.passphrase

    if (!fullName) {
      return { success: false, message: "Full Name is required." }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Please provide a valid email address." }
    }

    if (!passphrase || passphrase.length < 8) {
      return {
        success: false,
        message: "Passphrase must be at least 8 characters with high entropy.",
      }
    }

    if (!data.acceptTerms) {
      return {
        success: false,
        message: "You must accept the Terms of Protocol and Privacy Policy.",
      }
    }

    // Use email as user_name, or namespace if provided
    const userName = namespace || email

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userName,
          password: passphrase,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errMsg =
          errorData?.detail?.message ||
          errorData?.message ||
          `Server returned error ${response.status}`
        return { success: false, message: errMsg }
      }

      const res: BackendResponse = await response.json()

      if (res.status) {
        return {
          success: true,
          message: res.message || "User created successfully!",
          user: {
            id: String(res.data?.id || userName),
            name: fullName,
            email: email,
            namespace: namespace || email.split("@")[0],
          },
        }
      }

      return {
        success: false,
        message: res.message || "User creation failed.",
      }
    } catch {
      return {
        success: false,
        message: "Unable to connect to backend server. Make sure FastAPI server is running on port 8000.",
      }
    }
  }

  async resetPassword(data: ResetPasswordFormData): Promise<AuthResult> {
    const identity = data.identity.trim()
    if (!identity) {
      return {
        success: false,
        message: "Please enter your registered identifier or email.",
      }
    }

    if (!data.newPassphrase || data.newPassphrase.length < 8) {
      return {
        success: false,
        message: "New passphrase must be at least 8 characters.",
      }
    }

    if (data.newPassphrase !== data.confirmPassphrase) {
      return {
        success: false,
        message: "Passphrases do not match.",
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: identity,
          password: data.newPassphrase,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errMsg =
          errorData?.detail?.message ||
          errorData?.message ||
          `Server returned error ${response.status}`
        return { success: false, message: errMsg }
      }

      const res: BackendResponse = await response.json()

      if (res.status) {
        return {
          success: true,
          message: res.message || "Password reset successfully!",
        }
      }

      return {
        success: false,
        message: res.message || "Password reset failed.",
      }
    } catch {
      return {
        success: false,
        message: "Unable to connect to backend server. Make sure FastAPI server is running on port 8000.",
      }
    }
  }

  async signOut(): Promise<AuthResult> {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
      })
    } catch {
      // ignore network errors during signout
    }

    try {
      localStorage.removeItem("orvethiq_user")
      sessionStorage.clear()
    } catch {
      // ignore storage access errors
    }

    return {
      success: true,
      message: "Logged out successfully.",
    }
  }
}

export const authService: IAuthService = new RealAuthService()

