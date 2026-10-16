---
version: alpha
name: MEL ONE Canberra Waterproof
description: Local waterproofing evidence, readable repair guidance and a direct assessment enquiry.
colors:
  primary: "#f6b10a"
  ink: "#111c25"
  navy: "#102c45"
  midnight: "#07131d"
  header: "#0b1a26"
  teal: "#007c7a"
  aqua: "#8de0dc"
  gold: "#f6b10a"
  paper: "#eef4f5"
  white: "#ffffff"
  line: "#c7d5d9"
typography:
  body:
    fontFamily: '"Segoe UI", Arial, sans-serif'
    fontSize: "17px"
    lineHeight: "1.65"
  display:
    fontFamily: '"Bahnschrift", "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif'
rounded:
  card: "14px"
  button: "5px"
  field: "4px"
spacing:
  page-max: "1200px"
  article-max: "1100px"
  guide-prose-max: "76ch"
  section-min: "32px"
  section-max: "56px"
components:
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
---

# MEL ONE Canberra Waterproof design context

## Overview

Language update (2026-10-16): public pages now have matching Australian English and Simplified Chinese versions. Existing English content stays at its current routes and Chinese content uses `/zh/`. `assets/bilingual.css` owns Chinese font stacks, reading spacing and the compact language navigation; the established colours, photographs and layout remain shared. Source copy and reviewed Chinese translations must be maintained together using `scripts/bilingual-site.mjs`; generated Chinese pages are never edited separately. The previous English-only notes below describe the original design baseline.

This is an English (en-AU) brand and content site for Canberra and ACT property owners and managers. Its job is to explain the boundary of a possible repair, show accurately described project photography and help people request an on-site assessment. The existing field-notes motif uses an inspection line, real site images and restrained gold rules. Preserve that identity; an admin dashboard, cosmetic rebrand or invented project evidence would be inappropriate.

The approved rectification preserves the navy, gold and teal palette, current type stacks and all assigned image assets. Its deliberate visual move is a guide layout in which section headings support a controlled reading column, rather than making long prose span the page.

Runtime ownership is **Model B**: existing CSS remains canonical. This document mirrors accepted values and decisions; it does not generate CSS. `assets/site.css` owns shared tokens and controls; `assets/faq-navigation.css` and `assets/deep-guides.css` own their page-specific geometry. No framework theme adapter or separate token generation exists.

## Colors

Navy and midnight frame the site. The sticky header has an opaque `#0b1a26` surface so scrolled text cannot bleed through it. Gold marks primary assessment actions and focus; teal marks educational structure and current FAQ categories. Light paper and white surfaces keep long reading comfortable. Gold text is reserved for dark surfaces; body copy and action labels use dark text on light or gold backgrounds. Existing error and success text remain associated with explanatory messages, not colour alone.

## Typography

`--field-body` maps to the body stack above; `--field-display` maps to headings. Body type is 17px, falling to 16px at 620px. Long guide prose uses line-height 1.75 and a 76ch column; shared body copy uses 1.65 and the width of its actual composition. Display scale belongs to page titles, while card titles, form titles and supporting contact/map headings have their own smaller scale. Public copy remains English with Australian spelling. FAQ questions retain question form; other headings remain topical and declarative.

## Layout

The page wrapper is 1200px with 20px side gutters. Shared article/evidence surfaces can reach 1100px; single-column service/detail copy fills that composition rather than sitting in a shorter left-aligned measure below a wider heading. Deep guides centre their complete editorial composition around a 76ch reading column plus supporting heading rail and gap, so images, tables and prose fill the same actual column without an unused strip inside it. Their controlled measure is local to that purposeful composition. Sections use `--section-space:clamp(32px,4vw,56px)` and natural document height. Do not add viewport-height shells, arbitrary minimum section heights or filler to complete an 11-card collection.

Shared collections use three columns, two at 900px and one at 620px. Guide opening contents occupy a 280px supporting column, narrowed to 230px at 1000px. Each subject section repeats the same heading/content relationship down the article. At 800px this becomes one natural column; only the contents list temporarily uses two columns before falling to one at 620px. The article and full contents are not sticky. Existing useful tables, eight authored subject sections, FAQs, source lists and machine-readable content are retained.

