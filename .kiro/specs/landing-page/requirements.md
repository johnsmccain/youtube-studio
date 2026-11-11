# Landing Page — Specification

Status: IMPLEMENTED — all 9 tasks complete, all 26 tests passing, build clean.

---

## 1. Problem Statement

The `apps/web` Next.js application is at ground zero — no source files exist.
Before any feature can be built in the frontend, the application needs to be
bootstrapped: TypeScript config, Tailwind CSS, component library, root layout,
and an entry point that a user can actually visit.

The landing page is that entry point. For a personal tool, it serves a specific
purpose: it is the sign-in gate. John Danlami needs a clear, fast path from
"browser open" to "inside the dashboard". The page must present what the tool
does, provide a Google sign-in action, and get out of the way — but it must
also feel polished and professional. A high-quality animated hero section sets
the visual standard for every page that follows.

---

## 2. Business Objectives

1. Bootstrap the Next.js application with all configuration that every
   subsequent page will depend on (TypeScript, Tailwind, shadcn/ui, root layout).

2. Provide a sign-in entry point so the authenticated dashboard (Phase 2) has
   somewhere to redirect to and from.

3. Establish the visual design system (color tokens, typography, component
   primitives, animation patterns) so future pages are built consistently.

4. Make a strong first impression through a professional animated hero that
   communicates the tool's capability without feeling like a toy.

5. Ensure authenticated users are never shown the landing page — they are
   redirected to the dashboard immediately.

---

## 3. Functional Requirements

FR-1  The landing page must be accessible at the root route `/`.

FR-2  The page must display the product name: "AI YouTube Content Studio".

FR-3  The page must display a single-sentence value proposition describing what
      the tool does.

FR-4  The page must display a primary call-to-action button labelled
      "Sign in with Google".

FR-5  Clicking the sign-in button must initiate the Google OAuth flow via
      Better Auth. (The OAuth flow itself is implemented in Phase 2; this
      spec covers wiring the button to the correct endpoint.)

FR-6  The page must display a features section with 4 cards that describe
      the core workflow: Research, Create, Produce, Publish.

FR-7  The page must display a footer with the product name and current year.

FR-8  If the user is already authenticated, visiting `/` must redirect them
      to `/dashboard` without rendering the landing page.

FR-9  If the OAuth callback returns an `?error=` query parameter, the page
      must display a human-readable error message to the user.

FR-10 The page must work correctly with JavaScript disabled for critical text
      content. The Three.js canvas must degrade gracefully (hidden, not broken).

FR-11 The hero section must render an animated Three.js canvas as a full-bleed
      background — a floating particle network or abstract data-flow scene
      that communicates intelligence and motion without distracting from the CTA.

FR-12 Page elements (headline, tagline, CTA button, feature cards) must animate
      in on first load using GSAP with staggered entrance transitions.

FR-13 The Three.js scene must respond to mouse/pointer movement — particles or
      geometry must subtly shift toward the cursor position.

FR-14 The feature cards must animate into view using GSAP ScrollTrigger as the
      user scrolls them into the viewport.

FR-15 All animations must respect the `prefers-reduced-motion` media query —
      when set, animations are skipped and elements render in their final state
      immediately.

---

## 4. Non-Functional Requirements

NFR-1  Performance: Largest Contentful Paint (LCP) < 2.5 s on a standard
       broadband connection. The Three.js canvas must not block the LCP element
       (headline text). Three.js is loaded dynamically with `next/dynamic` and
       `ssr: false` to prevent server-render blocking.

NFR-2  Bundle size: Three.js adds ~600 KB minified. It must be code-split into
       its own chunk and loaded only on the landing page. GSAP (~60 KB) is also
       code-split. Neither library is imported in the root layout or shared
       across pages.

NFR-3  Accessibility: Page must meet WCAG 2.1 AA. The Three.js canvas must have
       `aria-hidden="true"` and `role="presentation"` — it is decorative. All
       interactive elements must be keyboard-navigable. The animation must not
       flash more than 3 times per second (WCAG 2.3.1).

