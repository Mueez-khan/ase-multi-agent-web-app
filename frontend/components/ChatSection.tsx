"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  Sparkles,
  Paperclip,
  Share2,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type Message = {
  id: number | string;
  conversationId: string;
  role: "User" | "Ai";
  text: unknown;
};

type ApiResponse = {
  response?: Message[];
};

type SendResponse = {
  success: boolean;
  message?: string;
  conversationId?: string;
  userChat?: Message;
  aiChat?: Message;
  result?: unknown;
};

/* =========================================================
   HELPERS
========================================================= */

/**
 * Converts database/API text into a usable value.
 *
 * message.text can be:
 *
 * 1. Normal string
 * 2. JSON string
 * 3. Object
 */
function parseMessageText(text: unknown): unknown {
  if (text === null || text === undefined) {
    return "";
  }

  // Already an object
  if (typeof text === "object") {
    return text;
  }

  // Normal string
  if (typeof text === "string") {
    const trimmed = text.trim();

    if (!trimmed) {
      return "";
    }

    // Try JSON parsing
    try {
      return JSON.parse(trimmed);
    } catch {
      // It is normal Markdown/text
      return text;
    }
  }

  return String(text);
}

/**
 * Remove weird DB key formatting.
 *
 * "backend : " -> "Backend"
 * "frontend :" -> "Frontend"
 */
