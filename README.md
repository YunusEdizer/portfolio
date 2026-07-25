# Yunus Emre Edizer — Portföy

Full-Stack Yazılım Mühendisi kişisel portföy sitesi.
Backend · Yapay Zeka · Dağıtık Sistemler.

🔗 **Canlı:** https://yunusedizer.software

## Teknoloji

Bağımlılık gerektirmeyen, tamamen statik bir site:

- **HTML5** — semantik yapı, SEO & Open Graph meta etiketleri
- **CSS3** — özel tasarım sistemi, açık/koyu tema, responsive
- **Vanilla JavaScript** — scroll animasyonları, proje filtreleme, modal, 3D tilt, iletişim formu

Framework yok, build adımı yok. `index.html` doğrudan tarayıcıda çalışır.

## Yerelde çalıştırma

```bash
# Herhangi bir statik sunucu yeterli:
python -m http.server 8000
# → http://localhost:8000
```

Ya da VS Code **Live Server** eklentisiyle `index.html`'i aç.

## Yayına alma

GitHub Pages ile otomatik dağıtım. `main` dalına her push otomatik yayınlanır:

```bash
git add -A
git commit -m "Değişiklik açıklaması"
git push
```

1-2 dakika içinde https://yunusedizer.software güncellenir.

## Dosya yapısı

```
index.html    → Sayfa içeriği ve yapısı
styles.css    → Tasarım, tema, responsive
script.js     → Etkileşimler
robots.txt    → Arama motoru yönergeleri
sitemap.xml   → Site haritası
404.html      → Özel hata sayfası
CNAME         → Özel domain (yunusedizer.software)
```

## İletişim

- ✉️ edizeryunusemre@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/edizeryunusemre)
- 🐙 [GitHub](https://github.com/YunusEdizer)

---

© 2026 Yunus Emre Edizer · İstanbul, Türkiye
