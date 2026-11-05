// marquee.js — 2 pita pengumuman berlawanan arah + skew velocity + tombol jeda.
const PESAN_A = [
  'perhatian, perhatian', 'kereta siap diberangkatkan', 'dahulukan penumpang yang turun',
  'jaga barang bawaan anda', 'dilarang duduk di lantai peron',
];
const PESAN_B = [
  'tap kartu sebelum & sesudah naik', 'kursi prioritas untuk yang membutuhkan',
  'dilarang makan & minum di dalam kereta', 'laporkan barang tertinggal ke petugas',
];
const IKON_A = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" filter="url(#goyang)" aria-hidden="true"><path d="M3 11v3l4 .5V10L3 11zM7 10h11l3-2v9l-3-2H7v-5zM18 8a4 4 0 010 8"/></svg>';
const IKON_B = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" filter="url(#goyang)" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';

function isi(track, pesan, ikon){
  const half = pesan.map(p =>
    `<span class="pita-item">${ikon}<span>${p}</span></span>`).join('');
  track.innerHTML = half + half; // 2x untuk loop mulus
}

export function init(){
  const a = document.getElementById('pita-a'), b = document.getElementById('pita-b');
  const pita = document.querySelector('.pita');
  const btn = document.getElementById('btn-jeda');
  if (!a || !b) return () => {};
  isi(a, PESAN_A, IKON_A); isi(b, PESAN_B, IKON_B);

  let lastY = scrollY, vel = 0, raf = 0, running = true;
  const loop = () => {
    const y = scrollY, v = y - lastY; lastY = y;
    vel += (v - vel) * 0.12;
    const skew = Math.max(-14, Math.min(14, vel * 0.55));
    document.documentElement.style.setProperty('--skew', skew.toFixed(2) + 'deg');
    if (running && !document.body.classList.contains('tanpa-gerak')) raf = requestAnimationFrame(loop);
    else running = false;
  };
  const start = () => { if (!running){ running = true; lastY = scrollY; raf = requestAnimationFrame(loop); } };
  raf = requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => document.hidden ? null : start());

  const setPaused = (p) => {
    pita.classList.toggle('paused', p);
    btn.setAttribute('aria-pressed', String(p));
    btn.textContent = p ? 'Jalankan pita' : 'Jeda pita';
  };
  btn.addEventListener('click', () => setPaused(!pita.classList.contains('paused')));
  return () => { running = false; cancelAnimationFrame(raf); };
}
