export interface SignInFormData {
  identifier: string
  password: string
  trustSession: boolean
}

export interface CreateAccountFormData {
  fullName: string
  email: string
  namespace: string
  passphrase: string
  acceptTerms: boolean
}

export interface ResetPasswordFormData {
  identity: string
  newPassphrase: string
  confirmPassphrase: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  namespace?: string
}

export interface AuthResult {
  success: boolean
  message: string
  user?: AuthUser
}

export interface IAuthService {
  signIn(data: SignInFormData): Promise<AuthResult>
  createAccount(data: CreateAccountFormData): Promise<AuthResult>
  resetPassword(data: ResetPasswordFormData): Promise<AuthResult>
  signOut(): Promise<AuthResult>
}
