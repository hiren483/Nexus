import { v4 as uuid } from "uuid";

import type {
  SendMessagePayload,
  StreamEvent,
} from "@/types";

export interface ChatService {
  sendMessage(
    payload: SendMessagePayload,
    onEvent: (event: StreamEvent) => void
  ): Promise<void>;
}

interface ChatApiResponse {
  content: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const streamContent = (
  messageId: string,
  content: string,
  onEvent: (event: StreamEvent) => void
) => {
  onEvent({
    type: "token",
    messageId,
    content,
  });
};

class ApiChatService implements ChatService {
  async sendMessage(
    payload: SendMessagePayload,
    onEvent: (event: StreamEvent) => void
  ) {
    const messageId = uuid();

    onEvent({
      type: "start",
      messageId,
    });

    onEvent({
      type: "status",
      messageId,
      status: "retrieving",
    });

    onEvent({
      type: "retrieved",
      messageId,
      chunks: [],
    });

    onEvent({
      type: "status",
      messageId,
      status: "generating",
    });

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: payload.conversationId,
        agent: payload.agent,
        content: payload.content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API failed with ${response.status}`);
    }

    const data = (await response.json()) as ChatApiResponse;
    streamContent(messageId, data.content, onEvent);

    onEvent({
      type: "done",
      messageId,
    });
  }
}

export const chatService = new ApiChatService();