function formatSectionTitle(key: string): string {
  return key
    .replace(/\s*:\s*$/, "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function MarkdownContent({
  content,
}: {
  content: string;
}) {
  return (
    <div
      className="
        prose
        prose-invert
        max-w-none

        prose-headings:text-zinc-100
        prose-p:text-zinc-300
        prose-li:text-zinc-300
        prose-strong:text-zinc-100

        prose-a:text-teal-400
        prose-a:no-underline
        hover:prose-a:underline

        prose-blockquote:border-teal-500
        prose-blockquote:text-zinc-400

        prose-table:text-sm
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* =========================
             CODE BLOCK
          ========================= */

          pre({ children }) {
            return (
              <pre
                className="
                  my-4
                  overflow-x-auto
                  rounded-xl
                  border
                  border-zinc-700
                  bg-zinc-950
                  p-4
                  text-sm
                  leading-6
                  text-zinc-200
                "
              >
                {children}
              </pre>
            );
          },

          /* =========================
             INLINE / BLOCK CODE
          ========================= */

          code({ children, className }) {
            return (
              <code
                className={
                  className
                    ? `${className} text-sm`
                    : `
                      rounded
                      bg-zinc-700
                      px-1.5
                      py-0.5
                      text-sm
                      text-teal-300
                    `
                }
              >
                {children}
              </code>
            );
          },

          /* =========================
             HEADINGS
          ========================= */

          h1({ children }) {
            return (
              <h1 className="mt-6 mb-4 text-2xl font-bold text-zinc-100">
                {children}
              </h1>
            );
          },

          h2({ children }) {
            return (
              <h2 className="mt-6 mb-3 text-xl font-bold text-zinc-100">
                {children}
              </h2>
            );
          },

          h3({ children }) {
            return (
              <h3 className="mt-5 mb-3 text-lg font-semibold text-zinc-100">
                {children}
              </h3>
            );
          },

          h4({ children }) {
            return (
              <h4 className="mt-4 mb-2 text-base font-semibold text-zinc-100">
                {children}
              </h4>
            );
          },

          /* =========================
             TABLE
          ========================= */

          table({ children }) {
            return (
              <div className="my-5 overflow-x-auto rounded-xl border border-zinc-700">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            );
          },

          th({ children }) {
            return (
              <th className="border-b border-zinc-700 bg-zinc-900 px-4 py-3 text-left font-semibold text-zinc-100">
                {children}
              </th>
            );
          },

          td({ children }) {
            return (
              <td className="border-b border-zinc-800 px-4 py-3 text-zinc-300">
                {children}
              </td>
            );
          },

          /* =========================
             LIST
          ========================= */

          ul({ children }) {
            return (
              <ul className="my-3 list-disc space-y-1 pl-6">
                {children}
              </ul>
            );
          },

          ol({ children }) {
            return (
              <ol className="my-3 list-decimal space-y-1 pl-6">
                {children}
              </ol>
            );
          },

          /* =========================
             PARAGRAPH
          ========================= */

          p({ children }) {
            return (
              <p className="my-3 leading-7 text-zinc-300">
                {children}
              </p>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* =========================================================
   MESSAGE CONTENT
========================================================= */

function RenderMessageText({
  message,
}: {
  message: Message;
}) {
  const parsedText = parseMessageText(message.text);

  /* =======================================================
     NORMAL STRING MESSAGE
  ======================================================= */

  if (typeof parsedText === "string") {
    return <MarkdownContent content={parsedText} />;
  }

  /* =======================================================
     OBJECT MESSAGE
  ======================================================= */

  if (
    typeof parsedText === "object" &&
    parsedText !== null &&
    !Array.isArray(parsedText)
  ) {
    const sections = Object.entries(
      parsedText as Record<string, unknown>
    );

    return (
      <div className="space-y-6">
        {sections.map(([key, value]) => {
          /* -----------------------------------------------
             Only render values that can become text
          ------------------------------------------------ */

          let content = "";

          if (typeof value === "string") {
            content = value;
          } else if (value !== null && value !== undefined) {
            try {
              content = JSON.stringify(value, null, 2);
            } catch {
              content = String(value);
            }
          }

          if (!content.trim()) {
            return null;
          }

          return (
            <section
              key={key}
              className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900/60
              "
            >
              {/* Section Header */}

              <div
                className="
                  border-b
                  border-zinc-700
                  bg-zinc-800/80
                  px-5
                  py-3
                "
              >
                <h3 className="text-sm font-semibold text-teal-400">
                  {formatSectionTitle(key)}
                </h3>
              </div>

              {/* Markdown */}

              <div className="px-5 py-4">
                <MarkdownContent content={content} />
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  /* =======================================================
     FALLBACK
  ======================================================= */

  return (
    <MarkdownContent
      content={String(parsedText)}
    />
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function ChatSection() {
  const params = useParams();

  const conversationId = params.conversationId as string;

  /* =======================================================
     STATE
  ======================================================= */

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  /* =======================================================
     GET EXISTING CONVERSATION
  ======================================================= */

  const handleUserChats = useCallback(async () => {
    if (!conversationId) return;
    setLoadingMessages(true);
    try {
      

      const result = await fetch(
        `/api/user-chats/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!result.ok) {
        throw new Error(
          "Failed to fetch conversation"
        );
      }

      const data: ApiResponse =
        await result.json();

      console.log(
        "Conversation response:",
        data
      );

      if (Array.isArray(data.response)) {
        setMessages(data.response);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Error fetching conversation:",
        error
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [conversationId]);

  /* =======================================================
     LOAD CONVERSATION
  ======================================================= */

  useEffect(() => {
    queueMicrotask(() =>   handleUserChats());
  }, [handleUserChats]);

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSend = async () => {
    if (!input.trim()) return;

    if (sending) return;

    if (!conversationId) return;

    const query = input.trim();

    /* -----------------------------------------------
       Clear input
    ------------------------------------------------ */

    setInput("");

    try {
      setSending(true);

      console.log(
        "Sending query:",
        query
      );

      const result = await fetch(
        `/api/app-build-req/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      if (!result.ok) {
        throw new Error(
          "Failed to send message"
        );
      }

      const data: SendResponse =
        await result.json();

      console.log(
        "Complete send response:",
        data
      );

      /* =================================================
         ADD USER MESSAGE
      ================================================= */

      if (data.userChat) {
        setMessages((prev) => [
          ...prev,
          data.userChat!,
        ]);
      }

      /* =================================================
         ADD AI MESSAGE
      ================================================= */

      if (data.aiChat) {
        setMessages((prev) => [
          ...prev,
          data.aiChat!,
        ]);
      }
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      /*
       * Restore input if request failed
       */

      setInput(query);
    } finally {
      setSending(false);
    }
  };

  /* =======================================================
     ENTER KEY
  ======================================================= */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSend();
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-zinc-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10">
            <Sparkles
              size={18}
              className="text-teal-400"
            />
          </div>

          <div>
            <h1 className="text-sm font-semibold text-zinc-100">
              AI Software Engineer
            </h1>

            <p className="text-xs text-zinc-500">
              Conversation
            </p>
          </div>

        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-zinc-400
            transition
            hover:bg-zinc-800
            hover:text-zinc-100
          "
        >
          <Share2 size={16} />

          <span className="text-sm">
            Share
          </span>
        </button>

      </header>

      {/* =================================================
          MESSAGES
      ================================================= */}

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">

        {/* -----------------------------------------------
            Loading
        ------------------------------------------------ */}

        {loadingMessages &&
          messages.length === 0 && (
            <div className="flex justify-center">
              <div className="text-sm text-zinc-500">
                Loading conversation...
              </div>
            </div>
          )}

        {/* -----------------------------------------------
            Empty Conversation
        ------------------------------------------------ */}

        {!loadingMessages &&
          messages.length === 0 && (
            <div className="flex h-full items-center justify-center">

              <div className="max-w-md text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10">
                  <Sparkles
                    size={24}
                    className="text-teal-400"
                  />
                </div>

                <h2 className="text-xl font-semibold text-zinc-100">
                  Start a new conversation
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Ask the AI Software Engineer
                  to build, explain, or modify
                  something.
                </p>

              </div>

            </div>
          )}

        {/* -----------------------------------------------
            Messages
        ------------------------------------------------ */}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "User"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`
                max-w-5xl
                rounded-2xl
                px-4
                py-3
                text-sm
                leading-relaxed

                ${
                  message.role === "User"
                    ? `
                      bg-teal-500
                      font-medium
                      text-zinc-950
                    `
                    : `
                      w-full
                      bg-zinc-800
                      text-zinc-100
                    `
                }
              `}
            >

              <RenderMessageText
                message={message}
              />

            </div>

          </div>
        ))}

        {/* -----------------------------------------------
            AI Thinking
        ------------------------------------------------ */}

        {sending && (
          <div className="flex justify-start">

            <div className="rounded-2xl bg-zinc-800 px-4 py-3">

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400" />

                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:150ms]" />

                <div className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:300ms]" />

              </div>

            </div>

          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      {/* =================================================
          INPUT
      ================================================= */}

      <div className="shrink-0 border-t border-zinc-800 p-4">

        <div className="mx-auto max-w-4xl">

          <div
            className={`
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-zinc-700
              bg-zinc-800
              px-3
              py-2

              ${
                conversationId
                  ? "block"
                  : "hidden"
              }
            `}
          >

            {/* Attachment */}

            <button
              type="button"
              disabled={sending}
              className="
                rounded-lg
                p-2
                text-zinc-500
                transition
                hover:bg-zinc-700
                hover:text-zinc-200
                disabled:opacity-40
              "
            >
              <Paperclip size={18} />
            </button>

            {/* Input */}

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder={
                sending
                  ? "AI is working..."
                  : "Ask the AI Software Engineer..."
              }
              className="
                flex-1
                bg-transparent
                text-sm
                text-zinc-100
                outline-none
                placeholder:text-zinc-500
                disabled:opacity-50
              "
            />

            {/* Send */}

            <button
              type="button"
              onClick={handleSend}
              disabled={
                !input.trim() || sending
              }
              className="
                rounded-xl
                bg-teal-500
                p-2
                text-zinc-950
                transition
                hover:bg-teal-400
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Send size={18} />
            </button>

          </div>

          <p className="mt-2 text-center text-xs text-zinc-600">
            AI can make mistakes. Check important
            information.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChatSection;