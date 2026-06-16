import type { Agent } from "@/types";

export const AGENTS: Agent[] = [
  {
    id: "researcher",
    displayName: "Researcher",
    description: "Compares options and explains tradeoffs.",
    color: "#3B82F6",
    icon: "🔍",
  },
  {
    id: "coder",
    displayName: "Coder",
    description: "Builds working implementations.",
    color: "#10B981",
    icon: "💻",
  },
  {
    id: "critic",
    displayName: "Critic",
    description: "Finds flaws and edge cases.",
    color: "#F97316",
    icon: "⚠️",
  },
  {
    id: "planner",
    displayName: "Planner",
    description: "Creates execution plans.",
    color: "#8B5CF6",
    icon: "🗺️",
  },
  {
    id: "summarizer",
    displayName: "Summarizer",
    description: "Compresses and organizes information.",
    color: "#64748B",
    icon: "📝",
  },
];

export const AGENT_MAP = Object.fromEntries(
  AGENTS.map((agent) => [agent.id, agent])
);