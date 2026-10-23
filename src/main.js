import {projects, additionalProjects} from './data.js';
import {createHeroCell, createMonitor} from './artwork.js';

const root = document.documentElement;
const {gsap, ScrollTrigger, SplitText, Lenis} = window;
const allProjects = [...projects, ...additionalProjects];
const reducedMedia = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hasMotionLibs = Boolean(gsap && ScrollTrigger && SplitText);
const motion = root.classList.contains('motion') && hasMotionLibs;
if (!motion) root.classList.remove('motion');
let userPaused = false;
try {userPaused = sessionStorage.getItem('tisha-motion-paused') === 'true';} catch { /* Storage can be unavailable in private modes. */ }
let paused = reducedMedia.matches || userPaused;
let lenis = null;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = name => '<svg aria-hidden="true"><use href="#i-' + name + '"/></svg>';

/* ---------- Case-file plates ---------- */
function helixPlate() {
  let rungs = '', railA = '', railB = '';
  for (let y = -240; y <= 600; y += 6) {
    const x = Math.sin(y / 120 * Math.PI * 2) * 46;
    railA += (y === -240 ? 'M' : 'L') + (200 + x).toFixed(1) + ' ' + y;
    railB += (y === -240 ? 'M' : 'L') + (200 - x).toFixed(1) + ' ' + y;
    if (y % 12 === 0) {
      const marked = (y + 240) % 84 === 0;
      rungs += '<path class="ln ' + (marked ? 'ln-mint' : 'ln-faint') + '" d="M' + (200 + x).toFixed(1) + ' ' + y + 'H' + (200 - x).toFixed(1) + '"/>';
      if (marked) rungs += '<circle class="dot-coral" cx="' + (200 + x).toFixed(1) + '" cy="' + y + '" r="3"/>';
    }
  }
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="helix-wrap"><g class="helix">'
    + rungs + '<path class="ln" d="' + railA + '"/><path class="ln ln-mint" d="' + railB + '"/></g></g></svg>'
    + '<span class="plate-label" style="right:7%;top:42%">5hmC<b>Promoter signatures</b></span>'
    + '<span class="plate-label" style="left:7%;top:62%"><b>Cell-free DNA</b>A gentler signal</span>';
}
function carePlate() {
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<rect class="ln ln-faint" x="140" y="26" width="120" height="250" rx="22"/><path class="ln ln-faint" d="M186 40h28"/>'
    + '<g class="breathe"><circle class="ln ln-mint" cx="200" cy="150" r="40"/><circle class="ln ln-faint" cx="200" cy="150" r="54"/></g>'
    + '<circle class="ln ln-faint" cx="200" cy="150" r="70" stroke-dasharray="2 6"/>'
    + '<text x="200" y="146" text-anchor="middle" fill="#ede8dd" font-family="Fraunces, serif" font-size="13" font-style="italic">Breathe in.</text>'
    + '<text x="200" y="163" text-anchor="middle" fill="#a3aca6" font-family="Geist, sans-serif" font-size="8.5">You’re here.</text>'
    + '<rect class="ln ln-faint" x="156" y="236" width="88" height="20" rx="10"/><text x="200" y="249" text-anchor="middle" fill="#ede8dd" font-family="Geist, sans-serif" font-size="8">How are you feeling?</text></svg>'
    + '<span class="plate-label float" style="left:7%;top:30%"><b>Capture fear</b>Emotional check-ins</span>'
    + '<span class="plate-label float" style="right:7%;top:46%;text-align:right"><b>Clarify</b>What to expect</span>'
    + '<span class="plate-label" style="right:7%;top:20%;text-align:right">EN · HI · KN</span>';
}
function visionPlate() {
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g transform="translate(0 18)">'
    + '<path class="ln ln-faint" d="M60 132c0-22 18-30 58-30h28c26 0 34 10 34 30v20c0 30-20 44-56 44h-8c-38 0-56-22-56-52Z"/>'
    + '<path class="ln ln-faint" d="M340 132c0-22-18-30-58-30h-28c-26 0-34 10-34 30v20c0 30 20 44 56 44h8c38 0 56-22 56-52Z"/>'
    + '<path class="ln ln-faint" d="M180 124c12-8 28-8 40 0M60 120 30 108M340 120l30-12"/>'
    + '<g class="float"><rect class="ln ln-mint" x="226" y="118" width="102" height="44" rx="8"/>'
    + '<text x="236" y="134" fill="#7ee3b7" font-family="Geist Mono, monospace" font-size="7" letter-spacing=".8">PROMPT · 09:00</text>'
    + '<text x="236" y="150" fill="#ede8dd" font-family="Geist, sans-serif" font-size="9.5">Morning medication</text></g>'
    + '<g><circle class="dot-mint blink" cx="96" cy="140" r="3.5"/><text x="106" y="143" fill="#a3aca6" font-family="Geist Mono, monospace" font-size="7" letter-spacing=".8">HOME · 120 M</text></g>'
    + '<path class="ln ln-faint" d="M60 236h280" stroke-dasharray="2 5"/></g></svg>'
    + '<span class="plate-label" style="left:7%;bottom:22%">Concept · AI-assisted glasses</span>';
}
function plastixPlate() {
  let particles = '';
  for (let i = 0; i < 34; i++) {
    const angle = i * 2.399963, radius = Math.sqrt(i / 34) * 92;
    const x = (200 + Math.cos(angle) * radius).toFixed(1), y = (160 + Math.sin(angle) * radius).toFixed(1);
    particles += i % 3 === 0
      ? '<path class="ln ln-faint" d="M' + x + ' ' + y + 'l' + (6 + i % 5) + ' ' + (i % 2 ? 4 : -4) + '"/>'
      : '<circle fill="rgba(237,232,221,.5)" cx="' + x + '" cy="' + y + '" r="' + (1 + i % 3 * .7) + '"/>';
  }
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><clipPath id="dish"><circle cx="200" cy="160" r="108"/></clipPath></defs>'
    + '<circle class="ln ln-faint" cx="200" cy="160" r="116"/><circle class="ln ln-faint" cx="200" cy="160" r="108"/>' + particles
    + '<rect class="ln ln-mint" x="152" y="104" width="26" height="18"/><rect class="ln ln-mint" x="226" y="176" width="22" height="22"/><rect class="ln ln-mint" x="170" y="204" width="16" height="16"/>'
    + '<g clip-path="url(#dish)"><g class="scan"><path d="M80 160h240" stroke="#7ee3b7" stroke-width="1.5"/><rect x="80" y="160" width="240" height="26" fill="url(#scanfade)"/></g></g>'
    + '<defs><linearGradient id="scanfade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7ee3b7" stop-opacity=".22"/><stop offset="1" stop-color="#7ee3b7" stop-opacity="0"/></linearGradient></defs></svg>'
    + '<span class="plate-label" style="left:7%;top:24%"><b>Fibre</b>Shape · texture</span>'
    + '<span class="plate-label" style="right:7%;top:58%;text-align:right"><b>Fragment · Bead</b>Count &amp; size</span>';
}
function prionPlate() {
  let coil = 'M60 170';
  for (let i = 0; i < 7; i++) coil += 'c8 -34 26 -34 22 0s-14 34 -2 0';
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<path class="ln ln-mint" d="' + coil + '"/>'
    + '<path class="ln ln-faint" d="M196 170h22m-6-6 6 6-6 6"/>'
    + '<path class="ln" d="M236 128l18 14-18 14 18 14-18 14 18 14M262 128l18 14-18 14 18 14-18 14 18 14M288 128l18 14-18 14 18 14-18 14 18 14M314 128l18 14-18 14 18 14-18 14 18 14" stroke="#e8664a"/>'
    + '<circle class="ln ln-faint spin-slow" cx="285" cy="170" r="74" stroke-dasharray="1 7"/></svg>'
    + '<span class="plate-label keep-case" style="left:12%;top:24%"><b>PrP<sup>C</sup></b>α-helix · folded</span>'
    + '<span class="plate-label keep-case" style="right:9%;top:16%;text-align:right"><b>PrP<sup>Sc</sup></b>β-sheet · misfolded</span>'
    + '<span class="plate-label" style="left:12%;bottom:16%">India · national review</span>';
}
function triadPlate() {
  return '<svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
    + '<circle class="ln ln-faint spin-slow" cx="200" cy="164" r="128" stroke-dasharray="2 8"/>'
    + '<circle class="ln" cx="166" cy="140" r="64" stroke="rgba(237,232,221,.45)"/><circle class="ln ln-mint" cx="234" cy="140" r="64"/><circle class="ln" cx="200" cy="198" r="64" stroke="#e8664a"/>'
    + '<circle class="dot-mint blink" cx="200" cy="160" r="4"/>'
    + '<text x="130" y="112" fill="#a3aca6" font-family="Geist Mono, monospace" font-size="7.5" letter-spacing="1">SICKLE CELL</text>'
    + '<text x="236" y="112" fill="#a3aca6" font-family="Geist Mono, monospace" font-size="7.5" letter-spacing="1">MALARIA</text>'
    + '<text x="200" y="236" text-anchor="middle" fill="#a3aca6" font-family="Geist Mono, monospace" font-size="7.5" letter-spacing="1">NEURODEGENERATION</text></svg>';
}
const plates = {cancer: helixPlate, care: carePlate, vision: visionPlate, plastix: plastixPlate, prion: prionPlate, triad: triadPlate};
const plateMarkup = visual => '<div class="plate plate-' + visual + '">' + (plates[visual] || triadPlate)() + '</div>';
const sentence = text => text.charAt(0) + text.slice(1).toLowerCase();

