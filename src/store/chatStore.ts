import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Agent,
  Conversation,
  Message,
} from "@/types";

import { AGENTS } from "@/data/agents";

const seedConversationIds = new Set(["conv_1", "conv_2"]);

const removeEmptySeedConversations = (
  conversations: Conversation[],
  messages: Message[]
) =>
  conversations.filter((conversation) => {
    if (!seedConversationIds.has(conversation.id)) {
      return true;
    }

    return messages.some(
      (message) => message.conversationId === conversation.id
    );
  });

interface ChatStore {
  conversations: Conversation[];

  activeConversationId: string | null;

  messages: Message[];

  agents: Agent[];

  socketConnected: boolean;

  setActiveConversation: (id: string) => void;

  createConversation: () => string;

  deleteConversation: (id: string) => void;

  addMessage: (message: Message) => void;

  updateMessage: (
    id: string,
    updates: Partial<Message>
  ) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      conversations: [],

      activeConversationId: null,

      messages: [],

      agents: AGENTS,

      socketConnected: true,

      setActiveConversation: (id) =>
        set({
          activeConversationId: id,
        }),

      createConversation: () => {
        const createdAt = new Date().toISOString();
        const id = crypto.randomUUID();
        const newConversation: Conversation = {
          id,
          title: "New Conversation",
          lastMessage: "",
          createdAt,
          updatedAt: createdAt,
        };

        set((state) => ({
          conversations: [
            newConversation,
            ...state.conversations,
          ],
          activeConversationId: id,
        }));

        return id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const remainingConversations =
            state.conversations.filter(
              (conversation) => conversation.id !== id
            );
          const activeConversationWasDeleted =
            state.activeConversationId === id;

          return {
            conversations: remainingConversations,
            messages: state.messages.filter(
              (message) => message.conversationId !== id
            ),
            activeConversationId: activeConversationWasDeleted
              ? remainingConversations[0]?.id ?? null
              : state.activeConversationId,
          };
        }),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],

          conversations: state.conversations.map((conversation) => {
            if (conversation.id !== message.conversationId) {
              return conversation;
            }

            const firstConversationMessage = !state.messages.some(
              (item) => item.conversationId === message.conversationId
            );
            const mentionLabel = message.agent
              ? `@${message.agent}: `
              : "";

            return {
              ...conversation,
              title: firstConversationMessage
                ? message.content.slice(0, 42)
                : conversation.title,
              lastMessage: `${mentionLabel}${message.content}`.trim(),
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === id
              ? { ...message, ...updates }
              : message
          ),
          conversations: state.conversations.map((conversation) => {
            const updatedMessage = state.messages.find(
              (message) => message.id === id
            );

            if (
              !updatedMessage ||
              conversation.id !== updatedMessage.conversationId
            ) {
              return conversation;
            }

            return {
              ...conversation,
              lastMessage: updates.content ?? conversation.lastMessage,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
    }),
    {
      name: "multillmchat.chat",
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        messages: state.messages,
        socketConnected: state.socketConnected,
      }),
      merge: (persistedState, currentState) => {
        const persistedChatState =
          persistedState as Partial<ChatStore>;
        const messages = persistedChatState.messages ?? [];
        const conversations = removeEmptySeedConversations(
          persistedChatState.conversations ?? [],
          messages
        );
        const activeConversationStillExists =
          conversations.some(
            (conversation) =>
              conversation.id ===
              persistedChatState.activeConversationId
          );

        return {
          ...currentState,
          ...persistedChatState,
          conversations,
          messages,
          activeConversationId: activeConversationStillExists
            ? persistedChatState.activeConversationId ?? null
            : conversations[0]?.id ?? null,
          agents: AGENTS,
        };
      },
    }
  )
);
