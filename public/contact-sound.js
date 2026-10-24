(() => {
  const audio = document.getElementById('contact-music');
  const toggles = Array.from(document.querySelectorAll('.contact-sound-toggle'));
  if (!audio || !toggles.length) return;
  let wantsSound = false;
  try { wantsSound = sessionStorage.getItem('portfolio-music') === 'on'; } catch {}
  audio.volume = 0.4;
  const update = () => {
    const playing = !audio.paused;
    toggles.forEach(toggle => {
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on');
    });
  };
  const play = () => audio.play().catch(update);
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  toggles.forEach(toggle => toggle.addEventListener('click', () => {
    if (audio.paused) { wantsSound = true; play(); }
    else { wantsSound = false; audio.pause(); }
    try { sessionStorage.setItem('portfolio-music', wantsSound ? 'on' : 'off'); } catch {}
  }));
  const unlock = (event) => {
    if (!toggles.some(toggle => toggle.contains(event.target)) && wantsSound && audio.paused) play();
  };
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  window.addEventListener('pagehide', () => audio.pause());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause();
    else if (wantsSound) play();
  });
  window.addEventListener('pageshow', () => { if (wantsSound) play(); });
  update();
  if (wantsSound) play();
})();
