# Responsive image delivery — 2026-10-10

42 referenced original images (including gallery PNGs and the decorative CSS reference) have 167 WebP candidates. Originals total 24,896,666 bytes; the largest candidate for each original totals 8,518,208 bytes (65.79% reduction). The smallest candidates total 1,270,266 bytes (94.90% reduction). All derivatives together occupy 18,823,142 bytes: this is storage, not a page transfer estimate. Logo comparison includes resizing to display/DPR dimensions; photographs compare largest/native widths. These are measured file sizes, not measured Core Web Vitals gains.

Photos use WebP quality 82 at 480, 800, 1200 and original width without upscaling. The transparent logo uses lossless WebP at 58/116/174 pixels; the original PNG remains the fallback. Existing img tags, alt text, width/height, loading and fetchpriority remain exact inside picture. Active homepage hero remains eager/high priority; inactive images retain lazy loading. Carousel selectors target figures and descendant images, so wrappers preserve functionality; scoped CSS preserves full-height hero/card crops. Article images retain natural aspect ratio. CSS decorative background remains the original JPEG fallback: current site.css hides that pseudo-element, so no extra responsive CSS requests were introduced. A derivative is inventoried for future supported use.

The transformer is idempotent and skips existing picture elements. It selects sizes from the actual hero/card/article/logo layout and does not rewrite marketing copy, metadata, keyword blocks or originals. Header logo is displayed in its existing 58px square with object-fit containment; candidates keep the original approximately 1.25 aspect ratio.

## Reproduction

Run `node scripts/optimise-site-images.mjs --root <site-root> --sharp <sharp-module-directory>` (or set `SHARP_MODULE_PATH`). The offline encoder creates binary files under assets/responsive and emits the manifest JSON on stdout. Save that generated JSON as data/responsive-images.json, review it, then use the supported SEO maintenance command documented by Task 2 to apply markup. No production runtime dependency or committed machine-specific path is introduced. Missing optional stylesheet files are tolerated; required CLI argument values are checked. Encoding verifies output dimensions and alpha; tests independently read WebP header dimensions and SHA-256 of originals.

## Measured inventory

| Original | Original bytes | Smallest width / bytes | Largest width / bytes |
|---|---:|---:|---:|
| /assets/about-team-site.jpg | 284917 | 480 / 37806 | 1499 / 207342 |
| /assets/about-team-workshop.jpg | 276075 | 480 / 38562 | 1499 / 192460 |
| /assets/balcony-waterproofing-after.png | 2727552 | 480 / 16008 | 1536 / 177292 |
| /assets/balcony-waterproofing-before.png | 2995754 | 480 / 26392 | 1536 / 245404 |
| /assets/balcony-waterproofing-during.png | 2816393 | 480 / 27550 | 1536 / 203880 |
| /assets/bathroom-finished-wide.png | 2730323 | 480 / 18914 | 1586 / 178120 |
| /assets/bathroom-membrane-application.png | 3158683 | 480 / 31414 | 1586 / 278422 |
| /assets/case-canberra-bathroom.jpg | 244683 | 480 / 28214 | 1448 / 171154 |
| /assets/detail-balcony.jpg | 316748 | 480 / 30146 | 1536 / 261774 |
| /assets/detail-external.jpg | 353598 | 480 / 42538 | 1536 / 292714 |
| /assets/detail-kitchen.jpg | 290425 | 480 / 35480 | 1536 / 213608 |
| /assets/detail-laundry.jpg | 236223 | 480 / 26100 | 1536 / 157294 |
| /assets/detail-resealing.jpg | 218758 | 480 / 21588 | 1536 / 135504 |
| /assets/detail-retaining-wall.jpg | 371759 | 480 / 38766 | 1536 / 275152 |
| /assets/detail-roof.jpg | 396102 | 480 / 43444 | 1536 / 354862 |
| /assets/detail-shower.jpg | 304815 | 480 / 29500 | 1536 / 237420 |
| /assets/guide-balcony.jpg | 315834 | 480 / 37624 | 1586 / 247972 |
| /assets/guide-drainage.jpg | 305591 | 480 / 40242 | 1586 / 237914 |
| /assets/guide-kitchen.jpg | 198388 | 480 / 23588 | 1586 / 121168 |
| /assets/guide-resealing.jpg | 251371 | 480 / 25672 | 1586 / 174684 |
| /assets/guide-retile-quote.jpg | 220211 | 480 / 25272 | 1586 / 140522 |
| /assets/guide-shower-plumbing.jpg | 198972 | 480 / 20846 | 1586 / 118214 |
| /assets/hero-decorative.jpg | 309591 | 480 / 11954 | 1916 / 268204 |
| /assets/mel-one-hero-balcony.jpg | 293450 | 480 / 31444 | 1536 / 223720 |
| /assets/mel-one-hero-bathroom.jpg | 231680 | 480 / 22404 | 1536 / 156468 |
| /assets/mel-one-hero-external.jpg | 298733 | 480 / 31790 | 1536 / 229236 |
| /assets/mel-one-logo.png | 484272 | 58 / 2644 | 174 / 11616 |
| /assets/news-photograph-enquiry.jpg | 179921 | 480 / 21156 | 1448 / 108562 |
| /assets/news-repair-scope.jpg | 260746 | 480 / 31266 | 1448 / 187174 |
| /assets/news-wet-weather.jpg | 280916 | 480 / 39246 | 1448 / 211746 |
| /assets/process-assess.jpg | 288025 | 480 / 51500 | 1254 / 214792 |
| /assets/process-confirm.jpg | 289654 | 480 / 49788 | 1254 / 219756 |
| /assets/process-record.jpg | 288744 | 480 / 48620 | 1254 / 218074 |
| /assets/service-balcony.jpg | 332156 | 480 / 32642 | 1536 / 283086 |
| /assets/service-bathroom.jpg | 184870 | 480 / 18018 | 1536 / 113986 |
| /assets/service-external.jpg | 325696 | 480 / 36200 | 1536 / 265202 |
| /assets/service-kitchen.jpg | 238772 | 480 / 29392 | 1536 / 159850 |
| /assets/service-laundry.jpg | 243289 | 480 / 26598 | 1536 / 173584 |
| /assets/service-resealing.jpg | 207502 | 480 / 22674 | 1536 / 129932 |
| /assets/service-retaining-wall.jpg | 402006 | 480 / 36446 | 1536 / 314436 |
| /assets/service-roof.jpg | 306919 | 480 / 37230 | 1536 / 240660 |
| /assets/service-shower.jpg | 236549 | 480 / 23588 | 1536 / 165248 |

## Verification and limits

Focused red: the stub transformer returned the original img and failed the WebP source assertion; absent manifest failed the generated-resource assertion. Focused green: 3/3 passed after implementation. Full suite: 40/40 passed. The first full run exposed five failures in an existing test parser requiring figure > img; its parser now supports picture while retaining the original carousel assertions. The suite invokes the locality generator, so 24 regenerated pages then received the unchanged tested transformer again. Post-suite checks verified 54 pages, 176 picture wrappers, transformer idempotence and exact baseline HTML after removing only the new picture/source wrappers and normalising line endings. Original hashes, derivative byte counts, RIFF/WEBP signature, widths, heights and logo alpha flags are checked. Local browser verification is coordinated separately by the controller. Production CDN headers, real-device resource selection across browsers, and CWV need production verification after a separately authorised release. Native gallery candidates can still be large; responsive selection is necessary. No invented authorship or image metadata was injected.
