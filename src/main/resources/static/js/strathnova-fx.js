
(function(){
'use strict';
var root = document.documentElement,
    mq   = window.matchMedia,
    reduce = mq && mq('(prefers-reduced-motion:reduce)').matches,
    fine   = mq && mq('(hover:hover) and (pointer:fine)').matches;

/* The rAF loop further down runs its first pass synchronously, before the
   sections that own this state are reached. Anything the loop touches is
   therefore declared and initialised here, not at its point of use. */
var pending  = [];   /* reveal queue      — see §3  */
var navSecs  = [];   /* section navigator — see §14 */
var navBtns  = [];
var navTops  = [];
var navActive = -1;

function mk(tag, cls, html){var d=document.createElement(tag);if(cls)d.className=cls;if(html!=null)d.innerHTML=html;return d;}
function ls(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v);}catch(e){return null;}}
function each(sel,fn,ctx){[].slice.call((ctx||document).querySelectorAll(sel)).forEach(fn);}

/* ══ TOASTS ═══════════════════════════════════════════════════════════════ */
var toastHost = mk('div','sn-toasts'); document.body.appendChild(toastHost);
function toast(msg, ms){
  var t = mk('div','sn-toast','<s></s><span>'+msg+'</span>');
  toastHost.appendChild(t);
  setTimeout(function(){
    t.style.transition='opacity .35s,transform .35s';
    t.style.opacity='0'; t.style.transform='translateY(10px)';
    setTimeout(function(){t.remove();},380);
  }, ms||2200);
}

/* ══ 1 · CUSTOM POINTER ═══════════════════════════════════════════════════ */
/* Ordered: first selector that matches wins. '' = hot but unlabelled.       */
var CURSOR_MAP = [
  ['input,textarea,select', '__text'],
  ['.opt,.door', 'Pick'],
  ['.prow,.chip,.pcard', 'Pick'],
  ['.rcard,a.vcard', 'Read'],
  ['.acc>button,.foldbtn,.moreBtn', 'Open'],
  ['.mswap', 'Switch'],
  ['button[type="submit"]', 'Send'],
  ['.btn,.pbtn,button.pill,.explore,.bfb', 'Go'],
  ['a[href^="mailto"]', 'Mail'],
  ['a[target="_blank"]', 'Visit'],
  ['a,button,[role="button"],.toggle,.menu-btn,summary', '']
];

var cursorOn = false, dot, ring, ringLabel, trail = [];

function buildCursor(){
  dot  = mk('div','sn-dot','<i></i>');
  ring = mk('div','sn-ring','<i><b></b></i>');
  ringLabel = ring.querySelector('b');
  var tr = mk('div','sn-tr');
  document.body.appendChild(dot); document.body.appendChild(ring);
  for (var i=0;i<5;i++){
    var t = mk('div','sn-tr','<i></i>');
    t.style.opacity = String(0.3 - i*0.05);
    t.querySelector('i').style.transform = 'scale('+(1 - i*0.15)+')';
    document.body.appendChild(t);
    trail.push({el:t, x:0, y:0, ease:0.30 - i*0.045});
  }
}

var mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my, pressed=false;

function pointerState(target){
  if (!target || !target.closest) { root.classList.remove('sn-hot','sn-label','sn-text'); return; }
  for (var i=0;i<CURSOR_MAP.length;i++){
    var hit = target.closest(CURSOR_MAP[i][0]);
    if (!hit) continue;
    var label = CURSOR_MAP[i][1];
    if (label === '__text'){
      root.classList.add('sn-text'); root.classList.remove('sn-hot','sn-label');
    } else if (label){
      ringLabel.textContent = hit.getAttribute('data-cursor') || label;
      root.classList.add('sn-hot','sn-label'); root.classList.remove('sn-text');
    } else {
      root.classList.add('sn-hot'); root.classList.remove('sn-label','sn-text');
    }
    return;
  }
  root.classList.remove('sn-hot','sn-label','sn-text');
}

