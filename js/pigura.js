const PiguraManager = (() => {
  let isOpen = false;

  // Transform-origin per pigura sesuai posisinya di layar
  // Pigura 1: kanan atas → origin kanan atas
  // Pigura 2: kiri atas  → origin kiri atas
  // Pigura 3: kiri tengah → origin kiri tengah
  const originMap = {
    '1': '75% 20%',
    '2': '15% 15%',
    '3': '15% 50%',
  };

  function init() {
    const overlay = document.getElementById('piguraOverlay');
    if (!overlay) return;

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

    const piguraId = el.getAttribute('data-pigura');
    const scene = document.getElementById('scene');
    const origin = originMap[piguraId] || '50% 50%';

    // Set transform origin sesuai pigura yang diklik
    scene.style.transformOrigin = origin;
    scene.classList.add('zooming', 'zoom-in');

    // Load gambar pigura ke overlay
    const img = el.querySelector('.pigura-img');
    const focusImg = document.getElementById('piguraFocusImg');
    if (img && focusImg) {
      focusImg.src = img.src;
      focusImg.alt = img.alt;
    }

    // Tampilkan overlay setelah zoom selesai
    scene.addEventListener('animationend', () => {
      scene.classList.remove('zooming');
      const overlay = document.getElementById('piguraOverlay');
      if (overlay) overlay.classList.add('active');
    }, { once: true });
  }

  function close() {
    if (!isOpen) return;

    const overlay = document.getElementById('piguraOverlay');
    const scene = document.getElementById('scene');

    if (overlay) overlay.classList.remove('active');

    scene.classList.remove('zoom-in');
    scene.classList.add('zooming', 'zoom-out');

    scene.addEventListener('animationend', () => {
      isOpen = false;
      scene.classList.remove('zooming', 'zoom-out');
      scene.style.transformOrigin = '';
    }, { once: true });
  }

  return { init };
})();
