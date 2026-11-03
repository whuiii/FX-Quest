
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Gift,
  MapPin,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Page,
  Panel,
  Pip,
  RateSlider,
  EconomicEventCard,
  Stat,
  RevealFinance,
  Formula,
  AvatarView,
  CompletionCelebration,
} from "@/components/quest-ui";

import { useGame, award } from "@/lib/game-store";
import { holidayBudget } from "@/lib/travel-finance";
import { fmtRM, pct, pppRate } from "@/lib/finance";
import { roleInfo } from "@/lib/roles";
import { cn } from "@/lib/utils";

// =========================================================
// ROUTE CONFIGURATION
// =========================================================

export const Route = createFileRoute("/mission/traveller")({
  head: () => ({
    meta: [
      {
        title: "Cherry Blossom Getaway — FX Quest",
      },
      {
        name: "description",
        content:
          "Protect a RM 10,000 Japan holiday budget and explore JPY quotes, inflation and exchange-rate surprises.",
      },
      {
        property: "og:title",
        content: "Cherry Blossom Getaway — FX Quest",
      },
      {
        property: "og:description",
        content:
          "Explore two holiday paths and help your cherry-blossom dream bloom.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Traveller,
});

// =========================================================
// MISSION STAGES
// =========================================================

const STAGES = [
  { title: "Plan", icon: "🧳" },
  { title: "Postcard", icon: "✉️" },
  { title: "Challenge", icon: "🧠" },
  { title: "Rewards", icon: "🏆" },
];

// =========================================================
// MAIN TRAVELLER MISSION
// =========================================================

function Traveller() {
  const g = useGame();

  // Original gameplay state.
  const [choice, setChoice] = useState<"now" | "wait" | null>(
    null
  );
  const [spot, setSpot] = useState(3.2);
  const [inflation, setInflation] = useState(2);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<"more" | "less" | null>(
    null
  );
  const [ending, setEnding] = useState(false);

  // Preserve original financial calculations.
  const r = holidayBudget(spot, pct(inflation));

  const benchmark = pppRate(
    3,
    0.02,
    pct(inflation)
  );

  const remaining =
    choice === "now"
      ? r.remainingNow
      : r.remainingWait;

  const alternateRemaining =
    choice === "now"
      ? r.remainingWait
      : r.remainingNow;

  const done = g.completed.includes("traveller");

  const avatar =
    g.avatar ?? roleInfo("traveller")?.avatar;

  // Current visual mission stage.
  const currentStage = ending
    ? 3
    : revealed
      ? guess === "more"
        ? 2
        : 2
      : choice
        ? 1
        : 0;

  // -------------------------------------------------------
  // Reset the postcard whenever assumptions change.
  // -------------------------------------------------------

  const updateSpot = (value: number) => {
    setSpot(value);
    setRevealed(false);
    setGuess(null);
  };

  const updateInflation = (value: number) => {
    setInflation(value);
    setRevealed(false);
    setGuess(null);
  };

  const selectChoice = (value: "now" | "wait") => {
    setChoice(value);
    setRevealed(false);
    setGuess(null);
  };

  // -------------------------------------------------------
  // Open postcard.
  // -------------------------------------------------------

  const openPostcard = () => {
    if (!choice) return;

    setRevealed(true);
    setGuess(null);
  };

  // -------------------------------------------------------
  // Finish adventure.
  // -------------------------------------------------------

  const finishAdventure = () => {
    if (!revealed || !choice || guess !== "more") return;

    // Original reward logic.
    // game-store handles first-completion reward protection.
    award({
      xp: 30,
      coins: 20,
      complete: "traveller",
      badge: "holiday-explorer",
    });

    setEnding(true);
  };

  // -------------------------------------------------------
  // Replay without clearing previously earned rewards.
  // -------------------------------------------------------

  const replay = () => {
    setEnding(false);
    setRevealed(false);
    setGuess(null);
  };

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <Page wide>
      <div className="w-full min-w-0">

        {/* =================================================
            FULL-WIDTH CHERRY BLOSSOM HEADER
        ================================================= */}

        <div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-pink-100 via-rose-50 to-sky-100 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

          {/* Soft atmospheric background */}
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-60 w-80 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="pointer-events-none absolute right-8 top-7 text-3xl opacity-60 sm:text-4xl">
            🌸
          </div>

          <div className="relative z-10">

            {/* Mission badges */}
            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-pink-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-rose-700 shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                🗺️ Traveller Adventure · Japan
              </span>

              <span className="rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1 text-[10px] font-extrabold text-amber-800 sm:text-xs">
                ✨ Cherry Blossom Getaway
              </span>

            </div>

            {/* Header title */}
            <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
              🌸 Cherry Blossom Getaway
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
              Your dream Japan holiday is one year away!
              Explore exchange rates, protect your travel
              budget, and discover how economic changes
              can affect your adventure.
            </p>

            {/* Mission progress */}
            <div className="mt-4 rounded-2xl border border-white/80 bg-white/65 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3">

              <div className="grid grid-cols-4 gap-2">

                {STAGES.map((stage, index) => {

                  const active = index === currentStage;
                  const completed = index < currentStage;

                  return (
                    <div
                      key={stage.title}
                      className="flex min-w-0 flex-col items-center gap-1.5 text-center"
                    >

                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm transition-all duration-300 sm:h-10 sm:w-10",

                          completed
                            ? "border-emerald-400 bg-emerald-100"
                            : active
                              ? "border-pink-400 bg-pink-100 shadow-sm"
                              : "border-white bg-white/70"
                        )}
                      >
                        {completed ? "✓" : stage.icon}
                      </div>

                      <span
                        className={cn(
                          "text-[10px] font-extrabold sm:text-xs",
                          active
                            ? "text-rose-700"
                            : completed
                              ? "text-emerald-700"
                              : "text-muted-foreground"
                        )}
                      >
                        {stage.title}
                      </span>

                    </div>
                  );
                })}

              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-pink-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-emerald-400 transition-all duration-500"
                  style={{
                    width: `${
                      ((currentStage + 1) / STAGES.length) * 100
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            INTRODUCTION STRIP
        ================================================= */}

        {!ending && (
          <div className="mb-7 grid items-center gap-4 rounded-[26px] border border-pink-100 bg-white/90 p-4 shadow-sm sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5">

            {/* Traveller avatar */}
            {avatar && (
              <div className="flex justify-center lg:justify-start">
                <AvatarView avatar={avatar} size={76} />
              </div>
            )}

            <div className="min-w-0 space-y-1 text-center lg:text-left">

              <p className="text-sm font-extrabold text-rose-700">
                ✈️ Your Japan Holiday Awaits
              </p>

              <p className="text-sm leading-relaxed text-foreground/75">
                You have{" "}
                <b>RM 10,000</b>{" "}
                for a{" "}
                <b>JPY 300,000</b>{" "}
                holiday at today's prices. Can you
                make your cherry-blossom dream come true?
              </p>

            </div>

            <div className="flex justify-center gap-2 lg:flex-col">

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                RM 10,000 Budget
              </span>

              <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-extrabold text-rose-700">
                1 Year to Go
              </span>

            </div>

          </div>
        )}

        {/* =================================================
            MAIN GAMEPLAY
        ================================================= */}

        {!ending ? (
          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(320px,0.36fr)_minmax(0,0.64fr)] lg:gap-8 xl:gap-9">

            {/* =============================================
                LEFT COLUMN — TRAVEL PLANNER
            ============================================= */}

            <div className="min-w-0 space-y-5">

              <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-rose-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-rose-700">
                    <Wallet className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                      Travel Planner
                    </p>

                    <h2 className="font-display text-xl font-extrabold">
                      Pack Your Budget
                    </h2>
                  </div>

                </div>

                {/* Budget summary */}
                <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-amber-50 p-4">

                  <p className="text-xs font-bold text-muted-foreground">
                    Your Available Budget
                  </p>

                  <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                    RM 10,000
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-rose-700">
                      🌸 Japan
                    </span>

                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-sky-700">
                      💴 JPY 300,000
                    </span>

                  </div>

                </div>

                {/* Future exchange rate */}
                <div className="space-y-2">

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />

                    <h3 className="text-sm font-extrabold">
                      Future Exchange Rate
                    </h3>
                  </div>

                  <RateSlider
                    id="holiday-spot"
                    label="Future spot (MYR per 100 JPY)"
                    value={spot}
                    onChange={updateSpot}
                    min={2.5}
                    max={3.8}
                    step={0.05}
                    unit="MYR/100 JPY"
                    hint="Simulated future spot, not a prediction."
                  />

                </div>

                {/* Inflation slider */}
                <div className="space-y-2">

                  <div className="flex items-center gap-2">
                    <TrendingUpIcon />

                    <h3 className="text-sm font-extrabold">
                      Japan Holiday Inflation
                    </h3>
                  </div>

                  <RateSlider
                    id="holiday-inflation"
                    label="Japan holiday inflation"
                    value={inflation}
                    onChange={updateInflation}
                    min={0}
                    max={8}
                    step={0.5}
                    unit="%"
                  />

                </div>

                {/* Original finance explanation */}
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">

                  <p className="text-xs font-extrabold text-sky-900">
                    💡 Travel Planning Tip
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-sky-900/80">
                    Converting today costs RM 9,000.
                    Future price increases still require
                    a yen top-up. Neither path earns interest
                    in this simplified scenario.
                  </p>

                </div>

              </Panel>

              {/* Pip guidance */}
              <Panel className="min-w-0 space-y-3 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5 lg:rounded-[28px]">

                <h3 className="font-display text-sm font-extrabold text-rose-700">
                  🌸 A Little Help from Pip
                </h3>

                <Pip size={72}>
                  A quote of{" "}
                  <b>3.00 MYR per 100 JPY</b>{" "}
                  means 100 yen costs RM 3.
                  Let's pack a smart travel plan!
                </Pip>

              </Panel>

            </div>

            {/* =============================================
                RIGHT COLUMN — GAMEPLAY
            ============================================= */}

            <div className="min-w-0 space-y-5">

              {/* ===========================================
                  CHOOSE HOLIDAY PATH
              =========================================== */}

              <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-rose-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                    Stage 01 · Your Decision
                  </p>

                  <h2 className="mt-1 font-display text-xl font-extrabold sm:text-2xl">
                    💴 Choose Your Holiday Path
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Should you secure your yen today,
                    or keep your ringgit and exchange later?
                  </p>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Convert today */}
                  <button
                    type="button"
                    aria-pressed={choice === "now"}
                    onClick={() => selectChoice("now")}
                    className={cn(
                      "group min-w-0 rounded-[22px] border-2 p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",

                      choice === "now"
                        ? "border-sky-400 bg-sky-50 shadow-sm"
                        : "border-sky-100 bg-white hover:border-sky-300"
                    )}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                        💴
                      </span>

                      {choice === "now" && (
                        <CheckCircle2 className="h-5 w-5 text-sky-600" />
                      )}

                    </div>

                    <h3 className="font-display text-base font-extrabold">
                      Convert Today
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Secure JPY 300,000 now and
                      prepare for your holiday early.
                    </p>

                    <p className="mt-3 text-sm font-extrabold text-sky-700">
                      RM 9,000 today
                    </p>

                  </button>

                  {/* Wait and convert */}
                  <button
                    type="button"
                    aria-pressed={choice === "wait"}
                    onClick={() => selectChoice("wait")}
                    className={cn(
                      "group min-w-0 rounded-[22px] border-2 p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",

                      choice === "wait"
                        ? "border-emerald-400 bg-emerald-50 shadow-sm"
                        : "border-emerald-100 bg-white hover:border-emerald-300"
                    )}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                        🐷
                      </span>

                      {choice === "wait" && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}

                    </div>

                    <h3 className="font-display text-base font-extrabold">
                      Wait & Convert
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Keep your MYR savings and
                      convert when your trip begins.
                    </p>

                    <p className="mt-3 text-sm font-extrabold text-emerald-700">
                      Exchange next year
                    </p>

                  </button>

                </div>

                {/* Open postcard */}
                <Button
                  variant="quest"
                  size="lg"
                  disabled={!choice || revealed}
                  onClick={openPostcard}
                  className="min-h-12 w-full rounded-2xl font-extrabold"
                >

                  {revealed
                    ? "Travel Postcard Opened ✓"
                    : "✉️ Open Your Travel Postcard"}

                  {!revealed && (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}

                </Button>

              </Panel>

              {/* ===========================================
                  POSTCARD REVEAL
              =========================================== */}

              {revealed && (
                <div className="animate-pop-in space-y-5">

                  <Panel className="min-w-0 space-y-4 border-pink-200 bg-gradient-to-br from-pink-50 via-white to-amber-50 p-5 shadow-md sm:p-6 lg:rounded-[32px]">

                    <div className="flex items-center gap-2">

                      <span className="text-2xl">✉️</span>

                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-rose-600">
                          Stage 02 · Travel Postcard
                        </p>

                        <h2 className="font-display text-xl font-extrabold">
                          A Postcard from Japan
                        </h2>
                      </div>

                    </div>

                    <EconomicEventCard
                      emoji="🌸"
                      title="Greetings from Japan!"
                    >
                      The café owner writes:
                      {" "}
                      “We can't wait to see you!
                      Your trip now costs JPY{" "}
                      {r.futureYen.toLocaleString("en-MY")}.”
                      {" "}
                      The future spot in your scenario is{" "}
                      {spot.toFixed(2)} MYR per 100 JPY.
                    </EconomicEventCard>

                  </Panel>

                  {/* Outcome comparison */}
                  <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-rose-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                    <div>

                      <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                        Your Financial Outcome
                      </p>

                      <h2 className="mt-1 font-display text-xl font-extrabold">
                        💰 Compare Your Holiday Costs
                      </h2>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      <Stat
                        label="Convert today + later top-up"
                        value={fmtRM(r.nowTotal)}
                      />

                      <Stat
                        label="Wait: total trip cost"
                        value={fmtRM(r.wait)}
                      />

                      <Stat
                        label="Today path: remaining"
                        value={fmtRM(r.remainingNow)}
                        tone={
                          r.remainingNow < 0
                            ? "bad"
                            : "good"
                        }
                      />

                      <Stat
                        label="Wait path: remaining"
                        value={fmtRM(r.remainingWait)}
                        tone={
                          r.remainingWait < 0
                            ? "bad"
                            : "good"
                        }
                      />

                    </div>

                    {/* Chosen outcome highlight */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                      <p className="text-xs font-extrabold uppercase tracking-wide text-amber-800">
                        Your Chosen Path's Remaining Budget
                      </p>

                      <p className="mt-2 break-words font-display text-3xl font-extrabold text-foreground">
                        {fmtRM(remaining)}
                      </p>

                    </div>

                    <Pip
                      mood={
                        remaining < 0
                          ? "concerned"
                          : "excited"
                      }
                      size={72}
                    >
                      Your chosen path leaves{" "}
                      <b>{fmtRM(remaining)}</b>.
                      {" "}
                      {remaining < 0
                        ? "There's a shortfall — comparing both paths helps you plan."
                        : "A little breathing room for your adventure!"}
                      {" "}
                      Your rewards come from exploring,
                      not market luck.
                    </Pip>

                  </Panel>

                  {/* =======================================
                      SUITCASE CHALLENGE
                  ======================================= */}

                  <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-rose-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                    <div>

                      <p className="text-xs font-extrabold uppercase tracking-wide text-rose-600">
                        Stage 03 · Knowledge Challenge
                      </p>

                      <h2 className="mt-1 font-display text-xl font-extrabold">
                        🧠 Suitcase Challenge
                      </h2>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        One final question before your
                        holiday adventure is complete!
                      </p>

                    </div>

                    <div className="rounded-2xl bg-sky-50 p-4 sm:p-5">

                      <p className="text-sm font-extrabold leading-relaxed text-foreground sm:text-base">
                        If the exchange-rate quote rises
                        from 3.00 to 3.20 MYR per 100 JPY,
                        does the same amount of yen cost
                        more or less ringgit?
                      </p>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      <Button
                        variant={
                          guess === "more"
                            ? "quest"
                            : "bubble"
                        }
                        aria-pressed={guess === "more"}
                        onClick={() => setGuess("more")}
                        className="min-h-12 whitespace-normal rounded-2xl py-3 font-bold"
                      >
                        💴 More Ringgit
                      </Button>

                      <Button
                        variant={
                          guess === "less"
                            ? "quest"
                            : "bubble"
                        }
                        aria-pressed={guess === "less"}
                        onClick={() => setGuess("less")}
                        className="min-h-12 whitespace-normal rounded-2xl py-3 font-bold"
                      >
                        💸 Less Ringgit
                      </Button>

                    </div>

                    {guess && (
                      <div className="rounded-2xl bg-sky-50/60 p-3">

                        <Pip
                          mood={
                            guess === "more"
                              ? "celebrating"
                              : "thinking"
                          }
                          size={72}
                        >
                          {guess === "more"
                            ? "Exactly!"
                            : "Try again!"}
                          {" "}
                          A higher MYR-per-100-JPY quote
                          means yen costs more ringgit.
                        </Pip>

                      </div>
                    )}

                    {guess === "more" && (
                      <Button
                        variant="quest"
                        size="lg"
                        onClick={finishAdventure}
                        className="min-h-12 w-full rounded-2xl font-extrabold"
                      >
                        Finish My Adventure
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                  </Panel>

                </div>
              )}

              {/* ===========================================
                  FINANCIAL LEARNING EXPLANATION
              =========================================== */}

              <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-sm sm:p-6 lg:rounded-[32px]">

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Learning Corner
                  </p>

                  <h2 className="mt-1 font-display text-lg font-extrabold">
                    📚 Understand the Finance
                  </h2>

                </div>

                <RevealFinance>

                  <Formula>
                    Future JPY cost = 300,000 ×
                    (1 + {inflation}%) =
                    {" "}
                    {r.futureYen.toFixed(0)}
                  </Formula>

                  <Formula>
                    Wait cost = future JPY / 100 ×
                    {" "}
                    {spot.toFixed(2)}
                  </Formula>

                  <Formula>
                    Today path = RM 9,000 +
                    extra JPY / 100 × future spot
                  </Formula>

                  <p>
                    Relative PPP with Malaysia inflation
                    at 2% implies{" "}
                    {benchmark.toFixed(4)} MYR per 100 JPY.
                    This long-run theory benchmark is
                    separate from your simulated future spot.
                  </p>

                  <p>
                    No FX fees, spreads, taxes or interest;
                    all trip items are yen-priced.
                    Converting early covers only today's
                    yen budget, not future price increases.
                    Hypothetical data, not investment advice.
                  </p>

                </RevealFinance>

              </Panel>

            </div>

          </div>

        ) : (

          /* =================================================
              COMPLETION / REWARDS SCREEN
          ================================================= */

          <div className="animate-pop-in space-y-6">

            <Panel className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-pink-50 to-emerald-50 p-5 shadow-lg sm:p-7 lg:rounded-[32px] lg:p-9">

              <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">

                <div className="space-y-4">

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    Adventure Completed
                  </span>

                  <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                    🎉 Your Holiday Plan Is Packed!
                  </h2>

                  <p className="text-sm leading-relaxed text-foreground/75 sm:text-base">
                    You've explored both exchange strategies
                    and mastered the Japanese yen quote.
                    Your Cherry Blossom Getaway is complete!
                  </p>

                  <div className="flex flex-wrap gap-2">

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-amber-800">
                      <Star className="h-4 w-4" />
                      Holiday Explorer
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-sky-800">
                      <Coins className="h-4 w-4" />
                      20 Coins
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-emerald-800">
                      <Trophy className="h-4 w-4" />
                      30 XP
                    </span>

                  </div>

                </div>

                <div className="min-w-0 rounded-2xl bg-white/55 p-3">
                  <CompletionCelebration />
                </div>

              </div>

            </Panel>

            {/* Final financial results */}
            <div className="grid gap-6 lg:grid-cols-2">

              <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg sm:p-6 lg:rounded-[32px]">

                <h3 className="font-display text-xl font-extrabold">
                  💰 Your Holiday Outcome
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">

                  <Stat
                    label="Your path's remaining budget"
                    value={fmtRM(remaining)}
                    tone={
                      remaining < 0
                        ? "bad"
                        : "good"
                    }
                  />

                  <Stat
                    label="Alternate path's remaining"
                    value={fmtRM(alternateRemaining)}
                    tone={
                      alternateRemaining < 0
                        ? "bad"
                        : "good"
                    }
                  />

                </div>

                <Pip mood="celebrating" size={72}>
                  You explored both paths and mastered
                  the yen quote.
                  {" "}
                  {done
                    ? "Your Holiday Explorer badge and Star clip are yours to keep."
                    : "A new learning adventure is complete!"}
                </Pip>

              </Panel>

              {/* Reward and next actions */}
              <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg sm:p-6 lg:rounded-[32px]">

                <div className="flex items-center gap-2">

                  <Gift className="h-5 w-5 text-amber-600" />

                  <h3 className="font-display text-xl font-extrabold">
                    Your Adventure Rewards
                  </h3>

                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                  <p className="font-extrabold text-amber-900">
                    🌸 Holiday Explorer
                  </p>

                  <p className="mt-1 text-sm text-amber-800">
                    ⭐ Star Clip Unlocked
                  </p>

                </div>

                <Button
                  variant="bubble"
                  onClick={replay}
                  className="min-h-12 w-full rounded-2xl font-bold"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Replay with a New Plan
                </Button>

                <Button
                  asChild
                  variant="quest"
                  className="min-h-12 w-full rounded-2xl font-bold"
                >
                  <Link to="/map">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Adventure Map
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="sunny"
                  className="min-h-12 w-full rounded-2xl font-bold"
                >
                  <Link to="/avatar">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try My Star Clip
                  </Link>
                </Button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  First completion earns 30 XP and 20 coins.
                  Replay to explore different outcomes
                  without duplicate completion rewards.
                </p>

              </Panel>

            </div>

          </div>
        )}

      </div>
    </Page>
  );
}

// =========================================================
// SMALL DECORATIVE ICON HELPER
// =========================================================

function TrendingUpIcon() {
  return (
    <span className="text-base" aria-hidden="true">
      📈
    </span>
  );
}
