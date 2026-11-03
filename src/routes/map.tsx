import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Check, Star, ArrowRight, RefreshCw, Target, Sparkles } from "lucide-react";
import { Page, Pip, AvatarView } from "@/components/quest-ui";
import { Button } from "@/components/ui/button";
import { useGame, CHAPTERS } from "@/lib/game-store";
import { roleInfo, mapChapters, chapterUnlocked } from "@/lib/roles";
import { cn } from "@/lib/utils";

// Keep the asset names already used in your project.
import worldMap from "@/assets/world-map_full.png";
import travellerMap from "@/assets/traveller_map_test.png";
import businessMap from "@/assets/business-map.png";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Your Adventure Map — FX Quest" },
      {
        name: "description",
        content: "Explore your role's adventure, resume missions and collect learning rewards.",
      },
      { property: "og:title", content: "Your Adventure Map — FX Quest" },
      { property: "og:description", content: "Campus Crossing, Cherry Blossom Trail and Little Shop Harbour await." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

/* ----------------------------------------------------------------
   Quest nodes sit ON the islands, as [left %, top %] of the map image.
   These are tuned for world-map_full.png. If a node is slightly off
   its island on your screen, nudge the numbers here.
---------------------------------------------------------------- */
const WORLD_POS: [number, number][] = [
  [34, 25], // top-left island
  [74, 31], // top-right island
  [30, 64], // bottom-left island
  [69, 68], // bottom-right island
];

// Traveller and business maps have different layouts, so they get safe
// quadrant positions. Tune these after checking each map.
const OTHER_POS: [number, number][] = [
  [25, 26],
  [75, 26],
  [25, 72],
  [75, 72],
];

type NodeState = "locked" | "open" | "cleared";

function badgeClass(state: NodeState, isMain: boolean) {
  if (state === "locked") return "bg-gradient-to-b from-[#e8f0f6] to-[#b6c6d5] text-[#5f7690]";
  if (state === "cleared") return "bg-gradient-to-b from-[#74e0a0] to-[#2fb872] text-white";
  return isMain
    ? "bg-gradient-to-b from-[#fbd461] to-[#f0a81f] text-[#52317b]"
    : "bg-gradient-to-b from-[#5fb4f8] to-[#2b6fd6] text-white";
}

function stateLabel(state: NodeState, isMain: boolean) {
  if (state === "locked") return "Locked";
  if (state === "cleared") return "Cleared";
  return isMain ? "Story quest" : "Side quest";
}

function StateIcon({ state, className }: { state: NodeState; className?: string }) {
  if (state === "locked") return <Lock className={className} aria-hidden="true" />;
  if (state === "cleared") return <Check className={className} strokeWidth={3.5} aria-hidden="true" />;
  return <Star className={cn(className, "fill-current")} aria-hidden="true" />;
}

/* The round badge and name tag shown on each island. */
function NodeBody({ name, state, isMain }: { name: string; state: NodeState; isMain: boolean }) {
  return (
    <>
      <span
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white shadow-[0_6px_14px_rgba(21,81,130,.35)] transition-shadow sm:h-12 sm:w-12 lg:h-14 lg:w-14",
          "group-focus-visible:ring-4 group-focus-visible:ring-[#2b6fd6]/60",
          badgeClass(state, isMain),
        )}
      >
        {isMain && state === "open" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#fbd461] opacity-60 motion-safe:animate-ping"
          />
        )}
        <StateIcon state={state} className="relative h-5 w-5 lg:h-6 lg:w-6" />
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "hidden flex-col items-center rounded-2xl border-2 px-3.5 py-1 text-center shadow-[0_4px_0_rgba(187,125,61,.2),0_8px_16px_rgba(21,81,130,.18)] sm:flex",
          state === "locked"
            ? "border-white/80 bg-white/75 text-slate-500"
            : "border-[#efc478] bg-[#fff5dc]/95 text-[#373268]",
        )}
      >
        <b className="font-display text-xs font-extrabold leading-tight lg:text-sm">{name}</b>
        <span className="text-[10px] font-bold leading-tight opacity-75 lg:text-xs">{stateLabel(state, isMain)}</span>
      </span>
    </>
  );
}

