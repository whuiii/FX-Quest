
/**
 * ==========================================================
 * FX QUEST — PIP AI CHAT PANEL
 * ==========================================================
 *
 * A fantasy-themed AI learning assistant powered by Gemini.
 *
 * Features:
 * - Pastel adventure-game appearance
 * - Pip mascot and welcoming message
 * - Suggested finance questions
 * - User and AI message bubbles
 * - Markdown-formatted AI explanations
 * - Animated thinking indicator
 * - Error handling and retry
 * - Responsive desktop/mobile layout
 * - Optional game role and mission context
 *
 * Backend:
 * http://localhost:3001/api/chat
 *
 * The Gemini API key stays on the Express backend.
 * ==========================================================
 */

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  BookOpen,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import pipImage from "../../assets/pip.png";

// ==========================================================
// TYPES
// ==========================================================

type PipRole = "student" | "traveller" | "business";

type MessageRole = "user" | "assistant";

interface PipMessage {
  id: number;
  role: MessageRole;
  content: string;
}

interface PipChatPanelProps {
  open: boolean;
  onClose: () => void;

  // Optional FX Quest game context.
  role?: PipRole | null;
  currentMission?: string;
}

interface ChatApiResponse {
  reply?: string;
  error?: string;
}

// ==========================================================
// CONFIGURATION
// ==========================================================

// const CHAT_API_URL = "http://localhost:3001/api/chat";
const CHAT_API_URL = "/api/chat";

const MAX_MESSAGE_LENGTH = 1000;

// Starter questions tailored to each playable role.
const suggestedQuestions: Record<
  PipRole | "default",
  string[]
> = {
  student: [
    "What is Purchasing Power Parity?",
    "How does inflation affect exchange rates?",
    "Explain currency appreciation with MYR and USD.",
  ],

  traveller: [
    "How do I convert MYR to JPY?",
    "What happens when my currency weakens?",
    "How does inflation affect my travel budget?",
  ],

  business: [
    "What is foreign exchange risk?",
    "How does currency hedging work?",
    "Explain a forward contract with an example.",
  ],

  default: [
    "Explain exchange rates simply.",
    "What is Purchasing Power Parity?",
    "How can I protect against currency risk?",
  ],
};

// ==========================================================
// COMPONENT
// ==========================================================

