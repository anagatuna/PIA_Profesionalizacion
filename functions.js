// CUSTOM CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
});
function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx - 18 + 'px';
  ring.style.top = ry - 18 + 'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2.5)'; ring.style.opacity = '0'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.opacity = '0.5'; });
});

// SCROLL PROGRESS
const prog = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// COUNT UP ANIMATION
function countUp(el, target, suffix) {
  let start = 0;
  const step = target / 60;
  const interval = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + suffix; clearInterval(interval); return; }
    el.textContent = Math.floor(start) + suffix;
  }, 20);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const count = parseInt(el.dataset.count);
      const suffix = el.textContent.includes('%') ? '%' : '';
      countUp(el, count, suffix || (el.textContent.includes('%') ? '%' : ''));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  const count = parseInt(el.dataset.count);
  el.textContent = '0' + (el.textContent.includes('%') ? '%' : '');
  statsObserver.observe(el);
});

// SERVICE TABS
function showTab(id, btn) {
  document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.service-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// SMOOTH SCROLL NAV
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// NAVBAR BG on scroll
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').style.background =
    window.scrollY > 50 ? 'rgba(10,20,32,0.97)' : 'rgba(13,27,42,0.85)';
});