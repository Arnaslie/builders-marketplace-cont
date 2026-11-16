// Free image tier: a deterministic vector blueprint drawn from the project's OWN
// construction steps, so ANY project gets a card visual with ZERO image-generation
// cost. This is the tier that lets the catalogue scale to thousands of projects without
// paying for images up front.
//
// The drawing is a pencil-line blueprint of the real build. The STEPS text tells us the
// structure: the pieces it names ("two rails and three uprights", "four legs", "three
// shelf boards") and how they go together ("diagonal brace", "frame", "cleats", "rod").
// So a gate draws a gate — three uprights, a top and bottom rail, and a diagonal brace —
// and a shelf draws a shelf with its real number of boards. Same project always draws the
// same plan; different projects draw recognisably different ones, each echoing the build
// described in the steps on the page below it. No model call, no raster asset, no network.
// The look matches the site's 1994 retro-terminal language: flat, ruled, black on white.

import type { ReactElement } from "react";

// A material as it appears on the project page; used for dimension labels on the drawing.
export type GlyphMaterial = { name: string; category: "tool" | "material" };

type Props = {
  title: string;
  slug: string;
  lineCount: number;
  number?: number;
  materials?: GlyphMaterial[];
  // The real construction steps (project.steps) — the source of truth for the drawing.
  steps?: string[];
};

const W = 250;
const H = 188;

// ------------------------- deterministic helpers -------------------------
// A small, stable PRNG seeded from the slug so variation is deterministic across
// SSR/hydration and re-renders (no Math.random ever).
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Meaningful initials of a material name, used as dimension labels on the plan.
const STOP_WORD = new Set([
  "in", "x", "ft", "foot", "feet", "lb", "lbs", "oz", "qt", "gal", "pt",
  "pc", "pcs", "pk", "pack", "ea", "each", "no", "of", "with", "and", "mm", "cm", "bag", "kit", "set",
]);
function initials(name: string): string {
  const words = name
    .trim()
    .split(/[\s,]+/)
    .filter((w) => /^[a-zA-Z]{2,}$/.test(w) && !STOP_WORD.has(w.toLowerCase()));
  if (words.length === 0) return "";
  const a = words[words.length - 2];
  const b = words[words.length - 1];
  return (a ? a.charAt(0).toUpperCase() : "") + b.charAt(0).toUpperCase();
}

// Read the counts of structural members out of the step text. We look for a small
// number-word (< "ten") immediately before a structural noun, so "two rails and three
// uprights" yields { rails: 2, uprights: 3 } and "four legs" yields { legs: 4 }.
const NUM_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, "2x4": 0, "4x4": 0,
};
// Match a structural noun whether the text says "upright" or "uprights" (prefix match
// on the stem), then read the number word straight before it: "three uprights" -> 3.
function countFrom(words: string[], noun: string): number {
  let n = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].startsWith(noun)) {
      const prev = words[i - 1];
      if (prev && NUM_WORDS[prev]) n = Math.max(n, NUM_WORDS[prev]);
      else if (prev && /^\d+$/.test(prev)) n = Math.max(n, +prev);
    }
  }
  return n;
}

// ------------------------- step-derived plan -------------------------
type Plan = {
  kind: "gate" | "table" | "bench" | "shelf" | "planter" | "cage" | "stand" | "rack" | "fridge" | "generic";
  counts: Record<string, number>;
};

