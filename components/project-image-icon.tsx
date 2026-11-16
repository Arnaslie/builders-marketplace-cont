// Free image tier: a deterministic vector glyph drawn from the project's own data,
// so ANY project gets a card visual with ZERO image-generation cost. This is the tier that
// lets the catalogue scale to thousands of projects without paying for images up front.
//
// The glyph is a simple blueprint-style line drawing (black on white, one accent rule),
// derived from the slug and the line/item count: same project always draws the same glyph,
// different projects draw different glyphs. No model call, no raster asset, no network.
// The look matches the site's 1994 retro-terminal language: flat, ruled, no fill except a
// single accent plate for the project number plate.

type Props = { title: string; slug: string; lineCount: number; number?: number };

// A small, stable PRNG seeded from the slug so every project draws its own variant but
// the output is deterministic (no Math.random, so SSR/hydration never diverge).
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

export function ProjectImageIcon({ title, slug, lineCount, number }: Props) {
  const rand = mulberry32(hashSeed(slug));
  const width = 250;
  const height = 188; // 4:3 to match the photoreal JPGs it substitutes for

  // A concrete "object silhouette" built from a few primitives, chosen deterministically:
  // vertical posts + angled battens (furniture/frames), a peak (sheds/structures), or a
  // bowl (containers/ovens). The exact geometry wobbles per project so no two glyphs match.
  const kind = rand();
  const posts = 2 + Math.floor(rand() * 2); // 2-3 vertical members
  const battens = Math.min(3 + (lineCount % 3), 5); // how many slats/battens
  const peak = kind > 0.66;
  const bowl = kind <= 0.33;

  // A dirty-plastic plate for the number, echoing the seals/banners used elsewhere.
  const plateFill = number ? "#fffff0" : "#ffffff";

  const lines: string[] = [];
  const lx = (x: number) => (x / 100) * width;
  const ly = (y: number) => (y / 100) * height;

  if (bowl) {
    // A vessel: two walls and a curve across the mouth.
    const w = 30 + rand() * 20;
    const x0 = (100 - w) / 2;
    const h = 26 + rand() * 14;
    const yb = 76;
    lines.push(`<path d="M ${x0} ${yb - h} L ${x0} ${yb} Q 50 ${yb + 14 * rand()} ${100 - x0} ${yb} L ${100 - x0} ${yb - h}" />`);
    lines.push('<path d="M 18 52 Q 50 44 82 52" />');
  } else if (peak) {
    // A gabled structure: roof peak plus a ridgeline and door.
    lines.push(`<path d="M 14 76 L 50 ${46 - rand() * 8} L 86 76" />`);
    lines.push('<path d="M 24 76 L 50 54 L 76 76" opacity="0.7" />');
    lines.push('<rect x="44" y="62" width="12" height="14" />');
  } else {
    // A frame/stand: posts and slats, like a chair or shelf.
    for (let i = 0; i < posts; i++) {
      const x = 22 + (i * 28) + rand() * 4;
      lines.push(`<line x1="${x}" y1="${30 + rand() * 6}" x2="${x}" y2="78" />`);
    }
    for (let i = 0; i < battens; i++) {
      const y = 38 + i * 9;
      lines.push(`<line x1="18" y1="${y}" x2="82" y2="${y}" />`);
    }
  }

  const accentRule = Math.round(lineCount % 7) + 1;

  return (
    <svg
      className="thumb-icon"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Illustration for ${title}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      {/* The blueprint strokes: without this group the line/path/rect primitives have no
          stroke attribute or rule, so they render invisible against the white fill — a
          blank white square. The group supplies the black outline so the drawing shows. */}
      <g stroke="#111111" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {lines.join("")}
      </g>
      {number != null && (
        <g transform={`translate(${lx(78)} ${ly(12)})`}>
          <rect x="0" y="0" width="14" height="14" fill={plateFill} stroke="#000000" strokeWidth="1" />
          <text x="7" y="11" textAnchor="middle" fontSize="10" fontFamily="Times, serif" fontWeight="700">
            {number}
          </text>
        </g>
      )}
      <text
        x={4}
        y={height - 10}
        fontSize={Math.max(9, Math.min(13, 200 / Math.max(title.length, 8)))}
        fontFamily="Times, serif"
        fill="#444444"
      >
        {title.toUpperCase()} · {accentRule}-RULE DRAWING
      </text>
    </svg>
  );
}