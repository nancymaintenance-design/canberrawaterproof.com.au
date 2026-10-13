(() => {
 const button = document.querySelector('[data-navigation-toggle]');
 if (!button) return;
 const nav = document.getElementById(button.getAttribute('aria-controls'));
 if (!nav) return;
 const mobile = window.matchMedia('(max-width:620px)');
 const setOpen = (open) => {
  button.setAttribute('aria-expanded', String(open));
  nav.hidden = mobile.matches && !open;
 };
 const syncViewport = () => {
  const returnFocus = mobile.matches && nav.contains(document.activeElement);
  const focusDesktop = !mobile.matches && document.activeElement === button;
  button.hidden = !mobile.matches;
  setOpen(false);
  if (returnFocus) button.focus();
  if (focusDesktop) nav.querySelector('a')?.focus();
 };
 button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
 document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobile.matches && button.getAttribute('aria-expanded') === 'true') {
   setOpen(false);
   button.focus();
  }
 });
 mobile.addEventListener('change', syncViewport);
 syncViewport();
})();