function derivePlan(steps: string[]): Plan {
  const text = (steps ?? []).join(" ").toLowerCase();
  const words = text.split(/[\s,]+/);

  const has = (...ks: string[]) => ks.some((k) => text.includes(k));
  const count = (noun: string) => countFrom(words, noun);
  const pick = (a: number, b: number) => (a > 0 ? a : b);

  // The silhouette is chosen by the strongest structural signal in the steps, and the
  // member counts are read straight from the text ("three uprights" -> 3). Ordered from
  // most specific to most generic so a workbench doesn't get mistaken for a plain shelf.
  if (has("cage", "cylinder", "wire mesh")) {
    return { kind: "cage", counts: { cages: pick(count("length"), 6) } };
  }
  if (has("gate", "picket", "drop rod", "latch", "hinge")) {
    return {
      kind: "gate",
      counts: {
        rails: pick(count("rail"), 2),
        uprights: pick(count("upright"), 3),
        posts: pick(count("post"), 2),
      },
    };
  }
  if (has("magnet", "fridge", "jars", "spice")) {
    return { kind: "fridge", counts: { strips: pick(count("strip"), 3) } };
  }
  if (has("standard", "wardrobe", "closet", "closet rod")) {
    return { kind: "rack", counts: { standards: pick(count("standard"), 2), shelves: pick(count("shelf"), 1) } };
  }
  if (has("planter", "raised bed", "drainage", "corner block", "flower", "pot")) {
    return { kind: "planter", counts: { sides: pick(count("side"), 4) } };
  }
  if (has("table", "desk", "workbench", "mitered edge")) {
    return { kind: "table", counts: { legs: pick(count("leg"), 4), slabs: pick(count("slab"), 2) } };
  }
  if (has("bench", "seat", "seat slat", "hinge it", "storage liner", "arm")) {
    return { kind: "bench", counts: { seats: pick(count("seat"), 2), slats: pick(count("slat"), 3), legs: pick(count("leg"), 4) } };
  }
  if (has("pegboard", "peg", "hook", "hanger")) {
    return { kind: "rack", counts: { panels: pick(count("panel"), 1) } };
  }
  if (has("shelf", "cleat", "stud", "level")) {
    return { kind: "shelf", counts: { boards: pick(count("board"), 3), shelves: pick(count("shelf"), 3) } };
  }
  if (has("bowl", "circular", "cutout", "crosspiece", "pilot hole")) {
    return { kind: "stand", counts: { sides: pick(count("side"), 2) } };
  }
  return { kind: "generic", counts: {} };
}

