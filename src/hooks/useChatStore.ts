import { useState, useCallback, useEffect } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SEED_MESSAGE: ChatMessage = {
  id: "seed",
  sender: "assistant",
  text: "Ask me anything about this topology, or tell me what to change.",
  timestamp: new Date(),
};

let msgId = 0;

export function useChatStore(topologyId: string) {
  const [threadsByTopology, setThreadsByTopology] = useState<
    Record<string, ChatMessage[]>
  >({});

  const messages = threadsByTopology[topologyId] ?? [SEED_MESSAGE];

  const sendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${++msgId}`,
        sender: "user",
        text,
        timestamp: new Date(),
      };
      const assistantMsg: ChatMessage = {
        id: `msg-${++msgId}`,
        sender: "assistant",
        text: "Thinking…",
        timestamp: new Date(),
      };

      setThreadsByTopology((prev) => {
        const current = prev[topologyId] ?? [SEED_MESSAGE];
        return {
          ...prev,
          [topologyId]: [...current, userMsg, assistantMsg],
        };
      });
    },
    [topologyId]
  );

  return { messages, sendMessage };
}
