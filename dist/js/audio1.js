const AudioManager = (() => {
  const sfx = {};
  let bgMusic = null;
  let audioUnlocked = false;

  // ✅ Set detik berapa musik mulai (ubah angka ini)
  const MUSIC_START_TIME = 60 + 60 + 49; 
  // detik ke-0, ganti misal 10 buat skip ke detik 10

  function init() {
    sfx.kertas = document.getElementById('sfxKertas');
    sfx.angin = document.getElementById('sfxAngin');
    sfx.tiupan = document.getElementById('sfxTiupan');
    bgMusic = document.getElementById('bgMusic');

    if (bgMusic) {
      bgMusic.volume = 0.8;
    }

    const unlockAudio = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;

      Object.values(sfx).forEach(s => {
        if (s) {
          s.play()
            .then(() => {
              s.pause();
              s.currentTime = 0;
            })
            .catch(() => {});
        }
      });

      if (bgMusic) {
        bgMusic.currentTime = MUSIC_START_TIME; // ✅ skip ke detik tertentu
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
