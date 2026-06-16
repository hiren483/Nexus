"use client";

import { useChatStore } from "@/store/chatStore";

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
    deleteConversation,
  } = useChatStore();

  return (
    <aside className="flex w-80 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-4">
        <button
          onClick={createConversation}
          className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          + New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isActive =
            activeConversationId === conversation.id;

          return (
            <div
              key={conversation.id}
              className={`w-full border-b border-zinc-900 p-4 text-left transition ${
                isActive
                  ? "bg-zinc-900 ring-inset ring-1 ring-zinc-700"
                  : "hover:bg-zinc-900/50"
              }`}
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveConversation(conversation.id)
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="truncate font-medium text-white">
                    {conversation.title}
                  </div>

                  <div className="mt-1 truncate text-sm text-zinc-400">
                    {conversation.lastMessage ||
                      "No messages yet"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteConversation(conversation.id)
                  }
                  aria-label={`Delete ${conversation.title}`}
                  title="Delete chat"
                  className="rounded-md px-2 py-1 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
