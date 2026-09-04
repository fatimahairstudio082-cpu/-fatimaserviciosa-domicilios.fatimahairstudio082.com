/* ══════════════════════════════════════════════════════════════════
   HERRAMIENTAS PRO + ESTUDIO UNIVERSAL · Tarjetas interactivas con
   crédito · Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No reconstruye la página ni toca el runtime de
   diseño. Inyecta su propia sección con 2 tarjetas animadas que abren
   bloques AUTÓNOMOS (alojados en el sitio de aprendizaje) dentro de un
   modal a pantalla completa:

     1) 🛠️ Herramientas Pro  → bloque6_herramientas.html  (con crédito)
     2) 🎨 Estudio Universal → Estudio_universal.html      (acceso libre)

   CRÉDITO (solo Herramientas Pro):
     · La clienta recibe 50 créditos gratis por dispositivo para probar.
     · Esta app hace de "hub": el bloque pide saldo por postMessage
       ({tipo:'pedirCreditos'}) y avisa cada gasto ({tipo:'gastarCreditos'}).
       Aquí se descuenta y se devuelve el saldo ({tipo:'sincronizarCreditos'}).
     · Al llegar a 0, se cubre la herramienta con un aviso y un botón de
       WhatsApp que llega directo a Fátima para recargar.
     · El precio lo edita la administradora desde el menú interno (se
       guarda en el dispositivo). Aparece en el aviso y en el WhatsApp.

   Todo progresivo: si el bloque no carga, la app sigue igual. Cero
   dependencias externas.  Marca de carga: window._FC_HERRAMIENTAS
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_HERRAMIENTAS) return;
  window._FC_HERRAMIENTAS = true;

  var ORO  = '#C5A059';
  var WA   = '34604822265';                                   // WhatsApp de Fátima
  var BASE = 'https://aprendizajefatima.fatimahairstudio082.com/';

  var CARDS = [
    { id: 'b6', icon: '🛠️', titulo: 'Herramientas Pro',
      desc: 'Utilidades profesionales de color, cálculo, generación y descargas.',
      src: BASE + 'bloque6_herramientas.html', credito: true, gratis: 50 },
    { id: 'eu', icon: '🎨', titulo: 'Estudio Universal',
      desc: 'Folletos · trípticos · troquelados · vídeo · QR.',
      src: BASE + 'Estudio_universal.html', credito: false }
  ];

  /* ── Crédito por dispositivo (localStorage) ── */
  function keyCr(id) { return 'fc_cr_' + id; }
  function getSaldo(c) {
    if (!c.credito) return Infinity;
    try {
      var v = localStorage.getItem(keyCr(c.id));
      if (v === null) { localStorage.setItem(keyCr(c.id), c.gratis); return c.gratis; }
      return parseInt(v, 10) || 0;
    } catch (e) { return c.gratis; }
  }
  function setSaldo(c, v) { try { localStorage.setItem(keyCr(c.id), Math.max(0, v | 0)); } catch (e) {} }

  /* ── Precio (editable por la admin; guardado en el dispositivo) ── */
  var PRECIO_DEF = 'Escríbeme por WhatsApp para conocer el precio y recargar tus créditos.';
  function getPrecio() { try { return localStorage.getItem('fc_cr_precio') || PRECIO_DEF; } catch (e) { return PRECIO_DEF; } }
  function setPrecio(t) { try { localStorage.setItem('fc_cr_precio', t || ''); } catch (e) {} }

  function waLink(titulo) {
    var msg = 'Hola Fátima 👋 Se me acabaron los créditos de prueba de "' + titulo +
              '". Quiero seguir usando la herramienta. ' + getPrecio();
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  /* ── Estilos propios (namespace fch-). Se inyectan una sola vez. ── */
  function css() {
    if (document.getElementById('fch-css')) return;
    var st = document.createElement('style');
    st.id = 'fch-css';
    st.textContent =
      '@keyframes fch-in{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}' +
      '#fc-herr{padding:54px 18px 30px;background:#111;}' +
      '#fc-herr .fch-eyebrow{font-size:0.58rem;letter-spacing:4px;color:' + ORO + ';text-transform:uppercase;font-weight:700;margin:0 0 8px;}' +
      '#fc-herr h2{font-family:"Cormorant Garamond",serif;font-size:2.1rem;line-height:1.05;margin:0 0 12px;color:#fff;}' +
      '#fc-herr .fch-rule{width:46px;height:1px;background:' + ORO + ';margin-bottom:24px;}' +
      '#fc-herr .fch-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}' +
      '@media(max-width:520px){#fc-herr .fch-grid{grid-template-columns:1fr;}}' +
      '.fch-card{opacity:0;position:relative;background:linear-gradient(150deg,#181818,#0c0c0c);border:1px solid rgba(197,160,89,.22);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;min-height:180px;transition:transform .5s cubic-bezier(.22,.61,.36,1),box-shadow .5s,border-color .5s;will-change:transform,opacity;}' +
      '.fch-card.fch-vis{animation:fch-in .8s cubic-bezier(.22,.61,.36,1) both;opacity:1;}' +
      '.fch-card:hover{transform:translateY(-6px) perspective(800px) rotateX(2deg);box-shadow:0 18px 40px rgba(0,0,0,.5),0 0 0 1px rgba(197,160,89,.4);border-color:rgba(197,160,89,.55);}' +
      '.fch-card .fch-glow{position:absolute;inset:0;background:radial-gradient(120% 90% at 80% 0%,rgba(197,160,89,.16),transparent 60%);opacity:.7;pointer-events:none;}' +
      '.fch-card .fch-body{position:relative;padding:22px 20px;flex:1;display:flex;flex-direction:column;}' +
      '.fch-card .fch-ic{font-size:2rem;margin-bottom:12px;}' +
      '.fch-card h3{font-family:"Cormorant Garamond",serif;font-size:1.4rem;margin:0 0 8px;color:#fff;line-height:1.1;}' +
      '.fch-card p{color:rgba(255,255,255,.52);font-size:0.76rem;line-height:1.6;margin:0 0 16px;flex:1;}' +
      '.fch-card .fch-go{align-self:flex-start;display:inline-flex;align-items:center;gap:7px;color:' + ORO + ';font-size:0.7rem;font-weight:700;letter-spacing:1px;font-family:Montserrat,system-ui,sans-serif;}' +
      '.fch-card .fch-badge{position:absolute;top:10px;right:10px;background:rgba(197,160,89,.14);border:1px solid rgba(197,160,89,.4);color:#e8c97a;font-size:0.6rem;font-weight:700;letter-spacing:.5px;padding:4px 9px;border-radius:50px;font-family:Montserrat,system-ui,sans-serif;}' +
      /* barra admin (solo modo interno) */
      '#fc-herr .fch-admin{display:none;margin-top:18px;}' +
      'body.fch-admin-on #fc-herr .fch-admin{display:block;}' +
      '#fc-herr .fch-admin button{background:transparent;border:1px dashed rgba(197,160,89,.5);color:' + ORO + ';padding:9px 14px;border-radius:10px;font-size:0.68rem;font-weight:700;letter-spacing:.5px;cursor:pointer;font-family:Montserrat,system-ui,sans-serif;}' +
      /* modal a pantalla completa */
      '#fch-modal{position:fixed;inset:0;z-index:99999;background:#0a0a0a;display:none;flex-direction:column;}' +
      '#fch-modal.abierto{display:flex;}' +
      '#fch-bar{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#111;border-bottom:1px solid rgba(197,160,89,.25);}' +
      '#fch-bar .fch-t{flex:1;min-width:0;font-family:Montserrat,system-ui,sans-serif;font-size:0.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '#fch-cr{font-family:Montserrat,system-ui,sans-serif;font-size:0.68rem;font-weight:700;color:#111;background:' + ORO + ';padding:5px 11px;border-radius:50px;white-space:nowrap;}' +
      '#fch-x{width:34px;height:34px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-size:1.1rem;cursor:pointer;line-height:1;}' +
      '#fch-wrap{position:relative;flex:1;background:#0a0a0a;}' +
      '#fch-frame{width:100%;height:100%;border:0;display:block;background:#0a0a0a;}' +
      '#fch-block{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:34px 26px;background:rgba(8,8,8,.94);backdrop-filter:blur(3px);}' +
      '#fch-block.on{display:flex;}' +
      '#fch-block .fch-lock{font-size:2.4rem;margin-bottom:14px;}' +
      '#fch-block h4{font-family:"Cormorant Garamond",serif;color:#fff;font-size:1.7rem;margin:0 0 10px;}' +
      '#fch-block p{color:rgba(255,255,255,.6);font-size:0.82rem;line-height:1.6;max-width:340px;margin:0 0 20px;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fch-block a{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#062e16;font-weight:800;font-size:0.82rem;letter-spacing:.5px;padding:13px 22px;border-radius:50px;text-decoration:none;font-family:Montserrat,system-ui,sans-serif;}';
    document.head.appendChild(st);
  }

  /* ── Sección con las tarjetas ── */
  function render() {
    if (document.getElementById('fc-herr')) return true;
    var host = document.getElementById('servicios');
    if (!host) return false;

    var sec = document.createElement('section');
    sec.id = 'fc-herr';
    var cardsHTML = CARDS.map(function (c) {
      var badge = c.credito ? '<span class="fch-badge">✦ ' + c.gratis + ' créditos gratis</span>' : '';
      return '<div class="fch-card" data-id="' + c.id + '">' +
               '<div class="fch-glow"></div>' + badge +
               '<div class="fch-body">' +
                 '<div class="fch-ic">' + c.icon + '</div>' +
                 '<h3>' + c.titulo + '</h3>' +
                 '<p>' + c.desc + '</p>' +
                 '<span class="fch-go">Abrir ↗</span>' +
               '</div>' +
             '</div>';
    }).join('');
    sec.innerHTML =
      '<p class="fch-eyebrow">Herramientas digitales</p>' +
      '<h2>Estudio &amp; Herramientas Pro</h2>' +
      '<div class="fch-rule"></div>' +
      '<div class="fch-grid">' + cardsHTML + '</div>' +
      '<div class="fch-admin"><button type="button" id="fch-precio-btn">✎ Editar precio de créditos</button></div>';

    host.parentNode.insertBefore(sec, host.nextSibling);

    // abrir bloque al pulsar la tarjeta
    Array.prototype.forEach.call(sec.querySelectorAll('.fch-card'), function (el) {
      el.addEventListener('click', function () { abrir(el.getAttribute('data-id')); });
    });
    // editar precio (solo admin)
    var pb = sec.querySelector('#fch-precio-btn');
    if (pb) pb.addEventListener('click', function () {
      var t = prompt('Precio / mensaje que verá la clienta al quedarse sin créditos:', getPrecio());
      if (t !== null) { setPrecio(t.trim()); alert('✓ Precio actualizado en este dispositivo.'); }
    });

    // animación de entrada en cascada
    animar(sec);
    syncAdmin();
    return true;
  }

  function animar(sec) {
    var cards = sec.querySelectorAll('.fch-card');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(cards, function (el) { el.classList.add('fch-vis'); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +(e.target.getAttribute('data-k') || 0);
        e.target.style.animationDelay = (i * 110) + 'ms';
        e.target.classList.add('fch-vis');
        io.unobserve(e.target);
      });
    }, { threshold: 0.14 });
    Array.prototype.forEach.call(cards, function (el, i) { el.setAttribute('data-k', i); io.observe(el); });
  }

  /* ── Modal + puente de crédito ── */
  var modal = null, frame = null, bloqueo = null, barCr = null, barT = null, actual = null;

  function buildModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.id = 'fch-modal';
    modal.innerHTML =
      '<div id="fch-bar">' +
        '<span class="fch-t" id="fch-title"></span>' +
        '<span id="fch-cr" hidden></span>' +
        '<button id="fch-x" type="button" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div id="fch-wrap">' +
        '<iframe id="fch-frame" allow="clipboard-write; fullscreen" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '<div id="fch-block">' +
          '<div class="fch-lock">🔒</div>' +
          '<h4>Créditos de prueba agotados</h4>' +
          '<p id="fch-block-msg"></p>' +
          '<a id="fch-wa" target="_blank" rel="noopener">📲 Escribir a Fátima por WhatsApp</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    frame  = modal.querySelector('#fch-frame');
    bloqueo = modal.querySelector('#fch-block');
    barCr  = modal.querySelector('#fch-cr');
    barT   = modal.querySelector('#fch-title');
    modal.querySelector('#fch-x').addEventListener('click', cerrar);
  }

  function abrir(id) {
    var c = CARDS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    buildModal();
    actual = c;
    barT.textContent = c.titulo;
    // badge de saldo
    if (c.credito) { barCr.hidden = false; pintarSaldo(); } else { barCr.hidden = true; }
    // aviso de bloqueo
    bloqueo.classList.remove('on');
    modal.querySelector('#fch-block-msg').textContent = getPrecio();
    modal.querySelector('#fch-wa').href = waLink(c.titulo);
    // cargar bloque
    frame.src = c.src;
    frame.onload = function () { if (c.credito) enviarSaldo(); };
    modal.classList.add('abierto');
    document.documentElement.style.overflow = 'hidden';
    if (c.credito && getSaldo(c) <= 0) mostrarBloqueo();
  }

  function cerrar() {
    if (!modal) return;
    modal.classList.remove('abierto');
    try { frame.removeAttribute('src'); } catch (e) {}
    document.documentElement.style.overflow = '';
    actual = null;
  }

  function pintarSaldo() {
    if (!actual || !actual.credito) return;
    barCr.textContent = '💳 ' + getSaldo(actual) + ' créditos';
  }
  function enviarSaldo() {
    if (!actual || !actual.credito || !frame.contentWindow) return;
    var s = getSaldo(actual);
    try {
      frame.contentWindow.postMessage({ tipo: 'sincronizarCreditos', creditos: s,
        creditos_b6: s, creditos_b7: s, creditos_b8: s, creditos_b9: s }, '*');
    } catch (e) {}
  }
  function mostrarBloqueo() {
    if (!bloqueo) return;
    modal.querySelector('#fch-block-msg').textContent = getPrecio();
    modal.querySelector('#fch-wa').href = waLink(actual ? actual.titulo : 'Herramientas Pro');
    bloqueo.classList.add('on');
  }

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (!d || !d.tipo || !actual || !actual.credito) return;
    if (e.source !== (frame && frame.contentWindow)) return;   // solo el bloque abierto
    if (d.tipo === 'pedirCreditos') {
      enviarSaldo();
    } else if (d.tipo === 'gastarCreditos') {
      var n = parseInt(d.cantidad, 10) || 0;
      var s = Math.max(0, getSaldo(actual) - n);
      setSaldo(actual, s);
      pintarSaldo();
      enviarSaldo();
      if (s <= 0) mostrarBloqueo();
    } else if (d.tipo === 'salirBloque') {
      cerrar();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('abierto')) cerrar();
  });

  /* ── Modo administradora: mostrar el editor de precio ── */
  function syncAdmin() {
    try { document.body.classList.toggle('fch-admin-on', !!window.FC_ADMIN); } catch (e) {}
  }
  window.addEventListener('fc-admin', syncAdmin);

  /* ── Arranque: esperar a que el runtime pinte #servicios ── */
  function arrancar() {
    css();
    if (render()) return;
    var t = 0, iv = setInterval(function () {
      if (render() || (t += 1) > 40) clearInterval(iv);   // reintenta ~12s
    }, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);
})();
