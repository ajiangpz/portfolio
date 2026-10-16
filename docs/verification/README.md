# V4 verification — 15 October 2026

Base: `codex/digital-orbit-v3` at `237111544ec6af093435bb221946cb09343c1325`. Work branch: `feat/digital-orbit-v4-gallery`. Main was not modified; no production deployment or merge was performed.

## Executed checks

| Command | Result |
| --- | --- |
| `npm ci` | Passed; 99 packages installed from the final lockfile |
| `npm run typecheck` | Passed, exit 0 |
| `npm run build` | Passed; homepage, 404 and all three case pages generated |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/portfolio-chromium/chromium npm test` | **33 passed (4.5m)**; default failure tracing enabled |
| `git diff --check` | Passed |
| Original Sun/Saturn shader string comparison | Unchanged |

The preceding 30-case suite also passed before adding motion and 1024px visual coverage. The final 33-case output is preserved in [test-results.txt](test-results.txt).

Versions from the lockfile: Next.js 16.3.4, React 19.2.0, Three.js 0.186.0, React Three Fiber 9.7.0, Drei 10.7.8, TypeScript 5.9.3 and Playwright 1.64.1. Runtime: Node.js 24.19.0 / npm 11.9.0.

## Coverage and visual evidence

Each project runs the same eleven cases: camera bounds, language/history, content-driven navigation, case routes/404, ready-WebGL rendering, no-WebGL browsing, keyboard/layout, context loss/resize, reduced/normal motion, blocked storage, and renderer allocation failure after a successful probe.

| Surface | Viewport | Home | Mars | Saturn | Case | Chinese case | No WebGL |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | 1440×900 | [View](desktop-home.webp) | [View](desktop-mars.webp) | [View](desktop-saturn.webp) | [View](desktop-case.webp) | [View](desktop-case-zh.webp) | [View](desktop-fallback.webp) |
| Tablet | 820×1180 | [View](tablet-home.webp) | [View](tablet-mars.webp) | [View](tablet-saturn.webp) | [View](tablet-case.webp) | [View](tablet-case-zh.webp) | [View](tablet-fallback.webp) |
| Phone | 390×844 | [View](phone-home.webp) | [View](phone-mars.webp) | [View](phone-saturn.webp) | [View](phone-case.webp) | [View](phone-case-zh.webp) | [View](phone-fallback.webp) |

Additional [1024×1366 portrait tablet capture](desktop-portrait-tablet.webp), plus equivalent resize captures from the tablet/phone contexts, are included. Camera-bound checks also cover 320×568 and 844×390; a browser resize checks 360×800. The first project’s scenes are saved as `*-rainscope.webp`.

WebGL tests assert that the fallback opacity is zero and inspect actual warm-colored pixels in a screenshot of the background Canvas composition. This catches a blank-but-ready renderer. Motion tests compare Canvas captures before and after enabling normal motion. Screenshots above are compressed WebP copies of the actual Playwright PNG captures; `npm test` regenerates the original PNGs locally. They were manually inspected for composition and readability.

## Regression evidence

Against the unmodified V3 production build, the new tests observed:

- Chinese selection left `html[lang]` as `en` instead of `zh-CN`.
- Expanding the third project made the fixed page-progress navigation highlight the wrong destination.
- `/work/rainscope` returned 404 because case routes did not exist.

The final suite passes these checks. The original shader hashes remain `sunVertexShader: 0e185d054700`, `sunFragmentShader: 56f941496249`, `saturnFragmentShader: f404efa11498` (SHA-256 prefixes).

An independent code review identified portrait fitting above 1000px and the R3F async renderer-allocation boundary. Both were corrected. The allocation-failure test now confirms a transition to `webgl-failed`, and the portrait capture confirms the fitted composition.

## Environment and limits

- Browser CDN downloads returned an invalid archive in this execution environment. A separately installed Chromium 153 binary was used through the explicit executable-path override. It is not a project dependency. Software rendering was scoped to WebGL to avoid a sandbox compositor/readback stall. Assertions and production shaders were retained.
- A repeat build encountered a corrupt Turbopack persistence cache. The old cache was preserved outside the repository, then a fresh standard `npm run build` succeeded. No build-tool or feature downgrade was used.
- Screenshots use IBM Plex and an environment-installed CJK fallback font. No Chinese-font package was added to the site.
- npm proxy/color warnings and a third-party `THREE.Clock` deprecation notice are environment/dependency notices. They did not fail the final checks.
- Automated verification covers Chromium with emulated viewports. Physical iOS/Android devices, Safari, Firefox and hardware GPU performance have not been validated. No cross-device frame-rate or Lighthouse results are claimed.
- RainScope descriptions and links come from its public README, checked at blob `f179e4d1bf834b859e8725021c9c7918a58b6f07`. External live-data availability was not verified by this suite.
- Network Systems and Agent Lab remain source-limited case studies based on the author’s V3 descriptions. Publishable implementation samples, approved private-work material and independently measured outcomes remain to be supplied. There are no invented demo links, email addresses or business metrics.
