// data.js — data PERON. Stasiun & warna lintas: KAI Commuter. Tarif: PM 21/2020 via kci.id.
// Jadwal keberangkatan = CONTOH (bukan jadwal resmi), selalu dilabeli di UI.
export const LINTAS = {
  bogor: { nama: 'Bogor', warna: '#e5484d', stasiun: [
    'Jakarta Kota','Jayakarta','Mangga Besar','Sawah Besar','Juanda','Gondangdia','Cikini',
    'Manggarai','Tebet','Cawang','Duren Kalibata','Pasar Minggu','Tanjung Barat','Lenteng Agung',
    'Universitas Indonesia','Pondok Cina','Depok Baru','Depok','Citayam','Bojonggede','Cilebut','Bogor'] },
  cikarang: { nama: 'Cikarang', warna: '#3e8ef7', stasiun: [
    'Cikarang','Metland Telaga Murni','Cibitung','Tambun','Bekasi Timur','Bekasi','Kranji','Cakung',
    'Klender Baru','Buaran','Klender','Jatinegara','Matraman','Manggarai','Sudirman','Karet',
    'Tanah Abang','Duri','Angke','Kampung Bandan','Rajawali','Kemayoran','Pasar Senen',
    'Gang Sentiong','Kramat','Pondok Jati'] },
  tangerang: { nama: 'Tangerang', warna: '#b08d57', stasiun: [
    'Duri','Grogol','Pesing','Taman Kota','Bojong Indah','Rawa Buaya','Kalideres',
    'Poris','Batu Ceper','Tanah Tinggi','Tangerang'] },
  rangkas: { nama: 'Rangkasbitung', warna: '#46a758', stasiun: [
    'Tanah Abang','Palmerah','Kebayoran','Pondok Ranji','Jurangmangu','Sudimara','Rawa Buntu',
    'Serpong','Cisauk','Cicayur','Parung Panjang','Cilejit','Daru','Tenjo','Tigaraksa',
    'Cikoya','Maja','Citeras','Rangkasbitung'] },
  priok: { nama: 'Tanjung Priok', warna: '#e57bb1', stasiun: [
    'Jakarta Kota','Kampung Bandan','Ancol','Tanjung Priok'] },
};
export const STASIUN = Object.values(LINTAS).flatMap(l => l.stasiun);

export const PERON = [
  { nomor: 1, lintas: 'bogor', catatan: 'jalur selatan' },
  { nomor: 2, lintas: 'bogor', catatan: 'jalur utara' },
  { nomor: 3, lintas: 'cikarang', catatan: 'jalur loop' },
  { nomor: 4, lintas: 'tangerang', catatan: 'jalur barat' },
  { nomor: 5, lintas: 'rangkas', catatan: 'jalur barat daya' },
  { nomor: 6, lintas: 'priok', catatan: 'jalur pelabuhan' },
];

// CONTOH — 4 keberangkatan per peron
export const JADWAL = [
  { jam:'05:12', tujuan:'Bogor', peron:1, lintas:'bogor', kereta:'KRL 4101', status:'berangkat', st:'ok' },
  { jam:'05:31', tujuan:'Bogor', peron:1, lintas:'bogor', kereta:'KRL 4105', status:'berangkat', st:'ok' },
  { jam:'05:58', tujuan:'Depok', peron:1, lintas:'bogor', kereta:'KRL 4111', status:'terlambat 8 mnt', st:'warn' },
  { jam:'06:20', tujuan:'Bogor', peron:1, lintas:'bogor', kereta:'KRL 4117', status:'berangkat', st:'ok' },
  { jam:'05:20', tujuan:'Jakarta Kota', peron:2, lintas:'bogor', kereta:'KRL 4102', status:'berangkat', st:'ok' },
  { jam:'05:44', tujuan:'Jakarta Kota', peron:2, lintas:'bogor', kereta:'KRL 4108', status:'berangkat', st:'ok' },
  { jam:'06:05', tujuan:'Jakarta Kota', peron:2, lintas:'bogor', kereta:'KRL 4114', status:'batal', st:'bad' },
  { jam:'06:32', tujuan:'Jakarta Kota', peron:2, lintas:'bogor', kereta:'KRL 4120', status:'berangkat', st:'ok' },
  { jam:'05:25', tujuan:'Cikarang', peron:3, lintas:'cikarang', kereta:'KRL 5201', status:'berangkat', st:'ok' },
  { jam:'05:52', tujuan:'Bekasi', peron:3, lintas:'cikarang', kereta:'KRL 5207', status:'berangkat', st:'ok' },
  { jam:'06:15', tujuan:'Cikarang', peron:3, lintas:'cikarang', kereta:'KRL 5213', status:'terlambat 5 mnt', st:'warn' },
  { jam:'06:41', tujuan:'Kampung Bandan', peron:3, lintas:'cikarang', kereta:'KRL 5219', status:'berangkat', st:'ok' },
  { jam:'05:35', tujuan:'Tangerang', peron:4, lintas:'tangerang', kereta:'KRL 6201', status:'berangkat', st:'ok' },
  { jam:'06:02', tujuan:'Tangerang', peron:4, lintas:'tangerang', kereta:'KRL 6205', status:'berangkat', st:'ok' },
  { jam:'06:28', tujuan:'Duri', peron:4, lintas:'tangerang', kereta:'KRL 6209', status:'berangkat', st:'ok' },
  { jam:'06:55', tujuan:'Tangerang', peron:4, lintas:'tangerang', kereta:'KRL 6213', status:'terlambat 12 mnt', st:'warn' },
  { jam:'05:40', tujuan:'Rangkasbitung', peron:5, lintas:'rangkas', kereta:'KRL 7201', status:'berangkat', st:'ok' },
  { jam:'06:10', tujuan:'Serpong', peron:5, lintas:'rangkas', kereta:'KRL 7207', status:'berangkat', st:'ok' },
  { jam:'06:38', tujuan:'Rangkasbitung', peron:5, lintas:'rangkas', kereta:'KRL 7213', status:'berangkat', st:'ok' },
  { jam:'07:05', tujuan:'Tanah Abang', peron:5, lintas:'rangkas', kereta:'KRL 7219', status:'batal', st:'bad' },
  { jam:'05:50', tujuan:'Tanjung Priok', peron:6, lintas:'priok', kereta:'KRL 8101', status:'berangkat', st:'ok' },
  { jam:'06:18', tujuan:'Jakarta Kota', peron:6, lintas:'priok', kereta:'KRL 8105', status:'berangkat', st:'ok' },
  { jam:'06:47', tujuan:'Tanjung Priok', peron:6, lintas:'priok', kereta:'KRL 8111', status:'berangkat', st:'ok' },
  { jam:'07:12', tujuan:'Ancol', peron:6, lintas:'priok', kereta:'KRL 8115', status:'terlambat 6 mnt', st:'warn' },
];

/** Tarif resmi: Rp3.000 untuk 25 km pertama + Rp1.000 per 10 km berikutnya. */
export function hitungTarif(km){
  const rp = km <= 25 ? 3000 : 3000 + Math.ceil((km - 25) / 10) * 1000;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rp);
}
