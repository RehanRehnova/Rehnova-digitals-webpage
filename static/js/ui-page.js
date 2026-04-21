/* ── Nav scroll */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));
window.addEventListener('scroll', () => {
    // 1. Select all elements you want to change
    const elementsToToggle = document.querySelectorAll('.hamburger ,.nav-brand, .nav-brand span,.nav-links a, .header, .sidebar');
    
    // 2. Iterate through them
    elementsToToggle.forEach(el => {
        el.classList.toggle('scrolled', scrollY > 40);
    });
});
/* ── Hamburger */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileNav');
ham.addEventListener('click', () => {
  ham.classList.toggle('active');
  mob.classList.toggle('open');
  document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('active'); mob.classList.remove('open'); document.body.style.overflow = '';
}));

/* ── Scroll reveal */
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const existing = e.target.style.transitionDelay;
      if (!existing) e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => io.observe(el));

/* ── Process step switcher */
const steps = [
  { num:'01', title:'Discovery & Research', body:'We begin every project with stakeholder interviews, competitor analysis, heuristic audits, and user research. You receive a full Research Report with actionable findings before any design work begins.', dels:['User interview findings','Competitor audit report','Heuristic evaluation','Persona definitions','Design brief'], pNum:'02', pTitle:'Information Architecture', pBody:'User flows, sitemaps, and low-fidelity wireframes that establish the full structure before any visual design begins.' },
  { num:'02', title:'Information Architecture', body:'We map every user flow, create a full sitemap, and produce annotated low-fidelity wireframes for every key screen. You review and approve the full IA before we move into visual design — changing structure at the wireframe stage costs hours, not days.', dels:['User flow diagrams','Full sitemap','Low-fidelity wireframes','Navigation structure','Content hierarchy map'], pNum:'03', pTitle:'Visual Design', pBody:'High-fidelity UI, brand colour system, typography, and component library built in Figma.' },
  { num:'03', title:'Visual Design', body:'High-fidelity Figma designs for every screen and state — mobile, tablet, and desktop. Brand colour system, typography scale, spacing tokens, and a full component library. You approve every screen before we move to prototyping.', dels:['High-fidelity Figma file','Brand & colour system','Typography scale','Component library','Design tokens'], pNum:'04', pTitle:'Prototyping & Testing', pBody:'Clickable animated prototype validated with real users before any development begins.' },
  { num:'04', title:'Prototyping & Testing', body:'An animated, clickable prototype that feels like the real product. We run moderated usability sessions with real users, document findings, and iterate on the design until usability metrics meet agreed benchmarks.', dels:['Clickable Figma prototype','Usability test report','Iteration recommendations','Accessibility audit','A/B test plan'], pNum:'05', pTitle:'Handoff & Support', pBody:'Developer-ready specs, asset exports, and a design system documentation site for your engineering team.' },
  { num:'05', title:'Handoff & Support', body:"Developer-ready Figma specs with auto-layout, spacing annotations, and asset exports. We provide a design system documentation site, run a handoff session with your engineering team, and remain available for design QA throughout development.", dels:['Figma dev mode handoff','Asset & icon exports','Design system docs site','Handoff session recording','Design QA support'], pNum:'01', pTitle:'Discovery & Research', pBody:'Back to the start for your next product feature, redesign, or brand refresh.' },
];
document.querySelectorAll('.step-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const d = steps[i];
    document.getElementById('paneNum').textContent = d.num;
    document.getElementById('paneTitle').textContent = d.title;
    document.getElementById('paneBody').textContent = d.body;
    document.getElementById('paneDels').innerHTML = d.dels.map(t => `<span class="del-tag">${t}</span>`).join('');
    document.getElementById('previewNum').textContent = d.pNum;
    document.getElementById('previewTitle').textContent = d.pTitle;
    document.getElementById('previewBody').textContent = d.pBody;
  });
});

/* ── FAQ */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item'), isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Counter animation */
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.getAttribute('data-count');
    if (!raw) return;
    const target = parseInt(raw);
    const sup = el.querySelector('sup') ? el.querySelector('sup').outerHTML : '';
    const dur = 1400, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.floor(ease * target) + sup;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));