function enableCursor(on){
  cursorOn = on;
  root.classList.toggle('sn-cursor', on);
  var d = on ? '' : 'none';
  if (dot)  dot.style.display  = d;
  if (ring) ring.style.display = d;
  trail.forEach(function(t){ t.el.style.display = d; });
  if (!on) root.classList.remove('sn-hot','sn-label','sn-text');
  ls('sn_cursor', on ? '1' : '0');
}

if (fine && !reduce){
  buildCursor();
  enableCursor(ls('sn_cursor') !== '0');
  addEventListener('pointermove', function(e){
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    root.classList.remove('sn-away');
    pointerState(e.target);
  }, {passive:true});
  addEventListener('pointerdown', function(){ pressed=true; root.classList.add('sn-down'); }, {passive:true});
  addEventListener('pointerup',   function(){ pressed=false; root.classList.remove('sn-down'); }, {passive:true});
  document.addEventListener('mouseleave', function(){ root.classList.add('sn-away'); });
  document.addEventListener('mouseenter', function(){ root.classList.remove('sn-away'); });
}

/* ══ 2 · SCROLL PROGRESS + BACK TO TOP ════════════════════════════════════ */
var scrollBar = mk('div','sn-scroll'); document.body.appendChild(scrollBar);
var topBtn = mk('button','sn-top','&#8593;');
topBtn.type='button'; topBtn.setAttribute('aria-label','Back to top');
topBtn.onclick = function(){ scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); };
document.body.appendChild(topBtn);

/* ══ single rAF loop: cursor lerp + scroll bar ════════════════════════════ */
var lastScroll = -1, frame = 0;
(function loop(){
  /* sweep on a slow cadence while anything is still queued, so a page swap
     with no scroll change (hash routing) still resolves without a timeout */
  if ((++frame % 6) === 0 && pending.length) sweep();
  if (cursorOn){
    dot.style.transform = 'translate3d('+mx+'px,'+my+'px,0)';
    rx += (mx-rx)*0.19; ry += (my-ry)*0.19;
    ring.style.transform = 'translate3d('+rx+'px,'+ry+'px,0)';
    var px=mx, py=my;
    trail.forEach(function(t){
      t.x += (px-t.x)*t.ease; t.y += (py-t.y)*t.ease;
      t.el.style.transform = 'translate3d('+t.x+'px,'+t.y+'px,0)';
      px = t.x; py = t.y;
    });
  }
  var y = scrollY;
  if (y !== lastScroll){
    lastScroll = y;
    var h = document.body.scrollHeight - innerHeight;
    scrollBar.style.transform = 'scaleX('+(h>0 ? Math.min(y/h,1) : 0)+')';
    topBtn.classList.toggle('on', y > 620);
    sweep();
    spy();
    /* content moves under a stationary cursor, so re-test what is beneath it */
    if (cursorOn) pointerState(document.elementFromPoint(mx, my));
  }
  requestAnimationFrame(loop);
})();

/* ══ 3 · REVEAL ON SCROLL ═════════════════════════════════════════════════ */
var REVEAL = '#modeB .card,#modeB .val,#modeB .price,#modeB .advc,#modeB a.vcard,'+
             '#modeB .astep,#modeB .stat,#modeB .acc,#modeB .mrow,#modeB .vbuild li,'+
             '#modeB .expect,#modeB .fcol,#modeB .lawsec,#modeB .rrow';
/* A sweep, not an IntersectionObserver. An observer only fires while an
   element is intersecting, so anything jumped past — End key, scrollbar drag,
   a fast flick — would stay at opacity 0 forever. The sweep reveals everything
   at or above the fold, so content can never be stranded invisible.
   `pending` is declared at the top of this IIFE, not here — see the note there. */
