/* ================================================================
   Lexa Lab — Navigation Script
   Handles: mobile menu toggle, scroll shadow, active link state
   ================================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Mobile menu ─────────────────────────────────────────── */
    const menuBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function openMenu() {
      mobileMenu.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close navigation menu');
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'close';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open navigation menu');
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
      });

      /* Close on Escape */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          closeMenu();
          menuBtn.focus();
        }
      });

      /* Close on click outside header */
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.site-header') && mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      });
    }

    /* ── Scroll shadow ───────────────────────────────────────── */
    const header = document.querySelector('.site-header');
    if (header) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    /* ── Research dropdown (desktop) ─────────────────────────── */
    /* Hover/focus-within is handled in CSS; this adds click + keyboard
       toggling so the menu also works for touch and keyboard users. */
    var dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
      var parent = toggle.closest('.nav-item-dropdown');
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      /* Close when focus leaves the dropdown */
      if (parent) {
        parent.addEventListener('focusout', function (e) {
          if (!parent.contains(e.relatedTarget)) {
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });

    /* Collapse open dropdowns on outside click or Escape */
    document.addEventListener('click', function (e) {
      dropdownToggles.forEach(function (toggle) {
        if (!toggle.closest('.nav-item-dropdown').contains(e.target)) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdownToggles.forEach(function (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });

    /* ── Active nav link ─────────────────────────────────────── */
    /* Set aria-current="page" on links that match the current file. */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-dropdown-link');

    allNavLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        /* If a dropdown child is active, highlight its parent toggle too. */
        if (link.classList.contains('nav-dropdown-link')) {
          var dd = link.closest('.nav-item-dropdown');
          var parentToggle = dd && dd.querySelector('.nav-dropdown-toggle');
          if (parentToggle) parentToggle.classList.add('active-parent');
        }
      }
    });

  });
}());
