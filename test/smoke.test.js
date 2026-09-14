/* Smoke test — index.html + js/main.js ni jsdom ichida ishga tushirib,
   asosiy interaktiv yo'llarni tekshiradi:
   - mavzu (tun/kun) almashtirish
   - mobil menyu ochish/yopish
   - aloqa formasi validatsiyasi
   - footer yili
*/
'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (err) => {
  // "Not implemented" (scrollTo va sh.k.) — jsdom cheklovi, xato emas
  if (!/not implemented/i.test(err.message)) errors.push(err);
});
virtualConsole.on('error', (msg) => errors.push(new Error(String(msg))));

const dom = new JSDOM(html, {
  url: 'http://localhost:8000/',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  virtualConsole,
});

const { window } = dom;
const { document } = window;

/* jsdom tashqi <script src> ni o'zi yuklamaydi — main.js matnini
   inline script sifatida injekt qilamiz (ayni ishlab chiqishdagi kod). */
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'main.js'), 'utf8');
const boot = document.createElement('script');
boot.textContent = mainJs;
document.body.appendChild(boot);

let failed = 0;
function assert(cond, label) {
  if (cond) {
    console.log('PASS  ' + label);
  } else {
    failed++;
    console.log('FAIL  ' + label);
  }
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const root = document.documentElement;

    /* 1. Mavzu almashtirish */
    const toggle = document.getElementById('themeToggle');
    assert(!!toggle, 'themeToggle mavjud');
    const before = root.getAttribute('data-theme');
    toggle.click();
    const after = root.getAttribute('data-theme');
    assert(before !== after, 'mavzu almashdi: ' + before + ' -> ' + after);
    assert(window.localStorage.getItem('theme') === after, 'localStorage yangilandi');
    assert(toggle.getAttribute('aria-pressed') === (after === 'dark' ? 'true' : 'false'), 'aria-pressed to\'g\'ri');
    toggle.click(); // holatni qaytarish

    /* 2. Mobil menyu */
    const burger = document.getElementById('navBurger');
    const nav = document.getElementById('mainNav');
    burger.click();
    assert(nav.classList.contains('is-open') && burger.getAttribute('aria-expanded') === 'true', 'menyu ochildi');
    nav.querySelector('.nav-link').click();
    assert(!nav.classList.contains('is-open') && burger.getAttribute('aria-expanded') === 'false', 'menyu yopildi (havola bosilganda)');

    /* 3. Ko'nikmalar (IntersectionObserver yo'q -> zaxira yo'l) */
    const fill = document.querySelector('.skill-fill');
    assert(fill && fill.style.width === '95%', 'skill-fill zaxira yo\'li to\'ldirdi (width=95%), oldi: ' + (fill && fill.style.width));

    /* 4. Hisoblagichlar (zaxira yo'l) */
    const counter = document.querySelector('.counter');
    assert(counter && counter.textContent === '8+', 'hisoblagich zaxira yo\'li (8+), oldi: ' + counter.textContent);

    /* 5. Forma */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    assert(/to'ldiring/.test(status.textContent), 'bo\'sh forma -> ogohlantirish');

    form.elements.name.value = 'Test';
    form.elements.email.value = 'not-an-email';
    form.elements.message.value = 'Salom';
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    assert(/Email/.test(status.textContent), 'noto\'g\'ri email -> ogohlantirish');

    form.elements.email.value = 'test@dizayn.uz';
    form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    assert(/Rahmat, Test/.test(status.textContent), "to'g'ri forma -> muvaffaqiyat xabari");

    /* 6. Yil */
    const year = document.getElementById('year').textContent;
    assert(year === String(new Date().getFullYear()), 'footer yili to\'g\'ri (' + year + ')');

    /* 7. Skript xatolari */
    assert(errors.length === 0, 'skript xatolari yo\'q' + (errors.length ? ': ' + errors[0].message : ''));

    console.log(failed ? '\nSMOKE TEST: ' + failed + ' FAIL' : '\nSMOKE TEST: ALL PASS');
    process.exit(failed ? 1 : 0);
  }, 300);
});
