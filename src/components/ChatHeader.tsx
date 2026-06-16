"use client";

import { useChatStore } from "@/store/chatStore";

export default function ChatHeader() {
  const {
    conversations,
    activeConversationId,
    messages,
  } = useChatStore();

  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  const messageCount = messages.filter(
    (message) =>
      message.conversationId === activeConversationId
  ).length;

  return (
    <header className="border-b border-zinc-800 p-4">
      <h1 className="text-lg font-semibold text-white">
        {activeConversation?.title ?? "Conversation"}
      </h1>

      <p className="mt-1 text-sm text-zinc-400">
        {messageCount} messages
      </p>
    </header>
  );
}