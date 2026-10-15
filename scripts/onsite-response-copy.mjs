const PHONE_LINK = '<a href="tel:+61482422607">0482 422 607</a>';

export function applyOnsiteResponseCopy(html, area = 'Canberra') {
  const urgentAttendance = `For urgent jobs in ${area}, the Ellis team can be on site in as little as 30 minutes after contact. Arrival timing depends on current availability, the address and safe access.`;

  const reconciled = html
    .replaceAll(
      `MEL ONE provides a fast 30-minute response for ${area} waterproofing service requests. Call 0482 422 607 or send the suburb, affected area and safe photos so our team can prepare the right service response.`,
      `${urgentAttendance} Call 0482 422 607 or send the suburb, affected area and safe photos so our team can prepare for the visit.`,
    )
    .replace(/How quickly can MEL ONE respond to .*? waterproofing service request\?/g,
      `How soon can the Ellis team attend an urgent waterproofing job in ${area}?`)
    .replaceAll(
      `MEL ONE provides ${area === 'Canberra' ? 'a fast 30-minute response in Canberra' : `a fast 30-minute response in ${area}`}.`,
      urgentAttendance,
    )
    .replaceAll(
      `Call MEL ONE for a fast 30-minute response in ${area}.`,
      urgentAttendance,
    )
    .replaceAll(
      `<strong>30-minute response</strong><span>Call MEL ONE for a fast response to your ${area} service request.</span>`,
      `<strong>As little as 30 minutes</strong><span>${urgentAttendance}</span>`,
    )
    .replaceAll(
      `More than 10,000 customers across Australia have trusted MEL ONE. Call 0482 422 607 for a fast 30-minute response to ${area} waterproofing service requests.`,
      `More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. ${urgentAttendance} Call 0482 422 607 to discuss availability.`,
    )
    .replaceAll(
      '<strong>Call for a fast 30-minute response.</strong>',
      `<strong>${urgentAttendance}</strong>`,
    )
    .replaceAll(
      'Trusted by 10,000+ customers across Australia, with a fast 30-minute response for Canberra service requests.',
      `Trusted by 10,000+ customers across Australia for property maintenance and repair services. ${urgentAttendance}`,
    )
    .replaceAll(
      `Call ${PHONE_LINK} for a fast 30-minute response, or send the affected area, timing and safe photos through our <a href="/contact/">waterproofing service form</a>. Our Ellis team inspects the affected area on site, explains the findings and confirms the repair scope and written quote.`,
      `Call ${PHONE_LINK} to ask about urgent on-site attendance. When available, the Ellis team can be on site in as little as 30 minutes after contact; timing depends on current bookings, the address and safe access. You can also send the affected area, timing and safe photos through our <a href="/contact/">waterproofing service form</a>. Our Ellis team inspects the affected area on site, explains the findings and confirms the repair scope and written quote.`,
    )
    .replaceAll(
      `Call ${PHONE_LINK} for a fast 30-minute response, or send the affected bathroom area, timing and safe photos through our <a href="/contact/">service booking form</a>. MEL ONE will use that information to prepare the right next step for your bathroom repair.`,
      `Call ${PHONE_LINK} to ask about urgent on-site attendance. When available, the Ellis team can be on site in as little as 30 minutes after contact; timing depends on current bookings, the address and safe access. You can also send the affected bathroom area, timing and safe photos through our <a href="/contact/">service booking form</a>. The Ellis team will use that information to prepare for your bathroom repair.`,
    )
    .replaceAll(
      `with 10+ years of waterproofing experience and a fast 30-minute response.`,
      `with more than 10 years of waterproofing experience. For urgent ${area} jobs, on-site attendance may be available in as little as 30 minutes after contact, subject to availability, address and safe access.`,
    )
    .replaceAll(
      `The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.`,
      `The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to availability, address and safe access.`,
    )
    .replace(/(<meta (?:name="description"|property="og:description") content=")([^"]+): 10\+ years’ experience, 10,000\+ customers Australia-wide and a fast 30-minute response\. Call 0482 422 607\."/g,
      `$1$2. The Ellis team carries out the work directly. Urgent on-site attendance may be available in as little as 30 minutes after contact, subject to availability and access.")`)
    .replaceAll(
      `The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to current availability, address and safe access.`,
      `The Ellis team brings more than 10 years of waterproofing experience and completes the agreed work directly. More than 10,000 customers across Australia have trusted MEL ONE for property maintenance and repair services. For urgent Canberra jobs, the team can be on site in as little as 30 minutes after contact, subject to availability, address and safe access.`,
    )
    .replaceAll(
      `Call MEL ONE for a fast 30-minute response in ${area}.`,
      urgentAttendance,
    )
    .replace(
      '<p class="service-proof"><strong>10+ years of waterproofing experience.</strong> Trusted by 10,000+ customers across Australia, with a fast 30-minute response for Canberra service requests.</p>',
      `<p class="service-proof"><strong>10+ years of waterproofing experience.</strong> Trusted by 10,000+ customers across Australia for property maintenance and repair services. ${urgentAttendance}</p>`,
    )
    .replaceAll(
      '<p class="lede">${escapeHtml(page.focus.summary)} Call MEL ONE for a fast 30-minute response in ${escapeHtml(page.name)}.</p>',
      '<p class="lede">${escapeHtml(page.focus.summary)} For urgent jobs in ${escapeHtml(page.name)}, the Ellis team can be on site in as little as 30 minutes after contact. Arrival timing depends on current availability, the address and safe access.</p>',
    )
    .replace(/MEL ONE provides a fast 30-minute response for ([^<.]+) waterproofing service requests\./g,
      (_, place) => `For urgent jobs in ${place}, the Ellis team can be on site in as little as 30 minutes after contact, subject to availability, address and safe access.`)
    .replace(/Call MEL ONE for a fast 30-minute response in ([^.<]+)\./g,
      (_, place) => `For urgent jobs in ${place}, the Ellis team can be on site in as little as 30 minutes after contact, subject to availability, address and safe access.`)
    .replace(/Call 0482 422 607 for a fast 30-minute response to ([^.<]+) waterproofing service requests\./g,
      (_, place) => `For urgent ${place} jobs, on-site attendance may be available in as little as 30 minutes after contact, subject to current availability, address and safe access. Call 0482 422 607 to discuss timing.`)
    .replace(/<article><strong>30-minute response<\/strong><span>Call MEL ONE for a fast response to your ([^<]+) service request\.<\/span><\/article>/g,
      (_, place) => `<article><strong>As little as 30 minutes</strong><span>For urgent ${place} jobs, on-site attendance may be available in as little as 30 minutes after contact, subject to availability, address and safe access.</span></article>`)
    .replaceAll('Call for a fast 30-minute response.', 'Call to ask about urgent on-site attendance. Availability, address and safe access determine arrival timing.')
    .replaceAll(
      'Share clear photos or video from a safe position, plus any recent plumbing, renovation or maintenance work.',
      'Photos are optional. If available, email photos or video taken safely from a normal standing position, plus details of recent plumbing, renovation or maintenance work.',
    )
    .replaceAll(
      'The Ellis team confirms an assessment time and the agreed waterproofing work with you.',
      'The Ellis team arranges an on-site assessment, checks the water-entry cause and repair requirements, then confirms the agreed scope and written quote.',
    )
    .replaceAll(
      'Call 0482 422 607, or send the affected area, timing and safe photos so our team can prepare the right service response.',
      'Call 0482 422 607, or send your suburb, affected area and timing. Photos are optional; you can contact us without them.',
    )
    .replaceAll(
      'Our Ellis team inspects the affected area on site, explains the findings and confirms the repair scope and written quote.',
      'The Ellis team inspects the affected area on site, explains the likely cause or installation requirements and confirms the repair plan and written quote.',
    )
    .replaceAll(
      'MEL ONE checks the relevant accessible details and explains the practical repair path.',
      'The Ellis team checks accessible details on site, explains the findings and confirms the repair plan and written quote.',
    )
    .replace(/(<meta (?:name="description"|property="og:description") content="[^">]+)(><meta)/g, '$1">$2');

  return reconciled.replace(/<section class="service-booking"[^>]*>[\s\S]*?<\/section>/, (section) => {
    let updated = section;
    if (!/on-site assessment/i.test(updated)) {
      updated = updated.replace('</section>', '<p>The Ellis team completes an on-site assessment, explains the likely water-entry cause or installation requirements, and confirms the repair plan and written quote.</p></section>');
    }
    if (!updated.includes('riley@melonemaintenance.com.au')) {
      updated = updated.replace('</section>', '<p>Photos are optional. If useful, email safely taken photos to <a href="mailto:riley@melonemaintenance.com.au">riley@melonemaintenance.com.au</a>, or contact us without them. Do not remove finishes, climb onto roofs or approach hazards to take photos.</p></section>');
    }
    return updated;
  });
}
