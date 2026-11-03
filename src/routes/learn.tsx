
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
  LabelList,
} from "recharts";
import {
  BookOpen,
  Calculator,
  TrendingUp,
  RotateCcw,
  Globe2,
  Coins,
  Landmark,
  SlidersHorizontal,
  Sparkles,
  Telescope,
  RefreshCw,
  Info,
  ArrowRightLeft,
} from "lucide-react";

import { Page, Pip, HypoTag } from "@/components/quest-ui";
import { pppRate, irpForward, fisherReal, pct, fmtPct } from "@/lib/finance";
import learnBg from "@/assets/learn_bg.png";
import learnBottomBg from "@/assets/learn_bottom_bg.png";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "The Learning Lab — FX Quest" },
      {
        name: "description",
        content:
          "Explore Purchasing Power Parity, Interest Rate Parity and the Fisher Effect in an interactive fantasy finance laboratory.",
      },
    ],
  }),
  component: Learn,
});

const DEFAULT_VALUES = {
  s0: 4.5,
  piM: 2,
  piU: 4,
  iM: 3,
  iU: 5,
  st: 4.7,
};

const SCENARIOS = [
  { s0: 4.5, piM: 2, piU: 4, iM: 3, iU: 5, st: 4.7 },
  { s0: 4.65, piM: 5, piU: 2, iM: 6, iU: 4, st: 4.9 },
  { s0: 4.3, piM: 1, piU: 6, iM: 3, iU: 7, st: 4.15 },
  { s0: 4.85, piM: 4, piU: 3, iM: 5, iU: 4, st: 4.6 },
];

type SliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: "blue" | "purple" | "green" | "orange";
};

const sliderColors = {
  blue: {
    accent: "#159de8",
    light: "#e5f6ff",
    border: "#b5e7ff",
  },
  purple: {
    accent: "#9c51e8",
    light: "#f3e8ff",
    border: "#e2c8ff",
  },
  green: {
    accent: "#20b989",
    light: "#e3fff1",
    border: "#b6efd5",
  },
  orange: {
    accent: "#f39a19",
    light: "#fff2df",
    border: "#ffd9a2",
  },
};

function FantasySlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  color,
}: SliderProps) {
  const palette = sliderColors[color];
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="min-w-0 text-[12px] font-semibold text-[#39426a] sm:w-[39%] sm:shrink-0">
        {label}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className="h-[7px] min-w-0 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            accentColor: palette.accent,
            background: `linear-gradient(to right, ${palette.accent} ${percentage}%, #d8d4d0 ${percentage}%)`,
          }}
        />

        <span
          className="min-w-[75px] shrink-0 rounded-full border px-2 py-1 text-center text-[11px] font-extrabold tabular-nums sm:min-w-[91px]"
          style={{
            background: palette.light,
            borderColor: palette.border,
            color: palette.accent,
          }}
        >
          {value.toFixed(2)} {unit}
        </span>
      </div>
    </div>
  );
}

type ConceptCardProps = {
  number: string;
  title: string;
  description: string;
  formula: string;
  result: string;
  detail: string;
  theme: "mint" | "sky" | "lavender";
  icon: React.ReactNode;
};

const conceptThemes = {
  mint: {
    background: "linear-gradient(145deg,#f4fff6,#e8faed)",
    border: "#b8e8c7",
    circle: "#c5f4d5",
    accent: "#168a65",
    result: "linear-gradient(180deg,#d4ffe4,#a9ebc6)",
  },

  sky: {
    background: "linear-gradient(145deg,#f4fcff,#e5f6ff)",
    border: "#b8e3fa",
    circle: "#c8edff",
    accent: "#1685b5",
    result: "linear-gradient(180deg,#dcf5ff,#b6e5fb)",
  },

  lavender: {
    background: "linear-gradient(145deg,#fdf8ff,#f2e9ff)",
    border: "#e0cafa",
    circle: "#eadbff",
    accent: "#8957bf",
    result: "linear-gradient(180deg,#f4e7ff,#e5cbfa)",
  },
};

