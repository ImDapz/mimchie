/* =============================================
   telephone.js — Telephone interaction with Web Audio Filter
   ============================================= */

const TelephoneManager = (() => {

  /* ============ HARDCODE DI SINI ============ */

  const VOICE_LIST = [
    'luna.ogg',
    'mimci.mp3'
  ];

  const JEDA_AWAL = 32;
  const JEDA_ANTAR_VOICE = 12;

  /* ============================================ */

  let voiceIndex = 0;
  let phoneState = 'idle';

  let ringingAudio, hangupAudio, voiceAudio;
  let subtitleCues = [];
  let subtitleRAF = null;

  // Web Audio API Context & Nodes
  let audioCtx = null;
  let voiceSourceNode = null;

  function init() {
    ringingAudio = document.getElementById('sfxRinging');
    hangupAudio  = document.getElementById('sfxHangup');
    voiceAudio   = document.getElementById('sfxVoice');

    const phoneEl = document.getElementById('telephone');
    if (phoneEl) {
      phoneEl.addEventListener('click', handlePickup);
      phoneEl.addEventListener('touchend', (e) => {
        e.preventDefault();
        handlePickup();
      });
    }

    const overlay = document.getElementById('telephoneOverlay');
    if (overlay) {
      overlay.addEventListener('click', handleOverlayTap);
      overlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleOverlayTap();
      });
    }
  }

  /* ============ SETUP WEB AUDIO FILTER ============ */

  function initAudioContext() {
    if (audioCtx) return;

    // Buat AudioContext setelah ada interaksi pengguna
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Hubungkan <audio id="sfxVoice"> ke Web Audio API
    voiceSourceNode = audioCtx.createMediaElementSource(voiceAudio);

    // 1. Highpass Filter (potong bass di bawah 300Hz)
    const highpass = audioCtx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 300;

    // 2. Lowpass Filter (potong treble di atas 3400Hz)
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3400;

    // 3. Distortion / Saturation (memberi karakter kresek-kresek khas telepon)
    const distortion = audioCtx.createWaveShaper();
    distortion.curve = makeDistortionCurve(10); // angka '10' adalah tingkat kreseknya
    distortion.oversample = '4x';

    // 4. Gain Node (mengatur volume output akhir)
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.2;

    // Rangkaian Filter (Chain):
    // Source -> Highpass -> Lowpass -> Distortion -> Gain -> Speakers
    voiceSourceNode
      .connect(highpass)
      .connect(lowpass)
      .connect(distortion)
      .connect(gainNode)
      .connect(audioCtx.destination);
  }

  // Fungsi pembuat kurva distorsi ringan
  function makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /* ================================================ */

  function scheduleFirstRing() {
    setTimeout(() => {
      if (voiceIndex < VOICE_LIST.length) startRinging();
    }, JEDA_AWAL * 1000);
  }

  function startRinging() {
    if (voiceIndex >= VOICE_LIST.length) return;
    phoneState = 'ringing';

    const phoneEl = document.getElementById('telephone');
    if (phoneEl) phoneEl.classList.add('ringing');

    if (ringingAudio) {
      ringingAudio.loop = true;
      ringingAudio.currentTime = 0;
      ringingAudio.play().catch(() => {});
    }
  }

  function stopRinging() {
    if (ringingAudio) {
      ringingAudio.pause();
      ringingAudio.currentTime = 0;
    }
    const phoneEl = document.getElementById('telephone');
    if (phoneEl) phoneEl.classList.remove('ringing');
  }

  function handlePickup() {
    if (phoneState !== 'ringing') return;
    
    // Inisialisasi AudioContext saat user klik telepon (memenuhi syarat browser policy)
    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopRinging();
    phoneState = 'talking';

    playHangupThen(() => {
      openOverlay();
      playVoice(VOICE_LIST[voiceIndex]);
    });
  }

  function playHangupThen(callback) {
    if (!hangupAudio) { callback(); return; }
    hangupAudio.currentTime = 0;
    hangupAudio.play().catch(() => {});
    hangupAudio.addEventListener('ended', callback, { once: true });
  }
  function openOverlay() {
    const overlay = document.getElementById('telephoneOverlay');
    if (overlay) overlay.classList.add('active');

    const hint = document.getElementById('telephoneTapHint');
    if (hint) hint.style.display = 'none';
  }

  function closeOverlay() {
    const overlay = document.getElementById('telephoneOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  async function playVoice(filename) {
    const base = filename.replace(/\.[^.]+$/, '');
    subtitleCues = await loadSubtitle(`/subtitles/${base}.md`);

    if (!voiceAudio) return;
    voiceAudio.src = `/music/${filename}`;
    voiceAudio.currentTime = 0;
    
    AudioManager.duck();
    
    voiceAudio.play().catch(() => {});

    startSubtitleSync();
    voiceAudio.addEventListener('ended', handleVoiceEnded, { once: true });
  }

  function handleVoiceEnded() {
    AudioManager.unduck();
    stopSubtitleSync();
    clearSubtitleText();

    const hint = document.getElementById('telephoneTapHint');
    if (hint) hint.style.display = 'block';

    phoneState = 'waiting-close';
  }

  function handleOverlayTap() {
    if (phoneState !== 'waiting-close') return;

    phoneState = 'idle';

    playHangupThen(() => {
      closeOverlay();
      voiceIndex++;

      if (voiceIndex < VOICE_LIST.length) {
        setTimeout(startRinging, JEDA_ANTAR_VOICE * 1000);
      }
    });
  }

  /* ============ SUBTITLE SYNC ============ */

  function startSubtitleSync() {
    const textEl = document.getElementById('telephoneSubtitle');
  
    function tick() {
      const t = voiceAudio.currentTime;
      let active = null;
  
      for (let i = 0; i < subtitleCues.length; i++) {
        if (t >= subtitleCues[i].time) active = subtitleCues[i];
        else break;
      }
  
      if (!textEl) return;
  
      if (!active) {
        textEl.innerHTML = '';
      } else {
        textEl.innerHTML = active.text
          .split('\n')
          .map(line => `<div class="subtitle-line">${line}</div>`)
          .join('');
      }
  
      subtitleRAF = requestAnimationFrame(tick);
    }
  
    subtitleRAF = requestAnimationFrame(tick);
  }

  function stopSubtitleSync() {
    if (subtitleRAF) cancelAnimationFrame(subtitleRAF);
    subtitleRAF = null;
  }

  function clearSubtitleText() {
    const textEl = document.getElementById('telephoneSubtitle');
    if (textEl) textEl.textContent = '';
  }

  /* ============ SUBTITLE PARSER ============= */

  async function loadSubtitle(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('not found');
      const raw = await res.text();
      return parseSubtitle(raw);
    } catch (err) {
      console.warn('Gagal memuat subtitle:', url, err);
      return [];   // ← kalau .md gak ketemu, cuma balikin array kosong, gak nge-crash
    }
  }

  function parseSubtitle(raw) {
    const lineRe = /^\((\d+):(\d{2})\)\s*(.*)$/;
    const cues = [];
  
    raw.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
  
      const m = trimmed.match(lineRe);
      if (!m) return;
  
      const [, mm, ss, text] = m;
  
      const time = Number(mm) * 60 + Number(ss);
  
      cues.push({
        time,
        text: text.replace(/\\n/g, '\n').trim()
      });
    });
  
    cues.sort((a, b) => a.time - b.time);
    return cues;
  }

  function isBusy() {
    return phoneState === 'talking' || phoneState === 'waiting-close';
  }

  return { init, scheduleFirstRing, isBusy };
})();
