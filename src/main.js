// Small, dependency-free interactions: header, mobile menu, reveal, back-to-top, filters, copy email.
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
document.documentElement.classList.add('js');

// Old single-page links (/#research, /#project/care) still land somewhere sensible.
const legacy = {
  about: '/about', skills: '/about', work: '/research', research: '/research', innovations: '/projects',
  journey: '/clinical', clinical: '/clinical', education: '/education', fellowships: '/education',
  beyond: '/community', leadership: '/community', ngo: '/community', awards: '/awards', contact: '/contact',
  'project/cancer': '/research#cancer', 'project/prion': '/research#prion', 'project/triad': '/research#triad',
  'project/care': '/projects#care', 'project/vision': '/projects#vision', 'project/plastixcan': '/projects#plastixcan',
  'project/choicex': '/projects#choicex', 'project/biobeats': '/projects#biobeats', 'project/croasis': '/projects#croasis',
};
if (location.pathname === '/' && legacy[location.hash.slice(1)]) location.replace(legacy[location.hash.slice(1)]);

// Compact header, reading progress and back-to-top button.
const header = $('.site-header');
const toTop = $('.to-top');
let frame = 0;
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('is-scrolled', window.scrollY > 8);
  header.style.setProperty('--progress', max > 0 ? String(Math.min(window.scrollY / max, 1)) : '0');
  toTop.hidden = window.scrollY < 600;
  frame = 0;
}
window.addEventListener('scroll', () => {if (!frame) frame = requestAnimationFrame(onScroll);}, {passive: true});
onScroll();
toTop.addEventListener('click', () => {
  window.scrollTo({top: 0});
  $('.logo').focus({preventScroll: true});
});

// Nav capsule: glides to the hovered or focused link, settles back on the current page,
// and carries over from wherever it was on the previous page.
const nav = $('.main-nav');
const navLinks = $$('.nav-link', nav);
const current = navLinks.find(link => link.classList.contains('active'));
const pill = document.createElement('span');
pill.className = 'nav-pill';
pill.setAttribute('aria-hidden', 'true');
nav.prepend(pill);
nav.classList.add('has-pill');
let pillAt = null;
function movePill(link, instant = false) {
  if (link && !link.offsetWidth) return;
  const appearing = !pill.classList.contains('is-visible');
  pill.classList.toggle('is-instant', instant || appearing);
  pill.classList.toggle('is-visible', Boolean(link));
  pill.classList.toggle('is-away', Boolean(link) && link !== current);
  pillAt = link;
  if (!link) return;
  for (const [name, value] of [['--x', link.offsetLeft], ['--y', link.offsetTop], ['--w', link.offsetWidth], ['--h', link.offsetHeight]]) {
    pill.style.setProperty(name, value + 'px');
  }
  if (instant || appearing) {
    pill.getBoundingClientRect();
    pill.classList.remove('is-instant');
  }
}
navLinks.forEach(link => {
  link.addEventListener('pointerenter', () => movePill(link));
  link.addEventListener('focus', () => movePill(link));
  link.addEventListener('pointerdown', () => pill.classList.add('is-pressed'));
});
nav.addEventListener('pointerleave', () => movePill(current));
nav.addEventListener('focusout', event => {if (!nav.contains(event.relatedTarget)) movePill(current);});
document.addEventListener('pointerup', () => pill.classList.remove('is-pressed'));
new ResizeObserver(() => movePill(pillAt || current, true)).observe(nav);
addEventListener('pagehide', () => {
  try {sessionStorage.setItem('nav-pill', String(navLinks.indexOf(pillAt)));} catch {}
});
addEventListener('pageshow', event => {if (event.persisted) movePill(current, true);});
document.fonts.ready.then(() => {
  let from = -1;
  try {from = Number(sessionStorage.getItem('nav-pill') ?? -1);} catch {}
  if (current && navLinks[from] && navLinks[from] !== current) {
    movePill(navLinks[from], true);
    requestAnimationFrame(() => movePill(current));
  } else movePill(current, true);
});

// Mobile menu: a modal panel with focus kept inside while open.
const menu = $('#mobile-menu');
const menuButton = $('.menu-button');
function setMenu(open) {
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) $('.menu-close', menu).focus(); else menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(true));
$('.menu-close', menu).addEventListener('click', () => setMenu(false));
menu.addEventListener('click', event => {if (event.target === menu) setMenu(false);});
document.addEventListener('keydown', event => {
  if (menu.hidden) return;
  if (event.key === 'Escape') setMenu(false);
  if (event.key === 'Tab') {
    const focusable = $$('a, button', menu);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  }
});
matchMedia('(min-width: 1181px)').addEventListener('change', event => {if (event.matches && !menu.hidden) setMenu(false);});

// Gentle fade-up as content enters the viewport.
const revealables = $$('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {rootMargin: '0px 0px -8% 0px', threshold: .08});
  revealables.forEach(element => observer.observe(element));
} else revealables.forEach(element => element.classList.add('is-visible'));

// Awards filter.
const filters = $$('.filter');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  $$('.award-group').forEach(group => {
    group.hidden = filter !== 'all' && group.dataset.group !== filter;
    if (!group.hidden) $$('[data-reveal]', group).forEach(card => card.classList.add('is-visible'));
  });
  const status = $('.filter-status');
  if (status) status.textContent = 'Showing ' + (filter === 'all' ? 'all awards' : button.firstChild.textContent.trim());
}));

// Copy email address.
let toastTimer;
function toast(message) {
  const element = $('.toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 3000);
}
$$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    toast('Email address copied');
  } catch {
    toast(button.dataset.copy);
  }
}));

$$('[data-year]').forEach(element => {element.textContent = String(new Date().getFullYear());});
