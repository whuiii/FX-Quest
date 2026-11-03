export type RoleId = "student" | "traveller" | "business";

export const ROLES = [
  { id: "student", name: "International Student", emoji: "🎓", title: "Save your study abroad dream", story: "Your university place is waiting. Help your family’s savings cross the ocean with you.", budget: "RM 50,000", goal: "Pay USD 10,000 tuition in one year", concepts: "FX direction · interest · PPP", difficulty: "Beginner", tone: "bg-mint", mapName: "Campus Crossing", mission: "currency", avatar: { name: "Aisyah", skin: 1, hair: 4, outfit: 0, accessory: 2 } },
  { id: "traveller", name: "Global Traveller", emoji: "🧳", title: "Protect your holiday dream", story: "Cherry blossoms, little cafés and a suitcase full of memories. Make your Japan budget go further.", budget: "RM 10,000", goal: "Fund a JPY 300,000 holiday in one year", concepts: "JPY quotes · inflation · FX budgets", difficulty: "Beginner", tone: "bg-peach", mapName: "Cherry Blossom Trail", mission: "traveller", avatar: { name: "Kai", skin: 2, hair: 2, outfit: 1, accessory: 1 } },
  { id: "business", name: "Business Owner", emoji: "📦", title: "Keep your little shop thriving", story: "Your first overseas shipment is on its way. Protect the supplier payment and keep your shop’s promise.", budget: "RM 100,000", goal: "Pay a USD 20,000 supplier invoice in three months", concepts: "Covered IRP · hedging · cash flow", difficulty: "Intermediate", tone: "bg-lavender", mapName: "Little Shop Harbour", mission: "harbor", avatar: { name: "Amir", skin: 3, hair: 1, outfit: 3, accessory: 1 } },
] as const;

export function roleInfo(id: RoleId | null | undefined) { return ROLES.find((r) => r.id === id); }

export function mapChapters<T extends { id: string; requires: string | null }>(chapters: readonly T[], role: RoleId) {
  const main = roleInfo(role)?.mission;
  return [...chapters].sort((a, b) => Number(b.id === main) - Number(a.id === main));
}

export function chapterUnlocked(chapter: { id: string; requires: string | null }, completed: string[], role: RoleId) {
  return chapter.id === roleInfo(role)?.mission || !chapter.requires || completed.includes(chapter.requires);
}