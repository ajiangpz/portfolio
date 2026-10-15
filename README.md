# JOHN / DIGITAL ORBIT — V4 Gallery

An art-directed solar-system portfolio built on the complete V3 baseline: Next.js App Router, React Three Fiber, procedural 2K planet textures, GPU stars, and the original GLSL shaders. V4 adds a bilingual project archive and accessible case studies. Static cinematic imagery remains an automatic loading/failure fallback; supported devices render the live scene.

## Project archive

- `/work/rainscope` — based on the public RainScope README; distinguishes real, forecast and demonstration data.
- `/work/network-systems` — a public summary of the existing V3 professional-work scope; no internal materials or unverified results.
- `/work/agent-lab` — the existing prototype scope, with explicit evidence still to be added.

Edit bilingual project content in `data/projects.ts`. Case routes and metadata resolve from this catalog; unknown slugs return 404. Locale state is owned by the root layout, persists through client navigation and synchronizes `html[lang]`.

## Development

```bash
npm ci
npm run dev
```

## Production

```bash
npm run build
npm run start
```

## Verification

```bash
npm ci
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Playwright starts the production server on `127.0.0.1:3100`. The matrix covers 1440×900 desktop, 820×1180 tablet and 390×844 phone, with additional camera-bound checks at 320×568, 1024×1366 and landscape dimensions. It checks navigation after content-height changes, real WebGL pixels, language/history, all case routes, 404, keyboard focus, storage restrictions, no-WebGL fallback, context loss and renderer allocation failure. Screenshots are written to `docs/verification/`; failure traces and reports are ignored by Git.

For restricted environments with an existing Chromium binary:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/absolute/path/to/chromium npm test
```

The override adds Linux sandbox-compatible launch flags; normal installs use Playwright's matching browser. Test software rendering is not a hardware performance benchmark. See [verification notes](docs/verification/README.md) for executed results and limitations.

## Renderer lifecycle

V4 retains the V3 Sun, Earth, Mars, Saturn, textures, orbit geometry and Shader source. Responsive wrapper transforms use the camera viewport at the object plane; transition scale remains separate. Reduced motion stops the continuous render loop while still rendering scene/viewport changes.

The small owned-canvas wrapper uses R3F `createRoot` so renderer allocation can be caught explicitly. In the installed R3F version, `Canvas` performs asynchronous configuration outside React error-boundary handling. Initialization, resize, scene updates and cleanup are therefore managed in one place, with a fresh canvas for StrictMode effect replay. A scene boundary handles rendering errors, and context loss restores the existing fallback.