NFR-4  Responsiveness: Layout must work at 375 px (mobile), 768 px (tablet),
       and 1280 px+ (desktop). The Three.js canvas resizes with the viewport.
       On mobile, the particle count is reduced by 50% to maintain frame rate.

NFR-5  Frame rate: The Three.js scene must target 60 fps on a mid-range GPU.
       The animation loop must use `requestAnimationFrame` correctly and dispose
       of geometries and materials on unmount to prevent memory leaks.

NFR-6  Security: No API keys or secrets may appear in the browser bundle.
       Only `NEXT_PUBLIC_*` variables are permitted in client code.

NFR-7  Type safety: All source files must pass `tsc --noEmit` with strict mode.
       No `any` types. Three.js and GSAP typings must be installed.

NFR-8  Linting: All source files must pass ESLint with `@typescript-eslint`
       ruleset.

NFR-9  The page must render correctly with no backend running.

NFR-10 Time to interactive must be under 3 s on a mid-range device.

---

## 5. User Stories

US-1  As John Danlami, I want to visit the app URL and immediately understand
      what the tool does and feel that it is a high-quality product, so I
      trust the work I've built.

US-2  As John Danlami, I want a single click to start the Google sign-in flow,
      so I can get into the dashboard quickly.

US-3  As John Danlami, when I'm already signed in and I visit the root URL,
      I want to be taken straight to the dashboard, so I don't have to
      click through the landing page every time.

US-4  As John Danlami, if the Google sign-in fails, I want to see a clear
      error message on the landing page, so I understand what went wrong
      and can try again.

US-5  As John Danlami, I want the page animations to feel smooth and
      intentional, not flashy or distracting, so the page communicates
      professionalism rather than gimmick.

---

## 6. Acceptance Criteria

AC-1  Visiting `http://localhost:3000/` renders the landing page with no
      JavaScript errors in the browser console.

AC-2  The page title shown in the browser tab is "AI YouTube Content Studio".

AC-3  The sign-in button is visible, focusable via keyboard Tab, and activatable
      via Enter/Space.

AC-4  Clicking the sign-in button navigates to the Better Auth Google OAuth
      endpoint (`/api/auth/signin/google` on the API server). It does not
      navigate to a 404.

AC-5  Visiting `/` while holding a valid session cookie redirects to `/dashboard`
      with HTTP 307 (server redirect) — the landing page HTML is never sent.

AC-6  Visiting `/?error=OAuthCallbackError` renders a visible, non-empty
      error message above the sign-in button.

AC-7  The page renders a recognisable layout on a 375 px wide viewport with
      no horizontal overflow.

AC-8  Running `pnpm --filter @repo/web typecheck` exits with code 0.

AC-9  Running `pnpm --filter @repo/web lint` exits with code 0.

AC-10 The Lighthouse accessibility score for the landing page is ≥ 90.

AC-11 The Three.js canvas element has `aria-hidden="true"` in the rendered DOM.

AC-12 With `prefers-reduced-motion: reduce` set in the OS, no GSAP transitions
      play and the Three.js animation loop does not start.

AC-13 The Three.js canvas resizes correctly when the browser window is resized
      without visual glitches or console errors.

AC-14 Opening DevTools → Performance → record 5 s shows the Three.js animation
      loop running at ≥ 55 fps on a mid-range machine.

AC-15 Navigating away from the landing page and back produces no memory leak
      warnings — Three.js geometries and materials are disposed on unmount.

---

## 7. Database Changes

None. The landing page is static. No database reads or writes are performed.

The `sessions` table (created in Phase 1) is read indirectly through Better
Auth's session validation middleware when checking FR-8, but this spec does
not modify the schema.

---

## 8. API Contracts

The landing page does not call any application API endpoints.

It does interact with one Better Auth endpoint, implemented in Phase 2:

```
GET /api/auth/signin/google
  Description : Initiates Google OAuth 2.0 authorization code flow.
  Auth        : None required (initiates auth).
  Response    : 302 redirect to Google's authorization URL.
  Error       : 500 if OAuth provider is not configured.

GET /api/auth/callback/google
  Description : Google redirects here after user grants permission.
  Auth        : None required (OAuth callback).
  Query params: code (string), state (string)
  Response    : 302 redirect to WEB_URL/dashboard on success.
                302 redirect to WEB_URL/?error=<code> on failure.
```

These endpoints are defined here for contract clarity. Their implementation
is out of scope for this spec — they are Phase 2 work. The landing page
only needs to know the sign-in URL to point the button at.

---

## 9. Frontend Requirements

### 9.1 Web App Scaffolding (prerequisite — created as part of this spec)

These files do not exist yet and must be created before any page component:

| File | Purpose |
|---|---|
| `apps/web/tsconfig.json` | Next.js-specific TypeScript config, extends root, adds `jsx: preserve`, Next.js plugin, `@/*` path alias |
| `apps/web/next.config.ts` | Security headers (CSP, X-Frame-Options), env var passthrough, `esmExternals` for Three.js |
| `apps/web/tailwind.config.ts` | Content paths, design tokens (brand colors, font stack) |
| `apps/web/postcss.config.js` | Tailwind + autoprefixer |
| `apps/web/src/app/globals.css` | Tailwind base/components/utilities, CSS custom properties for shadcn/ui |
| `apps/web/src/app/layout.tsx` | Root HTML shell, `<html lang="en">`, Inter/Geist font, global metadata |
| `apps/web/src/lib/auth-client.ts` | Better Auth browser client (`createAuthClient`), exports `signIn`, `useSession` |
| `apps/web/components.json` | shadcn/ui init file, sets style, base color, CSS variable mode |

### 9.2 New dependencies to install in `apps/web`

| Package | Reason |
|---|---|
| `@radix-ui/react-slot` | Required by shadcn/ui Button |
| `class-variance-authority` | shadcn/ui component variants |
| `clsx` | Conditional class merging |
| `tailwind-merge` | Tailwind class deduplication |
| `lucide-react` | Icon set used by shadcn/ui |
| `three` | 3D animation engine for the hero background scene |
| `@types/three` | TypeScript typings for Three.js |
| `gsap` | Animation library for entrance transitions and ScrollTrigger |

GSAP is free for non-commercial and personal use. No Club GreenSock license
is required. ScrollTrigger is included in the standard `gsap` package.

Three.js and GSAP must NOT be added to the root `package.json` or any shared
package — they belong only to `@repo/web`.

### 9.3 New source files

```
apps/web/src/
├── app/
│   ├── layout.tsx                     Root layout
│   ├── globals.css                    Global styles
│   ├── page.tsx                       Landing page (Server Component)
│   └── (dashboard)/
│       └── page.tsx                   Dashboard stub (Phase 2 target)
├── components/
│   ├── ui/
│   │   └── button.tsx                 shadcn/ui Button primitive
│   └── landing/
│       ├── Hero.tsx                   Hero section — text, CTA, error msg
│       ├── HeroCanvas.tsx             Three.js scene (Client Component, dynamic)
│       ├── Features.tsx               Scroll-triggered feature cards
│       └── Footer.tsx                 Page footer
└── lib/
    ├── auth-client.ts                 Better Auth browser client
    ├── auth-errors.ts                 OAuth error code → message map
    ├── auth-errors.test.ts            Unit tests
    └── utils.ts                       cn() helper
```

### 9.4 Component architecture — animation-specific details

**`HeroCanvas.tsx` — Three.js scene (Client Component)**

Loaded via `next/dynamic` with `ssr: false` from `Hero.tsx`:

```tsx
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
```

Scene description:
- Dark background (`#050a14`) matching the page background color.
- ~300 particles (desktop) / ~150 particles (mobile) represented as
  `THREE.Points` with a `THREE.BufferGeometry`.
- Particles connected by lines when within a threshold distance, forming
  a dynamic network graph suggesting data/intelligence.