// ------------------------- primitives -------------------------
// A tiny builder so the plan is composed of real <line>/<rect>/<path> React elements
// (never strings, never escaped text), each carrying a stable key for React hydration.
function drawPlan(kind: string, counts: Record<string, number>, rand: () => number) {
  const els: ReactElement[] = [];
  let k = 0;
  const L = (x1: number, y1: number, x2: number, y2: number, extra?: Record<string, string | number>) =>
    els.push(<line key={k++} x1={x1} y1={y1} x2={x2} y2={y2} {...(extra as any)} />);
  const R = (x: number, y: number, w: number, h: number, extra?: Record<string, string | number>) =>
    els.push(<rect key={k++} x={x} y={y} width={w} height={h} {...(extra as any)} />);
  const P = (d: string, extra?: Record<string, string | number>) =>
    els.push(<path key={k++} d={d} {...(extra as any)} />);

  const m = (n: number) => n + rand() * 0.6 - 0.3; // small deterministic wobble

  if (kind === "gate") {
    const uprights = Math.min(Math.max(counts.uprights || 3, 1), 5);
    const rails = Math.min(Math.max(counts.rails || 2, 1), 3);
    const gap = 46 / (uprights - 1 || 1);
    // Uprights (pickets).
    for (let i = 0; i < uprights; i++) {
      const x = 27 + i * gap;
      L(m(x), 30, m(x), 74);
    }
    // Top + bottom rails.
    for (let r = 0; r < rails; r++) {
      const y = 30 + r * (rails > 1 ? 22 : 44);
      L(20, m(y), 80, m(y));
    }
    // Diagonal Z-brace.
    L(22, m(70), 78, m(34), { strokeDasharray: "3 2" });
    // Two posts in the ground.
    L(16, 74, 16, 84); L(84, 74, 84, 84);
    R(12, 84, 8, 3); R(80, 84, 8, 3);
  } else if (kind === "table") {
    const legs = Math.min(Math.max(counts.legs || 4, 2), 4);
    const x0 = 33, x1 = 67, yTop = 28, yBottom = 74;
    // Tabletop slab.
    R(m(x0 - 6), m(yTop), m(x1 - x0 + 12), 4);
    // Apron line just under the top.
    L(x0, yTop + 8, x1, yTop + 8);
    // Legs.
    const span = (x1 - x0);
    for (let i = 0; i < legs; i++) {
      const lx = x0 + (i / (legs - 1 || 1)) * span;
      L(m(lx), yTop + 8, m(lx), yBottom);
    }
    // Lower shelf.
    L(x0 - 2, yBottom - 8, x1 + 2, yBottom - 8);
  } else if (kind === "bench") {
    // A bench in elevation: a tall back panel, a seat, and two legs, plus slats.
    // Reads as a storage bench (or workbench) rather than a stack of shelves.
    const slats = Math.min(Math.max(counts.slats || counts.seats || 3, 1), 5);
    // Back.
    R(m(30), m(24), m(40), 3);        // back cap
    L(m(32), 27, m(32), 62);          // back left
    L(m(68), 27, m(68), 62);          // back right
    // Seat.
    R(m(26), m(62), m(48), 4);
    // Legs.
    L(m(30), 66, m(30), 78);
    L(m(70), 66, m(70), 78);
    // Slats under the front edge.
    for (let i = 0; i < slats; i++) {
      const x = 34 + i * (44 / Math.max(slats - 1, 1));
      L(m(x), 40, m(x), 58);
    }
  } else if (kind === "shelf") {
    const boards = Math.min(Math.max(counts.boards || counts.shelves || 3, 1), 5);
    const y0 = 40;
    const gap = 26 / Math.max(boards - 1, 1);
    // Two side panels.
    L(24, 28, 24, 78); L(76, 28, 76, 78);
    // Shelf boards.
    for (let i = 0; i < boards; i++) L(m(24), m(y0 + i * gap), m(76), m(y0 + i * gap));
  } else if (kind === "planter") {
    // A raised bed / planter box drawn as a FRONT ELEVATION: two side walls, a soil
    // fill line just below the rim, and a little plant. Reads as a planter, not paper.
    const w = 34 + Math.min(Math.max(counts.sides || 4, 3), 6); // wider box for more sides
    const x0 = 50 - w / 2, x1 = 50 + w / 2;
    const top = 34, bottom = 72;
    // Body: two side walls and a base.
    L(m(x0), m(top), m(x0), m(bottom));
    L(m(x1), m(top), m(x1), m(bottom));
    L(m(x0), m(bottom), m(x1), m(bottom));
    // Rim lip.
    L(m(x0 - 3), m(top), m(x1 + 3), m(top));
    // Soil fill line partway down.
    L(m(x0), m(top + 8), m(x1), m(top + 8));
    // A small plant in the middle.
    L(50, m(bottom - 2), 50, m(top + 14));
    L(46, m(top + 20), 50, m(top + 14)); L(54, m(top + 20), 50, m(top + 14));
  } else if (kind === "cage") {
    const cages = Math.min(Math.max(counts.cages || 6, 1), 6);
    // A row of cylindrical cages, each a cone of two posts + a top ring.
    const gap = 54 / cages;
    for (let i = 0; i < cages; i++) {
      const cx = 20 + gap * i + gap / 2;
      L(m(cx), 78, m(cx - 6), 44); // left wire
      L(m(cx), 78, m(cx + 6), 44); // right wire
      P(`M ${m(cx - 6)} 44 A 6 4 0 0 1 ${m(cx + 6)} 44`); // top ring
    }
  } else if (kind === "stand") {
    // Two side panels with a circular bowl cutout, a top crosspiece and a low shelf.
    L(26, 28, 26, 78); L(74, 28, 74, 78);       // sides
    L(22, 28, 78, 28);                            // top crosspiece
    L(22, 68, 78, 68);                            // lower shelf
    L(50, 50, 56, 56); L(56, 50, 50, 56);         // bowl cutout marker
  } else if (kind === "fridge") {
    // A fridge face (right-side rect) with three horizontal magnetic strips + jars.
    R(52, 30, 28, 48);
    const strips = Math.min(Math.max(counts.strips || 3, 1), 3);
    const gap = 24 / Math.max(strips - 1, 1);
    for (let i = 0; i < strips; i++) {
      const y = 42 + i * gap;
      L(56, m(y), 76, m(y));                       // magnetic strip
      L(50, m(y) - 6, 56, m(y) - 6); L(50, m(y) + 6, 56, m(y) + 6); // jar
    }
  } else if (kind === "rack") {
    // Two uprights (or panels) with a hanging rod / shelf lines.
    const standards = Math.min(Math.max(counts.standards || counts.panels || 2, 1), 4);
    const gap = 40 / Math.max(standards - 1, 1);
    for (let i = 0; i < standards; i++) {
      const x = 22 + i * gap;
      L(m(x), 30, m(x), 78);
    }
    L(18, 34, 82, 34);  // top rail / rod
    L(18, 50, 82, 50);  // lower shelf line
  } else {
    // generic: a clean labelled elevation — a top, a body, and a base. Never a grid.
    R(m(38), m(28), m(24), 5);     // top slab
    R(m(44), m(33), m(12), m(41)); // body
    R(m(36), m(74), m(28), 4);     // base
  }
  return els;
}