function scanReveal(){
  if (reduce) return;
  each(REVEAL, function(el){
    if (el.classList.contains('sn-rv')) return;
    var p = el.parentNode;
    if (p.__snGroup === undefined) p.__snGroup = 0;
    el.dataset.snIdx = p.__snGroup++;
    el.classList.add('sn-rv');
    pending.push(el);
  });
  sweep();
}

function reveal(el){
  el.style.transitionDelay = Math.min((+el.dataset.snIdx || 0) * 60, 320) + 'ms';
  el.classList.add('sn-in');
  if (el.classList.contains('stat')) countUp(el);
}

function sweep(){
  if (!pending || !pending.length) return;
  var keep = [];
  for (var i=0;i<pending.length;i++){
    var el = pending[i], r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0){ keep.push(el); continue; }  /* mode is display:none */
    if (r.top < innerHeight - 30 || el.closest('.foldsec.open,.pcard2.open,.acc')) reveal(el);
    else keep.push(el);
  }
  pending = keep;
}
function flushReveal(){ sweep(); }
addEventListener('resize', function(){ sweep(); measureNav(); }, {passive:true});
/* expanding anything can uncover queued reveals */
document.addEventListener('click', function(e){
  if (!e.target.closest) return;
  if (e.target.closest('.foldbtn,.acc>button,.moreBtn')){
    setTimeout(flushReveal, 60);
    setTimeout(flushReveal, 520);
  }
});

/* ══ 4 · ANIMATED STAT COUNTERS ═══════════════════════════════════════════ */
function countUp(stat){
  var b = stat.querySelector('b'); if (!b || b.dataset.snDone) return;
  var raw = b.textContent.trim();
  var m = raw.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
  if (!m){ b.dataset.snDone='1'; return; }
  b.dataset.snDone = '1';
  var pre = m[1], target = parseInt(m[2].replace(/,/g,''), 10), post = m[3];
  if (reduce || target === 0) return;
  var start = performance.now(), dur = 1100;
  (function tick(now){
    var p = Math.min((now-start)/dur, 1);
    var eased = 1 - Math.pow(1-p, 3);
    b.textContent = pre + Math.round(target*eased).toLocaleString('en-US') + post;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

/* ══ 5 · SPOTLIGHT + MAGNETIC + TILT ══════════════════════════════════════ */
var SPOT = '#modeB .card,#modeB .price,#modeB .val,#modeB .advc,#modeB a.vcard,'+
           '#modeB .pcard,#modeA .fact,#modeA .opt,#modeA .door,#modeA .rcard';
function scanSpot(){
  each(SPOT, function(el){
    if (el.classList.contains('sn-spot')) return;
    el.classList.add('sn-spot');
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX-r.left)+'px');
      el.style.setProperty('--my', (e.clientY-r.top)+'px');
    }, {passive:true});
  });
}

var MAG = '#modeA .btn,#modeB .btn-gold';
function scanMagnetic(){
  if (!fine || reduce) return;
  each(MAG, function(el){
    if (el.dataset.snMag) return;
    el.dataset.snMag = '1';
    var base = '';
    el.addEventListener('pointerenter', function(){ base = getComputedStyle(el).transform; });
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width/2)) * 0.22;
      var dy = (e.clientY - (r.top + r.height/2)) * 0.32;
      el.style.transform = 'translate('+dx+'px,'+(dy-2)+'px)';
    }, {passive:true});
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });
}

/* ══ 6 · RIPPLE + PICK CONFIRMATION ═══════════════════════════════════════ */
function ripple(el, e){
  if (reduce) return;
  var r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 1.6;
  var d = mk('span','sn-rip');
  d.style.cssText += 'width:'+size+'px;height:'+size+'px;left:'+
    (e ? e.clientX-r.left : r.width/2)+'px;top:'+(e ? e.clientY-r.top : r.height/2)+'px';
  el.appendChild(d);
  setTimeout(function(){ d.remove(); }, 700);
}

/* Intercept choice clicks so the confirmation is actually seen before the
   original handler swaps the step. Re-fires the real click afterwards. */
