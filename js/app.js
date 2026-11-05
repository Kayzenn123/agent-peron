// app.js — logika PERON: pintu peron, papan, perencana, arsip, deep-link, easter egg.
import { PERON, LINTAS, STASIUN, JADWAL, hitungTarif } from './data.js';
import { init as initMotion } from './motion.js';
import { renderBoard, updateBoard } from './board.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- favorit (localStorage berversi) ---------- */
const FAV_KEY = 'peron-fav-v1';
function loadFav(){
  try {
    const d = JSON.parse(localStorage.getItem(FAV_KEY));
    if (d && d.v === 1 && Array.isArray(d.items)) return d.items;
  } catch {}
  return [];
}
function saveFav(items){
  try { localStorage.setItem(FAV_KEY, JSON.stringify({ v: 1, items })); } catch {}
}
let fav = loadFav();
const favId = (f) => `${f.peron}|${f.jam}|${f.tujuan}`;

/* ---------- pintu peron ---------- */
function renderDoors(){
  const box = $('#doors');
  box.innerHTML = '';
  PERON.forEach(p => {
    const b = document.createElement('button');
    b.className = 'door'; b.dataset.peron = p.nomor;
    b.setAttribute('aria-label', `Masuk peron ${p.nomor}, lintas ${LINTAS[p.lintas].nama}`);
    b.innerHTML = `<span class="lintas" style="--lc:${LINTAS[p.lintas].warna}" aria-hidden="true"></span>${p.nomor}<small>PERON · ${esc(LINTAS[p.lintas].nama)}</small>`;
    b.addEventListener('click', () => pilihPeron(p.nomor, true));
    box.appendChild(b);
  });
}

let peronAktif = 3;
function pilihPeron(n, scroll){
  peronAktif = n;
  const p = PERON.find(x => x.nomor === n);
  const giant = $('#judul-peron');
  giant.textContent = n;
  // reset animasi zoom-through
  giant.style.transform = ''; giant.style.opacity = '';
  $('#peron-sub').textContent = `Peron ${n} · lintas ${LINTAS[p.lintas].nama.toLowerCase()} · ${esc(p.catatan)}`;
  renderStrip(n);
  const url = new URL(location.href);
  url.searchParams.set('peron', n);
  history.replaceState(null, '', url);
  $('#peron').setAttribute('aria-label', `Ruang peron ${n}`);
  if (scroll) $('#peron').scrollIntoView({ behavior: document.body.classList.contains('tanpa-gerak') ? 'auto' : 'smooth' });
}

/* ---------- strip jadwal peron ---------- */
function renderStrip(n){
  const strip = $('#jadwal-strip');
  const rows = JADWAL.filter(j => j.peron === n).slice(0, 8);
  strip.innerHTML = '';
  if (!rows.length){
    strip.innerHTML = `<p class="hint">Sinyal terganggu — belum ada jadwal contoh untuk peron ini. Coba peron lain, ya.</p>`;
    return;
  }
  rows.forEach(j => {
    const id = favId({ peron: n, jam: j.jam, tujuan: j.tujuan });
    const on = fav.some(f => favId(f) === id);
    const k = document.createElement('article');
    k.className = 'kartu';
    k.innerHTML = `
      <button class="fav${on ? ' on' : ''}" aria-pressed="${on}" aria-label="${on ? 'Hapus dari' : 'Simpan ke'} favorit: ${esc(j.tujuan)} ${j.jam}">★</button>
      <p class="k-jam">${esc(j.jam)}</p>
      <h3>${esc(j.tujuan)}</h3>
      <p class="k-meta">${esc(LINTAS[j.lintas].nama)} · ${esc(j.kereta)}</p>
      <p class="k-status ${j.st === 'ok' ? 'st-ok' : j.st === 'warn' ? 'st-warn' : 'st-bad'}">${esc(j.status.toUpperCase())} · contoh</p>`;
    k.querySelector('.fav').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const item = { peron: n, jam: j.jam, tujuan: j.tujuan, lintas: j.lintas, ts: Date.now() };
      if (fav.some(f => favId(f) === id)) fav = fav.filter(f => favId(f) !== id);
      else fav.push(item);
      saveFav(fav);
      const nowOn = fav.some(f => favId(f) === id);
      btn.classList.toggle('on', nowOn); btn.setAttribute('aria-pressed', String(nowOn));
      renderArsip();
      $('#arsip-msg').textContent = nowOn ? 'Tersimpan di kantong petugas.' : 'Dikeluarkan dari kantong.';
    });
    strip.appendChild(k);
  });
}

