/**
 * FX QUEST — CHARACTER SELECTION (EXISTING AVATAR ART EDITION)
 *
 * Uses the SVG AvatarView already used by the avatar customizer.
 * NO separate PNG character portraits, new dependencies, or asset downloads.
 * Keeps ROLES content, chooseRole(), /map navigation, Pip and avatar link.
 * The only role-look overrides are existing wardrobe items for the previews:
 *   Traveller jacket (outfit 5) and Shop apron (outfit 9).
 * They do NOT change a player's saved avatar, purchases or role data.
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
import { Page, Pip } from "@/components/quest-ui";
import { AvatarView } from "@/components/avatar-art";
import { useGame, chooseRole } from "@/lib/game-store";
import { ROLES, type RoleId } from "@/lib/roles";
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

const SCENES = {
  student: {
    path: "CAMPUS PATH",
    icon: GraduationCap,
    sky: "from-[#A7E7F3] via-[#C5F2E5] to-[#E0F7D1]",
    hillBack: "bg-[#96DCBC]",
    hillFront: "bg-[#70C7A5]",
    iconTone: "text-[#168C80]",
    rim: "border-[#B1E7D7]",
    tag: "border-[#AFEAD7] bg-[#E7FAEF] text-[#18806A]",
    button: "border-[#138C73] bg-[#21B393] hover:bg-[#159D82] focus-visible:ring-[#70D8BB]",
    detail: "text-[#258C7E]",
    sparkle: "#FAE481",
  },
  traveller: {
    path: "BLOSSOM TRAIL",
    icon: Plane,
    sky: "from-[#B7E4FF] via-[#FFE1E3] to-[#FFE6CF]",
    hillBack: "bg-[#FFC1CF]",
    hillFront: "bg-[#F7AEB5]",
    iconTone: "text-[#BE785C]",
    rim: "border-[#F4D1C5]",
    tag: "border-[#F4D6CC] bg-[#FFF1E9] text-[#B16F5D]",
    button: "border-[#CF705D] bg-[#EC9278] hover:bg-[#DE816B] focus-visible:ring-[#FFC8B2]",
    detail: "text-[#C97C7A]",
    sparkle: "#FFF2B0",
  },
  business: {
    path: "HARBOUR PATH",
    icon: Store,
    sky: "from-[#B9E7FF] via-[#DCD9FD] to-[#EDE4FF]",
    hillBack: "bg-[#C5C0F4]",
    hillFront: "bg-[#A4B8E9]",
    iconTone: "text-[#806DBE]",
    rim: "border-[#DCD0F5]",
    tag: "border-[#DAD3F5] bg-[#F1EDFF] text-[#7861B6]",
    button: "border-[#755DB3] bg-[#927AD9] hover:bg-[#7C64CB] focus-visible:ring-[#C8B9F5]",
    detail: "text-[#9074CD]",
    sparkle: "#FFF1B5",
  },
} as const;

/**
 * Small original SVG props in the scenery, NOT a replacement for AvatarView.
 * Each prop is deliberately positioned at the edges so the actual avatar
 * remains the visual focus. No images, unlocking or game state involved.
 */
