/* Single point of contact with the server: every form, from either mode,
   posts through this. Common fields (name/email/message) are columns on the
   backend; everything mode- or form-specific goes in `details` as JSON, so a
   new chip or field never needs a schema change. */
window.SubmissionClient={
 post:function(mode,formType,fields){
  var body=Object.assign({mode:mode,formType:formType},fields);
  console.log('[SubmissionClient] posting',body);
  return fetch('/api/submissions',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(body)
  }).then(function(res){
   console.log('[SubmissionClient] response',res.status,body);
   if(!res.ok)console.error('[SubmissionClient] submission rejected',res.status,body);
   return res;
  }).catch(function(e){console.error('[SubmissionClient] submission failed',e,body);});
 }
};

window.__PROB=[["Pre-emptive and Foresight", "Catch the failure before it happens", "You are about to commit real money and time. We run a structured pre-mortem so the ways this could fail surface now, on paper, not later in production."], ["Pre-emptive and Foresight", "Stress-test the bet before you place it", "Before a big decision, we sit on the other side of the table and pressure-test every assumption, so you commit with your eyes open."], ["Pre-emptive and Foresight", "See the risk no one is naming", "The quiet risks are the expensive ones. We name what the room is avoiding and build it into the plan before it costs you."], ["Product and Build", "No chief technology officer, and I need a decision-maker, not a co-founder", "You need senior technical judgment for six months, not equity given away for a decade. We are that decision-maker, on demand."], ["Product and Build", "The product is stuck in dev-shop limbo", "Agencies ship code and disappear. We build a production-grade product, document it, and hand it over so you own every line."], ["Product and Build", "The architecture will not survive the next funding round", "We design systems for where you are going, not just where you are today, so they scale through the next three rounds without a rewrite."], ["Strategy and Growth", "The annual operating plan is a guess, not a plan", "We turn instinct into an operating plan you can defend to a board, with the numbers, the priorities and the risks made explicit."], ["Strategy and Growth", "Go-to-market is running on instinct", "We build a route to market grounded in evidence, positioning and a real sequence of moves, not a hunch."], ["Strategy and Growth", "No one is stress-testing my assumptions", "We are the senior thinking partner who challenges the assumptions under your strategy before the market does it for you."], ["Judgment and Decisions", "I need someone who will say what the room will not", "Off the record and with no agenda, we tell you the thing everyone is thinking but no one is willing to say."], ["Judgment and Decisions", "A big call, and no unbiased sounding board", "We are the outside judgment you can call on the hardest decisions, with nothing to sell you and no seat to protect."], ["Scale and Operate", "We built it, and now we cannot run it", "We operate what we build alongside you and then transfer it cleanly, so the capability stays in your team, not ours."], ["Scale and Operate", "Hiring and team design is guesswork", "We design the engineering team and the hiring plan around the actual work, so you scale with the right people in the right shape."], ["Scale and Operate", "Governance and risk are an afterthought", "We build governance and risk into the plan from day one, so growth does not turn into expensive surprises."], ["Strategy and Growth", "The unit economics do not work at scale", "Growth is hiding a model that loses money on every extra customer. We rebuild the economics before you scale the leak."], ["Product and Build", "We assumed product-market fit and never tested it", "Building for a need that was never there is the most common way this ends. We test the demand before you spend another quarter on the build."], ["Scale and Operate", "Too many changes running at once", "Artificial intelligence, operating model, hiring and process all moving together. We work out what the organisation can actually absorb, and sequence the rest."], ["Strategy and Growth", "The AI spend has no measurable return", "Money is going into artificial intelligence with nothing to show the board. We define what return looks like, then build only what produces it."], ["Judgment and Decisions", "The runway math is more hopeful than real", "Cash is the final cause of most failures and rarely the first. We pressure-test the runway and name the decision you can still make."], ["Product and Build", "The wrong people are in the critical seats", "People and culture sit behind a large share of the reasons ventures fail. We assess the shape of the team against the work in front of it."], ["Judgment and Decisions", "Committing while the ground keeps moving", "Uncertainty is the threat chief executives rank highest going into 2026. We help you decide without waiting for a certainty that is not coming."]];

