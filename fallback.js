/* =============================================
   fallback.js — Graceful handling for missing assets
   - Missing images → colored placeholder with label
   - Missing audio → silent fail, no crash
   ============================================= */

const FallbackManager = (() => {

  // Color map for placeholder boxes so you can tell which is which
  const placeholderColors = {
    'pigura1.png':       { bg: '#66ddaa', label: 'Pigura 1' },
    'pigura2.png':       { bg: '#77eebb', label: 'Pigura 2' },
    'pigura3.png':       { bg: '#88ccaa', label: 'Pigura 3' },
    'kue.png':           { bg: '#7B68EE', label: 'Kue + Lilin' },
    'surat.png':         { bg: '#40E0D0', label: 'Surat (amplop)' },
    'isiSurat.png':      { bg: '#48D1CC', label: 'Isi Surat' },
    'meja.png':          { bg: '#CD853F', label: 'Meja' },
    'lilinDekorasi.png': { bg: '#9370DB', label: 'Lilin Dekorasi' },
    'vasKecil.png':      { bg: '#66cdaa', label: 'Vas Kecil' },
    'vasMenengah.png':   { bg: '#48D1CC', label: 'Vas Menengah' },
    'vasBesar.png':      { bg: '#20B2AA', label: 'Vas Besar' },
    'background.png':    { bg: '#1a1a2e', label: 'Background' },
  };

  function init() {
    handleImages();
    handleAudio();
  }

  function handleImages() {
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
      // If already loaded, skip
      if (img.complete && img.naturalWidth > 0) return;

      img.addEventListener('error', () => {
        console.warn(`[Image] Missing: ${img.src}`);
        createPlaceholder(img);
      });

      // Also check if already failed (cached fail)
      if (img.complete && img.naturalWidth === 0) {
        createPlaceholder(img);
      }
    });
  }

  function createPlaceholder(img) {
    // Find which asset this is
    const src = img.getAttribute('src') || '';
    const filename = src.split('/').pop();
    const info = placeholderColors[filename] || { bg: '#555', label: filename || 'Unknown' };

    // Create a placeholder div
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      aspect-ratio: ${getAspectRatio(filename)};
      background: ${info.bg};
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Lora', serif;
      font-size: 12px;
      color: rgba(0,0,0,0.5);
      text-align: center;
      padding: 8px;
      pointer-events: none;
      line-height: 1.3;
    `;
    placeholder.textContent = info.label;

    // Replace the broken img
    img.style.display = 'none';
    img.parentElement.insertBefore(placeholder, img);

    // Keep pointer-events on parent for interactive elements
    const parent = img.closest('.surat, .pigura, .cake-area');
    if (parent) {
      placeholder.style.pointerEvents = 'none';
    }
  }

  function getAspectRatio(filename) {
    // Match the mockup ratios
    if (filename === 'pigura1.png' || filename === 'pigura2.png') return '3 / 4';
    if (filename === 'pigura3.png') return '4 / 3';
    if (filename === 'meja.png') return '16 / 5';
    if (filename === 'kue.png') return '1 / 1';
    if (filename === 'surat.png') return '3 / 4';
    return '1 / 1';
  }

  function handleAudio() {
    // Patch AudioManager.play to never crash on missing audio
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      audio.addEventListener('error', () => {
        console.warn(`[Audio] Missing: ${audio.src}`);
        // Prevent any future play attempts from throwing
        audio.play = () => Promise.resolve();
      });
    });
  }

  return { init };
})();
