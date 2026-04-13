/* =============================================
   candle.js — Main candle interaction
   - Tap cake area → blow out candle
   - Flame disappears, glow fades, scene darkens
   - Smoke wisp appears
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

    // Play blow sound
    AudioManager.play('tiupan');

    // Flame out
    const flameWrap = document.getElementById('mainFlameWrap');
    const glow = document.getElementById('mainCandleGlow');
    const glowLayer = document.getElementById('warm-glow-layer');
    const scene = document.getElementById('scene');

    if (flameWrap) flameWrap.classList.add('out');
    if (glow) glow.classList.add('out');

    // Global warm glow fades (but deco candle glow stays via its own element)
    if (glowLayer) glowLayer.classList.add('extinguished');

    // Scene slightly darker
    if (scene) scene.classList.add('candle-out');

    // Add smoke wisp
    if (flameWrap) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-wisp';
      flameWrap.parentElement.appendChild(smoke);

      smoke.addEventListener('animationend', () => {
        smoke.remove();
      });
    }
  }

  return { init };
})();
