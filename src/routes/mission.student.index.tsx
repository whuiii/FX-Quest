import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Page, Panel, Pip, MissionProgress, EconomicEventCard, AvatarView, Stat } from "@/components/quest-ui";
import { useGame } from "@/lib/game-store";



export const Route = createFileRoute("/mission/student/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Currency City: The Tuition Deadline — FX Quest" },
      { name: "description", content: "A Malaysian student must pay USD 10,000 tuition in one year. Convert now or save in ringgit?" },
      { property: "og:title", content: "The Tuition Deadline — FX Quest" },
      { property: "og:description", content: "Convert today or save in MYR? Face the exchange rate and find out." },
    ],
  }),
  component: Briefing,
});


function Briefing() {
  const g = useGame();

  return (
    <Page wide>
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Mission progress — unchanged */}
        <MissionProgress
          steps={["Briefing", "Decide", "Quiz", "Results"]}
          current={0}
        />

        {/* Page title */}
        <div className="mb-5 mt-5 lg:mb-7">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            ✨ Mission 01 · International Student
          </p>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl lg:text-[42px]">
            🏙️ Currency City — The Tuition Deadline
          </h1>
          <p className="mt-2 text-sm text-muted-foreground lg:text-base">
            Your adventure begins with an important financial decision.
          </p>
        </div>

        {/*
          Desktop: balanced 55% / 45% layout.
          Mobile: keep the original stacked arrangement.
        */}
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">

          {/* LEFT: Mission briefing */}
          <Panel className="flex min-w-0 flex-col gap-5 p-5 sm:p-6 lg:p-7">
            <div className="flex items-center gap-4">
              {g.avatar && (
                <div className="shrink-0 rounded-full border-4 border-white bg-sky-100 p-1 shadow-md">
                  <AvatarView avatar={g.avatar} size={72} />
                </div>
              )}

              <div className="min-w-0">
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  📜 Your Mission Briefing
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                  You're <b>{g.avatar?.name ?? "a Malaysian student"}</b>,
                  heading to a US university. Your tuition of{" "}
                  <b>USD 10,000</b> is due in <b>exactly 1 year</b>.
                  Your family has saved <b>RM 50,000</b>.
                </p>
              </div>
            </div>

            {/* Financial information */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Stat label="Budget" value="RM 50,000" />
              <Stat label="Tuition" value="USD 10,000" />
              <Stat
                label="Spot today S₀"
                value="4.50"
                sub="MYR per USD"
              />
              <Stat label="MYR deposit" value="3% / yr" />
            </div>

            {/* Existing fictional economic news */}
            <div className="mt-auto">
              <EconomicEventCard
                emoji="📰"
                title="Currency City Gazette"
              >
                "Analysts split on the ringgit: some expect US
                inflation to weaken the dollar, others warn the
                dollar could stay strong."{" "}
                <i>(Fictional news for this simulation.)</i>
              </EconomicEventCard>
            </div>
          </Panel>

          {/* RIGHT: Financial strategy and Pip */}
          <div className="flex min-w-0 flex-col gap-4">
            <Panel className="flex flex-1 flex-col gap-4 p-5 sm:p-6 lg:p-7">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Your Decision
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold">
                  🧭 Choose Your Financial Path
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Two strategies. One tuition deadline.
                </p>
              </div>

              {/* Strategy A */}
              <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💵</span>
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      Path A · Convert Today
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                      Spend <b>RM 45,000</b> now for{" "}
                      <b>USD 10,000</b>. Keep{" "}
                      <b>RM 5,000</b> as cash.
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategy B */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🏦</span>
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      Path B · Save in MYR
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                      Keep <b>RM 50,000</b> in a deposit for
                      one year, then buy USD at the future
                      exchange rate.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pip's original exchange-rate explanation */}
              <div className="mt-auto">
                <Pip mood="thinking">
                  <b>Quote tip:</b> "4.50 MYR/USD" means{" "}
                  <b>1 US dollar costs RM 4.50</b>.
                  If it rises to 4.70, the dollar got pricier
                  (ringgit weakened). If it falls to 4.30,
                  the ringgit strengthened.
                </Pip>
              </div>
            </Panel>

            {/* Desktop: CTA aligned with the strategy panel */}
            <Button
              asChild
              variant="quest"
              size="lg"
              className="w-full min-h-14 rounded-2xl text-base font-extrabold shadow-md transition-transform hover:-translate-y-0.5"
            >
              <Link to="/mission/student/play">
                Begin Simulation →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
}