export default function PipChatPanel({
  open,
  onClose,
  role = null,
  currentMission = "",
}: PipChatPanelProps) {
  // --------------------------------------------------------
  // CHAT STATE
  // --------------------------------------------------------

  const [messages, setMessages] = useState<PipMessage[]>([]);

  const [draft, setDraft] = useState("");

  const [isSending, setIsSending] = useState(false);

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const nextMessageId = useRef(0);

  const activeRequest = useRef<AbortController | null>(null);

  // Create stable, unique IDs for rendered messages.
  function createMessageId() {
    nextMessageId.current += 1;
    return nextMessageId.current;
  }

  // --------------------------------------------------------
  // ROLE-BASED PRESENTATION
  // --------------------------------------------------------

  const roleLabel =
    role === "student"
      ? "Student Explorer"
      : role === "traveller"
        ? "World Traveller"
        : role === "business"
          ? "Business Adventurer"
          : "Finance Explorer";

  const questions =
    suggestedQuestions[role ?? "default"];

  // --------------------------------------------------------
  // FOCUS AND SCROLL EFFECTS
  // --------------------------------------------------------

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const scrollArea = scrollAreaRef.current;

    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isSending, errorMessage, open]);

  // Escape closes the chat without losing its history.
  useEffect(() => {
    if (!open) return;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  // Cancel pending browser requests when unmounting.
  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  // --------------------------------------------------------
  // SEND MESSAGE TO GEMINI BACKEND
  // --------------------------------------------------------

  async function sendMessage(
    question: string,
    retry = false
  ) {
    if (isSending) return;

    const text = question.trim();

    // Do not send blank or oversized user messages.
    if (
      !retry &&
      (!text || text.length > MAX_MESSAGE_LENGTH)
    ) {
      return;
    }

    // When retrying, reuse the existing conversation.
    // Otherwise, append the new user question.
    const nextMessages: PipMessage[] = retry
      ? messages
      : [
          ...messages,
          {
            id: createMessageId(),
            role: "user",
            content: text,
          },
        ];

    if (
      nextMessages.length === 0 ||
      nextMessages[nextMessages.length - 1].role !==
        "user"
    ) {
      return;
    }

    if (!retry) {
      setMessages(nextMessages);
      setDraft("");
    }

    setErrorMessage(null);
    setIsSending(true);

    const controller = new AbortController();

    activeRequest.current = controller;

    try {
      // The backend allows up to 12 messages per request.
      // Keep recent history so long conversations still work.
      const recentMessages = nextMessages
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await fetch(CHAT_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: controller.signal,

        body: JSON.stringify({
          messages: recentMessages,

          context: {
            role,
            currentMission,
          },
        }),
      });

      // Read success or error details from Express.
      const data = (await response
        .json()
        .catch(() => ({}))) as ChatApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Pip couldn't answer your question."
        );
      }

      const reply = data.reply?.trim();

      if (!reply) {
        throw new Error(
          "Pip didn't return an explanation. Please try again."
        );
      }

      // Add Gemini's response to the conversation.
      setMessages((previous) => [
        ...previous,
        {
          id: createMessageId(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error: unknown) {
      // Ignore intentional cancellation.
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      if (
        error instanceof TypeError &&
        message.includes("fetch")
      ) {
        setErrorMessage(
          "Pip can't reach the local AI backend. Check that server/index.ts is running on port 3001."
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
      }

      setIsSending(false);
    }
  }

  // --------------------------------------------------------
  // INPUT HANDLERS
  // --------------------------------------------------------

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void sendMessage(draft);
  }

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    // Enter sends; Shift + Enter inserts a new line.
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      void sendMessage(draft);
    }
  }

  function clearConversation() {
    if (isSending) return;

    setMessages([]);
    setDraft("");
    setErrorMessage(null);

    textareaRef.current?.focus();
  }

  // Hide the interface without discarding conversation state.
  if (!open) return null;

  // ========================================================
  // CHAT INTERFACE
  // ========================================================

  return (
    <section
      role="dialog"
      aria-label="Pip AI Finance Adventure Buddy"
      aria-modal="false"
      className="
        fixed bottom-[88px] left-3 right-3 z-[100]
        flex h-[min(650px,calc(100dvh-108px))]
        flex-col overflow-hidden
        rounded-[28px]
        border-[3px] border-white/90
        bg-[#FFFCF3]
        shadow-[0_24px_75px_rgba(30,91,101,0.28)]
        sm:bottom-24 sm:left-auto sm:right-6
        sm:w-[420px]
      "
    >
      {/* =================================================
          DECORATIVE HEADER
         ================================================= */}

      <header
        className="
          relative shrink-0 overflow-hidden
          border-b border-[#C8E9E1]
          bg-gradient-to-br
          from-[#B9F2E5]
          via-[#D3F8EA]
          to-[#F8E9B7]
          px-4 pb-4 pt-4
        "
      >
        {/* Decorative floating shapes */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -right-8 -top-10 h-36 w-36
            rounded-full bg-white/30 blur-xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            bottom-[-40px] left-[-30px]
            h-28 w-28 rounded-full
            bg-[#7FD5C5]/25 blur-xl
          "
        />

        <div className="relative flex items-center gap-3">
          {/* Pip avatar */}
          <div
            className="
              relative flex h-[66px] w-[66px]
              shrink-0 items-center justify-center
              rounded-[22px]
              border-2 border-white/90
              bg-white/65
              shadow-[0_6px_18px_rgba(37,120,113,0.14)]
            "
          >
            <img
              src={pipImage}
              alt="Pip, your FX Quest learning companion"
              className="h-[61px] w-[61px] object-contain"
            />

            <span
              aria-label="Pip AI is ready"
              className="
                absolute -bottom-1 -right-1
                h-4 w-4 rounded-full
                border-[3px] border-white
                bg-[#45BE8F]
              "
            />
          </div>

          {/* Heading */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2
                className="
                  font-display text-[22px]
                  font-extrabold leading-tight
                  text-[#225E60]
                "
              >
                Pip AI
              </h2>

              <Sparkles
                size={19}
                className="text-[#E7A33F]"
                strokeWidth={2.5}
              />
            </div>

            <p
              className="
                mt-0.5 text-xs font-extrabold
                text-[#4B8E83]
              "
            >
              Your Finance Adventure Buddy
            </p>

            <div
              className="
                mt-1.5 inline-flex items-center gap-1.5
                rounded-full border border-white/80
                bg-white/65 px-2.5 py-1
                text-[10px] font-extrabold
                text-[#478A7E]
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#43BA8B]" />
              Here to help you learn!
            </div>
          </div>

          {/* Header buttons */}
          <div className="flex shrink-0 items-start gap-1">
            <button
              type="button"
              onClick={clearConversation}
              disabled={isSending || messages.length === 0}
              aria-label="Clear conversation"
              title="Clear conversation"
              className="
                flex h-9 w-9 items-center
                justify-center rounded-xl
                bg-white/65 text-[#447A75]
                transition hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Trash2 size={16} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Pip AI chat"
              title="Close chat"
              className="
                flex h-9 w-9 items-center
                justify-center rounded-xl
                bg-white/70 text-[#447A75]
                transition hover:bg-white
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          CHAT SCROLL AREA
         ================================================= */}

      <div
        ref={scrollAreaRef}
        className="
          min-h-0 flex-1
          space-y-4 overflow-y-auto
          bg-gradient-to-b
          from-[#F8FFFA]
          via-[#FFFCF6]
          to-[#FFF8EB]
          px-4 py-5
          [scrollbar-color:#C3E8DB_transparent]
          [scrollbar-width:thin]
        "
      >
        {/* Welcome message — not sent to the API */}
        <div className="flex items-start gap-2.5">
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl border border-[#D4EDE6]
              bg-[#E5F8EE]
            "
          >
            <img
              src={pipImage}
              alt=""
              className="h-8 w-8 object-contain"
            />
          </div>

          <div className="max-w-[85%]">
            <p
              className="
                mb-1 text-[11px] font-extrabold
                text-[#438E7F]
              "
            >
              Pip
            </p>

            <div
              className="
                rounded-2xl rounded-tl-md
                border border-[#D9EDE2]
                bg-white px-3.5 py-3
                text-[13px] leading-relaxed
                text-[#47636A]
                shadow-sm
              "
            >
              <p>
                Hey, {roleLabel}! 🌟
              </p>

              <p className="mt-2">
                I'm Pip, your little finance adventure buddy!
                Need help with exchange rates, inflation,
                or a tricky mission?
              </p>

              <p className="mt-2 font-bold text-[#268D80]">
                Ask me anything — we'll figure it out together!
                💚
              </p>
            </div>
          </div>
        </div>

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="pl-[46px]">
            <div
              className="
                mb-2 flex items-center gap-1.5
                text-[11px] font-extrabold
                text-[#66958B]
              "
            >
              <BookOpen size={13} />
              Try asking Pip...
            </div>

            <div className="flex flex-wrap gap-2">
              {questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={isSending}
                  onClick={() => {
                    void sendMessage(question);
                  }}
                  className="
                    rounded-xl border
                    border-[#CBE7DF]
                    bg-[#EEFAF4]
                    px-3 py-2 text-left
                    text-[11px] font-bold
                    leading-snug text-[#387E77]
                    shadow-sm transition
                    hover:-translate-y-0.5
                    hover:border-[#8BD2BD]
                    hover:bg-[#E0F7EC]
                    disabled:opacity-50
                  "
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actual conversation */}
        <div aria-live="polite" className="space-y-4">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div
                    className="
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-xl border border-[#D4EDE6]
                      bg-[#E5F8EE]
                    "
                  >
                    <img
                      src={pipImage}
                      alt=""
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                )}

                <div className="max-w-[85%] min-w-0">
                  <p
                    className={`mb-1 text-[11px] font-extrabold ${
                      isUser
                        ? "text-right text-[#9B83A9]"
                        : "text-[#438E7F]"
                    }`}
                  >
                    {isUser ? "You" : "Pip"}
                  </p>

                  <div
                    className={
                      isUser
                        ? `
                          rounded-2xl rounded-tr-md
                          border border-[#E2CDEB]
                          bg-gradient-to-br
                          from-[#F5E5FF]
                          to-[#EDE9FF]
                          px-3.5 py-3
                          text-[13px] leading-relaxed
                          text-[#654F78]
                          shadow-sm
                        `
                        : `
                          rounded-2xl rounded-tl-md
                          border border-[#D9EDE2]
                          bg-white
                          px-3.5 py-3
                          text-[13px] leading-relaxed
                          text-[#47636A]
                          shadow-sm
                        `
                    }
                  >
                    <div className="break-words space-y-2">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="whitespace-pre-wrap">
                              {children}
                            </p>
                          ),

                          strong: ({ children }) => (
                            <strong className="font-extrabold text-[#226F70]">
                              {children}
                            </strong>
                          ),

                          ul: ({ children }) => (
                            <ul className="list-disc space-y-1 pl-4">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="list-decimal space-y-1 pl-4">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li>{children}</li>
                          ),

                          code: ({ children }) => (
                            <code
                              className="
                                rounded bg-black/5
                                px-1 py-0.5
                                text-[12px]
                              "
                            >
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            ANIMATED TYPING INDICATOR
           ================================================= */}

        {isSending && (
          <div
            className="flex items-start gap-2.5"
            role="status"
            aria-label="Pip is thinking"
          >
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl bg-[#E5F8EE]
              "
            >
              <img
                src={pipImage}
                alt=""
                className="h-8 w-8 object-contain"
              />
            </div>

            <div
              className="
                rounded-2xl rounded-tl-md
                border border-[#D9EDE2]
                bg-white px-4 py-3
                shadow-sm
              "
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#67958B]">
                  Pip is thinking
                </span>

                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="
                      h-1.5 w-1.5
                      animate-bounce rounded-full
                      bg-[#56BFA3]
                    "
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE AND RETRY
           ================================================= */}

        {errorMessage && (
          <div
            role="alert"
            className="
              rounded-2xl border
              border-[#F0C9B9]
              bg-[#FFF1E9]
              px-3.5 py-3
              text-xs text-[#9B6154]
            "
          >
            <p className="font-bold">
              🌧️ Oops! Pip couldn't answer just now.
            </p>

            <p className="mt-1 leading-relaxed">
              {errorMessage}
            </p>

            <button
              type="button"
              disabled={isSending}
              onClick={() => {
                void sendMessage("", true);
              }}
              className="
                mt-3 inline-flex items-center
                gap-1.5 rounded-xl
                bg-white px-3 py-2
                font-extrabold text-[#B06F5F]
                shadow-sm transition
                hover:bg-[#FFF9F5]
                disabled:opacity-50
              "
            >
              <RotateCcw size={13} />
              Try again
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          MESSAGE COMPOSER
         ================================================= */}

      <div
        className="
          shrink-0 border-t border-[#E1EDE4]
          bg-white/95 px-3 pb-3 pt-3
        "
      >
        <form
          onSubmit={handleSubmit}
          className="
            flex items-end gap-2
            rounded-[19px]
            border-2 border-[#D4EBE2]
            bg-[#F8FCF8]
            p-1.5
            transition-colors
            focus-within:border-[#89CDB8]
          "
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
            onKeyDown={handleInputKeyDown}
            disabled={isSending}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={2}
            aria-label="Ask Pip a finance question"
            placeholder="Ask Pip about finance or your mission..."
            className="
              min-h-[44px] max-h-28
              flex-1 resize-none
              bg-transparent px-2 py-2
              text-[13px] leading-relaxed
              text-[#365C62]
              placeholder:text-[#93ABA7]
              outline-none
              disabled:opacity-60
            "
          />

          <button
            type="submit"
            disabled={
              isSending ||
              !draft.trim()
            }
            aria-label="Send message to Pip"
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-[15px]
              bg-gradient-to-br
              from-[#55C6AD]
              to-[#319E91]
              text-white
              shadow-[0_4px_12px_rgba(58,165,141,0.25)]
              transition
              hover:scale-[1.04]
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:scale-100
            "
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </form>

        <div
          className="
            mt-2 flex items-center
            justify-between gap-2
            px-1 text-[10px]
            font-semibold text-[#99AAA4]
          "
        >
          <span className="flex items-center gap-1">
            <Sparkles size={11} />
            Your friendly FX Quest learning buddy
          </span>

          <span>
            {draft.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>
    </section>
  );
}
