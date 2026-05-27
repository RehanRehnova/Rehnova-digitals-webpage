
// NAVBAR SCROLL
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

    // MOBILE NAV
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobileNav');
    ham.addEventListener('click', () => {
      ham.classList.toggle('active'); mob.classList.toggle('open');
      document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.classList.remove('active'); mob.classList.remove('open'); document.body.style.overflow = '';
    }));

    // SCROLL REVEAL
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${(i % 4) * 0.07}s`;
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // FAQ
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      });
    });

    // TESTIMONIALS 3D CAROUSEL
    let currentIdx = 0, autoT;
    const track = document.getElementById('testiTrack');
    function rotateTo(idx) {
      currentIdx = idx;
      if (track) {
        track.style.cssText = `transform:rotateY(${-idx * 120}deg);transition:transform 0.8s cubic-bezier(0.4,0,0.2,1);animation:none;`;
      }
      document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    if (track) {
      autoT = setInterval(() => { currentIdx = (currentIdx + 1) % 3; rotateTo(currentIdx); }, 4000);
      track.addEventListener('mouseenter', () => clearInterval(autoT));
      track.addEventListener('mouseleave', () => { autoT = setInterval(() => { currentIdx = (currentIdx + 1) % 3; rotateTo(currentIdx); }, 4000); });
    }

    // HERO SVG INTERACTIVE - mouse parallax on circuit paths
    const heroSvg = document.querySelector('.hero-svg-bg');
    if (heroSvg) {
      document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const dx = (x - 0.5) * 12;
        const dy = (y - 0.5) * 8;
        heroSvg.style.transform = `translate(${dx}px,${dy}px)`;
        heroSvg.style.transition = 'transform 0.8s ease-out';
      });
      document.querySelector('.hero').addEventListener('mouseleave', () => {
        heroSvg.style.transform = 'translate(0,0)';
        heroSvg.style.transition = 'transform 1.2s ease-out';
      });
    }

    // COUNTER ANIMATION
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const match = el.textContent.match(/[\d.]+/);
          if (match) {
            const target = parseFloat(match[0]);
            const isFloat = target % 1 !== 0;
            const suffix = el.innerHTML.replace(/[\d.]+/, '');
            let start = performance.now();
            const dur = 1800;
            const update = now => {
              const p = Math.min((now - start) / dur, 1);
              const ease = 1 - Math.pow(1 - p, 3);
              const val = isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target);
              el.innerHTML = val + suffix;
              if (p < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
          }
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-n,.sc-value,.qb-num').forEach(el => counterObs.observe(el));
    
// word fading display Animation 

    (function () {

  /* ── your words here ── */
  var WORDS = ['Scale ', 'Automate', 'Optimize'];

  /* ── timing ── */
  var IN_STAGGER  = 0.048; /* seconds between chars entering */
  var OUT_STAGGER = 0.030; /* seconds between chars leaving  */
  var HOLD        = 2400;  /* ms to show each word           */
  var ROT         = 6;     /* max char tilt on enter (deg)   */

  var el      = document.getElementById('ws-word');
  var dotsEl  = document.getElementById('ws-dots');
  var current = 0;
  var busy    = false;

  /* build dots */
  

  /* measure text width without rendering visibly */
  function measureWidth(text) {
    var s = window.getComputedStyle(el);
    var probe = document.createElement('span');
    probe.style.cssText =
      'position:absolute;visibility:hidden;white-space:nowrap;' +
      'font-family:' + s.fontFamily + ';' +
      'font-size:'   + s.fontSize   + ';' +
      'font-style:italic;' +
      'letter-spacing:' + s.letterSpacing;
    probe.textContent = text;
    document.body.appendChild(probe);
    var w = probe.offsetWidth;
    document.body.removeChild(probe);
    return w;
  }

  function buildChars(word) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < word.length; i++) {
      var span = document.createElement('span');
      span.className = 'wc';
      span.textContent = word[i] === ' ' ? '\u00a0' : word[i];
      if (word[i] === ' ') span.style.width = '0.26em';
      span.style.setProperty('--r',  ((Math.random() * 2 - 1) * ROT).toFixed(2) + 'deg');
      span.style.setProperty('--r2', ((Math.random() * 2 - 1) * (ROT * .6)).toFixed(2) + 'deg');
      frag.appendChild(span);
    }
    return frag;
  }

  function animOut(chars, cb) {
    if (!chars.length) { cb(); return; }
    chars.forEach(function (ch, i) {
      setTimeout(function () {
        ch.classList.remove('in');
        ch.classList.add('out');
      }, (chars.length - 1 - i) * OUT_STAGGER * 1000);
    });
    setTimeout(cb, (chars.length * OUT_STAGGER + 0.35) * 1000);
  }

  function animIn(chars) {
    chars.forEach(function (ch, i) {
      setTimeout(function () { ch.classList.add('in'); }, i * IN_STAGGER * 1000);
    });
  }

  function swapTo(idx) {
    if (busy) return;
    busy = true;

    var oldChars = Array.from(el.querySelectorAll('.wc'));

    animOut(oldChars, function () {
      el.innerHTML = '';

      /* update dot */
      var dots = dotsEl.querySelectorAll('.ws-dot');
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });

      /* resize container */
      el.style.minWidth = measureWidth(WORDS[idx]) + 'px';

      /* inject + animate in */
      el.appendChild(buildChars(WORDS[idx]));
      var newChars = Array.from(el.querySelectorAll('.wc'));
      animIn(newChars);

      setTimeout(function () { busy = false; },
        (newChars.length * IN_STAGGER + 0.65) * 1000);
    });
  }

  /* init first word */
  busy = true;
  el.style.minWidth = measureWidth(WORDS[0]) + 'px';
  el.appendChild(buildChars(WORDS[0]));
  setTimeout(function () {
    animIn(Array.from(el.querySelectorAll('.wc')));
    setTimeout(function () { busy = false; startCycle(); },
      (WORDS[0].length * IN_STAGGER + 0.65) * 1000);
  }, 100);

  function startCycle() {
    setInterval(function () {
      if (busy) return;
      current = (current + 1) % WORDS.length;
      swapTo(current);
    }, HOLD);
  }

})();



(function () {
  var form    = document.getElementById('cm-form');
  var success = document.getElementById('cm-success');
  var submit  = document.getElementById('cm-submit');
  var spinner = document.getElementById('cm-spinner');
  var arrow   = document.getElementById('cm-arrow');
  var label   = submit ? submit.querySelector('.cm-submit-label') : null;
  var back    = document.getElementById('cm-back');
  var textarea= document.getElementById('cm-message');
  var charEl  = document.getElementById('cm-chars');
  if (!form) return;
 
  /* ── CHAR COUNTER ── */
  if (textarea && charEl) {
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      var max = parseInt(textarea.getAttribute('maxlength')) || 600;
      charEl.textContent = len + ' / ' + max;
      charEl.classList.toggle('warn', len > max * 0.85);
    });
  }
 
  /* ── CLEAR ERROR ON INPUT ── */
  form.querySelectorAll('.cm-input, .cm-select, .cm-textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('error');
      var errId = 'cm-err-' + el.id.replace('cm-', '');
      var err = document.getElementById(errId);
      if (err) err.classList.remove('show');
    });
  });
 
  /* ── RIPPLE ON BUTTON ── */
  submit.addEventListener('click', function (e) {
    var r = document.createElement('span');
    r.className = 'cm-ripple';
    var rect = submit.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    submit.appendChild(r);
    setTimeout(function () { r.remove(); }, 700);
  });
 
  /* ── VALIDATE ── */
  function validate() {
    var ok = true;
 
    function check(id, test, errId) {
      var el  = document.getElementById(id);
      var err = document.getElementById(errId);
      if (!el) return;
      var fail = !test(el.value.trim());
      el.classList.toggle('error', fail);
      if (err) err.classList.toggle('show', fail);
      if (fail) ok = false;
    }
 
    check('cm-fname',   function (v) { return v.length > 0; },          'cm-err-fname');
    check('cm-lname',   function (v) { return v.length > 0; },          'cm-err-lname');
    check('cm-email',   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'cm-err-email');
    check('cm-message', function (v) { return v.length >= 10; },        'cm-err-message');
 
    return ok;
  }
 
  /* ── SUBMIT ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
 
    /* Loading state */
    submit.disabled = true;
    if (label)   label.textContent = 'Sending…';
    if (arrow)   arrow.style.display = 'none';
    if (spinner) spinner.style.display = 'block';
 
    /* Simulate send (replace with your fetch/AJAX) */
    setTimeout(function () {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'flex';
        /* animate icon */
        var icon = success.querySelector('.cm-success-icon');
        if (icon) { icon.style.animation = 'none'; void icon.offsetWidth; icon.style.animation = ''; }
      }
      /* reset button */
      submit.disabled = false;
      if (label)   label.textContent = 'Send message';
      if (arrow)   arrow.style.display = '';
      if (spinner) spinner.style.display = 'none';
    }, 1600);
  });
 
  /* ── BACK BUTTON ── */
  if (back) {
    back.addEventListener('click', function () {
      if (success) success.style.display = 'none';
      form.style.display = '';
      form.reset();
      if (charEl) charEl.textContent = '0 / 600';
      form.querySelectorAll('.cm-input,.cm-select,.cm-textarea').forEach(function (el) {
        el.classList.remove('error');
      });
      form.querySelectorAll('.cm-error-msg').forEach(function (el) {
        el.classList.remove('show');
      });
    });
  }
 
})();
  
// bookig modal 
window.BookingModal = (function(){
  'use strict';
  var LEAD_ENDPOINT = '/submit';

  var overlay   = document.getElementById('bm-overlay');
  var modal     = document.getElementById('bm-modal');
  var closeBtn  = document.getElementById('bm-close');
  var nextBtn   = document.getElementById('bm-btn-nx');
  var backBtn   = document.getElementById('bm-btn-bk');
  var foot      = document.getElementById('bm-foot');
  var spinner   = document.getElementById('bm-spinner');
  var btnLbl    = document.getElementById('bm-btn-lbl');
  var btnArr    = document.getElementById('bm-btn-arr');
  var pfill     = document.getElementById('bm-pfill');

  var TOTAL     = 4;
  var cur       = 1;
  var calDate   = new Date(); calDate.setDate(1);
  var S         = { svcs:[], budget:'', date:null, time:null };

  /* ── OPEN / CLOSE ── */
  function open(){
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    /* reset to step 1 each time */
    cur=1; S={svcs:[],budget:'',date:null,time:null};
    prog(); show(1,false);
    /* reset form */
    ['bm-fn','bm-ln','bm-em','bm-ph','bm-co','bm-rl','bm-hw','bm-br'].forEach(function(id){
      var el=document.getElementById(id); if(el) el.value='';
    });
    document.querySelectorAll('.bm-svc.sel').forEach(function(c){c.classList.remove('sel');});
    document.querySelectorAll('.bm-bud.sel').forEach(function(b){b.classList.remove('sel');});
    document.getElementById('bm-consent').classList.remove('checked');
    nextBtn.disabled=false;
    btnLbl.textContent='Next step'; btnArr.style.display=''; spinner.style.display='none';
  }

  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow='';
  }

  /* click outside */
  overlay.addEventListener('click',function(e){ if(e.target===overlay) close(); });
  /* escape key */
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && overlay.classList.contains('open')) close(); });
  closeBtn.addEventListener('click', close);

  /* ── PROGRESS ── */
  function prog(){
    pfill.style.width=((cur/TOTAL)*100)+'%';
    document.querySelectorAll('.bm-spill').forEach(function(p){
      var n=parseInt(p.getAttribute('data-s'));
      p.classList.remove('active','done');
      if(n<cur)  p.classList.add('done');
      if(n===cur) p.classList.add('active');
      var sn=p.querySelector('.bm-sn');
      if(sn) sn.innerHTML = n<cur
        ? '<svg viewBox="0 0 10 10" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 5l2.5 2.5 5-5"/></svg>'
        : n;
    });
    /* scroll active step pill into view */
    var active=document.querySelector('.bm-spill.active');
    if(active) active.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
  }

  /* ── SHOW STEP ── */
  function show(n, goBack){
    document.querySelectorAll('.bm-step').forEach(function(s){ s.classList.remove('active','back'); });
    var el=document.getElementById('bm-s'+n); if(!el) return;
    el.classList.add('active'); if(goBack) el.classList.add('back');
    backBtn.style.visibility = n===1?'hidden':'visible';
    foot.style.display = n===5?'none':'';
    btnLbl.textContent = n===4?'Confirm booking':'Next step';
    btnArr.style.display=''; spinner.style.display='none';
    /* scroll body to top */
    var body=document.querySelector('.bm-body');
    if(body) body.scrollTo({top:0,behavior:'smooth'});
    if(n===3) buildCal();
    if(n===4) buildReview();
  }

  /* ── VALIDATE STEP 1 ── */
  function v1(){
    var ok=true;
    function chk(id,test,eid){
      var el=document.getElementById(id), er=document.getElementById(eid);
      var fail=!test((el.value||'').trim());
      el.classList.toggle('err',fail);
      if(er) er.classList.toggle('show',fail);
      if(fail) ok=false;
    }
    chk('bm-fn',function(v){return v.length>0;},'bm-e-fn');
    chk('bm-ln',function(v){return v.length>0;},'bm-e-ln');
    chk('bm-em',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);},'bm-e-em');
    chk('bm-co',function(v){return v.length>0;},'bm-e-co');
    if(!ok){
      var first=modal.querySelector('.bm-input.err');
      if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
    }
    return ok;
  }

  /* clear errors on type */
  document.querySelectorAll('.bm-input,.bm-sel,.bm-ta').forEach(function(el){
    el.addEventListener('input',function(){
      el.classList.remove('err');
      var map={'bm-fn':'bm-e-fn','bm-ln':'bm-e-ln','bm-em':'bm-e-em','bm-co':'bm-e-co'};
      var er=document.getElementById(map[el.id]); if(er) er.classList.remove('show');
    });
  });

  /* ── SERVICES ── */
  document.querySelectorAll('.bm-svc').forEach(function(c){
    c.addEventListener('click',function(){
      c.classList.toggle('sel');
      var v=c.getAttribute('data-v'), i=S.svcs.indexOf(v);
      if(i>-1) S.svcs.splice(i,1); else S.svcs.push(v);
    });
  });

  /* ── BUDGET ── */
  const bmSlider = document.getElementById('bm-budget-slider');
const bmBudgetNum = document.getElementById('bm-budget-num');
const bmBudgetSymbol = document.getElementById('bm-budget-symbol');
const bmFill = document.getElementById('bm-budget-fill');
const bmTicks = document.querySelectorAll('.bm-budget-ticks span');
const bmCurrencySelect = document.getElementById('bm-currency-select');

function bmFormatNumber(val) {
  const num = parseInt(val);
  if (num >= 100000) return '100,000+';
  return num.toLocaleString();
}

function bmUpdateBudget() {
  const value = parseInt(bmSlider.value);
  const currencyOption = bmCurrencySelect.options[bmCurrencySelect.selectedIndex];
  const symbol = currencyOption.getAttribute('data-symbol');
  const currencyCode = currencyOption.value;
  
  bmBudgetNum.textContent = bmFormatNumber(value);
  bmBudgetSymbol.textContent = symbol;
  
  // Update fill bar
  const percent = (value / bmSlider.max) * 100;
  bmFill.style.width = percent + '%';
  
  // Save to state - value is currency-agnostic
  S.budget = {
    amount: value,
    currency: currencyCode
  };
}

// Slider drag
bmSlider.addEventListener('input', bmUpdateBudget);

// Currency change - just swaps the symbol
bmCurrencySelect.addEventListener('change', bmUpdateBudget);

// Click ticks to jump
bmTicks.forEach(function(tick) {
  tick.addEventListener('click', function() {
    const val = this.getAttribute('data-v');
    bmSlider.value = val;
    bmUpdateBudget();
  });
});

// Init
bmUpdateBudget();

  /* ── CONSENT ── */
  document.getElementById('bm-consent').addEventListener('click',function(){ this.classList.toggle('checked'); });

  /* ── CALENDAR ── */
  

  /* ── REVIEW ── */
  var ICONS={
    person:'<path d="M8 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"/>',
    mail:  '<rect x="1" y="3" width="14" height="10" rx="2"/><path d="M1 5l7 5 7-5"/>',
    bld:   '<rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M5.5 4V2.5h5V4"/>',
    tag:   '<path d="M9 1.5l5 5a2 2 0 0 1 0 2.83l-4 4a2 2 0 0 1-2.83 0l-5-5V1.5h7z"/><circle cx="4.5" cy="5" r="1"/>',
    wallet:'<rect x="1.5" y="3.5" width="13" height="9" rx="2"/><path d="M11 8h2"/>',
    clock: '<circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5l2 1.5"/>',
  };
  function rRow(ico,lbl,val){
    return '<div class="bm-rr"><div class="bm-ri"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ICONS[ico]+'</svg></div><div><div class="bm-rl">'+lbl+'</div><div class="bm-rv">'+val+'</div></div></div>';
  }
  function buildReview(){
    var c=document.getElementById('bm-review'); if(!c) return;
    var fn=(document.getElementById('bm-fn').value||'').trim();
    var ln=(document.getElementById('bm-ln').value||'').trim();
    c.innerHTML=
      rRow('person','Name',fn+' '+ln)+
      rRow('mail','Email',(document.getElementById('bm-em').value||'').trim())+
      rRow('bld','Company',(document.getElementById('bm-co').value||'').trim())+
      rRow('tag','Services',S.svcs.length?S.svcs.join(', '):'Not specified')+
      rRow('wallet','Budget',S.budget||'Not specified')+
      rRow('clock','Scheduled',S.date&&S.time?S.date+' at '+S.time:'Not selected');
  }

  /* ── TOAST ── */
  function toast(msg, duration){
    var t=document.createElement('div'); t.className='bm-toast'; t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(function(){t.remove();},350); }, duration||2400);
  }

  /* ═══════════════════════════════════════════
     SUBMIT TO API
  ═══════════════════════════════════════════ */
  function submitLead() {
  var payload = {
    firstName:   (document.getElementById('bm-fn').value  || '').trim(),
    lastName:    (document.getElementById('bm-ln').value  || '').trim(),
    email:       (document.getElementById('bm-em').value  || '').trim(),
    phone:       (document.getElementById('bm-ph').value  || '').trim(),
    company:     (document.getElementById('bm-co').value  || '').trim(),
    role:        (document.getElementById('bm-rl').value  || ''),
    howFound:    (document.getElementById('bm-hw').value  || ''),
    services:    S.svcs.slice(),
    budget:      S.budget,
    brief:       (document.getElementById('bm-br').value  || '').trim(),
    submittedAt: new Date().toISOString(),
    type:        'Project Form',
  };

  // loading state
  nextBtn.disabled       = true;
  btnLbl.textContent     = 'Booking…';
  btnArr.style.display   = 'none';
  spinner.style.display  = 'block';

  fetch(LEAD_ENDPOINT, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  .then(function (res) {
    if (!res.ok) throw new Error('Server returned ' + res.status);
    return res.json();
  })
  .then(function (data) {
    // success — advance to confirmation step
    cur = 5;
    prog();
    show(5, false);
  })
  .catch(function (err) {
    console.error('BookingModal API error:', err);
    nextBtn.disabled      = false;
    btnLbl.textContent    = 'Try again';
    btnArr.style.display  = '';
    spinner.style.display = 'none';
    toast('Something went wrong — please try again.', 3000);
  });
}

  /* ── NEXT BUTTON ── */
  nextBtn.addEventListener('click',function(e){
    /* ripple */
    var rect=nextBtn.getBoundingClientRect(), sz=Math.max(rect.width,rect.height);
    var r=document.createElement('span'); r.className='bm-rpl';
    r.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-rect.left-sz/2)+'px;top:'+(e.clientY-rect.top-sz/2)+'px';
    nextBtn.appendChild(r); setTimeout(function(){r.remove();},600);

    if(cur===1 && !v1()) return;

    if(cur===4){
      /* fire API */
      submitLead();
      return;
    }

    cur++; prog(); show(cur,false);
  });

  /* ── BACK BUTTON ── */
  backBtn.addEventListener('click',function(){
    if(cur<=1) return; cur--; prog(); show(cur,true);
  });

  /* ── PUBLIC API ── */
  return { open: open, close: close };

})();

document.getElementById("bookBtn").addEventListener("click", () => {
   BookingModal.open();
});

document.getElementById("bookBtn2").addEventListener("click", () => {
   BookingModal.open();
});

document.getElementById("close-book-model").addEventListener("click", () => {
   BookingModal.close();
});


/* ═══════════════════════════════════════════════
   CONTACT FORM — Submit + Success State
═══════════════════════════════════════════════ */

(function () {

  var ENDPOINT = '/submit';

  var form     = document.getElementById('cm-form');
  var submit   = document.getElementById('cm-submit');
  var spinner  = document.getElementById('cm-spinner');
  var arrow    = document.getElementById('cm-arrow');
  var label    = document.querySelector('.cm-submit-label');
  var success  = document.getElementById('cm-success');
  var textarea = document.getElementById('cm-message');
  var charEl   = document.getElementById('cm-chars');

  if (textarea && charEl) {
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      charEl.textContent = len + ' / 600';
      charEl.classList.toggle('warn', len > 510);
    });
  }

  document.querySelectorAll('.cm-input, .cm-select, .cm-textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('error');
      var errId = 'cm-err-' + el.id.replace('cm-', '');
      var err = document.getElementById(errId);
      if (err) err.classList.remove('show');
    });
  });

  /* ── VALIDATE ── */
  function validate() {
    var ok = true;

    function chk(id, test, errId) {
      var el  = document.getElementById(id);
      var err = document.getElementById(errId);
      if (!el) return;
      var fail = !test((el.value || '').trim());
      el.classList.toggle('error', fail);
      if (err) err.classList.toggle('show', fail);
      if (fail) ok = false;
    }

    chk('cm-fname',   function (v) { return v.length > 0; },                              'cm-err-fname');
    chk('cm-lname',   function (v) { return v.length > 0; },                              'cm-err-lname');
    chk('cm-email',   function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },     'cm-err-email');
    chk('cm-message', function (v) { return v.length >= 10; },                            'cm-err-message');

    return ok;
  }

  /* ── LOADING STATE ── */
  function setLoading(on) {
    if (submit)  submit.disabled       = on;
    if (label)   label.textContent     = on ? 'Sending…' : 'Send message';
    if (arrow)   arrow.style.display   = on ? 'none' : '';
    if (spinner) spinner.style.display = on ? 'block' : 'none';
  }

  /* ── SHOW SUCCESS ── */
  function showSuccess() {
    /* hide form */
    if (form) form.style.display = 'none';

    /* create success block if it doesn't exist */
    var existing = document.getElementById('cm-success');
    if (existing) { existing.style.display = 'flex'; return; }

    var box = document.createElement('div');
    box.id = 'cm-success';
    box.style.cssText =
      'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'text-align:center;padding:40px 20px;gap:14px;animation:cm-fadein .5s ease;';

    box.innerHTML =
      '<div style="width:64px;height:64px;border-radius:50%;background:#f0fdf4;border:2px solid #86efac;' +
        'display:flex;align-items:center;justify-content:center;animation:cm-pop .5s cubic-bezier(.34,1.56,.64,1)">' +
        '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#22c55e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 14l6 6L23 8"/>' +
        '</svg>' +
      '</div>' +
      '<div style="font-size:20px;font-weight:700;color:#0d1b2e;letter-spacing:-.02em">Message sent!</div>' +
      '<p style="font-size:14px;color:#64748b;line-height:1.65;max-width:280px">' +
        'We\'ve received your message and will get back to you within 24 hours.' +
      '</p>' +
      '<button onclick="document.getElementById(\'cm-success\').remove();document.getElementById(\'cm-form\').style.display=\'\'" ' +
        'style="font-size:13px;font-weight:500;color:#0284c7;background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;padding:0">' +
        'Send another message' +
      '</button>';

    /* inject keyframes once */
    if (!document.getElementById('cm-anim-style')) {
      var s = document.createElement('style');
      s.id = 'cm-anim-style';
      s.textContent =
        '@keyframes cm-fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
        '@keyframes cm-pop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}';
      document.head.appendChild(s);
    }

    form.parentNode.insertBefore(box, form.nextSibling);
  }

  /* ── SUBMIT ── */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      /* ── BUILD PAYLOAD ── */
      var payload = {
        firstName:   (document.getElementById('cm-fname')   ? document.getElementById('cm-fname').value.trim()   : ''),
        lastName:    (document.getElementById('cm-lname')   ? document.getElementById('cm-lname').value.trim()   : ''),
        email:       (document.getElementById('cm-email')   ? document.getElementById('cm-email').value.trim()   : ''),
        subject:       (document.getElementById('cm-subject')   ? document.getElementById('cm-subject').value.trim()   : ''),
        message:     (document.getElementById('cm-message') ? document.getElementById('cm-message').value.trim() : ''),
        submittedAt: new Date().toISOString(),
        type: "Form Message"
      };

      setLoading(true);

      /* ── FETCH ── */
      fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Server error ' + res.status);
        
       else{
         setLoading(false);
        showSuccess();
       }
       return res.json()
        
      })
      
      .catch(function (err) {
        console.error('Contact form error:', err);
        setLoading(false);
        /* show inline error under button */
        var existing = document.getElementById('cm-submit-err');
        if (!existing) {
          var errEl = document.createElement('p');
          errEl.id = 'cm-submit-err';
          errEl.style.cssText = 'font-size:12px;color:#ef4444;text-align:center;margin-top:8px;';
          errEl.textContent = 'Something went wrong — please try again.';
          submit.parentNode.insertBefore(errEl, submit.nextSibling);
          setTimeout(function () { errEl.remove(); }, 4000);
        }
      });
    });
  }

})();