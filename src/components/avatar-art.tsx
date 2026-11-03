import { useId, type ReactNode } from "react";

/* ----------------------------------------------------------------
   FX QUEST AVATAR ART
   A layered SVG chibi explorer. Everything is drawn in code, so it
   stays sharp at any size and every option can be mixed freely.

   Exports (same names the app already uses):
   SKINS, HAIRS, OUTFITS, ACCESSORIES, AvatarView
---------------------------------------------------------------- */

/* ---------- helpers ---------- */

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const ch = (v: number) => Math.round((target - v) * p + v);
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function starPoints(cx: number, cy: number, R: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return pts.join(" ");
}

function heartPath(cx: number, cy: number, s: number) {
  return `M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.2} ${cx - s * 0.7} ${cy - s * 1.3} ${cx} ${cy - s * 0.4} C${cx + s * 0.7} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.2} ${cx} ${cy + s * 0.9}Z`;
}

const GOLD = "#f2c14e";
const GOLD_DARK = "#c9962b";

/* ---------- Gender presets and compatibility ---------- */

// Presentation presets only. Skin tone, hairstyle and accessories remain
// customizable for either avatar, and shared clothing appears in both wardrobes.
export type AvatarGender = "male" | "female";

export type AvatarPreset = {
  gender: AvatarGender;
  skin: number;
  hair: number;
  outfit: number;
  accessory: number;
};

// These presets render even when a player has not created an avatar yet.
// Outfit indexes are stable so previously saved avatars still work.
export const DEFAULT_AVATARS: Record<AvatarGender, AvatarPreset> = {
  male: { gender: "male", skin: 1, hair: 0, outfit: 0, accessory: 0 },
  female: { gender: "female", skin: 1, hair: 8, outfit: 3, accessory: 0 },
};

// Older saved avatars did not have a gender field. Preserve distinctive
// feminine outfits when possible; otherwise use the male default preset.
export function resolveAvatarGender(avatar?: {
  gender?: AvatarGender;
  outfit?: number;
} | null): AvatarGender {
  if (avatar?.gender === "female") return "female";
  if (avatar?.gender === "male") return "male";
  if ([3, 7, 14, 15].includes(avatar?.outfit ?? -1)) return "female";
  return "male";
}

/* ---------- data (names, colours, prices) ---------- */

export const SKINS = [
  "#ffe3d1",
  "#f8d3b8",
  "#f1c08c",
  "#e2a672",
  "#c98a58",
  "#a9693f",
  "#8a4f2d",
  "#5f3720",
];

export const HAIRS: {
  name: string;
  color: string;
  style: string;
  genders: AvatarGender[];
}[] = [
  // =========================
  // MALE / SHARED MALE STYLES
  // =========================
  { name: "Black fade", color: "#2b2230", style: "crop", genders: ["male"] },
  { name: "Chestnut side part", color: "#7a4a2b", style: "crop", genders: ["male"] },
  { name: "Textured brown", color: "#5b3a2a", style: "curly", genders: ["male"] },
  { name: "Silver spikes", color: "#c7d1e6", style: "spiky", genders: ["male"] },
  { name: "Golden sweep", color: "#dfa83f", style: "crop", genders: ["male"] },
  { name: "Cocoa curls", color: "#4a2f27", style: "curly", genders: ["male"] },
  { name: "Raven cut", color: "#1f1a2e", style: "crop", genders: ["male"] },
  { name: "Sky quiff", color: "#55b4f2", style: "spiky", genders: ["male"] },

  // =========================
  // FEMALE / SHARED FEMALE STYLES
  // =========================
  { name: "Chestnut bob", color: "#7a4a2b", style: "bob", genders: ["female"] },
  { name: "Honey long", color: "#dfa83f", style: "long", genders: ["female"] },
  { name: "Pink twin tails", color: "#f48fb1", style: "pigtails", genders: ["female"] },
  { name: "Sky bun", color: "#55b4f2", style: "bun", genders: ["female"] },
  { name: "Ginger ponytail", color: "#d9682b", style: "ponytail", genders: ["female"] },
  { name: "Lavender waves", color: "#a98be8", style: "wavy", genders: ["female"] },
  { name: "Mint space buns", color: "#62d3b4", style: "twinbuns", genders: ["female"] },
  { name: "Raven braid", color: "#1f1a2e", style: "braid", genders: ["female"] },
  { name: "Blonde bob", color: "#f3d27a", style: "bob", genders: ["female"] },
  { name: "Auburn long", color: "#9c3d2e", style: "long", genders: ["female"] },
  { name: "Rose hijab", color: "#f2a0b8", style: "hijab", genders: ["female"] },
  { name: "Navy hijab", color: "#2f3f7a", style: "hijab", genders: ["female"] },
  { name: "Cream hijab", color: "#f1e4c8", style: "hijab", genders: ["female"] },
];

export function hairAvailableForGender(hairIndex: number, gender: AvatarGender): boolean {
  return HAIRS[hairIndex]?.genders.includes(gender) ?? false;
}

