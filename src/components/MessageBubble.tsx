"use client";
import type { Message } from "@/types";
import { AGENT_MAP } from "@/assets/data/agents";

interface Props {
  message: Message;
}

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === "user";

  const agent = message.agent
    ? AGENT_MAP[message.agent]
    : null;

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-zinc-800 text-white"
            : "bg-zinc-900 text-zinc-100"
        }`}
      >
        {!isUser && agent && (
          <div
            className="mb-2 flex items-center gap-2 text-sm font-medium"
            style={{ color: agent.color }}
          >
            <span>{agent.icon}</span>

            <span>@{agent.id}</span>
          </div>
        )}

        <div className="whitespace-pre-wrap">
          {message.content}
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          {new Date(message.timestamp).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </div>
      </div>
    </div>
  );
}