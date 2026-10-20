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
    const breadcrumb = link.closest?.('nav.customer-breadcrumb');
    if (breadcrumb) {
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        try {
          const target = new URL(href, window.location.origin);
          if (target.origin !== window.location.origin) return;
          track('breadcrumb_click', {
            source_path: window.location.pathname,
            target_path: target.pathname,
            locale: window.location.pathname.startsWith('/zh/') ? 'zh-Hans' : 'en-AU',
            position: Number(link.closest('li')?.getAttribute('data-breadcrumb-position')),
            owner_id: breadcrumb.getAttribute('data-breadcrumb-owner') || 'general-waterproofing'
          });
        } catch { /* Navigation must remain usable without measurement. */ }
      });
      return;
    }
    let type;
    if (/^tel:/i.test(href)) type = 'phone';
    else if (/^mailto:/i.test(href)) type = 'email';
    else {
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin && (['/contact/', '/zh/contact/'].includes(url.pathname) || url.hash === '#booking')) type = 'booking';
      } catch { return; }
    }
    if (!type) return;
    // Wait until other synchronous handlers have had a chance to cancel.
    queueMicrotask(() => {
      if (!event.defaultPrevented) track(type + '_click', { contact_type: type });
    });
  });
})();
