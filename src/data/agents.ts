import type { Agent, AgentType } from "@/types";

export const AGENTS: Agent[] = [
  {
    id: "researcher",
    displayName: "Researcher",
    description: "Compares options and explains tradeoffs.",
    color: "#2563EB",
    icon: "R",
  },
  {
    id: "coder",
    displayName: "Coder",
    description: "Builds working implementations.",
    color: "#059669",
    icon: "C",
  },
  {
    id: "critic",
    displayName: "Critic",
    description: "Finds flaws, risks, and edge cases.",
    color: "#EA580C",
    icon: "!",
  },
  {
    id: "planner",
    displayName: "Planner",
    description: "Turns goals into executable plans.",
    color: "#7C3AED",
    icon: "P",
  },
  {
    id: "summarizer",
    displayName: "Summarizer",
    description: "Compresses and organizes shared context.",
    color: "#475569",
    icon: "S",
  },
];

export const AGENT_MAP = AGENTS.reduce(
  (map, agent) => ({
    ...map,
    [agent.id]: agent,
  }),
  {} as Record<AgentType, Agent>
);