FAQ categories precede the longer introduction. At 760px wide and below, or at 600px high and below, the compact category navigation sticks below the measured header. Short landscape/tablet screens therefore do not retain a tall sticky sidebar. Its height is measured after resize/text changes, and the same media condition owns CSS layout and script offset calculation. When the mobile menu opens, categories release their sticky slot; scroll offsets use only occupied surfaces. Without JavaScript the FAQ header stays in document flow in the compact mode, and native anchors/details remain usable.

The shared bottom quick-contact bar remains fixed on phones, with safe-area padding and reserved document space. All 56 pages use the same short Request assessment link to `/contact/#service-form`, alongside Call. Primary assessment links use the same label/path, with service-specific query prefills preserved; discovery links retain their destinations and labels. Home hero actions wrap naturally and remain reachable by normal scrolling. At 620px and below its H1 uses `clamp(2rem,9.5vw,2.7rem)` and word wrapping so Waterproofing fits narrow phones and can reflow with enlarged text. Contact offers a form anchor and telephone action in its opening; at 620px the form comes before supporting contact details and photography. The form has natural height and never stretches to match the adjacent panel. The document owns sticky-header scroll clearance; form/guide targets add only a 16px gap rather than a second header allowance. Browser QA must confirm anchor positions and overflow; static structure does not prove rendered geometry.

## Elevation & Depth

Borders and gold/teal rules explain hierarchy. Existing subtle card shadows remain; long guide sections use rules rather than repeated card surfaces. Sticky navigation uses opaque surfaces. Do not hide scrollbars: the shared scrollbar baseline uses `--scroll-thumb`, `--scroll-track`, `--scroll-hover` and `--scroll-active`, with standards properties, WebKit fallbacks and forced-colors reset.

## Shapes

Existing content cards use 14px corners, buttons 5px and native fields 4px. Paragraph groups and section divisions stay open. Image crops can fit the local composition but must preserve the intended subject and original fallback image. Case collection photo `sizes` follow the narrower padded collection columns; wide individual evidence remains a separate declaration.

## Components

Runtime mapping: `colors.ink/navy/midnight/teal/aqua/gold/paper/white/line` mirror like-named variables in `assets/site.css`; `colors.primary` is the documented action alias of `--gold`, and `colors.header` mirrors `.header`'s opaque surface. `typography.body/display` mirror `--field-body/--field-display`; `spacing.page-max/article-max` mirror `--max/--reading-max`; `spacing.guide-prose-max` mirrors `--guide-measure` in `assets/deep-guides.css`. Radius values mirror shared card, button and field rules. There is no second runtime token source.

Primary assessment navigation retains dark text on gold for default, hover, focus, active and current-page states. Focus remains visible. Native buttons and links own their usual semantics; native `details/summary` own FAQ disclosure and native anchors own category navigation. Category script owns measured scroll offsets and `aria-current="location"` only.

The assessment form intentionally uses native inputs, textarea and select; browser/OS popup appearance is accepted. Existing labels, inline errors, linked descriptions, native email validity metadata, first-error focus, entered-value retention, busy geometry and endpoint stay under `assets/service-form.js` and `scripts/enquiry-flow.mjs`. The user can resize the textarea vertically. No custom listbox or new validation owner is introduced. Submit success/error checks use the authorised local test harness, never a production request.

Existing short hover transitions remain; reduced motion disables smooth scrolling and transforms/transitions on motion-bearing shared elements. Project images are evidence, not decorative promises. Selected guide comparisons use concise editorial summaries of specific existing section distinctions and link to the full context, while the eight complete sections remain authoritative.

## Do's and Don'ts

- Keep the current identity, factual limits and accurate project captions.
- Keep native controls, visible focus, usable scrollbars and natural document scrolling.
- Keep protected scenario blocks, source links, FAQs and matching entity content during regeneration.
- Do not stretch short panels, make every section a card grid or add filler cards.
- Do not infer performance gains from a `sizes` correction; measure before making that claim.
