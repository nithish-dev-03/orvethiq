export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  loading?: boolean
}

export interface Conversation {
  id: string
  title: string
  lastMessage: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ConversationFormValues {
  title: string
}

export interface ThemeContextValue {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export * from "./auth"