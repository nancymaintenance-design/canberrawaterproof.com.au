# Technical SEO Optimisation Design

## Purpose

Improve the technical SEO, accessibility, and load behaviour of the live-equivalent Canberra Waterproof static site without publishing any change. The work is based on the 2026-10-10 audit and is limited to changes that are either objectively verifiable from the existing source or do not require new business facts.

## Scope and constraints

- Work in `E:\EllisWebsite-GitHub\_canberra_git_clone`, the current clone of `github.com/nancymaintenance-design/canberrawaterproof.com.au`.
- Preserve the existing public copy, claims, business data, contact route, and Vercel deployment ownership.
- Do not invent, add, or alter client reviews, licences, qualifications, opening hours, pricing, geographic coordinates, project facts, or case-study claims.
- Do not deploy, push, or create a Vercel production deployment. The delivery endpoint is a local preview only, for user confirmation.

## Selected approach

Use an incremental, source-first patch to the deployment-ready static site. This avoids replacing the site generator or redesigning pages, makes every change reviewable as a normal Git diff, and allows the current Node test suite to be extended as regression protection.

The alternative of rebuilding the separate `canberra-waterproof` source project was rejected for this batch: the Vercel-connected GitHub repository is the source of truth for production and already contains the current static output and tests. A content-first batch was also deferred because it needs verified business inputs.

## Changes

### 1. Canonical and crawl directives

- Add a permanent `/index.html` to `/` redirect in `vercel.json` while retaining the existing non-www host redirect.
- Remove the `/thank-you/` `Disallow` rule from `robots.txt`; retain the existing page-level `noindex,follow`, so compliant crawlers can read the directive.
- Add a test that checks both conditions in the deployment configuration and generated files.

### 2. Response hardening

- Add non-breaking Vercel headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy` disabling camera, microphone, and geolocation.
- Add `X-Frame-Options: SAMEORIGIN` for clickjacking protection.
- Do not add an enforcing Content-Security-Policy in this batch because the existing site uses Google Tag Manager and a Google Maps iframe. CSP needs a report-only rollout and a separate verification cycle.
- Add tests that assert the exact required headers in `vercel.json`.

### 3. Homepage image and carousel loading

- Keep the first hero image as the only LCP candidate, including `fetchpriority="high"`.
- Mark the two inactive hero images as lazy and async-decoded, so they are not initial critical-path image requests.
- Update the carousel script to set `aria-hidden` and `inert` on inactive slides. The active slide is exposed to assistive technology; controls continue to work without changing the visual design.
- Add async decoding to non-LCP homepage content images where it is safe and preserve explicit dimensions on all images.
- Do not claim a measured Core Web Vitals improvement. The acceptance measure is source-level prioritisation plus a fresh local build/test; PageSpeed/CrUX remain post-deployment measurements.

### 4. Tablet navigation continuity

- At 621–900px, keep a compact, visible primary navigation available rather than hiding navigation altogether.
- Reuse the existing links and styles; do not introduce a JavaScript menu dependency or new navigation content.
- Cover the breakpoint rule with a source-level test that rejects the prior navigation gap.

### 5. Schema enrichment with already-visible facts only

- Extend the existing `LocalBusiness` node with `image`, `logo`, and the three already-visible social profiles in `sameAs`.
- Leave hours, geo, rating, reviews, service promises, and credentials absent until independently confirmed.
- Assert that there is only one LocalBusiness entity and that all added values occur in visible site content.

### 6. Metadata and content are excluded

- No title, description, service-area, guide, case-study, or E-E-A-T copy will be rewritten in this batch. The audit identifies content work, but high-quality implementation requires user-approved real facts and source material.

## Validation and preview

1. Write regression tests first for each changed behaviour and observe the expected failing state.
2. Implement the smallest source changes that make the tests pass.
3. Run the full `node --test tests/*.test.mjs` suite.
4. Start the repo's static server on a local port and inspect the homepage, `/index.html` redirect behaviour, `/thank-you/`, and a 621–900px viewport.
5. Report the local URL and all verification evidence. Wait for explicit user confirmation before any GitHub push or Vercel action.

## Risks and rollback

- Header rules apply to all routes; the chosen initial headers are designed not to break Google Maps, analytics, or forms. CSP is excluded to avoid unverified third-party breakage.
- Lazy-loading non-active hero slides can reveal an image late only after the carousel advances; the active LCP image remains immediate.
- Every change is a small tracked-file diff and can be reverted by reverting the resulting commit. No deployment is part of this design.
