/* ══════════════════════════════════════════════════════════════════
   PONLE VOZ A TU VIDEO · Bloque 6 — pestaña Vídeo & Audio
   Fátima Caldea Estudio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No modifica ni una línea del sistema existente.

   Qué hace:
     Subes un video tuyo → le pones voz (la gratuita que lee tu texto,
     la de estudio, tu propia voz narrando, o un audio que ya tengas)
     → se descarga montado y listo para WhatsApp, Instagram o YouTube.

   Cómo lo monta (todo en el dispositivo, nada sube a internet):
     · El video se dibuja fotograma a fotograma en un canvas y de ahí
       sale la pista de imagen (canvas.captureStream).
     · El sonido original del video y la voz se mezclan con Web Audio
       (dos ganancias regulables) y de ahí sale la pista de sonido.
     · MediaRecorder junta las dos pistas. Se intenta MP4 primero
       porque WhatsApp y iPhone lo reproducen mejor que WebM.

   Importante: la grabación va en tiempo real, o sea que montar un
   video de 1 minuto tarda 1 minuto. Es una limitación del navegador,
   no del código: no hay forma de acelerarlo sin un servidor.

   Qué NO toca (verificado):
     processMedia · optimizeVideo · optimizeAudio · audioBufferToWav
     flStartVideo · gastar() · Firebase · CSS · ningún ID previo
     Cobra 2 créditos por video montado, igual que los demás videos.

   IDs nuevos: prefijo "vc" — 0 colisiones.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window._B6_VIDEOCONVOZ_LOADED) return;
  window._B6_VIDEOCONVOZ_LOADED = true;

  var MAX_SEG    = 180;   // tope de duración del video de entrada
  var MAX_LADO   = 1280;  // se reescala para que el archivo no se dispare
  var COLA_VOZ   = 30;    // si la voz dura más que el video, se congela el
                          // último fotograma como mucho estos segundos
  var CREDITOS   = 2;

  var videoFile = null, videoUrl = null, videoInfo = null;
  // El contexto de audio y la fuente del <video> se crean UNA vez y no se
  // cierran: createMediaElementSource solo se puede llamar una vez por
  // elemento, y si se cerrara el contexto el vídeo se quedaría mudo para
  // siempre en la vista previa.
  var ac = null, srcVideo = null, gOrig = null;
  var audioFile = null, audioUrl = null;
  var montando = false, pararTodo = null;

  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? String(e.value || '').trim() : ''; }
  function peso(b) { return (typeof window.fmt === 'function') ? window.fmt(b) : Math.round(b / 1024) + ' KB'; }

  function estado(msg, tipo) {
    var e = $('vcSt');
    if (e) e.innerHTML = msg ? '<div class="st ' + (tipo || 'proc') + '">' + msg + '</div>' : '';
  }
  function avance(pct, txt) {
    var w = $('vcProgWrap'), b = $('vcProgBar'), t = $('vcProgTxt');
    if (w) w.style.display = (pct == null) ? 'none' : 'block';
    if (b && pct != null) b.style.width = Math.max(0, Math.min(100, pct)) + '%';
    if (t && txt) t.textContent = txt;
  }

  /* ─────────── Carga del video ─────────── */
  function soltarVideo(ev) {
    ev.preventDefault();
    var f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
    if (f) cargarVideo(f);
  }

  function cargarVideo(f) {
    if (!f) return;
    // Solo se rechaza de entrada lo que es claramente una foto. Muchos móviles
    // entregan los videos con el tipo vacío o raro (MOV, 3GP), así que el único
    // juez de verdad es el propio <video>: si no lo puede leer, ya avisa abajo.
    if (/^image\//.test(f.type || '')) {
      estado('❌ Eso es una foto, no un video. Para hacer un anuncio con fotos usa la pestaña 📣 Flyers.', 'err');
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    videoFile = f;
    videoUrl = URL.createObjectURL(f);
    videoInfo = null;

    // Se enseña el video en pantalla desde el primer momento: así se ve que
    // el archivo entró bien, y además el montaje necesita que el <video> esté
    // dentro de la página (Safari no dibuja en el canvas los que están fuera).
    var v = $('vcPrev');
    if (!v) return;
    v.style.display = 'block';
    v.src = videoUrl;
    try { v.load(); } catch (e) {}

    // Las opciones se abren YA. Antes esperaban a que el navegador leyera los
    // datos del archivo y, si eso no llegaba, no aparecía nada y parecía que
    // el sistema no hacía nada con el video.
    var op = $('vcOpts'); if (op) op.style.display = 'block';
    ficha(f, null);
    estado('');

    var contestado = false;
    v.onloadedmetadata = function () {
      contestado = true;
      videoInfo = { seg: v.duration, w: v.videoWidth, h: v.videoHeight };
      ficha(f, v);
    };
    v.onerror = function () {
      contestado = true;
      estado('❌ El navegador no pudo abrir «' + f.name + '». Suele pasar con videos de cámara antiguos: ' +
             'pásalo a MP4 o mándatelo por WhatsApp a ti misma y sube el que te llega.', 'err');
    };
    // Si el móvil no adelanta los datos hasta que se toca el play, no se
    // bloquea nada: se avisa y se deja montar igual.
    setTimeout(function () {
      if (!contestado) estado('ℹ️ Aún no sé cuánto dura el video. Dale al play un segundo, o monta directamente.', 'proc');
    }, 6000);
  }

  function ficha(f, v) {
    var info = $('vcInfo');
    if (!info) return;
    var largo = (v && isFinite(v.duration)) ? v.duration.toFixed(1) + ' s' : 'calculando…';
    var medida = (v && v.videoWidth) ? ' · ' + v.videoWidth + '×' + v.videoHeight : '';
    var aviso = (v && isFinite(v.duration) && v.duration > MAX_SEG)
      ? '<div style="color:var(--err);margin-top:3px">⚠️ Dura más de ' + (MAX_SEG / 60) +
        ' minutos. Recórtalo antes o solo se montará el principio.</div>' : '';
    info.innerHTML =
      '<div class="media-info"><div style="font-size:12px;font-weight:700;color:var(--ac2)">🎬 ' + f.name + '</div>' +
      '<div style="font-size:10px;color:var(--tx2);margin-top:3px">Duración: <strong>' + largo +
      '</strong> · Tamaño: <strong>' + peso(f.size) + '</strong>' + medida + '</div>' +
      '<div style="font-size:9px;color:var(--ok);margin-top:2px">✅ Listo para ponerle voz</div>' + aviso + '</div>';
  }

  function cargarAudio(ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioFile = f;
    audioUrl = URL.createObjectURL(f);
    estado('🎵 Audio cargado: ' + f.name, 'done');
  }

  /* ─────────── Preparar la voz según la fuente elegida ─────────── */
  async function prepararVoz(fuente) {
    if (fuente === 'ninguna') return null;

    if (fuente === 'audio') {
      if (!audioUrl) throw new Error('Sube primero el archivo de voz o música.');
      return { url: audioUrl, seg: 0 };
    }

    if (fuente === 'texto_gratis') {
      if (!window.B6_VOZ_GRATIS || !window.B6_VOZ_GRATIS.disponible())
        throw new Error('Este navegador no puede captar la voz gratuita. Prueba en Chrome.');
      var r = await window.B6_VOZ_GRATIS.capturar({
        texto: val('vcTexto'),
        vel:   parseFloat(val('vcVel')) || 1,
        aviso: function (m) { estado(m, 'proc'); }
      });
      return { url: URL.createObjectURL(r.blob), seg: r.segundos, propia: true };
    }

    if (fuente === 'texto_pro') {
      var texto = val('vcTexto');
      if (!texto) throw new Error('Escribe el texto que quieres que diga la voz.');
      estado('🗣️ Generando la voz de estudio…', 'proc');
      var clave = '';
      try { clave = localStorage.getItem('fc_key_openai') || localStorage.getItem('fc_oai_key') || ''; } catch (e) {}
      var cab = { 'Content-Type': 'application/json' };
      if (clave) cab['Authorization'] = 'Bearer ' + clave;
      var res;
      try {
        res = await fetch('/.netlify/functions/tts', {
          method: 'POST', headers: cab,
          body: JSON.stringify({ text: texto, voice: val('vcVozPro') || 'nova', speed: parseFloat(val('vcVel')) || 1 })
        });
      } catch (e) { throw new Error('No se pudo conectar con el servidor de voz. Usa la voz gratis.'); }
      if (!res.ok) {
        var msg = 'El servidor de voz no respondió bien.';
        try { var j = await res.json(); msg = j.error || msg; } catch (e) {}
        throw new Error(msg + ' · Puedes usar la voz gratis en su lugar.');
      }
      var b = await res.blob();
      return { url: URL.createObjectURL(b), seg: 0, propia: true };
    }

    return null;   // 'mic' se resuelve en vivo dentro del montaje
  }

  /* ─────────── Montaje ─────────── */
  async function montar() {
    if (montando) { if (pararTodo) pararTodo(); return; }
    if (!videoFile) { estado('📂 Sube primero tu video.', 'err'); return; }

    var fuente = val('vcFuente') || 'texto_gratis';
    var btn = $('vcBtn');
    var limpieza = [];
    var vozInfo = null, micStream = null;

    montando = true;
    if (btn) { btn.textContent = '■ Detener'; btn.classList.add('btn-warn'); }
    var soltar = function () {
      montando = false;
      pararTodo = null;
      if (btn) { btn.textContent = '🎬 Montar el video con la voz'; btn.classList.remove('btn-warn'); }
      limpieza.forEach(function (f) { try { f(); } catch (e) {} });
      limpieza = [];
    };

    try {
      // 1) La voz, antes de tocar nada del video
      if (fuente === 'mic') {
        estado('🎤 Pidiendo permiso del micrófono…', 'proc');
        try {
          // Aquí SÍ interesa la cancelación de eco: quita el sonido del
          // video del micrófono y deja la narración limpia.
          micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } });
        } catch (e) { throw new Error('Sin permiso de micrófono no se puede narrar.'); }
        limpieza.push(function () { micStream.getTracks().forEach(function (t) { t.stop(); }); });
      } else {
        vozInfo = await prepararVoz(fuente);
        if (vozInfo && vozInfo.propia) {
          var u = vozInfo.url;
          limpieza.push(function () { URL.revokeObjectURL(u); });
        }
      }

      // 2) El video, cargado y listo para dibujar
      estado('⏳ Preparando el video…', 'proc');
      var vid = $('vcPrev');
      if (!vid || !vid.src) throw new Error('Vuelve a elegir el video.');
      vid.playsInline = true;
      if (vid.readyState < 2) {
        await new Promise(function (ok) {
          vid.oncanplay = ok; vid.onerror = ok;
          try { vid.load(); } catch (e) {}
          setTimeout(ok, 8000);
        });
      }
      if (!vid.videoWidth) throw new Error('El navegador no consigue abrir ese video. Prueba con otro MP4.');

      var W = vid.videoWidth || 1280, H = vid.videoHeight || 720;
      var escala = Math.min(1, MAX_LADO / Math.max(W, H));
      W = Math.max(2, Math.round(W * escala / 2) * 2);
      H = Math.max(2, Math.round(H * escala / 2) * 2);
      var lienzo = document.createElement('canvas');
      lienzo.width = W; lienzo.height = H;
      var ctx = lienzo.getContext('2d');

      // 3) La mezcla de sonido
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      try { if (ac.state === 'suspended') await ac.resume(); } catch (e) {}
      var destino = ac.createMediaStreamDestination();

      var volOrig = (parseFloat(val('vcVolOrig')) || 0) / 100;
      var volVoz  = (parseFloat(val('vcVolVoz'))  || 0) / 100;

      // La fuente del <video> se engancha una sola vez en toda la sesión.
      if (!srcVideo) {
        srcVideo = ac.createMediaElementSource(vid);
        gOrig = ac.createGain();
        srcVideo.connect(gOrig);
        gOrig.connect(ac.destination);        // para oírlo mientras se monta
      }
      gOrig.gain.value = volOrig;
      gOrig.connect(destino);
      // Al terminar se devuelve el volumen normal y se suelta la grabación,
      // para que la vista previa siga sonando como siempre.
      limpieza.push(function () {
        try { gOrig.disconnect(destino); } catch (e) {}
        try { gOrig.gain.value = 1; } catch (e) {}
      });

      var vozEl = null;
      if (micStream) {
        var gMic = ac.createGain(); gMic.gain.value = volVoz;
        ac.createMediaStreamSource(micStream).connect(gMic);
        gMic.connect(destino);                // el micro NO se monitoriza: pitaría
      } else if (vozInfo) {
        vozEl = document.createElement('video');   // <video> también sirve de audio
        vozEl.src = vozInfo.url; vozEl.preload = 'auto';
        await new Promise(function (ok) { vozEl.oncanplay = ok; vozEl.onerror = ok; setTimeout(ok, 6000); });
        var gVoz = ac.createGain(); gVoz.gain.value = volVoz;
        var srcVoz = ac.createMediaElementSource(vozEl);
        srcVoz.connect(gVoz);
        gVoz.connect(destino);
        gVoz.connect(ac.destination);
        limpieza.push(function () {
          try { vozEl.pause(); } catch (e) {}
          try { srcVoz.disconnect(); gVoz.disconnect(); } catch (e) {}
        });
      }

      // 4) El grabador
      var flujo = new MediaStream();
      lienzo.captureStream(30).getVideoTracks().forEach(function (t) { flujo.addTrack(t); });
      destino.stream.getAudioTracks().forEach(function (t) { flujo.addTrack(t); });

      var tipo = '', ext = 'webm';
      ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4',
       'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].some(function (m) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { tipo = m; return true; }
        return false;
      });
      if (/mp4/.test(tipo)) ext = 'mp4';

      var grabador;
      try { grabador = new MediaRecorder(flujo, tipo ? { mimeType: tipo, videoBitsPerSecond: 4000000 } : undefined); }
      catch (e) { throw new Error('Este navegador no puede montar el video: ' + (e.message || e)); }

      // 5) Cobro: solo cuando ya está todo listo y va a grabar de verdad
      if (typeof window.gastar === 'function' && !window.gastar(CREDITOS)) { soltar(); estado(''); return; }

      var partes = [];
      grabador.ondataavailable = function (e) { if (e.data && e.data.size) partes.push(e.data); };
      var parado = new Promise(function (ok) { grabador.onstop = ok; });

      vid.controls = false;
      limpieza.push(function () { vid.controls = true; });

      var pedido = null;
      var detener = function () {
        if (pedido) cancelAnimationFrame(pedido);
        pedido = null;
        try { if (grabador.state !== 'inactive') grabador.stop(); } catch (e) {}
        try { vid.pause(); } catch (e) {}
        try { if (vozEl) vozEl.pause(); } catch (e) {}
      };
      pararTodo = detener;

      var esperado = Math.min(MAX_SEG, (videoInfo && isFinite(videoInfo.seg)) ? videoInfo.seg : 30);
      if (vozInfo && vozInfo.seg > esperado) esperado = Math.min(MAX_SEG + COLA_VOZ, vozInfo.seg);

      estado('🎬 Montando en tiempo real… no cierres ni cambies de pestaña.', 'proc');
      avance(0, 'Montando…');

      grabador.start();
      vid.currentTime = 0;
      try { await vid.play(); } catch (e) {}
      if (vozEl) { try { await vozEl.play(); } catch (e) {} }

      var t0 = performance.now();
      await new Promise(function (ok) {
        (function pintar() {
          var el = (performance.now() - t0) / 1000;
          // Si el video acaba antes que la voz, se congela el último fotograma.
          try { ctx.drawImage(vid, 0, 0, W, H); } catch (e) {}
          avance(Math.min(99, el / esperado * 100), 'Montando… ' + Math.round(Math.min(99, el / esperado * 100)) + '%');

          var vozViva = vozEl ? !vozEl.ended : (fuente === 'mic');
          var finVideo = vid.ended || el >= MAX_SEG;
          var pasada = el >= MAX_SEG + COLA_VOZ;

          if (pasada || (finVideo && !vozViva)) { ok(); return; }
          pedido = requestAnimationFrame(pintar);
        })();
      });

      detener();
      await parado;

      var blob = new Blob(partes, { type: tipo || 'video/webm' });
      var fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      var nombre = 'video_con_voz_' + fecha + '.' + ext;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 6000);

      avance(100, '✅ Terminado');
      setTimeout(function () { avance(null); }, 2500);
      estado('✅ Video descargado: <strong>' + nombre + '</strong> (' + peso(blob.size) + ')' +
             (ext === 'mp4'
               ? ' · MP4: se envía bien por WhatsApp, Instagram y YouTube.'
               : ' · Salió en WebM: va bien en Android y YouTube; en iPhone puede que no se vea en WhatsApp.'), 'done');
    } catch (e) {
      avance(null);
      estado('❌ ' + (e.message || e), 'err');
    } finally {
      soltar();
    }
  }

  /* ─────────── Panel ─────────── */
  function cambioFuente() {
    var f = val('vcFuente');
    var texto = (f === 'texto_gratis' || f === 'texto_pro');
    var fila = function (id, ver) { var e = $(id); if (e) e.style.display = ver ? 'flex' : 'none'; };
    fila('vcFilaTexto', texto);
    fila('vcFilaVel',   texto);
    fila('vcFilaPro',   f === 'texto_pro');
    fila('vcFilaAudio', f === 'audio');
    fila('vcFilaVolVoz', f !== 'ninguna');

    var pista = $('vcPista');
    if (pista) {
      var m = {
        texto_gratis: '👉 Se capta con el micrófono: usa el <strong>altavoz</strong> (no auriculares) y un sitio en silencio. Sin clave y sin coste.',
        texto_pro:    '👉 Suena a estudio, pero necesita la clave de OpenAI o la variable del servidor. Si falla, usa la voz gratis.',
        mic:          '👉 Narras tú mientras se monta el video. <strong>Usa auriculares</strong> para que no se cuele el sonido del video.',
        audio:        '👉 Se usa el archivo de voz o música que subas.',
        ninguna:      '👉 Sin voz: solo se cambia el volumen del sonido original.'
      };
      pista.innerHTML = m[f] || '';
    }
  }

  function construir() {
    var tab = $('tab-media');
    if (!tab || $('vcBox')) return false;

    var caja = document.createElement('div');
    caja.id = 'vcBox';
    caja.style.cssText = 'max-width:680px;margin:0 auto 14px';
    caja.innerHTML =
      '<div class="panel">' +
      '<div class="p-title">🎙️ Ponle voz a tu video</div>' +
      '<div style="background:rgba(6,182,212,.06);border:1px solid rgba(6,182,212,.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:10px;color:var(--ac3)">' +
        'Sube tu video, ponle una voz que lea tu texto y descárgalo montado, listo para <strong>WhatsApp, Instagram o YouTube</strong>.<br>' +
        '🔒 Todo se monta en tu dispositivo · ⏱️ tarda lo mismo que dura el video</div>' +

      '<div class="dz" id="vcDz">' +
        '<div style="font-size:28px;margin-bottom:4px">🎬</div>' +
        '<div style="font-size:12px;font-weight:600;margin-bottom:3px">Arrastra tu video o haz clic</div>' +
        '<div style="font-size:9px;color:var(--tx2)">MP4 · MOV · WEBM · hasta ' + (MAX_SEG / 60) + ' minutos</div>' +
      '</div>' +
      '<input type="file" id="vcVideo" accept="video/*,.mp4,.mov,.m4v,.webm,.mkv,.avi,.3gp" ' +
        'style="display:none">' +
      '<video id="vcPrev" controls playsinline preload="metadata" style="display:none;width:100%;' +
        'max-height:40vh;margin-top:8px;border-radius:10px;background:#000"></video>' +
      '<div id="vcInfo"></div>' +

      '<div id="vcOpts" style="display:none">' +
        '<div class="sep"></div>' +
        '<div class="row"><span class="lbl">Voz</span>' +
          '<select id="vcFuente">' +
            '<option value="texto_gratis">🗣️ Voz gratis que lee mi texto</option>' +
            '<option value="mic">🎤 Narrar yo con el micrófono</option>' +
            '<option value="audio">🎵 Subir una voz o música</option>' +
            '<option value="texto_pro">✨ Voz de estudio (pro)</option>' +
            '<option value="ninguna">🔇 Sin voz</option>' +
          '</select>' +
        '</div>' +
        '<div id="vcPista" style="font-size:9px;color:var(--tx2);line-height:1.5;margin:-2px 0 7px"></div>' +

        '<div class="row" id="vcFilaTexto" style="align-items:flex-start"><span class="lbl">Texto</span>' +
          '<textarea id="vcTexto" rows="3" placeholder="Lo que quieres que diga la voz sobre tu video…" ' +
            'style="flex:1;background:var(--bg3);border:1px solid var(--bd);color:var(--tx);border-radius:5px;' +
            'padding:6px 8px;font-size:11px;font-family:inherit;resize:vertical"></textarea></div>' +

        '<div class="row" id="vcFilaVel"><span class="lbl">Velocidad</span>' +
          '<input type="range" id="vcVel" min="0.6" max="1.4" step="0.05" value="1">' +
          '<span class="val" id="vcVelV">1.00×</span></div>' +

        '<div class="row" id="vcFilaPro" style="display:none"><span class="lbl">Voz pro</span>' +
          '<select id="vcVozPro">' +
            '<option value="nova">🌟 Nova (femenina cálida)</option>' +
            '<option value="shimmer">✨ Shimmer (femenina suave)</option>' +
            '<option value="alloy">🔵 Alloy (neutral)</option>' +
            '<option value="echo">🎤 Echo (masculina)</option>' +
            '<option value="fable">📖 Fable (expresiva)</option>' +
            '<option value="onyx">⬛ Onyx (masculina grave)</option>' +
          '</select></div>' +

        '<div class="row" id="vcFilaAudio" style="display:none"><span class="lbl">Archivo voz</span>' +
          '<input type="file" id="vcAudio" accept="audio/*" style="flex:1;background:var(--bg3);' +
          'border:1px solid var(--bd);border-radius:5px;padding:4px;color:var(--tx);font-size:10px"></div>' +

        '<div class="row" id="vcFilaVolVoz"><span class="lbl">Volumen voz</span>' +
          '<input type="range" id="vcVolVoz" min="0" max="100" value="100">' +
          '<span class="val" id="vcVolVozV">100%</span></div>' +

        '<div class="row"><span class="lbl">Sonido original</span>' +
          '<input type="range" id="vcVolOrig" min="0" max="100" value="25">' +
          '<span class="val" id="vcVolOrigV">25%</span></div>' +
        '<div style="font-size:9px;color:var(--tx2);margin:-3px 0 8px">Baja el sonido original para que se entienda bien la voz. A 0% se queda mudo.</div>' +

        '<div class="row"><button class="btn" id="vcBtn" type="button">🎬 Montar el video con la voz</button></div>' +
        '<div id="vcProgWrap" style="display:none"><div class="prog-wrap"><div class="prog-bar" id="vcProgBar"></div></div>' +
          '<div style="font-size:9px;color:var(--tx2);margin-top:3px" id="vcProgTxt">Montando…</div></div>' +
        '<div id="vcSt"></div>' +
        '<div style="font-size:9px;color:var(--tx2);text-align:center;margin-top:4px">El video montado cuesta ' +
          CREDITOS + ' créditos · se descarga en MP4 cuando el navegador lo permite</div>' +
      '</div></div>';

    // Va el primero de la pestaña: es la herramienta que más se busca.
    tab.insertBefore(caja, tab.firstChild);

    $('vcDz').addEventListener('click', function () { $('vcVideo').click(); });
    $('vcDz').addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('drag'); });
    $('vcDz').addEventListener('dragleave', function () { this.classList.remove('drag'); });
    $('vcDz').addEventListener('drop', function (e) { this.classList.remove('drag'); soltarVideo(e); });
    $('vcVideo').addEventListener('change', function (e) { cargarVideo(e.target.files && e.target.files[0]); });
    $('vcAudio').addEventListener('change', cargarAudio);
    $('vcFuente').addEventListener('change', cambioFuente);
    $('vcBtn').addEventListener('click', montar);

    var eco = function (id, salida, sufijo) {
      var e = $(id), s = $(salida);
      if (!e || !s) return;
      e.addEventListener('input', function () {
        s.textContent = (sufijo === '×') ? parseFloat(e.value).toFixed(2) + '×' : e.value + '%';
      });
    };
    eco('vcVel', 'vcVelV', '×');
    eco('vcVolVoz', 'vcVolVozV', '%');
    eco('vcVolOrig', 'vcVolOrigV', '%');

    cambioFuente();

    // Aviso temprano: más vale decirlo antes de que suba el video.
    var puede = (typeof MediaRecorder !== 'undefined') &&
                !!document.createElement('canvas').captureStream;
    if (!puede) {
      estado('⚠️ Este navegador no puede montar videos. Ábrelo en Chrome (Android o PC).', 'err');
    }
    return true;
  }

  /* ¿Es un video? Por el tipo, y si el móvil no lo dice, por la extensión. */
  function esVideo(f) {
    if (!f) return false;
    if (/^video\//.test(f.type || '')) return true;
    if (/^image\//.test(f.type || '')) return false;
    return /\.(mp4|mov|m4v|webm|mkv|avi|3gp|mpg|mpeg)$/i.test(f.name || '');
  }

  /* Lleva el archivo a esta herramienta y deja la pestaña puesta. */
  function traerAqui(f, motivo) {
    var boton = document.querySelector('.main-tab[onclick*="media"]');
    if (boton) {
      if (typeof window.switchMain === 'function') window.switchMain('media', boton);
      else boton.click();
    }
    setTimeout(function () {
      construir();
      cargarVideo(f);
      var caja = $('vcBox');
      if (caja) caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (motivo) estado(motivo, 'done');
    }, 150);
  }

  /* Los huecos de foto del flyer solo admiten imágenes, y ahí es donde la
     gente intenta subir su video. En vez de no hacer nada, se detecta y se
     trae a esta herramienta con el archivo ya cargado.
     El escuchador va en captura y sobre el documento a propósito: así corre
     ANTES del onchange que el flyer tiene puesto en la propia etiqueta. */
  function vigilarFlyer() {
    document.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || (t.id !== 'flFoto1' && t.id !== 'flFoto2')) return;
      var f = t.files && t.files[0];
      if (!esVideo(f)) return;
      e.stopPropagation();
      try { t.value = ''; } catch (err) {}
      traerAqui(f, '👉 Eso es un video, no una foto. Te lo he traído aquí, que es donde se le pone la voz.');
    }, true);
  }

  /* Y un aviso a la vista, en el propio flyer, para quien no lo intente. */
  function pistaEnFlyer() {
    var fila = document.getElementById('flFoto1');
    fila = fila && fila.closest ? fila.closest('.row') : null;
    if (!fila || document.getElementById('vcPista2')) return false;
    var p = document.createElement('div');
    p.id = 'vcPista2';
    p.style.cssText = 'font-size:9px;color:var(--tx2);margin:-3px 0 7px';
    p.innerHTML = '🎬 ¿Tienes un <strong>video</strong> en vez de una foto? ' +
      '<span id="vcIrDesdeFlyer" style="color:var(--ac3);text-decoration:underline;cursor:pointer">' +
      'Ponle voz a tu video →</span>';
    fila.parentNode.insertBefore(p, fila.nextSibling);
    document.getElementById('vcIrDesdeFlyer').addEventListener('click', function () {
      var boton = document.querySelector('.main-tab[onclick*="media"]');
      if (boton) {
        if (typeof window.switchMain === 'function') window.switchMain('media', boton);
        else boton.click();
      }
      setTimeout(function () {
        var caja = $('vcBox');
        if (caja) caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
    return true;
  }

  function arrancar() {
    vigilarFlyer();
    pistaEnFlyer();
    if (construir()) return;
    var n = 0;
    var t = setInterval(function () { pistaEnFlyer(); if (construir() || ++n > 25) clearInterval(t); }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 0);

  window.addEventListener('pagehide', function () { if (pararTodo) pararTodo(); });
})();
