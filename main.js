(() => {
  const loader = document.querySelector('.loader');
  document.body.classList.add('loading');
  const dismissLoader = () => { loader?.classList.add('is-gone'); document.body.classList.remove('loading'); };
  window.addEventListener('load', () => window.setTimeout(dismissLoader, 450), { once: true });
  window.setTimeout(dismissLoader, 1900);

  const header = document.querySelector('.site-header');
  const backTop = document.querySelector('.back-top');
  const updateScrollState = () => {
    const scrolled = window.scrollY > 32;
    header?.classList.toggle('scrolled', scrolled);
    backTop?.classList.toggle('visible', window.scrollY > 500);
  };
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => { menuToggle?.setAttribute('aria-expanded', 'false'); menuToggle?.setAttribute('aria-label', 'Abrir menu'); nav?.classList.remove('open'); };
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    nav?.classList.toggle('open', !isOpen);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(chip => { const active = chip === button; chip.classList.toggle('active', active); chip.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('.product-card').forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  }));

  const slides = [...document.querySelectorAll('.newness-slide')];
  let currentSlide = 0;
  const paintSlide = index => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === currentSlide); slide.setAttribute('aria-hidden', String(i !== currentSlide)); });
    const count = document.querySelector('.carousel-count');
    if (count) count.innerHTML = `<b>${String(currentSlide + 1).padStart(2, '0')}</b> / ${String(slides.length).padStart(2, '0')}`;
  };
  document.querySelector('[data-carousel="prev"]')?.addEventListener('click', () => paintSlide(currentSlide - 1));
  document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => paintSlide(currentSlide + 1));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const image = link.querySelector('img');
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = link.href;
    lightboxImage.alt = image?.alt || 'Imagem da coleção Todabellab';
    lightbox.showModal();
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener('close', () => { if (lightboxImage) lightboxImage.src = ''; });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