/* ---------- Render case files ---------- */
const track = $('#projects-grid');
track.innerHTML = projects.map((project, index) =>
  '<article class="case-card" data-cursor="Open">'
  + '<div class="case-visual"><div class="case-top"><span class="label">Case ' + String(index + 1).padStart(2, '0') + '</span><span class="label">' + sentence(project.categoryLabel) + '</span></div>'
  + plateMarkup(project.visual) + '<span class="case-chip">' + project.chip + '</span><span class="case-open">' + icon('arrow') + '</span></div>'
  + '<div class="case-meta"><span class="label">' + project.name + '</span><span class="label">' + project.year.replace('–', ' — ') + '</span></div>'
  + '<h3><button class="case-trigger" type="button" data-project="' + project.id + '" aria-label="Open case file: ' + project.name + '">' + project.title + '</button><small>' + project.subtitle + '</small></h3>'
  + '<p>' + project.description + '</p></article>'
).join('') + '<article class="case-more"><div><span class="label">Further threads</span><h3>A few more things<br />I’m <em>following.</em></h3></div>'
  + '<div class="thread-list">' + additionalProjects.map(project =>
    '<button class="thread" type="button" data-project="' + project.id + '"><b>' + project.name + '</b><small>' + project.subtitle + '</small>' + icon('arrow') + '</button>').join('') + '</div>'
  + '<a class="text-link scholar-link" href="https://scholar.google.com/citations?user=Sy0wAXIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer"><span>Research on Google Scholar</span>' + icon('arrow') + '</a></article>';

