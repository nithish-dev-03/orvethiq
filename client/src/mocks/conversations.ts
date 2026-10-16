import type { Conversation } from "../types"

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "building-a-fastapi-application",
    title: "Building a FastAPI application",
    lastMessage: "Clean async architecture with Pydantic v2 schemas and connection pooling.",
    createdAt: new Date(2026, 9, 15, 10, 30),
    updatedAt: new Date(2026, 9, 15, 16, 45),
  },
  {
    id: "understanding-vector-embeddings",
    title: "Understanding vector embeddings",
    lastMessage: "Cosine similarity versus dot product in high-dimensional semantic search.",
    createdAt: new Date(2026, 9, 14, 14, 20),
    updatedAt: new Date(2026, 9, 14, 15, 10),
  },
  {
    id: "react-state-management",
    title: "React state management",
    lastMessage: "Comparing Zustand and Context API for modular AI workspace state.",
    createdAt: new Date(2026, 9, 13, 9, 5),
    updatedAt: new Date(2026, 9, 13, 14, 30),
  },
  {
    id: "planning-my-capstone",
    title: "Planning my capstone",
    lastMessage: "Fullstack architecture: React 19 + TypeScript + FastAPI backend.",
    createdAt: new Date(2026, 9, 10, 16, 0),
    updatedAt: new Date(2026, 9, 10, 16, 0),
  },
  {
    id: "python-async-explained",
    title: "Python async explained",
    lastMessage: "Event loop internals, tasks, and non-blocking I/O operations.",
    createdAt: new Date(2026, 9, 8, 11, 20),
    updatedAt: new Date(2026, 9, 8, 12, 10),
  },
]