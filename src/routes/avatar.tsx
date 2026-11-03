import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Coins, Crown, Dices, Lock, Scissors, Shirt, Smile, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Page, Pip } from "@/components/quest-ui";
import {
  AvatarView,
  SKINS,
  HAIRS,
  OUTFITS,
  ACCESSORIES,
  DEFAULT_AVATARS,
  resolveAvatarGender,
  outfitAvailableForGender,
  hairAvailableForGender,
  type AvatarGender,
} from "@/components/avatar-art";
import { useGame, setState, type Avatar } from "@/lib/game-store";
import { cn } from "@/lib/utils";

// Currently the wide header strip. When you have the new portrait stage artwork,
// import it here instead and set FULL_STAGE_ART to true.
import stageArt from "@/assets/fxquest-map-header-bg.png";
const FULL_STAGE_ART = false;

export const Route = createFileRoute("/avatar")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Create your explorer — FX Quest" },
      { name: "description", content: "Design your FX Quest avatar and meet Pip, your currency-explorer companion." },
      { property: "og:title", content: "Create your explorer — FX Quest" },
      { property: "og:description", content: "Pick skin tone, hair, outfit and accessories for your adventure." },
    ],
  }),
  component: AvatarPage,
});

// Default male explorer is shown before any personalization.
// Selecting Female loads its own preset; neither choice costs coins.
const DEFAULT: Avatar = { name: "", ...DEFAULT_AVATARS.male };

type TabId = "skin" | "hair" | "outfit" | "accessory";

const TABS: { id: TabId; label: string; icon: typeof Smile }[] = [
  { id: "skin", label: "Skin", icon: Smile },
  { id: "hair", label: "Hair", icon: Scissors },
  { id: "outfit", label: "Outfit", icon: Shirt },
  { id: "accessory", label: "Extras", icon: Crown },
];

// Which part of the avatar each thumbnail zooms into.
const HEAD_VIEW = "22 -4 156 156";
const OUTFIT_VIEW = "0 70 200 130";

