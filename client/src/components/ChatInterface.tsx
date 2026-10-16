import { useState, useEffect, type FC, type ChangeEvent } from "react"
import { useConversations } from "../features/chat/useConversations"
import { MessageBubble } from "./chat/MessageBubble"
import { Composer } from "./chat/Composer"
import { Avatar, Space, Button, Spin, Input } from "antd"
import {
  RobotOutlined,
  PlusOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons"
import { useTheme } from "../hooks/useTheme"
import type { Message } from "../types"

export const ChatInterface: FC = () => {
  const { theme, toggleTheme } = useTheme()
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    handleSendMessage,
    isLoading,
    messages,
    createNewConversation,
    newConversationTitle,
    setNewConversationTitle,
  } = useConversations()

  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const savedTheme = localStorage.getItem("orvethiq-theme")
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme)
    }
  }, [])

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const showNewConversation = selectedConversationId === "new"
  const showWelcome = selectedConversationId === null

  const renderNewConversation = () => (
    <div
      style={{
        maxWidth: 500,
        margin: "60px auto",
        padding: 32,
        textAlign: "center",
        background: theme === "dark" ? "rgba(46, 48, 58, 0.85)" : "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 16,
      }}
    >
      <h2 style={{ color: "var(--text-h)", marginBottom: 8 }}>New Conversation</h2>
      <p style={{ color: "var(--text)", marginBottom: 20 }}>Start a fresh chat session</p>
      <Input
        placeholder="Conversation topic..."
        value={newConversationTitle}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNewConversationTitle(e.target.value)
        }
        onPressEnter={() => {
          if (newConversationTitle.trim()) {
            handleSendMessage(`Topic: ${newConversationTitle.trim()}`)
          }
        }}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button onClick={() => setSelectedConversationId(null)}>Cancel</Button>
        <Button
          type="primary"
          style={{ background: "var(--accent)" }}
          onClick={() => {
            if (newConversationTitle.trim()) {
              handleSendMessage(`Topic: ${newConversationTitle.trim()}`)
            } else {
              handleSendMessage("Hello Orvethiq!")
            }
          }}
        >
          Start Chat
        </Button>
      </div>
    </div>
  )

  const renderWelcome = () => (
    <div style={{ padding: 60, textAlign: "center" }}>
      <div
        style={{
          fontSize: 48,
          marginBottom: 16,
          color: "var(--accent)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <RobotOutlined />
      </div>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: "var(--text-h)",
          margin: "0 0 12px 0",
        }}
      >
        Welcome to Orvethiq
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--text)",
          marginBottom: 32,
        }}
      >
        Your premium AI chat assistant
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            borderRadius: "12px",
            padding: "0 24px",
            height: "40px",
            background: "var(--accent)",
          }}
          onClick={() => createNewConversation()}
        >
          Start Chatting
        </Button>
      </div>
    </div>
  )

  const renderChat = () => (
    <main
      style={{
        flex: 1,
        padding: "24px",
        minHeight: "100vh",
        background: "var(--bg)",
        transition: "background 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background:
            theme === "dark" ? "rgba(46, 48, 58, 0.8)" : "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "12px 12px 0 0",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space style={{ alignItems: "center" }}>
          <Avatar
            style={{
              width: 36,
              height: 36,
              background: "var(--accent)",
              color: "white",
            }}
            icon={<RobotOutlined />}
          />
          <span style={{ fontWeight: 600, color: "var(--text-h)" }}>Orvethiq</span>
          <span style={{ marginLeft: 16, fontSize: 13, color: "var(--text)" }}>
            {conversations.find((c) => c.id === selectedConversationId)?.title ||
              "Conversation"}
          </span>
        </Space>
        <Button
          type="text"
          shape="circle"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          maxHeight: "550px",
          padding: "16px",
          borderInline: "1px solid var(--border)",
          background: theme === "dark" ? "rgba(20, 21, 26, 0.4)" : "rgba(250, 250, 252, 0.4)",
        }}
      >
        {messages.map((msg: Message) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isUser={msg.role === "user"}
            loading={msg.loading}
          />
        ))}

        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: 16,
              padding: "10px 16px",
              background: "var(--accent-bg)",
              borderRadius: "16px",
              width: "fit-content",
            }}
          >
            <Spin size="small" />
            <span style={{ fontSize: 12, color: "var(--accent)" }}>Thinking...</span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 16px",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          background: theme === "dark" ? "rgba(46, 48, 58, 0.8)" : "var(--bg)",
        }}
      >
        <Composer onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </main>
  )

  if (showNewConversation) return renderNewConversation()
  if (showWelcome) return renderWelcome()
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: 260,
          borderRight: "1px solid var(--border)",
          padding: 16,
          minHeight: "100vh",
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Filter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        {filteredConversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedConversationId(c.id)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              marginBottom: 4,
              fontSize: 13,
              background:
                selectedConversationId === c.id ? "var(--accent-bg)" : "transparent",
              color:
                selectedConversationId === c.id ? "var(--accent)" : "var(--text)",
            }}
          >
            {c.title}
          </div>
        ))}
      </div>
      {renderChat()}
    </div>
  )
}