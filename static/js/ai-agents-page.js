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
  { num:'01', title:'Use-Case Mapping', body:'We map the exact workflow the agent will automate, identify every decision point, define success criteria, and design the agent architecture before any code is written. You receive a full agent design document.', dels:['Workflow diagram','Decision point map','Agent architecture doc','Success metrics','Risk & safety plan'], pNum:'02', pTitle:'Tool & API Setup', pBody:'Every external system the agent needs is connected and tested — APIs, databases, browsers, and communication channels.' },
  { num:'02', title:'Tool & API Setup', body:'We integrate every external system the agent needs — REST APIs, databases, web browsers, email, Slack, and custom tools. Each integration is sandboxed and tested before the agent is allowed to use it in production.', dels:['API integration map','Sandbox test suite','Auth + credential vault','Tool permission matrix','Integration health checks'], pNum:'03', pTitle:'Agent Engineering', pBody:'Agent logic, prompt chains, memory systems, and safety guardrails built and benchmarked in a controlled sandbox.' },
  { num:'03', title:'Agent Engineering', body:'We build the agent logic, prompt chains, memory systems, and safety guardrails in a controlled sandbox. You review every decision tree and approve escalation rules before the agent touches production data.', dels:['Agent logic codebase','Prompt chain library','Memory + state system','Safety guardrail config','Sandbox benchmark report'], pNum:'04', pTitle:'Deploy & Monitor', pBody:'Production deployment with full execution logging, alerting, and a live monitoring dashboard.' },
  { num:'04', title:'Deploy & Monitor', body:'We deploy to production with full execution logging, Slack/email alerting on failures, and a monitoring dashboard showing every agent run, tool call, decision, and outcome in real time.', dels:['Production deployment','Execution trace dashboard','Slack + email alerting','Weekly performance summary','SLA support plan'], pNum:'01', pTitle:'Use-Case Mapping', pBody:'Back to the start for your next agent workflow or capability expansion.' },
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