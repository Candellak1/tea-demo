/* Изделия и цены T.E.A — единственный источник для витрины, формы, <noscript> и бота.
   Данные: карточки «Товары» сообщества vk.com/tea2026. verify: true — соответствие
   названия и цены не подтверждено мастером (см. docs/VERIFY.md).
   После правки: node tools/build-noscript.mjs (обновит <noscript> и список в форме). */
window.TEA = {
  source: 'Цены — из карточек «Товары» в сообществе ВКонтакте. Актуальную цену уточните у мастера.',
  lead: 'от 1 до 3 дней',

  // art — какой рисунок показать (js/art.js); photo — путь к фото в img/, пока null.
  items: [
    { id: 'belt',       title: 'Ремень мужской',     price: 3000,  art: 'belt',   photo: null, verify: true },
    { id: 'purse',      title: 'Портмоне мужской',   price: 10000, art: 'purse',  photo: null, verify: true },
    { id: 'wallet',     title: 'Кошелёк',            price: 5000,  art: 'wallet', photo: null, verify: true },
    { id: 'card-1500',  title: 'Картхолдер',         price: 1500,  art: 'card',   photo: null, verify: true },
    { id: 'card-2000',  title: 'Картхолдер',         price: 2000,  art: 'card',   photo: null, verify: true },
    { id: 'card-men',   title: 'Картхолдер мужской', price: 3500,  art: 'card',   photo: null, verify: true },
    { id: 'case',       title: 'Футляр для очков',   price: 3000,  art: 'case',   photo: null, verify: true },
    { id: 'clip',       title: 'Зажим',              price: 3000,  art: 'clip',   photo: null, verify: true }
  ],

  // Позиции формы и бота без цены.
  extra: [
    { id: 'bill',  title: 'Счётница для заведения', note: 'по макету, обсуждаем в сообщениях' },
    { id: 'other', title: 'Другое',                 note: 'опишите в комментарии' }
  ],

  // Образцы оттенка — только демонстрация, реальные цвета согласуются с мастером.
  swatches: [
    { id: 'choco',   title: 'Шоколад',     main: '#4a2c1d', shade: '#2e1a10', light: '#6b4430' },
    { id: 'cognac',  title: 'Коньяк',      main: '#9a5a2e', shade: '#6e3c1a', light: '#b8774a' },
    { id: 'natural', title: 'Натуральный', main: '#c99a68', shade: '#a37748', light: '#dcb68c' },
    { id: 'sand',    title: 'Песочный',    main: '#b39b62', shade: '#8c7744', light: '#cbb683' },
    { id: 'green',   title: 'Изумрудный',  main: '#1f6b4f', shade: '#134634', light: '#2f8a68' }
  ],

  delivery: [
    { id: 'simf',  title: 'Симферополь',    text: 'Бесплатная доставка по Симферополю.' },
    { id: 'other', title: 'Другой регион',  text: 'Доставка в другие регионы через СДЭК. Стоимость и сроки СДЭК уточните у мастера.' }
  ]
};

/* Подпись позиции: у одинаковых названий добавляется цена — «Картхолдер (1 500 ₽)». */
window.TEA.rub = (n) => n.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽';
window.TEA.label = (item) => {
  const twins = window.TEA.items.filter((i) => i.title === item.title).length > 1;
  return twins ? `${item.title} (${window.TEA.rub(item.price)})` : item.title;
};
