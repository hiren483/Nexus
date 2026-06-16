import { useMemo } from "react";

import { useChatStore } from "@/store/chatStore";

export default function DeveloperPanel() {
  const { messages, activeConversationId } = useChatStore();

  const chunks = useMemo(() => {
    const conversationMessages = messages.filter(
      (message) => message.conversationId === activeConversationId
    );

    return [...conversationMessages]
      .reverse()
      .flatMap(
        (message) => message.metadata?.retrievedChunks ?? []
      )
      .slice(0, 5);
  }, [activeConversationId, messages]);

  return (
    <aside className="w-80 border-l border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">
          Retrieved Context
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Mock memory trace for the active conversation.
        </p>
      </div>

      <div className="space-y-3">
        {chunks.length ? (
          chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
            >
              <div className="text-sm font-medium text-white">
                {Math.round(chunk.score * 100)}% {chunk.content}
              </div>
              {chunk.sourceAgent && (
                <div className="mt-1 text-xs text-zinc-500">
                  source: @{chunk.sourceAgent}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">
            No retrieved context yet.
          </p>
        )}
      </div>
    </aside>
  );
}
