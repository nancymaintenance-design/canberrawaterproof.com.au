# Technical SEO Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the deployment-ready Canberra Waterproof site’s canonical routing, crawl directives, safety headers, homepage loading/accessibility, tablet navigation, and verified LocalBusiness markup without publishing it.

**Architecture:** The repository is a deployment-ready static site, so the work patches its route files directly and protects each outward-facing invariant with Node built-in test-runner tests. Vercel owns redirects and response headers; HTML/CSS owns carousel, schema, and responsive-navigation behaviour. No build system, third-party dependency, or production deployment is introduced.

**Tech Stack:** Static HTML, CSS, vanilla browser JavaScript, Vercel configuration, Node.js built-in `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-10-technical-seo-optimisation-design.md`

## Global Constraints

- Work only in `E:\EllisWebsite-GitHub\_canberra_git_clone`, the current clone of `github.com/nancymaintenance-design/canberrawaterproof.com.au`.
- Preserve existing public copy, claims, business data, contact route, and Vercel deployment ownership.
- Do not invent or alter client reviews, licences, qualifications, opening hours, pricing, geographic coordinates, project facts, or case-study claims.
- Do not push or deploy. Final delivery is a local preview only and requires explicit user confirmation before any GitHub or Vercel action.
- Keep the first hero image as the sole eager LCP candidate; preserve explicit image dimensions.
- Do not add an enforcing CSP in this batch.

## Review Focus

- Existing non-www host canonicalisation must continue alongside the new `/index.html` redirect; Task 1 tests both rules.
- Thank-you must remain excluded from indexing after becoming crawlable; Task 1 tests its meta robots directive and absence from robots disallow rules.
- Google Maps, GTM, and contact delivery must not be blocked by a speculative CSP; Task 1 tests that no CSP header is introduced.
- The only eager hero image must remain the active LCP image; Task 2 tests exact image attributes for all three slides.
- Screen-reader state must always identify one active slide; Task 2 tests the carousel state-setting code and static initial state.

---

### Task 1: Canonical routing, crawler directives, and safe response headers

**Files:**
- Create: `tests/technical-seo-config.test.mjs`
- Modify: `vercel.json`
- Modify: `robots.txt`
- Test: `tests/technical-seo-config.test.mjs`

**Interfaces:**
- Consumes: Vercel `redirects` and `headers` JSON configuration; plain-text `robots.txt`.
- Produces: a permanent `/index.html` canonical redirect; security headers applied to `/:path*`; a crawlable `thank-you` route that remains page-level noindex.

- [ ] **Step 1: Write the failing configuration tests**

Create tests that parse `vercel.json`, read `robots.txt` and `thank-you/index.html`, and assert:

```js
assert.ok(config.redirects.some((rule) =>
  rule.source === '/index.html' && rule.destination === '/' && rule.permanent === true));
assert.ok(config.redirects.some((rule) =>
  rule.has?.some((condition) => condition.type === 'host' && condition.value === 'canberrawaterproof.com.au')));
assert.doesNotMatch(robots, /^Disallow:\s*\/thank-you\/$/m);
assert.match(thankYou, /<meta name="robots" content="noindex,follow">/);
```

Also assert a `/:path*` header rule contains exactly these values: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and `X-Frame-Options: SAMEORIGIN`; assert no `Content-Security-Policy` header exists.

- [ ] **Step 2: Run the new test to verify it fails**

Run: `node --test tests/technical-seo-config.test.mjs`

Expected: FAIL because `/index.html` redirect and required headers are absent and `robots.txt` still disallows thank-you.

- [ ] **Step 3: Implement the minimal configuration changes**

In `vercel.json`, add the permanent source-specific `/index.html` redirect before the host-based canonical redirect, and add one global `headers` rule for `/:path*` with the four specified headers. Remove only `Disallow: /thank-you/` from `robots.txt`; do not alter its sitemap line or thank-you HTML noindex directive.

- [ ] **Step 4: Run the configuration test to verify it passes**

Run: `node --test tests/technical-seo-config.test.mjs`

Expected: PASS with all redirect, crawler, header, and no-CSP assertions satisfied.

- [ ] **Step 5: Commit Task 1**

```powershell
git add vercel.json robots.txt tests/technical-seo-config.test.mjs
git commit -m "fix: harden canonical and crawl configuration"
```

### Task 2: Homepage critical-image, carousel accessibility, tablet navigation, and schema

**Files:**
- Create: `tests/homepage-technical-seo.test.mjs`
- Modify: `index.html`
- Modify: `assets/site.css`
- Test: `tests/homepage-technical-seo.test.mjs`