/* ---------- papan utama: rotasi tiap 20 detik ---------- */
function mulaiRotasi(){
  let i = 0;
  const putar = () => {
    const rows = [];
    for (let k = 0; k < 6; k++) rows.push(JADWAL[(i + k) % JADWAL.length]);
    i = (i + 6) % JADWAL.length;
    updateBoard(rows);
  };
  renderBoard(JADWAL.slice(0, 6));
  setInterval(() => { if (!document.hidden) putar(); }, 20000);
}

/* ---------- perencana ---------- */
function isiSelect(){
  const dari = $('#dari'), ke = $('#ke');
  const opt = (v, t) => `<option value="${esc(v)}">${esc(t)}</option>`;
  let html = '<option value="">— pilih stasiun —</option>';
  for (const [lk, l] of Object.entries(LINTAS)){
    html += `<optgroup label="Lintas ${esc(l.nama)}">` +
      l.stasiun.map(s => opt(`${lk}:${s}`, s)).join('') + '</optgroup>';
  }
  dari.innerHTML = html; ke.innerHTML = html;
}
const HUB = { bogor: 'Manggarai', cikarang: 'Manggarai', tangerang: 'Duri', rangkas: 'Tanah Abang', priok: 'Kampung Bandan' };
function cariRute(dariV, keV, jam){
  const [ld, sd] = dariV.split(':'), [lk, sk] = keV.split(':');
  const [h, m] = jam.split(':').map(Number);
  const t = (plus) => { const d = new Date(2000,0,1,h,m+plus); return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'); };
  const km = ld === lk ? 28 : 46; // contoh
  const tarif = hitungTarif(km);
  const transit = ld === lk ? null : HUB[ld];
  const basis = [
    { plus: 4, dur: ld === lk ? 38 : 64 },
    { plus: 17, dur: ld === lk ? 41 : 71 },
    { plus: 33, dur: ld === lk ? 45 : 79 },
  ];
  return basis.map((b, i) => ({
    berangkat: t(b.plus), tiba: t(b.plus + b.dur), durasi: b.dur, tarif,
    rute: transit ? `${sd} → ${transit} → ${sk}` : `${sd} → ${sk} (langsung)`,
    transit, terbaik: i === 0,
  }));
}
function submitRencana(e){
  e.preventDefault();
  const dariV = $('#dari').value, keV = $('#ke').value, jam = $('#jam').value;
  const err = $('#form-err'), hasil = $('#hasil-rencana');
  const gagal = (m) => { err.hidden = false; err.textContent = m; hasil.innerHTML = ''; };
  if (!dariV || !keV) return gagal('Eits — stasiun asal dan tujuan wajib dipilih. Masinis tidak bisa menebak.');
  if (dariV === keV) return gagal('Asal dan tujuan sama? Keretanya bingung, penumpangnya apalagi. Pilih yang beda, ya.');
  if (!jam) return gagal('Jam berangkatnya diisi dulu — papan tidak bisa meramal.');
  err.hidden = true;
  const opsi = cariRute(dariV, keV, jam);
  hasil.innerHTML = opsi.map(o => `
    <article class="opsi${o.terbaik ? ' terbaik' : ''}">
      ${o.terbaik ? '<span class="badge">TERCEPAT</span>' : ''}
      <h3>${o.berangkat} → ${o.tiba}</h3>
      <dl>
        <dt>Rute</dt><dd>${esc(o.rute)}</dd>
        <dt>Durasi</dt><dd>±${o.durasi} mnt <span class="k-meta">(contoh)</span></dd>
        <dt>Tarif</dt><dd>${o.tarif} <span class="k-meta">(estimasi contoh)</span></dd>
      </dl>
    </article>`).join('') +
    `<p class="hint" style="grid-column:1/-1">Waktu & tarif di atas <b>contoh</b> — cek aplikasi KAI Commuter untuk jadwal resmi. Hasil bisa dibagikan lewat link: <button class="ctl" id="btn-bagi">Salin link</button></p>`;
  const url = new URL(location.href);
  url.searchParams.set('dari', dariV); url.searchParams.set('ke', keV); url.searchParams.set('jam', jam);
  history.replaceState(null, '', url);
  $('#btn-bagi')?.addEventListener('click', async () => {
    const ok = await salin(location.href);
    $('#arsip-msg').textContent = ok ? '' : '';
    err.hidden = false; err.style.color = 'var(--accent)';
    err.textContent = ok ? 'Link perjalanan tersalin. Bagikan ke rombongan!' : 'Gagal menyalin — salin manual dari address bar ya.';
    setTimeout(() => { err.style.color = ''; }, 4000);
  });
}

/* ---------- arsip ---------- */
function renderArsip(){
  const box = $('#arsip-list');
  $('#arsip-empty').style.display = fav.length ? 'none' : '';
  box.innerHTML = '';
  [...fav].sort((a,b) => b.ts - a.ts).forEach(f => {
    const el = document.createElement('div');
    el.className = 'arsip-item';
    el.innerHTML = `<b>P${f.peron}</b><span>${esc(f.jam)} · ${esc(f.tujuan)} · lintas ${esc(LINTAS[f.lintas]?.nama || '')}</span>
      <button class="ctl" data-del="${esc(favId(f))}" aria-label="Hapus favorit ${esc(f.tujuan)}">×</button>`;
    box.appendChild(el);
  });
  $$('#arsip-list [data-del]').forEach(btn => btn.addEventListener('click', () => {
    fav = fav.filter(f => favId(f) !== btn.dataset.del);
    saveFav(fav); renderArsip(); renderStrip(peronAktif);
  }));
}
async function salin(teks){
  try { await navigator.clipboard.writeText(teks); return true; }
  catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = teks; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch { return false; }
  }
}
function ringkasan(){
  if (!fav.length) return 'PERON — belum ada favorit tersimpan.';
  const baris = fav.map(f => `• P${f.peron} ${f.jam} → ${f.tujuan}`).join('\n');
  return `PERON — arsip peron favoritku:\n${baris}\n(jadwal contoh, cek KAI Commuter untuk resmi)`;
}
function initArsip(){
  renderArsip();
  $('#btn-salin').addEventListener('click', async () => {
    const ok = await salin(ringkasan());
    $('#arsip-msg').textContent = ok ? 'Ringkasan tersalin — tempel ke WA, beres.' : 'Gagal menyalin. Izin clipboard ditolak browser.';
  });
  $('#btn-unduh').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ v: 1, diekspor: new Date().toISOString(), items: fav }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'peron-arsip.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    $('#arsip-msg').textContent = 'Arsip diunduh. Simpan baik-baik seperti karcis.';
  });
  let arm = false, timer;
  $('#btn-hapus').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    if (!arm){
      arm = true; btn.textContent = 'Yakin? Klik lagi';
      timer = setTimeout(() => { arm = false; btn.textContent = 'Hapus arsip'; }, 3000);
      return;
    }
    clearTimeout(timer); arm = false; btn.textContent = 'Hapus arsip';
    fav = []; saveFav(fav); renderArsip(); renderStrip(peronAktif);
    $('#arsip-msg').textContent = 'Arsip dikosongkan. Kantong petugas lega.';
  });
}

