# Canberra local waterproofing pages design

## Objective

Turn the existing service-areas directory into a useful Canberra local-service information system. Visitors can reach a district or selected suburb page, understand common water-entry and waterproofing service pathways, navigate to relevant services, and submit a locality-aware contact enquiry.

This is a content and navigation expansion. It does not promise search ranking, AI citation, inspection outcomes, availability, a fixed response time, diagnosis, pricing, or an exact repair scope.

## Approved public business statements

The client has authorised the following points for public copy. The rapid-response wording must remain qualified as subject to availability:

- More than ten years in the waterproofing industry.
- A standardised repair team and experienced repair professionals.
- Methodical problem investigation before agreeing a repair path.
- A response target as fast as 30 minutes, subject to availability and enquiry details.
- Trusted by more than ten thousand customers.

No licence, insurance, project-result, compliance or technical claim may be added beyond verified information already visible on the site.

## Route matrix

### District hubs (9)

- `/waterproofing/belconnen/`
- `/waterproofing/gungahlin/`
- `/waterproofing/inner-north-city/`
- `/waterproofing/inner-south/`
- `/waterproofing/woden-valley/`
- `/waterproofing/weston-creek-molonglo/`
- `/waterproofing/tuggeranong/`
- `/waterproofing/east-canberra/`
- `/waterproofing/act-localities/`

### Priority locality pages (15)

- `/waterproofing/aranda/`
- `/waterproofing/bruce/`
- `/waterproofing/amaroo/`
- `/waterproofing/casey/`
- `/waterproofing/canberra-city/`
- `/waterproofing/braddon/`
- `/waterproofing/kingston/`
- `/waterproofing/griffith/` (the existing directory locality serving the Manuka precinct)
- `/waterproofing/woden/`
- `/waterproofing/phillip/`
- `/waterproofing/weston/`
- `/waterproofing/coombs/`
- `/waterproofing/tuggeranong/` is reserved for the district hub; suburb-page duplication is intentionally avoided.
- `/waterproofing/kambah/`
- `/waterproofing/calwell/`
- `/waterproofing/fyshwick/`

The final unique route count is 24: nine district hubs and fifteen priority locality pages. Belconnen, Gungahlin and Tuggeranong are represented by their district hubs, so no duplicate suburb URLs are published for those names.

## Page composition

Each local page has the following visible, unique sections:

1. H1: `Waterproofing Repairs in [Locality], ACT` or a district equivalent.
2. Plain-English local introduction explaining bathroom, shower, roof, kitchen, balcony and external-water-entry enquiries.
3. `Waterproofing services in [Locality]` section with internal links to the six relevant existing service detail pages.
4. `Common water-entry signs` section that distinguishes symptoms from confirmed causes.
5. `How MEL ONE approaches a [Locality] enquiry` section, including the approved experience, team, investigation and availability statements.
6. `What to send with an enquiry` list.
7. Three to five locality-specific FAQs with direct answers and limitations.
8. Related localities and district-hub internal links.
9. Bottom contact form. It reuses the existing Resend-backed form and pre-fills the location as the suburb value.

Copy must be materially differentiated: it may reuse accurate service descriptions but must not create boilerplate pages with only the locality name swapped.

## Directory behaviour

`/service-areas/` remains the canonical directory. The 24 selected localities point to their detail routes. All other localities retain a contact link that pre-fills the suburb field. The directory will clearly distinguish an information page from a direct enquiry shortcut.

## Structured information

Every local detail page includes visible content matching its structured data:

- `WebPage` with canonical URL, title and description.
- `LocalBusiness` consistent with the established site facts.
- `Service` describing waterproofing repair enquiry services and the relevant locality in `areaServed`.
- `FAQPage` only when the corresponding FAQ is visibly present.
- Breadcrumb structured data consistent with the route hierarchy.

Machine-readable resources:

- `/data/local-waterproofing-services.json`: public JSON feed containing canonical URLs, locality, district, services and last-modified date.
- `llms.txt`: concise index of the service-area directory, the JSON feed, locality pages and evidence limits.

The feed is public and linked in `llms.txt`; no hidden text, cloaking or schema-only claims are used.

## Search and content safeguards

- Titles, H1s, meta descriptions and internal anchor text use locality + waterproofing-repair terminology naturally.
- Copy serves a genuine local-service audience first; it is not written to manipulate ranking systems.
- A locality page does not promise 30-minute attendance. It states that MEL ONE aims to respond as fast as 30 minutes subject to availability and enquiry details.
- A page must not present generic NCC information as an inspection result, quote, compliance certificate or property-specific advice.
- The sitemap includes every new canonical route.

## Verification and release criteria

- All 24 routes respond successfully and have one canonical URL each.
- Each page has one locality keyword H1, service internal links, visible FAQs, and a working pre-filled contact form.
- JSON-LD parses and only represents visible claims.
- The JSON feed validates as JSON and lists every local page.
- `llms.txt`, sitemap and directory links cover the new routes.
- Desktop and mobile browser QA checks legibility, navigation and contact-form usability.
- Existing contact form sending is unchanged and must remain functional.
