import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppLayout } from "../layouts/AppLayout"
import { AuthLayout } from "../layouts/AuthLayout"
import { ChatPage } from "../features/chat/ChatPage"
import { SignInPage } from "../pages/SignInPage"
import { CreateAccountPage } from "../pages/CreateAccountPage"
import { ResetPasswordPage } from "../pages/ResetPasswordPage"
import { PageNotFound } from "../pages/PageNotFound"

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/signin",
        element: <SignInPage />,
      },
      {
        path: "/login",
        element: <Navigate to="/signin" replace />,
      },
      {
        path: "/create-account",
        element: <CreateAccountPage />,
      },
      {
        path: "/signup",
        element: <Navigate to="/create-account" replace />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/forgot-password",
        element: <Navigate to="/reset-password" replace />,
      },
    ],
  },
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
