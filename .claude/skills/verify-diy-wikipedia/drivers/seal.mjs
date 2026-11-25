// Browser check of the masthead seal (Playwright, Chromium).
// Run through verify.sh:  verify.sh drive RUN_ID seal
// Usage (direct): node seal.mjs <base-url> <evidence-dir>
//
// Two passes per route, at desktop width. LABEL pass: WebGL is stubbed off via an init script, so
// the three.js coin never builds and the server-rendered flat SVG stays visible; the driver reads
// its top-arc <textPath> (must be "BUILDERS MARKETPLACE") and confirms no red lower-band label
// (fill "#c8102e") remains. ROTATION pass: WebGL is live and the coin builds; the driver reads the
// `data-spinning` route attribute and the coin's `data-rotation` angle twice, two seconds apart —
// the angle must advance on `/` and hold at exactly 0 elsewhere. Exits 1 on any failed expectation.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const [base, out] = process.argv.slice(2);
const PATHS = [
  { name: "index", path: "/", spins: true },
  { name: "project", path: "/projects/simple-wooden-chair", spins: false },
  { name: "recommend", path: "/recommend", spins: false },
];

// Replaces the webgl/webgl2 context with null so hasWebGL() is false and the flat SVG stays.
const NO_WEBGL = () => {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (type === "webgl" || type === "webgl2") return null;
    return orig.call(this, type, ...rest);
  };
};

const browser = await chromium.launch();
const results = [];
const failures = [];

for (const target of PATHS) {
  // ---- LABEL pass: flat SVG kept visible ----
  const svgPage = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await svgPage.addInitScript(NO_WEBGL);
  const svgRes = await svgPage.goto(`${base}${target.path}`, { waitUntil: "networkidle" });
  const label = await svgPage.evaluate(() => {
    const seal = document.querySelector(".masthead .seal");
    const texts = [...(seal?.querySelectorAll("text") ?? [])];
    return {
      spinning: seal?.getAttribute("data-spinning") ?? "",
      topText: texts.find((t) => t.querySelector("textPath"))?.textContent?.trim() ?? "",
      redLowerCount: texts.filter((t) => t.getAttribute("fill") === "#c8102e").length,
    };
  });
  const svgShot = `seal-label-${target.name}.png`;
  const svgBox = await svgPage.locator(".masthead .seal").boundingBox();
  if (svgBox) {
    await svgPage.screenshot({
      path: `${out}/${svgShot}`,
      clip: { x: svgBox.x, y: svgBox.y, width: svgBox.width, height: svgBox.height },
    });
  } else {
    await svgPage.screenshot({ path: `${out}/${svgShot}`, fullPage: true });
  }

  // ---- ROTATION pass: WebGL live, coin builds ----
  const coinPage = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  coinPage.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  coinPage.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  const res = await coinPage.goto(`${base}${target.path}`, { waitUntil: "networkidle" });
  await coinPage
    .waitForFunction(
      () => document.querySelector(".masthead .seal")?.hasAttribute("data-rotation"),
      { timeout: 5000 },
    )
    .catch(() => {});
  const readRot = () =>
    coinPage.evaluate(() => Number(document.querySelector(".masthead .seal")?.dataset.rotation ?? "0"));
  const first = await readRot();
  const coinShot = `seal-spin-${target.name}.png`;
  const coinBox = await coinPage.locator(".masthead .seal").boundingBox();
  if (coinBox) {
    await coinPage.screenshot({
      path: `${out}/${coinShot}`,
      clip: { x: coinBox.x, y: coinBox.y, width: coinBox.width, height: coinBox.height },
    });
  }
  await coinPage.waitForTimeout(2000);
  const second = await readRot();

  const row = {
    path: target.path,
    status: res?.status(),
    spins: target.spins,
    spinning: label.spinning,
    topText: label.topText,
    redLowerCount: label.redLowerCount,
    rotationFirst: first,
    rotationSecond: second,
    delta: second - first,
    errors,
    svgShot,
    coinShot,
  };
  results.push(row);

  const tag = target.name;
  if (row.status !== 200) failures.push(`${tag}: HTTP ${row.status}`);
  if (row.spinning !== (target.spins ? "true" : "false")) {
    failures.push(`${tag}: data-spinning is "${row.spinning}", expected ${target.spins ? "true" : "false"}`);
  }
  if (row.topText !== "BUILDERS MARKETPLACE") {
    failures.push(`${tag}: top-arc label is "${row.topText}"`);
  }
  if (row.redLowerCount !== 0) failures.push(`${tag}: ${row.redLowerCount} red lower-band label(s) remain`);
  if (target.spins && row.delta <= 0) {
    failures.push(`${tag}: rotation did not advance (${row.rotationFirst} -> ${row.rotationSecond})`);
  }
  if (!target.spins && row.delta !== 0) {
    failures.push(`${tag}: seal rotated on a static page (${row.rotationFirst} -> ${row.rotationSecond})`);
  }
  if (errors.length) failures.push(`${tag}: console errors: ${errors.join(" | ")}`);

  await svgPage.close();
  await coinPage.close();
}

await browser.close();
writeFileSync(`${out}/seal.json`, JSON.stringify({ results, failures }, null, 2));
for (const r of results) {
  console.log(
    `${r.path.padEnd(34)} spins=${String(r.spins).padEnd(5)} data-spinning=${r.spinning} label="${r.topText}" redLower=${r.redLowerCount} rot ${r.rotationFirst} -> ${r.rotationSecond} (Δ ${r.delta}) errors=${r.errors.length}`,
  );
}
if (failures.length) {
  console.log("FAIL\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("PASS");
