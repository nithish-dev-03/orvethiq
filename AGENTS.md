# Orvethiq — Frontend AGENTS.md

## Project Scope
- **Frontend only.** Do not implement the Python backend, FastAPI, Django, database, SQLAlchemy, PostgreSQL, JWT server, or any backend API.
- Use **mock data and mock services** until the frontend is complete. Do not wait for backend endpoints; build everything with mocks first.
- **Prepare clean service interfaces** (types + fetch adapters) so the FastAPI backend can be connected later without refactoring components.
- **Do not assume any backend endpoints already exist.** All API calls should go through a service layer that can be swapped from mock to real.
- **Do not implement real authentication yet.** Build auth screens and frontend validation only. No JWT, no token storage, no fake auth logic.

## Technology
- **React 19 with TypeScript** and **Vite**.
- **Ant Design** component library and **@ant-design/icons**.
- **React Router** for routing — use `createBrowserRouter` with `<RouterProvider>`.
- Package manager is **npm** (lockfile: `package-lock.json`). Install only necessary dependencies; do not add random packages.
- **Strict TypeScript** — `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` are enabled. Avoid `any` wherever practical; use explicit types.
- Use **functional components** and **React hooks** only. No class components.
- Keep **components modular and reusable**. Extract presentational components into `src/components/ui/` and logic into `src/hooks/`.

## Design Direction
- **Premium, futuristic AI workspace** — avoid generic dashboard templates and excessive gradients.
- **Support both dark and light themes** using the existing design token system in `src/index.css`. The `prefers-color-scheme: dark` media query is already configured.
- **Design token system** — colors, typography, spacing, borders, shadows, and radii are defined as CSS variables in `:root` and `[data-theme=dark]`. Reference tokens in components, not hard-coded hex values.
- **Responsive** across desktop, tablet, and mobile. The base layout already has `@media (max-width: 1024px)` rules; extend them as needed.
- **Subtle transitions and polished interaction states** — use `transition` on color/border/radius, avoid jarring animations.
- **Readable typography, accessible contrast, keyboard support.** All focusable elements must have `focus-visible` styles. Contrast must meet WCAG AA for normal text.

## Architecture
- **Directory structure:**
  - `src/pages/` — page components for each route
  - `src/components/` — reusable UI components, further split into `ui/` (presentational) and `layout/` (complex arrangements)
  - `src/hooks/` — custom hooks for side effects and data fetching
  - `src/types/` — centralized application types and API service interfaces (not backend-specific)
  - `src/services/` — service adapters: `mockService.ts` (stub data) and `realService.ts` (placeholder for FastAPI connection)
  - `src/mock-data/` — mock data fixtures, independent of UI components
  - `src/routes/` — route definitions using React Router
  - `src/theme/` — theme configuration (light/dark tokens, theme context if needed)
- **Keep UI components independent of mock-data implementation.** Components should receive data via props/interfaces, not import mock files directly.
- **Centralize application types** in `src/types/` — API request/response shapes, prop interfaces, and enum constants.
- **Keep routing and application state organized.** Use React Router routes; if using Zustand or React Context, keep stores in `src/store/` and wire them in `src/main.tsx`.
- **Avoid oversized components** and duplicated business logic. Extract shared logic into hooks or utility functions.
- **Never put provider API keys, secrets, or fake security logic** in frontend code. All secrets belong in the backend.

## Quality
- **Inspect existing files before changing them.** Read `src/App.tsx`, `src/index.css`, and the directory structure before making edits.
- **Prefer incremental, working changes** over one giant implementation. Commit after each meaningful change.
- **Install only necessary dependencies.** Before adding a package, check if Vite, Ant Design, or React already provide the feature.
- **Run the production build and available checks after meaningful work:** `npm run build`, `npm run lint`, `npm run preview`.
- **Fix TypeScript errors, build errors, broken routes, and console errors immediately.** Do not leave broken typechecking in the codebase.
- **Do not claim tests passed unless you actually ran them.** If no test config exists, say so; do not invent passing tests.
- **Do not leave core interactions as non-functional visual placeholders.** Buttons must click, forms must validate, navigation must work.
- **Document any remaining limitations** in a `LIMITATIONS.md` at the root if the frontend is not fully complete.

## Delivery
- **Complete the frontend in milestones.** Suggested milestones: (1) Layout + Theme, (2) Auth screens + mock data, (3) Chat UI + message flow, (4) Polish & responsive refinements.
- **Keep the application runnable after each milestone.** Run `npm run dev` and verify the app starts without errors.
- **At the end, report:** implemented features, important files changed, commands executed, verification results (build/lint/typecheck), and outstanding issues.

## Extracted Repo Facts
- **Scripts:** `npm run dev` (vite), `npm run build` (tsc + vite), `npm run lint` (eslint), `npm run preview` (vite preview).
- **TypeScript:** strict mode enabled (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`). Import `.tsx` extensions is allowed.
- **ESLint:** `@vitejs/plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` are configured.
- **Design tokens:** CSS variables in `src/index.css` with `prefers-color-scheme: dark` override. Palette: `--text`, `--text-h`, `--bg`, `--border`, `--accent`, `--accent-bg`.
- **Current App.tsx** is a simple landing page with a counter — it will be replaced by the auth/chat layout.
- **Assets:** `src/assets/` contains `hero.png`, `react.svg`, `vite.svg`.
- **No Ant Design or React Router installed yet.** Run `npm i antd @ant-design/icons react-router-dom` when starting the first feature milestone.
- **No test configuration vitest/jest present.** If tests are needed, add `vitest` and `@vitest/react` as part of a milestone, not all at once.

## Common Commands
```bash
npm run dev    # start Vite dev server
npm run build  # typecheck + Vite build
npm run lint   # ESLint check
npm run preview # preview production build
```