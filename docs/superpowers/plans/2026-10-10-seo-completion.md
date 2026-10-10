# SEO completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Execute continuously; user explicitly requested notification after completing the optimisation plan.

**Goal:** Finish every evidence-supported local optimisation in the audit without changing existing marketing wording or publishing.

**Architecture:** Retain the static HTML site. Add repeatable, idempotent maintenance scripts for responsive image delivery and safe SEO enhancements; preserve authored keyword sections during service-page regeneration. Do not introduce a framework or production runtime dependency.

**Tech Stack:** Static HTML/CSS, Node built-in test runner, bundled Sharp for offline image conversion.

**Spec:** `C:/Users/UFTR/Desktop/Entry/9、canberrawaterproof/seo优化记录/FULL-AUDIT-REPORT.md`, constrained by subsequent user instructions: preserve marketing wording, local preview only, complete feasible work without intermediate approval requests. Keyword content from `5077296` is part of the baseline.

## Global Constraints

- Preserve existing marketing wording, title, description, contact details, original image files, and existing keyword additions. Additive content and technical markup only.
- No push, remote merge, PR, deployment, form submission, external profile edits or publication.
- Work in the existing `codex/keyword-content-expansion` linked worktree. Preserve the pre-existing EOL-only dirty `data/local-waterproofing-services.json`.
- No invented cases, testimonials, qualifications, authors/reviewers, dates, geographic facts, prices, capabilities, ratings or business hours.
- No arbitrary noindex, deletion or merging of regional pages; business evidence is required first.
- Local HTTP preview cannot validate Vercel response headers or production Core Web Vitals. Report limitations accurately.
- Use apply_patch for source edits; binary conversion tools may generate image derivatives.

## Review Focus

1. Picture wrappers must not break existing CSS/JS direct-child assumptions or carousel lazy-loading.
2. Small screens must select smaller resources; transparent logo edges and original aspect ratios must remain intact.
3. Re-running maintenance must not duplicate markup, remove keywords or change visible marketing copy.
4. JSON-LD relationships must point to real canonical entities, not duplicate businesses or invented evidence.
5. Sitemap dates must reflect real changed content, never daily whole-site dates; unverified external work must stay pending.

### Task 1: Responsive image delivery

**Files:** Create `scripts/optimise-site-images.mjs`, `scripts/responsive-images.mjs`, `data/responsive-images.json`, `tests/responsive-images.test.mjs`; modify image markup in published HTML and necessary narrowly scoped CSS; create image derivatives under assets; documentation `docs/seo/2026-10-10-image-optimisation.md`.

**Interfaces:** Export `applyResponsiveImages(html: string, manifest: object): string` from `scripts/responsive-images.mjs`; manifest maps original `/assets/...` image paths to generated WebP width/url candidates and original dimensions. CLI supports explicit root and Sharp module path; no hard-coded user-machine runtime paths in committed code. Task 2 consumes this transformer for regenerated pages.

- [ ] Write focused tests for real transformation: original img attributes/alt/dimensions retained, PNG/JPEG fallback retained, srcset widths correspond to assets, no lazy on active hero, existing inactive lazy preserved, logo transparency, idempotence, original source files unchanged. Observe expected failing test before implementation.
- [ ] Inventory published img and CSS-background references. Convert referenced large photographs into WebP candidates at 480/800/1200 and native width where useful, never upscale. Use Sharp q82 initially; keep acceptable detail. Logo use lossless transparent WebP at appropriate display/DPR sizes, retain PNG fallback. Keep original photos unchanged and no generative image edits.
- [ ] Implement offline encoder plus idempotent transformer. Use existing layout rules to choose correct sizes. For carousel use responsive attributes without breaking scripts or adapt only necessary selectors. Keep active hero priority; don't blanket eager-load below fold. Handle CSS decorative backgrounds only if safe with original fallback.
- [ ] Apply to static site; validate every local derivative resolves and dimensions match candidate width; byte savings report is measured not a claimed CWV gain. Record original and derivative sizes.
- [ ] Run focused tests then `node --test tests/*.test.mjs` once on final code. Self-review and commit only owned changes. Do not stage pre-existing JSON EOL dirt.

### Task 2: SEO maintenance and audit closure

**Files:** Create `scripts/apply-seo-maintenance.mjs`, `data/keyword-content-sections.json`, `tests/seo-maintenance.test.mjs`, `docs/seo/2026-10-10-remaining-audit-status.md`; modify relevant HTML JSON-LD and additive internal-link sections, `llms.txt`, `sitemap.xml`, README and generator tails as needed. No change to existing marketing metadata.

**Interfaces:** Consume `applyResponsiveImages(html, manifest)` from Task 1. Provide idempotent maintenance CLI accepting root and applying safe improvements to generated files; protect eight existing keyword sections with committed source data. Integrate maintenance after existing relevant generators or document a single explicit supported regeneration command with protective verification.

- [ ] Inspect sitemap canonical pages and existing Service/WebPage/Article/Breadcrumb graphs; inventory current guide-to-service and case-study pathways. Write failing tests using fixtures for maintenance idempotence, source content preservation, missing-keyword restoration, entity relationships, canonical llms links and truthful changed-page sitemap dates.
- [ ] Restore existing eight marked keyword additions from exact committed text when absent after regeneration; never replace original marketing content. Reapply responsive images after supported regeneration. Avoid executing all historical rewrite scripts on live checkout.
- [ ] Add Service as WebPage mainEntity for real service owner pages, article mainEntityOfPage and existing visible image/publisher references where supported; reuse canonical #business. Add real image/logo/sameAs references only from existing visible site evidence. No fabricated authors/dates/reviews or automatic FAQ expansion.
- [ ] For guides lacking two contextual related-service links and a CTA, add compact contextual related-reading links using existing headings/service names. Reuse relevant existing case-study links; do not claim unavailable project evidence. Preserve all original prose.
- [ ] Canonicalise llms.txt links to www; include missing existing core service/case links. Keep default existing AI crawler access; document policy, do not add crawl bans.
- [ ] Add accurate lastmod only to pages with genuine content changes in this work (keyword additions or related-reading additions), using documented 2026-10-10 content-change manifest. Do not infer publication dates from imports or set all pages to today. Ensure locality generator does not erase these updates in supported workflow.
- [ ] Document every audit action as implemented/already present/pending evidence/pending production verification/user-protected. Prepare specific evidence checklist for regional content, About/team, reviews, cases, guide authors, GSC/GA4/GBP, IndexNow key/production submission, CSP report endpoint and production PSI. Do not equate the checklist with completion of external work.
- [ ] Run focused tests then full suite once; verify local hrefs/JSON-LD, single H1/self canonical for sitemap pages and diff preservation. Self-review and commit only owned changes. Final independent review follows.

## Controller deliverables

- Maintain task/review ledger and independent review packages.
- Keep preview on loopback 4174, verify representative desktop/mobile pages visually without submitting forms.
- Final Chinese MD roll-up with measured improvements, validation, local preview, unchanged marketing assurance and explicit outstanding evidence/access/production checks. No false claim that external tasks are complete.
