import { v4 as uuid } from "uuid";

import type {
  SendMessagePayload,
  StreamEvent,
  AgentType,
} from "@/types";

export interface ChatService {
  sendMessage(
    payload: SendMessagePayload,
    onEvent: (event: StreamEvent) => void
  ): Promise<void>;
}

const RESPONSES: Record<AgentType, string> = {
  researcher:
    "Qdrant offers the strongest filtering performance due to payload indexing and efficient filtered search.",

  coder:
    "Based on the earlier decision to use Qdrant, here is a Python client using the official SDK.",

  critic:
    "Potential issues include missing connection pooling, lack of memory expiration, and retrieval latency bottlenecks.",

  planner:
    "Start with message storage, then retrieval, then routing, and finally context optimization.",

  summarizer:
    "The conversation selected Qdrant, generated a Python client, and reviewed architectural risks.",
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class MockChatService implements ChatService {
  async sendMessage(
    payload: SendMessagePayload,
    onEvent: (event: StreamEvent) => void
  ) {
    const messageId = uuid();

    onEvent({
      type: "start",
      messageId,
    });

    await sleep(800);

    const response = RESPONSES[payload.agent];

    const words = response.split(" ");

    for (const word of words) {
      await sleep(40);

      onEvent({
        type: "token",
        messageId,
        content: `${word} `,
      });
    }

    onEvent({
      type: "done",
      messageId,
    });
  }
}

export const chatService = new MockChatService();