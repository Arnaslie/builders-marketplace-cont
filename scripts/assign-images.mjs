// Tier-mapping helper for the two-tier image pipeline.
//
// Usage (from repo root):
//   node scripts/assign-images.mjs            # report which tier each project is on
//   node scripts/assign-images.mjs --backfill # write imageUrl into fixtures that have a photo
//
// The economics: a project is on the PHOTO tier only when a photoreal asset already exists at
// public/projects/<slug>.jpg. Everything else stays FREE (deterministic SVG). So the catalogue
// can grow to thousands of projects with zero marginal generation cost — an operator generates
// a photoreal image ONLY for a project that earns one, drops the JPG in public/projects/, and
// this script promotes that project to the photo tier. One gate, nothing else.
//
// Reads NO network, makes NO image-model calls. Pure local file + fixture scanning.
//
// The original frozen repo (builders-marketplace) is never touched; this runs on the fork only.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "contract", "fixtures");
const imagesDir = join(root, "public", "projects");

async function main() {
  const backfill = process.argv.includes("--backfill");
  const fixed = process.argv.includes("--fix");

  const files = (await readdir(fixturesDir)).filter((f) => f.endsWith(".json"));
  let photo = 0;
  let missing = 0;
  let updated = 0;

  for (const file of files) {
    const path = join(fixturesDir, file);
    const fixture = JSON.parse(await readFile(path, "utf8"));
    const slug = fixture.slug;
    const expected = `/projects/${slug}.jpg`;
    const hasPhoto = existsSync(join(imagesDir, `${slug}.jpg`));

    const tier = hasPhoto ? "PHOTO" : "FREE";
    if (hasPhoto) photo++;
    else missing++;

    if (hasPhoto && fixture.imageUrl !== expected && (backfill || fixed)) {
      fixture.imageUrl = expected;
      await writeFile(path, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
      updated++;
      console.log(`${tier}\t${file}\t-> imageUrl = ${expected}`);
    } else {
      console.log(`${tier}\t${file}\t${fixture.imageUrl ?? "(none)"}`);
    }
  }

  console.log("\nSummary:");
  console.log(`  fixtures scanned : ${files.length}`);
  console.log(`  photo tier       : ${photo}  (have a public/projects JPG)`);
  console.log(`  free tier        : ${missing}  (deterministic SVG, zero cost)`);
  if (updated) console.log(`  imageUrl written : ${updated}`);
  if (photo === 0) {
    console.log("\nNO photoreal assets found. Every project renders the free SVG. That is fine.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});