# dizayn — Soft UI Portfolio

Soft UI (neyumorfizm) uslubidagi shaxsiy portfolio veb-sayti.

## Imkoniyatlar

- **Tun / Kun rejimi** — yuqoridagi tugma orqali almashadi, tanlov `localStorage`da saqlanadi,
  birinchi kirishda tizim (`prefers-color-scheme`) sozlamasiga moslanadi.
- **Soft UI (neyumorfizm)** — yumshoq qavariq va botiq sirtlar, ikki tomonlama soyalar.
- **Rang palitrasi** — och ko'k (`#3d8bfd`) va to'q ko'k (`#16386e`) asosida.
- Bo'limlar: Hero, Haqimda, Ko'nikmalar, Portfolio, Xizmatlar, Fikrlar, Aloqa.
- Scroll-reveal animatsiyalar, animatsiyalangan ko'nikmalar chizig'i va hisoblagichlar.
- To'liq responsiv (mobil menyu bilan).

## Ishga tushirish

Statik sayt — istalgan statik server yetarli:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

so'ng brauzerda `http://localhost:8000` ni oching.

## Tuzilma

```
index.html          — sahifa
css/style.css       — Soft UI uslublar va mavzular
js/main.js          — interaktivlik (mavzu, menyu, animatsiyalar, forma)
assets/img/         — portfolio va avatar rasmlari
```