**Interfaces:**
- Consumes: the existing `hero-slide`, `is-active`, `data-hero-*`, `.nav`, and `.mobile` markup/classes; the existing JSON-LD `#business` node.
- Produces: one initial LCP image, deferred inactive slides, accessible carousel state, no 621–900px navigation gap, and an enriched single LocalBusiness entity.

- [ ] **Step 1: Write the failing homepage tests**

Create a test that reads `index.html` and `assets/site.css`. Assert that the first hero slide alone contains `fetchpriority="high"` and does not contain `loading="lazy"`; the other two slides contain `loading="lazy" decoding="async"`; the first slide starts with `aria-hidden="false"` and the two others with `aria-hidden="true" inert`.

Assert the carousel script updates `aria-hidden` and `inert` when `show(n)` changes the active slide. Assert CSS keeps `.nav` available for the 621–900px interval and does not make the only mobile fallback visible only at `max-width:620px` without another navigation alternative.

Parse the single JSON-LD graph and assert its sole `LocalBusiness` node has the existing homepage hero image and logo URLs plus this exact visible social list:

```js
[
  'https://www.instagram.com/melone.maintenance1/',
  'https://www.youtube.com/@MelOneMaintenance',
  'https://www.tiktok.com/@melonemaintenance5/'
]
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `node --test tests/homepage-technical-seo.test.mjs`

Expected: FAIL because inactive slides lack lazy/async attributes and state semantics, tablet navigation is hidden, and LocalBusiness lacks `image`, `logo`, and `sameAs`.

- [ ] **Step 3: Implement the smallest homepage and stylesheet patch**

Update only the second and third hero `<img>` elements with lazy/async decoding attributes. Add correct initial accessibility attributes to all slides, and update `show(n)` to keep `is-active`, `aria-hidden`, and `inert` synchronised.

Retain a compact `.nav` at 621–900px by replacing the existing `@media(max-width:900px){.nav{display:none}...}` behaviour with a layout-safe rule that only hides it at `max-width:620px`, where the existing fixed mobile CTA remains available. Add `image`, `logo`, and `sameAs` only to the existing `#business` JSON-LD object.

- [ ] **Step 4: Run the homepage test to verify it passes**

Run: `node --test tests/homepage-technical-seo.test.mjs`

Expected: PASS with all hero, accessibility, navigation, and schema assertions satisfied.

- [ ] **Step 5: Commit Task 2**

```powershell
git add index.html assets/site.css tests/homepage-technical-seo.test.mjs
git commit -m "feat: improve homepage technical SEO"
```

### Task 3: Whole-site regression verification and local review preview

**Files:**
- Modify: no production file expected
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: completed Task 1 and Task 2 changes plus the existing static-site test suite.
- Produces: fresh full-suite evidence and a local, non-deployed preview URL.

- [ ] **Step 1: Run the full automated suite**

Run: `node --test tests/*.test.mjs`

Expected: all existing and new tests pass with zero failures.

- [ ] **Step 2: Manually verify local route and viewport behaviours**

Start the existing static server on a non-conflicting local port, then verify: `/` loads, `/index.html` route behaviour is documented as Vercel-only configuration, `/thank-you/` retains noindex in HTML, hero controls change accessible slide state, and navigation remains available at an 800px viewport. Stop and correct any regression before proceeding.

- [ ] **Step 3: Check the final diff and working tree**

Run: `git diff HEAD~2..HEAD --check` and `git status --short`.

Expected: no whitespace error; only deliberate project changes and no generated preview files tracked.

- [ ] **Step 4: Report the preview, without deployment**

Report the exact localhost URL, test output summary, files changed, and the fact that no GitHub push or Vercel deployment was made. Wait for user confirmation before any external release action.

## Self-Review

- Spec coverage: Task 1 covers canonical routing, thank-you crawl rules, response headers, and the deliberate no-CSP boundary. Task 2 covers hero performance, carousel semantics, tablet navigation, and verified schema fields. Task 3 covers full-suite verification and the local-only preview constraint. Content/schema fields excluded by the spec remain excluded.
- Step scan: each implementation task has its own red-green test cycle and a scoped commit; the final task validates the integrated outcome only.
- Type consistency: this plan uses existing Vercel JSON route/header objects and existing HTML/CSS/JS class and data-attribute interfaces; it introduces no application API.
- Review focus: each listed failure mode is pinned to the owning Task 1 or Task 2 test.
- Proportion: the plan names decisions, expected assertions, and commands without reproducing implementation bodies.
