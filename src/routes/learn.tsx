
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  BookOpen,
  Calculator,
  TrendingUp,
  RotateCcw,
  Globe2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Page,
  Panel,
  Pip,
  RateSlider,
  Formula,
  HypoTag,
} from "@/components/quest-ui";

import {
  pppRate,
  irpForward,
  fisherReal,
  pct,
  fmtPct,
} from "@/lib/finance";

// =========================================================
// ROUTE CONFIGURATION
// =========================================================

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        title: "Learning Lab — PPP, IRP & Fisher — FX Quest",
      },
      {
        name: "description",
        content:
          "Interactive formulas for relative PPP, covered interest rate parity and the Fisher real rate.",
      },
      {
        property: "og:title",
        content: "Learning Lab — FX Quest",
      },
      {
        property: "og:description",
        content:
          "Play with inflation, interest and FX formulas in plain English.",
      },
    ],
  }),
  component: Learn,
});

// =========================================================
// DEFAULT SIMULATION VALUES
// =========================================================

const DEFAULT_VALUES = {
  s0: 4.5,
  piM: 2,
  piU: 4,
  iM: 3,
  iU: 5,
  st: 4.7,
};

// =========================================================
// MAIN LEARNING LAB
// =========================================================

function Learn() {
  // -------------------------------------------------------
  // Simulation inputs
  // -------------------------------------------------------

  const [s0, setS0] = useState(DEFAULT_VALUES.s0);
  const [piM, setPiM] = useState(DEFAULT_VALUES.piM);
  const [piU, setPiU] = useState(DEFAULT_VALUES.piU);
  const [iM, setIM] = useState(DEFAULT_VALUES.iM);
  const [iU, setIU] = useState(DEFAULT_VALUES.iU);
  const [st, setSt] = useState(DEFAULT_VALUES.st);

  // -------------------------------------------------------
  // Original financial calculations
  // -------------------------------------------------------

  const ppp = pppRate(
    s0,
    pct(piM),
    pct(piU)
  );

  const fwd = irpForward(
    s0,
    pct(iM),
    pct(iU)
  );

  const real = fisherReal(
    pct(iM),
    pct(piM)
  );

  // -------------------------------------------------------
  // Chart data
  // -------------------------------------------------------

  const chart = [
    {
      name: "Spot today",
      short: "Spot",
      v: s0,
    },
    {
      name: "PPP-implied",
      short: "PPP",
      v: ppp,
    },
    {
      name: "IRP forward",
      short: "IRP",
      v: fwd,
    },
    {
      name: "Your Sₜ scenario",
      short: "Scenario",
      v: st,
    },
  ];

  const colors = [
    "var(--chart-3)",
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-5)",
  ];

  // -------------------------------------------------------
  // Reset simulation
  // -------------------------------------------------------

  const resetSimulation = () => {
    setS0(DEFAULT_VALUES.s0);
    setPiM(DEFAULT_VALUES.piM);
    setPiU(DEFAULT_VALUES.piU);
    setIM(DEFAULT_VALUES.iM);
    setIU(DEFAULT_VALUES.iU);
    setSt(DEFAULT_VALUES.st);
  };

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <Page wide>
      <div className="w-full min-w-0">

        {/* =================================================
            FULL-WIDTH LEARNING LAB HEADER
        ================================================= */}

        <div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-sky-100 via-cyan-50 to-violet-100 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-72 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="pointer-events-none absolute right-8 top-7 text-3xl opacity-60 sm:text-4xl">
            ✨
          </div>

          <div className="relative z-10">

            {/* Header badges */}
            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                📚 FX Quest · Learning Center
              </span>

              <HypoTag />

            </div>

            {/* Title */}
            <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
              🧪 The Learning Lab
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
              Discover how inflation, interest rates,
              and exchange rates connect. Experiment
              with real financial formulas and see
              how changing one variable affects
              the others.
            </p>

            {/* Concept relationship strip */}
            <div className="mt-5 rounded-2xl border border-white/80 bg-white/65 p-3 shadow-sm backdrop-blur-sm sm:p-4">

              <div className="grid gap-2 sm:grid-cols-3">

                {/* Inflation */}
                <div className="flex items-center gap-3 rounded-xl bg-white/75 px-3 py-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold">
                      Inflation
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Purchasing power
                    </p>
                  </div>

                </div>

                {/* Interest */}
                <div className="flex items-center gap-3 rounded-xl bg-white/75 px-3 py-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Calculator className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold">
                      Interest Rates
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Savings and borrowing
                    </p>
                  </div>

                </div>

                {/* Exchange */}
                <div className="flex items-center gap-3 rounded-xl bg-white/75 px-3 py-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Globe2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold">
                      Exchange Rates
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Currency value
                    </p>
                  </div>

                </div>

              </div>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-foreground/65 sm:text-xs">
                Fisher connects interest and inflation
                {" · "}
                PPP connects inflation and FX
                {" · "}
                IRP connects interest and FX
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            MAIN TWO-COLUMN LAYOUT
            Same width proportions as mission pages
        ================================================= */}

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(320px,0.36fr)_minmax(0,0.64fr)] lg:gap-8 xl:gap-9">

          {/* ===============================================
              LEFT — MARKET INPUTS
          =============================================== */}

          <div className="min-w-0 space-y-5">

            <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

              {/* Panel heading */}
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-primary">
                  <Calculator className="h-6 w-6" />
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Interactive Simulator
                  </p>

                  <h2 className="font-display text-xl font-extrabold">
                    Market Inputs
                  </h2>

                </div>

              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Adjust the values below to explore
                how different financial conditions
                affect currency relationships.
              </p>

              {/* Spot rate */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3">

                <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-primary">
                  🌍 Exchange Rate
                </p>

                <RateSlider
                  id="s0"
                  label="Spot today S₀"
                  value={s0}
                  onChange={setS0}
                  min={4}
                  max={5.2}
                  step={0.05}
                  unit="MYR/USD"
                />

              </div>

              {/* Inflation controls */}
              <div className="space-y-4">

                <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
                  🌴 Inflation Assumptions
                </p>

                <RateSlider
                  id="pm"
                  label="Malaysia inflation"
                  value={piM}
                  onChange={setPiM}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                <RateSlider
                  id="pu"
                  label="US inflation"
                  value={piU}
                  onChange={setPiU}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

              </div>

              <div className="h-px bg-border/60" />

              {/* Interest controls */}
              <div className="space-y-4">

                <p className="text-xs font-extrabold uppercase tracking-wide text-violet-700">
                  💰 Interest Rate Assumptions
                </p>

                <RateSlider
                  id="im"
                  label="MYR 1-year interest"
                  value={iM}
                  onChange={setIM}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

                <RateSlider
                  id="iu"
                  label="USD 1-year interest"
                  value={iU}
                  onChange={setIU}
                  min={0}
                  max={10}
                  step={0.5}
                  unit="%"
                />

              </div>

              <div className="h-px bg-border/60" />

              {/* Scenario */}
              <div className="space-y-3">

                <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-700">
                  🔮 Your Future Scenario
                </p>

                <RateSlider
                  id="st"
                  label="Your future spot scenario"
                  value={st}
                  onChange={setSt}
                  min={4}
                  max={5.2}
                  step={0.05}
                  unit="MYR/USD"
                />

              </div>

              {/* Reset */}
              <Button
                variant="bubble"
                onClick={resetSimulation}
                className="min-h-11 w-full rounded-2xl font-bold"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All Inputs
              </Button>

            </Panel>

            {/* Pip helper */}
            <Panel className="min-w-0 space-y-3 border-white/90 bg-white/95 p-4 shadow-sm sm:p-5 lg:rounded-[28px]">

              <p className="text-sm font-extrabold text-primary">
                💡 Pip's Currency Tip
              </p>

              <Pip mood="thinking">
                Lower MYR/USD means a stronger
                ringgit. Higher MYR/USD means
                a weaker ringgit. That one rule
                unlocks every chart here!
              </Pip>

            </Panel>

          </div>

          {/* ===============================================
              RIGHT — FINANCIAL CONCEPTS & CHART
          =============================================== */}

          <div className="min-w-0 space-y-5">

            {/* =============================================
                PPP CARD
            ============================================= */}

            <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Globe2 className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                    Concept 01
                  </p>

                  <h2 className="font-display text-xl font-extrabold">
                    🌴 Relative PPP
                  </h2>

                </div>

              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Purchasing Power Parity explores
                how inflation differences between
                countries relate to exchange rates.
              </p>

              <div className="min-w-0 overflow-x-auto rounded-2xl bg-emerald-50/70 p-3 sm:p-4">

                <Formula>
                  S_PPP = S₀ ×
                  (1 + π_MYR) /
                  (1 + π_USD) =
                  {" "}
                  {ppp.toFixed(5)} MYR/USD
                </Formula>

              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">

                <p className="text-sm leading-relaxed text-foreground/80">

                  {piU > piM
                    ? "US prices rise faster, so the dollar is expected to buy less — fewer ringgit per dollar (ringgit appreciates)."
                    : piU < piM
                      ? "Malaysian prices rise faster, so PPP implies more ringgit per dollar (ringgit depreciates)."
                      : "Equal inflation: PPP implies no change."}

                  {" "}
                  All else equal; a long-run benchmark only.

                </p>

              </div>

            </Panel>

            {/* =============================================
                IRP CARD
            ============================================= */}

            <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <TrendingUp className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-700">
                    Concept 02
                  </p>

                  <h2 className="font-display text-xl font-extrabold">
                    ⚓ Covered IRP
                  </h2>

                </div>

              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Covered Interest Rate Parity
                connects interest-rate differences
                to the forward exchange rate.
              </p>

              <div className="min-w-0 overflow-x-auto rounded-2xl bg-cyan-50/70 p-3 sm:p-4">

                <Formula>
                  F_IRP = S₀ ×
                  (1 + i_MYR) /
                  (1 + i_USD) =
                  {" "}
                  {fwd.toFixed(5)} MYR/USD
                </Formula>

              </div>

              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">

                <p className="text-sm leading-relaxed text-foreground/80">
                  A 1-year forward you could
                  lock in today, with rates
                  matched to the 1-year horizon.
                  It is{" "}
                  <b>not</b>{" "}
                  a guaranteed future spot rate.
                </p>

              </div>

            </Panel>

            {/* =============================================
                FISHER CARD
            ============================================= */}

            <Panel className="min-w-0 space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <BookOpen className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-xs font-extrabold uppercase tracking-wide text-violet-700">
                    Concept 03
                  </p>

                  <h2 className="font-display text-xl font-extrabold">
                    ⛰️ Fisher Effect (Exact)
                  </h2>

                </div>

              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                The Fisher relationship explains
                the difference between nominal
                and real interest rates.
              </p>

              <div className="min-w-0 overflow-x-auto rounded-2xl bg-violet-50/70 p-3 sm:p-4">

                <Formula>
                  r_MYR =
                  (1 + i_MYR) /
                  (1 + π_MYR) − 1 =
                  {" "}
                  {fmtPct(real, 4)}
                </Formula>

              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">

                <p className="text-sm leading-relaxed text-foreground/80">

                  {real >= 0
                    ? "Your savings grow faster than prices — positive real return."
                    : "Prices grow faster than your savings — your purchasing power shrinks."}

                  {" "}
                  A relationship, not a prediction.

                </p>

              </div>

            </Panel>

            {/* =============================================
                RATE COMPARISON CHART
            ============================================= */}

            <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

              <div>

                <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                  Live Visualization
                </p>

                <h2 className="mt-1 font-display text-xl font-extrabold">
                  📊 Exchange Rate Comparison
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Compare today's spot rate,
                  the PPP-implied rate,
                  the IRP forward rate,
                  and your future spot scenario.
                </p>

              </div>

              {/* Responsive chart */}
              <div className="h-[280px] min-w-0 w-full sm:h-[320px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={chart}
                    margin={{
                      top: 12,
                      right: 10,
                      left: -18,
                      bottom: 12,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="rgba(148,163,184,0.18)"
                    />

                    <XAxis
                      dataKey="short"
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />

                    <YAxis
                      domain={[3.8, 5.4]}
                      tick={{
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `${Number(value).toFixed(4)} MYR/USD`
                      }
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.name ??
                        ""
                      }
                      contentStyle={{
                        borderRadius: 16,
                        border:
                          "1px solid rgba(255,255,255,0.9)",
                        boxShadow:
                          "0 12px 30px rgba(0,0,0,0.08)",
                      }}
                    />

                    <Bar
                      dataKey="v"
                      radius={[10, 10, 0, 0]}
                      maxBarSize={90}
                    >

                      {chart.map((_, index) => (
                        <Cell
                          key={index}
                          fill={colors[index]}
                        />
                      ))}

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* Chart explanation */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">

                <p className="text-xs leading-relaxed text-muted-foreground">
                  PPP and IRP are theory-implied
                  rates. Neither is an actual
                  market forecast. Your future
                  spot is a hypothetical scenario.
                </p>

              </div>

            </Panel>

            {/* =============================================
                SOURCES
            ============================================= */}

            <Panel className="min-w-0 space-y-3 border-white/90 bg-white/95 p-5 shadow-sm sm:p-6 lg:rounded-[32px]">

              <div className="flex items-center gap-2">

                <BookOpen className="h-5 w-5 text-primary" />

                <h2 className="font-display text-lg font-extrabold">
                  Sources & Learning Notes
                </h2>

              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                [Placeholder — add verified
                academic or institutional
                citations, such as your
                course textbook, Bank Negara
                Malaysia, or IMF.]
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Responsible AI disclosure:
                explanations are template-based;
                no AI generates the financial
                calculations.
              </p>

            </Panel>

          </div>

        </div>

      </div>
    </Page>
  );
}
