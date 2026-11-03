
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Page, Panel, Pip } from "@/components/quest-ui";
import { useGame, level, CHAPTERS } from "@/lib/game-store";
import welcome from "@/assets/welcome-meadow.jpg";
import pip from "@/assets/pip.png";
import { roleInfo } from "@/lib/roles";

// ----------------------------------------------------
// FX QUEST - WELCOME PAGE
// ----------------------------------------------------
// Responsive full-width Welcome page.
//
// Features:
// - Full-width landscape without side gaps
// - Responsive text and character positioning
// - Original Lovable design and animations
// - Role-based adventure navigation
// - Existing game progress and statistics
// ----------------------------------------------------

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "FX Quest — Can you survive the global economy?" },
      {
        name: "description",
        content:
          "Story-driven finance adventure: make decisions, face inflation, interest and FX shocks, and learn the consequences.",
      },
      {
        property: "og:title",
        content: "FX Quest — Survive the Global Economy",
      },
      {
        property: "og:description",
        content:
          "Make decisions. Face the economy. Learn the consequences.",
      },
    ],
  }),

  component: Index,
});

// ----------------------------------------------------
// ECONOMIC FORCES
// ----------------------------------------------------

const FORCES = [
  {
    emoji: "🎈",
    title: "Inflation",
    text: "Prices rise over time — your ringgit buys a little less each year.",
    tone: "bg-peach",
  },
  {
    emoji: "🌱",
    title: "Interest rates",
    text: "Savings grow — but is growth faster than prices? That's your real return.",
    tone: "bg-mint",
  },
  {
    emoji: "💱",
    title: "Currency moves",
    text: "MYR/USD changes how many ringgit one US dollar costs.",
    tone: "bg-lavender",
  },
];

// ----------------------------------------------------
// MAIN WELCOME PAGE
// ----------------------------------------------------

function Index() {
  const g = useGame();
  const done = g.completed.length;

  return (
    <Page showRole={false} fullWidth>

      {/* ==============================================
          FULL-WIDTH HERO LANDSCAPE
      ============================================== */}

     <section
  className="
    relative
    flex
    min-h-[100svh]
    w-full
    items-center
    justify-center
    overflow-hidden
    text-center
    max-sm:min-h-[100svh]
    max-sm:items-start
  "
>

        {/* Background image */}
        <img
          src={welcome}
          alt="A sunny path to the academy, airport and seaside shop in Currency Kingdom"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
        />

        {/* Soft overlay for text readability */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-background/60
via-background/35
to-transparent
          "
        />

        {/* Blend the landscape naturally into the lower pastel section. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(160px,32vh,360px)]"
          style={{
            background: "linear-gradient(to bottom, rgba(218,247,251,0) 0%, rgba(218,247,251,0.18) 28%, rgba(218,247,251,0.68) 66%, #DAF7FB 100%)",
          }}
        />

        {/* ==========================================
            CENTERED WELCOME CONTENT
        ========================================== */}

        
<div
  className="
    relative
    z-10
    mx-auto
    flex
    w-full
    max-w-3xl
    flex-col
    items-center
    justify-center
    px-5
    py-10
    sm:px-8
    md:py-12
    max-sm:pt-16
    max-sm:pb-10
  "
>


          {/* Welcome label */}
          <span
            className="
              text-xs
              font-bold
              text-primary
              sm:text-sm
              md:text-base
            "
          >
            Welcome to Currency Kingdom
          </span>

          {/* Main heading */}
          <h1
            className="
              mt-2
              font-display
              text-5xl
              font-bold
              leading-tight
              text-primary
              sm:text-6xl
              lg:text-7xl
            "
          >
            FX Quest
          </h1>

          {/* Subtitle */}
          <p
            className="
              mt-3
              max-w-xl
              text-base
              font-semibold
              text-foreground
              sm:text-lg
              md:text-xl
            "
          >
            One little dream. A world of possibilities.
          </p>

          {/* Description */}
          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-relaxed
              text-foreground
              sm:text-base
              md:text-lg
            "
          >
            A university place, a cherry-blossom holiday,
            a thriving little shop. Choose your story —
            Pip is ready to help your ringgit find its way.
          </p>

          {/* Pip character */}
          <img
            src={pip}
            alt="Pip is ready for your adventure"
            className="
              my-4
              h-24
              w-24
              animate-float
              object-contain
              sm:h-28
              sm:w-28
              lg:h-32
              lg:w-32
            "
          />

          {/* Adventure buttons */}
          <div
            className="
              flex
              w-full
              flex-col
              items-center
              justify-center
              gap-3
              sm:w-auto
              sm:flex-row
            "
          >
            <Button
              asChild
              variant="quest"
              size="xl"
              className="w-full px-6 sm:w-auto sm:px-10"
            >
              <Link to={g.role ? "/map" : "/characters"}>
                {g.role
                  ? "Continue Adventure"
                  : "Start Adventure"}
              </Link>
            </Button>

            {g.role && (
              <Button
                asChild
                variant="bubble"
                size="xl"
                className="w-full max-w-[290px] px-6 sm:w-auto sm:max-w-none sm:px-10"
              >
                <Link to="/characters">
                  Change Role
                </Link>
              </Button>
            )}
          </div>

          {/* Current role information */}
          {g.role && (
            <p className="mt-4 text-xs font-bold text-foreground sm:text-sm">
              {roleInfo(g.role)?.emoji}{" "}
              {roleInfo(g.role)?.name} · {done} quests cleared
            </p>
          )}

        </div>
      </section>

      {/* ==============================================
          EDUCATIONAL CONTENT
      ============================================== */}

      <section
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #DAF7FB 0%, #DDF8F2 55%, #F4F9E8 100%)" }}
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">

        {/* Economic forces */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORCES.map((f) => (
            <div
              key={f.title}
              className={`${f.tone} rounded-3xl p-5 shadow-soft`}
            >
              <div className="text-3xl" aria-hidden>
                {f.emoji}
              </div>

              <h2 className="mt-2 font-display text-xl font-semibold">
                {f.title}
              </h2>

              <p className="mt-1 text-sm leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>

        {/* ==========================================
            PIP MESSAGE + JOURNEY SUMMARY
        ========================================== */}

        <div className="mt-8 grid grid-cols-1 items-start gap-4 md:grid-cols-[1.4fr_1fr]">

          {/* Pip message */}
          <Pip mood="excited">
            Hi! I'm <b>Pip</b>, your currency-explorer buddy.
            Every choice you make changes your virtual ringgit
            budget — and I'll show you exactly why.
          </Pip>

          {/* Journey statistics */}
          <Panel>
            <h2 className="font-display text-lg font-semibold">
              Your journey
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">

              {/* Level */}
              <div>
                <div className="font-display text-2xl font-bold text-primary">
                  {level(g.xp)}
                </div>

                <div className="text-xs text-muted-foreground">
                  Level
                </div>
              </div>

              {/* Completed worlds */}
              <div>
                <div className="font-display text-2xl font-bold text-primary">
                  {done}/{CHAPTERS.length}
                </div>

                <div className="text-xs text-muted-foreground">
                  Worlds
                </div>
              </div>

              {/* Badges */}
              <div>
                <div className="font-display text-2xl font-bold text-primary">
                  {g.badges.length}
                </div>

                <div className="text-xs text-muted-foreground">
                  Badges
                </div>
              </div>

            </div>
          </Panel>

        </div>
        </div>
      </section>
    </Page>
  );
}
