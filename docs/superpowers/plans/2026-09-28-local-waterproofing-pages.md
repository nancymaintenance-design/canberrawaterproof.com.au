# Canberra Local Waterproofing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 24 useful Canberra locality pages with locality-aware enquiry forms, internal service links, visible FAQs and accurate machine-readable resources.

**Architecture:** A single Node generator will own the locality data, reusable HTML sections, structured-data output, the public JSON feed and the generated locality pages. Existing static pages remain the runtime; the service-area directory, sitemap and `llms.txt` consume the generated route list so navigation and discovery stay aligned.

**Tech Stack:** Static HTML/CSS, Node.js standard library, JSON-LD, existing Resend contact form JavaScript.

**Spec:** `docs/superpowers/specs/2026-09-28-local-waterproofing-pages-design.md`

## Global Constraints

- Publish 9 district hubs and 15 priority locality pages: 24 canonical routes in total.
- Use English public copy; it must serve visitors before search engines or AI systems.
- Keep experience and response statements qualified exactly as the design spec requires; do not add licence, insurance, compliance, price, attendance or repair-result claims.
- Each page must use visible content that matches its JSON-LD. Do not use hidden text, cloaking or schema-only claims.
- Reuse the existing Resend-backed contact form without changing its send behaviour.
- Selected entries in `/service-areas/` link to local detail pages; unselected entries retain the pre-filled contact shortcut.

## Review Focus

- A malformed or omitted locality must not produce a route, sitemap entry, JSON-feed entry or directory detail link.
- A page’s FAQPage schema must contain exactly its visible FAQ questions and answers.
- A locality form must retain the locality in the suburb field when JavaScript is unavailable and when the existing form script runs.
- Existing service, contact and directory pages must remain linked and fetchable after generation.
- `as fast as 30 minutes` language must always include the availability/enquiry-details limitation.

### Task 1: Add locality source data and generator contract

**Files:**
- Create: `scripts/build-local-waterproofing-pages.mjs`
- Create: `tests/local-waterproofing-pages.test.mjs`
- Create: `data/local-waterproofing-services.json`

**Interfaces:**
- Produces: `node scripts/build-local-waterproofing-pages.mjs --check` that validates source data and returns a route manifest to the test runner.
- Produces: a `LOCALITY_PAGES` collection with exactly 24 entries and properties `slug`, `name`, `district`, `kind`, `route`, `relatedLocalities` and `faq`.

- [ ] **Step 1: Write the failing generator-contract test**

Assert that the executable is missing or has no `--check` route manifest, then assert the desired manifest has 24 unique `/waterproofing/.../` routes, includes Aranda and all nine district hubs, and rejects duplicate slugs.

- [ ] **Step 2: Run the contract test to verify it fails**

Run: `node tests/local-waterproofing-pages.test.mjs --contract`

Expected: FAIL because the generator and manifest do not yet exist.

- [ ] **Step 3: Implement the minimal source-data and check interface**

Create the generator with the 24 approved records, shared service metadata and `--check` validation. Create the initial public feed from the same records; duplicate source lists are not permitted.

- [ ] **Step 4: Run the contract test to verify it passes**

Run: `node tests/local-waterproofing-pages.test.mjs --contract`

Expected: PASS with 24 unique routes.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-local-waterproofing-pages.mjs tests/local-waterproofing-pages.test.mjs data/local-waterproofing-services.json
git commit -m "feat: add locality page generator contract"
```

### Task 2: Generate visitor-facing local pages and structured data

**Files:**
- Modify: `scripts/build-local-waterproofing-pages.mjs`
- Modify: `tests/local-waterproofing-pages.test.mjs`
- Create: `waterproofing/<24 locality route>/index.html`

**Interfaces:**
- Consumes: `LOCALITY_PAGES` and shared service metadata from Task 1.
- Produces: `node scripts/build-local-waterproofing-pages.mjs` that writes a static `index.html` for every manifest route.

- [ ] **Step 1: Write the failing local-page test**

Assert that generated Aranda HTML contains a canonical URL, a single `Waterproofing Repairs in Aranda, ACT` H1, visible bathroom/shower, roof, kitchen, balcony and external-water-entry content, six internal service links, 3–5 visible FAQs, an availability-qualified rapid-response sentence, a suburb-pre-filled contact form and matching FAQPage/Breadcrumb/Service JSON-LD.

- [ ] **Step 2: Run the local-page test to verify it fails**

Run: `node tests/local-waterproofing-pages.test.mjs --pages`

Expected: FAIL because no generated locality pages exist.

- [ ] **Step 3: Implement page rendering**

Generate the shared page shell and locality-specific sections from the source data. Give each page a differentiated local introduction, enquiry pathway, symptoms, process, enquiry-preparation section, related-locality links and visible FAQ. Use the existing contact form markup and enquiry script with the suburb input populated from the locality.

- [ ] **Step 4: Run the local-page test to verify it passes**

Run: `node tests/local-waterproofing-pages.test.mjs --pages`

Expected: PASS for all 24 pages and all structured-data/visible-content parity assertions.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-local-waterproofing-pages.mjs tests/local-waterproofing-pages.test.mjs waterproofing
git commit -m "feat: add Canberra locality waterproofing pages"
```

