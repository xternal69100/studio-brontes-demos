(() => {
  'use strict';
  const body = document.body;
  body.classList.add('js-ready');

  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('#mobile-menu');
  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.querySelector('.sr-only').textContent = 'Ouvrir le menu';
      mobileMenu.hidden = true;
    };
    const openMenu = () => {
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.querySelector('.sr-only').textContent = 'Fermer le menu';
      mobileMenu.hidden = false;
    };
    menuButton.addEventListener('click', () => {
      menuButton.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
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

  document.querySelectorAll('.faq-item button').forEach((button, index) => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const icon = button.querySelector('[aria-hidden="true"]');
    const setExpanded = expanded => {
      button.setAttribute('aria-expanded', String(expanded));
      answer.hidden = !expanded;
      icon.textContent = expanded ? '−' : '+';
    };
    setExpanded(index === 0);
    button.addEventListener('click', () => setExpanded(button.getAttribute('aria-expanded') !== 'true'));
  });

  const dialog = document.querySelector('#demo-dialog');
  if (dialog) {
    document.querySelectorAll('.demo-trigger').forEach(trigger => trigger.addEventListener('click', event => {
      event.preventDefault();
      dialog.showModal();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.dialog-link').addEventListener('click', event => {
      event.preventDefault();
      dialog.close();
      const target = document.querySelector('#faq');
      const firstQuestion = target.querySelector('button');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      firstQuestion.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.desktop-nav .nav-link')];
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${active.target.id}`));
    }, { rootMargin: '-28% 0px -61% 0px', threshold: [0.1, 0.3, 0.55] });
    sections.forEach(section => navObserver.observe(section));
  }

  const animated = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.24 });
    animated.forEach(element => revealObserver.observe(element));
  } else {
    animated.forEach(element => element.classList.add('is-in-view'));
  }
})();
