/* ══════════════════════════════════════════════════════════════════
   PROMOCIONES DINÁMICAS · Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO. Publica en la web, desde el Panel Admin y en la NUBE,
   las promociones que la administradora crea (tipo "promo" en Bloques).
   Todas las clientas las ven desde cualquier móvil, sin descargar nada.

   Cómo funciona:
     · El admin crea una promo (imagen + texto + efecto) → se guarda en
       Firebase (colección 'bloques', tipo:'promo') → lectura pública.
     · Este script escucha esa colección en tiempo real y pinta una
       sección "Promociones" con cada imagen ANIMADA (parece vídeo) y un
       botón 🔊 que NARRA el texto con la voz gratis del navegador.

   Si Firebase no está o no hay promos, no pinta nada (la web sigue igual).
   Cero dependencias externas. Marca de carga: window._FC_PROMOS.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_PROMOS) return;
  window._FC_PROMOS = true;

  var ORO = '#C5A059';
  var _unsub = null;

  function reduce() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }
  function imgURL(u) {
    try { if (window.FC && FC.driveImg) return FC.driveImg(u); } catch (e) {}
    return u || '';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function css() {
    if (document.getElementById('fcp-css')) return;
    var st = document.createElement('style'); st.id = 'fcp-css';
    st.textContent =
      '@keyframes fcp-ken{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.14) translate(-2%,-1.5%)}100%{transform:scale(1) translate(0,0)}}' +
      '@keyframes fcp-3d{0%{transform:perspective(900px) rotateY(-5deg)}50%{transform:perspective(900px) rotateY(5deg)}100%{transform:perspective(900px) rotateY(-5deg)}}' +
      '@keyframes fcp-fade{0%,100%{opacity:.72}50%{opacity:1}}' +
      '@keyframes fcp-in{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}' +
      '#fc-promos{padding:46px 18px 22px;}' +
      '#fc-promos .fcp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px;}' +
      '.fcp-card{position:relative;background:#0d0d0d;border:1px solid rgba(197,160,89,.2);border-radius:18px;overflow:hidden;box-shadow:0 12px 34px rgba(0,0,0,.45);animation:fcp-in .8s cubic-bezier(.22,.61,.36,1) both;}' +
      '.fcp-media{position:relative;width:100%;aspect-ratio:4/5;overflow:hidden;background:#161616;}' +
      '.fcp-media > .fcp-img{position:absolute;inset:0;background-size:cover;background-position:center;will-change:transform;}' +
      '.fcp-ken{animation:fcp-ken 9s ease-in-out infinite;}' +
      '.fcp-3d{animation:fcp-3d 7s ease-in-out infinite;}' +
      '.fcp-fade{animation:fcp-fade 4.5s ease-in-out infinite;}' +
      '.fcp-badge{position:absolute;top:11px;left:11px;background:' + ORO + ';color:#111;font-size:.55rem;font-weight:800;letter-spacing:1.5px;padding:5px 11px;border-radius:50px;}' +
      '.fcp-cat{position:absolute;top:11px;right:11px;background:rgba(0,0,0,.6);color:#fff;font-size:.52rem;font-weight:700;letter-spacing:1px;padding:5px 10px;border-radius:50px;}' +
      '.fcp-body{padding:14px 16px 16px;}' +
      '.fcp-body h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.28rem;color:#fff;margin:0 0 6px;line-height:1.12;}' +
      '.fcp-body p{color:rgba(255,255,255,.55);font-size:.78rem;line-height:1.6;margin:0 0 12px;}' +
      '.fcp-btns{display:flex;gap:8px;flex-wrap:wrap;}' +
      '.fcp-oir,.fcp-cita{border:none;border-radius:50px;font-family:Montserrat,system-ui,sans-serif;font-weight:700;font-size:.72rem;padding:9px 15px;cursor:pointer;}' +
      '.fcp-oir{background:rgba(197,160,89,.14);border:1px solid rgba(197,160,89,.45);color:' + ORO + ';}' +
      '.fcp-oir.son{background:' + ORO + ';color:#111;}' +
      '.fcp-cita{background:' + ORO + ';color:#111;}' +
      '@media (prefers-reduced-motion: reduce){.fcp-ken,.fcp-3d,.fcp-fade{animation:none!important}}';
    document.head.appendChild(st);
  }

  /* ── Voz gratis ── */
  function narrar(txt, btn) {
    if (!('speechSynthesis' in window) || !txt) return;
    try { speechSynthesis.cancel(); } catch (e) {}
    var vs = speechSynthesis.getVoices() || [];
    var voz = vs.filter(function (v) { return /es(-|_|$)/i.test(v.lang); })[0] || null;
    var u = new SpeechSynthesisUtterance(txt);
    if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = 'es-ES'; }
    if (btn) { btn.classList.add('son'); u.onend = u.onerror = function () { btn.classList.remove('son'); }; }
    speechSynthesis.speak(u);
  }

  function claseAnim(anim, tieneVarias, i) {
    if (anim === 'ninguna') return '';
    if (anim === '3d') return 'fcp-3d';
    if (anim === 'fundido') return 'fcp-fade';
    if (anim === 'kenburns' || anim === 'zoom') return 'fcp-ken';
    return 'fcp-ken'; // auto
  }

  function seccion() {
    var s = document.getElementById('fc-promos');
    if (s) return s;
    s = document.createElement('section');
    s.id = 'fc-promos';
    s.innerHTML =
      '<p style="font-size:.58rem;letter-spacing:4px;color:' + ORO + ';text-transform:uppercase;font-weight:700;margin:0 0 8px;">Ofertas del momento</p>' +
      '<h2 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.1rem;line-height:1.05;margin:0 0 12px;color:#fff;">Promociones</h2>' +
      '<div style="width:46px;height:1px;background:' + ORO + ';margin-bottom:22px;"></div>' +
      '<div class="fcp-grid"></div>';
    // Insertar arriba, antes de Servicios (o Trabajos), para que se vea primero
    var ancla = document.getElementById('servicios') || document.getElementById('trabajos');
    if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(s, ancla);
    else document.body.appendChild(s);
    return s;
  }

  function agendar() {
    // Reutiliza el botón de reserva de la web si existe; si no, va a WhatsApp.
    var a = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
    if (a) { a.click ? a.click() : (location.href = a.href); return; }
    var res = document.getElementById('reservar') || document.getElementById('cita');
    if (res) { try { res.scrollIntoView({ behavior: 'smooth' }); } catch (e) {} }
  }

  function render(promos) {
    css();
    if (!promos.length) {
      var ex = document.getElementById('fc-promos'); if (ex) ex.remove();
      return;
    }
    var sec = seccion();
    var grid = sec.querySelector('.fcp-grid');
    grid.innerHTML = '';
    promos.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'fcp-card';
      var anim = reduce() ? 'ninguna' : (p.anim || 'auto');
      var img = imgURL(p.img);
      card.innerHTML =
        '<div class="fcp-media">' +
          '<div class="fcp-img ' + claseAnim(anim) + '" style="background-image:url(\'' + esc(img) + '\')"></div>' +
          '<span class="fcp-badge">PROMO</span>' +
          (p.cat ? '<span class="fcp-cat">' + esc(p.cat) + '</span>' : '') +
        '</div>' +
        '<div class="fcp-body">' +
          '<h3>' + esc(p.titulo || 'Promoción') + '</h3>' +
          (p.desc ? '<p>' + esc(p.desc) + '</p>' : '') +
          '<div class="fcp-btns">' +
            (p.texto ? '<button type="button" class="fcp-oir">🔊 Escuchar</button>' : '') +
            '<button type="button" class="fcp-cita">Reservar cita →</button>' +
          '</div>' +
        '</div>';
      var oir = card.querySelector('.fcp-oir');
      if (oir) oir.addEventListener('click', function () { narrar(p.texto, oir); });
      var cita = card.querySelector('.fcp-cita');
      if (cita) cita.addEventListener('click', agendar);
      grid.appendChild(card);
    });
  }

  /* ── Escuchar la nube (tiempo real) ── */
  function arrancar() {
    if (!window.FCF || !FCF.ready || !FCF.ready() || !FCF.watchBloques) {
      // Firebase no está listo: reintenta un poco (puede cargar tarde).
      if (arrancar._n = (arrancar._n || 0) + 1, arrancar._n <= 20) setTimeout(arrancar, 500);
      return;
    }
    if (_unsub) return;
    _unsub = FCF.watchBloques('caldea', function (arr, err) {
      if (err || !arr) return;
      var promos = arr.filter(function (b) { return (b.tipo || '') === 'promo' && b.img; })
                      .sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
      render(promos);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);

  window.addEventListener('pagehide', function () {
    try { speechSynthesis.cancel(); } catch (e) {}
    try { if (_unsub) _unsub(); } catch (e) {}
  });
})();
