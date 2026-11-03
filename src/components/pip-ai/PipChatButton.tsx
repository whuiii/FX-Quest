
/**
 * ==========================================================
 * FX QUEST — PIP AI FLOATING CHAT BUTTON
 * ==========================================================
 *
 * Purpose:
 * - Display Pip as a floating AI assistant.
 * - Open or close the Pip AI chat panel.
 * - Match FX Quest's pastel fantasy adventure theme.
 *
 * Features:
 * - Animated Pip mascot
 * - Mint-green magical glow
 * - Floating sparkles
 * - Hover tooltip
 * - Open/close icon indicator
 * - Mobile-friendly position
 * - Accessible keyboard interactions
 *
 * The open state is controlled by the parent component.
 * ==========================================================
 */

import { MessageCircle, Sparkles, X } from "lucide-react";

import pipImage from "../../assets/pip.png";

// ==========================================================
// COMPONENT PROPS
// ==========================================================

interface PipChatButtonProps {
  open: boolean;
  onClick: () => void;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function PipChatButton({
  open,
  onClick,
}: PipChatButtonProps) {
  return (
    <div
      className="
        fixed bottom-5 right-4 z-[110]
        sm:bottom-6 sm:right-6
      "
    >
      {/* ==================================================
          HOVER TOOLTIP
         ================================================== */}

      {!open && (
        <div
          className="
            pointer-events-none absolute
            bottom-[24px] right-[92px]
            hidden whitespace-nowrap
            rounded-2xl border-2
            border-white bg-[#FFFCF0]
            px-4 py-2.5
            text-center
            opacity-0
            shadow-[0_8px_24px_rgba(50,118,109,0.18)]
            transition-all duration-300
            group-hover:opacity-100
            sm:block
          "
        >
          <div className="flex items-center gap-1.5">
            <Sparkles
              size={14}
              className="text-[#E6AD45]"
            />

            <span
              className="
                font-display text-[13px]
                font-extrabold text-[#327E75]
              "
            >
              Need a little help?
            </span>
          </div>

          <p className="mt-0.5 text-[11px] font-bold text-[#76958F]">
            Ask Pip AI!
          </p>
        </div>
      )}

      {/* ==================================================
          FLOATING BUTTON
         ================================================== */}

      <button
        type="button"
        onClick={onClick}
        aria-label={
          open
            ? "Close Pip AI chat"
            : "Open Pip AI chat"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        title={
          open
            ? "Close Pip AI"
            : "Chat with Pip AI"
        }
        className={`
          group relative
          flex h-[78px] w-[78px]
          items-center justify-center
          rounded-[27px]
          border-[3px] border-white
          outline-none
          transition-all duration-300
          focus-visible:ring-4
          focus-visible:ring-[#65CFB9]/60

          ${
            open
              ? `
                scale-[0.94]
                bg-gradient-to-br
                from-[#7BCCC2]
                to-[#388D85]
                shadow-[0_8px_25px_rgba(36,130,119,0.28)]
              `
              : `
                bg-gradient-to-br
                from-[#B9F5DF]
                via-[#93E5CF]
                to-[#5BC6B3]
                shadow-[0_9px_0_#42A891,0_17px_30px_rgba(40,143,127,0.25)]
                hover:-translate-y-1
                hover:rotate-[-3deg]
                hover:shadow-[0_12px_0_#42A891,0_22px_35px_rgba(40,143,127,0.28)]
                active:translate-y-1
                active:shadow-[0_3px_0_#42A891,0_7px_18px_rgba(40,143,127,0.20)]
              `
          }
        `}
      >
        {/* Soft internal glow */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute
            inset-[5px] rounded-[20px]
            bg-gradient-to-br
            from-white/55
            to-transparent
          "
        />

        {/* Mascot */}
        <img
          src={pipImage}
          alt=""
          className={`
            pointer-events-none relative z-10
            h-[69px] w-[69px]
            select-none object-contain
            drop-shadow-[0_4px_5px_rgba(49,103,89,0.16)]
            transition-transform duration-300

            ${
              open
                ? "scale-90"
                : "group-hover:scale-110"
            }
          `}
          draggable={false}
        />

        {/* ==================================================
            TOP-RIGHT SPARKLE
           ================================================== */}

        {!open && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -right-3 -top-3 z-20
              flex h-8 w-8
              animate-pulse
              items-center justify-center
              rounded-full
              border-2 border-white
              bg-gradient-to-br
              from-[#FFE9A0]
              to-[#F5B94E]
              shadow-[0_3px_10px_rgba(235,177,64,0.3)]
            "
          >
            <Sparkles
              size={17}
              className="text-white"
              strokeWidth={2.5}
            />
          </span>
        )}

        {/* ==================================================
            BOTTOM-RIGHT STATUS ICON
           ================================================== */}

        <span
          aria-hidden="true"
          className={`
            pointer-events-none absolute
            -bottom-2 -right-2 z-20
            flex h-9 w-9
            items-center justify-center
            rounded-[13px]
            border-[3px] border-white
            text-white
            shadow-[0_4px_12px_rgba(40,109,111,0.2)]
            transition-all duration-300

            ${
              open
                ? "bg-[#367D77]"
                : "bg-gradient-to-br from-[#A98AE3] to-[#8267C6]"
            }
          `}
        >
          {open ? (
            <X size={18} strokeWidth={3} />
          ) : (
            <MessageCircle
              size={18}
              strokeWidth={2.5}
            />
          )}
        </span>

        {/* ==================================================
            SMALL FLOATING STAR
           ================================================== */}

        {!open && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -left-3 top-3
              animate-bounce
              text-[20px]
              drop-shadow-sm
            "
            style={{
              animationDuration: "2.5s",
            }}
          >
            ✨
          </span>
        )}
      </button>
    </div>
  );
}
