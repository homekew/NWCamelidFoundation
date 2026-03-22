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

// Dropdown behavior
// Desktop: CSS :hover handles visibility (can't show two at once by definition).
//          JS only updates aria-expanded via mouseenter/mouseleave.
// Mobile:  JS click toggles .is-open; CSS shows/hides based on that class.
(function () {
  var MOBILE = '(max-width: 720px)';
  var items  = document.querySelectorAll('.has-dropdown');

  function setAria(item, val) {
    var t = item.querySelector(':scope > a');
    if (t) t.setAttribute('aria-expanded', val);
  }

  function closeAllMobile() {
    items.forEach(function (item) {
      item.classList.remove('is-open');
      setAria(item, 'false');
    });
  }

  // Desktop: sync aria-expanded with CSS hover state (visual handled by CSS)
  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (!window.matchMedia(MOBILE).matches) { setAria(item, 'true'); }
    });
    item.addEventListener('mouseleave', function () {
      if (!window.matchMedia(MOBILE).matches) { setAria(item, 'false'); }
    });
  });

  // Click: mobile-only toggle; desktop just prevents default (CSS handles hover)
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (!window.matchMedia(MOBILE).matches) { return; } // desktop: do nothing

      var isOpen = parent.classList.toggle('is-open');
      setAria(parent, isOpen);
      // Close all other mobile dropdowns
      items.forEach(function (other) {
        if (other !== parent) {
          other.classList.remove('is-open');
          setAria(other, 'false');
        }
      });
    });
  });

  // Close mobile dropdowns when clicking outside or pressing Escape
  document.addEventListener('click', function (e) {
    if (window.matchMedia(MOBILE).matches && !e.target.closest('.has-dropdown')) {
      closeAllMobile();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAllMobile(); }
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
