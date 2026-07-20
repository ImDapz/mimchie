/* =============================================
   candle.js — Main candle interaction
   - Tap cake area → blow out candle
   - Flame disappears, ambient glow fades, smoke wisp appears
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

    if (flameWrap) flameWrap.classList.add('out');
    if (glow) glow.classList.add('out');
    if (ambientGlow) ambientGlow.classList.add('extinguished');

    // TIDAK ADA lagi scene.classList.add('candle-out') di sini.
    // Kegelapan ruangan sekarang konstan (--room-darkness di base.css),
    // terpisah dari status lilin — supaya tidak bentrok dengan filter
    // animasi zoom pigura.

    if (flameWrap) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-wisp';
      flameWrap.parentElement.appendChild(smoke);
      smoke.addEventListener('animationend', () => smoke.remove());
    }
  }

  return { init };
})();
