# SEO audit action status — 2026-10-10

Scope: local static files only. The original audit is not a fresh production crawl. No deployment, account change, external submission or new rating/traffic/CWV measurement was performed. Existing marketing wording, titles, descriptions, contacts and eight keyword additions are protected. The statuses below distinguish code delivery from evidence and production acceptance.

| Audit action | Status | Evidence / remaining acceptance |
|---|---|---|
| Responsive photographs, logo, hero and carousel delivery | Implemented locally (Task 1); pending production verification | `scripts/responsive-images.mjs`, image manifest and image optimisation report. Maintenance reapplies wrappers after generation; real PSI/CrUX results remain unknown. |
| Active hero priority and inactive carousel handling | Already present / retained | Existing high-priority active hero and carousel lazy logic retained. Verify interaction, keyboard/reduced-motion behaviour and no-JS fallback after publication. |
| Single H1, canonical, JSON-LD, crawlable HTML and internal routes | Already present; locally verified | 37 sitemap canonical pages; local validation checks one H1/self canonical, JSON parsing and existing local href targets. Production HTTP 200 and redirect tests remain pending. |
| `/index.html` and non-www canonical redirects | Already present locally; pending production verification | Permanent redirects in `vercel.json`; loopback preview cannot exercise Vercel headers/host routing. |
| Thank-you crawl/noindex conflict | Already resolved locally; pending production verification | `robots.txt` allows crawl; thank-you retains meta noindex. Check production robots and URL Inspection. |
| Security headers | Already present locally; pending production verification | `vercel.json` sets nosniff, referrer, permissions and SAMEORIGIN. Verify real responses and Maps/forms/GA behaviour after deployment. |
| CSP report-only, enforcement and HSTS expansion | Pending evidence/configuration and production verification | Need a real reporting endpoint, approved policy, violation collection and interaction tests. No cosmetic untested CSP was added. Confirm HTTPS on all subdomains before expanding HSTS. |
| Tablet navigation and mobile contact controls | Already present locally; local browser checks passed; pending device/production verification | CSS wraps navigation through 621–900px; mobile controls below 620px. Controller checked home at 360/390/430/768/900px without overflow and with correct controls, plus representative pages at 1280/390px. Real-device and production acceptance remain pending. |
| Service entity relationships | Implemented locally | Core service and locality owner WebPages reference their real Service as mainEntity; Service provider reuses canonical `#business`. No new business identity. |
| Article relationships and visible image/publisher | Implemented locally | Existing guide/news Article nodes reference canonical WebPage, existing cover image and canonical business publisher. No publication/review dates or named authors inferred. |
| Business logo/social entity references | Implemented locally | Reuses the PNG logo and Instagram/YouTube/TikTok links already visible on each page. These links are not external ownership certification. |
| Breadcrumbs and existing visible FAQ schema | Already present / retained | Existing BreadcrumbList/FAQ content preserved. No FAQ expansion or promise of Google commercial FAQ rich results. External Schema Validator/Rich Results Test remains pending authorised publication checks. |
| Guide → service → project photos → contact path | Implemented locally / existing paths retained | Four guides gain compact uniquely marked related sections with two relevant services and contact CTA; three reference the existing project gallery. Quote and drainage guides already have two contextual services and CTA and need no redundant section. Original conclusions/booking links retained. No unsupported case attribution. |
| Eight keyword sections and maintenance source | Implemented locally | Exact baseline blocks committed in `data/keyword-content-sections.json`; missing blocks restored, changed/duplicate blocks rejected. Their real 2026-10-10 content-change date is evidenced by commit `5077296`, not file mtime. |
| Authored service prose and metadata rewrites | User-protected | Preserve original text/title/description, even where audit proposed shorter descriptions or greater readability. Future edits require scope change. |
| Region-specific content, consolidation or noindex | Pending evidence; current index decisions user-protected | Existing service priorities differ, but unique project/access/customer evidence remains missing. Preserve current 9 indexable district hubs and 15 noindex locality pages; do not infer new geography or change indexability. |
| About legal identity and insurance | Already present; further verification pending evidence | About displays legal entity, ABN/ACN/GST and Chubb AUD20m policy period. Preserve them; their presence does not independently certify validity, currency or scope. |
| Team, professional qualifications and guide review process | Pending evidence | Named, consenting responsible people; relevant verifiable credential identifiers, issuing authority, scope and approved publication/review records required. Existing Organization author MEL ONE retained. |
| Case-study details and original project records | Photos already present; full case pages pending evidence | Existing gallery includes bathroom images and balcony before/during/after. Need permission, locality, actual date, agreed scope, finding/result and same-job image attribution before detailed case pages. Do not describe the gallery as absent. |
| Customer reviews and local citations/backlinks | Pending evidence / authorised external work | Need permitted original review text, source URL/date and attribution; documented neutral request process and genuine partner/association evidence. No invented ratings, gated incentives or new external messages. |
| GBP/NAP/hours/service-area accuracy | Pending account access/evidence | Compare exact business identity, contact/service area and approved hours with GBP and real directories; determine address visibility appropriate to the business. Website NAP is present, not proof of profile accuracy. |
| Contact-intent and accepted-request conversion hooks | Implemented locally (Task 3); pending authorised production/account acceptance | Fixed enum parameters cover phone, email, contact/locality booking intent; generate_lead requires HTTP success and API acceptance. New hooks suppress loopback transmissions. Existing automatic GA4 configuration is unchanged; this is not an overall privacy guarantee. See [conversion tracking](2026-10-10-conversion-tracking.md). |
| GSC/GA4/GBP baseline and monthly KPIs | Pending access/production verification | Authorised property/profile access and query/traffic/conversion/GBP exports required. Separate Task 3 conversion hooks are locally complete; account key-event configuration, DebugView/transport acceptance and real production collection remain pending. No ranking/traffic uplift claimed. |
| Sitemap lastmod | Implemented locally | Twelve content-change entries: eight service pages with keyword additions in `5077296` and four guides with new related-reading content, all on 2026-10-10. Fixed manifest below; no blanket date or inference from imports/schema-only updates. |
| IndexNow key and publishing trigger | Pending evidence / authorised production work | Confirm key ownership, serve verification file at canonical origin, validate endpoint/key and select actual changed URLs after publication. No key generated or submission sent. |
| AI crawler policy and llms index | Implemented locally / default access retained | All llms site links canonical www; missing laundry/roof/retaining-wall service and gallery routes added. `robots.txt` retains default public access. llms is an index, not a rank/citation guarantee. Any future bot restriction needs a business policy decision. |
| Production PSI/CrUX and SEO outcome acceptance | Pending production verification | Measure mobile/desktop homepage and main service pages before/after comparable publication; inspect GSC CWV p75 LCP/INP/CLS and indexing. Local asset savings and screenshots are not CWV/ranking measurements. |

