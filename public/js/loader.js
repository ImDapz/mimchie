/* =============================================
   loader.js — Menunggu aset kritis siap sebelum
   "tap anywhere" diaktifkan.

   Prioritas: HANYA bgMusic yang diwajibkan siap.
   Voice (luna.ogg dkk) sengaja TIDAK dimasukkan di sini —
   dia sudah lazy-load sendiri (baru fetch pas telepon diangkat),
   jadi tidak boleh ikut menghambat start.

   Kalau nanti mau nambah aset kritis lain (misal sfxRinging
   supaya dering pertama juga mulus), tinggal tambah id-nya
   di array CRITICAL_IDS di bawah.
   ============================================= */

const LoaderManager = (() => {

  const CRITICAL_IDS = ['bgMusic'];

  // Kalau canplaythrough tidak pernah kepicu (misal koneksi jelek),
  // jangan sampai user macet selamanya — paksa lanjut setelah ini.
  const FORCE_READY_TIMEOUT_MS = 15000;

  let readyCount = 0;
  let totalCount = 0;
  let isReady = false;
  let onReadyCallback = null;
  let forceTimer = null;

  function init(onReady) {
    onReadyCallback = onReady;

    const elements = CRITICAL_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean);

    totalCount = elements.length;

    if (totalCount === 0) {
      markReady();
      return;
    }

    elements.forEach(el => {
      // readyState 4 = HAVE_ENOUGH_DATA, sudah cukup buat diputar penuh
      if (el.readyState >= 4) {
        markOneReady();
      } else {
        el.addEventListener('canplaythrough', markOneReady, { once: true });
        el.load();
      }
    });

    forceTimer = setTimeout(() => {
      console.warn('LoaderManager: timeout, lanjut paksa walau aset belum sepenuhnya siap.');
      markReady();
    }, FORCE_READY_TIMEOUT_MS);
  }

  function markOneReady() {
    readyCount++;
    if (readyCount >= totalCount) markReady();
  }

  function markReady() {
    if (isReady) return;
    isReady = true;
    if (forceTimer) clearTimeout(forceTimer);
    if (onReadyCallback) onReadyCallback();
  }

  function ready() {
    return isReady;
  }

  return { init, ready };
})();
