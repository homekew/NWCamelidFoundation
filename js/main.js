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

// Dropdown toggle — unified .is-open approach for both hover (desktop) and click (all)
(function () {
  var items = document.querySelectorAll('.has-dropdown');
  var DESKTOP = '(min-width: 721px)';

  function openDropdown(item) {
    var trigger = item.querySelector(':scope > a');
    // Close all others first
    items.forEach(function (other) {
      if (other !== item) {
        other.classList.remove('is-open');
        var t = other.querySelector(':scope > a');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown(item) {
    var trigger = item.querySelector(':scope > a');
    item.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function closeAll() {
    items.forEach(function (item) { closeDropdown(item); });
  }

  // Desktop hover: mouseenter opens, mouseleave closes
  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (window.matchMedia(DESKTOP).matches) {
        openDropdown(item);
      }
    });

    item.addEventListener('mouseleave', function () {
      if (window.matchMedia(DESKTOP).matches) {
        closeDropdown(item);
      }
    });
  });

  // Click / tap / keyboard Enter — toggle on all viewport sizes
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (parent.classList.contains('is-open')) {
        closeDropdown(parent);
      } else {
        openDropdown(parent);
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      closeAll();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(); }
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
