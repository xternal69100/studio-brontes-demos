document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const closeButton = document.querySelector('.menu-close');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
let previousFocus = null;

function menuFocusables() {
  return [...mobileMenu.querySelectorAll('button, a[href]')];
}

function openMenu() {
  previousFocus = document.activeElement;
  mobileMenu.hidden = false;
  mobileMenu.inert = false;
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  main.inert = true;
  footer.inert = true;
  closeButton.focus();
}

function closeMenu() {
  mobileMenu.hidden = true;
  mobileMenu.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  main.inert = false;
  footer.inert = false;
  (previousFocus || menuButton).focus();
}

menuButton?.addEventListener('click', openMenu);
closeButton?.addEventListener('click', closeMenu);
mobileMenu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (!mobileMenu || mobileMenu.hidden) return;

  if (event.key === 'Escape') {
    closeMenu();
    return;
  }

  if (event.key !== 'Tab') return;
  const focusables = menuFocusables();
  const first = focusables[0];
  const last = focusables.at(-1);

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

if (!reducedMotion) {
  const curtain = document.createElement('div');
  curtain.className = 'intro-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span>NET / LAU</span>';
  document.body.append(curtain);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => curtain.classList.add('is-leaving'));
  });

  window.setTimeout(() => curtain.remove(), 850);
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-seen');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('[data-mask], .light-transition').forEach((element) => {
    revealObserver.observe(element);
  });
}

const heroMedia = document.querySelector('[data-parallax]');
const heroSignal = document.querySelector('.hero-signal');
const method = document.querySelector('.method');
let ticking = false;

function updateScrollMotion() {
  if (reducedMotion) {
    ticking = false;
    return;
  }

  const scrollY = window.scrollY;
  const heroProgress = Math.min(1, scrollY / Math.max(1, window.innerHeight));

  if (heroMedia) {
    heroMedia.style.transform = `translate3d(0, ${Math.round(heroProgress * 18)}px, 0)`;
  }

  if (heroSignal) {
    heroSignal.style.setProperty('--signal-shift', `${Math.round(heroProgress * -14)}px`);
  }

  if (method) {
    const rect = method.getBoundingClientRect();
    const progress = Math.max(0.08, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.4)));
    method.style.setProperty('--method-progress', progress.toFixed(3));
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScrollMotion);
}, { passive: true });

updateScrollMotion();
