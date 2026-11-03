// Hypothetical JPY quote: MYR per 100 JPY; no spreads, taxes or interest.
export const TRAVEL = { budget: 10000, yen: 300000, spot0: 3, inflationJapan: 0.02 } as const;

export function holidayBudget(spot: number, inflation: number = TRAVEL.inflationJapan) {
  const futureYen = TRAVEL.yen * (1 + inflation);
  const convertNow = TRAVEL.yen / 100 * TRAVEL.spot0;
  const topUp = (futureYen - TRAVEL.yen) / 100 * spot;
  const wait = futureYen / 100 * spot;
  return { futureYen, convertNow, topUp, nowTotal: convertNow + topUp, wait, remainingNow: TRAVEL.budget - convertNow - topUp, remainingWait: TRAVEL.budget - wait };
}