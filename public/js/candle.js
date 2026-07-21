/* =============================================
   candle.js — Main candle interaction
   - Tap cake area → blow out candle
   - Flame disappears, ambient glow fades, smoke wisp appears
   - Lampu ruangan mulai nyala (fade in) setelah lilin ditiup
   ============================================= */

const CandleManager = (() => {
  let isLit = true;

  function init() {
    const cakeArea = document.getElementById('cakeArea');
    if (!cakeArea) return;

    cakeArea.addEventListener('click', handleBlow);
    cakeArea.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleBlow();
    });
  }

  function handleBlow() {
    if (!isLit) return;
    isLit = false;

    AudioManager.play('tiupan');

    const flameWrap = document.getElementById('mainFlameWrap');
    const glow = document.getElementById('mainCandleGlow');
    const ambientGlow = document.getElementById('candleAmbientGlow');
    const lampLayer = document.getElementById('lampGlowLayer');

    if (flameWrap) flameWrap.classList.add('out');
    if (glow) glow.classList.add('out');
    if (ambientGlow) ambientGlow.classList.add('extinguished');

    // Lampu nyala (fade in) baru SEKARANG, setelah lilin mati —
    // sebelumnya lampu mati total, jadi mata user fokus ke kue dulu.
    if (lampLayer) lampLayer.classList.add('lit');
    if (dustLayer) dustLayer.classList.add('lit');
 
    if (flameWrap) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-wisp';
      flameWrap.parentElement.appendChild(smoke);
      smoke.addEventListener('animationend', () => smoke.remove());
    }
  }

  return { init };
})();
