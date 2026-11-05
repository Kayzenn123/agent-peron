// text.js — scramble/decode ala papan elektronik. Hormat reduced-motion & mode ringan.
const GLYPH = '█▓▒░<>/\\|─01';
let reduced = false;
export function setReduced(v){ reduced = v; }
/** Ubah teks el menjadi next dengan efek decode. */
export function scramble(el, next, dur = 500){
  const from = el.textContent ?? '';
  if (reduced || from === next){ el.textContent = next; return; }
  const len = Math.max(from.length, next.length);
  const t0 = performance.now();
  let raf;
  const tick = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const n = Math.floor(p * len);
    let out = '';
    for (let i = 0; i < len; i++){
      const c = next[i] ?? ' ';
      out += i < n ? c : (c === ' ' ? ' ' : GLYPH[(Math.random()*GLYPH.length)|0]);
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = next;
  };
  cancelAnimationFrame(el._scr);
  el._scr = requestAnimationFrame(tick);
}
export function init(){ return () => {}; }