var CHOICE = '#modeA .opt,#modeA .door,#modeA .rcard';
document.addEventListener('click', function(e){
  var el = e.target.closest ? e.target.closest(CHOICE) : null;
  if (!el || el.__snPass) return;
  if (reduce){ return; }                       /* no delay for reduced motion */
  e.preventDefault(); e.stopPropagation();
  ripple(el, e);
  var tick = mk('span','sn-tick','&#10003;');
  el.appendChild(tick);
  el.style.borderColor = 'var(--c, var(--gold))';
  setTimeout(function(){
    el.__snPass = true;
    el.click();
    el.__snPass = false;
    tick.remove();
    el.style.borderColor = '';
  }, 340);
}, true);

/* light ripple everywhere else, no delay */
document.addEventListener('pointerdown', function(e){
  var el = e.target.closest ? e.target.closest('.btn,.chip,.prow,.pbtn,button.pill,.mswap') : null;
  if (el) ripple(el, e);
}, {passive:true, capture:true});

/* ══ 7 · CONFETTI ═════════════════════════════════════════════════════════ */
function confetti(n){
  if (reduce) return;
  var cols = ['#E0B457','#C89A38','#6FB0B8','#A98BC9','#7FD1A6'];
  var cx = innerWidth/2, cy = innerHeight*0.34;
  for (var i=0;i<(n||46);i++){
    (function(){
      var p = mk('div','sn-conf');
      p.style.background = cols[i % cols.length];
      p.style.left = cx+'px'; p.style.top = cy+'px';
      document.body.appendChild(p);
      var ang = (Math.random()*Math.PI*2), vel = 120 + Math.random()*260;
      p.animate([
        {transform:'translate(0,0) rotate(0deg)', opacity:1},
        {transform:'translate('+Math.cos(ang)*vel+'px,'+
                   (Math.sin(ang)*vel + 320)+'px) rotate('+(Math.random()*720-360)+'deg)', opacity:0}
      ], {duration: 1200 + Math.random()*700, easing:'cubic-bezier(.15,.6,.4,1)'})
       .onfinish = function(){ p.remove(); };
    })();
  }
}

/* ══ 8 · MODE A · STEP AWARENESS ══════════════════════════════════════════ */
/* The original go() lives inside a closure, so we watch the DOM instead —
   this catches every path (doors, picks, restart) without patching it.      */
var stepHistory = [], curStep = 0, countEl, backEl, nudgeTimer;

