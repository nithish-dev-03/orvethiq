import { useState, type FC } from "react"
import { Tooltip, message as antdMessage } from "antd"
import type { Message } from "../../types"
import logoImg from "../../assets/orvethiq_logo.png"

export interface MessageBubbleProps {
  message: Message
  isUser: boolean
  loading?: boolean
}

export const MessageBubble: FC<MessageBubbleProps> = ({ message, isUser, loading }) => {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    antdMessage.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const isLoading = loading || message.loading

  if (isUser) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 780,
          margin: "0 auto 24px auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            maxWidth: "85%",
            background: "var(--surface-container-high)",
            border: "1px solid var(--outline-variant-35)",
            borderRadius: "16px 16px 4px 16px",
            padding: "14px 18px",
            color: "var(--on-surface)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            className="font-body-md"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.6,
              fontSize: 14.5,
            }}
          >
            {message.content}
          </div>
          <div
            className="font-label-sm"
            style={{
              marginTop: 6,
              textAlign: "right",
              color: "var(--outline)",
              fontSize: 10,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 780,
        margin: "0 auto 32px auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Assistant Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={logoImg}
            alt="Orvethiq"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              objectFit: "cover",
              border: "1px solid var(--outline-variant-35)",
            }}
          />
          <span className="font-headline-sm" style={{ fontWeight: 600, fontSize: 14, color: "var(--on-surface)" }}>
            Orvethiq
          </span>
          <span
            className="font-label-sm"
            style={{
              background: "var(--surface-container-low)",
              border: "1px solid var(--outline-variant-20)",
              padding: "1px 6px",
              borderRadius: 4,
              color: "var(--outline)",
              fontSize: 10,
            }}
          >
            Core 3.5
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title={copied ? "Copied!" : "Copy message"}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--outline)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 4,
                borderRadius: 4,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Assistant Content Card */}
      <div
        style={{
          background: "var(--surface-container-low)",
          border: "1px solid var(--outline-variant-25)",
          borderRadius: 14,
          padding: "18px 20px",
          color: "var(--on-surface)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--primary-container)" }}>
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>
              sync
            </span>
            <span className="font-body-sm">Synthesizing solution...</span>
          </div>
        ) : (
          <div
            className="font-body-md"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.7,
              fontSize: 14.5,
              color: "var(--on-surface)",
            }}
          >
            {message.content}
          </div>
        )}

        {/* Action & Feedback Footer */}
        {!isLoading && (
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid var(--outline-variant-15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="font-label-sm" style={{ color: "var(--outline)", fontSize: 11 }}>
              18ms latency • 248 tokens
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Tooltip title="Helpful">
                <button
                  type="button"
                  onClick={() => setFeedback("up")}
                  style={{
                    background: feedback === "up" ? "var(--surface-container-high)" : "transparent",
                    border: "none",
                    color: feedback === "up" ? "var(--primary)" : "var(--outline)",
                    cursor: "pointer",
                    padding: "3px 6px",
                    borderRadius: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    thumb_up
                  </span>
                </button>
              </Tooltip>

              <Tooltip title="Not helpful">
                <button
                  type="button"
                  onClick={() => setFeedback("down")}
                  style={{
                    background: feedback === "down" ? "var(--surface-container-high)" : "transparent",
                    border: "none",
                    color: feedback === "down" ? "var(--error)" : "var(--outline)",
                    cursor: "pointer",
                    padding: "3px 6px",
                    borderRadius: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    thumb_down
                  </span>
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}