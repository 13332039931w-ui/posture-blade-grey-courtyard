'use strict';
(() => {
  const canvas = document.getElementById('canvas');
  const stage = document.getElementById('stage');
  const cover = document.getElementById('cover');
  const start = document.getElementById('start');
  const status = document.getElementById('load-status');
  const progress = document.getElementById('progress');
  let started = false;
  const nativeFetch = window.fetch.bind(window);
  const wasmURL = new URL('game.wasm', location.href).href;
  // Only this engine asset is intercepted. The gzip payload is hosted as a
  // binary asset so the loader works without server-specific encoding headers.
  window.fetch = async (input, options) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href).href;
    if (url !== wasmURL) return nativeFetch(input, options);
    const response = await nativeFetch('engine.wasm.bin', options);
    if (!response.ok) throw new Error('引擎下载失败，请重新加载。');
    return new Response(response.body.pipeThrough(new DecompressionStream('gzip')), {
      headers: {'Content-Type': 'application/wasm', 'Content-Length': String(window.GAME_CONFIG.fileSizes['game.wasm'])}
    });
  };
  function fail(message) {
    cover.hidden = false;
    document.getElementById('error').textContent = message;
    document.getElementById('error').hidden = false;
    document.getElementById('retry').hidden = false;
    document.getElementById('load-panel').hidden = true;
    start.hidden = true;
  }
  document.getElementById('retry').addEventListener('click', () => location.reload());
  start.addEventListener('click', async () => {
    if (started) return;
    if (!window.DecompressionStream || !window.WebAssembly || !document.createElement('canvas').getContext('webgl2')) {
      fail('此浏览器不支持游戏所需功能。请使用新版 Chrome、Edge 或 Firefox，并开启硬件加速。');
      return;
    }
    started = true;
    start.hidden = true;
    document.getElementById('load-panel').hidden = false;
    document.getElementById('note').textContent = '首次加载后，浏览器会缓存资源。';
    const engine = new Engine({...window.GAME_CONFIG, canvas, persistentPaths: [],
      onProgress(current, total) {
        const percent = total > 0 ? Math.min(100, Math.round(current / total * 100)) : 0;
        progress.value = percent;
        status.textContent = percent < 100 ? `加载游戏 ${percent}%` : '资源就绪，正在进入灰庭…';
      },
      onPrintError(...args) { console.error(...args); },
      onExit(code) { if (code !== 0) fail('游戏启动遇到问题，请重新加载。'); }
    });
    try {
      await engine.startGame();
      window.fetch = nativeFetch;
      cover.hidden = true;
      canvas.focus();
    } catch (error) {
      console.error(error);
      fail(error.message || '加载失败，请检查网络后重试。');
    }
  });
  document.getElementById('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.requestFullscreen();
      canvas.focus();
    } catch { document.getElementById('fullscreen').textContent = '浏览器暂不支持全屏'; }
  });
  canvas.addEventListener('click', () => canvas.focus());
  canvas.addEventListener('keydown', event => {
    if (['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','F1','F2','F3'].includes(event.code)) event.preventDefault();
  });
})();
