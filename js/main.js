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
// ─────────────────────────────────────────────────────────────────────────────
// Desktop (≥721px) — two independent, non-conflicting mechanisms:
//   MOUSE:    CSS :hover opens/closes the panel. JS only syncs aria-expanded.
//             :focus-within is intentionally NOT used — clicking a trigger
//             focuses it, which would keep the panel open via :focus-within
//             even after the mouse moves elsewhere (stuck-open bug).
//   KEYBOARD: JS adds .kb-open on Enter/ArrowDown. Any mouseenter on the
//             nav clears .kb-open so mouse takes over cleanly. Tab-out and
//             Escape also remove .kb-open.
//
// Mobile (≤720px) — JS click toggles .is-open; CSS shows panel from that class.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var mq    = window.matchMedia('(max-width: 720px)');   // true = mobile
  var items = document.querySelectorAll('.has-dropdown');

  // ── Utilities ─────────────────────────────────────────────────────────────
  function setAria(item, val) {
    var t = item.querySelector(':scope > a');
    if (t) t.setAttribute('aria-expanded', String(val));
  }

  function clearKbOpen() {
    items.forEach(function (i) {
      i.classList.remove('kb-open');
      setAria(i, false);
    });
  }

  function closeAllMobile() {
    items.forEach(function (i) {
      i.classList.remove('is-open');
      setAria(i, false);
    });
  }

  // ── Desktop: sync aria-expanded with CSS :hover ───────────────────────────
  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (mq.matches) { return; }
      clearKbOpen();              // mouse takes over — discard keyboard state
      setAria(item, true);
    });
    item.addEventListener('mouseleave', function () {
      if (!mq.matches) { setAria(item, false); }
    });
  });

  // ── Desktop keyboard: Enter/ArrowDown opens; Tab-out/Escape closes ─────────
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;

    trigger.addEventListener('keydown', function (e) {
      if (mq.matches) { return; }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        clearKbOpen();
        parent.classList.add('kb-open');
        setAria(parent, true);
        var first = parent.querySelector('.dropdown a');
        if (first) { first.focus(); }
      }
    });

    // Tab-out of the whole .has-dropdown removes .kb-open
    parent.addEventListener('focusout', function () {
      if (!mq.matches) {
        setTimeout(function () {
          if (!parent.contains(document.activeElement)) {
            parent.classList.remove('kb-open');
            setAria(parent, false);
          }
        }, 0);
      }
    });
  });

  // ── Mobile: click trigger to toggle .is-open ──────────────────────────────
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (!mq.matches) { return; }                       // desktop: CSS handles it

      var isOpen = parent.classList.toggle('is-open');
      setAria(parent, isOpen);
      items.forEach(function (other) {
        if (other !== parent) {
          other.classList.remove('is-open');
          setAria(other, false);
        }
      });
    });
  });

  // ── Escape: close everything ───────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    clearKbOpen();
    closeAllMobile();
  });

  // ── Mobile: outside click closes ──────────────────────────────────────────
  document.addEventListener('click', function (e) {
    if (mq.matches && !e.target.closest('.has-dropdown')) { closeAllMobile(); }
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
