const RECIPIENT = 'riley@melonemaintenance.com.au';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 4000;

const text = (value) => String(value || '').trim();
const escapeHtml = (value) => text(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function validateServiceRequest(input = {}) {
  const request = {
    name: text(input.name), phone: text(input.phone), email: text(input.email),
    suburb: text(input.suburb), area: text(input.area), message: text(input.message), website: text(input.website)
  };
  if (request.website) return { error: 'Please submit a valid service request.' };
  if (!request.name || !request.suburb || !request.area || !request.message) return { error: 'Please complete the required service details.' };
  if (!request.email || !EMAIL_PATTERN.test(request.email)) return { error: 'Please enter a valid email address for your service confirmation.' };
  if (request.phone && request.phone.length < 6) return { error: 'Please enter a valid phone number or leave the field blank.' };
  if (Object.values(request).some((value) => value.length > MAX_FIELD_LENGTH)) return { error: 'One or more fields are too long.' };
  return { value: request };
}

function ownerEmail(request, from) {
  const safe = Object.fromEntries(Object.entries(request).map(([key, value]) => [key, escapeHtml(value)]));
  return { from, to: [RECIPIENT], reply_to: request.email, subject: `New Canberra waterproofing service request — ${request.name}`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#162a3a;line-height:1.55"><h1>New waterproofing service request</h1><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone || 'Not provided'}</p><p><strong>Suburb or postcode:</strong> ${safe.suburb}</p><p><strong>Affected area:</strong> ${safe.area}</p><hr><p><strong>Repair service needed:</strong></p><p>${safe.message.replaceAll('\n', '<br>')}</p></body></html>`,
    text: `New MEL ONE Canberra waterproofing service request\n\nName: ${request.name}\nEmail: ${request.email}\nPhone: ${request.phone || 'Not provided'}\nSuburb or postcode: ${request.suburb}\nAffected area: ${request.area}\n\nRepair service needed:\n${request.message}` };
}

function confirmationEmail(request, from) {
  const customerName = escapeHtml(request.name);
  const area = escapeHtml(request.area);
  const suburb = escapeHtml(request.suburb);
  return { from, to: [request.email], reply_to: RECIPIENT, subject: 'Your waterproofing service request is received — MEL ONE',
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#162a3a;line-height:1.55"><h1>Your waterproofing service request is received.</h1><p>Hi ${customerName},</p><p>We have received your request for ${area} work in ${suburb}.</p><p>Our team will review the service details and contact you using the information you provided.</p><p>For urgent waterproofing assistance, call <a href="tel:+61482422607">0482 422 607</a>.</p><p>Kind regards,<br>MEL ONE Canberra Waterproofing</p></body></html>`,
    text: `Hi ${request.name},\n\nWe have received your service request for ${request.area} work in ${request.suburb}.\n\nOur team will review the service details and contact you using the information you provided.\n\nFor urgent waterproofing assistance, call 0482 422 607.\n\nKind regards,\nMEL ONE Canberra Waterproofing` };
}

async function sendEmail(apiKey, payload) {
  return fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const validation = validateServiceRequest(req.body || {});
    if (validation.error) return res.status(400).json(validation);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) return res.status(500).json({ error: 'Email delivery is not configured yet. Please call MEL ONE directly.' });
    const ownerResponse = await sendEmail(apiKey, ownerEmail(validation.value, from));
    if (!ownerResponse.ok) {
      console.error('Resend rejected owner notification:', ownerResponse.status, await ownerResponse.text());
      return res.status(502).json({ error: 'We could not send your service request. Please call MEL ONE directly.' });
    }
    const confirmationResponse = await sendEmail(apiKey, confirmationEmail(validation.value, from));
    if (!confirmationResponse.ok) console.error('Resend could not send customer confirmation:', confirmationResponse.status, await confirmationResponse.text());
    return res.status(200).json({ ok: true, confirmationSent: confirmationResponse.ok });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(400).json({ error: 'Please check your details and try again.' });
  }
}
