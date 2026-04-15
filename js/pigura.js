const PiguraManager = (() => {
  let isOpen = false;

const originMap = {
  '1': '80% 2.5%',   // lebih kanan, lebih atas
  '2': '15% 8%',
  '3': '20% 35%',
};

  function init() {
    document.querySelectorAll('.pigura').forEach(el => {
      el.addEventListener('click', (e) => open(e, el));
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        open(e, el);
      });
    });

    // Tap mana saja (bukan pigura) untuk close
    document.addEventListener('click', (e) => {
      if (isOpen && !e.target.closest('.pigura')) close();
    });
    document.addEventListener('touchend', (e) => {
      if (isOpen && !e.target.closest('.pigura')) {
        e.preventDefault();
        close();
      }
    });
  }

  function open(e, el) {
    if (isOpen) return;
    isOpen = true;

    AudioManager.play('angin');

    const piguraId = el.getAttribute('data-pigura');
    const scene = document.getElementById('scene');
    scene.style.transformOrigin = originMap[piguraId] || '50% 50%';
    scene.classList.add('zooming', 'zoom-in');

    scene.addEventListener('animationend', () => {
      scene.classList.remove('zooming');
    }, { once: true });
  }

  function close() {
    if (!isOpen) return;
    const scene = document.getElementById('scene');

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
