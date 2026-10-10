# Conversion measurement hooks — 10 October 2026

The custom hooks reuse the existing GA4 `gtag` and its consent state. They add no account, measurement ID, container, storage, consent override or analytics dependency. Deployment and GA4 account configuration remain pending authorised production work.

| Event | Meaning | Custom parameters |
| --- | --- | --- |
| `phone_click` | An uncancelled phone-link click; intent only | `contact_type: phone` |
| `email_click` | An uncancelled email-link click; intent only | `contact_type: email` |
| `booking_click` | An uncancelled same-origin `/contact/` link click; intent only | `contact_type: booking` |
| `generate_lead` | Contact API accepted a service request | `method: contact_form` |

Lead measurement requires a successful HTTP response and JSON `{ok:true, confirmationSent:boolean}`. `confirmationSent:false` still represents an accepted request and counts once. A lead is not a confirmed paid customer, appointment, or completed job. Clicking contact links does not establish that contact took place.

All new hook payloads contain only the fixed enums above. They never include hrefs, phone numbers, email addresses, names, suburbs, free text, form values, full URLs, URL queries or user identifiers. The lead hook accepts no data arguments. Missing or throwing analytics cannot prevent navigation or change an accepted form's success state. Repeated script execution installs no duplicate handler.

The new hooks are silent on `localhost`, `127.0.0.1`, and IPv6 loopback `::1` (including bracketed hostname representation). Existing automatic GA4 collection may still run in preview. Its automatic collection, URL handling and consent configuration were not audited or changed by this work; the custom payload restriction is not a claim about all existing GA4 data.

Pending authorised production/account work: verify the deployed script and contact API contract, inspect each event in GA4 DebugView using synthetic non-personal test data and approved analytics consent, verify consent denial behavior in the actual configuration, then mark `generate_lead` as a GA4 key event if the business agrees. Evaluate intent events separately; do not equate them with accepted leads or sales. No live submission, outbound analytics test or account change was performed locally.

Official references verified by the controller on 10 October 2026: [Google recommended generate_lead event](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead) and [Google guidance on avoiding personally identifiable information](https://support.google.com/analytics/answer/6366371).
