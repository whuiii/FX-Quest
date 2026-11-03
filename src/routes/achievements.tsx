
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Coins,
  Star,
  Trophy,
  Sparkles,
  Lock,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Page, Panel, Pip } from "@/components/quest-ui";

import {
  useGame,
  BADGES,
  CHAPTERS,
  resetGame,
  level,
} from "@/lib/game-store";

import { cn } from "@/lib/utils";

// =========================================================
// ACHIEVEMENTS ROUTE
// =========================================================

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Achievement Book — FX Quest" },
      {
        name: "description",
        content: "Your badges, stars, XP and quest coins in FX Quest.",
      },
      {
        property: "og:title",
        content: "Achievement Book — FX Quest",
      },
      {
        property: "og:description",
        content: "Collect badges across all four islands.",
      },
    ],
  }),

  component: Achievements,
});

// =========================================================
// MAIN ACHIEVEMENTS PAGE
// =========================================================

function Achievements() {
  const g = useGame();

  // Calculate progress from actual game data.
  const playerLevel = level(g.xp);

  const totalMissions = CHAPTERS.length;

  const completedMissions = CHAPTERS.filter((chapter) =>
    g.completed.includes(chapter.id)
  ).length;

  const totalBadges = BADGES.length;

  const earnedBadges = BADGES.filter((badge) =>
    g.badges.includes(badge.id)
  ).length;

  const progress =
    totalMissions > 0
      ? (completedMissions / totalMissions) * 100
      : 0;

  // Preserve the original reset confirmation.
  const handleReset = () => {
    if (
      window.confirm(
        "Reset all progress? This will remove your XP, coins, badges, completed missions, and avatar customizations."
      )
    ) {
      resetGame();
    }
  };

  return (
    <Page wide>
      <div className="w-full min-w-0 space-y-7 lg:space-y-9">

        {/* =================================================
            ACHIEVEMENT HEADER
        ================================================= */}

        <section className="relative overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-amber-100 via-orange-50 to-pink-100 px-5 py-6 shadow-soft sm:px-7 sm:py-7 lg:rounded-[32px] lg:px-9 lg:py-8">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-64 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative z-10">

            {/* Header badge */}
            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-xs font-extrabold text-amber-800 shadow-sm">
                <Sparkles className="h-4 w-4" />
                FX Quest · Explorer Collection
              </span>

            </div>

            {/* Title and subtitle */}
            <div className="flex flex-wrap items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border-2 border-amber-300 bg-gradient-to-br from-amber-200 to-yellow-100 shadow-sm">
                <Trophy className="h-9 w-9 text-amber-700" />
              </div>

              <div className="min-w-0">

                <h1 className="font-display text-[27px] font-extrabold leading-tight text-[#40325f] sm:text-3xl lg:text-[38px]">
                  Achievement Book
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#756281] sm:text-[15px]">
                  Every adventure tells a story.
                  Collect your badges, celebrate your milestones,
                  and become a global finance explorer!
                </p>

              </div>

            </div>

            {/* Mission progress */}
            <div className="mt-6 rounded-[22px] border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-5">

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />

                  <span className="font-display text-sm font-extrabold text-[#49386a] sm:text-base">
                    Your Adventure Progress
                  </span>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                  {completedMissions}/{totalMissions} Missions
                </span>

              </div>

              {/* Progress bar */}
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-[#eadfce] shadow-inner"
                role="progressbar"
                aria-label="Completed missions"
                aria-valuenow={completedMissions}
                aria-valuemin={0}
                aria-valuemax={totalMissions}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#f6c95c] via-[#f4b84b] to-[#ee9b5d] transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs font-medium text-[#816d8f]">
                {completedMissions === totalMissions && totalMissions > 0
                  ? "Amazing! You've completed every mission!"
                  : "Keep exploring to complete your adventure collection."}
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            PLAYER STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">

          {/* Level */}
          <Panel className="min-w-0 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
              <Star className="h-6 w-6 text-violet-600" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">
              Explorer Level
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold text-[#49386a] sm:text-3xl">
              {playerLevel}
            </p>

          </Panel>

          {/* XP */}
          <Panel className="min-w-0 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100">
              <Sparkles className="h-6 w-6 text-sky-600" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">
              Experience Points
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold text-[#49386a] sm:text-3xl">
              {g.xp.toLocaleString()}
              <span className="ml-1 text-sm font-bold text-muted-foreground">
                XP
              </span>
            </p>

          </Panel>

          {/* Coins */}
          <Panel className="min-w-0 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100">
              <Coins className="h-6 w-6 text-amber-600" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">
              Quest Coins
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold text-[#49386a] sm:text-3xl">
              {g.coins.toLocaleString()}
            </p>

          </Panel>

          {/* Badges */}
          <Panel className="min-w-0 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>

            <p className="text-xs font-bold text-muted-foreground">
              Badges Collected
            </p>

            <p className="mt-1 font-display text-2xl font-extrabold text-[#49386a] sm:text-3xl">
              {earnedBadges}
              <span className="ml-1 text-sm font-bold text-muted-foreground">
                / {totalBadges}
              </span>
            </p>

          </Panel>

        </div>

        {/* =================================================
            BADGE COLLECTION
        ================================================= */}

        <section className="min-w-0 space-y-5">

          <div className="flex flex-wrap items-end justify-between gap-3">

            <div>

              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                Your Collection
              </p>

              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#40325f] sm:text-3xl">
                🏅 Adventure Badges
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Unlock special badges by completing missions and challenges.
              </p>

            </div>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-800">
              {earnedBadges} of {totalBadges} Unlocked
            </span>

          </div>

          {/* Flexible responsive badge grid */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

            {BADGES.map((badge) => {
              const earned = g.badges.includes(badge.id);

              return (
                <Panel
                  key={badge.id}
                  className={cn(
                    "group relative flex min-w-0 flex-col items-center overflow-hidden border-2 p-5 text-center transition-all duration-300 sm:p-6",
                    earned
                      ? "border-amber-200 bg-gradient-to-b from-white via-amber-50/40 to-white shadow-md hover:-translate-y-1 hover:shadow-lg"
                      : "border-slate-200 bg-white/70 shadow-sm"
                  )}
                >

                  {/* Badge icon */}
                  <div
                    className={cn(
                      "relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border-[5px] text-5xl transition-transform duration-300 group-hover:scale-105",
                      earned
                        ? "border-amber-300 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 shadow-[0_5px_16px_rgba(217,158,59,0.2)]"
                        : "border-slate-200 bg-slate-100"
                    )}
                  >

                    {earned ? (
                      <span aria-hidden="true">
                        {badge.emoji}
                      </span>
                    ) : (
                      <Lock
                        className="h-10 w-10 text-slate-400"
                        aria-hidden="true"
                      />
                    )}

                  </div>

                  {/* Badge name */}
                  <h3 className="font-display text-base font-extrabold leading-snug text-[#443768] sm:text-lg">
                    {badge.name}
                  </h3>

                  {/* Badge description */}
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {badge.desc}
                  </p>

                  {/* Earned or locked */}
                  <span
                    className={cn(
                      "mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold",
                      earned
                        ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border border-slate-200 bg-slate-100 text-slate-500"
                    )}
                  >
                    {earned ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Earned
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        Locked
                      </>
                    )}
                  </span>

                </Panel>
              );
            })}

          </div>

        </section>

        {/* =================================================
            PIP MESSAGE AND RESET
        ================================================= */}

        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0 flex-1 rounded-[28px] border-2 border-emerald-100 bg-white/80 p-4 shadow-sm sm:p-5">

            <Pip mood="excited" size={72}>
              Spend quest coins on avatar accessories in the
              explorer creator — they're cosmetic only,
              never pay-to-win!
            </Pip>

          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            className="min-h-11 shrink-0 gap-2 rounded-2xl px-5 font-bold"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>

        </div>

      </div>
    </Page>
  );
}
