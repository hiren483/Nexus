"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";

import { chatService } from "@/services/chatService";
import { useChatStore } from "@/store/chatStore";
import type { Agent, Message } from "@/types";
import {
  isParseMessageError,
  parseMessage,
} from "@/lib/parseMessage";

import MentionDropdown from "./MentionDropdown";

const mentionQueryPattern = /(?:^|\s)@([a-zA-Z]*)$/;

export default function MessageComposer() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    activeConversationId,
    agents,
    createConversation,
    addMessage,
    updateMessage,
  } = useChatStore();

  const mentionQuery = useMemo(() => {
    const match = value.match(mentionQueryPattern);
    return match?.[1] ?? null;
  }, [value]);

  const filteredAgents = useMemo(() => {
    if (mentionQuery === null) {
      return [];
    }

    return agents.filter((agent) =>
      agent.id.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [agents, mentionQuery]);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);

  const selectMention = (agent: Agent) => {
    setValue((currentValue) => {
      const replacement = currentValue.replace(
        mentionQueryPattern,
        (match) => {
          const leadingSpace = match.startsWith(" ") ? " " : "";
          return `${leadingSpace}@${agent.id} `;
        }
      );

      return replacement || `@${agent.id} `;
    });

    textareaRef.current?.focus();
  };

  const sendMessage = async () => {
    if (isSending) {
      return;
    }

    const parsedMessage = parseMessage(value, agents);

    if (isParseMessageError(parsedMessage)) {
      setError(parsedMessage.message);
      return;
    }

    const conversationId =
      activeConversationId ?? createConversation();
    const now = new Date().toISOString();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId,
      role: "user",
      agent: parsedMessage.agent,
      content: value.trim(),
      timestamp: now,
      status: "complete",
    };

    addMessage(userMessage);
    setValue("");
    setError(null);
    setIsSending(true);

    let agentMessageId = "";
    let streamedContent = "";

    try {
      await chatService.sendMessage(
        {
          conversationId,
          agent: parsedMessage.agent,
          content: parsedMessage.content,
        },
        (event) => {
          if (event.type === "start") {
            agentMessageId = event.messageId;

            addMessage({
              id: event.messageId,
              conversationId,
              role: "agent",
              agent: parsedMessage.agent,
              content: "",
              timestamp: new Date().toISOString(),
              status: "streaming",
              agentStatus: "retrieving",
              metadata: {
                retrievedChunks: [],
              },
            });
          }

          if (event.type === "status") {
            updateMessage(event.messageId, {
              agentStatus: event.status,
            });
          }

          if (event.type === "retrieved") {
            updateMessage(event.messageId, {
              metadata: {
                retrievedChunks: event.chunks,
              },
            });
          }

          if (event.type === "token") {
            streamedContent += event.content;
            updateMessage(event.messageId, {
              content: streamedContent,
            });
          }

          if (event.type === "done") {
            updateMessage(event.messageId, {
              status: "complete",
              agentStatus: "complete",
            });
          }
        }
      );
    } catch {
      if (agentMessageId) {
        updateMessage(agentMessageId, {
          status: "error",
          agentStatus: "complete",
          content:
            "The expert could not respond. Try again in a moment.",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (mentionQuery !== null && filteredAgents.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex(
          (current) => (current + 1) % filteredAgents.length
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex(
          (current) =>
            (current - 1 + filteredAgents.length) %
            filteredAgents.length
        );
        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        selectMention(filteredAgents[highlightedIndex]);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setValue((currentValue) =>
          currentValue.replace(mentionQueryPattern, "")
        );
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="relative">
        {mentionQuery !== null && (
          <MentionDropdown
            agents={filteredAgents}
            highlightedIndex={highlightedIndex}
            query={mentionQuery}
            onSelect={selectMention}
          />
        )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setHighlightedIndex(0);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Message an expert using @..."
        rows={1}
        disabled={isSending}
        className="max-h-40 min-h-14 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 pr-24 text-white outline-none transition placeholder:text-zinc-500 focus:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-70"
      />

        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={isSending}
          className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
        >
          Send
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
