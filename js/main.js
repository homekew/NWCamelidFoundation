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
// Desktop (≥721px)
//   VISUAL:  CSS :hover + :focus-within handle visibility — no JS class needed.
//   ARIA:    JS syncs aria-expanded via mouseenter/leave and focusin/out.
//   KEYBOARD:Enter/Space on trigger → focus first item (CSS focus-within shows panel).
//            Escape → blur active element → focus-within clears → panel hides.
//            Click outside → mousedown handler blurs nav focus → panel hides.
//
// Mobile (≤720px)
//   VISUAL:  JS click toggles .is-open; CSS shows/hides from that class.
//   One dropdown open at a time. Escape + outside click both close.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var mq     = window.matchMedia('(max-width: 720px)');  // true = mobile
  var items  = document.querySelectorAll('.has-dropdown');

  // ── Utility ──────────────────────────────────────────────────────────────
  function setAria(item, val) {
    var t = item.querySelector(':scope > a');
    if (t) t.setAttribute('aria-expanded', String(val));
  }

  function closeAllMobile() {
    items.forEach(function (item) {
      item.classList.remove('is-open');
      setAria(item, false);
    });
  }

  // ── Desktop: keep aria-expanded in sync with CSS hover/focus state ───────
  items.forEach(function (item) {
    // Hover enter/leave
    item.addEventListener('mouseenter', function () {
      if (!mq.matches) { setAria(item, true); }
    });
    item.addEventListener('mouseleave', function () {
      if (!mq.matches) { setAria(item, false); }
    });

    // Keyboard focus enter/leave (deferred so activeElement is updated first)
    item.addEventListener('focusin', function () {
      if (!mq.matches) { setAria(item, true); }
    });
    item.addEventListener('focusout', function () {
      if (!mq.matches) {
        setTimeout(function () {
          if (!item.contains(document.activeElement)) { setAria(item, false); }
        }, 0);
      }
    });
  });

  // ── Desktop keyboard: Enter/Space opens dropdown, Arrow Down enters it ───
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;

    trigger.addEventListener('keydown', function (e) {
      if (mq.matches) { return; }                        // handled by click below
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        var first = parent.querySelector('.dropdown a');
        if (first) { first.focus(); }                    // CSS focus-within shows panel
      }
    });
  });

  // ── Mobile: click trigger to toggle .is-open ─────────────────────────────
  document.querySelectorAll('.has-dropdown > a').forEach(function (trigger) {
    var parent = trigger.parentElement;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (!mq.matches) { return; }                       // desktop: no-op

      var isOpen = parent.classList.toggle('is-open');
      setAria(parent, isOpen);

      // Close all other mobile dropdowns
      items.forEach(function (other) {
        if (other !== parent) {
          other.classList.remove('is-open');
          setAria(other, false);
        }
      });
    });
  });

  // ── Desktop: clicking outside the header blurs nav focus (closes focus-within)
  document.addEventListener('mousedown', function (e) {
    if (!mq.matches && !e.target.closest('.site-header')) {
      var active = document.activeElement;
      if (active && active.closest('.has-dropdown')) { active.blur(); }
    }
  });

  // ── Escape: close everything ──────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    // Desktop: blur active dropdown element so focus-within clears
    var active = document.activeElement;
    if (active && active.closest('.has-dropdown')) { active.blur(); }
    // Mobile: remove .is-open
    closeAllMobile();
  });

  // ── Mobile: outside click closes dropdown ────────────────────────────────
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
