// Real-browser check of the cost-breakdown charts on /projects/simple-wooden-chair (issue #8).
// Run through verify.sh:  verify.sh drive RUN_ID cost-charts
// Usage (direct): node cost-charts.mjs <base-url> <evidence-dir>
// Writes <evidence-dir>/cost-charts.json and cost-charts-{loaded,after-untick}.png; exits 1 on any
// failed expectation. Totals are read from the page and cross-checked against the grid's own
// total, so only the "+ $99.00 drill" delta depends on contract/fixtures/chair.json.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const [base, out] = process.argv.slice(2);
const cents = (s) => Math.round(parseFloat(s.replace(/[^0-9.]/g, "")) * 100);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));

const summary = () => page.locator("#cost-charts-summary").innerText();
const parse = (text) => ({
  tools: cents(text.match(/Tools: (\$[\d,.]+)/)[1]),
  materials: cents(text.match(/Materials: (\$[\d,.]+)/)[1]),
  total: cents(text.match(/Total to buy: (\$[\d,.]+)/)[1]),
});
const got = {};
const checks = [];
const expect = (name, ok, detail) => checks.push({ name, ok: Boolean(ok), detail });

try {
  await page.goto(`${base}/projects/simple-wooden-chair`, { waitUntil: "networkidle" });
  await page.waitForSelector("#cost-by-category canvas", { timeout: 15000 });
  await page.waitForSelector("#cost-by-retailer canvas", { timeout: 15000 });
  got.mode = await page.locator("#cost-charts").getAttribute("data-charts");
  got.before = parse(await summary());
  got.gridTotalBefore = await page.locator("#materials-total").innerText();
  await page.screenshot({ path: `${out}/cost-charts-loaded.png`, fullPage: true });

  expect("both charts render a canvas", true, "category + retailer");
  expect("no licence key -> Community mode", got.mode === "community", got.mode);
  expect("tools + materials = total", got.before.tools + got.before.materials === got.before.total, JSON.stringify(got.before));
  expect("chart total equals grid total", got.before.total === cents(got.gridTotalBefore), `${got.before.total} vs ${got.gridTotalBefore}`);

  // Untick the first "Already own it" box: that line goes back into the spend.
  const box = page.locator("#materials-grid input[type=checkbox]:checked").first();
  got.untickRow = await box.locator("xpath=ancestor::div[@row-id]").getAttribute("row-id");
  await box.click();
  await page.waitForTimeout(500);
  got.after = parse(await summary());
  got.gridTotalAfter = await page.locator("#materials-total").innerText();
  await page.screenshot({ path: `${out}/cost-charts-after-untick.png`, fullPage: true });

  expect("untick adds the line to the charts (+$99.00 tools)", got.after.tools - got.before.tools === 9900 && got.after.materials === got.before.materials, JSON.stringify(got.after));
  expect("chart total still equals grid total after toggle", got.after.total === cents(got.gridTotalAfter), `${got.after.total} vs ${got.gridTotalAfter}`);
  expect("no console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
} catch (e) {
  expect("driver ran to the end", false, String(e));
} finally {
  await browser.close();
}

const failed = checks.filter((c) => !c.ok);
writeFileSync(`${out}/cost-charts.json`, JSON.stringify({ got, checks, consoleErrors }, null, 2));
for (const c of checks) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.name}${c.ok ? "" : ` -> ${c.detail}`}`);
process.exit(failed.length ? 1 : 0);