// Each style appears only in the wardrobes specified by its gender metadata.
// "Both" styles are intentionally included for male and female explorers.
export const OUTFITS: {
  name: string;
  color: string;
  style: string;
  genders: AvatarGender[];
}[] = [
  { name: "Explorer vest", color: "#3a9d5d", style: "explorer", genders: ["male", "female"] },
  { name: "Cosy hoodie", color: "#5b7cfa", style: "hoodie", genders: ["male", "female"] },
  { name: "Sailor top", color: "#2f5fb0", style: "sailor", genders: ["male", "female"] },
  { name: "Blossom dress", color: "#f48fb1", style: "blossom", genders: ["female"] },
  { name: "Blazer and tie", color: "#2f3f7a", style: "blazer", genders: ["male"] },
  { name: "Traveller jacket", color: "#e0912f", style: "traveller", genders: ["male", "female"] },
  { name: "Royal cape", color: "#8a4fd6", style: "cape", genders: ["male", "female"] },
  { name: "Baju kurung", color: "#2fb5a3", style: "kurung", genders: ["female"] },
  { name: "Denim overalls", color: "#4a8fe0", style: "overalls", genders: ["male", "female"] },
  { name: "Shop apron", color: "#f6b93b", style: "apron", genders: ["male", "female"] },
  { name: "Wizard robe", color: "#4b3b9a", style: "wizard", genders: ["male", "female"] },
  { name: "Sporty jersey", color: "#ee5a5a", style: "jersey", genders: ["male", "female"] },
  // New styles are appended rather than inserted, so saved outfit indexes remain stable.
  { name: "Baju Melayu", color: "#2b8b7b", style: "melayu", genders: ["male"] },
  { name: "Varsity jacket", color: "#427bc7", style: "varsity", genders: ["male"] },
  { name: "Floral cardigan", color: "#c98bd6", style: "cardigan", genders: ["female"] },
  { name: "Kebaya blouse", color: "#e6a65e", style: "kebaya", genders: ["female"] },
];

export function outfitAvailableForGender(outfitIndex: number, gender: AvatarGender): boolean {
  return OUTFITS[outfitIndex]?.genders.includes(gender) ?? false;
}

export const ACCESSORIES = [
  { name: "None", emoji: "🙂", cost: 0, style: "none" },
  { name: "Round glasses", emoji: "👓", cost: 0, style: "glasses" },
  { name: "Freckles", emoji: "✨", cost: 0, style: "freckles" },
  { name: "Star clip", emoji: "⭐", cost: 20, style: "starclip" },
  { name: "Bow", emoji: "🎀", cost: 20, style: "bow" },
  { name: "Pearl earrings", emoji: "🤍", cost: 30, style: "pearls" },
  { name: "Pilot goggles", emoji: "🥽", cost: 40, style: "goggles" },
  { name: "Flower crown", emoji: "🌸", cost: 40, style: "flowers" },
  { name: "Cat ears", emoji: "🐱", cost: 50, style: "catears" },
  { name: "Heart shades", emoji: "😎", cost: 50, style: "heartshades" },
  { name: "Headphones", emoji: "🎧", cost: 60, style: "headphones" },
  { name: "Bandana", emoji: "🏴‍☠️", cost: 60, style: "bandana" },
  { name: "Grad cap", emoji: "🎓", cost: 80, style: "gradcap" },
  { name: "Sun hat", emoji: "👒", cost: 80, style: "sunhat" },
  { name: "Angel halo", emoji: "😇", cost: 100, style: "halo" },
  { name: "Golden crown", emoji: "👑", cost: 120, style: "crown" },
  { name: "Wizard hat", emoji: "🧙", cost: 150, style: "wizardhat" },
];

/* ---------- hair ---------- */

type HairParts = { back?: ReactNode; front?: ReactNode };

const CAP_OUTER = "M50 86 C43 46 70 24 100 24 C132 24 157 46 150 86";
const FRINGE = {
  sweep: "C147 70 138 62 124 60 C108 70 84 68 70 58 C60 62 52 72 50 86Z",
  straight: "C150 74 142 68 100 68 C58 68 50 74 50 86Z",
  part: "C148 68 132 58 102 54 C98 54 98 54 98 54 C68 58 52 70 50 86Z",
};

function cap(c: string, inner: string) {
  return (
    <path d={`${CAP_OUTER} ${inner}`} fill={c} stroke={shade(c, -0.25)} strokeWidth="1.5" strokeLinejoin="round" />
  );
}

function shine(c: string) {
  return (
    <path
      d="M72 40 Q100 29 128 40"
      fill="none"
      stroke={shade(c, 0.35)}
      strokeWidth="5"
      strokeLinecap="round"
      opacity=".55"
    />
  );
}

