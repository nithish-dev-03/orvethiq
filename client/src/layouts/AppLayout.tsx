import { useState, useEffect, type FC, type ReactNode } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Tooltip, Dropdown, message, type MenuProps } from "antd"
import { useTheme } from "../hooks/useTheme"
import { useConversations } from "../features/chat/useConversations"
import { authService } from "../services/authService"
import logoImg from "../assets/orvethiq_logo.png"

export interface AppLayoutProps {
  children?: ReactNode
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const {
    conversations,
    selectedConversationId,
    selectConversation,
    createNewConversation,
  } = useConversations()

  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModel, setSelectedModel] = useState("Orvethiq Core 3.5")

  // Global keyboard shortcut for New Chat (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        createNewConversation()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [createNewConversation])

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Split conversations into Recent (first 3) and Earlier
  const recentConversations = filteredConversations.slice(0, 3)
  const earlierConversations = filteredConversations.slice(3)

  const activeConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  const modelMenuItems: MenuProps["items"] = [
    {
      key: "core",
      label: "Orvethiq Core 3.5 (Default)",
      onClick: () => setSelectedModel("Orvethiq Core 3.5"),
    },
    {
      key: "fast",
      label: "Orvethiq Flash 2.0 (Fast)",
      onClick: () => setSelectedModel("Orvethiq Flash 2.0"),
    },
    {
      key: "reasoning",
      label: "Orvethiq Reasoning 1.0 (Deep)",
      onClick: () => setSelectedModel("Orvethiq Reasoning 1.0"),
    },
  ]

  const userMenuItems: MenuProps["items"] = [
    {
      key: "workspace",
      label: "Personal Workspace Settings",
    },
    {
      key: "export",
      label: "Export Conversations (JSON)",
    },
    {
      type: "divider",
    },
    {
      key: "signin",
      label: "Sign In / Switch Account",
      onClick: () => navigate("/signin"),
    },
    {
      key: "signup",
      label: "Create New Account",
      onClick: () => navigate("/create-account"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log Out",
      danger: true,
      icon: (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 16, verticalAlign: "middle" }}
        >
          logout
        </span>
      ),
      onClick: async () => {
        await authService.signOut()
        message.success("Logged out of workspace")
        navigate("/signin")
      },
    },
    {
      type: "divider",
    },
    {
      key: "about",
      label: "About Orvethiq v2.5",
    },
  ]

  const sidebarWidth = collapsed ? 68 : 260

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--surface)" }}>
      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarWidth,
          background: "var(--surface-container-low)",
          borderRight: "1px solid var(--outline-variant-30)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          userSelect: "none",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Top Brand Bar */}
          <div
            style={{
              height: 64,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              borderBottom: "1px solid var(--outline-variant-20)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
              onClick={() => createNewConversation()}
            >
              <img
                src={logoImg}
                alt="Orvethiq"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  objectFit: "cover",
                  border: "1px solid var(--outline-variant-35)",
                  flexShrink: 0,
                }}
              />
              {!collapsed && (
                <span
                  className="font-headline-sm"
                  style={{
                    letterSpacing: "0.08em",
                    fontWeight: 650,
                    color: "var(--on-surface)",
                    textTransform: "uppercase",
                    fontSize: 14,
                  }}
                >
                  Orvethiq
                </span>
              )}
            </div>

            {!collapsed && (
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={() => setCollapsed(true)}
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
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
                  side_navigation
                </span>
              </button>
            )}

            {collapsed && (
              <button
                type="button"
                aria-label="Expand sidebar"
                onClick={() => setCollapsed(false)}
                style={{
                  marginTop: 8,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  background: "transparent",
                  border: "none",
                  color: "var(--on-surface-variant)",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  side_navigation
                </span>
              </button>
            )}
          </div>

          {/* New Chat & Search Actions */}
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              type="button"
              onClick={() => createNewConversation()}
              title="New Chat (⌘K)"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                padding: collapsed ? "8px" : "8px 12px",
                borderRadius: 8,
                background: "var(--surface-container)",
                border: "1px solid var(--outline-variant-30)",
                color: "var(--on-surface)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface-container-high)"
                e.currentTarget.style.borderColor = "var(--outline-variant-60)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface-container)"
                e.currentTarget.style.borderColor = "var(--outline-variant-30)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: "var(--primary)" }}
                >
                  add
                </span>
                {!collapsed && (
                  <span className="font-label-md" style={{ color: "var(--on-surface)" }}>
                    New chat
                  </span>
                )}
              </div>
              {!collapsed && (
                <div
                  className="font-label-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "var(--outline)",
                  }}
                >
                  <span
                    style={{
                      padding: "1px 5px",
                      borderRadius: 4,
                      background: "var(--surface-container-highest)",
                      border: "1px solid var(--outline-variant-20)",
                      fontSize: 10,
                    }}
                  >
                    ⌘K
                  </span>
                </div>
              )}
            </button>

            {!collapsed && (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 10,
                    fontSize: 16,
                    color: "var(--outline)",
                    pointerEvents: "none",
                  }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-body-sm"
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    borderRadius: 8,
                    background: "var(--surface-container-lowest)",
                    border: "1px solid var(--outline-variant-25)",
                    color: "var(--on-surface)",
                    outline: "none",
                    fontSize: 13,
                    transition: "border 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary-container)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--outline-variant-25)")}
                />
              </div>
            )}
          </div>

          {/* Conversation Tree */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "4px 12px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Recent Section */}
            <div>
              {!collapsed && (
                <div
                  className="font-label-sm"
                  style={{
                    padding: "4px 8px 6px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--outline)",
                    fontSize: 11,
                  }}
                >
                  Recent
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {recentConversations.map((conv) => {
                  const isActive = selectedConversationId === conv.id
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => selectConversation(conv.id)}
                      title={conv.title}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: collapsed ? "8px" : "8px 10px",
                        borderRadius: 6,
                        border: "none",
                        borderLeft: isActive ? "2px solid var(--primary-container)" : "2px solid transparent",
                        background: isActive ? "var(--surface-container-high)" : "transparent",
                        color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.15s ease",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "var(--surface-container)"
                          e.currentTarget.style.color = "var(--on-surface)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent"
                          e.currentTarget.style.color = "var(--on-surface-variant)"
                        }
                      }}
                    >
                      {collapsed ? (
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: 16,
                            color: isActive ? "var(--primary-container)" : "var(--outline)",
                            margin: "0 auto",
                          }}
                        >
                          chat_bubble
                        </span>
                      ) : (
                        <span
                          className="font-body-sm"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: 13,
                          }}
                        >
                          {conv.title}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Earlier Section */}
            {earlierConversations.length > 0 && (
              <div>
                {!collapsed && (
                  <div
                    className="font-label-sm"
                    style={{
                      padding: "4px 8px 6px 8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--outline)",
                      fontSize: 11,
                    }}
                  >
                    Earlier
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {earlierConversations.map((conv) => {
                    const isActive = selectedConversationId === conv.id
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => selectConversation(conv.id)}
                        title={conv.title}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: collapsed ? "8px" : "8px 10px",
                          borderRadius: 6,
                          border: "none",
                          borderLeft: isActive ? "2px solid var(--primary-container)" : "2px solid transparent",
                          background: isActive ? "var(--surface-container-high)" : "transparent",
                          color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.15s ease",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "var(--surface-container)"
                            e.currentTarget.style.color = "var(--on-surface)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.color = "var(--on-surface-variant)"
                          }
                        }}
                      >
                        {collapsed ? (
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: 16,
                              color: isActive ? "var(--primary-container)" : "var(--outline)",
                              margin: "0 auto",
                            }}
                          >
                            history
                          </span>
                        ) : (
                          <span
                            className="font-body-sm"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: 13,
                            }}
                          >
                            {conv.title}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer: Settings & Profile Badge */}
        <div
          style={{
            padding: 10,
            borderTop: "1px solid var(--outline-variant-30)",
            background: "var(--surface-container-low)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              padding: "7px 10px",
              borderRadius: 6,
              background: "transparent",
              border: "none",
              color: "var(--on-surface-variant)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--surface-container)"
              e.currentTarget.style.color = "var(--on-surface)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "var(--on-surface-variant)"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              settings
            </span>
            {!collapsed && <span className="font-body-sm">Settings</span>}
          </button>

          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="topRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                padding: "6px 8px",
                borderRadius: 8,
                background: "var(--surface-pill)",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-container)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-pill)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div
                  className="font-label-sm"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--surface-container-high)",
                    border: "1px solid var(--primary-container)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  NS
                </div>
                {!collapsed && (
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                    <span
                      className="font-label-md"
                      style={{
                        color: "var(--on-surface)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                        fontSize: 12,
                      }}
                    >
                      Nithish
                    </span>
                    <span
                      className="font-label-sm"
                      style={{
                        color: "var(--outline)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                        fontSize: 10,
                      }}
                    >
                      Personal workspace
                    </span>
                  </div>
                )}
              </div>
              {!collapsed && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: "var(--on-surface-variant)" }}
                >
                  more_horiz
                </span>
              )}
            </div>
          </Dropdown>
        </div>
      </aside>

      {/* Main Container */}
      <div
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "var(--surface)",
        }}
      >
        {/* Top Header Bar */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: sidebarWidth,
            right: 0,
            height: 64,
            background: "var(--surface-header)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--outline-variant-30)",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Active Conversation Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              className="font-headline-sm"
              style={{
                color: "var(--on-surface)",
                fontWeight: 500,
                fontSize: 15,
              }}
            >
              {activeConversation ? activeConversation.title : "New conversation"}
            </span>
          </div>

          {/* Right Header Action Suite */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Model Selector Pill */}
            <Dropdown menu={{ items: modelMenuItems }} trigger={["click"]}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px",
                  borderRadius: 9999,
                  background: "var(--surface-container)",
                  border: "1px solid var(--outline-variant-30)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "inline-block",
                  }}
                />
                <span className="font-label-md" style={{ color: "var(--on-surface)", fontSize: 12 }}>
                  {selectedModel}
                </span>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16, color: "var(--on-surface-variant)" }}
                >
                  expand_more
                </span>
              </div>
            </Dropdown>

            {/* Actions Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderLeft: "1px solid var(--outline-variant-30)",
                paddingLeft: 12,
              }}
            >
              {/* Theme Toggle Button */}
              <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <button
                  type="button"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: "transparent",
                    border: "none",
                    color: "var(--on-surface-variant)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--surface-container)"
                    e.currentTarget.style.color = "var(--on-surface)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "var(--on-surface-variant)"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {theme === "dark" ? "light_mode" : "dark_mode"}
                  </span>
                </button>
              </Tooltip>

              {/* Share Button */}
              <button
                type="button"
                aria-label="Share workspace"
                style={{
                  height: 32,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 8,
                  background: "var(--surface-container)",
                  border: "1px solid var(--outline-variant-30)",
                  color: "var(--on-surface)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-container-high)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-container)")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  ios_share
                </span>
                <span className="font-label-md" style={{ fontSize: 12 }}>
                  Share
                </span>
              </button>

              {/* More Actions Menu */}
              <button
                type="button"
                aria-label="More actions"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: "transparent",
                  border: "none",
                  color: "var(--on-surface-variant)",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  more_vert
                </span>
              </button>

              {/* Header Profile Avatar */}
              <img
                src={logoImg}
                alt="Profile"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginLeft: 4,
                  border: "1px solid var(--outline-variant-35)",
                }}
              />
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main
          style={{
            flex: 1,
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}