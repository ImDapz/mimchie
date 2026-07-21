/* =============================================
   surat.js — Letter interaction
   - Tap surat → blur bg, play paper sound, show focused letter
   - Tap anywhere → close
   ============================================= */

const SuratManager = (() => {
  let isOpen = false;

  function init() {
    const surat = document.getElementById('surat');
    const overlay = document.getElementById('suratOverlay');

    if (!surat || !overlay) return;

    surat.addEventListener('click', open);
    surat.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open();
    });

    overlay.addEventListener('click', close);
    overlay.addEventListener('touchend', (e) => {
      e.preventDefault();
      close();
    });
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    AudioManager.play('kertas');

    const overlay = document.getElementById('suratOverlay');
    if (overlay) overlay.classList.add('active');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    const overlay = document.getElementById('suratOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  return { init };
})();
