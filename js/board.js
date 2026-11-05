// board.js — jam stasiun SBB + papan split-flap.
import { scramble, setReduced } from './text.js';

const $ = (s, r = document) => r.querySelector(s);

function initClock(){
  const ticks = $('#clock-ticks');
  for (let i = 0; i < 60; i++){
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0;
    const r1 = big ? 38 : 42, r2 = 45;
    const l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1', 50 + r1*Math.sin(a)); l.setAttribute('y1', 50 - r1*Math.cos(a));
    l.setAttribute('x2', 50 + r2*Math.sin(a)); l.setAttribute('y2', 50 - r2*Math.cos(a));
    if (big) l.setAttribute('stroke-width', '3.5');
    ticks.appendChild(l);
  }
  const jH = $('#jarum-jam'), jM = $('#jarum-menit'), jD = $('#jarum-detik'), dig = $('#clock-digital');
  const wrap = $('.clock-wrap');
  let clicks = 0, lastReset = 0;
  wrap.style.cursor = 'pointer'; wrap.title = 'jam stasiun';
  wrap.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastReset > 2500) clicks = 0;
    lastReset = now; clicks++;
    if (clicks === 5){ clicks = 0; document.dispatchEvent(new CustomEvent('peron:lembur')); }
  });
  function tick(){
    const n = new Date();
    const s = n.getSeconds() + n.getMilliseconds()/1000;
    const m = n.getMinutes() + s/60, h = (n.getHours()%12) + m/60;
    jD.setAttribute('transform', `rotate(${s*6} 50 50)`);
    jM.setAttribute('transform', `rotate(${m*6} 50 50)`);
    jH.setAttribute('transform', `rotate(${h*30} 50 50)`);
    const t = n.toTimeString().slice(0,8);
    if (dig.textContent !== t) scramble(dig, t, 300);
    setTimeout(tick, 250);
  }
  tick();
}

// Papan split-flap: baris = {jam, tujuan, peron, lintas, status, st}
const STCLS = { ok:'st-ok', warn:'st-warn', bad:'st-bad' };
export function renderBoard(rows){
  const box = $('#flap-rows');
  box.innerHTML = '';
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'flap-row'; row.setAttribute('role','row');
    row.innerHTML = `
      <span class="flap-cell flap-jam" role="cell"></span>
      <span class="flap-cell flap-tujuan" role="cell"></span>
      <span class="flap-cell flap-peron" role="cell"></span>
      <span class="flap-cell flap-status" role="cell"></span>`;
    const [cJ, cT, cP, cS] = row.children;
    setCell(cJ, r.jam, true); setCell(cT, r.tujuan, true);
    setCell(cP, 'P' + r.peron, true);
    setCell(cS, r.status.toUpperCase(), true);
    cS.classList.add(STCLS[r.st] || 'st-ok');
    cP.style.setProperty('--lc', r.warna || '#888');
    row._data = r;
    box.appendChild(row);
  });
}
function setCell(cell, text, instant){
  if (cell.textContent === text) return;
  if (instant || document.body.classList.contains('tanpa-gerak')){ cell.textContent = text; return; }
  const w = document.createElement('span');
  w.className = 'flap'; w.innerHTML = `<span class="flap-inner">${cell.textContent}</span>`;
  cell.textContent = '';
  cell.appendChild(w);
  const inner = w.firstChild;
  inner.classList.add('flip');
  w.classList.add('flip');
  setTimeout(() => { scramble(cell, text, 350); }, 200);
  setTimeout(() => { if (w.parentNode) w.replaceWith(document.createTextNode(text)); cell.textContent = text; }, 520);
}
export function updateBoard(rows){
  const box = $('#flap-rows');
  [...box.children].forEach((row, i) => {
    const r = rows[i % rows.length];
    const [cJ, cT, cP, cS] = row.children;
    setCell(cJ, r.jam); setCell(cT, r.tujuan);
    setCell(cP, 'P' + r.peron);
    const ns = r.status.toUpperCase();
    if (cS.textContent !== ns){ setCell(cS, ns); cS.className = 'flap-cell flap-status ' + (STCLS[r.st] || 'st-ok'); }
  });
}

export function init(reduced){ setReduced(reduced); initClock(); return () => {}; }
