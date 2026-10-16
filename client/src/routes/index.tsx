import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "../layouts/AppLayout"
import { ChatPage } from "../features/chat/ChatPage"
import { PageNotFound } from "../pages/PageNotFound"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
])
