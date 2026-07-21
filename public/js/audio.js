const AudioManager = (() => {
  const sfx = {};
  let bgMusic = null;
  let audioUnlocked = false;
  let duckFactor = 1.0; // 1 = normal, 0.3 = 30% volume
  let duckTween = null;
  /*const MUSIC_START_TIME = 60+60+10;*/
  const MUSIC_START_TIME = 51.8;
  /*const MUSIC_START_TIME = 60+19;*/

  const VOLUME_KEYFRAMES = [
    { time: MUSIC_START_TIME-25,   volume: 0.0 },
    { time: MUSIC_START_TIME-20,  volume: 0.15},
    { time: MUSIC_START_TIME-10,  volume: 0.3},
    { time: MUSIC_START_TIME-0.5,  volume: 0.3}, 
    /*{ time: MUSIC_START_TIME+2,  volume: 1 },*/
    { time: MUSIC_START_TIME,  volume: 0.6 },
  ];

  let volumeLocked = false;
  let lockedVolume = 0.6;
  
  function getVolumeAt(time) {
    if (volumeLocked) return lockedVolume;
  
    if (time <= VOLUME_KEYFRAMES[0].time) {
      return VOLUME_KEYFRAMES[0].volume;
    }
  
    for (let i = 0; i < VOLUME_KEYFRAMES.length - 1; i++) {
      const a = VOLUME_KEYFRAMES[i];
      const b = VOLUME_KEYFRAMES[i + 1];
  
      if (time >= a.time && time <= b.time) {
        const t = (time - a.time) / (b.time - a.time);
        return a.volume + (b.volume - a.volume) * t;
      }
    }
  
    // selesai fade → lock
    volumeLocked = true;
    lockedVolume = VOLUME_KEYFRAMES[VOLUME_KEYFRAMES.length - 1].volume;
  
    return lockedVolume;
  }
	function init() {
	  sfx.kertas = document.getElementById('sfxKertas');
	  sfx.angin  = document.getElementById('sfxAngin');
	  sfx.tiupan = document.getElementById('sfxTiupan');
	  bgMusic    = document.getElementById('bgMusic');

	  if (bgMusic) {
	    bgMusic.addEventListener('timeupdate', () => {
	      bgMusic.volume = getVolumeAt(bgMusic.currentTime) * duckFactor;
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
  function tweenDuck(target, duration = 400) {
    if (duckTween) cancelAnimationFrame(duckTween);
  
    const start = performance.now();
    const from = duckFactor;
  
    function update(now) {
      const t = Math.min((now - start) / duration, 1);
  
      // easeOutCubic
      const ease = 0.5 - Math.cos(Math.PI * t) / 2;
  
      duckFactor = from + (target - from) * ease;
  
      if (t < 1) {
        duckTween = requestAnimationFrame(update);
      }
    }
  
    duckTween = requestAnimationFrame(update);
  }

  return {
    init,
    play,
    startWithOffset,
  
    duck() {
      tweenDuck(0.3, 500);
    },
  
    unduck() {
      tweenDuck(1.0, 700);
    }
  };
})();
