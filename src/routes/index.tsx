
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/quest-ui";
import { useGame, level, CHAPTERS } from "@/lib/game-store";
import { roleInfo } from "@/lib/roles";

import welcome from "@/assets/welcome-meadow.jpg";
import explorerBg from "@/assets/bg_bottom.png";
import pip from "@/assets/pip.png";

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

const FORCES = [
  {
    emoji: "🪙",
    kind: "inflation",
    title: "Inflation",
    text: "Prices rise over time — your ringgit buys a little less each year.",
  },
  {
    emoji: "🌱",
    kind: "interest",
    title: "Interest rates",
    text: "Savings grow — but is growth faster than prices? That's your real return.",
  },
  {
    emoji: "💱",
    kind: "currency",
    title: "Currency moves",
    text: "MYR/USD changes how many ringgit one US dollar costs.",
  },
];

function Index() {
  const g = useGame();
  const done = g.completed.length;

  const progress = CHAPTERS.length
    ? Math.min(100, (done / CHAPTERS.length) * 100)
    : 0;

  return (
    <Page showRole={false} fullWidth>
      <main className="fx-welcome-page">

        {/* =========================================
            WELCOME HERO
        ========================================= */}
        <section className="fx-hero relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden text-center max-sm:items-start">

          <img
            src={welcome}
            alt="Currency Kingdom with an academy, airport, seaside shop and flowers"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Light overlay for readability */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(235,250,255,.48) 0%, rgba(235,250,255,.25) 48%, rgba(235,250,255,.05) 75%)",
            }}
          />

          {/* Gradually dissolve the welcome image */}
          <div
            className="fx-hero-fade pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
            aria-hidden="true"
          />

          {/* Welcome content */}
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-5 py-10 sm:px-8 md:py-12 max-sm:pt-16">

            <span className="text-xs font-bold text-primary sm:text-sm md:text-base">
              Welcome to Currency Kingdom
            </span>

            <h1 className="mt-2 font-display text-5xl font-bold leading-tight text-primary sm:text-6xl lg:text-7xl">
              FX Quest
            </h1>

            <p className="mt-3 max-w-xl text-base font-semibold text-foreground sm:text-lg md:text-xl">
              One little dream. A world of possibilities.
            </p>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground sm:text-base md:text-lg">
              A university place, a cherry-blossom holiday,
              a thriving little shop. Choose your story —
              Pip is ready to help your ringgit find its way.
            </p>

            <img
              src={pip}
              alt="Pip is ready for your adventure"
              className="my-4 h-24 w-24 animate-float object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32"
            />

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <Button
                asChild
                variant="quest"
                size="xl"
                className="w-full px-6 sm:w-auto sm:px-10"
              >
                <Link to={g.role ? "/map" : "/characters"}>
                  {g.role ? "Continue Adventure" : "Start Adventure"}
                </Link>
              </Button>

              {g.role && (
                <Button
                  asChild
                  variant="bubble"
                  size="xl"
                  className="w-full max-w-[290px] px-6 sm:w-auto sm:max-w-none sm:px-10"
                >
                  <Link to="/characters">Change Role</Link>
                </Button>
              )}
            </div>

            {g.role && (
              <p className="mt-4 text-xs font-bold text-foreground sm:text-sm">
                {roleInfo(g.role)?.emoji}{" "}
                {roleInfo(g.role)?.name} · {done} quests cleared
              </p>
            )}
          </div>
        </section>

        {/* =========================================
            EXPLORER'S CORNER
        ========================================= */}
        <section
          className="explorer-world relative isolate w-full overflow-hidden"
          aria-labelledby="explorer-heading"
          style={{
            ["--explorer-image" as string]: `url("${explorerBg}")`,
          }}
        >
          {/* Soft floral image background */}
          <div className="explorer-image" aria-hidden="true" />

          {/* Soft ambient light */}
          <div className="explorer-glow" aria-hidden="true" />

          {/* Decorative stars */}
          <div className="explorer-stars" aria-hidden="true">
            ✦ ✧ ✦
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-12 pt-12 sm:px-7 sm:pt-14 lg:px-12 lg:pb-16 lg:pt-16">

            {/* Explorer title */}
            <header className="mb-12 flex flex-col items-center text-center sm:mb-14">
              <div className="explorer-ribbon">
                <span aria-hidden="true">🧭</span>

                <h2
                  id="explorer-heading"
                  className="font-display text-[clamp(1.65rem,3.6vw,3.3rem)] font-extrabold leading-tight tracking-tight"
                >
                  The Explorer’s Corner
                </h2>

                <span aria-hidden="true">✨</span>
              </div>

              <p className="explorer-subtitle font-display">
                ✨ Little lessons for your big adventure! ✨
              </p>
            </header>

            {/* Financial lessons */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-5 lg:gap-7">
              {FORCES.map((force) => (
                <article
                  key={force.title}
                  className={`explorer-lesson explorer-lesson-${force.kind}`}
                >
                  <div
                    className="explorer-lesson-icon"
                    aria-hidden="true"
                  >
                    {force.emoji}
                  </div>

                  <span
                    className="explorer-lesson-sparkle"
                    aria-hidden="true"
                  >
                    ✦
                  </span>

                  <h3 className="font-display text-[clamp(1.35rem,2vw,1.8rem)] font-extrabold">
                    {force.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-[330px] text-sm leading-relaxed sm:text-base">
                    {force.text}
                  </p>

                  <span
                    className="explorer-cloud explorer-cloud-left"
                    aria-hidden="true"
                  >
                    ☁
                  </span>

                  <span
                    className="explorer-cloud explorer-cloud-right"
                    aria-hidden="true"
                  >
                    ☁
                  </span>
                </article>
              ))}
            </div>

            {/* Pip and Passport */}
            <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1.08fr_1fr] lg:gap-8">

              {/* Pip's message */}
              <div className="relative flex items-end gap-0 sm:gap-2">
                <img
                  src={pip}
                  alt="Pip, your cheerful currency explorer"
                  className="explorer-pip relative z-10 -mr-5 h-32 w-32 shrink-0 object-contain drop-shadow-xl sm:-mr-8 sm:h-44 sm:w-44 lg:h-48 lg:w-48"
                />

                <div className="explorer-speech relative min-w-0 flex-1 px-5 pb-6 pt-8 sm:px-7 sm:pb-8 sm:pt-10">
                  <div className="explorer-wood-title font-display">
                    A Little Tip from Pip! ⭐
                  </div>

                  <p className="text-sm leading-relaxed text-[#35234a] sm:text-base lg:text-lg">
                    Hi! I’m <strong>Pip</strong>, your currency-explorer buddy.
                    Every choice you make changes your virtual ringgit budget
                    — and I’ll show you exactly why.
                  </p>
                </div>
              </div>

              {/* Adventure Passport */}
              <div className="explorer-passport relative px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="text-4xl drop-shadow-sm sm:text-5xl"
                    aria-hidden="true"
                  >
                    📕
                  </span>

                  <h3 className="font-display text-xl font-extrabold text-[#4b267a] sm:text-2xl">
                    My Adventure Passport
                  </h3>
                </div>

                <div className="grid grid-cols-3 divide-x divide-[#e8c79e] text-center">
                  <div className="px-1">
                    <div className="text-3xl" aria-hidden="true">⭐</div>
                    <div className="font-display text-2xl font-extrabold text-[#522b35]">
                      {level(g.xp)}
                    </div>
                    <div className="text-xs text-[#654963] sm:text-sm">
                      Level
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="text-3xl" aria-hidden="true">🗺️</div>
                    <div className="font-display text-2xl font-extrabold text-[#522b35]">
                      {done}/{CHAPTERS.length}
                    </div>
                    <div className="text-xs text-[#654963] sm:text-sm">
                      Worlds
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="text-3xl" aria-hidden="true">🏅</div>
                    <div className="font-display text-2xl font-extrabold text-[#522b35]">
                      {g.badges.length}
                    </div>
                    <div className="text-xs text-[#654963] sm:text-sm">
                      Badges
                    </div>
                  </div>
                </div>

                <div
                  className="mt-5 h-4 overflow-hidden rounded-full border-2 border-[#e6b47a] bg-[#efd4a4]"
                  role="progressbar"
                  aria-label="Worlds completed"
                  aria-valuenow={done}
                  aria-valuemin={0}
                  aria-valuemax={CHAPTERS.length}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#45cfa1] to-[#a6e86c] transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Page>
  );
}
