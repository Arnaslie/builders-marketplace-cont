// Project picture, or a free deterministic vector glyph while imageUrl is null.
// Two tiers, so catalogue growth never scales image cost:
//  - photo tier: the photoreal finished-build JPG (earned — only generated for projects
//    that earn one), rendered as a plain <img>.
//  - free tier: ProjectImageIcon, an SVG line drawing derived from the project's own data
//    (slug, line count), with ZERO generation cost. Any project shows this instantly.
// A plain <img> is used on purpose: next/image needs each remote host listed in
// next.config, and we do not know the image hosts yet.
import { ProjectImageIcon } from "./project-image-icon";

type Props = { title: string; slug: string; lineCount: number; number?: number; imageUrl: string | null; ratio?: string };

export function ProjectImage({ title, slug, lineCount, number, imageUrl, ratio = "4 / 3" }: Props) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="thumb" src={imageUrl} alt="" style={{ aspectRatio: ratio }} />;
  }
  return (
    <div className="thumb-placeholder" style={{ aspectRatio: ratio }} aria-hidden="true">
      <ProjectImageIcon title={title} slug={slug} lineCount={lineCount} number={number} />
    </div>
  );
}