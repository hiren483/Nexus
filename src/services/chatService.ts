import { v4 as uuid } from "uuid";

import type {
  SendMessagePayload,
  StreamEvent,
  AgentType,
  RetrievedChunk,
} from "@/types";

export interface ChatService {
  sendMessage(
    payload: SendMessagePayload,
    onEvent: (event: StreamEvent) => void
  ): Promise<void>;
}

const RESPONSES: Record<AgentType, (content: string) => string> = {
  researcher: () =>
    "Qdrant is the strongest fit for this thread because its payload filtering is mature, fast, and straightforward to model. Pinecone and Weaviate are credible, but Qdrant gives the cleanest path for explicit metadata filters and local development.",

  coder: (content) =>
    `I will build against the shared decision to use Qdrant. For "${content}", start with a typed service boundary, keep the collection schema explicit, and isolate the client so the UI never depends on storage details.`,

  critic: () =>
    "The main risks are assuming memory is always relevant, hiding retrieval failures, and letting agent responses mutate shared context without clear status. Add source visibility in developer mode and keep the service contract stable.",

  planner: () =>
    "Sequence this as contracts, mock service, visible chat flow, retrieval trace, then backend replacement. That order keeps the interface stable while proving the user-owned orchestration model.",

  summarizer: () =>
    "So far, the shared thread selected Qdrant, routed implementation work to the coder, and identified reliability risks for hidden context sharing.",
};

const MOCK_RETRIEVED_CHUNKS: RetrievedChunk[] = [
  {
    id: "chunk_1",
    score: 0.92,
    content: "Qdrant selected for payload filtering",
    sourceAgent: "researcher",
    timestamp: new Date().toISOString(),
  },
  {
    id: "chunk_2",
    score: 0.84,
    content: "Sub-10ms latency target for retrieval",
    sourceAgent: "planner",
    timestamp: new Date().toISOString(),
  },
  {
    id: "chunk_3",
    score: 0.71,
    content: "Metadata filters should stay explicit",
    sourceAgent: "critic",
    timestamp: new Date().toISOString(),
  },
];

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

    onEvent({
      type: "status",
      messageId,
      status: "retrieving",
    });

    await sleep(650);

    onEvent({
      type: "retrieved",
      messageId,
      chunks: MOCK_RETRIEVED_CHUNKS,
    });

    await sleep(350);

    onEvent({
      type: "status",
      messageId,
      status: "generating",
    });

    const response = RESPONSES[payload.agent](payload.content);

    const words = response.split(" ");

    for (const word of words) {
      await sleep(35);

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
