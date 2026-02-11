/* ==========================================================================
   OldResorts.com — Main JavaScript
   Scroll animations, mobile menu, FAQ accordion, nav behavior
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNav();
    setupMobileMenu();
    setupScrollAnimations();
    setupFaqAccordion();
    setupSmoothScroll();
    setupMarquee();
  }

  /* ---------- Navigation Scroll Behavior ---------- */
  function setupNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrollThreshold = 50;
    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > scrollThreshold) {
            nav.classList.add('nav--scrolled');
          } else {
            nav.classList.remove('nav--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Menu ---------- */
  function setupMobileMenu() {
    var hamburger = document.querySelector('.nav__hamburger');
    var mobileMenu = document.querySelector('.mobile-menu');
    var menuLinks = document.querySelectorAll('.mobile-menu__link');

    if (!hamburger || !mobileMenu) return;

    function toggleMenu() {
      var isOpen = mobileMenu.classList.contains('is-open');

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      hamburger.classList.add('is-active');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', toggleMenu);

    menuLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ---------- Scroll Animations (Intersection Observer) ---------- */
  function setupScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- FAQ Accordion ---------- */
  function setupFaqAccordion() {
    var questions = document.querySelectorAll('.faq__question');
    if (!questions.length) return;

    questions.forEach(function (question) {
      question.addEventListener('click', function () {
        var item = this.closest('.faq__item');
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        document.querySelectorAll('.faq__item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          this.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = document.querySelector('.nav')
          ? document.querySelector('.nav').offsetHeight
          : 0;

        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  /* ---------- Duplicate Marquee for Infinite Scroll ---------- */
  function setupMarquee() {
    var track = document.querySelector('.topics__track');
    if (!track) return;

    // Clone children for seamless loop
    var items = track.innerHTML;
    track.innerHTML = items + items;
  }
})();
