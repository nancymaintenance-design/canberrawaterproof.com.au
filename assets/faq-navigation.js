// Native anchors and details remain the complete no-JavaScript interface.
(() => {
  const navigation = document.querySelector('.faq-navigation');
  if (!navigation) return;
  const root = document.documentElement;
  const header = document.querySelector('.header');
  const links = [...navigation.querySelectorAll('.faq-category-links a')];
  const headings = links.map(link => document.getElementById(link.hash.slice(1)));
  const mobile = matchMedia('(max-width: 760px)');
  root.classList.add('faq-enhanced');
  const offsets = () => {
    root.style.setProperty('--faq-header-height', `${Math.ceil(header?.getBoundingClientRect().height || 0)}px`);
    root.style.setProperty('--faq-bar-height', `${mobile.matches ? Math.ceil(navigation.getBoundingClientRect().height) : 0}px`);
  };
  const active = () => {
    const offset = (header?.getBoundingClientRect().height || 0) + (mobile.matches ? navigation.getBoundingClientRect().height : 0) + 24;
    let current = 0;
    headings.forEach((heading, index) => { if (heading && heading.getBoundingClientRect().top <= offset) current = index; });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let pending = false;
  const update = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { offsets(); active(); pending = false; });
  };
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(update);
    if (header) observer.observe(header);
    observer.observe(navigation);
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  addEventListener('hashchange', update);
  offsets();
  active();
})();
