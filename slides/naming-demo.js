(() => {
  function initialize() {
    const intro = document.getElementById('naming-start');
    const first = document.getElementById('naming-fixation-1');
    const buttons = [...document.querySelectorAll('[data-naming-start]')];
    const status = document.getElementById('naming-status');
    const pictures = [...document.querySelectorAll('.naming-trial img')];
    if (!intro || !first) return;
    let loaded = false;

    function goTo(slide) {
      const { h, v } = Reveal.getIndices(slide);
      Reveal.slide(h, v);
    }

    function update() {
      const active = Reveal.getCurrentSlide()?.classList.contains('naming-trial');
      document.documentElement.classList.toggle('naming-active', active);
      if (active && !loaded) goTo(intro);
    }

    function stop() {
      if (!document.documentElement.classList.contains('naming-active')) return;
      Reveal.toggleAutoSlide(false);
      goTo(intro);
    }

    buttons.forEach(button => button.addEventListener('click', () => {
      if (!loaded) return;
      button.blur();
      goTo(first);
      Reveal.toggleAutoSlide(true);
    }));

    // Decode every picture before enabling the timed sequence.
    Promise.all(pictures.map(picture => {
      picture.loading = 'eager';
      if (picture.dataset.src) picture.src = picture.dataset.src;
      return picture.decode();
    })).then(() => {
      loaded = true;
      buttons.forEach(button => { button.disabled = false; });
      status.textContent = 'Ready. Press Esc during the sequence to stop.';
    }).catch(() => {
      status.textContent = 'A picture could not load. Reload the page before starting.';
    });

    Reveal.on('slidechanged', update);
    Reveal.on('overviewshown', stop);
    Reveal.on('paused', stop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.documentElement.classList.contains('naming-active')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        stop();
      }
    }, true);
    update();
  }

  if (Reveal.isReady()) initialize();
  else Reveal.on('ready', initialize);
})();
