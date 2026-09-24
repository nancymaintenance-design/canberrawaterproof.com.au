const form = document.querySelector('[data-enquiry-form]');
const status = document.querySelector('[data-form-status]');

if (form && status) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries());
    status.textContent = 'Sending your enquiry…';
    status.dataset.state = 'pending';
    if (button) button.disabled = true;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not send your enquiry.');
      form.reset();
      status.textContent = result.confirmationSent
        ? 'Thank you. Your enquiry has been sent to MEL ONE. Please check your email for a confirmation.'
        : 'Thank you. Your enquiry has been sent to MEL ONE.';
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = error.message || 'We could not send your enquiry. Please call MEL ONE directly.';
      status.dataset.state = 'error';
    } finally {
      if (button) button.disabled = false;
    }
  });
}