function Option({
  label,
  selected,
  onClick,
  locked,
  disabled,
  className,
  children,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  locked?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2 border-2 font-bold text-[#373268] transition-all",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? "border-[#f0b93a] bg-white shadow-[0_4px_0_rgba(187,125,61,.25),0_0_0_4px_rgba(249,215,119,.45)]"
          : "border-[#efc478]/60 bg-[#fffaf0] hover:-translate-y-0.5 hover:border-[#efc478] hover:bg-white",
        className,
      )}
    >
      {children}
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2b6fd6] text-white shadow">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
        </span>
      )}
      {locked && (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-[#8a6bb0] shadow-sm">
          <Lock className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}

/* A tile that previews the option on the explorer's current look. */
function Tile({
  a,
  patch,
  viewBox,
  name,
  price,
  ...rest
}: {
  a: Avatar;
  patch: Partial<Avatar>;
  viewBox: string;
  name: string;
  price?: number;
  selected: boolean;
  onClick: () => void;
  locked?: boolean;
  disabled?: boolean;
}) {
  return (
    <Option label={name} className="flex-col gap-1.5 rounded-2xl p-2" {...rest}>
      <span className="flex h-[84px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#e3f9ff] to-[#bfeeff]">
        <AvatarView avatar={{ ...a, ...patch }} size={viewBox === OUTFIT_VIEW ? 110 : 84} viewBox={viewBox} decorative />
      </span>
      <span className="w-full truncate text-center text-xs leading-tight">{name}</span>
      {price ? (
        <span className="rounded-full bg-[#fff0c2] px-2 py-0.5 text-[11px] font-extrabold text-[#8a5a00]">{price} 🪙</span>
      ) : null}
    </Option>
  );
}

function AvatarPage() {
  const g = useGame();
  const nav = useNavigate();
  const [a, setA] = useState<Avatar>(DEFAULT);
  const [tab, setTab] = useState<TabId>("skin");

  useEffect(() => {
    if (g.avatar) {
      // Old saved characters did not include gender, so derive a display
      // preset without discarding the original purchased accessories.
      const savedGender = resolveAvatarGender(g.avatar);
      const preset = DEFAULT_AVATARS[savedGender];
      setA({
        ...preset,
        ...g.avatar,
        gender: savedGender,
        outfit: outfitAvailableForGender(g.avatar.outfit, savedGender)
          ? g.avatar.outfit
          : preset.outfit,
      });
    }
  }, [g.avatar]);

  const gender: AvatarGender = resolveAvatarGender(a);
  const visibleOutfits = OUTFITS
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.genders.includes(gender));
  const visibleHairs = HAIRS
  .map((item, index) => ({ ...item, index }))
  .filter((item) => item.genders.includes(gender));

  const up = (p: Partial<Avatar>) => setA((x) => ({ ...x, ...p }));

  const selectGender = (next: AvatarGender) => {
  setA((previous) => ({
    ...previous,
    gender: next,
    hair: DEFAULT_AVATARS[next].hair,
    outfit: DEFAULT_AVATARS[next].outfit,
  }));
};

  const useDefaultLook = () => {
    // Reset only the worn look; coins and unlocked items are untouched.
    setA((previous) => ({
      ...DEFAULT_AVATARS[gender],
      name: previous.name,
    }));
  };

  const isOwned = (i: number) => {
    const acc = ACCESSORIES[i];
    return !!acc && (acc.cost === 0 || g.unlockedCosmetics.includes(acc.name));
  };

  const buyOrPick = (i: number) => {
    const acc = ACCESSORIES[i];
    if (!acc) return;
    if (isOwned(i)) return up({ accessory: i });
    if (g.coins >= acc.cost) {
      setState((s) => ({ ...s, coins: s.coins - acc.cost, unlockedCosmetics: [...s.unlockedCosmetics, acc.name] }));
      up({ accessory: i });
    }
  };

  const shuffle = () => {
  const rnd = (n: number) => Math.floor(Math.random() * n);
  const owned = ACCESSORIES.map((_, i) => i).filter(isOwned);

  up({
    skin: rnd(SKINS.length),
    hair: visibleHairs[rnd(visibleHairs.length)]?.index ?? DEFAULT_AVATARS[gender].hair,
    outfit: visibleOutfits[rnd(visibleOutfits.length)]?.index ?? DEFAULT_AVATARS[gender].outfit,
    accessory: owned[rnd(owned.length)] ?? 0,
  });
};

 const save = () => {
  const outfit = outfitAvailableForGender(a.outfit, gender)
    ? a.outfit
    : DEFAULT_AVATARS[gender].outfit;

  const hair = hairAvailableForGender(a.hair, gender)
    ? a.hair
    : DEFAULT_AVATARS[gender].hair;

  setState((s) => ({
    ...s,
    avatar: { ...a, gender, hair, outfit, name: a.name.trim() || "Explorer" },
  }));

  nav({ to: g.role ? "/map" : "/characters" });
};

  return (
    <Page wide>
      <style>{`
        @keyframes fxq-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .fxq-bob { animation: fxq-bob 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fxq-bob { animation: none; } }
      `}</style>

      <div className="mx-auto w-full min-w-0">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#24245e] md:text-4xl">Create your explorer</h1>
            <p className="mt-1 text-sm font-semibold text-[#624c88] md:text-base">
              Pick your look, then set off across the four islands.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#efc478] bg-[#fff5dc] px-4 py-2 font-display text-sm font-extrabold text-[#52317b] shadow-[0_3px_0_rgba(187,125,61,.2)]"
            aria-label={`${g.coins} quest coins`}
          >
            <Coins className="h-5 w-5 text-[#f0a81f]" aria-hidden="true" />
            {g.coins} coins
          </div>
        </div>

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(320px,0.36fr)_minmax(0,0.64fr)] lg:gap-8 xl:gap-9">
          {/* ================= PREVIEW STAGE ================= */}
          <section
            aria-label="Your explorer preview"
            className="relative isolate min-w-0 overflow-hidden rounded-[32px] border-[3px] border-[#f9d777] bg-gradient-to-b from-[#8fe3f8] via-[#4fc6f2] to-[#2a9be4] shadow-[0_12px_30px_rgba(33,105,161,0.22)] lg:sticky lg:top-6"
          >
            <img
              src={stageArt}
              alt=""
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 -z-10 w-full object-cover",
                FULL_STAGE_ART
                  ? "h-full object-center"
                  : "h-44 object-[60%_40%] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]",
              )}
            />

            <div className="flex flex-col items-center px-5 pb-5 pt-14 text-center">
              <div className="relative">
                <Sparkles className="absolute -left-5 top-4 h-6 w-6 text-amber-300 drop-shadow" aria-hidden="true" />
                <Sparkles className="absolute -right-4 top-14 h-5 w-5 text-white drop-shadow" aria-hidden="true" />
                <div className="fxq-bob rounded-full border-[5px] border-[#f7d66d] bg-gradient-to-b from-[#e3f9ff] to-[#b8ecfb] p-2 shadow-[0_10px_24px_rgba(21,81,130,.3)]">
                  <div className="flex h-[236px] w-[236px] items-end justify-center overflow-hidden rounded-full">
                    <AvatarView avatar={a} size={236} />
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="mx-auto -mt-3 h-6 w-52 rounded-[50%] bg-gradient-to-b from-[#8fdc6e] to-[#4fae4b] shadow-[0_10px_0_-2px_#b98a55,0_16px_14px_rgba(10,60,110,.3)]"
                />
              </div>

              <div className="mt-6 max-w-full rounded-full border-2 border-[#e8bf62] bg-gradient-to-r from-[#fbd461] to-[#f6b93b] px-6 py-1.5 shadow-[0_4px_0_rgba(174,117,58,.3)]">
                <span className="block truncate font-display text-xl font-extrabold text-[#52317b]">
                  {a.name.trim() || "Explorer"}
                </span>
              </div>

              <div className="mt-4 w-full rounded-[22px] border-2 border-[#efc478] bg-[#fff5dc]/95 px-3 py-3 text-left shadow-[0_5px_0_rgba(187,125,61,.17)]">
                <Pip mood="excited" size={64}>
                  Looking great! I'll travel with you across all four islands.
                </Pip>
              </div>
            </div>
          </section>

          {/* ================= WARDROBE ================= */}
          <section
            aria-label="Customise your explorer"
            className="min-w-0 rounded-[32px] border-[3px] border-[#efc478] bg-[#fff5dc] p-4 shadow-[0_6px_0_rgba(187,125,61,.18),0_12px_30px_rgba(36,82,131,.1)] sm:p-6"
          >
            {/* ========= GENDER / AVATAR PRESENTATION SELECTOR ========= */}
            <div className="mb-5 rounded-[24px] border-2 border-[#efc478]/70 bg-white/75 p-3 sm:p-4">
              <div className="mb-3">
                <h2 className="font-display text-base font-extrabold text-[#52317b] sm:text-lg">
                  Choose your explorer
                </h2>
                <p className="mt-1 text-xs font-semibold text-[#786391] sm:text-sm">
                  Pick Male or Female. Each has a different look and outfit collection.
                </p>
              </div>

              <div role="group" aria-label="Explorer gender" className="grid grid-cols-2 gap-3">
                {(["male", "female"] as const).map((optionGender) => {
                  const active = gender === optionGender;
                  return (
                    <button
                      key={optionGender}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectGender(optionGender)}
                      className={cn(
                        "relative flex min-w-0 flex-col items-center rounded-[20px] border-[3px] px-2 pb-3 pt-3 transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
                        active
                          ? "border-[#f0b93a] bg-gradient-to-b from-[#e2f8ff] to-[#fff5d9] shadow-[0_5px_0_rgba(188,125,54,.22)]"
                          : "border-[#dbe8ee] bg-gradient-to-b from-[#f0fbff] to-white hover:-translate-y-0.5 hover:border-[#efc478]"
                      )}
                    >
                      {active && (
                        <span className="absolute right-2 top-2 rounded-full bg-[#2b6fd6] p-1 text-white">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                      <span className="mb-2 flex h-[104px] w-[104px] items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#a5e9ff] to-[#d6f7fe] sm:h-[124px] sm:w-[124px]">
                        <AvatarView
                          avatar={{ ...DEFAULT_AVATARS[optionGender], skin: a.skin }}
                          size={114}
                          decorative
                        />
                      </span>
                      <span className="font-display text-sm font-extrabold text-[#443466] sm:text-base">
                        {optionGender === "male" ? "Male Explorer" : "Female Explorer"}
                      </span>
                      <span className="mt-0.5 text-[11px] font-medium text-[#796592]">
                        {optionGender === "male" ? "Adventure outfits" : "Adventure & dress outfits"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs text-[#7d6999]">
                No time to customize? Your explorer already has a default look.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#efc478]/70 bg-white/80 p-3">
              <label htmlFor="name" className="font-display text-sm font-extrabold text-[#52317b]">
                What should we call you?
              </label>
              <Input
                id="name"
                maxLength={20}
                value={a.name}
                onChange={(e) => up({ name: e.target.value })}
                placeholder="e.g. Aisyah"
                className="mt-1.5 h-12 rounded-xl border-2 border-[#efc478] bg-white text-base font-semibold text-[#373268] focus-visible:ring-[#2b6fd6]/40"
              />
            </div>

            <div role="tablist" aria-label="Customisation categories" className="mt-5 grid grid-cols-4 gap-2">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    id={`tab-${id}`}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls={`panel-${id}`}
                    onClick={() => setTab(id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-2.5 text-xs font-extrabold transition-all sm:flex-row sm:justify-center sm:gap-2 sm:text-sm",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b6fd6]/40",
                      active
                        ? "border-[#2b6fd6] bg-gradient-to-b from-[#4aa3f5] to-[#2b6fd6] text-white shadow-[0_4px_0_#1f4fa3]"
                        : "border-[#efc478]/70 bg-white/70 text-[#52317b] hover:bg-white",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[240px]">
              {tab === "skin" && (
                <div role="tabpanel" id="panel-skin" aria-labelledby="tab-skin">
                  <h2 className="mb-3 font-display text-base font-extrabold text-[#52317b]">Skin tone</h2>
                  <div className="flex flex-wrap gap-3">
                    {SKINS.map((c, i) => (
                      <Option
                        key={c}
                        label={`Skin tone ${i + 1}`}
                        selected={a.skin === i}
                        onClick={() => up({ skin: i })}
                        className="h-14 w-14 rounded-full p-1"
                      >
                        <span className="h-full w-full rounded-full border border-black/10" style={{ background: c }} />
                      </Option>
                    ))}
                  </div>
                </div>
              )}

              {tab === "hair" && (
  <div role="tabpanel" id="panel-hair" aria-labelledby="tab-hair">
    <div className="mb-3">
      <p className="text-sm font-extrabold text-[#52317b]">
        {gender === "male" ? "Male hairstyles" : "Female hairstyles"}
      </p>
      <p className="text-xs text-[#7b679c]">
        Showing styles that match your selected explorer.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {visibleHairs.map((h) => (
        <Tile
          key={h.name}
          a={a}
          patch={{ hair: h.index }}
          viewBox={HEAD_VIEW}
          name={h.name}
          selected={a.hair === h.index}
          onClick={() => up({ hair: h.index })}
        />
      ))}
    </div>
  </div>
)}

              {tab === "outfit" && (
                <div role="tabpanel" id="panel-outfit" aria-labelledby="tab-outfit">
                  <h2 className="mb-1 font-display text-base font-extrabold text-[#52317b]">
                    {gender === "male" ? "Male outfits" : "Female outfits"}
                  </h2>
                  <p className="mb-3 text-xs font-medium text-[#786391]">
                    Showing {visibleOutfits.length} outfits available for your chosen explorer.
                  </p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {visibleOutfits.map((o) => (
                      <Tile
                        key={o.name}
                        a={a}
                        patch={{ outfit: o.index }}
                        viewBox={OUTFIT_VIEW}
                        name={o.name}
                        selected={a.outfit === o.index}
                        onClick={() => up({ outfit: o.index })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tab === "accessory" && (
                <div role="tabpanel" id="panel-accessory" aria-labelledby="tab-accessory">
                  <h2 className="mb-1 font-display text-base font-extrabold text-[#52317b]">Extras</h2>
                  <p className="mb-3 text-sm font-semibold text-[#624c88]">Unlock these with quest coins. You have {g.coins}.</p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {ACCESSORIES.map((x, i) => {
                      const owned = isOwned(i);
                      const cantAfford = !owned && g.coins < x.cost;
                      return (
                        <Tile
                          key={x.name}
                          a={a}
                          patch={{ accessory: i }}
                          viewBox={HEAD_VIEW}
                          name={x.name}
                          price={owned ? undefined : x.cost}
                          selected={a.accessory === i}
                          locked={cantAfford}
                          disabled={cantAfford}
                          onClick={() => buyOrPick(i)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="bubble" size="lg" onClick={shuffle} className="gap-2 sm:w-auto">
                <Dices className="h-5 w-5" aria-hidden="true" />
                Surprise me
              </Button>
              <Button type="button" variant="bubble" size="lg" onClick={useDefaultLook} className="gap-2 sm:w-auto">
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                Default look
              </Button>
              <Button variant="quest" size="lg" onClick={save} className="flex-1">
                Save & continue adventure
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
}
