
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import { Check, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Page, Pip, AvatarView } from "@/components/quest-ui";
import { useGame, chooseRole } from "@/lib/game-store";
import { ROLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// FX QUEST - CHARACTER SELECTION
// ----------------------------------------------------
// Responsive role-selection page.
//
// Preserves:
// - Original Lovable role designs and colors
// - Student, Traveller and Business Owner
// - Original avatar illustrations
// - Game progress and role selection
// - Navigation to the Adventure Map
// ----------------------------------------------------

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "Choose your adventure — FX Quest" },
      {
        name: "description",
        content:
          "Choose a student, traveller or shop owner and embark on your own financial adventure.",
      },
      {
        property: "og:title",
        content: "Choose your adventure — FX Quest",
      },
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

// ----------------------------------------------------
// MAIN CHARACTER SELECTION PAGE
// ----------------------------------------------------

function Characters() {
  const g = useGame();
  const nav = useNavigate();

  // Preserve the original role-selection functionality.
  const handleChooseRole = (roleId: (typeof ROLES)[number]["id"]) => {
    chooseRole(roleId);
    nav({ to: "/map" });
  };

  return (
    <Page showRole={false} className="pt-5 sm:pt-6 lg:!pt-3 lg:!pb-4">
      {/* ==========================================
          PAGE HEADING
      ========================================== */}

      <div className="mx-auto max-w-2xl px-2 text-center">
        <p className="text-sm font-bold text-primary">
          Your story starts here
        </p>

        <h1 className="mt-1 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[36px]">
          Who will you be?
        </h1>

        <p className="mt-3 text-sm text-muted-foreground sm:text-base lg:mt-1">
          Three dreams. One curious little companion.
        </p>
      </div>

      {/* ==========================================
          RESPONSIVE ROLE CARDS
      ========================================== */}

      <div
       className="
  mt-7
  grid
  grid-cols-1
  items-stretch
  gap-5
  sm:grid-cols-2
  lg:mt-3
  lg:grid-cols-3
  lg:gap-4
"
      >
        {ROLES.map((r) => {
          const isSelected = g.role === r.id;

          return (
            <article
              key={r.id}
              className={cn(
                r.tone,
                "relative flex h-full min-w-0 flex-col",
                "rounded-3xl border-2",
                "p-5 sm:p-6 lg:p-4",
                "shadow-soft",
                "transition-transform duration-300",
                "hover:-translate-y-1",
                isSelected
                  ? "border-primary ring-4 ring-primary/15"
                  : "border-transparent"
              )}
            >
              {/* Selected role indicator */}
              {isSelected && (
                <span
                  className="
                    absolute
                    right-4
                    top-4
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-card/80
                    px-2
                    py-1
                    text-xs
                    font-bold
                    text-primary
                  "
                >
                  <Check className="h-4 w-4" />
                  Selected
                </span>
              )}

              {/* Character avatar */}

{/* Responsive character avatar */}
<div className="mx-auto mt-4 flex w-full items-center justify-center animate-float lg:mt-1">
  {/* Original avatar on mobile and tablet */}
  <div className="lg:hidden">
    <AvatarView avatar={r.avatar} size={128} />
  </div>

  {/* Compact avatar on desktop */}
  <div className="hidden lg:block">
    <AvatarView avatar={r.avatar} size={80} />
  </div>
</div>


              {/* Role category */}
              <p
                className="
                  mt-3
                  lg:mt-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                "
              >
                {r.emoji} {r.name}
              </p>

              {/* Role title */}
              <h2
                className="
                  mt-1
                  font-display
                  text-xl
                  font-semibold
                  leading-snug
                  sm:text-2xl 
                  lg:text-xl
                "
              >
                {r.title}
              </h2>

              {/* Character story */}
              <p className="mt-2 text-sm leading-relaxed lg:mt-1">
                {r.story}
              </p>

              {/* Financial learning information */}
              <dl className="my-4 space-y-3 text-sm lg:my-2 lg:space-y-1">
                <div>
                  <dt className="font-bold">
                    Starting budget
                  </dt>

                  <dd className="mt-0.5 break-words">
                    {r.budget}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold">
                    Your goal
                  </dt>

                  <dd className="mt-0.5 break-words">
                    {r.goal}
                  </dd>
                </div>

                <div>
                  <dt className="font-bold">
                    Discover
                  </dt>

                  <dd className="mt-0.5 break-words">
                    {r.concepts}
                  </dd>
                </div>
              </dl>

              {/* Difficulty information */}
              <p className="mb-4 text-xs font-bold lg:mb-2">
                {r.difficulty} · Hypothetical story
              </p>

              {/* Role selection button */}
              <Button
                variant={isSelected ? "quest" : "bubble"}
                className="
  mt-auto
  min-h-11
  w-full
  gap-2
  lg:h-10
  lg:min-h-10
  lg:py-1
"
                onClick={() => handleChooseRole(r.id)}
              >
                {isSelected
                  ? "Continue Adventure"
                  : "Choose Role"}

                <ArrowRight className="h-4 w-4" />
              </Button>
            </article>
          );
        })}
      </div>

      {/* ==========================================
          PIP COMPANION + AVATAR CUSTOMIZATION
      ========================================== */}

      <div
        className="
          mt-8
          flex
          flex-col
          items-stretch
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Pip companion message */}
        <div className="min-w-0 flex-1">
          <Pip size={80}>
            Your dream, your adventure! Changing roles keeps
            every badge and coin you’ve earned.
          </Pip>
        </div>

        {/* Avatar customization navigation */}
        <Button
          asChild
          variant="bubble"
          className="
            min-h-11
            w-full
            sm:w-auto
            lg:shrink-0
          "
        >
          <Link to="/avatar">
            Personalise my explorer
          </Link>
        </Button>
      </div>
    </Page>
  );
}
