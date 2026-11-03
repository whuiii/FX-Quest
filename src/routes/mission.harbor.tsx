
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Gift,
  Package,
  RotateCcw,
  ShieldCheck,
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
  CompletionCelebration,
  RateSlider,
  Stat,
  RevealFinance,
  Formula,
  HypoTag,
  EconomicEventCard,
} from "@/components/quest-ui";

import {
  importerHedge,
  pct,
  fmtRM,
  fmtPct,
} from "@/lib/finance";

import { useGame, award } from "@/lib/game-store";
import { cn } from "@/lib/utils";

// =========================================================
// ROUTE CONFIGURATION
// =========================================================

export const Route = createFileRoute("/mission/harbor")({
  head: () => ({
    meta: [
      {
        title: "Trade Harbor: The Import Challenge — FX Quest",
      },
      {
        name: "description",
        content:
          "Compare a covered-IRP forward hedge with an unhedged USD 20,000 payable in 3 months.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Trade Harbor — FX Quest",
      },
      {
        property: "og:description",
        content:
          "Hedge or wait? Plan an importer's USD invoice.",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Harbor,
});

// =========================================================
// MISSION PROGRESS
// =========================================================

const STAGES = [
  { title: "Plan", icon: "📋" },
  { title: "Market", icon: "📦" },
  { title: "Challenge", icon: "🧠" },
  { title: "Rewards", icon: "🏆" },
];

// =========================================================
// MAIN HARBOR MISSION
// =========================================================

function Harbor() {
  const g = useGame();

  // -------------------------------------------------------
  // Original mission state
  // -------------------------------------------------------

  const [choice, setChoice] = useState<
    "hedge" | "wait" | null
  >(null);

  const [event, setEvent] = useState(false);

  const [understood, setUnderstood] = useState(false);

  const [answer, setAnswer] = useState<
    "certainty" | "cheapest" | null
  >(null);

  const [st, setSt] = useState(4.6);
  const [iM, setIM] = useState(3);
  const [iU, setIU] = useState(5);

  // Local completion screen.
  const [ending, setEnding] = useState(false);

  // -------------------------------------------------------
  // Preserve original financial calculations
  // -------------------------------------------------------

  const r = importerHedge({
    usd: 20000,
    s0: 4.5,
    iMYRAnnual: pct(iM),
    iUSDAnnual: pct(iU),
    months: 3,
    futureSpot: st,
  });

  const done = g.completed.includes("harbor");

  // -------------------------------------------------------
  // Derived results
  // -------------------------------------------------------

  const chosenCost =
    choice === "hedge"
      ? r.hedgedMYR
      : r.unhedgedMYR;

  const alternateCost =
    choice === "hedge"
      ? r.unhedgedMYR
      : r.hedgedMYR;

  const remainingBudget =
    100000 - chosenCost;

  const currentStage = ending
    ? 3
    : event
      ? 2
      : choice
        ? 1
        : 0;

  // -------------------------------------------------------
  // Select payment strategy
  // -------------------------------------------------------

  const selectChoice = (
    value: "hedge" | "wait"
  ) => {
    setChoice(value);

    // The supplier event remains hidden until revealed.
    setEvent(false);
    setAnswer(null);
    setUnderstood(false);
  };

  // -------------------------------------------------------
  // Market assumptions
  // -------------------------------------------------------

  const updateSpot = (value: number) => {
    setSt(value);

    // After the supplier update, players may explore
    // alternative future spot-rate scenarios.
    setAnswer(null);
    setUnderstood(false);
  };

  const updateMYRRate = (value: number) => {
    setIM(value);

    setAnswer(null);
    setUnderstood(false);
  };

  const updateUSDRate = (value: number) => {
    setIU(value);

    setAnswer(null);
    setUnderstood(false);
  };

  // -------------------------------------------------------
  // Supplier market event
  // -------------------------------------------------------

  const revealSupplierUpdate = () => {
    if (!choice || event) return;

    // Preserve the original market surprise.
    setSt(4.9);

    setEvent(true);
    setAnswer(null);
    setUnderstood(false);
  };

  // -------------------------------------------------------
  // Knowledge challenge
  // -------------------------------------------------------

  const selectAnswer = (
    value: "certainty" | "cheapest"
  ) => {
    setAnswer(value);
    setUnderstood(value === "certainty");
  };

  // -------------------------------------------------------
  // Complete the chapter
  // -------------------------------------------------------

  const completeMission = () => {
    if (!understood || !event || !choice) return;

    // Prevent a second reward call for a mission
    // already recorded as completed.
    if (!done) {
      award({
        xp: 30,
        coins: 20,
        complete: "harbor",
      });
    }

    setEnding(true);
  };

  // -------------------------------------------------------
  // Replay the simulation without removing progress
  // -------------------------------------------------------

  const replayMission = () => {
    setEnding(false);
    setChoice(null);
    setEvent(false);
    setAnswer(null);
    setUnderstood(false);

    setSt(4.6);
    setIM(3);
    setIU(5);
  };

  // =======================================================
  // PAGE LAYOUT
  // =======================================================

  return (
    <Page wide>
      <div className="w-full min-w-0">

        {/* =================================================
            FULL-WIDTH HARBOR HEADER
        ================================================= */}

        <div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-amber-100 via-orange-50 to-cyan-100 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="pointer-events-none absolute right-8 top-7 text-3xl opacity-60 sm:text-4xl">
            ⚓
          </div>

          <div className="relative z-10">

            {/* Mission labels */}
            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-amber-800 shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                🗺️ Business Owner Adventure
              </span>

              <HypoTag />

            </div>

            {/* Header title */}
            <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
              ⚓ Trade Harbor — The Import Challenge
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
              Your shop must pay an overseas supplier
              in three months. Explore exchange-rate
              risks, compare payment strategies, and
              protect your business cash flow.
            </p>

            {/* Adventure journey progress */}
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
                              ? "border-amber-400 bg-amber-100 shadow-sm"
                              : "border-white bg-white/70"
                        )}
                      >
                        {completed ? "✓" : stage.icon}
                      </div>

                      <span
                        className={cn(
                          "text-[10px] font-extrabold sm:text-xs",
                          active
                            ? "text-amber-800"
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
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
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
            BUSINESS INTRODUCTION
        ================================================= */}

        {!ending && (
          <div className="mb-7 grid items-center gap-4 rounded-[26px] border border-amber-100 bg-white/90 p-4 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-5">

            <div className="min-w-0 space-y-2">

              <p className="text-sm font-extrabold text-amber-800">
                📦 A New Shipment Is Coming!
              </p>

              <p className="text-sm leading-relaxed text-foreground/75">
                Your shop owes a supplier{" "}
                <b>USD 20,000</b>{" "}
                in{" "}
                <b>3 months</b>.
                Today's spot rate is{" "}
                <b>4.50 MYR/USD</b>.
                Will you lock in a forward exchange rate,
                or pay at the future spot rate?
              </p>

            </div>

            <div className="flex flex-wrap justify-center gap-2 lg:flex-col">

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                💰 RM 100,000 Budget
              </span>

              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800">
                📅 3 Months to Pay
              </span>

            </div>

          </div>
        )}

        {/* =================================================
            ACTIVE GAMEPLAY
        ================================================= */}

        {!ending ? (

          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(320px,0.36fr)_minmax(0,0.64fr)] lg:gap-8 xl:gap-9">

            {/* =============================================
                LEFT COLUMN — MARKET SIMULATOR
            ============================================= */}

            <div className="min-w-0 space-y-5">

              <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-amber-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                    <Wallet className="h-6 w-6" />
                  </div>

                  <div>

                    <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                      Trade Simulator
                    </p>

                    <h2 className="font-display text-xl font-extrabold">
                      Market Conditions
                    </h2>

                  </div>

                </div>

                {/* Supplier invoice */}
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">

                  <p className="text-xs font-bold text-amber-800">
                    Supplier Invoice
                  </p>

                  <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                    USD 20,000
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-amber-800">
                      📦 Import Order
                    </span>

                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-cyan-800">
                      ⏳ 3 Months
                    </span>

                  </div>

                </div>

                {/* Future spot rate */}
                <div className="space-y-2">

                  <div className="flex items-center gap-2">

                    <TrendingUp className="h-4 w-4 text-primary" />

                    <h3 className="text-sm font-extrabold">
                      Future Exchange Rate
                    </h3>

                  </div>

                  <RateSlider
                    id="st"
                    label="Spot in 3 months (scenario)"
                    value={st}
                    onChange={updateSpot}
                    min={4}
                    max={5.2}
                    step={0.05}
                    unit="MYR/USD"
                  />

                </div>

                {/* MYR interest rate */}
                <RateSlider
                  id="im"
                  label="MYR annual interest rate"
                  value={iM}
                  onChange={updateMYRRate}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                {/* USD interest rate */}
                <RateSlider
                  id="iu"
                  label="USD annual interest rate"
                  value={iU}
                  onChange={updateUSDRate}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                {/* Financial learning tip */}
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">

                  <p className="text-xs font-extrabold text-cyan-900">
                    💡 Market Insight
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-cyan-900/80">
                    The forward rate is calculated
                    using covered interest rate parity.
                    Changing the interest rates affects
                    the forward rate and the hedged cost.
                  </p>

                </div>

              </Panel>

              {/* Pip's guidance */}
              <Panel className="min-w-0 space-y-3 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5 lg:rounded-[28px]">

                <h3 className="font-display text-sm font-extrabold text-amber-800">
                  ⚓ Pip's Trading Tip
                </h3>

                <Pip size={72}>
                  Your little shop has{" "}
                  <b>RM 100,000</b>{" "}
                  set aside. Let's keep the supplier
                  promise without rewarding market luck!
                </Pip>

              </Panel>

            </div>

            {/* =============================================
                RIGHT COLUMN — BUSINESS DECISIONS
            ============================================= */}

            <div className="min-w-0 space-y-5">

              {/* ===========================================
                  STRATEGY SELECTION
              =========================================== */}

              <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-amber-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                    Stage 01 · Business Decision
                  </p>

                  <h2 className="mt-1 font-display text-xl font-extrabold sm:text-2xl">
                    📦 Choose Your Payment Strategy
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Will you secure a known payment
                    cost today or take the risk of
                    the future exchange rate?
                  </p>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Hedge strategy */}
                  <button
                    type="button"
                    aria-pressed={choice === "hedge"}
                    onClick={() => selectChoice("hedge")}
                    className={cn(
                      "group min-w-0 rounded-[22px] border-2 p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",

                      choice === "hedge"
                        ? "border-cyan-400 bg-cyan-50 shadow-sm"
                        : "border-cyan-100 bg-white hover:border-cyan-300"
                    )}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                        <ShieldCheck className="h-6 w-6" />
                      </span>

                      {choice === "hedge" && (
                        <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                      )}

                    </div>

                    <h3 className="font-display text-base font-extrabold">
                      Lock a Forward
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Agree on a forward exchange
                      rate today to know your future
                      MYR payment cost.
                    </p>

                    <p className="mt-3 text-sm font-extrabold text-cyan-700">
                      Cost Certainty
                    </p>

                  </button>

                  {/* Wait strategy */}
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

                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                        <Package className="h-6 w-6" />
                      </span>

                      {choice === "wait" && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}

                    </div>

                    <h3 className="font-display text-base font-extrabold">
                      Pay at Future Spot
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Wait until the invoice is due
                      and pay using the future
                      exchange rate.
                    </p>

                    <p className="mt-3 text-sm font-extrabold text-emerald-700">
                      Market Exposure
                    </p>

                  </button>

                </div>

                {/* Reveal supplier update */}
                <Button
                  variant="quest"
                  size="lg"
                  disabled={!choice || event}
                  onClick={revealSupplierUpdate}
                  className="min-h-12 w-full rounded-2xl font-extrabold"
                >

                  {event
                    ? "Supplier Update Revealed ✓"
                    : "✉️ Reveal Supplier Update"}

                  {!event && (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}

                </Button>

              </Panel>

              {/* ===========================================
                  LIVE FINANCIAL COMPARISON
              =========================================== */}

              <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-amber-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Live Market Analysis
                  </p>

                  <h2 className="mt-1 font-display text-xl font-extrabold">
                    📊 Financial Comparison
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Adjust the market assumptions
                    to see how each strategy changes.
                  </p>

                </div>

                {/* Original calculated results */}
                <div className="grid gap-3 sm:grid-cols-2">

                  <Stat
                    label="3-month forward"
                    value={r.forward.toFixed(4)}
                    sub="MYR/USD (covered IRP)"
                  />

                  <Stat
                    label="Hedged cost"
                    value={fmtRM(r.hedgedMYR)}
                    sub="Known today"
                  />

                  <Stat
                    label="Unhedged cost"
                    value={fmtRM(r.unhedgedMYR)}
                    sub="At your scenario"
                  />

                  <Stat
                    label="Hedge saves"
                    value={fmtRM(r.saving)}
                    tone={
                      r.saving >= 0
                        ? "good"
                        : "bad"
                    }
                  />

                </div>

                {/* Outcome explanation */}
                <div className="rounded-2xl bg-amber-50/70 p-3">

                  <Pip
                    mood={
                      r.saving >= 0
                        ? "celebrating"
                        : "thinking"
                    }
                    size={72}
                  >
                    {r.saving >= 0
                      ? "In this scenario, the hedge protected your cash flow."
                      : "Here the hedge cost more than waiting — but it bought certainty for your budget."}
                  </Pip>

                </div>

                {/* Selected strategy cost */}
                {choice && (
                  <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 p-4">

                    <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                      Your Selected Payment Cost
                    </p>

                    <p className="mt-2 break-words font-display text-3xl font-extrabold text-foreground">
                      {fmtRM(chosenCost)}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Remaining shop budget:{" "}
                      <b>{fmtRM(remainingBudget)}</b>
                    </p>

                  </div>
                )}

              </Panel>

              {/* ===========================================
                  SUPPLIER UPDATE
              =========================================== */}

              {event && (
                <div className="animate-pop-in space-y-5">

                  <Panel className="min-w-0 space-y-4 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-cyan-50 p-5 shadow-md sm:p-6 lg:rounded-[32px]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
                        <Package className="h-6 w-6 text-amber-800" />
                      </div>

                      <div>

                        <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                          Stage 02 · Supplier Update
                        </p>

                        <h2 className="font-display text-xl font-extrabold">
                          Your Shipment Is Ready!
                        </h2>

                      </div>

                    </div>

                    <EconomicEventCard
                      emoji="📦"
                      title="A Message from Your Supplier"
                    >
                      A fictional market surprise initially
                      sets the future spot to{" "}
                      <b>4.90 MYR/USD</b>.
                      {" "}
                      Your{" "}
                      {choice === "hedge"
                        ? "hedged"
                        : "unhedged"}{" "}
                      payment under the currently selected
                      scenario is{" "}
                      <b>{fmtRM(chosenCost)}</b>.
                      {" "}
                      Move the future spot slider to explore
                      another ending.
                    </EconomicEventCard>

                    {/* Scenario summary */}
                    <div className="grid gap-3 sm:grid-cols-2">

                      <div className="rounded-2xl border border-white bg-white/80 p-4">

                        <p className="text-xs font-bold text-muted-foreground">
                          Current Future Spot
                        </p>

                        <p className="mt-1 font-display text-2xl font-extrabold">
                          {st.toFixed(2)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          MYR/USD
                        </p>

                      </div>

                      <div className="rounded-2xl border border-white bg-white/80 p-4">

                        <p className="text-xs font-bold text-muted-foreground">
                          Your Payment
                        </p>

                        <p className="mt-1 break-words font-display text-2xl font-extrabold">
                          {fmtRM(chosenCost)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {choice === "hedge"
                            ? "Forward hedge"
                            : "Future spot"}
                        </p>

                      </div>

                    </div>

                  </Panel>

                  {/* =======================================
                      KNOWLEDGE CHALLENGE
                  ======================================= */}

                  <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-amber-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

                    <div>

                      <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                        Stage 03 · Knowledge Challenge
                      </p>

                      <h2 className="mt-1 font-display text-xl font-extrabold">
                        🧠 The Merchant's Challenge
                      </h2>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        One final question before
                        your business adventure is complete!
                      </p>

                    </div>

                    {/* Question */}
                    <div className="rounded-2xl bg-cyan-50 p-4 sm:p-5">

                      <p className="text-sm font-extrabold leading-relaxed text-foreground sm:text-base">
                        What is the main benefit
                        of using a forward contract
                        for your shop's USD payment?
                      </p>

                    </div>

                    {/* Answers */}
                    <div className="grid gap-3 sm:grid-cols-2">

                      <Button
                        variant={
                          answer === "certainty"
                            ? "quest"
                            : "bubble"
                        }
                        aria-pressed={
                          answer === "certainty"
                        }
                        onClick={() =>
                          selectAnswer("certainty")
                        }
                        className="min-h-14 whitespace-normal rounded-2xl px-4 py-3 font-bold"
                      >
                        🛡️ A Known Payment Cost
                      </Button>

                      <Button
                        variant={
                          answer === "cheapest"
                            ? "quest"
                            : "bubble"
                        }
                        aria-pressed={
                          answer === "cheapest"
                        }
                        onClick={() =>
                          selectAnswer("cheapest")
                        }
                        className="min-h-14 whitespace-normal rounded-2xl px-4 py-3 font-bold"
                      >
                        💰 Always the Cheapest Cost
                      </Button>

                    </div>

                    {/* Answer feedback */}
                    {answer && (
                      <div className="rounded-2xl bg-cyan-50/60 p-3">

                        <Pip
                          size={72}
                          mood={
                            understood
                              ? "celebrating"
                              : "thinking"
                          }
                        >
                          {understood
                            ? "Exactly! A forward contract locks in a known payment cost, helping your business plan its cash flow."
                            : "Not always cheapest! The future spot rate might turn out lower. A forward gives certainty, not guaranteed savings. Try again!"}
                        </Pip>

                      </div>
                    )}

                    {/* Complete mission */}
                    {understood && (
                      <Button
                        variant="quest"
                        size="lg"
                        onClick={completeMission}
                        className="min-h-12 w-full rounded-2xl font-extrabold"
                      >
                        Complete My Trade Adventure
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                  </Panel>

                </div>
              )}

              {/* ===========================================
                  FINANCIAL LEARNING CORNER
              =========================================== */}

              <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-sm sm:p-6 lg:rounded-[32px]">

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Learning Corner
                  </p>

                  <h2 className="mt-1 font-display text-lg font-extrabold">
                    📚 Understanding Forward Hedging
                  </h2>

                </div>

                <RevealFinance>

                  <Formula>
                    3-month rates: i_MYR =
                    (1+{iM}%)^(3/12) − 1 =
                    {" "}
                    {fmtPct(r.iM, 4)},
                    {" "}
                    i_USD =
                    {" "}
                    {fmtPct(r.iU, 4)}
                  </Formula>

                  <Formula>
                    F = 4.50 ×
                    (1 + {fmtPct(r.iM, 4)}) /
                    (1 + {fmtPct(r.iU, 4)}) =
                    {" "}
                    {r.forward.toFixed(5)}
                  </Formula>

                  <p>
                    The forward rate is calculated using
                    covered interest rate parity.
                    A forward hedge provides payment
                    certainty but does not guarantee
                    the cheapest possible outcome.
                  </p>

                  <p>
                    Assumes no bank fees, spreads,
                    or credit risk. Real forward
                    contracts may involve additional
                    costs. Hypothetical data,
                    not investment advice.
                  </p>

                </RevealFinance>

              </Panel>

            </div>

          </div>

        ) : (

          /* =================================================
              MISSION COMPLETION
          ================================================= */

          <div className="animate-pop-in space-y-6">

            {/* Celebration banner */}
            <Panel className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 p-5 shadow-lg sm:p-7 lg:rounded-[32px] lg:p-9">

              <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">

                <div className="space-y-4">

                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-extrabold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    Trade Adventure Completed
                  </span>

                  <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                    🎉 Your Shop Is Ready to Trade!
                  </h2>

                  <p className="text-sm leading-relaxed text-foreground/75 sm:text-base">
                    You've explored foreign exchange
                    risk, compared hedged and unhedged
                    payments, and learned how forward
                    contracts help businesses plan.
                  </p>

                  {/* Completion rewards */}
                  <div className="flex flex-wrap gap-2">

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-amber-800">
                      <Star className="h-4 w-4" />
                      30 XP
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-cyan-800">
                      <Coins className="h-4 w-4" />
                      20 Coins
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-extrabold text-emerald-800">
                      <Trophy className="h-4 w-4" />
                      Chapter Cleared
                    </span>

                  </div>

                </div>

                <div className="min-w-0 rounded-2xl bg-white/55 p-3">
                  <CompletionCelebration />
                </div>

              </div>

            </Panel>

            {/* Final results */}
            <div className="grid gap-6 lg:grid-cols-2">

              <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg sm:p-6 lg:rounded-[32px]">

                <div className="flex items-center gap-2">

                  <Anchor className="h-5 w-5 text-cyan-700" />

                  <h3 className="font-display text-xl font-extrabold">
                    Your Trade Outcome
                  </h3>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <Stat
                    label="Your chosen payment"
                    value={fmtRM(chosenCost)}
                  />

                  <Stat
                    label="Alternative payment"
                    value={fmtRM(alternateCost)}
                  />

                  <Stat
                    label="Remaining shop budget"
                    value={fmtRM(remainingBudget)}
                    tone={
                      remainingBudget < 0
                        ? "bad"
                        : "good"
                    }
                  />

                  <Stat
                    label="3-month forward"
                    value={r.forward.toFixed(4)}
                    sub="MYR/USD"
                  />

                </div>

                <Pip mood="celebrating" size={72}>
                  Great work! A forward contract
                  helps your business know its
                  future payment cost, even if
                  waiting might sometimes be cheaper.
                </Pip>

              </Panel>

              {/* Next steps */}
              <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg sm:p-6 lg:rounded-[32px]">

                <div className="flex items-center gap-2">

                  <Gift className="h-5 w-5 text-amber-700" />

                  <h3 className="font-display text-xl font-extrabold">
                    What's Next?
                  </h3>

                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  You've completed the Import Challenge.
                  Explore another market scenario,
                  or return to the Adventure Map
                  to continue your financial journey.
                </p>

                <Button
                  variant="bubble"
                  onClick={replayMission}
                  className="min-h-12 w-full rounded-2xl font-bold"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Replay with New Assumptions
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

                <p className="text-xs leading-relaxed text-muted-foreground">
                  First completion earns 30 XP
                  and 20 coins. Replays let you
                  explore different outcomes
                  without duplicate rewards.
                </p>

              </Panel>

            </div>

          </div>
        )}

      </div>
    </Page>
  );
}
