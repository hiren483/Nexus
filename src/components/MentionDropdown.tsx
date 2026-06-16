import type { Agent } from "@/types";

interface MentionDropdownProps {
  agents: Agent[];
  highlightedIndex: number;
  query: string;
  onSelect: (agent: Agent) => void;
}

export default function MentionDropdown({
  agents,
  highlightedIndex,
  query,
  onSelect,
}: MentionDropdownProps) {
  const filteredAgents = agents.filter((agent) =>
    agent.id.toLowerCase().includes(query.toLowerCase())
  );

  if (!filteredAgents.length) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
      {filteredAgents.map((agent, index) => {
        const isHighlighted = index === highlightedIndex;

        return (
          <button
            key={agent.id}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(agent);
            }}
            className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
              isHighlighted ? "bg-zinc-800" : "hover:bg-zinc-900"
            }`}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-white"
              style={{ backgroundColor: agent.color }}
            >
              {agent.icon}
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-medium text-white">
                @{agent.id}
              </span>
              <span className="block truncate text-xs text-zinc-400">
                {agent.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
