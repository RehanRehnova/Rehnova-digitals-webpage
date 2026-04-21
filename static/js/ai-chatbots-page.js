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
  { num:'01', title:'Discovery & Data Audit', body:'We map your support workflows, identify high-volume query types, and audit your existing knowledge base and documentation. You receive a full chatbot strategy document before any development begins.', dels:['Support workflow map','Query volume analysis','Knowledge base audit','Channel strategy','Bot blueprint doc'], pNum:'02', pTitle:'Knowledge Base Setup', pBody:'All your content ingested, chunked, and embedded into a vector database for fast, accurate retrieval.' },
  { num:'02', title:'Knowledge Base Setup', body:'We ingest, chunk, and embed all your content into a vector database for accurate retrieval — PDFs, URLs, docs, support tickets, product data. You get an accuracy benchmark report before we move on.', dels:['Vector DB setup','Content ingestion pipeline','Embedding model config','Accuracy benchmark report','Retrieval test suite'], pNum:'03', pTitle:'Bot Design & Flows', pBody:'Conversation flows, tone of voice, escalation triggers, and fallback responses designed for every user journey.' },
  { num:'03', title:'Bot Personality & Flows', body:"We define the bot's tone, escalation rules, fallback responses, and design conversation flows for every key user journey. Every decision is reviewed and approved by you before we build.", dels:['Conversation flow diagrams','Tone of voice guide','Escalation rule config','Fallback response library','User journey coverage map'], pNum:'04', pTitle:'Integration & Deploy', pBody:'Channels, CRM, ticketing systems connected and the bot launched with full monitoring and alerts.' },
  { num:'04', title:'Integration & Deployment', body:'We connect to your chosen channels (web, WhatsApp, Slack) and CRM/ticketing systems, then deploy with full monitoring, Slack alerts on failures, and a live admin dashboard you control.', dels:['Channel integrations live','CRM / ticketing sync','Admin dashboard','Monitoring + alerting','Post-launch support plan'], pNum:'01', pTitle:'Discovery & Audit', pBody:'Back to the start for your next bot expansion or knowledge base refresh.' },
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