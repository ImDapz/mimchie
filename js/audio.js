const AudioManager = (() => {
  const sfx = {};
  let bgMusic = null;
  let audioUnlocked = false;
  const MUSIC_START_TIME = 60+60+60+5;

  const VOLUME_KEYFRAMES = [
    { time: 0,   volume: 0.3 },
    { time: 15,  volume: 1 },
  ];

  function getVolumeAt(time) {
    for (let i = 0; i < VOLUME_KEYFRAMES.length - 1; i++) {
      const a = VOLUME_KEYFRAMES[i];
      const b = VOLUME_KEYFRAMES[i + 1];
      if (time >= a.time && time <= b.time) {
        const t = (time - a.time) / (b.time - a.time);
        return a.volume + (b.volume - a.volume) * t;
      }
    }
    return VOLUME_KEYFRAMES[VOLUME_KEYFRAMES.length - 1].volume;
  }

	function init() {
	  sfx.kertas = document.getElementById('sfxKertas');
	  sfx.angin  = document.getElementById('sfxAngin');
	  sfx.tiupan = document.getElementById('sfxTiupan');
	  bgMusic    = document.getElementById('bgMusic');

	  if (bgMusic) {
	    bgMusic.volume = 0.3;
	    bgMusic.addEventListener('timeupdate', () => {
	      bgMusic.volume = getVolumeAt(bgMusic.currentTime);
	    });
	  }

	  // Fallback: jika musik belum jalan setelah intro selesai,
	  // unlock saat user tap di mana saja
	  const fallbackUnlock = () => {
	    if (!audioUnlocked) {
	      startWithOffset(0);
	    }
	    document.removeEventListener('click', fallbackUnlock);
	    document.removeEventListener('touchend', fallbackUnlock);
	  };
	  document.addEventListener('click', fallbackUnlock);
	  document.addEventListener('touchend', fallbackUnlock);
	}
  function play(name) {
    const sound = sfx[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function startWithOffset(introDurationSeconds) {
    if (audioUnlocked) return;
    audioUnlocked = true;
    Object.values(sfx).forEach(s => {
      if (s) s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(() => {});
    });
    if (bgMusic) {
      bgMusic.currentTime = Math.max(0, MUSIC_START_TIME - introDurationSeconds);
      bgMusic.play().catch(() => {});
    }
  }

  return { init, play, startWithOffset };
})();
