"use client";

import { useMemo } from "react";

import { useChatStore } from "@/store/chatStore";

import MessageBubble from "./MessageBubble";

export default function MessageList() {
  const {
    messages,
    activeConversationId,
  } = useChatStore();

  const conversationMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.conversationId ===
          activeConversationId
      ),
    [messages, activeConversationId]
  );

  if (!conversationMessages.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-white">
            What would you like to build today?
          </h2>

          <div className="space-y-2 text-zinc-400">
            <p>@researcher Compare vector databases</p>

            <p>@coder Build a FastAPI endpoint</p>

            <p>@critic Review my architecture</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {conversationMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}