/* ---------- Project dialog with deep links ---------- */
const dialog = $('#project-dialog');
const dialogContent = $('#dialog-content');
let opener = null;
let returnHash = '#work';
function openProject(id, updateHistory = true) {
  const project = allProjects.find(item => item.id === id);
  if (!project) return;
  if (!dialog.open) {
    opener = document.activeElement;
    if (!location.hash.startsWith('#project/')) returnHash = location.hash || '#work';
  }
  dialogContent.innerHTML = '<div class="dialog-visual">' + (project.photo
    ? '<img class="dialog-photo" src="' + project.photo + '" alt="The ChoiceX team at the project showcase" />'
    : plateMarkup(project.visual)) + '</div>'
    + '<div class="dialog-body"><span class="label dialog-kicker">' + sentence(project.categoryLabel) + ' · ' + project.year + '</span>'
    + '<h2 id="dialog-title">' + project.name + '</h2><p class="dialog-subtitle">' + project.subtitle + '</p><p>' + project.overview + '</p>'
    + (project.stats ? '<div class="dialog-stats">' + project.stats.map(([value, label]) => '<div><strong>' + value + '</strong><small>' + label + '</small></div>').join('') + '</div>' : '')
    + '<h3>The question, and the work</h3><ul>' + project.approach.map(item => '<li>' + item + '</li>').join('') + '</ul>'
    + (project.stage ? '<p class="dialog-stage">' + project.stage + '</p>' : '')
    + '<div class="dialog-links">' + project.links.map(([label, href]) => '<a class="text-link" href="' + href + '"'
      + (href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"') + '><span>' + label + '</span>' + icon('arrow') + '</a>').join('')
    + '</div></div>';
  dialog.classList.remove('is-closing');
  if (!dialog.open) dialog.showModal();
  lenis?.stop();
  $('.dialog-panel').scrollTop = 0;
  $('.dialog-close').focus({preventScroll: true});
  if (updateHistory) history.pushState(null, '', '#project/' + id);
}
let closeTimer = 0;
function closeProject(updateHistory = true) {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  const finish = () => {
    dialog.classList.remove('is-closing');
    dialog.close();
    lenis?.start();
    if (opener instanceof HTMLElement && opener.isConnected) opener.focus({preventScroll: true});
  };
  if (updateHistory && location.hash.startsWith('#project/')) history.replaceState(null, '', returnHash);
  if (paused) {finish();return;}
  dialog.classList.add('is-closing');
  clearTimeout(closeTimer);
  closeTimer = setTimeout(finish, 420);
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (trigger) openProject(trigger.dataset.project);
});
$('.dialog-close').addEventListener('click', () => closeProject());
dialog.addEventListener('cancel', event => {event.preventDefault();closeProject();});
dialog.addEventListener('click', event => {if (event.target === dialog) closeProject();});
function scrollToTarget(target, immediate = false) {
  if (!target) return;
  if (lenis) lenis.scrollTo(target, {offset: 0, immediate, duration: 1.4});
  else target.scrollIntoView({behavior: immediate || paused ? 'instant' : 'smooth'});
}
function syncHash() {
  if (location.hash.startsWith('#project/')) {
    try {openProject(decodeURIComponent(location.hash.slice(9)), false);} catch { /* Ignore malformed shared links. */ }
    return;
  }
  closeProject(false);
  const legacy = {research: 'work', innovations: 'work', clinical: 'journey', education: 'journey', fellowships: 'journey', leadership: 'beyond', ngo: 'beyond', skills: 'about'};
  const section = legacy[location.hash.slice(1)];
  if (section) {
    history.replaceState(null, '', '#' + section);
    scrollToTarget(document.getElementById(section), true);
  }
}
window.addEventListener('hashchange', syncHash);

/* ---------- Header: theme, visibility, current section ---------- */
const header = $('[data-header]');
const themeObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) header.dataset.headerTheme = entry.target.dataset.theme;
}, {rootMargin: '-38px 0px -92% 0px'});
$$('main [data-theme]').forEach(section => themeObserver.observe(section));
const navObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    $$('.desktop-nav a').forEach(link => {
      const current = link.hash === '#' + entry.target.id;
      link.classList.toggle('current', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  }
}, {rootMargin: '-35% 0px -60% 0px'});
$$('main section[id], main footer[id]').forEach(section => navObserver.observe(section));
let lastY = window.scrollY, headerFrame = 0;
function updateHeader() {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 24);
  const range = document.documentElement.scrollHeight - window.innerHeight;
  header.style.setProperty('--progress', range > 0 ? (y / range).toFixed(4) : '0');
  const menuOpen = !$('#menu').hidden;
  if (!menuOpen && Math.abs(y - lastY) > 6) header.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * .6);
  lastY = y;
  headerFrame = 0;
}
window.addEventListener('scroll', () => {if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);}, {passive: true});
header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
updateHeader();