const HAIR_STYLES: Record<string, (c: string) => HairParts> = {
  crop: (c) => ({
    front: (
      <g>
        {cap(c, FRINGE.sweep)}
        {shine(c)}
      </g>
    ),
  }),

  bob: (c) => {
    const d = shade(c, -0.18);
    return {
      back: (
        <path
          d="M46 84 C44 40 70 22 100 22 C130 22 156 40 154 84 L157 128 C157 142 146 148 136 144 L64 144 C54 148 43 142 43 128Z"
          fill={d}
          stroke={shade(c, -0.3)}
          strokeWidth="1.5"
        />
      ),
      front: (
        <g>
          {cap(c, FRINGE.straight)}
          {shine(c)}
        </g>
      ),
    };
  },

  long: (c) => {
    const d = shade(c, -0.18);
    return {
      back: (
        <path
          d="M44 84 C42 38 68 20 100 20 C132 20 158 38 156 84 L160 156 L40 156Z"
          fill={d}
          stroke={shade(c, -0.3)}
          strokeWidth="1.5"
        />
      ),
      front: (
        <g>
          {cap(c, FRINGE.part)}
          {shine(c)}
          <path
            d="M54 80 C47 108 42 138 44 172 C52 178 62 172 65 162 C61 132 62 104 65 84Z"
            fill={c}
            stroke={shade(c, -0.25)}
            strokeWidth="1.5"
          />
          <path
            d="M146 80 C153 108 158 138 156 172 C148 178 138 172 135 162 C139 132 138 104 135 84Z"
            fill={c}
            stroke={shade(c, -0.25)}
            strokeWidth="1.5"
          />
        </g>
      ),
    };
  },

  pigtails: (c) => {
    const d = shade(c, -0.25);
    return {
      back: (
        <g fill={c} stroke={d} strokeWidth="1.5">
          <ellipse cx="30" cy="112" rx="16" ry="40" transform="rotate(10 30 112)" />
          <ellipse cx="170" cy="112" rx="16" ry="40" transform="rotate(-10 170 112)" />
        </g>
      ),
      front: (
        <g>
          {cap(c, FRINGE.part)}
          {shine(c)}
          <circle cx="44" cy="72" r="6.5" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
          <circle cx="156" cy="72" r="6.5" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
        </g>
      ),
    };
  },

  bun: (c) => ({
    back: (
      <g>
        <circle cx="100" cy="20" r="19" fill={c} stroke={shade(c, -0.25)} strokeWidth="1.5" />
        <path d="M88 12 Q98 4 110 10" fill="none" stroke={shade(c, 0.4)} strokeWidth="4" strokeLinecap="round" opacity=".6" />
      </g>
    ),
    front: (
      <g>
        {cap(c, FRINGE.sweep)}
        {shine(c)}
        <ellipse cx="100" cy="35" rx="16" ry="5.5" fill="#ff7aa8" stroke="#d94a7e" strokeWidth="1.5" />
      </g>
    ),
  }),

  curly: (c) => {
    const d = shade(c, -0.25);
    const puffs: [number, number, number][] = [
      [54, 62, 20],
      [48, 90, 17],
      [60, 38, 20],
      [82, 26, 21],
      [108, 22, 21],
      [132, 28, 21],
      [150, 44, 20],
      [156, 70, 19],
      [152, 96, 16],
    ];
    const curls: [number, number, number][] = [
      [70, 54, 12],
      [88, 48, 13],
      [108, 47, 13],
      [128, 53, 12],
      [58, 68, 10],
      [142, 68, 10],
    ];
    return {
      back: (
        <g fill={c} stroke={d} strokeWidth="1.5">
          {puffs.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      ),
      front: (
        <g fill={c} stroke={d} strokeWidth="1.5">
          {curls.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      ),
    };
  },

  ponytail: (c) => ({
    back: (
      <g>
        <path
          d="M122 34 C162 20 188 52 176 98 C172 120 158 132 148 128 C160 104 162 80 140 62Z"
          fill={c}
          stroke={shade(c, -0.25)}
          strokeWidth="1.5"
        />
        <circle cx="130" cy="40" r="6" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
      </g>
    ),
    front: (
      <g>
        {cap(c, FRINGE.sweep)}
        {shine(c)}
      </g>
    ),
  }),

  spiky: (c) => ({
    front: (
      <g>
        <path
          d="M50 86 C44 58 52 38 66 30 L70 8 L88 26 L100 2 L112 26 L130 8 L134 30 C148 38 156 58 150 86 C148 70 140 62 128 60 L116 72 L100 60 L84 72 L72 60 C60 64 52 74 50 86Z"
          fill={c}
          stroke={shade(c, -0.25)}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M78 30 L88 40" stroke={shade(c, 0.4)} strokeWidth="4" strokeLinecap="round" opacity=".6" />
      </g>
    ),
  }),

  wavy: (c) => {
    const d = shade(c, -0.18);
    return {
      back: (
        <path
          d="M44 84 C42 38 68 20 100 20 C132 20 158 38 156 84 C160 110 150 120 158 140 C166 160 150 168 154 178 C140 186 130 172 126 160 L74 160 C70 172 60 186 46 178 C50 168 34 160 42 140 C50 120 40 110 44 84Z"
          fill={d}
          stroke={shade(c, -0.3)}
          strokeWidth="1.5"
        />
      ),
      front: (
        <g>
          <path
            d={`${CAP_OUTER} C146 70 138 58 116 54 C100 72 72 74 54 78 C52 80 50 83 50 86Z`}
            fill={c}
            stroke={shade(c, -0.25)}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {shine(c)}
          <path
            d="M52 84 C44 104 56 112 48 130 C42 146 52 156 56 168 C64 156 56 146 62 132 C68 114 58 106 62 88Z"
            fill={c}
            stroke={shade(c, -0.25)}
            strokeWidth="1.5"
          />
          <path
            d="M148 84 C156 104 144 112 152 130 C158 146 148 156 144 168 C136 156 144 146 138 132 C132 114 142 106 138 88Z"
            fill={c}
            stroke={shade(c, -0.25)}
            strokeWidth="1.5"
          />
        </g>
      ),
    };
  },

  twinbuns: (c) => ({
    back: (
      <g fill={c} stroke={shade(c, -0.25)} strokeWidth="1.5">
        <circle cx="58" cy="28" r="16" />
        <circle cx="142" cy="28" r="16" />
      </g>
    ),
    front: (
      <g>
        {cap(c, FRINGE.part)}
        {shine(c)}
        <circle cx="62" cy="40" r="5" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
        <circle cx="138" cy="40" r="5" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
      </g>
    ),
  }),

  braid: (c) => {
    const d = shade(c, -0.25);
    const links: [number, number][] = [
      [60, 104],
      [58, 120],
      [56, 136],
      [54, 152],
      [52, 168],
    ];
    return {
      back: (
        <path
          d="M46 84 C44 40 70 22 100 22 C130 22 156 40 154 84 L152 120 L48 120Z"
          fill={shade(c, -0.18)}
          stroke={d}
          strokeWidth="1.5"
        />
      ),
      front: (
        <g>
          {cap(c, FRINGE.sweep)}
          {shine(c)}
          <g fill={c} stroke={d} strokeWidth="1.5">
            {links.map(([x, y], i) => (
              <ellipse key={y} cx={x} cy={y} rx="9" ry="10" transform={`rotate(${i % 2 ? 14 : -14} ${x} ${y})`} />
            ))}
          </g>
          <circle cx="52" cy="182" r="6" fill="#ff7aa8" stroke="#d94a7e" strokeWidth="1.5" />
        </g>
      ),
    };
  },

  hijab: (c) => {
    const d = shade(c, -0.22);
    return {
      front: (
        <g>
          <path
            fillRule="evenodd"
            fill={c}
            stroke={d}
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M100 26 C142 26 158 56 158 92 C158 114 152 126 162 152 C166 166 150 176 100 176 C50 176 34 166 38 152 C48 126 42 114 42 92 C42 56 58 26 100 26Z M100 50 C125 50 141 70 141 92 C141 114 125 131 100 131 C75 131 59 114 59 92 C59 70 75 50 100 50Z"
          />
          <path d="M66 150 Q100 166 134 150" fill="none" stroke={d} strokeWidth="2" opacity=".45" strokeLinecap="round" />
          <path d="M60 40 Q100 22 140 40" fill="none" stroke={shade(c, 0.4)} strokeWidth="5" strokeLinecap="round" opacity=".5" />
          <circle cx="136" cy="134" r="5" fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
        </g>
      ),
    };
  },
};

/* ---------- outfits ---------- */

const BODY = "M26 200 C26 158 60 138 100 138 C140 138 174 158 174 200Z";

type OutfitParts = { body: ReactNode; collar?: ReactNode };

const OUTFIT_STYLES: Record<string, (c: string, skin: string) => OutfitParts> = {
  explorer: (c) => {
    const d = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill="#f7efd8" />
          <path d="M28 200 C28 166 52 144 84 139 L94 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <path d="M172 200 C172 166 148 144 116 139 L106 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <rect x="44" y="172" width="24" height="18" rx="4" fill={d} />
          <rect x="132" y="172" width="24" height="18" rx="4" fill={d} />
          <circle cx="66" cy="160" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
          <path d="M66 156 L68 160 L66 164 L64 160Z" fill="#d94a4a" />
        </g>
      ),
      collar: <path d="M80 138 L100 160 L120 138 L112 133 L100 146 L88 133Z" fill="#fff7e0" stroke="#e6d9b8" strokeWidth="1.5" strokeLinejoin="round" />,
    };
  },

  hoodie: (c) => {
    const d = shade(c, -0.2);
    return {
      body: (
        <g>
          <path d={BODY} fill={c} />
          <path d="M60 178 L140 178 L148 200 L52 200Z" fill={d} />
          <path d="M88 162 L86 186 M112 162 L114 186" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="86" cy="187" r="2.5" fill="#fff" />
          <circle cx="114" cy="187" r="2.5" fill="#fff" />
        </g>
      ),
      collar: <path d="M64 146 Q100 174 136 146" fill="none" stroke={d} strokeWidth="13" strokeLinecap="round" />,
    };
  },

  sailor: (c) => ({
    body: <path d={BODY} fill="#f4f8ff" />,
    collar: (
      <g>
        <path d="M62 140 C80 142 92 140 100 134 C108 140 120 142 138 140 L152 180 L100 200 L48 180Z" fill={c} stroke={shade(c, -0.25)} strokeWidth="1.5" />
        <path d="M88 140 L100 178 L112 140Z" fill="#f4f8ff" />
        <path d="M58 172 L100 192 L142 172" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 176 L86 168 L86 184Z M100 176 L114 168 L114 184Z" fill="#e8485a" />
        <circle cx="100" cy="176" r="4" fill="#c93448" />
      </g>
    ),
  }),

  blossom: (c, skin) => {
    const l = shade(c, 0.3);
    const dots: [number, number][] = [
      [50, 190],
      [74, 182],
      [128, 186],
      [150, 192],
      [100, 192],
    ];
    return {
      body: (
        <g>
          <path d={BODY} fill={c} />
          <circle cx="46" cy="162" r="18" fill={l} stroke={shade(c, -0.1)} strokeWidth="1.5" />
          <circle cx="154" cy="162" r="18" fill={l} stroke={shade(c, -0.1)} strokeWidth="1.5" />
          {dots.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="3.5" fill="#fff" opacity=".8" />
          ))}
        </g>
      ),
      collar: (
        <g>
          <ellipse cx="100" cy="146" rx="26" ry="13" fill={skin} />
          <path d="M74 146 Q100 166 126 146" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 164 L84 154 L84 174Z M100 164 L116 154 L116 174Z" fill="#fff0f6" stroke="#f3b6cc" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="100" cy="164" r="4.5" fill="#ffc2d9" stroke="#f3b6cc" strokeWidth="1.5" />
        </g>
      ),
    };
  },

  blazer: (c) => {
    const d = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill="#fff" />
          <path d="M26 200 C26 158 58 140 86 138 L100 184 L84 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <path d="M174 200 C174 158 142 140 114 138 L100 184 L116 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <path d="M86 138 L100 184 L74 160Z" fill={d} />
          <path d="M114 138 L100 184 L126 160Z" fill={d} />
          <path d="M96 150 L104 150 L107 190 L100 198 L93 190Z" fill="#e0485a" />
          <path d="M95 148 L105 148 L103 157 L97 157Z" fill="#c93448" />
          <path d="M124 174 L136 174 L130 166Z" fill="#fff" />
        </g>
      ),
      collar: <path d="M84 138 L100 154 L116 138 L110 130 L100 140 L90 130Z" fill="#fff" stroke="#dfe6f2" strokeWidth="1.5" strokeLinejoin="round" />,
    };
  },

  traveller: (c) => {
    const d = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill={c} />
          <path d="M100 160 L100 200" stroke={d} strokeWidth="3" />
          <rect x="44" y="172" width="26" height="18" rx="4" fill={d} />
          <rect x="130" y="172" width="26" height="18" rx="4" fill={d} />
          <circle cx="138" cy="160" r="7" fill="#fff7e0" stroke={GOLD_DARK} strokeWidth="1.5" />
          <polygon points={starPoints(138, 160, 4.5, 2)} fill="#e8485a" />
        </g>
      ),
      collar: <path d="M64 144 Q100 170 136 144 L142 158 Q100 190 58 158Z" fill={d} stroke={shade(c, -0.35)} strokeWidth="1.5" strokeLinejoin="round" />,
    };
  },

  cape: (c) => {
    const furs: [number, number][] = [
      [66, 150],
      [76, 157],
      [88, 162],
      [100, 164],
      [112, 162],
      [124, 157],
      [134, 150],
    ];
    return {
      body: (
        <g>
          <path d={BODY} fill={c} />
          <path d="M70 150 L130 150 L138 200 L62 200Z" fill={shade(c, 0.35)} />
          <path d="M26 192 L174 192" stroke={GOLD} strokeWidth="4" />
        </g>
      ),
      collar: (
        <g>
          {furs.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="9" fill="#fffaf0" stroke="#e8dcc0" strokeWidth="1.5" />
          ))}
          <circle cx="100" cy="178" r="6.5" fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
          <circle cx="100" cy="178" r="2.5" fill="#e8485a" />
        </g>
      ),
    };
  },

  kurung: (c) => ({
    body: (
      <g>
        <path d={BODY} fill={c} />
        <rect x="26" y="186" width="148" height="14" fill={GOLD} />
        {[44, 68, 92, 116, 140].map((x) => (
          <polygon key={x} points={`${x + 8},187 ${x + 14},193 ${x + 8},199 ${x + 2},193`} fill={c} />
        ))}
        <path d="M100 168 L100 186" stroke={GOLD} strokeWidth="3" strokeDasharray="3 3" />
      </g>
    ),
    collar: <path d="M70 146 Q100 170 130 146" fill="none" stroke={GOLD} strokeWidth="4.5" strokeLinecap="round" />,
  }),

  overalls: (c) => {
    const d = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill="#ffe08a" />
          <path d="M27 200 C27 184 32 174 44 170 L68 176 L68 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <path d="M173 200 C173 184 168 174 156 170 L132 176 L132 200Z" fill={c} stroke={d} strokeWidth="1.5" />
          <rect x="68" y="164" width="64" height="36" rx="6" fill={c} stroke={d} strokeWidth="1.5" />
          <path d="M74 166 L66 142 M126 166 L134 142" stroke={c} strokeWidth="9" strokeLinecap="round" />
          <circle cx="74" cy="168" r="3.5" fill={GOLD} stroke={GOLD_DARK} />
          <circle cx="126" cy="168" r="3.5" fill={GOLD} stroke={GOLD_DARK} />
          <rect x="86" y="178" width="28" height="14" rx="3" fill="none" stroke={d} strokeDasharray="3 2" />
        </g>
      ),
    };
  },

  apron: (c) => {
    const d = shade(c, -0.2);
    return {
      body: (
        <g>
          <path d={BODY} fill="#cfe9ff" />
          <path d="M74 150 L126 150 L142 200 L58 200Z" fill={c} stroke={d} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M74 152 Q78 138 90 134 M126 152 Q122 138 110 134" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
          <rect x="84" y="176" width="32" height="16" rx="4" fill={d} />
          <circle cx="100" cy="184" r="5" fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" />
        </g>
      ),
      collar: <path d="M84 138 Q100 152 116 138" fill="none" stroke="#a8d4f5" strokeWidth="3.5" strokeLinecap="round" />,
    };
  },

  wizard: (c) => {
    const stars: [number, number, number][] = [
      [50, 174, 6],
      [150, 170, 7],
      [68, 192, 4.5],
      [136, 192, 5],
      [40, 192, 3.5],
    ];
    return {
      body: (
        <g>
          <path d={BODY} fill={c} />
          {stars.map(([x, y, r]) => (
            <polygon key={x} points={starPoints(x, y, r, r * 0.45)} fill={GOLD} />
          ))}
          <path d="M84 138 L100 172 L116 138Z" fill="#f1e6ff" />
          <path d="M84 138 L100 172 L116 138" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" />
        </g>
      ),
    };
  },

  // Traditional formal Malay outfit, with standing collar and sampin.
  melayu: (c) => {
    const dark = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M46 180 L154 180 L159 200 L41 200Z" fill="#d9ba77" stroke="#b48b4e" strokeWidth="1.5" />
          <path d="M55 185 L145 185 M55 192 L145 192" fill="none" stroke="#9a6e39" strokeWidth="2" strokeDasharray="6 3" />
          <path d="M100 142 L100 179" stroke={dark} strokeWidth="3" />
          {[150, 160, 170].map((y) => <circle key={y} cx="100" cy={y} r="2.2" fill={GOLD} />)}
        </g>
      ),
      collar: <path d="M84 138 L84 151 Q100 158 116 151 L116 138" fill="none" stroke="#e9f6e9" strokeWidth="6" strokeLinecap="round" />,
    };
  },

  // Sporty, structured jacket for the male preset wardrobe.
  varsity: (c) => {
    const dark = shade(c, -0.32);
    return {
      body: (
        <g>
          <path d={BODY} fill="#fff4df" />
          <path d="M28 200 C28 160 52 144 82 139 L94 200Z" fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M172 200 C172 160 148 144 118 139 L106 200Z" fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M48 178 L80 178 M120 178 L152 178" stroke="#fff" strokeWidth="3" />
          <path d="M60 157 L75 162 L65 170Z" fill={GOLD} />
          <path d="M92 140 L100 192 L108 140" fill="#fffaf1" />
        </g>
      ),
      collar: <path d="M72 144 Q100 166 128 144" fill="none" stroke={dark} strokeWidth="9" strokeLinecap="round" />,
    };
  },

  // Soft knit, embroidered detail for the female wardrobe.
  cardigan: (c) => {
    const dark = shade(c, -0.22);
    return {
      body: (
        <g>
          <path d={BODY} fill="#fff9ec" />
          <path d="M27 200 C27 165 51 144 83 139 L95 200Z" fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M173 200 C173 165 149 144 117 139 L105 200Z" fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M92 143 L100 187 L108 143" fill="none" stroke="#fff" strokeWidth="3" />
          <circle cx="100" cy="177" r="4" fill={GOLD} />
          <circle cx="60" cy="169" r="5" fill="#fff7d1" />
          <circle cx="60" cy="169" r="2" fill="#e9a3c7" />
          <circle cx="141" cy="176" r="5" fill="#fff7d1" />
          <circle cx="141" cy="176" r="2" fill="#e9a3c7" />
        </g>
      ),
      collar: <path d="M80 140 Q100 169 120 140" fill="none" stroke="#e6b0be" strokeWidth="5" strokeLinecap="round" />,
    };
  },

  // A fitted traditional-inspired blouse with a brooch.
  kebaya: (c) => {
    const dark = shade(c, -0.2);
    return {
      body: (
        <g>
          <path d={BODY} fill={c} stroke={dark} strokeWidth="1.5" />
          <path d="M67 141 L100 191 L133 141" fill="#fff4dc" stroke="#f7d58d" strokeWidth="2" />
          <path d="M68 142 L100 177 L132 142" fill="none" stroke="#fffaf0" strokeWidth="4" />
          <path d="M48 191 Q100 178 152 191" fill="none" stroke={GOLD} strokeWidth="3" />
          <circle cx="100" cy="160" r="6" fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
          <circle cx="100" cy="160" r="2.5" fill="#fff" />
        </g>
      ),
      collar: <path d="M82 139 L100 163 L118 139" fill="none" stroke="#fff7e6" strokeWidth="4" />,
    };
  },

  jersey: (c) => ({
    body: (
      <g>
        <path d={BODY} fill={c} />
        <path d="M30 192 C30 170 40 156 56 148 L64 150 C48 158 40 172 40 192Z" fill="#fff" />
        <path d="M170 192 C170 170 160 156 144 148 L136 150 C152 158 160 172 160 192Z" fill="#fff" />
        <text x="100" y="192" textAnchor="middle" fontSize="28" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
          10
        </text>
      </g>
    ),
    collar: <path d="M80 138 L100 160 L120 138" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />,
  }),
};

