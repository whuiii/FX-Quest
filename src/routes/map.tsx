
import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Check, Star, ArrowRight, RefreshCw, Target, Sparkles } from "lucide-react";

import { Page, Pip, AvatarView } from "@/components/quest-ui";
import { Button } from "@/components/ui/button";

import { useGame, CHAPTERS } from "@/lib/game-store";
import {
  roleInfo,
  mapChapters,
  chapterUnlocked,
} from "@/lib/roles";

import { cn } from "@/lib/utils";

import worldMap from "@/assets/world-map.jpg";
import travellerMap from "@/assets/traveller-map.jpg";
import businessMap from "@/assets/business-map.jpg";
import adventureHeaderBg from "@/assets/fxquest-map-header-bg_1.png";

// ----------------------------------------------------
// FX QUEST - RESPONSIVE ADVENTURE MAP
// ----------------------------------------------------
// Desktop:
// - Wider map with reduced empty space
// - Full image visible without cropping
// - Four mission markers over the illustration
//
// Mobile:
// - Full-width proportional image
// - Compact mission markers displayed on the map
// - Mission cards remain accessible
//
// Preserves:
// - Role-based maps and avatars
// - Chapter unlocking
// - Completed missions
// - Navigation and game progress
// ----------------------------------------------------

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Your Adventure Map — FX Quest" },
      {
        name: "description",
        content:
          "Explore your role's adventure, resume missions and collect learning rewards.",
      },
      {
        property: "og:title",
        content: "Your Adventure Map — FX Quest",
      },
      {
        property: "og:description",
        content:
          "Campus Crossing, Cherry Blossom Trail and Little Shop Harbour await.",
      },
      { property: "og:type", content: "website" },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: MapPage,
});

// Mission markers are positioned relative to the map.
// These percentages work for all three original map images.
const POS = [
  "left-[2%] top-[4%] lg:left-[5%] lg:top-[7%]",
  "right-[2%] top-[4%] lg:right-[5%] lg:top-[7%]",
  "left-[2%] bottom-[4%] lg:left-[5%] lg:bottom-[7%]",
  "right-[2%] bottom-[4%] lg:right-[5%] lg:bottom-[7%]",
];

