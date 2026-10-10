(() => {
  if (window.melOneTrackLead) return;
  const local = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/i.test(window.location.hostname);
  function track(name, params) {
    if (local) return;
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
    } catch { /* Measurement must never interrupt contact or navigation. */ }
  }
  window.melOneTrackLead = () => track('generate_lead', { method: 'contact_form' });
  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.defaultPrevented) return;
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    let type;
    if (/^tel:/i.test(href)) type = 'phone';
    else if (/^mailto:/i.test(href)) type = 'email';
    else {
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin && (url.pathname === '/contact/' || url.hash === '#booking')) type = 'booking';
      } catch { return; }
    }
    if (!type) return;
    // Wait until other synchronous handlers have had a chance to cancel.
    queueMicrotask(() => {
      if (!event.defaultPrevented) track(type + '_click', { contact_type: type });
    });
  });
})();
