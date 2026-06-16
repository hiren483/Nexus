"use client";

import { useMemo } from "react";

import { useChatStore } from "@/store/chatStore";

export default function ChatHeader() {
  const {
    conversations,
    activeConversationId,
    messages,
    agents,
    socketConnected,
  } = useChatStore();

  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  const conversationMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.conversationId === activeConversationId
      ),
    [activeConversationId, messages]
  );

  const activeAgents = agents.filter((agent) =>
    conversationMessages.some(
      (message) => message.agent === agent.id
    )
  );

  return (
    <header className="flex items-center justify-between p-4">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-white">
          {activeConversation?.title ?? "Conversation"}
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          {conversationMessages.length} messages
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 md:flex">
          {activeAgents.map((agent) => (
            <span
              key={agent.id}
              className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold text-white"
              title={agent.displayName}
              style={{ backgroundColor: agent.color }}
            >
              {agent.icon}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span
            className={`h-2 w-2 rounded-full ${
              socketConnected ? "bg-emerald-500" : "bg-zinc-600"
            }`}
          />
          <span>{socketConnected ? "Mock service" : "Offline"}</span>
        </div>
      </div>
    </header>
  );
}
