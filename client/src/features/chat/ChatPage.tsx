import { useRef, useEffect, type FC } from "react"
import { useConversations } from "./useConversations"
import { MessageBubble } from "../../components/chat/MessageBubble"
import { Composer } from "../../components/chat/Composer"
import logoImg from "../../assets/orvethiq_logo.png"

interface PromptCard {
  icon: string
  title: string
  description: string
  prompt: string
}

const PROMPT_CARDS: PromptCard[] = [
  {
    icon: "menu_book",
    title: "Understand a concept",
    description: "Make complex ideas easier to understand.",
    prompt:
      "Can you break down the mathematical intuition and trade-offs behind vector embeddings in high-dimensional search?",
  },
  {
    icon: "terminal",
    title: "Build with code",
    description: "Explore an approach or debug a problem.",
    prompt:
      "Design an asynchronous worker queue in Python with Redis and FastAPI, focusing on clean error handling.",
  },
  {
    icon: "edit_note",
    title: "Write something",
    description: "Turn rough thoughts into clear writing.",
    prompt:
      "Help me draft an architectural decision record (ADR) justifying migrating from a monolithic database to distributed read-replicas.",
  },
  {
    icon: "checklist_rtl",
    title: "Plan your next step",
    description: "Organize an idea into an actionable plan.",
    prompt:
      "Outline a sprint-by-sprint development roadmap for shipping an MVP telemetry engine in 6 weeks.",
  },
]

export const ChatPage: FC = () => {
  const {
    selectedConversationId,
    handleSendMessage,
    isLoading,
    messages,
  } = useConversations()

  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleCardClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const showWelcome = messages.length === 0 && selectedConversationId === null

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "32px 24px 20px 24px",
        overflowX: "hidden",
      }}
    >
      {/* Ambient Grid & Radial Geometry Underlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.45,
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: 720,
            height: 720,
            borderRadius: "50%",
            background: "var(--radial-glow)",
            filter: "blur(60px)",
            transform: "translateY(-60px)",
          }}
        />
      </div>

      {/* Main Content Stage */}
      {showWelcome ? (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 780,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 28,
            paddingBottom: 24,
          }}
        >
          {/* Brand & Hero Introduction */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 36,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--surface-container-low)",
                  border: "1px solid var(--outline-variant-30)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6,
                  boxShadow: "var(--shadow-sm)",
                  transition: "border 0.2s ease",
                }}
              >
                <img
                  src={logoImg}
                  alt="Orvethiq Orbital Symbol"
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "contain",
                  }}
                />
              </div>

              <span
                className="font-label-sm"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--outline)",
                  padding: "4px 10px",
                  background: "var(--surface-container-low)",
                  borderRadius: 6,
                  border: "1px solid var(--outline-variant-20)",
                  fontSize: 11,
                }}
              >
                Session 01 • Isolated
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
              <h1
                className="font-display-lg"
                style={{
                  color: "var(--on-surface)",
                  letterSpacing: "-0.03em",
                  fontWeight: 550,
                  margin: 0,
                }}
              >
                What shall we explore today?
              </h1>
              <p
                className="font-body-lg"
                style={{
                  color: "var(--on-surface-variant)",
                  margin: 0,
                  fontSize: 17,
                }}
              >
                Think through an idea, solve a problem, or build something new.
              </p>
            </div>
          </div>

          {/* Suggested Prompt Grid (2x2 Balanced Matrix) */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 12,
            }}
          >
            {PROMPT_CARDS.map((card, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(card.prompt)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "var(--surface-container-low)",
                  border: "1px solid var(--outline-variant-30)",
                  borderRadius: 14,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 108,
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-container)"
                  e.currentTarget.style.borderColor = "var(--primary-container)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--surface-container-low)"
                  e.currentTarget.style.borderColor = "var(--outline-variant-30)"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20, color: "var(--primary-container)" }}
                    >
                      {card.icon}
                    </span>
                    <span
                      className="font-headline-sm"
                      style={{
                        color: "var(--on-surface)",
                        fontWeight: 500,
                        fontSize: 15,
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </span>
                  </div>

                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 16,
                      color: "var(--outline)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    arrow_outward
                  </span>
                </div>

                <p
                  className="font-body-sm"
                  style={{
                    color: "var(--on-surface-variant)",
                    margin: 0,
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.description}
                </p>
              </button>
            ))}
          </div>

          {/* Quick Metrics Strip / Context Chips */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid var(--outline-variant-15)",
              userSelect: "none",
            }}
          >
            <div
              className="font-label-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "var(--outline)",
                fontSize: 11,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--primary-container)",
                  }}
                />
                LATENCY: <strong style={{ color: "var(--on-surface)" }}>18ms</strong>
              </span>

              <span style={{ color: "var(--outline-variant)" }}>/</span>

              <span>
                CONTEXT DEPTH: <strong style={{ color: "var(--on-surface)" }}>128k</strong>
              </span>

              <span style={{ color: "var(--outline-variant)" }}>/</span>

              <span>
                TEMP: <strong style={{ color: "var(--on-surface)" }}>0.2</strong>
              </span>
            </div>

            <div
              className="font-label-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--outline)",
                fontSize: 11,
              }}
            >
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "var(--surface-container-high)",
                  border: "1px solid var(--outline-variant-20)",
                  color: "var(--on-surface-variant)",
                }}
              >
                Shift + Return
              </span>
              <span>for newline</span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Conversation Stream */
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 780,
            margin: "0 auto",
            flex: 1,
            overflowY: "auto",
            paddingBottom: 24,
          }}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isUser={msg.role === "user"}
              loading={msg.loading}
            />
          ))}

          {isLoading && (
            <MessageBubble
              message={{
                id: "loading-temp",
                role: "assistant",
                content: "",
                timestamp: new Date(),
                loading: true,
              }}
              isUser={false}
              loading={true}
            />
          )}
          <div ref={messageEndRef} />
        </div>
      )}

      {/* Message Composer Dock (Bottom Horizon) */}
      <div style={{ width: "100%", position: "relative", zIndex: 20, paddingTop: 16 }}>
        <Composer
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}