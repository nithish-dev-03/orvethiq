import type { Message } from "../types"

export const MOCK_MESSAGE_MAP: Record<string, Message[]> = {
  "building-a-fastapi-application": [
    {
      id: "fastapi-1",
      role: "user",
      content: "How should I structure a production-grade FastAPI application with asynchronous database sessions and dependency injection?",
      timestamp: new Date(2026, 9, 15, 10, 30),
    },
    {
      id: "fastapi-2",
      role: "assistant",
      content: `Here is the recommended modular pattern for modern FastAPI applications:\n\n1. **Layered Directory Hierarchy:**\n   - \`app/api/v1/\` — Endpoint route controllers\n   - \`app/core/\` — Application configuration & telemetry settings\n   - \`app/schemas/\` — Pydantic v2 input/output validation models\n   - \`app/services/\` — Pure business domain logic\n   - \`app/db/\` — Async database engine and session managers\n\n2. **Async Session Injection:**\n   Use \`Depends()\` to yield async context sessions per request, ensuring automatic commit or rollback on failure without connection leaks.`,
      timestamp: new Date(2026, 9, 15, 10, 31),
    },
  ],
  "understanding-vector-embeddings": [
    {
      id: "embed-1",
      role: "user",
      content: "Can you break down the mathematical intuition and trade-offs behind vector embeddings in high-dimensional search?",
      timestamp: new Date(2026, 9, 14, 14, 20),
    },
    {
      id: "embed-2",
      role: "assistant",
      content: `Vector embeddings project multimodal or semantic information into dense topological manifolds:\n\n- **Cosine Similarity:** Measures the angle between normalized directional vectors, ideal when document length variance shouldn't bias relevance.\n- **Dot Product:** Retains magnitude, which can reflect frequency or confidence when embeddings are calibrated for magnitude significance.\n- **Trade-Offs:** Approximate Nearest Neighbors (ANN) indexing using HNSW (Hierarchical Navigable Small World) sacrifices a fractional recall percentage (e.g. 99% down to 96%) in exchange for sub-10ms queries over tens of millions of records.`,
      timestamp: new Date(2026, 9, 14, 14, 22),
    },
  ],
}

export const MOCK_MESSAGE_DATA: Message[] = [
  {
    id: "m1",
    role: "assistant",
    content: "Welcome to Orvethiq. I'm ready to synthesize code, evaluate system architecture, or reason through complex problem domains with you.",
    timestamp: new Date(),
  },
]