(function setupModeA(){
  var right = document.querySelector('#modeA .topright');
  var stage = document.querySelector('#modeA .inner');
  if (!right || !stage) return;

  countEl = mk('span','sn-count');
  backEl  = mk('button','sn-back','&larr; Back');
  backEl.type = 'button';
  backEl.onclick = function(){
    if (stepHistory.length < 2 || !window.go) return;
    stepHistory.pop();
    var prev = stepHistory.pop();
    window.go(prev);
  };
  right.insertBefore(countEl, right.firstChild);
  right.appendChild(backEl);

  function onStep(n){
    if (n === curStep) return;
    curStep = n;
    if (n === 0) stepHistory = [0];
    else if (stepHistory[stepHistory.length-1] !== n) stepHistory.push(n);

    /* echo the rail as a number, so the progress bar can actually be read */
    var fill = document.getElementById('fill');
    countEl.textContent = fill ? (parseInt(fill.style.width, 10) || 0) + '%' : '';
    countEl.classList.toggle('on', n > 0);
    backEl.classList.toggle('on', stepHistory.length > 1 && n !== 8);

    /* staggered entry for the new step's contents */
    if (!reduce){
      var step = document.getElementById('s'+n);
      if (step){
        var kids = step.querySelectorAll('.opt,.door,.rcard,.fact,.costs>div,#urg .pill');
        [].slice.call(kids).forEach(function(k,i){
          k.style.animation = 'none'; void k.offsetWidth;
          k.style.animation = 'snRise .5s cubic-bezier(.2,.8,.3,1) both';
          k.style.animationDelay = (i*55)+'ms';
          k.addEventListener('animationend', function(){
            k.style.animation=''; k.style.animationDelay='';
          }, {once:true});
        });
      }
    }
    scanSpot(); scanMagnetic();
    if (n === 8){ confetti(); toast('Sent. A partner picks this up, not a queue.', 3400); }
    armNudge(n);
  }

  /* idle nudge — a quiet pulse if a choice screen sits untouched */
  function armNudge(n){
    clearTimeout(nudgeTimer);
    if (reduce || [1,2,4,7].indexOf(n) === -1) return;
    nudgeTimer = setTimeout(function(){
      var step = document.getElementById('s'+n); if (!step) return;
      [].slice.call(step.querySelectorAll('.opt,.rcard')).forEach(function(k,i){
        setTimeout(function(){
          k.classList.add('sn-nudge');
          setTimeout(function(){ k.classList.remove('sn-nudge'); }, 1200);
        }, i*90);
      });
    }, 17000);
  }
  ['pointerdown','keydown','wheel'].forEach(function(ev){
    document.addEventListener(ev, function(){ armNudge(curStep); }, {passive:true});
  });

  new MutationObserver(function(){
    var steps = document.querySelectorAll('#modeA .step');
    for (var i=0;i<steps.length;i++){
      if (steps[i].classList.contains('on')){ onStep(i); return; }
    }
  }).observe(stage, {subtree:true, attributes:true, attributeFilter:['class']});

  /* prime for whichever step is live right now */
  var live = document.querySelector('#modeA .step.on');
  if (live){ curStep = -1; onStep([].indexOf.call(live.parentNode.children, live)); }
})();

/* ══ 9 · HERO LETTER REVEAL ═══════════════════════════════════════════════ */
function splitHeading(h){
  if (!h || h.dataset.snSplit || reduce) return;
  h.dataset.snSplit = '1';
  var n = 0;
  [].slice.call(h.childNodes).forEach(function(node){
    if (node.nodeType !== 3) return;
    var frag = document.createDocumentFragment();
    node.textContent.split('').forEach(function(ch){
      if (ch === ' '){ frag.appendChild(document.createTextNode(' ')); return; }
      var s = mk('span','sn-ch', ch);
      s.style.animationDelay = (n++ * 26)+'ms';
      frag.appendChild(s);
    });
    h.replaceChild(frag, node);
  });
}

/* ══ 10 · COPY EMAIL ══════════════════════════════════════════════════════ */
function scanCopy(){
  each('#modeB .rrow a[href^="mailto"]', function(a){
    if (a.dataset.snCp) return;
    a.dataset.snCp = '1';
    var b = mk('button','sn-cp','Copy'); b.type='button';
    b.setAttribute('aria-label','Copy '+a.textContent);
    b.onclick = function(e){
      e.preventDefault(); e.stopPropagation();
      var addr = a.getAttribute('href').replace('mailto:','');
      var done = function(){ b.textContent='Copied'; toast('Copied '+addr); setTimeout(function(){b.textContent='Copy';},1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(addr).then(done, done);
      else done();
    };
    a.parentNode.appendChild(b);
  });
}

/* ══ 11 · KEYBOARD SHORTCUTS ══════════════════════════════════════════════ */
var help = mk('div','sn-help',
 '<div class="bx"><h3>Move faster</h3><p class="sub">Everything here works with the mouse too.</p><dl>'+
 '<dt><kbd>M</kbd></dt><dd>Switch between the quick route and the full site</dd>'+
 '<dt><kbd>T</kbd></dt><dd>Light or dark</dd>'+
 '<dt><kbd>C</kbd></dt><dd>Turn the custom pointer on or off</dd>'+
 '<dt><kbd>J</kbd> <kbd>K</kbd></dt><dd>Hop down or up a section</dd>'+
 '<dt><kbd>E</kbd></dt><dd>Open or collapse every section</dd>'+
 '<dt><kbd>&larr;</kbd> <kbd>&rarr;</kbd></dt><dd>Step back, or move the problem cards</dd>'+
 '<dt><kbd>Esc</kbd></dt><dd>Jump to the other mode</dd>'+
 '<dt><kbd>?</kbd></dt><dd>This panel</dd>'+
 '</dl><button class="cl" type="button">Close</button></div>');
document.body.appendChild(help);
function toggleHelp(on){
  var next = on === undefined ? !help.classList.contains('on') : on;
  help.classList.toggle('on', next);
}
help.addEventListener('click', function(e){
  if (e.target === help || e.target.classList.contains('cl')) toggleHelp(false);
});

/* capture phase so Esc closes help before the page's own Esc handler fires */
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && help.classList.contains('on')){
    e.preventDefault(); e.stopPropagation(); toggleHelp(false);
  }
}, true);

