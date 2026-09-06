/* ══════════════════════════════════════════════════════════════════
   HERRAMIENTAS PRO + ESTUDIO UNIVERSAL · Tarjetas interactivas
   profesionales con imagen, animación, audio y crédito
   Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No reconstruye la página ni toca el runtime de
   diseño. Inyecta su propia sección con 2 tarjetas que abren bloques
   AUTÓNOMOS (alojados en el sitio de aprendizaje) en un modal a
   pantalla completa.

   Cada tarjeta es PROFESIONAL y viva:
     · IMAGEN de portada que la administradora sube desde el admin de
       la propia app (se comprime igual que el resto de imágenes).
     · ANIMACIÓN automática tipo vídeo (zoom lento Ken-Burns + brillo
       dorado + leve 3D al tocar). No depende de ningún control externo.
     · AUDIO con la voz gratis de Google: al abrir la tarjeta se explica
       para qué sirve la herramienta y qué problema resuelve.
     · CRÉDITO (solo Herramientas Pro): 50 gratis por dispositivo; al
       agotarse, aviso + WhatsApp directo a Fátima.  (El crédito central
       en Firebase es el paso D2.)

   Progresivo: si algo no está disponible, la app sigue igual.
   Marca de carga: window._FC_HERRAMIENTAS
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_HERRAMIENTAS) return;
  window._FC_HERRAMIENTAS = true;

  var ORO  = '#C5A059';
  var WA   = '34604822265';                                   // WhatsApp de Fátima
  // Los bloques viven DENTRO de este mismo repositorio, en la carpeta /pro/
  // (con todos sus ayudantes b6_*.js y su propio support.js). Así son
  // autónomos, mismo origen, y siempre cargan.
  var BASE = './pro/';

  var CARDS = [
    { id: 'b6', icon: '🛠️', titulo: 'Herramientas Pro',
      desc: 'Protección digital, vídeo, tarjetas, CV, recibos, flyers y folletos.',
      src: BASE + 'bloque6_herramientas.html', credito: true, abreCosto: 0,
      audio: 'Herramientas Pro es tu maletín digital para resolver tareas del día a día sin depender de nadie. ' +
             'Con Protección Digital cuidas tus archivos; con el Optimizador de Vídeo y Audio reduces el peso de tus vídeos; ' +
             'con Tarjeta Segura proteges los datos de tus tarjetas bancarias; y además creas tu CV y cartas, tu tarjeta de ' +
             'presentación, recibos, flyers y folletos profesionales. Resuelve el problema de pagar por varias aplicaciones o ' +
             'diseñadores: aquí lo haces tú misma en minutos. Tienes créditos gratis para probar; cuando quieras seguir, escríbeme por WhatsApp.' },
    { id: 'eu', icon: '🎨', titulo: 'Estudio Universal',
      desc: 'Folletos · trípticos · troquelados · vídeo · QR.',
      // Estudio Universal ahora reporta cada DESCARGA (5 créditos) desde
      // eu_creditos.js por postMessage, igual que Herramientas Pro. Por eso NO
      // cobra al abrir (abreCosto:0). Mismo monedero y compra que Herramientas Pro.
      src: BASE + 'Estudio_universal.html', credito: true, abreCosto: 0,
      audio: 'Estudio Universal es tu taller de diseño e imprenta. Resuelve el problema de crear material profesional sin saber diseño: ' +
             'haces trípticos, volantes, carruseles, guías en tres dimensiones, láminas de exposición, estudio de vídeo y tu propio ' +
             'código QR sin dar tus datos. Descargas todo listo para imprenta en PDF con sangrado, PNG o JPG, o grabas un vídeo narrado. ' +
             'Tienes créditos gratis para probar; cuando quieras seguir, escríbeme por WhatsApp.' }
  ];

  // Paquetes de recarga (aprobados por Fátima). La compra es por WhatsApp.
  var PACKS = [
    { cr: 30,  eur: 6  },
    { cr: 60,  eur: 10 },
    { cr: 150, eur: 20 }
  ];

  /* ── Crédito CENTRAL (Firebase) con respaldo local automático ──
     Si el "Acceso anónimo" no está activo o no hay red, central=false y se
     usa localStorage exactamente como antes. Progresivo: nada se rompe. */
  var central = false, centralSaldo = null, clienteCodigo = '', unsubCr = null;

  function fbListo() { return !!(window.FCF && window.FCF.ready()); }

  function initCentral() {
    if (!fbListo()) return;                         // sin Firebase → respaldo local
    window.FCF.ensureCreditos(50).then(function (uid) {
      central = true; clienteCodigo = uid;
      if (unsubCr) { try { unsubCr(); } catch (e) {} }
      unsubCr = window.FCF.watchCreditos(function (data, err) {
        if (err) return;
        centralSaldo = data ? (parseInt(data.saldo, 10) || 0) : 0;
        if (actual && actual.credito) {
          pintarSaldo(); enviarSaldo();
          if (centralSaldo <= 0) mostrarBloqueo(); else ocultarBloqueo();
        }
      });
    }).catch(function () { central = false; });     // anónimo no activo aún → local
  }

  /* ── Monedero ÚNICO por clienta (compartido por las 2 herramientas) ──
     50 créditos gratis. Central en Firebase; si no, respaldo local. */
  var GRATIS = 50, WALLET_KEY = 'fc_cr_saldo';
  function getSaldo(c) {
    if (c && !c.credito) return Infinity;
    if (central) return (centralSaldo == null) ? GRATIS : centralSaldo;   // pozo central
    try {
      var v = localStorage.getItem(WALLET_KEY);
      if (v === null) { localStorage.setItem(WALLET_KEY, GRATIS); return GRATIS; }
      return parseInt(v, 10) || 0;
    } catch (e) { return GRATIS; }
  }
  function setSaldoLocal(v) { try { localStorage.setItem(WALLET_KEY, Math.max(0, v | 0)); } catch (e) {} }
  // Gasta n del monedero (central o local). Devuelve Promise<saldo resultante>.
  function gastar(n) {
    n = parseInt(n, 10) || 0;
    if (central) return window.FCF.gastarCreditos(n).then(function (ns) { centralSaldo = ns; return ns; });
    var s = Math.max(0, getSaldo(null) - n); setSaldoLocal(s); return Promise.resolve(s);
  }

  /* ── Config sincronizada desde el Panel (Firebase): imagen, animación, precio ── */
  var herrCfg = {};   // { img_b6, anim_b6, img_eu, anim_eu, precio }

  /* ── Imagen de portada por tarjeta ── */
  function keyImg(id) { return 'fc_cr_img_' + id; }
  function getImg(id) { try { return localStorage.getItem(keyImg(id)) || ''; } catch (e) { return ''; } }
  function setImg(id, data) { try { data ? localStorage.setItem(keyImg(id), data) : localStorage.removeItem(keyImg(id)); } catch (e) {} }
  // Portada efectiva: primero la del Panel (Firebase), si no, la local del dispositivo.
  function coverDe(id) { return herrCfg['img_' + id] || getImg(id) || ''; }

  /* ── Precio (del Panel/Firebase; si no, del dispositivo) ── */
  var PRECIO_DEF = 'Escríbeme por WhatsApp para conocer el precio y recargar tus créditos.';
  function getPrecio() {
    if (herrCfg.precio) return herrCfg.precio;
    try { return localStorage.getItem('fc_cr_precio') || PRECIO_DEF; } catch (e) { return PRECIO_DEF; }
  }
  function setPrecio(t) { try { localStorage.setItem('fc_cr_precio', t || ''); } catch (e) {} }

  function waLink(titulo) {
    var msg = 'Hola Fátima 👋 Se me acabaron los créditos de prueba de "' + titulo +
              '". Quiero seguir usando la herramienta. ' + getPrecio();
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  /* ── Voz gratis de Google (mismo criterio que el chatbot de la app) ── */
  var _voces = [];
  function cargarVoces() { try { _voces = (window.speechSynthesis && speechSynthesis.getVoices()) || []; } catch (e) {} }
  function vozES() {
    var vs = _voces.length ? _voces : ((window.speechSynthesis && speechSynthesis.getVoices()) || []);
    return vs.find(function (v) { return /google/i.test(v.name) && /es[-_]/i.test(v.lang); }) ||
           vs.find(function (v) { return /^es/i.test(v.lang); }) || null;
  }
  function hablar(texto) {
    if (!texto || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
      var v = vozES();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'es-ES'; }
      u.rate = 1; u.pitch = 1.05;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function callarVoz() { try { speechSynthesis.cancel(); } catch (e) {} }
  try { if (window.speechSynthesis) { cargarVoces(); speechSynthesis.onvoiceschanged = cargarVoces; } } catch (e) {}

  /* ── Estilos propios (namespace fch-). Se inyectan una sola vez. ── */
  function css() {
    if (document.getElementById('fch-css')) return;
    var st = document.createElement('style');
    st.id = 'fch-css';
    st.textContent =
      '@keyframes fch-in{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}' +
      '@keyframes fch-subir{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}' +
      '@keyframes fch-zoom{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:none}}' +
      '@keyframes fch-aparecer{from{opacity:0}to{opacity:1}}' +
      '@keyframes fch-izq{from{opacity:0;transform:translateX(-34px)}to{opacity:1;transform:none}}' +
      '@keyframes fch-der{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}' +
      '@keyframes fch-voltear{from{opacity:0;transform:perspective(700px) rotateY(-22deg) translateY(14px)}to{opacity:1;transform:none}}' +
      '@keyframes fch-rebote{0%{opacity:0;transform:scale(.8)}60%{opacity:1;transform:scale(1.05)}100%{transform:none}}' +
      '@keyframes fch-ken{0%{transform:scale(1) translateY(0)}100%{transform:scale(1.14) translateY(-2%)}}' +
      '@keyframes fch-brillo{0%{transform:translateX(-120%)}60%,100%{transform:translateX(240%)}}' +
      '#fc-herr{padding:54px 18px 30px;background:#111;}' +
      '#fc-herr .fch-eyebrow{font-size:0.58rem;letter-spacing:4px;color:' + ORO + ';text-transform:uppercase;font-weight:700;margin:0 0 8px;}' +
      '#fc-herr h2{font-family:"Cormorant Garamond",serif;font-size:2.1rem;line-height:1.05;margin:0 0 12px;color:#fff;}' +
      '#fc-herr .fch-rule{width:46px;height:1px;background:' + ORO + ';margin-bottom:24px;}' +
      '#fc-herr .fch-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}' +
      '@media(max-width:520px){#fc-herr .fch-grid{grid-template-columns:1fr;}}' +
      '.fch-card{opacity:0;position:relative;border:1px solid rgba(197,160,89,.22);border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;min-height:230px;transition:transform .5s cubic-bezier(.22,.61,.36,1),box-shadow .5s,border-color .5s;will-change:transform,opacity;}' +
      '.fch-card.fch-vis{animation:var(--fch-anim,fch-in) .8s cubic-bezier(.22,.61,.36,1) both;opacity:1;}' +
      '.fch-card:hover{transform:translateY(-6px) perspective(900px) rotateX(2.5deg);box-shadow:0 20px 44px rgba(0,0,0,.55),0 0 0 1px rgba(197,160,89,.45);border-color:rgba(197,160,89,.6);}' +
      /* portada animada (Ken-Burns) */
      '.fch-cover{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;animation:fch-ken 14s ease-in-out infinite alternate;will-change:transform;}' +
      '.fch-cover.fch-nofoto{background:linear-gradient(150deg,#1c1c1c,#0b0b0b);animation:none;}' +
      '.fch-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,.15) 0%,rgba(10,10,10,.55) 55%,rgba(8,8,8,.92) 100%);}' +
      '.fch-shine{position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(100deg,transparent,rgba(197,160,89,.22),transparent);filter:blur(4px);transform:translateX(-120%);animation:fch-brillo 6.5s ease-in-out infinite;pointer-events:none;}' +
      '.fch-body{position:relative;padding:20px 18px;margin-top:auto;}' +
      '.fch-ic{font-size:1.7rem;margin-bottom:8px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));}' +
      '.fch-card h3{font-family:"Cormorant Garamond",serif;font-size:1.42rem;margin:0 0 6px;color:#fff;line-height:1.1;text-shadow:0 2px 10px rgba(0,0,0,.6);}' +
      '.fch-card p{color:rgba(255,255,255,.72);font-size:0.74rem;line-height:1.55;margin:0 0 14px;text-shadow:0 1px 8px rgba(0,0,0,.7);}' +
      '.fch-acts{display:flex;gap:8px;flex-wrap:wrap;}' +
      '.fch-acts button{display:inline-flex;align-items:center;gap:6px;border:none;cursor:pointer;font-family:Montserrat,system-ui,sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:.5px;padding:9px 13px;border-radius:50px;}' +
      '.fch-open{background:' + ORO + ';color:#111;}' +
      '.fch-say{background:rgba(0,0,0,.45);color:' + ORO + ';border:1px solid rgba(197,160,89,.5)!important;}' +
      '.fch-badge{position:absolute;top:10px;left:10px;z-index:2;background:rgba(197,160,89,.16);border:1px solid rgba(197,160,89,.45);color:#f0d692;font-size:0.58rem;font-weight:700;letter-spacing:.5px;padding:4px 9px;border-radius:50px;font-family:Montserrat,system-ui,sans-serif;backdrop-filter:blur(3px);}' +
      /* control admin por tarjeta (solo modo interno) */
      '.fch-adminimg{position:absolute;top:8px;right:8px;z-index:3;display:none;gap:6px;}' +
      'body.fch-admin-on .fch-adminimg{display:flex;}' +
      '.fch-adminimg button{width:34px;height:34px;border-radius:50%;border:none;cursor:pointer;font-size:0.85rem;background:rgba(0,0,0,.6);color:#fff;border:1px solid rgba(197,160,89,.5)!important;}' +
      '#fc-herr .fch-admin{display:none;margin-top:18px;}' +
      'body.fch-admin-on #fc-herr .fch-admin{display:block;}' +
      '#fc-herr .fch-admin button{background:transparent;border:1px dashed rgba(197,160,89,.5);color:' + ORO + ';padding:9px 14px;border-radius:10px;font-size:0.68rem;font-weight:700;letter-spacing:.5px;cursor:pointer;font-family:Montserrat,system-ui,sans-serif;}' +
      '@media (prefers-reduced-motion: reduce){.fch-cover,.fch-shine{animation:none!important}.fch-card{opacity:1!important;animation:none!important}}' +
      /* modal a pantalla completa */
      '#fch-modal{position:fixed;inset:0;z-index:99999;background:#0a0a0a;display:none;flex-direction:column;}' +
      '#fch-modal.abierto{display:flex;}' +
      '#fch-bar{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#111;border-bottom:1px solid rgba(197,160,89,.25);}' +
      '#fch-bar .fch-t{flex:1;min-width:0;font-family:Montserrat,system-ui,sans-serif;font-size:0.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '#fch-say2{flex:none;border:1px solid rgba(197,160,89,.5);background:transparent;color:' + ORO + ';font-size:0.66rem;font-weight:700;padding:6px 11px;border-radius:50px;cursor:pointer;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fch-cr{font-family:Montserrat,system-ui,sans-serif;font-size:0.68rem;font-weight:700;color:#111;background:' + ORO + ';padding:5px 11px;border-radius:50px;white-space:nowrap;}' +
      '#fch-x{width:34px;height:34px;flex:none;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-size:1.1rem;cursor:pointer;line-height:1;}' +
      '#fch-wrap{position:relative;flex:1;background:#0a0a0a;}' +
      '#fch-frame{width:100%;height:100%;border:0;display:block;background:#0a0a0a;}' +
      '#fch-block{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:34px 26px;background:rgba(8,8,8,.94);backdrop-filter:blur(3px);}' +
      '#fch-block.on{display:flex;}' +
      '#fch-block .fch-lock{font-size:2.4rem;margin-bottom:14px;}' +
      '#fch-block h4{font-family:"Cormorant Garamond",serif;color:#fff;font-size:1.7rem;margin:0 0 10px;}' +
      '#fch-block p{color:rgba(255,255,255,.6);font-size:0.82rem;line-height:1.6;max-width:340px;margin:0 0 20px;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fch-block a{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#062e16;font-weight:800;font-size:0.82rem;letter-spacing:.5px;padding:13px 22px;border-radius:50px;text-decoration:none;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fch-packs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 16px;}' +
      '#fch-packs a{background:rgba(197,160,89,.14);border:1px solid rgba(197,160,89,.5);color:#f0d692;font-weight:800;font-size:0.78rem;padding:11px 16px;border-radius:14px;text-decoration:none;font-family:Montserrat,system-ui,sans-serif;display:flex;flex-direction:column;line-height:1.3;}' +
      '#fch-packs a small{font-weight:600;font-size:0.62rem;color:#9aa;}' +
      '#fch-code{margin-top:14px;font-size:0.6rem;color:rgba(255,255,255,.4);font-family:Montserrat,system-ui,sans-serif;word-break:break-all;max-width:320px;}';
    document.head.appendChild(st);
  }

  /* ── input de archivo compartido para subir imágenes ── */
  var fileInput = null, pendingCardId = null;
  function ensureInput() {
    if (fileInput) return;
    fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f || !pendingCardId) return;
      comprimir(f, function (data) {
        setImg(pendingCardId, data);
        pintarPortada(pendingCardId);
        pendingCardId = null;
      });
    });
    document.body.appendChild(fileInput);
  }
  // Mismo método de compresión que usa la app para sus imágenes (max 1100px, JPEG 0.82)
  function comprimir(file, cb) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var max = 1100, w = img.width, h = img.height, sc = Math.min(1, max / Math.max(w, h));
      var c = document.createElement('canvas');
      c.width = Math.round(w * sc); c.height = Math.round(h * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      try { cb(c.toDataURL('image/jpeg', 0.82)); } catch (e) { cb(''); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); alert('No se pudo leer la imagen.'); };
    img.src = url;
  }
  // Repinta la portada de una tarjeta y relanza su animación de entrada
  function pintarPortada(id) {
    var el = document.querySelector('#fc-herr .fch-card[data-id="' + id + '"]');
    if (!el) return;
    var cover = el.querySelector('.fch-cover');
    var data = coverDe(id);
    if (data) { cover.style.backgroundImage = 'url("' + data + '")'; cover.classList.remove('fch-nofoto'); }
    else { cover.style.backgroundImage = ''; cover.classList.add('fch-nofoto'); }
    el.classList.remove('fch-vis'); void el.offsetWidth; el.classList.add('fch-vis');
  }

  // Aplica la config del Panel (Firebase): portada + animación elegida por tarjeta.
  function aplicarCfg() {
    CARDS.forEach(function (c) {
      var el = document.querySelector('#fc-herr .fch-card[data-id="' + c.id + '"]');
      if (!el) return;
      var cover = el.querySelector('.fch-cover'), data = coverDe(c.id);
      if (data) { cover.style.backgroundImage = 'url("' + data + '")'; cover.classList.remove('fch-nofoto'); }
      else { cover.style.backgroundImage = ''; cover.classList.add('fch-nofoto'); }
      var anim = herrCfg['anim_' + c.id];
      if (anim) el.style.setProperty('--fch-anim', 'fch-' + anim);
      el.classList.remove('fch-vis'); void el.offsetWidth; el.classList.add('fch-vis');
    });
  }

  /* ── Sección con las tarjetas ── */
  function render() {
    var ya = document.getElementById('fc-herr');
    if (ya && !(ya.closest && ya.closest('x-dc'))) return true;   // ya montada en el DOM real
    // ARRIBA: justo después del hero (#inicio), en el área del botón
    // "Visita Fátima Hair Studio" — no al final de la página.
    var host = document.getElementById('inicio');
    if (!host) return false;
    // El runtime (support.js) sustituye <x-dc> por #dc-root al montar: todo lo que
    // se inyecte dentro de la plantilla se pierde en ese reemplazo. Esperamos al
    // DOM ya pintado para no montar sobre un bloque condenado.
    if (host.closest && host.closest('x-dc')) return false;
    ensureInput();

    var sec = document.createElement('section');
    sec.id = 'fc-herr';
    var cardsHTML = CARDS.map(function (c) {
      var img = coverDe(c.id);
      var badge = c.credito ? '<span class="fch-badge">✦ ' + GRATIS + ' créditos gratis</span>' : '<span class="fch-badge">✦ Acceso libre</span>';
      return '<div class="fch-card" data-id="' + c.id + '">' +
               '<div class="fch-cover' + (img ? '' : ' fch-nofoto') + '"' + (img ? ' style="background-image:url(&quot;' + img + '&quot;)"' : '') + '></div>' +
               '<div class="fch-scrim"></div><div class="fch-shine"></div>' + badge +
               '<div class="fch-adminimg"><button type="button" data-act="img" title="Cambiar imagen">🖼️</button></div>' +
               '<div class="fch-body">' +
                 '<div class="fch-ic">' + c.icon + '</div>' +
                 '<h3>' + c.titulo + '</h3>' +
                 '<p>' + c.desc + '</p>' +
                 '<div class="fch-acts">' +
                   '<button type="button" class="fch-open" data-act="open">Abrir ↗</button>' +
                   '<button type="button" class="fch-say" data-act="say">🔊 ¿Para qué sirve?</button>' +
                 '</div>' +
               '</div>' +
             '</div>';
    }).join('');
    sec.innerHTML =
      '<p class="fch-eyebrow">Herramientas digitales</p>' +
      '<h2>Estudio &amp; Herramientas Pro</h2>' +
      '<div class="fch-rule"></div>' +
      '<div class="fch-grid">' + cardsHTML + '</div>' +
      '<div class="fch-admin">' +
        '<button type="button" id="fch-precio-btn">✎ Editar precio de créditos</button> ' +
        '<button type="button" id="fch-recarga-btn">💳 Recargar créditos a una clienta</button>' +
      '</div>';

    host.parentNode.insertBefore(sec, host.nextSibling);

    // interacción por tarjeta
    Array.prototype.forEach.call(sec.querySelectorAll('.fch-card'), function (el) {
      var id = el.getAttribute('data-id');
      el.addEventListener('click', function (ev) {
        var act = ev.target.getAttribute('data-act');
        if (act === 'img') { ev.stopPropagation(); pendingCardId = id; fileInput.click(); return; }
        if (act === 'say') { ev.stopPropagation(); decir(id); return; }
        abrir(id);        // clic en la tarjeta = abrir + audio
      });
    });
    var pb = sec.querySelector('#fch-precio-btn');
    if (pb) pb.addEventListener('click', function () {
      var t = prompt('Precio / mensaje que verá la clienta al quedarse sin créditos:', getPrecio());
      if (t !== null) { setPrecio(t.trim()); alert('✓ Precio actualizado en este dispositivo.'); }
    });
    var rb = sec.querySelector('#fch-recarga-btn');
    if (rb) rb.addEventListener('click', recargaAdmin);

    animar(sec);
    syncAdmin();
    return true;
  }

  function decir(id) {
    var c = CARDS.filter(function (x) { return x.id === id; })[0];
    if (c) hablar(c.audio);
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
        e.target.style.animationDelay = (i * 120) + 'ms';
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
        '<button id="fch-say2" type="button">🔊 Audio</button>' +
        '<span id="fch-cr" hidden></span>' +
        '<button id="fch-x" type="button" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div id="fch-wrap">' +
        '<iframe id="fch-frame" allow="clipboard-write; fullscreen" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '<div id="fch-block">' +
          '<div class="fch-lock">🔒</div>' +
          '<h4>Créditos de prueba agotados</h4>' +
          '<p id="fch-block-msg"></p>' +
          '<div id="fch-packs"></div>' +
          '<a id="fch-wa" target="_blank" rel="noopener">📲 Escribir a Fátima por WhatsApp</a>' +
          '<p id="fch-code"></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    frame  = modal.querySelector('#fch-frame');
    bloqueo = modal.querySelector('#fch-block');
    barCr  = modal.querySelector('#fch-cr');
    barT   = modal.querySelector('#fch-title');
    modal.querySelector('#fch-x').addEventListener('click', cerrar);
    modal.querySelector('#fch-say2').addEventListener('click', function () { if (actual) hablar(actual.audio); });
  }

  function abrir(id) {
    var c = CARDS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    buildModal();
    actual = c;
    barT.textContent = c.titulo;
    if (c.credito) { barCr.hidden = false; pintarSaldo(); } else { barCr.hidden = true; }
    bloqueo.classList.remove('on');
    modal.querySelector('#fch-block-msg').textContent = getPrecio();
    modal.querySelector('#fch-wa').href = waLink(c.titulo);
    frame.src = c.src;
    frame.onload = function () { if (c.credito) enviarSaldo(); };
    modal.classList.add('abierto');
    document.documentElement.style.overflow = 'hidden';
    // AUDIO automático de bienvenida (el clic es el gesto que lo permite)
    hablar(c.audio);
    // Crédito: sin saldo → bloqueo; con saldo → cobrar al abrir las herramientas
    // que no reportan por acción (Estudio Universal). El bloque 6 cobra por acción.
    if (c.credito) {
      if (getSaldo(c) <= 0) { mostrarBloqueo(); }
      else if (c.abreCosto > 0) {
        gastar(c.abreCosto).then(function (ns) { pintarSaldo(); enviarSaldo(); if (ns <= 0) mostrarBloqueo(); });
      }
    }
  }

  function cerrar() {
    if (!modal) return;
    callarVoz();
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
  function waPack(p) {
    var titulo = actual ? actual.titulo : 'Herramientas Pro';
    var code = (central && clienteCodigo) ? ('\nMi código: ' + clienteCodigo) : '';
    var msg = 'Hola Fátima 👋 Quiero comprar ' + p.cr + ' créditos por ' + p.eur + '€ para "' + titulo + '".' + code;
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }
  function mostrarBloqueo() {
    if (!bloqueo) return;
    var titulo = actual ? actual.titulo : 'Herramientas Pro';
    modal.querySelector('#fch-block-msg').textContent = getPrecio();
    // paquetes de recarga (compra por WhatsApp)
    modal.querySelector('#fch-packs').innerHTML = PACKS.map(function (p) {
      return '<a href="' + waPack(p) + '" target="_blank" rel="noopener">' + p.cr + ' créditos · ' + p.eur + '€<small>' +
             (p.eur / p.cr).toFixed(2).replace('.', ',') + '€/crédito</small></a>';
    }).join('');
    modal.querySelector('#fch-wa').href = waLink(titulo);
    // código de la clienta (para que Fátima recargue tras el pago)
    var cd = modal.querySelector('#fch-code');
    cd.textContent = (central && clienteCodigo) ? ('Tu código: ' + clienteCodigo) : '';
    bloqueo.classList.add('on');
    // Avisar al chatbox flotante (index.html) para que explique el precio y
    // ofrezca escribir a Fátima. Aditivo: si nadie escucha, no pasa nada.
    try { window.dispatchEvent(new CustomEvent('fc-sin-creditos', { detail: { titulo: titulo } })); } catch (e) {}
  }
  function ocultarBloqueo() {
    if (bloqueo) bloqueo.classList.remove('on');
    try { window.dispatchEvent(new CustomEvent('fc-con-creditos')); } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (!d || !d.tipo || !actual || !actual.credito) return;
    if (e.source !== (frame && frame.contentWindow)) return;   // solo el bloque abierto
    if (d.tipo === 'pedirCreditos') {
      enviarSaldo();
    } else if (d.tipo === 'gastarCreditos') {
      gastar(parseInt(d.cantidad, 10) || 0).then(function (ns) {
        pintarSaldo(); enviarSaldo(); if (ns <= 0) mostrarBloqueo();
      }).catch(function () {});
    } else if (d.tipo === 'salirBloque') {
      cerrar();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('abierto')) cerrar();
  });

  /* ── Recarga de créditos por la administradora (requiere Firebase + correo) ── */
  function ensureAdminEmail() {
    var F = window.FCF;
    if (!fbListo()) return Promise.reject(new Error('sin conexión a Firebase'));
    var u = F.currentUser();
    if (u && u.email === F.ADMIN_EMAIL) return Promise.resolve();
    var email = prompt('Correo de administradora:', F.ADMIN_EMAIL || '');
    if (!email) return Promise.reject(new Error('cancelado'));
    var pass = prompt('Contraseña de administradora:');
    if (!pass) return Promise.reject(new Error('cancelado'));
    return F.signIn(email.trim(), pass);
  }
  function recargaAdmin() {
    if (!fbListo()) { alert('El crédito central aún no está activo (Firebase). Cuando actives el Acceso anónimo y las reglas, podrás recargar aquí.'); return; }
    var code = prompt('Código de la clienta (te lo envía por WhatsApp):');
    if (!code || !code.trim()) return;
    var n = parseInt(prompt('¿Cuántos créditos añadir? (30, 60, 150…)'), 10);
    if (!n || n <= 0) { alert('Cantidad no válida.'); return; }
    ensureAdminEmail().then(function () {
      return window.FCF.recargarCreditos(code.trim(), n);
    }).then(function (ns) {
      alert('✓ Recargado. Nuevo saldo de la clienta: ' + ns + ' créditos.');
    }).catch(function (e) {
      alert('No se pudo recargar: ' + (e && e.message ? e.message : e));
    });
  }

  /* ── Modo administradora: mostrar controles internos ── */
  function syncAdmin() {
    try { document.body.classList.toggle('fch-admin-on', !!window.FC_ADMIN); } catch (e) {}
  }
  window.addEventListener('fc-admin', syncAdmin);

  /* ── Arranque: esperar a que el runtime pinte #servicios ── */
  // Permitir abrir una herramienta desde fuera (p. ej. el chat): window.FC_ABRIR('b6'|'eu')
  window.FC_ABRIR = function (id) { try { abrir(id); } catch (e) {} };

  function arrancar() {
    css();
    initCentral();          // intenta crédito central (Firebase); si no, respaldo local
    // Config del Panel (imagen + animación + precio) sincronizada por Firebase.
    if (fbListo() && window.FCF.watchHerrCfg) {
      try { window.FCF.watchHerrCfg(function (data, err) { if (err) return; herrCfg = data || {}; aplicarCfg(); }); } catch (e) {}
    }
    render();
    // Vigilante: el runtime puede pintar tarde (React viene por red) y puede
    // repintar. Si la sección no está en el DOM real, se reinyecta.
    var t = 0, iv = setInterval(function () {
      render();
      if ((t += 1) > 200) clearInterval(iv);   // vigila ~60s
    }, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);
})();