function ConceptCard({
  number,
  title,
  description,
  formula,
  result,
  detail,
  theme,
  icon,
}: ConceptCardProps) {
  const colors = conceptThemes[theme];

  return (
    <div
      className="flex min-w-0 flex-col rounded-[25px] border-[2px] p-4 shadow-[0_4px_0_rgba(111,88,116,.13),0_10px_18px_rgba(58,75,116,.07)] transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: colors.background,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-extrabold"
          style={{ color: colors.accent }}
        >
          {number}
        </span>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 shadow-sm"
          style={{
            background: colors.circle,
            color: colors.accent,
          }}
        >
          {icon}
        </div>

        <h3 className="font-display text-[16px] font-extrabold leading-tight text-[#24275c]">
          {title}
        </h3>
      </div>

      <p className="mt-3 min-h-[48px] text-center text-[12px] leading-relaxed text-[#465477]">
        {description}
      </p>

      <div
        className="mt-3 flex min-h-[54px] items-center justify-center rounded-[17px] bg-white/45 px-2 py-3 text-center font-mono text-[11px] font-semibold leading-relaxed text-[#283b69]"
        style={{ overflowWrap: "anywhere" }}
      >
        {formula}
      </div>

      <div
        className="mt-3 rounded-[15px] border border-white/80 px-2 py-2 text-center font-display text-[15px] font-extrabold text-[#183465] shadow-sm"
        style={{ background: colors.result }}
      >
        {result}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[#526181]">
        {detail}
      </p>
    </div>
  );
}

function FantasyPanel({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative min-w-0 rounded-[32px]
  border-[3px] border-[#eec493]
  bg-gradient-to-b
  from-[#fffdf7]/95
  via-[#fff9ef]/95
  to-[#fff0df]/95
  px-4 pb-5 pt-9
  shadow-[0_6px_0_rgba(192,128,72,.18),0_16px_35px_rgba(54,69,109,.10)]
  sm:px-5 ${className}`}
    >
      <div className="absolute -top-4 left-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-[22px] border-[2px] border-[#eab36d] bg-gradient-to-b from-[#fff6d6] to-[#ffd58d] px-4 py-2 shadow-[0_4px_0_rgba(184,116,57,.22)] sm:left-6 sm:px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#efc58d] bg-[#fff5dc] text-[#b66b20]">
          {icon}
        </span>

        <h2 className="font-display text-[17px] font-extrabold leading-tight text-[#622568] sm:text-[19px]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function Learn() {
  const [s0, setS0] = useState(DEFAULT_VALUES.s0);
  const [piM, setPiM] = useState(DEFAULT_VALUES.piM);
  const [piU, setPiU] = useState(DEFAULT_VALUES.piU);
  const [iM, setIM] = useState(DEFAULT_VALUES.iM);
  const [iU, setIU] = useState(DEFAULT_VALUES.iU);
  const [st, setSt] = useState(DEFAULT_VALUES.st);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  // Preserve the original finance functions and conventions.
  const ppp = pppRate(s0, pct(piM), pct(piU));
  const fwd = irpForward(s0, pct(iM), pct(iU));
  const real = fisherReal(pct(iM), pct(piM));

  const chart = [
    { name: "Spot today", short: "Spot", v: s0 },
    { name: "PPP-implied", short: "PPP", v: ppp },
    { name: "IRP forward", short: "IRP", v: fwd },
    { name: "Your scenario", short: "Scenario", v: st },
  ];

  const chartColors = [
  "#91d5f7", // Soft sky blue
  "#a6e9c4", // Pastel mint
  "#cbb0f1", // Soft lavender
  "#ffd080", // Warm pastel gold
];

  const resetSimulation = () => {
    setS0(DEFAULT_VALUES.s0);
    setPiM(DEFAULT_VALUES.piM);
    setPiU(DEFAULT_VALUES.piU);
    setIM(DEFAULT_VALUES.iM);
    setIU(DEFAULT_VALUES.iU);
    setSt(DEFAULT_VALUES.st);
    setScenarioIndex(0);
  };

  const tryScenario = () => {
    const next = (scenarioIndex + 1) % SCENARIOS.length;
    const scenario = SCENARIOS[next];

    setS0(scenario.s0);
    setPiM(scenario.piM);
    setPiU(scenario.piU);
    setIM(scenario.iM);
    setIU(scenario.iU);
    setSt(scenario.st);
    setScenarioIndex(next);
  };

  const gap = Math.abs(ppp - fwd);
  const close = gap < 0.1;

  const pipInsight = close
    ? "The PPP and IRP values are close! Inflation and interest-rate differences give similar exchange-rate estimates in this scenario."
    : ppp > fwd
      ? "PPP gives a higher MYR/USD rate than IRP here. Compare inflation and interest-rate differences to discover why the two benchmarks diverge."
      : "IRP gives a higher MYR/USD rate than PPP here. Different inflation and interest-rate assumptions can produce different benchmarks.";

  return (
    <Page
      wide
      className="!relative !isolate !max-w-none !overflow-hidden !px-0 !py-0"
    >
      {/* Background is now INSIDE Page's main, not behind Page itself. */}
      {/* SOFT PASTEL FANTASY ISLAND BACKGROUND */}
{/* FANTASY LEARNING LAB — SEAMLESS TWO-IMAGE BACKGROUND */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  style={{
    backgroundColor: "#f8dfc7",
  }}
>
  {/* BOTTOM IMAGE — FLOWER-FRAMED STONE PAVEMENT */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url(${learnBottomBg})`,
      backgroundSize: "100% auto",
      backgroundPosition: "center bottom",
      backgroundRepeat: "repeat-y",
      filter: "saturate(0.82) brightness(1.06) contrast(0.94)",
    }}
  />

  {/* TOP IMAGE — FANTASY ISLAND WITH SOFT FADE INTO PAVEMENT */}
  <div
    className="absolute inset-x-0 top-0"
    style={{
      height: "min(100vw, 1200px)",
      backgroundImage: `url(${learnBg})`,
      backgroundSize: "100% auto",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      filter: "saturate(0.82) brightness(1.06) contrast(0.94)",

      WebkitMaskImage:
        "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.65) 78%, transparent 100%)",

      maskImage:
        "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.95) 65%, rgba(0,0,0,0.65) 78%, transparent 100%)",
    }}
  />
</div>
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

      {/* Keep every card above the background. */}
      <div className="relative z-10 w-full px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:px-8">
        
          <div className="mx-auto w-full min-w-0 max-w-[1500px]">
            
            {/* FANTASY LEARNING LAB HEADER */}
            <header className="relative mx-auto mb-7 max-w-[950px] text-center">
              <div className="relative rounded-[35px] border-[4px] border-[#e6b16d] bg-gradient-to-b from-[#fffdf4]/[.98] via-[#fff3dd]/[.98] to-[#ffe4b7]/[.98] px-5 pb-5 pt-7 shadow-[0_7px_0_rgba(177,113,61,.28),0_15px_35px_rgba(53,71,114,.20)] sm:px-9">
                <div className="absolute -left-3 top-3 text-3xl sm:text-4xl">
                  🌿
                </div>
                <div className="absolute -right-3 top-3 text-3xl sm:text-4xl">
                  🌸
                </div>

                <div className="absolute -top-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[#dfa456] bg-gradient-to-b from-[#fff4c8] to-[#ffc86c] text-2xl shadow-md">
                  💎
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#f0d5af] bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#693b78] shadow-sm sm:text-xs">
                  📚 FX Quest · Learning Center
                </span>

                <div className="mt-3 flex items-center justify-center gap-3">
                  <BookOpen className="hidden h-10 w-10 text-[#3387c6] sm:block" />

                  <h1 className="font-display text-[clamp(1.9rem,4vw,3.3rem)] font-extrabold leading-tight tracking-tight text-[#722d72] drop-shadow-[0_2px_0_rgba(255,255,255,.9)]">
                    The Learning Lab
                  </h1>

                  <span className="hidden text-3xl sm:block">🪶</span>
                </div>

                <div className="mt-2 flex justify-center">
                  <HypoTag />
                </div>

                <p className="mx-auto mt-3 max-w-[690px] text-[12px] font-medium leading-relaxed text-[#34416d] sm:text-sm">
                  Discover how inflation, interest rates, and exchange rates
                  connect. Experiment with real financial formulas and see how
                  changing one variable affects the others.
                </p>
              </div>
            </header>

            {/* THREE FINANCIAL CONCEPT INDICATORS */}
            <div className="mx-auto mb-9 grid max-w-[1080px] grid-cols-1 gap-2 rounded-[30px] border-[3px] border-[#e9b676] bg-gradient-to-b from-[#fffaf0]/[.98] to-[#ffe9c8]/[.98] p-3 shadow-[0_5px_0_rgba(183,119,61,.22),0_12px_25px_rgba(48,75,110,.13)] sm:grid-cols-3 sm:gap-0">
              {[
                {
                  icon: <Coins className="h-6 w-6" />,
                  title: "Inflation",
                  subtitle: "Purchasing power",
                  bg: "#fff0c3",
                  color: "#bb7c0e",
                },
                {
                  icon: <Landmark className="h-6 w-6" />,
                  title: "Interest Rates",
                  subtitle: "Savings and borrowing",
                  bg: "#ead9ff",
                  color: "#8141c6",
                },
                {
                  icon: <Globe2 className="h-6 w-6" />,
                  title: "Exchange Rates",
                  subtitle: "Currency value",
                  bg: "#cff4ff",
                  color: "#087fa8",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`flex items-center justify-center gap-3 px-3 py-2 ${
                    index > 0
                      ? "border-t border-[#edcfaa] sm:border-l sm:border-t-0"
                      : ""
                  }`}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 shadow-sm"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-display text-sm font-extrabold text-[#252b60]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#5b6480]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN TWO-COLUMN FANTASY LAYOUT */}
            <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-6">
              {/* LEFT — INTERACTIVE SIMULATOR */}
              <FantasyPanel
                title="Interactive Simulator"
                icon={<SlidersHorizontal className="h-5 w-5" />}
              >
                <div className="mb-4 flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-[#d8812e]" />
                  <h3 className="font-display text-[15px] font-extrabold text-[#652c68]">
                    Market Inputs
                  </h3>
                </div>

                <p className="mb-4 text-[12px] leading-relaxed text-[#3f486c]">
                  Adjust the values below to explore how different financial
                  conditions affect currency relationships.
                </p>

                <div className="space-y-3">
                  {/* EXCHANGE RATE */}
                  <div className="rounded-[21px] border border-[#f1dcc0] bg-white/80 p-3 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0c9] text-[#c98a1b]">
                        <Coins className="h-5 w-5" />
                      </span>

                      <div>
                        <h4 className="text-[13px] font-extrabold text-[#283568]">
                          Exchange Rate
                        </h4>
                        <p className="text-[10px] text-[#69728e]">
                          Current currency quotation
                        </p>
                      </div>
                    </div>

                    <FantasySlider
                      label="Spot today S₀"
                      value={s0}
                      onChange={setS0}
                      min={4}
                      max={5.2}
                      step={0.05}
                      unit="MYR/USD"
                      color="blue"
                    />
                  </div>

                  {/* INFLATION */}
                  <div className="rounded-[21px] border border-[#f1dcc0] bg-white/80 p-3 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0dcff] text-[#9651d7]">
                        <TrendingUp className="h-5 w-5" />
                      </span>

                      <h4 className="text-[13px] font-extrabold text-[#283568]">
                        Inflation Rate
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <FantasySlider
                        label="π_MYR (Malaysia)"
                        value={piM}
                        onChange={setPiM}
                        min={0}
                        max={10}
                        step={0.5}
                        unit="%"
                        color="purple"
                      />

                      <FantasySlider
                        label="π_USD (United States)"
                        value={piU}
                        onChange={setPiU}
                        min={0}
                        max={10}
                        step={0.5}
                        unit="%"
                        color="purple"
                      />
                    </div>
                  </div>

                  {/* INTEREST */}
                  <div className="rounded-[21px] border border-[#f1dcc0] bg-white/80 p-3 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8f8e6] text-[#139e69]">
                        <span className="text-xl font-extrabold">%</span>
                      </span>

                      <h4 className="text-[13px] font-extrabold text-[#283568]">
                        Interest Rate
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <FantasySlider
                        label="i_MYR (Malaysia)"
                        value={iM}
                        onChange={setIM}
                        min={0}
                        max={10}
                        step={0.5}
                        unit="%"
                        color="green"
                      />

                      <FantasySlider
                        label="i_USD (United States)"
                        value={iU}
                        onChange={setIU}
                        min={0}
                        max={10}
                        step={0.5}
                        unit="%"
                        color="green"
                      />
                    </div>
                  </div>

                  {/* FUTURE SCENARIO */}
                  <div className="rounded-[21px] border border-[#f1dcc0] bg-white/80 p-3 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe3da] text-[#e47854]">
                        <Calculator className="h-5 w-5" />
                      </span>

                      <h4 className="text-[13px] font-extrabold text-[#283568]">
                        Future Scenario
                      </h4>
                    </div>

                    <FantasySlider
                      label="Your Sₜ scenario"
                      value={st}
                      onChange={setSt}
                      min={4}
                      max={5.2}
                      step={0.05}
                      unit="MYR/USD"
                      color="orange"
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={resetSimulation}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border-[2px] border-[#efc694] bg-gradient-to-b from-[#fffef9] to-[#fff0db] px-3 text-[12px] font-extrabold text-[#915027] shadow-[0_3px_0_rgba(196,128,69,.23)] transition hover:-translate-y-0.5"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Simulation
                  </button>

                  <button
                    type="button"
                    onClick={tryScenario}
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border-[2px] border-[#ad61df] bg-gradient-to-b from-[#cf83ff] to-[#9a46e5] px-3 text-[12px] font-extrabold text-white shadow-[0_4px_0_#7430b5] transition hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    Try a New Scenario
                  </button>
                </div>

                <div className="mt-5 rounded-[18px] border border-[#efd5b4] bg-[#fffaf1]/85 p-3">
                  <p className="flex items-center gap-2 text-[11px] font-extrabold text-[#915e35]">
                    <Info className="h-4 w-4" />
                    Pip's Currency Tip
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#5b6280]">
                    Lower MYR/USD means a stronger ringgit. Higher MYR/USD
                    means a weaker ringgit.
                  </p>
                </div>
              </FantasyPanel>

              {/* RIGHT — DISCOVERY + CHART */}
              <div className="min-w-0 space-y-8">
                <FantasyPanel
                  title="Discovery Chapters"
                  icon={<BookOpen className="h-5 w-5" />}
                >
                  <div className="grid min-w-0 gap-3 md:grid-cols-3">
                    <ConceptCard
                      number="01"
                      title="Relative PPP"
                      description="How inflation differences relate to exchange rates."
                      formula="S_PPP = S₀ × (1 + π_MYR) / (1 + π_USD)"
                      result={`${ppp.toFixed(5)} MYR/USD`}
                      detail={
                        piU > piM
                          ? "Higher US inflation implies fewer MYR per USD, all else equal."
                          : piU < piM
                            ? "Higher Malaysian inflation implies more MYR per USD, all else equal."
                            : "Equal inflation implies no PPP adjustment."
                      }
                      theme="mint"
                      icon={<Globe2 className="h-6 w-6" />}
                    />

                    <ConceptCard
                      number="02"
                      title="Covered IRP"
                      description="How interest rate differences determine the forward rate."
                      formula="F = S₀ × (1 + i_MYR) / (1 + i_USD)"
                      result={`${fwd.toFixed(5)} MYR/USD`}
                      detail="A theoretical one-year forward rate, not a guaranteed future spot rate."
                      theme="sky"
                      icon={<Coins className="h-6 w-6" />}
                    />

                    <ConceptCard
                      number="03"
                      title="Fisher Effect"
                      description="How inflation affects the real interest rate."
                      formula="r = (1 + i_MYR) / (1 + π_MYR) − 1"
                      result={fmtPct(real, 4)}
                      detail={
                        real >= 0
                          ? "A positive real rate means interest exceeds inflation."
                          : "A negative real rate means inflation exceeds interest."
                      }
                      theme="lavender"
                      icon={<Landmark className="h-6 w-6" />}
                    />
                  </div>

                  <p className="mt-4 text-center text-[11px] leading-relaxed text-[#6b6782]">
                    PPP connects inflation and FX · IRP connects interest
                    and FX · Fisher connects interest and inflation
                  </p>
                </FantasyPanel>

                <FantasyPanel
                  title="Currency Observatory"
                  icon={<Telescope className="h-5 w-5" />}
                >
                  <p className="mb-4 text-[12px] text-[#475276]">
                    Compare exchange rates from different financial approaches.
                    The chart updates automatically as you adjust the simulator.
                  </p>

                  <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(200px,0.85fr)]">
                    {/* CHART */}
                    <div className="min-w-0 rounded-[24px] border border-[#f1d9bb] bg-white/75 p-3 shadow-inner">
                      <div className="h-[270px] w-full min-w-0 sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chart}
                            margin={{
                              top: 26,
                              right: 5,
                              left: -22,
                              bottom: 10,
                            }}
                          >
                            <CartesianGrid
                              stroke="#e7dfd5"
                              vertical={false}
                            />

                            <XAxis
                              dataKey="short"
                              interval={0}
                              tick={{
                                fontSize: 10,
                                fill: "#273a68",
                                fontWeight: 600,
                              }}
                              tickLine={false}
                              axisLine={false}
                            />

                            <YAxis
                              domain={[3.8, 5.4]}
                              tick={{
                                fontSize: 10,
                                fill: "#506081",
                              }}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(v: number) => v.toFixed(1)}
                            />

                            <Tooltip
                              formatter={(value) =>
                                `${Number(value).toFixed(5)} MYR/USD`
                              }
                              labelFormatter={(_, payload) =>
                                payload?.[0]?.payload?.name ?? ""
                              }
                              contentStyle={{
                                borderRadius: 15,
                                border: "1px solid #f0d4ae",
                                background: "#fffaf2",
                                fontSize: 12,
                              }}
                            />

                            <Bar
                              dataKey="v"
                              radius={[9, 9, 0, 0]}
                              maxBarSize={70}
                            >
                              {chart.map((_, index) => (
                                <Cell
                                  key={index}
                                  fill={chartColors[index]}
                                />
                              ))}

                              <LabelList
                                dataKey="v"
                                position="top"
                                formatter={(value: unknown) =>
                                  Number(value).toFixed(3)
                                }
                                style={{
                                  fontSize: 10,
                                  fill: "#243260",
                                  fontWeight: 700,
                                }}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <p className="mt-1 text-center text-[10px] text-[#69718a]">
                        Exchange rate (MYR per USD)
                      </p>
                    </div>

                    {/* PIP'S INSIGHT */}
                    <div className="flex min-w-0 flex-col justify-center">
                      <div className="relative rounded-[24px] border-[2px] border-[#e2c0ed] bg-gradient-to-b from-[#fffefe] to-[#f9ecff] p-4 shadow-[0_4px_0_rgba(177,128,184,.17)]">
                        <div className="absolute -right-2 -top-3 text-2xl">
                          ✨
                        </div>

                        <h3 className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f1dcff] px-3 py-1 font-display text-[14px] font-extrabold text-[#70358d]">
                          <Sparkles className="h-4 w-4" />
                          Pip's Insight
                        </h3>

                        <Pip mood="excited">
                          {pipInsight}
                        </Pip>
                      </div>

                      <div className="mt-3 rounded-[16px] border border-[#f1d9bb] bg-white/75 p-3">
                        <p className="text-[11px] leading-relaxed text-[#68718d]">
                          These are hypothetical educational scenarios.
                          PPP and IRP are theoretical benchmarks, not
                          market forecasts.
                        </p>
                      </div>
                    </div>
                  </div>
                </FantasyPanel>
              </div>
            </div>

            {/* LEARNING NOTES */}
            <div className="mx-auto mt-8 max-w-[1100px] rounded-[24px] border-[2px] border-[#e9bc86] bg-[#fff9ed]/95 px-5 py-4 shadow-[0_4px_0_rgba(178,120,68,.18)]">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6a3c]" />

                <div>
                  <h3 className="font-display text-sm font-extrabold text-[#563269]">
                    Sources & Learning Notes
                  </h3>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#69718b]">
                    The Learning Lab uses hypothetical values and
                    deterministic financial formulas. Add verified
                    academic or institutional references from your
                    course materials before final submission.
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-[10px] text-[#817a91]">
                    <RefreshCw className="h-3 w-3" />
                    Results recalculate instantly when inputs change.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </Page>
  );
}
