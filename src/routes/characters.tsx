/**
 * FX QUEST — CHARACTER SELECTION (ENCHANTED ISLAND REDESIGN)
 *
 * Single-file visual redesign. Preserves the original role data,
 * chooseRole() game logic, existing AvatarView illustrations,
 * navigation, Pip companion, and avatar customization link.
 *
 * Uses the same meadow artwork as the landing page so this screen
 * feels like the next scene in the same world.
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  GraduationCap,
  Plane,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AvatarView, Page, Pip } from "@/components/quest-ui";
import { useGame, chooseRole } from "@/lib/game-store";
import { ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";
import meadow from "@/assets/welcome-meadow.jpg";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Choose your adventure — FX Quest" },
      {
        name: "description",
        content:
          "Choose a student, traveller or shop owner and embark on your own financial adventure.",
      },
      { property: "og:title", content: "Choose your adventure — FX Quest" },
      {
        property: "og:description",
        content: "Three dreams, three colourful adventures with Pip.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Characters,
});

// Each path has its own illustrated landscape palette.
// The original ROLES data remains the source of all financial content.
const ROLE_SCENES = {
  student: {
    label: "The Campus Path",
    icon: GraduationCap,
    sky: "from-[#A8E5F4] via-[#BCEEE3] to-[#E3F9DB]",
    rearHill: "bg-[#7DD8B4]/65",
    frontHill: "bg-[#44BA96]/55",
    haze: "bg-[#DFFFF3]/70",
    border: "border-[#BDEBDD]",
    badge: "border-[#B8E9D9] bg-[#E6FAF2] text-[#187D68]",
    iconColor: "text-[#198B75]",
    button:
      "bg-[#20B693] border-[#128C73] hover:bg-[#159F83] focus-visible:ring-[#70D8BB]",
    emblem: "📚",
  },
  traveller: {
    label: "The Blossom Trail",
    icon: Plane,
    sky: "from-[#A7DAFC] via-[#FFD9DE] to-[#FFE9D2]",
    rearHill: "bg-[#FFAEC2]/65",
    frontHill: "bg-[#F4A8A7]/55",
    haze: "bg-[#FFF0E7]/80",
    border: "border-[#F4D7CC]",
    badge: "border-[#F7D9D0] bg-[#FFF0E9] text-[#B7705E]",
    iconColor: "text-[#BE765D]",
    button:
      "bg-[#F18F76] border-[#D66E5B] hover:bg-[#E77D68] focus-visible:ring-[#FFC8B2]",
    emblem: "🌸",
  },
  business: {
    label: "The Harbour Path",
    icon: Store,
    sky: "from-[#A6DFF9] via-[#D7D4FF] to-[#EDE1FE]",
    rearHill: "bg-[#B5AFF5]/60",
    frontHill: "bg-[#8DA9E4]/55",
    haze: "bg-[#F0EAFF]/85",
    border: "border-[#DED4F4]",
    badge: "border-[#DDD4F8] bg-[#F2ECFF] text-[#8168B7]",
    iconColor: "text-[#8168B7]",
    button:
      "bg-[#947DDA] border-[#775FB6] hover:bg-[#8169CB] focus-visible:ring-[#C8B9F5]",
    emblem: "🛍️",
  },
} as const;

function Characters() {
  const game = useGame();
  const navigate = useNavigate();

  // Keep the original role-selection and adventure-map behavior.
  function handleChooseRole(roleId: (typeof ROLES)[number]["id"]) {
    chooseRole(roleId);
    void navigate({ to: "/map" });
  }

  return (
    <Page showRole={false} fullWidth className="relative overflow-hidden">
      <section className="relative isolate w-full overflow-hidden pb-5 sm:pb-7">
        {/* The shared landing-page landscape ties both pages together. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[475px] overflow-hidden">
          <img
            src={meadow}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_49%] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF9FF]/30 via-[#EBFCFF]/75 to-[#EAF9F4]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-b from-transparent via-[#EAF9F4]/75 to-[#EAF9F4]" />

        <div className="relative mx-auto w-full max-w-[1500px] px-4 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pt-7">
          {/* --------------------------------------------------
              INTRODUCTION
          -------------------------------------------------- */}
          <header className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#287C91] shadow-sm backdrop-blur-md sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#E7AF4A]" />
              Your story starts here
              <Sparkles className="h-3.5 w-3.5 text-[#E7AF4A]" />
            </span>

            <h1 className="mt-3 font-display text-[35px] font-extrabold leading-[1.1] tracking-tight text-[#193E64] drop-shadow-[0_2px_0_rgba(255,255,255,0.5)] sm:text-[43px] lg:text-[48px]">
              Who will you <span className="text-[#138D91]">be?</span>
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#41677B] sm:text-[15px]">
              Three little dreams, three big adventures. Choose the story
              you want to explore with Pip!
            </p>
          </header>

          {/* --------------------------------------------------
              THREE STORY PATHS
          -------------------------------------------------- */}
          <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-5">
            {ROLES.map((role, index) => {
              const selected = game.role === role.id;
              const scene = ROLE_SCENES[role.id];
              const SceneIcon = scene.icon;

              return (
                <article
                  key={role.id}
                  className={cn(
                    "group relative flex min-w-0 flex-col rounded-[32px] border-[2px] bg-white/95 p-[9px]",
                    "shadow-[0_16px_38px_rgba(34,94,105,0.13)] backdrop-blur-md",
                    "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_23px_45px_rgba(34,94,105,0.20)]",
                    selected
                      ? "border-[#15A9DD] ring-4 ring-[#4BC6EA]/20"
                      : scene.border,
                  )}
                >
                  {selected && (
                    <span className="absolute -right-2 -top-3 z-20 inline-flex items-center gap-1.5 rounded-full border-[2px] border-white bg-[#149BDE] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-[0_5px_16px_rgba(20,155,222,0.25)]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      Your chosen path
                    </span>
                  )}

                  {/* Pastel island scene for each role. */}
                  <div
                    className={cn(
                      "relative h-[176px] overflow-hidden rounded-[24px] bg-gradient-to-b sm:h-[184px] lg:h-[172px]",
                      scene.sky,
                    )}
                  >
                    {/* Clouds and atmospheric decoration. */}
                    <span className="absolute left-[15%] top-8 h-4 w-16 rounded-full bg-white/65 blur-[1px]" />
                    <span className="absolute left-[19%] top-5 h-8 w-9 rounded-full bg-white/65 blur-[1px]" />
                    <span className="absolute right-[18%] top-10 h-3 w-12 rounded-full bg-white/65 blur-[1px]" />
                    <span className="absolute right-[23%] top-7 h-6 w-7 rounded-full bg-white/65 blur-[1px]" />

                    {/* Hills give the original avatar a little world to stand in. */}
                    <div
                      className={cn(
                        "absolute -bottom-[96px] -left-[16%] h-[153px] w-[79%] rounded-[50%]",
                        scene.rearHill,
                      )}
                    />
                    <div
                      className={cn(
                        "absolute -bottom-[101px] -right-[15%] h-[151px] w-[83%] rounded-[50%]",
                        scene.frontHill,
                      )}
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 h-10 w-full opacity-50 blur-lg",
                        scene.haze,
                      )}
                    />

                    <div className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/90 bg-white/75 shadow-sm backdrop-blur-sm">
                      <SceneIcon className={cn("h-5 w-5", scene.iconColor)} />
                    </div>

                    <span className="absolute right-5 top-3 z-10 text-2xl drop-shadow-sm" aria-hidden="true">
                      {scene.emblem}
                    </span>
                    <Sparkles className="absolute left-[19%] top-[52%] h-5 w-5 text-white/90" aria-hidden="true" />
                    <Sparkles className="absolute right-[17%] top-[60%] h-4 w-4 text-[#FFF5BE]" aria-hidden="true" />

                    {/* Preserve the actual customizable SVG avatar system. */}
                    <div className="absolute bottom-[-8px] left-1/2 z-10 -translate-x-1/2 drop-shadow-[0_8px_9px_rgba(50,81,96,0.18)] transition-transform duration-300 group-hover:scale-[1.07]">
                      <AvatarView avatar={role.avatar} size={158} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4">
                    {/* Role identity */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                          scene.badge,
                        )}
                      >
                        {role.emoji} {role.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BA3B4]">
                        Path {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h2 className="mt-2.5 font-display text-[20px] font-extrabold leading-tight text-[#203E61] sm:text-[21px] lg:text-[20px] xl:text-[22px]">
                      {role.title}
                    </h2>

                    <p className="mt-1.5 text-[13px] leading-[1.55] text-[#617487]">
                      {role.story}
                    </p>

                    {/* Keep the same budgets and learning objectives. */}
                    <dl className="mt-3 rounded-[20px] border border-[#E5EDF3] bg-[#F6FBFF]/85 px-3 py-3">
                      <div className="grid grid-cols-[0.85fr_1.4fr] gap-3">
                        <div className="min-w-0">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]">
                            <Wallet className="h-3.5 w-3.5 text-[#42A8A0]" />
                            Budget
                          </dt>
                          <dd className="mt-1 text-[13px] font-extrabold text-[#264A6A] sm:text-[14px]">
                            {role.budget}
                          </dd>
                        </div>
                        <div className="min-w-0 border-l border-[#E1EAF1] pl-3">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]">
                            <Compass className="h-3.5 w-3.5 text-[#F1AB64]" />
                            Your mission
                          </dt>
                          <dd className="mt-1 text-[12px] font-semibold leading-[1.4] text-[#385977]">
                            {role.goal}
                          </dd>
                        </div>
                      </div>
                      <div className="mt-2.5 border-t border-[#E1EAF1] pt-2.5">
                        <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]">
                          <BookOpen className="h-3.5 w-3.5 text-[#9D88DA]" />
                          You'll discover
                        </dt>
                        <dd className="mt-1 text-[12px] font-semibold text-[#385977]">
                          {role.concepts}
                        </dd>
                      </div>
                    </dl>

                    <div className="my-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#718A99]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#65BBA3]" />
                      {role.difficulty} adventure · Hypothetical story
                    </div>

                    <button
                      type="button"
                      onClick={() => handleChooseRole(role.id)}
                      aria-label={`${selected ? "Continue" : "Start"} ${role.name} adventure`}
                      className={cn(
                        "mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-[16px] border-b-[4px] px-4 py-2.5",
                        "text-[13px] font-extrabold text-white shadow-sm transition-all duration-200",
                        "hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-2",
                        "focus-visible:outline-none focus-visible:ring-4",
                        selected
                          ? "border-[#0776AE] bg-[#079FE8] hover:bg-[#008ED2] focus-visible:ring-[#9DDFFB]"
                          : scene.button,
                      )}
                    >
                      {selected ? "Continue adventure" : "Choose this adventure"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* --------------------------------------------------
              PIP'S MESSAGE + AVATAR CUSTOMIZATION
          -------------------------------------------------- */}
          <div className="mt-5 flex flex-col gap-3 rounded-[26px] border border-white/90 bg-white/75 p-3 shadow-[0_8px_28px_rgba(39,104,126,0.10)] backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="min-w-0 flex-1">
              <Pip size={66}>
                Every adventure is yours to explore! Changing roles keeps the
                badges and coins you’ve earned. ✨
              </Pip>
            </div>
            <Button
              asChild
              variant="bubble"
              className="min-h-11 w-full shrink-0 gap-2 rounded-full px-5 font-extrabold sm:w-auto"
            >
              <Link to="/avatar">
                Personalise my explorer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}
