// Deterministic finance functions for FX Quest. All rates are decimals (2% = 0.02).
// Quote convention: USD/MYR expressed as MYR per 1 USD. Round only for display.

export const STUDENT = {
  budgetMYR: 50000,
  tuitionUSD: 10000,
  spot0: 4.5,
} as const;

export const pct = (p: number) => p / 100;

/** Relative PPP: S_PPP = S0 * (1 + piMYR) / (1 + piUSD) */
export function pppRate(s0: number, piMYR: number, piUSD: number) {
  return (s0 * (1 + piMYR)) / (1 + piUSD);
}

/** Covered IRP forward: F = S0 * (1 + iMYR) / (1 + iUSD), rates matched to horizon */
export function irpForward(s0: number, iMYR: number, iUSD: number) {
  return (s0 * (1 + iMYR)) / (1 + iUSD);
}

/** Exact Fisher real rate: r = (1+i)/(1+pi) - 1 */
export function fisherReal(i: number, pi: number) {
  return (1 + i) / (1 + pi) - 1;
}

/** Convert an annual rate to an effective rate over `months` (compound). */
export function periodRate(annual: number, months: number) {
  return Math.pow(1 + annual, months / 12) - 1;
}

/** Strategy A: convert tuition today, keep leftover MYR (no interest). Not affected by ST. */
export function strategyA(budget = STUDENT.budgetMYR, tuitionUSD = STUDENT.tuitionUSD, s0 = STUDENT.spot0) {
  const costToday = tuitionUSD * s0;
  return { costMYR: costToday, interest: 0, remaining: budget - costToday };
}

/** Strategy B: save MYR at iMYR for 1 year, then buy USD at ST. */
export function strategyB(st: number, iMYR: number, budget = STUDENT.budgetMYR, tuitionUSD = STUDENT.tuitionUSD) {
  const grown = budget * (1 + iMYR);
  const costMYR = tuitionUSD * st;
  return { grown, costMYR, interest: grown - budget, remaining: grown - costMYR };
}

/** ST at which A and B leave the same MYR remaining. */
export function breakEvenSpot(iMYR: number, budget = STUDENT.budgetMYR, tuitionUSD = STUDENT.tuitionUSD, s0 = STUDENT.spot0) {
  const remA = budget - tuitionUSD * s0;
  return (budget * (1 + iMYR) - remA) / tuitionUSD;
}

export function compareStrategies(st: number, iMYR: number) {
  const a = strategyA();
  const b = strategyB(st, iMYR);
  const diff = b.remaining - a.remaining; // positive => B better
  return { a, b, diff, better: Math.abs(diff) < 1e-9 ? "tie" : diff > 0 ? "B" : "A" } as const;
}

/** Importer: USD payable in `months`, hedged with IRP forward vs unhedged at future spot. */
export function importerHedge(opts: { usd: number; s0: number; iMYRAnnual: number; iUSDAnnual: number; months: number; futureSpot: number }) {
  const iM = periodRate(opts.iMYRAnnual, opts.months);
  const iU = periodRate(opts.iUSDAnnual, opts.months);
  const forward = irpForward(opts.s0, iM, iU);
  const hedgedMYR = opts.usd * forward;
  const unhedgedMYR = opts.usd * opts.futureSpot;
  return { iM, iU, forward, hedgedMYR, unhedgedMYR, saving: unhedgedMYR - hedgedMYR };
}

export const fmtRM = (n: number) =>
  `${n < 0 ? "−" : ""}RM ${Math.abs(n).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtUSD = (n: number) =>
  `USD ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtRate = (n: number, dp = 4) => `${n.toFixed(dp)} MYR/USD`;
export const fmtPct = (d: number, dp = 2) => `${(d * 100).toFixed(dp)}%`;
