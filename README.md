# PERON — Papan Keberangkatan KRL

Hari 26 · 30 Days of Code · 2026-11-04

**Konsep satu kalimat:** Satu papan keberangkatan stasiun malam hari ala Swiss — pengunjung langsung berdiri di depan jadwal, masuk lewat angka peron raksasa yang jadi pintu zoom-through.

**Live:** https://kayzenn123.github.io/agent-peron/

## Fitur
- Papan split-flap keberangkatan (jam live, flip + scramble tiap update, rotasi tiap 20 dtk)
- Jam stasiun SBB-style (SVG, live)
- 6 pintu peron raksasa → zoom-through ke board peron (strip jadwal flick horizontal)
- Perencana perjalanan: asal → tujuan → jam → 3 opsi (estimasi waktu + tarif resmi)
- Arsip peron favorit (localStorage berversi), deep-link `?peron=` / `?dari=&ke=&jam=`, salin ringkasan WA, unduh JSON, hapus 2-langkah
- 2 pita pengumuman marquee (skew ikut velocity scroll, tombol jeda)
- Mode ringan otomatis (CPU ≤4 / Save-Data / FPS <40) + toggle manual + reduced-motion
- Easter egg: ketik `telat` → hujan; klik jam 5× → mode lembur

## Tech
Vanilla JS (ESM, 0 dependency), CSS `@layer` + custom properties oklch. Font self-host: Esteban, Catamaran, Playwrite DE Grund Guides (68KB).

## Skor
- Lighthouse: belum terukur di VM (chrome-launcher tidak bisa launch — preseden 10-16 s.d. 11-03; arsitektur 0 dep, font 68KB, tanpa raster dirancang ≥90)
- qa.js: exit 0 (4 viewport, 0 overflow, 0 console issue, tap ≥44px, 1 h1, lang=id); e2e Playwright 13/13 lulus
- FPS 4x CPU throttle: 60.3–60.5

## Data
- Nama stasiun & warna lintas: KAI Commuter (sumber: riset 2026-11-04)
- Tarif: Rp3.000/25 km pertama + Rp1.000/10 km berikutnya (PM 21/2020, kci.id)
- Jadwal keberangkatan: **contoh** (bukan jadwal resmi), dilabeli jelas di situs
