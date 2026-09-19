/* app.js — Kiro: The Two-Tailed Wanderer
   Theme toggle, mobile menu, scroll reveal, nav behavior, form handling
*/

(function () {
  'use strict';

  /* ===== Theme Toggle ===== */
  var themeToggle = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  // Kiro's identity is dark — default to dark mode regardless of system preference
  var currentTheme = 'dark';
  root.setAttribute('data-theme', currentTheme);

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<circle cx="12" cy="12" r="5"/>' +
        '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  updateThemeIcon(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateThemeIcon(currentTheme);
    });
  }

  /* ===== Mobile Menu ===== */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menuClose = document.querySelectorAll('[data-menu-close]');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOverlay = document.getElementById('menuOverlay');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('mobile-menu--open');
    if (menuOverlay) menuOverlay.classList.add('menu-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('mobile-menu--open');
    if (menuOverlay) menuOverlay.classList.remove('menu-overlay--open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  menuClose.forEach(function (el) { el.addEventListener('click', closeMenu); });
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  /* ===== Nav Hide/Show on Scroll ===== */
  var nav = document.getElementById('nav');
  var lastScrollY = 0;
  var ticking = false;

  function updateNav() {
    var scrollY = window.scrollY;

    if (scrollY > 100 && scrollY > lastScrollY) {
      // Scrolling down — hide nav
      nav.classList.add('nav--hidden');
    } else {
      // Scrolling up — show nav
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  /* ===== Scroll Reveal ===== */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show all
    reveals.forEach(function (el) { el.classList.add('reveal--visible'); });
  }

  /* ===== Smooth Scroll (native via CSS, but handle offset) ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#' || href === '#main') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ===== Newsletter Form ===== */
  var form = document.getElementById('updatesForm');
  var successMsg = document.getElementById('updatesSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value && input.checkValidity()) {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('updates__success--show');
      } else {
        input.focus();
        input.style.borderColor = 'var(--color-error)';
      }
    });
  }

})();
