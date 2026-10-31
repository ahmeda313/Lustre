import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/opencode/lustre";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const widths = [390, 768, 1440, 1920];
const report = [];

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 90));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((res) => setTimeout(res, 300));
    window.scrollTo(0, 0);
    await new Promise((res) => setTimeout(res, 400));
  });
  await page.waitForTimeout(400);
}

async function scrollTo(page, selector, offset = 0) {
  await page.evaluate(
    ({ selector, offset }) => {
      const node = document.querySelector(selector);
      if (!node) return;
      window.scrollTo(
        0,
        node.getBoundingClientRect().top + window.scrollY + offset,
      );
    },
    { selector, offset },
  );
  await page.waitForTimeout(550);
}

async function ctaTops(page) {
  return page.locator("#pricing button").evaluateAll((els) =>
    els
      .filter((el) => /Book (exterior|interior|complete)/i.test(el.textContent || ""))
      .map((el) => Math.round(el.getBoundingClientRect().top)),
  );
}

for (const width of widths) {
  const context = await browser.newContext({
    viewport: {
      width,
      height: width < 768 ? 844 : width < 1024 ? 1024 : 1000,
    },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 400));
  });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 400)));

  await page.goto("http://localhost:3000", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1200);
  await settle(page);

  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    docClientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    height: document.documentElement.scrollHeight,
    broken: Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
    overflowers: Array.from(document.querySelectorAll("body *"))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > window.innerWidth + 1);
      })
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName,
        cls: String(el.className).slice(0, 90),
        left: Math.round(el.getBoundingClientRect().left),
        right: Math.round(el.getBoundingClientRect().right),
      })),
    masked: Array.from(document.querySelectorAll(".mask-line > span")).map(
      (el) => ({
        text: (el.textContent || "").slice(0, 24),
        transform: getComputedStyle(el).transform,
      }),
    ),
  }));
  report.push({ width, metrics, errors });
  console.log(`\n=== ${width} ===`);
  console.log(JSON.stringify(metrics, null, 1));
  if (errors.length) console.log("ERRORS", errors);

  await page.screenshot({ path: `${OUT}/${width}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${width}-hero.png` });

  await page.evaluate(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    const skip = document.querySelector('a[href="#main"]');
    if (skip) skip.style.display = "none";
  });

  for (const [name, selector] of [
    ["services", "#services"],
    ["faq", "#faq"],
    ["final", "main > section:last-of-type"],
    ["footer", "footer"],
  ]) {
    const el = page.locator(selector).first();
    if (!(await el.count())) continue;
    await scrollTo(page, selector);
    await el.screenshot({ path: `${OUT}/${width}-${name}.png` });
  }

  const pricing = page.locator("#pricing");
  await scrollTo(page, "#pricing", -72);
  await page.waitForTimeout(500);
  await pricing.screenshot({ path: `${OUT}/${width}-pricing-standard.png` });
  const standardTops = await ctaTops(page);

  await pricing.getByRole("radio", { name: /Brass Member/i }).click();
  await page.waitForTimeout(650);
  const memberTops = await ctaTops(page);
  await pricing.screenshot({ path: `${OUT}/${width}-pricing-member.png` });
  report.push({
    width,
    pricingCtaTopsStandard: standardTops,
    pricingCtaTopsMember: memberTops,
    layoutJump: JSON.stringify(standardTops) !== JSON.stringify(memberTops),
  });

  await scrollTo(page, "#membership", -72);
  await page.waitForTimeout(700);
  await page.locator("#membership").screenshot({
    path: `${OUT}/${width}-membership.png`,
  });
  await page
    .locator('[role="img"][aria-label$="membership card"]')
    .screenshot({ path: `${OUT}/${width}-membership-card.png` });

  await page.evaluate(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "";
  });

  await page
    .locator("#membership")
    .getByRole("button", { name: "Become a member" })
    .click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${width}-membership-drawer.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await scrollTo(page, "#pricing", -72);
  await pricing.getByRole("button", { name: /Book complete/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${width}-booking-member.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await pricing.getByRole("radio", { name: "Standard" }).click();
  await page.waitForTimeout(450);
  await pricing.getByRole("button", { name: /Book exterior/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${width}-booking-standard.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await context.close();
}

// Mobile menu, both drawers, validation and confirmation at 390
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/390-menu.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await page.evaluate(() => document.getElementById("membership")?.scrollIntoView());
  await page.waitForTimeout(600);
  await page
    .locator("#membership")
    .getByRole("button", { name: "Become a member" })
    .click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /continue to payment/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/390-membership-errors.png` });

  await page.fill("#member-field-name", "Asha Rao");
  await page.fill("#member-field-phone", "9845021006");
  await page.fill("#member-field-email", "asha@example.com");
  await page.fill("#member-field-address", "12, 4th Main, Indiranagar, Bengaluru");
  await page.getByRole("button", { name: /continue to payment/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/390-membership-done.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await page.locator("#top").getByRole("button", { name: /book a wash/i }).first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /send request/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/390-drawer-errors.png` });

  await page.fill("#field-name", "Asha Rao");
  await page.fill("#field-phone", "9845021006");
  await page.fill("#field-address", "12, 4th Main, Indiranagar, Bengaluru");
  await page.getByRole("button", { name: /send request/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/390-drawer-done.png` });

  await context.close();
}

// Styleguide and legal at 1440
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const [route, name] of [
    ["/styleguide", "styleguide"],
    ["/privacy", "privacy"],
    ["/terms", "terms"],
    ["/not-a-real-page", "404"],
  ]) {
    const res = await page.goto(`http://localhost:3000${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/1440-${name}.png`, fullPage: true });
    console.log(name, res?.status());
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\nSaved to ${OUT}`);
