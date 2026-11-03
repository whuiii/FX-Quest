
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Page,
  Panel,
  Pip,
  MissionProgress,
  RateSlider,
  EconomicEventCard,
  Stat,
  RevealFinance,
  Formula,
  HypoTag,
} from "@/components/quest-ui";

import {
  compareStrategies,
  breakEvenSpot,
  strategyB,
  pppRate,
  pct,
  fmtRM,
  fmtRate,
} from "@/lib/finance";

import { setState } from "@/lib/game-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mission/student/play")({
  head: () => ({
    meta: [
      { title: "Decision Simulator — The Tuition Deadline — FX Quest" },
      {
        name: "description",
        content:
          "Adjust exchange, inflation and interest rates and compare converting today vs saving in MYR.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Decision Simulator — FX Quest" },
      {
        property: "og:description",
        content: "Live calculations for the student tuition mission.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Play,
});

// Original financial scenario defaults.
const DEF = {
  st: 4.7,
  piM: 2,
  piU: 4,
  iM: 3,
  iU: 5,
};

function Play() {
  const nav = useNavigate();

  // Preserve the original simulation state.
  const [v, setV] = useState(DEF);
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [shock, setShock] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const set = (key: keyof typeof DEF) => (value: number) => {
    setV((previous) => ({ ...previous, [key]: value }));
  };

  // All calculations continue using your finance.ts functions.
  const iMYR = pct(v.iM);
  const c = compareStrategies(v.st, iMYR);
  const be = breakEvenSpot(iMYR);
  const ppp = pppRate(4.5, pct(v.piM), pct(v.piU));

  const data = useMemo(() => {
    const points = [];

    for (let s = 4; s <= 5.2001; s += 0.05) {
      points.push({
        st: Number(s.toFixed(2)),
        A: 5000,
        B: strategyB(s, iMYR).remaining,
      });
    }

    return points;
  }, [iMYR]);

  const mine =
    choice === "A"
      ? c.a.remaining
      : choice === "B"
        ? c.b.remaining
        : null;

  const won =
    choice !== null &&
    (c.better === "tie" || c.better === choice);

  const reset = () => {
    setV({ ...DEF });
    setShock(false);
    setChoice(null);
    setShowCompare(false);
  };

  const applyShock = () => {
    setShock(true);
    setV((previous) => ({ ...previous, piU: 6 }));
  };

  const next = () => {
    if (!choice) return;

    // Save the player's decision for the Results page.
    setState((previous) => ({
      ...previous,
      lastMission: {
        st: v.st,
        iMYR,
        choice,
      },
    }));

    nav({ to: "/mission/student/quiz" });
  };

  return (
    <Page wide>

      
{/* Mission header — separate from the simulator columns */}
<div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-50 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

  {/* Decorative background details */}
  <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
  <div className="pointer-events-none absolute right-8 top-7 text-3xl opacity-60 sm:text-4xl">
    ✨
  </div>

  <div className="relative z-10">
    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="rounded-full border border-sky-200 bg-white/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
        🗺️ Mission 01 · Stage 02
      </span>
      <HypoTag />
    </div>

    <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
  🎯 The Currency Decision
</h1>

    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
      Your tuition deadline is approaching! Explore changing
      exchange rates, compare two financial strategies, and
      discover how economic conditions affect your decision.
    </p>

    <div className="mt-4 rounded-2xl border border-white/80 bg-white/65 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3 [&_ol]:mb-0">
      <MissionProgress
        steps={["Briefing", "Decide", "Quiz", "Results"]}
        current={1}
      />
    </div>
  </div>
</div>


      {/* Desktop: dedicated controls sidebar and main simulation */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(320px,0.36fr)_minmax(0,0.64fr)] lg:gap-8 xl:gap-9">

        {/* LEFT COLUMN — financial environment */}
        <Panel className="min-w-0 space-y-6 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-primary">
              <SlidersHorizontal className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold">
                Set the World
              </h2>
              <p className="text-xs text-muted-foreground">
                Adjust your economic scenario
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              Future Exchange Rate
            </p>

            <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-foreground">
              {v.st.toFixed(2)}
            </p>

            <p className="text-xs text-muted-foreground">
              MYR per USD · In one year
            </p>
          </div>

          <div className="space-y-6">
            <RateSlider
              id="st"
              label="Future spot rate in 1 year (Sₜ)"
              value={v.st}
              onChange={set("st")}
              min={4}
              max={5.2}
              step={0.05}
              unit="MYR/USD"
              hint="Your hypothetical scenario — not a prediction."
            />

            <div className="border-t border-border pt-5">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Inflation assumptions
              </p>

              <div className="space-y-6">
                <RateSlider
                  id="pim"
                  label="Malaysia inflation"
                  value={v.piM}
                  onChange={set("piM")}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                <RateSlider
                  id="piu"
                  label="US inflation"
                  value={v.piU}
                  onChange={set("piU")}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                Interest rate assumptions
              </p>

              <div className="space-y-6">
                <RateSlider
                  id="im"
                  label="MYR deposit rate"
                  value={v.iM}
                  onChange={set("iM")}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                <RateSlider
                  id="iu"
                  label="USD interest rate"
                  value={v.iU}
                  onChange={set("iU")}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                  hint="Used in the Learning Lab IRP card; strategy A earns no USD interest here."
                />
              </div>
            </div>
          </div>

          <Button
            variant="bubble"
            onClick={reset}
            className="w-full rounded-2xl"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </Panel>

        {/* RIGHT COLUMN — decisions and outcomes */}
        <div className="min-w-0 space-y-5">

          {/* Strategy selection */}
          <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Your Decision
              </p>

              <h2 className="mt-1 font-display text-xl font-extrabold">
                🧭 Choose Your Financial Path
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Select a strategy to reveal its financial outcome.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(["A", "B"] as const).map((key) => {
                const selected = choice === key;
                const isA = key === "A";

                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setChoice(key)}
                    className={cn(
                      "group flex min-w-0 flex-col rounded-[24px] border-2 p-5 text-left transition-all duration-200",
                      "hover:-translate-y-1 hover:shadow-md",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",
                      isA
                        ? "border-sky-200 bg-sky-50/80"
                        : "border-emerald-200 bg-emerald-50/80",
                      selected &&
                        "border-primary ring-4 ring-primary/20 shadow-md"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-3xl">
                        {isA ? "💵" : "🏦"}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-extrabold",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/80 text-muted-foreground"
                        )}
                      >
                        {selected ? "✓ Selected" : `Path ${key}`}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-extrabold leading-snug">
                      {isA
                        ? "Convert USD Today"
                        : "Save in MYR"}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">
                      {isA
                        ? "Pay RM 45,000 today at 4.50 MYR/USD. Keep RM 5,000 cash."
                        : `Earn ${v.iM}% on RM 50,000, then buy USD at ${v.st.toFixed(2)} MYR/USD.`}
                    </p>

                    <p className="mt-4 text-xs font-bold text-primary">
                      {selected
                        ? "Your chosen strategy"
                        : "Click to choose this path"}
                    </p>
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Show detailed results only after a decision */}
          {choice && (
            <Panel className="animate-pop-in min-w-0 space-y-5 p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-extrabold">
                  Your Financial Outcome
                </h2>
              </div>

              <Pip mood={won ? "celebrating" : "concerned"}>
                {won ? (
                  <>
                    Nice! With Sₜ = {v.st.toFixed(2)}, path{" "}
                    <b>{choice}</b> leaves you{" "}
                    <b>{fmtRM(mine ?? 0)}</b> after tuition
                    {c.better !== "tie" && (
                      <>
                        {" "}— {fmtRM(Math.abs(c.diff))} more
                        than the other path
                      </>
                    )}
                    .
                  </>
                ) : (
                  <>
                    Oof — at Sₜ = {v.st.toFixed(2)}, path{" "}
                    <b>{choice}</b> leaves {fmtRM(mine ?? 0)},
                    which is {fmtRM(Math.abs(c.diff))} less
                    than the other path. That's market luck,
                    not a bad lesson — your learning score
                    won't drop for it!
                  </>
                )}
              </Pip>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Stat
                  label="A: tuition cost"
                  value={fmtRM(c.a.costMYR)}
                  sub="Paid today"
                />

                <Stat
                  label="A: remaining"
                  value={fmtRM(c.a.remaining)}
                  tone={c.a.remaining >= 0 ? "good" : "bad"}
                />

                <Stat
                  label="B: interest earned"
                  value={fmtRM(c.b.interest)}
                />

                <Stat
                  label="B: tuition cost"
                  value={fmtRM(c.b.costMYR)}
                  sub="Paid in one year"
                />

                <Stat
                  label="B: remaining"
                  value={fmtRM(c.b.remaining)}
                  tone={c.b.remaining >= 0 ? "good" : "bad"}
                  sub={
                    c.b.remaining < 0
                      ? "Funding shortfall"
                      : "Surplus"
                  }
                />

                <Stat
                  label="Difference (B − A)"
                  value={fmtRM(c.diff)}
                  tone={
                    c.diff > 0
                      ? "good"
                      : c.diff < 0
                        ? "bad"
                        : "default"
                  }
                />

                <Stat
                  label="Break-even Sₜ"
                  value={be.toFixed(4)}
                  sub="MYR/USD"
                />

                <Stat
                  label="PPP-implied rate"
                  value={ppp.toFixed(4)}
                  sub="Theory, not a forecast"
                />
              </div>
            </Panel>
          )}

          {/* Interactive Recharts comparison */}
          <Panel className="min-w-0 p-5 sm:p-6 lg:p-7">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-xl font-extrabold">
                  Financial Comparison
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Remaining MYR after tuition across future exchange-rate scenarios.
                </p>
              </div>
            </div>

            <div className="h-[280px] min-w-0 sm:h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 12,
                    right: 18,
                    left: -12,
                    bottom: 16,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />

                  <XAxis
                    dataKey="st"
                    type="number"
                    domain={[4, 5.2]}
                    tickFormatter={(x: number) => x.toFixed(2)}
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "Sₜ (MYR/USD)",
                      position: "insideBottom",
                      offset: -8,
                    }}
                  />

                  <YAxis
                    tickFormatter={(x: number) =>
                      `RM${(x / 1000).toFixed(0)}k`
                    }
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    formatter={(value) =>
                      fmtRM(Number(value ?? 0))
                    }
                    labelFormatter={(label) =>
                      `Sₜ = ${Number(label).toFixed(2)}`
                    }
                  />

                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 12 }}
                  />

                  <ReferenceLine
                    y={0}
                    stroke="var(--destructive)"
                  />

                  <ReferenceLine
                    x={be}
                    stroke="var(--chart-4)"
                    strokeDasharray="4 4"
                    label={{
                      value: `Break-even ${be.toFixed(2)}`,
                      position: "insideTopLeft",
                      fontSize: 10,
                    }}
                  />

                  <ReferenceLine
                    x={v.st}
                    stroke="var(--chart-5)"
                    label={{
                      value: "Your scenario",
                      position: "insideTopRight",
                      fontSize: 10,
                    }}
                  />

                  <Line
                    name="A · Convert today"
                    dataKey="A"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    name="B · Save in MYR"
                    dataKey="B"
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-4 rounded-xl bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
              Every RM 0.10/USD rise in Sₜ cuts B by
              RM 1,000. A stays at RM 5,000 under these
              assumptions.
            </p>
          </Panel>

          {/* Economic surprise */}
          <div className="space-y-4">
            {!shock ? (
              <Button
                variant="sunny"
                onClick={applyShock}
                className="min-h-12 w-full rounded-2xl sm:w-auto"
              >
                ⚡ Trigger Economic Surprise
              </Button>
            ) : (
              <EconomicEventCard
                emoji="⚡"
                title="Shock: US inflation assumption rises to 6%"
              >
                Under relative PPP, higher US inflation
                versus Malaysia implies a <b>lower</b>{" "}
                MYR/USD rate (ringgit appreciation): now{" "}
                {fmtRate(ppp)}. That's a theory benchmark —
                your Sₜ slider is still your own scenario.
                Try moving Sₜ toward {ppp.toFixed(2)} to
                see what would happen to path B.
              </EconomicEventCard>
            )}
          </div>

          {/* Scenario comparison */}
          <div className="space-y-3">
            <Button
              variant="bubble"
              className="w-full rounded-2xl sm:w-auto"
              onClick={() => setShowCompare((previous) => !previous)}
            >
              {showCompare
                ? "Hide Scenario Comparison"
                : "Compare Scenarios"}
            </Button>

            {showCompare && (
              <Panel className="min-w-0 p-4 sm:p-6">
                <h2 className="mb-4 font-display text-lg font-extrabold">
                  📊 Scenario Comparison
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="px-3 py-3">Scenario</th>
                        <th className="px-3 py-3">Sₜ</th>
                        <th className="px-3 py-3">A remaining</th>
                        <th className="px-3 py-3">B remaining</th>
                        <th className="px-3 py-3">Better</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[
                        {
                          n: "Baseline (MYR weaker)",
                          st: 4.7,
                        },
                        {
                          n: "MYR stronger",
                          st: 4.3,
                        },
                        {
                          n: "Your scenario",
                          st: v.st,
                        },
                      ].map((scenario) => {
                        const result = compareStrategies(
                          scenario.st,
                          iMYR
                        );

                        return (
                          <tr
                            key={scenario.n}
                            className="border-t border-border"
                          >
                            <td className="px-3 py-3 font-semibold">
                              {scenario.n}
                            </td>
                            <td className="px-3 py-3">
                              {scenario.st.toFixed(2)}
                            </td>
                            <td className="px-3 py-3">
                              {fmtRM(result.a.remaining)}
                            </td>
                            <td className="px-3 py-3">
                              {fmtRM(result.b.remaining)}
                            </td>
                            <td className="px-3 py-3">
                              {result.better === "tie"
                                ? "Tie"
                                : `${result.better} by ${fmtRM(Math.abs(result.diff))}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Using MYR deposit rate {v.iM}%.
                </p>
              </Panel>
            )}
          </div>

          {/* Original finance explanations */}
          <RevealFinance>
            <Formula>
              A remaining = 50,000 − 10,000 × 4.50 = RM 5,000
            </Formula>

            <Formula>
              B remaining = 50,000 × (1 + i_MYR) − 10,000 × Sₜ
            </Formula>

            <Formula>
              Break-even Sₜ = (50,000 × (1 + i_MYR) − 5,000)
              / 10,000 = {be.toFixed(4)}
            </Formula>

            <p>
              If the real future rate ends up <b>below</b>{" "}
              {be.toFixed(2)}, saving in MYR wins; above
              it, converting today wins.
            </p>

            <p className="text-xs text-muted-foreground">
              <b>Assumptions:</b> no FX fees/spreads, no
              taxes, no USD interest on pre-converted funds,
              no interest on the leftover RM 5,000, fixed
              USD tuition, one-year horizon, simplified
              rates. Pip's explanations are template-based
              from these verified numbers (no AI). Not
              investment advice.
            </p>
          </RevealFinance>

          {/* Navigation */}
          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              asChild
              variant="bubble"
              className="w-full rounded-2xl sm:w-auto"
            >
              <Link to="/learn">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn Why (Lab)
              </Link>
            </Button>

            <Button
              variant="quest"
              size="lg"
              disabled={!choice}
              onClick={next}
              className="min-h-13 w-full rounded-2xl px-6 font-extrabold sm:w-auto"
            >
              {choice
                ? "Next: Knowledge Check"
                : "Pick a Path to Continue"}

              {choice && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
