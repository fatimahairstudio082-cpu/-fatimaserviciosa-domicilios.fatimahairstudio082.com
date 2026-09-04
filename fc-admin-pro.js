/* ══════════════════════════════════════════════════════════════════
   PANEL · Pestaña "🛠️ Tarjetas Pro" · Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO para el Panel Privado. NO hay botón flotante: esta
   gestión vive DENTRO de una pestaña del panel que solo existe
   después de que la administradora entra (clave + correo de Firebase).
   Aquí, de forma SINCRONIZADA por Firebase (documento bloques/herr_cfg):
     · Subir/cambiar la IMAGEN de cada tarjeta.
     · Elegir la ANIMACIÓN de cada tarjeta.
     · Fijar el PRECIO de los créditos.
     · RECARGAR créditos a una clienta por su código.
   Lo que se guarda aquí se refleja en las tarjetas de la web
   (fc-herramientas.js lee el mismo documento).
   El contenedor #fap-mount solo existe en la pestaña "Tarjetas Pro"
   y solo tras el login → ninguna clienta lo ve ni puede recargar.
   Marca: window._FC_ADMIN_PRO
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

  var cfg = {}, watching = false, fileInput = null, pendId = null;

  function fb() { return (window.FCF && window.FCF.ready()) ? window.FCF : null; }

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
    var F = fb(); if (!F || !F.saveHerrCfg) { alert('No hay conexión con la nube.'); return; }
    F.saveHerrCfg(parcial).then(function () { if (ok) ok(); })
      .catch(function () { alert('No se pudo guardar. Revisa tu conexión.'); });
  }

  function css() {
    if (document.getElementById('fap-css')) return;
    var st = document.createElement('style');
    st.id = 'fap-css';
    st.textContent =
      '#fap-mount .fap-card{border:1px solid rgba(197,160,89,.2);border-radius:14px;padding:14px;margin-bottom:14px;background:#0d0d0d;}' +
      '#fap-mount .fap-card h4{margin:0 0 10px;font-size:1rem;color:' + ORO + ';font-weight:800;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fap-mount .fap-row{display:flex;gap:10px;align-items:center;margin-bottom:10px;}' +
      '#fap-mount .fap-prev{width:82px;height:60px;border-radius:10px;background-size:cover;background-position:center;background-color:#1a1a1a;border:1px solid rgba(197,160,89,.25);flex:none;}' +
      '#fap-mount .fap-btn{background:transparent;border:1px solid rgba(197,160,89,.5);color:' + ORO + ';border-radius:10px;padding:10px 12px;font-family:Montserrat,system-ui,sans-serif;font-size:.72rem;font-weight:700;cursor:pointer;}' +
      '#fap-mount .fap-btn.full{width:100%;background:' + ORO + ';color:#111;border:none;margin-top:4px;}' +
      '#fap-mount .fap-lbl{display:block;font-size:.62rem;color:#aaa;letter-spacing:.5px;margin:10px 0 4px;font-family:Montserrat,system-ui,sans-serif;}' +
      '#fap-mount .fap-in,#fap-mount .fap-sel{width:100%;background:#0d0d0d;color:#eee;border:1px solid rgba(197,160,89,.3);border-radius:9px;padding:10px;font-family:Montserrat,system-ui,sans-serif;font-size:.8rem;box-sizing:border-box;}' +
      '#fap-mount #fap-msg{min-height:16px;font-size:.68rem;color:#8fce9f;margin-top:6px;font-family:Montserrat,system-ui,sans-serif;}';
    document.head.appendChild(st);
  }

  function ensureInput() {
    if (fileInput) return;
    fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
    fileInput.addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0]; e.target.value = '';
      if (!f || !pendId) return;
      var id = pendId; pendId = null;
      comprimir(f, function (data) { var p = {}; p['img_' + id] = data; guardar(p, function () { msg('✓ Imagen actualizada.'); }); });
    });
    document.body.appendChild(fileInput);
  }

  function htmlUI() {
    var cardsHTML = CARDS.map(function (c) {
      var ops = ANIMS.map(function (a) { return '<option value="' + a[0] + '">' + a[1] + '</option>'; }).join('');
      return '<div class="fap-card" data-id="' + c.id + '">' +
               '<h4>' + c.titulo + '</h4>' +
               '<div class="fap-row"><div class="fap-prev" data-prev></div>' +
                 '<button class="fap-btn" type="button" data-act="img">🖼️ Cambiar imagen</button></div>' +
               '<label class="fap-lbl">Animación de entrada</label>' +
               '<select class="fap-sel" data-anim>' + ops + '</select>' +
             '</div>';
    }).join('');
    return cardsHTML +
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
      '<div id="fap-msg"></div>';
  }

  function msg(t) { var e = document.getElementById('fap-msg'); if (e) { e.textContent = t || ''; if (t) setTimeout(function () { if (e.textContent === t) e.textContent = ''; }, 4000); } }

  function prefill() {
    var m = document.getElementById('fap-mount'); if (!m || m.getAttribute('data-fap') !== '1') return;
    Array.prototype.forEach.call(m.querySelectorAll('.fap-card[data-id]'), function (el) {
      var id = el.getAttribute('data-id'), img = cfg['img_' + id] || '';
      el.querySelector('[data-prev]').style.backgroundImage = img ? 'url("' + img + '")' : '';
      var sel = el.querySelector('[data-anim]'); if (cfg['anim_' + id]) sel.value = cfg['anim_' + id];
    });
    var pr = document.getElementById('fap-precio'); if (pr && document.activeElement !== pr) pr.value = cfg.precio || '';
  }

  function wire(m) {
    ensureInput();
    Array.prototype.forEach.call(m.querySelectorAll('.fap-card[data-id]'), function (el) {
      var id = el.getAttribute('data-id');
      el.querySelector('[data-act="img"]').addEventListener('click', function () { pendId = id; fileInput.click(); });
      el.querySelector('[data-anim]').addEventListener('change', function () { var p = {}; p['anim_' + id] = this.value; guardar(p, function () { msg('✓ Animación guardada.'); }); });
    });
    m.querySelector('#fap-precio-save').addEventListener('click', function () {
      guardar({ precio: (m.querySelector('#fap-precio').value || '').trim() }, function () { msg('✓ Precio guardado.'); });
    });
    m.querySelector('#fap-recargar').addEventListener('click', function () {
      var F = fb(); if (!F || !F.recargarCreditos) { alert('Falta activar el crédito central (Acceso anónimo + reglas en Firebase).'); return; }
      var code = (m.querySelector('#fap-code').value || '').trim();
      var n = parseInt(m.querySelector('#fap-amount').value, 10);
      if (!code) { alert('Escribe el código de la clienta.'); return; }
      if (!n || n <= 0) { alert('Escribe cuántos créditos añadir.'); return; }
      F.recargarCreditos(code, n).then(function (ns) {
        msg('✓ Recargado. Nuevo saldo: ' + ns + ' créditos.');
        m.querySelector('#fap-code').value = ''; m.querySelector('#fap-amount').value = '';
      }).catch(function (e) { alert('No se pudo recargar: ' + (e && e.message ? e.message : e)); });
    });
  }

  // Llena la pestaña cuando existe #fap-mount (React puede recrearlo al cambiar de pestaña).
  function tick() {
    var F = fb();
    if (F && F.watchHerrCfg && !watching) { watching = true; try { F.watchHerrCfg(function (d, err) { if (err) return; cfg = d || {}; prefill(); }); } catch (e) {} }
    var m = document.getElementById('fap-mount');
    if (!m || m.getAttribute('data-fap') === '1') return;
    css();
    m.setAttribute('data-fap', '1');
    m.innerHTML = htmlUI();
    wire(m);
    prefill();
  }

  function arrancar() { setInterval(tick, 500); tick(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 300);
})();