/* ---------- accessories ---------- */

const ACCESSORY_STYLES: Record<string, () => ReactNode> = {
  none: () => null,

  glasses: () => (
    <g fill="rgba(255,255,255,.18)" stroke="#5a3b7a" strokeWidth="3">
      <circle cx="79" cy="93" r="15" />
      <circle cx="121" cy="93" r="15" />
      <path d="M94 91 Q100 86 106 91" fill="none" />
      <path d="M64 90 L54 86 M136 90 L146 86" fill="none" strokeLinecap="round" />
    </g>
  ),

  freckles: () => (
    <g fill="#b9704a" opacity=".55">
      {[
        [72, 100],
        [78, 104],
        [84, 100],
        [116, 100],
        [122, 104],
        [128, 100],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="1.6" />
      ))}
    </g>
  ),

  starclip: () => <polygon points={starPoints(136, 56, 11, 5)} fill="#ffd75e" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinejoin="round" />,

  bow: () => (
    <g>
      <path d="M132 50 L112 40 L112 62Z M132 50 L152 40 L152 62Z" fill="#ff7aa8" stroke="#d94a7e" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="132" cy="50" r="5" fill="#ff9fc0" stroke="#d94a7e" strokeWidth="1.5" />
    </g>
  ),

  pearls: () => (
    <g>
      <circle cx="53" cy="106" r="4.5" fill="#fff" stroke="#d6d0e6" strokeWidth="1.5" />
      <circle cx="147" cy="106" r="4.5" fill="#fff" stroke="#d6d0e6" strokeWidth="1.5" />
      <circle cx="53" cy="101" r="1.8" fill={GOLD} />
      <circle cx="147" cy="101" r="1.8" fill={GOLD} />
    </g>
  ),

  goggles: () => (
    <g>
      <path d="M52 62 Q100 44 148 62" fill="none" stroke="#7a4a2b" strokeWidth="9" strokeLinecap="round" />
      <circle cx="82" cy="54" r="12" fill="#8fd8ff" stroke="#f2b84a" strokeWidth="4" />
      <circle cx="118" cy="54" r="12" fill="#8fd8ff" stroke="#f2b84a" strokeWidth="4" />
      <path d="M94 54 L106 54" stroke="#f2b84a" strokeWidth="4" />
      <path d="M76 50 Q80 47 85 49 M112 50 Q116 47 121 49" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),

  flowers: () => {
    const colours = ["#ff8fb8", "#fff", "#ffd75e", "#ff8fb8", "#fff", "#ffd75e", "#ff8fb8", "#fff"];
    return (
      <g>
        <path d="M54 56 Q100 22 146 56" fill="none" stroke="#5fb85a" strokeWidth="5" strokeLinecap="round" />
        {colours.map((col, i) => {
          const a = ((195 + i * 21.4) * Math.PI) / 180;
          const x = 100 + 50 * Math.cos(a);
          const y = 62 + 30 * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="7.5" fill={col} stroke="#e07aa0" strokeWidth="1" />
              <circle cx={x} cy={y} r="2.6" fill="#f6b93b" />
            </g>
          );
        })}
      </g>
    );
  },

  catears: () => (
    <g stroke="#2f2848" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M58 58 L62 16 L92 40Z" fill="#4a3f6b" />
      <path d="M142 58 L138 16 L108 40Z" fill="#4a3f6b" />
      <path d="M66 50 L67 28 L82 40Z" fill="#ffb3c7" stroke="none" />
      <path d="M134 50 L133 28 L118 40Z" fill="#ffb3c7" stroke="none" />
    </g>
  ),

  heartshades: () => (
    <g>
      <path d={heartPath(79, 92, 11)} fill="#ff5c8a" stroke="#c2185b" strokeWidth="2" strokeLinejoin="round" />
      <path d={heartPath(121, 92, 11)} fill="#ff5c8a" stroke="#c2185b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M90 88 L110 88 M66 88 L54 84 M134 88 L146 84" stroke="#c2185b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="74" cy="87" r="2.4" fill="#fff" opacity=".8" />
      <circle cx="116" cy="87" r="2.4" fill="#fff" opacity=".8" />
    </g>
  ),

  headphones: () => (
    <g>
      <path d="M50 90 C48 26 152 26 150 90" fill="none" stroke="#3d3a5c" strokeWidth="7" strokeLinecap="round" />
      <rect x="40" y="80" width="17" height="32" rx="8" fill="#ff6b9d" stroke="#d94a7e" strokeWidth="2" />
      <rect x="143" y="80" width="17" height="32" rx="8" fill="#ff6b9d" stroke="#d94a7e" strokeWidth="2" />
    </g>
  ),

  bandana: () => (
    <g>
      <path d="M52 72 L38 64 L42 84Z" fill="#e8485a" />
      <path d="M52 72 C60 34 140 34 148 72 C132 56 68 56 52 72Z" fill="#e8485a" stroke="#b92f42" strokeWidth="1.5" strokeLinejoin="round" />
      {[
        [76, 52],
        [100, 46],
        [124, 52],
        [66, 63],
        [134, 63],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.2" fill="#fff" />
      ))}
    </g>
  ),

  gradcap: () => (
    <g strokeLinejoin="round">
      <path d="M70 50 L70 66 Q100 80 130 66 L130 50 L100 60Z" fill="#3b3e7e" stroke="#1b1c40" strokeWidth="1.5" />
      <path d="M100 18 L162 40 L100 60 L38 40Z" fill="#2b2d5e" stroke="#1b1c40" strokeWidth="1.5" />
      <path d="M100 39 L150 44 L150 62" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="150" cy="65" r="3.5" fill={GOLD} />
      <circle cx="100" cy="39" r="3.2" fill={GOLD} />
    </g>
  ),

  sunhat: () => (
    <g>
      <ellipse cx="100" cy="56" rx="72" ry="15" fill="#f6dc92" stroke="#d9b45a" strokeWidth="1.5" />
      <path d="M62 52 C62 14 138 14 138 52Z" fill="#f6dc92" stroke="#d9b45a" strokeWidth="1.5" />
      <path d="M62 46 Q100 57 138 46 L138 54 Q100 65 62 54Z" fill="#e8485a" />
    </g>
  ),

  halo: () => (
    <g fill="none">
      <ellipse cx="100" cy="18" rx="28" ry="8" stroke="#ffd75e" strokeWidth="6" />
      <ellipse cx="100" cy="17" rx="28" ry="8" stroke="#fff7c2" strokeWidth="2" />
    </g>
  ),

  crown: () => (
    <g strokeLinejoin="round">
      <path d="M64 50 L66 20 L82 38 L100 12 L118 38 L134 20 L136 50Z" fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <circle cx="100" cy="36" r="4" fill="#e8485a" />
      <circle cx="78" cy="42" r="3" fill="#4aa3f5" />
      <circle cx="122" cy="42" r="3" fill="#4cc48a" />
      <circle cx="66" cy="20" r="3" fill="#fff" />
      <circle cx="134" cy="20" r="3" fill="#fff" />
    </g>
  ),

  wizardhat: () => (
    <g strokeLinejoin="round">
      <ellipse cx="100" cy="52" rx="62" ry="13" fill="#5a3fb0" stroke="#3f2a85" strokeWidth="1.5" />
      <path d="M68 52 C76 30 90 14 118 2 C112 18 124 36 132 52Z" fill="#6a4cc8" stroke="#3f2a85" strokeWidth="1.5" />
      <path d="M68 52 Q100 60 132 52 L131 44 Q100 52 69 44Z" fill={GOLD} />
      <polygon points={starPoints(104, 30, 6, 2.6)} fill={GOLD} />
    </g>
  ),
};

