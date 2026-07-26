(() => {
  'use strict';
  const body = document.body;
  body.classList.add('js-ready');

  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('#mobile-menu');
  if (menuButton && mobileMenu) {
    const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); mobileMenu.hidden = true; };
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  const range = document.querySelector('#comparison-range');
  const split = document.querySelector('.split-reveal');
  if (range && split) {
    const applySplit = () => {
      split.style.setProperty('--split', `${range.value}%`);
      range.setAttribute('aria-valuetext', `BILLY visible à ${range.value} pour cent`);
    };
    range.addEventListener('input', applySplit, { passive: true });
    applySplit();
  }

  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });

  const dialog = document.querySelector('#demo-dialog');
  if (dialog) {
    document.querySelectorAll('.demo-trigger').forEach(trigger => trigger.addEventListener('click', event => { event.preventDefault(); dialog.showModal(); }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }

  const buybar = document.querySelector('.buybar');
  const proof = document.querySelector('.safety-schematic');
  if (buybar && proof && 'IntersectionObserver' in window) {
    const buyObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        buybar.classList.add('is-ready');
        buyObserver.disconnect();
      }
    }, { threshold: 0.5 });
    buyObserver.observe(proof);
  } else if (buybar) {
    buybar.classList.add('is-ready');
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.desktop-nav .nav-link')];
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${active.target.id}`));
    }, { rootMargin: '-24% 0px -63% 0px', threshold: [0.1, 0.3, 0.55] });
    sections.forEach(section => navObserver.observe(section));
  }

  const animated = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-in-view'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.24 });
    animated.forEach(element => revealObserver.observe(element));
  } else {
    animated.forEach(element => element.classList.add('is-in-view'));
  }
})();
