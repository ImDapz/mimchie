/* =============================================
   audio.js — Sound manager
   ============================================= */

const AudioManager = (() => {
  const sfx = {};
  let bgMusic = null;
  let audioUnlocked = false;

  function init() {
    sfx.kertas = document.getElementById('sfxKertas');
    sfx.angin = document.getElementById('sfxAngin');
    sfx.tiupan = document.getElementById('sfxTiupan');
    bgMusic = document.getElementById('bgMusic');

    if (bgMusic) {
      bgMusic.volume = 0.3;
    }

    // Unlock audio on first user interaction
    const unlockAudio = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;

      // Play and immediately pause all audio to unlock on iOS
      Object.values(sfx).forEach(s => {
        if (s) {
          s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(() => {});
        }
      });

      // Start background music
      if (bgMusic) {
        bgMusic.play().catch(() => {});
      }

      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
  }

  function play(name) {
    const sound = sfx[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  return { init, play };
})();
