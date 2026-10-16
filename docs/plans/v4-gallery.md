# Digital Orbit V4 gallery implementation

## Binding brief
Implement the user's first-phase gallery brief on `feat/digital-orbit-v4-gallery`, based on V3 `237111544ec6af093435bb221946cb09343c1325`. Preserve procedural shaders, textures, orbit geometry, bilingual content and WebGL fallback. Cosmic Black #030405, Ivory #F2EEE5, Solar Accent #E69A45 and IBM Plex remain the design system. No backend, CMS, metrics invented from memory, internal screenshots or production deployment.

## Design and file responsibilities
- `components/orbit-portfolio.tsx`: home composition and section-driven scene/navigation state.
- `components/solar-system-scene.tsx`: existing renderer; fit portrait compositions to the camera's actual viewport at object depth; separate responsive transforms from transition scale.
- `components/locale-provider.tsx`: root-layout-owned locale state and document language; survives client route transitions, cleans up document mutation when unmounted.
- `components/site-header.tsx`: shared home/case navigation and locale control, including compact mobile navigation.
- `data/projects.ts`: typed bilingual factual project catalog with explicit evidence/limitations.
- `components/project-showcase.tsx`: home project entry linking to its own case study.
- `components/project-case-study.tsx` and `app/work/[slug]/page.tsx`: readable gallery case pages, generated metadata and real 404 responses.
- `tests/portfolio.spec.ts` / `playwright.config.ts`: browser verification and saved screenshots across desktop, tablet and portrait phone.

## Execution plan (inline, authorized by user)
1. [x] Inspect clean clone, refs, PR #4, actual versions and local Next.js guides. Create target branch from V3, leaving main unchanged.
2. [x] Add minimal Playwright tooling. Demonstrate failing tests for document language, section navigation, case routes and portrait WebGL composition before implementation.
3. [x] Fix section state using the section intersecting the reading line (not whole-page percentages); observe section resizing. Fit portrait bodies from frustum dimensions and preserve desktop composition. Share locale at layout scope and release probe GL context.
4. [x] Extract typed projects; retain existing verifiable scope, remove unsupported dates and unverified promises, document prototype/private-work limitations. Add server-resolved case routes, shared components, keyboard focus and compact navigation.
5. [x] Run npm ci, typecheck, production build and complete Playwright matrix. Inspect ready-WebGL screenshots (not only fallback), resize, reduced motion, context loss, 404 and route/language round trips. Fix root causes.
6. [ ] Review full diff and Shader preservation, record limitations and evidence, commit/push new branch and open PR to main. Never merge or deploy production.

## Review focus
- Narrow portrait and landscape resizing must use current camera aspect, not nested offset guesses.
- A long translated project section must retain matching nav/scene at its top and bottom.
- Locale must survive client navigation and history traversal; restricted browser storage must not break rendering.
- Renderer construction failure and context loss must restore fallback rather than leave an invisible Canvas.
- All case pages need source-based text; private work and prototypes must not imply public deployments or measured outcomes.

## Progress / decisions
- The user's explicit autonomous execution instruction supersedes skill confirmation gates; no new approval round is needed.
- Fresh clone is the isolated workspace. Local V3 tracked remote exactly; no pre-existing changes; target branch did not exist.
- Installed baseline: Next.js 16.3.4, React 19.2.0 (lockfile). Read installed Next.js dynamic-route, notFound and metadata guides before route implementation.

- Independent review identified two P2 edge cases: portrait tablets above 1000px and asynchronous renderer allocation failure. Both were fixed and covered by browser tests.
- Renderer initialization now uses an owned canvas and R3F createRoot; pending configure calls are serialized and cleanup isolates StrictMode replay. Original shader strings and procedural body components remain unchanged.
- Final verification: npm ci, typecheck, production build and 33 Playwright cases passed. Three viewports plus 1024px portrait captures were inspected.
- Browser decision: standard CDN download was unavailable in this environment. Tests used an external Chromium 153 binary via the documented override, with SwiftShader scoped to WebGL. No extra browser/font runtime dependencies were added to the project.
