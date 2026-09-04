/* ═════════════════════════════════════════════════════════════════
   HOJA DE EXAMEN · b6_examen.js

   Dibuja una hoja de examen imprimible sobre un canvas A4. Es papel,
   no pantalla: fondo hueso, tinta oscura, una sola familia tipográfica
   y nada que no sobreviva a una fotocopia en blanco y negro.

   Dos caras:
     'examen'     preguntas numeradas con sus casillas, para el alumno
     'correccion' respuestas correctas y el porqué, para quien corrige

   No sabe de dónde salen las preguntas: recibe un objeto y pinta.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_EXAMEN) return;
  window._B6_EXAMEN = true;

  /* A4 a 96 ppp aproximados. La hoja se dibuja siempre a este tamaño y
     el que la muestra la escala; así el texto nunca cambia de cuerpo. */
  var A4 = { w: 794, h: 1123 };

  var T = {
    papel: '#FBF9F4',
    tinta: '#1C1B22',
    suave: '#5A5866',
    linea: '#C9C4BA',
    marca: '#7C3AED',
    acierto: '#1F7A4C',
    fallo: '#B0263F'
  };

  var F = function (peso, px) {
    return peso + ' ' + px + 'px Georgia, "Times New Roman", serif';
  };
  var FS = function (peso, px) {
    return peso + ' ' + px + 'px system-ui, -apple-system, sans-serif';
  };

  /* Parte un texto en líneas que caben en un ancho. Devuelve las líneas
     para que quien llama decida dónde y cuánto pinta. */
  function partir(x, txt, ancho) {
    var pal = String(txt || '').split(/\s+/), out = [], act = '';
    for (var i = 0; i < pal.length; i++) {
      var t = act ? act + ' ' + pal[i] : pal[i];
      if (x.measureText(t).width > ancho && act) { out.push(act); act = pal[i]; }
      else act = t;
    }
    if (act) out.push(act);
    return out;
  }

  function escribir(x, txt, px, py, ancho, alto) {
    var L = partir(x, txt, ancho), i;
    for (i = 0; i < L.length; i++) x.fillText(L[i], px, py + i * alto);
    return py + L.length * alto;
  }

  function linea(x, x0, y, x1, color, grosor, punteada) {
    x.save();
    x.strokeStyle = color || T.linea;
    x.lineWidth = grosor || 1;
    if (punteada) x.setLineDash([3, 4]);
    x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.stroke();
    x.restore();
  }

  /* ─────────── Cabecera ───────────
     El encabezado de un examen real: centro, módulo, y los huecos que el
     alumno rellena a mano antes de empezar. */
  function cabecera(x, d, m, cara) {
    var y = 62;
    x.fillStyle = T.suave;
    x.font = FS('600', 10);
    x.letterSpacing = '1.6px';
    x.fillText((d.centro || 'Centro de formación profesional').toUpperCase(), m, y);
    var der = (d.modulo || 'Módulo profesional').toUpperCase();
    x.textAlign = 'right';
    x.fillText(der, A4.w - m, y);
    x.textAlign = 'left';
    x.letterSpacing = '0px';

    y += 12;
    linea(x, m, y, A4.w - m, T.tinta, 1.6);

    y += 46;
    x.fillStyle = T.tinta;
    x.font = F('normal', 27);
    y = escribir(x, d.titulo, y, y, A4.w - m * 2, 33) - 33;

    y += 28;
    x.fillStyle = T.suave;
    x.font = FS('400', 11.5);
    var sub = cara === 'correccion'
      ? 'Hoja de corrección · respuestas y criterio'
      : (d.subtitulo || 'Prueba escrita de conocimientos');
    x.fillText(sub, m, y);

    y += 22;
    if (cara === 'correccion') {
      x.fillStyle = T.marca;
      x.font = FS('700', 10);
      x.letterSpacing = '1.4px';
      x.fillText('NO ENTREGAR AL ALUMNO', m, y);
      x.letterSpacing = '0px';
      y += 14;
    } else {
      /* Los huecos de identificación. Rayas de verdad, con su rótulo
         debajo, como en cualquier hoja de examen. */
      var campos = [
        { n: 'Nombre y apellidos', w: 0.46 },
        { n: 'Grupo', w: 0.18 },
        { n: 'Fecha', w: 0.18 },
        { n: 'Nota', w: 0.10 }
      ];
      var ancho = A4.w - m * 2, hueco = 14, total = ancho - hueco * (campos.length - 1);
      var cx = m;
      campos.forEach(function (c) {
        var w = total * c.w;
        linea(x, cx, y + 12, cx + w, T.tinta, 1);
        x.fillStyle = T.suave;
        x.font = FS('400', 9);
        x.fillText(c.n, cx, y + 24);
        cx += w + hueco;
      });
      y += 34;
    }
    return y + 18;
  }

  function pie(x, d, m, cara, pag, total) {
    var y = A4.h - 44;
    linea(x, m, y, A4.w - m, T.linea, 1);
    y += 16;
    x.fillStyle = T.suave;
    x.font = FS('400', 9.5);
    x.fillText(cara === 'correccion' ? 'Corrección' : (d.instruccion || 'Marca una sola casilla por pregunta.'), m, y);
    x.textAlign = 'right';
    x.fillText('Página ' + pag + ' de ' + total, A4.w - m, y);
    x.textAlign = 'left';
  }

  /* ─────────── Una pregunta ───────────
     Devuelve la altura que ocupa sin pintar (medir = true) o la pinta.
     Medir primero es lo que permite paginar sin cortar una pregunta. */
  function pregunta(x, q, n, px, py, ancho, cara, medir) {
    var y = py, i;
    var sangria = 26;

    x.font = F('normal', 13.5);
    var L = partir(x, q.p, ancho - sangria);
    if (!medir) {
      x.fillStyle = T.tinta;
      x.font = FS('700', 13);
      x.fillText(String(n) + '.', px, y);
      x.font = F('normal', 13.5);
      for (i = 0; i < L.length; i++) x.fillText(L[i], px + sangria, y + i * 19);
    }
    y += L.length * 19 + 10;

    var op = q.o || [];
    for (i = 0; i < op.length; i++) {
      var letra = String.fromCharCode(97 + i) + ')';
      var correcta = cara === 'correccion' && i === q.c;
      x.font = FS(correcta ? '700' : '400', 12);
      var LO = partir(x, op[i], ancho - sangria - 40);
      if (!medir) {
        var cy = y - 9;
        /* La casilla: cuadrada, con esquinas vivas. En la corrección la
           correcta va marcada con una equis, no con un color de fondo,
           para que la fotocopia siga siendo legible. */
        x.save();
        x.strokeStyle = correcta ? T.acierto : T.suave;
        x.lineWidth = correcta ? 1.8 : 1.1;
        x.strokeRect(px + sangria, cy, 12, 12);
        if (correcta) {
          x.beginPath();
          x.moveTo(px + sangria + 2.5, cy + 2.5);
          x.lineTo(px + sangria + 9.5, cy + 9.5);
          x.moveTo(px + sangria + 9.5, cy + 2.5);
          x.lineTo(px + sangria + 2.5, cy + 9.5);
          x.stroke();
        }
        x.restore();
        x.fillStyle = correcta ? T.acierto : T.tinta;
        x.font = FS(correcta ? '700' : '400', 12);
        x.fillText(letra, px + sangria + 22, y);
        for (var j = 0; j < LO.length; j++) {
          x.fillText(LO[j], px + sangria + 42, y + j * 17);
        }
      }
      y += LO.length * 17 + 8;
    }

    /* El porqué solo va en la hoja de corrección: es el criterio con el
       que se explica el fallo, no un dato que se memoriza. */
    if (cara === 'correccion' && q.x) {
      y += 4;
      x.font = FS('400', 11);
      var LX = partir(x, 'Por qué: ' + q.x, ancho - sangria - 12);
      if (!medir) {
        linea(x, px + sangria, y - 12, px + sangria + 1, T.marca, 1);
        x.save();
        x.strokeStyle = T.marca; x.lineWidth = 2;
        x.beginPath();
        x.moveTo(px + sangria, y - 12);
        x.lineTo(px + sangria, y - 12 + LX.length * 16);
        x.stroke();
        x.restore();
        x.fillStyle = T.suave;
        for (var k = 0; k < LX.length; k++) {
          x.fillText(LX[k], px + sangria + 12, y + k * 16);
        }
      }
      y += LX.length * 16 + 6;
    }
    return y + 16;
  }

  /* ─────────── Reparto en páginas ───────────
     Se mide cada pregunta y se corta donde toca. Una pregunta nunca se
     parte entre dos hojas: en papel eso es un examen mal hecho. */
  function paginar(x, datos, m, cara) {
    var preguntas = datos.preguntas || [];
    var anchoU = A4.w - m * 2;
    var techo = A4.h - 76;
    var pags = [{ items: [], abierta: false }];
    var y = 250;
    preguntas.forEach(function (q, i) {
      var h = pregunta(x, q, i + 1, m, 0, anchoU, cara, true);
      if (y + h > techo && pags[pags.length - 1].items.length) {
        pags.push({ items: [], abierta: false });
        y = 92;
      }
      pags[pags.length - 1].items.push({ q: q, n: i + 1 });
      y += h;
    });

    /* La abierta necesita sitio de verdad: en el examen, el enunciado más un
       mínimo de renglones; en la corrección, el enunciado más sus puntos clave.
       Si no cabe, se va a una hoja propia en vez de quedarse apretada al pie. */
    if (datos.abierta) {
      var h2 = abierta(x, datos, m, 0, cara, true) + (cara === 'examen' ? 130 : 20);
      if (y + h2 > techo) pags.push({ items: [], abierta: true });
      else pags[pags.length - 1].abierta = true;
    }
    return pags;
  }

  /* ─────────── Pregunta abierta ───────────
     Enunciado, renglones hasta donde llegue la hoja y, en la corrección,
     los puntos que tienen que aparecer para dar la respuesta por buena. */
  function abierta(x, d, m, py, cara, medir) {
    var ancho = A4.w - m * 2;
    var y = py + 6;
    var A = d.abierta;

    if (!medir) linea(x, m, y, A4.w - m, T.linea, 1, true);
    y += 30;

    if (!medir) {
      x.fillStyle = T.suave;
      x.font = FS('700', 9.5);
      x.letterSpacing = '1.3px';
      x.fillText('PREGUNTA ABIERTA', m, y);
      x.letterSpacing = '0px';
    }
    y += 26;

    x.font = F('normal', 13.5);
    if (medir) y += partir(x, A.p, ancho).length * 19 + 14;
    else {
      x.fillStyle = T.tinta;
      y = escribir(x, A.p, m, y, ancho, 19) + 14;
    }

    if (cara === 'correccion') {
      x.font = FS('400', 11);
      if (medir) y += partir(x, 'Se da por buena si aparecen estos puntos:', ancho).length * 16 + 6;
      else {
        x.fillStyle = T.suave;
        y = escribir(x, 'Se da por buena si aparecen estos puntos:', m, y, ancho, 16) + 6;
      }
      (A.clave || []).forEach(function (c) {
        x.font = FS('400', 11.5);
        if (medir) { y += partir(x, c, ancho - 16).length * 16 + 6; return; }
        x.fillStyle = T.acierto;
        x.font = FS('700', 11);
        x.fillText('·', m + 4, y);
        x.fillStyle = T.tinta;
        x.font = FS('400', 11.5);
        y = escribir(x, c, m + 16, y, ancho - 16, 16) + 6;
      });
      return y;
    }

    if (medir) return y;

    /* Renglones reales hasta el pie: si sobra media hoja, el alumno cree que
       con dos líneas basta. El espacio disponible es parte del enunciado. */
    var tope = A4.h - 70;
    while (y < tope) {
      linea(x, m, y, A4.w - m, T.linea, 0.9);
      y += 26;
    }
    return y;
  }

  /* Pinta una hoja concreta. El canvas debe medir A4.w × A4.h. */
  function hoja(ctx, datos, cara, iPag) {
    var m = 62;
    var x = ctx;
    x.save();
    x.fillStyle = T.papel;
    x.fillRect(0, 0, A4.w, A4.h);
    x.textBaseline = 'alphabetic';
    x.textAlign = 'left';

    var pags = paginar(x, datos, m, cara);
    var pag = pags[iPag] || { items: [], abierta: false };
    var y = iPag === 0 ? cabecera(x, datos, m, cara) : 76;

    if (iPag === 0 && cara === 'examen' && datos.enunciado) {
      x.fillStyle = T.suave;
      x.font = FS('400', 11);
      y = escribir(x, datos.enunciado, m, y, A4.w - m * 2, 16) + 12;
      linea(x, m, y - 6, A4.w - m, T.linea, 1, true);
      y += 12;
    }

    pag.items.forEach(function (e) {
      y = pregunta(x, e.q, e.n, m, y, A4.w - m * 2, cara, false);
    });

    /* Un test de dos preguntas no es un examen. Al final va una pregunta
       abierta con sus renglones: es donde se ve si la alumna sabe explicar el
       procedimiento, que es lo que se le va a pedir en el salón. */
    if (pag.abierta && datos.abierta) {
      y = abierta(x, datos, m, y, cara, false);
    }

    pie(x, datos, m, cara, iPag + 1, pags.length);
    x.restore();
    return pags.length;
  }

  function paginas(datos, cara) {
    var cv = document.createElement('canvas');
    cv.width = A4.w; cv.height = A4.h;
    return paginar(cv.getContext('2d'), datos, 62, cara).length;
  }

  window.EU_EXAMEN = { A4: A4, hoja: hoja, paginas: paginas };
})();
