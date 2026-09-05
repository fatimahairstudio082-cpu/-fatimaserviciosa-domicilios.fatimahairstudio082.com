/* ══════════════════════════════════════════════════════════════════
   CRÉDITO POR DESCARGA · Estudio Universal
   Fátima Servicios a Domicilio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No reconstruye ni reescribe la app de Estudio
   Universal. No toca bajarBlob, ni los grabadores, ni el motor de
   diseño, ni ningún ID previo.

   QUÉ RESUELVE
     Estudio Universal es un bloque autónomo que NO reportaba el gasto
     de crédito por acción. Por eso, al abrirlo dentro del hub
     (fc-herramientas.js), el saldo NUNCA bajaba al descargar y el
     descuento no se veía.

   CÓMO
     · Escucha el saldo que el hub envía por postMessage
       (sincronizarCreditos / hubSesion) y lo muestra en una chapa 💳.
     · Cada acción de descarga (todas pasan por un <a download> que crea
       bajarBlob) descuenta 5 créditos: se avisa al hub con
       postMessage({tipo:'gastarCreditos',cantidad:5}). El hub ya baja el
       saldo en Firebase y, al llegar a 0, muestra su aviso de comprar/
       recargar. Aquí solo se refleja.
     · Descargas en ráfaga (p.ej. «Descargar todo») se agrupan en un solo
       cobro con un enfriamiento corto: 1 acción = 5 créditos.

   Progresivo: fuera del hub (página suelta) no cobra nada; solo pinta el
   contador si el hub manda saldo. Si algo falla, la descarga sigue.

   Marca de carga: window._EU_CREDITOS · IDs/clases nuevas: prefijo "euCr"
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_CREDITOS) return;
  window._EU_CREDITOS = true;

  var COSTO      = 5;      // créditos por acción de descarga
  var ENFRIA_MS  = 1800;   // ventana para agrupar una ráfaga en un solo cobro
  var EN_HUB     = (window.parent && window.parent !== window);

  var saldo = null;        // null = aún no lo sabemos
  var enfriando = false;
  var enfriaTimer = null;

  /* ── Chapa del contador (fija, esquina; no molesta al lienzo) ── */
  var chapa = null;
  function crearChapa() {
    if (chapa || !document.body) return;
    chapa = document.createElement('div');
    chapa.id = 'euCrChip';
    chapa.style.cssText =
      'position:fixed;top:8px;right:10px;z-index:2147483000;' +
      'background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;' +
      'font:700 12px/1 system-ui,sans-serif;padding:7px 12px;border-radius:50px;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.35);pointer-events:none;' +
      'display:none;white-space:nowrap;';
    document.body.appendChild(chapa);
  }
  function pintar() {
    if (!chapa) crearChapa();
    if (!chapa) return;
    if (saldo == null) { chapa.style.display = 'none'; return; }
    chapa.textContent = '💳 ' + saldo + ' créditos';
    chapa.style.background = (saldo <= 0)
      ? 'linear-gradient(135deg,#ef4444,#f59e0b)'
      : 'linear-gradient(135deg,#7c3aed,#a855f7)';
    chapa.style.display = '';
  }

  /* ── Puente de saldo con el hub ── */
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (!d || !d.tipo) return;
    if (d.tipo === 'sincronizarCreditos') {
      saldo = parseInt(d.creditos, 10);
      if (isNaN(saldo)) saldo = null;
      pintar();
    } else if (d.tipo === 'hubSesion') {
      var v = (d.creditos != null) ? d.creditos : d.creditos_b6;
      saldo = parseInt(v, 10);
      if (isNaN(saldo)) saldo = null;
      pintar();
    }
  });

  /* ── Cobro por descarga: intercepta el clic del <a download> ──
     bajarBlob() crea un <a download> y lo pulsa; ese clic burbujea hasta
     document y aquí se detecta en fase de captura, SIN tocar bajarBlob. */
  function esDescarga(t) {
    var a = t && t.closest ? t.closest('a[download]') : null;
    return a || null;
  }
  // Enfriamiento DESLIZANTE: una ráfaga de descargas (p.ej. «Descargar todo»,
  // que baja los archivos escalonados) cuenta como UNA sola acción de 5 créditos.
  // Cada descarga dentro de la ventana la reinicia; el cobro solo vuelve cuando
  // pasan ENFRIA_MS sin ninguna descarga.
  function reiniciarEnfria() {
    if (enfriaTimer) clearTimeout(enfriaTimer);
    enfriaTimer = setTimeout(function () { enfriando = false; enfriaTimer = null; }, ENFRIA_MS);
  }
  document.addEventListener('click', function (e) {
    if (!EN_HUB) return;                       // suelto: no cobra
    if (!esDescarga(e.target)) return;
    if (enfriando) { reiniciarEnfria(); return; } // misma ráfaga: ya cobrado, extiende ventana
    if (saldo != null && saldo <= 0) return;    // sin saldo: el hub ya bloquea

    enfriando = true;
    reiniciarEnfria();

    try {
      window.parent.postMessage(
        { tipo: 'gastarCreditos', cantidad: COSTO, concepto: 'Estudio Universal' }, '*'
      );
    } catch (err) {}

    // Reflejo inmediato en la chapa (el hub confirma el saldo real después).
    if (saldo != null) { saldo = Math.max(0, saldo - COSTO); pintar(); }
  }, true);

  /* ── Arranque: pide el saldo actual al hub ── */
  function arrancar() {
    crearChapa();
    if (EN_HUB) { try { window.parent.postMessage({ tipo: 'pedirCreditos' }, '*'); } catch (e) {} }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
