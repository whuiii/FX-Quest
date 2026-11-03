export type Question = { id: string; category: string; q: string; options: string[]; answer: number; explain: string };

// Each question is worth 20 points of the 0–100 learning score (10 if correct after a retry).
export const STUDENT_QUIZ: Question[] = [
  {
    id: "inflation", category: "Inflation interpretation",
    q: "Malaysia inflation is 2% and US inflation is 4%. Under relative PPP, what happens to the MYR/USD rate (from 4.50)?",
    options: ["It rises above 4.50 (ringgit weakens)", "It falls below 4.50 (ringgit strengthens)", "It stays exactly 4.50"],
    answer: 1, explain: "S_PPP = 4.50 × 1.02 / 1.04 ≈ 4.4135. Higher US inflation means the dollar loses purchasing power faster, so fewer ringgit per dollar.",
  },
  {
    id: "interest", category: "Interest interpretation",
    q: "Your MYR deposit pays 3% and Malaysian inflation is 2%. What is the exact real return?",
    options: ["About 0.98%", "Exactly 5%", "Exactly 1.5%"],
    answer: 0, explain: "Fisher: (1.03 / 1.02) − 1 ≈ 0.9804%. Your money grows a bit faster than prices.",
  },
  {
    id: "fx", category: "FX direction & calculation",
    q: "With 3% interest, if Sₜ ends at 4.30 MYR/USD, how much is left under path B (save in MYR)?",
    options: ["RM 4,500", "RM 8,500", "RM 5,000"],
    answer: 1, explain: "50,000 × 1.03 − 10,000 × 4.30 = 51,500 − 43,000 = RM 8,500.",
  },
  {
    id: "decision", category: "Decision justification",
    q: "Break-even is 4.65 MYR/USD. When does converting today (path A) make more sense?",
    options: ["If you expect Sₜ above 4.65 or want certainty", "If you expect Sₜ below 4.65", "Never — saving always wins because of interest"],
    answer: 0, explain: "A locks in RM 5,000 no matter what. It wins if the dollar ends above 4.65, and it removes FX risk for a fixed bill.",
  },
  {
    id: "limits", category: "Limitations & risk",
    q: "The covered-IRP forward rate is 4.41 MYR/USD. What does that tell you?",
    options: ["The spot rate will be 4.41 in a year", "It's a rate you could lock in today — not a guaranteed future spot", "The ringgit is guaranteed to strengthen"],
    answer: 1, explain: "Forward and PPP rates are model benchmarks. The actual future spot can differ a lot — that's FX risk.",
  },
];

export function learningScore(answers: Record<string, number>) {
  return STUDENT_QUIZ.reduce((t, q) => t + (answers[q.id] ?? 0), 0);
}
