import type {
  Agent,
  ParseMessageError,
  ParsedMessage,
} from "@/types";

const mentionPattern = /@([a-zA-Z][\w-]*)/g;

export function parseMessage(
  input: string,
  agents: Agent[]
): ParsedMessage | ParseMessageError {
  const trimmedInput = input.trim();
  const matches = [...trimmedInput.matchAll(mentionPattern)];

  if (matches.length === 0) {
    return { message: "Please mention an expert." };
  }

  if (matches.length > 1) {
    return { message: "Please select only one expert." };
  }

  const [match] = matches;
  const agentId = match[1];
  const agent = agents.find((item) => item.id === agentId);

  if (!agent) {
    return { message: "Unknown expert." };
  }

  const content = trimmedInput
    .replace(match[0], "")
    .replace(/\s+/g, " ")
    .trim();

  if (!content) {
    return { message: "Please add a message for the expert." };
  }

  return {
    agent: agent.id,
    content,
  };
}

export function isParseMessageError(
  result: ParsedMessage | ParseMessageError
): result is ParseMessageError {
  return "message" in result;
}
