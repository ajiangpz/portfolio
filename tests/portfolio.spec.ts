import { expect, test } from "@playwright/test";
import { fitComposition } from "../lib/scene-layout";

test("portrait camera composition includes complete primary body bounds", () => {
  for (const [width, height] of [[320, 568], [390, 844], [820, 1180], [1024, 1366], [844, 390]]) {
    const worldHeight = 2 * 10 * Math.tan(42 * Math.PI / 360);
    const worldWidth = worldHeight * width / height;
    for (const [body, cx, cy, bw, bh] of [["solar", -1.6, -.75, 13.86, 7.86], ["mars", -3.35, -.05, 5.64, 5.64], ["saturn", 3.1, .1, 10.6, 5.6]] as const) {
      const { position: [x, y], scale } = fitComposition(body, worldWidth, worldHeight, true);
      expect(Math.abs(x + cx * scale) + bw * scale / 2).toBeLessThan(worldWidth / 2);
      expect(Math.abs(y + cy * scale) + bh * scale / 2).toBeLessThan(worldHeight / 2);
    }
  }
});

test("language follows client navigation and browser history", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to Chinese" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.locator('a[href="/work/rainscope"]').click();
  await expect(page).toHaveURL(/\/work\/rainscope$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { name: "问题背景", exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.getByRole("button", { name: "切换到英文" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("navigation tracks actual sections rather than total page height", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Deliberately change a real content section's height: page percentages must not decide navigation.
  await page.locator(".project-3").evaluate((el) => { (el as HTMLElement).style.minHeight = "210vh"; });
  await page.locator(".project-3").evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + el.getBoundingClientRect().height * .55));
  await expect(page.locator('.site-header nav a[href="#work"]')).toHaveClass(/is-active/);
  await page.locator("#profile").scrollIntoViewIfNeeded();
  await expect(page.locator('.site-header nav a[href="#profile"]')).toHaveClass(/is-active/);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator('.site-header nav a[href="#contact"]')).toHaveClass(/is-active/);
});

test("all project case routes have readable content and unknown slugs are 404", async ({ page, request }) => {
  for (const [slug, name] of [["rainscope", "RainScope"], ["network-systems", "Network Systems"], ["agent-lab", "Agent Lab"]]) {
    const response = await page.goto(`/work/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Context", exact: true })).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(name));
  }
  expect((await request.get("/work/unknown-object")).status()).toBe(404);
});

test("WebGL ready home and scroll scenes remain visible", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-ready/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".cosmos-fallback")).toHaveCSS("opacity", "0");
  // Inspect actual rendered pixels, not the presence of a blank-but-ready Canvas.
  const assertRenderedBody = async () => {
    const png = await page.locator(".cosmos").screenshot();
    const fraction = await page.evaluate(async (data) => {
      const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d")!; ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
      let warm = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > 45 && pixels[i] > pixels[i + 1] * 1.12 && pixels[i + 1] > pixels[i + 2] * 1.12) warm++;
      }
      return warm / (image.width * image.height);
    }, png.toString("base64"));
    expect(fraction, "primary celestial body must render visibly after fallback is hidden").toBeGreaterThan(.003);
  };
  await assertRenderedBody();
  await page.screenshot({ path: `docs/verification/${info.project.name}-home.png` });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [selector, name] of [[".project-1", "rainscope"], [".project-2", "mars"], [".project-3", "saturn"]]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(".cosmos")).toHaveClass(/webgl-ready/);
    // Scene transitions settle before the visual evidence is captured.
    await page.waitForTimeout(1200);
    await assertRenderedBody();
    await page.screenshot({ path: `docs/verification/${info.project.name}-${name}.png` });
  }
  expect(errors).toEqual([]);
});

test("no WebGL retains fallback, navigation and case studies", async ({ page }, info) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-failed/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".cosmos-fallback")).toHaveCSS("opacity", "1");
  const background = await page.locator(".cosmos-fallback").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect((await page.request.get(background.match(/url\("?([^"\)]+)/)![1])).ok()).toBeTruthy();
  await page.screenshot({ path: `docs/verification/${info.project.name}-fallback.png` });
  await page.getByRole("navigation").getByRole("link", { name: /WORK/ }).click();
  await page.locator('a[href="/work/network-systems"]').click();
  await expect(page.getByRole("heading", { level: 1, name: "Network Systems" })).toBeVisible();
});

test("keyboard navigation, compact header and responsive case layout", async ({ page }, info) => {
  await page.goto("/work/rainscope");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#case-content")).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  for (const route of ["/work/rainscope", "/work/network-systems", "/work/agent-lab"]) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    const bounds = await page.locator("h1").boundingBox();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  }
  await page.goto("/work/rainscope");
  await page.screenshot({ path: `docs/verification/${info.project.name}-case.png`, fullPage: true });
  await page.getByRole("button", { name: "Switch to Chinese" }).click();
  await expect(page.getByRole("heading", { name: "问题背景", exact: true })).toBeVisible();
  await page.screenshot({ path: `docs/verification/${info.project.name}-case-zh.png`, fullPage: true });
});

test("context loss restores fallback and resizing keeps WebGL working", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-ready/);
  await page.setViewportSize({ width: 1024, height: 1366 });
  await expect(page.locator("canvas")).toBeVisible();
  await page.screenshot({ path: `docs/verification/${info.project.name}-portrait-tablet.png` });
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-ready/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  await page.locator("canvas").evaluate((canvas) => {
    (canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-failed/);
  await expect(page.locator(".cosmos-fallback")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("reduced motion pauses rendering while normal motion remains animated", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-ready/);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  const paused = await page.locator("canvas").screenshot();
  await page.waitForTimeout(200);
  expect((await page.locator("canvas").screenshot()).equals(paused)).toBeTruthy();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(200);
  expect((await page.locator("canvas").screenshot()).equals(paused)).toBeFalsy();
});

test("restricted storage does not break language switching", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Storage blocked", "SecurityError"); } }));
  await page.goto("/work/agent-lab");
  await page.getByRole("button", { name: "Switch to Chinese" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { name: "问题背景", exact: true })).toBeVisible();
});

test("renderer allocation failure after a successful probe restores fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    let probe: HTMLCanvasElement | undefined;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === "webgl" || type === "webgl2") {
        probe ??= this;
        if (this !== probe) return null;
      }
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".cosmos")).toHaveClass(/webgl-failed/);
  await expect(page.locator(".cosmos-fallback")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("button", { name: "Switch to Chinese" })).toBeEnabled();
});
