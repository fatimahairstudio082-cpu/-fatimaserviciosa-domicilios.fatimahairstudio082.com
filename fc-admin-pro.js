/* ══════════════════════════════════════════════════════════════════
   PANEL · Gestión de las Tarjetas Pro (Herramientas Pro + Estudio
   Universal) · Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO para el Panel Privado. No toca el runtime del panel:
   inyecta un botón "🛠️ Tarjetas Pro" (solo cuando la administradora
   está conectada a Firebase) que abre un panel para, de forma
   SINCRONIZADA por Firebase (documento bloques/herr_cfg):

     · Subir/cambiar la IMAGEN de cada tarjeta.
     · Elegir la ANIMACIÓN de cada tarjeta.
     · Fijar el PRECIO de los créditos.
     · RECARGAR créditos a una clienta por su código.

   Lo que se guarda aquí se refleja en las tarjetas de la web (las lee
   fc-herramientas.js del mismo documento). Marca: window._FC_ADMIN_PRO
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._FC_ADMIN_PRO) return;
  window._FC_ADMIN_PRO = true;

  var ORO = '#C5A059';
  var ANIMS = [
    ['subir', '⬆️ Subir (suave)'], ['zoom', '🔍 Acercar'], ['aparecer', '🎞️ Fundido'],
    ['izq', '➡️ Desde la izquierda'], ['der', '⬅️ Desde la derecha'],
    ['voltear', '🔄 Voltear 3D'], ['rebote', '🪀 Rebote']
  ];
  var CARDS = [
    { id: 'b6', titulo: '🛠️ Herramientas Pro' },
    { id: 'eu', titulo: '🎨 Estudio Universal' }
  ];

  var cfg = {};          // último config leído de Firebase
  var unsub = null, panel = null, fab = null;

  function fb() { return (window.FCF && window.FCF.ready()) ? window.FCF : null; }
  function esAdmin() {
    var F = fb(); if (!F) return false;
    var u = F.currentUser && F.currentUser();
    return !!(u && u.email && u.email === F.ADMIN_EMAIL);
  }

  /* ── Compresión (igual que el resto de la app; algo menor para Firestore) ── */
  function comprimir(file, cb) {
    var img = new Image(), url = URL.createObjectURL(file);
    img.onload = function () {
      var max = 900, w = img.width, h = img.height, sc = Math.min(1, max / Math.max(w, h));
      var c = document.createElement('canvas');
      c.width = Math.round(w * sc); c.height = Math.round(h * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      try { cb(c.toDataURL('image/jpeg', 0.7)); } catch (e) { cb(''); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); alert('No se pudo leer la imagen.'); };
    img.src = url;
  }

  function guardar(parcial, ok) {
    var F = fb(); if (!F) { alert('No hay conexión con la nube.'); return; }
    F.saveHerrCfg(parcial).then(function () { if (ok) ok(); })
      .catch(function () { alert('No se pudo guardar. Revisa tu conexión.'); });
  }

  function css() {
    if (document.getElementById('fap-css')) return;
    var st = document.createElement('style');
    st.id = 'fap-css';
    st.textContent =
      '#fap-fab{position:fixed;right:16px;bottom:18px;z-index:99997;display:none;align-items:center;gap:8px;background:' + ORO + ';color:#111;border:none;border-radius:50px;padding:12px 18px;font-family:Montserrat,system-ui,sans-serif;font-size:0.74rem;font-weight:800;letter-spacing:.5px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.5);}' +
      '#fap-modal{position:fixed;inset:0;z-index:99998;background:rgba(6,6,6,.9);display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 14px;}' +
      '#fap-modal.on{display:flex;}' +
      '#fap-box{width:100%;max-width:460px;background:#111;border:1px solid rgba(197,160,89,.3);border-radius:18px;padding:18px;font-family:Montserrat,system-ui,sans-serif;color:#eee;}' +
      '#fap-box h3{font-family:"Cormorant Garamond",serif;color:#fff;font-size:1.5rem;margin:0 0 2px;}' +
      '#fap-box .sub{color:rgba(255,255,255,.5);font-size:.68rem;margin:0 0 14px;}' +
      '.fap-card{border:1px solid rgba(197,160,89,.2);border-radius:14px;padding:14px;margin-bottom:14px;background:#0d0d0d;}' +
      '.fap-card h4{margin:0 0 10px;font-size:.9rem;color:' + ORO + ';font-weight:800;}' +
      '.fap-row{display:flex;gap:10px;align-items:center;margin-bottom:10px;}' +
      '.fap-prev{width:74px;height:56px;border-radius:10px;background-size:cover;background-position:center;background-color:#1a1a1a;border:1px solid rgba(197,160,89,.25);flex:none;}' +
      '.fap-btn{background:transparent;border:1px solid rgba(197,160,89,.5);color:' + ORO + ';border-radius:10px;padding:9px 12px;font-family:inherit;font-size:.7rem;font-weight:700;cursor:pointer;}' +
      '.fap-btn.full{width:100%;background:' + ORO + ';color:#111;border:none;margin-top:2px;}' +
      '.fap-lbl{display:block;font-size:.62rem;color:#aaa;letter-spacing:.5px;margin:10px 0 4px;}' +
      '.fap-in,.fap-sel{width:100%;background:#0d0d0d;color:#eee;border:1px solid rgba(197,160,89,.3);border-radius:9px;padding:9px;font-family:inherit;font-size:.78rem;box-sizing:border-box;}' +
      '#fap-close{float:right;background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;}' +
      '#fap-msg{min-height:16px;font-size:.66rem;color:#8fce9f;margin-top:6px;}';
    document.head.appendChild(st);
  }

  function build() {
    if (panel) return;
    css();
    fab = document.createElement('button');
    fab.id = 'fap-fab'; fab.type = 'button'; fab.innerHTML = '🛠️ Tarjetas Pro';
    document.body.appendChild(fab);

    panel = document.createElement('div');
    panel.id = 'fap-modal';
    var cardsHTML = CARDS.map(function (c) {
      var ops = ANIMS.map(function (a) { return '<option value="' + a[0] + '">' + a[1] + '</option>'; }).join('');
      return '<div class="fap-card" data-id="' + c.id + '">' +
               '<h4>' + c.titulo + '</h4>' +
               '<div class="fap-row">' +
                 '<div class="fap-prev" data-prev></div>' +
                 '<button class="fap-btn" type="button" data-act="img">🖼️ Cambiar imagen</button>' +
               '</div>' +
               '<label class="fap-lbl">Animación de entrada</label>' +
               '<select class="fap-sel" data-anim>' + ops + '</select>' +
             '</div>';
    }).join('');
    panel.innerHTML =
      '<div id="fap-box">' +
        '<button id="fap-close" type="button">×</button>' +
        '<h3>Tarjetas Pro</h3>' +
        '<p class="sub">Imagen, animación y créditos · se sincroniza en tu web</p>' +
        cardsHTML +
        '<div class="fap-card">' +
          '<h4>💳 Créditos</h4>' +
          '<label class="fap-lbl">Precio / mensaje al quedarse sin créditos</label>' +
          '<input class="fap-in" id="fap-precio" type="text" placeholder="Ej. 30 créditos = 6€ · escríbeme">' +
          '<button class="fap-btn full" type="button" id="fap-precio-save">Guardar precio</button>' +
          '<label class="fap-lbl">Recargar a una clienta (código que te llega por WhatsApp)</label>' +
          '<input class="fap-in" id="fap-code" type="text" placeholder="Código de la clienta">' +
          '<label class="fap-lbl">Créditos a añadir</label>' +
          '<input class="fap-in" id="fap-amount" type="number" min="1" placeholder="30, 60, 150…">' +
          '<button class="fap-btn full" type="button" id="fap-recargar">Recargar créditos</button>' +
        '</div>' +
        '<div id="fap-msg"></div>' +
      '</div>';
    document.body.appendChild(panel);

    // input de archivo compartido
    var file = document.createElement('input');
    file.type = 'file'; file.accept = 'image/*'; file.style.display = 'none';
    document.body.appendChild(file);
    var pendId = null;
    file.addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; e.target.value = '';
      if (!f || !pendId) return;
      var id = pendId; pendId = null;
      comprimir(f, function (data) {
        var p = {}; p['img_' + id] = data;
        guardar(p, function () { msg('✓ Imagen actualizada.'); });
      });
    });

    fab.addEventListener('click', function () { pintar(); panel.classList.add('on'); });
    panel.querySelector('#fap-close').addEventListener('click', function () { panel.classList.remove('on'); });
    panel.addEventListener('click', function (e) { if (e.target === panel) panel.classList.remove('on'); });

    // por tarjeta: imagen + animación
    Array.prototype.forEach.call(panel.querySelectorAll('.fap-card[data-id]'), function (el) {
      var id = el.getAttribute('data-id');
      el.querySelector('[data-act="img"]').addEventListener('click', function () { pendId = id; file.click(); });
      el.querySelector('[data-anim]').addEventListener('change', function () {
        var p = {}; p['anim_' + id] = this.value;
        guardar(p, function () { msg('✓ Animación guardada.'); });
      });
    });
    // precio
    panel.querySelector('#fap-precio-save').addEventListener('click', function () {
      guardar({ precio: (panel.querySelector('#fap-precio').value || '').trim() }, function () { msg('✓ Precio guardado.'); });
    });
    // recarga
    panel.querySelector('#fap-recargar').addEventListener('click', function () {
      var F = fb(); if (!F || !F.recargarCreditos) { alert('Falta activar el crédito central (Acceso anónimo + reglas en Firebase).'); return; }
      var code = (panel.querySelector('#fap-code').value || '').trim();
      var n = parseInt(panel.querySelector('#fap-amount').value, 10);
      if (!code) { alert('Escribe el código de la clienta.'); return; }
      if (!n || n <= 0) { alert('Escribe cuántos créditos añadir.'); return; }
      F.recargarCreditos(code, n).then(function (ns) {
        msg('✓ Recargado. Nuevo saldo: ' + ns + ' créditos.');
        panel.querySelector('#fap-code').value = ''; panel.querySelector('#fap-amount').value = '';
      }).catch(function (e) { alert('No se pudo recargar: ' + (e && e.message ? e.message : e)); });
    });
  }

  function msg(t) { var e = document.getElementById('fap-msg'); if (e) { e.textContent = t || ''; if (t) setTimeout(function () { if (e.textContent === t) e.textContent = ''; }, 4000); } }

  function pintar() {
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll('.fap-card[data-id]'), function (el) {
      var id = el.getAttribute('data-id');
      var img = cfg['img_' + id] || '';
      el.querySelector('[data-prev]').style.backgroundImage = img ? 'url("' + img + '")' : '';
      var sel = el.querySelector('[data-anim]');
      if (cfg['anim_' + id]) sel.value = cfg['anim_' + id];
    });
    var pr = document.getElementById('fap-precio'); if (pr) pr.value = cfg.precio || '';
  }

  /* ── Mostrar el botón solo cuando la admin está conectada a Firebase ── */
  function sync() {
    var on = esAdmin();
    if (on && !panel) build();
    if (fab) fab.style.display = on ? 'inline-flex' : 'none';
    if (!on && panel) panel.classList.remove('on');
    if (on && fb() && !unsub) {
      unsub = fb().watchHerrCfg(function (data, err) { if (err) return; cfg = data || {}; pintar(); });
    }
  }

  function arrancar() {
    var F = fb();
    if (F && F.onAuth) { try { F.onAuth(function () { sync(); }); } catch (e) {} }
    sync();
    setTimeout(sync, 800); setTimeout(sync, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);
})();
