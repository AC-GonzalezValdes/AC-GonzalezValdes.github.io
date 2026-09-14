/* Homepage photo carousel — no dependencies.
   Auto-advances every 6 s; pauses on hover/focus or with the pause button;
   no autoplay for visitors who prefer reduced motion. */
(function () {
  document.querySelectorAll('.carousel').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;
    var dotsBox = root.querySelector('.carousel-dots');
    var prev = root.querySelector('.carousel-prev');
    var next = root.querySelector('.carousel-next');
    var pauseBtn = root.querySelector('.carousel-pause');
    var index = 0, timer = null, userPaused = false;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DELAY = 6000;

    root.classList.add('carousel-ready');
    if (slides.length < 2) {
      [prev, next, pauseBtn, dotsBox].forEach(function (el) { if (el) el.hidden = true; });
    }

    var dots = slides.map(function (slide, i) {
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1));
      b.addEventListener('click', function () { show(i); restart(); });
      if (dotsBox) dotsBox.appendChild(b);
      return b;
    });

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === index;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
    }
    function play() {
      if (reduced || userPaused || slides.length < 2 || timer) return;
      timer = setInterval(function () { show(index + 1); }, DELAY);
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); play(); }

    if (prev) prev.addEventListener('click', function () { show(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { show(index + 1); restart(); });
    if (pauseBtn) {
      if (reduced) { userPaused = true; }
      var sync = function () {
        pauseBtn.textContent = userPaused ? 'Play' : 'Pause';
        pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      };
      pauseBtn.addEventListener('click', function () { userPaused = !userPaused; sync(); userPaused ? stop() : play(); });
      sync();
    }
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', play);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(index - 1); restart(); }
      if (e.key === 'ArrowRight') { show(index + 1); restart(); }
    });

    show(0);
    play();
  });
})();
