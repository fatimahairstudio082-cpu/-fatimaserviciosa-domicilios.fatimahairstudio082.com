/* ══════════════════════════════════════════════════════════════════
   VOZ GRATIS DENTRO DEL VIDEO · Bloque 6
   Fátima Caldea Estudio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No modifica ni una línea del sistema existente.

   EL PROBLEMA QUE RESUELVE
     El panel de voz (b6_voz_flyer.js) usa las voces gratuitas del
     navegador (speechSynthesis). Esas voces SUENAN, pero el navegador
     NO las entrega como pista de audio: no existe ninguna API para
     meterlas en un MediaRecorder. Por eso el video con voz acababa
     dependiendo de la voz de pago (clave de OpenAI).

   LA SOLUCIÓN (sin clave, sin servidor, sin cuota)
     Se capta la voz gratuita por el micrófono mientras suena por el
     altavoz, se limpia (recorte de silencios + normalizado de volumen)
     y se devuelve como WAV.

   DOS USOS
     1) Botón en la pestaña Flyers: entrega la voz al flyer como si
        fuera un archivo de música subido a mano. A partir de ahí el
        motor de siempre mezcla el audio y ajusta la duración.
     2) Motor público window.B6_VOZ_GRATIS.capturar({...}) que usa
        b6_video_con_voz.js para ponerle voz a un video subido.

   POR QUÉ SE DEVUELVE WAV Y NO WEBM
     1) La voz captada por el micrófono sale floja y con silencios al
        principio y al final: hay que recortarla y subirle el volumen,
        y eso obliga a decodificarla de todas formas.
     2) La duración del WEBM de MediaRecorder no es de fiar (en varios
        Chrome y en Android sale Infinity). flStartVideo la descarta con
        isFinite y el video se cortaría a 6 s dejando la voz a medias.
        El WAV siempre lleva la duración en la cabecera.

   Qué NO toca (verificado):
     flStartVideo · flAudioFile · flAudioUpd · flPreviewAudio
     flPlayMelody · flDrawFrame · gastar() · b6_voz_flyer.js
     b6_melodias_extra.js · Firebase · CSS · ningún ID previo
     No cobra créditos: cobra el video, como siempre.

   IDs nuevos: prefijo "vg" — 0 colisiones.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window._B6_VOZVIDEOGRATIS_LOADED) return;
  window._B6_VOZVIDEOGRATIS_LOADED = true;

  var COLA_SEG    = 0.45;  // silencio que se deja al final antes de parar
  var CUENTA      = 3;     // cuenta atrás antes de empezar a hablar
  var PICO_MINIMO = 0.02;  // por debajo de esto, el micro no oyó nada
  var MAX_SEG     = 120;   // tope duro de seguridad (una narración larga cabe entera)

  var ocupado = false;
  var cancelador = null;

  function $(id) { return document.getElementById(id); }
  function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function disponible() {
    return ('speechSynthesis' in window) &&
           (typeof MediaRecorder !== 'undefined') &&
           !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /* ─────────── Limpieza del audio captado ───────────
     Recorta el silencio del principio y del final y sube el volumen
     al 90% del máximo. Sin esto la voz del altavoz suena muy floja. */
  function limpiar(buf) {
    var ch = buf.getChannelData(0), n = ch.length, i;
    var pico = 0;
    for (i = 0; i < n; i++) { var a = Math.abs(ch[i]); if (a > pico) pico = a; }
    if (pico < PICO_MINIMO) return { pico: pico, buffer: null };

    var umbral = Math.max(0.012, pico * 0.06);
    var ini = 0, fin = n - 1;
    while (ini < n && Math.abs(ch[ini]) < umbral) ini++;
    while (fin > ini && Math.abs(ch[fin]) < umbral) fin--;

    var margen = Math.floor(buf.sampleRate * 0.12);   // deja un respiro
    ini = Math.max(0, ini - margen);
    fin = Math.min(n - 1, fin + margen);

    var largo = Math.max(1, fin - ini + 1);
    var ganancia = 0.9 / pico;

    var ac = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, largo, buf.sampleRate);
    var salida = ac.createBuffer(1, largo, buf.sampleRate);
    var dst = salida.getChannelData(0);
    for (i = 0; i < largo; i++) dst[i] = Math.max(-1, Math.min(1, ch[ini + i] * ganancia));
    return { pico: pico, buffer: salida };
  }

  function aWav(buffer) {
    // Reutiliza audioBufferToWav() que YA existe en el HTML.
    if (typeof window.audioBufferToWav === 'function') return window.audioBufferToWav(buffer);
    throw new Error('Falta audioBufferToWav en la página.');
  }

  /* ─────────── Habla el texto con la voz gratuita ─────────── */
  function hablar(trozos, voz, vel, tono, alTerminar) {
    var i = 0, vivo = true;
    var keepAlive = setInterval(function () {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause(); speechSynthesis.resume();
      }
    }, 9000);

    // Vigilante: hay navegadores (y móviles sin voces instaladas) en los que
    // la voz nunca avisa de que terminó. Sin esto, la grabación se quedaría
    // colgada para siempre. Se calcula un tope GENEROSO por el largo del texto:
    // más vale esperar de sobra a que la voz termine que cortarla a media frase.
    // (~9 caracteres/seg es una lectura tranquila; antes /11 iba demasiado justo
    // y podía cancelar narraciones largas antes de acabar.)
    var letras = trozos.join(' ').length;
    var tope = Math.min(MAX_SEG, Math.max(10, (letras / 9) / Math.max(0.5, vel) + 8)) * 1000;
    var vigilante = setTimeout(function () { try { speechSynthesis.cancel(); } catch (e) {} fin(i > 0); }, tope);

    function fin(ok) {
      if (!vivo) return;
      vivo = false;
      clearInterval(keepAlive);
      clearTimeout(vigilante);
      alTerminar(ok);
    }

    (function siguiente() {
      if (!vivo) return;
      if (i >= trozos.length) { fin(true); return; }
      var u = new SpeechSynthesisUtterance(trozos[i]);
      if (voz) { u.voice = voz; u.lang = voz.lang; } else { u.lang = 'es-ES'; }
      u.rate = vel; u.pitch = tono;
      u.onend = function () { i++; siguiente(); };
      u.onerror = function () { fin(i > 0); };   // si ya dijo algo, se aprovecha
      speechSynthesis.speak(u);
    })();

    return function cortar() { try { speechSynthesis.cancel(); } catch (e) {} fin(false); };
  }

  /* ══════════════════════════════════════════════════════════════
     MOTOR PÚBLICO
     await B6_VOZ_GRATIS.capturar({texto, voz, vel, tono, aviso})
       → {blob, segundos}   ·   lanza Error con el motivo en español
     ══════════════════════════════════════════════════════════════ */
  async function capturarVoz(op) {
    op = op || {};
    var aviso = (typeof op.aviso === 'function') ? op.aviso : function () {};

    if (ocupado) throw new Error('Ya se está capturando una voz. Espera a que termine.');
    if (!disponible()) throw new Error('Este navegador no puede captar la voz. Prueba en Chrome (Android o PC).');

    var texto = String(op.texto || '').trim();
    if (!texto) throw new Error('Escribe primero el texto que quieres que diga la voz.');

    var trozos = (typeof window._vzTrocear === 'function') ? window._vzTrocear(texto) : [texto];
    if (!trozos.length) throw new Error('El texto está vacío.');

    var voz  = op.voz || ((typeof window._vzGetVoice === 'function') ? window._vzGetVoice() : null);
    var vel  = parseFloat(op.vel)  || 1;
    var tono = parseFloat(op.tono) || 1;

    ocupado = true;
    var stream = null, rec = null, cortarVoz = null, cancelado = false;

    function soltar() {
      ocupado = false;
      cancelador = null;
      try { if (cortarVoz) cortarVoz(); } catch (e) {}
      try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    }
    cancelador = function () {
      cancelado = true;
      try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {}
      soltar();
    };

    try {
      // Micrófono SIN cancelación de eco: si se deja activada, el navegador
      // borra justamente lo que sale del altavoz, o sea, la voz.
      aviso('🎤 Pidiendo permiso del micrófono…');
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        });
      } catch (e) {
        throw new Error('Sin permiso de micrófono no se puede poner la voz.');
      }

      var mime = '';
      ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].some(function (m) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; return true; }
        return false;
      });

      try { rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
      catch (e) { throw new Error('No se pudo iniciar la grabación: ' + (e.message || e)); }

      var partes = [];
      rec.ondataavailable = function (e) { if (e.data && e.data.size) partes.push(e.data); };
      var parado = new Promise(function (res) { rec.onstop = function () { res(); }; });

      // Cuenta atrás: da tiempo a subir el volumen y evita cortar la 1ª palabra.
      for (var c = CUENTA; c > 0; c--) {
        if (cancelado) throw new Error('Cancelado.');
        aviso('🔊 Sube el volumen del altavoz… empieza en ' + c + '…');
        await esperar(700);
      }
      if (cancelado) throw new Error('Cancelado.');

      rec.start();
      await esperar(300);   // colchón de silencio al principio
      aviso('● Grabando la voz… no hables ni tapes el micrófono.');

      var hablado = await new Promise(function (res) {
        cortarVoz = hablar(trozos, voz, vel, tono, function (ok) { res(ok); });
      });
      cortarVoz = null;
      if (cancelado) throw new Error('Cancelado.');

      await esperar(COLA_SEG * 1000);
      try { if (rec.state !== 'inactive') rec.stop(); } catch (e) {}
      await parado;
      try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}

      if (!hablado && !partes.length) throw new Error('La voz no llegó a sonar. Inténtalo otra vez.');

      aviso('⏳ Limpiando la voz…');
      var bruto = new Blob(partes, { type: mime || 'audio/webm' });
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var decodificado = await ac.decodeAudioData(await bruto.arrayBuffer());
      try { ac.close(); } catch (e) {}

      if (decodificado.duration > MAX_SEG) throw new Error('El texto es demasiado largo. Acórtalo.');

      var r = limpiar(decodificado);
      if (!r.buffer) throw new Error('El micrófono no oyó nada. Quita los auriculares, sube el volumen del altavoz y repite.');

      var wav = aWav(r.buffer);
      var seg = r.buffer.length / r.buffer.sampleRate;
      return { blob: wav, segundos: seg };
    } finally {
      soltar();
    }
  }

  window.B6_VOZ_GRATIS = {
    disponible: disponible,
    capturar: capturarVoz,
    cancelar: function () { if (cancelador) cancelador(); },
    ocupada: function () { return ocupado; }
  };

  /* ══════════════════════════════════════════════════════════════
     PANEL DE LA PESTAÑA FLYERS
     ══════════════════════════════════════════════════════════════ */
  function estado(msg, tipo) {
    var e = $('vgSt');
    if (e) e.innerHTML = msg ? '<div class="st ' + (tipo || 'proc') + '">' + msg + '</div>' : '';
  }

  /* Entrega al flyer, sin tocar su código: se rellena el <input id="flAudio">
     y se dispara 'change' para que corra SU propia flAudioFile(), que es
     quien pone flAudioUrl. */
  function entregar(blob, segundos) {
    var input = $('flAudio'), sel = $('flAudioSrc');
    if (!input || !sel) throw new Error('No encuentro el bloque de audio del flyer.');

    var entregado = false;
    try {
      var file = new File([blob], 'voz_gratis.wav', { type: 'audio/wav' });
      var dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      entregado = input.files && input.files.length === 1;
    } catch (e) { entregado = false; }

    if (!entregado) {
      // Respaldo para navegadores sin DataTransfer: se pone la URL a mano.
      // flAudioUrl es un 'let' global del script de la página, compartido.
      try { flAudioUrl = URL.createObjectURL(blob); entregado = true; } catch (e2) {}
    }
    if (!entregado) throw new Error('Este navegador no deja entregar el audio al flyer.');

    sel.value = 'upload';
    if (typeof window.flAudioUpd === 'function') window.flAudioUpd();
    else sel.dispatchEvent(new Event('change', { bubbles: true }));

    // Deja la duración a la vista del usuario (el motor la recalcula igual).
    var dur = $('flDur');
    if (dur && segundos > 0) dur.value = String(Math.max(2, Math.min(20, Math.ceil(segundos))));
  }

  async function alPulsar() {
    if (ocupado) { window.B6_VOZ_GRATIS.cancelar(); estado('Cancelado.', 'err'); return; }

    var btn = $('vgCap');
    if (btn) { btn.textContent = '■ Cancelar'; btn.classList.add('btn-warn'); }
    try {
      var r = await capturarVoz({
        texto: (($('vzTexto') || {}).value || ''),
        vel:   parseFloat(($('vzVel')   || {}).value || 1) || 1,
        tono:  parseFloat(($('vzxPitch') || {}).value || 1) || 1,
        aviso: function (m) { estado(m, 'proc'); }
      });
      entregar(r.blob, r.segundos);
      estado('✅ Voz lista (' + r.segundos.toFixed(1) + ' s) y puesta en el flyer. Pulsa «🎬 Grabar video».', 'done');
    } catch (e) {
      estado('❌ ' + (e.message || e), 'err');
    } finally {
      if (btn) { btn.textContent = '🎙️ Poner esta voz en el video'; btn.classList.remove('btn-warn'); }
    }
  }

  function construir() {
    var panel = $('vzPanel');
    if (!panel || $('vgBox')) return false;

    var box = document.createElement('div');
    box.id = 'vgBox';
    box.innerHTML =
      '<div class="sep"></div>' +
      '<div style="font-size:10px;color:var(--ac2);font-weight:700;margin-bottom:6px">' +
        '🎬 Poner la voz GRATIS dentro del video</div>' +
      '<div style="font-size:9px;color:var(--tx2);line-height:1.5;margin-bottom:6px">' +
        'Las voces gratuitas del navegador suenan por el altavoz, pero el navegador no las entrega ' +
        'como pista de audio. Este botón las capta con el micrófono y las mete en el video. ' +
        '<strong>Sin clave y sin coste.</strong><br>' +
        '👉 Usa el <strong>altavoz</strong> (no auriculares), en un sitio en silencio.</div>' +
      '<div class="row">' +
        '<button class="btn" id="vgCap" type="button">🎙️ Poner esta voz en el video</button>' +
      '</div>' +
      '<div id="vgSt"></div>';

    panel.appendChild(box);
    $('vgCap').addEventListener('click', alPulsar);
    return true;
  }

  /* Aviso amable si eligen la voz de pago: la gratis está a un botón. */
  function avisoVozPago() {
    var sel = $('flAudioSrc');
    if (!sel) return;
    sel.addEventListener('change', function () {
      if (sel.value === 'voz_ia') {
        estado('💡 Si te pide clave, usa aquí abajo «🎙️ Poner esta voz en el video»: es gratis.', 'proc');
      }
    });
  }

  function arrancar() {
    // b6_voz_flyer.js pinta su panel primero; si tarda, se reintenta.
    if (construir()) { avisoVozPago(); return; }
    var intentos = 0;
    var t = setInterval(function () {
      if (construir() || ++intentos > 25) { clearInterval(t); avisoVozPago(); }
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 0);

  window.addEventListener('pagehide', function () { if (cancelador) cancelador(); });
})();
