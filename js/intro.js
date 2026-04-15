/* =============================================
   intro.js — Black screen intro with word sequence
   ============================================= */

const IntroManager = (() => {

  // ✏️ EDIT KATA DI SINI
  const words = [
    "hiiiiii yumkii",
    "ini itu cuman test",
    "plis jangan main free fire",
  ];

  // ⏱️ DURASI (detik)
  const WORDS_DURATION = 5;         // durasi tiap kata
  const fade_in  = WORDS_DURATION / 4;   // 1.25s
  const fade_out = WORDS_DURATION / 4;   // 1.25s
  const totalDuration = words.length * WORDS_DURATION * 1000; // ms

  let started = false;

  function init() {
    const screen = document.getElementById('intro-screen');
    if (!screen) return;

    const startHandler = () => {
      if (started) return;
      started = true;

      // Sembunyikan hint
      const hint = document.getElementById('intro-tap-hint');
      if (hint) hint.style.display = 'none';

      // Mulai sequence kata
      runSequence();

      // Mulai musik dengan offset waktu intro
      if (typeof AudioManager !== 'undefined') {
        AudioManager.startWithOffset(totalDuration / 1000);
      }

      screen.removeEventListener('click', startHandler);
      screen.removeEventListener('touchend', startHandler);
    };

    screen.addEventListener('click', startHandler);
    screen.addEventListener('touchend', (e) => {
      e.preventDefault();
      startHandler();
    });
  }

  function runSequence() {
    const textEl = document.getElementById('intro-text');
    if (!textEl) return;

    let index = 0;

    function showNext() {
      if (index >= words.length) {
        // Semua kata selesai → tutup intro
        const screen = document.getElementById('intro-screen');
        if (screen) screen.classList.add('hidden');
        return;
      }

      textEl.textContent = words[index];

      // Fade in
      textEl.style.transitionDuration = `${fade_in}s`;
      textEl.style.opacity = '1';

      // Tahan → fade out
      setTimeout(() => {
        textEl.style.transitionDuration = `${fade_out}s`;
        textEl.style.opacity = '0';

        // Tunggu fade out selesai → kata berikutnya
        setTimeout(() => {
          index++;
          showNext();
        }, fade_out * 1000);

      }, (WORDS_DURATION - fade_out) * 1000);
    }

    showNext();
  }

  return { init };
})();