/* ---------- deep-link ---------- */
function terapkanDeepLink(q){
  const p = parseInt(q.get('peron'), 10);
  if (p >= 1 && p <= 6) pilihPeron(p, false);
  const dari = q.get('dari'), ke = q.get('ke'), jam = q.get('jam');
  if (dari && ke){
    const valid = (v) => { const [lk, s] = String(v).split(':'); return LINTAS[lk] && LINTAS[lk].stasiun.includes(s); };
    if (valid(dari) && valid(ke) && dari !== ke){
      $('#dari').value = dari; $('#ke').value = ke;
      if (/^\d{2}:\d{2}$/.test(jam || '')) $('#jam').value = jam;
      submitRencana(new Event('submit', { cancelable: true }));
    }
  }
}

/* ---------- easter egg ---------- */
function initTelat(){
  let buf = '';
  addEventListener('keydown', (e) => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName || '')) return;
    buf = (buf + e.key.toLowerCase()).slice(-5);
    if (buf === 'telat'){
      buf = '';
      document.body.classList.add('rain');
      $('#arsip-msg').textContent = 'Hujan deras di lintas bogor (drama). Semua kereta telat 10 menit — contoh, jangan panik.';
      setTimeout(() => document.body.classList.remove('rain'), 6000);
    }
  });
  document.addEventListener('peron:lembur', () => {
    document.documentElement.style.setProperty('--accent', 'oklch(0.78 0.16 72)');
    $('#arsip-msg').textContent = 'Mode lembur aktif: papan jadi kuning, petugas jadi lelah. Klik tombol Gerak untuk reset tampilan (reload).';
  });
}

/* ---------- init ---------- */
function init(){
  initMotion();
  renderDoors();
  isiSelect();
  mulaiRotasi();
  const q = new URLSearchParams(location.search); // snapshot: pilihPeron me-replaceState URL
  pilihPeron(peronAktif, false);
  $('#form-rencana').addEventListener('submit', submitRencana);
  initArsip();
  initTelat();
  terapkanDeepLink(q);
  $('#tahun').textContent = new Date().getFullYear();
}
document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
