
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
  { num:'01', title:'Discovery & Requirements', body:'We spend the first week mapping user journeys, surfacing edge cases, and locking in technical constraints before a single line of code is written. You receive a full Product Requirements Document.', dels:['Product Requirements Doc','User journey maps','Technical feasibility report','Project timeline','Risk register'], pNum:'02', pTitle:'Architecture & Stack', pBody:'Database schema, API contracts, deployment architecture, and tech stack fully defined before development begins.' },
  { num:'02', title:'Architecture & Stack', body:'We design the complete system — database schema, API contracts, component hierarchy, and deployment topology. Every decision is documented with rationale so your future engineers understand each choice.', dels:['System architecture diagram','Database schema','API contract spec','Tech stack decision log','Dev environment setup'], pNum:'03', pTitle:'UI Design in Figma', pBody:'Every screen and state designed in high-fidelity Figma, approved by you before development begins.' },
  { num:'03', title:'UI Design in Figma', body:'Complete high-fidelity designs for every screen, state, and edge case — mobile and desktop. Approved by you in Figma before a single component is built, because changing a Figma file costs minutes, not days.', dels:['Full Figma design file','Component library','Mobile + desktop views','Interactive prototype','Design handoff specs'], pNum:'04', pTitle:'Development Sprints', pBody:'Two-week agile sprints with live staging demos, PR reviews, and 85%+ test coverage.' },
  { num:'04', title:'Agile Development Sprints', body:'Two-week sprints with a live staging demo at the end of every cycle. You see working software, not status updates. Every PR is reviewed, and we maintain 85%+ test coverage throughout.', dels:['Working staging environment','Sprint demo recordings','Code review reports','85%+ test coverage','Weekly updates'], pNum:'05', pTitle:'QA & Testing', pBody:'Automated unit, integration, E2E, cross-browser, and load testing before any production release.' },
  { num:'05', title:'QA & Testing', body:'Automated unit, integration, and E2E tests with Playwright and Jest. Manual cross-browser and device coverage. Load testing with k6. No feature ships to production without passing the full test matrix.', dels:['Unit + integration suite','E2E coverage report','Cross-browser test matrix','Load test results','Bug resolution log'], pNum:'06', pTitle:'Launch & Support', pBody:'Zero-downtime deployment, uptime monitoring, error tracking, and SLA post-launch support.' },
  { num:'06', title:'Launch & Ongoing Support', body:'Zero-downtime blue-green deployment with automated rollback. Uptime monitoring via Better Uptime. Error tracking with Sentry. Performance monitoring with DataDog. Support window starts on launch day.', dels:['Zero-downtime deployment','Uptime monitoring','Error tracking (Sentry)','Performance dashboards','SLA support plan'], pNum:'01', pTitle:'Discovery', pBody:'Back to the start for your next feature cycle or project phase.' },
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