/* ---------- Mobile menu ---------- */
const menu = $('#menu');
const menuButton = $('.menu-toggle');
function setMenu(open) {
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  header.classList.remove('is-hidden');
  header.dataset.headerTheme = open ? 'dark' : header.dataset.headerTheme;
  if (open) {
    lenis?.stop();
    if (motion && !paused) gsap.fromTo($$('.menu-links a span, .menu-links sup'), {yPercent: 110, opacity: 0}, {yPercent: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .04});
  } else lenis?.start();
}
menuButton.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {setMenu(false);menuButton.focus();}
});
matchMedia('(min-width: 981px)').addEventListener('change', event => {if (event.matches) setMenu(false);});

/* In-page navigation, routed through smooth scrolling when it is active. */
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.hash.startsWith('#project/')) return;
  const target = link.hash === '#home' ? document.body : document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  if (!menu.hidden) setMenu(false);
  if (link.hash === '#main') {target.setAttribute('tabindex', '-1');target.focus({preventScroll: true});}
  scrollToTarget(link.hash === '#home' ? 0 : target);
  history.replaceState(null, '', link.hash === '#home' ? location.pathname : link.hash);
});

/* ---------- Timeline ECG: one heartbeat per milestone, drawn at true pixel scale ---------- */
const timeline = $('.timeline');
function drawTimelineEcg() {
  const svg = $('.timeline-ecg');
  const height = timeline.offsetHeight;
  const x = 28;
  let d = 'M' + x + ' 0';
  for (const node of $$('.timeline-node')) {
    const y = node.closest('.timeline-item').offsetTop - 64;
    if (y < 20) continue;
    d += 'V' + y + 'q-5 8 0 16v10l-4 4 22 7-28 8 10 5v10q-7 14 0 26';
  }
  d += 'V' + height;
  svg.setAttribute('viewBox', '0 0 56 ' + height);
  $$('path', svg).forEach(path => path.setAttribute('d', d));
}
drawTimelineEcg();
new ResizeObserver(drawTimelineEcg).observe(timeline);

