/* =============================================
   main.js — Bootstrap all modules
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  AudioManager.init();
  fadeManager.init();
  CandleManager.init();
  SuratManager.init();
  PiguraManager.init();
  IntroManager.init(); // ← tambah ini
});