## Fixed content-change manifest

Eight service pages received the exact keyword additions in commit `5077296277860a8570085bd65c1eb4c8e8d9c147`, committed 2026-10-10 10:35:13 +0800:

- `/services/leaking-shower-repairs/`
- `/services/bathroom-waterproofing/`
- `/services/shower-resealing-regrouting/`
- `/services/balcony-waterproofing/`
- `/services/kitchen-sealing/`
- `/services/external-waterproofing/`
- `/services/laundry-waterproofing/`
- `/services/roof-waterproofing/`

Four existing guides received the marked related-service section on 2026-10-10. These dates describe the content changes, not original publication or professional review:

- `/guides/shower-plumbing-or-waterproofing/`
- `/guides/regrouting-resealing-or-rewaterproofing/`
- `/guides/balcony-leaking-room-below/`
- `/guides/kitchen-sink-resealing-or-plumbing/`

The twelve-entry manifest is exported as `contentChanges` by the maintenance module. A newer existing lastmod is retained. Other URLs receive no date from this run, including the two already-compliant guides and the retaining-wall service. Extending the manifest requires a genuine documented content change; rerunning the script never advances the clock.

## Evidence collection checklist

- Regional pages: actual job locality, approved dates, problems found, agreed scope, matching images/results, genuine local access/appointment constraints and consent to publish. Prioritise with actual GSC/GBP demand.
- About/team: current legal/insurance documents and permissions; named responsible personnel, credential issuers/identifiers and precise approved claims. Do not infer a qualification from a company name or photograph.
- Reviews: original review platform URL, author permission/attribution, original text/date and non-selective invitation process. Verify eligibility before any review markup.
- Cases: same-job original image mapping, customer permission, inspection evidence, actual work/materials/result, locality and dates; check privacy before a standalone case page.
- Guides: accountable author/reviewer consent and verifiable experience, original technical sources, actual publication and later review log. No date derived from Git import/file mtime.
- GSC/GA4/GBP: authorised access, time-window exports and agreed conversion definitions; review consent and automatic measurement separately. Configure/validate key events in the authorised production account.
- IndexNow: owned verification key/file and production URL reachability; explicitly authorised post-publication submissions with response logging.
- CSP: working reporting endpoint/retention, violation sampling, inventory of Maps/GTM/scripts/forms and report-only validation before enforcement.
- Performance: comparable production PSI mobile/desktop runs and CrUX/GSC data if available; complete representative device/navigation/form/slider tests without sending live leads.

## Maintenance and external acceptance boundaries

`node scripts/apply-seo-maintenance.mjs --root <checkout>` safely restores absent protected sections and image wrappers, adds supported schema/link changes and maintains discovery files. It never invokes a generator or network service. The locality generator calls it synchronously after writing pages/discovery resources; no recursion, child-process maintenance or parallel race is introduced. Historical rewrite generators are not a supported full-site regeneration command: they replace authored prose and metadata. Do not run them blindly. Use an isolated copy and compare all protected text before manually accepting any future template change.

External validators, account configuration, profile edits, publication, HTTP/header checks, IndexNow and production measurements remain separate work. This checklist does not mark those tasks complete.

References supplied and checked by the controller: [Google accurate sitemap lastmod guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article), [Schema.org Service](https://schema.org/Service). Local skill schema-type reference was resolved from the shared SEO references directory after its relative path proved absent; unverified AI-citation uplift claims were not used.
