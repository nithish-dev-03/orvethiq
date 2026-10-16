import type { Conversation, Message } from "../types"
import { MOCK_CONVERSATIONS } from "../mocks/conversations"
import { MOCK_MESSAGE_DATA, MOCK_MESSAGE_MAP } from "../mocks/messages"

// Simulate API delay
export const delay = (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const fetchConversations = async (): Promise<Conversation[]> => {
  await delay(200)
  return [...MOCK_CONVERSATIONS]
}

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  await delay(250)
  if (!conversationId || conversationId === "new") {
    return []
  }
  if (MOCK_MESSAGE_MAP[conversationId]) {
    return [...MOCK_MESSAGE_MAP[conversationId]]
  }
  return [...MOCK_MESSAGE_DATA]
}

export const sendMessage = async (
  conversationId: string,
  content: string
): Promise<Message> => {
  await delay(200)
  const newMessage: Message = {
    id: `m-${conversationId}-${Date.now()}`,
    role: "user",
    content,
    timestamp: new Date(),
  }
  return newMessage
}

export const simulateAssistantResponse = async (
  conversationId: string,
  userMessage: string
): Promise<Message> => {
  await delay(500)
  const response: Message = {
    id: `m-${conversationId}-${Date.now()}-resp`,
    role: "assistant",
    content: `I've analyzed your prompt regarding: "${userMessage}".\n\nHere are the critical observations and recommendations:\n1. **Core Architecture:** Keep interfaces decoupled and validate payload boundaries.\n2. **Performance Considerations:** Aim for sub-50ms execution by minimizing round-trips and using connection pooling.\n3. **Suggested Next Action:** Would you like to proceed with the code implementation or review architectural trade-offs?`,
    timestamp: new Date(),
  }
  return response
}