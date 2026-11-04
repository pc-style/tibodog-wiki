// Injected into tibo.dog with `agent-browser eval --stdin`. agent-browser can press keys but not hold them;
// the game reads held keys for movement (WASD) and for "hold Space to skip".
window.__hold = (code, ms = 1000) => {
  const key = code === 'Space' ? ' ' : code.replace(/^Key/, '').toLowerCase();
  const fire = (type) => {
    for (const t of [window, document]) t.dispatchEvent(new KeyboardEvent(type, { key, code, bubbles: true }));
  };
  fire('keydown');
  setTimeout(() => fire('keyup'), ms);
  return `holding ${code} for ${ms} ms`;
};
'__hold(code, ms) ready';