- Subtle continuous drift animation — particles move on slow sine-wave paths.
- Mouse parallax: on `mousemove`, the camera or particle field shifts
  slightly toward the cursor using lerp interpolation (not snapping).
- Color palette: deep blue–cyan gradient (`#1a6cf6` → `#00d4ff`) with
  low opacity (0.6–0.8) so text above remains legible.
- The canvas is `position: absolute`, full-bleed behind the hero text,
  with a `z-index` below all text/button elements.
- On unmount: `renderer.dispose()`, geometry and material disposal,
  `window` event listener cleanup, animation frame cancellation.
- Respects `prefers-reduced-motion`: if true, canvas is not rendered at all
  (the component returns null) — the hero shows only the gradient background.

**`Hero.tsx` — GSAP entrance animation**

- Uses `useGSAP` hook (from `@gsap/react`, which is included in `gsap` v3.12+)
  or a standard `useEffect` with GSAP.
- On mount, runs a staggered `gsap.from()` timeline:
  1. Product name fades up from `y: 30, opacity: 0`, duration 0.8 s, ease `power3.out`
  2. Tagline fades up 0.15 s after, same params
  3. Sign-in button fades up 0.15 s after, with a slight scale from `scale: 0.95`
  4. Error message (if present) fades in with `opacity: 0`, no movement
- Timeline is killed on component unmount to prevent memory leaks.
- Respects `prefers-reduced-motion`: if true, `gsap.set()` is used instead
  of `gsap.from()` — elements appear immediately in final state.

**`Features.tsx` — GSAP ScrollTrigger**

- Each of the 4 feature cards animates in as it enters the viewport.
- Uses `ScrollTrigger.batch()` for efficient handling of multiple targets.
- Cards stagger with `0.1 s` between each, `y: 40 → 0`, `opacity: 0 → 1`.
- ScrollTrigger instances are killed on component unmount.
- Respects `prefers-reduced-motion`: ScrollTrigger not registered; cards
  appear in final state via CSS.

### 9.5 Visual design

Theme: dark. Background `#050a14` (near-black blue-tinted).

Color tokens (defined in `tailwind.config.ts` and `globals.css`):

| Token | Value | Usage |
|---|---|---|
| `brand-primary` | `#1a6cf6` | CTA button, active states |
| `brand-secondary` | `#00d4ff` | Accent, feature card icons |
| `brand-bg` | `#050a14` | Page background |
| `brand-surface` | `#0d1526` | Card backgrounds |
| `brand-border` | `#1e2d4a` | Card borders |
| `brand-text` | `#e8edf5` | Primary text |
| `brand-muted` | `#7a8ba8` | Secondary/muted text |

Typography: Inter (Google Fonts via `next/font/google`).
- Hero headline: `text-5xl font-bold tracking-tight` (desktop), `text-3xl` (mobile)
- Tagline: `text-xl text-brand-muted`
- Feature card title: `text-lg font-semibold`
- Feature card body: `text-sm text-brand-muted`

### 9.6 Page structure

```
/  (src/app/page.tsx — Server Component)
│
│  [Server-side session check → redirect to /dashboard if authenticated]
│  [Read ?error= search param → pass as authError to Hero]
│
└── <layout.tsx>  Root Layout
    └── <body class="bg-brand-bg font-inter">
        ├── <section class="relative min-h-screen">   Hero section
        │   ├── <HeroCanvas />  (absolute, z-0, aria-hidden)
        │   └── <Hero authError={...} />  (relative, z-10)
        │       ├── product name
        │       ├── tagline
        │       ├── [error message if authError]
        │       └── sign-in button
        ├── <section>   Features section
        │   └── <Features />
        └── <Footer />
```

### 9.7 Environment variables required in `apps/web`

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public (browser) | Base URL of the Express API — used to construct the OAuth sign-in URL |

Must be added to `.env.example` and `.env.local`.

---

## 10. Backend Requirements

No backend changes are required for the landing page.

The API server (`apps/api`) does not need modification. The landing page is
entirely server-rendered and client-animated by Next.js with no Express
involvement.