### Task 3: Connect directory and discovery resources

**Files:**
- Modify: `service-areas/index.html`
- Modify: `sitemap.xml`
- Modify: `llms.txt`
- Modify: `data/local-waterproofing-services.json`
- Modify: `tests/local-waterproofing-pages.test.mjs`

**Interfaces:**
- Consumes: generated 24-route manifest from Task 1.
- Produces: directory, sitemap, JSON feed and `llms.txt` entries that each cover the same canonical route set.

- [ ] **Step 1: Write the failing discovery test**

Assert the selected 24 directory entries link to their canonical local pages, all remaining locality entries retain contact pre-fill links, the sitemap contains each generated route once, the JSON feed is valid and lists all 24 routes, and `llms.txt` links to both the service-area directory and feed.

- [ ] **Step 2: Run the discovery test to verify it fails**

Run: `node tests/local-waterproofing-pages.test.mjs --discovery`

Expected: FAIL because directory and discovery resources do not yet describe the generated route set.

- [ ] **Step 3: Implement discovery integration**

Update selected directory anchors and clarify their information-page role. Update sitemap and `llms.txt`, and regenerate the public feed from the manifest with canonical URL, locality, district, services and a build-date field.

- [ ] **Step 4: Run the discovery test to verify it passes**

Run: `node tests/local-waterproofing-pages.test.mjs --discovery`

Expected: PASS with parity across the directory, sitemap, feed and `llms.txt`.

- [ ] **Step 5: Commit**

```bash
git add service-areas/index.html sitemap.xml llms.txt data/local-waterproofing-services.json scripts/build-local-waterproofing-pages.mjs tests/local-waterproofing-pages.test.mjs
git commit -m "feat: link Canberra locality pages to discovery resources"
```

### Task 4: Build, regression-test and release the static site

**Files:**
- Modify: `tests/local-waterproofing-pages.test.mjs`
- Modify: generated files only if verification exposes a defect.

**Interfaces:**
- Consumes: generator, static pages and discovery resources from Tasks 1–3.
- Produces: a repeatable full verification command and a release-ready Git commit.

- [ ] **Step 1: Write the failing regression test**

Add a test that runs a clean generation, verifies all 24 route directories exist, checks the contact form endpoint and existing global phone/email links remain unchanged, and confirms the response wording is never unqualified.

- [ ] **Step 2: Run the regression test to verify it fails**

Run: `node tests/local-waterproofing-pages.test.mjs --regression`

Expected: FAIL until the test covers the new full-generation behaviour.

- [ ] **Step 3: Implement only any minimal generator or template correction required by the test**

Do not alter the existing contact-send implementation. Regenerate static outputs after the correction.

- [ ] **Step 4: Run all automated verification**

Run: `node tests/local-waterproofing-pages.test.mjs`

Expected: PASS with contract, page, discovery and regression checks green.

- [ ] **Step 5: Commit and deploy**

```bash
git add scripts tests data service-areas sitemap.xml llms.txt waterproofing
git commit -m "test: verify locality waterproofing page release"
```

Publish the committed static files to the existing `main` deployment route, then request and inspect a representative live Aranda page, a district hub, `/service-areas/`, the feed and sitemap.

## Self-Review

- Spec coverage: Tasks 1–4 cover all 24 routes, long-form local copy, forms, visible FAQs, JSON-LD, feed, `llms.txt`, sitemap, directory links and live QA.
- Step scan: every task begins RED, names one command and creates a testable artifact before its commit.
- Type consistency: Tasks 2–3 consume the `LOCALITY_PAGES` manifest and route shape declared by Task 1.
- Review Focus: contract, page, discovery and regression tests respectively exercise the five listed failure modes.
- Proportion: generator and page data are intentionally separated from the test harness so future locality additions have one source of truth.
