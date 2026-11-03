import { useSyncExternalStore } from "react";
import type { RoleId } from "./roles";

// Optional gender keeps old localStorage saves and role presets compatible.
// Every newly saved avatar records "male" or "female" explicitly.
export type AvatarGender = "male" | "female";
export type Avatar = {
  name: string;
  gender?: AvatarGender;
  skin: number;
  hair: number;
  outfit: number;
  accessory: number;
};
export type QuizAnswers = Record<string, number>; // questionId -> points earned (20 first try, 10 after retry)

export type GameState = {
  role: RoleId | null;
  avatar: Avatar | null;
  xp: number;
  coins: number;
  badges: string[];
  completed: string[]; // chapter ids
  unlockedCosmetics: string[];
  quiz: { answers: QuizAnswers; justification?: "A" | "B" | null } | null;
  lastMission: { st: number; iMYR: number; choice: "A" | "B" } | null;
};

const KEY = "fxquest-v1";
const initial: GameState = {
  role: null, avatar: null, xp: 0, coins: 0, badges: [], completed: [], unlockedCosmetics: [], quiz: null, lastMission: null,
};

let state: GameState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = restoreGame(JSON.parse(raw));
  } catch { /* ignore */ }
}

export function getState() { load(); return state; }

export function setState(fn: (s: GameState) => GameState) {
  load();
  state = fn(state);
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export function resetGame() { setState(() => initial); }

export function restoreGame(saved: Partial<GameState>): GameState {
  return { ...initial, ...saved, role: saved.role ?? (saved.avatar || saved.completed?.length ? "student" : null) };
}

export function chooseRole(role: RoleId) { setState((s) => ({ ...s, role })); }

export function useGame() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    getState,
    () => initial,
  );
}

export const level = (xp: number) => Math.floor(xp / 100) + 1;

export function applyAward(s: GameState, opts: { xp?: number; coins?: number; badge?: string; complete?: string }): GameState {
  const already = opts.complete && s.completed.includes(opts.complete);
  return {
    ...s,
    xp: s.xp + (already ? 0 : opts.xp ?? 0),
    coins: s.coins + (already ? 0 : opts.coins ?? 0),
    badges: opts.badge && !s.badges.includes(opts.badge) ? [...s.badges, opts.badge] : s.badges,
    completed: opts.complete && !s.completed.includes(opts.complete) ? [...s.completed, opts.complete] : s.completed,
    unlockedCosmetics: opts.complete && !s.unlockedCosmetics.includes("Star clip") ? [...s.unlockedCosmetics, "Star clip"] : s.unlockedCosmetics,
  };
}

export function award(opts: { xp?: number; coins?: number; badge?: string; complete?: string }) {
  setState((s) => applyAward(s, opts));
}

export const CHAPTERS = [
  { id: "inflation", name: "Inflation Island", to: "/mission/inflation", concept: "Inflation & relative PPP", requires: null },
  { id: "interest", name: "Interest Mountain", to: "/mission/interest", concept: "Nominal vs real (Fisher)", requires: "inflation" },
  { id: "currency", name: "Currency City", to: "/mission/student", concept: "FX direction & sensitivity", requires: null },
  { id: "harbor", name: "Trade Harbor", to: "/mission/harbor", concept: "Covered IRP & hedging", requires: "currency" },
  { id: "traveller", name: "Cherry Blossom Getaway", to: "/mission/traveller", concept: "JPY quotes & holiday budget", requires: null },
] as const;

export const BADGES = [
  { id: "inflation-survivor", name: "Inflation Survivor", desc: "Finish Inflation Island", emoji: "🌴" },
  { id: "interest-expert", name: "Interest Rate Expert", desc: "Finish Interest Mountain", emoji: "⛰️" },
  { id: "currency-strategist", name: "Currency Strategist", desc: "Finish the Tuition Deadline mission", emoji: "🏙️" },
  { id: "holiday-explorer", name: "Holiday Explorer", desc: "Compare Japan holiday budgets", emoji: "🌸" },
  { id: "global-master", name: "Global Finance Master", desc: "Score 80+ on the Currency City quiz and clear all 4 worlds", emoji: "👑" },
] as const;
