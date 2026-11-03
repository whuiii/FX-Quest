
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Download,
  Gift,
  Medal,
  RotateCcw,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Page,
  Panel,
  Pip,
  MissionProgress,
  CompletionCelebration,
} from "@/components/quest-ui";

import { useGame, award, BADGES } from "@/lib/game-store";
import { STUDENT_QUIZ, learningScore } from "@/lib/quiz";
import {
  compareStrategies,
  breakEvenSpot,
  fmtRM,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

// =========================================================
// ROUTE CONFIGURATION
// =========================================================

export const Route = createFileRoute("/mission/student/results")({
  head: () => ({
    meta: [
      {
        title: "Mission Results — The Tuition Deadline — FX Quest",
      },
      {
        name: "description",
        content:
          "Your financial outcome, learning score, badges and key takeaways.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Mission Results — FX Quest",
      },
      {
        property: "og:description",
        content: "See how you did in Currency City.",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Results,
});

// =========================================================
// MAIN RESULTS PAGE
// =========================================================

function Results() {
  const g = useGame();

  // Preserve the original quiz score calculation.
  const answers = g.quiz?.answers ?? {};
  const score = learningScore(answers);

  // Retrieve the student's financial decision.
  const m = g.lastMission;

  // Recalculate the original financial outcomes.
  const c = m
    ? compareStrategies(m.st, m.iMYR)
    : null;

  // Preserve the original Global Master badge condition.
  const allWorlds = [
    "inflation",
    "interest",
    "currency",
    "harbor",
  ].every((id) => g.completed.includes(id));

  useEffect(() => {
    if (g.quiz && score >= 80 && allWorlds) {
      award({ badge: "global-master" });
    }
  }, [score, allWorlds, g.quiz !== undefined]);

  // -------------------------------------------------------
  // Derived results for display only
  // -------------------------------------------------------

  const chosenRemaining =
    m && c
      ? m.choice === "A"
        ? c.a.remaining
        : c.b.remaining
      : null;

  const alternateRemaining =
    m && c
      ? m.choice === "A"
        ? c.b.remaining
        : c.a.remaining
      : null;

  const chosenName =
    m?.choice === "A"
      ? "Convert Today"
      : "Save in MYR";

  const betterChoice =
    c?.better === "tie"
      ? "Both paths tie"
      : c?.better === "A"
        ? "Convert Today"
        : "Save in MYR";

  const correctFirstTry = Object.values(answers).filter(
    (points) => points === 20
  ).length;

  const correctSecondTry = Object.values(answers).filter(
    (points) => points === 10
  ).length;

  const earnedBadges = BADGES.filter((badge) =>
    g.badges.includes(badge.id)
  );

  // -------------------------------------------------------
  // Export the original financial and learning summary.
  // -------------------------------------------------------

  const exportSummary = () => {
    const lines = [
      "FX Quest — Tuition Deadline summary (hypothetical simulation)",
      "",
      m && c
        ? `Choice: ${m.choice} | St=${m.st.toFixed(2)} MYR/USD | iMYR=${(m.iMYR * 100).toFixed(1)}%`
        : "",
      m && c
        ? `A remaining: ${fmtRM(c.a.remaining)} | B remaining: ${fmtRM(c.b.remaining)} | Break-even: ${breakEvenSpot(m.iMYR).toFixed(4)}`
        : "",
      "",
      `Learning score: ${score}/100`,
      "",
      ...STUDENT_QUIZ.map(
        (q) =>
          `- ${q.category}: ${answers[q.id] ?? 0}/20`
      ),
      "",
      "Educational simulation only. Not investment advice.",
    ]
      .filter((line) => line !== null && line !== undefined)
      .join("\n");

    // Generate a local text download without changing game state.
    const blob = new Blob([lines], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "fx-quest-summary.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Release the temporary download URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // -------------------------------------------------------
  // Empty state when the quiz has not been completed.
  // -------------------------------------------------------

  if (!g.quiz) {
    return (
      <Page>
        <div className="mx-auto max-w-xl py-12">
          <Panel className="space-y-5 p-7 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
              <BookOpen className="h-9 w-9 text-primary" />
            </div>

            <h1 className="font-display text-2xl font-extrabold">
              Your Adventure Awaits!
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Complete the Currency City mission and knowledge
              challenge to unlock your results.
            </p>

            <Button asChild variant="quest" size="lg">
              <Link to="/mission/student">
                Start Mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Panel>
        </div>
      </Page>
    );
  }

  // =======================================================
  // RESULTS PAGE
  // =======================================================

  return (
    <Page wide>
      <div className="w-full min-w-0">

        {/* =================================================
            COMPACT FULL-WIDTH ADVENTURE HEADER
        ================================================= */}

        <div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-50 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

          <div className="pointer-events-none absolute right-7 top-6 text-3xl opacity-70 sm:text-4xl">
            ✨
          </div>

          <div className="relative z-10">

            {/* Mission labels */}
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

              <span className="rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                🗺️ Mission 01 · Stage 04
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-800 sm:text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Currency City Cleared
              </span>

            </div>

            {/* Header title */}
            <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
              🎉 Mission Complete!
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
              Congratulations, adventurer! You've completed
              the Tuition Deadline challenge. Discover your
              financial outcome, learning achievements and rewards.
            </p>

            {/* Same shared progress component as Play and Quiz */}
            <div className="mt-4 rounded-2xl border border-white/80 bg-white/65 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3 [&_ol]:mb-0">
              <MissionProgress
                steps={[
                  "Briefing",
                  "Decide",
                  "Quiz",
                  "Results",
                ]}
                current={3}
              />
            </div>

          </div>
        </div>

        {/* =================================================
            CELEBRATION SECTION
        ================================================= */}

        <div className="mb-7 overflow-hidden rounded-[28px] border border-amber-200/80 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-5 shadow-md shadow-amber-900/5 sm:p-7 lg:rounded-[32px]">

          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:gap-8">

            {/* Celebration message */}
            <div className="min-w-0 space-y-4">

              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-extrabold text-amber-800">
                <Sparkles className="h-4 w-4" />
                Adventure Milestone Unlocked
              </span>

              <h2 className="font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                You're a Currency City Explorer!
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                You explored the impact of exchange rates,
                made a financial decision, and tested your
                understanding of international finance.
              </p>

              {/* Summary highlights */}
              <div className="flex flex-wrap gap-2">

                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-2 text-xs font-bold text-amber-800">
                  <Star className="h-4 w-4" />
                  {score} Learning XP
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-xs font-bold text-sky-800">
                  <Coins className="h-4 w-4" />
                  {Math.round(score / 2)} Quiz Coins
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-2 text-xs font-bold text-emerald-800">
                  <Trophy className="h-4 w-4" />
                  4 Stages Completed
                </span>

              </div>

            </div>

            {/* Preserve the existing celebration animation */}
            <div className="min-w-0 overflow-hidden rounded-2xl bg-white/55 p-3">
              <CompletionCelebration />
            </div>

          </div>
        </div>

        {/* =================================================
            MAIN RESULTS — TWO EQUAL DESKTOP COLUMNS
        ================================================= */}

        <div className="grid min-w-0 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">

          {/* ===============================================
              FINANCIAL OUTCOME PANEL
          =============================================== */}

          <Panel className="flex min-w-0 flex-col space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-primary">
                <Wallet className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Your Financial Journey
                </p>

                <h2 className="font-display text-xl font-extrabold">
                  Money Outcome
                </h2>
              </div>

            </div>

            {m && c ? (
              <>

                {/* Selected strategy */}
                <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 p-4 sm:p-5">

                  <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Your Chosen Strategy
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">

                    <span className="text-2xl">
                      {m.choice === "A" ? "💵" : "🏦"}
                    </span>

                    <span className="font-display text-lg font-extrabold text-foreground">
                      Path {m.choice} · {chosenName}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Future exchange rate:{" "}
                    <b>{m.st.toFixed(2)} MYR/USD</b>
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    MYR deposit interest:{" "}
                    <b>{(m.iMYR * 100).toFixed(1)}%</b>
                  </p>

                </div>

                {/* Side-by-side strategy outcomes */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* Path A */}
                  <div
                    className={cn(
                      "relative min-w-0 rounded-2xl border-2 bg-sky-50/80 p-4",
                      m.choice === "A"
                        ? "border-sky-400 shadow-sm"
                        : "border-sky-100"
                    )}
                  >

                    {m.choice === "A" && (
                      <span className="mb-3 inline-block rounded-full bg-sky-200 px-2.5 py-1 text-[10px] font-extrabold text-sky-800">
                        Your Choice
                      </span>
                    )}

                    <p className="text-xs font-bold text-sky-800">
                      💵 Path A
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Convert Today
                    </p>

                    <p className="mt-3 break-words font-display text-xl font-extrabold tabular-nums text-foreground sm:text-2xl">
                      {fmtRM(c.a.remaining)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Remaining after tuition
                    </p>

                  </div>

                  {/* Path B */}
                  <div
                    className={cn(
                      "relative min-w-0 rounded-2xl border-2 bg-emerald-50/80 p-4",
                      m.choice === "B"
                        ? "border-emerald-400 shadow-sm"
                        : "border-emerald-100"
                    )}
                  >

                    {m.choice === "B" && (
                      <span className="mb-3 inline-block rounded-full bg-emerald-200 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800">
                        Your Choice
                      </span>
                    )}

                    <p className="text-xs font-bold text-emerald-800">
                      🏦 Path B
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Save in MYR
                    </p>

                    <p className="mt-3 break-words font-display text-xl font-extrabold tabular-nums text-foreground sm:text-2xl">
                      {fmtRM(c.b.remaining)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Remaining after tuition
                    </p>

                  </div>

                </div>

                {/* Player's actual financial outcome */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5">

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-700" />

                    <p className="text-sm font-extrabold text-amber-900">
                      Your Final Balance
                    </p>
                  </div>

                  <p className="mt-2 break-words font-display text-3xl font-extrabold tabular-nums text-foreground">
                    {fmtRM(chosenRemaining ?? 0)}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-amber-900/80">
                    {chosenRemaining !== null &&
                    chosenRemaining < 0
                      ? "Your chosen strategy resulted in a tuition funding shortfall."
                      : "Your chosen strategy covered tuition under this scenario."}
                  </p>

                </div>

                {/* Alternate outcome */}
                <div className="mt-auto rounded-2xl border border-border bg-muted/40 p-4">

                  <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                    Alternate Ending
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    If you had chosen{" "}
                    <b>
                      Path {m.choice === "A" ? "B" : "A"}
                    </b>
                    , your remaining balance would be{" "}
                    <b>
                      {fmtRM(alternateRemaining ?? 0)}
                    </b>
                    .
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Better financial outcome in this scenario:{" "}
                    <b>{betterChoice}</b>
                  </p>

                </div>

              </>
            ) : (
              <div className="rounded-2xl bg-muted/50 p-5">
                <p className="text-sm text-muted-foreground">
                  No financial decision was recorded.
                  Replay the simulation to compare strategies.
                </p>
              </div>
            )}

          </Panel>

          {/* ===============================================
              LEARNING SCORE PANEL
          =============================================== */}

          <Panel className="flex min-w-0 flex-col space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                  Your Knowledge Achievement
                </p>

                <h2 className="font-display text-xl font-extrabold">
                  Learning Score
                </h2>
              </div>

            </div>

            {/* Score hero */}
            <div className="relative overflow-hidden rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 p-5 sm:p-6">

              <div className="pointer-events-none absolute -right-7 -top-7 h-28 w-28 rounded-full bg-violet-200/30 blur-2xl" />

              <div className="relative flex flex-wrap items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
                    Total Learning Points
                  </p>

                  <div className="mt-2 flex items-baseline gap-1">

                    <span className="font-display text-5xl font-extrabold tabular-nums text-foreground">
                      {score}
                    </span>

                    <span className="text-xl font-bold text-muted-foreground">
                      / 100
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Based on your quiz answers
                  </p>
                </div>

                {/* Circular score indicator */}
                <div
                  className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full p-2"
                  style={{
                    background: `conic-gradient(#34bfa3 ${score}%, #dceaf1 ${score}% 100%)`,
                  }}
                  role="img"
                  aria-label={`Learning score ${score} out of 100`}
                >

                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-inner">

                    <Trophy className="h-6 w-6 text-amber-500" />

                    <span className="mt-1 text-sm font-extrabold text-foreground">
                      {score}%
                    </span>

                  </div>

                </div>

              </div>
            </div>

            {/* Quiz performance statistics */}
            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl bg-emerald-50 p-4">

                <p className="text-xs font-bold text-emerald-800">
                  First Try
                </p>

                <p className="mt-1 font-display text-2xl font-extrabold text-emerald-800">
                  {correctFirstTry}
                </p>

                <p className="text-xs text-emerald-700">
                  Correct answers
                </p>

              </div>

              <div className="rounded-2xl bg-sky-50 p-4">

                <p className="text-xs font-bold text-sky-800">
                  Second Try
                </p>

                <p className="mt-1 font-display text-2xl font-extrabold text-sky-800">
                  {correctSecondTry}
                </p>

                <p className="text-xs text-sky-700">
                  Correct answers
                </p>

              </div>

            </div>

            {/* Detailed category scores */}
            <div className="space-y-4">

              <h3 className="font-display text-base font-extrabold">
                📊 Knowledge Breakdown
              </h3>

              {STUDENT_QUIZ.map((q) => {

                const points = answers[q.id] ?? 0;
                const percentage = (points / 20) * 100;

                return (
                  <div key={q.id} className="space-y-2">

                    <div className="flex items-start justify-between gap-3 text-sm">

                      <span className="min-w-0 font-semibold text-foreground/80">
                        {q.category}
                      </span>

                      <span className="shrink-0 font-extrabold tabular-nums text-primary">
                        {points}/20
                      </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-sky-100">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Scoring explanation */}
            <div className="mt-auto rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

              <div className="flex items-start gap-2">

                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-xs leading-relaxed text-emerald-900">
                  Your learning score is based on knowledge,
                  not market luck. A less profitable financial
                  decision does not reduce your quiz points.
                </p>

              </div>

            </div>

          </Panel>

        </div>

        {/* =================================================
            ACHIEVEMENT BADGES
        ================================================= */}

        <Panel className="mt-7 min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Medal className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                  Rewards Collection
                </p>

                <h2 className="font-display text-xl font-extrabold">
                  Your Achievements
                </h2>
              </div>

            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800">
              {earnedBadges.length} Earned
            </span>

          </div>

          {/* Only show badges actually recorded in game state */}
          {earnedBadges.length > 0 ? (

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {earnedBadges.map((badge) => (

                <div
                  key={badge.id}
                  className="group flex items-center gap-3 rounded-[22px] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-white text-3xl shadow-sm">
                    {badge.emoji}
                  </div>

                  <div className="min-w-0">

                    <p className="font-display text-sm font-extrabold leading-snug text-foreground">
                      {badge.name}
                    </p>

                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Unlocked
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="rounded-2xl bg-muted/50 p-5 text-sm text-muted-foreground">
              Your earned badges will appear here as you
              complete adventures.
            </div>

          )}

        </Panel>

        {/* =================================================
            PIP'S FINAL ADVICE + ACTIONS
        ================================================= */}

        <div className="mt-7 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:gap-8">

          {/* Pip's takeaway */}
          <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-primary" />

              <h2 className="font-display text-xl font-extrabold">
                Pip's Final Advice
              </h2>

            </div>

            <Pip mood="celebrating" size={80}>
              <b>Key takeaways:</b> converting today removes
              FX risk for the tuition payment, while saving
              in MYR earns interest but leaves you exposed
              to the future exchange rate.
              {" "}
              Break-even here was{" "}
              <b>
                {m
                  ? breakEvenSpot(m.iMYR).toFixed(2)
                  : "4.65"}
              </b>{" "}
              MYR/USD.
              {" "}
              PPP and IRP provide theoretical benchmarks,
              not guaranteed predictions.
            </Pip>

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-sky-50 p-4">

                <p className="text-sm font-extrabold text-sky-900">
                  💵 Convert Today
                </p>

                <p className="mt-2 text-xs leading-relaxed text-sky-900/75">
                  Locks in the tuition exchange rate
                  and reduces uncertainty about its MYR cost.
                </p>

              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">

                <p className="text-sm font-extrabold text-emerald-900">
                  🏦 Save in MYR
                </p>

                <p className="mt-2 text-xs leading-relaxed text-emerald-900/75">
                  Earns deposit interest, but the future
                  MYR/USD exchange rate can change your outcome.
                </p>

              </div>

            </div>

          </Panel>

          {/* Next actions */}
          <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Gift className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-xl font-extrabold">
                  What's Next?
                </h2>

                <p className="text-xs text-muted-foreground">
                  Your adventure continues!
                </p>
              </div>

            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Explore different economic scenarios,
              save your learning summary, or discover
              another destination on the Adventure Map.
            </p>

            {/* Replay the simulation */}
            <Button
              asChild
              variant="quest"
              size="lg"
              className="min-h-13 w-full rounded-2xl font-extrabold"
            >
              <Link to="/mission/student/play">
                <RotateCcw className="mr-2 h-4 w-4" />
                Replay Simulation
              </Link>
            </Button>

            {/* Download original summary */}
            <Button
              variant="bubble"
              onClick={exportSummary}
              className="min-h-12 w-full rounded-2xl font-bold"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Summary
            </Button>

            {/* Return to Adventure Map */}
            <Button
              asChild
              variant="sunny"
              className="min-h-12 w-full rounded-2xl font-bold"
            >
              <Link to="/map">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Adventure Map
              </Link>
            </Button>

            <p className="pt-2 text-center text-xs leading-relaxed text-muted-foreground">
              All outcomes are hypothetical and intended
              for educational purposes only.
            </p>

          </Panel>

        </div>

      </div>
    </Page>
  );
}