/* ---------- Small details ---------- */
const timeFormat = new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'});
function updateTime() {$$('.local-time').forEach(element => {element.textContent = timeFormat.format(new Date());});}
updateTime();
setInterval(updateTime, 30000);
$('#copyright-year').textContent = String(new Date().getFullYear());

let toastTimer;
function showToast(message) {
  const toast = $('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}
$('.copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('tishasehrawat@gmail.com');
    showToast('Email address copied. Let’s talk!');
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('.email-link'));
    const selection = window.getSelection();
    selection.removeAllRanges();selection.addRange(range);
    showToast('Email selected — press Ctrl+C or ⌘C to copy.');
  }
});

/* ---------- Hero artwork ---------- */
const hero = $('.hero');
const heart = $('.monitor-heart');
const bpm = $('.monitor-bpm b');
let beats = 0;
const cell = createHeroCell($('.hero-cell'), {paused, pointerArea: hero});
const monitor = createMonitor($('.monitor-canvas'), {
  paused,
  onBeat() {
    heart.classList.add('beat');
    setTimeout(() => heart.classList.remove('beat'), 160);
    if (++beats % 4 === 0) bpm.textContent = String(71 + Math.round(Math.random() * 3));
  },
});

/* ---------- Motion preference ---------- */
const motionButton = $('.motion-toggle');
let marqueeTween = null;
function syncMotion() {
  paused = reducedMedia.matches || userPaused;
  root.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
  $('span', motionButton).textContent = paused ? 'Resume motion' : 'Pause motion';
  $('path', motionButton).setAttribute('d', paused ? 'm7 4 9 6-9 6Z' : 'M7 5v10M13 5v10');
  cell.setPaused(paused);
  monitor.setPaused(paused);
  if (marqueeTween) paused ? marqueeTween.pause() : marqueeTween.resume();
}
motionButton.addEventListener('click', () => {
  userPaused = !userPaused;
  try {sessionStorage.setItem('tisha-motion-paused', String(userPaused));} catch { /* Nonessential preference. */ }
  syncMotion();
});
reducedMedia.addEventListener('change', syncMotion);
syncMotion();

/* ---------- Choreography ---------- */
function setupSmoothScroll() {
  if (!Lenis) return;
  lenis = new Lenis({lerp: .09, smoothWheel: true, syncTouch: false});
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function setupCursor() {
  if (!finePointer.matches) return;
  const cursor = $('.cursor');
  const ring = $('.cursor-ring'), dot = $('.cursor-dot'), label = $('.cursor-label');
  const ringX = gsap.quickTo(ring, 'x', {duration: .5, ease: 'power3.out'});
  const ringY = gsap.quickTo(ring, 'y', {duration: .5, ease: 'power3.out'});
  const dotX = gsap.quickTo(dot, 'x', {duration: .08, ease: 'power3.out'});
  const dotY = gsap.quickTo(dot, 'y', {duration: .08, ease: 'power3.out'});
  gsap.set([ring, dot], {x: innerWidth / 2, y: innerHeight / 2});
  cursor.classList.add('is-hidden');
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    cursor.classList.remove('is-hidden');
    ringX(event.clientX);ringY(event.clientY);dotX(event.clientX);dotY(event.clientY);
    const labelled = event.target.closest('[data-cursor]');
    const interactive = event.target.closest('a, button, summary, [data-cursor]');
    cursor.classList.toggle('has-label', Boolean(labelled));
    cursor.classList.toggle('is-hover', Boolean(interactive) && !labelled);
    if (labelled) label.textContent = labelled.dataset.cursor;
  }, {passive: true});
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  dialog.addEventListener('close', () => cursor.classList.remove('has-label'));
}

