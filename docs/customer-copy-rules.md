# Customer-first bilingual copy maintenance

We explain our real waterproofing service, the relevant condition and the next step. Customers should not have to interpret audit notes or negotiate with an unnamed third-party provider.

## Sources

- `data/customer-first-copy.mjs`: exact reviewed original → English → Chinese revisions, with audit categories for internal maintenance only.
- `data/customer-first-locality.mjs` and `data/customer-first-locality-context.mjs`: explicit existing service-card/locality context revisions. No pathname inference, no inferred local project history.
- `data/customer-first-zh.mjs`: exact meaning-level translation corrections, merged into reviewed editorial overrides.
- `scripts/customer-first-copy.mjs`: authoring-only transform, after existing content owners, before bilingual/machine generation. URL/alt/IDs and executable JS are not edited.
- Existing source templates remain upstream inputs; reviewed revisions are intentional outputs, not a licence to blanket-replace brands or modal/safety words. All these authoring data files are excluded from deployment.

## Review rules

1. Read a complete paragraph and its heading before changing it. Use We/Our team when describing our own work; do not alter legal company names, Schema entity names, customer quotations or manufacturer attribution just to insert We.
2. Define affected area, removal, preparation, materials, finishes and related trades in the actual quoted scope. Do not turn optional/project-specific items into all-inclusive work, free inspections or a fixed price.
3. Keep meaningful limits: surface grout is not a membrane; a photo is not a concealed-condition inspection; pipe, electrical, structural and drainage tasks have separate responsibilities.
4. Preserve the owner-retained 10+ years, 10,000+ Australia-wide customers and qualified fastest-30-minute attendance claims. Keep the actual customer/service context and availability/address/safe-access conditions. A retained owner claim is not independent documentary verification.
5. The form receives an assessment enquiry, not a confirmed visit. No file-upload field exists. Photos go to the existing email. Do not test production delivery without permission.
6. Translate full meanings, especially not/neither/cannot. Screen=淋浴屏风, floor waste=地漏, drainage falls=排水坡度, cabinet board=柜板, bedding in a tile scope=铺贴找平层. Regrouting=重新填缝, never 重新铺砖.
7. A place name such as Page, Banks or Holder is not a common noun. Preserve official English labels when a reliable localised name is not established.
8. A no-match keyword search does not certify customer clarity. Review each page type and every distinct locality context, plus dynamic messages and metadata.

## Verification

Run `npm run generate` twice (second final output unchanged), `npm run check`, `npm test`. Compare original and revised hrefs, canonical/hreflang, index directives, images and DOM structure. Recheck English/Chinese services, quotes, FAQs, locality contexts, feeds and llms evidence. Check desktop/mobile and do not infer actual customer receipt from API acceptance.

When upstream wording changes, check that the intended revised occurrence is still emitted. Do not silently leave an obsolete mapping: review the replacement row and its paired translation. Tests assert customer-visible outcomes and important meaning; exempt only legal/privacy, proper names, citations and genuine safety guidance, not entire pages from quality review.

Changes stay local until the owner authorises deployment. Internal findings never belong in public page copy or the sitemap.
