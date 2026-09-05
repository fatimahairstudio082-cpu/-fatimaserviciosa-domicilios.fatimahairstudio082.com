/* ═════════════════════════════════════════════════════════════════
   VOZ · b6_voz.js

   Todo lo que suena en la aplicación pasa por aquí: la voz del
   navegador, los ajustes que la persona elige una vez, y los audios
   que graba con su propia voz.

   Dos reglas que explican el diseño:

   1 · Una frase por paso. La narración no es un párrafo largo que se
       reproduce encima de la animación: es una frase por nodo, y el
       siguiente nodo no entra hasta que la frase termina. Así lo que
       se oye y lo que se ve hablan de lo mismo.

   2 · La voz propia manda. Si hay un audio grabado para un paso, se
       reproduce ese y no la voz sintética. La grabación se guarda en
       el dispositivo y sobrevive al cierre de la página.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_VOZ) return;
  window._B6_VOZ = true;

  var CLAVE = 'eu_voz_v1';
  var SS = window.speechSynthesis || null;

  /* Codificador WAV (PCM16). Se expone SOLO si la página no lo trae ya, para
     que B6_VOZ_GRATIS.capturar() (voz de Google por micrófono) funcione también
     en Estudio Universal, que no incluía este ayudante. Aditivo y guardado. */
  if (typeof window.audioBufferToWav !== 'function') {
    window.audioBufferToWav = function (buffer) {
      var nCh = buffer.numberOfChannels, sr = buffer.sampleRate, n = buffer.length;
      var canales = [], i, ch;
      for (ch = 0; ch < nCh; ch++) canales.push(buffer.getChannelData(ch));
      var bytesMuestra = 2, bloque = nCh * bytesMuestra;
      var datos = n * bloque, buf = new ArrayBuffer(44 + datos), v = new DataView(buf);
      function txt(off, s) { for (var k = 0; k < s.length; k++) v.setUint8(off + k, s.charCodeAt(k)); }
      txt(0, 'RIFF'); v.setUint32(4, 36 + datos, true); txt(8, 'WAVE');
      txt(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
      v.setUint16(22, nCh, true); v.setUint32(24, sr, true);
      v.setUint32(28, sr * bloque, true); v.setUint16(32, bloque, true);
      v.setUint16(34, 8 * bytesMuestra, true); txt(36, 'data'); v.setUint32(40, datos, true);
      var off = 44;
      for (i = 0; i < n; i++) for (ch = 0; ch < nCh; ch++) {
        var s = Math.max(-1, Math.min(1, canales[ch][i]));
        v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true); off += 2;
      }
      return new Blob([v], { type: 'audio/wav' });
    };
  }

  var ajustes = { voz: '', velocidad: 1, tono: 1 };
  try {
    var g = JSON.parse(localStorage.getItem(CLAVE) || '{}');
    if (g && typeof g === 'object') {
      if (g.voz) ajustes.voz = g.voz;
      if (g.velocidad) ajustes.velocidad = g.velocidad;
      if (g.tono) ajustes.tono = g.tono;
    }
  } catch (e) { }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(ajustes)); } catch (e) { }
  }

  /* Las voces del navegador llegan tarde en algunos equipos: se pide la lista
     y, si viene vacía, se espera al evento en lugar de dar por hecho que no
     hay ninguna. */
  var oyentesVoces = [];
  function voces() {
    if (!SS) return [];
    var v = SS.getVoices() || [];
    var es = v.filter(function (x) { return /^es/i.test(x.lang); });
    return (es.length ? es : v).map(function (x) {
      return { id: x.voiceURI, n: x.name, lang: x.lang, ref: x };
    });
  }
  if (SS && typeof SS.addEventListener === 'function') {
    SS.addEventListener('voiceschanged', function () {
      oyentesVoces.forEach(function (fn) { try { fn(voces()); } catch (e) { } });
    });
  }

  function elegida() {
    var L = voces();
    if (!L.length) return null;
    var m = L.filter(function (x) { return x.id === ajustes.voz; })[0];
    return (m || L[0]).ref;
  }

  /* ─────────── Audios propios ───────────
     Se guardan como data URL en localStorage, indexados por una clave que
     forma quien graba (por ejemplo 'lam:mapa_corte:3'). Es sencillo y no
     depende de permisos de almacenamiento adicionales; a cambio conviene no
     grabar clips largos, que es justo lo que se pide en una narración de
     un paso: unos segundos. */
  var CLAVE_AUD = 'eu_voz_audios_v1';
  var audios = {};
  try { audios = JSON.parse(localStorage.getItem(CLAVE_AUD) || '{}') || {}; } catch (e) { }
  function guardarAudios() {
    try { localStorage.setItem(CLAVE_AUD, JSON.stringify(audios)); } catch (e) { }
  }

  var grabadora = null, trozos = [], flujo = null, claveGrab = '';

  function grabando() { return !!grabadora; }

  function grabar(clave, cuando) {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      return Promise.reject(new Error('Este navegador no puede grabar audio.'));
    }
    if (grabadora) return Promise.reject(new Error('Ya se está grabando.'));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (f) {
      flujo = f; trozos = []; claveGrab = clave;
      grabadora = new MediaRecorder(f);
      grabadora.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
      grabadora.start();
      if (cuando) cuando('grabando');
      return true;
    });
  }

  function parar() {
    return new Promise(function (res, rej) {
      if (!grabadora) return rej(new Error('No se está grabando.'));
      var g = grabadora;
      g.onstop = function () {
        var b = new Blob(trozos, { type: g.mimeType || 'audio/webm' });
        var fr = new FileReader();
        fr.onload = function () {
          audios[claveGrab] = fr.result;
          guardarAudios();
          grabadora = null; trozos = [];
          if (flujo) { flujo.getTracks().forEach(function (t) { t.stop(); }); flujo = null; }
          res(claveGrab);
        };
        fr.readAsDataURL(b);
      };
      try { g.stop(); } catch (e) { rej(e); }
    });
  }

  function tieneAudio(clave) { return !!audios[clave]; }
  function borrarAudio(clave) { delete audios[clave]; guardarAudios(); }
  function audioDe(clave) { return audios[clave] || null; }

  /* ─────────── Reproducción ───────────
     hablar() resuelve cuando la frase ha terminado de sonar. Es lo que permite
     encadenar narración y animación sin temporizadores adivinados. */
  var reproduciendo = null;
  var cortado = false;

  function hablar(texto, clave) {
    cortado = false;
    var propio = clave && audios[clave];
    if (propio) {
      return new Promise(function (res) {
        var a = new Audio(propio);
        reproduciendo = a;
        a.onended = a.onerror = function () { reproduciendo = null; res(); };
        a.play().catch(function () { reproduciendo = null; res(); });
      });
    }
    if (!SS || !texto) return Promise.resolve();
    return new Promise(function (res) {
      var u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-ES';
      u.rate = ajustes.velocidad;
      u.pitch = ajustes.tono;
      var v = elegida();
      if (v) u.voice = v;
      u.onend = u.onerror = function () { res(); };
      SS.speak(u);
      /* Algunos navegadores no disparan onend si la pestaña pierde el foco.
         Un tope calculado por longitud evita que la animación se quede
         esperando para siempre. */
      var tope = Math.max(1500, texto.length * 90 / ajustes.velocidad);
      setTimeout(function () { res(); }, tope);
    });
  }

  function callar() {
    cortado = true;
    try { if (SS) SS.cancel(); } catch (e) { }
    if (reproduciendo) { try { reproduciendo.pause(); } catch (e) { } reproduciendo = null; }
  }

  /* Narra una lista de pasos en orden, avisando de cada uno antes de sonar.
     pasos: [{ texto, clave }] · alPaso(i) se llama justo antes de cada frase. */
  function narrar(pasos, alPaso) {
    callar();
    cortado = false;
    var i = 0;
    function sigue() {
      if (cortado || i >= pasos.length) return Promise.resolve();
      var p = pasos[i];
      if (alPaso) { try { alPaso(i, p); } catch (e) { } }
      return hablar(p.texto, p.clave).then(function () {
        i++;
        return cortado ? null : sigue();
      });
    }
    return sigue();
  }

  /* ═════════════════════════════════════════════════════════════
     B6Voz · la voz dentro del archivo de vídeo

     El resto de la aplicación —tríptico, estudios, guías 3D— ya pide una
     pista de audio con este nombre antes de grabar. Aquí se le da, y con
     eso la narración deja de ser algo que suena en los altavoces y pasa a
     quedar incrustada en el MP4 que se descarga, en todas las disciplinas
     por igual.

     Qué puede ir dentro del archivo y qué no:
       · los audios que la persona ha grabado, sí — son un flujo real;
       · el micrófono en directo, sí — narras mientras se graba;
       · la voz sintética del navegador, no — el navegador no la ofrece
         como flujo. Cuando solo hay eso, se avisa y el vídeo sale con la
         narración rotulada en imagen, que es lo que ya hacía.
     ═════════════════════════════════════════════════════════════ */

  var vozB6 = {
    vivo: false,
    /* Captura del sonido de la propia pestaña: es la única vía por la que la
       voz sintética del navegador puede quedar dentro del archivo de vídeo. */
    pestana: false,
    nota: '',
    /* Guion que las pantallas dejan aquí antes de exportar: [{texto, clave}] */
    guion: [],
    /* Clave del clip suelto: las pantallas que narran un bloque entero
       (tríptico, carrusel, maqueta) graban una sola toma aquí. */
    clave: 'suelto',
    suscritos: []
  };

  function avisarVoz() {
    vozB6.suscritos.forEach(function (fn) { try { fn(); } catch (e) { } });
  }

  function clavesConAudio() {
    return (vozB6.guion || []).filter(function (p) { return p.clave && audios[p.clave]; });
  }

  /* El clip suelto de la pantalla actual, si la persona lo ha grabado o subido. */
  function sueltoHay() { return !!audios[vozB6.clave]; }

  function mime(conAudio) {
    var L = conAudio
      ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus', 'video/webm']
      : ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
    for (var i = 0; i < L.length; i++) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(L[i])) return L[i];
    }
    return '';
  }

  /* Respaldo para móvil: capta la voz de Google por el micrófono y la
     devuelve como pista de audio real, lista para incrustar en el vídeo.
     Solo se usa cuando se pidió «meter la voz de Google» y el navegador no
     tiene getDisplayMedia (compartir sonido de pestaña). No toca ninguna de
     las otras vías (voz grabada / micrófono en directo). */
  function capturarGooglePorMic() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!window.B6_VOZ_GRATIS || !window.B6_VOZ_GRATIS.disponible() || !AC) {
      vozB6.nota = 'Para meter la voz de Google en el móvil hay que captarla por el micrófono y este navegador no puede. Graba tu voz con 🎙, narra en directo, o hazlo desde el ordenador.';
      return Promise.resolve(null);
    }
    var texto = (vozB6.guion || []).map(function (p) { return p && p.texto ? p.texto : ''; })
      .filter(function (x) { return x; }).join('. ').trim();
    if (!texto) { vozB6.nota = 'Escribe primero la narración.'; return Promise.resolve(null); }
    return window.B6_VOZ_GRATIS.capturar({
      texto: texto, vel: ajustes.velocidad, tono: ajustes.tono,
      aviso: function (m) { vozB6.nota = m; avisarVoz(); }
    }).then(function (r) {
      var url = URL.createObjectURL(r.blob);
      var ac = new AC();
      var dest = ac.createMediaStreamDestination();
      var a = new Audio(url); a.crossOrigin = 'anonymous';
      try { ac.createMediaElementSource(a).connect(dest); } catch (e) { }
      vozB6.nota = '';
      return {
        track: dest.stream.getAudioTracks()[0], directo: false,
        empezar: function () {
          if (ac.state === 'suspended') ac.resume().catch(function () { });
          a.play().catch(function () { });
        },
        parar: function () { try { a.pause(); } catch (e) { } try { URL.revokeObjectURL(url); } catch (e) { } }
      };
    }).catch(function (e) {
      vozB6.nota = (e && e.message) ? e.message : 'No se pudo captar la voz de Google.';
      return null;
    });
  }

  /* Devuelve { track, empezar, directo } o null. La pista se conecta al
     grabador ANTES de arrancar; empezar() se llama cuando el grabador ya
     está en marcha, para que la primera palabra no se pierda. */
  function pista() {
    vozB6.nota = '';
    var AC = window.AudioContext || window.webkitAudioContext;

    /* Sonido de la pestaña: el navegador reproduce la voz de Google por el
       altavoz y aquí se toma esa misma pista, así que entra en el archivo sin
       micrófono y sin ruido de la habitación. Hay que compartir «esta
       pestaña» y marcar la casilla de audio. */
    if (vozB6.pestana) {
      /* En el móvil (iPhone/Android) no existe getDisplayMedia, así que no se
         puede compartir el sonido de la pestaña. Respaldo: captar la voz de
         Google por el micrófono (suena por el altavoz) y montarla como pista
         real dentro del vídeo. Reutiliza B6_VOZ_GRATIS de b6_voz_video_gratis.js. */
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        return capturarGooglePorMic();
      }
      return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(function (st) {
        var at = (st.getAudioTracks() || [])[0];
        st.getVideoTracks().forEach(function (t) { try { t.stop(); } catch (e) { } });
        if (!at) {
          vozB6.nota = 'No has compartido el sonido. Vuelve a intentarlo eligiendo «Esta pestaña» y marcando «Compartir audio de la pestaña».';
          return null;
        }
        return {
          track: at, directo: false, pestana: true,
          empezar: function () { narrar(vozB6.guion || []); },
          parar: function () { callar(); try { at.stop(); } catch (e) { } }
        };
      }).catch(function () {
        vozB6.nota = 'No se ha podido capturar el sonido de la pestaña.';
        return null;
      });
    }

    if (vozB6.vivo) {
      if (!navigator.mediaDevices) {
        vozB6.nota = 'Este navegador no da acceso al micrófono.';
        return Promise.resolve(null);
      }
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (f) {
        return { track: f.getAudioTracks()[0], directo: true, empezar: function () { } };
      }).catch(function () {
        vozB6.nota = 'No se ha podido abrir el micrófono.';
        return null;
      });
    }

    var conAudio = clavesConAudio();

    /* Una sola toma para toda la pantalla: se enchufa entera y ya está. */
    if (!conAudio.length && sueltoHay() && AC) {
      var ac1 = new AC();
      var d1 = ac1.createMediaStreamDestination();
      var a1 = new Audio(audios[vozB6.clave]);
      a1.crossOrigin = 'anonymous';
      try { ac1.createMediaElementSource(a1).connect(d1); } catch (e) { }
      return Promise.resolve({
        track: d1.stream.getAudioTracks()[0], directo: false,
        empezar: function () {
          if (ac1.state === 'suspended') ac1.resume().catch(function () { });
          a1.play().catch(function () { });
        },
        parar: function () { try { a1.pause(); } catch (e) { } }
      });
    }

    if (!conAudio.length || !AC) {
      vozB6.nota = 'La voz del navegador no se puede meter dentro del archivo por sí sola. Activa «meter la voz de Google» y comparte el sonido de la pestaña, graba tu voz, o narra en directo por micrófono.';
      return Promise.resolve(null);
    }

    var ac = new AC();
    var dest = ac.createMediaStreamDestination();
    return Promise.resolve({
      track: dest.stream.getAudioTracks()[0],
      directo: false,
      /* Los clips se encadenan por el mismo destino, cada uno cuando termina
         el anterior. Los pasos sin grabación dejan su hueco de silencio
         calculado por la longitud del texto, para que la voz no se adelante
         a la imagen. */
      empezar: function () {
        var i = 0;
        var sigue = function () {
          if (i >= vozB6.guion.length) return;
          var p = vozB6.guion[i++];
          var dato = p.clave && audios[p.clave];
          if (!dato) {
            var espera = Math.max(900, (p.texto || '').length * 85 / ajustes.velocidad);
            return void setTimeout(sigue, espera);
          }
          var a = new Audio(dato);
          a.crossOrigin = 'anonymous';
          try {
            var src = ac.createMediaElementSource(a);
            src.connect(dest);
          } catch (e) { }
          a.onended = a.onerror = sigue;
          a.play().catch(sigue);
        };
        if (ac.state === 'suspended') ac.resume().catch(function () { });
        sigue();
      }
    });
  }

  window.B6Voz = {
    get vivo() { return vozB6.vivo; },
    set vivo(v) { vozB6.vivo = !!v; if (v) vozB6.pestana = false; avisarVoz(); },
    setVivo: function (v) { vozB6.vivo = !!v; if (v) vozB6.pestana = false; avisarVoz(); },
    get pestana() { return vozB6.pestana; },
    setPestana: function (v) { vozB6.pestana = !!v; if (v) vozB6.vivo = false; avisarVoz(); },
    get nota() { return vozB6.nota; },
    /* Las pantallas dejan aquí el guion del vídeo que van a exportar. */
    ponerGuion: function (pasos) { vozB6.guion = (pasos || []).slice(); },
    guion: function () { return vozB6.guion.slice(); },
    /* Y aquí la clave de la toma única de esta pantalla. */
    ponerClave: function (c) { vozB6.clave = c || 'suelto'; },
    clave: function () { return vozB6.clave; },
    hay: function () { return clavesConAudio().length > 0 || sueltoHay(); },
    cuantos: function () { return clavesConAudio().length; },

    /* ── La toma única: grabar, subir, oír, quitar ── */
    get grabando() { return grabando(); },
    grabar: function () {
      if (grabando()) return parar().then(function (k) { avisarVoz(); return k; });
      return grabar(vozB6.clave, function () { avisarVoz(); });
    },
    subir: function (f) {
      if (!f) return Promise.resolve(null);
      return new Promise(function (ok) {
        var fr = new FileReader();
        fr.onload = function () {
          audios[vozB6.clave] = fr.result;
          guardarAudios(); avisarVoz(); ok(vozB6.clave);
        };
        fr.readAsDataURL(f);
      });
    },
    oir: function () {
      var d = audios[vozB6.clave];
      if (!d) return;
      callar();
      var a = new Audio(d);
      reproduciendo = a;
      a.play().catch(function () { });
    },
    quitar: function () { borrarAudio(vozB6.clave); avisarVoz(); },
    /* Ensayo: suena lo que va a quedar dentro del vídeo. */
    probar: function () {
      if (sueltoHay() && !clavesConAudio().length) return window.B6Voz.oir();
      return narrar(vozB6.guion || []);
    },
    callar: callar,

    mime: mime,
    pista: pista,
    suscribir: function (fn) {
      vozB6.suscritos.push(fn);
      return function () {
        vozB6.suscritos = vozB6.suscritos.filter(function (x) { return x !== fn; });
      };
    },
    resumen: function () {
      var n = clavesConAudio().length, t = (vozB6.guion || []).length;
      var hayPantalla = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
      if (vozB6.pestana) return hayPantalla
        ? 'La voz de Google entrará en el archivo: al grabar te pedirá compartir «Esta pestaña» con su audio.'
        : 'La voz de Google entrará en el archivo: al grabar se captará por el micrófono, así que sube el volumen del altavoz y no uses auriculares.';
      if (vozB6.vivo) return 'Narrarás en directo: tu micrófono se graba dentro del vídeo.';
      if (grabando()) return 'Grabando tu voz… vuelve a pulsar para parar.';
      if (sueltoHay() && !n) return 'Tienes tu toma grabada: el vídeo se descarga con esa voz dentro.';
      if (!t) return 'Escribe la narración y elige cómo quieres que suene.';
      if (!n) return hayPantalla
        ? 'De momento el vídeo saldría con la narración rotulada. Graba tu voz, o mete la de Google compartiendo el sonido de la pestaña.'
        : 'De momento el vídeo saldría con la narración rotulada. Graba tu voz con 🎙, o activa «meter la voz de Google» (se capta por el micrófono con el altavoz alto).';
      if (n < t) return n + ' de ' + t + ' pasos con tu voz. Los que faltan salen en silencio con su rótulo.';
      return 'Los ' + t + ' pasos tienen tu voz: el vídeo se descarga con la narración dentro.';
    },
    /* Panel mínimo para las pantallas que lo montan a mano (guías 3D,
       estudios). Las pantallas de React usan sus propios controles. */
    panel: function (host) {
      if (!host) return function () { };
      var caja = document.createElement('div');
      caja.style.cssText = 'margin-top:10px;border:1px solid #2d2d4a;border-radius:10px;padding:10px;background:#13132a';
      var t = document.createElement('p');
      t.style.cssText = 'margin:0 0 8px;font-size:11px;color:#94a3b8;line-height:1.5';
      var fila = document.createElement('div');
      fila.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
      var boton = function (txt) {
        var b = document.createElement('button');
        b.textContent = txt;
        b.style.cssText = 'border-radius:8px;padding:6px 11px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #2d2d4a;background:#0f0f22;color:#94a3b8;font-family:inherit';
        fila.appendChild(b);
        return b;
      };
      var bGoogle = boton(''), bGrab = boton(''), bVivo = boton(''), bOir = boton('▶ Oír'), bQuita = boton('Quitar');
      var pinta = function () {
        t.textContent = window.B6Voz.resumen();
        var marca = function (b, on) {
          b.style.borderColor = on ? '#a855f7' : '#2d2d4a';
          b.style.color = on ? '#e2e8f0' : '#94a3b8';
        };
        bGoogle.textContent = vozB6.pestana ? '● Voz de Google dentro' : '○ Meter la voz de Google';
        marca(bGoogle, vozB6.pestana);
        bVivo.textContent = vozB6.vivo ? '● Narrar en directo' : '○ Narrar en directo';
        marca(bVivo, vozB6.vivo);
        bGrab.textContent = grabando() ? '⏹ Parar la grabación' : '🎙 Grabar mi voz';
        marca(bGrab, grabando());
        var hay = sueltoHay();
        bOir.style.display = hay ? '' : 'none';
        bQuita.style.display = hay ? '' : 'none';
      };
      bGoogle.onclick = function () { window.B6Voz.setPestana(!vozB6.pestana); };
      bVivo.onclick = function () { window.B6Voz.setVivo(!vozB6.vivo); };
      bGrab.onclick = function () { window.B6Voz.grabar().catch(function (e) { t.textContent = e.message; }); };
      bOir.onclick = function () { window.B6Voz.oir(); };
      bQuita.onclick = function () { window.B6Voz.quitar(); };
      caja.appendChild(t); caja.appendChild(fila);
      host.appendChild(caja);
      pinta();
      var off = window.B6Voz.suscribir(pinta);
      return function () { off(); try { host.removeChild(caja); } catch (e) { } };
    }
  };

  window.EU_VOZ = {
    disponible: !!SS,
    voces: voces,
    alCambiarVoces: function (fn) { oyentesVoces.push(fn); },
    ajustes: function () { return { voz: ajustes.voz, velocidad: ajustes.velocidad, tono: ajustes.tono }; },
    ponerVoz: function (id) { ajustes.voz = id; guardar(); },
    ponerVelocidad: function (v) { ajustes.velocidad = Math.max(0.6, Math.min(1.6, v)); guardar(); },
    ponerTono: function (v) { ajustes.tono = Math.max(0.6, Math.min(1.5, v)); guardar(); },
    hablar: hablar,
    narrar: narrar,
    callar: callar,
    grabar: grabar,
    pararGrabacion: parar,
    grabando: grabando,
    tieneAudio: tieneAudio,
    audioDe: audioDe,
    borrarAudio: borrarAudio
  };
})();