function setupMagnetic() {
  if (!finePointer.matches) return;
  $$('.magnetic').forEach(element => {
    const toX = gsap.quickTo(element, 'x', {duration: .7, ease: 'power3.out'});
    const toY = gsap.quickTo(element, 'y', {duration: .7, ease: 'power3.out'});
    element.addEventListener('pointermove', event => {
      const bounds = element.getBoundingClientRect();
      toX((event.clientX - bounds.left - bounds.width / 2) * .3);
      toY((event.clientY - bounds.top - bounds.height / 2) * .3);
    });
    element.addEventListener('pointerleave', () => {toX(0);toY(0);});
  });
}

function setupMarquee() {
  const marqueeTrack = $('.marquee-track');
  const list = $('.marquee-list');
  for (let i = 0; i < 2; i++) {
    const clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.append(clone);
  }
  const build = () => {
    marqueeTween?.kill();
    gsap.set(marqueeTrack, {x: 0});
    marqueeTween = gsap.to(marqueeTrack, {x: -list.offsetWidth, duration: list.offsetWidth / 60, ease: 'none', repeat: -1});
    if (paused) marqueeTween.pause();
  };
  build();
  let width = innerWidth;
  window.addEventListener('resize', () => {if (innerWidth !== width) {width = innerWidth;build();}});
  // Scrolling nudges the marquee faster, in the direction of travel.
  let settle;
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate(self) {
      if (paused || !marqueeTween) return;
      const boost = gsap.utils.clamp(-5, 5, self.getVelocity() / 300);
      gsap.to(marqueeTween, {timeScale: (self.direction || 1) * (1 + Math.abs(boost)), duration: .25, overwrite: true});
      clearTimeout(settle);
      settle = setTimeout(() => gsap.to(marqueeTween, {timeScale: self.direction < 0 ? -1 : 1, duration: .8}), 120);
    },
  });
}

function splitHeadings() {
  $$('[data-split]').forEach(element => {
    SplitText.create(element, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: .09, scrollTrigger: {trigger: element, start: 'top 86%', once: true}});
      },
    });
  });
  $$('[data-scrub-words]').forEach(element => {
    const split = SplitText.create(element, {type: 'words', wordsClass: 'word'});
    gsap.fromTo(split.words, {opacity: .14}, {opacity: 1, ease: 'none', stagger: .08, scrollTrigger: {trigger: element, start: 'top 80%', end: 'bottom 50%', scrub: .6}});
  });
}

