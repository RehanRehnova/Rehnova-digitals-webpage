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
  { num:'01', title:'Integration Audit', body:'We audit every system involved — mapping all endpoints, data models, authentication methods, and rate limits. You receive a complete integration map before a single line of code is written, so there are no surprises mid-build.', dels:['System inventory map','Endpoint audit report','Data flow diagrams','Auth & security review','Integration timeline'], pNum:'02', pTitle:'API Design', pBody:'Full API contract spec, data schemas, error codes, and auth strategy — documented before build begins.' },
  { num:'02', title:'API Design & Contracts', body:'We write the full OpenAPI specification — every endpoint, request/response schema, error code, and auth flow — before writing any code. Both sides agree on the contract upfront, eliminating integration surprises.', dels:['OpenAPI / Swagger spec','Request & response schemas','Error code catalogue','Auth flow diagrams','Rate limit strategy'], pNum:'03', pTitle:'Build & Test', pBody:'Every integration built in sandbox first, with thorough error handling, retry logic, and E2E test coverage.' },
  { num:'03', title:'Build & Sandbox Testing', body:'Every integration is built and fully tested in a sandbox environment before touching production. We cover happy paths, error states, timeouts, retries, and webhook signature verification — nothing ships untested.', dels:['Sandbox integration suite','Error & edge case coverage','Retry & timeout logic','Webhook test harness','Load & rate-limit tests'], pNum:'04', pTitle:'Deploy & Monitor', pBody:'Phased production rollout with live monitoring, alerting, and a detailed runbook for your team.' },
  { num:'04', title:'Deploy & Monitor', body:'Phased production rollout starting with low-traffic endpoints. Real-time monitoring dashboard, Slack/email alerts on failures, and a full operations runbook so your team can manage the integrations confidently going forward.', dels:['Phased production rollout','Real-time monitoring dashboard','Failure alerting setup','Operations runbook','Post-launch support plan'], pNum:'01', pTitle:'Integration Audit', pBody:'Back to the start for your next integration, new API version, or platform expansion.' },
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