/**
 * TAPSS — Texas Association of Primary Science Students
 * Smooth scroll, mobile nav, animated impact counters, hero typing, background equations
 */

(function () {
  'use strict';

  // ----- Background switcher (Black / Galaxy) -----
  var BG_STORAGE = 'tapss_bg';

  function getStoredBg() {
    try {
      var s = localStorage.getItem(BG_STORAGE);
      return s === 'black' || s === 'galaxy' ? s : 'galaxy';
    } catch (e) {
      return 'galaxy';
    }
  }

  function setBg(mode) {
    var body = document.body;
    if (!body) return;
    body.classList.remove('bg-black', 'bg-galaxy');
    body.classList.add('bg-' + mode);
    body.setAttribute('data-bg', mode);
    try {
      localStorage.setItem(BG_STORAGE, mode);
    } catch (e) {}
    var btnBlack = document.getElementById('bg-btn-black');
    var btnGalaxy = document.getElementById('bg-btn-galaxy');
    if (btnBlack) btnBlack.setAttribute('aria-pressed', mode === 'black' ? 'true' : 'false');
    if (btnGalaxy) btnGalaxy.setAttribute('aria-pressed', mode === 'galaxy' ? 'true' : 'false');
  }

  function initBgSwitcher() {
    var mode = getStoredBg();
    setBg(mode);
    document.getElementById('bg-btn-black') && document.getElementById('bg-btn-black').addEventListener('click', function () {
      setBg('black');
    });
    document.getElementById('bg-btn-galaxy') && document.getElementById('bg-btn-galaxy').addEventListener('click', function () {
      setBg('galaxy');
    });
  }

  // ----- Stars & asteroids (scroll-animated) -----
  function initCosmosScroll() {
    var body = document.body;
    if (!body || typeof document.createElement === 'undefined') return;

    var wrap = document.createElement('div');
    wrap.className = 'cosmos-scroll-layer';
    wrap.setAttribute('aria-hidden', 'true');
    body.insertBefore(wrap, body.firstChild);

    var w = window.innerWidth;
    var h = window.innerHeight;
    var starCount = 55;
    var asteroidCount = 12;

    for (var i = 0; i < starCount; i++) {
      var star = document.createElement('div');
      star.className = 'cosmos-star';
      var size = 1 + Math.random() * 2;
      var x = Math.random() * (w + 100) - 50;
      var y = Math.random() * (h * 3);
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = x + 'px';
      star.style.top = y + 'px';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (2 + Math.random() * 2) + 's';
      wrap.appendChild(star);
    }

    for (var j = 0; j < asteroidCount; j++) {
      var rock = document.createElement('div');
      rock.className = 'cosmos-asteroid';
      var size = 4 + Math.random() * 10;
      var x = Math.random() * (w + 80) - 40;
      var y = Math.random() * (h * 3);
      rock.style.width = size + 'px';
      rock.style.height = size + 'px';
      rock.style.left = x + 'px';
      rock.style.top = y + 'px';
      rock.style.animationDelay = Math.random() * 4 + 's';
      rock.style.animationDuration = (6 + Math.random() * 4) + 's';
      wrap.appendChild(rock);
    }

    function updateScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var stars = wrap.querySelectorAll('.cosmos-star');
      var asteroids = wrap.querySelectorAll('.cosmos-asteroid');
      stars.forEach(function (el, i) {
        var rate = 0.12 + (i % 5) * 0.03;
        var dy = -scrollTop * rate;
        el.style.transform = 'translateY(' + dy + 'px)';
      });
      asteroids.forEach(function (el, i) {
        var rate2 = 0.06 + (i % 4) * 0.025;
        var dy = -scrollTop * rate2;
        el.style.transform = 'translateY(' + dy + 'px)';
      });
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', function () {
      w = window.innerWidth;
      h = window.innerHeight;
    });
  }

  // ----- Hero typing animation -----
  var HERO_TITLE = 'Empowering Student Scientists to Create Real-World Impact';
  var HERO_SUB = 'TAPSS organizes student science competitions where winning experiments are transformed into low-cost STEM kits and taught to underserved communities.';
  var TITLE_SPEED = 42;
  var SUB_SPEED = 28;

  var titleEl = document.getElementById('hero-title-typed');
  var subEl = document.getElementById('hero-sub-typed');
  var cursorEl = document.querySelector('.hero-title .typed-cursor');
  var buttonsWrap = document.querySelector('.hero-buttons-init');

  function typeText(el, text, speed, onDone) {
    if (!el) { if (onDone) onDone(); return; }
    var i = 0;
    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else {
        if (onDone) onDone();
      }
    }
    tick();
  }

  function runHeroTyping() {
    if (!titleEl) return;
    typeText(titleEl, HERO_TITLE, TITLE_SPEED, function () {
      typeText(subEl, HERO_SUB, SUB_SPEED, function () {
        if (cursorEl) cursorEl.classList.add('hidden');
        if (buttonsWrap) buttonsWrap.classList.add('revealed');
      });
    });
  }

  // ----- Background equations (multiple per slot, randomize in same position) -----
  var EQUATIONS = [
    'E = mc²',
    'F = ma',
    'a² + b² = c²',
    'PV = nRT',
    'v = u + at',
    'H₂O',
    'E = hf',
    'F = G(m₁m₂/r²)',
    'KE = ½mv²',
    'P = IV',
    'λ = v/f',
    'ΔG = ΔH − TΔS',
    'c = λf',
    'W = Fd',
    'P = ρgh',
    'Q = mcΔT',
    'E = ½kx²',
    'F = qE'
  ];

  var equationSlots = document.querySelectorAll('.equation-slot');

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function cycleSlot(el) {
    if (!el) return;
    el.textContent = pickRandom(EQUATIONS);
    el.classList.add('visible');
  }

  function startEquationSlots() {
    equationSlots.forEach(function (el, index) {
      setTimeout(function () {
        cycleSlot(el);
      }, 200 + index * 120);
      (function scheduleNext() {
        setTimeout(function () {
          el.classList.remove('visible');
          setTimeout(function () {
            el.textContent = pickRandom(EQUATIONS);
            el.classList.add('visible');
          }, 400);
          scheduleNext();
        }, 3000 + Math.random() * 2000 + index * 300);
      })();
    });
  }

  window.addEventListener('load', function () {
    initBgSwitcher();
    initCosmosScroll();
    runHeroTyping();
    startEquationSlots();
  });

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        document.body.classList.remove('nav-open');
      }
    });
  });

  // ----- Mobile nav toggle -----
  var navToggle = document.querySelector('.nav-toggle');
  var navbar = document.querySelector('.navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      navbar.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // ----- Animated counters (Impact section) -----
  var statCards = document.querySelectorAll('.stat-card .stat-value');
  var countersAnimated = false;

  function animateValue(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.floor(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end;
      }
    }
    window.requestAnimationFrame(step);
  }

  function checkImpactInView() {
    var impact = document.getElementById('impact');
    if (!impact || countersAnimated) return;
    var rect = impact.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight * 0.85) {
      countersAnimated = true;
      statCards.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10) || 0;
        var duration = parseInt(el.getAttribute('data-duration'), 10) || 2000;
        animateValue(el, 0, target, duration);
      });
    }
  }

  window.addEventListener('scroll', checkImpactInView);
  window.addEventListener('load', checkImpactInView);

  // ----- Scroll-triggered animations -----
  var animateEls = document.querySelectorAll('.scroll-animate');
  var heroContent = document.querySelector('.hero-content');
  var heroAnimateEls = heroContent ? heroContent.querySelectorAll('.scroll-animate') : [];

  function revealHero() {
    heroAnimateEls.forEach(function (el, i) {
      el.classList.add('visible');
      if (i === 1) el.classList.add('visible-delay-1');
      if (i === 2) el.classList.add('visible-delay-2');
      if (i === 3) el.classList.add('visible-delay-3');
      if (i === 4) el.classList.add('visible-delay-2');
      if (i === 5) el.classList.add('visible-delay-3');
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (heroContent && heroContent.contains(el)) {
            revealHero();
          } else {
            el.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  window.addEventListener('load', function () {
    if (heroAnimateEls.length) {
      setTimeout(revealHero, 80);
    }
  });
})();
