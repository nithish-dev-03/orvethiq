import {
  useState,
  useRef,
  type FC,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { Dropdown, type MenuProps, Tooltip } from "antd"

export interface ComposerProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
  initialValue?: string
}

export const Composer: FC<ComposerProps> = ({
  onSend,
  disabled = false,
  placeholder = "Ask anything, or start with an idea…",
  initialValue = "",
}) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [selectedTool, setSelectedTool] = useState("Tools")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    adjustTextareaHeight(e.target)
  }

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      submitMessage()
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  const submitMessage = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setInputValue((prev) => `${prev} [Attached file: ${file.name}]`)
    }
  }

  const toolMenuItems: MenuProps["items"] = [
    {
      key: "code",
      label: "Code Execution Sandbox",
      onClick: () => setSelectedTool("Code Sandbox"),
    },
    {
      key: "search",
      label: "Live Web & Docs Retrieval",
      onClick: () => setSelectedTool("Web Search"),
    },
    {
      key: "data",
      label: "Data Analysis & Visualizer",
      onClick: () => setSelectedTool("Data Analysis"),
    },
    {
      type: "divider",
    },
    {
      key: "reset",
      label: "Default Tools",
      onClick: () => setSelectedTool("Tools"),
    },
  ]

  const canSend = !disabled && inputValue.trim().length > 0

  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        width: "100%",
        maxWidth: 780,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Elevated Composer Card */}
      <div
        style={{
          width: "100%",
          background: "var(--surface-container)",
          border: "1px solid var(--outline-variant-35)",
          borderRadius: 18,
          padding: "10px 14px",
          boxShadow: "var(--shadow-xl)",
          transition: "border 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--primary-container)"
          e.currentTarget.style.boxShadow =
            "0 0 0 1px var(--primary-container), var(--shadow-xl)"
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--outline-variant-35)"
          e.currentTarget.style.boxShadow = "var(--shadow-xl)"
        }}
      >
        {/* Textarea Field */}
        <div style={{ width: "100%", padding: "4px 6px" }}>
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="font-body-md"
            style={{
              width: "100%",
              background: "transparent",
              resize: "none",
              outline: "none",
              border: "none",
              color: "var(--on-surface)",
              minHeight: 52,
              maxHeight: 180,
              lineHeight: 1.6,
              fontFamily: "var(--sans)",
              fontSize: 15,
            }}
          />
        </div>

        {/* Integrated Composer Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 4px",
            userSelect: "none",
          }}
        >
          {/* Left Action Suite */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Attachment Button */}
            <Tooltip title="Attach context or code file">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: "var(--on-surface-variant)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-container-high)"
                  e.currentTarget.style.color = "var(--on-surface)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "var(--on-surface-variant)"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  add
                </span>
              </button>
            </Tooltip>

            {/* Tools Dropdown Trigger */}
            <Dropdown menu={{ items: toolMenuItems }} trigger={["click"]}>
              <button
                type="button"
                style={{
                  height: 28,
                  padding: "0 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 6,
                  border: "1px solid var(--outline-variant-35)",
                  background: "var(--surface-container-low)",
                  color: "var(--on-surface-variant)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--surface-container-high)"
                  e.currentTarget.style.color = "var(--on-surface)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--surface-container-low)"
                  e.currentTarget.style.color = "var(--on-surface-variant)"
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 15, color: "var(--primary)" }}
                >
                  tune
                </span>
                <span className="font-label-md" style={{ fontSize: 11 }}>
                  {selectedTool}
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, color: "var(--outline)" }}
                >
                  expand_more
                </span>
              </button>
            </Dropdown>

            {/* Model Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 8px",
                borderRadius: 4,
                background: "var(--surface-container-lowest)",
                border: "1px solid var(--outline-variant-20)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#34d399",
                  display: "inline-block",
                }}
              />
              <span
                className="font-label-sm"
                style={{
                  color: "var(--primary-container)",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                Orvethiq Core 3.5
              </span>
            </div>
          </div>

          {/* Right Action: Dispatch Button */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={submitMessage}
              disabled={!canSend}
              aria-label="Send message"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: canSend ? "var(--primary-container)" : "var(--surface-container-high)",
                color: canSend ? "var(--on-primary)" : "var(--outline)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: canSend ? "scale(1)" : "scale(0.95)",
                boxShadow: canSend ? "0 2px 10px rgba(165, 180, 252, 0.35)" : "none",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, fontWeight: 700 }}>
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal / Disclaimers Notice */}
      <p
        className="font-body-sm"
        style={{
          color: "var(--outline)",
          textAlign: "center",
          marginTop: 10,
          fontSize: 12,
        }}
      >
        AI can make mistakes. Review critical architectural & security outputs.
      </p>
    </div>
  )
}