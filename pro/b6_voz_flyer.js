/* ══════════════════════════════════════════════════════════════════
   VOZ IA GRATUITA (Google / navegador) · Bloque 6 — pestaña Flyers
   Fátima Caldea Estudio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No modifica ni una línea del sistema existente.

   Qué hace:
     · Elegir voz  ·  Escribir el texto  ·  Reproducirlo

   Qué NO toca (verificado):
     flStartVideo · flPreviewAudio · flAudioUpd · flPlayMelody
     flDrawFrame · las 8 melodías · el micrófono · gastar()
     ttsLeerDoc · ttsGuia · cvInit · Firebase · CSS · ningún ID previo

   Notas técnicas:
     · Usa speechSynthesis (API nativa del navegador). Coste 0.
       Sin clave, sin servidor, sin cuota. Seguro en sitio público.
     · Se engancha con addEventListener('voiceschanged') a propósito,
       NO con .onvoiceschanged, para no pisar el manejador que ya usa
       cvInit() en la línea 1489 del HTML.
     · Todos los IDs llevan prefijo "vz" — comprobado: 0 colisiones.
     · No cobra créditos: reproducir voz no consume nada. Si Fátima
       quiere que cobre, se añade gastar(n) en una sola línea.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Guarda anti doble carga (estilo de la casa) ──
  if (window._B6_VOZFLYER_LOADED) return;
  window._B6_VOZFLYER_LOADED = true;

  // ── Si el navegador no tiene voz, no-op silencioso ──
  if (!('speechSynthesis' in window)) return;

  var MAX_TROZO = 180;   // Chrome corta las frases largas: se trocea
  var hablando = false;
  var keepAlive = null;

  /* ─────────── Construcción del panel ─────────── */
  function construir() {
    // Ancla: la fila "Archivo audio" del flyer. Si no existe, no-op.
    var ancla = document.getElementById('flAudioRow');
    if (!ancla || document.getElementById('vzPanel')) return false;

    var box = document.createElement('div');
    box.id = 'vzPanel';

    // Se reutilizan las clases CSS que ya existen (.row .lbl .btn .btn-g .sep .st)
    // para no duplicar ni una regla de estilo.
    box.innerHTML =
      '<div class="sep"></div>' +
      '<div style="font-size:10px;color:var(--ac2);font-weight:700;margin-bottom:6px">' +
        '🗣️ Voz IA — Panel de voz</div>' +

      '<div class="row"><span class="lbl">Voz gratis</span>' +
        '<select id="vzVoz" style="flex:1"></select>' +
      '</div>' +

      '<div class="row"><span class="lbl">Voz pro (video)</span>' +
        '<select id="vzOaiVoz" style="flex:1">' +
          '<option value="nova">🌟 Nova (femenina cálida)</option>' +
          '<option value="shimmer">✨ Shimmer (femenina suave)</option>' +
          '<option value="alloy">🔵 Alloy (neutral)</option>' +
          '<option value="echo">🎤 Echo (masculina)</option>' +
          '<option value="fable">📖 Fable (expresiva)</option>' +
          '<option value="onyx">⬛ Onyx (masculina grave)</option>' +
        '</select>' +
      '</div>' +

      '<div class="row"><span class="lbl">Velocidad</span>' +
        '<input type="range" id="vzVel" min="0.5" max="1.6" step="0.05" value="1" ' +
          'style="flex:1;accent-color:var(--ac2)">' +
        '<span id="vzVelV" style="font-size:9px;color:var(--ac2);min-width:30px">1.00×</span>' +
      '</div>' +

      '<div class="row" style="align-items:flex-start"><span class="lbl">Texto</span>' +
        '<textarea id="vzTexto" rows="3" placeholder="Escribe aquí lo que quieres escuchar…" ' +
          'style="flex:1;background:var(--bg3);border:1px solid var(--bd);color:var(--tx);' +
          'border-radius:5px;padding:6px 8px;font-size:11px;font-family:inherit;resize:vertical"></textarea>' +
      '</div>' +

      '<div class="row">' +
        '<button class="btn" id="vzPlay" type="button">▶ Escuchar gratis</button>' +
        '<button class="btn btn-g" id="vzStop" type="button">■ Parar</button>' +
        '<span id="vzCount" style="font-size:9px;color:var(--tx2)">0 caracteres</span>' +
      '</div>' +

      '<div id="vzSt"></div>' +
      '<div style="font-size:9px;color:var(--tx2);margin-top:2px">' +
        '▶ Escuchar = voz gratuita del navegador · Para meter ESA MISMA voz dentro del video usa el botón «🎙️ Poner esta voz en el video» de aquí abajo (gratis, sin clave)</div>';

    ancla.parentNode.insertBefore(box, ancla.nextSibling);

    document.getElementById('vzPlay').addEventListener('click', reproducir);
    document.getElementById('vzStop').addEventListener('click', parar);

    var vel = document.getElementById('vzVel');
    vel.addEventListener('input', function () {
      document.getElementById('vzVelV').textContent = parseFloat(vel.value).toFixed(2) + '×';
    });

    var txt = document.getElementById('vzTexto');
    txt.addEventListener('input', function () {
      document.getElementById('vzCount').textContent = txt.value.length + ' caracteres';
    });

    return true;
  }

  /* ─────────── Lista de voces ─────────── */
  function cargarVoces() {
    var sel = document.getElementById('vzVoz');
    if (!sel) return;

    var todas = speechSynthesis.getVoices() || [];
    if (!todas.length) return;                       // aún no están listas

    var es = todas.filter(function (v) {
      return String(v.lang || '').toLowerCase().indexOf('es') === 0;
    });
    var lista = es.length ? es : todas;

    // Las voces de Google primero (son las mejores y las que ella busca)
    lista = lista.slice().sort(function (a, b) {
      var ga = /google/i.test(a.name) ? 0 : 1;
      var gb = /google/i.test(b.name) ? 0 : 1;
      if (ga !== gb) return ga - gb;
      return a.name.localeCompare(b.name);
    });

    var previa = sel.value;
    sel.innerHTML = lista.map(function (v) {
      var marca = /google/i.test(v.name) ? '🟢 ' : '· ';
      return '<option value="' + encodeURIComponent(v.name) + '">' +
             marca + v.name + ' (' + v.lang + ')</option>';
    }).join('');
    if (previa) sel.value = previa;

    sel.setAttribute('data-n', lista.length);
  }

  function vozElegida() {
    var sel = document.getElementById('vzVoz');
    if (!sel || !sel.value) return null;
    var nombre = decodeURIComponent(sel.value);
    var todas = speechSynthesis.getVoices() || [];
    for (var i = 0; i < todas.length; i++) {
      if (todas[i].name === nombre) return todas[i];
    }
    return null;
  }

  /* ─────────── Troceado por frases (no corta palabras) ─────────── */
  function trocear(texto) {
    // Sin lookbehind a propósito: iPhone/Safari antiguos no lo soportan
    // y tiraría TODO el archivo con un SyntaxError.
    var limpio = texto.replace(/\s+/g, ' ').trim();
    var frases = limpio.match(/[^.!?…:;]+[.!?…:;]*\s*/g) || [limpio];
    frases = frases.map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [], buf = '';
    frases.forEach(function (f) {
      while (f.length > MAX_TROZO) {                 // frase larguísima sin puntos
        var corte = f.lastIndexOf(' ', MAX_TROZO);
        if (corte < 40) corte = MAX_TROZO;
        if (buf) { out.push(buf); buf = ''; }
        out.push(f.slice(0, corte));
        f = f.slice(corte).trim();
      }
      if ((buf + ' ' + f).trim().length > MAX_TROZO) { out.push(buf); buf = f; }
      else { buf = (buf ? buf + ' ' : '') + f; }
    });
    if (buf) out.push(buf);
    return out.filter(Boolean);
  }

  /* ─────────── Reproducir ─────────── */
  function estado(msg, tipo) {
    var st = document.getElementById('vzSt');
    if (st) st.innerHTML = msg ? '<div class="st ' + (tipo || 'proc') + '">' + msg + '</div>' : '';
  }

  function reproducir() {
    var ta = document.getElementById('vzTexto');
    var texto = (ta && ta.value || '').trim();

    if (!texto) { estado('✏️ Escribe primero el texto que quieres escuchar.', 'err'); return; }
    if (hablando) { parar(); return; }

    var trozos = trocear(texto);
    if (!trozos.length) { estado('✏️ El texto está vacío.', 'err'); return; }

    var voz = vozElegida();
    var vel = parseFloat((document.getElementById('vzVel') || {}).value || 1) || 1;

    speechSynthesis.cancel();
    hablando = true;
    document.getElementById('vzPlay').textContent = '■ Detener escucha';
    estado('🔊 Reproduciendo…', 'proc');

    // Chrome deja de hablar a los ~15 s: este resume() lo mantiene vivo.
    keepAlive = setInterval(function () {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause(); speechSynthesis.resume();
      }
    }, 9000);

    var i = 0;
    (function siguiente() {
      if (!hablando || i >= trozos.length) { finalizar(true); return; }
      var u = new SpeechSynthesisUtterance(trozos[i]);
      if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = 'es-ES'; }
      u.rate = vel;
      u.pitch = window._vzxPitchValue || parseFloat((document.getElementById('vzxPitch') || {}).value || 1) || 1;
      u.onend = function () { i++; siguiente(); };
      u.onerror = function () { finalizar(false); };
      speechSynthesis.speak(u);
    })();
  }

  function finalizar(ok) {
    hablando = false;
    if (keepAlive) { clearInterval(keepAlive); keepAlive = null; }
    var b = document.getElementById('vzPlay');
    if (b) b.textContent = '▶ Escuchar gratis';
    estado(ok ? '✅ Listo.' : '⚠️ La voz se interrumpió. Prueba con un texto más corto.',
           ok ? 'done' : 'err');
    setTimeout(function () {
      if (!hablando) estado('');
    }, 3500);
  }

  function parar() {
    hablando = false;
    try { speechSynthesis.cancel(); } catch (e) {}
    if (keepAlive) { clearInterval(keepAlive); keepAlive = null; }
    var b = document.getElementById('vzPlay');
    if (b) b.textContent = '▶ Escuchar gratis';
    estado('');
  }

  /* ─────────── Arranque ─────────── */
  function arrancar() {
    if (!construir()) return;
    cargarVoces();
    // addEventListener, NO .onvoiceschanged: así no pisamos cvInit()
    speechSynthesis.addEventListener('voiceschanged', cargarVoces);
    // Algunos Android tardan en publicar las voces
    var reintentos = 0;
    var t = setInterval(function () {
      var sel = document.getElementById('vzVoz');
      if (!sel || sel.options.length || ++reintentos > 20) { clearInterval(t); return; }
      cargarVoces();
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

  window._vzTrocear = trocear;
  window._vzGetVoice = vozElegida;

  // Si el usuario sale del bloque al Hub, callamos la voz.
  window.addEventListener('pagehide', parar);
  window.addEventListener('beforeunload', parar);
})();
