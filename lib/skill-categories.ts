/**
 * Shared by the server-rendered legend and the client-side 3D cloud, so it
 * must NOT live behind a "use client" boundary — exports crossing that
 * boundary arrive as client references, not real values.
 */

export const CAT_LABEL = [
  "Languages & Frameworks",
  "AI & Agents",
  "Data & Infra",
  "Quality & Design",
] as const;

/** Index into CAT_LABEL. `var(--brand)` follows the accent picker. */
export const CAT_COLOR = ["#5ce1ff", "#9d7bff", "var(--brand)", "#7de8b0"];

export const SKILL_CATEGORY: Record<string, number> = {
  React: 0, TypeScript: 0, "Next.js": 0, "Node.js": 0, Express: 0,
  Python: 0, "C# / .NET": 0, "Tailwind CSS": 0,
  RAG: 1, LangChain: 1, LangGraph: 1, DeepAgents: 1, TensorFlow: 1,
  OpenCV: 1, "Claude Code": 1, Cursor: 1,
  PostgreSQL: 2, "SQL Server": 2, Azure: 2, AWS: 2, Docker: 2, Git: 2,
  Jest: 3, Figma: 3,
};