document.addEventListener('keydown', function(e){
  var t = e.target;
  if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  var k = e.key.toLowerCase();
  var inA = document.getElementById('modeA').classList.contains('live');

  if (e.key === '?' || (e.key === '/' && e.shiftKey)){ e.preventDefault(); toggleHelp(); return; }
  if (k === 'm'){ if (window.setMode) window.setMode(inA ? 'B' : 'A'); return; }
  if (k === 't'){
    var tg = document.getElementById('themeToggle');
    if (tg) tg.click();
    else {
      var lite = root.getAttribute('data-theme') === 'light';
      root.setAttribute('data-theme', lite ? 'dark' : 'light');
      ls('sn_theme', lite ? 'dark' : 'light');
    }
    toast(root.getAttribute('data-theme') === 'light' ? 'Light' : 'Dark', 1200);
    return;
  }
  if (k === 'c'){
    if (!fine || reduce){ toast('Custom pointer is off on this device', 1800); return; }
    enableCursor(!cursorOn);
    toast(cursorOn ? 'Custom pointer on' : 'Custom pointer off', 1500);
    return;
  }
  if (e.key === 'ArrowLeft'){
    if (inA) backEl && backEl.classList.contains('on') && backEl.click();
    else { var pp = document.getElementById('pprev'); if (pp) pp.click(); }
  }
  if (e.key === 'ArrowRight' && !inA){
    var pn = document.getElementById('pnext'); if (pn) pn.click();
  }
  /* section hopping in the full site */
  if (!inA && (k === 'j' || k === 'k')){
    if (!navSecs.length) return;
    e.preventDefault();
    measureNav();
    jumpTo(Math.max(0, Math.min(navSecs.length-1, navActive + (k === 'j' ? 1 : -1))));
  }
  /* open or close every fold on the page at once */
  if (!inA && k === 'e'){
    var folds = [].slice.call(document.querySelectorAll('#modeB .page.on .foldsec'));
    if (!folds.length) return;
    var anyShut = folds.some(function(s){ return !s.classList.contains('open'); });
    folds.forEach(function(s){ openFold(s, anyShut); });
    toast(anyShut ? 'All sections open' : 'All sections collapsed', 1500);
  }
});

/* one-time discovery hint */
var hint = mk('div','sn-hint','Press <kbd>?</kbd> for shortcuts');
document.body.appendChild(hint);
if (!ls('sn_hint')){
  setTimeout(function(){ hint.classList.add('on'); }, 2600);
  setTimeout(function(){ hint.classList.remove('on'); ls('sn_hint','1'); }, 9000);
}

/* ══ 12 · MODE SWITCH HOOK ════════════════════════════════════════════════ */
var origSetMode = window.setMode;
if (typeof origSetMode === 'function'){
  window.setMode = function(m){
    origSetMode(m);
    setTimeout(function(){ initScan(); flushReveal(); }, 40);
    setTimeout(flushReveal, 900);
    toast(m === 'A' ? 'Quick route — name the problem' : 'Full site — browse everything', 1900);
  };
}
/* the page's own hashchange routing swaps whole pages in Mode B */
addEventListener('hashchange', function(){
  setTimeout(function(){ initScan(); flushReveal(); }, 60);
  setTimeout(flushReveal, 1000);
});

