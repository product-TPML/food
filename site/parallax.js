/* Food section · scroll parallax, shared by every page. Photos (.art.has-img) are drawn oversize (see .art img in style.css) so they can move
   inside their frames. Layers: (1) vertical drift against the page scroll; (2) sideways drift while a carousel (.rail) scrolls;
   (3) the masthead photo. Cards themselves never move. Skipped for prefers-reduced-motion. */
(function () {
  function init() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const SHIFT = 0.16;     // vertical photo drift, as a share of the frame height (spare image is 16% per side)
    const SHIFT_X = 0.16;   // sideways drift, as a share of the frame width
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
      schedule();
    }, { rootMargin: '160px 0px' });
    document.querySelectorAll('.art.has-img').forEach(frame => observer.observe(frame));
    const rails = [...document.querySelectorAll('.rail')];

    function updateRail(rail) {
      const overflowing = rail.scrollWidth > rail.clientWidth + 1;
      const railBox = rail.getBoundingClientRect();
      rail.querySelectorAll('.art.has-img').forEach(frame => {
        const img = frame.querySelector('img');
        const box = frame.getBoundingClientRect();
        if (!img || !box.width) return;
        let shift = 0;
        if (overflowing) {
          const progress = Math.max(-1, Math.min(1, (box.left + box.width / 2 - (railBox.left + railBox.width / 2)) / (railBox.width / 2 + box.width / 2)));
          shift = -progress * SHIFT_X * box.width;
        }
        img.style.setProperty('--px', `${shift.toFixed(1)}px`);
      });
    }
    rails.forEach(rail => {
      let railQueued = false;
      rail.addEventListener('scroll', () => { if (!railQueued) { railQueued = true; requestAnimationFrame(() => { railQueued = false; updateRail(rail); }); } }, { passive: true });
    });

    let queued = false;
    const progressOf = (box, viewport) => Math.max(-1, Math.min(1, (box.top + box.height / 2 - viewport / 2) / (viewport / 2 + box.height / 2)));
    function update() {
      queued = false;
      const viewport = innerHeight;
      for (const frame of visible) {
        const box = frame.getBoundingClientRect();
        const img = frame.querySelector('img');
        if (box.height && img) img.style.setProperty('--py', `${(-progressOf(box, viewport) * SHIFT * box.height).toFixed(1)}px`);
      }
      rails.forEach(updateRail);
      const masthead = document.querySelector('.masthead');
      if (masthead) masthead.style.backgroundPositionY = `${50 + Math.min(scrollY, 300) * 0.05}%`;
    }
    function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    schedule();
  }

  window.Parallax = { init };
})();
