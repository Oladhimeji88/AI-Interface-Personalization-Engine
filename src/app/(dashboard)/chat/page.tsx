"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useUIStore } from "@/lib/store/ui.store";
import { Stack, Box, Inline, Text } from "@atlaskit/primitives";
import Heading from "@atlaskit/heading";
import Lozenge from "@atlaskit/lozenge";
import { MessageCircle, Send, AlertTriangle } from "lucide-react";
import styles from "./page.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// ── Suggestions shown when conversation is empty ─────────────────────────────

const SUGGESTIONS = [
  "Explain my most impactful behavioral insight",
  "Which theme suits deep focus work?",
  "How should I configure the confidence threshold?",
  "What do my analytics patterns tell me?",
];

// ── Timestamp formatter ───────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { setBreadcrumbs } = useUIStore();
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [streaming, setStreaming] = useState(false);
  const [apiMissing, setApiMissing] = useState(false);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBreadcrumbs([
      { label: "AIPE", href: "/" },
      { label: "AI Chat",  href: "/chat" },
    ]);
  }, [setBreadcrumbs]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setStreaming(true);

    // Placeholder for the streaming assistant message
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date() },
    ]);

    try {
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Request failed" }));
        if (response.status === 500 && err.error?.includes("ANTHROPIC_API_KEY")) {
          setApiMissing(true);
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Error: ${err.error ?? "Request failed"}` }
              : m
          )
        );
        return;
      }

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `Error: ${msg}` } : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [messages, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Box padding="space.400">
      <div className={styles.chatShell}>

        {/* ── Header ────────────────────────────────────────── */}
        <Stack space="space.150">
          <Inline space="space.100" alignBlock="center">
            <Lozenge appearance="inprogress" isBold>Claude</Lozenge>
            <Lozenge appearance="success">Streaming</Lozenge>
          </Inline>
          <Heading size="xlarge">AI Assistant</Heading>
          <Text color="color.text.subtle">
            Ask about your insights, themes, design tokens, or how to get the most from AIPE.
          </Text>
        </Stack>

        {/* ── API key warning ────────────────────────────────── */}
        {apiMissing && (
          <div className={styles.apiWarning}>
            <AlertTriangle size={16} className={styles.apiWarningIcon} />
            <Text size="small" color="color.text">
              Add your Anthropic API key to{" "}
              <span className={styles.apiWarningCode}>.env.local</span>
              {" "}and restart the dev server.{" "}
              Get a key at{" "}console.anthropic.com
            </Text>
          </div>
        )}

        {/* ── Messages ──────────────────────────────────────── */}
        {isEmpty ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <MessageCircle size={24} />
            </div>
            <Stack space="space.100" alignInline="center">
              <Text weight="semibold" color="color.text">How can I help?</Text>
              <Text size="small" color="color.text.subtlest" align="center">
                Ask anything about your personalization setup, insights, or design tokens.
              </Text>
            </Stack>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.suggestionBtn}
                  onClick={() => sendMessage(s)}
                  disabled={streaming}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={msg.role === "user" ? styles.messageRowUser : styles.messageRow}>
                  <div className={msg.role === "user" ? styles.avatarUser : styles.avatarAI}>
                    {msg.role === "user" ? "U" : "Ω"}
                  </div>
                  <div>
                    {msg.role === "assistant" && msg.content === "" ? (
                      <div className={`${styles.bubbleAI} ${styles.typingDots}`}>
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                        <div className={styles.dot} />
                      </div>
                    ) : (
                      <div className={msg.role === "user" ? styles.bubbleUser : styles.bubbleAI}>
                        {msg.content}
                      </div>
                    )}
                    <div className={`${styles.timestamp} ${msg.role === "user" ? styles.timestampUser : ""}`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── Input ─────────────────────────────────────────── */}
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask about insights, themes, tokens…"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={streaming}
              className={styles.textarea}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
          <div className={styles.inputHint}>
            Enter to send · Shift+Enter for newline
          </div>
        </div>

      </div>
    </Box>
  );
}