The only future backend dependency is the Better Auth OAuth endpoints — those
are Phase 2 and are documented in section 8 for reference only.

---

## 11. External Integrations

| Integration | Used by | Status in this spec |
|---|---|---|
| Google OAuth 2.0 | Sign-in button CTA | Button links to endpoint only. OAuth flow implemented in Phase 2. |
| Better Auth (server) | Session check on `/` | Auth client initialized. Server config is Phase 2. |
| Better Auth (client) | `signIn()` call from button | Auth client created in `src/lib/auth-client.ts`. |
| Three.js | `HeroCanvas.tsx` | Installed as npm package. No external CDN. No network calls at runtime. |
| GSAP | `Hero.tsx`, `Features.tsx` | Installed as npm package. No external CDN. No network calls at runtime. |

No third-party analytics, tracking scripts, or CDN-hosted resources are used.
All animation assets are bundled locally.

---

## 12. Security Considerations

SC-1  **No secrets in the browser bundle.** The `NEXT_PUBLIC_API_URL` is the
      only frontend env var. No OAuth client IDs, API keys, or tokens are
      referenced in `apps/web`.

SC-2  **Content Security Policy.** `next.config.ts` must set a CSP header.
      Three.js and GSAP are bundled — no external script sources needed:
      - `default-src 'self'`
      - `connect-src 'self' <NEXT_PUBLIC_API_URL>`
      - `img-src 'self' data: https://lh3.googleusercontent.com`
      - `script-src 'self' 'unsafe-inline'` (required by Next.js)
      - `style-src 'self' 'unsafe-inline'` (required by Tailwind)
      - `worker-src 'none'` (Three.js does not use workers in this config)
      Note: `unsafe-inline` for scripts is a known Next.js dev constraint.
      Review before production deployment using nonce-based CSP.

SC-3  **X-Frame-Options: DENY.** Set in `next.config.ts` to prevent clickjacking.

SC-4  **OAuth error message safety.** The `?error=` query parameter is validated
      against a known allowlist of error codes. Unknown values render a generic
      message. React JSX escaping prevents XSS.

SC-5  **Three.js canvas isolation.** The WebGL context is contained within a
      single canvas element that is `aria-hidden`. It has no access to DOM
      outside itself and makes no network requests.

SC-6  **Session cookie.** Better Auth sets `HttpOnly`, `Secure`, `SameSite=Lax`.
      The frontend never reads the token directly.

SC-7  **GSAP license.** GSAP free tier is used. No Club GreenSock plugins
      (SplitText, MorphSVG, etc.) are used — those require a paid license.
      ScrollTrigger is free and included in the standard `gsap` package.

---

## 13. Error Handling

| Error scenario | Trigger | Handling |
|---|---|---|
| OAuth failure | Google returns error; Better Auth redirects to `/?error=<code>` | Parse `?error=` in `page.tsx`; pass to `<Hero>` as `authError`; render message above sign-in button |
| Known error codes | `OAuthCallbackError`, `OAuthSignInError`, `OAuthAccountNotLinked` | Mapped to user-friendly strings in `auth-errors.ts` |
| Unknown error code | Any unrecognised `?error=` value | Generic: "Sign-in failed. Please try again." |
| API URL not set | `NEXT_PUBLIC_API_URL` missing at build time | `next.config.ts` throws at build time — fail fast |
| Session check throws | Better Auth server call fails | Catch, do not redirect, render landing page — user can still attempt sign-in |
| Dashboard redirect target missing | `/dashboard` does not exist | Stub `(dashboard)/page.tsx` created in this spec |
| WebGL not supported | Browser has no WebGL support | `HeroCanvas` checks for WebGL support before initialising Three.js; falls back to plain gradient background |
| Three.js init fails | WebGL context creation error | Caught in try/catch; canvas hidden; no error propagated to page |
| GSAP not loaded | Dynamic import fails | GSAP animations are progressive enhancement — page content is visible in final state via CSS; no functional breakage |