function setupReveals() {
  $$('.head-line').forEach(line => gsap.from(line, {scaleX: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: {trigger: line, start: 'top 92%', once: true}}));
  $$('[data-reveal]').forEach(element => gsap.from(element, {y: 48, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: {trigger: element, start: 'top 88%', once: true}}));
  $$('[data-stagger]').forEach(group => gsap.from(group.children, {y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07, scrollTrigger: {trigger: group, start: 'top 85%', once: true}}));
  $$('.vitals li, .award-list li, .community-card').forEach((element, index, list) => {
    gsap.from(element, {y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', delay: (index % 4) * .06, scrollTrigger: {trigger: element, start: 'top 92%', once: true}});
  });
  $$('[data-clip-reveal]').forEach(figure => {
    const image = $('img', figure);
    const tl = gsap.timeline({scrollTrigger: {trigger: figure, start: 'top 85%', once: true}});
    tl.fromTo(figure, {clipPath: 'inset(100% 0% 0% 0% round 18px)'}, {clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath'})
      .from(image, {scale: 1.35, duration: 1.8, ease: 'expo.out'}, '<.15');
  });
  $$('[data-parallax-img]').forEach(image => gsap.fromTo(image, {yPercent: -9}, {yPercent: 0, ease: 'none', scrollTrigger: {trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}}));
  $$('[data-count]').forEach(element => {
    const target = Number(element.dataset.count);
    const grouped = element.textContent.includes(',');
    const state = {value: 0};
    element.textContent = '0';
    gsap.to(state, {
      value: target, duration: 2, ease: 'expo.out',
      scrollTrigger: {trigger: element, start: 'top 90%', once: true},
      onUpdate() {element.textContent = grouped ? Math.round(state.value).toLocaleString('en-US') : String(Math.round(state.value));},
    });
  });
}

function setupHeroScroll() {
  const scrub = {trigger: hero, start: 'top top', end: 'bottom top', scrub: true};
  gsap.to('.hero-canvas-wrap', {scale: 1.18, opacity: .25, ease: 'none', scrollTrigger: scrub});
  gsap.to('.hero-name', {yPercent: -26, ease: 'none', scrollTrigger: scrub});
  gsap.to('.hero-top', {yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: {...scrub, end: '60% top'}});
}

function setupWorkRail() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (min-height: 620px)', () => {
    root.classList.add('has-hscroll');
    const pin = $('.work-pin');
    const bar = $('.work-progress-bar i');
    const count = $('.work-progress-count');
    const distance = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {x: () => -distance(), ease: 'none'});
    const trigger = ScrollTrigger.create({
      trigger: pin, start: 'top top', end: () => '+=' + distance(), pin: true, scrub: .8, animation: tween, invalidateOnRefresh: true,
      onUpdate(self) {
        gsap.set(bar, {scaleX: self.progress});
        count.textContent = String(Math.min(projects.length, Math.floor(self.progress * projects.length) + 1)).padStart(2, '0');
      },
    });
    $$('.case-card .plate svg', track).forEach(svg => gsap.fromTo(svg, {scale: 1.25}, {
      scale: 1, ease: 'none', scrollTrigger: {trigger: svg.closest('.case-card'), containerAnimation: tween, start: 'left right', end: 'left 35%', scrub: true},
    }));
    // Keyboard users: keep the focused card in view by scrolling the page, not the clipped rail.
    let focusTimer = 0;
    const onFocus = event => {
      const card = event.target.closest('.case-card, .case-more');
      if (!card) return;
      // The browser scrolls focused elements into view after focusin, so correct once it has finished.
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        pin.scrollLeft = 0;
        const offset = card.offsetLeft - (innerWidth - card.offsetWidth) / 2;
        const progress = gsap.utils.clamp(0, 1, offset / (distance() || 1));
        scrollToTarget(trigger.start + progress * (trigger.end - trigger.start), true);
      }, 80);
    };
    track.addEventListener('focusin', onFocus);
    return () => {
      track.removeEventListener('focusin', onFocus);
      root.classList.remove('has-hscroll');
    };
  });
  mm.add('(max-width: 1023px), (max-height: 619px)', () => {
    $$('.case-card, .case-more', track).forEach(card => gsap.from(card, {y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: {trigger: card, start: 'top 90%', once: true}}));
  });
}

function setupJourney() {
  const ecg = $('.timeline-ecg');
  const base = $('path', ecg).cloneNode();
  base.classList.add('timeline-ecg-base');
  ecg.prepend(base);
  gsap.fromTo($('path:not(.timeline-ecg-base)', ecg), {clipPath: 'inset(0% 0% 100% 0%)'}, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: {trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: .5},
  });
  $$('.timeline-node').forEach(node => gsap.from(node, {scale: 0, duration: .8, ease: 'back.out(3)', scrollTrigger: {trigger: node, start: 'top 72%', once: true}}));
}

