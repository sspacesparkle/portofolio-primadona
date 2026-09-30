(() => {
  const audio = document.getElementById('contact-music');
  const toggle = document.querySelector('.contact-sound-toggle');
  if (!audio || !toggle) return;
  let wantsSound = true;
  audio.volume = 0.4;
  const update = () => {
    const playing = !audio.paused;
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on');
  };
  const play = () => audio.play().catch(update);
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  toggle.addEventListener('click', () => {
    if (audio.paused) { wantsSound = true; play(); }
    else { wantsSound = false; audio.pause(); }
  });
  const unlock = (event) => {
    if (!toggle.contains(event.target) && wantsSound && audio.paused) play();
  };
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  window.addEventListener('pagehide', () => audio.pause());
  update();
  play();
})();
