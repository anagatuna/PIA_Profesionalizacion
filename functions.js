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

// CARRUSEL DE RESEÑAS 
(function () {
  const track      = document.getElementById('reviewsTrack');
  const prevBtn    = document.getElementById('reviewPrev');
  const nextBtn    = document.getElementById('reviewNext');
  const dotsEl     = document.getElementById('reviewDots');

  if (!track || !prevBtn || !nextBtn) return;

  const CARD_TOTAL = 5;          // tarjetas reales (sin duplicados)
  const GAP        = 24;         // gap en px (1.5rem)
  let   current    = 0;
  let   autoTimer  = null;
  let   cardWidth  = 0;

  // Calcula el ancho de una card en tiempo real
  function getCardWidth() {
    const card = track.querySelector('.review-card');
    return card ? card.offsetWidth + GAP : 364;
  }

  // Cuántas cards caben en pantalla
  function visibleCount() {
    const wrapper = track.parentElement;
    return Math.max(1, Math.floor(wrapper.offsetWidth / getCardWidth()));
  }

  function goTo(index) {
    cardWidth = getCardWidth();
    current   = Math.max(0, Math.min(index, CARD_TOTAL - 1));
    track.style.transform = `translateX(-${current * cardWidth}px)`;

    // Dots
    const dots = dotsEl.querySelectorAll('.rdot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current < CARD_TOTAL - 1 ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : CARD_TOTAL - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  // Dots click
  dotsEl.querySelectorAll('.rdot').forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Auto-play
  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  // Pausa al hacer hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', startAuto);

  // Swipe táctil
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });

  // Teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  // Recalcular al cambiar tamaño de ventana
  window.addEventListener('resize', () => { goTo(current); });

  // Init
  goTo(0);
  startAuto();
})();