(function(){var root=document.documentElement;var pauseCarousel=null,resumeCarousel=null;
 function take(k){try{var v=sessionStorage.getItem(k);sessionStorage.removeItem(k);return v;}catch(e){return null;}}
 var em=document.getElementById('engagement');
 if(em){var tg=take('sn_target');if(tg){var el=document.getElementById('em-'+tg);
  if(el){el.classList.add('flash');setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'center'});},160);
  setTimeout(function(){el.classList.remove('flash');},2000);}}}
 var idp=document.getElementById('identify');
 if(idp){var raw=take('sn_pick');if(raw){try{sessionStorage.setItem('sn_pick_show',raw);}catch(e){}}if(raw){try{var pk=JSON.parse(raw);var pb=document.getElementById('pickedBox');
  if(pb){pb.style.display='block';pb.innerHTML='<span class="tag">Your problem, carried in</span><div class="pq">'+pk.title+'</div><p>We kept your selection so you would not lose it. Keep it as is, or edit your choices below, then send. From <strong style="color:var(--text)">'+pk.cat+'</strong>.</p>';}
  document.querySelectorAll('#identify .prow').forEach(function(c){if(c.getAttribute('data-title')===pk.title)c.classList.add('sel');});}catch(e){}}}
 var t=document.getElementById('themeToggle');if(t){t.textContent=root.getAttribute('data-theme')==='light'?'☀':'☾';t.onclick=function(){var l=root.getAttribute('data-theme')==='light';var nx=l?'dark':'light';root.setAttribute('data-theme',nx);t.textContent=l?'☾':'☀';try{localStorage.setItem('sn_theme',nx);}catch(e){}};}

 var mb=document.getElementById('menuBtn'),mn=document.getElementById('mobnav');
 function mtoggle(o){if(!mn)return;mn.classList.toggle('open',o);mn.setAttribute('aria-hidden',o?'false':'true');if(mb)mb.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';}
 if(mb)mb.onclick=function(){mtoggle(!mn.classList.contains('open'));};
 document.querySelectorAll('[data-mclose]').forEach(function(x){x.addEventListener('click',function(){mtoggle(false);});});
 document.querySelectorAll('[data-model]').forEach(function(el){el.addEventListener('click',function(){try{sessionStorage.setItem('sn_target',el.getAttribute('data-model'));}catch(e){}});});
 document.querySelectorAll('.moreBtn').forEach(function(b){b.onclick=function(){var c=b.closest('.pcard2');c.classList.toggle('open');b.textContent=c.classList.contains('open')?'Show less':'Read more';};});
 var fm=document.getElementById('fbModal');document.querySelectorAll('[data-fb]').forEach(function(x){x.onclick=function(e){e.preventDefault();if(fm)fm.classList.add('open');};});
 if(fm)fm.onclick=function(e){if(e.target===fm||e.target.hasAttribute('data-x'))fm.classList.remove('open');};
 // note: chip selection and step-by-step reveal for .metro forms is wired up
 // later in this file (initMetroWizards), after any dynamically-built steps exist.
 // approach stepper: sequential 1 to 2 to 3 to 4
 document.querySelectorAll('.stepbar').forEach(function(bar){var ap=bar.parentElement,dots=[].slice.call(bar.querySelectorAll('.dot')),fill=ap.querySelector('.afill'),mark=ap.querySelector('.amark'),n=dots.length,i=0;
  function go(){dots.forEach(function(d,k){d.classList.toggle('cur',k===i);d.classList.toggle('done',k<i);});var pct=(i/(n-1))*75,reset=(i===0);if(fill){fill.style.transition=reset?'none':'';fill.style.width=pct+'%';}if(mark){mark.style.transition=reset?'none':'';mark.style.left=(12.5+pct)+'%';}i=(i+1)%n;}
  go();setInterval(go,2600);});
 // rotating problem cards: pause on hover, prev/next, carry the pick to the intake
 var stage=document.getElementById('pstage');
 if(stage&&window.__PROB){var P=window.__PROB,i=0,per=3,timer=null,dots=document.getElementById('pdots');
  function pg(){return Math.ceil(P.length/per);}
  function esc(s){return String(s).replace(/"/g,'&quot;');}
  function bind(){stage.querySelectorAll('.pcard').forEach(function(c){c.addEventListener('click',function(){try{sessionStorage.setItem('sn_pick',JSON.stringify({cat:c.getAttribute('data-cat'),title:c.getAttribute('data-title')}));}catch(e){}});});}
  function dot(){if(!dots)return;var d='';for(var j=0;j<pg();j++)d+='<i class="'+(j===i?'on':'')+'"></i>';dots.innerHTML=d;}
  function build(){var f='';for(var k=0;k<per;k++){var it=P[(i*per+k)%P.length];f+='<a class="pcard" href="#identify" data-cat="'+esc(it[0])+'" data-title="'+esc(it[1])+'"><span class="cat">'+it[0]+'</span><div class="q">'+it[1]+'</div><p class="pd">'+it[2]+'</p><span class="go">This sounds like me &rarr;</span></a>';}stage.innerHTML=f;bind();dot();}
  function swap(dir){stage.style.opacity=0;setTimeout(function(){i=(i+dir+pg())%pg();build();stage.style.opacity=1;},420);}
  function start(){stop();timer=setInterval(function(){swap(1);},5600);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  build();start();pauseCarousel=stop;resumeCarousel=start;
  stage.addEventListener('mouseenter',stop);stage.addEventListener('mouseleave',start);
  stage.addEventListener('focusin',stop);stage.addEventListener('focusout',start);
  var pn=document.getElementById('pnext'),pp=document.getElementById('pprev'),ppz=document.getElementById('ppause'),paused=false;
  if(pn)pn.addEventListener('click',function(){swap(1);});if(pp)pp.addEventListener('click',function(){swap(-1);});
  if(ppz)ppz.addEventListener('click',function(){paused=!paused;if(paused){stop();ppz.textContent='Play';}else{start();ppz.textContent='Pause';}ppz.setAttribute('aria-pressed',String(paused));});}
 document.querySelectorAll('form[data-demo]').forEach(function(f){f.onsubmit=function(e){e.preventDefault();var d=f.querySelector('.done');if(d)d.style.display='block';window.scrollTo(0,0);};});
})();

/* Mode B posts real data: one listener per form, each reading only the
   fields that form actually has. Runs alongside the generic data-demo
   handler above, which owns showing the "thank you" message. */
(function(){
 function val(id){var el=document.getElementById(id);return el?el.value.trim():'';}

 var idf=document.getElementById('identifyForm');
 if(idf)idf.addEventListener('submit',function(){
  var picks=[].slice.call(idf.querySelectorAll('#probSteps .prow.sel')).map(function(b){
   var step=b.closest('.mstep'),lab=step?step.querySelector('.mlabel'):null;
   return {category:lab?lab.textContent:null,problem:b.getAttribute('data-title')};
  });
  window.SubmissionClient.post('B','identify',{
   name:val('identify-f2'),email:val('identify-f3'),message:val('identify-f4'),
   details:{role:val('identify-f1'),problems:picks}
  });
 });

 var cf=document.getElementById('contactForm');
 if(cf)cf.addEventListener('submit',function(){
  var chipSteps=[].slice.call(cf.querySelectorAll('.mstep')).filter(function(s){return s.querySelector('.chip');});
  // checkbox-style (data-multi) steps capture every selected chip as a list;
  // single-select steps keep the one selected value as before.
  function selected(step){
   if(!step)return null;
   var sels=[].slice.call(step.querySelectorAll('.chip.sel'));
   if(!sels.length)return null;
   if(step.getAttribute('data-multi')==='true')return sels.map(function(c){return c.textContent.trim();});
   return sels[0].textContent.trim();
  }
  var tz=cf.querySelector('select'),tzVal=(tz&&tz.selectedIndex>0)?tz.options[tz.selectedIndex].text:null;
  window.SubmissionClient.post('B','contact',{
   name:val('contact-f1'),email:val('contact-f2'),message:val('contact-f3'),
   details:{
    stage:selected(chipSteps[0]),lookingFor:selected(chipSteps[1]),
    timing:selected(chipSteps[2]),connect:selected(chipSteps[3]),timezone:tzVal
   }
  });
 });

 var fb=document.getElementById('feedbackForm');
 if(fb)fb.addEventListener('submit',function(){
  window.SubmissionClient.post('B','feedback',{
   email:val('index-f2'),message:val('index-f1'),details:{}
  });
 });
})();

(function(){document.querySelectorAll('.acc>button').forEach(function(b){b.setAttribute('aria-expanded','false');b.addEventListener('click',function(){var open=b.getAttribute('aria-expanded')==='true';b.parentNode.parentNode.querySelectorAll('.acc>button[aria-expanded="true"]').forEach(function(o){if(o!==b)o.setAttribute('aria-expanded','false');});b.setAttribute('aria-expanded',open?'false':'true');});});})();
(function(){document.querySelectorAll('.foldbtn').forEach(function(b){var sec=b.closest('.foldsec');if(!sec)return;var pre=sec.classList.contains('open');b.setAttribute('aria-expanded',pre?'true':'false');b.addEventListener('click',function(){var open=sec.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false');});});})();

(function(){var host=document.getElementById('probSteps');
 if(!host||!window.__PROB)return;
 var cats=[],by={};
 window.__PROB.forEach(function(p){if(!by[p[0]]){by[p[0]]=[];cats.push(p[0]);}by[p[0]].push(p[1]);});
 function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
 host.innerHTML=cats.map(function(c){
  return '<div class="mstep"><span class="node"></span>'+
   '<span class="mlabel" style="color:var(--gold)">'+esc(c)+'</span><div class="prows">'+
   by[c].map(function(t){return '<button type="button" class="chip prow" data-title="'+esc(t)+
    '"><span class="pb"></span>'+esc(t)+'</button>';}).join('')+'</div></div>';}).join('');
 var raw=null;try{raw=sessionStorage.getItem('sn_pick_show');sessionStorage.removeItem('sn_pick_show');}catch(e){}
 if(raw){try{var pk=JSON.parse(raw);
  host.querySelectorAll('.prow').forEach(function(b){
   if(b.getAttribute('data-title')===pk.title){b.classList.add('sel');
    var st=b.closest('.mstep');if(st){var n=st.querySelector('.node');if(n)n.classList.add('done');}}});
  }catch(e){}}
})();

/* step-by-step reveal for .metro forms (#identify, #contact): one question at a
   time instead of the whole form at once. Runs after any dynamically-built
   steps (e.g. #probSteps) exist, and re-runs itself if that ever changes. */
(function initMetroWizards(){
 document.querySelectorAll('.metro').forEach(function(m){
  if(m.__wizardOn)return; // don't double-init
  var steps=[].slice.call(m.querySelectorAll('.mstep'));
  if(steps.length<2)return; // nothing to step through
  m.__wizardOn=true;
  m.classList.add('wizard');

  var form=m.closest('form');
  var submitBtn=form?form.querySelector('button[type="submit"]'):null;

  var dots=document.createElement('div');
  dots.className='wdots';
  m.parentNode.insertBefore(dots,m);

  var nav=document.createElement('div');
  nav.className='wnav';
  nav.innerHTML='<button type="button" class="btn btn-gold wprev">&larr; Back</button>'+
   '<span class="wcount"></span>'+
   '<button type="button" class="btn btn-gold wnext">Continue &rarr;</button>';
  m.parentNode.insertBefore(nav,m.nextSibling);
  var prevBtn=nav.querySelector('.wprev'),nextBtn=nav.querySelector('.wnext'),count=nav.querySelector('.wcount');
  // put the real submit button in the same row/slot as Continue, instead of
  // stacking a second button underneath it once the last step is reached
  if(submitBtn)nav.appendChild(submitBtn);

  function isProb(step){return !!step.querySelector('.chip.prow');}
  function isMulti(step){return isProb(step)||step.getAttribute('data-multi')==='true';}

  // the problem picker runs one step per category and the copy invites you to
  // pick as many as fit, wherever they fall. So no single category may demand a
  // pick of its own to let you move on, or every submission ends up carrying a
  // token answer in all five. The form asks only for at least one problem
  // overall, enforced on the last step instead.
  var probSteps=steps.filter(isProb);
  function anyProb(){return probSteps.some(function(s){return !!s.querySelector('.chip.sel');});}

  function valid(i){
   var s=steps[i];
   if(isProb(s))return true;
   if(s.querySelector('.chip'))return !!s.querySelector('.chip.sel');
   var sels=s.querySelectorAll('select');
   if(sels.length)return [].slice.call(sels).every(function(sel){return sel.selectedIndex>0;});
   var fields=s.querySelectorAll('input,textarea');
   if(!fields.length)return true;
   return [].slice.call(fields).every(function(f){return !f.required||f.value.trim().length>0;});
  }

  var cur=0;
  var pre=steps.findIndex(function(s){return s.querySelector('.chip.sel');});
  if(pre>-1)cur=pre;

  function renderDots(){
   var f='';
   for(var j=0;j<steps.length;j++)f+='<i class="'+(j<cur?'done':j===cur?'cur':'')+'"></i>';
   dots.innerHTML=f;
  }

  // nav state is derived, never stored: called after every pick, keystroke and
  // step change so Continue, Send and the counter never disagree with the form.
  function syncNav(){
   nextBtn.disabled=!valid(cur);
   var need=probSteps.length&&submitBtn&&!anyProb();
   if(submitBtn&&probSteps.length)submitBtn.disabled=!!need;
   count.textContent=(need&&cur===steps.length-1)
    ?'Pick at least one problem to send'
    :'Step '+(cur+1)+' of '+steps.length;
  }

  function render(){
   steps.forEach(function(s,i){s.classList.toggle('showstep',i===cur);});
   var last=cur===steps.length-1;
   prevBtn.hidden=(cur===0);
   nextBtn.hidden=last;
   if(submitBtn)submitBtn.hidden=!last;
   syncNav();
   renderDots();
   var f=steps[cur].querySelector('input,textarea,select');
   if(f)setTimeout(function(){try{f.focus({preventScroll:true});}catch(e){}},60);
  }

  function advance(){if(cur<steps.length-1){cur++;render();}}
  function back(){if(cur>0){cur--;render();}}

  m.addEventListener('click',function(e){
   var chip=e.target.closest('.chip');
   if(!chip)return;
   var step=chip.closest('.mstep');
   if(!step||!step.classList.contains('showstep'))return;
   var multi=isMulti(step);
   if(!multi)step.querySelectorAll('.chip').forEach(function(c){if(c!==chip)c.classList.remove('sel');});
   chip.classList.toggle('sel');
   syncNav();
   if(!multi&&chip.classList.contains('sel')){
    setTimeout(function(){if(step.classList.contains('showstep'))advance();},380);
   }
  });
  m.addEventListener('input',syncNav);
  m.addEventListener('change',syncNav);
  m.addEventListener('keydown',function(e){
   if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){
    e.preventDefault();
    if(!nextBtn.hidden&&!nextBtn.disabled)advance();
    else if(submitBtn&&!submitBtn.hidden&&!submitBtn.disabled)submitBtn.click();
   }
  });
  nextBtn.addEventListener('click',advance);
  prevBtn.addEventListener('click',back);
  m.addEventListener('metro:sync',function(){
   var p=steps.findIndex(function(s){return s.querySelector('.chip.sel');});
   if(p>-1)cur=p;
   render();
  });

  render();
 });
})();

/* shutter click on hover, synthesised, no audio file, respects reduced-motion */
(function(){
 var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(reduce)return;
 var ctx=null,armed=false,last=0;
 function arm(){ if(armed)return; armed=true;
  try{var AC=window.AudioContext||window.webkitAudioContext; if(AC)ctx=new AC();}catch(e){ctx=null;} }
 ['pointerdown','keydown'].forEach(function(ev){
   document.addEventListener(ev,arm,{once:true,passive:true}); });
 function clack(){
  if(!ctx||ctx.state==='closed')return;
  var now=Date.now(); if(now-last<700)return; last=now;
  if(ctx.state==='suspended'){try{ctx.resume();}catch(e){}}
  var t=ctx.currentTime, dur=0.085;
  var n=Math.floor(ctx.sampleRate*dur), buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0);
  for(var i=0;i<n;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/n,7); }
  var src=ctx.createBufferSource(); src.buffer=buf;
  var bp=ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2600; bp.Q.value=1.1;
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(0.16,t+0.006);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  src.connect(bp); bp.connect(g); g.connect(ctx.destination);
  src.start(t); src.stop(t+dur);
 }
 document.querySelectorAll('.brand').forEach(function(b){
   b.addEventListener('mouseenter',clack);
   b.addEventListener('focus',clack);
 });
})();


(function(){
 var pages=document.querySelectorAll('.page'),links=document.querySelectorAll('[data-nav]');
 function take(k){try{var v=sessionStorage.getItem(k);sessionStorage.removeItem(k);return v;}catch(e){return null;}}
 function arrive(h){
  if(h==='engagement'){var tg=take('sn_target');
   if(tg){var el=document.getElementById('em-'+tg);
    if(el){el.classList.add('flash');
     setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'center'});},160);
     setTimeout(function(){el.classList.remove('flash');},2000);}}}
  if(h==='identify'){var raw=take('sn_pick');
   if(raw){try{var pk=JSON.parse(raw);var pb=document.getElementById('pickedBox');
    if(pb){pb.style.display='block';pb.innerHTML='<span class="tag">Your problem, carried in</span><div class="pq">'+pk.title+'</div><p>We kept your selection so you would not lose it. Keep it as is, or edit your choices below, then send. From <strong style="color:var(--text)">'+pk.cat+'</strong>.</p>';}
    document.querySelectorAll('#identify .prow').forEach(function(b){
     if(b.getAttribute('data-title')===pk.title){b.classList.add('sel');
      var st=b.closest('.mstep');if(st){var n=st.querySelector('.node');if(n)n.classList.add('done');
       var mt=st.closest('.metro');if(mt)mt.dispatchEvent(new CustomEvent('metro:sync'));}}});
    }catch(e){}}}
 }
 function route(focus){
  var h=(location.hash||'#home').slice(1),found=false;
  pages.forEach(function(p){var on=p.id===h;p.classList.toggle('on',on);if(on)found=true;});
  if(!found){document.getElementById('home').classList.add('on');h='home';}
  links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+h);});
  window.scrollTo(0,0);
  var cur=document.getElementById(h);var hd=cur&&cur.querySelector('h1,h2');
  var lr=document.getElementById('liveRegion');if(lr&&hd)lr.textContent=hd.textContent;
  if(focus&&hd){hd.setAttribute('tabindex','-1');try{hd.focus({preventScroll:true});}catch(e){hd.focus();}}
  arrive(h);
 }
 window.addEventListener('hashchange',function(){route(true);});
 route(false);
})();

