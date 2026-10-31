import { chromium } from "playwright";

const browser = await chromium.launch();
const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function openPage(context, path = "/") {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 300));
  });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  await page.goto(`http://localhost:3000${path}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
  return { page, errors };
}

function ctaTops(page) {
  return page.locator("#pricing button").evaluateAll((els) =>
    els
      .filter((el) => /Book (exterior|interior|complete)/i.test(el.textContent || ""))
      .map((el) => Math.round(el.getBoundingClientRect().top)),
  );
}

// Desktop, normal motion
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const { page, errors } = await openPage(context);

  check("desktop: no console or page errors", errors.length === 0, errors.join(" | "));
  check(
    "desktop: lenis active",
    await page.evaluate(() => document.documentElement.classList.contains("lenis")),
  );

  const roles = await page.evaluate(() => ({
    groups: Array.from(document.querySelectorAll('[role="radiogroup"]')).map((el) =>
      el.getAttribute("aria-label"),
    ),
    radios: Array.from(document.querySelectorAll('[role="radio"]')).length,
  }));
  check(
    "segmented controls expose radiogroup/radio semantics",
    roles.groups.length === 2 &&
      roles.radios === 5 &&
      roles.groups.includes("Price type") &&
      roles.groups.includes("Vehicle size"),
    JSON.stringify(roles),
  );

  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  const navLabels = await primaryNav.getByRole("link").allTextContents();
  check(
    "primary nav is services, pricing, membership, FAQ",
    JSON.stringify(navLabels.map((label) => label.trim())) ===
      JSON.stringify(["Services", "Pricing", "Membership", "FAQ"]),
    JSON.stringify(navLabels),
  );

  await primaryNav.getByRole("link", { name: "Membership" }).click();
  await page.waitForTimeout(1800);
  const membershipTop = await page.evaluate(() => {
    const el = document.getElementById("membership");
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
  const activeMembership = await page.evaluate(
    () => document.querySelector('nav[aria-label="Primary"] a[data-active="true"]')?.textContent,
  );
  check(
    "membership nav anchor reaches the block",
    membershipTop !== null && Math.abs(membershipTop) < 140,
    `top=${membershipTop}`,
  );
  check("nav active section highlights membership", activeMembership === "Membership", `active=${activeMembership}`);

  const pricingHeading = (await page.locator("#pricing h2").innerText()).replace(/\s+/g, " ").trim();
  check(
    "pricing heading uses member copy",
    pricingHeading === "Simple prices. Even less for members.",
    pricingHeading,
  );

  const pricing = page.locator("#pricing");
  await pricing.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await pricing.getByRole("radio", { name: "SUV" }).click();
  await page.waitForTimeout(300);
  const standardPrice = (
    await pricing.locator(".text-price").last().locator(".sr-only").innerText()
  ).trim();
  check("pricing updates for SUV standard", standardPrice.startsWith("999"), standardPrice);

  const standardTops = await ctaTops(page);
  await pricing.getByRole("radio", { name: /Brass Member/i }).click();
  await page.waitForTimeout(700);
  const memberTops = await ctaTops(page);
  check(
    "member mode animates without moving the CTAs",
    JSON.stringify(standardTops) === JSON.stringify(memberTops),
    `${JSON.stringify(standardTops)} / ${JSON.stringify(memberTops)}`,
  );

  const pricingText = (await pricing.innerText()).replace(/\s+/g, " ");
  check(
    "member mode shows member and struck standard prices",
    pricingText.includes("749") && pricingText.includes("999"),
    pricingText.slice(0, 260),
  );
  check(
    "member mode shows configured saving",
    pricingText.includes("YOU SAVE INR 250 PER WASH"),
    pricingText.slice(0, 320),
  );

  const membership = page.locator("#membership");
  await membership.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const membershipText = (await membership.innerText()).replace(/\s+/g, " ");
  check(
    "membership break-even follows the selected vehicle",
    membershipText.includes("PAYS FOR ITSELF IN 8 COMPLETE WASHES (SUV)"),
    membershipText.slice(0, 360),
  );

  const card = membership.locator('[role="img"][aria-label$="membership card"]');
  const cardMetrics = await card.evaluate((el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      radius: style.borderRadius,
      ratio: Number((rect.width / rect.height).toFixed(3)),
      opacity: getComputedStyle(el.parentElement).opacity,
    };
  });
  check(
    "member card is visible, 12px radius, credit-card ratio",
    cardMetrics.opacity === "1" &&
      cardMetrics.radius === "12px" &&
      Math.abs(cardMetrics.ratio - 1.586) < 0.02,
    JSON.stringify(cardMetrics),
  );

  const membershipTrigger = membership.getByRole("button", { name: "Become a member" });
  await membershipTrigger.click();
  await page.waitForTimeout(600);
  const memberDialog = page.getByRole("dialog");
  const memberDialogText = (await memberDialog.innerText()).replace(/\s+/g, " ");
  check(
    "membership drawer pins the offer summary",
    memberDialogText.includes("LUSTRE BRASS") &&
      memberDialogText.includes("INR 1,999") &&
      memberDialogText.includes("12 MONTHS") &&
      memberDialogText.includes("25% OFF"),
    memberDialogText.slice(0, 260),
  );
  check(
    "membership drawer locks page scroll",
    await page.evaluate(() => {
      const body = document.body;
      return (
        body.hasAttribute("data-scroll-locked") ||
        getComputedStyle(body).overflow === "hidden" ||
        document.documentElement.classList.contains("lenis-stopped")
      );
    }),
  );

  await memberDialog.getByRole("button", { name: /Continue to payment/i }).click();
  await page.waitForTimeout(400);
  const memberErrors = await memberDialog.locator("p[id^='member-error-']").allTextContents();
  const focusedMemberField = await page.evaluate(() => document.activeElement?.id);
  check(
    "membership validation shows inline errors",
    memberErrors.length >= 4,
    memberErrors.join(" | "),
  );
  check("membership validation focuses first field", focusedMemberField === "member-field-name", String(focusedMemberField));

  await page.fill("#member-field-name", "Asha Rao");
  await page.fill("#member-field-phone", "9845021006");
  await page.fill("#member-field-email", "not-an-email");
  await page.fill("#member-field-address", "12, 4th Main, Indiranagar, Bengaluru");
  await memberDialog.getByRole("button", { name: /Continue to payment/i }).click();
  const emailError = memberDialog.locator("#member-error-email");
  await emailError.waitFor({ state: "visible", timeout: 2000 });
  check(
    "membership validation rejects an invalid email",
    (await emailError.innerText()).toLowerCase().includes("valid email"),
    await emailError.innerText(),
  );
  await page.fill("#member-field-email", "asha@example.com");
  await memberDialog.getByRole("button", { name: /Continue to payment/i }).click();
  await page.waitForTimeout(500);
  const confirmationText = (await memberDialog.innerText()).replace(/\s+/g, " ");
  check(
    "membership confirmation is calm and complete",
    confirmationText.includes("Request received.") &&
      confirmationText.includes("WhatsApp shortly") &&
      confirmationText.includes("INR 1,999"),
    confirmationText.slice(0, 320),
  );

  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const focusAfterMembership = await page.evaluate(() => {
    const active = document.activeElement;
    return active ? (active.textContent || "").trim().slice(0, 80) : null;
  });
  check("membership drawer returns focus to trigger", focusAfterMembership === "Become a member", String(focusAfterMembership));

  // Booking drawer in member mode
  await pricing.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await pricing.getByRole("button", { name: /Book complete/i }).click();
  await page.waitForTimeout(600);
  const bookingDialog = page.getByRole("dialog");
  const bookingMemberText = (await bookingDialog.innerText()).replace(/\s+/g, " ");
  check(
    "member booking prefills member pricing",
    bookingMemberText.includes("MEMBER PRICE") &&
      bookingMemberText.includes("INR 749") &&
      bookingMemberText.includes("INR 999") &&
      bookingMemberText.includes("YOU SAVE INR 250 PER WASH"),
    bookingMemberText.slice(0, 300),
  );
  const checkedVehicle = await bookingDialog
    .getByRole("radiogroup", { name: "Vehicle size" })
    .getByRole("radio", { checked: true })
    .innerText();
  check("member booking prefills vehicle", checkedVehicle.trim() === "SUV", checkedVehicle);

  const focusInside = await page.evaluate(async () => {
    const dialog = document.querySelector('[role="dialog"]');
    let inside = true;
    for (let i = 0; i < 14; i++) {
      const focusables = Array.from(
        document.querySelectorAll(
          '[role="dialog"] button, [role="dialog"] input, [role="dialog"] textarea, [role="dialog"] [role="radio"], [role="dialog"] a[href]',
        ),
      ).filter((el) => el.getBoundingClientRect().width > 0);
      const index = focusables.indexOf(document.activeElement);
      const next = focusables[(index + 1) % focusables.length];
      if (next) next.focus();
      if (!dialog?.contains(document.activeElement)) inside = false;
      await new Promise((r) => setTimeout(r, 10));
    }
    return inside;
  });
  check("booking dialog focus stays inside", focusInside);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Standard upsell switches drawer flow
  await pricing.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await pricing.getByRole("radio", { name: "Standard" }).click();
  await page.waitForTimeout(400);
  await pricing.getByRole("button", { name: /Book exterior/i }).click();
  await page.waitForTimeout(600);
  const standardDialog = page.getByRole("dialog");
  const standardText = (await standardDialog.innerText()).replace(/\s+/g, " ");
  check(
    "standard drawer shows quiet member upsell",
    standardText.includes("Members pay INR 409 for this wash. Join for INR 1,999 a year."),
    standardText.slice(0, 260),
  );
  await standardDialog.getByRole("button", { name: "Become a member" }).click();
  await page.waitForTimeout(700);
  check(
    "drawer upsell switches to the membership flow",
    (await page.getByRole("dialog").innerText()).includes("Continue to payment"),
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // FAQ and footer
  const faqItems = await page.locator("#faq button[data-state]").count();
  const faqText = (await page.locator("#faq").innerText()).replace(/\s+/g, " ");
  check("FAQ has eight questions", faqItems === 8, String(faqItems));
  check(
    "FAQ covers membership and member pricing",
    faqText.includes("What is the Lustre Brass membership?") &&
      faqText.includes("How does the member discount work?") &&
      faqText.includes("Can I use one membership for more than one car?"),
  );

  const bodyText = (await page.locator("body").innerText()).toLowerCase();
  const retired = [
    "sub" + "scription",
    "sub" + "scribe",
    "annual" + " plan",
    "washes" + " per month",
  ];
  check(
    "no retired billing wording remains in visible copy",
    retired.every((word) => !bodyText.includes(word)),
    retired.filter((word) => bodyText.includes(word)).join(", "),
  );

  const footerMembership = page.getByRole("contentinfo").getByRole("link", { name: "Membership" });
  check(
    "footer exposes a membership link",
    (await footerMembership.count()) === 1 &&
      (await footerMembership.getAttribute("href")) === "/#membership",
  );

  // Legal page nav points home
  await page.goto("http://localhost:3000/privacy", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  const navHref = await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Pricing" })
    .getAttribute("href");
  check("nav on legal page links home", navHref === "/#pricing", String(navHref));
  const activeOnLegal = await page.evaluate(
    () => document.querySelector('nav[aria-label="Primary"] a[data-active="true"]'),
  );
  check("no stale active nav on legal page", activeOnLegal === null);

  await context.close();
}

// Mobile, normal motion
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const { page, errors } = await openPage(context);

  check("mobile: no console or page errors", errors.length === 0, errors.join(" | "));
  check(
    "mobile: no horizontal overflow",
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  );

  await page.getByRole("button", { name: /Open menu/i }).click();
  await page.waitForTimeout(600);
  check("mobile menu opens", await page.getByRole("dialog").isVisible());
  const menuLabels = await page.getByRole("dialog").getByRole("link").allTextContents();
  check(
    "mobile menu includes membership",
    menuLabels.some((label) => label.includes("Membership")),
    JSON.stringify(menuLabels),
  );
  await page.getByRole("dialog").getByRole("link", { name: /Membership/ }).click();
  await page.waitForTimeout(1800);
  check(
    "mobile menu closes after membership link",
    !(await page.getByRole("dialog").isVisible().catch(() => false)),
  );
  const mobileMembershipTop = await page.evaluate(() => {
    const el = document.getElementById("membership");
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
  check(
    "mobile membership anchor reaches the block",
    mobileMembershipTop !== null && Math.abs(mobileMembershipTop) < 140,
    `top=${mobileMembershipTop}`,
  );

  await page.locator("#membership").getByRole("button", { name: "Become a member" }).click();
  await page.waitForTimeout(600);
  const dialogBox = await page.getByRole("dialog").boundingBox();
  check(
    "mobile membership drawer fits the viewport",
    Boolean(dialogBox && dialogBox.width <= 390 && dialogBox.x >= -1),
    JSON.stringify(dialogBox),
  );
  check(
    "mobile drawer does not create horizontal overflow",
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  await context.close();
}

// Reduced motion
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const { page, errors } = await openPage(context);

  check("reduced motion: no errors", errors.length === 0, errors.join(" | "));
  check(
    "reduced motion: Lenis disabled",
    await page.evaluate(() => !document.documentElement.classList.contains("lenis")),
  );

  await page.evaluate(() => document.getElementById("faq")?.scrollIntoView());
  await page.waitForTimeout(300);
  const transform = await page.evaluate(() => {
    const el = document.querySelector("#faq h2 .mask-line > span");
    return el ? getComputedStyle(el).transform : null;
  });
  check("reduced motion: headings revealed immediately", transform === "none", String(transform));

  await context.close();
}

// Accessibility basics across routes
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  for (const route of ["/", "/privacy", "/terms", "/styleguide", "/not-found-test"]) {
    const { page } = await openPage(context, route);
    const audit = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button")).filter(
        (el) =>
          !(el.textContent || "").trim() &&
          !el.getAttribute("aria-label") &&
          !el.getAttribute("aria-labelledby"),
      );
      const images = Array.from(document.querySelectorAll("img")).filter(
        (el) => el.getAttribute("alt") === null,
      );
      const inputs = Array.from(document.querySelectorAll("input, textarea, select")).filter(
        (el) =>
          !el.getAttribute("aria-label") &&
          !el.getAttribute("aria-labelledby") &&
          !el.id,
      );
      return { buttons: buttons.length, images: images.length, inputs: inputs.length };
    });
    check(
      `a11y basics ${route}`,
      audit.buttons === 0 && audit.images === 0 && audit.inputs === 0,
      JSON.stringify(audit),
    );
  }
  await context.close();
}

await browser.close();
const failures = results.filter((r) => !r.pass);
console.log(`\n${results.length - failures.length}/${results.length} checks passed`);
process.exit(failures.length ? 1 : 0);
