

(function () {
  'use strict';

  function getBasePath() {
    const scripts = document.querySelectorAll('script[src]');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].getAttribute('src');
      if (src && src.includes('partials.js')) {
        return src.replace('js/partials.js', '');
      }
    }
    return '';
  }

  const base = getBasePath();


  function injectPartial(url, placeholderId) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.text();
      })
      .then(function (html) {
        const el = document.getElementById(placeholderId);
        if (el) {
          el.outerHTML = html;
        }
      });
  }

  function setActiveLinks() {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.site-nav__links a, .site-nav__mobile-links a')
      .forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) return;


        const normHref = href.replace(/^\//, '');
        const normPath = currentPath.replace(/^\//, '');

        const isHome = normHref === 'index.html' || normHref === '';
        const isExact = normPath === normHref;
        const isParent = !isHome && normPath.startsWith(
          normHref.replace(/\.html$/, '').replace(/\/$/, '')
        );

        if (isExact || isParent) {
          link.classList.add('is-active');
        }
      });
  }


  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }


  Promise.all([
    injectPartial(base + 'partials/nav.html', 'nav-placeholder'),
    injectPartial(base + 'partials/footer.html', 'footer-placeholder'),
  ])
  .then(function () {
    setActiveLinks();
    setFooterYear();


    initNav();
  })
  .catch(function (err) {
    console.warn('Partials error:', err);
  });


  function initNav() {
    const nav        = document.querySelector('.site-nav');
    const hamburger  = document.querySelector('.site-nav__hamburger');
    const mobileMenu = document.querySelector('.site-nav__mobile');

    if (!nav) return;


    function handleScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

   
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.toggle('is-open');
        mobileMenu.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });


      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('is-open');
          mobileMenu.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });


      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && mobileMenu.classList.contains('is-open')) {
          hamburger.classList.remove('is-open');
          mobileMenu.classList.remove('is-open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

})();