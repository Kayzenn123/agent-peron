// camera.js — zoom-through: angka raksasa jadi "pintu" (scroll-scrubbed, transform only).
export function init(){
  const doors = [...document.querySelectorAll('[data-door]')];
  if (!doors.length) return () => {};
  let raf = 0, running = true;
  const render = () => {
    const vh = innerHeight;
    for (const el of doors){
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2){ continue; }
      // p: 0 saat angka di bawah layar, 1 saat mencapai tengah
      const p = Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (vh * 0.75)));
      const e = p * p;
      const scale = 1 + e * 26;
      el.style.transform = `scale(${scale.toFixed(3)})`;
      el.style.opacity = (1 - Math.pow(p, 3) * 0.92).toFixed(3);
      el.style.willChange = 'transform,opacity';
    }
    if (running && !document.body.classList.contains('tanpa-gerak')) raf = requestAnimationFrame(render);
    else running = false;
  };
  const start = () => { if (!running){ running = true; raf = requestAnimationFrame(render); } };
  // reset saat mode gerak dimatikan
  new MutationObserver(() => {
    if (document.body.classList.contains('tanpa-gerak')){
      doors.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
    } else start();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  raf = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  return () => { running = false; cancelAnimationFrame(raf); };
}
