/* ============================================================
   Northwest Camelid Foundation — Shared Scripts
   ============================================================ */

// Mobile navigation toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a non-dropdown link is clicked
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!link.closest('.has-dropdown > a') || link.getAttribute('href') !== '#') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close nav on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Dropdown toggle — click for touch/keyboard, hover handled by CSS
(function () {
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    const parent = trigger.parentElement;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = parent.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen);

      // Close other open dropdowns
      document.querySelectorAll('.has-dropdown').forEach(function (other) {
        if (other !== parent) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector(':scope > a');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(function (el) {
        el.classList.remove('is-open');
        const t = el.querySelector(':scope > a');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Keyboard: close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown').forEach(function (el) {
        el.classList.remove('is-open');
        const t = el.querySelector(':scope > a');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

// Mark active nav link and active parent dropdown
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.main-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    // Match exact page or page with hash
    if (href === page || href.split('#')[0] === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');

      // If inside a dropdown, mark the parent li as active-parent
      const dropdown = link.closest('.dropdown');
      if (dropdown) {
        const parentLi = dropdown.closest('.has-dropdown');
        if (parentLi) parentLi.classList.add('active-parent');
      }
    }
  });
})();