(function(){

var CAT=[
 ["Pre-emptive and Foresight","Before the bet","--m0","A decision is coming and you want it pressure-tested first."],
 ["Product and Build","The build","--m1","Something needs building, rebuilding, or rescuing."],
 ["Strategy and Growth","The plan","--m2","Growth is happening, or is not, and nobody can say why."],
 ["Judgment and Decisions","The call","--m3","A hard decision, and no honest room to test it in."],
 ["Scale and Operate","After it works","--m4","It works. Now it has to run without breaking."]];
var P=[
["Pre-emptive and Foresight","Catch the failure before it happens"],
["Pre-emptive and Foresight","Stress-test the bet before you place it"],
["Pre-emptive and Foresight","See the risk no one is naming"],
["Product and Build","No chief technology officer, and I need a decision-maker, not a co-founder"],
["Product and Build","The product is stuck in dev-shop limbo"],
["Product and Build","The architecture will not survive the next funding round"],
["Product and Build","We assumed product-market fit and never tested it"],
["Product and Build","The wrong people are in the critical seats"],
["Strategy and Growth","The annual operating plan is a guess, not a plan"],
["Strategy and Growth","Go-to-market is running on instinct"],
["Strategy and Growth","No one is stress-testing my assumptions"],
["Strategy and Growth","The unit economics do not work at scale"],
["Strategy and Growth","The AI spend has no measurable return"],
["Judgment and Decisions","I need someone who will say what the room will not"],
["Judgment and Decisions","A big call, and no unbiased sounding board"],
["Judgment and Decisions","The runway math is more hopeful than real"],
["Judgment and Decisions","Committing while the ground keeps moving"],
["Scale and Operate","We built it, and now we cannot run it"],
["Scale and Operate","Hiring and team design is guesswork"],
["Scale and Operate","Governance and risk are an afterthought"],
["Scale and Operate","Too many changes running at once"]];
var MODELS=[
 ["Strategic Consulting","--m0","Senior judgment on the decisions that matter."],
 ["Shadow Advisory","--m1","The person in the room who will say it. Off the record."],
 ["Build Operate Transfer","--m2","We build it, run it with you, then hand it over completely."],
 ["Startup in a Box","--m3","Idea to production-grade product. You own every line."]];
var READ={
"Pre-emptive and Foresight":{h:"You are early. That is the whole advantage, and almost nobody uses it.",
 b:"<p>People rarely call me at this point. They call afterwards, once the money is committed and the options have narrowed to damage control.</p><p><strong>What I would guess is happening:</strong> the decision is sound in outline, but two or three assumptions nobody has examined are carrying most of the risk. In my experience they are never the ones being argued about in the room.</p><p><strong>What I would do first:</strong> a proper pre-mortem. We assume it has already failed, then work backwards to why. Doing that on paper now costs a fraction of finding out in production.</p>",
 c:[["If you leave it","The expensive risks are the quiet ones. They surface after you have committed, when your options are at their worst."],["What this usually looks like","A short engagement. Days, not quarters."],["Who you would work with","Both of us. This is judgment work, and it is not something you can hand to somebody junior."]]},
"Product and Build":{h:"The build is where good ideas quietly go sideways.",
 b:"<p>Building something nobody tested the need for is the most common way this ends. Running out of money is usually just the symptom that gets written on the death certificate.</p><p><strong>What I would guess is happening:</strong> either the technical calls got made by whoever was free rather than whoever was senior, or the demand was assumed rather than proven. Both are fixable. Both get more expensive every month you wait.</p><p><strong>What I would do first:</strong> look hard at what is actually built, what it costs to run, and whether the thing it serves is real.</p>",
 c:[["If you leave it","Architecture chosen for today gets rewritten at the next stage, usually at the worst possible moment."],["What this usually looks like","Fixed scope. Idea to production-grade in weeks, or a rescue on what already exists."],["What you keep","Every line of it. Clean code, full documentation, and nothing that locks you to us."]]},
"Strategy and Growth":{h:"Growth is not your problem. Not knowing why is.",
 b:"<p>When growth is working and you cannot explain the mechanism, you cannot repeat it. When it is not working and you cannot explain the block, you cannot fix it. It is the same problem wearing two faces.</p><p><strong>What I would guess is happening:</strong> the plan is a set of intentions rather than a model. Nobody has written down what has to be true for it to work, so nobody can tell you when it has stopped being true.</p><p><strong>What I would do first:</strong> turn the instinct into something you could defend to a board, with the numbers, the sequence and the risks all made explicit.</p>",
 c:[["If you leave it","Unit economics that do not work at scale get worse with every customer you add. Growth accelerates the leak."],["What this usually looks like","One focused engagement, then ongoing advisory only if you want it."],["Who you would work with","The same two of us you met on the call. Start to finish."]]},
"Judgment and Decisions":{h:"You do not need more information. You need an honest room.",
 b:"<p>By this point most people already have the data. What they do not have is somebody in the room with nothing to sell them and no seat to protect.</p><p><strong>What I would guess is happening:</strong> everyone around this decision is invested in a particular answer, including, quite often, you. That is not a character flaw. It is structural, and it is the entire reason outside judgment exists.</p><p><strong>What I would do first:</strong> one conversation, off the record, where the thing everybody has been avoiding finally gets said out loud.</p>",
 c:[["If you leave it","Uncertainty is the threat chief executives rank highest going into 2026. Waiting for it to clear is itself a decision, and usually the wrong one."],["What this usually looks like","Shadow advisory. Session by session, or on retainer. A few seats, deliberately."],["The terms","Off the record. No agenda. Nothing being sold to you inside the room."]]},
"Scale and Operate":{h:"It works. Now it has to keep working without you in the room.",
 b:"<p>Building rewards heroics. Operating punishes them. Most teams do not notice the switch until something breaks that used to be fine, and nobody can say what changed.</p><p><strong>What I would guess is happening:</strong> the organisation is being asked to absorb more change than it has the capacity for, or the thing you built has no real owner who can run it. In my experience, usually both.</p><p><strong>What I would do first:</strong> work out what can genuinely be absorbed, sequence the rest honestly, and put a named owner against every part.</p>",
 c:[["If you leave it","Capability that lives with a supplier is capability you are renting. Permanently."],["What this usually looks like","We build it, run it alongside you, then transfer it completely."],["What you keep","Frameworks, models, systems and documentation. All of it yours to run without us."]]}};
var RES=[
 ["Article","--m0","You are not doing AI governance. You are doing AI risk management.","The distinction is not semantic, and confusing the two is why most AI programmes cannot answer the board's simplest question.","8 min read"],
 ["Article","--m1","The debate is the distraction.","Six years arguing about where people sit, and the real question was never location. What the argument was actually about.","7 min read"],
 ["Toolkit","--m2","The pre-mortem, done properly.","The template we run before a client commits real money. Assume it already failed, then find out why, on paper, while it still costs nothing.","Framework · yours to edit"],
 ["Salon","--m3","A small room, four times a year.","Eight people, one question, no slides and no recording. Somewhere a position can be tested without anyone performing.","By invitation"]];
var URG=["Right now","Within a month","One to three months","Just exploring"];
var REFS=["A client","An advisor","A partner","Someone else"];

var DOORS=[
 ["diag","--m0","I know there is a problem. I cannot locate it.","We locate it. Ninety seconds."],
 ["know","--m1","I know the scope. I need senior people on it.","No discovery call. Name the shape."],
 ["intro","--m2","You were recommended to me.","Tell us by whom. You skip the queue."],
 ["look","--m3","I do not know you yet.","Then we go first."]];
function buildDoors(){document.getElementById('doors').innerHTML=DOORS.map(function(d){
 return '<button class="door" type="button" style="--c:var('+d[1]+')" data-p="'+d[0]+'" onclick="door(this.getAttribute(\'data-p\'))">'+
  '<span class="line"><span class="who">You</span><span class="them">&ldquo;'+d[2]+'&rdquo;</span></span>'+
  '<span class="line usline"><span class="who">Us</span><span class="us">'+d[3]+'</span></span></button>';}).join('');}

var path=null,cat=null,prob=null,model=null,res=null,urg=null;
var BL=document.getElementById('bl'),FILL=document.getElementById('fill'),
    CB=document.getElementById('cb'),RS=document.getElementById('rs');
var PCT=[0,26,52,74,52,40,90,55,100];
var APS=[0,1,2,3,1,1,4,1,5];

function go(n){
 if(n===0){path=cat=prob=model=res=urg=null;}
 document.querySelectorAll('.step').forEach(function(s,i){s.classList.toggle('on',i===n);});
 FILL.style.width=PCT[n]+'%';
 var k=APS[n];
 BL.style.transform='rotate('+(k*6.4)+'deg) scale('+(1-k*0.04)+')';
 CB.textContent=n===0?'':(path==='diag'?'Locating it':path==='know'?'Straight to it':path==='intro'?'Introduced':'Us first');
 RS.classList.toggle('on',n>0);
 window.scrollTo(0,0);
 if(n===0)buildDoors(); if(n===1)buildCats(); if(n===2)buildProbs(); if(n===3)buildRead();
 if(n===4)buildModels(); if(n===6)buildCap(); if(n===7)buildRes();
}
function door(p){path=p;go(p==='diag'?1:p==='know'?4:p==='intro'?6:5);}
function doorLabel(p){var d=DOORS.filter(function(x){return x[0]===p;})[0];return d?d[2]:p;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

function buildCats(){document.getElementById('cats').innerHTML=CAT.map(function(c,i){
 return '<button class="opt" type="button" style="--c:var('+c[2]+')" data-v="'+esc(c[0])+'" onclick="pickCat(this)">'+
 '<span class="n">0'+(i+1)+'</span><span class="t">'+c[1]+'</span><span class="d">'+c[3]+'</span></button>';}).join('');}
function pickCat(b){cat=b.getAttribute('data-v');go(2);}
function buildProbs(){var m=CAT.filter(function(c){return c[0]===cat;})[0];
 document.getElementById('s2h').textContent=m[1]+'. Which of these is closer?';
 document.getElementById('probs').innerHTML=P.filter(function(p){return p[0]===cat;}).map(function(p){
 return '<button class="opt" type="button" style="--c:var('+m[2]+')" data-v="'+esc(p[1])+'" onclick="pickProb(this)">'+
 '<span class="t">'+p[1]+'</span></button>';}).join('');}
function pickProb(b){prob=b.getAttribute('data-v');go(3);}
function buildRead(){var r=READ[cat];
 document.getElementById('rh').textContent=r.h;
 document.getElementById('rb').innerHTML='<p class="quoted">&ldquo;'+prob+'&rdquo;</p>'+r.b;
 document.getElementById('rc').innerHTML=r.c.map(function(x){return '<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('');}
function buildModels(){document.getElementById('models').innerHTML=MODELS.map(function(m,i){
 return '<button class="opt" type="button" style="--c:var('+m[1]+')" data-v="'+esc(m[0])+'" onclick="pickModel(this)">'+
 '<span class="n">0'+(i+1)+'</span><span class="t">'+m[0]+'</span><span class="d">'+m[2]+'</span></button>';}).join('');}
function pickModel(b){model=b.getAttribute('data-v');go(6);}
function buildRes(){document.getElementById('reslist').innerHTML=RES.map(function(r){
 return '<button class="rcard" type="button" style="--c:var('+r[1]+')" data-v="'+esc(r[2])+'" onclick="pickRes(this)">'+
 '<span class="rtype">'+r[0]+'</span><h3>'+r[2]+'</h3><p>'+r[3]+'</p><span class="meta">'+r[4]+' &rarr;</span></button>';}).join('');}
function pickRes(b){res=b.getAttribute('data-v');go(6);}

function buildCap(){
 var h=document.getElementById('caph'),s=document.getElementById('caps'),u=document.getElementById('urgwrap');
 if(res){h.textContent='Where do I send it?';
  s.innerHTML='Two things and it is on its way. <em>No sequence, no drip, no follow-up you did not ask for.</em>';
  u.style.display='none';}
 else if(path==='intro'){h.textContent='Good. Who sent you?';
  s.innerHTML='A name is enough. Introductions move to the front, <em>that is how this practice works.</em>';
  u.style.display='';document.querySelector('#urgwrap label').textContent='Who sent you';}
 else if(model){h.textContent='Good. Who am I talking to?';
  s.innerHTML='Three things. Then a senior partner comes back with a scoped view, <em>not another discovery call.</em>';
  u.style.display='';}
 else{h.textContent='Where do I send the rest of it?';
  s.innerHTML='Three things. Then I write to you properly about your situation, <em>not a brochure.</em>';
  u.style.display='';}
 var opts=(path==='intro')?REFS:URG;
 document.getElementById('urg').innerHTML=opts.map(function(x){
  return '<button class="pill" type="button" aria-pressed="false" data-v="'+x+'" onclick="pickUrg(this)">'+x+'</button>';}).join('');
}
function pickUrg(b){urg=b.getAttribute('data-v');
 document.querySelectorAll('#urg .pill').forEach(function(p){p.setAttribute('aria-pressed',String(p===b));});}

function send(e){e.preventDefault();
 var fullName=document.getElementById('nm').value.trim();
 var n=fullName.split(' ')[0];
 var email=document.getElementById('em').value.trim();
 var context=document.getElementById('cx').value.trim();
 window.SubmissionClient.post('A','diagnostic',{
  name:fullName,email:email,message:context,
  details:{path:doorLabel(path),category:cat,problem:prob,model:model,resource:res,
   urgency:(path==='intro')?null:urg,referredBy:(path==='intro')?urg:null}
 });
 var dh=document.getElementById('dh'),dn=document.getElementById('dn');
 if(res){dh.textContent='On its way.';
  dn.textContent=n+', it is in your inbox within the hour. Nothing follows it. If it makes you disagree with something, reply to that email and one of us will argue back properly.';}
 else if(model){dh.textContent='Got it. I will read this properly.';
  dn.textContent=n+', this goes to a partner, not a queue. You will hear back inside one business day with a scoped view on '+model+
   (urg==='Right now'?', and we will move at that pace.':'.')+' If we are not the right fit, I will say that plainly rather than book you a call to find out.';}
 else if(path==='intro'){dh.textContent='Understood. You are not in the queue.';
  dn.textContent=n+', introductions come first. A partner replies today or tomorrow, and we will already know why you were sent.';}
 else{dh.textContent='Got it. I will read this properly.';
  dn.textContent=n+', this goes to a partner, not a queue. You will hear back inside one business day about '+
   cat.toLowerCase()+' specifically.'+(urg==='Right now'?' And we will move at that pace.':' No brochure, no sequence.');}
 go(8);return false;}
go(0);

window.go=go;window.door=door;window.pickCat=pickCat;window.pickProb=pickProb;window.pickModel=pickModel;window.pickRes=pickRes;window.pickUrg=pickUrg;window.send=send;window.buildDoors=buildDoors;
})();

function setMode(m){
 if(m!=='A'&&m!=='B')m='A';
 document.getElementById('modeA').classList.toggle('live',m==='A');
 document.getElementById('modeB').classList.toggle('live',m==='B');
 var sa=document.getElementById('mswapA'),sb=document.getElementById('mswapB');
 if(sa)sa.setAttribute('aria-label','Switch to the full site');
 if(sb)sb.setAttribute('aria-label','Switch to the quick route');
 try{localStorage.setItem('sn_mode',m);}catch(e){}
 if(m==='B'&&!location.hash)location.hash='#home';
 if(m==='A'&&window.go&&!window.__aStarted){window.go(0);window.__aStarted=true;}
 window.scrollTo(0,0);
}
(function(){var m='A';try{m=localStorage.getItem('sn_mode')||'A';}catch(e){}
 setMode(m);
 // a mode is never a dead end: Escape always returns to the other one
 document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){var cur=document.getElementById('modeA').classList.contains('live')?'A':'B';
   setMode(cur==='A'?'B':'A');}});
})();


/* ==========================================================================
   EDITABLE CONTENT, every number on this site lives here and nowhere else.
   Backend: replace this object with the response from your CMS or API.
   Nothing below reads a hardcoded figure; the markup only holds fallbacks.
   Figures set 26 Aug 2026 from published 2026 market benchmarks. AVA to confirm.
   ========================================================================== */
window.SN_CONFIG = {
  currency: "USD",
  symbol: "$",
  /* geo-currency (SN-012): detect the visitor's country, show that currency,
     fall back to USD. Requires an FX source and a refresh cadence. */
  geoCurrency: false,

  stats: [
    { id:"shipped",  value:"47+",   label:"Leaders and Founders shipped products with us" },
    { id:"speed",    value:"6 wks", label:"Average idea to live MVP" },
    { id:"years",    value:"40+",   label:"Years combined senior experience" },
    { id:"equity",   value:"0%",    label:"Equity and lock-in. Always." },
    { id:"ip",       value:"100%",  label:"IP stays with you. Always." }
  ],

  pricing: [
    { id:"startup-in-a-box",      amount:45000, prefix:"From ", unit:"/ project" },
    { id:"build-operate-transfer",amount:18000, prefix:"",      unit:"/ month + transfer" },
    { id:"strategic-consulting",  amount:9500,  prefix:"",      unit:"/ month" },
    { id:"shadow-advisory",       amount:4500,  prefix:"From ", unit:"/ month" }
  ]
};


(function(){
 var C=window.SN_CONFIG; if(!C)return;
 function money(n){return C.symbol+n.toLocaleString('en-US');}
 document.querySelectorAll('[data-sn-stat]').forEach(function(el){
  var s=C.stats.filter(function(x){return x.id===el.getAttribute('data-sn-stat');})[0];
  if(!s)return;
  var b=el.querySelector('b'), l=el.querySelector('span');
  if(b)b.textContent=s.value; if(l)l.textContent=s.label;
 });
 document.querySelectorAll('[data-sn-price]').forEach(function(el){
  var p=C.pricing.filter(function(x){return x.id===el.getAttribute('data-sn-price');})[0];
  if(!p)return;
  el.textContent=p.prefix+money(p.amount)+" "+p.unit;
 });
})();
