import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Coins, Sparkles, Star, Map, FlaskConical, Trophy, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useGame, level } from "@/lib/game-store";
import pip from "@/assets/pip.png";
import { roleInfo } from "@/lib/roles";
import { AvatarView } from "@/components/avatar-art";

/* ---------------- Avatar ---------------- */
// Single shared avatar system: high-resolution, customizable SVG artwork.
// Re-export to preserve imports used by existing mission and map pages.
export { AvatarView, SKINS, HAIRS, OUTFITS, ACCESSORIES } from "@/components/avatar-art";

/* ---------------- Pip ---------------- */
type Mood = "excited" | "concerned" | "thinking" | "celebrating";
const MOOD_EMOJI: Record<Mood, string> = { excited: "✨", concerned: "😟", thinking: "🤔", celebrating: "🎉" };

export function Pip({ mood = "excited", children, size = 96, className }: { mood?: Mood; children: ReactNode; size?: number; className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      <div className="relative shrink-0 animate-float">
        <img src={pip} alt={`Pip the companion, ${mood}`} width={size} height={size} style={{ width: size, height: size }} className={cn("object-contain drop-shadow-lg", mood === "concerned" && "grayscale-[30%]")} />
        <span className="absolute -right-1 -top-1 text-xl" aria-hidden>{MOOD_EMOJI[mood]}</span>
      </div>
      <div className="relative mb-4 rounded-3xl rounded-bl-md border-2 border-border bg-card px-4 py-3 text-sm leading-relaxed shadow-soft">
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-primary">Pip</span>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Top nav ---------------- */

/* ---------------- Top nav ---------------- */
export function TopNav() {
  const g = useGame();

  // Preserve all existing destinations and mobile labels.
  const items = [
    { to: "/map", label: "Adventure Map", mobileLabel: "Map", icon: Map },
    { to: "/learn", label: "Learning Lab", mobileLabel: "Learn", icon: FlaskConical },
    { to: "/achievements", label: "Achievements", mobileLabel: "Awards", icon: Trophy },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-card/95 backdrop-blur-md">
      {/* Match <Page wide> (1500px) without overflowing narrow screens. */}
      <div className="mx-auto grid w-full max-w-[1500px] min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-2.5 sm:px-6 lg:flex lg:gap-4 lg:px-8 xl:gap-6">
        {/* Brand stays on the first row at mobile and tablet widths. */}
        <Link
          to="/"
          aria-label="FX Quest home"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-xl font-display font-extrabold text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          <img src={pip} alt="" width={40} height={40} className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10" />
          <span className="truncate text-lg sm:text-xl">FX Quest</span>
        </Link>

        {/* On small screens this becomes its own full-width second row.
            At desktop it sits between the brand and the player statistics. */}
        <nav
          aria-label="Main navigation"
          className="order-3 col-span-2 grid min-w-0 w-full grid-cols-3 gap-1 rounded-2xl bg-muted/50 p-1 lg:order-none lg:col-auto lg:ml-2 lg:flex lg:w-auto lg:flex-1 lg:items-center lg:justify-center lg:gap-2 lg:bg-transparent lg:p-0"
        >
          {items.map(({ to, label, mobileLabel, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-muted-foreground transition-all duration-200 hover:bg-white/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring sm:flex-row sm:gap-2 sm:px-3 lg:min-h-10 lg:rounded-full lg:px-4"
              activeProps={{ className: "bg-accent text-accent-foreground shadow-sm" }}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-semibold sm:hidden">{mobileLabel}</span>
              <span className="hidden truncate whitespace-nowrap text-sm font-semibold sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Player status stays visible on every device. */}
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-1.5 text-sm font-bold sm:gap-2 lg:order-last lg:ml-auto lg:col-auto lg:row-auto">
          <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-sunny px-3 py-1.5 text-sunny-foreground sm:inline-flex">
            <Coins className="h-4 w-4" aria-hidden="true" />
            {g.coins}
            <span className="hidden xl:inline">coins</span>
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-secondary px-2.5 py-1.5 text-secondary-foreground sm:px-3">
            <Star className="h-4 w-4" aria-hidden="true" />
            Lv {level(g.xp)}
            <span className="hidden xl:inline">· {g.xp} XP</span>
          </span>
          <Link
            to="/avatar"
            aria-label="Edit avatar"
            title="Edit avatar"
            className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
          >
            {/* Your saved chibi avatar, or its default preset. */}
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-amber-300 bg-gradient-to-b from-sky-100 to-cyan-200 shadow-sm sm:h-11 sm:w-11">
              <AvatarView avatar={g.avatar} size={42} viewBox="22 -4 156 156" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}


function RoleBanner() {
  const g = useGame();
  const r = roleInfo(g.role);
  return r ? <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-muted-foreground"><span>{r.emoji} {r.name} · {r.goal}</span><Link to="/characters" className="text-primary underline">Change Role</Link></div> : null;
}



export function Page({
  children,
  className,
  showRole = true,
  fullWidth = false,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  showRole?: boolean;
  fullWidth?: boolean;
  wide?: boolean;
}) {
  // Preserve the existing API; role banner is intentionally hidden.
  void showRole;
  void RoleBanner;
  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-clip bg-sky-gradient">
      <TopNav />

      <main
        className={cn(
          "w-full flex-1",

          // Preserve full-width mode for the Adventure Map and other pages.
          fullWidth
            ? "px-0 py-0"
            : cn(
                "mx-auto px-4 py-8 sm:px-6 lg:px-8",

                // Wider layout is opt-in, so existing pages stay unchanged.
                wide
                  ? "max-w-[1500px]"
                  : "max-w-6xl"
              ),

          className
        )}
      >
        {/* RoleBanner remains disabled as in your current version. */}
        {children}
      </main>

      <footer className="px-4 py-6 text-center text-xs text-muted-foreground">
        Educational simulation • Illustrative, hypothetical rates only • Not investment advice
      </footer>
    </div>
  );
}


export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border-2 border-border bg-card p-5 shadow-soft md:p-6", className)}>{children}</section>;
}

export function HypoTag() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-0.5 text-xs font-bold text-sunny-foreground"><Info className="h-3 w-3" />Hypothetical</span>;
}

/* ---------------- Mission progress ---------------- */

type MissionProgressProps = {
  steps: string[];
  current: number;
};

export function MissionProgress({
  steps,
  current,
}: MissionProgressProps) {
  // Each mission stage has its own visual identity.
  const stageIcons = ["📜", "🧭", "🧠", "🏆"];

  const stageDescriptions = [
    "Get ready",
    "Choose path",
    "Test skills",
    "Claim rewards",
  ];

  // Keep the progress index within the available steps.
  const activeStep = Math.max(
    0,
    Math.min(current, steps.length - 1)
  );

  // The bar reaches 100% when the final stage is active.
  const progress =
    steps.length > 0
      ? ((activeStep + 1) / steps.length) * 100
      : 0;

  return (
    <section
      aria-label="Mission progress"
      className="
        relative overflow-hidden
        rounded-[24px]
        border-2 border-[#F0D99D]
        bg-gradient-to-br
        from-[#FFFDF5]
        via-[#F0FBFF]
        to-[#E8F8F5]
        px-4 py-3
        sm:px-5 sm:py-3
        shadow-[0_6px_22px_rgba(47,113,150,0.09)]
      "
    >
      {/* Progress heading */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-sm font-extrabold text-[#264F78] sm:text-base">
            ✨ Your Adventure Journey
          </p>
          <p className="mt-0.5 text-[11px] text-[#69839A]">
            Every step brings you closer to victory!
          </p>
        </div>

        <span
          className="
            shrink-0 rounded-full
            border border-[#A8E3D4]
            bg-[#E0F8ED]
            px-3 py-1.5
            text-[11px] font-extrabold
            text-[#287D67]
          "
        >
          Step {activeStep + 1} of {steps.length}
        </span>
      </div>

      {/* Mission stages */}
      <ol className="grid grid-cols-4 gap-1 sm:gap-3">
        {steps.map((step, index) => {
          const completed = index < activeStep;
          const active = index === activeStep;

          return (
            <li
              key={`${step}-${index}`}
              className="flex min-w-0 flex-col items-center text-center"
              aria-current={active ? "step" : undefined}
            >
              {/* Stage icon */}
              <div
                className={`
                  relative flex h-9 w-9
items-center justify-center
rounded-full border-2
text-lg
transition-all duration-300
sm:h-11 sm:w-11 sm:text-xl
                  ${
                    completed
                      ? "border-[#62C8A8] bg-[#DDF8E9] shadow-sm"
                      : active
                        ? "border-[#F2BD56] bg-[#FFF0BD] shadow-[0_0_0_4px_rgba(255,210,105,0.20)]"
                        : "border-[#D8E4EC] bg-white/80"
                  }
                `}
              >
                {completed
                  ? "✓"
                  : stageIcons[index] ?? "⭐"}

                {active && (
                  <span className="absolute -right-1 -top-2 text-sm">
                    ✨
                  </span>
                )}
              </div>

              {/* Stage name */}
              <span
                className={`
                  mt-1 text-[11px] font-extrabold
sm:text-xs
                  ${
                    active
                      ? "text-[#8B5B19]"
                      : completed
                        ? "text-[#25866D]"
                        : "text-[#7890A4]"
                  }
                `}
              >
                {step}
              </span>

              {/* Optional description on wider screens */}
              <span className="hidden text-[10px] text-[#8A9CAC] sm:block">
                {stageDescriptions[index] ?? ""}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Animated progress bar */}
      <div
        className="
          mt-2 h-1.5 overflow-hidden
          rounded-full bg-[#DCEAF0]
          shadow-inner
        "
        role="progressbar"
        aria-valuenow={activeStep + 1}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label="Mission stages completed or reached"
      >
        <div
          className="
            h-full rounded-full
            bg-gradient-to-r
            from-[#6ED4B4]
            via-[#5EC9C9]
            to-[#65B9F5]
            transition-all duration-700 ease-out
          "
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

/* ---------------- Rate slider ---------------- */
export function RateSlider({ id, label, value, onChange, min, max, step, unit, hint }: {
  id: string; label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit: string; hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold">{label}</label>
        <span className="rounded-full bg-muted px-2.5 py-0.5 font-display text-sm font-semibold tabular-nums text-primary">{unit === "%" ? `${value.toFixed(step < 1 ? 1 : 0)}%` : `${value.toFixed(2)} ${unit}`}</span>
      </div>
      <Slider id={id} aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0] ?? value)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ---------------- Event card ---------------- */
export function EconomicEventCard({ emoji, title, children }: { emoji: string; title: string; children: ReactNode }) {
  return (
    <div className="animate-pop-in rounded-3xl border-2 border-coral bg-peach/60 p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-2xl" aria-hidden>{emoji}</span><h3 className="font-display text-lg font-semibold">{title}</h3><HypoTag /></div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

/* ---------------- Result stat ---------------- */
export function Stat({ label, value, tone = "default", sub }: { label: string; value: string; tone?: "default" | "good" | "bad"; sub?: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className={cn("font-display text-xl font-semibold tabular-nums", tone === "good" && "text-success", tone === "bad" && "text-destructive")}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

/* ---------------- Reveal the finance ---------------- */
export function RevealFinance({ children }: { children: ReactNode }) {
  return (
    <details className="group rounded-3xl border-2 border-dashed border-primary/40 bg-card p-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-display font-semibold text-primary"><Sparkles className="h-5 w-5" />Learn Why<span className="ml-auto text-xs text-muted-foreground group-open:hidden">tap to open</span></summary>
      <div className="mt-3 space-y-2 text-sm leading-relaxed">{children}</div>
    </details>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return <code className="block overflow-x-auto rounded-xl bg-muted px-3 py-2 font-mono text-sm text-foreground">{children}</code>;
}

export function CompletionCelebration() {
  const g = useGame();
  return <div className="animate-pop-in rounded-3xl bg-mint p-5" role="status"><div className="flex items-center gap-3"><AvatarView avatar={g.avatar} size={64} className="animate-float" /><div><h2 className="text-xl font-bold">🎉 Another little dream, one step closer!</h2><p className="mt-1 text-sm">Learning rewards earned · ⭐ Star clip unlocked</p><Link to="/avatar" className="mt-2 inline-block text-sm font-bold text-primary underline">Try your reward</Link></div></div></div>;
}
