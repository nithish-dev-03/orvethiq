import { useState, useEffect, useCallback } from "react"
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  simulateAssistantResponse,
} from "../../services/mockService"
import type { Conversation, Message } from "../../types"

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newConversationTitle, setNewConversationTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchConversations().then((data) => {
      if (isMounted) {
        setConversations(data)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const selectConversation = useCallback(async (id: string | null) => {
    setSelectedConversationId(id)
    if (!id || id === "new") {
      setMessages([])
      return
    }
    setIsLoading(true)
    try {
      const msgs = await fetchMessages(id)
      setMessages(msgs)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    const activeId = selectedConversationId || "new"

    const userMsg = await sendMessage(activeId, content)
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      if (selectedConversationId && selectedConversationId !== "new") {
        const assistantMsg = await simulateAssistantResponse(
          selectedConversationId,
          content
        )
        setMessages((prev) => [...prev, assistantMsg])
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversationId
              ? { ...c, lastMessage: content, updatedAt: new Date() }
              : c
          )
        )
      } else {
        const newId = `conv-${Date.now()}`
        const title =
          newConversationTitle.trim() ||
          (content.length > 25 ? `${content.slice(0, 25)}...` : content)
        const newConv: Conversation = {
          id: newId,
          title,
          lastMessage: content,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setConversations((prev) => [newConv, ...prev])
        setSelectedConversationId(newId)
        setNewConversationTitle("")

        const assistantMsg = await simulateAssistantResponse(newId, content)
        setMessages((prev) => [...prev, assistantMsg])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const createNewConversation = (title: string = "") => {
    setSelectedConversationId("new")
    setMessages([])
    setNewConversationTitle(title)
  }

  return {
    conversations,
    setConversations,
    messages,
    setMessages,
    selectedConversationId,
    setSelectedConversationId,
    selectConversation,
    setSelectedConversation: selectConversation,
    isLoading,
    handleSendMessage,
    createNewConversation,
    newConversationTitle,
    setNewConversationTitle,
  }
}