function RoleProps({ role }: { role: RoleId }) {
  if (role === "student") {
    return (
      <svg aria-hidden="true" viewBox="0 0 340 150" className="absolute inset-x-0 bottom-0 h-[140px] w-full" preserveAspectRatio="xMidYMax meet">
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
          <ellipse cx="56" cy="142" rx="42" ry="7" fill="#368F78" opacity=".13" />
          <rect x="18" y="111" width="76" height="19" rx="6" fill="#F4C76D" stroke="#C99548" />
          <path d="M28 119H84" stroke="#FFF6DB" strokeWidth="5" />
          <rect x="30" y="93" width="59" height="17" rx="5" fill="#8DC8F5" stroke="#5C9DCB" />
          <path d="M37 101H83" stroke="#F7FFFF" strokeWidth="4" />
          <rect x="24" y="74" width="62" height="17" rx="5" fill="#EE9F98" stroke="#C9767C" />
          <path d="M31 82H80" stroke="#FFF7F1" strokeWidth="4" />
          <path d="M269 120L303 84L317 99L283 133Z" fill="#FFE5B2" stroke="#D39B46" />
          <path d="M303 84L311 75L325 89L317 99Z" fill="#F6B3AA" stroke="#D17B77" />
          <path d="M269 120L283 133L264 138Z" fill="#F5DFB8" stroke="#D39B46" />
        </g>
      </svg>
    );
  }

  if (role === "traveller") {
    return (
      <svg aria-hidden="true" viewBox="0 0 340 150" className="absolute inset-x-0 bottom-0 h-[140px] w-full" preserveAspectRatio="xMidYMax meet">
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
          <ellipse cx="55" cy="144" rx="38" ry="6" fill="#B56D7B" opacity=".14" />
          <rect x="24" y="78" width="68" height="62" rx="13" fill="#F4AB75" stroke="#CF805F" />
          <rect x="42" y="66" width="31" height="21" rx="7" fill="none" stroke="#D37E61" strokeWidth="5" />
          <path d="M47 88V130M69 88V130" stroke="#FFD9BA" strokeWidth="4" />
          <circle cx="39" cy="141" r="5" fill="#7A7D9E" />
          <circle cx="78" cy="141" r="5" fill="#7A7D9E" />
          <path d="M265 111L311 97L322 128L276 142Z" fill="#FFFDF2" stroke="#D69D99" />
          <path d="M277 121L306 112" stroke="#F6A0AA" strokeWidth="5" />
          <path d="M281 132L303 125" stroke="#D6C7CD" strokeWidth="3" />
          <circle cx="296" cy="116" r="8" fill="#F9C96C" />
          <path d="M263 54c-9-10-19 2-10 10c8 7 14 0 15-5c7 8 18-1 11-10c-5-6-13-1-16 5Z" fill="#F9B7CB" />
        </g>
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 340 150" className="absolute inset-x-0 bottom-0 h-[140px] w-full" preserveAspectRatio="xMidYMax meet">
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        <ellipse cx="55" cy="142" rx="40" ry="7" fill="#7474AA" opacity=".13" />
        <path d="M21 95H91L85 137H27Z" fill="#FCDFAB" stroke="#CB9C68" />
        <path d="M38 98C38 74 74 74 74 98" fill="none" stroke="#CB9C68" strokeWidth="5" />
        <path d="M38 113L55 121L74 110" fill="none" stroke="#D19B65" strokeWidth="3" />
        <circle cx="56" cy="119" r="6" fill="#F2B665" />
        <ellipse cx="292" cy="137" rx="38" ry="7" fill="#686AAB" opacity=".12" />
        <ellipse cx="282" cy="123" rx="25" ry="9" fill="#F9D16B" stroke="#D5A044" />
        <rect x="257" y="111" width="50" height="12" fill="#F9D16B" stroke="#D5A044" />
        <ellipse cx="282" cy="110" rx="25" ry="9" fill="#FFE4A1" stroke="#D5A044" />
        <ellipse cx="293" cy="101" rx="23" ry="8" fill="#F9D16B" stroke="#D5A044" />
        <rect x="270" y="89" width="46" height="12" fill="#F9D16B" stroke="#D5A044" />
        <ellipse cx="293" cy="89" rx="23" ry="8" fill="#FFE4A1" stroke="#D5A044" />
      </g>
    </svg>
  );
}

function RoleStage({ role }: { role: (typeof ROLES)[number] }) {
  const scene = SCENES[role.id];
  const Icon = scene.icon;

  // Use the actual role avatar from roles.ts. Only choose suitable outfits
  // already present in avatar-art.tsx, without editing the role definition.
  const showcaseAvatar = {
    ...role.avatar,
    gender: "male" as const,
    outfit: role.id === "traveller" ? 5 : role.id === "business" ? 9 : role.avatar.outfit,
  };

  return (
    <div
      className={cn(
        "relative h-[245px] w-full overflow-hidden rounded-[25px] bg-gradient-to-b",
        "sm:h-[252px] lg:h-[238px] xl:h-[252px]",
        scene.sky,
      )}
    >
      {/* Light and clouds */}
      <span aria-hidden="true" className="absolute left-[34%] top-5 h-24 w-24 rounded-full bg-white/35 blur-3xl" />
      <span aria-hidden="true" className="absolute right-[-8px] top-5 h-24 w-24 rounded-full bg-white/30 blur-3xl" />
      <div aria-hidden="true" className="absolute left-[13%] top-[40px] h-5 w-20 rounded-full bg-white/65 shadow-[12px_-7px_0_1px_rgba(255,255,255,.52)]" />
      <div aria-hidden="true" className="absolute right-[12%] top-[58px] h-4 w-16 rounded-full bg-white/60 shadow-[8px_-6px_0_1px_rgba(255,255,255,.48)]" />

      {/* Background hills */}
      <div aria-hidden="true" className={cn("absolute -bottom-[65px] -left-[12%] h-[140px] w-[75%] rounded-[50%] opacity-75", scene.hillBack)} />
      <div aria-hidden="true" className={cn("absolute -bottom-[58px] -right-[12%] h-[130px] w-[76%] rounded-[50%] opacity-75", scene.hillFront)} />
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-9 bg-gradient-to-t from-white/20 to-transparent" />

      {/* Decoration behind avatar */}
      <Sparkles aria-hidden="true" className="absolute left-[29%] top-[93px] h-5 w-5 text-white/90" />
      <Sparkles aria-hidden="true" className="absolute right-[24%] top-[115px] h-4 w-4 text-[#FFF4BD]" />
      <span aria-hidden="true" className="absolute right-[12%] top-[30%] text-lg opacity-80">✦</span>
      <RoleProps role={role.id} />

      {/* The original chibi is fully visible instead of cut off. */}
      <div aria-hidden="true" className="absolute bottom-[12px] left-1/2 h-[30px] w-[150px] -translate-x-1/2 rounded-[50%] bg-[#295C66]/15 blur-[7px]" />
      <div className="absolute bottom-[12px] left-1/2 z-10 -translate-x-1/2 origin-bottom drop-shadow-[0_9px_8px_rgba(35,83,96,.13)] transition-transform duration-300 ease-out group-hover:scale-[1.055] group-hover:-translate-y-1">
        <AvatarView avatar={showcaseAvatar} size={190} decorative />
      </div>

      {/* Small icon badge + path identity */}
      <div className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/90 bg-white/80 shadow-sm backdrop-blur-sm">
        <Icon className={cn("h-5 w-5", scene.iconTone)} aria-hidden="true" />
      </div>
      <span className={cn("absolute right-3 top-3 z-20 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-extrabold tracking-wider shadow-sm backdrop-blur", scene.detail)}>
        {scene.path}
      </span>
    </div>
  );
}

function Characters() {
  const game = useGame();
  const navigate = useNavigate();

  function handleChooseRole(roleId: (typeof ROLES)[number]["id"]) {
    chooseRole(roleId);
    void navigate({ to: "/map" });
  }

  return (
    <Page showRole={false} fullWidth className="relative overflow-hidden">
      <section className="relative isolate w-full overflow-hidden pb-6 sm:pb-8">
        {/* Continue the same illustrated landscape used on the welcome page. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[485px] overflow-hidden">
          <img src={meadow} alt="" aria-hidden="true" className="h-full w-full object-cover object-[center_49%] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#EAF9FF]/30 via-[#EBFCFF]/75 to-[#EAF9F4]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-gradient-to-b from-transparent via-[#EAF9F4]/75 to-[#EAF9F4]" />

        <div className="relative mx-auto w-full max-w-[1500px] px-4 pt-6 sm:px-6 sm:pt-7 lg:px-8">
          <header className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#287C91] shadow-sm backdrop-blur-md sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#E7AF4A]" aria-hidden="true" />
              Your story starts here
              <Sparkles className="h-3.5 w-3.5 text-[#E7AF4A]" aria-hidden="true" />
            </span>
            <h1 className="mt-3 font-display text-[35px] font-extrabold leading-[1.1] tracking-tight text-[#193E64] sm:text-[43px] lg:text-[48px]">
              Who will you <span className="text-[#138D91]">be?</span>
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#41677B] sm:text-[15px]">
              Three little dreams, three big adventures. Choose the story you want to explore with Pip!
            </p>
          </header>

          <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {ROLES.map((role, index) => {
              const selected = game.role === role.id;
              const scene = SCENES[role.id];
              return (
                <article
                  key={role.id}
                  className={cn(
                    "group relative flex min-w-0 flex-col rounded-[32px] border-2 bg-white/95 p-[9px]",
                    "shadow-[0_16px_38px_rgba(34,94,105,.13)] backdrop-blur-md transition-all duration-300",
                    "hover:-translate-y-1.5 hover:shadow-[0_23px_45px_rgba(34,94,105,.20)]",
                    selected ? "border-[#15A9DD] ring-4 ring-[#4BC6EA]/20" : scene.rim,
                  )}
                >
                  {selected && (
                    <span className="absolute -right-2 -top-3 z-30 inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-[#149BDE] px-3 py-1.5 text-[11px] font-extrabold text-white shadow-[0_5px_16px_rgba(20,155,222,.25)]">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} /> Your chosen path
                    </span>
                  )}

                  <RoleStage role={role} />

                  <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide", scene.tag)}>
                        {role.emoji} {role.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BA3B4]">
                        Path {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-2.5 font-display text-[20px] font-extrabold leading-tight text-[#203E61] sm:text-[21px] xl:text-[22px]">
                      {role.title}
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-[#617487]">{role.story}</p>
                    <dl className="mt-3 rounded-[20px] border border-[#E5EDF3] bg-[#F6FBFF]/85 px-3 py-3">
                      <div className="grid grid-cols-[.85fr_1.4fr] gap-3">
                        <div className="min-w-0">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]"><Wallet className="h-3.5 w-3.5 text-[#42A8A0]" /> Budget</dt>
                          <dd className="mt-1 text-[13px] font-extrabold text-[#264A6A] sm:text-[14px]">{role.budget}</dd>
                        </div>
                        <div className="min-w-0 border-l border-[#E1EAF1] pl-3">
                          <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]"><Compass className="h-3.5 w-3.5 text-[#F1AB64]" /> Your mission</dt>
                          <dd className="mt-1 text-[12px] font-semibold leading-[1.4] text-[#385977]">{role.goal}</dd>
                        </div>
                      </div>
                      <div className="mt-2.5 border-t border-[#E1EAF1] pt-2.5">
                        <dt className="flex items-center gap-1.5 text-[11px] font-bold text-[#738BA1]"><BookOpen className="h-3.5 w-3.5 text-[#9D88DA]" /> You'll discover</dt>
                        <dd className="mt-1 text-[12px] font-semibold text-[#385977]">{role.concepts}</dd>
                      </div>
                    </dl>
                    <div className="my-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#718A99]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#65BBA3]" /> {role.difficulty} adventure · Hypothetical story
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChooseRole(role.id)}
                      aria-label={`${selected ? "Continue" : "Start"} ${role.name} adventure`}
                      className={cn(
                        "mt-auto flex min-h-11 w-full items-center justify-center gap-2 rounded-[16px] border-b-[4px] px-4 py-2.5",
                        "text-[13px] font-extrabold text-white shadow-sm transition-all duration-200",
                        "hover:-translate-y-0.5 active:translate-y-[2px] active:border-b-2 focus-visible:outline-none focus-visible:ring-4",
                        selected ? "border-[#0776AE] bg-[#079FE8] hover:bg-[#008ED2] focus-visible:ring-[#9DDFFB]" : scene.button,
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

          <div className="mt-5 flex flex-col gap-3 rounded-[26px] border border-white/90 bg-white/75 p-3 shadow-[0_8px_28px_rgba(39,104,126,.10)] backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="min-w-0 flex-1">
              <Pip size={66}>
                Every adventure is yours to explore! Changing roles keeps the badges and coins you’ve earned. ✨
              </Pip>
            </div>
            <Button asChild variant="bubble" className="min-h-11 w-full shrink-0 gap-2 rounded-full px-5 font-extrabold sm:w-auto">
              <Link to="/avatar">Personalise my explorer <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Page>
  );
}
