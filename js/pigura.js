/* =============================================
   pigura.js — Frame interaction
   - Tap pigura → camera moves forward (perspective translateZ)
   - Play wind transition sound
   - NO background blur
   - Tap anywhere → close
   ============================================= */

const PiguraManager = (() => {
  let isOpen = false;

  function init() {
    const overlay = document.getElementById('piguraOverlay');
    if (!overlay) return;

    // Attach to each pigura
    document.querySelectorAll('.pigura').forEach(el => {
      el.addEventListener('click', (e) => openPigura(e, el));
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPigura(e, el);
      });
    });

    overlay.addEventListener('click', close);
    overlay.addEventListener('touchend', (e) => {
      e.preventDefault();
      close();
    });
  }

  function openPigura(e, el) {
    if (isOpen) return;
    isOpen = true;

    AudioManager.play('angin');

    // Get the image source from the clicked pigura
    const img = el.querySelector('.pigura-img');
    const focusImg = document.getElementById('piguraFocusImg');
    if (img && focusImg) {
      focusImg.src = img.src;
      focusImg.alt = img.alt;
    }

    const overlay = document.getElementById('piguraOverlay');
    if (overlay) overlay.classList.add('active');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    const overlay = document.getElementById('piguraOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  return { init };
})();