---

## 14. Testing Strategy

### Unit tests (Vitest)

| Test | File | What it verifies |
|---|---|---|
| Error code mapping | `src/lib/auth-errors.test.ts` | Known codes map to correct strings; unknown codes return generic message |

### Component tests (Vitest + React Testing Library)

| Test | File | What it verifies |
|---|---|---|
| Hero renders sign-in button | `components/landing/Hero.test.tsx` | Button is in the DOM, correct text and aria-label |
| Hero renders error message | `components/landing/Hero.test.tsx` | `authError` prop makes error message visible |
| Features renders all 4 cards | `components/landing/Features.test.tsx` | All cards render with title and description |
| Footer renders year | `components/landing/Footer.test.tsx` | Footer contains product name and current year |
| HeroCanvas not rendered server-side | `components/landing/HeroCanvas.test.tsx` | Component is loaded only via `next/dynamic` with `ssr: false` — SSR render produces no canvas element |

Three.js and GSAP are mocked in the Vitest environment — they must not run
in jsdom (no WebGL context available). Mocks live in
`src/__mocks__/three.ts` and `src/__mocks__/gsap.ts`.

### Integration / E2E tests (Playwright) — Phase 2

Deferred to Phase 2 when Better Auth is fully configured:

- Unauthenticated user visits `/` → sees landing page, canvas visible
- Authenticated user visits `/` → redirected to `/dashboard`
- User clicks sign-in button → redirected toward Google OAuth URL
- OAuth failure → error message visible on landing page
- `prefers-reduced-motion: reduce` → no canvas rendered, no GSAP transitions

### Manual checks before marking complete

- [ ] Three.js canvas renders and animates at ≥ 55 fps (DevTools Performance)
- [ ] Mouse movement causes subtle parallax shift in the canvas
- [ ] GSAP entrance animation plays on first load
- [ ] Feature cards animate in on scroll
- [ ] `prefers-reduced-motion: reduce` → all animations disabled, page fully readable
- [ ] WebGL disabled (via browser flags) → plain gradient background, no errors
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No console errors on page load
- [ ] Keyboard navigation works, sign-in button reachable
- [ ] Responsive at 375 px, 768 px, 1280 px
- [ ] `pnpm --filter @repo/web typecheck` passes
- [ ] `pnpm --filter @repo/web lint` passes

---

## 15. Implementation Tasks

Tasks are ordered. Each depends on the one above it unless noted.

---

### Task 1 — Bootstrap web app configuration

Create the five config files Next.js requires:

- `apps/web/tsconfig.json` — extends root, adds `jsx: preserve`, Next.js plugin,
  `@/*` → `./src/*` path alias
- `apps/web/next.config.ts` — security headers, `NEXT_PUBLIC_API_URL` passthrough,
  `esmExternals: false` or `transpilePackages: ["three"]` for Three.js bundling
- `apps/web/tailwind.config.ts` — content paths, brand color tokens
- `apps/web/postcss.config.js` — tailwindcss + autoprefixer
- `apps/web/components.json` — shadcn/ui init

Add `NEXT_PUBLIC_API_URL=http://localhost:3001` to `.env.example` and `.env.local`.

Acceptance: `cd apps/web && npx next info` runs without error.

---

### Task 2 — Install dependencies

Add to `apps/web/package.json`:

```
dependencies:
  three, gsap,
  @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge, lucide-react

devDependencies:
  @types/three
```

Run `pnpm install`.

Acceptance: `pnpm install` completes with no unmet peer dependency warnings
for `@repo/web`.

---

### Task 3 — Create root layout and global styles

- `apps/web/src/app/globals.css` — Tailwind directives, CSS custom properties
  for brand tokens and shadcn/ui variables
- `apps/web/src/app/layout.tsx` — `<html lang="en">`, Inter font via
  `next/font/google`, metadata, body base styles

Acceptance: `pnpm --filter @repo/web build` succeeds.

---

### Task 4 — Create utility and auth client files

