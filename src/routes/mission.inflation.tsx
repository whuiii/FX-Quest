import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Page, Panel, Pip, CompletionCelebration, RateSlider, EconomicEventCard, Stat, RevealFinance, Formula } from "@/components/quest-ui";
import { pppRate, pct, fmtRM } from "@/lib/finance";
import { useGame, award } from "@/lib/game-store";

export const Route = createFileRoute("/mission/inflation")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Inflation Island: The Mystery of Rising Prices — FX Quest" },
      { name: "description", content: "Help a village understand rising prices and see the PPP-implied exchange rate move." },
      { property: "og:title", content: "Inflation Island — FX Quest" },
      { property: "og:description", content: "Why do prices rise, and what does it do to the ringgit?" },
    ],
  }),
  component: Inflation,
});

function Inflation() {
  const g = useGame();
  const [piM, setPiM] = useState(2);
  const [piU, setPiU] = useState(4);
  const [guess, setGuess] = useState<"up" | "down" | null>(null);
  const s = pppRate(4.5, pct(piM), pct(piU));
  const truth = s > 4.5 ? "up" : "down";
  const done = g.completed.includes("inflation");

  return (
    <Page className="max-w-4xl">
      <h1 className="text-3xl font-bold md:text-4xl">🌴 Inflation Island — The Mystery of Rising Prices</h1>
      <div className="mt-6 space-y-5">
        <EconomicEventCard emoji="🥭" title="Market whispers">Mak Cik Rosnah: "My mango costs RM 5.10 this year instead of RM 5.00!" Meanwhile a US visitor says American prices rose even faster.</EconomicEventCard>
        <Panel className="space-y-4">
          <RateSlider id="pm" label="Malaysia inflation" value={piM} onChange={setPiM} min={0} max={10} step={0.5} unit="%" />
          <RateSlider id="pu" label="US inflation" value={piU} onChange={setPiU} min={0} max={10} step={0.5} unit="%" />
          <p className="font-semibold">Puzzle: Under relative PPP, will MYR/USD (now 4.50) go up or down?</p>
          <div className="flex flex-wrap gap-3">
            <Button variant={guess === "up" ? "quest" : "bubble"} onClick={() => setGuess("up")}>⬆️ Up (ringgit weakens)</Button>
            <Button variant={guess === "down" ? "quest" : "bubble"} onClick={() => setGuess("down")}>⬇️ Down (ringgit strengthens)</Button>
          </div>
          {guess && (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Stat label="PPP-implied rate" value={s.toFixed(4)} sub="MYR/USD (theory)" />
                <Stat label="USD 10,000 bill at 4.50" value={fmtRM(45000)} />
                <Stat label="USD 10,000 at PPP rate" value={fmtRM(10000 * s)} tone={s < 4.5 ? "good" : "bad"} />
              </div>
              <Pip mood={guess === truth || s === 4.5 ? "celebrating" : "thinking"}>
                {s === 4.5 ? "Equal inflation — PPP implies no change!" : guess === truth ? "Spot on! The country with higher inflation sees its currency lose value." : "Close! Remember: the currency with higher inflation tends to weaken."}
              </Pip>
            </>
          )}
          <RevealFinance>
            <Formula>S_PPP = 4.50 × (1 + {piM}%) / (1 + {piU}%) = {s.toFixed(5)}</Formula>
            <p>Relative PPP is a long-run benchmark, not a forecast. Real exchange rates often deviate for years.</p>
          </RevealFinance>
          {guess && (done
            ? <Button asChild variant="quest"><Link to="/map">Back to map (cleared ✓)</Link></Button>
            : <Button variant="quest" onClick={() => award({ xp: guess === truth ? 30 : 15, coins: 15, badge: "inflation-survivor", complete: "inflation" })}>Complete chapter</Button>)}
        </Panel>
      </div>
      {done && <div className="mt-5"><CompletionCelebration /></div>}
    </Page>
  );
}
