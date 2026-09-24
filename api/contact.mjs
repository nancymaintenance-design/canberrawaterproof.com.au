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

function validateEnquiry(input = {}) {
  const enquiry = {
    name: text(input.name), phone: text(input.phone), email: text(input.email),
    suburb: text(input.suburb), area: text(input.area), message: text(input.message), website: text(input.website)
  };
  if (enquiry.website) return { error: 'Please submit a valid enquiry.' };
  if (!enquiry.name || !enquiry.suburb || !enquiry.area || !enquiry.message) return { error: 'Please complete the required enquiry details.' };
  if (!enquiry.email || !EMAIL_PATTERN.test(enquiry.email)) return { error: 'Please enter a valid email address for your confirmation.' };
  if (enquiry.phone && enquiry.phone.length < 6) return { error: 'Please enter a valid phone number or leave the field blank.' };
  if (Object.values(enquiry).some((value) => value.length > MAX_FIELD_LENGTH)) return { error: 'One or more fields are too long.' };
  return { value: enquiry };
}

function ownerEmail(enquiry, from) {
  const safe = Object.fromEntries(Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(value)]));
  return { from, to: [RECIPIENT], reply_to: enquiry.email, subject: `New Canberra waterproofing enquiry — ${enquiry.name}`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#162a3a;line-height:1.55"><h1>New website enquiry</h1><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone || 'Not provided'}</p><p><strong>Suburb or postcode:</strong> ${safe.suburb}</p><p><strong>Affected area:</strong> ${safe.area}</p><hr><p><strong>What needs attention:</strong></p><p>${safe.message.replaceAll('\n', '<br>')}</p></body></html>`,
    text: `New MEL ONE Canberra website enquiry\n\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone || 'Not provided'}\nSuburb or postcode: ${enquiry.suburb}\nAffected area: ${enquiry.area}\n\nWhat needs attention:\n${enquiry.message}` };
}

function confirmationEmail(enquiry, from) {
  const customerName = escapeHtml(enquiry.name);
  const area = escapeHtml(enquiry.area);
  const suburb = escapeHtml(enquiry.suburb);
  return { from, to: [enquiry.email], reply_to: RECIPIENT, subject: 'We’ve received your enquiry — MEL ONE Canberra',
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#162a3a;line-height:1.55"><h1>Thank you for contacting MEL ONE.</h1><p>Hi ${customerName},</p><p>We have received your enquiry about the ${area} at ${suburb}.</p><p>Our team will review the details provided. If we need further information, we will contact you using the details in your enquiry.</p><p>This email confirms receipt of your enquiry only; it is not a booking or a confirmed scope of work.</p><p>For urgent enquiries, call <a href="tel:+61482422607">0482 422 607</a>.</p><p>Kind regards,<br>MEL ONE Canberra Waterproofing</p></body></html>`,
    text: `Hi ${enquiry.name},\n\nWe have received your enquiry about the ${enquiry.area} at ${enquiry.suburb}.\n\nOur team will review the details provided. If we need further information, we will contact you using the details in your enquiry.\n\nThis email confirms receipt of your enquiry only; it is not a booking or a confirmed scope of work.\n\nFor urgent enquiries, call 0482 422 607.\n\nKind regards,\nMEL ONE Canberra Waterproofing` };
}

async function sendEmail(apiKey, payload) {
  return fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const validation = validateEnquiry(req.body || {});
    if (validation.error) return res.status(400).json(validation);
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) return res.status(500).json({ error: 'Email delivery is not configured yet. Please call MEL ONE directly.' });
    const ownerResponse = await sendEmail(apiKey, ownerEmail(validation.value, from));
    if (!ownerResponse.ok) {
      console.error('Resend rejected owner notification:', ownerResponse.status, await ownerResponse.text());
      return res.status(502).json({ error: 'We could not send your enquiry. Please call MEL ONE directly.' });
    }
    const confirmationResponse = await sendEmail(apiKey, confirmationEmail(validation.value, from));
    if (!confirmationResponse.ok) console.error('Resend could not send customer confirmation:', confirmationResponse.status, await confirmationResponse.text());
    return res.status(200).json({ ok: true, confirmationSent: confirmationResponse.ok });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(400).json({ error: 'Please check your details and try again.' });
  }
}