// ------------------------- component -------------------------
export function ProjectImageIcon({ title, slug, lineCount, number, materials, steps }: Props) {
  const rand = mulberry32(hashSeed(slug));
  const plan = derivePlan(steps ?? []);
  const planEls = drawPlan(plan.kind, plan.counts, rand);

  // Dimension labels from the real materials (optional; badges sit off the drawing).
  const tags = (materials ?? []).filter((m) => m.category === "material").map((m) => initials(m.name)).filter(Boolean);

  const plateFill = number ? "#fffff0" : "#ffffff";
  const lx = (x: number) => (x / 100) * W;
  const ly = (y: number) => (y / 100) * H;
  const accentRule = Math.round(lineCount % 7) + 1;

  return (
    <svg
      className="thumb-icon"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Illustration for ${title}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      {/* Blueprint strokes: this group supplies the black outline so the plan actually draws
          against the white fill (the "blank white square" bug). Primitives are real elements,
          never escaped text. The plan is drawn in a 0-100 unit space; transform scales it into
          the 250x188 viewBox and nudges it up so the caption lines sit below the drawing. */}
      <g
        stroke="#111111"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={"translate(6 5) scale(2.38 1.52)"}
      >
        {planEls}
      </g>
      {number != null && (
        <g transform={`translate(${lx(78)} ${ly(12)})`}>
          <rect x="0" y="0" width="14" height="14" fill={plateFill} stroke="#000000" strokeWidth="1" />
          <text x="7" y="11" textAnchor="middle" fontSize="10" fontFamily="Times, serif" fontWeight="700">
            {number}
          </text>
        </g>
      )}
      {/* Single row of real-material dimension labels under the drawing, if we have any. */}
      {tags.length > 0 && (
        <text x={6} y={H - 26} fontSize="9" fontFamily="Times, serif" fill="#666666">
          {"·"} {tags.slice(0, 6).join("  ·  ")}
        </text>
      )}
      <text
        x={4}
        y={H - 8}
        fontSize={Math.max(9, Math.min(13, 200 / Math.max(title.length, 8)))}
        fontFamily="Times, serif"
        fill="#444444"
      >
        {title.toUpperCase()} · {accentRule}-RULE DRAWING
      </text>
    </svg>
  );
}