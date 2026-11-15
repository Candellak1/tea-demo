/* T.E.A — поведение страницы. Данные: js/products-data.js, рисунки: js/art.js */
(function () {
  'use strict';
  const T = window.TEA;
  const ART = window.TEA_ART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const later = (fn, ms) => setTimeout(fn, still ? 0 : ms);

  /* ---------- Строчка: каждый .st раскрывается маской (stroke-dashoffset) ---------- */
  let uid = 0;
  function prepSew(svg) {
    if (still || svg.dataset.sewPrep) return;
    svg.dataset.sewPrep = '1';
    const defs = svg.querySelector('defs') || svg.insertBefore(svgEl('defs', {}), svg.firstChild);
    $$('.st', svg).forEach((st) => {
      const id = `sew-${++uid}`;
      const m = svgEl('mask', { id, maskUnits: 'userSpaceOnUse', x: -2000, y: -2000, width: 6000, height: 6000 });
      m.append(svgEl('path', { d: st.getAttribute('d'), class: 'sew', pathLength: 1 }));
      defs.append(m);
      st.setAttribute('mask', `url(#${id})`);
    });
  }
  const sew = (svg, t) => {
    if (t) svg.style.setProperty('--sew-t', t);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('sewn')));
  };

  /* Шов по контуру лоскута в пикселях: форма из data-stitch */
  function seamPath(shape, w, h, i = 10) {
    if (shape === 'cut') {
      const c = 22, k = c + 0.414 * i;
      return `M${k} ${i} H${w - i} V${h - k} L${w - k} ${h - i} H${i} V${k} Z`;
    }
    if (shape === 'zig') return `M${i} ${i} H${w - i} V${h - 9 - i} H${i} Z`;
    // petal: радиусы 56/10/56/10 минус отступ
    const R = 56 - i, r = Math.max(10 - i, 2);
    return `M${i + R} ${i} H${w - i - r} Q${w - i} ${i} ${w - i} ${i + r} V${h - i - R} Q${w - i} ${h - i} ${w - i - R} ${h - i} H${i + r} Q${i} ${h - i} ${i} ${h - i - r} V${i + R} Q${i} ${i} ${i + R} ${i} Z`;
  }
  // Размеры берём из ResizeObserver — без принудительного пересчёта раскладки
  function buildSeam(patch, w, h) {
    if (!w || !h) return;
    const old = $(':scope > .seam', patch);
    const done = old && old.classList.contains('sewn');
    const svg = svgEl('svg', { class: 'seam', viewBox: `0 0 ${w} ${h}`, 'aria-hidden': 'true', focusable: 'false' });
    svg.append(svgEl('path', { class: 'st', d: seamPath(patch.dataset.stitch, w, h) }));
    if (old) old.replaceWith(svg); else patch.append(svg);
    prepSew(svg);
    if (done) svg.classList.add('sewn');
    else if (patch.dataset.sewPending) { delete patch.dataset.sewPending; later(() => sew(svg, patch.classList.contains('hero__art') ? '1.6s' : ''), 150); }
  }
  const patchRo = new ResizeObserver((entries) => entries.forEach((e) => {
    const box = e.borderBoxSize && e.borderBoxSize[0];
    buildSeam(e.target, Math.round(box ? box.inlineSize : e.target.offsetWidth), Math.round(box ? box.blockSize : e.target.offsetHeight));
  }));
  $$('[data-stitch]').forEach((p) => patchRo.observe(p));
  const sewPatch = (patch) => { const sm = $(':scope > .seam', patch); if (sm) later(() => sew(sm), 200); else patch.dataset.sewPending = '1'; };
  new ResizeObserver(() => placeBuckle()).observe(document.querySelector('.belt__strap'));

  /* ---------- Появление лоскутов ---------- */
  const revealers = $$('.patch:not(.hero__art), .tabs-line');
  revealers.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      el.classList.add('is-in');
      if (el.dataset.stitch) sewPatch(el);
      const stamp = $('.days-stamp', el);
      if (stamp) later(() => stamp.classList.add('slap'), 700);
    });
  }, { threshold: 0.18 });
  revealers.forEach((el) => io.observe(el));

  /* ---------- Ремень-навигация: пряжка в отверстии активного раздела ---------- */
  const strap = $('.belt__strap');
  const buckle = $('.belt__buckle');
  const links = $$('.belt__holes a');
  const owner = { products: 'products', venues: 'venues', how: 'how', feed: 'how', order: 'order' };
  let current = null;
  function placeBuckle() {
    const sr = strap.getBoundingClientRect();
    const bw = buckle.getBoundingClientRect().width;
    const link = links.find((a) => a.hash === `#${current}`);
    let x;
    if (link) {
      const hr = $('.belt__hole', link).getBoundingClientRect();
      x = hr.left + hr.width / 2 - sr.left - bw / 2;
    } else {
      x = parseFloat(getComputedStyle($('.belt__holes')).paddingLeft) / 2 + parseFloat(getComputedStyle(strap).paddingLeft) - bw / 2;
    }
    buckle.style.setProperty('--bx', `${Math.round(x)}px`);
  }
  function setActive(id) {
    if (id === current) return;
    current = id;
    links.forEach((a) => (a.hash === `#${id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    placeBuckle();
  }
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(owner[e.target.id] || null); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main > section').forEach((s) => navIo.observe(s));
  placeBuckle();

  /* ---------- Патина по прокрутке ---------- */
  let ticking = false;
  function patina() {
    ticking = false;
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    root.style.setProperty('--patina', p.toFixed(3));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(patina); } }, { passive: true });
  patina();

  /* ---------- Hero: прошивка, заклёпка, штамп, ползунок «время» ---------- */
  const heroPiece = $('.hero__piece');
  const heroSvg = $('svg', heroPiece);
  if (heroSvg) {
    prepSew(heroSvg);
    sew(heroSvg, '1.6s');
    sewPatch($('.hero__art'));
    later(() => { const r = $('.rivet', heroSvg); if (r) r.classList.add('click'); }, 1650);
  }
  later(() => $('.hero .stamp').classList.add('slap'), 1900);
  const age = $('#hero-age');
  const setAge = () => heroPiece.style.setProperty('--age', (age.value / 100).toFixed(2));
  age.addEventListener('input', setAge);
  setAge();

  /* ---------- Витрина ---------- */
  const tokens = $('#tokens');
  const stage = $('#stage');
  const stamp = $('#price-stamp');
  const photo = $('#stage-photo');
  let pick = 0;
  let shade = 1; // «Коньяк»

  T.items.forEach((item, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'token';
    b.setAttribute('role', 'radio');
    b.dataset.i = i;
    b.innerHTML = `<span class="token__name">${item.title}</span><span class="token__price">${T.rub(item.price)}</span>`;
    tokens.append(b);
  });
  const tokenEls = $$('.token', tokens);

  function radioKeys(group, els, onPick) {
    group.addEventListener('keydown', (e) => {
      const i = els.indexOf(document.activeElement);
      if (i < 0) return;
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const n = (i + step + els.length) % els.length;
      els[n].focus();
      onPick(n);
    });
  }

  function showItem(i, first) {
    pick = i;
    const item = T.items[i];
    tokenEls.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    const prev = $('.stage__art:not(.out)', stage);
    const next = document.createElement('div');
    next.className = 'stage__art' + (first ? '' : ' in');
    next.innerHTML = ART(item.art);
    stage.append(next);
    const svg = $('svg', next);
    prepSew(svg);
    sew(svg, first ? '1.2s' : '.8s');
    if (prev) {
      prev.classList.add('out');
      const drop = () => prev.remove();
      prev.addEventListener('animationend', drop, { once: true });
      setTimeout(drop, 450);
    }
    $('.price-stamp__name', stamp).textContent = T.label(item);
    $('.price-stamp__price', stamp).textContent = T.rub(item.price);
    if (!first && !still) { stamp.classList.remove('slap2'); void stamp.offsetWidth; stamp.classList.add('slap2'); }
    if (item.photo) { $('img', photo).src = item.photo; $('img', photo).alt = T.label(item); photo.hidden = false; } else photo.hidden = true;
  }
  tokens.addEventListener('click', (e) => { const b = e.target.closest('.token'); if (b && +b.dataset.i !== pick) showItem(+b.dataset.i); });
  radioKeys(tokens, tokenEls, showItem);

  const swatchRow = $('#swatches');
  const swTitle = $('#swatches-title');
  T.swatches.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-label', s.title);
    b.style.setProperty('--c', s.main);
    b.dataset.i = i;
    swatchRow.append(b);
  });
  const swEls = $$('.swatch', swatchRow);
  function setShade(i) {
    shade = i;
    const s = T.swatches[i];
    swEls.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    stage.style.setProperty('--lc', s.main);
    stage.style.setProperty('--ld', s.shade);
    stage.style.setProperty('--ll', s.light);
    swTitle.textContent = `Оттенок — образец: ${s.title.toLowerCase()}`;
  }
  swatchRow.addEventListener('click', (e) => { const b = e.target.closest('.swatch'); if (b) setShade(+b.dataset.i); });
  radioKeys(swatchRow, swEls, setShade);
  showItem(0, true);
  setShade(shade);

  /* ---------- Подстановка в форму ---------- */
  const form = $('#order-form');
  const fItem = $('#f-item');
  const fNote = $('#f-note');
  function prefill(id, note) {
    fItem.value = id;
    if (fItem.getAttribute('aria-invalid')) validate('item');
    if (note && !fNote.value.trim()) { fNote.value = note; count(); }
    later(() => $('#f-name').focus({ preventScroll: true }), 700);
  }
  $('#order-this').addEventListener('click', () => prefill(T.items[pick].id, `Оттенок как образец «${T.swatches[shade].title}» — обсудим.`));
  $$('[data-pick]').forEach((a) => a.addEventListener('click', () => prefill(a.dataset.pick)));

  /* ---------- Счётница ---------- */
  const folder = $('#folder');
  const folderSr = $('.folder__sr', folder);
  const folderHint = $('.folder__hint');
  folder.addEventListener('click', () => {
    const open = folder.getAttribute('aria-expanded') !== 'true';
    folder.setAttribute('aria-expanded', String(open));
    folderSr.textContent = open ? 'Закрыть счётницу' : 'Открыть счётницу';
    folderHint.textContent = open ? 'Нажмите, чтобы закрыть' : 'Нажмите, чтобы открыть';
  });
  const HL = {
    layout: '«Каждая строчка, каждый сгиб — продуман до мелочей». Макет обсуждаем в сообщениях.',
    color: 'Цвет кожи обсуждаем вместе, в сообщениях.',
    hardware: 'Фурнитуру согласуем вместе с макетом и цветом.'
  };
  const steps = $$('.step3');
  steps.forEach((b) => b.addEventListener('click', () => {
    steps.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    if (folder.getAttribute('aria-expanded') === 'true') folder.click(); // показать обложку
    folder.dataset.hl = '';
    void folder.offsetWidth;
    folder.dataset.hl = b.dataset.hl;
    $('#steps3-text').textContent = HL[b.dataset.hl];
  }));

  /* ---------- Доставка ---------- */
  const delBtns = $$('#delivery-toggle button');
  function setDelivery(i) {
    const d = T.delivery[i];
    delBtns.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    $('#delivery-text').textContent = d.text;
    const r = $(`#f-del-${d.id}`);
    if (r) r.checked = true;
  }
  delBtns.forEach((b, i) => b.addEventListener('click', () => setDelivery(i)));
  radioKeys($('#delivery-toggle'), delBtns, setDelivery);
  setDelivery(0);

  /* ---------- Форма (демо: ничего не отправляет) ---------- */
  const noteCount = $('#f-note-count');
  const count = () => { noteCount.textContent = `${fNote.value.length} / 300`; };
  fNote.addEventListener('input', count);

  const fVk = $('#f-vk');
  const fPhone = $('#f-phone');
  const via = () => form.elements.via.value;
  function toggleVia() {
    const vk = via() === 'vk';
    $('#field-vk').hidden = !vk;
    $('#field-phone').hidden = vk;
    clearErr(vk ? 'phone' : 'vk');
  }
  $$('input[name="via"]').forEach((r) => r.addEventListener('change', toggleVia));

  // цифры номера без кода страны: «+7 (978) …» и вставка «8978…» дают одно и то же
  const digits = (v) => {
    let d = v.trim().replace(/^\+7/, '').replace(/\D/g, '');
    if (d.length > 10 && /^[78]/.test(d)) d = d.slice(1);
    return d.slice(0, 10);
  };
  function maskPhone() {
    const d = digits(fPhone.value);
    let out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    fPhone.value = d.length ? out : (document.activeElement === fPhone ? '+7 ' : '');
  }
  fPhone.addEventListener('input', maskPhone);
  fPhone.addEventListener('focus', () => { if (!fPhone.value) fPhone.value = '+7 '; });
  fPhone.addEventListener('blur', () => { if (!digits(fPhone.value).length) fPhone.value = ''; });

  const RULES = {
    name: () => { const v = $('#f-name').value.trim(); if (!v) return 'Напишите, как к вам обращаться.'; return /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'’-]{1,39}$/.test(v) ? '' : 'Имя — буквами, от 2 символов.'; },
    item: () => (fItem.value ? '' : 'Выберите, что нужно. Если нет в списке — «Другое».'),
    vk: () => { if (via() !== 'vk') return ''; const v = fVk.value.trim(); if (!v) return 'Укажите ссылку на страницу или имя во ВКонтакте.'; return v.length >= 3 ? '' : 'Слишком коротко: нужна ссылка или имя.'; },
    phone: () => { if (via() !== 'phone') return ''; const n = digits(fPhone.value).length; if (!n) return 'Укажите номер телефона.'; return n === 10 ? '' : 'Номер неполный: нужно +7 и ещё 10 цифр.'; },
    agree: () => ($('#f-agree').checked ? '' : 'Без согласия мастер не сможет ответить на заявку.')
  };
  const FIELD = { name: '#f-name', item: '#f-item', vk: '#f-vk', phone: '#f-phone', agree: '#f-agree' };
  function clearErr(k) { const f = $(FIELD[k]); f.removeAttribute('aria-invalid'); $(`${FIELD[k]}-err`).textContent = ''; }
  function validate(k) {
    const msg = RULES[k]();
    const f = $(FIELD[k]);
    if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
    $(`${FIELD[k]}-err`).textContent = msg;
    return !msg;
  }
  let tried = false;
  form.addEventListener('input', (e) => {
    if (!tried) return;
    const k = Object.keys(FIELD).find((key) => e.target.matches(FIELD[key]));
    if (k) validate(k);
  });
  form.addEventListener('change', (e) => { if (tried && e.target.name === 'item') validate('item'); if (tried && e.target.name === 'agree') validate('agree'); });

  const receipt = $('#receipt');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tried = true;
    const bad = Object.keys(RULES).filter((k) => !validate(k));
    if (bad.length) { $(FIELD[bad[0]]).focus(); return; }
    showReceipt();
  });

  function showReceipt() {
    const id = fItem.value;
    const item = T.items.find((i) => i.id === id);
    const extra = T.extra.find((x) => x.id === id);
    const what = item ? `${item.title} — ${T.rub(item.price)}` : extra.title;
    const del = form.elements.delivery.value === 'simf' ? 'Симферополь, бесплатно' : 'Другой регион, СДЭК';
    const d = digits(fPhone.value);
    const contact = via() === 'vk' ? `ВКонтакте, ${fVk.value.trim()}` : `Телефон, +7 ··· ···-··-${d.slice(8)}`;
    const note = fNote.value.trim();
    const rows = [['Имя', $('#f-name').value.trim()], ['Изделие', what], ...(note ? [['Пожелания', note.length > 90 ? note.slice(0, 90) + '…' : note]] : []), ['Доставка', del], ['Связь', contact]];
    const list = $('#receipt-list');
    list.replaceChildren(...rows.flatMap(([k, v]) => { const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v; return [dt, dd]; }));
    $('#receipt-no').textContent = `Заявка № ${String(Date.now()).slice(-4)} (демо)`;
    form.hidden = true;
    receipt.hidden = false;
    receipt.classList.remove('pin'); void receipt.offsetWidth; receipt.classList.add('pin');
    // шов вокруг бланка
    const seam = $('.receipt__seam', receipt);
    const w = receipt.offsetWidth, h = receipt.offsetHeight, i = 7;
    seam.setAttribute('viewBox', `0 0 ${w} ${h}`);
    seam.replaceChildren(svgEl('path', { class: 'st', d: `M${i} ${i} H${w - i} V${h - i} H${i} Z` }));
    delete seam.dataset.sewPrep;
    seam.classList.remove('sewn');
    prepSew(seam);
    later(() => sew(seam, '1.2s'), 350);
    receipt.focus({ preventScroll: true });
    receipt.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  }
  $('#receipt-again').addEventListener('click', () => {
    form.reset();
    tried = false;
    Object.keys(FIELD).forEach(clearErr);
    toggleVia(); count();
    setDelivery(delBtns.findIndex((b) => b.getAttribute('aria-checked') === 'true'));
    receipt.hidden = true;
    form.hidden = false;
    $('#f-name').focus();
  });

  /* ---------- Искра на хлястиках ---------- */
  if (!still) document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.strap-btn');
    if (!b) return;
    const s = document.createElement('span');
    s.className = 'spark';
    s.setAttribute('aria-hidden', 'true');
    b.append(s);
    setTimeout(() => s.remove(), 500);
  });
})();
