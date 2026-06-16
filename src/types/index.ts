export type AgentType =
  | "researcher"
  | "coder"
  | "critic"
  | "planner"
  | "summarizer";

export type MessageRole = "user" | "agent";

export type MessageStatus =
  | "sending"
  | "streaming"
  | "complete"
  | "error";

export type AgentStatus =
  | "idle"
  | "retrieving"
  | "generating"
  | "complete";

export interface Agent {
  id: AgentType;

  displayName: string;

  description: string;

  color: string;

  icon: string;
}

export interface Conversation {
  id: string;

  title: string;

  lastMessage: string;

  createdAt: string;

  updatedAt: string;
}

export interface RetrievedChunk {
  id: string;

  score: number;

  content: string;

  sourceAgent?: AgentType;

  timestamp: string;
}

export interface Message {
  id: string;

  conversationId: string;

  role: MessageRole;

  agent?: AgentType;

  content: string;

  timestamp: string;

  status: MessageStatus;

  agentStatus?: AgentStatus;

  metadata?: {
    retrievedChunks?: RetrievedChunk[];
  };
}

export interface SendMessagePayload {
  conversationId: string;

  agent: AgentType;

  content: string;
}

export interface StreamStartEvent {
  type: "start";

  messageId: string;
}

export interface StreamStatusEvent {
  type: "status";

  messageId: string;

  status: AgentStatus;
}

export interface StreamRetrievedEvent {
  type: "retrieved";

  messageId: string;

  chunks: RetrievedChunk[];
}

export interface StreamTokenEvent {
  type: "token";

  messageId: string;

  content: string;
}

export interface StreamDoneEvent {
  type: "done";

  messageId: string;
}

export type StreamEvent =
  | StreamStartEvent
  | StreamStatusEvent
  | StreamRetrievedEvent
  | StreamTokenEvent
  | StreamDoneEvent;

export interface ParsedMessage {
  agent: AgentType;

  content: string;
}

export interface ParseMessageError {
  message: string;
}
