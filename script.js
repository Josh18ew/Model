const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const nav = $('#nav');
const progress = $('#progress');
const topBtn = $('#topBtn');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  topBtn.classList.toggle('show', y > 700);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
}, {passive:true});

topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
menuBtn.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const sections = $$('main section[id]');
const navLinks = $$('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s => observer.observe(s));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      if(entry.target.classList.contains('skill')) entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    if(!Number.isFinite(target)) return;
    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    function tick(now){
      const p = Math.min(1, (now-startTime)/duration);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = Math.floor(target*eased);
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, {threshold:.7});
$$('[data-count]').forEach(el => countObserver.observe(el));

$$('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
      if(show){
        card.animate(
          [{opacity:0, transform:'translateY(15px)'},{opacity:1, transform:'translateY(0)'}],
          {duration:450, easing:'cubic-bezier(.16,1,.3,1)'}
        );
      }
    });
  });
});

const modal = $('#projectModal');
const modalTitle = $('#modalTitle');
const modalDescription = $('#modalDescription');
$$('.project-open').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.currentTarget.closest('.project-card');
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  });
});
$$('[data-close]').forEach(el => el.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}));
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
});

const form = $('#contactForm');
const toast = $('#toast');
form.addEventListener('submit', e => {
  e.preventDefault();
  if(!form.checkValidity()){ form.reportValidity(); return; }
  form.reset();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
});

if(window.matchMedia('(pointer:fine)').matches){
  const dot = $('#cursorDot'), ring = $('#cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  function cursorLoop(){
    rx += (mx-rx)*.16; ry += (my-ry)*.16;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
  $$('a,button,.project-card,.info-card,.skill').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
}

$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.16;
    const y=(e.clientY-r.top-r.height/2)*.16;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

const heroVisual = $('.hero-visual');
window.addEventListener('mousemove', e => {
  if(!heroVisual || window.innerWidth < 900) return;
  const x=(e.clientX/window.innerWidth-.5)*8;
  const y=(e.clientY/window.innerHeight-.5)*8;
  heroVisual.style.transform=`translate(${x}px,${y}px)`;
}, {passive:true});
