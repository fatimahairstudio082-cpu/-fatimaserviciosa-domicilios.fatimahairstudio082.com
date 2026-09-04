/* ═════════════════════════════════════════════════════════════════
   DIAGRAMAS DE DIVISIONES · la geometría del oficio (Bloque 6)
   ─────────────────────────────────────────────────────────────────
   Los diagramas de pizarra, dibujados con geometría: cabeza de perfil,
   de planta y de nuca, con las tramas de cada técnica.

     · perfil      → cráneo de lado, para mechas y aplicación por capas
     · planta      → vista de arriba, para el balayage y sus porcentajes
     · nuca        → vista de atrás, para la diagonal y el gorro

   Cada técnica del Cerebro tiene su juego de láminas. La alumna ve
   exactamente las líneas que tiene que trazar en la cabeza real.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var RAD = Math.PI / 180;
  function gr(a) { return a * RAD; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* Paleta de las láminas: cada color dice qué es cada línea. */
  var COL = {
    trazo: '#2b2b3d',
    piel: '#f6f1ec',
    pelo: '#ffffff',
    verde: '#2fa36b',
    rojo: '#d94141',
    gris: '#6b6b80',
    guia: '#b0873c',
    cian: '#0e9bb0'
  };

  /* ══════════════════════════════════════════════════════════════
     1 · TRAMA · las líneas paralelas dentro de una zona recortada
     p = cuánto se ha dibujado ya (0-1), para que entre por pasos.
     ══════════════════════════════════════════════════════════════ */
  function trama(x, caja, ang, sep, col, p, guion, grosor) {
    p = clamp(p == null ? 1 : p, 0, 1);
    if (p <= 0) return;
    var cx = (caja.x0 + caja.x1) / 2, cy = (caja.y0 + caja.y1) / 2;
    var diag = Math.hypot(caja.x1 - caja.x0, caja.y1 - caja.y0);
    var n = Math.ceil(diag / sep) + 2;
    var vis = Math.max(1, Math.round(n * p));
    x.save();
    x.strokeStyle = col;
    x.lineWidth = grosor || 1.1;
    if (guion) x.setLineDash(guion);
    var ca = Math.cos(gr(ang)), sa = Math.sin(gr(ang));
    for (var i = 0; i < vis; i++) {
      var off = (i - n / 2) * sep;
      var mx = cx - sa * off, my = cy + ca * off;
      x.beginPath();
      x.moveTo(mx - ca * diag, my - sa * diag);
      x.lineTo(mx + ca * diag, my + sa * diag);
      x.stroke();
    }
    x.restore();
  }

  /* Chevron: la diagonal que cambia de sentido en la línea media,
     como se traza en la nuca. */
  function chevron(x, caja, sep, col, p) {
    p = clamp(p == null ? 1 : p, 0, 1);
    var mid = (caja.x0 + caja.x1) / 2;
    x.save();
    x.beginPath(); x.rect(caja.x0, caja.y0, mid - caja.x0, caja.y1 - caja.y0); x.clip();
    trama(x, caja, 55, sep, col, p);
    x.restore();
    x.save();
    x.beginPath(); x.rect(mid, caja.y0, caja.x1 - mid, caja.y1 - caja.y0); x.clip();
    trama(x, caja, -55, sep, col, p);
    x.restore();
  }

  /* ══════════════════════════════════════════════════════════════
     2 · LAS TRES VISTAS DE LA CABEZA
     ══════════════════════════════════════════════════════════════ */

  /* Zigzag: la partición en zeta. Rompe la línea recta para que la mecha
     no deje banda y el crecimiento se funda solo. */
  function zigzag(x, caja, sep, amp, paso, col, p, grosor) {
    p = clamp(p == null ? 1 : p, 0, 1);
    if (p <= 0) return;
    var n = Math.ceil((caja.y1 - caja.y0) / sep) + 1;
    var vis = Math.max(1, Math.round(n * p));
    x.save();
    x.strokeStyle = col; x.lineWidth = grosor || 1.2; x.lineJoin = 'round';
    for (var i = 0; i < vis; i++) {
      var yy = caja.y0 + i * sep;
      x.beginPath();
      var k = 0;
      for (var xx = caja.x0; xx <= caja.x1; xx += paso, k++) {
        var y2 = yy + (k % 2 ? amp : -amp);
        if (xx === caja.x0) x.moveTo(xx, y2); else x.lineTo(xx, y2);
      }
      x.stroke();
    }
    x.restore();
  }

  /* Contorno del cráneo de perfil, mirando a la derecha.
     El arco va en sentido antihorario: sube por la frente, cruza la
     coronilla y baja por el occipital hasta la nuca. */
  function perfilContorno(x, cx, cy, R) {
    x.beginPath();
    x.ellipse(cx, cy, R, R * 1.02, 0, gr(-55), gr(145), true);
    /* nuca → maxilar → mentón */
    x.quadraticCurveTo(cx - R * 0.74, cy + R * 0.86, cx - R * 0.44, cy + R * 0.94);
    x.quadraticCurveTo(cx - R * 0.10, cy + R * 1.08, cx + R * 0.55, cy + R * 0.99);
    /* mentón → labios → nariz → frente */
    x.quadraticCurveTo(cx + R * 0.78, cy + R * 0.94, cx + R * 0.80, cy + R * 0.78);
    x.quadraticCurveTo(cx + R * 0.84, cy + R * 0.64, cx + R * 0.90, cy + R * 0.56);
    x.quadraticCurveTo(cx + R * 0.84, cy + R * 0.50, cx + R * 1.10, cy + R * 0.40);
    x.quadraticCurveTo(cx + R * 0.90, cy + R * 0.24, cx + R * 0.94, cy + R * 0.08);
    x.quadraticCurveTo(cx + R * 1.00, cy - R * 0.22, cx + R * 0.76, cy - R * 0.62);
    x.closePath();
  }

  /* La zona con pelo: del nacimiento hacia atrás. Es lo que se recorta
     para que ninguna trama caiga sobre la cara. */
  function perfilZonaPelo(x, cx, cy, R) {
    x.beginPath();
    x.ellipse(cx, cy, R * 0.99, R * 1.01, 0, gr(-55), gr(145), true);
    x.quadraticCurveTo(cx - R * 0.70, cy + R * 0.66, cx - R * 0.30, cy + R * 0.52);
    x.quadraticCurveTo(cx + R * 0.12, cy + R * 0.36, cx + R * 0.34, cy - R * 0.10);
    x.quadraticCurveTo(cx + R * 0.52, cy - R * 0.46, cx + R * 0.57, cy - R * 0.84);
    x.closePath();
  }

  function perfil(x, cx, cy, R, sinCara) {
    x.save();
    perfilContorno(x, cx, cy, R);
    x.fillStyle = COL.piel; x.fill();
    x.strokeStyle = COL.trazo; x.lineWidth = 1.7; x.stroke();

    perfilZonaPelo(x, cx, cy, R);
    x.fillStyle = COL.pelo; x.fill();
    /* Volumen: el casquete no es plano. Una luz alta en el parietal y sombra
       hacia el occipital dan relieve sin tapar las tramas. */
    var gp = x.createRadialGradient(cx + R * 0.05, cy - R * 0.55, R * 0.08, cx - R * 0.15, cy - R * 0.10, R * 1.30);
    gp.addColorStop(0, 'rgba(255,255,255,0)');
    gp.addColorStop(0.55, 'rgba(43,43,61,.05)');
    gp.addColorStop(1, 'rgba(43,43,61,.16)');
    x.fillStyle = gp; x.fill();
    /* Hebras: la caída real del pelo desde el remolino. */
    x.save();
    perfilZonaPelo(x, cx, cy, R); x.clip();
    x.strokeStyle = 'rgba(43,43,61,.10)'; x.lineWidth = 0.9;
    for (var h = 0; h < 8; h++) {
      var a0 = -70 + h * 26;
      x.beginPath();
      x.moveTo(cx + R * 0.04, cy - R * 0.92);
      x.quadraticCurveTo(cx + Math.cos(gr(a0)) * R * 0.55, cy + Math.sin(gr(a0)) * R * 0.55,
        cx + Math.cos(gr(a0)) * R * 1.05, cy + Math.sin(gr(a0)) * R * 1.05);
      x.stroke();
    }
    x.restore();

    /* nacimiento del pelo, en discontinuo */
    x.beginPath();
    x.moveTo(cx + R * 0.57, cy - R * 0.84);
    x.quadraticCurveTo(cx + R * 0.52, cy - R * 0.46, cx + R * 0.34, cy - R * 0.10);
    x.quadraticCurveTo(cx + R * 0.12, cy + R * 0.36, cx - R * 0.30, cy + R * 0.52);
    x.quadraticCurveTo(cx - R * 0.70, cy + R * 0.66, cx - R * 0.82, cy + R * 0.58);
    x.setLineDash([5, 4]); x.strokeStyle = COL.trazo; x.lineWidth = 1.1; x.stroke();
    x.setLineDash([]);

    if (!sinCara) {
      /* oreja: la referencia de todas las divisiones horizontales */
      x.beginPath();
      x.ellipse(cx - R * 0.06, cy + R * 0.24, R * 0.14, R * 0.21, gr(-8), 0, Math.PI * 2);
      x.fillStyle = COL.piel; x.fill();
      x.strokeStyle = COL.trazo; x.lineWidth = 1.4; x.stroke();
      /* ceja y ojo, para que la alumna sitúe la cara */
      x.beginPath();
      x.moveTo(cx + R * 0.56, cy + R * 0.02);
      x.quadraticCurveTo(cx + R * 0.68, cy - R * 0.04, cx + R * 0.80, cy + R * 0.03);
      x.strokeStyle = COL.trazo; x.lineWidth = 1.2; x.stroke();
      x.beginPath();
      x.moveTo(cx + R * 0.62, cy + R * 0.16); x.lineTo(cx + R * 0.78, cy + R * 0.17);
      x.stroke();
    }

    /* cuello */
    x.beginPath();
    x.moveTo(cx - R * 0.50, cy + R * 0.96); x.lineTo(cx - R * 0.46, cy + R * 1.60);
    x.moveTo(cx + R * 0.26, cy + R * 1.02); x.lineTo(cx + R * 0.34, cy + R * 1.62);
    x.strokeStyle = COL.trazo; x.lineWidth = 1.6; x.stroke();
    x.restore();
  }

  /* Vista de planta: la cabeza desde arriba. Nariz al frente. */
  function planta(x, cx, cy, R) {
    x.save();
    x.beginPath();
    x.ellipse(cx, cy, R * 0.92, R, 0, 0, Math.PI * 2);
    x.fillStyle = COL.pelo; x.fill();
    var gl = x.createRadialGradient(cx, cy - R * 0.10, R * 0.06, cx, cy, R * 1.05);
    gl.addColorStop(0, 'rgba(255,255,255,0)');
    gl.addColorStop(0.6, 'rgba(43,43,61,.04)');
    gl.addColorStop(1, 'rgba(43,43,61,.15)');
    x.fillStyle = gl; x.fill();
    x.save();
    x.beginPath(); x.ellipse(cx, cy, R * 0.91, R * 0.99, 0, 0, Math.PI * 2); x.clip();
    x.strokeStyle = 'rgba(43,43,61,.09)'; x.lineWidth = 0.9;
    for (var r0 = 0; r0 < 14; r0++) {
      var ar = r0 * (360 / 14);
      x.beginPath();
      x.moveTo(cx, cy - R * 0.06);
      x.lineTo(cx + Math.cos(gr(ar)) * R, cy + Math.sin(gr(ar)) * R);
      x.stroke();
    }
    x.restore();
    x.beginPath(); x.ellipse(cx, cy, R * 0.92, R, 0, 0, Math.PI * 2);
    x.strokeStyle = COL.trazo; x.lineWidth = 1.7; x.stroke();
    /* nariz */
    x.beginPath();
    x.moveTo(cx - R * 0.10, cy - R * 0.99);
    x.quadraticCurveTo(cx, cy - R * 1.14, cx + R * 0.10, cy - R * 0.99);
    x.strokeStyle = COL.trazo; x.lineWidth = 1.5; x.stroke();
    /* orejas */
    [-1, 1].forEach(function (s) {
      x.beginPath();
      x.ellipse(cx + s * R * 0.94, cy + R * 0.06, R * 0.07, R * 0.17, 0, 0, Math.PI * 2);
      x.fillStyle = COL.piel; x.fill();
      x.strokeStyle = COL.trazo; x.lineWidth = 1.3; x.stroke();
    });
    x.restore();
  }

  /* Vista de nuca: la cabeza desde atrás. */
  function nuca(x, cx, cy, R) {
    x.save();
    x.beginPath();
    x.ellipse(cx, cy, R * 0.84, R, 0, 0, Math.PI * 2);
    x.fillStyle = COL.pelo; x.fill();
    var gn = x.createRadialGradient(cx, cy - R * 0.45, R * 0.08, cx, cy - R * 0.10, R * 1.25);
    gn.addColorStop(0, 'rgba(255,255,255,0)');
    gn.addColorStop(0.6, 'rgba(43,43,61,.04)');
    gn.addColorStop(1, 'rgba(43,43,61,.15)');
    x.fillStyle = gn; x.fill();
    x.save();
    x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
    x.strokeStyle = 'rgba(43,43,61,.09)'; x.lineWidth = 0.9;
    for (var q0 = -3; q0 <= 3; q0++) {
      x.beginPath();
      x.moveTo(cx + q0 * R * 0.06, cy - R * 0.72);
      x.quadraticCurveTo(cx + q0 * R * 0.26, cy, cx + q0 * R * 0.34, cy + R * 1.0);
      x.stroke();
    }
    x.restore();
    x.beginPath(); x.ellipse(cx, cy, R * 0.84, R, 0, 0, Math.PI * 2);
    x.strokeStyle = COL.trazo; x.lineWidth = 1.7; x.stroke();
    [-1, 1].forEach(function (s) {
      x.beginPath();
      x.ellipse(cx + s * R * 0.86, cy + R * 0.12, R * 0.08, R * 0.18, 0, 0, Math.PI * 2);
      x.fillStyle = COL.piel; x.fill();
      x.strokeStyle = COL.trazo; x.lineWidth = 1.3; x.stroke();
    });
    /* cuello y hombros */
    x.beginPath();
    x.moveTo(cx - R * 0.34, cy + R * 0.94); x.lineTo(cx - R * 0.40, cy + R * 1.62);
    x.moveTo(cx + R * 0.34, cy + R * 0.94); x.lineTo(cx + R * 0.40, cy + R * 1.62);
    x.strokeStyle = COL.trazo; x.lineWidth = 1.6; x.stroke();
    x.restore();
  }

  function cajaPerfil(cx, cy, R) { return { x0: cx - R * 1.1, y0: cy - R * 1.1, x1: cx + R * 1.1, y1: cy + R * 1.1 }; }

  /* La tarjeta que se está dibujando ahora mismo: dibujar() la fija antes de
     llamar a cada lámina. Los rótulos la necesitan porque el texto mide lo
     mismo en píxeles mientras R se encoge al aumentar el número de láminas:
     sin esto las cadenas salían cortadas por el recorte de la tarjeta. */
  var TILE = null;

  /* Una línea de división con su rótulo: lo que la alumna traza primero. */
  function linea(x, ax, ay, bx, by, col, rot, p, lado) {
    p = clamp(p == null ? 1 : p, 0, 1);
    if (p <= 0) return;
    var ex = ax + (bx - ax) * p, ey = ay + (by - ay) * p;
    x.save();
    x.strokeStyle = col; x.lineWidth = 1.8;
    x.setLineDash([7, 5]);
    x.beginPath(); x.moveTo(ax, ay); x.lineTo(ex, ey); x.stroke();
    x.setLineDash([]);
    if (rot && p > 0.8) {
      x.globalAlpha = (p - 0.8) / 0.2;
      var cuerpo = TILE ? clamp(TILE.R * 0.155, 7.5, 10.5) : 10.5;
      x.font = '700 ' + cuerpo.toFixed(1) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = col;
      x.textBaseline = 'middle';
      var w = x.measureText(rot).width;
      var izq = lado === 'i';
      var tx = ex + (izq ? -6 : 6);
      if (TILE) {
        var b0 = TILE.x0 + 6, b1 = TILE.x1 - 6;
        /* si no cabe del lado pedido, se prueba el otro; si tampoco, se pega
           al borde de la tarjeta, que es lo único que garantiza leerse */
        if (izq && tx - w < b0) { if (ex + 6 + w <= b1) { izq = false; tx = ex + 6; } else { izq = false; tx = b0; } }
        else if (!izq && tx + w > b1) { if (ex - 6 - w >= b0) { izq = true; tx = ex - 6; } else { izq = true; tx = b1; } }
      }
      x.textAlign = izq ? 'right' : 'left';
      x.fillText(rot, tx, ey);
    }
    x.restore();
  }

  /* Cuerpo de letra de los rótulos: sigue a R para que no se corte cuando
     hay muchas láminas en la misma página. */
  function fuente(x, k, min, max, peso) {
    var c = TILE ? clamp(TILE.R * k, min, max) : max;
    x.font = (peso || '700') + ' ' + c.toFixed(1) + 'px Segoe UI,Arial,sans-serif';
    return c;
  }

  /* ══════════════════════════════════════════════════════════════
     3 · LAS LÁMINAS
     Cada una recibe (x, cx, cy, R, p, o) · p avance · o opciones.
     ══════════════════════════════════════════════════════════════ */
  var LAMINAS = {

    /* Tintes, hidrataciones, queratina y derriz: capas horizontales
       de nuca a coronilla. Es la imagen que enviaste. */
    perfilHorizontal: {
      n: 'Perfil · capas horizontales',
      d: 'Secciones paralelas al suelo, de la nuca hacia arriba. El producto entra capa a capa.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        trama(x, cajaPerfil(cx, cy, R), 0, R * 0.115, COL.verde, p);
        x.restore();
        linea(x, cx + R * 0.28, cy + R * 0.24, cx - R * 1.12, cy + R * 0.24, COL.cian, 'Oreja a oreja', clamp(p * 1.6, 0, 1), 'i');
      }
    },

    /* La nuca en diagonal doble: el chevron que enviaste. */
    nucaDiagonal: {
      n: 'Nuca · diagonal a dos aguas',
      d: 'Desde la línea media, la diagonal baja hacia cada lado. Reparte el peso y evita la raya en la nuca.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        chevron(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, R * 0.12, COL.verde, p);
        x.restore();
        linea(x, cx, cy - R * 0.98, cx, cy + R * 1.16, COL.rojo, 'Línea media', clamp(p * 1.8, 0, 1), 'd');
      }
    },

    /* Balayage en planta con los porcentajes de profundidad. */
    plantaBalayage: {
      n: 'Planta · diagrama balayage',
      d: 'Seis zonas: frontal y posterior en horizontal, los cuatro laterales en diagonal. El centro es la coronilla.',
      f: function (x, cx, cy, R, p, o) {
        planta(x, cx, cy, R);
        var ri = R * 0.42;
        var cortes = [0, 45, 135, 180, 225, 315];
        /* los seis sectores, cada uno con su trama */
        var sec = [
          { a: 45, b: 135, col: COL.gris, ang: 0 },
          { a: 225, b: 315, col: COL.gris, ang: 0 },
          { a: -45, b: 0, col: COL.rojo, ang: -40 },
          { a: 0, b: 45, col: COL.rojo, ang: 40 },
          { a: 135, b: 180, col: COL.rojo, ang: -40 },
          { a: 180, b: 225, col: COL.rojo, ang: 40 }
        ];
        sec.forEach(function (s, j) {
          var pp = clamp((p - j * 0.07) / 0.6, 0, 1);
          if (pp <= 0) return;
          x.save();
          x.beginPath();
          x.moveTo(cx + Math.cos(gr(s.a)) * ri, cy + Math.sin(gr(s.a)) * ri);
          x.arc(cx, cy, R * 0.97, gr(s.a), gr(s.b));
          x.arc(cx, cy, ri, gr(s.b), gr(s.a), true);
          x.closePath();
          x.clip();
          trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, s.ang, R * 0.085, s.col, pp);
          x.restore();
        });
        /* coronilla */
        var pc = clamp((p - 0.35) / 0.4, 0, 1);
        if (pc > 0) {
          x.save();
          x.beginPath(); x.arc(cx, cy, ri, 0, Math.PI * 2); x.clip();
          trama(x, { x0: cx - ri, y0: cy - ri, x1: cx + ri, y1: cy + ri }, 0, ri * 0.20, COL.verde, pc, [6, 5]);
          x.restore();
          x.beginPath(); x.arc(cx, cy, ri, 0, Math.PI * 2);
          x.strokeStyle = COL.verde; x.lineWidth = 1.5; x.stroke();
        }
        /* las líneas maestras: oreja a oreja y las dos diagonales */
        x.save();
        x.strokeStyle = COL.trazo; x.lineWidth = 1.4; x.setLineDash([6, 5]);
        [0, 45, 135].forEach(function (a) {
          var pp = clamp(p * 1.5 - 0.05, 0, 1);
          x.beginPath();
          x.moveTo(cx - Math.cos(gr(a)) * R * 0.97 * pp, cy - Math.sin(gr(a)) * R * 0.97 * pp);
          x.lineTo(cx + Math.cos(gr(a)) * R * 0.97 * pp, cy + Math.sin(gr(a)) * R * 0.97 * pp);
          x.stroke();
        });
        x.setLineDash([]);
        x.restore();

        /* la escala de profundidad, con el arranque elegido */
        var desde = o && o.desde != null ? o.desde : 0.45;
        var ex = cx, ey = cy + R * 1.30, eh = R * 1.05, ew = R * 0.46;
        var pe = clamp((p - 0.5) / 0.4, 0, 1);
        if (pe > 0) {
          x.save();
          x.globalAlpha = pe;
          var g = x.createLinearGradient(0, ey, 0, ey + eh);
          g.addColorStop(0, 'rgba(120,120,150,.30)');
          g.addColorStop(1, 'rgba(120,120,150,0)');
          x.beginPath();
          x.moveTo(ex - ew, ey); x.lineTo(ex + ew, ey); x.lineTo(ex + ew * 0.10, ey + eh); x.lineTo(ex - ew * 0.10, ey + eh);
          x.closePath(); x.fillStyle = g; x.fill();
          x.textBaseline = 'middle';
          [{ v: 0.25, c: COL.rojo }, { v: 0.50, c: COL.gris }, { v: 0.75, c: COL.verde }].forEach(function (m) {
            var yy = ey + eh * m.v, aw = ew * (1 - m.v * 0.85);
            x.strokeStyle = m.c; x.lineWidth = 2;
            x.beginPath(); x.moveTo(ex - aw, yy); x.lineTo(ex + aw, yy); x.stroke();
            x.font = '700 11px Segoe UI,Arial,sans-serif';
            x.fillStyle = m.c; x.textAlign = 'left';
            x.fillText(Math.round(m.v * 100) + '%', ex + ew + 8, yy);
          });
          /* el arranque real que marca el mando */
          var yq = ey + eh * clamp(desde, 0, 1);
          x.strokeStyle = COL.guia; x.lineWidth = 2.6;
          x.beginPath(); x.moveTo(ex - ew * 1.20, yq); x.lineTo(ex + ew * 1.06, yq); x.stroke();
          x.font = '800 12px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.guia; x.textAlign = 'right';
          x.fillText('arranque ' + Math.round(desde * 100) + '%', ex - ew * 1.28, yq);
          x.restore();
        }
      }
    },

    /* Mechas internacional: capas horizontales solo en el casquete. */
    perfilInternacional: {
      n: 'Perfil · mechas internacional',
      d: 'Solo el casquete, por encima de la cresta parietal, en capas horizontales de nuca a frente.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var yp = cy - R * 0.18;
        x.save();
        perfilZonaPelo(x, cx, cy, R);
        x.clip();
        x.beginPath(); x.rect(cx - R * 1.2, cy - R * 1.2, R * 2.4, yp - (cy - R * 1.2)); x.clip();
        trama(x, cajaPerfil(cx, cy, R), 0, R * 0.13, COL.trazo, p);
        x.restore();
        linea(x, cx + R * 0.42, yp, cx - R * 1.12, yp, COL.cian, 'Cresta parietal', clamp(p * 1.7, 0, 1), 'i');
      }
    },

    /* Diagonal posterior: la línea que descarga hacia la nuca. */
    perfilDiagonalPost: {
      n: 'Perfil · diagonal posterior',
      d: 'La partición cae hacia atrás. Alarga la cara y suelta el peso en la nuca.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        trama(x, cajaPerfil(cx, cy, R), -38, R * 0.125, COL.rojo, p);
        x.restore();
        linea(x, cx + R * 0.50, cy - R * 0.76, cx - R * 0.86, cy + R * 0.52, COL.trazo, 'Diagonal posterior', clamp(p * 1.5, 0, 1), 'i');
        /* eje direccional */
        var pe = clamp((p - 0.65) / 0.35, 0, 1);
        if (pe > 0) {
          var ax = cx + R * 1.05, ay = cy - R * 0.86, ar = R * 0.24;
          x.save(); x.globalAlpha = pe;
          x.strokeStyle = COL.rojo; x.lineWidth = 1.1; x.setLineDash([4, 3]);
          for (var a = 0; a < 180; a += 30) {
            x.beginPath();
            x.moveTo(ax - Math.cos(gr(a)) * ar, ay - Math.sin(gr(a)) * ar);
            x.lineTo(ax + Math.cos(gr(a)) * ar, ay + Math.sin(gr(a)) * ar);
            x.stroke();
          }
          x.setLineDash([]);
          x.font = '700 9.5px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.rojo; x.textAlign = 'center';
          x.fillText('eje direccional', ax, ay + ar + 14);
          x.restore();
        }
      }
    },

    /* Mechas en vertical. */
    perfilVertical: {
      n: 'Perfil · mechas en vertical',
      d: 'Secciones perpendiculares al suelo. Dan mezcla y movimiento en lugar de bandas.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        trama(x, cajaPerfil(cx, cy, R), 90, R * 0.115, COL.trazo, p);
        x.restore();
        linea(x, cx + R * 0.26, cy + R * 0.24, cx - R * 1.12, cy + R * 0.24, COL.cian, 'Oreja a oreja', clamp(p * 1.7, 0, 1), 'i');
      }
    },

    /* Cuatro secciones, la base del químico. */
    plantaCuatro: {
      n: 'Planta · cuatro secciones',
      d: 'Línea media y oreja a oreja. Cuatro cuartos: se empieza por la nuca, que es la zona más fría.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var q = [
          { a: 180, b: 270, ang: 35, n: '1' }, { a: 270, b: 360, ang: -35, n: '2' },
          { a: 90, b: 180, ang: -35, n: '3' }, { a: 0, b: 90, ang: 35, n: '4' }
        ];
        q.forEach(function (s, j) {
          var pp = clamp((p - j * 0.10) / 0.55, 0, 1);
          if (pp <= 0) return;
          x.save();
          x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R * 0.96, gr(s.a), gr(s.b)); x.closePath(); x.clip();
          trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, s.ang, R * 0.10, COL.verde, pp);
          x.restore();
        });
        linea(x, cx, cy - R * 0.98, cx, cy + R * 1.14, COL.rojo, 'Línea media', clamp(p * 1.6, 0, 1), 'd');
        linea(x, cx - R * 0.94, cy, cx + R * 1.12, cy, COL.cian, 'Oreja a oreja', clamp(p * 1.6 - 0.2, 0, 1), 'd');
      }
    },

    /* Nueve secciones: el mapa de la queratina y el alisado. */
    plantaNueve: {
      n: 'Planta · nueve secciones',
      d: 'Cuatro cuartos más la franja central. Es el mapa del alisado: mechas de medio centímetro, sin saltarse zonas.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var fx = R * 0.20;
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.91, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        [-1, 1].forEach(function (s, j) {
          var pp = clamp((p - j * 0.10) / 0.5, 0, 1);
          if (pp <= 0) return;
          x.save();
          x.beginPath();
          x.rect(s < 0 ? cx - R : cx + fx, cy - R, R - fx, R * 2);
          x.clip();
          trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, 0, R * 0.10, COL.verde, pp);
          x.restore();
        });
        var pc = clamp((p - 0.3) / 0.5, 0, 1);
        if (pc > 0) {
          x.save();
          x.beginPath(); x.rect(cx - fx, cy - R, fx * 2, R * 2); x.clip();
          trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, 90, R * 0.10, COL.cian, pc);
          x.restore();
        }
        x.restore();
        x.save();
        x.strokeStyle = COL.rojo; x.lineWidth = 1.6; x.setLineDash([6, 5]);
        [-fx, fx].forEach(function (o) {
          x.beginPath(); x.moveTo(cx + o, cy - R * 0.97); x.lineTo(cx + o, cy + R * 0.97); x.stroke();
        });
        [-R * 0.34, R * 0.34].forEach(function (o) {
          x.beginPath(); x.moveTo(cx - R * 0.88, cy + o); x.lineTo(cx + R * 0.88, cy + o); x.stroke();
        });
        x.setLineDash([]);
        x.font = '700 10.5px Segoe UI,Arial,sans-serif';
        x.fillStyle = COL.cian; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
        x.fillText('Franja central', cx, cy - R * 1.10);
        x.restore();
      }
    },

    /* Secado y planchado: la nuca en cuadrícula de ocho, con su pinza
       en cada sección. Es el mapa que enviaste. */
    nucaOcho: {
      n: 'Nuca · cuadrícula de ocho',
      d: 'Línea media y tres horizontales: ocho secciones sujetas con pinza. Se seca de abajo hacia arriba, soltando de una en una.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        var y0 = cy - R * 0.92, y1 = cy + R * 0.94, alto = (y1 - y0) / 4;
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        for (var f = 0; f < 4; f++) {
          for (var c = 0; c < 2; c++) {
            var j = f * 2 + c;
            var pp = clamp((p - j * 0.075) / 0.4, 0, 1);
            if (pp <= 0) continue;
            var xa = c ? cx : cx - R * 0.86, xb = c ? cx + R * 0.86 : cx;
            var ya = y0 + f * alto;
            x.save();
            x.globalAlpha = pp * 0.9;
            x.beginPath(); x.rect(xa, ya, xb - xa, alto); x.clip();
            trama(x, { x0: xa, y0: ya, x1: xb, y1: ya + alto }, c ? -40 : 40, R * 0.11, COL.verde, pp);
            x.restore();
            if (pp > 0.7) {
              x.save();
              x.globalAlpha = (pp - 0.7) / 0.3;
              x.font = '800 13px Segoe UI,Arial,sans-serif';
              x.fillStyle = COL.trazo; x.textAlign = 'center'; x.textBaseline = 'middle';
              x.fillText(String(j + 1), (xa + xb) / 2, ya + alto / 2);
              x.restore();
            }
          }
        }
        x.restore();
        x.save();
        x.strokeStyle = COL.rojo; x.lineWidth = 1.6; x.setLineDash([6, 5]);
        x.beginPath(); x.moveTo(cx, y0); x.lineTo(cx, y1); x.stroke();
        for (var k = 1; k < 4; k++) {
          var yy = y0 + k * alto;
          var an = R * 0.83 * Math.sqrt(Math.max(0, 1 - Math.pow((yy - cy) / (R * 0.99), 2)));
          x.beginPath(); x.moveTo(cx - an, yy); x.lineTo(cx + an, yy); x.stroke();
        }
        x.setLineDash([]);
        x.restore();
      }
    },

    /* Los laterales, de frente: cuatro o seis según el largo. */
    perfilSeis: {
      n: 'Perfil · laterales en seis',
      d: 'El lateral se reparte en tres alturas y dos profundidades. En melena corta bastan cuatro; en melena larga, seis.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var yt = cy - R * 0.92, yb = cy + R * 0.86, alto = (yb - yt) / 3;
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        for (var f = 0; f < 3; f++) {
          for (var c = 0; c < 2; c++) {
            var j = f * 2 + c;
            var pp = clamp((p - j * 0.09) / 0.45, 0, 1);
            if (pp <= 0) continue;
            var xa = c ? cx - R * 0.10 : cx - R * 1.10, xb = c ? cx + R * 1.10 : cx - R * 0.10;
            var ya = yt + f * alto;
            x.save();
            x.beginPath(); x.rect(xa, ya, xb - xa, alto); x.clip();
            trama(x, { x0: xa, y0: ya, x1: xb, y1: ya + alto }, c ? 90 : 0, R * 0.11, COL.verde, pp);
            x.restore();
          }
        }
        x.restore();
        x.save();
        x.strokeStyle = COL.rojo; x.lineWidth = 1.5; x.setLineDash([6, 5]);
        for (var k = 1; k < 3; k++) {
          var yy = yt + k * alto;
          x.beginPath(); x.moveTo(cx - R * 1.06, yy); x.lineTo(cx + R * 0.34, yy); x.stroke();
        }
        x.beginPath(); x.moveTo(cx - R * 0.10, yt); x.lineTo(cx - R * 0.10, yb); x.stroke();
        x.setLineDash([]);
        var cu6 = fuente(x, 0.145, 7, 10.5);
        x.fillStyle = COL.rojo; x.textAlign = 'left'; x.textBaseline = 'middle';
        var t6 = ['3 alturas', '× 2 profundidades'];
        var tx6 = cx + R * 0.40;
        if (TILE) {
          var w6 = Math.max(x.measureText(t6[0]).width, x.measureText(t6[1]).width);
          tx6 = Math.min(tx6, TILE.x1 - 6 - w6);
        }
        t6.forEach(function (l, k) { x.fillText(l, tx6, yt + alto * 0.5 + k * cu6 * 1.5); });
        x.restore();
      }
    },

    /* Partición en zeta: la que no deja banda. */
    perfilZigzag: {
      n: 'Perfil · divisiones finas en zigzag',
      d: 'La partición se traza en zeta con la cola del peine. Al no ser recta, el crecimiento no marca línea y la mecha funde sola.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        zigzag(x, { x0: cx - R * 1.1, y0: cy - R * 1.05, x1: cx + R * 1.1, y1: cy + R * 1.0 },
          R * 0.155, R * 0.035, R * 0.085, COL.rojo, p, 1.3);
        x.restore();
        var pd = clamp((p - 0.55) / 0.45, 0, 1);
        if (pd > 0) {
          var dx0 = cx - R * 0.95, dy0 = cy + R * 1.38, an = R * 1.9;
          x.save();
          x.globalAlpha = pd;
          x.strokeStyle = COL.rojo; x.lineWidth = 2; x.lineJoin = 'round';
          x.beginPath();
          for (var i = 0; i <= 14; i++) {
            var xx = dx0 + (an / 14) * i, yy = dy0 + (i % 2 ? R * 0.09 : -R * 0.09);
            if (!i) x.moveTo(xx, yy); else x.lineTo(xx, yy);
          }
          x.stroke();
          x.font = '700 10px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.gris; x.textAlign = 'center'; x.textBaseline = 'top';
          x.fillText('la zeta, ampliada', dx0 + an / 2, dy0 + R * 0.16);
          x.restore();
        }
      }
    },

    /* Zigzag en planta: así se ve desde arriba el tejido de la raya. */
    plantaZigzag: {
      n: 'Planta · raya en zigzag',
      d: 'Vista desde arriba: la raya no se traza recta. Es lo que evita que se vea el borde del aclarado en la coronilla.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2); x.clip();
        zigzag(x, { x0: cx - R, y0: cy - R * 0.95, x1: cx + R, y1: cy + R * 0.95 },
          R * 0.17, R * 0.04, R * 0.09, COL.gris, p, 1.1);
        x.restore();
        var pz = clamp(p * 1.4 - 0.2, 0, 1);
        if (pz > 0) {
          x.save();
          x.strokeStyle = COL.rojo; x.lineWidth = 2.2; x.lineJoin = 'round';
          x.beginPath();
          var n = 12, y0 = cy - R * 0.96, y1 = cy + R * 0.96;
          for (var i = 0; i <= n * pz; i++) {
            var yy = y0 + ((y1 - y0) / n) * i;
            var xx = cx + (i % 2 ? R * 0.11 : -R * 0.11);
            if (!i) x.moveTo(xx, yy); else x.lineTo(xx, yy);
          }
          x.stroke();
          x.restore();
        }
      }
    },

    /* El gorro: filas de hebras sacadas con ganchillo. */
    gorro: {
      n: 'Nuca · gorro perforado',
      d: 'Filas horizontales de hebras finas. Más densidad arriba, menos en la nuca. El cuero cabelludo no se toca.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        var filas = 9;
        for (var i = 0; i < filas; i++) {
          var pp = clamp((p - i * 0.085) / 0.4, 0, 1);
          if (pp <= 0) continue;
          var yy = cy - R * 0.86 + (R * 1.72 / filas) * (i + 0.5);
          var dens = 16 - i;
          x.save();
          x.globalAlpha = pp;
          x.strokeStyle = COL.trazo; x.lineWidth = 1;
          x.setLineDash([3, R * 1.7 / dens - 3]);
          x.beginPath(); x.moveTo(cx - R * 0.84, yy); x.lineTo(cx + R * 0.84, yy); x.stroke();
          x.setLineDash([]);
          x.restore();
        }
        x.restore();
        linea(x, cx, cy - R * 0.98, cx, cy + R * 1.16, COL.rojo, 'Línea media', clamp(p * 1.8 - 0.4, 0, 1), 'd');
      }
    },

    /* La herradura: el contorno se aparta del casquete. Todo lo que se ve
       cuando la clienta se peina va en la banda de fuera. */
    plantaHerradura: {
      n: 'Planta · herradura',
      d: 'Una banda de contorno de sien a sien por detrás de la coronilla. Fuera se trabaja, dentro se reserva.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var rx = R * 0.58, ry = R * 0.62, yc = cy + R * 0.10;
        /* La herradura es una U abierta por delante: las dos lados suben desde
           las sienes y se cierran por detrás de la coronilla. Nada cruza la
           frente, porque la banda frontal es parte de lo que se trabaja. */
        var herradura = function () {
          x.beginPath();
          x.ellipse(cx, yc, rx, ry, 0, gr(-172), gr(-8), true);
        };
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2);
        x.clip();
        x.save();
        herradura();
        x.lineTo(cx + rx, cy + R * 1.2);
        x.lineTo(cx - rx, cy + R * 1.2);
        x.closePath();
        x.clip();
        trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, 0, R * 0.10, COL.gris, p * 0.85);
        x.restore();
        x.save();
        x.beginPath(); x.rect(cx - R, cy - R, R * 2, R * 2);
        herradura();
        x.lineTo(cx + rx, cy + R * 1.2);
        x.lineTo(cx - rx, cy + R * 1.2);
        x.closePath();
        x.clip('evenodd');
        trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, 0, R * 0.10, COL.verde, p);
        x.restore();
        x.restore();

        var ph = clamp(p * 1.5, 0, 1);
        if (ph > 0) {
          x.save();
          x.globalAlpha = ph;
          x.strokeStyle = COL.rojo; x.lineWidth = 2.2; x.setLineDash([7, 5]);
          herradura(); x.stroke();
          x.setLineDash([]);
          x.font = '700 ' + (TILE ? clamp(TILE.R * 0.15, 7, 10.5) : 10.5).toFixed(1) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.rojo; x.textAlign = 'center'; x.textBaseline = 'middle';
          x.fillText('reserva interior', cx, yc + ry * 0.35);
          x.fillStyle = COL.verde;
          x.fillText('contorno', cx, cy - R * 0.84);
          x.restore();
        }
      }
    },

    /* Diagonal adelante: la que acumula peso en la cara. Es la pareja
       de perfilDiagonalPost y se lee mejor junto a ella. */
    perfilDiagonalAdel: {
      n: 'Perfil · diagonal adelante',
      d: 'La partición cae hacia el rostro. Acumula peso al frente y acorta la cara.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        trama(x, cajaPerfil(cx, cy, R), 38, R * 0.125, COL.cian, p);
        x.restore();
        /* La línea se traza del rostro hacia la nuca para que el rótulo, que
           `linea` pone en el punto final, caiga en el papel de la izquierda y
           no encima del pelo. Es como lo resuelve la diagonal posterior. */
        linea(x, cx + R * 0.44, cy + R * 0.56, cx - R * 0.80, cy - R * 0.56, COL.trazo, 'Diagonal adelante', clamp(p * 1.5, 0, 1), 'i');
        var pe = clamp((p - 0.65) / 0.35, 0, 1);
        if (pe > 0) {
          /* La flecha va bajo el mentón, fuera de la cabeza: en el hueco del
             rótulo se pisaba con él, como pasaba en la diagonal posterior. */
          var fx = cx + R * 1.06, fy = cy + R * 1.22;
          x.save(); x.globalAlpha = pe;
          x.strokeStyle = COL.cian; x.lineWidth = 2; x.lineJoin = 'round';
          x.beginPath();
          x.moveTo(fx - R * 0.34, fy - R * 0.20); x.lineTo(fx, fy);
          x.lineTo(fx - R * 0.34, fy + R * 0.20);
          x.stroke();
          x.font = '700 ' + (TILE ? clamp(TILE.R * 0.145, 7, 9.5) : 9.5).toFixed(1) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.cian; x.textAlign = 'center'; x.textBaseline = 'top';
          x.fillText('hacia el rostro', cx, fy + R * 0.26);
          x.restore();
        }
      }
    },

    /* Ladrillo: las mechas de una fila caen en el hueco de la de abajo.
       Es lo que impide que se vean bandas verticales. */
    nucaLadrillo: {
      n: 'Nuca · ladrillo',
      d: 'Filas horizontales con las mechas desplazadas media anchura. Cada fila tapa el hueco de la anterior: no quedan bandas.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        var filas = 7, alto = R * 1.86 / filas, anchoM = R * 0.30;
        for (var i = 0; i < filas; i++) {
          var pp = clamp((p - i * 0.095) / 0.38, 0, 1);
          if (pp <= 0) continue;
          var yy = cy - R * 0.93 + alto * i;
          var off = (i % 2) ? anchoM / 2 : 0;
          x.save();
          x.globalAlpha = pp;
          for (var xx = cx - R * 0.9 + off; xx < cx + R * 0.9; xx += anchoM) {
            x.fillStyle = (i % 2) ? 'rgba(47,163,107,.16)' : 'rgba(14,155,176,.16)';
            x.fillRect(xx, yy + alto * 0.16, anchoM * 0.86, alto * 0.66);
            x.strokeStyle = (i % 2) ? COL.verde : COL.cian; x.lineWidth = 1.2;
            x.strokeRect(xx, yy + alto * 0.16, anchoM * 0.86, alto * 0.66);
          }
          x.restore();
        }
        x.restore();
        var pl = clamp(p * 1.6 - 0.5, 0, 1);
        if (pl > 0) {
          /* La cota va fuera de la cabeza: dentro se leía con las mechas. */
          var yc2 = cy - R * 0.93 + (R * 1.86 / 7);
          x.save(); x.globalAlpha = pl;
          x.strokeStyle = COL.rojo; x.lineWidth = 1.6; x.setLineDash([5, 4]);
          x.beginPath();
          x.moveTo(cx - R * 0.86, yc2);
          x.lineTo(cx + R * 0.86, yc2);
          x.stroke(); x.setLineDash([]);
          x.font = '700 ' + (TILE ? clamp(TILE.R * 0.145, 7, 9.5) : 9.5).toFixed(1) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.rojo; x.textAlign = 'center'; x.textBaseline = 'bottom';
          x.fillText('media anchura de desplazamiento', cx, cy - R * 1.06);
          x.restore();
        }
      }
    },

    /* Espiga: mechas cortas en diagonal que cambian de sentido fila a fila.
       Da mezcla en cabellos con mucha densidad. */
    nucaEspiga: {
      n: 'Nuca · espiga',
      d: 'Mechas cortas en diagonal que invierten el sentido en cada fila. Rompe la línea y funde en cabello muy poblado.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        var filas = 8, alto = R * 1.9 / filas, paso = R * 0.20;
        for (var i = 0; i < filas; i++) {
          var pp = clamp((p - i * 0.085) / 0.36, 0, 1);
          if (pp <= 0) continue;
          var yy = cy - R * 0.95 + alto * (i + 0.5);
          var s = (i % 2) ? 1 : -1;
          x.save();
          x.globalAlpha = pp;
          x.strokeStyle = (i % 2) ? COL.verde : COL.gris;
          x.lineWidth = 1.5; x.lineCap = 'round';
          for (var xx = cx - R * 0.9; xx < cx + R * 0.9; xx += paso) {
            x.beginPath();
            x.moveTo(xx, yy + s * alto * 0.34);
            x.lineTo(xx + paso * 0.78, yy - s * alto * 0.34);
            x.stroke();
          }
          x.restore();
        }
        x.restore();
        linea(x, cx, cy - R * 0.98, cx, cy + R * 1.16, COL.rojo, 'Línea media', clamp(p * 1.8 - 0.4, 0, 1), 'd');
      }
    },

    /* Media luna: la banda del nacimiento, la que se ve de frente.
       Se aísla antes de tocar el resto. */
    plantaMediaLuna: {
      n: 'Planta · media luna',
      d: 'Banda curva pegada al nacimiento frontal. Es lo que enmarca la cara: se aísla y se trabaja aparte.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var ry = R * 0.34;
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2);
        x.ellipse(cx, cy - R * 0.98, R * 0.86, ry * 2.1, 0, 0, Math.PI * 2, true);
        x.clip('evenodd');
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2);
        x.clip();
        trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R * 0.2 }, 90, R * 0.11, COL.gris, p * 0.9);
        x.restore();

        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2); x.clip();
        x.beginPath();
        x.ellipse(cx, cy - R * 0.98, R * 0.86, ry * 2.1, 0, 0, Math.PI * 2);
        x.fillStyle = 'rgba(217,65,65,.13)'; x.fill();
        trama(x, { x0: cx - R * 0.86, y0: cy - R * 0.98, x1: cx + R * 0.86, y1: cy - R * 0.98 + ry * 2.1 }, 0, R * 0.07, COL.rojo, p);
        x.restore();

        var pm = clamp(p * 1.5, 0, 1);
        if (pm > 0) {
          x.save(); x.globalAlpha = pm;
          x.strokeStyle = COL.rojo; x.lineWidth = 2.2;
          x.beginPath();
          x.ellipse(cx, cy - R * 0.98, R * 0.86, ry * 2.1, 0, gr(12), gr(168));
          x.stroke();
          x.font = '700 ' + (TILE ? clamp(TILE.R * 0.15, 7, 10.5) : 10.5).toFixed(1) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.rojo; x.textAlign = 'center'; x.textBaseline = 'middle';
          x.fillText('media luna', cx, cy - R * 0.72);
          x.fillStyle = COL.gris;
          x.fillText('resto de la cabeza', cx, cy + R * 0.42);
          x.restore();
        }
      }
    },

    /* Corte en V: las dos diagonales se juntan en la línea media.
       Es la que deja punta en la nuca. */
    nucaV: {
      n: 'Nuca · corte en V',
      d: 'Las dos mitades bajan en diagonal hasta juntarse en la línea media. Deja punta en la nuca y quita peso a los lados.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.83, R * 0.99, 0, 0, Math.PI * 2); x.clip();
        var capas = 5;
        for (var i = 0; i < capas; i++) {
          var pp = clamp((p - i * 0.13) / 0.4, 0, 1);
          if (pp <= 0) continue;
          /* El vértice de la última capa tiene que caer DENTRO del óvalo:
             con el paso anterior la punta de la V quedaba cortada por el clip. */
          var dy = R * 0.15 * i;
          var yl = cy - R * 0.62 + dy, yv = cy + R * 0.18 + dy;
          x.save();
          x.globalAlpha = pp * 0.9;
          x.strokeStyle = i === capas - 1 ? COL.verde : COL.gris;
          x.lineWidth = i === capas - 1 ? 2.2 : 1.3;
          x.lineJoin = 'round';
          x.beginPath();
          x.moveTo(cx - R * 0.88, yl);
          x.lineTo(cx, yv);
          x.lineTo(cx + R * 0.88, yl);
          x.stroke();
          x.restore();
        }
        x.restore();
        linea(x, cx, cy - R * 0.98, cx, cy + R * 1.16, COL.rojo, 'Vértice', clamp(p * 1.8 - 0.5, 0, 1), 'd');
        var pv = clamp((p - 0.7) / 0.3, 0, 1);
        if (pv > 0) {
          x.save(); x.globalAlpha = pv;
          x.font = '700 ' + (TILE ? clamp(TILE.R * 0.145, 7, 10) : 10).toFixed(1) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = COL.verde; x.textAlign = 'center'; x.textBaseline = 'bottom';
          x.fillText('línea de corte', cx, cy - R * 1.06);
          x.restore();
        }
      }
    },

    /* Elevaciones: el ángulo al que se sostiene la mecha. Es la lámina que
       explica de una vez por qué un mismo corte da peso o da capa. */
    perfilElevaciones: {
      n: 'Perfil · ángulos de elevación',
      d: 'La misma mecha, cinco ángulos. A 0° el peso se queda abajo; a 90° la capa iguala; a 180° se vacía la coronilla.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var px0 = cx - R * 0.38, py0 = cy - R * 0.55, L = R * 0.80;
        var pasos = [
          { e: 0, c: COL.gris, n: '0°' },
          { e: 45, c: COL.cian, n: '45°' },
          { e: 90, c: COL.verde, n: '90°' },
          { e: 135, c: COL.guia, n: '135°' },
          { e: 180, c: COL.rojo, n: '180°' }
        ];
        /* el arco graduado, primero: es el fondo de la lectura */
        var pa = clamp(p * 1.4, 0, 1);
        if (pa > 0) {
          x.save();
          x.globalAlpha = pa * 0.55;
          x.strokeStyle = COL.trazo; x.lineWidth = 1; x.setLineDash([3, 4]);
          x.beginPath(); x.arc(px0, py0, R * 0.55, gr(90), gr(270));
          x.stroke(); x.setLineDash([]);
          x.restore();
        }
        pasos.forEach(function (s, j) {
          var pp = clamp((p - j * 0.13) / 0.42, 0, 1);
          if (pp <= 0) return;
          var a = 90 + s.e;
          var ex = px0 + Math.cos(gr(a)) * L * pp, ey = py0 + Math.sin(gr(a)) * L * pp;
          x.save();
          x.strokeStyle = s.c;
          x.lineWidth = s.e === 90 ? 2.4 : 1.6;
          x.lineCap = 'round';
          x.beginPath(); x.moveTo(px0, py0); x.lineTo(ex, ey); x.stroke();
          if (pp > 0.75) {
            x.globalAlpha = (pp - 0.75) / 0.25;
            var cu = fuente(x, 0.155, 7.5, 11, '800');
            x.fillStyle = s.c;
            x.textAlign = Math.cos(gr(a)) < -0.3 ? 'right' : 'center';
            x.textBaseline = 'middle';
            var lx = px0 + Math.cos(gr(a)) * (L + cu * 0.9);
            var ly = py0 + Math.sin(gr(a)) * (L + cu * 0.9);
            if (TILE) lx = clamp(lx, TILE.x0 + cu * 1.6, TILE.x1 - cu * 1.6);
            ly = Math.max(ly, cy - R * 1.16);
            x.fillText(s.n, lx, ly);
          }
          x.restore();
        });
        /* el punto de arranque, sobre el parietal */
        x.save();
        x.beginPath(); x.arc(px0, py0, 3.2, 0, Math.PI * 2);
        x.fillStyle = COL.trazo; x.fill();
        x.restore();
      }
    },

    /* Radial: el abanico que sale del remolino. La división de la permanente
       y de las capas redondas. */
    perfilRadial: {
      n: 'Perfil · secciones radiales',
      d: 'Todas las secciones salen del remolino como los radios de una rueda. Da capa redonda y reparte el volumen a partes iguales.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var ox = cx + R * 0.04, oy = cy - R * 0.90;
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        var n = 11;
        for (var i = 0; i < n; i++) {
          var pp = clamp((p - i * 0.06) / 0.4, 0, 1);
          if (pp <= 0) continue;
          var a = 92 + (i / (n - 1)) * 96;
          x.save();
          x.globalAlpha = pp;
          x.strokeStyle = i % 2 ? COL.verde : COL.gris;
          x.lineWidth = 1.3;
          x.beginPath();
          x.moveTo(ox, oy);
          x.lineTo(ox + Math.cos(gr(a)) * R * 2.1, oy + Math.sin(gr(a)) * R * 2.1);
          x.stroke();
          x.restore();
        }
        x.restore();
        var pr = clamp((p - 0.55) / 0.35, 0, 1);
        if (pr > 0) {
          x.save(); x.globalAlpha = pr;
          x.beginPath(); x.arc(ox, oy, R * 0.07, 0, Math.PI * 2);
          x.fillStyle = COL.rojo; x.fill();
          fuente(x, 0.15, 7, 10.5);
          x.fillStyle = COL.rojo; x.textAlign = 'left'; x.textBaseline = 'middle';
          var tx = ox + R * 0.14;
          if (TILE) tx = Math.min(tx, TILE.x1 - 8 - x.measureText('remolino').width);
          x.fillText('remolino', tx, oy - R * 0.02);
          x.restore();
        }
      }
    },

    /* Los puntos del cráneo: el vocabulario. Sin esto la alumna no entiende
       ninguna de las otras láminas. */
    perfilPuntos: {
      n: 'Perfil · puntos de referencia',
      d: 'Los seis puntos que nombran toda la cabeza. Cada división del oficio se describe con estos nombres, no con «arriba» y «abajo».',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var ptos = [
          { n: 'Vértice', x: 0.04, y: -0.98 },
          { n: 'Cresta parietal', x: -0.42, y: -0.80 },
          { n: 'Occipital', x: -0.90, y: -0.10 },
          { n: 'Protuberancia', x: -0.86, y: 0.36 },
          { n: 'Nacimiento', x: 0.56, y: -0.80 },
          { n: 'Sien', x: 0.52, y: -0.16 }
        ];
        ptos.forEach(function (q, j) {
          var pp = clamp((p - j * 0.11) / 0.36, 0, 1);
          if (pp <= 0) return;
          var qx = cx + R * q.x, qy = cy + R * q.y;
          x.save();
          x.globalAlpha = pp;
          x.beginPath(); x.arc(qx, qy, 3.6, 0, Math.PI * 2);
          x.fillStyle = COL.rojo; x.fill();
          x.strokeStyle = '#ffffff'; x.lineWidth = 1.2; x.stroke();
          var cu = fuente(x, 0.15, 7, 10, '800');
          x.fillStyle = COL.trazo; x.textBaseline = 'middle';
          var izq = q.x < 0;
          var tx = qx + (izq ? -7 : 7);
          var w = x.measureText(String(j + 1)).width;
          if (TILE) tx = clamp(tx, TILE.x0 + 6 + w, TILE.x1 - 6 - w);
          x.textAlign = izq ? 'right' : 'left';
          x.fillText(String(j + 1), tx, qy);
          x.restore();
        });
        /* la leyenda numerada, al pie de la lámina */
        var pl = clamp((p - 0.5) / 0.4, 0, 1);
        if (pl > 0 && TILE) {
          x.save();
          x.globalAlpha = pl;
          var cu2 = fuente(x, 0.135, 6.5, 9.5, '600');
          x.textAlign = 'left'; x.textBaseline = 'middle';
          ptos.forEach(function (q, j) {
            var col = j % 2;
            var lx = TILE.x0 + 10 + col * ((TILE.x1 - TILE.x0) / 2 + 4);
            var ly = cy + R * 1.74 + Math.floor(j / 2) * (cu2 * 1.6);
            x.fillStyle = COL.rojo; x.fillText(String(j + 1), lx, ly);
            x.fillStyle = '#5a5a72'; x.fillText(q.n, lx + cu2 * 0.9, ly);
          });
          x.restore();
        }
      }
    },

    /* Sobredirección: la mecha se lleva fuera de su sitio para dejar largo
       donde hace falta. Es el paso que más se explica mal. */
    perfilSobredireccion: {
      n: 'Perfil · sobredirección',
      d: 'La mecha se peina fuera de su caída natural antes de cortar. Deja más largo en la zona de la que se aparta.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var ox = cx - R * 0.42, oy = cy - R * 0.74;
        /* caída natural: la mecha cuelga a plomo por detrás de la cabeza */
        var pn = clamp(p * 1.5, 0, 1);
        if (pn > 0) {
          x.save();
          x.globalAlpha = pn;
          x.strokeStyle = COL.gris; x.lineWidth = 1.6; x.setLineDash([6, 5]);
          x.beginPath(); x.moveTo(ox, oy); x.lineTo(ox - R * 0.05, cy + R * 1.24);
          x.stroke(); x.setLineDash([]);
          x.restore();
        }
        /* dirección sobredirigida: se lleva hacia atrás, fuera de la silueta */
        var ps = clamp((p - 0.3) / 0.45, 0, 1);
        if (ps > 0) {
          var ax = ox - R * 1.00, ay = cy + R * 0.52;
          x.save();
          x.globalAlpha = ps;
          x.strokeStyle = COL.verde; x.lineWidth = 2.4; x.lineCap = 'round';
          x.beginPath();
          x.moveTo(ox, oy);
          x.lineTo(ox + (ax - ox) * ps, oy + (ay - oy) * ps);
          x.stroke();
          x.strokeStyle = COL.guia; x.lineWidth = 1.4;
          x.beginPath(); x.arc(ox, oy, R * 0.62, gr(92), gr(129)); x.stroke();
          x.restore();
        }
        var pt = clamp((p - 0.65) / 0.35, 0, 1);
        if (pt > 0) {
          x.save();
          x.globalAlpha = pt;
          var cu = fuente(x, 0.15, 7, 10);
          x.textBaseline = 'top'; x.textAlign = 'center';
          x.fillStyle = COL.gris;
          var nx = ox - R * 0.05;
          if (TILE) nx = clamp(nx, TILE.x0 + 6 + x.measureText('caída natural').width / 2, TILE.x1 - 6);
          x.fillText('caída natural', nx, cy + R * 1.30);
          x.fillStyle = COL.verde;
          x.textBaseline = 'middle'; x.textAlign = 'left';
          var sx = ox - R * 1.00;
          if (TILE) sx = Math.max(TILE.x0 + 6, sx);
          x.fillText('sobredirigida', sx, cy + R * 0.70);
          x.restore();
        }
      }
    },

    /* Triángulo frontal: de dónde sale el flequillo y hasta dónde. */
    plantaTrianguloFrontal: {
      n: 'Planta · triángulo frontal',
      d: 'Del vértice a las dos sienes. Todo lo que cae dentro es flequillo: si se abre más, el flequillo pesa y se abre solo.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var vx = cx, vy = cy + R * 0.06;
        var ax = cx - R * 0.70, ay = cy - R * 0.72;
        var bx = cx + R * 0.70, by = cy - R * 0.72;
        var tri = function () {
          x.beginPath();
          x.moveTo(vx, vy); x.lineTo(ax, ay);
          x.quadraticCurveTo(cx, cy - R * 1.02, bx, by);
          x.closePath();
        };
        x.save();
        x.beginPath(); x.ellipse(cx, cy, R * 0.90, R * 0.98, 0, 0, Math.PI * 2); x.clip();
        /* resto de la cabeza */
        x.save();
        x.beginPath(); x.rect(cx - R, cy - R, R * 2, R * 2);
        tri();
        x.clip('evenodd');
        trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R }, 0, R * 0.10, COL.gris, p * 0.85);
        x.restore();
        /* el triángulo */
        x.save();
        tri(); x.clip();
        x.fillStyle = 'rgba(47,163,107,.12)'; x.fillRect(cx - R, cy - R, R * 2, R * 2);
        trama(x, { x0: cx - R, y0: cy - R * 1.02, x1: cx + R, y1: vy }, 90, R * 0.07, COL.verde, p);
        x.restore();
        x.restore();
        var pt = clamp(p * 1.4, 0, 1);
        if (pt > 0) {
          x.save();
          x.globalAlpha = pt;
          x.strokeStyle = COL.verde; x.lineWidth = 2.2; x.setLineDash([7, 5]);
          x.beginPath(); x.moveTo(ax, ay); x.lineTo(vx, vy); x.lineTo(bx, by);
          x.stroke(); x.setLineDash([]);
          x.beginPath(); x.arc(vx, vy, 3.4, 0, Math.PI * 2);
          x.fillStyle = COL.verde; x.fill();
          fuente(x, 0.15, 7, 10.5);
          x.fillStyle = COL.verde; x.textAlign = 'center'; x.textBaseline = 'middle';
          x.fillText('flequillo', cx, cy - R * 0.62);
          x.fillStyle = COL.gris;
          x.fillText('vértice', cx, vy + R * 0.16);
          x.restore();
        }
      }
    },

    /* Las tres líneas de perímetro: lo primero que decide la clienta cuando
       dice «recto» o «en punta». */
    nucaPerimetro: {
      n: 'Nuca · líneas de perímetro',
      d: 'Recta, cóncava y convexa sobre la misma nuca. La misma longitud da tres siluetas distintas según cómo cierre el borde.',
      f: function (x, cx, cy, R, p) {
        nuca(x, cx, cy, R);
        var yb = cy + R * 0.62, an = R * 0.80;
        var lin = [
          { n: 'Recta', c: COL.gris, k: 0 },
          { n: 'Cóncava', c: COL.cian, k: -0.30 },
          { n: 'Convexa', c: COL.rojo, k: 0.30 }
        ];
        lin.forEach(function (s, j) {
          var pp = clamp((p - j * 0.2) / 0.45, 0, 1);
          if (pp <= 0) return;
          x.save();
          x.globalAlpha = pp;
          x.strokeStyle = s.c; x.lineWidth = 2.2; x.lineCap = 'round';
          x.beginPath();
          x.moveTo(cx - an, yb - j * R * 0.02);
          x.quadraticCurveTo(cx, yb + s.k * R + j * R * 0.02, cx + an, yb - j * R * 0.02);
          x.stroke();
          x.restore();
        });
        /* Los nombres van en leyenda al pie: sobre las curvas se pisaban entre
           ellas y con la línea media. */
        var pg = clamp((p - 0.55) / 0.35, 0, 1);
        if (pg > 0) {
          x.save();
          x.globalAlpha = pg;
          var cu = fuente(x, 0.145, 6.8, 9.5, '800');
          x.textAlign = 'left'; x.textBaseline = 'middle';
          var lx0 = TILE ? TILE.x0 + 12 : cx - R * 0.9;
          lin.forEach(function (s, j) {
            var ly = cy + R * 1.22 + j * cu * 1.7;
            x.strokeStyle = s.c; x.lineWidth = 2.4;
            x.beginPath(); x.moveTo(lx0, ly); x.lineTo(lx0 + cu * 1.6, ly); x.stroke();
            x.fillStyle = s.c;
            x.fillText(s.n, lx0 + cu * 2.1, ly);
          });
          x.restore();
        }
        linea(x, cx, cy - R * 0.10, cx, cy - R * 1.06, COL.trazo, 'Línea media', clamp(p * 1.8 - 0.5, 0, 1), 'd');
      }
    },

    /* Radial en ocho: la cabeza como una tarta. Rulos y permanente. */
    plantaRadialOcho: {
      n: 'Planta · radial en ocho',
      d: 'Ocho sectores iguales desde la coronilla. Cada sector es un rulo o una mecha: se avanza en círculo, sin volver atrás.',
      f: function (x, cx, cy, R, p) {
        planta(x, cx, cy, R);
        var ri = R * 0.16;
        for (var i = 0; i < 8; i++) {
          var pp = clamp((p - i * 0.075) / 0.4, 0, 1);
          if (pp <= 0) continue;
          var a0 = -112.5 + i * 45, a1 = a0 + 45;
          x.save();
          x.beginPath();
          x.moveTo(cx + Math.cos(gr(a0)) * ri, cy + Math.sin(gr(a0)) * ri);
          x.arc(cx, cy, R * 0.94, gr(a0), gr(a1));
          x.arc(cx, cy, ri, gr(a1), gr(a0), true);
          x.closePath();
          x.clip();
          trama(x, { x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R },
            i % 2 ? 45 : -45, R * 0.09, i % 2 ? COL.verde : COL.cian, pp);
          x.restore();
          if (pp > 0.7) {
            var am = gr(a0 + 22.5), rr = R * 0.64;
            x.save();
            x.globalAlpha = (pp - 0.7) / 0.3;
            fuente(x, 0.16, 7.5, 11.5, '800');
            x.fillStyle = COL.trazo; x.textAlign = 'center'; x.textBaseline = 'middle';
            x.fillText(String(i + 1), cx + Math.cos(am) * rr, cy + Math.sin(am) * rr);
            x.restore();
          }
        }
        x.save();
        x.strokeStyle = COL.trazo; x.lineWidth = 1.2; x.setLineDash([5, 4]);
        for (var k = 0; k < 4; k++) {
          var a = -112.5 + k * 45;
          var pp2 = clamp(p * 1.5, 0, 1);
          x.beginPath();
          x.moveTo(cx - Math.cos(gr(a)) * R * 0.94 * pp2, cy - Math.sin(gr(a)) * R * 0.94 * pp2);
          x.lineTo(cx + Math.cos(gr(a)) * R * 0.94 * pp2, cy + Math.sin(gr(a)) * R * 0.94 * pp2);
          x.stroke();
        }
        x.setLineDash([]);
        x.beginPath(); x.arc(cx, cy, ri, 0, Math.PI * 2);
        x.fillStyle = '#ffffff'; x.fill();
        x.strokeStyle = COL.rojo; x.lineWidth = 1.6; x.stroke();
        x.restore();
      }
    },

    /* Orden de aplicación: el reloj del producto. Se empieza por donde el
       calor de la cabeza trabaja menos. */
    perfilOrden: {
      n: 'Perfil · orden de aplicación',
      d: 'De la nuca a la frente, en seis pasos. La nuca es la zona más fría: se aplica primero para que todo revele igual.',
      f: function (x, cx, cy, R, p) {
        perfil(x, cx, cy, R);
        var zon = [
          { x: -0.72, y: 0.42 }, { x: -0.82, y: 0.02 },
          { x: -0.56, y: -0.52 }, { x: -0.12, y: -0.84 },
          { x: 0.24, y: -0.72 }, { x: 0.46, y: -0.40 }
        ];
        x.save();
        perfilZonaPelo(x, cx, cy, R); x.clip();
        trama(x, cajaPerfil(cx, cy, R), 0, R * 0.13, COL.gris, clamp(p * 1.2, 0, 1), [4, 5]);
        x.restore();
        /* la flecha que une los pasos */
        var pf = clamp(p / 0.85, 0, 1);
        x.save();
        x.strokeStyle = COL.guia; x.lineWidth = 1.8; x.setLineDash([5, 4]);
        x.beginPath();
        zon.forEach(function (z, j) {
          var qx = cx + R * z.x, qy = cy + R * z.y;
          if (!j) x.moveTo(qx, qy);
          else if (j / (zon.length - 1) <= pf + 0.15) x.lineTo(qx, qy);
        });
        x.stroke(); x.setLineDash([]);
        x.restore();
        zon.forEach(function (z, j) {
          var pp = clamp((p - j * 0.13) / 0.34, 0, 1);
          if (pp <= 0) return;
          var qx = cx + R * z.x, qy = cy + R * z.y;
          x.save();
          x.globalAlpha = pp;
          x.beginPath(); x.arc(qx, qy, R * 0.115, 0, Math.PI * 2);
          x.fillStyle = j === 0 ? COL.verde : '#ffffff';
          x.fill();
          x.strokeStyle = j === 0 ? COL.verde : COL.guia; x.lineWidth = 1.8; x.stroke();
          fuente(x, 0.155, 7.5, 11, '800');
          x.fillStyle = j === 0 ? '#ffffff' : COL.guia;
          x.textAlign = 'center'; x.textBaseline = 'middle';
          x.fillText(String(j + 1), qx, qy);
          x.restore();
        });
        var pn2 = clamp((p - 0.7) / 0.3, 0, 1);
        if (pn2 > 0) {
          x.save();
          x.globalAlpha = pn2;
          fuente(x, 0.145, 7, 10);
          x.fillStyle = COL.verde; x.textAlign = 'center'; x.textBaseline = 'top';
          var tx = cx - R * 0.62;
          if (TILE) tx = clamp(tx, TILE.x0 + 8 + x.measureText('empieza aquí').width / 2, TILE.x1 - 8);
          x.fillText('empieza aquí', tx, cy + R * 0.60);
          x.restore();
        }
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     4 · QUÉ LÁMINAS LLEVA CADA TÉCNICA
     ══════════════════════════════════════════════════════════════ */
  var POR_TECNICA = {
    color_raiz: ['plantaCuatro', 'perfilHorizontal', 'nucaDiagonal'],
    color_global: ['plantaCuatro', 'perfilHorizontal', 'perfilOrden', 'nucaDiagonal'],
    color_balayage: ['plantaBalayage', 'perfilDiagonalPost', 'plantaZigzag', 'plantaHerradura'],
    color_sombre: ['plantaBalayage', 'perfilZigzag', 'plantaMediaLuna'],
    color_babylights: ['perfilInternacional', 'perfilZigzag', 'nucaEspiga'],
    mechas_aluminio: ['perfilInternacional', 'perfilDiagonalPost', 'perfilDiagonalAdel', 'perfilVertical', 'nucaLadrillo'],
    mechas_gorro: ['gorro'],
    hidra_profunda: ['perfilHorizontal', 'perfilOrden', 'nucaDiagonal'],
    hidra_nutricion: ['perfilHorizontal', 'nucaDiagonal'],
    quera_alisado: ['plantaNueve', 'perfilHorizontal', 'nucaDiagonal'],
    quera_botox: ['plantaCuatro', 'perfilHorizontal'],
    quim_permanente: ['plantaRadialOcho', 'plantaNueve', 'perfilRadial', 'nucaDiagonal'],
    quim_decoloracion: ['plantaCuatro', 'perfilHorizontal', 'perfilOrden', 'nucaDiagonal'],
    cab_secado: ['perfilPuntos', 'nucaOcho', 'perfilSeis'],
    cab_planchado: ['nucaOcho', 'perfilSeis', 'plantaNueve'],
    /* El corte todavía no es una técnica del Cerebro: sus láminas viven en el
       catálogo y se piden por id hasta que exista la familia. Van en juegos de
       cuatro como máximo: a partir de ahí la tarjeta se estrecha y los rótulos
       dejan de leerse en el PNG. */
    corte_capas: ['plantaHerradura', 'perfilDiagonalAdel', 'perfilDiagonalPost', 'nucaV'],
    corte_gradual: ['perfilElevaciones', 'perfilRadial', 'perfilSobredireccion'],
    corte_perimetro: ['nucaPerimetro', 'plantaTrianguloFrontal', 'nucaV'],
    anatomia_cabeza: ['perfilPuntos', 'perfilElevaciones', 'plantaTrianguloFrontal'],
    cab_derriz: ['plantaNueve', 'perfilHorizontal', 'nucaDiagonal']
  };

  /* ══════════════════════════════════════════════════════════════
     5 · LA LÁMINA COMPLETA
     ══════════════════════════════════════════════════════════════ */
  function marco(x, px, py, pw, ph) {
    x.save();
    x.fillStyle = '#ffffff';
    x.strokeStyle = '#e0d3b6'; x.lineWidth = 1;
    var r = 12;
    x.beginPath();
    x.moveTo(px + r, py); x.lineTo(px + pw - r, py);
    x.quadraticCurveTo(px + pw, py, px + pw, py + r); x.lineTo(px + pw, py + ph - r);
    x.quadraticCurveTo(px + pw, py + ph, px + pw - r, py + ph); x.lineTo(px + r, py + ph);
    x.quadraticCurveTo(px, py + ph, px, py + ph - r); x.lineTo(px, py + r);
    x.quadraticCurveTo(px, py, px + r, py);
    x.closePath(); x.fill(); x.stroke();
    x.restore();
  }

  function envolver(x, txt, ancho) {
    var pal = String(txt || '').split(' '), ls = [], c = '';
    pal.forEach(function (w) {
      var t = c ? c + ' ' + w : w;
      if (x.measureText(t).width > ancho && c) { ls.push(c); c = w; } else c = t;
    });
    if (c) ls.push(c);
    return ls;
  }

  var D = {

    /* Todas las láminas del catálogo, también las que aún no cuelgan de una
       técnica. Así un selector puede ofrecerlas sin tocar POR_TECNICA. */
    catalogo: function () {
      return Object.keys(LAMINAS).map(function (k) {
        return { id: k, n: LAMINAS[k].n, d: LAMINAS[k].d };
      });
    },

    laminasDe: function (tecId) {
      return (POR_TECNICA[tecId] || []).map(function (k) {
        return { id: k, n: LAMINAS[k].n, d: LAMINAS[k].d };
      });
    },

    tiene: function (tecId) { return !!(POR_TECNICA[tecId] || []).length; },

    /* Dibuja una sola lámina del catálogo, por id. */
    dibujarUna: function (x, id, cx, cy, R, p, o) {
      var L = LAMINAS[id];
      if (!L) return false;
      L.f(x, cx, cy, R, p == null ? 1 : p, o || {});
      return true;
    },

    /* Dibuja el juego completo de láminas de la técnica. */
    dibujar: function (x, W, H, tecId, o) {
      o = o || {};
      var ids = POR_TECNICA[tecId] || [];
      var p = o.p == null ? 1 : o.p;

      x.save();
      x.fillStyle = '#f6efe1';
      x.fillRect(0, 0, W, H);

      if (!ids.length) {
        x.font = '600 15px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#7c7c9e'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText('Esta técnica no divide el cabello: se trabaja sobre el rostro.', W / 2, H / 2);
        x.restore();
        return;
      }

      x.font = '800 15px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#1a1a2e'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillText('DIAGRAMA DE DIVISIONES' + (o.titulo ? '  ·  ' + o.titulo : ''), 30, 40);
      x.fillStyle = COL.guia;
      x.fillRect(30, 50, 96, 3);

      var m = 26, top = 70, bot = o.reservaPie == null ? 96 : o.reservaPie;
      var n = ids.length;
      /* Una lámina sola no debe estirarse a lo ancho de la página. */
      var pw = Math.min((W - m * (n + 1)) / n, W * 0.36);
      var ph = H - top - bot;
      var x0 = (W - (pw * n + m * (n - 1))) / 2;

      ids.forEach(function (id, j) {
        var L = LAMINAS[id];
        if (!L) return;
        var px = x0 + j * (pw + m), py = top;
        /* La cascada entre láminas se comprime según cuántas haya: con cinco
           el paso fijo de 0.18 dejaba la última sin acabar de dibujar incluso
           en p=1, y eso se veía en el PNG y en el PDF. */
        var paso = n > 1 ? Math.min(0.18, 0.38 / (n - 1)) : 0;
        var pp = clamp((p - j * paso) / (1 - j * paso), 0, 1);
        marco(x, px, py, pw, ph);

        x.save();
        x.font = '800 11.5px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#1a1a2e'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
        x.fillText((j + 1) + '. ' + L.n.toUpperCase(), px + 16, py + 26);
        x.restore();

        var R = Math.min(pw * 0.30, (ph - 130) * 0.36);
        var cx = px + pw / 2, cy = py + 44 + R * 1.25;
        if (id === 'plantaBalayage') { R = Math.min(pw * 0.26, (ph - 130) * 0.28); cy = py + 40 + R * 1.05; }

        x.save();
        x.beginPath(); x.rect(px + 1, py + 1, pw - 2, ph - 2); x.clip();
        TILE = { x0: px + 1, x1: px + pw - 1, R: R };
        L.f(x, cx, cy, R, pp, o);
        TILE = null;
        x.restore();

        /* el porqué de la división, en letra de apunte */
        x.save();
        x.font = '600 11.5px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#5a5a72'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
        var ls = envolver(x, L.d, pw - 32).slice(0, 4);
        var y0 = py + ph - 16 - (ls.length - 1) * 15;
        x.globalAlpha = clamp((pp - 0.55) / 0.35, 0, 1);
        ls.forEach(function (l, k) { x.fillText(l, px + 16, y0 + k * 15); });
        x.restore();
      });

      x.restore();
    }
  };

  window.EU_DIVISIONES = D;
})();
