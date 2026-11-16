import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectImage } from "./project-image";

describe("ProjectImage two-tier", () => {
  const base = { title: "Adirondack Chair", slug: "adirondack-chair", lineCount: 10, number: 4 };

  it("renders the photoreal <img> when imageUrl is set (photo tier)", () => {
    const html = renderToStaticMarkup(
      <ProjectImage {...base} imageUrl="/projects/adirondack-chair.jpg" />
    );
    expect(html).toContain('<img');
    expect(html).toContain('src="/projects/adirondack-chair.jpg"');
    expect(html).toContain('class="thumb"');
    expect(html).not.toContain('<svg');
  });

  it("renders the free deterministic SVG when imageUrl is null (free tier)", () => {
    const html = renderToStaticMarkup(<ProjectImage {...base} imageUrl={null} />);
    expect(html).toContain('<svg');
    expect(html).toContain('class="thumb-icon"');
    expect(html).not.toContain('<img');
    // The caption derives from the project data, not a model call.
    expect(html).toContain('ADIRONDACK CHAIR');
    expect(html).toContain('aria-label="Illustration for Adirondack Chair"');
    // Regression guard: the drawing must be VISIBLE. Without a stroke on the
    // line/path/rect primitives they render invisible against the white fill,
    // producing the "blank white square" bug. The blueprint group must carry the
    // stroke so the glyph actually draws.
    expect(html).toContain('stroke="#111111"');
    // React serializes the JSX strokeWidth/strokeLinecap camelCase props to the
    // DOM's kebab-case stroke-width / stroke-linecap attributes.
    expect(html).toContain('stroke-width="1.5"');
    expect(html).toContain('stroke-linecap="round"');
    expect(html).toContain('stroke-linejoin="round"');
    // Regression guard: the svg must carry its own explicit width/height attributes.
    // The container div sets aspect-ratio, but that does NOT cascade to the svg; with
    // only a viewBox and CSS `width:100%; height:auto`, a width/height-less svg collapses
    // its height to 0 — the drawing then occupies a zero-height box inside the bordered
    // placeholder and is invisible (the "blank box" bug). The svg's own width/height
    // attributes give it intrinsic dimensions so `height:auto` resolves to the 4:3 size.
    expect(html).toContain('width="250"');
    expect(html).toContain('height="188"');
    // Regression guard: the primitives must render as REAL svg elements, not as
    // escaped text. Building the drawing with `lines.join("")` (a markdown string)
    // made React serialize `<line .../>` as the literal-escaped text
    // `&lt;line ...&gt;` inside the <g> — so nothing drew and the box stayed blank.
    // With real elements in the array, the html must contain an actual `<line ` or
    // `<path ` node (not `&lt;line`), so the glyph is genuinely visible.
    expect(html).toMatch(/<(line|path|rect)\b/);
    expect(html).not.toContain("&lt;line");
    expect(html).not.toContain("&lt;path");
  });

  it("is deterministic: same project draws the same glyph both times", () => {
    const a = renderToStaticMarkup(<ProjectImage {...base} imageUrl={null} />);
    const b = renderToStaticMarkup(<ProjectImage {...base} imageUrl={null} />);
    expect(a).toBe(b);
  });

  it("differs across projects: no two slugs draw byte-identical glyphs", () => {
    const a = renderToStaticMarkup(
      <ProjectImage title="Shed" slug="shed" lineCount={8} imageUrl={null} />
    );
    const b = renderToStaticMarkup(
      <ProjectImage title="Bowl" slug="bowl" lineCount={12} imageUrl={null} />
    );
    expect(a).not.toBe(b);
  });

  it("draws from the project's construction steps (blueprint of the real build)", () => {
    // The STEPS describe the build, so the gate draws a gate: uprights, rails and a brace.
    const steps = [
      "Cut the two rails and three uprights from cedar, then lay them on a flat surface and clamp.",
      "Set the diagonal brace from the bottom hinge corner to the top latch corner so the gate self-squares.",
      "Screw the brace into the uprights then screw the rails to the uprights.",
      "Cut the two posts, set them plumb in concrete.",
      "Hang the gate on heavy galvanised hinges and fit a drop rod so the latch is not the only keeper.",
    ];
    const html = renderToStaticMarkup(
      <ProjectImage title="Cedar Gate" slug="cedar-gate" lineCount={9} imageUrl={null} steps={steps} />
    );
    // A step-derived gate draws 3 uprights (vertical lines, one per picket) ...
    expect(html).toMatch(/<line /);
    // ... and the plan group scales into the 250x188 viewBox (not a zero-size box).
    expect(html).toContain('transform="translate(6 5) scale(2.38 1.52)"');
    // The caption derives from the project's own title, not a model call.
    expect(html).toContain("CEDAR GATE");
  });

  it("draws different recognisable plans for different project kinds", () => {
    const gateSteps = [
      "Cut the two rails and three uprights from cedar.",
      "Set the diagonal brace so the gate self-squares.",
    ];
    const tableSteps = [
      "Cut the top, four legs and six aprons to the small dimensions.",
      "Screw the legs to the aprons, then screw the aprons under the table top.",
    ];
    const gate = renderToStaticMarkup(
      <ProjectImage title="Gate" slug="my-gate" lineCount={6} imageUrl={null} steps={gateSteps} />
    );
    const table = renderToStaticMarkup(
      <ProjectImage title="Table" slug="my-table" lineCount={6} imageUrl={null} steps={tableSteps} />
    );
    // Both are drawings, neither is an <img>.
    expect(gate).toContain('<svg');
    expect(table).toContain('<svg');
    // A gate and a table are not byte-identical: they are recognisably different plans.
    expect(gate).not.toBe(table);
  });

  it("for an empty material list falls back to the seeded abstract shape, still drawn", () => {
    const html = renderToStaticMarkup(
      <ProjectImage title="Sole" slug="sole" lineCount={4} imageUrl={null} materials={[]} />
    );
    expect(html).toContain('<svg');
    expect(html).toContain('stroke="#111111"');
    expect(html).toMatch(/<(line|path|rect)\b/);
    expect(html).not.toContain("&lt;line");
  });
});