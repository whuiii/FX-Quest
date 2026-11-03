
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  Coins,
  Crown,
  Dices,
  Lock,
  Scissors,
  Shirt,
  Smile,
  RotateCcw,
  Compass,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, Pip } from "@/components/quest-ui";
import portraitScenery from "@/assets/welcome-meadow.jpg";

import {
  AvatarView,
  SKINS,
  HAIRS,
  OUTFITS,
  ACCESSORIES,
  DEFAULT_AVATARS,
  resolveAvatarGender,
  outfitAvailableForGender,
  hairAvailableForGender,
  type AvatarGender,
} from "@/components/avatar-art";

import { useGame, setState, type Avatar } from "@/lib/game-store";
import { cn } from "@/lib/utils";

import stageArt from "@/assets/character_bg.jpg";

// ============================================================
// ROUTE
// ============================================================

export const Route = createFileRoute("/avatar")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Create your explorer — FX Quest" },
      {
        name: "description",
        content:
          "Design your FX Quest avatar and meet Pip, your currency-explorer companion.",
      },
      {
        property: "og:title",
        content: "Create your explorer — FX Quest",
      },
      {
        property: "og:description",
        content:
          "Pick skin tone, hair, outfit and accessories for your adventure.",
      },
    ],
  }),
  component: AvatarPage,
});

// ============================================================
// AVATAR CONFIGURATION
// ============================================================

const DEFAULT: Avatar = {
  name: "",
  ...DEFAULT_AVATARS.male,
};

type TabId = "skin" | "hair" | "outfit" | "accessory";

const TABS: {
  id: TabId;
  label: string;
  icon: typeof Smile;
}[] = [
  { id: "skin", label: "Skin", icon: Smile },
  { id: "hair", label: "Hair", icon: Scissors },
  { id: "outfit", label: "Outfit", icon: Shirt },
  { id: "accessory", label: "Extras", icon: Crown },
];

const HEAD_VIEW = "22 -4 156 156";
const OUTFIT_VIEW = "0 70 200 130";

// ============================================================
// OPTION BUTTON
// ============================================================