/* ══ 13 · COLLAPSE THE LOWER HOME SECTIONS ════════════════════════════════
   Reuses the page's own .foldsec / .foldbtn / .foldbody pattern rather than
   inventing a second one, so folded sections are indistinguishable from the
   two that shipped folded already.                                         */
var foldSeq = 0;

/* The page's stylesheet caps an open fold at max-height:1600px, which clips
   taller bodies on narrow screens. Drive the height from content instead. */
function openFold(sec, open){
  var body = sec.querySelector('.foldbody');
  var btn  = sec.querySelector('.foldbtn');
  sec.classList.toggle('open', open);
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (!body) return;
  if (body.inert !== undefined) body.inert = !open;
  if (open){
    body.style.maxHeight = body.scrollHeight + 'px';
    clearTimeout(body.__snT);
    body.__snT = setTimeout(function(){
      if (sec.classList.contains('open')) body.style.maxHeight = 'none';
      sweep(); measureNav();
    }, 480);
  } else {
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      body.style.maxHeight = '0px';
      clearTimeout(body.__snT);
      body.__snT = setTimeout(measureNav, 480);
    });});
  }
}

/* Replacing the node drops the original listener, so every fold — the two
   that already existed and the three added below — runs one handler. */
function bindFold(btn){
  var fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  var sec = fresh.closest('.foldsec');
  if (!sec) return fresh;
  fresh.addEventListener('click', function(){
    openFold(sec, !sec.classList.contains('open'));
  });
  openFold(sec, sec.classList.contains('open'));
  return fresh;
}

function foldify(sec, meta){
  if (sec.classList.contains('foldsec')) return;
  var wrap  = sec.querySelector('.wrap');            if (!wrap)  return;
  var intro = wrap.querySelector('.intro');          if (!intro) return;
  var h2    = intro.querySelector('h2');             if (!h2)    return;
  var eyebrow = intro.querySelector('.eyebrow');
  var lead    = intro.querySelector('.r');
  var id = 'sn-fold-' + (++foldSeq);

  /* everything after .intro inside .wrap is the section's real content */
  var rest = [], n = intro.nextSibling;
  while (n){ rest.push(n); n = n.nextSibling; }

  var body = mk('div','foldbody'); body.id = id;
  if (lead){ lead.classList.add('foldtext'); body.appendChild(lead); }
  rest.forEach(function(x){ body.appendChild(x); });

  var btn = mk('button','foldbtn',
    '<span></span><span class="fmeta"><em></em><span class="fchev" aria-hidden="true">&#9662;</span></span>');
  btn.type = 'button';
  btn.setAttribute('aria-controls', id);
  btn.firstChild.textContent = h2.textContent.trim();
  btn.querySelector('em').textContent = meta || '';

  var head = document.createElement('h2');
  head.appendChild(btn);
  if (eyebrow) wrap.insertBefore(eyebrow, intro);
  wrap.insertBefore(head, intro);
  intro.remove();
  wrap.appendChild(body);

  sec.classList.add('foldsec','sec-tight');
  /* binding happens in one pass below, covering these and the original two */
}

/* matched on the section's own eyebrow text, so this survives content edits */
var FOLD_PLAN = [
  ['our approach',      function(s){ return s.querySelectorAll('.astep').length + ' steps'; }],
  ['engagement models', function(s){ return s.querySelectorAll('.mrow').length + ' models'; }],
  ['who we work with',  function(s){ return s.querySelectorAll('.card').length + ' profiles'; }]
];

