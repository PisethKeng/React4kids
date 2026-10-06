# ReactJS_4kids

A progressive React 18 learning workspace for people who know basic JavaScript. Eighteen lessons connect foundations to intermediate application design through visual labs, guided practice, and a Study Planner capstone.

## Run locally

Use Node.js 20 or later (React Router 7 requires it).

```sh
npm ci
npm start
```

Create and preview the production build:

```sh
npm run build
npm run preview
```

The local production preview is at `http://127.0.0.1:4173`. It supports direct lesson and task URLs. On a real host, configure an HTML fallback to `index.html` for client-side routes; keep missing static assets as 404 responses. The included preview server binds to localhost and is not a deployment server.

## Learn progressively

| Stage | Topics |
| --- | --- |
| Foundations | Components/JSX, props/composition, events/state, conditions/lists/keys |
| State design | Snapshots/batching, immutable and derived state, controlled forms, shared state/identity |
| Effects & reuse | Refs, subscription cleanup, fetching/request races, custom hooks |
| Application architecture | Reducers, Context with reducers, nested routes and URL state |
| Performance & reliability | Memoization/Profiler, transitions/deferred values, lazy loading/Suspense/error boundaries/testing |

Each lesson follows **Understand → Predict → Explore → Practice → Check → Reflect**. Predictions and reflections are ungraded. Completion requires interacting with the lab and passing both the practice challenge and the knowledge check. Assessments use predefined choices, hints, and explained feedback; they do not execute arbitrary learner code. Prerequisites recommend an order without locking lessons.

The visual labs show component data flow, state snapshots, an actual Effect lifecycle, reducer action history, nested routes, and real Profiler measurements. Profiler timings are development-only measurements and vary between devices. Layout-effect counts are labeled separately from render attempts. Strict Mode stays enabled.

The Study Planner has task creation, editing, deletion, validation, completion, URL filters, detail routes, local persistence, and asynchronous resource scenarios. Its five milestones include starter excerpts and acceptance criteria. Milestone ticks are **self-reviewed**, separate from checked lesson results. Recreate the reference in your own React project to complete the capstone.

## Architecture

- `src/learning/curriculum.js`: stable lesson IDs, prerequisites, teaching content, snippets, predictions, and assessments. Used by the dashboard, route navigation, and progress screens.
- `src/learning/labs/`: working React examples. The registration map connects each lesson ID to its demo; new lessons must add a matching lab.
- `src/learning/Progress.jsx`: context/reducer for versioned, validated progress. Lesson completion is derived from exploration and assessment results.
- `src/learning/resources.js`: abortable local asynchronous teaching service and request hook. The delay/error/empty controls are explicitly simulated; no live API or database is needed.
- `src/learning/StudyPlanner.jsx`: reducer/context-based working capstone.
- `src/learning/Workspace.jsx`, `Dashboard.jsx`, `Lesson.jsx`: shell, dashboard, and per-lesson routes rendered by the route tree below.
- `src/App.js`: application route tree (`AppRoutes`), including compatibility redirects for old sample URLs. Router ownership lives outside the exported route tree so tests can use `MemoryRouter`.

The active app uses a single Material UI theme provider with locally bundled Outfit and Space Grotesk fonts. Its visual design takes inspiration from the supplied `blue_horizon_academy.html`: cobalt/turquoise/yellow/coral colors, dark outlines, square cards, offset shadows, and a coastal studio scene with independent day/dusk/night controls (`src/learning/CoastalStudio.jsx`).

Earlier home/card/theme components (`src/components/`, `src/pages/Home/`) and the standalone hook samples (`src/samples/`) remain in the repository from prior iterations of this template; the learning workspace in `src/learning/` is the active entry point rendered by `src/App.js`.

## Local data

No account, analytics service, or backend is connected.

| Storage key | Purpose |
| --- | --- |
| `react-workspace:progress:v1` | Passed assessments, attempt counts, exploration, bookmarks, last lesson, theme, project checklist |
| `react-workspace:planner:v1` | Study Planner tasks |
| `react-workspace:draft-a`, `react-workspace:draft-b` | Independent custom-hook practice drafts |

Malformed or incompatible progress falls back to safe defaults. Failed storage writes show a message and leave the interface usable in memory. Progress does not synchronize between browsers or devices. Resetting learning progress preserves planner tasks, practice drafts, and theme; draft inputs and task deletion have their own controls.

## Verification

```sh
npm run test:ci
npm run build
npm run test:e2e
```

Browser tests run against the production build, using installed Google Chrome by default. To use Playwright-managed Chromium instead:

```sh
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium npm run test:e2e
```

The browser suite (`e2e/workspace.spec.js`) covers desktop and mobile layouts, keyboard access, theme persistence, assessment completion, capstone editing/direct URLs, simulated request recovery, Effect cleanup, and error boundary recovery. Screenshots and failure traces are written under the ignored `test-results/`. Unit/integration tests (`src/App.test.js`, `src/learning/learning.test.js`) cover lesson routes and legacy redirects, curriculum consistency, validation, persistence failures, request cancellation, immutability, and core lab behavior.

Use `npm run format:learning` to format the workspace source and verification files. CRA's Jest resolver mappings target the installed Router 7 distribution files; recheck them when upgrading the router. CRA remains the build tool for this project.