function MapPage() {
  const g = useGame();
  const r = roleInfo(g.role);

  if (!r) {
    return (
      <Page>
        <div className="mx-auto max-w-xl py-12 text-center">
          <h1 className="font-display text-3xl font-bold">A dream awaits you</h1>
          <Pip className="mx-auto mt-6 max-w-lg">Let's choose your story before setting off.</Pip>
          <Button asChild variant="quest" className="mt-6">
            <Link to="/characters">Choose Role</Link>
          </Button>
        </div>
      </Page>
    );
  }

  // Original role-based chapter logic remains unchanged.
  const main = CHAPTERS.find((chapter) => chapter.id === r.mission);
  const chapters = mapChapters(
    CHAPTERS.filter((chapter) => chapter.id !== "traveller" || g.role === "traveller"),
    r.id,
  );
  const map = r.id === "traveller" ? travellerMap : r.id === "business" ? businessMap : worldMap;
  const positions = map === worldMap ? WORLD_POS : OTHER_POS;
  const mainCompleted = main !== undefined && g.completed.includes(main.id);

  const shown = chapters.slice(0, 4);
  const cleared = shown.filter((chapter) => g.completed.includes(chapter.id)).length;

  const stateOf = (chapter: (typeof chapters)[number]): NodeState =>
    g.completed.includes(chapter.id)
      ? "cleared"
      : chapterUnlocked(chapter, g.completed, r.id)
        ? "open"
        : "locked";

  return (
    <Page fullWidth>
      <main className="relative left-1/2 w-screen min-w-0 -translate-x-1/2 overflow-x-clip bg-[#eaf8fd]">
        {/*
          One continuous scene: a soft sky at the top holds the header, and the
          map fades up into it. Nothing covers the islands, and the map keeps
          its natural proportions (no stretching, no cropping).
        */}
        <section
          aria-label="Your adventure atlas"
          className="relative isolate bg-[linear-gradient(180deg,#cdf1fd_0,#9fe3f8_150px,#5ec9f2_300px)]"
        >
          {/* Soft clouds drifting behind the header */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-10 top-1 h-14 w-60 rounded-full bg-white/70 blur-xl" />
          <span aria-hidden="true" className="pointer-events-none absolute left-[38%] top-0 h-12 w-72 rounded-full bg-white/60 blur-xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-8 top-3 h-16 w-64 rounded-full bg-white/70 blur-xl" />

          {/* ================= HEADER ================= */}
          <header className="relative z-20 mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-x-5 gap-y-3 px-4 pb-3 pt-4 sm:px-6 lg:flex-nowrap lg:px-9 lg:pt-5">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[#f7d66d] bg-gradient-to-b from-[#e3f9ff] to-[#b8ecfb] shadow-[0_6px_16px_rgba(21,81,130,.25)] sm:h-[84px] sm:w-[84px]">
                  <AvatarView avatar={g.avatar ?? r.avatar} size={78} />
                </div>
                <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-amber-400 drop-shadow" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#e8bf62] bg-[#fff7e7]/95 px-3 py-0.5 text-[11px] font-extrabold text-[#52317b] shadow-sm sm:text-xs">
                  <span aria-hidden="true">{r.emoji}</span>
                  <span className="truncate">{r.name} · Your adventure</span>
                </p>
                <h1
                  className="mt-1 font-display font-extrabold leading-[1.05] tracking-tight text-white"
                  style={{
                    fontSize: "clamp(1.7rem, 3.2vw, 3rem)",
                    WebkitTextStroke: "6px #2b6fd6",
                    paintOrder: "stroke fill",
                    textShadow: "0 4px 0 rgba(30,70,160,.3)",
                  }}
                >
                  {r.mapName}
                </h1>
              </div>
            </div>

            <div className="order-3 w-full rounded-[22px] border-2 border-[#efc478] bg-[#fff5dc]/95 px-4 py-2.5 shadow-[0_4px_0_rgba(187,125,61,.17),0_8px_20px_rgba(36,82,131,.12)] sm:order-none sm:w-auto sm:min-w-[260px] sm:max-w-[380px]">
              <div className="flex items-center gap-2 font-display text-sm font-extrabold text-[#60348b] sm:text-base">
                <Target className="h-4 w-4 shrink-0 text-[#ec5b79] sm:h-5 sm:w-5" aria-hidden="true" />
                Your Mission
              </div>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-[#373268]">{r.goal}</p>
            </div>

            <Button
              asChild
              variant="bubble"
              className="order-2 ml-auto h-11 shrink-0 gap-2 rounded-full border-2 border-[#efc478] bg-[#fff9e9] px-5 font-extrabold text-[#543278] shadow-[0_4px_0_rgba(174,117,58,.2)] transition-transform hover:-translate-y-0.5 hover:bg-white sm:order-none"
            >
              <Link to="/characters">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Change Role
              </Link>
            </Button>
          </header>

          {/* ================= MAP ================= */}
          <div className="relative z-10 mx-auto -mt-6 w-full max-w-[2000px] sm:-mt-8 lg:-mt-12">
            <img
              src={map}
              alt={`${r.mapName}, an illustrated adventure for your ${r.name.toLowerCase()} story`}
              className="block h-auto w-full select-none"
              style={{
                // Only the Traveller map is adjusted.
                // Match the 1672 x 941 proportions of world-map_full.png.
                aspectRatio: r.id === "traveller" ? "1672 / 941" : undefined,
                objectFit: r.id === "traveller" ? "fill" : undefined,

                // Reduce Traveller saturation and gently soften contrast.
                // All other role maps keep their original appearance.
                filter:
                  r.id === "traveller"
                    ? "saturate(0.82) contrast(0.97) brightness(1.02)"
                    : undefined,

                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 11%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, #000 11%)",
              }}
            />

            {/* Page colour rises over the bottom edge so the map melts into the content. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#eaf8fd] to-transparent lg:h-24"
            />

            {/* Quest nodes, anchored to their islands */}
            {shown.map((chapter, index) => {
              const state = stateOf(chapter);
              const isMain = chapter.id === r.mission;
              const [x, y] = positions[index] ?? [50, 50];
              const requiresName = CHAPTERS.find((item) => item.id === chapter.requires)?.name;
              const spot = { left: `${x}%`, top: `${y}%` };
              const base = "group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 outline-none";

              return state === "locked" ? (
                <div
                  key={chapter.id}
                  style={spot}
                  role="img"
                  aria-label={`${chapter.name}, locked${requiresName ? `. Finish ${requiresName} first` : ""}`}
                  className={cn(base, "cursor-not-allowed opacity-90")}
                >
                  <NodeBody name={chapter.name} state={state} isMain={isMain} />
                </div>
              ) : (
                <Link
                  key={chapter.id}
                  to={chapter.to}
                  style={spot}
                  aria-label={`${chapter.name}, ${stateLabel(state, isMain).toLowerCase()}`}
                  className={cn(base, "transition-transform duration-200 hover:-translate-y-[calc(50%+4px)] focus-visible:-translate-y-[calc(50%+4px)]")}
                >
                  <NodeBody name={chapter.name} state={state} isMain={isMain} />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ================= BELOW THE MAP ================= */}
        <div className="relative z-10 mx-auto -mt-8 w-full max-w-[1650px] px-4 pb-10 sm:px-6 lg:-mt-12 lg:px-8">
          {/* Quest bar: guide, progress and the main call to action */}
          <div className="flex flex-col gap-4 rounded-[28px] border-[3px] border-[#f9d777] bg-[#fff5dc] p-4 shadow-[0_6px_0_rgba(187,125,61,.18),0_16px_36px_rgba(36,82,131,.16)] lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="min-w-0 flex-1">
              <Pip size={72}>
                Let's help your dream come true! Start with <b>{main?.name}</b>, then explore the side quests.
              </Pip>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
              <div className="flex items-center justify-center gap-3 rounded-full border-2 border-[#efc478]/70 bg-white/80 px-4 py-2.5">
                <div className="flex gap-1.5" aria-hidden="true">
                  {shown.map((chapter) => (
                    <span
                      key={chapter.id}
                      className={cn(
                        "h-3 w-3 rounded-full border-2",
                        g.completed.includes(chapter.id) ? "border-[#2fb872] bg-[#4cc48a]" : "border-[#efc478] bg-white",
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-extrabold text-[#52317b]">
                  {cleared} of {shown.length} quests cleared
                </span>
              </div>

              {main && (
                <Button asChild variant="quest" size="lg" className="w-full rounded-full shadow-md sm:w-auto">
                  <Link to={main.to}>
                    {mainCompleted ? "Replay Story" : "Continue Adventure"}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Quest cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map((chapter) => {
              const state = stateOf(chapter);
              const isMain = chapter.id === r.mission;
              const requiresName = CHAPTERS.find((item) => item.id === chapter.requires)?.name;

              return (
                <article
                  key={chapter.id}
                  className={cn(
                    "flex min-w-0 flex-col rounded-[24px] border-2 p-4 shadow-[0_4px_0_rgba(187,125,61,.15)]",
                    state === "locked" ? "border-white bg-white/60" : "border-[#efc478] bg-[#fffaf0]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-white shadow-md",
                        badgeClass(state, isMain),
                      )}
                    >
                      <StateIcon state={state} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#2b6fd6]">{stateLabel(state, isMain)}</p>
                      <h2 className="font-display text-lg font-extrabold leading-tight text-[#24245e]">{chapter.name}</h2>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-[#624c88]">{chapter.concept}</p>

                  {state === "locked" ? (
                    <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold text-slate-500">
                      <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      Finish {requiresName}
                    </p>
                  ) : (
                    <Button asChild variant="bubble" className="mt-auto w-full">
                      <Link to={chapter.to}>
                        {state === "cleared" ? "Play again" : "Explore"}
                        <Star className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </Page>
  );
}
