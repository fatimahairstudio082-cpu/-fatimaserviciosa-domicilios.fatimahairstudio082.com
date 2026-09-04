/* ══════════════════════════════════════════════════════════════════════════
   LÁMINAS DE EXPOSICIÓN · motor
   ──────────────────────────────────────────────────────────────────────────
   El folleto pinta CELDAS en una rejilla. Una lámina de exposición pinta
   NODOS y las relaciones entre ellos, que es otra geometría: un mapa
   conceptual necesita saber quién cuelga de quién, un mandala necesita
   ángulos, y un carrusel necesita una secuencia con papel distinto por hoja.

   Por eso este motor es nuevo y no una plantilla más del folleto. Lo que sí
   reutiliza son los acabados que ya están resueltos ahí: recortes de foto,
   redondeos, mezcla de color y encaje de texto (FOLLETO_MOTOR).

   Entradas: una lámina (familia, estructura, paleta, formato, nodos, medios).
   Salidas: pintar(ctx, W, H, lamina, op) — con op.prog de 0 a 1 el mismo
   dibujo es el fotograma de la animación, así que el vídeo y el PNG salen
   del mismo código y nunca se separan.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_LAMINAS_MOTOR) return;
  window._B6_LAMINAS_MOTOR = true;

  var FM = function () { return window.FOLLETO_MOTOR || null; };

  /* ─────────────────────────── Formatos ─────────────────────────── */

  var FORMATOS = {
    a4v: { nombre: 'A4 vertical', w: 1240, h: 1754, mm: [210, 297] },
    a4h: { nombre: 'A4 horizontal', w: 1754, h: 1240, mm: [297, 210] },
    a3v: { nombre: 'A3 vertical · póster', w: 1754, h: 2480, mm: [297, 420] },
    a3h: { nombre: 'A3 horizontal · póster', w: 2480, h: 1754, mm: [420, 297] },
    cuadrado: { nombre: 'Cuadrado 1:1', w: 1440, h: 1440, mm: [200, 200] },
    historia: { nombre: 'Historia 9:16', w: 1080, h: 1920, mm: [120, 213] },
    pizarra: { nombre: 'Pantalla 16:9', w: 1920, h: 1080, mm: [297, 167] }
  };

  /* ─────────────────────────── Tipografías ─────────────────────────── */

  var T_DISPLAY = '"Space Grotesk", "Segoe UI", sans-serif';
  var T_SERIF = '"Playfair Display", Georgia, serif';
  var T_GARA = '"Cormorant Garamond", Georgia, serif';
  var T_CUERPO = 'Manrope, "Segoe UI", Arial, sans-serif';
  var T_MANO = '"Patrick Hand", "Comic Sans MS", cursive';
  var T_MONO = '"IBM Plex Mono", Consolas, monospace';

  function garantizarFuentes() {
    if (typeof document === 'undefined' || document.getElementById('lamFuentes')) return;
    var l = document.createElement('link');
    l.id = 'lamFuentes';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&' +
      'family=Manrope:wght@400;600;800&family=Playfair+Display:wght@600;800&' +
      'family=Cormorant+Garamond:wght@500;700&family=Patrick+Hand&' +
      'family=IBM+Plex+Mono:wght@500;600&display=swap';
    document.head.appendChild(l);
  }

  /* ─────────────────────────── Paletas ───────────────────────────
     Dos grupos, como se pidió: las educativas nuevas y las del folleto.
     Cada paleta trae su propia serie de colores de rama (`serie`): es lo que
     hace que un mapa de seis ramas se lea sin repetir color. */

  var EDU = [
    {
      id: 'pizarra', nombre: 'Pizarra verde', grupo: 'Educativas',
      claro: false, fondo: '#16302A', panel: '#1E4038', tinta: '#F2F6F0', tinta2: '#A9C4B6',
      acento: '#F2D06B', acento2: '#7FBF9A', titulo: T_MANO, cuerpo: T_CUERPO,
      serie: ['#F2D06B', '#7FBF9A', '#8FC7E8', '#F09A8A', '#C9A7E8', '#EFC7A0', '#9FD8C8', '#E8E0A0']
    },
    {
      id: 'pizarra_negra', nombre: 'Pizarra negra', grupo: 'Educativas',
      claro: false, fondo: '#131315', panel: '#1E1E22', tinta: '#F4F2EE', tinta2: '#A8A6A0',
      acento: '#F6E27A', acento2: '#79C7D6', titulo: T_MANO, cuerpo: T_CUERPO,
      serie: ['#F6E27A', '#79C7D6', '#F29CA8', '#A6E08A', '#C4A8F0', '#F0B27A', '#8FD4C6', '#E4E4E4']
    },
    {
      id: 'cuaderno', nombre: 'Cuaderno', grupo: 'Educativas',
      claro: true, fondo: '#FBF8F0', panel: '#FFFFFF', tinta: '#232028', tinta2: '#6E6A78',
      acento: '#2F6FB5', acento2: '#D0523F', titulo: T_MANO, cuerpo: T_CUERPO,
      serie: ['#2F6FB5', '#D0523F', '#2E8C6A', '#B4832A', '#7A4BC0', '#C0417A', '#1F7C93', '#5C6570'],
      papel: 'renglones'
    },
    {
      id: 'cuadricula', nombre: 'Cuadrícula técnica', grupo: 'Educativas',
      claro: true, fondo: '#F4F6F8', panel: '#FFFFFF', tinta: '#1D2126', tinta2: '#5F6B76',
      acento: '#20618C', acento2: '#C2410C', titulo: T_DISPLAY, cuerpo: T_CUERPO,
      serie: ['#20618C', '#C2410C', '#0F766E', '#7C3AED', '#B45309', '#BE123C', '#1D4ED8', '#4D7C0F'],
      papel: 'cuadricula'
    },
    {
      id: 'semaforo', nombre: 'Semáforo', grupo: 'Educativas',
      claro: true, fondo: '#FFFDF6', panel: '#FFFFFF', tinta: '#26221C', tinta2: '#6B6459',
      acento: '#1E8C4A', acento2: '#D22B2B', titulo: T_DISPLAY, cuerpo: T_CUERPO,
      serie: ['#1E8C4A', '#E3A008', '#D22B2B', '#2563A8', '#7C3AED', '#0E7490', '#B45309', '#4B5563']
    },
    {
      id: 'pastel', nombre: 'Pastel escolar', grupo: 'Educativas',
      claro: true, fondo: '#FDF6FA', panel: '#FFFFFF', tinta: '#2E2430', tinta2: '#7C6E80',
      acento: '#C86BA0', acento2: '#6BB8C8', titulo: T_MANO, cuerpo: T_CUERPO,
      serie: ['#C86BA0', '#6BB8C8', '#F0A868', '#8AC48A', '#A98CD8', '#E88C9A', '#7BC2B0', '#D8B85A']
    },
    {
      id: 'infantil', nombre: 'Infantil primario', grupo: 'Educativas',
      claro: true, fondo: '#FFFEF2', panel: '#FFFFFF', tinta: '#241F14', tinta2: '#6E6552',
      acento: '#E8402A', acento2: '#1E6FD0', titulo: T_MANO, cuerpo: T_CUERPO,
      serie: ['#E8402A', '#1E6FD0', '#F2B300', '#1F9E4A', '#8B44C0', '#00A2B8', '#F06292', '#7C5A2A']
    },
    {
      id: 'cientifico', nombre: 'Científico', grupo: 'Educativas',
      claro: false, fondo: '#0E1726', panel: '#182338', tinta: '#EAF1FA', tinta2: '#93A6C0',
      acento: '#4FD1C5', acento2: '#7C9CF0', titulo: T_DISPLAY, cuerpo: T_MONO,
      serie: ['#4FD1C5', '#7C9CF0', '#F0A868', '#F07A9A', '#A78BFA', '#66D9A0', '#E8D06B', '#8FB8D8']
    },
    {
      id: 'humanidades', nombre: 'Humanidades', grupo: 'Educativas',
      claro: true, fondo: '#F6F1E7', panel: '#FFFDF8', tinta: '#26201A', tinta2: '#6E6152',
      acento: '#8C5A2B', acento2: '#3E6B5A', titulo: T_GARA, cuerpo: T_CUERPO,
      serie: ['#8C5A2B', '#3E6B5A', '#A03A3A', '#5A5A8C', '#8A7A2A', '#7A4A6A', '#2E6A7A', '#5C5248']
    },
    {
      id: 'editorial_edu', nombre: 'Editorial claro', grupo: 'Educativas',
      claro: true, fondo: '#FAFAF8', panel: '#FFFFFF', tinta: '#1B1B1E', tinta2: '#66666E',
      acento: '#1B1B1E', acento2: '#B08A2E', titulo: T_SERIF, cuerpo: T_CUERPO,
      serie: ['#1B1B1E', '#B08A2E', '#3E5C7A', '#7A3E4E', '#3E7A5C', '#5C3E7A', '#7A5C3E', '#4E4E56']
    },
    {
      id: 'mandala_tierra', nombre: 'Mandala tierra', grupo: 'Educativas',
      claro: true, fondo: '#F3EAD9', panel: '#FFFAF0', tinta: '#2A2118', tinta2: '#7A6A54',
      acento: '#B5651D', acento2: '#3F6B5A', titulo: T_GARA, cuerpo: T_CUERPO,
      serie: ['#B5651D', '#3F6B5A', '#8C4A5A', '#6A5A9A', '#A88A2A', '#2E7A6A', '#9A4A2A', '#5A6A3A']
    },
    {
      id: 'mandala_noche', nombre: 'Mandala noche', grupo: 'Educativas',
      claro: false, fondo: '#140F22', panel: '#1F1836', tinta: '#F2EEFA', tinta2: '#A79CC4',
      acento: '#E8C36B', acento2: '#9A7AE0', titulo: T_GARA, cuerpo: T_CUERPO,
      serie: ['#E8C36B', '#9A7AE0', '#6BC9D8', '#E88AA8', '#8AD8A8', '#C0A0F0', '#F0A87A', '#D8D0F0']
    }
  ];

  /* Las del folleto, tal cual, para que una lámina pueda ir a juego con la
     carta del negocio. Se les añade la serie de rama derivada del acento. */
  function paletasFolleto() {
    var M = FM();
    if (!M || !M.TEMAS) return [];
    var out = [];
    Object.keys(M.TEMAS).forEach(function (k) {
      var t = M.TEMAS[k];
      out.push({
        id: 'fol_' + k, nombre: t.nombre, grupo: 'Del folleto',
        claro: t.claro, fondo: t.fondo, panel: t.panel, tinta: t.tinta, tinta2: t.tinta2,
        acento: t.acento, acento2: t.acento2, titulo: t.titulo, cuerpo: t.cuerpo,
        serie: serieDe(t.acento, t.acento2, t.tinta2)
      });
    });
    return out;
  }

  /* Serie de ocho colores de rama a partir de dos acentos: se recorre el tono
     entre uno y otro, no se inventan colores fuera de la paleta. */
  function serieDe(a, b, c) {
    var M = FM(), mez = (M && M.mezclar) || function (x) { return x; };
    return [a, b, mez(a, b, 0.5), mez(a, c || b, 0.4), mez(b, c || a, 0.4),
      mez(a, b, 0.25), mez(a, b, 0.75), c || a];
  }

  var PALETAS = null;
  function paletas() {
    if (!PALETAS) PALETAS = EDU.concat(paletasFolleto());
    return PALETAS;
  }
  function paleta(id) {
    var L = paletas();
    for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i];
    return L[0];
  }

  /* Paleta efectiva: la de la lámina más los cambios de color que la persona
     haya hecho a mano (lam.colores). */
  function colores(lam) {
    var P = paleta(lam && lam.paleta);
    var c = {
      fondo: P.fondo, panel: P.panel, tinta: P.tinta, tinta2: P.tinta2,
      acento: P.acento, acento2: P.acento2, titulo: P.titulo, cuerpo: P.cuerpo,
      claro: P.claro, papel: P.papel, serie: P.serie.slice()
    };
    var m = (lam && lam.colores) || {};
    Object.keys(m).forEach(function (k) { if (m[k]) c[k] = m[k]; });
    if (lam && lam.serie && lam.serie.length) c.serie = lam.serie.slice();
    return c;
  }

  /* ─────────────────────────── Formas de nodo ─────────────────────────── */

  var FORMAS_NODO = {
    caja: { nombre: 'Caja', r: 0.10 },
    recta: { nombre: 'Recta', r: 0 },
    pildora: { nombre: 'Píldora', r: 0.5 },
    circulo: { nombre: 'Círculo' },
    hexagono: { nombre: 'Hexágono' },
    rombo: { nombre: 'Rombo' },
    nube: { nombre: 'Nube' },
    etiqueta: { nombre: 'Etiqueta' },
    pergamino: { nombre: 'Pergamino' },
    hoja: { nombre: 'Hoja' }
  };

  function caminoNodo(ctx, x, y, w, h, forma) {
    var M = FM();
    var r, i, a;
    ctx.beginPath();
    if (forma === 'circulo') {
      r = Math.min(w, h) / 2;
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    } else if (forma === 'hexagono') {
      var m = w * 0.18;
      ctx.moveTo(x + m, y); ctx.lineTo(x + w - m, y); ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w - m, y + h); ctx.lineTo(x + m, y + h); ctx.lineTo(x, y + h / 2);
      ctx.closePath();
    } else if (forma === 'rombo') {
      ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath();
    } else if (forma === 'nube') {
      var cx = x + w / 2, cy = y + h / 2;
      for (i = 0; i < 9; i++) {
        a = i / 9 * Math.PI * 2;
        var rr = (i % 2 ? 0.40 : 0.50);
        ctx.ellipse(cx + Math.cos(a) * w * 0.30, cy + Math.sin(a) * h * 0.26,
          w * rr * 0.42, h * rr * 0.52, 0, 0, Math.PI * 2);
      }
    } else if (forma === 'etiqueta') {
      var p = h * 0.28;
      ctx.moveTo(x, y); ctx.lineTo(x + w - p, y); ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w - p, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    } else if (forma === 'pergamino') {
      var o = h * 0.16;
      ctx.moveTo(x, y + o);
      ctx.quadraticCurveTo(x + w / 2, y - o * 0.6, x + w, y + o);
      ctx.lineTo(x + w, y + h - o);
      ctx.quadraticCurveTo(x + w / 2, y + h + o * 0.6, x, y + h - o);
      ctx.closePath();
    } else if (forma === 'hoja') {
      var rr2 = Math.min(w, h) * 0.5;
      ctx.moveTo(x, y + rr2);
      ctx.quadraticCurveTo(x, y, x + rr2, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h - rr2);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr2, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    } else {
      r = (FORMAS_NODO[forma] ? FORMAS_NODO[forma].r : 0.10);
      r = r >= 0.5 ? Math.min(w, h) / 2 : Math.min(w, h) * r;
      if (M && M.redondo) { M.redondo(ctx, x, y, w, h, r); }
      else {
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }
    }
  }

  /* ─────────────────────────── Texto ─────────────────────────── */

  function partir(ctx, texto, maxW) {
    var pal = String(texto == null ? '' : texto).split(/\s+/), li = '', out = [];
    for (var i = 0; i < pal.length; i++) {
      var p = li ? li + ' ' + pal[i] : pal[i];
      if (ctx.measureText(p).width > maxW && li) { out.push(li); li = pal[i]; }
      else li = p;
    }
    if (li) out.push(li);
    return out;
  }

  /* Encaja el texto en la caja bajando el cuerpo hasta que cabe. Devuelve el
     bloque de líneas y su tamaño, para poder centrarlo en vertical. */
  function bloque(ctx, texto, maxW, maxH, tam, peso, fuente, minTam) {
    minTam = minTam || 8;
    while (tam > minTam) {
      ctx.font = peso + ' ' + tam.toFixed(1) + 'px ' + fuente;
      var l = partir(ctx, texto, maxW);
      if (l.length * tam * 1.22 <= maxH) return { lineas: l, tam: tam };
      tam -= 1;
    }
    ctx.font = peso + ' ' + minTam.toFixed(1) + 'px ' + fuente;
    return { lineas: partir(ctx, texto, maxW).slice(0, Math.max(1, Math.floor(maxH / (minTam * 1.22)))), tam: minTam };
  }

  function pintarBloque(ctx, b, cx, cy, color, alinear) {
    ctx.fillStyle = color;
    ctx.textAlign = alinear || 'center';
    var alto = b.lineas.length * b.tam * 1.22;
    var y = cy - alto / 2 + b.tam * 0.95;
    for (var i = 0; i < b.lineas.length; i++) {
      ctx.fillText(b.lineas[i], cx, y + i * b.tam * 1.22);
    }
  }

  function rgba(h, a) {
    var M = FM();
    if (M && M.rgba) return M.rgba(h, a);
    return h;
  }
  function mezclar(a, b, t) {
    var M = FM();
    if (M && M.mezclar) return M.mezclar(a, b, t);
    return a;
  }

  /* ─────────────────────────── Nodos autorales ───────────────────────────
     El editor guarda una lista PLANA con nivel: 0 el centro, 1 las ramas,
     2 las subramas. Plana se edita, se pega y se reordena sin pelearse con
     un árbol; el árbol se reconstruye aquí para dibujar. */

  function arbol(nodos) {
    var raiz = null, ramas = [];
    (nodos || []).forEach(function (n) {
      var nv = n.nivel || 0;
      if (nv === 0 && !raiz) { raiz = { n: n, hijos: [] }; return; }
      if (nv <= 1 || !ramas.length) { ramas.push({ n: n, hijos: [] }); return; }
      ramas[ramas.length - 1].hijos.push({ n: n, hijos: [] });
    });
    if (!raiz) raiz = { n: { t: '', d: '' }, hijos: [] };
    raiz.hijos = ramas;
    return raiz;
  }

  /* Un texto pegado se convierte en nodos: la primera línea es el centro, las
     que empiezan con guión o van sangradas son subramas. Es la forma en que la
     gente escribe un esquema en el móvil. */
  function nodosDeTexto(texto) {
    var out = [];
    String(texto || '').split(/\r?\n/).forEach(function (li) {
      if (!li.trim()) return;
      var sangrada = /^(\s{2,}|\t|[-–·•*]\s*[-–·•*]\s)/.test(li);
      var conGuion = /^\s*[-–·•*]\s+/.test(li);
      var limpio = li.replace(/^\s*[-–·•*\d.)\s]+/, '').trim();
      if (!limpio) return;
      var partes = limpio.split(/\s*[:|—]\s*/);
      var nivel = out.length === 0 ? 0 : (sangrada ? 2 : (conGuion ? 1 : 1));
      out.push({ t: partes[0], d: partes.slice(1).join(' · '), nivel: nivel });
    });
    if (!out.length) out.push({ t: 'Tema central', d: '', nivel: 0 });
    return out;
  }

  /* ═══════════════════════ ESTRUCTURAS ═══════════════════════
     Cada estructura reparte los nodos en el área útil y devuelve
     { cajas:[…], enlaces:[…] } en coordenadas del lienzo. Nada de esto sabe
     de colores ni de animación: sólo de geometría. */

  function caja(x, y, w, h, nodo, nivel, col, forma) {
    return { x: x, y: y, w: w, h: h, n: nodo, nivel: nivel, col: col, forma: forma };
  }

  var ESTRUCTURAS = {

    /* ── Mapas conceptuales ── */

    radial: {
      fam: 'mapa', nombre: 'Radial clásico',
      d: 'Centro grande y las ramas alrededor, unidas con curvas.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i;
        var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
        var rc = Math.min(A.w, A.h) * 0.155;
        cajas.push(caja(cx - rc, cy - rc, rc * 2, rc * 2, R.n, 0, C.acento, op.formaCentro || 'circulo'));
        var n = R.hijos.length || 1;
        var radio = Math.min(A.w, A.h) * 0.375;
        var rw = A.w * 0.235, rh = A.h * 0.105;
        for (i = 0; i < R.hijos.length; i++) {
          var a = -Math.PI / 2 + i / n * Math.PI * 2;
          var x = cx + Math.cos(a) * radio * (A.w / Math.min(A.w, A.h)) * 0.86;
          var y = cy + Math.sin(a) * radio * (A.h / Math.min(A.w, A.h)) * 0.86;
          var col = C.serie[i % C.serie.length];
          var c = caja(x - rw / 2, y - rh / 2, rw, rh, R.hijos[i].n, 1, col, op.forma || 'caja');
          cajas.push(c);
          enl.push({ a: { x: cx, y: cy }, b: { x: x, y: y }, col: col, curva: true });
          var hs = R.hijos[i].hijos;
          for (var j = 0; j < hs.length; j++) {
            var sa = a + (j - (hs.length - 1) / 2) * 0.30;
            var sx = cx + Math.cos(sa) * radio * 1.42 * (A.w / Math.min(A.w, A.h)) * 0.86;
            var sy = cy + Math.sin(sa) * radio * 1.42 * (A.h / Math.min(A.w, A.h)) * 0.86;
            var sw = rw * 0.80, sh = rh * 0.74;
            sx = Math.max(A.x + sw / 2, Math.min(A.x + A.w - sw / 2, sx));
            sy = Math.max(A.y + sh / 2, Math.min(A.y + A.h - sh / 2, sy));
            cajas.push(caja(sx - sw / 2, sy - sh / 2, sw, sh, hs[j].n, 2, col, op.formaHijo || 'pildora'));
            enl.push({ a: { x: x, y: y }, b: { x: sx, y: sy }, col: col, curva: true, fino: true });
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    arbol: {
      fam: 'mapa', nombre: 'Árbol descendente',
      d: 'El tema arriba y los niveles bajando, como un organigrama.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i, j;
        var cw = A.w * 0.34, ch = A.h * 0.10;
        var cx = A.x + A.w / 2;
        cajas.push(caja(cx - cw / 2, A.y, cw, ch, R.n, 0, C.acento, op.formaCentro || 'caja'));
        var n = Math.max(1, R.hijos.length);
        var fila = A.y + A.h * 0.28;
        var rw = Math.min(A.w / n * 0.86, A.w * 0.30), rh = A.h * 0.095;
        for (i = 0; i < R.hijos.length; i++) {
          var x = A.x + (i + 0.5) * (A.w / n) - rw / 2;
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(x, fila, rw, rh, R.hijos[i].n, 1, col, op.forma || 'caja'));
          enl.push({ a: { x: cx, y: A.y + ch }, b: { x: x + rw / 2, y: fila }, col: col, codo: true });
          var hs = R.hijos[i].hijos;
          for (j = 0; j < hs.length; j++) {
            var sy = fila + rh + A.h * 0.055 + j * (A.h * 0.082);
            var sh = A.h * 0.062, sw = rw * 0.94;
            if (sy + sh > A.y + A.h) break;
            cajas.push(caja(x + rw * 0.03, sy, sw, sh, hs[j].n, 2, col, op.formaHijo || 'recta'));
            enl.push({
              a: { x: x + rw * 0.10, y: fila + rh }, b: { x: x + rw * 0.10, y: sy + sh / 2 },
              col: col, escuadra: true, fino: true
            });
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    arbol_lateral: {
      fam: 'mapa', nombre: 'Árbol lateral',
      d: 'Tema a la izquierda y las ramas abriéndose a la derecha.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i, j;
        var cw = A.w * 0.22, ch = A.h * 0.16;
        var cy = A.y + A.h / 2;
        cajas.push(caja(A.x, cy - ch / 2, cw, ch, R.n, 0, C.acento, op.formaCentro || 'caja'));
        var n = Math.max(1, R.hijos.length);
        var rw = A.w * 0.30, rh = Math.min(A.h / n * 0.70, A.h * 0.13);
        for (i = 0; i < R.hijos.length; i++) {
          var y = A.y + (i + 0.5) * (A.h / n) - rh / 2;
          var x = A.x + A.w * 0.30;
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(x, y, rw, rh, R.hijos[i].n, 1, col, op.forma || 'caja'));
          enl.push({ a: { x: A.x + cw, y: cy }, b: { x: x, y: y + rh / 2 }, col: col, curva: true });
          var hs = R.hijos[i].hijos;
          for (j = 0; j < hs.length; j++) {
            var sh = Math.min(rh * 0.52, A.h * 0.062);
            var sy = y + rh / 2 - (hs.length - 1) * sh * 0.72 + j * sh * 1.44 - sh / 2;
            var sx = A.x + A.w * 0.66, sw = A.w * 0.30;
            cajas.push(caja(sx, sy, sw, sh, hs[j].n, 2, col, op.formaHijo || 'pildora'));
            enl.push({ a: { x: x + rw, y: y + rh / 2 }, b: { x: sx, y: sy + sh / 2 }, col: col, curva: true, fino: true });
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    espina: {
      fam: 'mapa', nombre: 'Espina · causa y efecto',
      d: 'Eje central y las causas entrando en diagonal, arriba y abajo.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i;
        var cy = A.y + A.h / 2;
        var cw = A.w * 0.19, ch = A.h * 0.14;
        cajas.push(caja(A.x + A.w - cw, cy - ch / 2, cw, ch, R.n, 0, C.acento, op.formaCentro || 'etiqueta'));
        enl.push({ a: { x: A.x, y: cy }, b: { x: A.x + A.w - cw, y: cy }, col: C.tinta2, grueso: true, eje: true });
        var n = Math.max(1, R.hijos.length);
        var rw = A.w * 0.215, rh = A.h * 0.088;
        for (i = 0; i < R.hijos.length; i++) {
          var arriba = i % 2 === 0;
          var k = Math.floor(i / 2);
          var porLado = Math.ceil(n / 2);
          var px = A.x + A.w * 0.10 + (k + 0.5) * ((A.w * 0.72) / Math.max(1, porLado));
          var y = arriba ? A.y + A.h * 0.06 : A.y + A.h * 0.94 - rh;
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(px - rw / 2, y, rw, rh, R.hijos[i].n, 1, col, op.forma || 'caja'));
          var pie = { x: px + (arriba ? rw * 0.28 : rw * 0.28), y: cy };
          enl.push({ a: { x: px, y: arriba ? y + rh : y }, b: pie, col: col });
          var hs = R.hijos[i].hijos;
          for (var j = 0; j < hs.length; j++) {
            var sw = rw * 0.86, sh = A.h * 0.052;
            var sy = arriba ? y + rh + A.h * 0.02 + j * (sh + A.h * 0.012)
              : y - A.h * 0.02 - (j + 1) * (sh + A.h * 0.012);
            cajas.push(caja(px - sw / 2 + rw * 0.14, sy, sw, sh, hs[j].n, 2, col, op.formaHijo || 'recta'));
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    burbujas: {
      fam: 'mapa', nombre: 'Burbujas',
      d: 'Todo en círculos: el centro grande y las ideas flotando.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i;
        var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
        var base = Math.min(A.w, A.h);
        var rc = base * 0.165;
        cajas.push(caja(cx - rc, cy - rc, rc * 2, rc * 2, R.n, 0, C.acento, 'circulo'));
        var n = Math.max(1, R.hijos.length);
        for (i = 0; i < R.hijos.length; i++) {
          var a = -Math.PI / 2 + i / n * Math.PI * 2;
          var rr = base * (0.098 - Math.min(0.03, n * 0.002));
          var d = base * 0.36;
          var x = cx + Math.cos(a) * d * (A.w / base) * 0.92;
          var y = cy + Math.sin(a) * d * (A.h / base) * 0.92;
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(x - rr, y - rr, rr * 2, rr * 2, R.hijos[i].n, 1, col, 'circulo'));
          enl.push({ a: { x: cx, y: cy }, b: { x: x, y: y }, col: col, puntos: true });
          var hs = R.hijos[i].hijos;
          for (var j = 0; j < hs.length; j++) {
            var sa = a + (j - (hs.length - 1) / 2) * 0.42;
            var sr = rr * 0.56;
            var sx = cx + Math.cos(sa) * d * 1.52 * (A.w / base) * 0.92;
            var sy = cy + Math.sin(sa) * d * 1.52 * (A.h / base) * 0.92;
            sx = Math.max(A.x + sr, Math.min(A.x + A.w - sr, sx));
            sy = Math.max(A.y + sr, Math.min(A.y + A.h - sr, sy));
            cajas.push(caja(sx - sr, sy - sr, sr * 2, sr * 2, hs[j].n, 2, col, 'circulo'));
            enl.push({ a: { x: x, y: y }, b: { x: sx, y: sy }, col: col, puntos: true, fino: true });
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    cadena: {
      fam: 'mapa', nombre: 'Cadena de pasos',
      d: 'Los nodos en fila con flechas: proceso de principio a fin.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i;
        var lista = R.hijos.length ? R.hijos : [{ n: R.n, hijos: [] }];
        var n = lista.length;
        var filas = n > 4 ? 2 : 1;
        var porFila = Math.ceil(n / filas);
        var cw = (A.w / porFila) * 0.82, ch = A.h / filas * 0.42;
        for (i = 0; i < n; i++) {
          var f = Math.floor(i / porFila), k = i % porFila;
          var izqDer = f % 2 === 0;
          var kk = izqDer ? k : (porFila - 1 - k);
          var x = A.x + (kk + 0.5) * (A.w / porFila) - cw / 2;
          var y = A.y + A.h * (filas === 1 ? 0.30 : (f === 0 ? 0.10 : 0.56));
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(x, y, cw, ch, lista[i].n, i === 0 ? 0 : 1, col, op.forma || 'caja'));
          if (i > 0) {
            var pv = cajas[cajas.length - 2];
            enl.push({
              a: { x: pv.x + pv.w / 2, y: pv.y + pv.h / 2 },
              b: { x: x + cw / 2, y: y + ch / 2 }, col: col, flecha: true, grueso: true
            });
          }
          var hs = lista[i].hijos;
          for (var j = 0; j < hs.length; j++) {
            var sh = A.h * 0.048;
            var sy = y + ch + A.h * 0.012 + j * (sh + A.h * 0.008);
            cajas.push(caja(x, sy, cw, sh, hs[j].n, 2, col, 'recta'));
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    red: {
      fam: 'mapa', nombre: 'Red de relaciones',
      d: 'Nodos en círculo, todos conectados entre sí. Para relacionar ideas.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i, j;
        var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
        var base = Math.min(A.w, A.h);
        var lista = R.hijos.length ? R.hijos : [{ n: R.n, hijos: [] }];
        var n = lista.length;
        var pts = [];
        var rw = base * 0.24, rh = base * 0.095;
        for (i = 0; i < n; i++) {
          var a = -Math.PI / 2 + i / n * Math.PI * 2;
          var x = cx + Math.cos(a) * A.w * 0.36;
          var y = cy + Math.sin(a) * A.h * 0.34;
          pts.push({ x: x, y: y });
        }
        for (i = 0; i < n; i++) {
          for (j = i + 1; j < n; j++) {
            enl.push({ a: pts[i], b: pts[j], col: C.tinta2, fino: true, tenue: true });
          }
        }
        var rc = base * 0.13;
        cajas.push(caja(cx - rc, cy - rc, rc * 2, rc * 2, R.n, 0, C.acento, 'circulo'));
        for (i = 0; i < n; i++) {
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(pts[i].x - rw / 2, pts[i].y - rh / 2, rw, rh, lista[i].n, 1, col, op.forma || 'pildora'));
          enl.push({ a: { x: cx, y: cy }, b: pts[i], col: col });
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    niveles: {
      fam: 'mapa', nombre: 'Bandas por nivel',
      d: 'Una banda por nivel de jerarquía, con su rótulo al margen.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i, j;
        var bandas = [[R], R.hijos, []];
        R.hijos.forEach(function (h) { h.hijos.forEach(function (s) { bandas[2].push(s); }); });
        var alto = A.h / 3;
        for (i = 0; i < 3; i++) {
          var lista = bandas[i];
          if (!lista.length) continue;
          var ch = alto * (i === 0 ? 0.46 : 0.40);
          var y = A.y + i * alto + (alto - ch) / 2;
          var n = lista.length;
          var cw = Math.min((A.w * 0.92) / n * 0.90, A.w * (i === 0 ? 0.40 : 0.30));
          for (j = 0; j < n; j++) {
            var x = A.x + A.w * 0.06 + (j + 0.5) * ((A.w * 0.94) / n) - cw / 2;
            var col = i === 0 ? C.acento : C.serie[j % C.serie.length];
            cajas.push(caja(x, y, cw, ch, lista[j].n, i, col, op.forma || 'caja'));
            if (i > 0) {
              enl.push({
                a: { x: A.x + A.w / 2, y: A.y + (i - 0.5) * alto + ch * 0.4 },
                b: { x: x + cw / 2, y: y }, col: col, fino: true, tenue: true
              });
            }
          }
        }
        return { cajas: cajas, enlaces: enl, bandas: 3 };
      }
    },

    sol: {
      fam: 'mapa', nombre: 'Sol de ideas',
      d: 'Rayos que salen del centro, con la idea escrita sobre el rayo.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i;
        var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
        var base = Math.min(A.w, A.h);
        var rc = base * 0.145;
        cajas.push(caja(cx - rc, cy - rc, rc * 2, rc * 2, R.n, 0, C.acento, 'circulo'));
        var n = Math.max(1, R.hijos.length);
        for (i = 0; i < R.hijos.length; i++) {
          var a = -Math.PI / 2 + i / n * Math.PI * 2;
          var d0 = rc * 1.08, d1 = base * 0.46;
          var col = C.serie[i % C.serie.length];
          enl.push({
            a: { x: cx + Math.cos(a) * d0, y: cy + Math.sin(a) * d0 },
            b: { x: cx + Math.cos(a) * d1 * (A.w / base) * 0.94, y: cy + Math.sin(a) * d1 * (A.h / base) * 0.94 },
            col: col, grueso: true, rayo: true
          });
          var rw = base * 0.26, rh = base * 0.072;
          var x = cx + Math.cos(a) * (d1 + rw * 0.42) * (A.w / base) * 0.94;
          var y = cy + Math.sin(a) * (d1 + rh * 0.9) * (A.h / base) * 0.94;
          x = Math.max(A.x + rw / 2, Math.min(A.x + A.w - rw / 2, x));
          y = Math.max(A.y + rh / 2, Math.min(A.y + A.h - rh / 2, y));
          cajas.push(caja(x - rw / 2, y - rh / 2, rw, rh, R.hijos[i].n, 1, col, op.forma || 'pildora'));
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    columnas: {
      fam: 'mapa', nombre: 'Columnas por rama',
      d: 'Una columna por rama y sus puntos debajo. Cabe mucho texto.',
      calc: function (A, R, C, op) {
        var cajas = [], enl = [], i, j;
        var n = Math.max(1, R.hijos.length);
        var cw = (A.w / n) * 0.90;
        var cabW = A.w * 0.46, cabH = A.h * 0.11;
        cajas.push(caja(A.x + (A.w - cabW) / 2, A.y, cabW, cabH, R.n, 0, C.acento, op.formaCentro || 'caja'));
        for (i = 0; i < R.hijos.length; i++) {
          var x = A.x + (i + 0.5) * (A.w / n) - cw / 2;
          var y = A.y + A.h * 0.19;
          var ch = A.h * 0.10;
          var col = C.serie[i % C.serie.length];
          cajas.push(caja(x, y, cw, ch, R.hijos[i].n, 1, col, op.forma || 'caja'));
          enl.push({ a: { x: A.x + A.w / 2, y: A.y + cabH }, b: { x: x + cw / 2, y: y }, col: col, codo: true });
          var hs = R.hijos[i].hijos;
          for (j = 0; j < hs.length; j++) {
            var sh = A.h * 0.072;
            var sy = y + ch + A.h * 0.028 + j * (sh + A.h * 0.016);
            if (sy + sh > A.y + A.h) break;
            cajas.push(caja(x, sy, cw, sh, hs[j].n, 2, col, op.formaHijo || 'recta'));
          }
        }
        return { cajas: cajas, enlaces: enl };
      }
    },

    /* ── Mandala ── */

    mandala_petalos: {
      fam: 'mandala', nombre: 'Pétalos',
      d: 'Pétalos alrededor del centro, uno por idea.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'petalo'); }
    },
    mandala_cunas: {
      fam: 'mandala', nombre: 'Cuñas',
      d: 'La rueda partida en sectores: cada idea ocupa su porción.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'cuna'); }
    },
    mandala_anillos: {
      fam: 'mandala', nombre: 'Anillos concéntricos',
      d: 'Del centro hacia fuera: núcleo, ramas y detalle en tres aros.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'anillo'); }
    },
    mandala_roseton: {
      fam: 'mandala', nombre: 'Rosetón',
      d: 'Círculos tangentes girando, con la idea dentro de cada uno.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'roseton'); }
    },
    mandala_estrella: {
      fam: 'mandala', nombre: 'Estrella',
      d: 'Puntas geométricas: se lee como un diagrama de fuerzas.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'estrella'); }
    },
    mandala_espiral: {
      fam: 'mandala', nombre: 'Espiral',
      d: 'La secuencia enrollada: útil cuando hay orden y no jerarquía.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'espiral'); }
    },
    mandala_reloj: {
      fam: 'mandala', nombre: 'Reloj',
      d: 'Las horas como etapas: rutina, ciclo, jornada.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'reloj'); }
    },
    mandala_mosaico: {
      fam: 'mandala', nombre: 'Mosaico radial',
      d: 'Teselas repetidas en simetría: la más decorativa de las ocho.',
      calc: function (A, R, C, op) { return mandala(A, R, C, op, 'mosaico'); }
    },

    /* ── Carrusel: cada lámina es una hoja de una serie ── */

    car_portada: {
      fam: 'carrusel', nombre: 'Portada',
      d: 'Título enorme, una foto de fondo y el número de la serie.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'portada'); }
    },
    car_punto: {
      fam: 'carrusel', nombre: 'Un punto por hoja',
      d: 'Número grande, idea y su explicación. La hoja de desarrollo.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'punto'); }
    },
    car_lista: {
      fam: 'carrusel', nombre: 'Lista corta',
      d: 'Tres o cuatro puntos en la misma hoja, con marca de viñeta.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'lista'); }
    },
    car_cita: {
      fam: 'carrusel', nombre: 'Cita',
      d: 'Una frase grande y su autoría. Sirve de respiro en la serie.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'cita'); }
    },
    car_dato: {
      fam: 'carrusel', nombre: 'Dato',
      d: 'Una cifra enorme con su pie. Para lo que hay que recordar.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'dato'); }
    },
    car_cierre: {
      fam: 'carrusel', nombre: 'Cierre',
      d: 'Resumen en dos líneas y llamada a la acción.',
      calc: function (A, R, C, op) { return hoja(A, R, C, op, 'cierre'); }
    },

    /* ── Póster: se lee de pie, de lejos y de una pasada ── */

    pos_cartel: {
      fam: 'poster', nombre: 'Cartel · titular y pie',
      d: 'Titular enorme arriba y una fila de claves abajo.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'cartel'); }
    },
    pos_bandas: {
      fam: 'poster', nombre: 'Bandas',
      d: 'Franjas de ancho completo, una idea por banda.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'bandas'); }
    },
    pos_rejilla: {
      fam: 'poster', nombre: 'Rejilla',
      d: 'Fichas en cuadrícula: seis u ocho ideas del mismo peso.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'rejilla'); }
    },
    pos_columnas: {
      fam: 'poster', nombre: 'Columnas académicas',
      d: 'Título a todo lo ancho y el cuerpo en dos o tres columnas.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'columnas'); }
    },
    pos_numeros: {
      fam: 'poster', nombre: 'Numerado',
      d: 'Cifra en círculo y la idea al lado: pasos y decálogos.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'numeros'); }
    },
    pos_foco: {
      fam: 'poster', nombre: 'Foco central',
      d: 'Una imagen o concepto en el centro y las etiquetas a los lados.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'foco'); }
    },
    pos_franja: {
      fam: 'poster', nombre: 'Franja lateral',
      d: 'Bloque de color a la izquierda con el tema; el detalle, a la derecha.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'franja'); }
    },
    pos_aviso: {
      fam: 'poster', nombre: 'Aviso',
      d: 'Cabecera maciza y renglones cortos: normas, seguridad, protocolo.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'aviso'); }
    },
    pos_evento: {
      fam: 'poster', nombre: 'Evento',
      d: 'Título, el dato grande en medio y los detalles al pie.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'evento'); }
    },
    pos_indice: {
      fam: 'poster', nombre: 'Índice reglado',
      d: 'Lista con filete bajo cada línea: temario, horario, tarifas.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'indice'); }
    },
    pos_mosaico: {
      fam: 'poster', nombre: 'Mosaico',
      d: 'Una pieza grande arriba y hasta cuatro menores debajo.',
      calc: function (A, R, C, op) { return poster(A, R, C, op, 'mosaico'); }
    },

    /* ── Línea de tiempo ── */

    tl_horizontal: {
      fam: 'tiempo', nombre: 'Eje horizontal',
      d: 'La línea cruza la lámina y los hitos alternan arriba y abajo.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'horizontal'); }
    },
    tl_vertical: {
      fam: 'tiempo', nombre: 'Eje vertical',
      d: 'De arriba abajo, con los hitos a un lado y otro.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'vertical'); }
    },
    tl_escalera: {
      fam: 'tiempo', nombre: 'Escalera',
      d: 'Cada etapa un escalón más alta: progreso, no sólo fechas.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'escalera'); }
    },
    tl_serpiente: {
      fam: 'tiempo', nombre: 'Serpentina',
      d: 'Varias filas en zigzag: cabe una cronología larga.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'serpiente'); }
    },
    tl_indice: {
      fam: 'tiempo', nombre: 'Cronología reglada',
      d: 'Fecha a la izquierda, hecho a la derecha, filete debajo.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'indice'); }
    },
    tl_arco: {
      fam: 'tiempo', nombre: 'Arco',
      d: 'Los hitos sobre media circunferencia: etapas de un recorrido.',
      calc: function (A, R, C, op) { return tiempo(A, R, C, op, 'arco'); }
    },

    /* ── Proceso y flujo ── */

    fl_cadena: {
      fam: 'flujo', nombre: 'Cadena de pasos',
      d: 'Pasos en fila unidos por flechas. El flujo más simple.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'cadena'); }
    },
    fl_serpiente: {
      fam: 'flujo', nombre: 'Serpentina',
      d: 'El proceso baja de fila en fila cuando no cabe en una.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'serpiente'); }
    },
    fl_ciclo: {
      fam: 'flujo', nombre: 'Ciclo',
      d: 'Sin principio ni fin: rutinas, ciclos y procesos que se repiten.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'ciclo'); }
    },
    fl_decision: {
      fam: 'flujo', nombre: 'Con decisiones',
      d: 'Cajas y rombos alternos: dónde hay que decidir algo.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'decision'); }
    },
    fl_carriles: {
      fam: 'flujo', nombre: 'Dos carriles',
      d: 'Quién hace qué: el proceso repartido en dos calles.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'carriles'); }
    },
    fl_embudo: {
      fam: 'flujo', nombre: 'Embudo',
      d: 'Cada paso más estrecho: captación, criba, resultado.',
      calc: function (A, R, C, op) { return flujo(A, R, C, op, 'embudo'); }
    },

    /* ── Infografía de datos ── */

    dt_barras: {
      fam: 'datos', nombre: 'Barras horizontales',
      d: 'La barra crece con la cifra del detalle. Para comparar.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'barras'); }
    },
    dt_columnas: {
      fam: 'datos', nombre: 'Columnas',
      d: 'Barras verticales sobre su línea de base.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'columnas'); }
    },
    dt_cifras: {
      fam: 'datos', nombre: 'Cifras grandes',
      d: 'Rejilla de números enormes con su pie. Para lo que hay que recordar.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'cifras'); }
    },
    dt_donut: {
      fam: 'datos', nombre: 'Anillo',
      d: 'Reparto de un total en sectores proporcionales.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'donut'); }
    },
    dt_progreso: {
      fam: 'datos', nombre: 'Progreso',
      d: 'Una pista por concepto y su avance relleno.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'progreso'); }
    },
    dt_pictograma: {
      fam: 'datos', nombre: 'Pictograma',
      d: 'Diez casillas por fila: se cuenta a simple vista.',
      calc: function (A, R, C, op) { return datos(A, R, C, op, 'pictograma'); }
    },

    /* ── Comparativa y matriz ── */

    cp_columnas: {
      fam: 'comparar', nombre: 'Dos columnas',
      d: 'Dos bloques enfrentados, cada uno con su lista.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'columnas'); }
    },
    cp_tabla: {
      fam: 'comparar', nombre: 'Tabla comparativa',
      d: 'Filas y columnas: cada criterio, uno al lado del otro.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'tabla'); }
    },
    cp_venn: {
      fam: 'comparar', nombre: 'Diagrama de Venn',
      d: 'Dos círculos que se cruzan: lo propio y lo común.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'venn'); }
    },
    cp_balanza: {
      fam: 'comparar', nombre: 'Ventajas e inconvenientes',
      d: 'Dos platillos con un eje al medio: a favor y en contra.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'balanza'); }
    },
    cp_cuadrantes: {
      fam: 'comparar', nombre: 'Cuatro cuadrantes',
      d: 'Rejilla de dos por dos. Para DAFO y matrices de decisión.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'cuadrantes'); }
    },
    cp_antes: {
      fam: 'comparar', nombre: 'Antes y después',
      d: 'Dos paneles grandes separados por una flecha.',
      calc: function (A, R, C, op) { return comparar(A, R, C, op, 'antes'); }
    },

    /* ── Pirámide y jerarquía ── */

    pr_piramide: {
      fam: 'piramide', nombre: 'Pirámide',
      d: 'Niveles apilados: la base ancha sostiene la cima.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'piramide'); }
    },
    pr_invertida: {
      fam: 'piramide', nombre: 'Pirámide invertida',
      d: 'De lo general a lo concreto: ancho arriba, punta abajo.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'invertida'); }
    },
    pr_escalones: {
      fam: 'piramide', nombre: 'Escalones',
      d: 'Peldaños que suben: cada nivel se apoya en el anterior.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'escalones'); }
    },
    pr_capas: {
      fam: 'piramide', nombre: 'Capas',
      d: 'Bandas apiladas de ancho completo, con su índice al lado.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'capas'); }
    },
    pr_organigrama: {
      fam: 'piramide', nombre: 'Organigrama',
      d: 'Quién depende de quién: cabeza arriba y ramas debajo.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'organigrama'); }
    },
    pr_concentrico: {
      fam: 'piramide', nombre: 'Círculos concéntricos',
      d: 'Un núcleo y sus envolturas: de dentro hacia fuera.',
      calc: function (A, R, C, op) { return piramide(A, R, C, op, 'concentrico'); }
    },

    /* ── Ficha de estudio ── */

    fc_cornell: {
      fam: 'ficha', nombre: 'Cornell',
      d: 'Columna de claves, cuerpo de notas y resumen abajo.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'cornell'); }
    },
    fc_tarjetas: {
      fam: 'ficha', nombre: 'Tarjetas',
      d: 'Rejilla de tarjetas: concepto arriba, explicación debajo.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'tarjetas'); }
    },
    fc_definiciones: {
      fam: 'ficha', nombre: 'Glosario',
      d: 'Término a la izquierda y definición a la derecha.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'definiciones'); }
    },
    fc_resumen: {
      fam: 'ficha', nombre: 'Resumen',
      d: 'Idea principal grande, puntos debajo y una frase de cierre.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'resumen'); }
    },
    fc_repaso: {
      fam: 'ficha', nombre: 'Lista de repaso',
      d: 'Casilla por punto: para marcar lo que ya se sabe.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'repaso'); }
    },
    fc_pregunta: {
      fam: 'ficha', nombre: 'Pregunta y respuestas',
      d: 'La pregunta ocupa la mitad; las respuestas, numeradas.',
      calc: function (A, R, C, op) { return ficha(A, R, C, op, 'pregunta'); }
    }
  };

  /* Geometría de un póster. Pocas piezas y muy grandes: lo que no se lee a
     tres metros no está en el cartel. `op.sinCab` significa que la cabecera
     general no se dibuja y el titular lo pone la propia estructura. */
  function poster(A, R, C, op, tipo) {
    var cajas = [], enl = [], i, j;
    var L = R.hijos || [];
    var n = Math.max(1, L.length);
    var top = A.y, disp = A.h;

    function titular(alto) {
      cajas.push({
        x: A.x, y: A.y, w: A.w, h: alto, n: R.n, nivel: 0,
        col: C.tinta, forma: 'ninguna', libre: true, titular: true
      });
      top = A.y + alto + A.h * 0.04;
      disp = A.y + A.h - top;
    }

    if (tipo === 'cartel') {
      titular(A.h * 0.30);
      var m = Math.min(L.length, 5) || 1, gw = A.w / m;
      for (i = 0; i < L.length && i < 5; i++) {
        cajas.push(caja(A.x + i * gw + gw * 0.04, A.y + A.h * 0.62, gw * 0.92, A.h * 0.32,
          L[i].n, 1, C.serie[i % C.serie.length], op.forma || 'caja'));
      }

    } else if (tipo === 'bandas') {
      if (op.sinCab) titular(A.h * 0.16);
      var fb = disp / n;
      for (i = 0; i < L.length; i++) {
        cajas.push(caja(A.x, top + i * fb, A.w, fb * 0.86, L[i].n, 1,
          C.serie[i % C.serie.length], op.forma || 'recta'));
      }

    } else if (tipo === 'rejilla') {
      if (op.sinCab) titular(A.h * 0.14);
      var cols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
      var filas = Math.ceil(n / cols), cw = A.w / cols, chh = disp / filas;
      for (i = 0; i < L.length; i++) {
        cajas.push(caja(A.x + (i % cols) * cw + cw * 0.035, top + Math.floor(i / cols) * chh + chh * 0.05,
          cw * 0.93, chh * 0.88, L[i].n, 1, C.serie[i % C.serie.length], op.forma || 'caja'));
      }

    } else if (tipo === 'columnas') {
      titular(A.h * 0.12);
      var nc = n >= 6 ? 3 : 2, porCol = Math.ceil(n / nc), cwc = A.w / nc;
      var celda = disp / porCol;
      for (i = 0; i < L.length; i++) {
        var xc = A.x + Math.floor(i / porCol) * cwc + cwc * 0.03, wc = cwc * 0.94;
        var yc = top + (i % porCol) * celda;
        var colc = C.serie[i % C.serie.length];
        var hs = L[i].hijos || [];
        var hcab = hs.length ? celda * 0.34 : celda * 0.52;
        cajas.push(caja(xc, yc, wc, hcab, L[i].n, 1, colc, op.forma || 'recta'));
        for (j = 0; j < hs.length; j++) {
          var shc = Math.min(celda * 0.20, (celda * 0.50) / hs.length);
          cajas.push(caja(xc + wc * 0.05, yc + hcab + celda * 0.04 + j * shc * 1.18,
            wc * 0.90, shc, hs[j].n, 2, colc, op.formaHijo || 'recta'));
        }
      }

    } else if (tipo === 'numeros') {
      if (op.sinCab) titular(A.h * 0.14);
      var fn = disp / n, dia = Math.min(fn * 0.74, A.w * 0.11);
      for (i = 0; i < L.length; i++) {
        var coln = C.serie[i % C.serie.length];
        cajas.push(caja(A.x, top + i * fn + (fn - dia) / 2, dia, dia,
          { t: String(i + 1), d: '' }, 0, coln, 'circulo'));
        cajas.push(caja(A.x + dia * 1.28, top + i * fn + fn * 0.08, A.w - dia * 1.28, fn * 0.82,
          L[i].n, 1, coln, op.forma || 'recta'));
      }

    } else if (tipo === 'foco') {
      var cx = A.x + A.w / 2, cy = A.y + A.h * 0.48;
      var r = Math.min(A.w, A.h) * 0.19;
      cajas.push(caja(cx - r, cy - r, r * 2, r * 2, R.n, 0, C.acento, op.formaCentro || 'circulo'));
      var rw = A.w * 0.27, rh = Math.min(A.h * 0.11, A.h * 0.82 / Math.ceil(n / 2) * 0.72);
      var porLado = Math.ceil(n / 2);
      for (i = 0; i < L.length; i++) {
        var izq = i % 2 === 0, k = Math.floor(i / 2);
        var yf = A.y + A.h * 0.09 + (k + 0.5) * ((A.h * 0.82) / porLado) - rh / 2;
        var xf = izq ? A.x : A.x + A.w - rw;
        var colf = C.serie[i % C.serie.length];
        cajas.push(caja(xf, yf, rw, rh, L[i].n, 1, colf, op.forma || 'pildora'));
        enl.push({ a: { x: cx, y: cy }, b: { x: izq ? xf + rw : xf, y: yf + rh / 2 }, col: colf, curva: true });
      }

    } else if (tipo === 'franja') {
      var fw = A.w * 0.34;
      cajas.push(caja(A.x, A.y, fw, A.h, R.n, 0, C.acento, op.formaCentro || 'recta'));
      var xr = A.x + fw + A.w * 0.05, wr = A.w - fw - A.w * 0.05, fr = A.h / n;
      for (i = 0; i < L.length; i++) {
        cajas.push(caja(xr, A.y + i * fr + fr * 0.08, wr, fr * 0.82, L[i].n, 1,
          C.serie[i % C.serie.length], op.forma || 'caja'));
      }

    } else if (tipo === 'aviso') {
      cajas.push(caja(A.x, A.y, A.w, A.h * 0.24, R.n, 0, C.acento2 || C.acento, op.formaCentro || 'recta'));
      var ta = A.y + A.h * 0.30, fa = (A.h * 0.70) / n;
      for (i = 0; i < L.length; i++) {
        cajas.push(caja(A.x, ta + i * fa, A.w, fa * 0.84, L[i].n, 1,
          C.serie[i % C.serie.length], op.forma || 'recta'));
      }

    } else if (tipo === 'evento') {
      titular(A.h * 0.24);
      if (L[0]) {
        cajas.push(caja(A.x + A.w * 0.08, A.y + A.h * 0.36, A.w * 0.84, A.h * 0.24,
          L[0].n, 0, C.acento, op.formaCentro || 'caja'));
      }
      var resto = L.slice(1), me = Math.max(1, Math.min(4, resto.length)), gwe = A.w / me;
      for (i = 0; i < resto.length && i < 4; i++) {
        cajas.push(caja(A.x + i * gwe + gwe * 0.04, A.y + A.h * 0.68, gwe * 0.92, A.h * 0.28,
          resto[i].n, 1, C.serie[i % C.serie.length], op.forma || 'caja'));
      }

    } else if (tipo === 'indice') {
      if (op.sinCab) titular(A.h * 0.14);
      var fi = disp / n;
      for (i = 0; i < L.length; i++) {
        var yi = top + i * fi, coli = C.serie[i % C.serie.length];
        cajas.push(caja(A.x, yi, A.w, fi * 0.74, L[i].n, 2, coli, op.forma || 'recta'));
        enl.push({
          a: { x: A.x, y: yi + fi * 0.88 }, b: { x: A.x + A.w, y: yi + fi * 0.88 },
          col: coli, fino: true
        });
      }

    } else {
      if (op.sinCab) titular(A.h * 0.13);
      var gh = disp * 0.50;
      if (L[0]) cajas.push(caja(A.x, top, A.w, gh, L[0].n, 0, C.acento, op.formaCentro || 'caja'));
      var rm = L.slice(1), mm = Math.max(1, Math.min(4, rm.length)), gwm = A.w / mm;
      var ym = top + gh + disp * 0.06, hm = disp * 0.44 - disp * 0.06;
      for (i = 0; i < rm.length && i < 4; i++) {
        cajas.push(caja(A.x + i * gwm + gwm * 0.03, ym, gwm * 0.94, hm,
          rm[i].n, 1, C.serie[i % C.serie.length], op.forma || 'caja'));
      }
    }

    return { cajas: cajas, enlaces: enl, poster: tipo };
  }

  /* Geometría del mandala. Los sectores no son cajas rectangulares, así que
     cada caja lleva su propio camino (`camino`) y su ángulo, y el dibujante
     los respeta en lugar de imponer una forma. */
  function mandala(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
    var base = Math.min(A.w, A.h);
    var lista = R.hijos.length ? R.hijos : [{ n: R.n, hijos: [] }];
    var n = lista.length;
    var rc = base * (tipo === 'anillo' ? 0.13 : 0.145);
    var giro = op.giro || 0;

    cajas.push({
      x: cx - rc, y: cy - rc, w: rc * 2, h: rc * 2,
      n: R.n, nivel: 0, col: C.acento, forma: 'circulo', centro: true
    });

    for (i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + i / n * Math.PI * 2 + giro;
      var col = C.serie[i % C.serie.length];
      var R1 = base * 0.24, R2 = base * 0.455;
      var c = { n: lista[i].n, nivel: 1, col: col, ang: a0, sector: true, tipo: tipo };

      if (tipo === 'cuna' || tipo === 'reloj' || tipo === 'mosaico') {
        var media = Math.PI / n * (tipo === 'mosaico' ? 0.80 : 0.92);
        c.camino = { tipo: 'cuna', cx: cx, cy: cy, r0: R1 * (tipo === 'reloj' ? 0.62 : 1), r1: R2, a0: a0 - media, a1: a0 + media };
        c.tx = cx + Math.cos(a0) * (R1 + R2) / 2;
        c.ty = cy + Math.sin(a0) * (R1 + R2) / 2;
        c.tw = (R2 - R1) * 0.92; c.th = (R2 - R1) * 0.72;
      } else if (tipo === 'petalo') {
        c.camino = { tipo: 'petalo', cx: cx, cy: cy, r0: rc * 1.02, r1: R2, a: a0, ancho: Math.PI / n * 0.86 };
        c.tx = cx + Math.cos(a0) * (rc + R2) * 0.56;
        c.ty = cy + Math.sin(a0) * (rc + R2) * 0.56;
        c.tw = (R2 - rc) * 0.80; c.th = (R2 - rc) * 0.52;
      } else if (tipo === 'anillo') {
        var m2 = Math.PI / n * 0.94;
        c.camino = { tipo: 'cuna', cx: cx, cy: cy, r0: base * 0.185, r1: base * 0.315, a0: a0 - m2, a1: a0 + m2 };
        c.tx = cx + Math.cos(a0) * base * 0.25;
        c.ty = cy + Math.sin(a0) * base * 0.25;
        c.tw = base * 0.19; c.th = base * 0.10;
      } else if (tipo === 'roseton') {
        var rr = base * (0.128 - Math.min(0.04, n * 0.004));
        var d = base * 0.30;
        c.camino = { tipo: 'circulo', cx: cx + Math.cos(a0) * d, cy: cy + Math.sin(a0) * d, r: rr };
        c.tx = c.camino.cx; c.ty = c.camino.cy; c.tw = rr * 1.5; c.th = rr * 1.2;
      } else if (tipo === 'estrella') {
        c.camino = { tipo: 'punta', cx: cx, cy: cy, r0: rc * 1.05, r1: R2, a: a0, ancho: Math.PI / n * 0.62 };
        c.tx = cx + Math.cos(a0) * (rc + R2) * 0.54;
        c.ty = cy + Math.sin(a0) * (rc + R2) * 0.54;
        c.tw = (R2 - rc) * 0.66; c.th = (R2 - rc) * 0.44;
      } else {
        // espiral: cada idea un poco más lejos y más pequeña
        var t = i / Math.max(1, n - 1);
        var ae = -Math.PI / 2 + t * Math.PI * 2.4 + giro;
        var de = base * (0.18 + t * 0.28);
        var re = base * (0.118 - t * 0.045);
        c.camino = { tipo: 'circulo', cx: cx + Math.cos(ae) * de, cy: cy + Math.sin(ae) * de, r: re };
        c.tx = c.camino.cx; c.ty = c.camino.cy; c.tw = re * 1.5; c.th = re * 1.15;
        enl.push({ a: { x: cx, y: cy }, b: { x: c.camino.cx, y: c.camino.cy }, col: col, puntos: true, fino: true });
      }
      cajas.push(c);

      // el detalle del sector, como aro exterior de etiquetas
      var hs = lista[i].hijos;
      for (var j = 0; j < hs.length; j++) {
        var aj = a0 + (j - (hs.length - 1) / 2) * (Math.PI / n * 0.62);
        var dj = base * 0.53;
        var sw = base * 0.20, sh = base * 0.052;
        var sx = cx + Math.cos(aj) * dj * (A.w / base) * 0.95;
        var sy = cy + Math.sin(aj) * dj * (A.h / base) * 0.95;
        sx = Math.max(A.x + sw / 2, Math.min(A.x + A.w - sw / 2, sx));
        sy = Math.max(A.y + sh / 2, Math.min(A.y + A.h - sh / 2, sy));
        cajas.push(caja(sx - sw / 2, sy - sh / 2, sw, sh, hs[j].n, 2, col, 'pildora'));
      }
    }
    return { cajas: cajas, enlaces: enl, mandala: tipo, cx: cx, cy: cy, r: base * 0.46 };
  }

  /* Geometría de una hoja de carrusel. Aquí los «nodos» son el contenido de
     esa hoja: el papel de la hoja decide cómo se reparten. */
  function hoja(A, R, C, op, tipo) {
    var cajas = [], i;
    var lista = R.hijos.length ? R.hijos : [];
    if (tipo === 'portada') {
      cajas.push({
        x: A.x, y: A.y + A.h * 0.42, w: A.w, h: A.h * 0.34,
        n: R.n, nivel: 0, col: C.acento, forma: 'ninguna', libre: true, titular: true
      });
      if (lista[0]) {
        cajas.push({
          x: A.x, y: A.y + A.h * 0.78, w: A.w, h: A.h * 0.10,
          n: lista[0].n, nivel: 2, col: C.tinta2, forma: 'ninguna', libre: true
        });
      }
    } else if (tipo === 'punto') {
      cajas.push({
        x: A.x, y: A.y + A.h * 0.08, w: A.w * 0.30, h: A.h * 0.22,
        n: { t: op.numero != null ? String(op.numero) : '1', d: '' },
        nivel: 0, col: C.acento, forma: 'ninguna', libre: true, cifra: true
      });
      cajas.push({
        x: A.x, y: A.y + A.h * 0.34, w: A.w, h: A.h * 0.22,
        n: R.n, nivel: 0, col: C.tinta, forma: 'ninguna', libre: true, titular: true
      });
      if (lista[0]) {
        cajas.push({
          x: A.x, y: A.y + A.h * 0.60, w: A.w, h: A.h * 0.30,
          n: lista[0].n, nivel: 2, col: C.tinta2, forma: 'ninguna', libre: true, izq: true
        });
      }
    } else if (tipo === 'lista') {
      cajas.push({
        x: A.x, y: A.y, w: A.w, h: A.h * 0.16,
        n: R.n, nivel: 0, col: C.tinta, forma: 'ninguna', libre: true, titular: true
      });
      var n = Math.max(1, lista.length);
      for (i = 0; i < lista.length; i++) {
        var ch = Math.min(A.h * 0.19, (A.h * 0.78) / n * 0.88);
        var y = A.y + A.h * 0.22 + i * ((A.h * 0.76) / n);
        cajas.push(caja(A.x, y, A.w, ch, lista[i].n, 1, C.serie[i % C.serie.length], op.forma || 'caja'));
      }
    } else if (tipo === 'cita') {
      cajas.push({
        x: A.x, y: A.y + A.h * 0.26, w: A.w, h: A.h * 0.42,
        n: R.n, nivel: 0, col: C.tinta, forma: 'ninguna', libre: true, cita: true
      });
      if (lista[0]) {
        cajas.push({
          x: A.x, y: A.y + A.h * 0.74, w: A.w, h: A.h * 0.08,
          n: lista[0].n, nivel: 2, col: C.acento, forma: 'ninguna', libre: true
        });
      }
    } else if (tipo === 'dato') {
      cajas.push({
        x: A.x, y: A.y + A.h * 0.22, w: A.w, h: A.h * 0.34,
        n: R.n, nivel: 0, col: C.acento, forma: 'ninguna', libre: true, cifra: true
      });
      if (lista[0]) {
        cajas.push({
          x: A.x, y: A.y + A.h * 0.60, w: A.w, h: A.h * 0.24,
          n: lista[0].n, nivel: 2, col: C.tinta2, forma: 'ninguna', libre: true
        });
      }
    } else {
      cajas.push({
        x: A.x, y: A.y + A.h * 0.24, w: A.w, h: A.h * 0.30,
        n: R.n, nivel: 0, col: C.tinta, forma: 'ninguna', libre: true, titular: true
      });
      if (lista[0]) {
        cajas.push(caja(A.x + A.w * 0.18, A.y + A.h * 0.64, A.w * 0.64, A.h * 0.12,
          lista[0].n, 1, C.acento, 'pildora'));
      }
    }
    return { cajas: cajas, enlaces: [], hoja: tipo };
  }

  /* ═════════ Línea de tiempo ═════════
     Lo que distingue a esta familia es el EJE: siempre hay una dirección de
     lectura y una marca por hito sobre la línea. */
  function tiempo(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    var L = R.hijos || [], n = Math.max(1, L.length);
    var col = function (k) { return C.serie[k % C.serie.length]; };
    var punto = function (x, y, c) {
      var d = Math.min(A.w, A.h) * 0.022;
      cajas.push(caja(x - d, y - d, d * 2, d * 2, { t: '', d: '' }, 0, c, 'circulo'));
    };

    if (tipo === 'horizontal') {
      var cy = A.y + A.h * 0.5, paso = A.w / n;
      var bw = Math.min(paso * 0.88, A.w * 0.24), bh = A.h * 0.22;
      enl.push({ a: { x: A.x, y: cy }, b: { x: A.x + A.w, y: cy }, col: C.tinta2, grueso: true, eje: true, flecha: true });
      for (i = 0; i < L.length; i++) {
        var x = A.x + (i + 0.5) * paso, arr = i % 2 === 0;
        var y = arr ? cy - A.h * 0.09 - bh : cy + A.h * 0.09;
        cajas.push(caja(x - bw / 2, y, bw, bh, L[i].n, 1, col(i), op.forma || 'caja'));
        enl.push({ a: { x: x, y: cy }, b: { x: x, y: arr ? y + bh : y }, col: col(i), fino: true });
        punto(x, cy, col(i));
      }

    } else if (tipo === 'vertical') {
      var cx = A.x + A.w * 0.5, pv = A.h / n;
      var vw = A.w * 0.40, vh = Math.min(pv * 0.82, A.h * 0.18);
      enl.push({ a: { x: cx, y: A.y }, b: { x: cx, y: A.y + A.h }, col: C.tinta2, grueso: true, eje: true, flecha: true });
      for (i = 0; i < L.length; i++) {
        var yv = A.y + (i + 0.5) * pv, izq = i % 2 === 0;
        var xv = izq ? cx - A.w * 0.06 - vw : cx + A.w * 0.06;
        cajas.push(caja(xv, yv - vh / 2, vw, vh, L[i].n, 1, col(i), op.forma || 'caja'));
        enl.push({ a: { x: cx, y: yv }, b: { x: izq ? xv + vw : xv, y: yv }, col: col(i), fino: true });
        punto(cx, yv, col(i));
      }

    } else if (tipo === 'escalera') {
      var pe = A.w / n, ew = pe * 0.90, eh = A.h * 0.20;
      for (i = 0; i < L.length; i++) {
        var xe = A.x + i * pe + (pe - ew) / 2;
        var ye = A.y + A.h - eh - (i / Math.max(1, n - 1)) * (A.h - eh);
        cajas.push(caja(xe, ye, ew, eh, L[i].n, 1, col(i), op.forma || 'caja'));
        if (i) {
          enl.push({
            a: { x: xe - pe + ew / 2, y: ye + eh * 1.6 }, b: { x: xe + ew / 2, y: ye + eh },
            col: col(i), fino: true, flecha: true
          });
        }
      }

    } else if (tipo === 'serpiente') {
      var cs = n <= 4 ? n : Math.ceil(n / 2), fs = Math.ceil(n / cs);
      var aw = A.w / cs, ah = A.h / fs;
      for (i = 0; i < L.length; i++) {
        var f = Math.floor(i / cs), k = i % cs;
        var kk = f % 2 === 0 ? k : cs - 1 - k;
        var xs = A.x + kk * aw + aw * 0.06, ys = A.y + f * ah + ah * 0.10;
        cajas.push(caja(xs, ys, aw * 0.88, ah * 0.76, L[i].n, 1, col(i), op.forma || 'caja'));
        if (i % cs !== 0) {
          var ant = f % 2 === 0 ? xs - aw : xs + aw * 0.88;
          enl.push({
            a: { x: f % 2 === 0 ? ant + aw * 0.88 : ant + aw * 0.12, y: ys + ah * 0.38 },
            b: { x: f % 2 === 0 ? xs : xs + aw * 0.88, y: ys + ah * 0.38 },
            col: col(i), flecha: true, fino: true
          });
        }
      }

    } else if (tipo === 'indice') {
      /* La cabecera general escribe el subtítulo dentro del área útil: la
         primera fila arranca más abajo para no pisarlo. */
      if (!op.sinCab) { A = { x: A.x, y: A.y + A.h * 0.07, w: A.w, h: A.h * 0.93 }; }
      var fi = A.h / n, fw = A.w * 0.24;
      for (i = 0; i < L.length; i++) {
        var yi = A.y + i * fi;
        cajas.push(caja(A.x, yi, fw, fi * 0.74, { t: L[i].n.t, d: '' }, 0, col(i), op.formaCentro || 'etiqueta'));
        cajas.push(caja(A.x + fw + A.w * 0.03, yi, A.w - fw - A.w * 0.03, fi * 0.74,
          { t: L[i].n.d || '', d: '' }, 2, col(i), op.forma || 'recta'));
        enl.push({ a: { x: A.x, y: yi + fi * 0.88 }, b: { x: A.x + A.w, y: yi + fi * 0.88 }, col: col(i), fino: true });
      }

    } else {
      // arco: los hitos se reparten sobre media circunferencia
      var ax = A.x + A.w / 2, ay = A.y + A.h * 0.92;
      var r = Math.min(A.w * 0.46, A.h * 0.80);
      var bwA = A.w * 0.20, bhA = A.h * 0.16;
      for (i = 0; i < L.length; i++) {
        var t = n === 1 ? 0.5 : i / (n - 1);
        var an = Math.PI + t * Math.PI;
        var px = ax + Math.cos(an) * r, py = ay + Math.sin(an) * r;
        var qx = ax + Math.cos(an) * r * 0.74, qy = ay + Math.sin(an) * r * 0.74;
        punto(qx, qy, col(i));
        px = Math.max(A.x + bwA / 2, Math.min(A.x + A.w - bwA / 2, px));
        py = Math.max(A.y + bhA / 2, py);
        cajas.push(caja(px - bwA / 2, py - bhA / 2, bwA, bhA, L[i].n, 1, col(i), op.forma || 'pildora'));
        if (i) {
          var tp = (i - 0.5) / (n - 1), ap = Math.PI + tp * Math.PI;
          enl.push({
            a: { x: ax + Math.cos(ap) * r * 0.74, y: ay + Math.sin(ap) * r * 0.74 },
            b: { x: qx, y: qy }, col: col(i), fino: true
          });
        }
      }
    }
    return { cajas: cajas, enlaces: enl, tiempo: tipo };
  }

  /* ═════════ Proceso y flujo ═════════
     Aquí lo importante es la FLECHA: qué va después de qué y dónde se
     decide. Los rombos son decisiones, no adornos. */
  function flujo(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    var L = R.hijos || [], n = Math.max(1, L.length);
    var col = function (k) { return C.serie[k % C.serie.length]; };

    if (tipo === 'cadena' && n > 5) tipo = 'serpiente';

    if (tipo === 'cadena') {
      var p = A.w / n, w = p * 0.82, h = Math.min(A.h * 0.42, A.h * 0.9);
      var y = A.y + (A.h - h) / 2;
      for (i = 0; i < L.length; i++) {
        var x = A.x + i * p + (p - w) / 2;
        cajas.push(caja(x, y, w, h, L[i].n, 1, col(i), op.forma || 'caja'));
        if (i) {
          enl.push({
            a: { x: x - (p - w), y: y + h / 2 }, b: { x: x, y: y + h / 2 },
            col: col(i), flecha: true
          });
        }
      }

    } else if (tipo === 'serpiente') {
      var cs = Math.min(3, n), fs = Math.ceil(n / cs);
      var aw = A.w / cs, ah = A.h / fs;
      for (i = 0; i < L.length; i++) {
        var f = Math.floor(i / cs), k = i % cs;
        var kk = f % 2 === 0 ? k : cs - 1 - k;
        var xs = A.x + kk * aw + aw * 0.07, ys = A.y + f * ah + ah * 0.12;
        cajas.push(caja(xs, ys, aw * 0.86, ah * 0.70, L[i].n, 1, col(i), op.forma || 'caja'));
        if (i && i % cs === 0) {
          enl.push({
            a: { x: xs + aw * 0.43, y: ys - ah * 0.30 }, b: { x: xs + aw * 0.43, y: ys },
            col: col(i), flecha: true
          });
        } else if (i) {
          enl.push({
            a: { x: f % 2 === 0 ? xs - aw * 0.12 : xs + aw * 0.98, y: ys + ah * 0.35 },
            b: { x: f % 2 === 0 ? xs : xs + aw * 0.86, y: ys + ah * 0.35 },
            col: col(i), flecha: true
          });
        }
      }

    } else if (tipo === 'ciclo') {
      var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
      var base = Math.min(A.w, A.h), rr = base * 0.36;
      var rc = base * 0.14;
      cajas.push(caja(cx - rc, cy - rc, rc * 2, rc * 2, R.n, 0, C.acento, op.formaCentro || 'circulo'));
      var pw = A.w * 0.24, ph = A.h * 0.14;
      for (i = 0; i < L.length; i++) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        var x2 = cx + Math.cos(a) * rr * (A.w / base) * 0.92;
        var y2 = cy + Math.sin(a) * rr * (A.h / base) * 0.92;
        cajas.push(caja(x2 - pw / 2, y2 - ph / 2, pw, ph, L[i].n, 1, col(i), op.forma || 'pildora'));
        var a2 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2;
        enl.push({
          a: { x: x2, y: y2 },
          b: {
            x: cx + Math.cos(a2) * rr * (A.w / base) * 0.92,
            y: cy + Math.sin(a2) * rr * (A.h / base) * 0.92
          },
          col: col(i), curva: true, flecha: true
        });
      }

    } else if (tipo === 'decision') {
      var fd = A.h / n, cxd = A.x + A.w / 2;
      for (i = 0; i < L.length; i++) {
        var esRombo = i % 2 === 1;
        var wd = esRombo ? A.w * 0.42 : A.w * 0.56, hd = fd * 0.72;
        var yd = A.y + i * fd;
        cajas.push(caja(cxd - wd / 2, yd, wd, hd, L[i].n, 1, col(i),
          esRombo ? 'rombo' : (op.forma || 'caja')));
        if (i) {
          enl.push({
            a: { x: cxd, y: yd - fd * 0.28 }, b: { x: cxd, y: yd },
            col: col(i), flecha: true
          });
        }
      }

    } else if (tipo === 'carriles') {
      var porCarril = Math.ceil(n / 2), pc = A.w / porCarril;
      var hc = A.h * 0.30;
      for (i = 0; i < L.length; i++) {
        var carril = i % 2, k2 = Math.floor(i / 2);
        var xc = A.x + k2 * pc + pc * 0.06;
        var yc = A.y + (carril ? A.h * 0.56 : A.h * 0.08);
        cajas.push(caja(xc, yc, pc * 0.88, hc, L[i].n, 1, col(i), op.forma || 'caja'));
        if (i) {
          var pv2 = i - 1, cv = pv2 % 2, kv = Math.floor(pv2 / 2);
          enl.push({
            a: { x: A.x + kv * pc + pc * 0.50, y: A.y + (cv ? A.h * 0.56 : A.h * 0.08) + hc / 2 },
            b: { x: xc + pc * 0.44, y: yc + hc / 2 },
            col: col(i), flecha: true, fino: true
          });
        }
      }

    } else {
      // embudo: cada paso más estrecho que el anterior
      var fe = A.h / n;
      for (i = 0; i < L.length; i++) {
        var red = 1 - (i / Math.max(1, n)) * 0.55;
        var we = A.w * red, xe = A.x + (A.w - we) / 2;
        cajas.push(caja(xe, A.y + i * fe, we, fe * 0.82, L[i].n, 1, col(i), op.forma || 'recta'));
        if (i) {
          enl.push({
            a: { x: A.x + A.w / 2, y: A.y + i * fe - fe * 0.16 },
            b: { x: A.x + A.w / 2, y: A.y + i * fe }, col: col(i), flecha: true, fino: true
          });
        }
      }
    }
    return { cajas: cajas, enlaces: enl, flujo: tipo };
  }

  /* ═════════ Infografía de datos ═════════
     La cifra sale del detalle del nodo: «Amarillo · 42 %» pinta una barra al
     42 %. Si no hay número, se reparte en orden descendente para que la
     plantilla siga siendo legible antes de escribir nada. */
  function valorDe(nd, i, n) {
    var m = String((nd && nd.d) || '').match(/(\d+([.,]\d+)?)/);
    if (m) return parseFloat(m[1].replace(',', '.'));
    return n - i;
  }

  function datos(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    /* Igual que en la cronología reglada: se deja aire bajo el subtítulo. */
    if (!op.sinCab) A = { x: A.x, y: A.y + A.h * 0.07, w: A.w, h: A.h * 0.93 };
    var L = R.hijos || [], n = Math.max(1, L.length);
    var col = function (k) { return C.serie[k % C.serie.length]; };
    var vals = L.map(function (h, k) { return valorDe(h.n, k, n); });
    var max = Math.max.apply(null, vals.concat([1]));
    var suma = vals.reduce(function (a, b) { return a + b; }, 0) || 1;

    if (tipo === 'barras') {
      var fb = A.h / n;
      for (i = 0; i < L.length; i++) {
        var wb = Math.max(A.w * 0.18, A.w * (vals[i] / max));
        cajas.push(caja(A.x, A.y + i * fb, wb, fb * 0.74, L[i].n, 1, col(i), op.forma || 'recta'));
      }

    } else if (tipo === 'columnas') {
      var pc = A.w / n, base = A.y + A.h * 0.86;
      for (i = 0; i < L.length; i++) {
        var hc = Math.max(A.h * 0.14, (A.h * 0.80) * (vals[i] / max));
        cajas.push(caja(A.x + i * pc + pc * 0.12, base - hc, pc * 0.76, hc, L[i].n, 1, col(i), op.forma || 'recta'));
      }
      enl.push({ a: { x: A.x, y: base }, b: { x: A.x + A.w, y: base }, col: C.tinta2, fino: true });

    } else if (tipo === 'cifras') {
      var cols = n <= 4 ? 2 : 3, filas = Math.ceil(n / cols);
      var cw = A.w / cols, ch = A.h / filas;
      for (i = 0; i < L.length; i++) {
        var xk = A.x + (i % cols) * cw, yk = A.y + Math.floor(i / cols) * ch;
        cajas.push({
          x: xk, y: yk, w: cw * 0.94, h: ch * 0.52,
          n: { t: (L[i].n.d || String(vals[i])), d: '' }, nivel: 0, col: col(i),
          forma: 'ninguna', libre: true, cifra: true
        });
        cajas.push({
          x: xk, y: yk + ch * 0.54, w: cw * 0.94, h: ch * 0.32,
          n: { t: L[i].n.t, d: '' }, nivel: 2, col: C.tinta2, forma: 'ninguna', libre: true
        });
      }

    } else if (tipo === 'donut') {
      var cx = A.x + A.w / 2, cy = A.y + A.h / 2;
      var bd = Math.min(A.w, A.h), r1 = bd * 0.44, r0 = bd * 0.26;
      var ang = -Math.PI / 2;
      cajas.push({
        x: cx - r0 * 0.9, y: cy - r0 * 0.6, w: r0 * 1.8, h: r0 * 1.2,
        n: R.n, nivel: 0, col: C.tinta, forma: 'ninguna', libre: true
      });
      for (i = 0; i < L.length; i++) {
        var barrido = (vals[i] / suma) * Math.PI * 2;
        var med = ang + barrido / 2;
        cajas.push({
          n: L[i].n, nivel: 1, col: col(i), sector: true, ang: med,
          camino: { tipo: 'cuna', cx: cx, cy: cy, r0: r0, r1: r1, a0: ang, a1: ang + barrido },
          tx: cx + Math.cos(med) * (r0 + r1) / 2, ty: cy + Math.sin(med) * (r0 + r1) / 2,
          tw: (r1 - r0) * 1.05, th: (r1 - r0) * 0.7
        });
        ang += barrido;
      }

    } else if (tipo === 'progreso') {
      var fp = A.h / n, etq = A.w * 0.34;
      for (i = 0; i < L.length; i++) {
        var yp = A.y + i * fp;
        cajas.push(caja(A.x, yp, etq, fp * 0.66, { t: L[i].n.t, d: '' }, 2, col(i), op.forma || 'recta'));
        var pista = A.w - etq - A.w * 0.03;
        cajas.push(caja(A.x + etq + A.w * 0.03, yp + fp * 0.10, pista, fp * 0.44,
          { t: '', d: '' }, 2, C.tinta2, 'pildora'));
        cajas.push(caja(A.x + etq + A.w * 0.03, yp + fp * 0.10, Math.max(pista * 0.10, pista * (vals[i] / max)),
          fp * 0.44, { t: L[i].n.d || '', d: '' }, 0, col(i), 'pildora'));
      }

    } else {
      // pictograma: cada dato, tantos bloques como parte del máximo
      var fq = A.h / n, celdas = 10;
      var lado = Math.min((A.w * 0.62) / celdas * 0.82, fq * 0.46);
      for (i = 0; i < L.length; i++) {
        var yq = A.y + i * fq;
        cajas.push(caja(A.x, yq, A.w * 0.32, fq * 0.60, L[i].n, 2, col(i), op.forma || 'recta'));
        var llenos = Math.max(1, Math.round((vals[i] / max) * celdas));
        for (var k = 0; k < celdas; k++) {
          cajas.push(caja(A.x + A.w * 0.36 + k * lado * 1.22, yq + fq * 0.06, lado, lado,
            { t: '', d: '' }, k < llenos ? 0 : 2, k < llenos ? col(i) : C.tinta2, 'caja'));
        }
      }
    }
    return { cajas: cajas, enlaces: enl, datos: tipo };
  }

  /* ═════════ Piezas compartidas de comparativa, pirámide y ficha ═════════ */

  /* Un polígono cualquiera dibujado como nodo: pirámides, escalones y
     trapecios salen de aquí. El texto se centra en (tx, ty). */
  function poli(pts, nodo, nivel, col, tx, ty, tw, th) {
    return {
      n: nodo, nivel: nivel, col: col, sector: true,
      camino: { tipo: 'poligono', pts: pts },
      tx: tx, ty: ty, tw: tw, th: th
    };
  }

  /* Cabecera de bloque y su lista debajo. Lo usan las columnas, los
     cuadrantes, la balanza y el antes/después. */
  function panelLista(cajas, x, y, w, h, rama, colr, op, formaCab) {
    var hs = (rama && rama.hijos) || [];
    if (!hs.length) {
      cajas.push(caja(x, y, w, h * 0.92, rama.n, 0, colr, formaCab || op.forma || 'caja'));
      return;
    }
    var hc = h * 0.24;
    cajas.push(caja(x, y, w, hc * 0.88, rama.n, 0, colr, formaCab || op.forma || 'caja'));
    var f = (h - hc) / hs.length;
    for (var i = 0; i < hs.length; i++) {
      cajas.push(caja(x, y + hc + i * f, w, f * 0.84, hs[i].n, 2, colr, op.forma || 'recta'));
    }
  }

  /* Dos lados a comparar. Si el autor ha escrito dos ramas con subramas, esas
     son las columnas; si ha pegado una lista plana, se parte por la mitad y la
     primera línea de cada mitad hace de cabecera. */
  function dosLados(R) {
    var L = R.hijos || [];
    var con = L.filter(function (h) { return h.hijos && h.hijos.length; });
    if (con.length >= 2) {
      var resto = L.filter(function (h) { return h !== con[0] && h !== con[1]; });
      return [con[0], con[1], con[2] || resto[0] || null];
    }
    var m = Math.ceil(L.length / 2) || 1;
    var a = L.slice(0, m), b = L.slice(m);
    return [
      { n: (a[0] && a[0].n) || { t: 'Opción A', d: '' }, hijos: a.slice(1) },
      { n: (b[0] && b[0].n) || { t: 'Opción B', d: '' }, hijos: b.slice(1) },
      null
    ];
  }

  /* ═════════ Comparativa y matriz ═════════ */
  function comparar(A, R, C, op, tipo) {
    var cajas = [], enl = [], i, j;
    if (!op.sinCab) A = { x: A.x, y: A.y + A.h * 0.06, w: A.w, h: A.h * 0.94 };
    var L = R.hijos || [];
    var col = function (k) { return C.serie[k % C.serie.length]; };

    if (tipo === 'columnas' || tipo === 'balanza' || tipo === 'antes') {
      var lados = dosLados(R);
      var hueco = A.w * (tipo === 'antes' ? 0.10 : 0.06);
      var cw = (A.w - hueco) / 2;
      panelLista(cajas, A.x, A.y, cw, A.h, lados[0], col(0), op,
        tipo === 'balanza' ? 'pildora' : null);
      panelLista(cajas, A.x + cw + hueco, A.y, cw, A.h, lados[1], col(1), op,
        tipo === 'balanza' ? 'pildora' : null);
      if (tipo === 'balanza') {
        enl.push({
          a: { x: A.x + A.w / 2, y: A.y }, b: { x: A.x + A.w / 2, y: A.y + A.h },
          col: C.tinta2, fino: true, puntos: true
        });
      } else if (tipo === 'antes') {
        enl.push({
          a: { x: A.x + cw + hueco * 0.12, y: A.y + A.h / 2 },
          b: { x: A.x + cw + hueco * 0.88, y: A.y + A.h / 2 },
          col: C.acento, flecha: true, grueso: true
        });
      }

    } else if (tipo === 'cuadrantes') {
      var q = L.slice(0, 4), gx = A.w * 0.04, gy = A.h * 0.06;
      var qw = (A.w - gx) / 2, qh = (A.h - gy) / 2;
      for (i = 0; i < q.length; i++) {
        panelLista(cajas, A.x + (i % 2) * (qw + gx), A.y + Math.floor(i / 2) * (qh + gy),
          qw, qh, q[i], col(i), op);
      }

    } else if (tipo === 'venn') {
      var lad = dosLados(R);
      var cx = A.x + A.w / 2, cy = A.y + A.h * 0.52;
      var r = Math.min(A.w * 0.30, A.h * 0.42);
      var sep = r * 0.62;
      [0, 1].forEach(function (k) {
        var ccx = cx + (k ? sep : -sep);
        cajas.push({
          n: { t: '', d: '' }, nivel: 1, col: col(k), sector: true,
          camino: { tipo: 'circulo', cx: ccx, cy: cy, r: r },
          tx: ccx, ty: cy, tw: r, th: r * 0.5
        });
        cajas.push({
          x: Math.max(A.x, Math.min(A.x + A.w - r * 1.4, ccx - r * 0.7)), y: A.y,
          w: r * 1.4, h: A.h * 0.12, n: lad[k].n, nivel: 0,
          col: col(k), forma: 'ninguna', libre: true, izq: false
        });
      });
      [0, 1].forEach(function (k) {
        var hs = lad[k].hijos || [];
        var ccx = cx + (k ? sep : -sep) + (k ? r * 0.34 : -r * 0.34);
        for (j = 0; j < hs.length; j++) {
          cajas.push({
            x: ccx - r * 0.42, y: cy - r * 0.42 + j * (r * 0.30), w: r * 0.84, h: r * 0.26,
            n: { t: hs[j].n.t, d: '' }, nivel: 2, col: col(k), forma: 'ninguna',
            libre: true, izq: false
          });
        }
      });
      if (lad[2]) {
        cajas.push({
          x: cx - sep * 0.9, y: cy - r * 0.30, w: sep * 1.8, h: r * 0.6,
          n: { t: lad[2].n.t, d: '' }, nivel: 2, col: C.tinta, forma: 'ninguna',
          libre: true, izq: false
        });
      }

    } else {
      // tabla: la primera rama da los encabezados; las demás, una fila cada una
      var cab = L[0], filas = L.slice(1);
      if (!filas.length) { filas = L; cab = null; }
      var ncol = 1;
      filas.forEach(function (f) { ncol = Math.max(ncol, 1 + ((f.hijos || []).length)); });
      if (cab) ncol = Math.max(ncol, 1 + (cab.hijos || []).length);
      var aw = A.w / ncol;
      var hh = cab ? A.h * 0.16 : 0;
      var fh = (A.h - hh) / Math.max(1, filas.length);
      if (cab) {
        cajas.push(caja(A.x, A.y, aw * 0.96, hh * 0.86, cab.n, 0, C.acento, op.forma || 'recta'));
        (cab.hijos || []).forEach(function (h, k) {
          cajas.push(caja(A.x + (k + 1) * aw, A.y, aw * 0.96, hh * 0.86, h.n, 0, col(k), op.forma || 'recta'));
        });
      }
      for (i = 0; i < filas.length; i++) {
        var fy = A.y + hh + i * fh;
        cajas.push(caja(A.x, fy, aw * 0.96, fh * 0.84, filas[i].n, 1, C.tinta2, op.forma || 'recta'));
        (filas[i].hijos || []).forEach(function (h, k) {
          cajas.push(caja(A.x + (k + 1) * aw, fy, aw * 0.96, fh * 0.84, h.n, 2, col(k), op.forma || 'recta'));
        });
        if (i) {
          enl.push({
            a: { x: A.x, y: fy - fh * 0.07 }, b: { x: A.x + A.w, y: fy - fh * 0.07 },
            col: C.tinta2, fino: true
          });
        }
      }
    }
    return { cajas: cajas, enlaces: enl };
  }

  /* ═════════ Pirámide y jerarquía ═════════
     El orden importa: el primer nodo es la cima (o el núcleo) y el último, la
     base. Se dibuja de arriba abajo, que es como se lee. */
  function piramide(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    if (!op.sinCab) A = { x: A.x, y: A.y + A.h * 0.06, w: A.w, h: A.h * 0.94 };
    var L = R.hijos || [], n = Math.max(1, L.length);
    var col = function (k) { return C.serie[k % C.serie.length]; };

    if (tipo === 'piramide' || tipo === 'invertida') {
      var inv = tipo === 'invertida';
      var fh = A.h / n, cx = A.x + A.w / 2, medio = A.w * 0.46;
      /* La punta es estrecha: una palabra larga no cabe dentro del trapecio y
         antes se salía del relleno y se perdía sobre el papel. Cuando el nivel
         no da anchura suficiente, el rótulo sale fuera con su línea de guía. */
      for (i = 0; i < n; i++) {
        var t0 = i / n, t1 = (i + 1) / n;
        var a0 = inv ? (1 - t0) : t0, a1 = inv ? (1 - t1) : t1;
        var w0 = Math.max(medio * 0.14, medio * a0), w1 = Math.max(medio * 0.14, medio * a1);
        var y0 = A.y + i * fh + fh * 0.04, y1 = A.y + (i + 1) * fh - fh * 0.04;
        var estrecho = Math.min(w0, w1) * 1.7 < A.w * 0.24;
        var ancho = Math.max(w0, w1);
        var ym = (y0 + y1) / 2;
        cajas.push(poli(
          [{ x: cx - w0, y: y0 }, { x: cx + w0, y: y0 }, { x: cx + w1, y: y1 }, { x: cx - w1, y: y1 }],
          estrecho ? { t: '', d: '' } : L[i].n, i === (inv ? 0 : n - 1) ? 0 : 1, col(i),
          cx, ym, Math.min(w0, w1) * 1.7, fh * 0.7
        ));
        if (estrecho) {
          var xr = cx + ancho + A.w * 0.045;
          cajas.push({
            x: xr, y: ym - fh * 0.36, w: A.x + A.w - xr, h: fh * 0.72,
            n: L[i].n, nivel: 2, col: col(i), forma: 'ninguna', libre: true
          });
          enl.push({
            a: { x: cx + ancho, y: ym }, b: { x: xr - A.w * 0.012, y: ym },
            col: col(i), fino: true
          });
        }
      }

    } else if (tipo === 'escalones') {
      var eh = A.h / n;
      for (i = 0; i < n; i++) {
        var ew = A.w * (0.34 + 0.62 * ((n - i) / n));
        cajas.push(caja(A.x, A.y + i * eh, ew, eh * 0.82, L[i].n, i === 0 ? 0 : 1,
          col(i), op.forma || 'caja'));
      }

    } else if (tipo === 'capas') {
      var ch = A.h / n, idx = A.w * 0.09;
      for (i = 0; i < n; i++) {
        var cy2 = A.y + i * ch;
        cajas.push(caja(A.x, cy2, idx * 0.86, ch * 0.80, { t: String(i + 1), d: '' }, 0,
          col(i), 'circulo'));
        cajas.push(caja(A.x + idx, cy2, A.w - idx, ch * 0.80, L[i].n, 1, col(i),
          op.forma || 'caja'));
      }

    } else if (tipo === 'organigrama') {
      var cw = Math.min(A.w * 0.34, A.w * 0.9), chh = A.h * 0.16;
      var cxo = A.x + A.w / 2;
      cajas.push(caja(cxo - cw / 2, A.y, cw, chh, R.n, 0, C.acento, op.formaCentro || 'caja'));
      var p = A.w / n, ry = A.y + A.h * 0.32, rh = A.h * 0.15;
      for (i = 0; i < n; i++) {
        var rx = A.x + i * p + p * 0.06, rw = p * 0.88;
        cajas.push(caja(rx, ry, rw, rh, L[i].n, 1, col(i), op.forma || 'caja'));
        enl.push({
          a: { x: cxo, y: A.y + chh }, b: { x: rx + rw / 2, y: ry }, col: col(i), codo: true
        });
        var hs = L[i].hijos || [];
        for (var k = 0; k < hs.length; k++) {
          var hy = ry + rh + A.h * 0.06 + k * (A.h * 0.135);
          cajas.push(caja(rx + rw * 0.10, hy, rw * 0.90, A.h * 0.105, hs[k].n, 2, col(i),
            op.forma || 'recta'));
          enl.push({
            a: { x: rx + rw * 0.06, y: ry + rh }, b: { x: rx + rw * 0.10, y: hy + A.h * 0.05 },
            col: col(i), fino: true, codo: true
          });
        }
      }

    } else {
      // concéntrico: el primer nodo es el núcleo y cada siguiente lo envuelve
      var ccx = A.x + A.w / 2, ccy = A.y + A.h / 2;
      var rmax = Math.min(A.w, A.h) * 0.46;
      for (i = n - 1; i >= 0; i--) {
        var rr = rmax * ((i + 1) / n);
        cajas.push({
          n: L[i].n, nivel: i === 0 ? 0 : 1, col: col(i), sector: true,
          camino: { tipo: 'circulo', cx: ccx, cy: ccy, r: rr },
          tx: ccx, ty: i === 0 ? ccy : ccy - rr + rmax * (0.5 / n) + rmax * 0.02,
          tw: rr * 1.2, th: rmax * (0.9 / n)
        });
      }
    }
    return { cajas: cajas, enlaces: enl };
  }

  /* ═════════ Ficha de estudio ═════════
     Formatos de apunte, no de cartel: mucho texto, poca decoración y siempre
     un sitio previsto para escribir a mano encima. */
  function ficha(A, R, C, op, tipo) {
    var cajas = [], enl = [], i;
    if (!op.sinCab) A = { x: A.x, y: A.y + A.h * 0.06, w: A.w, h: A.h * 0.94 };
    var L = R.hijos || [], n = Math.max(1, L.length);
    var col = function (k) { return C.serie[k % C.serie.length]; };

    if (tipo === 'cornell') {
      var res = A.h * 0.18, cuerpo = A.h - res - A.h * 0.04;
      var clav = A.w * 0.30;
      var f = cuerpo / n;
      for (i = 0; i < n; i++) {
        var y = A.y + i * f;
        cajas.push(caja(A.x, y, clav * 0.94, f * 0.84, { t: L[i].n.t, d: '' }, 1, col(i),
          op.forma || 'recta'));
        cajas.push(caja(A.x + clav, y, A.w - clav, f * 0.84, { t: L[i].n.d || '', d: '' }, 2,
          C.tinta2, op.forma || 'recta'));
        enl.push({
          a: { x: A.x, y: y + f * 0.92 }, b: { x: A.x + A.w, y: y + f * 0.92 },
          col: C.tinta2, fino: true
        });
      }
      cajas.push(caja(A.x, A.y + cuerpo + A.h * 0.04, A.w, res * 0.9,
        { t: 'Resumen', d: R.n.d || '' }, 0, C.acento, op.forma || 'caja'));

    } else if (tipo === 'tarjetas') {
      var cols = n <= 4 ? 2 : 3, filas = Math.ceil(n / cols);
      var tw = A.w / cols, th = A.h / filas;
      for (i = 0; i < n; i++) {
        cajas.push(caja(A.x + (i % cols) * tw, A.y + Math.floor(i / cols) * th,
          tw * 0.94, th * 0.88, L[i].n, 1, col(i), op.forma || 'caja'));
      }

    } else if (tipo === 'definiciones') {
      var fd = A.h / n, term = A.w * 0.34;
      for (i = 0; i < n; i++) {
        var yd = A.y + i * fd;
        cajas.push(caja(A.x, yd, term * 0.94, fd * 0.82, { t: L[i].n.t, d: '' }, 1, col(i),
          op.forma || 'etiqueta'));
        cajas.push(caja(A.x + term, yd, A.w - term, fd * 0.82, { t: L[i].n.d || '', d: '' }, 2,
          C.tinta2, op.forma || 'recta'));
      }

    } else if (tipo === 'resumen') {
      var cab = A.h * 0.22, cierre = A.h * 0.16;
      cajas.push(caja(A.x, A.y, A.w, cab * 0.9, R.n, 0, C.acento, op.forma || 'caja'));
      var zona = A.h - cab - cierre - A.h * 0.04;
      var fr = zona / n;
      for (i = 0; i < n; i++) {
        var yr = A.y + cab + i * fr;
        cajas.push(caja(A.x, yr, A.w * 0.055, fr * 0.72, { t: String(i + 1), d: '' }, 0,
          col(i), 'circulo'));
        cajas.push(caja(A.x + A.w * 0.08, yr, A.w * 0.92, fr * 0.72, L[i].n, 2, col(i),
          op.forma || 'recta'));
      }
      cajas.push(caja(A.x, A.y + A.h - cierre, A.w, cierre * 0.88,
        { t: R.n.d || 'En una frase', d: '' }, 1, C.tinta, op.forma || 'caja'));

    } else if (tipo === 'repaso') {
      var fp = A.h / n, lado = Math.min(fp * 0.56, A.w * 0.06);
      for (i = 0; i < n; i++) {
        var yp = A.y + i * fp;
        cajas.push(caja(A.x, yp + (fp * 0.72 - lado) / 2, lado, lado, { t: '', d: '' }, 2,
          col(i), 'caja'));
        cajas.push(caja(A.x + lado * 1.5, yp, A.w - lado * 1.5, fp * 0.72, L[i].n, 2, col(i),
          op.forma || 'recta'));
        enl.push({
          a: { x: A.x, y: yp + fp * 0.86 }, b: { x: A.x + A.w, y: yp + fp * 0.86 },
          col: C.tinta2, fino: true, puntos: true
        });
      }

    } else {
      // pregunta: enunciado grande arriba y respuestas numeradas debajo
      var pq = A.h * 0.34;
      cajas.push(caja(A.x, A.y, A.w, pq * 0.9, R.n, 0, C.acento, op.formaCentro || 'caja'));
      var fq = (A.h - pq) / n;
      for (i = 0; i < n; i++) {
        var yq = A.y + pq + i * fq;
        cajas.push(caja(A.x, yq, A.w * 0.07, fq * 0.74,
          { t: String.fromCharCode(97 + i) + ')', d: '' }, 0, col(i), 'circulo'));
        cajas.push(caja(A.x + A.w * 0.10, yq, A.w * 0.90, fq * 0.74, L[i].n, 1, col(i),
          op.forma || 'caja'));
      }
    }
    return { cajas: cajas, enlaces: enl };
  }

  function estructura(id) { return ESTRUCTURAS[id] || ESTRUCTURAS.radial; }
  function porFamilia(fam) {
    return Object.keys(ESTRUCTURAS)
      .filter(function (k) { return ESTRUCTURAS[k].fam === fam; })
      .map(function (k) { return { id: k, nombre: ESTRUCTURAS[k].nombre, d: ESTRUCTURAS[k].d }; });
  }

  /* ═══════════════════════ DIBUJO ═══════════════════════ */

  function papel(ctx, W, H, C) {
    if (!C.papel) return;
    ctx.save();
    ctx.strokeStyle = rgba(C.tinta2, C.claro ? 0.16 : 0.12);
    ctx.lineWidth = Math.max(1, W * 0.0009);
    var paso = W * 0.032, i;
    if (C.papel === 'renglones') {
      for (i = paso; i < H; i += paso) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
      }
      ctx.strokeStyle = rgba(C.acento2 || C.acento, 0.35);
      ctx.lineWidth = Math.max(1.4, W * 0.0016);
      ctx.beginPath(); ctx.moveTo(W * 0.085, 0); ctx.lineTo(W * 0.085, H); ctx.stroke();
    } else {
      for (i = paso; i < W; i += paso) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (i = paso; i < H; i += paso) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }
    }
    ctx.restore();
  }

  function fondo(ctx, W, H, C, lam, op) {
    ctx.fillStyle = C.fondo;
    ctx.fillRect(0, 0, W, H);
    /* Vídeo o foto de fondo: va DEBAJO de todo con su velo, porque una lámina
       de exposición se lee de lejos y sin velo el texto desaparece. */
    var f = op.fondoMedio;
    if (f && f.el) {
      var M = FM();
      ctx.save();
      if (M && M.cubrir) { try { M.cubrir(ctx, f.el, 0, 0, W, H); } catch (e) { } }
      ctx.fillStyle = rgba(C.fondo, lam.veloFondo == null ? 0.72 : lam.veloFondo);
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    papel(ctx, W, H, C);
    if (lam.vineta !== false) {
      var g = ctx.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.24, W / 2, H * 0.5, Math.max(W, H) * 0.78);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, rgba(C.claro ? '#000000' : '#000000', C.claro ? 0.07 : 0.30));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  }

  function cabecera(ctx, W, H, C, lam, A) {
    var tam = W * 0.038;
    ctx.save();
    ctx.textAlign = 'left';
    if (lam.rotulo) {
      ctx.font = '800 ' + (W * 0.0145).toFixed(1) + 'px ' + C.cuerpo;
      ctx.fillStyle = C.acento;
      var t = String(lam.rotulo).toUpperCase(), x = A.x, i;
      for (i = 0; i < t.length; i++) {
        ctx.fillText(t[i], x, A.y - W * 0.030);
        x += ctx.measureText(t[i]).width + W * 0.0042;
      }
    }
    if (lam.titulo) {
      var b = bloque(ctx, lam.titulo, A.w * 0.96, W * 0.10, tam, '800', C.titulo, W * 0.020);
      ctx.fillStyle = C.tinta;
      ctx.textAlign = 'left';
      for (var j = 0; j < b.lineas.length; j++) {
        ctx.fillText(b.lineas[j], A.x, A.y - W * 0.008 - (b.lineas.length - 1 - j) * b.tam * 1.14);
      }
    }
    if (lam.subtitulo) {
      ctx.font = '600 ' + (W * 0.0185).toFixed(1) + 'px ' + C.cuerpo;
      ctx.fillStyle = C.tinta2;
      ctx.textAlign = 'left';
      ctx.fillText(lam.subtitulo, A.x, A.y + W * 0.018);
    }
    ctx.restore();
  }

  function pie(ctx, W, H, C, lam, A, op) {
    ctx.save();
    ctx.font = '600 ' + (W * 0.0145).toFixed(1) + 'px ' + C.cuerpo;
    ctx.fillStyle = rgba(C.tinta2, 0.95);
    ctx.textAlign = 'left';
    if (lam.pie) ctx.fillText(lam.pie, A.x, H - W * 0.026);
    if (op.indice) {
      ctx.textAlign = 'right';
      ctx.fillStyle = C.acento;
      ctx.fillText(op.indice, A.x + A.w, H - W * 0.026);
    }
    ctx.restore();
  }

  function caminoLibre(ctx, cam) {
    var i, a;
    ctx.beginPath();
    if (cam.tipo === 'circulo') {
      ctx.arc(cam.cx, cam.cy, cam.r, 0, Math.PI * 2);
    } else if (cam.tipo === 'poligono') {
      var P = cam.pts || [];
      if (!P.length) return;
      ctx.moveTo(P[0].x, P[0].y);
      for (i = 1; i < P.length; i++) ctx.lineTo(P[i].x, P[i].y);
      ctx.closePath();
    } else if (cam.tipo === 'cuna') {
      ctx.arc(cam.cx, cam.cy, cam.r1, cam.a0, cam.a1);
      ctx.arc(cam.cx, cam.cy, cam.r0, cam.a1, cam.a0, true);
      ctx.closePath();
    } else if (cam.tipo === 'petalo') {
      var p0 = { x: cam.cx + Math.cos(cam.a) * cam.r0, y: cam.cy + Math.sin(cam.a) * cam.r0 };
      var p1 = { x: cam.cx + Math.cos(cam.a) * cam.r1, y: cam.cy + Math.sin(cam.a) * cam.r1 };
      var lat = cam.ancho;
      var q1 = {
        x: cam.cx + Math.cos(cam.a - lat) * (cam.r1 * 0.82),
        y: cam.cy + Math.sin(cam.a - lat) * (cam.r1 * 0.82)
      };
      var q2 = {
        x: cam.cx + Math.cos(cam.a + lat) * (cam.r1 * 0.82),
        y: cam.cy + Math.sin(cam.a + lat) * (cam.r1 * 0.82)
      };
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(q1.x, q1.y, p1.x, p1.y);
      ctx.quadraticCurveTo(q2.x, q2.y, p0.x, p0.y);
      ctx.closePath();
    } else if (cam.tipo === 'punta') {
      ctx.moveTo(cam.cx + Math.cos(cam.a - cam.ancho) * cam.r0, cam.cy + Math.sin(cam.a - cam.ancho) * cam.r0);
      ctx.lineTo(cam.cx + Math.cos(cam.a) * cam.r1, cam.cy + Math.sin(cam.a) * cam.r1);
      ctx.lineTo(cam.cx + Math.cos(cam.a + cam.ancho) * cam.r0, cam.cy + Math.sin(cam.a + cam.ancho) * cam.r0);
      ctx.closePath();
    }
  }

  function pintarEnlace(ctx, e, W, C, prog) {
    if (prog <= 0) return;
    ctx.save();
    var gr = W * (e.grueso ? 0.0058 : e.fino ? 0.0016 : 0.0030);
    ctx.lineWidth = gr;
    ctx.strokeStyle = rgba(e.col, e.tenue ? 0.22 : e.fino ? 0.55 : 0.85);
    ctx.lineCap = 'round';
    if (e.puntos) ctx.setLineDash([gr * 2.2, gr * 2.6]);
    var a = e.a, b = e.b;
    var bx = a.x + (b.x - a.x) * prog, by = a.y + (b.y - a.y) * prog;
    ctx.beginPath();
    if (e.curva) {
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var dx = b.x - a.x, dy = b.y - a.y;
      var cxp = mx - dy * 0.14, cyp = my + dx * 0.14;
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(a.x + (cxp - a.x) * prog, a.y + (cyp - a.y) * prog, bx, by);
    } else if (e.codo) {
      var mid = a.y + (b.y - a.y) * 0.55;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x, a.y + (mid - a.y) * Math.min(1, prog * 2));
      if (prog > 0.5) {
        ctx.lineTo(a.x + (b.x - a.x) * Math.min(1, (prog - 0.5) * 2.4), mid);
        if (prog > 0.85) ctx.lineTo(b.x, by);
      }
    } else if (e.escuadra) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x, by);
      if (prog > 0.7) ctx.lineTo(b.x + (bx - b.x) * 0 + b.x * 0 + bx, by);
    } else {
      ctx.moveTo(a.x, a.y); ctx.lineTo(bx, by);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    if (e.flecha && prog > 0.92) {
      var ang = Math.atan2(b.y - a.y, b.x - a.x);
      var L = gr * 3.4;
      ctx.fillStyle = rgba(e.col, 0.9);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - Math.cos(ang - 0.42) * L, b.y - Math.sin(ang - 0.42) * L);
      ctx.lineTo(b.x - Math.cos(ang + 0.42) * L, b.y - Math.sin(ang + 0.42) * L);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /* Un nodo: su forma, su relleno, su medio y su texto. El medio se recorta
     con la propia forma del nodo, así una foto dentro de un hexágono sale
     hexagonal y no como un rectángulo pegado encima. */
  function pintarCaja(ctx, c, W, H, C, lam, op, prog) {
    if (prog <= 0) return;
    var M = FM();
    var esc = 0.86 + 0.14 * prog;
    var alfa = Math.min(1, prog * 1.6);

    ctx.save();
    ctx.globalAlpha = alfa;

    if (c.libre) {
      // texto suelto de carrusel: no hay caja que dibujar
      var fu = c.titular || c.cita ? C.titulo : C.cuerpo;
      var tamB = c.cifra ? W * 0.16 : c.titular ? W * 0.070 : c.cita ? W * 0.052 : W * 0.026;
      var pesoB = c.cifra ? '800' : c.titular ? '800' : c.cita ? '600' : '600';
      var texto = c.n ? (c.n.t || '') : '';
      var det = c.n ? (c.n.d || '') : '';
      var b = bloque(ctx, c.cita ? '«' + texto + '»' : texto, c.w * 0.94, c.h, tamB, pesoB, fu, W * 0.014);
      ctx.textAlign = c.izq === false ? 'center' : 'left';
      var cxT = c.x + (ctx.textAlign === 'center' ? c.w / 2 : 0);
      ctx.fillStyle = c.col;
      var altoB = b.lineas.length * b.tam * 1.14;
      var yB = c.y + Math.max(0, (c.h - altoB) / 2) + b.tam * 0.92;
      for (var i = 0; i < b.lineas.length; i++) ctx.fillText(b.lineas[i], cxT, yB + i * b.tam * 1.14);
      if (det) {
        ctx.font = '600 ' + (W * 0.020).toFixed(1) + 'px ' + C.cuerpo;
        ctx.fillStyle = rgba(C.tinta2, 0.95);
        var d2 = bloque(ctx, det, c.w * 0.90, c.h * 0.5, W * 0.020, '600', C.cuerpo, W * 0.012);
        for (var k = 0; k < d2.lineas.length; k++) {
          ctx.fillText(d2.lineas[k], cxT, yB + altoB + W * 0.014 + k * d2.tam * 1.3);
        }
      }
      ctx.restore();
      return;
    }

    var x = c.x, y = c.y, w = c.w, h = c.h;
    if (!c.sector) {
      var dw = w * (1 - esc) / 2, dh = h * (1 - esc) / 2;
      x += dw; y += dh; w -= dw * 2; h -= dh * 2;
    }

    var medio = op.medios && c.n && c.n.medio ? op.medios[c.n.medio] : null;
    var relleno = c.nivel === 0 ? c.col : (C.claro ? rgba(c.col, 0.12) : rgba(c.col, 0.20));
    var tintaTxt = c.nivel === 0 ? (C.claro ? '#FFFFFF' : C.fondo)
      : (C.claro ? mezclar(c.col, '#1A1A1A', 0.55) : C.tinta);

    ctx.save();
    if (c.sector && c.camino) caminoLibre(ctx, c.camino);
    else caminoNodo(ctx, x, y, w, h, c.forma || 'caja');

    if (lam.sombras !== false && c.nivel === 0) {
      ctx.save();
      ctx.shadowColor = rgba('#000000', C.claro ? 0.20 : 0.45);
      ctx.shadowBlur = W * 0.016;
      ctx.shadowOffsetY = W * 0.004;
      ctx.fillStyle = relleno; ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = relleno; ctx.fill();
    }

    if (medio && medio.el) {
      ctx.save();
      ctx.clip();
      try {
        if (M && M.cubrir) M.cubrir(ctx, medio.el, x, y, w, h);
      } catch (e) { }
      // velo para que el texto siga leyéndose sobre la imagen
      ctx.fillStyle = rgba(C.claro ? '#FFFFFF' : '#000000', 0.42);
      ctx.fillRect(x, y, w, h);
      ctx.restore();
      tintaTxt = C.claro ? mezclar(c.col, '#1A1A1A', 0.7) : '#FFFFFF';
    }

    ctx.lineWidth = W * (c.nivel === 0 ? 0.0026 : 0.0018);
    ctx.strokeStyle = rgba(c.col, c.nivel === 0 ? 0.9 : 0.75);
    ctx.stroke();
    ctx.restore();

    // texto del nodo
    var tx = c.sector ? c.tx : x + w / 2;
    var ty = c.sector ? c.ty : y + h / 2;
    var tw = c.sector ? c.tw : w * 0.86;
    var th = c.sector ? c.th : h * 0.84;
    var txt = (c.n && c.n.t) || '';
    var det2 = (c.n && c.n.d) || '';
    var tamN = c.nivel === 0 ? W * 0.032 : c.nivel === 1 ? W * 0.021 : W * 0.0155;
    var bT = bloque(ctx, txt, tw, det2 ? th * 0.62 : th, tamN, c.nivel === 2 ? '600' : '800',
      c.nivel === 0 ? C.titulo : C.cuerpo, W * 0.009);
    if (det2) {
      var altoT = bT.lineas.length * bT.tam * 1.18;
      pintarBloque(ctx, bT, tx, ty - th * 0.16, tintaTxt, 'center');
      var bD = bloque(ctx, det2, tw, th * 0.34, tamN * 0.66, '600', C.cuerpo, W * 0.008);
      pintarBloque(ctx, bD, tx, ty + altoT * 0.42 + bD.tam * 0.5, rgba(tintaTxt, 0.85), 'center');
    } else {
      pintarBloque(ctx, bT, tx, ty, tintaTxt, 'center');
    }
    ctx.restore();
  }

  /* Ventana de tiempo de cada elemento. Es lo que hace que los nodos entren
     uno a uno en orden de lectura y que «dibujar» saque primero las líneas. */
  function ventanas(total, modo) {
    var out = [];
    for (var i = 0; i < total; i++) {
      var a = total <= 1 ? 0 : i / total;
      out.push([a, a + 1 / Math.max(1, total)]);
    }
    return out;
  }
  function tramo(prog, v) {
    if (prog >= v[1]) return 1;
    if (prog <= v[0]) return 0;
    return (prog - v[0]) / Math.max(0.0001, v[1] - v[0]);
  }

  /* ─────────────────────────── pintar ───────────────────────────
     op: { prog, modo, medios, fondoMedio, indice, numero, logo, giro } */

  function pintar(ctx, W, H, lam, op) {
    garantizarFuentes();
    op = op || {};
    lam = lam || {};
    var C = colores(lam);
    var E = estructura(lam.estructura);
    var prog = op.prog == null ? 1 : Math.max(0, Math.min(1, op.prog));
    var modo = op.modo || lam.animacion || 'aparecer';

    fondo(ctx, W, H, C, lam, op);

    var mx = W * 0.062;
    var hayCab = !!(lam.titulo || lam.subtitulo || lam.rotulo);
    var topeSup = hayCab ? H * (E.fam === 'carrusel' ? 0.16 : 0.185) : H * 0.06;
    var topeInf = (lam.pie || op.indice) ? H * 0.085 : H * 0.05;
    var A = { x: mx, y: topeSup, w: W - mx * 2, h: H - topeSup - topeInf };

    if (hayCab) cabecera(ctx, W, H, C, lam, A);

    var R = arbol(lam.nodos);
    var giro = modo === 'rotar' ? prog * Math.PI * 2 / Math.max(1, (lam.nodos || []).length - 1 || 1) : 0;
    var G = E.calc(A, R, C, Object.assign({}, lam.opciones || {}, { giro: giro, numero: op.numero }));

    // aro guía del mandala: la circunferencia que sostiene los sectores
    if (G.mandala && lam.aro !== false) {
      ctx.save();
      ctx.strokeStyle = rgba(C.tinta2, 0.30);
      ctx.lineWidth = W * 0.0014;
      [0.99, 0.72, 0.42].forEach(function (k) {
        ctx.beginPath(); ctx.arc(G.cx, G.cy, G.r * k, 0, Math.PI * 2 * Math.min(1, prog * 1.4)); ctx.stroke();
      });
      ctx.restore();
    }

    var nE = G.enlaces.length, nC = G.cajas.length;
    var vE, vC, i;

    if (modo === 'dibujar') {
      // primero TODAS las líneas (0→0.45), luego las cajas
      vE = ventanas(nE).map(function (v) { return [v[0] * 0.45, v[1] * 0.45]; });
      vC = ventanas(nC).map(function (v) { return [0.45 + v[0] * 0.55, 0.45 + v[1] * 0.55]; });
    } else if (modo === 'rotar' || modo === 'ninguna') {
      vE = ventanas(nE).map(function () { return [0, 0.0001]; });
      vC = ventanas(nC).map(function () { return [0, 0.0001]; });
    } else {
      // aparecer: cada caja con su enlace, en orden de lectura
      vC = ventanas(nC);
      vE = ventanas(nE).map(function (v, k) {
        var j = Math.min(nC - 1, k + 1);
        var w = vC[j] || v;
        return [Math.max(0, w[0] - 1 / Math.max(1, nC) * 0.6), w[1]];
      });
    }

    /* Zoom que recorre rama por rama: la cámara se mete en la caja que toca
       en este instante y el resto sigue dibujado alrededor. */
    var zoom = null;
    if (modo === 'zoom' && nC > 1) {
      var paso = 1 / (nC - 1);
      var k2 = Math.min(nC - 2, Math.floor(prog / paso));
      var t2 = (prog - k2 * paso) / paso;
      var suave = t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2;
      var c1 = G.cajas[k2], c2 = G.cajas[Math.min(nC - 1, k2 + 1)];
      var f1 = foco(c1), f2 = foco(c2);
      zoom = {
        x: f1.x + (f2.x - f1.x) * suave,
        y: f1.y + (f2.y - f1.y) * suave,
        e: 1.55
      };
    }

    ctx.save();
    if (zoom) {
      ctx.translate(W / 2, H / 2);
      ctx.scale(zoom.e, zoom.e);
      ctx.translate(-zoom.x, -zoom.y);
    }
    for (i = 0; i < nE; i++) pintarEnlace(ctx, G.enlaces[i], W, C, tramo(prog, vE[i]));
    for (i = 0; i < nC; i++) pintarCaja(ctx, G.cajas[i], W, H, C, lam, op, tramo(prog, vC[i]));
    ctx.restore();

    if (lam.pie || op.indice) pie(ctx, W, H, C, lam, A, op);
    if (op.logo && op.logo.img) {
      try {
        var anc = W * ((op.logo.tam || 9) / 100);
        var alt = anc * ((op.logo.img.naturalHeight || 1) / (op.logo.img.naturalWidth || 1));
        ctx.drawImage(op.logo.img, W - W * 0.03 - anc, H * 0.026, anc, alt);
      } catch (e) { }
    }
    if (op.qr) {
      var l2 = W * 0.10;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,.96)';
      caminoNodo(ctx, W - mx - l2 - W * 0.012, H - topeInf - l2 - W * 0.012, l2 + W * 0.024, l2 + W * 0.024, 'caja');
      ctx.fill();
      try { ctx.drawImage(op.qr, W - mx - l2, H - topeInf - l2, l2, l2); } catch (e) { }
      ctx.restore();
    }
    return G;
  }

  function foco(c) {
    if (!c) return { x: 0, y: 0 };
    if (c.sector && c.camino) {
      if (c.camino.tipo === 'circulo') return { x: c.camino.cx, y: c.camino.cy };
      return { x: c.tx, y: c.ty };
    }
    return { x: c.x + c.w / 2, y: c.y + c.h / 2 };
  }

  /* Cuántos elementos tiene la animación: lo usa el panel para repartir la
     narración por nodo y saber cuándo suena cada audio. */
  function conteo(lam) {
    var C = colores(lam), E = estructura(lam.estructura);
    var A = { x: 0, y: 0, w: 1000, h: 1000 };
    var G = E.calc(A, arbol(lam.nodos), C, lam.opciones || {});
    return { cajas: G.cajas.length, enlaces: G.enlaces.length };
  }

  window.LAMINAS_MOTOR = {
    FORMATOS: FORMATOS,
    FORMAS_NODO: FORMAS_NODO,
    ESTRUCTURAS: ESTRUCTURAS,
    paletas: paletas,
    paleta: paleta,
    colores: colores,
    porFamilia: porFamilia,
    estructura: estructura,
    nodosDeTexto: nodosDeTexto,
    arbol: arbol,
    conteo: conteo,
    pintar: pintar,
    bloque: bloque,
    caminoNodo: caminoNodo,
    garantizarFuentes: garantizarFuentes
  };
})();