/* ---------- component ---------- */

type AvatarLike = {
  name?: string;
  gender?: AvatarGender;
  skin?: number;
  hair?: number;
  outfit?: number;
  accessory?: number;
};

const pick = <T,>(list: T[], i: number | undefined): T =>
  list[((i ?? 0) % list.length + list.length) % list.length];

export function AvatarView({
  avatar,
  size = 160,
  viewBox = "0 0 200 200",
  decorative = false,
  className,
}: {
  avatar?: AvatarLike | null;
  size?: number;
  viewBox?: string;
  decorative?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gender = resolveAvatarGender(avatar);
  const preset = DEFAULT_AVATARS[gender];

  // A missing avatar automatically renders a complete, attractive preset.
  const skin = pick(SKINS, avatar?.skin ?? preset.skin);
  const hair = pick(HAIRS, avatar?.hair ?? preset.hair);
  const chosenOutfit = avatar?.outfit ?? preset.outfit;
  const safeOutfitIndex = outfitAvailableForGender(chosenOutfit, gender)
    ? chosenOutfit
    : preset.outfit;
  const outfit = OUTFITS[safeOutfitIndex];
  const accessory = pick(ACCESSORIES, avatar?.accessory ?? preset.accessory);

  const hairParts = HAIR_STYLES[hair.style](hair.color);
  const outfitParts = OUTFIT_STYLES[outfit.style](outfit.color, skin);
  const accessoryArt = ACCESSORY_STYLES[accessory.style]();

  const [, , vw, vh] = viewBox.split(" ").map(Number);
  const height = Math.round((size * vh) / vw);
  const earShade = shade(skin, -0.12);
  const isFemale = gender === "female";
  return (
    <svg
      width={size}
      height={height}
      viewBox={viewBox}
      className={className}
      style={{ display: "block" }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${isFemale ? "Female" : "Male"} explorer avatar`}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <radialGradient id={`${uid}s`} cx=".5" cy=".38" r=".75">
          <stop offset="0" stopColor={shade(skin, 0.14)} />
          <stop offset="1" stopColor={skin} />
        </radialGradient>
        <linearGradient id={`${uid}i`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2f3a" />
          <stop offset="1" stopColor="#c98a4a" />
        </linearGradient>
      </defs>

      {/* 1. Back hair */}
      {hairParts.back}

      {/* 2. Ears */}
      <circle cx="54" cy="92" r="8" fill={skin} stroke={earShade} strokeWidth="1.2" />
      <circle cx="146" cy="92" r="8" fill={skin} stroke={earShade} strokeWidth="1.2" />

      {/* 3. Outfit / neck / collar. The outfit selection is gender-safe. */}
      {outfitParts.body}
      <rect x="87" y="116" width="26" height="32" rx="10" fill={skin} />
      <ellipse cx="100" cy="129" rx="20" ry="7" fill="#000" opacity=".1" />
      {outfitParts.collar}

      {/* 4. Different head silhouettes for male / female presets */}
      <path
        d={isFemale
          ? "M54 84 C54 52 74 36 100 36 C126 36 146 52 146 84 C146 108 125 132 100 132 C75 132 54 108 54 84Z"
          : "M52 81 C52 53 73 35 100 35 C127 35 148 53 148 81 C148 105 132 127 119 131 Q100 138 81 131 C68 127 52 105 52 81Z"}
        fill={`url(#${uid}s)`}
        stroke={earShade}
        strokeWidth="1.2"
      />

      {/* Face detail: both stay cute/chibi but have distinct eyes/brows. */}
      {[79, 121].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="92" rx={isFemale ? 10.5 : 9.2} ry={isFemale ? 12.5 : 11} fill="#fff" />
          <ellipse cx={x} cy="94" rx={isFemale ? 8 : 7} ry={isFemale ? 10.5 : 9} fill={`url(#${uid}i)`} />
          <ellipse cx={x} cy="94.5" rx="4.2" ry="5.6" fill="#2a1a26" />
          <circle cx={x - 3} cy="89.5" r="3.2" fill="#fff" />
          <circle cx={x + 3} cy="98" r="1.6" fill="#fff" />
          <path
            d={isFemale ? `M${x - 11} 88 Q${x} 78 ${x + 11} 88` : `M${x - 10} 88 Q${x} 81 ${x + 10} 88`}
            fill="none" stroke="#2a1a26" strokeWidth={isFemale ? 2.6 : 2.3} strokeLinecap="round"
          />
        </g>
      ))}
      {isFemale && (
        <path d="M68 87 L62 82 M132 87 L138 82" stroke="#2a1a26" strokeWidth="2" strokeLinecap="round" />
      )}
      <path
        d={isFemale
          ? "M68 74 Q79 69 90 74 M110 74 Q121 69 132 74"
          : "M68 73 Q79 70 90 73 M110 73 Q121 70 132 73"}
        fill="none" stroke="#4a3030" strokeWidth={isFemale ? 2.7 : 4} strokeLinecap="round"
      />
      <ellipse cx="64" cy="107" rx="9" ry="5.5" fill="#ff8fa3" opacity={isFemale ? ".46" : ".22"} />
      <ellipse cx="136" cy="107" rx="9" ry="5.5" fill="#ff8fa3" opacity={isFemale ? ".46" : ".22"} />
      <path d="M98 103 Q100 105.5 102 103" fill="none" stroke={shade(skin, -0.3)} strokeWidth="2" strokeLinecap="round" />
      {isFemale ? (
        <g>
          <path d="M91 111 Q100 125 109 111Z" fill="#c2455a" stroke="#8f2f45" strokeWidth="1.5" strokeLinejoin="round" />
          <ellipse cx="100" cy="118" rx="4.5" ry="2.4" fill="#ff8fa3" />
        </g>
      ) : (
        <path d="M92 114 Q100 121 108 114" fill="none" stroke="#9d4956" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* 5. Front hair and purchased accessories */}
      {hairParts.front}
      {accessoryArt}
    </svg>
  );
}
