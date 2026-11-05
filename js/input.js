// input.js — strip jadwal: drag + inertia flick (pointer events, touch-action pan-y).
// Klik pada tombol di dalam strip TIDAK boleh mati: capture hanya setelah drag > 8px,
// dan klik setelah drag disuppress via capture listener.
export function init(){
  const strip = document.getElementById('jadwal-strip');
  if (!strip) return () => {};
  let down = false, dragged = false, sx = 0, sl = 0, vx = 0, lastX = 0, raf = 0, momentum = false;

  strip.addEventListener('pointerdown', (e) => {
    down = true; dragged = false; sx = lastX = e.clientX; sl = strip.scrollLeft; vx = 0;
    momentum = false; cancelAnimationFrame(raf);
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    if (Math.abs(e.clientX - sx) > 8) dragged = true;
    if (dragged){
      strip.scrollLeft = sl - (e.clientX - sx);
      vx = vx * 0.7 + dx * 0.3;
    }
  });
  const up = () => {
    if (!down) return; down = false;
    if (!dragged || document.body.classList.contains('tanpa-gerak')) return;
    momentum = true;
    const step = () => {
      if (!momentum) return;
      strip.scrollLeft -= vx; vx *= 0.94;
      if (Math.abs(vx) > 0.4) raf = requestAnimationFrame(step);
      else momentum = false;
    };
    raf = requestAnimationFrame(step);
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  // suppress klik yang merupakan akhir dari drag
  strip.addEventListener('click', (e) => {
    if (dragged){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  // keyboard: panah kiri/kanan menggeser strip
  strip.setAttribute('tabindex', '0');
  strip.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight'){ strip.scrollBy({ left: 320, behavior: 'smooth' }); e.preventDefault(); }
    if (e.key === 'ArrowLeft'){ strip.scrollBy({ left: -320, behavior: 'smooth' }); e.preventDefault(); }
  });
  return () => { momentum = false; cancelAnimationFrame(raf); };
}
