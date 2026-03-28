import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useChatStore } from "@/hooks/useChatStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatSidebarProps {
  topologyId: string;
  topologyName: string;
}

export default function ChatSidebar({ topologyId, topologyName }: ChatSidebarProps) {
  const { messages, sendMessage } = useChatStore(topologyId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 96) + "px";
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Chat</span>
          <Badge variant="secondary" className="text-xs max-w-[140px] truncate">
            {topologyName}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-muted-foreground mb-0.5 px-1">
              {msg.sender === "user" ? "You" : "Assistant"} · {formatTime(msg.timestamp)}
            </span>
            <div
              className={`rounded-lg px-3 py-2 text-sm max-w-[90%] ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            rows={1}
            placeholder="Ask about this topology…"
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ maxHeight: 96 }}
          />
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={!draft.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
