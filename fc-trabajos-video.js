/* ══════════════════════════════════════════════════════════════════
   TRABAJOS COMO VÍDEO EN TIEMPO REAL + AUDIO GRATIS · Fátima Servicios
   ------------------------------------------------------------------
   PARCHE ADITIVO. No toca la plantilla de diseño (sc-for/{{ }}) ni el
   runtime. Convierte las tarjetas de la galería "Mis Trabajos" en
   piezas animadas que se ven como vídeo, SIN generar ningún archivo:

     · Antes/Después en bucle  → el corte se desliza solo (parece vídeo)
     · Ken Burns               → la foto se acerca despacio
     · Giro 3D / Zoom          → movimiento con profundidad
     · Audio gratis            → al tocar 🔊, la voz del navegador lee el
                                 título (gratis) o suena un brillo

   Cada trabajo usa el efecto y el audio que la administradora eligió en
   el Panel Admin (campos w.anim / w.audio, guardados en el trabajo). Si
   no hay elección, se decide automáticamente lo que mejor le queda.

   Progresivo: si el navegador no puede animar o hablar, la galería sigue
   funcionando igual. Cero dependencias externas.

   Marca de carga: window._FC_TRABAJOS_VIDEO · IDs/clases nuevas: "fctv"
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_TRABAJOS_VIDEO) return;
  window._FC_TRABAJOS_VIDEO = true;

  var ORO = '#C5A059';

  function reduce() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  /* ── Datos de los trabajos (para saber el efecto/audio de cada uno) ── */
  function works() {
    try {
      if (window.FC && FC.load) return FC.load((FC.KEYS && FC.KEYS.works) || 'fc_works_v5', FC.DEF_WORKS || []) || [];
    } catch (e) {}
    return [];
  }
  function normaliza(s) { return (s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function trabajoDe(card) {
    var h = card.querySelector('h3');
    var titulo = normaliza(h ? h.textContent : '');
    if (!titulo) return null;
    var arr = works();
    for (var i = 0; i < arr.length; i++) if (normaliza(arr[i].title) === titulo) return arr[i];
    return null;
  }

  /* ── Estilos (una vez) ── */
  function css() {
    if (document.getElementById('fctv-css')) return;
    var st = document.createElement('style'); st.id = 'fctv-css';
    st.textContent =
      '@keyframes fctv-sweep{0%{clip-path:inset(0 70% 0 0)}50%{clip-path:inset(0 12% 0 0)}100%{clip-path:inset(0 70% 0 0)}}' +
      '@keyframes fctv-ken{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.13) translate(-1.5%,-1.5%)}100%{transform:scale(1) translate(0,0)}}' +
      '@keyframes fctv-3d{0%{transform:perspective(900px) rotateY(-4deg)}50%{transform:perspective(900px) rotateY(4deg)}100%{transform:perspective(900px) rotateY(-4deg)}}' +
      '@keyframes fctv-in{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}' +
      '.fctv-sweep{animation:fctv-sweep 5s ease-in-out infinite!important;}' +
      '.fctv-ken{animation:fctv-ken 9s ease-in-out infinite;will-change:transform;}' +
      '.fctv-3d{animation:fctv-3d 7s ease-in-out infinite;transform-style:preserve-3d;}' +
      '.fctv-in{animation:fctv-in .8s cubic-bezier(.22,.61,.36,1) both;}' +
      '.fctv-manual{animation:none!important;}' +
      '.fctv-audio{margin-left:auto;background:rgba(197,160,89,.14);border:1px solid rgba(197,160,89,.45);color:' + ORO + ';font-size:.72rem;font-weight:700;padding:6px 11px;border-radius:50px;cursor:pointer;font-family:Montserrat,sans-serif;line-height:1;}' +
      '.fctv-audio.son{background:' + ORO + ';color:#111;}' +
      '@media (prefers-reduced-motion: reduce){.fctv-sweep,.fctv-ken,.fctv-3d{animation:none!important}}';
    document.head.appendChild(st);
  }

  /* ── Localizar las tarjetas de "Mis Trabajos" ── */
  function tarjetas() {
    var sec = document.getElementById('trabajos');
    if (!sec) return [];
    var divs = sec.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var s = divs[i].getAttribute('style') || '';
      if (/grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(210px/.test(s)) {
        return Array.prototype.filter.call(divs[i].children, function (el) { return el.nodeType === 1; });
      }
    }
    return [];
  }

  function imagenes(card) {
    // divs con background-image dentro de la tarjeta (foto antes/después o única)
    return Array.prototype.filter.call(
      card.querySelectorAll('div'),
      function (d) { return /background-image\s*:/.test(d.getAttribute('style') || ''); }
    );
  }

  /* ── Audio gratis ── */
  function hablar(txt, chip) {
    if (!('speechSynthesis' in window)) return brillo(chip);
    try { speechSynthesis.cancel(); } catch (e) {}
    var vs = speechSynthesis.getVoices() || [];
    var voz = vs.filter(function (v) { return /es(-|_|$)/i.test(v.lang); })[0] || null;
    var u = new SpeechSynthesisUtterance(txt);
    if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = 'es-ES'; }
    if (chip) { chip.classList.add('son'); u.onend = u.onerror = function () { chip.classList.remove('son'); }; }
    speechSynthesis.speak(u);
  }
  var AC = null;
  function brillo(chip) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      [880, 1320].forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * 0.12;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.28, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.55);
      });
      if (chip) { chip.classList.add('son'); setTimeout(function () { chip.classList.remove('son'); }, 700); }
    } catch (e) {}
  }
  function ponerAudio(card, tipo, trabajo) {
    if (!tipo || tipo === 'ninguno') return;
    if (card.querySelector('.fctv-audio')) return;
    // fila de acciones (donde va ▶ Vídeo) o, si no existe, el área de texto
    var fila = null, cajas = card.querySelectorAll('div');
    for (var i = 0; i < cajas.length; i++) {
      var s = cajas[i].getAttribute('style') || '';
      if (/display:\s*flex/.test(s) && /margin-top/.test(s)) { fila = cajas[i]; break; }
    }
    var chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'fctv-audio'; chip.textContent = '🔊';
    chip.title = 'Escuchar';
    var h = card.querySelector('h3'), tag = card.querySelector('span');
    var titulo = (h ? h.textContent : '').trim();
    var cat = (trabajo && trabajo.cat) || (tag ? tag.textContent : '');
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      if (tipo === 'brillo') brillo(chip);
      else hablar(titulo + (cat ? '. ' + cat : ''), chip);
    });
    if (fila) fila.appendChild(chip);
    else { var cont = card.querySelector('div[style*="padding"]') || card; cont.appendChild(chip); }
  }

  /* ── Aplicar el efecto a una tarjeta ── */
  function animar(card) {
    if (card._fctv) return; card._fctv = true;
    if (!reduce()) card.classList.add('fctv-in');

    var w = trabajoDe(card);
    var anim = (w && w.anim) || 'auto';
    var audio = (w && w.audio) || 'ninguno';
    var ba = card.querySelector('[data-ba]');
    var clip = card.querySelector('[data-clip]');

    if (anim === 'auto') anim = (ba && clip) ? 'antesdespues' : 'kenburns';

    if (!reduce()) {
      if (anim === 'antesdespues' && clip) {
        clip.classList.add('fctv-sweep');
        // si la clienta toca para comparar a mano, se respeta y se detiene el bucle
        if (ba) ba.addEventListener('pointerdown', function () { clip.classList.add('fctv-manual'); }, { once: true });
      } else if (anim === '3d') {
        card.classList.add('fctv-3d');
        imagenes(card).forEach(function (im) { im.classList.add('fctv-ken'); });
      } else if (anim === 'ninguna') {
        /* sin movimiento */
      } else { // kenburns / zoom
        imagenes(card).forEach(function (im) { im.classList.add('fctv-ken'); });
      }
    }
    ponerAudio(card, audio, w);
  }

  function aplicar() {
    var cards = tarjetas();
    cards.forEach(animar);
    return cards.length;
  }

  /* ── Arranque + re-aplicación cuando el runtime renderiza/filtra ── */
  function arrancar() {
    css();
    aplicar();
    var sec = document.getElementById('trabajos') || document.body;
    try {
      var mo = new MutationObserver(function () {
        // al filtrar por categoría el runtime re-crea las tarjetas: re-aplicar
        aplicar();
      });
      mo.observe(sec, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 350);

  window.addEventListener('pagehide', function () { try { speechSynthesis.cancel(); } catch (e) {} });
})();
