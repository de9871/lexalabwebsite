/* ================================================================
   LEXA Lab — Navigation Script
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

    /* ── Active nav link ─────────────────────────────────────── */
    /* Set aria-current="page" on links that match the current file. */
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    allNavLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

  });
}());
