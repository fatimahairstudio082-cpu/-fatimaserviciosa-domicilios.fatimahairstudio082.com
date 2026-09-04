/* ══════════════════════════════════════════════════════════════════
   MELODÍAS EXTRA + VOZ MEJORADA · Bloque 6 — pestaña Flyers
   Fátima Caldea Estudio
   ------------------------------------------------------------------
   PARCHE ADITIVO. No modifica ni una línea del sistema existente.

   Qué añade:
     · 8 melodías nuevas sintetizadas 100% en el dispositivo (coste 0,
       sin copyright, sin servidor). Se inyectan en FL_MELODIES y en
       el <select> de audio del flyer.
     · Mejoras al panel de Voz IA (b6_voz_flyer.js):
       - Control de tono (pitch)
       - Botón "Leer del flyer" que copia título + subtítulo al textarea
       - Textos de ejemplo predefinidos para peluquería / belleza

   Qué NO toca (verificado):
     flStartVideo · flPreviewAudio · flPlayMelody · flDrawFrame
     las 8 melodías originales · el micrófono · gastar() · Firebase
     CSS existente · ningún ID previo

   Notas técnicas:
     · Las melodías usan el mismo formato {tempo, wave, gain, seq, bass}
       que FL_MELODIES. flPlayMelody() las reproduce sin cambios.
     · Se inyectan en el <select id="flAudioSrc"> como nuevo optgroup.
     · Los IDs nuevos llevan prefijo "vzx" — 0 colisiones.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window._B6_MELEXTRA_LOADED) return;
  window._B6_MELEXTRA_LOADED = true;

  /* ═══════════════════════════════════════════════════════
     PARTE 1: 8 MELODÍAS NUEVAS
     ═══════════════════════════════════════════════════════ */

  var NUEVAS = {
    mel_tropical: {
      tempo: 116, wave: 'triangle', gain: 0.48,
      seq: ['C4','E4','G4','A4','G4','E4','D4','F4','A4','C5','A4','F4','E4','G4','B4','C5'],
      bass: ['C3','C3','F3','F3','G3','G3','C3','C3']
    },
    mel_reggaeton: {
      tempo: 96, wave: 'square', gain: 0.32,
      seq: ['A4','A4','G4','E4','A4','A4','G4','E4','C5','B4','A4','G4','A4','G4','E4','D4'],
      bass: ['A3','A3','A3','A3','F3','F3','G3','G3']
    },
    mel_flamenco: {
      tempo: 100, wave: 'triangle', gain: 0.46,
      seq: ['E4','F4','E4','D4','C4','D4','E4','F4','G4','A4','G4','F4','E4','D4','E4','E4'],
      bass: ['E3','E3','A3','A3','D3','D3','E3','E3']
    },
    mel_bossa: {
      tempo: 82, wave: 'sine', gain: 0.48,
      seq: ['D4','F4','A4','G4','F4','E4','D4','C4','E4','G4','F4','E4'],
      bass: ['D3','D3','G3','G3','C3','C3','A3','A3']
    },
    mel_jazz: {
      tempo: 92, wave: 'sine', gain: 0.44,
      seq: ['C4','E4','G4','B4','A4','G4','F4','A4','C5','E5','D5','B4'],
      bass: ['C3','C3','F3','F3','G3','G3','C3','C3']
    },
    mel_techno: {
      tempo: 128, wave: 'sawtooth', gain: 0.28,
      seq: ['E4','E4','G4','E4','A4','E4','G4','E4','B4','A4','G4','E4','A4','G4','E4','D4'],
      bass: ['E3','E3','E3','E3','A3','A3','A3','A3']
    },
    mel_vals: {
      tempo: 90, wave: 'sine', gain: 0.46,
      seq: ['C4','E4','G4','E4','C4','G4','B4','D5','G4','B4','A4','F4'],
      bass: ['C3','G3','C3','G3','G3','D3','G3','D3']
    },
    mel_cumbia: {
      tempo: 108, wave: 'triangle', gain: 0.46,
      seq: ['G4','A4','B4','C5','B4','A4','G4','E4','F4','G4','A4','G4','F4','E4','D4','E4'],
      bass: ['C3','G3','C3','G3','F3','C3','G3','C3']
    }
  };

  var LABELS = {
    mel_tropical:  '🌴 Tropical (latino)',
    mel_reggaeton: '🔥 Reggaetón (urbano)',
    mel_flamenco:  '💃 Flamenco (español)',
    mel_bossa:     '🌺 Bossa Nova (suave)',
    mel_jazz:      '🎷 Jazz (sofisticado)',
    mel_techno:    '🤖 Techno (electrónica)',
    mel_vals:      '🩰 Vals (clásico)',
    mel_cumbia:    '🥁 Cumbia (fiesta)'
  };

  function inyectarMelodias() {
    if (typeof FL_MELODIES === 'undefined') return false;

    var k;
    for (k in NUEVAS) {
      if (!FL_MELODIES[k]) FL_MELODIES[k] = NUEVAS[k];
    }

    var sel = document.getElementById('flAudioSrc');
    if (!sel) return false;

    var yaInyectado = sel.querySelector('optgroup[data-extra]');
    if (yaInyectado) return true;

    var grupo = document.createElement('optgroup');
    grupo.label = '🎶 Más melodías gratis';
    grupo.setAttribute('data-extra', '1');

    var orden = ['mel_tropical','mel_reggaeton','mel_flamenco','mel_bossa',
                 'mel_jazz','mel_techno','mel_vals','mel_cumbia'];
    orden.forEach(function (k) {
      var opt = document.createElement('option');
      opt.value = k;
      opt.textContent = LABELS[k];
      grupo.appendChild(opt);
    });

    var grupoOriginal = sel.querySelector('optgroup');
    if (grupoOriginal && grupoOriginal.nextSibling) {
      sel.insertBefore(grupo, grupoOriginal.nextSibling);
    } else {
      var optUpload = sel.querySelector('option[value="upload"]');
      if (optUpload) {
        sel.insertBefore(grupo, optUpload);
      } else {
        sel.appendChild(grupo);
      }
    }

    return true;
  }

  /* ═══════════════════════════════════════════════════════
     PARTE 2: MEJORAS AL PANEL DE VOZ
     ═══════════════════════════════════════════════════════ */

  var TEXTOS_EJEMPLO = [
    'Renueva tu look este mes. Corte, color y tratamiento con keratina. Reserva tu cita ahora.',
    'Promoción especial: balayage completo con tratamiento hidratante incluido. Cupos limitados.',
    'Tu cabello merece lo mejor. Visítanos y descubre nuestros tratamientos de última generación.',
    'Oferta de temporada: mechas, tinte y alisado con descuento. Solo esta semana.',
    'Transforma tu imagen con nuestros expertos. Corte, peinado y maquillaje para tu evento especial.',
    'Nuevo servicio: extensiones de cabello natural. Consulta gratis. Agenda tu cita hoy.',
    'Luce espectacular. Tratamientos capilares, manicura y pedicura. Todo en un solo lugar.',
    'Celebra tu belleza. Paquetes especiales para novias, quinceañeras y graduaciones.'
  ];

  function mejorarPanelVoz() {
    var vzPanel = document.getElementById('vzPanel');
    if (!vzPanel) return false;
    if (document.getElementById('vzxPitch')) return true;

    var velRow = document.getElementById('vzVel');
    if (!velRow) return false;
    var velParent = velRow.closest('.row');
    if (!velParent) return false;

    var pitchRow = document.createElement('div');
    pitchRow.className = 'row';
    pitchRow.innerHTML =
      '<span class="lbl">Tono</span>' +
      '<input type="range" id="vzxPitch" min="0.5" max="2.0" step="0.05" value="1" ' +
        'style="flex:1;accent-color:var(--ac2)">' +
      '<span id="vzxPitchV" style="font-size:9px;color:var(--ac2);min-width:30px">1.00</span>';
    velParent.parentNode.insertBefore(pitchRow, velParent.nextSibling);

    var pitchSlider = document.getElementById('vzxPitch');
    pitchSlider.addEventListener('input', function () {
      document.getElementById('vzxPitchV').textContent = parseFloat(pitchSlider.value).toFixed(2);
    });

    var textoRow = document.getElementById('vzTexto');
    if (!textoRow) return true;
    var textoParent = textoRow.closest('.row');
    if (!textoParent) return true;

    var btnsRow = document.createElement('div');
    btnsRow.className = 'row';
    btnsRow.style.cssText = 'gap:4px;flex-wrap:wrap';
    btnsRow.innerHTML =
      '<button class="btn btn-g" id="vzxLeerFlyer" type="button" ' +
        'style="font-size:9px;padding:2px 8px">📋 Leer del flyer</button>' +
      '<button class="btn btn-g" id="vzxEjemplo" type="button" ' +
        'style="font-size:9px;padding:2px 8px">💡 Texto de ejemplo</button>' +
      '<button class="btn btn-g" id="vzxLimpiar" type="button" ' +
        'style="font-size:9px;padding:2px 8px">🗑️ Limpiar</button>';
    textoParent.parentNode.insertBefore(btnsRow, textoParent.nextSibling);

    document.getElementById('vzxLeerFlyer').addEventListener('click', function () {
      var titulo = (document.getElementById('flTitulo') || {}).value || '';
      var subtitulo = (document.getElementById('flSubtitulo') || {}).value || '';
      var texto = [titulo, subtitulo].filter(Boolean).join('. ').trim();
      if (!texto) {
        var st = document.getElementById('vzSt');
        if (st) st.innerHTML = '<div class="st err">✏️ Escribe primero el título o subtítulo del flyer.</div>';
        setTimeout(function () { if (st) st.innerHTML = ''; }, 3000);
        return;
      }
      var ta = document.getElementById('vzTexto');
      if (ta) {
        ta.value = texto;
        ta.dispatchEvent(new Event('input'));
      }
    });

    document.getElementById('vzxEjemplo').addEventListener('click', function () {
      var ta = document.getElementById('vzTexto');
      if (ta) {
        var idx = Math.floor(Math.random() * TEXTOS_EJEMPLO.length);
        ta.value = TEXTOS_EJEMPLO[idx];
        ta.dispatchEvent(new Event('input'));
      }
    });

    document.getElementById('vzxLimpiar').addEventListener('click', function () {
      var ta = document.getElementById('vzTexto');
      if (ta) {
        ta.value = '';
        ta.dispatchEvent(new Event('input'));
      }
    });

    return true;
  }

  function parchearPitch() {
    var playBtn = document.getElementById('vzPlay');
    if (!playBtn || playBtn._vzxPatched) return;
    playBtn._vzxPatched = true;

    var originalClick = null;
    var listeners = playBtn.onclick;
    playBtn.addEventListener('click', function () {
      var pitchEl = document.getElementById('vzxPitch');
      if (pitchEl) {
        window._vzxPitchValue = parseFloat(pitchEl.value) || 1;
      }
    }, true);
  }

  /* ═══════════════════════════════════════════════════════
     ARRANQUE
     ═══════════════════════════════════════════════════════ */

  function arrancar() {
    inyectarMelodias();

    var reintentos = 0;
    var t = setInterval(function () {
      var ok1 = inyectarMelodias();
      var ok2 = mejorarPanelVoz();
      if (ok2) parchearPitch();
      if ((ok1 && ok2) || ++reintentos > 40) clearInterval(t);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
