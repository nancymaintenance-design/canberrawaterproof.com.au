# Supplied project photo delivery · 10 October 2026

Nine user-supplied PNG originals are preserved byte-for-byte under descriptive asset names. Each was inspected before encoding; all are 1448 × 1086. Location/month labels below are user-confirmed. No image generation, cropping, logo/text removal or collage rearrangement was used.

| Source photo | Asset filename | Confirmed group | Visible stage caption |
| --- | --- | --- | --- |
| 3 | woden-valley-balcony-floor-preparation.png | Woden Valley · June 2026 | Floor preparation · Walls already treated |
| 1 | woden-valley-balcony-membrane-application.png | Woden Valley · June 2026 | Membrane application · Roller application on the balcony floor |
| 2 | woden-valley-balcony-partial-coating.png | Woden Valley · June 2026 | Partial floor coating · Prepared surface remains visible |
| 4 | woden-valley-balcony-drain-junction-detail.png | Woden Valley · June 2026 | Drain and wall-floor junction detail · Close view of membrane coverage |
| 5 | woden-valley-balcony-broad-membrane-coverage.png | Woden Valley · June 2026 | Broad membrane coverage stage · Floor and wall upstands |
| 8 | weetangera-external-wall-joint-application.png | Weetangera · April 2026 | Joint sealant application · Taped vertical external wall joint |
| 7 | weetangera-external-wall-joint-sealing-collage.png | Weetangera · April 2026 | Application and visible sealed joint · External wall joint sealing collage |
| 6 | barton-block-retaining-wall-collage.png | Barton · April 2026 | Block wall · Construction and visible finished face |
| 9 | barton-concrete-retaining-wall-collage.png | Barton · April 2026 | Concrete wall · Construction and visible finished face |

Each group appears on its matching service page and on `/case-studies/`, with a link to the service. Balcony order is 3, 1, 2, 4, 5; floor preparation already has treated wall upstands, and broad membrane coverage is a stage rather than whole-project completion. The two Barton collages are separate examples showing construction and visible finished faces; they do not establish concealed waterproofing or one before/after project. Existing marketing, keyword sections, service imagery and old cases remain intact. Only the obsolete “Real project photos to be added” eyebrow was removed.

All additions use `picture` via the existing responsive transformer, with four WebP candidates (480, 800, 1200, 1448px), factual alt text, actual dimensions, lazy loading and asynchronous decoding. Sharp quality 82 matches the existing image pipeline. The original files total 27,445,057 bytes; all 36 WebP derivatives total 5,480,866 bytes. Existing 42 manifest entries and their derivatives were not regenerated.

## Provenance

Source identifiers below are clipboard filenames supplied for this batch. The SHA-256 values were measured directly from the supplied originals and verified against the retained assets.

| Photo | Supplied source identifier | Retained asset | SHA-256 |
| --- | --- | --- | --- |
| 3 | `codex-clipboard-0d8d07c5-c5fc-409d-b35c-00512de6dd09.png` | `woden-valley-balcony-floor-preparation.png` | `aaf01495e5b52b6a7b64242ad8dc73e9f65fb59921f7071b2dee6138f6965781` |
| 1 | `codex-clipboard-12dbbb83-92a2-407e-a20d-de8719d3acb9.png` | `woden-valley-balcony-membrane-application.png` | `e2e019b07f4ef93670a0003875432a52c8e3beff588123cf0e54d32249067332` |
| 2 | `codex-clipboard-d8b7b3fd-e270-4de7-85b0-11e0b0c5bec5.png` | `woden-valley-balcony-partial-coating.png` | `0c15ebbee495cb4f0694ef01e799eaac3f9e7d667a5b9838137fe619c080b1b3` |
| 4 | `codex-clipboard-7d316ec2-9916-435a-9381-c8c2b44bc778.png` | `woden-valley-balcony-drain-junction-detail.png` | `6f3514b28bb0b1f378ceec2b3eab9c7ef3744c8f7d93bf175feb616078e76b51` |
| 5 | `codex-clipboard-16318fa5-3869-4c58-9e79-c6bb80147ae2.png` | `woden-valley-balcony-broad-membrane-coverage.png` | `4b30e09f4c71715ab31b1556037f85ca76ac6db91afdd8343f9c878cbbd7240e` |
| 8 | `codex-clipboard-bfc8f659-37f2-44eb-a25b-a6f0d05b91fb.png` | `weetangera-external-wall-joint-application.png` | `411d86a2b1a010dbd4e6a366656dcfb34154958b666297da389858ae3efa119a` |
| 7 | `codex-clipboard-d26beba9-807b-4174-b815-0f9c53322381.png` | `weetangera-external-wall-joint-sealing-collage.png` | `e4e2dcf33c6402aea9fb618e25e42beaa3b3251361375910f435dc80587f16c4` |
| 6 | `codex-clipboard-6930a9fb-d8ad-4b44-a617-1ca54ea10148.png` | `barton-block-retaining-wall-collage.png` | `c6a7d73a395232bd2e9f4500d13055753ed849ceae038ee44a71bb10189c083f` |
| 9 | `codex-clipboard-28b94444-429b-4d11-aba7-aefa0bd4fc9f.png` | `barton-concrete-retaining-wall-collage.png` | `237a6c36934d73de061facce140b4c2194590ceea913feaade59ec13f2054ec1` |

## Repeatable maintenance

`data/project-photo-sections.json` records the additive marked sections. `node scripts/apply-seo-maintenance.mjs` restores a missing marked block and responsive sources; it preserves an existing authored photo block. The supported locality generator already calls this maintenance path. Historical service/gallery generators can rebuild their main content; run maintenance afterwards to restore these additions. Existing historical generator copy changes remain outside this photo batch.

`sitemap.xml` records 2026-10-10 for all four touched pages. Balcony/external already had that date; retaining wall and gallery now gain it. Other dates remain unchanged.

Verified: focused suite 24/24; full `node --test tests/*.test.mjs` suite 69/69; serial full suite 69/69; maintenance reports no changed files. A first parallel attempt hit a Windows lock while the fixture copied live generated locality pages; the fixture now generates its own locality pages and the standard suite passes.

Local preview: [project gallery](http://127.0.0.1:4176/case-studies/), [balcony](http://127.0.0.1:4176/services/balcony-waterproofing/), [external](http://127.0.0.1:4176/services/external-waterproofing/), [retaining wall](http://127.0.0.1:4176/services/retaining-wall-waterproofing/). This batch is local-only.
