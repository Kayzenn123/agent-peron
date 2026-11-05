// motion.js — orkestrator gerak: reduced-motion, mode ringan otomatis, watchdog FPS, toggle manual.
import { setReduced as setTextReduced } from './text.js';
import * as board from './board.js';
import * as marquee from './marquee.js';
import * as camera from './camera.js';
import * as input from './input.js';
import * as reveal from './reveal.js';

const KEY = 'peron-gerak'; // 'nyala' | 'mati'
const destroyers = [];
let ringanOtomatis = false;

function ringan(){
  return document.body.classList.contains('tanpa-gerak');
}
function setRingan(v, alasan){
  document.body.classList.toggle('tanpa-gerak', v);
  setTextReduced(v);
  const btn = document.getElementById('btn-gerak');
  if (btn){ btn.setAttribute('aria-pressed', String(!v)); btn.textContent = v ? 'Gerak: mati' : 'Gerak: nyala'; }
  if (v && alasan) console.info('[peron] mode ringan:', alasan);
}

function deteksiOtomatis(){
  const nav = navigator;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'preferensi OS: reduced-motion';
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return `CPU ${nav.hardwareConcurrency} core`;
  if (nav.deviceMemory && nav.deviceMemory <= 4) return `RAM ${nav.deviceMemory}GB`;
  if (nav.connection && nav.connection.saveData) return 'mode hemat data';
  return null;
}

function watchdog(){
  // kalau FPS < 40 selama 2 jendela 2-detik berturut → mode ringan
  let buruk = 0, frames = 0, t0 = performance.now(), raf;
  const cek = () => {
    frames++;
    const dt = performance.now() - t0;
    if (dt >= 2000){
      const fps = frames / (dt / 1000);
      if (fps < 40 && !ringan()){ if (++buruk >= 2){ setRingan(true, `FPS ${fps.toFixed(0)} < 40`); ringanOtomatis = true; return; } }
      else buruk = 0;
      frames = 0; t0 = performance.now();
    }
    if (!document.hidden) raf = requestAnimationFrame(cek);
    else setTimeout(() => { if (!document.hidden) raf = requestAnimationFrame(cek); }, 1000);
  };
  raf = requestAnimationFrame(cek);
  return () => cancelAnimationFrame(raf);
}

export function init(){
  const manual = localStorage.getItem(KEY);
  const auto = deteksiOtomatis();
  if (manual === 'mati') setRingan(true, 'pilihan pengguna');
  else if (manual === 'nyala') setRingan(false);
  else if (auto){ setRingan(true, auto); ringanOtomatis = true; }
  else setRingan(false);

  document.getElementById('btn-gerak')?.addEventListener('click', () => {
    const v = !ringan();
    localStorage.setItem(KEY, v ? 'mati' : 'nyala');
    setRingan(v, 'toggle manual');
    location.reload(); // terapkan bersih ke semua modul
  });

  destroyers.push(
    board.init(ringan()),
    marquee.init(),
    camera.init(),
    input.init(),
    reveal.init(),
    watchdog(),
  );
  return () => destroyers.forEach(d => d());
}

export function isRingan(){ return ringan(); }
export { setRingan };
