# MEL ONE Canberra Waterproofing — GitHub Pages upload

This is a deployment-ready static website package. Upload the contents of this folder to a GitHub repository, then configure your preferred static-hosting workflow to publish the repository root.

The original editable source project and high-resolution PNG photos remain in the local `canberra-waterproof` project folder. This upload package uses optimised JPEG copies to fit common GitHub web upload limits.

## Supported local maintenance

Run `node scripts/apply-seo-maintenance.mjs` (or `--root <checkout>`) to apply idempotent responsive-image markup, evidence-supported schema relationships, guide links and canonical discovery files. Eight existing keyword sections are protected by exact committed source in `data/keyword-content-sections.json`: missing sections are restored; changed or duplicated sections fail for review. The fixed lastmod manifest dates only the eight service pages with keyword additions in commit `5077296` on 2026-10-10 and four guides that gained related-reading content that day; reruns do not assign today's date.

The supported locality workflow is `node scripts/build-local-waterproofing-pages.mjs --verify`. It regenerates its 24 owned locality pages and synchronously calls maintenance after writing pages and discovery resources. `--check` remains read-only. Run `node --test tests/*.test.mjs` for repository checks; this suite exercises the locality generator, so run maintenance after any interrupted generation. Maintenance never calls the generator or external endpoints.

Other historical scripts rewrite authored service/guide text and metadata and are not a safe full-site regeneration workflow. Do not batch-run them against this checkout. Evaluate future template changes in an isolated copy, preserve authored content, then run maintenance and verify the diff before accepting it. Source assets and responsive manifest must be present; image derivatives are generated separately by the Task 1 image workflow.

See [audit status and evidence checklist](docs/seo/2026-10-10-remaining-audit-status.md) for production/account/evidence work still outstanding. AI crawlers retain the default public access in robots.txt; llms.txt is a canonical content index and does not replace robots or guarantee search/AI visibility. No remote publication or submission is part of maintenance.
