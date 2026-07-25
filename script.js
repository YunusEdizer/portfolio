/* ============================================================
   Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- Scroll progress bar ---- */
  const progress = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');

  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---- Animated stat counters ---- */
  const stats = document.querySelectorAll('.stat-num');
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(easeOut(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); statIO.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    stats.forEach((s) => statIO.observe(s));
  } else {
    stats.forEach((s) => { s.textContent = s.dataset.target + (s.dataset.suffix || ''); });
  }

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobile.classList.toggle('open');
  });
  mobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobile.classList.remove('open');
    });
  });

  /* ---- Project filters ---- */
  const filterBar = document.getElementById('filters');
  const grid = document.getElementById('projectGrid');
  if (filterBar && grid) {
    const cards = Array.from(grid.querySelectorAll('.project'));
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      filterBar.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const cats = (card.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        card.classList.remove('filtering');
        if (show) {
          card.classList.remove('hide');
          // reflow to restart the entry animation
          void card.offsetWidth;
          card.classList.add('filtering');
        } else {
          card.classList.add('hide');
        }
      });
    });
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---- Theme toggle (persisted) ---- */
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  if (saved) root.setAttribute('data-theme', saved);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (_) {}
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#f4f2ec' : '#0a0b0e');
    });
  }

  /* ---- Project detail modal ---- */
  const modal = document.getElementById('modal');
  if (modal && grid) {
    const mEmoji = document.getElementById('modalEmoji');
    const mTag = document.getElementById('modalTag');
    const mTitle = document.getElementById('modalTitle');
    const mDesc = document.getElementById('modalDesc');
    const mTech = document.getElementById('modalTech');
    const mNote = document.getElementById('modalNote');
    const mActions = document.getElementById('modalActions');

    function openModal(card) {
      mEmoji.textContent = card.querySelector('.project-emoji').textContent;
      mTitle.textContent = card.querySelector('h3').textContent;
      mTag.textContent = card.querySelector('.tag').textContent.replace('●', '').trim();
      mDesc.textContent = card.querySelector('.project-body p').textContent;
      mTech.innerHTML = card.querySelector('.project-tech').innerHTML;
      mNote.textContent = card.dataset.note || '';
      let actions = '';
      if (card.dataset.live) actions += `<a class="m-live" href="${card.dataset.live}" target="_blank" rel="noopener">↗ Canlı Demo</a>`;
      if (card.dataset.store) actions += `<a class="m-live" href="${card.dataset.store}" target="_blank" rel="noopener">↗ App Store</a>`;
      if (card.dataset.play) actions += `<a class="m-live" href="${card.dataset.play}" target="_blank" rel="noopener">↗ Google Play</a>`;
      if (card.dataset.code) actions += `<a class="m-code" href="${card.dataset.code}" target="_blank" rel="noopener">⌥ Kaynak Kod</a>`;
      mActions.innerHTML = actions;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }
    grid.querySelectorAll('.project').forEach((card) => {
      card.addEventListener('click', () => openModal(card));
    });
    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---- 3D tilt on project cards ---- */
  if (!reduce && finePointer && grid) {
    grid.querySelectorAll('.project').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---- Magnetic buttons ---- */
  if (!reduce && finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---- Contact form (Formspree AJAX) ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('cfSubmit');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      if (!form.checkValidity()) {
        status.className = 'form-status err';
        status.textContent = 'Lütfen tüm alanları doğru şekilde doldurun.';
        return;
      }
      // Guard: form not yet configured with a real Formspree endpoint
      if (form.action.includes('YOUR_FORM_ID')) {
        status.className = 'form-status err';
        status.textContent = 'Form henüz yapılandırılmadı. (Formspree endpoint eklenmeli.)';
        return;
      }

      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Gönderiliyor…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Teşekkürler! Mesajın ulaştı, en kısa sürede dönüş yapacağım.';
        } else {
          status.className = 'form-status err';
          status.textContent = 'Bir şeyler ters gitti. Lütfen e-posta ile ulaşmayı dene.';
        }
      } catch (_) {
        status.className = 'form-status err';
        status.textContent = 'Bağlantı hatası. Lütfen e-posta ile ulaşmayı dene.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }

  /* ---- Scrollspy: highlight active nav link ---- */
  const navLinks = document.querySelectorAll('.nav-links a');
  const spySections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && spySections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach((s) => spy.observe(s));
  }

  /* ---- Scroll-to-top button ---- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', document.documentElement.scrollTop > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---- Hero typewriter role ---- */
  const typeEl = document.getElementById('typeText');
  if (typeEl) {
    const roles = ['Backend Mimarisi', 'Yapay Zeka & ML', 'Dağıtık Sistemler', 'Full-Stack Geliştirme'];
    if (reduce) {
      typeEl.textContent = roles[0];
    } else {
      let ri = 0, ci = 0, deleting = false;
      (function tick() {
        const word = roles[ri];
        typeEl.textContent = word.slice(0, ci);
        let delay;
        if (!deleting) {
          ci++;
          delay = 70;
          if (ci > word.length) { deleting = true; delay = 1600; }
        } else {
          ci--;
          delay = 36;
          if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 340; }
        }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---- Cursor spotlight (follows pointer with easing) ---- */
  if (!reduce && finePointer) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, active = false;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; }
    }, { passive: true });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; active = false; });
    (function follow() {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ---- Subtle parallax on hero orbs (pointer) ---- */
  const orbs = document.querySelectorAll('.orb');
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 14;
        orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    }, { passive: true });
  }
})();
