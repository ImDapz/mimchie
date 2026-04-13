/* =============================================
   main.js — Bootstrap all modules
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Init audio first (needs to be ready for other modules)
  AudioManager.init();

  // Fade in from black
  FadeManager.init();

  // Interactive modules
  CandleManager.init();
  SuratManager.init();
  PiguraManager.init();
});
