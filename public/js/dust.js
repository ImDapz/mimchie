/* =============================================
   dust.js — Partikel debu melayang
   - Disebar acak ke seluruh scene
   - Yang kelihatan cuma yang "kena cahaya lampu" —
     ini ditangani lewat CSS mask di base.css/dust.css,
     bukan di sini. File ini cuma nyebar partikelnya.
   - Adjust semua nilai di HARDCODE DI SINI di bawah.
   ============================================= */

const DustManager = (() => {

  /* ============ HARDCODE DI SINI ============ */

  const DUST_COUNT = 80;          // jumlah partikel debu
  const DUST_SIZE_MIN = 1;        // px, ukuran partikel terkecil
  const DUST_SIZE_MAX = 3;        // px, ukuran partikel terbesar
  const DUST_SPEED_MIN = 8;       // detik, durasi 1 siklus melayang tercepat
  const DUST_SPEED_MAX = 18;      // detik, durasi 1 siklus melayang terlambat
  const DUST_DRIFT_X_RANGE = 25;  // px, seberapa jauh geser kiri-kanan
  const DUST_DRIFT_Y_RANGE = 55;  // px, seberapa jauh geser naik

  /* ============================================ */

  function init() {
    const layer = document.getElementById('dustLayer');
    if (!layer) return;

    for (let i = 0; i < DUST_COUNT; i++) {
      layer.appendChild(createParticle());
    }
  }

  function createParticle() {
    const el = document.createElement('div');
    el.className = 'dust-particle';

    const size = rand(DUST_SIZE_MIN, DUST_SIZE_MAX);
    const duration = rand(DUST_SPEED_MIN, DUST_SPEED_MAX);
    const delay = rand(0, DUST_SPEED_MAX); // biar gak semua mulai bareng
    const driftX = rand(-DUST_DRIFT_X_RANGE, DUST_DRIFT_X_RANGE);
    const driftY = -rand(DUST_DRIFT_Y_RANGE * 0.4, DUST_DRIFT_Y_RANGE); // selalu naik (negatif)

    el.style.left = `${rand(0, 100)}%`;
    el.style.top = `${rand(0, 100)}%`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `-${delay}s`; // negatif = seolah sudah jalan sebagian
    el.style.setProperty('--drift-x', `${driftX}px`);
    el.style.setProperty('--drift-y', `${driftY}px`);

    return el;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  return { init };
})();
