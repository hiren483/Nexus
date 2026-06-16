import type { Agent, AgentStatus } from "@/types";

interface TypingIndicatorProps {
  agent: Agent;
  status: AgentStatus;
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "is idle",
  retrieving: "is retrieving context...",
  generating: "is thinking...",
  complete: "finished",
};

export default function TypingIndicator({
  agent,
  status,
}: TypingIndicatorProps) {
  if (status === "idle" || status === "complete") {
    return null;
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: agent.color }}
      />
      <span>
        @{agent.id} {STATUS_LABELS[status]}
      </span>
    </div>
  );
}
