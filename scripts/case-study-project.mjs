// Confirmed project scope belongs in the case hub, not the company introduction.
// No image is attributed to this job until its actual project photos are supplied.
const project = '<section class="case-photo-request" aria-labelledby="isaacs-roof"><p class="eyebrow">Roof waterproofing project · April 2026</p><h2 id="isaacs-roof">Roof waterproofing in Isaacs, Woden Valley</h2><p>In April 2026, the Ellis team completed roof waterproofing work at a property in Isaacs, Woden Valley. The work covered roof details around the chimney, ventilation outlets and eaves drainage outlets.</p><p><a class="text-link" href="/services/roof-waterproofing/#isaacs-roof">Read the roof waterproofing project scope →</a></p></section>';

export function applyRoofCaseStudy(html) {
 if (html.includes('id="isaacs-roof"')) return html;
 const anchor = '<div class="field-notes-next">';
 if (!html.includes(anchor)) throw new Error('Missing case-study booking insertion anchor');
 return html.replace(anchor, project + anchor);
}
