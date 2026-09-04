/* ═══════════════════════════════════════════════════════════════════════════
   FOLLETOS PRO · pestaña nueva del Bloque 6
   ───────────────────────────────────────────────────────────────────────────
   Folletos con cuadrícula de 2, 4, 6 u 8 cuadros. En cada cuadro se pone una
   FOTO o un VÍDEO, y se escribe a mano el servicio, la descripción, el precio
   y la etiqueta — o los escribe solo el cerebro y luego se retocan.

   Se descarga en cuatro formas: imagen, PDF, vídeo con voz y folleto web que
   se pasa con el dedo.

   · Parche aditivo: se cuelga de #tab-folleto y no toca nada de lo que ya
     funciona (ni flStartVideo, ni gastar, ni Firebase, ni el CSS).
   · No cuesta créditos. Es una decisión de la dueña; el resto del bloque sí
     cobra, esta herramienta no.
   · El dibujo lo hace b6_folleto_motor.js y los textos b6_folleto_cerebro.js.
   · Todo se monta en el móvil: ninguna foto ni ningún vídeo sube a internet.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_PRO_LOADED) return;
  window._B6_FOLLETO_PRO_LOADED = true;

  var MAX_VIDEOS = 4;          // por memoria del móvil
  var MAX_SEG_VIDEO = 60;      // segundos de cada vídeo subido
  var TOPE_WEB = 45 * 1024 * 1024;  // lo que se puede incrustar en el folleto web

  /* ── Ritmo del vídeo (sincronía voz ↔ tarjetas) ──
     La NARRACIÓN manda: el vídeo dura lo que dure la voz entera. Estas
     constantes garantizan que la voz nunca se corte y que cada tarjeta se
     quede el tiempo suficiente para leerse/oírse con calma. */
  var MIN_POR_TARJETA = 3.6;   // segundos mínimos que cada tarjeta permanece visible
  var COLA_FIN        = 1.2;   // aire tras la última palabra (la última tarjeta respira)
  var TOPE_SEG_VIDEO  = 180;   // tope de seguridad, amplio: una narración larga cabe entera

  var M = null, CB = null;     // motor y cerebro, se resuelven al arrancar
  var DIS = null;              // cerebro de diseño (FOLLETO_DISENOS), opcional
  var MEL = null, NOTE = null; // música gratis (FL_MELODIES / FL_NOTE), opcional
  var listo = false;

  /* Notas de reserva, por si el bloque de Flyers no estuviera cargado (por
     ejemplo abriendo el archivo suelto). Así la música nunca rompe nada. */
  var NOTE_FALLBACK = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  /* Nombres bonitos para las melodías que ya trae Flyers (FL_MELODIES). */
  var NOMBRES_MEL = {
    mel_energia: '⚡ Enérgica', mel_elegante: '🎩 Elegante', mel_alegre: '😊 Alegre',
    mel_epico: '🎬 Épica', mel_lofi: '🎧 Lo-fi (relax)', mel_corporativo: '💼 Corporativa',
    mel_romantico: '💕 Romántica', mel_dramatico: '🎭 Dramática',
    mel_tropical: '🌴 Tropical', mel_reggaeton: '🔥 Reggaetón', mel_flamenco: '💃 Flamenco',
    mel_bossa: '🌺 Bossa Nova', mel_jazz: '🎷 Jazz', mel_techno: '🤖 Techno',
    mel_vals: '🩰 Vals', mel_cumbia: '🥁 Cumbia'
  };
  function nombreMel(id) {
    return NOMBRES_MEL[id] || id.replace(/^mel_/, '').replace(/^\w/, function (c) { return c.toUpperCase(); });
  }

  var FP = {
    pagina: null,
    paginas: [],
    idx: 0,
    semilla: Math.floor(Math.random() * 1e9),
    coloresManuales: null,
    grabando: false,
    pararGrabacion: null,
    qr: null          // { el:Image, contenido:'...' } cuando se activa el QR
  };

  /* Mete el QR (si lo hay) en las opciones de dibujo. Todos los dibujos pasan
     por aquí, así el QR sale en la vista previa, el JPG, el PDF, el web y el vídeo. */
  function conQR(op) {
    op = op || {};
    if (FP.qr && FP.qr.el) op.qr = FP.qr.el;
    return op;
  }

  /* ═══════════════════ Código QR ═══════════════════
     Lo que escriba la persona se convierte en algo que el móvil sepa abrir:
     un número suelto pasa a ser un enlace de WhatsApp; un link se respeta tal
     cual. Usa la librería QRCode que el bloque ya carga. */
  function contenidoQR(txt) {
    var t = String(txt || '').trim();
    if (!t) return '';
    if (/^(https?:|mailto:|tel:|whatsapp:)/i.test(t)) return t;
    if (/^www\./i.test(t)) return 'https://' + t;
    var soloNum = t.replace(/[^\d+]/g, '');
    if (soloNum.replace(/\D/g, '').length >= 8) return 'https://wa.me/' + soloNum.replace(/\D/g, '');
    return t;
  }

  /* Genera el QR como <img>. La librería pinta dentro de un div oculto; de ahí
     se saca la imagen y se guarda en FP.qr para que el motor la dibuje. */
  function generarQR() {
    var activo = $('fpQR') && $('fpQR').checked;
    var contenido = contenidoQR(val('fpTel'));
    if (!activo || !contenido) { FP.qr = null; repintar(); return; }
    if (FP.qr && FP.qr.contenido === contenido) { repintar(); return; }
    if (typeof QRCode === 'undefined') {
      estado('No se pudo cargar el generador de códigos QR. Comprueba la conexión y recarga.', 'err');
      FP.qr = null; repintar(); return;
    }
    var caja = $('fpOculto');
    var div = document.createElement('div');
    caja.appendChild(div);
    try {
      new QRCode(div, {
        text: contenido, width: 480, height: 480,
        colorDark: '#000000', colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      caja.removeChild(div);
      estado('No se pudo crear el QR: ' + (e.message || e), 'err');
      FP.qr = null; repintar(); return;
    }
    // la librería tarda un instante y devuelve <canvas> o <img> según el navegador
    setTimeout(function () {
      var cv = div.querySelector('canvas'), im = div.querySelector('img');
      var fuente = null;
      try { fuente = cv ? cv.toDataURL('image/png') : (im ? im.src : null); } catch (e) { fuente = im ? im.src : null; }
      caja.removeChild(div);
      if (!fuente) { FP.qr = null; repintar(); return; }
      var img = new Image();
      img.onload = function () { repintar(); };
      img.src = fuente;
      FP.qr = { el: img, contenido: contenido };
      repintar();
    }, 260);
  }

  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value : ''; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function estado(msg, clase) {
    var e = $('fpSt');
    if (e) e.innerHTML = msg ? '<div class="st ' + (clase || 'proc') + '">' + msg + '</div>' : '';
  }

  /* ═══════════════════ Estado del folleto ═══════════════════ */

  function nCuadros() {
    var r = M.REJILLAS[val('fpRejilla')] || M.REJILLAS.r4a;
    return r.n;
  }

  function paginaVacia(n) {
    var celdas = [];
    for (var i = 0; i < n; i++) celdas.push({ titulo: '', texto: '', precio: '', etiqueta: '', media: null });
    return {
      rejilla: 'r4a', formato: 'a4v', tema: 'oro_negro',
      cabecera: { marca: 'Fátima Hair Studio', titulo: 'Carta de Servicios', subtitulo: '' },
      pie: { cta: 'Pide tu cita', contacto: '' },
      celdas: celdas, rubro: 'peluqueria', tono: 'cercano', guion: '',
      adornos: { grano: true, vineta: true, filetes: true, sombras: true }
    };
  }

  /* Copia para guardar como página del folleto. La foto y el vídeo se guardan
     por referencia: son el mismo archivo, no hace falta duplicarlo en memoria. */
  function copiar(p) {
    return {
      rejilla: p.rejilla, formato: p.formato, tema: p.tema,
      colores: p.colores ? JSON.parse(JSON.stringify(p.colores)) : null,
      cabecera: { marca: p.cabecera.marca, titulo: p.cabecera.titulo, subtitulo: p.cabecera.subtitulo },
      pie: { cta: p.pie.cta, contacto: p.pie.contacto },
      celdas: p.celdas.map(function (c) {
        return { titulo: c.titulo, texto: c.texto, precio: c.precio, etiqueta: c.etiqueta, media: c.media };
      }),
      rubro: p.rubro, tono: p.tono, guion: p.guion,
      adornos: { grano: p.adornos.grano, vineta: p.adornos.vineta, filetes: p.adornos.filetes, sombras: p.adornos.sombras }
    };
  }

  /* ═══════════════════ El panel ═══════════════════ */

  function opciones(obj, texto) {
    return Object.keys(obj).map(function (k) {
      return '<option value="' + k + '">' + esc(texto(k, obj[k])) + '</option>';
    }).join('');
  }

  /* Desplegable del cerebro de diseño, agrupado por uso. Si el archivo no está
     cargado, esta fila no aparece y todo lo demás funciona igual. */
  function selectDisenos() {
    if (!DIS) return '';
    var lista = DIS.lista();
    var ops = DIS.grupos().map(function (g) {
      var items = lista.filter(function (d) { return d.cat === g; }).map(function (d) {
        return '<option value="' + d.id + '">' + esc(d.nombre) + '</option>';
      }).join('');
      return '<optgroup label="' + esc(g) + '">' + items + '</optgroup>';
    }).join('');
    return '<div class="row">' +
        '<span class="lbl">🎨 Estilo</span>' +
        '<select id="fpDiseno" style="flex:1;min-width:150px">' +
          '<option value="">— elige un diseño profesional —</option>' + ops +
        '</select>' +
      '</div>' +
      '<div class="row" id="fpDisenoDesc" style="font-size:9px;color:var(--tx2);margin-top:-2px"></div>';
  }

  /* En el móvil los botones del bloque miden 25px de alto: con el dedo se falla.
     Aquí se agrandan SÓLO en pantallas táctiles y SÓLO dentro de esta pestaña,
     así el resto del bloque y la vista de ordenador se quedan como estaban.
     Es un <style> añadido, no se toca ninguna regla del CSS de la página. */
  function estilosTactiles() {
    if ($('fpEstiloTactil')) return;
    var s = document.createElement('style');
    s.id = 'fpEstiloTactil';
    s.textContent =
      '@media (pointer: coarse){' +
        '#tab-folleto .btn{min-height:38px;padding-top:9px;padding-bottom:9px}' +
        '#tab-folleto select,#tab-folleto input[type=text],#tab-folleto input[type=number]{min-height:38px}' +
        '#tab-folleto input[type=checkbox]{width:20px;height:20px}' +
        '#tab-folleto input[type=color]{min-height:34px}' +
        '#tab-folleto label{padding:3px 0}' +
      '}';
    document.head.appendChild(s);
  }

  function construir() {
    var caja = $('tab-folleto');
    if (!caja) return false;
    estilosTactiles();

    caja.innerHTML =
    '<div class="panel">' +
      '<div class="p-title">📰 Folletos Pro · tu carta en una hoja, con diseño profesional</div>' +
      '<div style="font-size:10px;color:var(--tx2);margin-bottom:6px">' +
        'Elige un <b>estilo de diseño</b>, pon tus fotos o tus vídeos en cada hueco y escribe tus precios. ' +
        'Todo se monta en tu móvil y <b>no gasta créditos</b>.' +
      '</div>' +

      selectDisenos() +

      '<div class="row">' +
        '<span class="lbl">Cuadrícula</span>' +
        '<select id="fpRejilla">' + opciones(M.REJILLAS, function (k, r) { return r.nombre + ' · ' + r.n + ' cuadros'; }) + '</select>' +
        '<span class="lbl">Hoja</span>' +
        '<select id="fpFormato">' + opciones(M.FORMATOS, function (k, f) { return f.nombre; }) + '</select>' +
      '</div>' +

      '<div class="row">' +
        '<span class="lbl">Colores</span>' +
        '<select id="fpTema">' + opciones(M.TEMAS, function (k, t) { return t.nombre + (t.claro ? ' (clara)' : ''); }) + '</select>' +
        '<button class="btn btn-g" id="fpDado" style="font-size:10px;padding:3px 9px">🎲 Sorpresa</button>' +
        '<button class="btn btn-g" id="fpVolverTema" style="font-size:10px;padding:3px 9px">↩ Volver</button>' +
      '</div>' +
      '<div class="row" id="fpColoresRow">' +
        '<span class="lbl">A mano</span>' +
        ['fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2'].map(function (k) {
          return '<label style="font-size:9px;color:var(--tx2)">' + k +
                 ' <input type="color" id="fpC_' + k + '" style="width:30px;height:24px;padding:0;border:1px solid var(--bd);border-radius:4px;background:var(--bg3)"></label>';
        }).join('') +
      '</div>' +

      '<div class="sep"></div>' +

      '<div class="row">' +
        '<span class="lbl">Tu negocio</span>' +
        '<select id="fpRubro">' + CB.rubros().map(function (r) { return '<option value="' + r.id + '">' + esc(r.nombre) + '</option>'; }).join('') + '</select>' +
        '<span class="lbl">Tono</span>' +
        '<select id="fpTono">' + CB.tonos().map(function (t) { return '<option value="' + t.id + '">' + esc(t.nombre) + '</option>'; }).join('') + '</select>' +
      '</div>' +
      '<div class="row">' +
        '<button class="btn" id="fpEscribir">📝 Escríbelo tú por mí</button>' +
        '<button class="btn btn-g" id="fpOtra">🔁 Otra versión</button>' +
        '<span style="font-size:9px;color:var(--tx2)">Luego puedes cambiar cada palabra y cada precio a mano.</span>' +
      '</div>' +

      '<div class="sep"></div>' +

      '<div class="row"><span class="lbl">Marca</span><input type="text" id="fpMarca" style="flex:1;min-width:120px"></div>' +
      '<div class="row"><span class="lbl">Título</span><input type="text" id="fpTitulo" style="flex:1;min-width:120px"></div>' +
      '<div class="row"><span class="lbl">Subtítulo</span><input type="text" id="fpSub" style="flex:1;min-width:120px"></div>' +
      '<div class="row">' +
        '<span class="lbl">Contacto</span><input type="text" id="fpContacto" placeholder="📱 600 00 00 00 · @tuinstagram" style="flex:1;min-width:120px">' +
        '<span class="lbl">Botón</span><input type="text" id="fpCta" style="width:130px">' +
      '</div>' +
      '<div class="row">' +
        '<span class="lbl">📲 WhatsApp</span>' +
        '<input type="text" id="fpTel" placeholder="34600000000 · o pega un link" style="flex:1;min-width:120px">' +
        '<label style="font-size:10px;color:var(--tx2)"><input type="checkbox" id="fpQR"> mostrar QR</label>' +
      '</div>' +
      '<div class="row" style="margin-top:-2px"><span style="font-size:9px;color:var(--tx2)">' +
        'El QR se dibuja en el folleto: al escanearlo abre tu WhatsApp (o el link que pongas).' +
      '</span></div>' +
    '</div>' +

    /* ── Los cuadros ── */
    '<div class="panel">' +
      '<div class="p-title">🖼️ Tus cuadros · una foto o un vídeo en cada hueco</div>' +
      '<div id="fpCeldas"></div>' +
      '<div style="font-size:9px;color:var(--tx2);margin-top:5px">' +
        'Se admiten fotos (JPG, PNG) y vídeos (MP4, MOV, WEBM). Máximo ' + MAX_VIDEOS +
        ' vídeos por folleto y ' + MAX_SEG_VIDEO + ' segundos cada uno, para que no se atragante el móvil.' +
      '</div>' +
    '</div>' +

    /* ── Vista previa ── */
    '<div class="panel">' +
      '<div class="p-title">👁️ Cómo va quedando</div>' +
      '<div style="text-align:center"><canvas id="fpLienzo" style="max-width:100%;width:340px;height:auto;border-radius:10px;border:1px solid var(--bd);background:#000"></canvas></div>' +
      '<div class="row" style="justify-content:center;margin-top:6px">' +
        '<label style="font-size:10px"><input type="checkbox" id="fpAGrano" checked> grano</label>' +
        '<label style="font-size:10px"><input type="checkbox" id="fpAVineta" checked> viñeta</label>' +
        '<label style="font-size:10px"><input type="checkbox" id="fpAFiletes" checked> filetes</label>' +
        '<label style="font-size:10px"><input type="checkbox" id="fpASombras" checked> sombras</label>' +
      '</div>' +
      '<div class="row" style="justify-content:center">' +
        '<button class="btn btn-g" id="fpAddPag">📚 Guardar como página</button>' +
        '<span id="fpPags" style="font-size:10px;color:var(--tx2)"></span>' +
      '</div>' +
    '</div>' +

    /* ── Mis diseños (se quedan en el dispositivo) ── */
    '<div class="panel">' +
      '<div class="p-title">📚 Mis diseños · guárdalo y sigue cuando quieras</div>' +
      '<div class="row">' +
        '<input type="text" id="fpDisNombre" placeholder="Ponle un nombre" style="flex:1;min-width:120px">' +
        '<button class="btn btn-ok" id="fpDisGuardar">💾 Guardar este</button>' +
      '</div>' +
      '<div id="fpDisLista" style="margin-top:6px"></div>' +
      '<div style="font-size:9px;color:var(--tx2);margin-top:5px">' +
        'Se guarda en <b>este móvil</b> (textos, colores y fotos). Los vídeos, por su tamaño, se vuelven a poner al abrir.' +
      '</div>' +
    '</div>' +

    /* ── Carrusel para redes ── */
    '<div class="panel">' +
      '<div class="p-title">🎠 Carrusel para redes · Instagram, Facebook, TikTok, Telegram</div>' +
      '<div style="font-size:10px;color:var(--tx2);margin-bottom:6px">' +
        'Convierte tu folleto en una <b>secuencia de tarjetas</b> que se pasan con el dedo. ' +
        'Salen numeradas, listas para subirlas en orden.' +
      '</div>' +
      '<div class="row">' +
        '<span class="lbl">Formato</span>' +
        '<select id="fpCarFormato">' +
          '<option value="cuadrado">Cuadrado 1:1 · Instagram y Facebook</option>' +
          '<option value="vertical" selected>Vertical 4:5 · el que más se ve</option>' +
          '<option value="historia">Vertical 9:16 · TikTok e historias</option>' +
        '</select>' +
      '</div>' +
      '<div class="row">' +
        '<label style="font-size:10px"><input type="checkbox" id="fpCarUno" checked> una tarjeta por servicio</label>' +
        '<label style="font-size:10px"><input type="checkbox" id="fpCarPortada" checked> con portada</label>' +
      '</div>' +
      '<div class="row">' +
        '<button class="btn btn-ok" id="fpCarImg">🎠 Descargar el carrusel</button>' +
        '<button class="btn btn-g" id="fpVerCarrusel">▶ Ver</button>' +
        '<button class="btn" id="fpCarVid">🎬 Descargar vídeo 3D</button>' +
        '<span id="fpCarInfo" style="font-size:9px;color:var(--tx2)"></span>' +
      '</div>' +
      '<div class="row" style="margin-top:-2px"><span style="font-size:9px;color:var(--tx2)">' +
        'El vídeo 3D se descarga con la voz y la música puestas, igual que el vídeo normal. ' +
        'El efecto (cubo, zoom, iris, olas…) se elige abajo, en <b>✨ Efecto del vídeo</b>: es el mismo para el vídeo normal y para el carrusel.' +
      '</span></div>' +
    '</div>' +

    /* ── Descargas ── */
    '<div class="panel">' +
      '<div class="p-title">⬇️ Llévatelo</div>' +
      '<div class="row">' +
        '<button class="btn btn-ok" id="fpPNG">🖼️ Imagen</button>' +
        '<button class="btn btn-ok" id="fpPDF">📄 PDF</button>' +
        '<button class="btn btn-ok" id="fpWeb">🌐 Folleto web</button>' +
      '</div>' +
      '<div class="sep"></div>' +
      '<div class="row">' +
        '<span class="lbl">Voz del vídeo</span>' +
        '<select id="fpVoz">' +
          '<option value="texto_gratis">🗣️ Voz gratis que lee mi folleto</option>' +
          '<option value="mic">🎤 Narro yo con el micrófono</option>' +
          '<option value="audio">🎵 Subir música o voz</option>' +
          '<option value="texto_pro">✨ Voz de estudio (pro · necesita clave)</option>' +
          '<option value="ninguna">🔇 Sin sonido</option>' +
        '</select>' +
      '</div>' +

      /* Player de voces gratis: elige la voz del navegador (las 🟢 de Google
         suelen ser las mejores), la velocidad y el tono, y pruébala al momento. */
      '<div id="fpVozGratisPanel" style="display:none;margin:6px 0;padding:10px 12px;border:1px solid var(--bd);border-radius:10px;background:var(--bg3)">' +
        '<div style="font-size:10px;color:var(--ac2);font-weight:700;margin-bottom:7px">🗣️ Elige tu voz gratis</div>' +
        '<div class="row" style="margin:0 0 6px">' +
          '<select id="fpVozSel" style="flex:1;min-width:150px"><option value="">Cargando voces…</option></select>' +
          '<button class="btn btn-g" id="fpVozProbar" style="font-size:10px;padding:4px 10px">▶ Probar</button>' +
        '</div>' +
        '<div class="row" style="margin:0 0 4px;align-items:center">' +
          '<span class="lbl" style="min-width:62px">Velocidad</span>' +
          '<input type="range" id="fpVozVel" min="0.7" max="1.3" step="0.05" value="1" style="flex:1">' +
          '<span id="fpVozVelN" style="font-size:9px;color:var(--tx2);width:34px;text-align:right">1.0×</span>' +
        '</div>' +
        '<div class="row" style="margin:0;align-items:center">' +
          '<span class="lbl" style="min-width:62px">Tono</span>' +
          '<input type="range" id="fpVozTono" min="0.6" max="1.4" step="0.05" value="1" style="flex:1">' +
          '<span id="fpVozTonoN" style="font-size:9px;color:var(--tx2);width:34px;text-align:right">1.0</span>' +
        '</div>' +
        '<div id="fpVozAviso" style="font-size:9px;color:var(--tx2);margin-top:6px"></div>' +
      '</div>' +
      '<div class="row" id="fpAudioRow" style="display:none">' +
        '<span class="lbl">Archivo</span>' +
        '<input type="file" id="fpAudio" accept="audio/*" style="flex:1;background:var(--bg3);border:1px solid var(--bd);border-radius:5px;padding:4px;color:var(--tx);font-size:10px">' +
      '</div>' +
      '<div class="row" id="fpMusicaRow">' +
        '<span class="lbl">🎵 Música</span>' +
        '<select id="fpMusica" style="flex:1;min-width:150px"><option value="none">🔇 Sin música de fondo</option></select>' +
        '<button class="btn btn-g" id="fpMusPrev" style="font-size:10px;padding:3px 9px">▶ Escuchar</button>' +
      '</div>' +
      '<div class="row" style="margin-top:-2px"><span style="font-size:9px;color:var(--tx2)">' +
        'Melodías gratis sin derechos de autor. Suenan por debajo de la voz.' +
      '</span></div>' +
      '<div class="row" id="fpGuionRow">' +
        '<span class="lbl">Lo que dirá</span>' +
        '<textarea id="fpGuion" rows="3" style="flex:1;min-width:160px;background:var(--bg3);border:1px solid var(--bd);color:var(--tx);border-radius:6px;padding:5px;font-size:11px"></textarea>' +
      '</div>' +
      '<div class="row">' +
        '<span class="lbl">✨ Efecto del vídeo</span>' +
        '<select id="fpEfecto" style="flex:1;min-width:160px">' +
          '<optgroup label="— Cómo aparece cada tarjeta —">' +
            '<option value="uno_a_uno" selected>Cuadros de uno en uno</option>' +
            '<option value="fundido">🎞️ Fundido</option>' +
            '<option value="olas">🌊 Olas</option>' +
            '<option value="circulos">⭕ Círculos</option>' +
            '<option value="cuadros">🔲 Mosaico</option>' +
            '<option value="deslizar">➡️ Deslizar (cascada)</option>' +
            '<option value="persiana">🎚️ Persiana</option>' +
            '<option value="aterriza">🎯 Aterrizar (suave)</option>' +
            '<option value="caida">⬇️ Caída</option>' +
            '<option value="rebote">🪀 Rebote</option>' +
          '</optgroup>' +
          '<optgroup label="— Cómo pasa de una tarjeta a otra (carrusel) —">' +
            '<option value="t_cubo">🧊 Cubo 3D</option>' +
            '<option value="t_zoom">💥 Zoom punch</option>' +
            '<option value="t_iris">⭕ Iris</option>' +
            '<option value="t_cortina">🎭 Cortina partida</option>' +
            '<option value="t_luz">✨ Barrido de luz</option>' +
            '<option value="t_persiana">🎚️ Persiana (barrido)</option>' +
            '<option value="t_blur">🌫️ Desenfoque</option>' +
            '<option value="t_volteo">🔄 Volteo 3D</option>' +
            '<option value="t_empuje">⬆️ Empuje vertical</option>' +
            '<option value="t_giro">🌀 Giro</option>' +
            '<option value="t_desvanecer">🫧 Fundido cruzado</option>' +
            '<option value="t_desliza">➡️ Deslizar (clásico)</option>' +
          '</optgroup>' +
        '</select>' +
      '</div>' +
      '<div class="row" style="margin-top:-2px"><span style="font-size:9px;color:var(--tx2)">' +
        'Todos los efectos en un solo sitio. Los de arriba lucen en el vídeo normal; ' +
        'los de abajo, en el vídeo del carrusel (al pasar de una tarjeta a otra).' +
      '</span></div>' +
      '<div class="row">' +
        '<span class="lbl">📼 Formato</span>' +
        '<select id="fpVidFormato" style="flex:1;min-width:160px">' +
          '<option value="auto" selected>Automático · el más compatible (recomendado)</option>' +
          '<option value="mp4">MP4 · para la app de Instagram</option>' +
        '</select>' +
      '</div>' +
      '<div class="row" style="margin-top:-2px"><span style="font-size:9px;color:var(--tx2)">' +
        'Automático elige el formato que tu móvil graba sin fallos. Elige MP4 sólo si vas a subirlo desde la app de Instagram.' +
      '</span></div>' +
      '<div class="row">' +
        '<span class="lbl">Segundos</span>' +
        '<input type="number" id="fpDur" value="12" min="4" max="60" step="1" style="width:70px">' +
        '<span style="font-size:9px;color:var(--tx2)">si hay voz, dura lo que dure la voz</span>' +
        '<button class="btn btn-g" id="fpVerVideo">▶ Ver</button>' +
        '<button class="btn" id="fpVideo">🎬 Descargar vídeo</button>' +
      '</div>' +
      '<div id="fpSt"></div>' +
      '<div style="font-size:9px;color:var(--tx2);margin-top:4px">' +
        'El vídeo se graba en tiempo real: uno de 12 segundos tarda 12 segundos. No cambies de pestaña mientras lo hace.' +
      '</div>' +
    '</div>' +

    '<div id="fpOculto" style="position:absolute;width:0;height:0;overflow:hidden"></div>';

    return true;
  }

  /* ═══════════════════ Los cuadros ═══════════════════ */

  function pintarCeldas() {
    var n = nCuadros(), caja = $('fpCeldas'), html = '';
    for (var i = 0; i < n; i++) {
      var c = FP.pagina.celdas[i] || { titulo: '', texto: '', precio: '', etiqueta: '' };
      var nom = c.media ? (c.media.tipo === 'vid' ? '🎬 ' + c.media.nombre : '🖼️ ' + c.media.nombre) : 'sin foto';
      html +=
      '<div style="border:1px solid var(--bd);border-radius:8px;padding:7px 8px;margin-bottom:6px;background:var(--bg3)">' +
        '<div class="row" style="margin:0 0 5px">' +
          '<b style="font-size:11px;color:var(--ac2);min-width:26px">#' + (i + 1) + '</b>' +
          '<input type="file" accept="image/*,video/*" data-fpi="' + i + '" class="fpFile" ' +
                 'style="flex:1;min-width:120px;background:var(--bg2);border:1px solid var(--bd);border-radius:5px;padding:3px;color:var(--tx);font-size:10px">' +
          '<span style="font-size:9px;color:var(--tx2);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" id="fpMed' + i + '">' + esc(nom) + '</span>' +
          '<button class="btn btn-g fpQuita" data-fpi="' + i + '" style="font-size:9px;padding:2px 7px">✕</button>' +
        '</div>' +
        '<div class="row" style="margin:0 0 4px">' +
          '<input type="text" class="fpTit" data-fpi="' + i + '" placeholder="Servicio" value="' + esc(c.titulo) + '" style="flex:2;min-width:110px">' +
          '<input type="text" class="fpPre" data-fpi="' + i + '" placeholder="Precio" value="' + esc(c.precio) + '" style="width:78px">' +
          '<input type="text" class="fpEti" data-fpi="' + i + '" placeholder="Etiqueta" value="' + esc(c.etiqueta) + '" style="width:88px">' +
          '<button class="btn btn-g fpRe" data-fpi="' + i + '" title="Otra redacción" style="font-size:10px;padding:2px 8px">🔁</button>' +
        '</div>' +
        '<div class="row" style="margin:0">' +
          '<input type="text" class="fpTxt" data-fpi="' + i + '" placeholder="Una frase que lo explique" value="' + esc(c.texto) + '" style="flex:1;min-width:150px">' +
        '</div>' +
      '</div>';
    }
    caja.innerHTML = html;

    caja.querySelectorAll('.fpFile').forEach(function (el) {
      el.addEventListener('change', function (ev) { subirMedia(parseInt(el.dataset.fpi, 10), ev); });
    });
    caja.querySelectorAll('.fpQuita').forEach(function (el) {
      el.addEventListener('click', function () { quitarMedia(parseInt(el.dataset.fpi, 10)); });
    });
    caja.querySelectorAll('.fpRe').forEach(function (el) {
      el.addEventListener('click', function () { regenerarCelda(parseInt(el.dataset.fpi, 10)); });
    });
    ['fpTit', 'fpPre', 'fpEti', 'fpTxt'].forEach(function (cl) {
      caja.querySelectorAll('.' + cl).forEach(function (el) {
        el.addEventListener('input', function () {
          var i = parseInt(el.dataset.fpi, 10), c = FP.pagina.celdas[i];
          if (!c) return;
          if (cl === 'fpTit') c.titulo = el.value;
          else if (cl === 'fpPre') c.precio = el.value;
          else if (cl === 'fpEti') c.etiqueta = el.value;
          else c.texto = el.value;
          repintar();
        });
      });
    });
  }

  function cuentaVideos() {
    return FP.pagina.celdas.filter(function (c) { return c.media && c.media.tipo === 'vid'; }).length;
  }

  function subirMedia(i, ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var esVideo = /^video\//.test(f.type) || /\.(mp4|mov|webm|m4v)$/i.test(f.name);
    var c = FP.pagina.celdas[i];
    if (!c) return;

    if (esVideo) {
      if (c.media && c.media.tipo !== 'vid' && cuentaVideos() >= MAX_VIDEOS ||
          (!c.media || c.media.tipo !== 'vid') && cuentaVideos() >= MAX_VIDEOS) {
        estado('Ya hay ' + MAX_VIDEOS + ' vídeos en este folleto. Quita uno antes de poner otro.', 'err');
        ev.target.value = '';
        return;
      }
      quitarMedia(i, true);
      var url = URL.createObjectURL(f);
      var v = document.createElement('video');
      v.src = url; v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', ''); v.preload = 'auto';
      // 'loadeddata' y no 'loadedmetadata': con metadata el readyState aún es 1
      // y todavía no hay fotograma que dibujar
      v.addEventListener('loadeddata', function () {
        if (v.duration && v.duration > MAX_SEG_VIDEO) {
          estado('El vídeo del cuadro ' + (i + 1) + ' dura ' + Math.round(v.duration) + 's; sólo se verán los primeros ' + MAX_SEG_VIDEO + 's.', 'proc');
        }
        v.play().catch(function () {});
        repintar();
        arrancarBucle();
      });
      v.addEventListener('error', function () {
        estado('No se pudo abrir ese vídeo. Prueba con MP4.', 'err');
      });
      $('fpOculto').appendChild(v);
      c.media = { tipo: 'vid', el: v, url: url, file: f, nombre: f.name };
      $('fpMed' + i).textContent = '🎬 ' + f.name;
      estado('');
      return;
    }

    var r = new FileReader();
    r.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        quitarMedia(i, true);
        c.media = { tipo: 'img', el: img, url: e.target.result, file: f, nombre: f.name };
        $('fpMed' + i).textContent = '🖼️ ' + f.name;
        repintar();
      };
      img.onerror = function () { estado('Esa imagen no se pudo abrir.', 'err'); };
      img.src = e.target.result;
    };
    r.readAsDataURL(f);
  }

  /* ¿Alguna página YA GUARDADA sigue usando este vídeo? Si es así, no se puede
     revocar su URL ni sacarlo del DOM: la copia guardada lo comparte por
     referencia y se quedaría en blanco al exportar la Imagen, el PDF o el vídeo. */
  function mediaEnUso(media) {
    return FP.paginas.some(function (p) {
      return p.celdas.some(function (c) { return c.media === media; });
    });
  }

  function quitarMedia(i, callado) {
    var c = FP.pagina.celdas[i];
    if (!c || !c.media) { if (!callado) repintar(); return; }
    if (c.media.tipo === 'vid' && !mediaEnUso(c.media)) {
      try { c.media.el.pause(); } catch (e) {}
      if (c.media.el.parentNode) c.media.el.parentNode.removeChild(c.media.el);
      try { URL.revokeObjectURL(c.media.url); } catch (e) {}
    }
    c.media = null;
    var et = $('fpMed' + i);
    if (et) et.textContent = 'sin foto';
    if (!callado) { repintar(); estado(''); }
  }

  /* ═══════════════════ Cerebro ═══════════════════ */

  function escribirSolo(nuevaSemilla) {
    if (nuevaSemilla) FP.semilla = Math.floor(Math.random() * 1e9);
    var t = CB.generar({
      rubro: val('fpRubro'), tono: val('fpTono'), n: nCuadros(),
      negocio: val('fpMarca'), contacto: val('fpContacto'), semilla: FP.semilla
    });
    FP.pagina.cabecera.titulo = t.cabecera.titulo;
    FP.pagina.cabecera.subtitulo = t.cabecera.subtitulo;
    FP.pagina.pie.cta = t.pie.cta;
    FP.pagina.guion = t.guion;
    t.celdas.forEach(function (c, i) {
      var d = FP.pagina.celdas[i];
      if (!d) return;
      d.titulo = c.titulo; d.texto = c.texto; d.precio = c.precio; d.etiqueta = c.etiqueta;
    });
    $('fpTitulo').value = t.cabecera.titulo;
    $('fpSub').value = t.cabecera.subtitulo;
    $('fpCta').value = t.pie.cta;
    $('fpGuion').value = t.guion;
    pintarCeldas();
    repintar();
    estado('✓ Escrito. Cambia lo que quieras: es tuyo.', 'done');
  }

  /* Rellena sólo los cuadros que están en blanco, sin tocar lo que la alumna
     ya haya escrito y sin repetir un servicio que ya esté en la hoja. */
  function rellenarVacias() {
    var n = nCuadros();
    var t = CB.generar({
      rubro: val('fpRubro'), tono: val('fpTono'), n: n,
      negocio: val('fpMarca'), contacto: val('fpContacto'), semilla: FP.semilla
    });
    var usados = {};
    FP.pagina.celdas.forEach(function (c) { if (c.titulo) usados[c.titulo] = true; });
    var libres = t.celdas.filter(function (c) { return !usados[c.titulo]; });
    FP.pagina.celdas.forEach(function (c) {
      if (c.titulo || !libres.length) return;
      var n2 = libres.shift();
      c.titulo = n2.titulo; c.texto = n2.texto; c.precio = n2.precio; c.etiqueta = n2.etiqueta;
    });
    pintarCeldas();
    repintar();
  }

  function regenerarCelda(i) {
    var c = FP.pagina.celdas[i];
    if (!c) return;
    var ctx = { rubro: val('fpRubro'), tono: val('fpTono'), servicio: c.titulo, semilla: Math.floor(Math.random() * 1e9) };
    c.texto = CB.regenerar('texto', ctx);
    pintarCeldas();
    repintar();
  }

  /* ═══════════════════ Cerebro de diseño ═══════════════════ */

  /* Aplica un estilo profesional: mueve de golpe la paleta, la cuadrícula, la
     hoja y los acabados. No toca los textos ni las fotos que ya haya puesto. */
  function aplicarDiseno(id) {
    var d = DIS && DIS.get(id);
    if (!d) return;
    $('fpTema').value = d.tema;
    $('fpFormato').value = d.formato;
    FP.coloresManuales = null;                 // el estilo trae su propia paleta
    $('fpAGrano').checked = !!d.adornos.grano;
    $('fpAVineta').checked = !!d.adornos.vineta;
    $('fpAFiletes').checked = !!d.adornos.filetes;
    $('fpASombras').checked = !!d.adornos.sombras;

    // la cuadrícula puede cambiar el nº de huecos: los nuevos se rellenan solos
    $('fpRejilla').value = d.rejilla;
    var n = nCuadros(), faltaban = FP.pagina.celdas.length < n;
    while (FP.pagina.celdas.length < n) FP.pagina.celdas.push({ titulo: '', texto: '', precio: '', etiqueta: '', media: null });

    var desc = $('fpDisenoDesc');
    if (desc) desc.textContent = d.desc;

    if (faltaban) rellenarVacias();            // ya repinta las celdas y el lienzo
    else { pintarCeldas(); repintar(); }
    estado('✓ Diseño «' + d.nombre + '» aplicado. Cambia lo que quieras a mano.', 'done');
  }

  /* ═══════════════════ Vista previa ═══════════════════ */

  function leerPanel() {
    var p = FP.pagina;
    p.rejilla = val('fpRejilla');
    p.formato = val('fpFormato');
    p.tema = val('fpTema');
    p.colores = FP.coloresManuales;
    p.cabecera.marca = val('fpMarca');
    p.cabecera.titulo = val('fpTitulo');
    p.cabecera.subtitulo = val('fpSub');
    p.pie.contacto = val('fpContacto');
    p.pie.cta = val('fpCta');
    p.rubro = val('fpRubro');
    p.tono = val('fpTono');
    p.adornos = {
      grano: $('fpAGrano').checked, vineta: $('fpAVineta').checked,
      filetes: $('fpAFiletes').checked, sombras: $('fpASombras').checked
    };
  }

  function repintar() {
    if (!listo) return;
    leerPanel();
    var F = M.FORMATOS[FP.pagina.formato] || M.FORMATOS.a4v;
    var cv = $('fpLienzo');
    cv.width = F.w; cv.height = F.h;
    cv.style.width = (F.w > F.h ? 400 : 320) + 'px';
    M.pintar(cv.getContext('2d'), F.w, F.h, FP.pagina, conQR({ nPagina: FP.paginas.length + 1 }));
    sincronizarColores();
  }

  function sincronizarColores() {
    var c = M.colores({ tema: val('fpTema'), colores: FP.coloresManuales });
    ['fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2'].forEach(function (k) {
      var e = $('fpC_' + k);
      if (e && e.value.toLowerCase() !== String(c[k]).toLowerCase()) e.value = c[k];
    });
  }

  /* Mientras haya un vídeo puesto, hay que repintar sin parar para que se vea
     moverse dentro del folleto. Sin vídeos, el bucle se apaga solo. */
  var bucle = null;
  function arrancarBucle() {
    if (bucle) return;
    (function paso() {
      if (!listo || FP.grabando || animPrev) { bucle = null; return; }
      if (!cuentaVideos()) { bucle = null; return; }
      var F = M.FORMATOS[FP.pagina.formato] || M.FORMATOS.a4v;
      var cv = $('fpLienzo');
      if (cv) M.pintar(cv.getContext('2d'), F.w, F.h, FP.pagina, conQR({ nPagina: FP.paginas.length + 1 }));
      bucle = requestAnimationFrame(paso);
    })();
  }

  /* ═══════════════════ Páginas ═══════════════════ */

  function añadirPagina() {
    leerPanel();
    FP.paginas.push(copiar(FP.pagina));
    pintarPaginas();
    estado('✓ Página ' + FP.paginas.length + ' guardada. Cambia las fotos y el texto y guarda la siguiente.', 'done');
    repintar();
  }

  function pintarPaginas() {
    var e = $('fpPags');
    if (!e) return;
    if (!FP.paginas.length) { e.innerHTML = 'Sin páginas guardadas · el folleto tendrá sólo esta hoja'; return; }
    e.innerHTML = FP.paginas.length + ' página' + (FP.paginas.length > 1 ? 's' : '') + ' guardada' +
      (FP.paginas.length > 1 ? 's' : '') + ' · <a href="#" id="fpBorrarPag" style="color:var(--warn)">borrar la última</a>';
    var b = $('fpBorrarPag');
    if (b) b.addEventListener('click', function (ev) {
      ev.preventDefault();
      FP.paginas.pop();
      pintarPaginas();
      repintar();
    });
  }

  /* Las hojas que se exportan: las guardadas, y si no hay ninguna, la de ahora. */
  function hojas() {
    leerPanel();
    return FP.paginas.length ? FP.paginas.concat([copiar(FP.pagina)]) : [copiar(FP.pagina)];
  }

  function bajar(nombre, href) {
    var a = document.createElement('a');
    a.download = nombre; a.href = href;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); }, 100);
  }

  function hoy() {
    var d = new Date();
    return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
  }

  function lienzoDe(pag, n) {
    var F = M.FORMATOS[pag.formato] || M.FORMATOS.a4v;
    var cv = document.createElement('canvas');
    cv.width = F.w; cv.height = F.h;
    M.pintar(cv.getContext('2d'), F.w, F.h, pag, conQR({ nPagina: n }));
    return cv;
  }

  /* ═══════════════════ Mis diseños (guardar en el dispositivo) ═══════════════════
     Se guarda en localStorage: textos, ajustes, colores y las fotos (reducidas
     para que quepan). Los vídeos no se guardan por su tamaño; al abrir, se avisa
     de cuántos hay que volver a poner. */
  var CLAVE_DIS = 'fp_disenos_v1';

  function listaDisenos() {
    try { return JSON.parse(localStorage.getItem(CLAVE_DIS) || '[]') || []; }
    catch (e) { return []; }
  }
  function escribirLista(l) {
    try { localStorage.setItem(CLAVE_DIS, JSON.stringify(l)); return true; }
    catch (e) { return false; }
  }

  /* Reduce una foto (dataURL) a 1200px de lado máximo, para que no reviente la
     memoria del navegador al guardar varios diseños. */
  function miniFoto(dataURL) {
    return new Promise(function (res) {
      if (!dataURL) { res(null); return; }
      var img = new Image();
      img.onload = function () {
        var mx = 1200, w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
        if (!w || !h) { res(dataURL); return; }
        var s = Math.min(1, mx / Math.max(w, h));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(w * s)); c.height = Math.max(1, Math.round(h * s));
        try { c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.82)); }
        catch (e) { res(dataURL); }
      };
      img.onerror = function () { res(dataURL); };
      img.src = dataURL;
    });
  }

  function serializarPagina(p) {
    return {
      rejilla: p.rejilla, formato: p.formato, tema: p.tema,
      colores: p.colores ? JSON.parse(JSON.stringify(p.colores)) : null,
      cabecera: { marca: p.cabecera.marca, titulo: p.cabecera.titulo, subtitulo: p.cabecera.subtitulo },
      pie: { cta: p.pie.cta, contacto: p.pie.contacto },
      rubro: p.rubro, tono: p.tono, guion: p.guion || '',
      adornos: { grano: !!p.adornos.grano, vineta: !!p.adornos.vineta, filetes: !!p.adornos.filetes, sombras: !!p.adornos.sombras },
      celdas: p.celdas.map(function (c) {
        return {
          titulo: c.titulo, texto: c.texto, precio: c.precio, etiqueta: c.etiqueta,
          foto: (c.media && c.media.tipo === 'img') ? c.media.url : null,
          sinVideo: !!(c.media && c.media.tipo === 'vid')
        };
      })
    };
  }

  function deserializarPagina(pg) {
    return {
      rejilla: pg.rejilla, formato: pg.formato, tema: pg.tema,
      colores: pg.colores ? JSON.parse(JSON.stringify(pg.colores)) : null,
      cabecera: { marca: pg.cabecera.marca, titulo: pg.cabecera.titulo, subtitulo: pg.cabecera.subtitulo },
      pie: { cta: pg.pie.cta, contacto: pg.pie.contacto },
      rubro: pg.rubro, tono: pg.tono, guion: pg.guion || '',
      adornos: { grano: !!pg.adornos.grano, vineta: !!pg.adornos.vineta, filetes: !!pg.adornos.filetes, sombras: !!pg.adornos.sombras },
      celdas: pg.celdas.map(function (c) {
        var celda = { titulo: c.titulo, texto: c.texto, precio: c.precio, etiqueta: c.etiqueta, media: null };
        if (c.foto) {
          var img = new Image();
          img.onload = function () { repintar(); };  // redibuja cuando la foto está lista
          img.src = c.foto;
          celda.media = { tipo: 'img', el: img, url: c.foto, file: null, nombre: 'foto guardada' };
        }
        return celda;
      })
    };
  }

  function guardarDiseno() {
    if (!listo) return;
    leerPanel();
    var nombre = (val('fpDisNombre') || '').trim() || ('Diseño ' + (listaDisenos().length + 1));
    var pags = FP.paginas.map(serializarPagina).concat([serializarPagina(FP.pagina)]);
    var tareas = [];
    pags.forEach(function (pg) {
      pg.celdas.forEach(function (cel) { tareas.push(miniFoto(cel.foto).then(function (d) { cel.foto = d; })); });
    });
    estado('Guardando el diseño…', 'proc');
    Promise.all(tareas).then(function () {
      var item = {
        id: 'd' + Date.now(), nombre: nombre, fecha: hoy(), paginas: pags,
        tel: val('fpTel') || '', qr: !!($('fpQR') && $('fpQR').checked)
      };
      var lista = listaDisenos();
      lista.unshift(item);
      if (lista.length > 20) lista = lista.slice(0, 20);
      if (escribirLista(lista)) { estado('✓ Diseño «' + nombre + '» guardado.', 'done'); pintarDisenos(); return; }
      // no cupo: reintenta sin las fotos
      item.paginas.forEach(function (pg) { pg.celdas.forEach(function (cel) { cel.foto = null; }); });
      if (escribirLista(lista)) { estado('✓ Guardado, pero sin las fotos (no cabían en la memoria del móvil).', 'done'); pintarDisenos(); }
      else estado('No se pudo guardar: la memoria del navegador está llena. Borra algún diseño y prueba otra vez.', 'err');
    });
  }

  function borrarDiseno(id) {
    escribirLista(listaDisenos().filter(function (x) { return x.id !== id; }));
    pintarDisenos();
  }

  function cargarDisenoGuardado(id) {
    var it = null;
    listaDisenos().some(function (x) { if (x.id === id) { it = x; return true; } return false; });
    if (!it) { estado('Ese diseño ya no está.', 'err'); return; }

    // suelta los medios actuales (los vídeos, aunque estén compartidos, se van)
    FP.pagina.celdas.forEach(function (c, i) { if (c.media) quitarMedia(i, true); });
    FP.paginas.forEach(function (pg) {
      pg.celdas.forEach(function (c) {
        if (c.media && c.media.tipo === 'vid') {
          try { c.media.el.pause(); if (c.media.el.parentNode) c.media.el.parentNode.removeChild(c.media.el); URL.revokeObjectURL(c.media.url); } catch (e) {}
        }
      });
    });

    var pags = it.paginas.map(deserializarPagina);
    FP.paginas = pags.slice(0, pags.length - 1);
    FP.pagina = pags[pags.length - 1];
    FP.coloresManuales = FP.pagina.colores || null;

    $('fpRejilla').value = FP.pagina.rejilla;
    $('fpFormato').value = FP.pagina.formato;
    $('fpTema').value = FP.pagina.tema;
    $('fpRubro').value = FP.pagina.rubro;
    $('fpTono').value = FP.pagina.tono;
    $('fpMarca').value = FP.pagina.cabecera.marca;
    $('fpTitulo').value = FP.pagina.cabecera.titulo;
    $('fpSub').value = FP.pagina.cabecera.subtitulo;
    $('fpContacto').value = FP.pagina.pie.contacto;
    $('fpCta').value = FP.pagina.pie.cta;
    $('fpGuion').value = FP.pagina.guion || '';
    $('fpAGrano').checked = FP.pagina.adornos.grano;
    $('fpAVineta').checked = FP.pagina.adornos.vineta;
    $('fpAFiletes').checked = FP.pagina.adornos.filetes;
    $('fpASombras').checked = FP.pagina.adornos.sombras;

    if ($('fpTel')) $('fpTel').value = it.tel || '';
    if ($('fpQR')) $('fpQR').checked = !!it.qr;
    FP.qr = null;
    generarQR();          // lo rehace con el número guardado (o lo quita)

    var faltan = 0;
    it.paginas.forEach(function (pg) { pg.celdas.forEach(function (c) { if (c.sinVideo) faltan++; }); });

    pintarCeldas();
    pintarPaginas();
    repintar();
    arrancarBucle();
    estado('✓ Diseño «' + it.nombre + '» abierto' +
      (faltan ? '. Vuelve a poner ' + faltan + ' vídeo(s): no se guardan por su tamaño.' : '.'), 'done');
  }

  function pintarDisenos() {
    var caja = $('fpDisLista');
    if (!caja) return;
    var lista = listaDisenos();
    if (!lista.length) { caja.innerHTML = '<span style="font-size:9px;color:var(--tx2)">Aún no has guardado ningún diseño.</span>'; return; }
    caja.innerHTML = lista.map(function (it) {
      return '<div class="row" style="margin:0 0 4px;align-items:center">' +
        '<span style="flex:1;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📄 ' + esc(it.nombre) +
          ' <span style="color:var(--tx2)">· ' + esc(it.fecha) + '</span></span>' +
        '<button class="btn btn-g fpDisAbrir" data-id="' + esc(it.id) + '" style="font-size:9px;padding:2px 9px">Abrir</button>' +
        '<button class="btn btn-g fpDisBorrar" data-id="' + esc(it.id) + '" style="font-size:9px;padding:2px 7px">✕</button>' +
      '</div>';
    }).join('');
    caja.querySelectorAll('.fpDisAbrir').forEach(function (el) {
      el.addEventListener('click', function () { cargarDisenoGuardado(el.dataset.id); });
    });
    caja.querySelectorAll('.fpDisBorrar').forEach(function (el) {
      el.addEventListener('click', function () { borrarDiseno(el.dataset.id); });
    });
  }

  /* ═══════════════════ ZIP (varias imágenes en una descarga) ═══════════════════
     Un ZIP «store» (sin comprimir; el JPEG ya lo está) hecho a mano, para que
     bajar varias hojas sea UNA sola descarga —fiable en el móvil, donde bajar
     varios archivos seguidos suele fallar— con cada hoja como un .jpg dentro. */
  var CRC_TABLA = (function () {
    var t = [], c, n, k;
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u8) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u8.length; i++) c = CRC_TABLA[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function b64aU8(b64) {
    var bin = atob(b64), n = bin.length, u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  function ascii(s) {
    var u = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i) & 255;
    return u;
  }
  function le16(v) { return [v & 255, (v >> 8) & 255]; }
  function le32(v) { return [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255]; }
  function zipStore(archivos) {
    var partes = [], central = [], offset = 0;
    archivos.forEach(function (f) {
      var nombre = ascii(f.name), datos = f.data, crc = crc32(datos), sz = datos.length;
      var lh = new Uint8Array([].concat([0x50, 0x4b, 0x03, 0x04], le16(20), le16(0), le16(0), le16(0), le16(0),
        le32(crc), le32(sz), le32(sz), le16(nombre.length), le16(0)));
      partes.push(lh, nombre, datos);
      central.push(new Uint8Array([].concat([0x50, 0x4b, 0x01, 0x02], le16(20), le16(20), le16(0), le16(0), le16(0), le16(0),
        le32(crc), le32(sz), le32(sz), le16(nombre.length), le16(0), le16(0), le16(0), le16(0), le32(0), le32(offset))), nombre);
      offset += lh.length + nombre.length + datos.length;
    });
    var centralBytes = 0;
    central.forEach(function (u) { centralBytes += u.length; });
    var eocd = new Uint8Array([].concat([0x50, 0x4b, 0x05, 0x06], le16(0), le16(0),
      le16(archivos.length), le16(archivos.length), le32(centralBytes), le32(offset), le16(0)));
    return new Blob(partes.concat(central).concat([eocd]), { type: 'application/zip' });
  }

  /* ═══════════════════ Carrusel para redes ═══════════════════
     Convierte el folleto en una secuencia de tarjetas que se pasan con el
     dedo: portada + una tarjeta por servicio. Cada tarjeta es una hoja normal
     (el mismo motor la dibuja), sólo que con el formato de la red y con un
     único cuadro dentro, así el servicio se ve grande y se lee en el móvil. */
  function tarjetasCarrusel() {
    var fmt = val('fpCarFormato') || 'vertical';
    var unoAUno = !$('fpCarUno') || $('fpCarUno').checked;
    var conPortada = !$('fpCarPortada') || $('fpCarPortada').checked;
    var origen = hojas();           // lee el panel y devuelve las hojas actuales
    var salida = [];

    origen.forEach(function (p) {
      if (!unoAUno) { var t = copiar(p); t.formato = fmt; salida.push(t); return; }
      // portada: la hoja entera, para que se vea de qué va el folleto
      if (conPortada) {
        var por = copiar(p);
        por.formato = fmt;
        salida.push(por);
      }
      // y después, un servicio por tarjeta (sólo los que tienen algo escrito)
      p.celdas.forEach(function (c) {
        if (!c.titulo && !c.texto && !c.media) return;
        var t2 = copiar(p);
        t2.formato = fmt;
        t2.rejilla = 'r1';
        t2.celdas = [{ titulo: c.titulo, texto: c.texto, precio: c.precio, etiqueta: c.etiqueta, media: c.media }];
        salida.push(t2);
      });
    });

    if (!salida.length) { var u = copiar(origen[0]); u.formato = fmt; salida.push(u); }
    return salida;
  }

  function infoCarrusel(msg) {
    var e = $('fpCarInfo');
    if (e) e.textContent = msg || '';
  }

  /* Dice cuántas tarjetas van a salir, para que no sea una sorpresa al pulsar. */
  function contarCarrusel() {
    if (!listo) return;
    var n = tarjetasCarrusel().length;
    infoCarrusel(n > 20 ? '20 tarjetas (de ' + n + ': es el tope de Instagram)' : n + ' tarjetas');
  }

  function descargarCarrusel() {
    var ts = tarjetasCarrusel();
    if (ts.length > 20) ts = ts.slice(0, 20);   // Instagram admite 20 por carrusel
    estado('Preparando el carrusel…', 'proc');
    try {
      var archivos = ts.map(function (p, i) {
        var n = ('0' + (i + 1)).slice(-2);
        var b64 = lienzoDe(p, i + 1).toDataURL('image/jpeg', 0.95).split(',')[1];
        return { name: n + '_carrusel.jpg', data: b64aU8(b64) };
      });
      bajar('carrusel_' + hoy() + '.zip', URL.createObjectURL(zipStore(archivos)));
      estado('✓ Carrusel de ' + ts.length + ' tarjetas en un ZIP. Ábrelo y súbelas en orden (01, 02, 03…).', 'done');
      infoCarrusel(ts.length + ' tarjetas');
    } catch (e) {
      estado('No se pudo montar el carrusel: ' + (e.message || e), 'err');
    }
  }

  /* ═══════════════════ Descargas ═══════════════════ */

  function descargarPNG() {
    var hs = hojas();
    if (hs.length === 1) {
      bajar('folleto_' + hoy() + '.jpg', lienzoDe(hs[0], 1).toDataURL('image/jpeg', 0.95));
      estado('✓ Imagen descargada.', 'done');
      return;
    }
    try {
      var archivos = hs.map(function (p, i) {
        var b64 = lienzoDe(p, i + 1).toDataURL('image/jpeg', 0.95).split(',')[1];
        return { name: 'folleto_hoja' + (i + 1) + '.jpg', data: b64aU8(b64) };
      });
      bajar('folleto_' + hoy() + '.zip', URL.createObjectURL(zipStore(archivos)));
      estado('✓ Las ' + hs.length + ' hojas en un ZIP (una sola descarga). Ábrelo y tienes cada imagen por separado.', 'done');
    } catch (e) {
      // respaldo: hoja a hoja (por si algún navegador no deja crear el ZIP)
      hs.forEach(function (p, i) {
        setTimeout(function () {
          bajar('folleto_' + hoy() + '_hoja' + (i + 1) + '.jpg', lienzoDe(p, i + 1).toDataURL('image/jpeg', 0.95));
        }, i * 350);
      });
      estado('✓ ' + hs.length + ' imágenes descargadas.', 'done');
    }
  }

  function descargarPDF() {
    var JS = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JS) { estado('No se pudo cargar el motor de PDF. Comprueba la conexión y recarga.', 'err'); return; }
    var hs = hojas();
    var pdf = null;
    hs.forEach(function (p, i) {
      var F = M.FORMATOS[p.formato] || M.FORMATOS.a4v;
      var anchoMM = F.mm[0], altoMM = F.mm[1];
      if (!pdf) pdf = new JS({ orientation: anchoMM > altoMM ? 'landscape' : 'portrait', unit: 'mm', format: [anchoMM, altoMM] });
      else pdf.addPage([anchoMM, altoMM], anchoMM > altoMM ? 'landscape' : 'portrait');
      pdf.addImage(lienzoDe(p, i + 1).toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, anchoMM, altoMM);
    });
    pdf.save('folleto_' + hoy() + '.pdf');
    estado('✓ PDF de ' + hs.length + ' hoja' + (hs.length > 1 ? 's' : '') + ' descargado.', 'done');
  }

  function comoDataURL(file) {
    return new Promise(function (ok, ko) {
      var r = new FileReader();
      r.onload = function (e) { ok(e.target.result); };
      r.onerror = ko;
      r.readAsDataURL(file);
    });
  }

  /* Folleto web: un solo .html que se abre en cualquier móvil, se pasa con el
     dedo, reproduce los vídeos y lee el folleto en voz alta. */
  function descargarWeb() {
    var hs = hojas();
    estado('Preparando el folleto web…', 'proc');

    /* Un mismo vídeo puede estar en varias hojas. Se incrusta UNA sola vez y
       las hojas lo comparten: si no, un folleto de 4 páginas pesaría el
       cuádruple por el mismo archivo. */
    var unicos = [];                 // [{file, hojas:[i…]}]
    hs.forEach(function (p, i) {
      p.celdas.forEach(function (c) {
        if (!c.media || c.media.tipo !== 'vid' || !c.media.file) return;
        var v = null;
        unicos.some(function (u) { if (u.file === c.media.file) { v = u; return true; } return false; });
        if (!v) { v = { file: c.media.file, hojas: [] }; unicos.push(v); }
        if (v.hojas.indexOf(i) < 0) v.hojas.push(i);
      });
    });
    var pesoVideos = unicos.reduce(function (a, u) { return a + u.file.size; }, 0);
    var conVideos = pesoVideos > 0 && pesoVideos < TOPE_WEB;

    var tareas = hs.map(function (p, i) {
      return Promise.resolve({ hoja: i, portada: lienzoDe(p, i + 1).toDataURL('image/jpeg', 0.85) });
    });

    var videos = conVideos ? unicos.map(function (u, k) {
      return comoDataURL(u.file).then(function (d) { return { clip: k, hojas: u.hojas, datos: d, nombre: u.file.name }; });
    }) : [];

    Promise.all(tareas.concat(videos)).then(function (res) {
      var portadas = [], vids = [];
      res.forEach(function (r) { if (r.portada) portadas[r.hoja] = r.portada; else vids.push(r); });

      // los datos de cada vídeo se escriben UNA vez en CLIPS y las hojas los
      // referencian por número; si se pusieran en cada <video src>, el mismo
      // vídeo repetido en 4 hojas pesaría 4 veces
      vids.sort(function (a, b) { return a.clip - b.clip; });
      var listaClips = '[' + vids.map(function (v) { return JSON.stringify(v.datos); }).join(',') + ']';

      var secciones = portadas.map(function (src, i) {
        var extra = vids.filter(function (v) { return v.hojas.indexOf(i) >= 0; }).map(function (v) {
          return '<video class="clip" data-clip="' + v.clip + '" controls playsinline preload="metadata"></video>';
        }).join('');
        return '<section><img src="' + src + '" alt="Hoja ' + (i + 1) + '">' +
               (extra ? '<div class="clips"><div class="lbl">Vídeos de esta hoja</div>' + extra + '</div>' : '') +
               '</section>';
      }).join('');

      var guion = (val('fpGuion') || FP.pagina.guion || '').replace(/[`\\]/g, '');
      var titulo = val('fpTitulo') || 'Folleto';
      var marca = val('fpMarca') || '';

      var doc =
'<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<title>' + esc(marca + ' · ' + titulo) + '</title><style>' +
'*{box-sizing:border-box}body{margin:0;background:#0b0b10;color:#eee;font:14px system-ui,"Segoe UI",sans-serif;overflow:hidden}' +
'#v{display:flex;height:100dvh;transition:transform .32s ease}' +
'section{min-width:100vw;height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px;overflow-y:auto}' +
'section img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px}' +
'.clips{width:100%;max-width:520px;margin-top:10px}.clips .lbl{font-size:11px;opacity:.6;margin-bottom:5px}' +
'.clip{width:100%;border-radius:8px;margin-bottom:8px;background:#000}' +
'#barra{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;align-items:center;justify-content:center;' +
'padding:9px;background:linear-gradient(0deg,rgba(0,0,0,.85),transparent)}' +
'button{background:#7c3aed;color:#fff;border:0;border-radius:20px;padding:8px 15px;font-size:13px;cursor:pointer}' +
'button:disabled{opacity:.35}#num{font-size:12px;opacity:.75;min-width:46px;text-align:center}' +
'</style></head><body>' +
'<div id="v">' + secciones + '</div>' +
'<div id="barra"><button id="a">‹</button><span id="num"></span><button id="b">›</button>' +
(guion ? '<button id="voz">🔊 Escuchar</button>' : '') + '</div>' +
'<script>(function(){' +
'var CLIPS=' + listaClips + ';' +
'[].forEach.call(document.querySelectorAll("video.clip"),function(e){e.src=CLIPS[+e.dataset.clip]});' +
'var i=0,n=' + portadas.length + ',v=document.getElementById("v");' +
'function ir(k){i=Math.max(0,Math.min(n-1,k));v.style.transform="translateX(-"+(i*100)+"vw)";' +
'document.getElementById("num").textContent=(i+1)+" / "+n;' +
'document.getElementById("a").disabled=i===0;document.getElementById("b").disabled=i===n-1;}' +
'document.getElementById("a").onclick=function(){ir(i-1)};' +
'document.getElementById("b").onclick=function(){ir(i+1)};' +
'addEventListener("keydown",function(e){if(e.key==="ArrowLeft")ir(i-1);if(e.key==="ArrowRight")ir(i+1)});' +
'var x0=null;addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});' +
'addEventListener("touchend",function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;' +
'if(Math.abs(d)>55)ir(i+(d<0?1:-1));x0=null},{passive:true});' +
(guion ?
'var hablando=false;document.getElementById("voz").onclick=function(){' +
'if(hablando){speechSynthesis.cancel();hablando=false;this.textContent="🔊 Escuchar";return;}' +
'var u=new SpeechSynthesisUtterance(' + JSON.stringify(guion) + ');u.lang="es-ES";u.rate=.95;' +
'u.onend=function(){hablando=false;document.getElementById("voz").textContent="🔊 Escuchar"};' +
'speechSynthesis.cancel();speechSynthesis.speak(u);hablando=true;this.textContent="■ Parar";};' : '') +
'ir(0);})();<\/script></body></html>';

      bajar('folleto_web_' + hoy() + '.html', URL.createObjectURL(new Blob([doc], { type: 'text/html' })));
      estado('✓ Folleto web descargado' +
        (pesoVideos > 0 && !conVideos
          ? '. Los vídeos pesaban ' + Math.round(pesoVideos / 1048576) + ' MB y se han dejado fuera para que el archivo se pueda mandar; se ve su primer fotograma en la hoja.'
          : conVideos ? ', con los vídeos dentro.' : '.'), 'done');
    }).catch(function (e) {
      estado('No se pudo montar el folleto web: ' + (e.message || e), 'err');
    });
  }

  /* ═══════════════════ Música gratis ═══════════════════
     Sintetiza en el propio dispositivo una de las melodías sin derechos de
     autor de Flyers (FL_MELODIES), conectándola SÓLO al destino que se le
     pasa. Para el vídeo, ese destino es la pista que se graba; para la
     preescucha, es el altavoz. Si FL_MELODIES no está, no hace nada. */
  function crearMezclaMusica(ac, dest, def, dur, ganancia) {
    var master = ac.createGain();
    master.gain.value = (def.gain || 0.5) * ganancia;
    var lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3400; lp.Q.value = 0.5;
    master.connect(lp); lp.connect(dest);

    var beat = 60 / (def.tempo || 100), step = beat * 0.5, bstep = beat * 2;
    var t0 = ac.currentTime + 0.15, fin = t0 + dur, oscs = [];
    var tabla = NOTE || NOTE_FALLBACK;
    function nota(freq, t, d, pico, onda) {
      if (t >= fin) return;
      var o = ac.createOscillator(); o.type = onda || 'sine'; o.frequency.value = freq;
      var ge = ac.createGain();
      ge.gain.setValueAtTime(0.0001, t);
      ge.gain.linearRampToValueAtTime(pico, t + 0.02);
      ge.gain.exponentialRampToValueAtTime(0.0008, t + d);
      o.connect(ge); ge.connect(master);
      o.start(t); o.stop(Math.min(fin + 0.1, t + d + 0.05)); oscs.push(o);
    }
    var seq = def.seq || [], bass = def.bass || [], i, t;
    for (i = 0, t = t0; t < fin && seq.length; t += step, i++) nota(tabla[seq[i % seq.length]] || 440, t, step * 1.1, 0.6, def.wave);
    for (i = 0, t = t0; t < fin && bass.length; t += bstep, i++) nota(tabla[bass[i % bass.length]] || 130, t, bstep * 0.95, 0.4, 'sine');
    master.gain.setValueAtTime(master.gain.value, Math.max(t0, fin - 0.6));
    master.gain.linearRampToValueAtTime(0.0001, fin);
    return { stop: function () { oscs.forEach(function (o) { try { o.stop(); } catch (e) {} }); try { master.disconnect(); lp.disconnect(); } catch (e) {} } };
  }

  /* Llena el desplegable de música con las melodías de Flyers, si están. Si no
     hay ninguna, deja la fila oculta y el vídeo sigue funcionando sin música. */
  function llenarMusica() {
    var sel = $('fpMusica'), fila = $('fpMusicaRow');
    if (!sel) return;
    if (!MEL) { if (fila) fila.style.display = 'none'; return; }
    var ids = Object.keys(MEL);
    if (!ids.length) { if (fila) fila.style.display = 'none'; return; }
    var html = '<option value="none">🔇 Sin música de fondo</option>';
    ids.forEach(function (id) { html += '<option value="' + esc(id) + '">' + esc(nombreMel(id)) + '</option>'; });
    sel.innerHTML = html;
  }

  var prevAc = null, prevMus = null, prevTO = null;
  function pararPreview() {
    if (prevMus) { try { prevMus.stop(); } catch (e) {} prevMus = null; }
    if (prevAc) { try { prevAc.close(); } catch (e) {} prevAc = null; }
    if (prevTO) { clearTimeout(prevTO); prevTO = null; }
    var b = $('fpMusPrev'); if (b) b.textContent = '▶ Escuchar';
  }
  function previewMusica() {
    if (prevMus) { pararPreview(); return; }
    var id = val('fpMusica');
    if (!id || id === 'none' || !MEL || !MEL[id]) { estado('Elige una melodía para escucharla.', 'err'); return; }
    try {
      prevAc = new (window.AudioContext || window.webkitAudioContext)();
      if (prevAc.state === 'suspended') prevAc.resume();
      prevMus = crearMezclaMusica(prevAc, prevAc.destination, MEL[id], 5, 1);
      var b = $('fpMusPrev'); if (b) b.textContent = '■ Parar';
      prevTO = setTimeout(pararPreview, 5400);
    } catch (e) { estado('No se pudo reproducir la música: ' + (e.message || e), 'err'); }
  }

  /* ═══════════════════ Voces gratis (player) ═══════════════════
     Lista las voces del navegador (speechSynthesis), las de Google primero,
     para que la persona elija la que le guste. La misma que se elige aquí es
     la que lee el folleto en el vídeo. */
  function cargarVocesFolleto() {
    var sel = $('fpVozSel');
    if (!sel || !('speechSynthesis' in window)) return;
    var todas = speechSynthesis.getVoices() || [];
    if (!todas.length) return;                        // aún no están listas
    var es = todas.filter(function (v) { return String(v.lang || '').toLowerCase().indexOf('es') === 0; });
    var lista = (es.length ? es : todas).slice().sort(function (a, b) {
      var ga = /google/i.test(a.name) ? 0 : 1, gb = /google/i.test(b.name) ? 0 : 1;
      if (ga !== gb) return ga - gb;
      return a.name.localeCompare(b.name);
    });
    var previa = sel.value;
    sel.innerHTML = lista.map(function (v) {
      var marca = /google/i.test(v.name) ? '🟢 ' : '· ';
      return '<option value="' + encodeURIComponent(v.name) + '">' + marca + esc(v.name) + ' (' + esc(v.lang) + ')</option>';
    }).join('');
    if (previa) sel.value = previa;
    var av = $('fpVozAviso');
    if (av) av.textContent = lista.length + (lista.length === 1 ? ' voz disponible' : ' voces disponibles') +
      '. Las 🟢 son de Google (suelen sonar mejor).';
  }

  function vozGratisElegida() {
    var sel = $('fpVozSel');
    if (!sel || !sel.value || !('speechSynthesis' in window)) return null;
    var nombre = decodeURIComponent(sel.value);
    var todas = speechSynthesis.getVoices() || [];
    for (var i = 0; i < todas.length; i++) if (todas[i].name === nombre) return todas[i];
    return null;
  }

  var probandoVoz = false;
  function probarVoz() {
    var btn = $('fpVozProbar');
    if (!('speechSynthesis' in window)) { estado('Este navegador no tiene voces para probar.', 'err'); return; }
    if (probandoVoz) { try { speechSynthesis.cancel(); } catch (e) {} probandoVoz = false; if (btn) btn.textContent = '▶ Probar'; return; }
    var txt = (val('fpGuion') || '').trim();
    txt = txt ? txt.slice(0, 160) : 'Hola, así sonará la voz de tu folleto. Reserva tu cita.';
    var u = new SpeechSynthesisUtterance(txt);
    var v = vozGratisElegida();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'es-ES'; }
    u.rate = parseFloat(val('fpVozVel')) || 1;
    u.pitch = parseFloat(val('fpVozTono')) || 1;
    u.onend = u.onerror = function () { probandoVoz = false; if (btn) btn.textContent = '▶ Probar'; };
    try { speechSynthesis.cancel(); speechSynthesis.speak(u); probandoVoz = true; if (btn) btn.textContent = '■ Parar'; }
    catch (e) { estado('No se pudo probar la voz: ' + (e.message || e), 'err'); }
  }

  /* ═══════════════════ Vídeo con voz ═══════════════════ */

  function prepararVoz(fuente) {
    if (fuente === 'ninguna') return Promise.resolve(null);

    if (fuente === 'audio') {
      var f = $('fpAudio').files && $('fpAudio').files[0];
      if (!f) return Promise.reject(new Error('Sube primero el archivo de música o voz.'));
      return Promise.resolve({ url: URL.createObjectURL(f), propia: true });
    }

    if (fuente === 'texto_gratis') {
      if (!window.B6_VOZ_GRATIS || !window.B6_VOZ_GRATIS.disponible())
        return Promise.reject(new Error('Este navegador no puede captar la voz gratuita. Prueba en Chrome.'));
      if (window.B6_VOZ_GRATIS.ocupada && window.B6_VOZ_GRATIS.ocupada())
        return Promise.reject(new Error('Se está grabando otra voz ahora mismo. Espera a que termine.'));
      var texto = (val('fpGuion') || '').trim();
      if (!texto) return Promise.reject(new Error('No hay nada que leer. Pulsa «Escríbelo tú por mí» o escribe el guion.'));
      try { speechSynthesis.cancel(); } catch (e) {}   // corta la preescucha si sonaba
      return window.B6_VOZ_GRATIS.capturar({
        texto: texto,
        voz: vozGratisElegida(),
        vel: parseFloat(val('fpVozVel')) || 1,
        tono: parseFloat(val('fpVozTono')) || 1,
        aviso: function (m) { estado(m, 'proc'); }
      }).then(function (r) { return { url: URL.createObjectURL(r.blob), seg: r.segundos, propia: true }; });
    }

    if (fuente === 'texto_pro') {
      var t = (val('fpGuion') || '').trim();
      if (!t) return Promise.reject(new Error('Escribe el guion que quieres que lea la voz.'));
      estado('🗣️ Generando la voz de estudio…', 'proc');
      var clave = '';
      try { clave = localStorage.getItem('fc_key_openai') || localStorage.getItem('fc_oai_key') || ''; } catch (e) {}
      var cab = { 'Content-Type': 'application/json' };
      if (clave) cab['Authorization'] = 'Bearer ' + clave;
      return fetch('/.netlify/functions/tts', {
        method: 'POST', headers: cab, body: JSON.stringify({ text: t, voice: 'nova', speed: 1 })
      }).then(function (res) {
        if (res.ok) return res.blob();
        return res.json().then(
          function (j) { throw new Error((j.error || 'El servidor de voz no respondió bien.') + ' · Puedes usar la voz gratis.'); },
          function () { throw new Error('El servidor de voz no respondió bien. Puedes usar la voz gratis.'); });
      }).then(function (b) { return { url: URL.createObjectURL(b), propia: true }; });
    }

    return Promise.resolve(null);   // 'mic' se resuelve en vivo
  }

  /* ═══════════════════ Efectos del vídeo ═══════════════════
     Cómo entra cada cuadro en el vídeo. Devuelve lo que el motor sabe aplicar
     (opacidad, desplazamiento, escala y recortes), así que lo que se ve es
     exactamente lo que se graba, sin dibujar nada dos veces.

     efecto  · id del desplegable      i     · nº de cuadro
     n       · cuántos cuadros hay     tHoja · segundos dentro de esta hoja
     porHoja · lo que dura la hoja     F     · formato (para medir el salto) */
  function revelado(efecto, i, n, tHoja, porHoja, F) {
    n = Math.max(1, n);
    // el retardo escalonado es lo que hace que entren en cascada y no de golpe
    var paso = Math.min(0.40, (porHoja * 0.45) / n);
    var salida = 0.85;                       // lo que tarda un cuadro en entrar (más lento = más profesional)
    var arranque = 0.30 + i * paso;
    var f = Math.max(0, Math.min(1, (tHoja - arranque) / salida));
    // suavizado: arranca y frena despacio, que es lo que se ve "caro"
    var s = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;

    if (efecto === 'fundido') {
      return { a: f };
    }
    if (efecto === 'olas') {
      // sube y baja como una ola, con un vaivén que se va calmando
      var onda = Math.sin((1 - s) * Math.PI * 2.2) * (1 - s);
      return { a: f, dy: onda * F.h * 0.05, escala: 0.94 + s * 0.06 };
    }
    if (efecto === 'circulos') {
      return { a: Math.min(1, f * 1.6), recorte: 'circulo', p: s };
    }
    if (efecto === 'cuadros') {
      // mosaico: cada cuadro crece desde su centro
      return { a: f, escala: 0.55 + s * 0.45 };
    }
    if (efecto === 'deslizar') {
      // entran alternando desde la izquierda y desde la derecha
      var lado = (i % 2 === 0) ? -1 : 1;
      return { a: f, dx: lado * (1 - s) * F.w * 0.35 };
    }
    if (efecto === 'persiana') {
      return { a: Math.min(1, f * 1.5), recorte: 'persiana', p: s };
    }
    if (efecto === 'aterriza') {
      // entra un pelín más grande y se asienta: elegante, "de estudio"
      return { a: f, escala: 1.14 - s * 0.14 };
    }
    if (efecto === 'caida') {
      // cae desde arriba con suavidad
      return { a: f, dy: -(1 - s) * F.h * 0.14 };
    }
    if (efecto === 'rebote') {
      // entra con un pequeño rebote (overshoot) que da vida sin marear
      var c1 = 1.70158, c3 = c1 + 1;
      var eb = 1 + c3 * Math.pow(f - 1, 3) + c1 * Math.pow(f - 1, 2);
      return { a: f, escala: 0.6 + eb * 0.4 };
    }
    // 'uno_a_uno': el de siempre, subiendo y apareciendo
    return { a: f, dy: (1 - s) * F.h * 0.02 };
  }

  /* Transiciones de tarjeta a tarjeta del carrusel-vídeo. Reciben las dos
     tarjetas YA dibujadas en canvas (A sale, B entra) y el avance p (0..1),
     y componen el paso. Todo es canvas 2D, sin librerías. */
  function transicionCarrusel(ctx, A, B, p, W, H, ef) {
    if (ef === 'zoom') {
      var sa = 1 + p * 0.25;
      ctx.save(); ctx.globalAlpha = 1 - p; ctx.translate(W / 2, H / 2); ctx.scale(sa, sa); ctx.drawImage(A, -W / 2, -H / 2); ctx.restore();
      var sb = 0.75 + p * 0.25;
      ctx.save(); ctx.globalAlpha = p; ctx.translate(W / 2, H / 2); ctx.scale(sb, sb); ctx.drawImage(B, -W / 2, -H / 2); ctx.restore();
      return;
    }
    if (ef === 'cubo') {
      var aw = W * (1 - p);
      ctx.save(); ctx.drawImage(A, 0, 0, W, H, 0, 0, aw, H); ctx.fillStyle = 'rgba(0,0,0,' + (p * 0.6) + ')'; ctx.fillRect(0, 0, aw, H); ctx.restore();
      var bw = W * p;
      ctx.save(); ctx.drawImage(B, 0, 0, W, H, W - bw, 0, bw, H); ctx.fillStyle = 'rgba(0,0,0,' + ((1 - p) * 0.6) + ')'; ctx.fillRect(W - bw, 0, bw, H); ctx.restore();
      return;
    }
    if (ef === 'iris') {
      ctx.drawImage(A, 0, 0);
      var r = Math.sqrt(W * W + H * H) / 2 * p;
      ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
      return;
    }
    if (ef === 'cortina') {
      ctx.drawImage(A, 0, 0);
      var hh = H / 2 * p;
      ctx.save(); ctx.beginPath(); ctx.rect(0, H / 2 - hh, W, hh); ctx.rect(0, H / 2, W, hh); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
      return;
    }
    if (ef === 'persiana') {
      ctx.drawImage(A, 0, 0);
      var nb = 7, sh = H / nb, ab = sh * p;
      ctx.save(); ctx.beginPath(); for (var k = 0; k < nb; k++) ctx.rect(0, k * sh, W, ab); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
      return;
    }
    if (ef === 'blur') {
      ctx.save(); ctx.globalAlpha = 1 - p; ctx.filter = 'blur(' + (p * 14).toFixed(1) + 'px)'; ctx.drawImage(A, 0, 0); ctx.restore();
      ctx.save(); ctx.globalAlpha = p; ctx.filter = 'blur(' + ((1 - p) * 14).toFixed(1) + 'px)'; ctx.drawImage(B, 0, 0); ctx.restore();
      ctx.filter = 'none';
      return;
    }
    if (ef === 'luz') {
      ctx.globalAlpha = 1 - p; ctx.drawImage(A, 0, 0); ctx.globalAlpha = p; ctx.drawImage(B, 0, 0); ctx.globalAlpha = 1;
      var lx = (p * 1.6 - 0.3) * W, bw2 = W * 0.35;
      var g = ctx.createLinearGradient(lx, 0, lx + bw2, H);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(255,255,255,' + (0.55 * Math.sin(p * Math.PI)) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
      return;
    }
    if (ef === 'volteo') {
      // giro 3D: la tarjeta A se cierra sobre su eje y la B se abre
      if (p < 0.5) {
        var wa = W * (1 - p * 2);
        ctx.save(); ctx.translate((W - wa) / 2, 0);
        ctx.drawImage(A, 0, 0, W, H, 0, 0, wa, H);
        ctx.fillStyle = 'rgba(0,0,0,' + (p * 0.5) + ')'; ctx.fillRect(0, 0, wa, H); ctx.restore();
      } else {
        var wb = W * ((p - 0.5) * 2);
        ctx.save(); ctx.translate((W - wb) / 2, 0);
        ctx.drawImage(B, 0, 0, W, H, 0, 0, wb, H);
        ctx.fillStyle = 'rgba(0,0,0,' + ((1 - p) * 0.5) + ')'; ctx.fillRect(0, 0, wb, H); ctx.restore();
      }
      return;
    }
    if (ef === 'empuje') {
      // empuje vertical: A sube y sale, B entra empujando desde abajo
      ctx.drawImage(A, 0, -p * H);
      ctx.drawImage(B, 0, (1 - p) * H);
      return;
    }
    if (ef === 'desvanecer') {
      // fundido cruzado suave (dissolve), muy elegante y neutro
      ctx.globalAlpha = 1 - p; ctx.drawImage(A, 0, 0);
      ctx.globalAlpha = p; ctx.drawImage(B, 0, 0);
      ctx.globalAlpha = 1;
      return;
    }
    if (ef === 'giro') {
      // A se va girando y encogiendo, B llega girando y creciendo
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.globalAlpha = 1 - p;
      ctx.rotate(p * 0.35); var sa = 1 - p * 0.25; ctx.scale(sa, sa);
      ctx.drawImage(A, -W / 2, -H / 2); ctx.restore();
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.globalAlpha = p;
      ctx.rotate((p - 1) * 0.35); var sb = 0.75 + p * 0.25; ctx.scale(sb, sb);
      ctx.drawImage(B, -W / 2, -H / 2); ctx.restore();
      ctx.globalAlpha = 1;
      return;
    }
    // 'desliza' (clásico): A sale por la izquierda, B entra por la derecha
    ctx.drawImage(A, -p * W, 0);
    ctx.drawImage(B, (1 - p) * W, 0);
  }

  /* Los dos botones de vídeo: el normal y el de carrusel. Se separan para que
     el manejador del clic nunca se cuele como opciones. */
  /* ═══════════════════ Animación compartida (vídeo + vista previa) ═══════════════════
     Dibuja UN fotograma del folleto animado en el lienzo que se le pase. La usan
     por igual la grabación del vídeo y el botón «▶ Ver», así que lo que se ve en
     la vista previa es exactamente lo que sale en el vídeo. Es híbrido: anima con
     vídeos, con fotos (Ken Burns) o sólo con el diseño (texto que entra). */
  function animHoja(destino, F, hs, idx, tDentro, tGlobal, carrusel, efecto, porHoja) {
    var op = conQR({ nPagina: idx + 1 });
    op.ken = true; op.t = tGlobal; op.kenAmp = 1;   // Ken Burns en las fotos
    if (!carrusel || idx === 0) {
      op.revelar = function (i) { return revelado(efecto, i, hs[idx].celdas.length, tDentro, porHoja, F); };
      op.textoRev = function (i) {
        var paso = Math.min(0.40, (porHoja * 0.45) / Math.max(1, hs[idx].celdas.length));
        var arr = 0.30 + i * paso + 0.22;   // el texto entra tras la foto
        return (tDentro - arr) / 0.8;        // más lento y suave que antes (0.5)
      };
    }
    M.pintar(destino, F.w, F.h, hs[idx], op);
  }

  function animOpts(carrusel, F, porHoja) {
    var ocA = document.createElement('canvas'), ocB = document.createElement('canvas');
    ocA.width = ocB.width = F.w; ocA.height = ocB.height = F.h;
    // Un único desplegable «✨ Efecto del vídeo» decide todo. Los valores con
    // prefijo «t_» son transiciones entre tarjetas (carrusel); el resto son
    // revelados de cómo aparece cada tarjeta. Se enruta cada uno a su motor y
    // el aspecto complementario usa un valor por defecto elegante, de modo que
    // cualquier efecto de la lista funciona tanto en el vídeo normal como en el
    // carrusel.
    var sel  = val('fpEfecto') || 'uno_a_uno';
    var esTr = sel.indexOf('t_') === 0;
    return {
      carrusel: carrusel,
      efecto: esTr ? 'fundido' : sel,             // revelado por tarjeta
      efCar:  esTr ? sel.slice(2) : 'desvanecer', // transición entre tarjetas
      porHoja: porHoja,
      // Transición entre tarjetas (cubo, iris, luz…): más lenta y fluida que antes
      // (antes tope 0.55 s, se sentía brusca). Nunca ocupa más de ~40% de la
      // tarjeta, y nunca es tan corta que parezca un salto seco.
      PASO: Math.min(porHoja * 0.45, Math.max(0.9, Math.min(1.6, porHoja * 0.40))),
      ocA: ocA, ocB: ocB, octxA: ocA.getContext('2d'), octxB: ocB.getContext('2d')
    };
  }

  function animFotograma(ctx, F, hs, t, o) {
    var iHoja = Math.min(hs.length - 1, Math.floor(t / o.porHoja));
    var tHoja = t - iHoja * o.porHoja;
    var queda = o.porHoja - tHoja;
    if (o.carrusel && iHoja < hs.length - 1 && queda < o.PASO) {
      // las dos tarjetas se componen con la transición elegida (cubo, iris…)
      var q = 1 - queda / o.PASO;
      var e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
      o.octxA.clearRect(0, 0, F.w, F.h); animHoja(o.octxA, F, hs, iHoja, tHoja, t, o.carrusel, o.efecto, o.porHoja);
      o.octxB.clearRect(0, 0, F.w, F.h); animHoja(o.octxB, F, hs, iHoja + 1, o.porHoja, t, o.carrusel, o.efecto, o.porHoja);
      ctx.clearRect(0, 0, F.w, F.h); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, F.w, F.h);
      transicionCarrusel(ctx, o.ocA, o.ocB, e, F.w, F.h, o.efCar);
    } else {
      animHoja(ctx, F, hs, iHoja, tHoja, t, o.carrusel, o.efecto, o.porHoja);
    }
  }

  /* ── Botón «▶ Ver»: reproduce la animación en la vista previa, en bucle, sin
       grabar nada, para revisar cómo queda antes de descargar el vídeo. ── */
  var animPrev = null;
  function pararPreviewAnim() {
    if (!animPrev) return;
    try { cancelAnimationFrame(animPrev.raf); } catch (e) {}
    animPrev = null;
    var b1 = $('fpVerVideo'), b2 = $('fpVerCarrusel');
    if (b1) b1.textContent = '▶ Ver';
    if (b2) b2.textContent = '▶ Ver';
    repintar();          // restaura la vista previa fija normal
    arrancarBucle();     // y si hay vídeos, que vuelvan a moverse
  }
  function verAnimacion(carrusel) {
    if (!listo) return;
    if (animPrev) { var eraCar = animPrev.carrusel; pararPreviewAnim(); if (eraCar === carrusel) return; }
    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduce) { estado('Tu dispositivo pide menos animación; se muestra el folleto fijo.', 'proc'); return; }

    var hs = carrusel ? tarjetasCarrusel() : hojas();
    var F = M.FORMATOS[hs[0].formato] || M.FORMATOS.a4v;
    var cv = $('fpLienzo');
    cv.width = F.w; cv.height = F.h;
    cv.style.width = (F.w > F.h ? 400 : 320) + 'px';
    var ctx = cv.getContext('2d');
    // La vista previa no capta voz, pero usa el mismo ritmo pausado que el vídeo
    // final (mínimo por tarjeta) para que lo que se ve aquí sea lo que se graba.
    var dur = Math.max(4, parseFloat(val('fpDur')) || 12);
    if (carrusel) dur = Math.max(dur, hs.length * MIN_POR_TARJETA);
    dur = Math.min(TOPE_SEG_VIDEO, dur);
    var o = animOpts(carrusel, F, dur / hs.length);

    var btn = carrusel ? $('fpVerCarrusel') : $('fpVerVideo');
    if (btn) btn.textContent = '■ Parar';
    estado('▶ Así se moverá el vídeo. Cuando te guste, dale a 🎬 para descargarlo.', 'done');
    var t0 = performance.now();
    animPrev = { carrusel: carrusel, raf: 0 };
    (function paso() {
      if (!animPrev) return;
      var t = ((performance.now() - t0) / 1000) % dur;   // en bucle continuo
      animFotograma(ctx, F, hs, t, o);
      animPrev.raf = requestAnimationFrame(paso);
    })();
  }
  function verAnimacionNormal() { verAnimacion(false); }
  function verAnimacionCarrusel() { verAnimacion(true); }

  function grabarVideoNormal() { grabarVideo(false); }
  function grabarVideoCarrusel() { grabarVideo(true); }

  function grabarVideo(carrusel) {
    if (FP.grabando) { if (FP.pararGrabacion) FP.pararGrabacion(); return; }
    if (!window.MediaRecorder) { estado('Este navegador no sabe grabar vídeo. Prueba en Chrome.', 'err'); return; }
    pararPreviewAnim();   // si estaba la vista previa animada, se detiene

    var fuente = val('fpVoz') || 'texto_gratis';
    // el botón que se pulsó es el que pasa a «Detener», para poder pararlo
    var boton = carrusel ? ($('fpCarVid') || $('fpVideo')) : $('fpVideo');
    var textoBoton = carrusel ? '🎬 Descargar vídeo 3D' : '🎬 Descargar vídeo';
    function soltarBoton() { if (boton) boton.textContent = textoBoton; }

    var limpieza = [];
    function limpiar() { limpieza.forEach(function (f) { try { f(); } catch (e) {} }); limpieza = []; }
    function fallar(msg) {
      limpiar();
      FP.grabando = false;
      soltarBoton();
      estado(msg, 'err');
    }

    FP.grabando = true;
    if (boton) boton.textContent = '■ Detener';
    estado('Preparando…', 'proc');

    prepararVoz(fuente).then(function (voz) {
      // en modo carrusel el vídeo va tarjeta a tarjeta, como al pasar el dedo
      var hs = carrusel ? tarjetasCarrusel() : hojas();
      var F = M.FORMATOS[hs[0].formato] || M.FORMATOS.a4v;
      var cv = document.createElement('canvas');
      cv.width = F.w; cv.height = F.h;
      var ctx = cv.getContext('2d');
      // CLAVE PARA QUE NO SE CONGELE EL VÍDEO:
      // El navegador (sobre todo Android/tablets) deja de "pintar" —y por tanto
      // de entregar cuadros a captureStream— un canvas que no está de verdad
      // visible. Esconderlo a 1px con opacity≈0 fuera de pantalla NO basta: la
      // captura se congela tras los primeros cuadros y sale la imagen pegada con
      // el audio corriendo. Por eso el lienzo de grabación se muestra DE VERDAD,
      // centrado y a tamaño visible, mientras se graba (además sirve de vista
      // previa en vivo). Se retira al terminar. La resolución del vídeo la fija
      // cv.width/height (F.w×F.h), no el tamaño en pantalla, así que se ve
      // reducido pero se graba a plena resolución.
      // Tamaño en pantalla modesto y anclado ARRIBA-centro: se ve el vídeo
      // montándose (y así el navegador lo mantiene "pintado" y no se congela),
      // pero sin tapar los controles de abajo (el botón Detener del micrófono).
      // pointer-events:none para no bloquear ningún clic.
      var maxW = Math.min(260, (window.innerWidth || 360) * 0.6);
      var escala = Math.min(1, maxW / F.w);
      cv.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);' +
        'width:' + Math.round(F.w * escala) + 'px;height:' + Math.round(F.h * escala) + 'px;' +
        'max-width:60vw;border-radius:12px;box-shadow:0 16px 44px rgba(0,0,0,.7);' +
        'background:#000;z-index:99999;pointer-events:none;';
      document.body.appendChild(cv);
      // Cartel de "grabando" para que se entienda que hay que dejarlo quieto.
      var aviso = document.createElement('div');
      aviso.textContent = '🎬 Grabando… déjalo quieto, no cambies de pestaña';
      aviso.style.cssText = 'position:fixed;left:50%;top:' + (Math.round(F.h * escala) + 18) + 'px;' +
        'transform:translateX(-50%);background:rgba(0,0,0,.82);color:#fff;' +
        'font:600 11px system-ui,sans-serif;padding:6px 14px;border-radius:20px;' +
        'z-index:100000;pointer-events:none;white-space:nowrap;';
      document.body.appendChild(aviso);
      limpieza.push(function () { try { cv.remove(); } catch (e) {} try { aviso.remove(); } catch (e) {} });

      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var destino = ac.createMediaStreamDestination();
      var pistaAudio = null, vozEl = null;
      limpieza.push(function () { ac.close(); });

      var cadena = Promise.resolve();

      if (fuente === 'mic') {
        cadena = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } }).then(function (st) {
          limpieza.push(function () { st.getTracks().forEach(function (t) { t.stop(); }); });
          ac.createMediaStreamSource(st).connect(destino);
          pistaAudio = destino.stream.getAudioTracks()[0];
        }, function () { throw new Error('Sin permiso de micrófono no se puede narrar.'); });
      } else if (voz && voz.url) {
        vozEl = new Audio(voz.url);
        vozEl.preload = 'auto';
        limpieza.push(function () { try { vozEl.pause(); URL.revokeObjectURL(voz.url); } catch (e) {} });
        cadena = new Promise(function (ok) {
          // Se espera a conocer la DURACIÓN real (loadedmetadata), no sólo a que
          // se pueda reproducir: si se sigue sin saber la duración, el vídeo caía
          // al valor por defecto (12 s) y cortaba la narración. Margen amplio.
          vozEl.onloadedmetadata = ok; vozEl.oncanplaythrough = ok; vozEl.onerror = ok; vozEl.load();
          setTimeout(ok, 8000);
        }).then(function () {
          if (ac.state === 'suspended') return ac.resume();
        }).then(function () {
          ac.createMediaElementSource(vozEl).connect(destino);
          pistaAudio = destino.stream.getAudioTracks()[0];
        });
      }

      return cadena.then(function () {
        // La duración se decide antes de nada y la MANDA la narración: el vídeo
        // dura lo que dure la voz ENTERA (medida de forma fiable), más una cola
        // para que la última tarjeta no se corte en seco. Con esa duración se
        // programa la música para que cuadren.
        //   segVoz preferente: los segundos medidos del WAV que devuelve la
        //   captura (voz.seg) son de fiar; vozEl.duration es el respaldo.
        var segVoz = 0;
        if (voz && voz.seg && isFinite(voz.seg)) segVoz = voz.seg;
        else if (vozEl && vozEl.duration && isFinite(vozEl.duration)) segVoz = vozEl.duration;

        var dur;
        if (segVoz > 0) {
          dur = segVoz + COLA_FIN;                       // la voz completa manda
        } else if (vozEl) {
          // Hay voz pero aún no se conoce su duración (audio subido o voz de
          // estudio con metadatos lentos). Antes caía a 12 s y CORTABA la
          // narración: ahora se usa el tope amplio y manda el evento 'ended'
          // de la voz (más abajo), así el vídeo nunca corta la locución.
          dur = TOPE_SEG_VIDEO;
        } else {
          dur = Math.max(4, parseFloat(val('fpDur')) || 12);
        }
        // Pase lo que pase, cada tarjeta del carrusel necesita su tiempo mínimo
        // para poder leerse/oírse con calma (nada de divisiones demasiado cortas).
        if (carrusel) dur = Math.max(dur, hs.length * MIN_POR_TARJETA);
        dur = Math.min(TOPE_SEG_VIDEO, dur);             // tope de seguridad amplio

        // música gratis: suena por debajo de la voz (0.32) o sola (0.9) si no
        // hay voz. Se enchufa al mismo destino que se graba, así entra en el MP4
        var melId = val('fpMusica');
        if (melId && melId !== 'none' && MEL && MEL[melId]) {
          if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
          var musica = crearMezclaMusica(ac, destino, MEL[melId], dur + 0.3, pistaAudio ? 0.32 : 0.9);
          limpieza.push(function () { try { musica.stop(); } catch (e) {} });
          if (!pistaAudio) pistaAudio = destino.stream.getAudioTracks()[0];
        }

        // Si el navegador sabe empujar cuadros a mano (Chromium/Android), se usa
        // captureStream(0) = captura MANUAL: cada cuadro pintado se empuja con
        // requestFrame(), así ni uno se pierde y no depende de que el navegador
        // decida "refrescar" el canvas (que es lo que fallaba y congelaba la
        // imagen). Si no lo soporta (Safari/iOS), se usa captura automática a 30.
        var soportaManual = false;
        try {
          soportaManual = !!(window.CanvasCaptureMediaStreamTrack &&
            window.CanvasCaptureMediaStreamTrack.prototype &&
            typeof window.CanvasCaptureMediaStreamTrack.prototype.requestFrame === 'function');
        } catch (e) {}
        var flujo = soportaManual ? cv.captureStream(0) : cv.captureStream(30);
        var pistaVideo = flujo.getVideoTracks()[0];
        // Empuja un cuadro a mano cuando el navegador lo permite: así ni un
        // fotograma se pierde y la imagen no se queda pegada.
        var empujarCuadro = (pistaVideo && typeof pistaVideo.requestFrame === 'function')
          ? function () { try { pistaVideo.requestFrame(); } catch (e) {} }
          : function () {};
        if (pistaAudio) flujo.addTrack(pistaAudio);

        // «Automático» usa WebM primero: el codificador MP4 de Chrome en móvil
        // suele grabar sólo el primer cuadro y dejar el resto negro, mientras
        // que el WebM de Chromium es fiable en Android/PC. En iPhone (Safari)
        // no hay WebM, así que ahí cae a MP4, que Safari sí graba bien.
        // Si la dueña pide MP4 (para la app de Instagram), se intenta MP4 antes
        // —ya con el canvas en el DOM y requestFrame no debería salir negro— y
        // se deja WebM de respaldo por si el navegador no sabe grabar MP4.
        var listaMp4 = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4'];
        var listaWebm = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
        var quiereMp4 = val('fpVidFormato') === 'mp4';
        var candidatos = quiereMp4 ? listaMp4.concat(listaWebm) : listaWebm.concat(listaMp4);
        var mime = '';
        candidatos.some(function (m) {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) { mime = m; return true; }
          return false;
        });
        var rec = mime ? new MediaRecorder(flujo, { mimeType: mime, videoBitsPerSecond: 5000000 })
                       : new MediaRecorder(flujo);
        var trozos = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };

        var porHoja = dur / hs.length;
        var t0 = 0;                 // se fija al arrancar la grabación (reloj alineado)
        var pedido = null;
        // La voz avisa cuando termina: el vídeo se para poco después (COLA_FIN),
        // así la locución nunca queda cortada aunque no se supiera su duración.
        var vozAcabo = false, tVozFin = 0;

        rec.onstop = function () {
          limpiar();
          FP.grabando = false;
          soltarBoton();
          var tipo = (mime && mime.indexOf('mp4') >= 0) ? 'mp4' : 'webm';
          var blob = new Blob(trozos, { type: mime || 'video/webm' });
          bajar((carrusel ? 'carrusel_' : 'folleto_') + hoy() + '.' + tipo, URL.createObjectURL(blob));
          estado('✓ Vídeo descargado' + (tipo === 'webm'
            ? ' en WebM. Va bien en Android; si en iPhone no se ve, mándalo por Drive en vez de por WhatsApp.'
            : ' en MP4, listo para WhatsApp e Instagram.'), 'done');
          arrancarBucle();
        };

        FP.pararGrabacion = function () {
          if (pedido) cancelAnimationFrame(pedido);
          try { if (rec.state !== 'inactive') rec.stop(); } catch (e) {}
        };

        rec.start();
        // El reloj de la animación arranca JUNTO con la grabación (antes se fijaba
        // durante el montaje del MediaRecorder y el vídeo iba por delante del audio).
        t0 = performance.now();
        if (vozEl) {
          vozEl.onended = function () { vozAcabo = true; tVozFin = (performance.now() - t0) / 1000; };
          vozEl.play().catch(function () {});
        }
        estado(fuente === 'mic' ? '● Grabando · habla ahora y pulsa Detener al terminar.' : '🎬 Grabando el vídeo…', 'proc');

        // el MISMO motor de animación que usa el botón «▶ Ver» (WYSIWYG)
        var oAnim = animOpts(carrusel, F, porHoja);

        (function pintar() {
          var t = (performance.now() - t0) / 1000;
          animFotograma(ctx, F, hs, t, oAnim);

          // Momento de parada efectivo: el MENOR de la duración calculada y el
          // fin real de la voz (+cola). En carrusel, nunca antes de mostrar todas
          // las tarjetas (su tiempo mínimo), para no cortar el pase. Con el micro,
          // hasta el tope de seguridad o hasta que se pulse Detener a mano.
          var stopT;
          if (fuente === 'mic') {
            stopT = TOPE_SEG_VIDEO;
          } else {
            var minCar = carrusel ? hs.length * MIN_POR_TARJETA : 0;
            var limVoz = vozAcabo ? Math.max(tVozFin + COLA_FIN, minCar) : Infinity;
            stopT = Math.min(dur, limVoz);
          }

          // Cierre profesional: entra desde negro y termina fundiendo a negro,
          // para que el vídeo abra y cierre suave en vez de cortar en seco.
          var FADE = 0.6;
          var aFade = 0;
          if (t < FADE) aFade = 1 - t / FADE;                                           // apertura
          else if (fuente !== 'mic' && t > stopT - FADE) aFade = Math.min(1, (t - (stopT - FADE)) / FADE); // cierre
          if (aFade > 0) {
            ctx.save(); ctx.globalAlpha = aFade; ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, F.w, F.h); ctx.restore();
          }
          empujarCuadro();
          // NO se para en cuanto la voz termina: se deja la cola (COLA_FIN) para
          // que la última tarjeta respire y la narración nunca quede cortada.
          if (t >= stopT) { FP.pararGrabacion(); return; }
          pedido = requestAnimationFrame(pintar);
        })();
      });
    }).catch(function (e) {
      fallar(e && e.message ? e.message : 'No se pudo hacer el vídeo.');
    });
  }

  /* ═══════════════════ Arranque ═══════════════════ */

  function enlazar() {
    ['fpRejilla', 'fpFormato', 'fpTema', 'fpRubro', 'fpTono'].forEach(function (id) {
      $(id).addEventListener('change', function () {
        pararPreviewAnim();   // un cambio de diseño detiene la vista previa animada
        if (id === 'fpTema') FP.coloresManuales = null;
        if (id === 'fpRejilla') {
          // al pasar a una cuadrícula con más huecos, los nuevos se rellenan
          // solos: nunca deben quedarse en blanco delante de la alumna
          var n = nCuadros(), faltaban = FP.pagina.celdas.length < n;
          while (FP.pagina.celdas.length < n) FP.pagina.celdas.push({ titulo: '', texto: '', precio: '', etiqueta: '', media: null });
          if (faltaban) { rellenarVacias(); return; }
          pintarCeldas();
        }
        repintar();
      });
    });
    ['fpMarca', 'fpTitulo', 'fpSub', 'fpContacto', 'fpCta'].forEach(function (id) {
      $(id).addEventListener('input', repintar);
    });
    ['fpAGrano', 'fpAVineta', 'fpAFiletes', 'fpASombras'].forEach(function (id) {
      $(id).addEventListener('change', repintar);
    });
    ['fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2'].forEach(function (k) {
      $('fpC_' + k).addEventListener('input', function () {
        FP.coloresManuales = {};
        ['fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2'].forEach(function (j) {
          FP.coloresManuales[j] = $('fpC_' + j).value;
        });
        repintar();
      });
    });

    $('fpVolverTema').addEventListener('click', function () { FP.coloresManuales = null; repintar(); });
    $('fpDado').addEventListener('click', function () {
      // gira el tono manteniendo la armonía: nunca saca colores que chocan
      var base = M.colores({ tema: val('fpTema') });
      var giro = Math.floor(Math.random() * 360);
      function rotar(hex, extra) {
        var c = hex.replace('#', '');
        if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
        var r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255;
        var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
        var h = 0, s = 0, l = (mx + mn) / 2;
        if (d) {
          s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
          h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4);
          h *= 60;
        }
        h = (h + giro + (extra || 0)) % 360;
        function f(n) {
          var k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
          var v = l - a * Math.max(-1, Math.min(Math.min(k - 3, 9 - k), 1));
          return ('0' + Math.round(v * 255).toString(16)).slice(-2);
        }
        return '#' + f(0) + f(8) + f(4);
      }
      FP.coloresManuales = {
        fondo: rotar(base.fondo), panel: rotar(base.panel), tinta: base.tinta,
        tinta2: base.tinta2, acento: rotar(base.acento), acento2: rotar(base.acento2, 18)
      };
      repintar();
    });

    if (DIS && $('fpDiseno')) {
      $('fpDiseno').addEventListener('change', function () {
        pararPreviewAnim();
        var id = val('fpDiseno');
        if (id) aplicarDiseno(id);
      });
    }
    if ($('fpMusPrev')) $('fpMusPrev').addEventListener('click', previewMusica);
    if ($('fpMusica')) $('fpMusica').addEventListener('change', pararPreview);

    // QR: se regenera al marcar la casilla y al dejar de escribir el número
    if ($('fpQR')) $('fpQR').addEventListener('change', generarQR);
    if ($('fpTel')) {
      var tQR = null;
      $('fpTel').addEventListener('input', function () {
        clearTimeout(tQR);
        tQR = setTimeout(generarQR, 500);   // sin esto se regenera en cada tecla
      });
    }

    $('fpEscribir').addEventListener('click', function () { escribirSolo(false); });
    $('fpOtra').addEventListener('click', function () { escribirSolo(true); });
    $('fpAddPag').addEventListener('click', añadirPagina);
    if ($('fpDisGuardar')) $('fpDisGuardar').addEventListener('click', guardarDiseno);
    $('fpPNG').addEventListener('click', descargarPNG);
    $('fpPDF').addEventListener('click', descargarPDF);
    $('fpWeb').addEventListener('click', descargarWeb);
    $('fpVideo').addEventListener('click', grabarVideoNormal);
    if ($('fpVerVideo')) $('fpVerVideo').addEventListener('click', verAnimacionNormal);
    if ($('fpCarImg')) $('fpCarImg').addEventListener('click', descargarCarrusel);
    if ($('fpCarVid')) $('fpCarVid').addEventListener('click', grabarVideoCarrusel);
    if ($('fpVerCarrusel')) $('fpVerCarrusel').addEventListener('click', verAnimacionCarrusel);
    ['fpCarFormato', 'fpCarUno', 'fpCarPortada'].forEach(function (id) {
      if ($(id)) $(id).addEventListener('change', function () { pararPreviewAnim(); contarCarrusel(); });
    });
    $('fpVoz').addEventListener('change', function () {
      var v = val('fpVoz');
      try { speechSynthesis.cancel(); } catch (e) {}
      if (probandoVoz) { probandoVoz = false; var pb = $('fpVozProbar'); if (pb) pb.textContent = '▶ Probar'; }
      $('fpAudioRow').style.display = (v === 'audio') ? 'flex' : 'none';
      $('fpGuionRow').style.display = (v === 'texto_gratis' || v === 'texto_pro') ? 'flex' : 'none';
      $('fpVozGratisPanel').style.display = (v === 'texto_gratis') ? 'block' : 'none';
    });
    $('fpGuion').addEventListener('input', function () { FP.pagina.guion = $('fpGuion').value; });

    // Player de voces gratis
    if ($('fpVozProbar')) $('fpVozProbar').addEventListener('click', probarVoz);
    if ($('fpVozVel')) $('fpVozVel').addEventListener('input', function () {
      var e = $('fpVozVelN'); if (e) e.textContent = (parseFloat(this.value) || 1).toFixed(1) + '×';
    });
    if ($('fpVozTono')) $('fpVozTono').addEventListener('input', function () {
      var e = $('fpVozTonoN'); if (e) e.textContent = (parseFloat(this.value) || 1).toFixed(1);
    });
    if ('speechSynthesis' in window && speechSynthesis.addEventListener) {
      // addEventListener, no .onvoiceschanged: así no se pisa el de Flyers
      speechSynthesis.addEventListener('voiceschanged', cargarVocesFolleto);
    }
  }

  function abrir() {
    if (listo) { repintar(); arrancarBucle(); return; }

    M = window.FOLLETO_MOTOR;
    CB = window.FOLLETO_CEREBRO;
    DIS = window.FOLLETO_DISENOS || null;                          // opcional
    MEL = (typeof FL_MELODIES !== 'undefined') ? FL_MELODIES : null; // de Flyers
    NOTE = (typeof FL_NOTE !== 'undefined') ? FL_NOTE : null;
    var caja = document.getElementById('tab-folleto');
    if (!caja) return;
    if (!M || !CB) {
      caja.innerHTML = '<div class="panel"><div class="p-title">📰 Folletos Pro</div>' +
        '<div class="st err">No se han podido cargar los archivos del folleto ' +
        '(b6_folleto_motor.js y b6_folleto_cerebro.js). Recarga la página.</div></div>';
      return;
    }

    FP.pagina = paginaVacia(4);
    if (!construir()) return;
    listo = true;
    // los desplegables se ponen donde dice el estado, no donde caiga la 1ª
    // opción de la lista: si no, arranca en 2 cuadros y descuadra todo
    $('fpRejilla').value = FP.pagina.rejilla;
    $('fpFormato').value = FP.pagina.formato;
    $('fpTema').value = FP.pagina.tema;
    $('fpRubro').value = FP.pagina.rubro;
    $('fpTono').value = FP.pagina.tono;
    pintarCeldas();
    llenarMusica();
    enlazar();
    // las fuentes premium llegan por red: al estar listas se redibuja para que
    // la vista previa muestre ya la tipografía del tema, no la de reserva
    try {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { repintar(); });
      setTimeout(repintar, 700);
    } catch (e) {}
    // la voz por defecto es la gratis: se muestra el player y se cargan las voces
    // (a veces llegan tarde; el listener 'voiceschanged' las repone solo)
    if ($('fpVozGratisPanel')) $('fpVozGratisPanel').style.display = 'block';
    cargarVocesFolleto();
    setTimeout(cargarVocesFolleto, 400);
    $('fpMarca').value = FP.pagina.cabecera.marca;
    $('fpTitulo').value = FP.pagina.cabecera.titulo;
    $('fpCta').value = FP.pagina.pie.cta;
    pintarPaginas();
    pintarDisenos();
    escribirSolo(false);   // arranca con textos de ejemplo, para que no salga en blanco
    contarCarrusel();
    estado('Pon tus fotos en los huecos y cambia los precios. Nada de esto gasta créditos.', 'done');
  }

  window.fpOpen = abrir;

  /* Si la pestaña ya está abierta al cargar (o alguien la abre sin pasar por
     switchMain), se construye igual. Cargar el archivo suelto no hace nada. */
  function vigilar() {
    var t = document.getElementById('tab-folleto');
    if (t && t.classList.contains('act')) abrir();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', vigilar);
  else vigilar();
})();
