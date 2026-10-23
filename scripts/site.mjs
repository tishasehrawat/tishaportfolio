// Tiny static-site renderer shared by the dev server and the build.
// Each page in src/pages/ is wrapped in src/layout.html; {{art:name}} inserts a line diagram.
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {art} from './art.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://tisha-portfolio-five.vercel.app';

export const pages = [
  {slug: '', file: 'home', nav: 'Home', title: 'Aspiring physician, researcher and builder — Tisha Sehrawat',
    description: 'Tisha Sehrawat is an IB Diploma student at 10X International School, Bengaluru, working across cancer research, neuroscience, clinical shadowing and healthcare innovation.'},
  {slug: 'about', file: 'about', nav: 'About', title: 'About — Tisha Sehrawat',
    description: 'About Tisha Sehrawat: an aspiring physician-scientist in Bengaluru, her interests, skills and life outside the lab.'},
  {slug: 'education', file: 'education', nav: 'Education', title: 'Education — Tisha Sehrawat',
    description: 'IB Diploma at 10X International School, academic programmes at Columbia, Harvard Student Agencies and ICREST, and university-level courses.'},
  {slug: 'research', file: 'research', nav: 'Research', title: 'Research — Tisha Sehrawat',
    description: 'Machine-learning cancer classification from 5hmC signatures, a published national review of prion disease in India, and a global-health research proposal.'},
  {slug: 'clinical', file: 'clinical', nav: 'Clinical', title: 'Clinical experience — Tisha Sehrawat',
    description: 'Clinical shadowing at Narayana Health and Fortis Hospital, and volunteering at the Aarogya Seva Kendra community clinic.'},
  {slug: 'projects', file: 'projects', nav: 'Projects', title: 'Projects & innovation — Tisha Sehrawat',
    description: 'Project CARE, VisionXcelerate, PlastiXcan, ChoiceX, BioBeats and CROASIS: healthcare and social-impact projects by Tisha Sehrawat.'},
  {slug: 'community', file: 'community', nav: 'Community', title: 'Community & leadership — Tisha Sehrawat',
    description: 'Shiksham, school leadership, science communication, TEDx speaking and debate.'},
  {slug: 'awards', file: 'awards', nav: 'Awards', title: 'Awards & honours — Tisha Sehrawat',
    description: 'Awards and honours across science, research, innovation, writing and speaking.'},
  {slug: 'contact', file: 'contact', nav: null, title: 'Contact — Tisha Sehrawat',
    description: 'Get in touch with Tisha Sehrawat about research, healthcare, education or collaboration.'},
];

const href = page => '/' + page.slug;

function navLinks(current, className) {
  return pages.filter(page => page.nav).map(page => {
    const active = page === current;
    return '<a class="' + className + (active ? ' active' : '') + '" href="' + href(page) + '"' + (active ? ' aria-current="page"' : '') + '>' + page.nav + '</a>';
  }).join('');
}

export function findPage(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '').replace(/^index$/, '');
  return pages.find(page => page.slug === slug) || null;
}

export async function renderPage(page) {
  const [layout, body] = await Promise.all([
    readFile(join(root, 'src/layout.html'), 'utf8'),
    readFile(join(root, 'src/pages', page.file + '.html'), 'utf8'),
  ]);
  const content = body.replace(/\{\{art:([a-z]+)\}\}/g, (match, name) => art(name));
  const values = {
    title: page.title,
    description: page.description,
    canonical: SITE + href(page),
    bodyClass: 'page-' + page.file,
    nav: navLinks(page, 'nav-link'),
    mobileNav: navLinks(page, 'mobile-link') + '<a class="mobile-link' + (page.slug === 'contact' ? ' active' : '') + '" href="/contact">Contact</a>',
    footerNav: pages.filter(item => item.slug).map(item => '<a href="' + href(item) + '">' + (item.nav || 'Contact') + '</a>').join(''),
    contactActive: page.slug === 'contact' ? ' aria-current="page"' : '',
    content,
  };
  return layout.replace(/\{\{(\w+)\}\}/g, (match, key) => key in values ? values[key] : match);
}