- `apps/web/src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `apps/web/src/lib/auth-client.ts` — `createAuthClient` pointed at
  `NEXT_PUBLIC_API_URL`. Exports `signIn`, `signOut`, `useSession`.
- `apps/web/src/lib/auth-errors.ts` — OAuth error code → human-readable string map
- `apps/web/src/lib/auth-errors.test.ts` — unit tests
- `apps/web/src/__mocks__/three.ts` — Three.js mock for Vitest
- `apps/web/src/__mocks__/gsap.ts` — GSAP mock for Vitest

Acceptance: `pnpm --filter @repo/web typecheck` passes.
`pnpm --filter @repo/web test` passes.

---

### Task 5 — Create shadcn/ui Button component

- `apps/web/src/components/ui/button.tsx` — shadcn/ui Button with `variant`
  and `size` props. Variants: `default`, `outline`, `ghost`.

Acceptance: Component renders without errors. TypeScript strict-mode clean.

---

### Task 6 — Build Three.js hero canvas

- `apps/web/src/components/landing/HeroCanvas.tsx` — Client Component.
  Particle network scene as described in section 9.4.
  Checks for WebGL support. Handles resize. Disposes on unmount.
  Returns `null` if `prefers-reduced-motion` is active.

Acceptance:
- Canvas renders and animates when page is opened in a browser.
- AC-11, AC-13, AC-14, AC-15 pass.
- Component renders `null` server-side (loaded via `next/dynamic ssr:false`).

---

### Task 7 — Build landing page components with GSAP animations

- `apps/web/src/components/landing/Hero.tsx` — GSAP entrance animation,
  sign-in button, error message display. Dynamically imports `HeroCanvas`.
  Props: `authError?: string`.
- `apps/web/src/components/landing/Features.tsx` — 4 feature cards with
  GSAP ScrollTrigger entrance. Feature data defined as a typed const array.
- `apps/web/src/components/landing/Footer.tsx` — static, no animation.
- Component test files for each (Three.js and GSAP mocked).

Acceptance:
- All component tests pass.
- AC-12 passes (reduced motion).
- GSAP entrance plays on page load.
- Feature cards animate on scroll.

---

### Task 8 — Create landing page and dashboard stub routes

- `apps/web/src/app/page.tsx` — Server Component. Reads `?error=` search param.
  Session check stub. Renders `<Hero>`, `<Features>`, `<Footer>`.
- `apps/web/src/app/(dashboard)/page.tsx` — Stub ("Dashboard coming soon").

Acceptance:
- `http://localhost:3000/` renders with no console errors.
- `http://localhost:3000/dashboard` renders without 404.
- AC-1 through AC-9 pass.

---

### Task 9 — Verification

```bash
pnpm --filter @repo/web typecheck
pnpm --filter @repo/web lint
pnpm --filter @repo/web test
pnpm --filter @repo/web build
```

Manual: performance profiling, reduced-motion check, WebGL fallback check,
Lighthouse audit, responsive check, keyboard navigation.

All acceptance criteria AC-1 through AC-15 confirmed.

---

## Dependencies on Existing Modules

| Dependency | Status | Notes |
|---|---|---|
| `packages/shared` | ✅ Ready | No shared types needed for the landing page. |
| `packages/database` | ✅ Not needed | No DB access on landing page. |
| `apps/api` | ✅ Not needed directly | API must be running for OAuth (Phase 2). Landing page content is static. |
| Better Auth server config | ❌ Not yet built | Required for FR-8 and FR-5. Session check in `page.tsx` stubbed until Phase 2. |
| `/dashboard` route | ❌ Not yet built | Stub created in Task 8. Full implementation is Phase 2. |
| Google OAuth credentials | ❌ Placeholder in `.env.local` | Sign-in button URL constructed; OAuth flow won't complete until real credentials are set. |
| Three.js | ❌ Not yet installed | Added in Task 2. No prior usage in the codebase. |
| GSAP | ❌ Not yet installed | Added in Task 2. No prior usage in the codebase. |
