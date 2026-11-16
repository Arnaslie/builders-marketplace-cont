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
});