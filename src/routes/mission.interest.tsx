import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Page, Panel, Pip, CompletionCelebration, RateSlider, Stat, RevealFinance, Formula } from "@/components/quest-ui";
import { fisherReal, pct, fmtRM, fmtPct } from "@/lib/finance";
import { useGame, award } from "@/lib/game-store";

export const Route = createFileRoute("/mission/interest")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Interest Mountain: The Savings Race — FX Quest" },
      { name: "description", content: "Grow a RM 50,000 budget and discover nominal vs real returns with the Fisher relation." },
      { property: "og:title", content: "Interest Mountain — FX Quest" },
      { property: "og:description", content: "Is your money really growing? Meet the real interest rate." },
    ],
  }),
  component: Interest,
});

function Interest() {
  const g = useGame();
  const [i, setI] = useState(3);
  const [pi, setPi] = useState(2);
  const [answered, setAnswered] = useState(false);
  const r = fisherReal(pct(i), pct(pi));
  const grown = 50000 * (1 + pct(i));
  const done = g.completed.includes("interest");

  return (
    <Page className="max-w-4xl">
      <h1 className="text-3xl font-bold md:text-4xl">⛰️ Interest Mountain — The Savings Race</h1>
      <Panel className="mt-6 space-y-4">
        <p>Your RM 50,000 climbs the mountain in a deposit for one year. But prices climb too!</p>
        <RateSlider id="i" label="Nominal MYR interest" value={i} onChange={setI} min={0} max={10} step={0.5} unit="%" />
        <RateSlider id="pi" label="Malaysia inflation" value={pi} onChange={setPi} min={0} max={10} step={0.5} unit="%" />
        <div className="flex items-center gap-2 text-3xl" aria-hidden>{Array.from({ length: Math.max(1, Math.round(i)) }).map((_, k) => <span key={k} className="animate-coin" style={{ animationDelay: `${k * 0.1}s` }}>🪙</span>)}</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Balance after 1 year" value={fmtRM(grown)} />
          <Stat label="Interest earned" value={fmtRM(grown - 50000)} />
          <Stat label="Exact real return" value={fmtPct(r, 4)} tone={r >= 0 ? "good" : "bad"} />
        </div>
        {!answered ? (
          <Button variant="sunny" onClick={() => setAnswered(true)}>Is my purchasing power growing?</Button>
        ) : (
          <Pip mood={r >= 0 ? "celebrating" : "concerned"}>{r >= 0 ? `Yes — after inflation your money buys about ${fmtPct(r, 2)} more.` : `No — prices outrun your interest, so you can buy about ${fmtPct(-r, 2)} less.`}</Pip>
        )}
        <RevealFinance>
          <Formula>r = (1 + {i}%) / (1 + {pi}%) − 1 = {fmtPct(r, 4)}</Formula>
          <p>The shortcut r ≈ i − π gives {(i - pi).toFixed(2)}%; the exact Fisher formula is slightly different. Inflation expectations can be wrong.</p>
        </RevealFinance>
        {answered && (done
          ? <Button asChild variant="quest"><Link to="/map">Back to map (cleared ✓)</Link></Button>
          : <Button variant="quest" onClick={() => award({ xp: 30, coins: 15, badge: "interest-expert", complete: "interest" })}>Complete chapter</Button>)}
      </Panel>
      {done && <div className="mt-5"><CompletionCelebration /></div>}
    </Page>
  );
}