(function collapseHome(){
  var home = document.getElementById('home'); if (!home) return;
  each(':scope > section', function(sec){
    var eb = sec.querySelector('.eyebrow');
    if (!eb) return;
    var key = eb.textContent.trim().toLowerCase();
    for (var i=0;i<FOLD_PLAN.length;i++){
      if (key === FOLD_PLAN[i][0]){ foldify(sec, FOLD_PLAN[i][1](sec)); return; }
    }
  }, home);
  /* Proof shipped expanded; collapsed here so the page opens at one screen.
     Flip this line out to leave it open. */
  each('.foldsec.open', function(sec){ sec.classList.remove('open'); }, home);
  /* one binding pass over all five — the three above and the two that shipped */
  each('.foldbtn', bindFold, home);
})();

/* ══ 14 · SECTION JUMP NAVIGATOR ══════════════════════════════════════════ */
var navHost = mk('nav','sn-nav');
navHost.setAttribute('aria-label','Jump to section');
document.body.appendChild(navHost);

/* navSecs / navBtns / navTops / navActive are declared at the top of this
   IIFE — the rAF loop calls spy() before this section is reached. */
function label(sec, first){
  if (first) return 'Top';
  var eb = sec.querySelector('.eyebrow');
  var t = eb ? eb.textContent.trim() : '';
  if (!t || t.length > 24){
    var h = sec.querySelector('.foldbtn>span,h2');
    t = h ? h.textContent.trim() : 'Section';
  }
  return t.length > 22 ? t.slice(0,21).trim() + '…' : t;
}

function buildNav(){
  var page = document.querySelector('#modeB .page.on');
  navSecs = []; navBtns = []; navActive = -1;
  navHost.innerHTML = '';
  if (!page || !document.getElementById('modeB').classList.contains('live')){
    navHost.classList.remove('on'); return;
  }
  var secs = [].slice.call(page.children).filter(function(c){ return c.tagName === 'SECTION'; });
  if (secs.length < 3){ navHost.classList.remove('on'); return; }
  secs.forEach(function(sec, i){
    var b = mk('button', null, '<i></i><span></span>');
    b.type = 'button';
    var txt = label(sec, i === 0);
    b.querySelector('span').textContent = txt;
    b.setAttribute('aria-label', 'Jump to ' + txt);
    b.addEventListener('click', function(){ jumpTo(i); });
    navHost.appendChild(b);
    navSecs.push(sec); navBtns.push(b);
  });
  navHost.classList.add('on');
  measureNav();
}

function measureNav(){
  if (!navSecs.length) return;   /* folds can settle before the nav is built */
  navTops = navSecs.map(function(s){ return s.getBoundingClientRect().top + scrollY; });
}

function jumpTo(i){
  if (!navSecs[i]) return;
  measureNav();
  scrollTo({ top: Math.max(navTops[i] - 74, 0), behavior: reduce ? 'auto' : 'smooth' });
}

function spy(){
  if (!navSecs.length) return;
  var y = scrollY + 120, k = 0;
  for (var i=0;i<navTops.length;i++) if (navTops[i] <= y) k = i;
  if (scrollY + innerHeight >= document.body.scrollHeight - 4) k = navTops.length - 1;
  if (k === navActive) return;
  navActive = k;
  navBtns.forEach(function(b,i){ b.classList.toggle('on', i === k); });
}

/* ══ INIT ═════════════════════════════════════════════════════════════════ */
function initScan(){
  scanReveal(); scanSpot(); scanMagnetic(); scanCopy(); buildNav();
  splitHeading(document.querySelector('#modeA .step.on h1'));
  splitHeading(document.querySelector('#modeB #home h1'));
}
initScan();
setTimeout(flushReveal, 1500);   /* failsafe on first paint */

/* the problem carousel rebuilds its cards every few seconds */
var stage = document.getElementById('pstage');
if (stage) new MutationObserver(function(){ scanSpot(); }).observe(stage, {childList:true});

/* re-scan when Mode B forms complete */
each('form[data-demo]', function(f){
  f.addEventListener('submit', function(){ setTimeout(function(){ confetti(34); }, 120); });
});
})();
