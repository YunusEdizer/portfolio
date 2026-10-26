(function () {
  'use strict';

  /* Menü: kaydırınca alt çizgi, mobilde aç/kapa */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  document.querySelectorAll('.nav-mobile a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Görünüme girince belir */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Proje filtresi */
  var filters = document.getElementById('filters');
  var cards = document.querySelectorAll('#projectGrid .card');
  filters.addEventListener('click', function (ev) {
    var btn = ev.target.closest('button');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    var f = btn.dataset.filter;
    cards.forEach(function (c) {
      var show = f === 'all' || (c.dataset.cat || '').split(' ').indexOf(f) !== -1;
      c.classList.toggle('hidden', !show);
      if (show) c.classList.add('in');
    });
  });

  /* İletişim formu */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { status.textContent = 'Lütfen tüm alanları doldurun.'; return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; status.textContent = 'Gönderiliyor…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) { form.reset(); status.textContent = 'Teşekkürler, mesajınız ulaştı.'; }
        else { status.textContent = 'Gönderilemedi. E-posta ile ulaşabilirsiniz.'; }
      })
      .catch(function () { status.textContent = 'Bağlantı hatası. E-posta ile ulaşabilirsiniz.'; })
      .finally(function () { btn.disabled = false; });
  });
})();