function setupTalk() {
  const media = $('.talk-media');
  if (matchMedia('(max-width: 640px)').matches) {
    gsap.from(media, {clipPath: 'inset(8% 8% 8% 8% round 18px)', duration: 1.6, ease: 'expo.out', scrollTrigger: {trigger: media, start: 'top 85%', once: true}});
    gsap.from('.talk-copy > *', {y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: {trigger: '.talk-copy', start: 'top 90%', once: true}});
    gsap.from('.footer-mega', {yPercent: 60, ease: 'none', scrollTrigger: {trigger: '.footer-mega', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)', scrub: true}});
    return;
  }
  const scrub = {trigger: '.talk', start: 'top bottom', end: 'top 10%', scrub: true};
  gsap.fromTo(media, {clipPath: 'inset(12% 20% 12% 20% round 28px)'}, {clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: scrub});
  gsap.fromTo($('img', media), {scale: 1.3}, {scale: 1, ease: 'none', scrollTrigger: scrub});
  gsap.from('.talk-copy > *', {y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: {trigger: '.talk', start: 'top 40%', once: true}});
  gsap.from('.footer-mega', {yPercent: 60, ease: 'none', scrollTrigger: {trigger: '.footer-mega', start: 'clamp(top bottom)', end: 'clamp(bottom bottom)', scrub: true}});
}

function heroIntro(fast) {
  const nameSplit = SplitText.create('.hero-name-line', {type: 'chars', charsClass: 'char'});
  const taglineSplit = SplitText.create('.hero-tagline', {type: 'lines', mask: 'lines', linesClass: 'split-line'});
  gsap.set(nameSplit.chars, {yPercent: 118});
  gsap.set(taglineSplit.lines, {yPercent: 115});
  gsap.set('[data-hero-fade]', {y: 24, opacity: 0});
  gsap.set('.hero-canvas-wrap', {opacity: 0, scale: .82});
  gsap.set('.hero-annotations', {opacity: 0});
  gsap.set(header, {yPercent: -100, opacity: 0});
  root.classList.add('is-ready');
  const tl = gsap.timeline({paused: true, defaults: {ease: 'expo.out'}});
  tl.to('.hero-canvas-wrap', {opacity: 1, scale: 1, duration: 2.4, ease: 'power3.out'}, 0)
    .to(nameSplit.chars, {yPercent: 0, duration: 1.5, stagger: .045}, .1)
    .to(taglineSplit.lines, {yPercent: 0, duration: 1.3, stagger: .1}, .35)
    .to('[data-hero-fade]', {y: 0, opacity: 1, duration: 1.2, stagger: .1}, .55)
    .to(header, {yPercent: 0, opacity: 1, duration: 1.2, clearProps: 'transform,opacity'}, .6)
    .to('.hero-annotations', {opacity: 1, duration: 1.6}, .9);
  if (fast) tl.timeScale(1.4);
  return tl;
}

function runPreloader(onDone) {
  const preloader = $('.preloader');
  let seen = false;
  try {seen = sessionStorage.getItem('tisha-intro-seen') === 'true';sessionStorage.setItem('tisha-intro-seen', 'true');} catch { /* Show the intro if storage is unavailable. */ }
  if (seen) {preloader.remove();root.classList.add('is-loaded');onDone(true);return;}
  const count = $('.preloader-count b');
  const state = {value: 0};
  const tl = gsap.timeline({defaults: {ease: 'power2.inOut'}});
  tl.fromTo('.preloader-ecg', {clipPath: 'inset(0% 100% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7}, 0)
    .to(state, {value: 100, duration: 1.7, onUpdate: () => {count.textContent = String(Math.round(state.value));}}, 0)
    .to('.preloader-row', {opacity: 0, duration: .4}, '+=.1')
    .to(preloader, {yPercent: -100, duration: 1.1, ease: 'expo.inOut'}, '<.1')
    .add(() => onDone(false), '-=.6')
    .add(() => {preloader.remove();root.classList.add('is-loaded');});
}

async function startMotion() {
  setupSmoothScroll();
  await Promise.race([document.fonts?.ready, new Promise(resolve => setTimeout(resolve, 1400))]);
  const intro = heroIntro(false);
  runPreloader(fast => {if (fast) intro.timeScale(1.4);intro.play();});
  splitHeadings();
  setupReveals();
  setupHeroScroll();
  setupWorkRail();
  setupJourney();
  setupTalk();
  setupMarquee();
  setupCursor();
  setupMagnetic();
  window.addEventListener('load', () => ScrollTrigger.refresh());
  syncHash();
  if (location.hash && !location.hash.startsWith('#project/')) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => scrollToTarget(target, true));
  }
}

if (motion) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  startMotion();
} else {
  root.classList.add('is-ready', 'is-loaded');
  $('.preloader')?.remove();
  syncHash();
}
