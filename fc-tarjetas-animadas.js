/* ══════════════════════════════════════════════════════════════════
   TARJETAS ANIMADAS + VOZ GRATIS + TRANSICIONES · Fátima Servicios
   ------------------------------------------------------------------
   PARCHE ADITIVO. No toca la plantilla de diseño (sc-for/{{ }}) ni el
   runtime. Mejora las tarjetas YA renderizadas en el DOM:

     1) Animación de ENTRADA al hacer scroll (en cascada), con estilo
        elegible por el usuario.
     2) TRANSICIÓN al pasar el dedo / ratón (elevación + brillo).
     3) Recorrido NARRADO con VOZ GRATIS del navegador: lee cada
        tarjeta mientras se resalta y avanza.

   Todo es progresivo: si el navegador no puede animar o hablar, la
   página sigue funcionando igual. Cero dependencias externas.

   Marca de carga: window._FC_TARJETAS_ANIM  ·  IDs nuevos: prefijo "fcta"
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_TARJETAS_ANIM) return;
  window._FC_TARJETAS_ANIM = true;

  var ORO = '#C5A059';

  /* ── Preferencias del usuario (se recuerdan en el navegador) ── */
  var CFG = { anim: 'subir', on: true };
  try { var g = localStorage.getItem('fcta_cfg'); if (g) CFG = Object.assign(CFG, JSON.parse(g)); } catch (e) {}
  function guardar() { try { localStorage.setItem('fcta_cfg', JSON.stringify(CFG)); } catch (e) {} }

  function reduce() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  /* ── Estilos (keyframes + clases). Se inyectan una sola vez. ── */
  function inyectarCSS() {
    if (document.getElementById('fcta-css')) return;
    var st = document.createElement('style');
    st.id = 'fcta-css';
    st.textContent =
      '@keyframes fcta-subir{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}' +
      '@keyframes fcta-zoom{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:none}}' +
      '@keyframes fcta-izq{from{opacity:0;transform:translateX(-34px)}to{opacity:1;transform:none}}' +
      '@keyframes fcta-der{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}' +
      '@keyframes fcta-voltear{from{opacity:0;transform:perspective(700px) rotateY(-22deg) translateY(14px)}to{opacity:1;transform:none}}' +
      '@keyframes fcta-aparecer{from{opacity:0}to{opacity:1}}' +
      '@keyframes fcta-rebote{0%{opacity:0;transform:scale(.8)}60%{opacity:1;transform:scale(1.05)}100%{transform:none}}' +
      /* estado inicial: oculta hasta que entra en pantalla */
      '.fcta-card{opacity:0;transition:transform .5s cubic-bezier(.22,.61,.36,1),box-shadow .5s,border-color .5s;will-change:transform,opacity;}' +
      '.fcta-in{opacity:1;animation:var(--fcta-anim,fcta-subir) .85s cubic-bezier(.22,.61,.36,1) both;}' +
      /* transición al pasar el dedo/ratón */
      '.fcta-card:hover{transform:translateY(-6px);box-shadow:0 14px 34px rgba(0,0,0,.45),0 0 0 1px rgba(197,160,89,.35);border-color:rgba(197,160,89,.55)!important;}' +
      /* resaltado durante la narración */
      '.fcta-narr{transform:translateY(-8px) scale(1.015)!important;box-shadow:0 0 0 2px ' + ORO + ',0 18px 40px rgba(0,0,0,.5)!important;}' +
      /* si el usuario pide menos animación, todo visible y quieto */
      '@media (prefers-reduced-motion: reduce){.fcta-card{opacity:1!important;animation:none!important}}' +
      /* panel flotante */
      /* panel flotante INTERNO (solo admin): arriba a la derecha, oculto por defecto */
      '#fcta-fab{position:fixed;right:14px;top:14px;z-index:99998;width:48px;height:48px;border-radius:50%;border:2px solid ' + ORO + ';background:#111;color:' + ORO + ';font-size:20px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;}' +
      '#fcta-panel{position:fixed;right:14px;top:70px;z-index:99998;width:230px;background:#141414;border:1px solid rgba(197,160,89,.3);border-radius:16px;padding:14px;box-shadow:0 16px 44px rgba(0,0,0,.6);font-family:Montserrat,system-ui,sans-serif;color:#eee;display:none;}' +
      '#fcta-panel.abierto{display:block;}' +
      '#fcta-panel h4{margin:0 0 10px;font-size:.8rem;color:' + ORO + ';letter-spacing:1px;font-weight:700;}' +
      '#fcta-panel label{display:block;font-size:.66rem;color:#aaa;margin:10px 0 4px;letter-spacing:.5px;}' +
      '#fcta-panel select,#fcta-panel button{width:100%;font-family:inherit;}' +
      '#fcta-panel select{background:#0d0d0d;color:#eee;border:1px solid rgba(197,160,89,.3);border-radius:9px;padding:8px;font-size:.76rem;}' +
      '.fcta-btn{margin-top:10px;background:' + ORO + ';color:#111;border:none;border-radius:9px;padding:10px;font-weight:700;font-size:.76rem;cursor:pointer;letter-spacing:.5px;}' +
      '.fcta-btn.sec{background:transparent;color:' + ORO + ';border:1px solid rgba(197,160,89,.45);}' +
      '#fcta-st{margin-top:8px;font-size:.64rem;color:#8fce9f;min-height:14px;line-height:1.4;}';
    document.head.appendChild(st);
  }

  /* ── Localizar las tarjetas ya renderizadas ── */
  function grid(seccionId, filtro) {
    var sec = document.getElementById(seccionId);
    if (!sec) return [];
    var grids = sec.querySelectorAll('div');
    for (var i = 0; i < grids.length; i++) {
      var s = grids[i].getAttribute('style') || '';
      if (filtro.test(s)) {
        return Array.prototype.filter.call(grids[i].children, function (el) { return el.nodeType === 1; });
      }
    }
    return [];
  }
  function tarjetas() {
    var serv = grid('servicios', /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(150px/);
    var desc = grid('descubre', /display:\s*grid/);
    return serv.concat(desc);
  }

  /* ── Aplicar animación de entrada (una sola vez por tarjeta) ── */
  var io = null;
  function observador() {
    if (io || !('IntersectionObserver' in window)) return io;
    io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, k = +(el.getAttribute('data-fcta-i') || 0);
        el.style.setProperty('--fcta-anim', 'fcta-' + CFG.anim);
        el.style.animationDelay = Math.min(k * 90, 700) + 'ms';
        el.classList.add('fcta-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    return io;
  }

  function preparar() {
    if (!CFG.on) return;
    var cards = tarjetas(), n = 0;
    cards.forEach(function (el, i) {
      if (el.classList.contains('fcta-card')) return;   // ya preparada
      el.classList.add('fcta-card');
      el.setAttribute('data-fcta-i', i);
      if (reduce()) { el.classList.add('fcta-in'); return; }
      var ob = observador();
      if (ob) ob.observe(el);
      else el.classList.add('fcta-in');                 // sin IO: mostrar sin más
      n++;
    });
    return cards.length;
  }

  /* ── VOZ GRATIS: recorrido narrado por las tarjetas ── */
  var narrando = false;
  function vozES() {
    var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    return vs.filter(function (v) { return /es(-|_|$)/i.test(v.lang); })[0] ||
           vs.filter(function (v) { return /es/i.test(v.lang); })[0] || null;
  }
  function textoDe(card) {
    var h = card.querySelector('h3'), p = card.querySelector('p');
    var t = (h ? h.textContent : '').trim();
    var d = (p ? p.textContent : '').trim();
    return (t + (d ? '. ' + d : '')).trim();
  }
  function pararNarracion(msg) {
    narrando = false;
    try { speechSynthesis.cancel(); } catch (e) {}
    document.querySelectorAll('.fcta-narr').forEach(function (el) { el.classList.remove('fcta-narr'); });
    var b = document.getElementById('fcta-narrar'); if (b) b.textContent = '🔊 Narrar tarjetas';
    estado(msg || '');
  }
  function narrar() {
    if (narrando) { pararNarracion('Parado.'); return; }
    if (!('speechSynthesis' in window)) { estado('Este navegador no tiene voz gratuita. Prueba en Chrome.'); return; }
    var cards = tarjetas();
    if (!cards.length) { estado('Aún no hay tarjetas que leer.'); return; }
    narrando = true;
    var b = document.getElementById('fcta-narrar'); if (b) b.textContent = '⏹ Parar narración';
    try { speechSynthesis.cancel(); } catch (e) {}
    var voz = vozES(), i = 0;
    (function siguiente() {
      if (!narrando) return;
      if (i >= cards.length) { pararNarracion('✓ Terminado.'); return; }
      var card = cards[i];
      document.querySelectorAll('.fcta-narr').forEach(function (el) { el.classList.remove('fcta-narr'); });
      try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { card.scrollIntoView(); }
      card.classList.add('fcta-narr');
      estado('Leyendo ' + (i + 1) + ' de ' + cards.length + '…');
      var u = new SpeechSynthesisUtterance(textoDe(card) || 'Servicio');
      if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = 'es-ES'; }
      u.rate = 1; u.pitch = 1;
      u.onend = function () { i++; setTimeout(siguiente, 350); };
      u.onerror = function () { i++; setTimeout(siguiente, 350); };
      speechSynthesis.speak(u);
    })();
  }

  function estado(m) { var e = document.getElementById('fcta-st'); if (e) e.textContent = m || ''; }

  /* ── Panel flotante para elegir animación y narrar ── */
  var ANIMS = [
    ['subir', '⬆️ Subir (suave)'], ['zoom', '🔍 Acercar'], ['aparecer', '🎞️ Fundido'],
    ['izq', '➡️ Desde la izquierda'], ['der', '⬅️ Desde la derecha'],
    ['voltear', '🔄 Voltear 3D'], ['rebote', '🪀 Rebote']
  ];
  function reanimar() {
    // vuelve a lanzar la entrada con el estilo recién elegido
    var cards = tarjetas();
    cards.forEach(function (el) {
      el.classList.remove('fcta-in');
      el.style.setProperty('--fcta-anim', 'fcta-' + CFG.anim);
      // reflow para reiniciar la animación
      void el.offsetWidth;
      el.classList.add('fcta-in');
    });
  }
  function construirPanel() {
    if (document.getElementById('fcta-fab')) return;
    var fab = document.createElement('button');
    fab.id = 'fcta-fab'; fab.type = 'button'; fab.title = 'Animación y voz'; fab.textContent = '✨';
    var panel = document.createElement('div');
    panel.id = 'fcta-panel';
    var ops = ANIMS.map(function (a) {
      return '<option value="' + a[0] + '"' + (a[0] === CFG.anim ? ' selected' : '') + '>' + a[1] + '</option>';
    }).join('');
    panel.innerHTML =
      '<h4>✨ Tarjetas animadas</h4>' +
      '<label>Animación de entrada</label>' +
      '<select id="fcta-anim">' + ops + '</select>' +
      '<button class="fcta-btn sec" id="fcta-probar" type="button">👁️ Probar animación</button>' +
      '<button class="fcta-btn" id="fcta-narrar" type="button">🔊 Narrar tarjetas</button>' +
      '<button class="fcta-btn sec" id="fcta-toggle" type="button">' + (CFG.on ? '⏸️ Quitar animación' : '▶️ Activar animación') + '</button>' +
      '<div id="fcta-st"></div>';
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.classList.toggle('abierto'); });
    panel.querySelector('#fcta-anim').addEventListener('change', function () {
      CFG.anim = this.value; guardar(); reanimar();
    });
    panel.querySelector('#fcta-probar').addEventListener('click', reanimar);
    panel.querySelector('#fcta-narrar').addEventListener('click', narrar);
    panel.querySelector('#fcta-toggle').addEventListener('click', function () {
      CFG.on = !CFG.on; guardar();
      this.textContent = CFG.on ? '⏸️ Quitar animación' : '▶️ Activar animación';
      if (CFG.on) { preparar(); reanimar(); }
      else { tarjetas().forEach(function (el) { el.classList.remove('fcta-card', 'fcta-in'); el.style.opacity = '1'; }); }
    });

    // ── El botón/menú es INTERNO: visible solo en modo administradora ──
    // (las animaciones de las tarjetas siguen activas para el público; esto
    //  solo oculta el control ✨ a las clientas). Señal desde index.html.
    function fcAdminSync(){
      var on = !!window.FC_ADMIN;
      fab.style.display = on ? 'flex' : 'none';
      if (!on) panel.classList.remove('abierto');
    }
    fcAdminSync();
    window.addEventListener('fc-admin', fcAdminSync);
  }

  /* ── Arranque + re-aplicación cuando el runtime re-renderiza ── */
  function arrancar() {
    inyectarCSS();
    construirPanel();
    preparar();
    // el runtime de diseño puede renderizar/re-renderizar tarde: reintenta
    var sec = document.getElementById('servicios') || document.body;
    try {
      var mo = new MutationObserver(function () { preparar(); });
      mo.observe(sec, { childList: true, subtree: true });
    } catch (e) {}
    // por si las voces llegan tarde (Chrome), no hace falta acción: se leen al narrar
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);

  window.addEventListener('pagehide', function () { try { speechSynthesis.cancel(); } catch (e) {} });
})();