function MapPage() {
  const g = useGame();
  const r = roleInfo(g.role);

  // No role selected yet.
  if (!r) {
    return (
      <Page>
        <div className="mx-auto max-w-xl py-12 text-center">
          <h1 className="font-display text-3xl font-bold">
            A dream awaits you
          </h1>

          <Pip className="mx-auto mt-6 max-w-lg">
            Let's choose your story before setting off.
          </Pip>

          <Button asChild variant="quest" className="mt-6">
            <Link to="/characters">Choose Role</Link>
          </Button>
        </div>
      </Page>
    );
  }

  // Preserve the existing chapter filtering and role logic.
  const main = CHAPTERS.find(
    (chapter) => chapter.id === r.mission
  );

  const chapters = mapChapters(
    CHAPTERS.filter(
      (chapter) =>
        chapter.id !== "traveller" ||
        g.role === "traveller"
    ),
    r.id
  );

  // Select the original map for the active role.
  const map =
    r.id === "traveller"
      ? travellerMap
      : r.id === "business"
        ? businessMap
        : worldMap;

  const mainCompleted =
    main !== undefined &&
    g.completed.includes(main.id);

  return (
    <Page fullWidth>
      {/* ==========================================
          PAGE CONTENT WRAPPER
          ========================================== */}

      <div
  className="
    mx-auto
    w-full
    min-w-0
    max-w-[1650px]
    px-4
    pt-5
    pb-8
    sm:px-6
    sm:pt-6
    lg:px-8
    lg:pt-7
    2xl:px-10
  "
>
{/* ==========================================
    SOFT PASTEL ADVENTURE HEADER
    Keeps the role, avatar, mission and navigation.
========================================== */}
<section
  aria-label="Your adventure"
  className="relative isolate mb-5 overflow-hidden rounded-[26px] border-2 border-[#f5d38a] bg-[#b5e9f3] shadow-[0_12px_28px_rgba(57,122,157,0.12)] sm:rounded-[32px]"
>
  {/* Slightly desaturated background to match the illustrated map. */}
  <img
    src={adventureHeaderBg}
    alt=""
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center saturate-[.76] brightness-[1.04]"
  />
  {/* A gentle tint unifies the artwork with the rest of the page. */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#d6f3f8]/45 via-[#e2f5fa]/15 to-[#f7e9e3]/20" />

  <div className="relative flex flex-col gap-3 px-4 py-5 sm:px-7 sm:py-6 lg:min-h-[235px] lg:flex-row lg:items-center lg:gap-6 lg:px-9">
    {/* Identity: compact on phones, spacious on desktop. */}
    <div className="flex min-w-0 items-center gap-3 sm:gap-4 lg:min-w-[36%] lg:flex-1">
      <div className="relative shrink-0 rounded-full border-[3px] border-[#f3ce83] bg-white/90 p-1 shadow-[0_6px_18px_rgba(44,99,136,.16)]">
        <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full bg-[#d7f3fa] sm:h-[94px] sm:w-[94px]">
          <AvatarView avatar={g.avatar ?? r.avatar} size={80} />
        </div>
        <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-amber-500 sm:h-6 sm:w-6" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#e7c992] bg-[#fffaf0]/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#655080] shadow-sm sm:px-3 sm:text-xs">
          <span>{r.emoji}</span>
          <span className="truncate">{r.name} · Your Adventure</span>
        </p>
        <h1 className="mt-1.5 font-display text-[clamp(1.45rem,5.5vw,2.1rem)] font-extrabold leading-tight tracking-tight text-[#fffdf8] drop-shadow-sm lg:text-[2.55rem]"
          style={{ WebkitTextStroke: "4px #5287c6", paintOrder: "stroke fill", textShadow: "0 3px 0 rgba(55,111,171,.18)" }}
        >
          {r.mapName}
        </h1>
        <span className="mt-1 inline-flex rounded-full bg-[#ffe4a3]/95 px-3 py-0.5 text-[11px] font-extrabold text-[#624783] shadow-sm sm:text-xs">Your Adventure</span>
      </div>
    </div>

    {/* Mission panel: easy to read over detailed artwork. */}
    <div className="min-w-0 rounded-[20px] border border-[#e9cc94] bg-[#fffaf0]/90 px-4 py-3 shadow-[0_5px_15px_rgba(57,106,142,.10)] backdrop-blur-[5px] lg:w-[32%] lg:max-w-[460px]">
      <div className="flex items-center gap-2 text-[#694989]">
        <Target className="h-5 w-5 shrink-0 text-[#ee7690]" />
        <span className="font-display text-sm font-extrabold sm:text-base">Your Mission</span>
      </div>
      <p className="mt-1 text-sm font-medium leading-relaxed text-[#45466c] sm:text-base">{r.goal}</p>
    </div>

    {/* Role switch is ALWAYS visible on phones and desktops. */}
    <Button asChild variant="bubble"
      className="h-11 w-full shrink-0 gap-2 rounded-full border-2 border-[#e9c88d] bg-[#fffaf0] px-5 font-extrabold text-[#624783] shadow-[0_4px_12px_rgba(78,106,145,.12)] transition-all hover:-translate-y-0.5 hover:bg-white lg:w-auto"
    >
      <Link to="/characters"><RefreshCw className="h-4 w-4" />Change Role</Link>
    </Button>
  </div>
</section>

{/* ==========================================
            RESPONSIVE MAP
            ========================================== */}

        <div
          className="
            relative
            mx-auto
            w-full
            min-w-0
            overflow-hidden
            rounded-3xl
            border-2
            border-border
            shadow-soft
            lg:rounded-[2.5rem]
          "
        >
          {/* 
            Important:
            h-auto preserves the original aspect ratio.
            object-contain prevents any cropping.
            No fixed height is applied to the image.
          */}
          <img
            src={map}
            alt={`${r.mapName}, an illustrated adventure for your ${r.name.toLowerCase()} story`}
            width={1600}
            height={1008}
            className="
              block
              h-auto
              w-full
              object-contain
            "
          />

          {/* Subtle gradient improves marker readability. */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/10
              via-transparent
              to-transparent
            "
          />

          {/* ======================================
              RESPONSIVE MISSION MARKERS
              ====================================== */}

          {chapters.slice(0, 4).map((chapter, index) => {
            const unlocked = chapterUnlocked(
              chapter,
              g.completed,
              r.id
            );

            const completed = g.completed.includes(
              chapter.id
            );

            return (
              <div
                key={chapter.id}
                className={cn(
                  "absolute z-20 block max-w-[47%] lg:max-w-[43%]",
                  POS[index]
                )}
              >
                <Button
                  asChild={unlocked}
                  disabled={!unlocked}
                  variant="bubble"
                  className="
                    h-auto
                    max-w-full
                    rounded-xl
                    border border-[#e9c98b]
                    bg-[#fffaf0]/95
                    px-1.5 py-1
                    text-left text-[9px] leading-tight
                    shadow-[0_3px_10px_rgba(31,87,133,0.18)]
                    backdrop-blur-sm
                    transition-transform hover:-translate-y-0.5
                    sm:rounded-2xl sm:px-3 sm:py-2 sm:text-xs
                    lg:px-4 lg:py-3 lg:text-sm
                  "
                >
                  {unlocked ? (
                    <Link to={chapter.to}>
                      <span className="flex items-center gap-1 sm:gap-2">
                        {completed ? (
                          <Check className="h-3 w-3 shrink-0 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        ) : (
                          <Star className="h-3 w-3 shrink-0 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        )}

                        <span className="min-w-0 whitespace-normal">
                          <b className="block text-[9px] leading-tight sm:text-xs lg:text-sm">
                            {chapter.name}
                          </b>

                          <span className="hidden text-[10px] font-normal sm:block lg:text-xs">
                            {chapter.id === r.mission
                              ? "Your story quest"
                              : "Side quest"}
                          </span>
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Lock className="h-3 w-3 shrink-0 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                      <span className="whitespace-normal text-[9px] leading-tight sm:text-xs lg:text-sm">
                        {chapter.name}
                      </span>
                    </span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* On smaller screens, accessible quest buttons sit directly below the map
            rather than obscuring the island illustration. */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
          {chapters.slice(0, 4).map((chapter) => {
            const unlocked = chapterUnlocked(chapter, g.completed, r.id);
            const completed = g.completed.includes(chapter.id);
            return unlocked ? (
              <Link key={chapter.id} to={chapter.to}
                className="flex min-h-[64px] items-center gap-2 rounded-2xl border border-[#e8d2aa] bg-[#fffaf1] px-3 py-2 text-left text-[#4c4770] shadow-sm transition-transform active:scale-[.98]">
                {completed ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <Star className="h-4 w-4 shrink-0 text-amber-500" />}
                <span className="min-w-0"><span className="block text-xs font-extrabold leading-tight">{chapter.name}</span><span className="text-[10px] opacity-70">{chapter.id === r.mission ? "Story quest" : "Side quest"}</span></span>
              </Link>
            ) : (
              <div key={chapter.id} aria-disabled="true" className="flex min-h-[64px] items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-3 py-2 text-slate-500">
                <Lock className="h-4 w-4 shrink-0" /><span className="text-xs font-semibold">{chapter.name}</span>
              </div>
            );
          })}
        </div>

{/* ==========================================
            PIP GUIDE + CONTINUE BUTTON
            ========================================== */}

        <div
          className="
            mt-5
            flex
            flex-col
            items-stretch
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="min-w-0 flex-1">
            <Pip size={80}>
              Let's help your dream come true! Start with{" "}
              <b>{main?.name}</b>, then explore the side
              quests.
            </Pip>
          </div>

          {main && (
            <Button
              asChild
              variant="quest"
              size="lg"
              className="
                w-full
                shrink-0
                rounded-full
                shadow-md
                lg:w-auto
              "
            >
              <Link to={main.to}>
                {mainCompleted
                  ? "Replay Story"
                  : "Continue Adventure"}

                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* ==========================================
            MISSION SELECTION CARDS
            ========================================== */}

        <div
          className="
            mt-7
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {chapters.map((chapter) => {
            const unlocked = chapterUnlocked(
              chapter,
              g.completed,
              r.id
            );

            const completed = g.completed.includes(
              chapter.id
            );

            const isMainMission =
              chapter.id === r.mission;

            return (
              <article
                key={chapter.id}
                className="
                  flex
                  min-w-0
                  flex-col
                  rounded-2xl
                  border-2
                  border-border
                  bg-card
                  p-4
                  shadow-sm
                "
              >
                <p className="text-xs font-bold text-primary">
                  {isMainMission
                    ? "Story quest"
                    : "Side quest"}

                  {completed && " · Cleared ✓"}
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  {chapter.name}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {chapter.concept}
                </p>

                {unlocked ? (
                  <Button
                    asChild
                    variant="bubble"
                    className="mt-auto w-full pt-3"
                  >
                    <Link to={chapter.to}>
                      Explore
                      <Star className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <p
                    className="
                      mt-auto
                      flex
                      items-center
                      gap-1
                      pt-3
                      text-xs
                      text-muted-foreground
                    "
                  >
                    <Lock className="h-3 w-3 shrink-0" />

                    Finish{" "}
                    {
                      CHAPTERS.find(
                        (item) =>
                          item.id === chapter.requires
                      )?.name
                    }
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
