document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = Boolean(navigator.connection && navigator.connection.saveData);
const diagnostics = {
  activeObjectUrls: 0,
  videoSourceAttached: false,
  previewCount: 0,
  taskCount: 0
};
window.__loloDiagnostics = diagnostics;

const heroVideo = document.querySelector('.hero-video');
if (heroVideo && !reducedMotion && !saveData) {
  heroVideo.src = heroVideo.dataset.src;
  diagnostics.videoSourceAttached = true;
  heroVideo.load();
  heroVideo.play().catch(() => {});
}

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
  curtain.innerHTML = '<img src="brand/lolo-mark.svg" width="84" height="84" alt=""><span>LOLO</span>';
  document.body.append(curtain);
  requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.add('is-leaving')));
  window.setTimeout(() => curtain.remove(), 900);
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-seen');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('[data-mask], .light-transition').forEach((element) => revealObserver.observe(element));
}

const heroMedia = document.querySelector('[data-parallax]');
const heroSignal = document.querySelector('.hero-signal');
const hero = document.querySelector('.hero');
const heroStage = document.querySelector('[data-hero-stage]');
const method = document.querySelector('.method');
let ticking = false;

function updateScrollMotion() {
  if (reducedMotion) {
    ticking = false;
    return;
  }
  const scrollY = window.scrollY;
  const heroProgress = Math.min(1, scrollY / Math.max(1, window.innerHeight));
  if (heroMedia) heroMedia.style.transform = `translate3d(0, ${Math.round(heroProgress * 18)}px, 0)`;
  if (heroSignal) heroSignal.style.setProperty('--signal-shift', `${Math.round(heroProgress * -14)}px`);
  if (hero && heroStage && window.matchMedia('(min-width: 1100px)').matches) {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    heroStage.style.setProperty('--hero-scale', (1 - progress * 0.18).toFixed(3));
    heroStage.style.setProperty('--hero-translate-x', `${(progress * 2.4).toFixed(2)}vw`);
    heroStage.style.setProperty('--hero-translate-y', `${(progress * 2.4).toFixed(2)}vh`);
    heroStage.style.setProperty('--hero-radius', `${Math.round(progress * 10)}px`);
    heroStage.style.setProperty('--hero-shadow', `${(progress * 0.2).toFixed(2)}`);
  } else if (heroStage) {
    heroStage.removeAttribute('style');
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

const form = document.querySelector('#quote-form');
const taskTemplate = document.querySelector('#task-template');
const tasksList = document.querySelector('#tasks-list');
const addTaskButton = document.querySelector('#add-task');
const errorSummary = document.querySelector('.form-errors');
const summaryOutput = document.querySelector('#quote-summary');
const stepOrder = ['need', 'tasks', 'contact', 'summary'];
const taskFiles = new Map();
let taskUid = 0;
let currentStep = 'need';

function makeId(uid, field) {
  return `task-${uid}-${field}`;
}

function revokeFileEntry(entry) {
  if (!entry || !entry.url) return;
  URL.revokeObjectURL(entry.url);
  diagnostics.activeObjectUrls = Math.max(0, diagnostics.activeObjectUrls - 1);
}

function revokeTaskFiles(card) {
  const entries = taskFiles.get(card.dataset.uid) || [];
  entries.forEach(revokeFileEntry);
  taskFiles.delete(card.dataset.uid);
  diagnostics.previewCount = [...taskFiles.values()].reduce((sum, files) => sum + files.length, 0);
}

function renderPreviews(card) {
  const list = card.querySelector('.image-previews');
  const entries = taskFiles.get(card.dataset.uid) || [];
  list.replaceChildren();
  entries.forEach((entry, index) => {
    const item = document.createElement('li');
    const image = document.createElement('img');
    image.src = entry.url;
    image.alt = '';
    image.width = 96;
    image.height = 72;
    const text = document.createElement('span');
    text.textContent = `${entry.file.name} · ${(entry.file.size / 1048576).toFixed(1)} Mio`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Retirer';
    remove.addEventListener('click', () => {
      const current = taskFiles.get(card.dataset.uid) || [];
      const [removed] = current.splice(index, 1);
      revokeFileEntry(removed);
      renderPreviews(card);
    });
    item.append(image, text, remove);
    list.append(item);
  });
  diagnostics.previewCount = [...taskFiles.values()].reduce((sum, files) => sum + files.length, 0);
}

function handleFiles(card, input) {
  const status = card.querySelector('.file-errors');
  const previous = taskFiles.get(card.dataset.uid) || [];
  previous.forEach(revokeFileEntry);
  const existing = [];
  const incoming = [...input.files];
  const messages = [];
  const accepted = [];
  let total = existing.reduce((sum, entry) => sum + entry.file.size, 0);

  incoming.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      messages.push(`${file.name} refusé : le fichier n’est pas une image.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      messages.push(`${file.name} refusé : plus de 10 Mio.`);
      return;
    }
    if (existing.length + accepted.length >= 6) {
      messages.push(`${file.name} refusé : limite de 6 images atteinte.`);
      return;
    }
    if (total + file.size > 30 * 1024 * 1024) {
      messages.push(`${file.name} refusé : limite totale de 30 Mio dépassée.`);
      return;
    }
    const url = URL.createObjectURL(file);
    diagnostics.activeObjectUrls += 1;
    accepted.push({ file, url });
    total += file.size;
  });

  taskFiles.set(card.dataset.uid, [...existing, ...accepted]);
  status.textContent = messages.join(' ');
  input.value = '';
  renderPreviews(card);
}

function updateTaskLabels() {
  [...tasksList.querySelectorAll('.task-card')].forEach((card, index) => {
    card.querySelector('.task-number').textContent = `Tâche ${index + 1}`;
    const remove = card.querySelector('.remove-task');
    remove.hidden = index === 0;
    remove.disabled = index === 0;
  });
  diagnostics.taskCount = tasksList.querySelectorAll('.task-card').length;
}

function enhanceTask(card) {
  taskUid += 1;
  const uid = String(taskUid);
  card.dataset.uid = uid;
  card.querySelectorAll('[data-field]').forEach((field) => {
    const key = field.dataset.field;
    field.id = makeId(uid, key);
    field.name = `${makeId(uid, key)}${key === 'images' ? '[]' : ''}`;
  });
  card.querySelector('[data-field="images"]').addEventListener('change', (event) => handleFiles(card, event.currentTarget));
  card.querySelector('[data-field="title"]').addEventListener('input', (event) => {
    card.querySelector('.task-summary').textContent = event.currentTarget.value.trim() || 'À décrire';
  });
  card.querySelector('.remove-task').addEventListener('click', () => {
    if (tasksList.querySelectorAll('.task-card').length === 1) return;
    revokeTaskFiles(card);
    card.remove();
    updateTaskLabels();
  });
  taskFiles.set(uid, []);
  updateTaskLabels();
}

function addTask() {
  const fragment = taskTemplate.content.cloneNode(true);
  const card = fragment.querySelector('.task-card');
  tasksList.append(fragment);
  enhanceTask(card);
  card.querySelector('[data-field="type"]').focus();
}

function showErrors(fields) {
  if (!fields.length) {
    errorSummary.hidden = true;
    errorSummary.textContent = '';
    return true;
  }
  errorSummary.textContent = `Merci de corriger ${fields.length} champ${fields.length > 1 ? 's' : ''} avant de continuer.`;
  errorSummary.hidden = false;
  errorSummary.focus();
  fields.forEach((field) => field.setAttribute('aria-invalid', 'true'));
  fields[0].focus();
  return false;
}

function validatePanel(step) {
  const panel = form.querySelector(`[data-step-panel="${step}"]`);
  panel.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
  const invalid = [...panel.querySelectorAll('input, select, textarea')].filter((field) => !field.checkValidity());
  return showErrors(invalid);
}

function showStep(step, focus = true) {
  currentStep = step;
  form.querySelectorAll('[data-step-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.stepPanel === step));
  form.querySelectorAll('[data-progress]').forEach((item) => {
    const active = item.dataset.progress === step;
    item.toggleAttribute('aria-current', active);
  });
  if (focus) form.querySelector(`[data-step-panel="${step}"] legend`).focus?.();
  errorSummary.hidden = true;
}

function buildSummary() {
  const data = new FormData(form);
  const need = data.get('need') || 'Non précisé';
  const cards = [...tasksList.querySelectorAll('.task-card')];
  const article = document.createElement('div');
  article.innerHTML = `<p><strong>Besoin :</strong> ${need}</p><p><strong>Contact :</strong> ${data.get('contact-name')} · ${data.get('contact-email')} · ${data.get('contact-city')}</p>`;
  const list = document.createElement('ol');
  cards.forEach((card) => {
    const uid = card.dataset.uid;
    const item = document.createElement('li');
    const type = form.elements[makeId(uid, 'type')]?.value || 'Type non précisé';
    const title = form.elements[makeId(uid, 'title')]?.value || 'Sans titre';
    const count = (taskFiles.get(uid) || []).length;
    item.textContent = `${type} — ${title} — ${count} image${count > 1 ? 's' : ''} locale${count > 1 ? 's' : ''}`;
    list.append(item);
  });
  article.append(list);
  summaryOutput.replaceChildren(article);
}

form?.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => {
  if (validatePanel(currentStep)) showStep(button.dataset.next);
}));
form?.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(button.dataset.back)));
addTaskButton?.addEventListener('click', addTask);

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validatePanel('contact')) return;
  if (!validatePanel('tasks')) {
    showStep('tasks', false);
    validatePanel('tasks');
    return;
  }
  buildSummary();
  showStep('summary');
});

document.querySelector('#restart-preview')?.addEventListener('click', () => {
  [...tasksList.querySelectorAll('.task-card')].forEach(revokeTaskFiles);
  form.reset();
  const cards = [...tasksList.querySelectorAll('.task-card')];
  cards.slice(1).forEach((card) => card.remove());
  cards[0].querySelector('.image-previews').replaceChildren();
  cards[0].querySelector('.task-summary').textContent = 'À décrire';
  taskFiles.set(cards[0].dataset.uid, []);
  updateTaskLabels();
  showStep('need');
});

const initialTask = tasksList?.querySelector('.task-card');
if (initialTask) enhanceTask(initialTask);
else addTask();

window.addEventListener('beforeunload', () => {
  taskFiles.forEach((entries) => entries.forEach(revokeFileEntry));
  taskFiles.clear();
});
