/* Оригинальные SVG-силуэты изделий (рисованные, не по фото клиента).
   Цвет кожи — CSS-переменные --lc/--ld/--ll, фурнитура — --metal.
   .st — строчка (прошивается из main.js), .age — слой патины (opacity от --age). */
(function () {
  const V = 'viewBox="0 0 360 260"';
  const shadow = (cx, cy, rx) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="12" fill="#000" opacity=".22"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.7}" ry="7" fill="#000" opacity=".18"/>`;
  // Патина: тот же силуэт тёмным слоем + лёгкий блик «раскрывшейся» фактуры.
  const age = (d) =>
    `<path class="age" d="${d}" fill="var(--aged)"/>` +
    `<path class="sheen" d="${d}" style="fill:var(--sheen)"/>`;
  const rivet = (x, y, r = 10) =>
    `<g class="rivet" style="transform-origin:${x}px ${y}px">` +
    `<circle cx="${x}" cy="${y + 1.5}" r="${r}" fill="#000" opacity=".3"/>` +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--metal)"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="var(--metal-d)"/>` +
    `<circle cx="${x - r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.28}" fill="#f3d9b5" opacity=".8"/></g>`;
  const stitch = (d) => `<path class="st" d="${d}"/>`;

  const ART = {
    belt() {
      const strap = 'M52 112 H296 Q330 112 342 130 Q330 148 296 148 H52 Z';
      return `<svg ${V} class="art" role="img" aria-label="Ремень с пряжкой">
        ${shadow(190, 214, 150)}
        <g transform="rotate(-11 190 130)">
          <path d="${strap}" fill="var(--lc)"/>
          <path d="M52 112 H296 Q318 112 332 121 H52 Z" fill="var(--ll)" opacity=".55"/>
          ${age(strap)}
          ${stitch('M96 119 H294 Q320 119 330 130 Q320 141 294 141 H96')}
          <rect x="92" y="104" width="18" height="52" rx="4" fill="var(--ld)"/>
          ${[214, 238, 262, 286].map((x) => `<circle cx="${x}" cy="130" r="4.6" fill="#1b100a"/><circle cx="${x}" cy="131.5" r="3" fill="#000" opacity=".4"/>`).join('')}
          <rect x="24" y="98" width="50" height="64" rx="13" fill="none" stroke="var(--metal-d)" stroke-width="9"/>
          <rect x="24" y="96" width="50" height="64" rx="13" fill="none" stroke="var(--metal)" stroke-width="7"/>
          <path d="M30 130 H104" stroke="var(--metal-d)" stroke-width="6" stroke-linecap="round"/>
          <path d="M30 129 H102" stroke="var(--metal)" stroke-width="4" stroke-linecap="round"/>
        </g></svg>`;
    },

    purse(o = {}) {
      const body = 'M78 52 H286 Q302 52 302 68 V200 Q302 216 286 216 H78 Q62 216 62 200 V68 Q62 52 78 52 Z';
      const tab = o.tab
        ? `<path d="M240 108 H316 Q330 108 330 122 V146 Q330 160 316 160 H240 Z" fill="var(--ld)" opacity=".7" transform="translate(0 4)"/>
           <path class="tab" d="M240 104 H314 Q328 104 328 118 V142 Q328 156 314 156 H240 Z" fill="var(--lc)"/>
           ${age('M240 104 H314 Q328 104 328 118 V142 Q328 156 314 156 H240 Z')}
           ${stitch('M244 112 H312 Q320 112 320 120 V140 Q320 148 312 148 H244')}
           ${rivet(302, 130, 11)}`
        : '';
      return `<svg ${V} class="art" role="img" aria-label="${o.label || 'Портмоне'}">
        ${shadow(184, 226, 140)}
        <path d="M84 44 H292 Q308 44 308 60 V194 Q308 210 292 210 H84 Z" fill="var(--ld)"/>
        <path d="${body}" fill="var(--lc)"/>
        <path d="M78 52 H286 Q302 52 302 68 V74 H62 V68 Q62 52 78 52 Z" fill="var(--ll)" opacity=".5"/>
        <path d="M78 52 H88 V216 H78 Q62 216 62 200 V68 Q62 52 78 52 Z" fill="var(--ld)" opacity=".8"/>
        ${age(body)}
        ${stitch('M100 64 H284 Q290 64 290 70 V198 Q290 204 284 204 H100')}
        <text x="270" y="194" text-anchor="end" font-family="Podkova, Georgia, serif" font-weight="800" font-size="15" fill="var(--ld)" opacity=".75" letter-spacing="2">T·E·A</text>
        ${tab}</svg>`;
    },

    wallet() {
      const body = 'M70 86 H290 Q306 86 306 102 V206 Q306 222 290 222 H70 Q54 222 54 206 V102 Q54 86 70 86 Z';
      const flap = 'M54 96 Q54 72 78 72 H282 Q306 72 306 96 V122 Q306 150 278 156 L200 170 Q180 174 160 170 L82 156 Q54 150 54 122 Z';
      return `<svg ${V} class="art" role="img" aria-label="Кошелёк с клапаном и кнопкой">
        ${shadow(180, 232, 138)}
        <path d="${body}" fill="var(--ld)"/>
        <path d="M54 150 H306 V206 Q306 222 290 222 H70 Q54 222 54 206 Z" fill="var(--lc)"/>
        ${stitch('M66 208 H294')}
        <path d="${flap}" fill="#000" opacity=".25" transform="translate(0 5)"/>
        <path d="${flap}" fill="var(--lc)"/>
        <path d="M54 96 Q54 72 78 72 H282 Q306 72 306 96 V100 H54 Z" fill="var(--ll)" opacity=".5"/>
        ${age(flap)}
        ${stitch('M66 100 Q66 84 82 84 H278 Q294 84 294 100 V120 Q294 140 274 145 L198 158 Q180 161 162 158 L86 145 Q66 140 66 120 Z')}
        ${rivet(180, 150, 12)}</svg>`;
    },

    card() {
      const body = 'M92 64 H268 Q282 64 282 78 V200 Q282 214 268 214 H92 Q78 214 78 200 V78 Q78 64 92 64 Z';
      const pocket = 'M78 112 Q130 124 152 124 Q160 140 180 140 Q200 140 208 124 Q230 124 282 112 V200 Q282 214 268 214 H92 Q78 214 78 200 Z';
      return `<svg ${V} class="art" role="img" aria-label="Картхолдер с карманами">
        ${shadow(180, 228, 112)}
        <rect x="104" y="34" width="152" height="64" rx="7" fill="#d8ccb6"/>
        <rect x="96" y="44" width="168" height="66" rx="7" fill="#efe6d6"/>
        <rect x="112" y="58" width="44" height="8" rx="3" fill="#cdbfa6"/>
        <path d="${body}" fill="var(--ld)"/>
        <path d="${pocket}" fill="var(--lc)"/>
        <path d="M78 112 Q130 124 152 124 Q160 140 180 140 Q200 140 208 124 Q230 124 282 112 V120 Q230 132 208 132 Q200 148 180 148 Q160 148 152 132 Q130 132 78 120 Z" fill="var(--ll)" opacity=".45"/>
        ${age(pocket)}
        ${stitch('M90 76 V200 Q90 204 94 204 H266 Q270 204 270 200 V76')}
        ${stitch('M92 172 H268')}</svg>`;
    },

    case() {
      const body = 'M74 92 H286 Q324 92 324 130 V160 Q324 198 286 198 H74 Q36 198 36 160 V130 Q36 92 74 92 Z';
      const flap = 'M244 86 H288 Q330 86 330 128 V162 Q330 204 288 204 H244 Q222 145 244 86 Z';
      return `<svg ${V} class="art" role="img" aria-label="Футляр для очков с клапаном">
        ${shadow(184, 222, 150)}
        <path d="${body}" fill="var(--lc)"/>
        <path d="M74 92 H286 Q314 92 322 112 H38 Q46 92 74 92 Z" fill="var(--ll)" opacity=".5"/>
        ${age(body)}
        ${stitch('M240 104 H74 Q50 104 50 128 V162 Q50 186 74 186 H240')}
        <path d="${flap}" fill="#000" opacity=".25" transform="translate(-4 3)"/>
        <path d="${flap}" fill="var(--ld)"/>
        ${stitch('M252 98 H288 Q318 98 318 128 V162 Q318 192 288 192 H252')}
        ${rivet(262, 145, 11)}</svg>`;
    },

    clip() {
      const body = 'M98 82 H262 Q280 82 280 100 V188 Q280 206 262 206 H98 Q80 206 80 188 V100 Q80 82 98 82 Z';
      return `<svg ${V} class="art" role="img" aria-label="Кожаный зажим с металлической пластиной">
        ${shadow(180, 224, 112)}
        <path d="M104 72 H268 Q286 72 286 90 V178 Q286 196 268 196 H104 Z" fill="var(--ld)"/>
        <path d="${body}" fill="var(--lc)"/>
        ${age(body)}
        ${stitch('M92 94 H268 V194 H92 Z')}
        <path d="M126 92 Q126 58 150 58 H210 Q234 58 234 92 V136 Q234 146 224 146 H136 Q126 146 126 136 Z" fill="#000" opacity=".25" transform="translate(0 4)"/>
        <path d="M126 92 Q126 58 150 58 H210 Q234 58 234 92 V136 Q234 146 224 146 H136 Q126 146 126 136 Z" fill="var(--metal)"/>
        <path d="M136 92 Q136 68 152 68 H208 Q224 68 224 92 V100 H136 Z" fill="#f3d9b5" opacity=".35"/>
        <path d="M134 128 H226" stroke="var(--metal-d)" stroke-width="2" opacity=".6"/></svg>`;
    }
  };

  window.TEA_ART = (key, opts) => (ART[key] || ART.card)(opts);
})();
