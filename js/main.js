/* =============================================
   main.js — Bootstrap all modules
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  AudioManager.init();
  FadeManager.init();
  CandleManager.init();
  SuratManager.init();
  PiguraManager.init();
  IntroManager.init(); // ← tambah ini
});