function Option({
  label,
  selected,
  onClick,
  locked,
  disabled,
  className,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  locked?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2",
        "border-2 font-bold text-[#373268] transition-all",
        "focus-visible:outline-none",
        "focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-[#f0b93a] bg-white shadow-[0_4px_0_rgba(187,125,61,.25),0_0_0_4px_rgba(249,215,119,.45)]"
          : "border-[#efc478]/60 bg-[#fffaf0] hover:-translate-y-0.5 hover:border-[#efc478] hover:bg-white",
        className,
      )}
    >
      {children}

      {selected && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5
          items-center justify-center rounded-full
          bg-[#2b6fd6] text-white shadow"
        >
          <Check
            className="h-3 w-3"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
      )}

      {locked && (
        <span
          className="absolute right-1.5 top-1.5 rounded-full
          bg-white/90 p-1 text-[#8a6bb0] shadow-sm"
        >
          <Lock className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}

// ============================================================
// AVATAR CUSTOMIZATION TILE
// ============================================================

function Tile({
  a,
  patch,
  viewBox,
  name,
  price,
  ...rest
}: {
  a: Avatar;
  patch: Partial<Avatar>;
  viewBox: string;
  name: string;
  price?: number;
  selected: boolean;
  onClick: () => void;
  locked?: boolean;
  disabled?: boolean;
}) {
  return (
    <Option
      label={name}
      className="flex-col gap-1.5 rounded-2xl p-2"
      {...rest}
    >
      <span
        className="flex h-[84px] w-full items-center
        justify-center overflow-hidden rounded-xl
        bg-gradient-to-b from-[#e3f9ff] to-[#bfeeff]"
      >
        <AvatarView
          avatar={{ ...a, ...patch }}
          size={viewBox === OUTFIT_VIEW ? 110 : 84}
          viewBox={viewBox}
          decorative
        />
      </span>

      <span className="w-full truncate text-center text-xs leading-tight">
        {name}
      </span>

      {price ? (
        <span
          className="rounded-full bg-[#fff0c2] px-2 py-0.5
          text-[11px] font-extrabold text-[#8a5a00]"
        >
          {price} 🪙
        </span>
      ) : null}
    </Option>
  );
}

// ============================================================
// FANTASY HEADER
// ============================================================

function ExplorerHeader({ coins }: { coins: number }) {
  return (
    <header
      className="relative mb-9 flex w-full justify-center
      px-1 pb-2 pt-9 sm:pt-11"
    >
      {/* Floating fantasy signboard */}
      <div className="relative w-full max-w-[690px]">

        {/* Main sign */}
        <div
          className="relative rounded-[42px]
          border-[4px] border-[#dda467]
          bg-gradient-to-b
          from-[#fff9e9] via-[#fff0d2] to-[#f7d7a9]
          px-6 pb-9 pt-8 text-center
          shadow-[inset_0_3px_0_#fffdf5,0_5px_0_#c98d56,0_12px_22px_rgba(70,69,107,.20)]"
        >
          {/* Inner gold highlight */}
          <div
            className="pointer-events-none absolute inset-[5px]
            rounded-[36px] border border-white/80"
          />

          {/* Left floral ornament */}
          <div
            className="pointer-events-none absolute
            -left-4 -top-5 z-20 rotate-[-15deg]
            drop-shadow-md"
            aria-hidden="true"
          >
            <span className="text-4xl">🌼</span>
            <span className="-ml-3 text-2xl">🍃</span>
          </div>

          {/* Right floral ornament */}
          <div
            className="pointer-events-none absolute
            -right-4 -top-5 z-20 rotate-[15deg]
            drop-shadow-md"
            aria-hidden="true"
          >
            <span className="text-2xl">🍃</span>
            <span className="-ml-3 text-4xl">🌼</span>
          </div>

          {/* Top compass */}
          <div
            className="absolute -top-[29px] left-1/2 z-20
            flex h-[58px] w-[58px]
            -translate-x-1/2 items-center justify-center
            rounded-full border-[4px] border-[#d49a4f]
            bg-gradient-to-b from-[#fff0b7] to-[#eeb44f]
            shadow-[inset_0_2px_0_#fff9db,0_4px_0_#c78e4b]"
            aria-hidden="true"
          >
            <Compass className="h-8 w-8 text-[#b77835]" />
          </div>

          <h1
            className="relative z-10 mt-1 font-display
            text-[clamp(1.65rem,3vw,2.75rem)]
            font-extrabold leading-tight tracking-tight
            text-[#252264]"
          >
            Create Your Explorer
          </h1>
        </div>

        {/* Floating subtitle ribbon */}
        <div
          className="relative z-20 mx-auto -mt-[18px]
          flex min-h-[49px] w-[91%]
          items-center justify-center gap-2
          rounded-[25px] border-[3px] border-[#e7b575]
          bg-gradient-to-b from-[#fffef7] to-[#ffe7b8]
          px-3 py-2 text-center
          shadow-[inset_0_2px_0_#ffffff,0_4px_0_#c9945b,0_7px_14px_rgba(72,63,73,.16)]"
        >
          <span className="text-amber-500" aria-hidden="true">
            ★
          </span>

          <p
            className="font-display text-xs font-bold
            leading-snug text-[#68436d]
            sm:text-sm md:text-base"
          >
            Pick your look, then set off across the four islands.
          </p>

          <span className="text-amber-500" aria-hidden="true">
            ★
          </span>
        </div>
      </div>

      {/* Coin balance */}
      <div
        className="absolute right-0 top-0 z-30
        inline-flex items-center gap-2
        rounded-full border-[3px] border-[#e9b979]
        bg-gradient-to-b from-[#fffdf5] to-[#fff0d5]
        px-3 py-2 font-display text-sm font-extrabold
        text-[#52317b]
        shadow-[0_4px_0_rgba(177,119,62,.22)]
        sm:px-5"
        aria-label={`${coins} quest coins`}
      >
        <Coins
          className="h-5 w-5 text-[#efa51f]"
          aria-hidden="true"
        />
        {coins} coins
      </div>
    </header>
  );
}

// ============================================================
// LEFT EXPLORER PORTRAIT
// ============================================================


/* ============================================================
   FX QUEST — ENCHANTED EXPLORER PORTRAIT
   ============================================================

   Design:
   - Compact cream fantasy card
   - Elegant gold arched portrait
   - Fantasy island scenery inside the frame
   - Smaller, fully visible customizable avatar
   - Ornamental gold crest
   - Overlapping explorer nameplate
   - Compact Pip companion panel

   Uses the existing AvatarView and Pip components.
   ============================================================ */

function ExplorerPortrait({
  avatar,
}: {
  avatar: Avatar;
}) {
  return (
    <section
      aria-label="Your explorer preview"
      className="
        relative isolate min-w-0
        overflow-hidden rounded-[34px]
        border-[3px] border-[#E8BB89]
        bg-gradient-to-b
        from-[#FFF9EE]
        via-[#FFF4E5]
        to-[#FFEDD8]
        shadow-[0_6px_0_rgba(177,122,76,0.20),0_16px_35px_rgba(40,83,116,0.15)]
        lg:sticky lg:top-6
      "
    >
      {/* =====================================================
          TOP — PORTRAIT DISPLAY
         ===================================================== */}

      <div className="relative flex flex-col items-center px-4 pb-2 pt-7">

        {/* Main portrait frame */}
        <div
          className="
            relative w-full max-w-[305px]
            rounded-t-[165px] rounded-b-[30px]
            border-[4px] border-[#E3B579]
            bg-[#FFF9E8]
            p-[5px]
            shadow-[0_5px_14px_rgba(112,88,57,0.12)]
          "
        >
          {/* Inner landscape portrait */}
          <div
            className="
              relative h-[325px] w-full
              overflow-hidden
              rounded-t-[155px] rounded-b-[24px]
              border-[2px] border-[#FFF5DE]
              bg-[#A5E1F4]
            "
          >
            {/* Fantasy island scenery */}
            <img
              src={portraitScenery}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="
                pointer-events-none absolute inset-0
                h-full w-full
                select-none object-cover
                object-[43%_center]
              "
            />

            {/* Gentle color overlay */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0
                bg-gradient-to-b
                from-[#9DDAFB]/10
                via-transparent
                to-[#EDF8D8]/20
              "
            />

            {/* Soft light behind the explorer */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                bottom-[12px] left-1/2
                h-[190px] w-[190px]
                -translate-x-1/2 rounded-full
                bg-white/20 blur-[35px]
              "
            />

            {/* Small decorative sparkles */}
            <Sparkles
              aria-hidden="true"
              className="
                pointer-events-none absolute
                left-4 top-[115px]
                h-[19px] w-[19px]
                text-white
                drop-shadow-[0_1px_3px_rgba(75,143,184,0.25)]
              "
            />

            <Sparkles
              aria-hidden="true"
              className="
                pointer-events-none absolute
                right-4 top-[170px]
                h-[15px] w-[15px]
                text-[#FFE4A3]
                drop-shadow-sm
              "
            />

            {/* =========================================
                CUSTOMIZABLE AVATAR
               =========================================

               Smaller than before so the background
               and the full character remain visible.
            */}

            <div
              className="
                absolute inset-x-0 bottom-[-1px]
                z-10 flex items-end justify-center
              "
            >
              <div
                className="
                  fxq-bob flex items-end justify-center
                  drop-shadow-[0_7px_9px_rgba(56,95,100,0.15)]
                "
              >
                <AvatarView
                  avatar={avatar}
                  size={245}
                />
              </div>
            </div>

            {/* Foreground glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                bottom-0 left-0 right-0 z-10
                h-[18px]
                bg-gradient-to-t
                from-[#FFF0D6]/15
                to-transparent
              "
            />
          </div>

          {/* =========================================
              ORNAMENTAL TOP CREST
             ========================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute
              -top-[18px] left-1/2 z-30
              flex h-[35px] w-[110px]
              -translate-x-1/2
              items-center justify-center
            "
          >
            {/* Left wing */}
            <div className="flex items-center">
              <span
                className="
                  text-[23px] leading-none
                  text-[#DFA85F]
                  drop-shadow-sm
                "
              >
                ❧
              </span>

              <span
                className="
                  -ml-[5px] h-[2px] w-[14px]
                  rounded-full bg-[#E9BB7A]
                "
              />
            </div>

            {/* Center diamond */}
            <div
              className="
                relative z-10 flex h-[33px] w-[33px]
                rotate-45 items-center justify-center
                rounded-[8px]
                border-[3px] border-[#DFA660]
                bg-gradient-to-br
                from-[#FFF1C8]
                to-[#F6CA88]
                shadow-[0_2px_0_#BD8549]
              "
            >
              <span
                className="
                  -rotate-45 text-[17px]
                  leading-none text-[#B77D3D]
                "
              >
                ✦
              </span>
            </div>

            {/* Right wing */}
            <div className="flex items-center">
              <span
                className="
                  h-[2px] w-[14px]
                  rounded-full bg-[#E9BB7A]
                "
              />

              <span
                className="
                  -ml-[5px] rotate-180
                  text-[23px] leading-none
                  text-[#DFA85F]
                  drop-shadow-sm
                "
              >
                ❧
              </span>
            </div>
          </div>
        </div>

        {/* =========================================
            OVERLAPPING GOLD NAMEPLATE
           ========================================= */}

        <div
          className="
            relative z-20 -mt-[19px]
            flex h-[48px] w-[76%]
            max-w-[230px]
            items-center justify-center
            rounded-[20px]
            border-[3px] border-[#DAA05E]
            bg-gradient-to-b
            from-[#FFF0C5]
            via-[#FFDFAB]
            to-[#F6C889]
            px-5
            shadow-[0_4px_0_#C28A51,0_7px_12px_rgba(95,70,49,0.13)]
          "
        >
          {/* Left decorative diamond */}
          <span
            aria-hidden="true"
            className="
              absolute -left-[11px]
              text-[19px] text-[#BC8645]
            "
          >
            ✦
          </span>

          {/* Character name */}
          <span
            className="
              block max-w-full truncate
              font-display text-[20px]
              font-extrabold tracking-tight
              text-[#58335E]
            "
          >
            {avatar.name.trim() || "Explorer"}
          </span>

          {/* Right decorative diamond */}
          <span
            aria-hidden="true"
            className="
              absolute -right-[11px]
              text-[19px] text-[#BC8645]
            "
          >
            ✦
          </span>
        </div>
      </div>

      {/* =====================================================
          BOTTOM — PIP COMPANION AREA
         ===================================================== */}

      <div className="px-4 pb-4 pt-5">
        <div
          className="
            relative rounded-[22px]
            border-[2px] border-[#E9C69D]
            bg-gradient-to-b
            from-[#FFFCF5]
            to-[#FFF2E2]
            px-2 py-2
            shadow-[0_3px_0_rgba(182,130,77,0.12)]
          "
        >
          {/* Existing Pip mascot and message */}
          <Pip mood="excited" size={60}>
            Looking great! I'll travel with you across all
            four islands.
          </Pip>
        </div>
      </div>
    </section>
  );
}


// ============================================================
// MAIN AVATAR PAGE
// ============================================================

function AvatarPage() {
  const g = useGame();
  const nav = useNavigate();

  const [a, setA] = useState<Avatar>(DEFAULT);
  const [tab, setTab] = useState<TabId>("skin");

  // Restore saved avatar
  useEffect(() => {
    if (g.avatar) {
      const savedGender = resolveAvatarGender(g.avatar);
      const preset = DEFAULT_AVATARS[savedGender];

      setA({
        ...preset,
        ...g.avatar,
        gender: savedGender,
        outfit: outfitAvailableForGender(
          g.avatar.outfit,
          savedGender,
        )
          ? g.avatar.outfit
          : preset.outfit,
        hair: hairAvailableForGender(
          g.avatar.hair,
          savedGender,
        )
          ? g.avatar.hair
          : preset.hair,
      });
    }
  }, [g.avatar]);

  const gender: AvatarGender = resolveAvatarGender(a);

  const visibleOutfits = OUTFITS
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.genders.includes(gender));

  const visibleHairs = HAIRS
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.genders.includes(gender));

  const up = (patch: Partial<Avatar>) => {
    setA((previous) => ({
      ...previous,
      ...patch,
    }));
  };

  // Select male or female explorer
  const selectGender = (next: AvatarGender) => {
    setA((previous) => ({
      ...previous,
      gender: next,
      hair: DEFAULT_AVATARS[next].hair,
      outfit: DEFAULT_AVATARS[next].outfit,
    }));
  };

  // Restore default appearance
  const useDefaultLook = () => {
    setA((previous) => ({
      ...DEFAULT_AVATARS[gender],
      name: previous.name,
    }));
  };

  // Check whether accessory is unlocked
  const isOwned = (index: number) => {
    const accessory = ACCESSORIES[index];

    return (
      !!accessory &&
      (accessory.cost === 0 ||
        g.unlockedCosmetics.includes(accessory.name))
    );
  };

  // Buy or equip accessory
  const buyOrPick = (index: number) => {
    const accessory = ACCESSORIES[index];

    if (!accessory) return;

    if (isOwned(index)) {
      up({ accessory: index });
      return;
    }

    if (g.coins >= accessory.cost) {
      setState((state) => ({
        ...state,
        coins: state.coins - accessory.cost,
        unlockedCosmetics: [
          ...state.unlockedCosmetics,
          accessory.name,
        ],
      }));

      up({ accessory: index });
    }
  };

  // Random avatar appearance
  const shuffle = () => {
    const rnd = (count: number) =>
      Math.floor(Math.random() * count);

    const owned = ACCESSORIES
      .map((_, index) => index)
      .filter(isOwned);

    up({
      skin: rnd(SKINS.length),
      hair:
        visibleHairs[rnd(visibleHairs.length)]?.index ??
        DEFAULT_AVATARS[gender].hair,
      outfit:
        visibleOutfits[rnd(visibleOutfits.length)]?.index ??
        DEFAULT_AVATARS[gender].outfit,
      accessory: owned[rnd(owned.length)] ?? 0,
    });
  };

  // Save avatar and continue
  const save = () => {
    const outfit = outfitAvailableForGender(a.outfit, gender)
      ? a.outfit
      : DEFAULT_AVATARS[gender].outfit;

    const hair = hairAvailableForGender(a.hair, gender)
      ? a.hair
      : DEFAULT_AVATARS[gender].hair;

    setState((state) => ({
      ...state,
      avatar: {
        ...a,
        gender,
        hair,
        outfit,
        name: a.name.trim() || "Explorer",
      },
    }));

    nav({
      to: g.role ? "/map" : "/characters",
    });
  };

  return (
    <Page wide>
      {/* Animation */}
      <style>{`
        @keyframes fxq-bob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .fxq-bob {
          animation: fxq-bob 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fxq-bob {
            animation: none;
          }
        }
      `}</style>

      {/* ================================================
          FULL-PAGE FANTASY ISLAND BACKGROUND
         ================================================ */}

      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={stageArt}
          alt=""
          className="h-full w-full object-cover object-center"
        />

        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-[#e8f8ff]/20" />
      </div>

      {/* ================================================
          MAIN CONTENT
         ================================================ */}

      <div className="relative z-10 mx-auto w-full min-w-0 pb-10">

        {/* Fantasy title header */}
        <ExplorerHeader coins={g.coins} />

        {/* Main two-column layout */}
        <div
          className="grid min-w-0 items-start gap-6
          lg:grid-cols-[minmax(290px,0.34fr)_minmax(0,0.66fr)]
          lg:gap-8 xl:gap-9"
        >
          {/* ============================================
              LEFT PANEL
             ============================================ */}

          <ExplorerPortrait avatar={a} />

          {/* ============================================
              RIGHT CUSTOMIZATION PANEL
             ============================================ */}

          <section
            aria-label="Customise your explorer"
            className="min-w-0 rounded-[32px]
            border-[3px] border-[#efc478]
            bg-[#fff5dc] p-4
            shadow-[0_6px_0_rgba(187,125,61,.18),0_12px_30px_rgba(36,82,131,.1)]
            sm:p-6"
          >
            {/* ========================================
                GENDER SELECTION
               ======================================== */}

            <div
              className="mb-5 rounded-[24px]
              border-2 border-[#efc478]/70
              bg-white/75 p-3 sm:p-4"
            >
              <div className="mb-3">
                <h2
                  className="font-display text-base
                  font-extrabold text-[#52317b] sm:text-lg"
                >
                  Choose your explorer
                </h2>

                <p
                  className="mt-1 text-xs font-semibold
                  text-[#786391] sm:text-sm"
                >
                  Pick Male or Female. Each has a different look and
                  outfit collection.
                </p>
              </div>

              <div
                role="group"
                aria-label="Explorer gender"
                className="grid grid-cols-2 gap-3"
              >
                {(["male", "female"] as const).map(
                  (optionGender) => {
                    const active = gender === optionGender;

                    return (
                      <button
                        key={optionGender}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          selectGender(optionGender)
                        }
                        className={cn(
                          "relative flex min-w-0 flex-col items-center",
                          "rounded-[20px] border-[3px]",
                          "px-2 pb-3 pt-3 transition-all duration-200",
                          "focus-visible:outline-none",
                          "focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
                          active
                            ? "border-[#f0b93a] bg-gradient-to-b from-[#e2f8ff] to-[#fff5d9] shadow-[0_5px_0_rgba(188,125,54,.22)]"
                            : "border-[#dbe8ee] bg-gradient-to-b from-[#f0fbff] to-white hover:-translate-y-0.5 hover:border-[#efc478]",
                        )}
                      >
                        {active && (
                          <span
                            className="absolute right-2 top-2
                            rounded-full bg-[#2b6fd6]
                            p-1 text-white"
                          >
                            <Check
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                        )}

                        <span
                          className="mb-2 flex h-[104px] w-[104px]
                          items-end justify-center overflow-hidden
                          rounded-full
                          bg-gradient-to-b from-[#a5e9ff] to-[#d6f7fe]
                          sm:h-[124px] sm:w-[124px]"
                        >
                          <AvatarView
                            avatar={{
                              ...DEFAULT_AVATARS[optionGender],
                              skin: a.skin,
                            }}
                            size={114}
                            decorative
                          />
                        </span>

                        <span
                          className="font-display text-sm
                          font-extrabold text-[#443466] sm:text-base"
                        >
                          {optionGender === "male"
                            ? "Male Explorer"
                            : "Female Explorer"}
                        </span>

                        <span
                          className="mt-0.5 text-[11px]
                          font-medium text-[#796592]"
                        >
                          {optionGender === "male"
                            ? "Adventure outfits"
                            : "Adventure & dress outfits"}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>

              <p
                className="mt-3 text-center text-xs
                text-[#7d6999]"
              >
                No time to customize? Your explorer already has a
                default look.
              </p>
            </div>

            {/* ========================================
                EXPLORER NAME
               ======================================== */}

            <div
              className="rounded-2xl border-2
              border-[#efc478]/70 bg-white/80 p-3"
            >
              <label
                htmlFor="name"
                className="font-display text-sm
                font-extrabold text-[#52317b]"
              >
                What should we call you?
              </label>

              <Input
                id="name"
                maxLength={20}
                value={a.name}
                onChange={(event) =>
                  up({ name: event.target.value })
                }
                placeholder="e.g. Aisyah"
                className="mt-1.5 h-12 rounded-xl
                border-2 border-[#efc478] bg-white
                text-base font-semibold text-[#373268]
                focus-visible:ring-[#2b6fd6]/40"
              />
            </div>

            {/* ========================================
                CUSTOMIZATION TABS
               ======================================== */}

            <div
              role="tablist"
              aria-label="Customisation categories"
              className="mt-5 grid grid-cols-4 gap-2"
            >
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;

                return (
                  <button
                    key={id}
                    id={`tab-${id}`}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls={`panel-${id}`}
                    onClick={() => setTab(id)}
                    className={cn(
                      "flex flex-col items-center gap-1",
                      "rounded-2xl border-2 px-2 py-2.5",
                      "text-xs font-extrabold transition-all",
                      "sm:flex-row sm:justify-center",
                      "sm:gap-2 sm:text-sm",
                      "focus-visible:outline-none",
                      "focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
                      active
                        ? "border-[#2b6fd6] bg-gradient-to-b from-[#4aa3f5] to-[#2b6fd6] text-white shadow-[0_4px_0_#1f4fa3]"
                        : "border-[#efc478]/70 bg-white/70 text-[#52317b] hover:bg-white",
                    )}
                  >
                    <Icon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* ========================================
                CUSTOMIZATION OPTIONS
               ======================================== */}

            <div className="mt-5 min-h-[240px]">

              {/* SKIN */}
              {tab === "skin" && (
                <div
                  role="tabpanel"
                  id="panel-skin"
                  aria-labelledby="tab-skin"
                >
                  <h2
                    className="mb-3 font-display
                    text-base font-extrabold text-[#52317b]"
                  >
                    Skin tone
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {SKINS.map((color, index) => (
                      <Option
                        key={color}
                        label={`Skin tone ${index + 1}`}
                        selected={a.skin === index}
                        onClick={() =>
                          up({ skin: index })
                        }
                        className="h-14 w-14 rounded-full p-1"
                      >
                        <span
                          className="h-full w-full rounded-full
                          border border-black/10"
                          style={{ background: color }}
                        />
                      </Option>
                    ))}
                  </div>
                </div>
              )}

              {/* HAIR */}
              {tab === "hair" && (
                <div
                  role="tabpanel"
                  id="panel-hair"
                  aria-labelledby="tab-hair"
                >
                  <div className="mb-3">
                    <p
                      className="text-sm font-extrabold
                      text-[#52317b]"
                    >
                      {gender === "male"
                        ? "Male hairstyles"
                        : "Female hairstyles"}
                    </p>

                    <p className="text-xs text-[#7b679c]">
                      Showing styles that match your selected
                      explorer.
                    </p>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-3
                    sm:grid-cols-3 xl:grid-cols-4"
                  >
                    {visibleHairs.map((hair) => (
                      <Tile
                        key={hair.name}
                        a={a}
                        patch={{ hair: hair.index }}
                        viewBox={HEAD_VIEW}
                        name={hair.name}
                        selected={a.hair === hair.index}
                        onClick={() =>
                          up({ hair: hair.index })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* OUTFITS */}
              {tab === "outfit" && (
                <div
                  role="tabpanel"
                  id="panel-outfit"
                  aria-labelledby="tab-outfit"
                >
                  <h2
                    className="mb-1 font-display
                    text-base font-extrabold text-[#52317b]"
                  >
                    {gender === "male"
                      ? "Male outfits"
                      : "Female outfits"}
                  </h2>

                  <p
                    className="mb-3 text-xs font-medium
                    text-[#786391]"
                  >
                    Showing {visibleOutfits.length} outfits
                    available for your chosen explorer.
                  </p>

                  <div
                    className="grid grid-cols-3 gap-3
                    sm:grid-cols-4"
                  >
                    {visibleOutfits.map((outfit) => (
                      <Tile
                        key={outfit.name}
                        a={a}
                        patch={{ outfit: outfit.index }}
                        viewBox={OUTFIT_VIEW}
                        name={outfit.name}
                        selected={
                          a.outfit === outfit.index
                        }
                        onClick={() =>
                          up({ outfit: outfit.index })
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ACCESSORIES */}
              {tab === "accessory" && (
                <div
                  role="tabpanel"
                  id="panel-accessory"
                  aria-labelledby="tab-accessory"
                >
                  <h2
                    className="mb-1 font-display
                    text-base font-extrabold text-[#52317b]"
                  >
                    Extras
                  </h2>

                  <p
                    className="mb-3 text-sm font-semibold
                    text-[#624c88]"
                  >
                    Unlock these with quest coins. You have{" "}
                    {g.coins}.
                  </p>

                  <div
                    className="grid grid-cols-3 gap-3
                    sm:grid-cols-4"
                  >
                    {ACCESSORIES.map(
                      (accessory, index) => {
                        const owned = isOwned(index);

                        const cantAfford =
                          !owned &&
                          g.coins < accessory.cost;

                        return (
                          <Tile
                            key={accessory.name}
                            a={a}
                            patch={{
                              accessory: index,
                            }}
                            viewBox={HEAD_VIEW}
                            name={accessory.name}
                            price={
                              owned
                                ? undefined
                                : accessory.cost
                            }
                            selected={
                              a.accessory === index
                            }
                            locked={cantAfford}
                            disabled={cantAfford}
                            onClick={() =>
                              buyOrPick(index)
                            }
                          />
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================
                ACTION BUTTONS
               ======================================== */}

            <div
              className="mt-6 flex flex-col gap-3
              sm:flex-row"
            >
              <Button
                type="button"
                variant="bubble"
                size="lg"
                onClick={shuffle}
                className="gap-2 sm:w-auto"
              >
                <Dices
                  className="h-5 w-5"
                  aria-hidden="true"
                />
                Surprise me
              </Button>

              <Button
                type="button"
                variant="bubble"
                size="lg"
                onClick={useDefaultLook}
                className="gap-2 sm:w-auto"
              >
                <RotateCcw
                  className="h-5 w-5"
                  aria-hidden="true"
                />
                Default look
              </Button>

              <Button
                variant="quest"
                size="lg"
                onClick={save}
                className="flex-1"
              >
                Save & continue adventure
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
}
