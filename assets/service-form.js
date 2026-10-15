(() => {
  const form = document.querySelector('[data-service-form]');
  const status = document.querySelector('[data-form-status]');
  if (!form || !status) return;

  // Only these existing service routes can choose a visible affected area.
  const serviceAreas = {
    'leaking-shower-repairs': 'Shower', 'bathroom-waterproofing': 'Bathroom',
    'shower-resealing-regrouting': 'Shower', 'balcony-waterproofing': 'Balcony',
    'kitchen-sealing': 'Kitchen', 'external-waterproofing': 'External',
    'laundry-waterproofing': 'Laundry', 'roof-waterproofing': 'Roof',
    'retaining-wall-waterproofing': 'Retaining wall', 'tile-regrouting': 'Tiled area',
    'commercial-waterproofing': 'Commercial property'
  };
  const names = ['name', 'suburb', 'phone', 'email', 'area', 'message'];
  const fields = Object.fromEntries(names.map(name => [name, form.querySelector(`[name="${name}"]`)]));
  const button = form.querySelector('button[type="submit"]');
  const query = new URLSearchParams(window.location.search);
  const service = query.get('service');
  fields.area.value = Object.hasOwn(serviceAreas, service) ? serviceAreas[service] : '';
  if (query.get('suburb')) fields.suburb.value = query.get('suburb').slice(0, 4000);

  const requiredMessages = {
    name: 'Enter your name.', suburb: 'Enter your suburb or postcode.',
    email: 'Enter your email address, for example name@example.com.',
    area: 'Choose the affected area, or select Not sure / Other.',
    message: 'Describe the repair needed or when the problem occurs.'
  };
  const failure = 'We could not confirm your request was received. Your details are still here. Please call 0482 422 607 for help before trying again.';
  let pending = false;

  function fieldError(name, message) {
    const field = fields[name], error = document.getElementById(`${field.id}-error`);
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    if (error) { error.textContent = message; error.hidden = !message; }
  }

  function validate() {
    let first;
    for (const name of names) {
      const value = fields[name].value.trim();
      let message = !value ? requiredMessages[name] || '' : '';
      if (value.length > 4000) message = 'Use 4,000 characters or fewer.';
      else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = requiredMessages.email;
      else if (name === 'phone' && value && value.length < 6) message = 'Enter a phone number with at least 6 characters, or leave it blank.';
      fieldError(name, message);
      if (message && !first) first = fields[name];
    }
    if (first) {
      status.textContent = 'Please check the highlighted fields and try again.';
      status.dataset.state = 'error'; first.focus(); return false;
    }
    return true;
  }

  // Clear a corrected error while preserving the user's input.
  for (const name of names) fields[name].addEventListener('input', () => {
    if (fields[name].getAttribute('aria-invalid') === 'true') fieldError(name, '');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !validate()) return;
    pending = true;
    button.disabled = true; form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your assessment request…'; status.dataset.state = 'pending';
    const payload = Object.fromEntries(new FormData(form).entries());
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || typeof result.confirmationSent !== 'boolean') throw new Error('Request not confirmed');
      form.reset();
      status.textContent = 'Thank you. MEL ONE has received your assessment request. Your visit time is not confirmed; our team will contact you to discuss the assessment.';
      status.dataset.state = 'success';
      try { window.melOneTrackLead?.(); } catch { /* Analytics must not change an accepted request. */ }
    } catch {
      status.textContent = failure; status.dataset.state = 'error';
    } finally {
      clearTimeout(timeout); pending = false;
      button.disabled = false; form.removeAttribute('aria-busy');
    }
  });
})();
