import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Award,
  BookOpen,
  Coins,
  Crown,
  Lock,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { Page, Pip } from "@/components/quest-ui";
import { useGame, BADGES, CHAPTERS, resetGame, level } from "@/lib/game-store";
import { cn } from "@/lib/utils";

// Save both images inside src/assets/.
import achievementsBg from "@/assets/achievements_bg.png";
import achievementsBottomBg from "@/assets/achievements_bottom_bg.png";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Achievement Book — FX Quest" },
      {
        name: "description",
        content: "Track your real missions, XP, quest coins, and badges in FX Quest.",
      },
      {
        property: "og:title",
        content: "Achievement Book — FX Quest",
      },
      {
        property: "og:description",
        content: "Collect badges across the islands of FX Quest.",
      },
    ],
  }),
  component: Achievements,
});

// ==========================================================
// BACKGROUND — SAME LAYERING AS LEARNING LAB
// ==========================================================
function AchievementBackground() {
  const fade =
    "linear-gradient(to bottom, #000 0%, #000 42%, rgba(0,0,0,.92) 55%, rgba(0,0,0,.55) 73%, transparent 96%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#f7ded0]"
    >
      {/* The longer stone-road illustration fills the lower page. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${achievementsBottomBg})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center bottom",
          backgroundRepeat: "repeat-y",
          filter: "saturate(.88) brightness(1.04) contrast(.96)",
        }}
      />
      {/* QUEST UI STYLE — SOFT WHITE BACKDROP */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-10"
  style={{
    background: `linear-gradient(
      180deg,
      rgba(244, 252, 255, 0.70) 0%,
      rgba(250, 253, 255, 0.60) 24%,
      rgba(255, 255, 255, 0.53) 50%,
      rgba(255, 253, 248, 0.60) 78%,
      rgba(255, 250, 242, 0.68) 100%
    )`,
  }}
/>

      {/* The trophy courtyard fades naturally over the road. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "min(100vw, 1180px)",
          minHeight: 600,
          backgroundImage: `url(${achievementsBg})`,
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          filter: "saturate(.88) brightness(1.04) contrast(.96)",
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />
    </div>
  );
}

// ==========================================================
// SMALL, MATCHING CREAM-AND-GOLD SECTION PLAQUE
// ==========================================================
function FantasySection({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative min-w-0 rounded-[30px] border-[3px] border-[#eec493]",
        "bg-gradient-to-b from-[#fffdf7]/95 via-[#fff9ef]/95 to-[#fff0df]/95",
        "px-4 pb-5 pt-10 shadow-[0_6px_0_rgba(192,128,72,.18),0_16px_35px_rgba(54,69,109,.10)]",
        "backdrop-blur-[3px] sm:px-6",
        className
      )}
    >
      <div className="absolute -top-4 left-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-[22px] border-[2px] border-[#eab36d] bg-gradient-to-b from-[#fff6d6] to-[#ffd58d] px-4 py-2 shadow-[0_4px_0_rgba(184,116,57,.22)] sm:left-6 sm:px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#efc58d] bg-[#fff5dc] text-[#b66b20]">
          {icon}
        </span>
        <h2 className="font-display text-[16px] font-extrabold text-[#622568] sm:text-[19px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// ==========================================================
// THE ACHIEVEMENT BOOK
// ==========================================================
function Achievements() {
  const g = useGame();

  // Preserve ALL original, real game-state calculations.
  const playerLevel = level(g.xp);
  const totalMissions = CHAPTERS.length;
  const completedMissions = CHAPTERS.filter((chapter) =>
    g.completed.includes(chapter.id)
  ).length;
  const totalBadges = BADGES.length;
  const earnedBadges = BADGES.filter((badge) =>
    g.badges.includes(badge.id)
  ).length;
  const progress = totalMissions
    ? (completedMissions / totalMissions) * 100
    : 0;

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all progress? This will remove your XP, coins, badges, completed missions, and avatar customizations."
      )
    ) {
      resetGame();
    }
  };

  const stats = [
    {
      label: "Explorer Level",
      value: playerLevel.toLocaleString(),
      suffix: "",
      note: "Your adventure rank",
      icon: <Star className="h-5 w-5" />,
      tint: "from-[#faf4ff]/95 to-[#eadfff]/95",
      border: "border-[#d9c2fa]",
      iconColor: "text-[#8e5ccc]",
      iconBg: "bg-[#f0e7ff]",
    },
    {
      label: "Experience Points",
      value: g.xp.toLocaleString(),
      suffix: "XP",
      note: "Knowledge you've earned",
      icon: <Sparkles className="h-5 w-5" />,
      tint: "from-[#f1fbff]/95 to-[#dff4ff]/95",
      border: "border-[#b6e2fa]",
      iconColor: "text-[#238bbf]",
      iconBg: "bg-[#e3f5ff]",
    },
    {
      label: "Quest Coins",
      value: g.coins.toLocaleString(),
      suffix: "",
      note: "For avatar cosmetics",
      icon: <Coins className="h-5 w-5" />,
      tint: "from-[#fffaf0]/95 to-[#ffedc5]/95",
      border: "border-[#efce92]",
      iconColor: "text-[#ba8424]",
      iconBg: "bg-[#fff1c9]",
    },
    {
      label: "Badges Collected",
      value: earnedBadges.toLocaleString(),
      suffix: `/ ${totalBadges}`,
      note: "Your medal collection",
      icon: <Award className="h-5 w-5" />,
      tint: "from-[#f4fff7]/95 to-[#e0f8e9]/95",
      border: "border-[#b8e7ca]",
      iconColor: "text-[#23976f]",
      iconBg: "bg-[#e2f8eb]",
    },
  ];

  return (
    <Page
      wide
      className="!relative !isolate !max-w-none !overflow-hidden !px-0 !py-0"
    >
      {/* Background is inside Page, so the TopNav stays clear. */}
      <AchievementBackground />

      <div className="relative z-10 w-full px-4 pb-9 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-[1500px]">
          {/* =================================================
              HEADER — MATCHES THE LEARNING LAB
          ================================================= */}
          <header className="relative mx-auto mb-7 max-w-[950px] text-center">
            <div className="relative rounded-[35px] border-[4px] border-[#e6b16d] bg-gradient-to-b from-[#fffdf4]/[.97] via-[#fff3dd]/[.97] to-[#ffe4b7]/[.97] px-5 pb-5 pt-7 shadow-[0_7px_0_rgba(177,113,61,.25),0_15px_35px_rgba(53,71,114,.18)] sm:px-9">
              <span className="pointer-events-none absolute -left-3 top-3 text-3xl sm:text-4xl" aria-hidden="true">
                🌿
              </span>
              <span className="pointer-events-none absolute -right-3 top-3 text-3xl sm:text-4xl" aria-hidden="true">
                🌸
              </span>

              <span className="absolute -top-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[#dfa456] bg-gradient-to-b from-[#fff4c8] to-[#ffc86c] shadow-md">
                <Crown className="h-6 w-6 text-[#a96e2c]" />
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0d5af] bg-white/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#693b78] shadow-sm sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#ce933c]" />
                FX Quest · Explorer Collection
              </span>

              <div className="mt-3 flex items-center justify-center gap-3">
                <Trophy className="hidden h-9 w-9 shrink-0 text-[#d49a37] sm:block" />
                <h1 className="font-display text-[clamp(1.9rem,4vw,3.3rem)] font-extrabold leading-tight tracking-tight text-[#722d72] drop-shadow-[0_2px_0_rgba(255,255,255,.9)]">
                  Achievement Book
                </h1>
                <span className="hidden text-3xl sm:block" aria-hidden="true">
                  ✨
                </span>
              </div>

              <div className="mt-2 flex justify-center">
                <span className="rounded-full bg-[#ffdfb8] px-3 py-1 text-[11px] font-bold text-[#845135]">
                  Your very own Hall of Fame
                </span>
              </div>

              <p className="mx-auto mt-3 max-w-[690px] text-[12px] font-medium leading-relaxed text-[#34416d] sm:text-sm">
                Every adventure tells a story. Celebrate milestones, collect
                magical badges, and become a global finance explorer!
              </p>
            </div>
          </header>

          {/* =================================================
              MISSION PROGRESS — COMPACT GOLD STRIP
          ================================================= */}
          <div className="mx-auto mb-8 max-w-[1080px] rounded-[27px] border-[3px] border-[#e9b676] bg-gradient-to-b from-[#fffaf0]/[.97] to-[#ffe9c8]/[.97] p-4 shadow-[0_5px_0_rgba(183,119,61,.2),0_12px_25px_rgba(48,75,110,.12)] backdrop-blur-[3px] sm:px-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white/90 bg-[#fff0c3] text-[#bb7c0e] shadow-sm">
                  <Star className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-sm font-extrabold text-[#352760] sm:text-base">
                    Your Adventure Progress
                  </h2>
                  <p className="text-[11px] text-[#655b7e]">
                    Every completed mission is another victory.
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-[#efca91] bg-[#fff8e8] px-3 py-1.5 text-xs font-extrabold text-[#995b2b]">
                {completedMissions}/{totalMissions} Missions
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Completed missions"
              aria-valuemin={0}
              aria-valuemax={totalMissions}
              aria-valuenow={completedMissions}
              className="h-[12px] overflow-hidden rounded-full border border-[#e2c69d] bg-[#ead9bd] p-[2px] shadow-inner"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffe17c] via-[#ffc04f] to-[#ec9a60] transition-[width] duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-[#716380]">
              {totalMissions > 0 && completedMissions === totalMissions
                ? "Wonderful! You've completed every mission!"
                : "Keep exploring the islands to complete your adventure collection."}
            </p>
          </div>

          {/* =================================================
              FOUR COMPACT EXPLORER STAT CARDS
          ================================================= */}
          <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "group min-w-0 rounded-[24px] border-[2px] bg-gradient-to-br p-3",
                  "shadow-[0_4px_0_rgba(180,132,93,.14),0_12px_22px_rgba(52,69,108,.09)]",
                  "backdrop-blur-[3px] transition-transform duration-300 hover:-translate-y-1 sm:p-4",
                  stat.tint,
                  stat.border
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-white/90 shadow-sm",
                      stat.iconBg,
                      stat.iconColor
                    )}
                  >
                    {stat.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#564470] sm:text-xs">
                      {stat.label}
                    </p>
                    <p className="font-display text-[23px] font-extrabold leading-tight text-[#392964] sm:text-[26px]">
                      {stat.value}
                      {stat.suffix && (
                        <span className="ml-1 text-[11px] font-bold text-[#756889]">
                          {stat.suffix}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-[#726782] sm:text-[11px]">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>

          {/* =================================================
              BADGE COLLECTION — FANTASY PANEL FROM LEARN
          ================================================= */}
          <FantasySection
            title="Adventure Badges"
            icon={<Award className="h-5 w-5" />}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#6b3676]">
                  <BookOpen className="h-4 w-4 text-[#c08b37]" />
                  Your Explorer Collection
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#58617d]">
                  Unlock medals by completing missions and challenges.
                </p>
              </div>
              <span className="rounded-full border border-[#eed3a8] bg-white/75 px-3 py-1.5 text-[11px] font-extrabold text-[#9a6539]">
                {earnedBadges} of {totalBadges} Unlocked
              </span>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {BADGES.map((badge) => {
                const earned = g.badges.includes(badge.id);
                return (
                  <article
                    key={badge.id}
                    className={cn(
                      "group flex min-w-0 flex-col items-center rounded-[24px] border-[2px] p-4 text-center",
                      "shadow-[0_4px_0_rgba(118,90,96,.1)] transition-transform duration-300 hover:-translate-y-1",
                      earned
                        ? "border-[#eccb87] bg-gradient-to-b from-[#fffefa] to-[#fff0d6]"
                        : "border-[#ddd4da] bg-gradient-to-b from-[#faf8fa] to-[#efeaf0]"
                    )}
                  >
                    <div
                      className={cn(
                        "relative mb-3 flex h-[78px] w-[78px] items-center justify-center rounded-full border-[5px] shadow-sm",
                        earned
                          ? "border-[#e7bb70] bg-gradient-to-br from-[#fff7d3] to-[#ffdaa0]"
                          : "border-[#d1c7d0] bg-gradient-to-br from-[#f2eef2] to-[#e5dfe7]"
                      )}
                    >
                      {earned ? (
                        <span className="text-[36px]" aria-hidden="true">
                          {badge.emoji}
                        </span>
                      ) : (
                        <Lock className="h-8 w-8 text-[#ada2b0]" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="font-display text-[14px] font-extrabold leading-snug text-[#402b6a] sm:text-[15px]">
                      {badge.name}
                    </h3>
                    <p className="mt-2 flex-1 text-[11px] leading-relaxed text-[#70667f]">
                      {badge.desc}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold",
                        earned
                          ? "border-[#a9e3b9] bg-[#e5f8e7] text-[#287651]"
                          : "border-[#ded6dd] bg-white/65 text-[#92889a]"
                      )}
                    >
                      {earned ? (
                        <Sparkles className="h-3.5 w-3.5" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                      {earned ? "Earned" : "Locked"}
                    </span>
                  </article>
                );
              })}
            </div>
          </FantasySection>

          {/* =================================================
              PIP COMPANION + RESET — COMPACT LOWER SECTION
          ================================================= */}
          <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0 rounded-[24px] border-[2px] border-[#e9c79b] bg-gradient-to-b from-[#fffdf7]/95 to-[#fff1dd]/95 p-3 shadow-[0_4px_0_rgba(184,131,79,.15)] backdrop-blur-[3px] sm:p-4">
              <div className="mb-1 flex items-center gap-2 text-[12px] font-extrabold text-[#733a78]">
                <Sparkles className="h-4 w-4 text-[#dca142]" />
                Pip's Treasure Corner
              </div>
              <Pip mood="excited" size={62}>
                Spend quest coins on avatar accessories in the explorer creator —
                they're cosmetic only, never pay-to-win!
              </Pip>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-[2px] border-[#e5b795] bg-gradient-to-b from-[#fffdf7] to-[#fff0e2] px-5 text-[12px] font-extrabold text-[#ad6848] shadow-[0_3px_0_rgba(186,121,86,.19)] transition-transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}
