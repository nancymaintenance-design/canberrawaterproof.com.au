# Local editor UX contract

Authority: user's 2026-10-19 request to reuse Canberra Roof Kind source structure and make every paragraph editable; source AGENTS.md controls bilingual maintenance and separate deployment consent. See DESIGN.md for visual intent.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | native HTML select | this contract | OS popup accepted | browser keyboard/open popup |
| Form | ui/editor.js and content.mjs | server field validation | whole rich paragraph / plain metadata | local-editor tests + browser |
| Scrollbar | ui/editor.css global baseline | DESIGN.md | bounded directory/preview, natural form | browser |
| Toast | status() and error() in ui/editor.js | server-confirmed revision | persistent status/error | browser save/failure |
| CRUD | store.mjs | exact page hash/revision | save/restore creates revision | store and HTTP tests |

Save stays on the same page and only writes .local-editor/drafts. No automatic source application, translation, deployment, contact or third-party request. Chinese edits remain English-pending until an assistant reviews and applies exact revisions to existing source/translation owners and checks metadata/schema. Text in shared header/footer can be drafted per page, but assistant application must propagate intended shared changes. Link destinations, image files, code and API configuration are not mutable fields.

Directory filtering is local over 56 known pages; URL records search/group/page. Search defers during IME composition, clear is immediate. No remote paging is needed for this small fixed directory. Empty results explain recovery. All field options include type and content; full content appears in the inspector.

Navigation from dirty state uses native dialog with app-owned cancel/discard/save choices. Actual browser unload uses beforeunload only. Save prevents duplicates, retains inputs after validation or network failures, and explicitly reports uncertain timeout outcomes. Revision or source changes reject rather than overwrite. Reload is guarded. History restoration requires a separate app-owned confirmation, produces a new revision and keeps old versions. No hard delete is exposed.

Permission model: localhost binding, exact Host/Origin and random per-run session token; static files explicitly allowlisted. Private draft directories never served. No billing/auth accounts or cloud permissions. UI is Simplified Chinese; English is content-only comparison. Preview runs only a controlled selection bridge, blocks contact POST and external embeds/network, and is not a functional production simulation.
