# Additive service content delivery — 2026-10-10

## Scope and source

Eight existing English service pages received one compact visible question-and-answer section each. No URLs, metadata, schema, assets, CSS, navigation or existing wording were changed. The services hub already routes visitors to the service owners, so an additional hub section was unnecessary.

Planning source: `C:\Users\UFTR\Desktop\Entry\9、canberrawaterproof\Canberra_Waterproofing_AI_Keyword_Map.md`, read in full (1,257 lines). Its research date and workbook date are **2026-09-22**; the named workbook is `Canberra_Waterproofing_Keyword_Map_2026-09-22.xlsx`. Candidate questions were treated as editorial topics, not evidence of actual customers, completed jobs, or measured search demand. No search-volume totals or ranking promises were added.

Baseline commit: `1c8d85f1056cf61e960454aec57155a89c824b3b`. Maintenance target is the source static HTML in this worktree, branch `codex/keyword-content-expansion`. Existing templates/generators were not edited or invoked as an implementation step. Future service-page regeneration must explicitly preserve these sections and the approved existing copy before adoption.

## Topic ownership, existing coverage and additions

All routes below are existing primary owners under `/services/`.

| Owner route | Already covered in the page | Gaps filled by the addition |
| --- | --- | --- |
| `leaking-shower-repairs/` | Generic assessment, accessible shower details, agreed repair scope and booking | Wet carpet, bubbling paint and ceiling drips after shower use; observation versus diagnosis; why a prior grout/sealant repair may need reassessment; plumbing versus waterproofing routing |
| `bathroom-waterproofing/` | Removal, substrate, membrane, retiling and finishing in a written scope; documented project | Conditions for shower-only work; checking owner-supplied tile specifications and quantity; planning for a one-bathroom household; itemised quote questions |
| `shower-resealing-regrouting/` | Inspection, removal of failed grout/sealant, replacement and broader-work recommendation | Screen-perimeter water path and drainage details; joint preparation considerations; explicit joint-sealant versus concealed-membrane distinction |
| `balcony-waterproofing/` | Accessible surfaces, thresholds, drainage points, membrane/retiling and separate drainage tasks | Ponding versus membrane diagnosis; recording pooling and staining; information and access/approval questions for a strata manager without assigning liability |
| `kitchen-sealing/` | Sink/splashback/benchtop joints, cabinet moisture signs, old-sealant removal and separate plumbing | Timing/location observations for edge versus pipe leaks; swollen cabinet restoration distinguished from sealing; actual kitchen-junction scope |
| `laundry-waterproofing/` | Explicit hose/valve/waste versus waterproofing answer; detailed renovation quote question | Practical handover before tiling: current floor state, planned layout, substrate readiness and sequencing responsibilities, separate appliance connections |
| `external-waterproofing/` | Accessible walls, windows, thresholds, agreed sealing and separate drainage/roofing | Wind-driven window rain, back-door runoff/thresholds, pooled water and surface falls; coating limitations; eaves routed to roof owner |
| `roof-waterproofing/` | Explicit heavy-rain question, roof painting distinction, flashings/penetrations and separate trades | What to report about eaves/gutter overflow and roof-to-wall junctions; previous repairs and construction information; window/door symptoms routed externally |

The laundry and roof sections are shorter because their existing answers already cover several map topics. Existing guides provide contextual detail rather than being duplicated: shower plumbing, repair options, balcony leaks, sink sealing, quote preparation and drainage. Contact links give a practical next step.

## Exact addition counts

Words include visible headings and linked anchor text, counted by removing HTML tags and splitting whitespace. Section bytes exclude marker comments and the inserted line ending. Whole inserted-line bytes include both marker comments and CRLF.

| Service | Words | H2 | H3 | Section bytes | Inserted-line bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| Leaking shower | 199 | 1 | 1 | 1,487 | 1,567 |
| Bathroom | 200 | 1 | 2 | 1,611 | 1,691 |
| Resealing/regrouting | 204 | 1 | 2 | 1,616 | 1,696 |
| Balcony | 206 | 1 | 1 | 1,534 | 1,614 |
| Kitchen | 203 | 1 | 1 | 1,523 | 1,603 |
| Laundry | 116 | 1 | 0 | 969 | 1,049 |
| External | 203 | 1 | 2 | 1,560 | 1,640 |
| Roof | 146 | 1 | 1 | 1,088 | 1,168 |
| **Total** | **1,477** | **8** | **10** | **11,388** | **12,028** |

Eight sections on eight existing pages, plus this internal delivery record. No new FAQ schema or public pages. Insertions reuse `section wrap article service-story` and ordinary headings, paragraphs and links.

## Preservation and verification evidence

Before editing, all eight original checkout files were captured with `readFileSync(..., 'utf8')`. After insertion, removing each complete marked line reproduced each original string exactly, including checkout CRLF line endings. Marker removal expression: `/<!-- keyword-content-expansion:start -->[\s\S]*?<!-- keyword-content-expansion:end -->\r?\n/`. The eight originals contain valid UTF-8; equality therefore preserves their original encoded bytes. This proves preservation of marketing copy, title/description, Open Graph, JSON-LD, contact/footer, and all other pre-existing content.

An independent Git-baseline check also passed after converting Git's LF representation to the existing checkout CRLF representation. The Git-versus-checkout line-ending difference is not a content change; whole-file line endings were not rewritten. `git diff --stat` showed eight HTML insertions and no replaced or deleted original lines.

Validation used a read-only Node script over the eight changed service pages: strip the marked line and compare with the baseline; require exactly one H1; parse every `application/ld+json` block with `JSON.parse`; resolve every local `href` against the shipped static tree. Results: **8/8 preserved pages**, **8/8 single H1**, **8 JSON-LD blocks parsed**, **220 local link occurrences resolved**. Raw pre-edit checkout capture comparison also passed **8/8**.

Command: `node --test tests/*.test.mjs`. Result: **37 tests passed, 0 failed, 0 skipped**. No prose-mirroring tests were added. The required existing suite internally invokes its locality generator; no service-page generator was run. After the suite, `data/local-waterproofing-services.json` appeared modified due to line endings, with no textual diff (`git diff --ignore-space-at-eol -- data/local-waterproofing-services.json` was empty). It is outside this change's ownership and was left unstaged. Verification was read-only; no push or deploy was performed.

## Editorial quality check and deferred topics

Editorial assessment, not a measured ranking, traffic, lead or citation result: the additions use the site's direct service voice, short paragraphs, concrete symptoms and question headings. Each topic stays with its primary owner, gives conditional scope and a practical next step, and uses service language naturally instead of listing keyword variants. Specificity comes from observations and scope decisions, not invented projects or diagnostic certainty. Existing answers are complemented rather than repeated. The existing marketing wording is preserved exactly as requested, including all pre-existing claims.

The manufacturer reference [ARDEX SE](https://ardexaustralia.com/product/ardex-se/) supports the distinction between joint sealant and broader waterproofing; it does not establish MEL ONE's use of that brand or any qualification.

Deferred pending business confirmation: specialist flat-roof membrane systems/repair capability; basement, retaining-wall and subfloor/rising-damp treatments; commercial/strata procurement or reporting promises; additional geography; fixed prices, cure schedules, downtime, warranty, licensing/insurance and statutory claims; tenant coordination promises; new case histories; acceptance of any particular owner-supplied tile product. The additions do not turn map phrases into new capabilities. No existing marketing claims were audited or changed in this content-only batch.
