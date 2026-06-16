import { create } from "zustand";

import type {
  Agent,
  Conversation,
  Message,
} from "@/types";

import { AGENTS } from "@/assets/data/agents";

interface ChatStore {
  conversations: Conversation[];

  activeConversationId: string | null;

  messages: Message[];

  agents: Agent[];

  socketConnected: boolean;

  setActiveConversation: (id: string) => void;

  createConversation: () => void;

  addMessage: (message: Message) => void;

  updateMessage: (
    id: string,
    updates: Partial<Message>
  ) => void;
}

export const useChatStore = create<ChatStore>(
  (set) => ({
    conversations: [
      {
        id: "conv_1",
        title: "Vector DB Research",
        lastMessage: "Qdrant selected",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "conv_2",
        title: "FastAPI Client",
        lastMessage: "Python SDK generated",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],

    activeConversationId: "conv_1",

    messages: [],

    agents: AGENTS,

    socketConnected: true,

    setActiveConversation: (id) =>
      set({
        activeConversationId: id,
      }),

    createConversation: () =>
      set((state) => {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          title: "New Conversation",
          lastMessage: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          conversations: [
            newConversation,
            ...state.conversations,
          ],
          activeConversationId: newConversation.id,
        };
      }),

    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message],

        conversations: state.conversations.map(
          (conversation) =>
            conversation.id === message.conversationId
              ? {
                  ...conversation,
                  lastMessage: message.content,
                  updatedAt: new Date().toISOString(),
                }
              : conversation
        ),
      })),

    updateMessage: (id, updates) =>
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === id
            ? { ...message, ...updates }
            : message
        ),
      })),
  })
);