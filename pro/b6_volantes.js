/* ═════════════════════════════════════════════════════════════════
   VOLANTES Y MAQUETAS · b6_volantes.js

   Un «volante» aquí es una hoja suelta, y son tres cosas distintas
   según a quién va dirigida:

     · mano      — el folleto que se reparte o se buzonea. Vende.
     · mostrador — el cartelito de barra o escaparate. Avisa.
     · orden     — la hoja de mando interna: la orden de trabajo de
                   un servicio. Se rellena a bolígrafo.

   Las dos primeras las dibuja el motor de folletos que ya existe:
   son hojas de una cara con la rejilla y la paleta que ya sabe pintar.
   La tercera no — un impreso para rellenar no es un folleto, así que
   tiene aquí su propio dibujo, hecho de bloques.

   Y encima de cualquiera de las tres se puede ver la maqueta:

     · contexto — la pieza puesta en el mundo: sobre la mesa, en la
                  mano, pegada en el escaparate. Para enseñarla.
     · montaje  — el plano de imprenta: sangrado, marcas de corte,
                  margen de seguridad, pliegues y cotas en milímetros.
                  Para producirla.

   API pública:
     VOLANTES.VARIANTES · .PIEZAS
     VOLANTES.lista(variante) → [{id, variante, cat, nombre, desc, pieza}]
     VOLANTES.grupos(variante) · .get(id)
     VOLANTES.medidas(id)     → {mmW, mmH, W, H, pliegues}
     VOLANTES.pagina(id, ctx) → la hoja con el texto ya escrito
     VOLANTES.hoja(id, pag, op) → canvas a tamaño de imprenta
     VOLANTES.contexto(ctx2d, W, H, id, hoja, escena)
     VOLANTES.montaje(ctx2d, W, H, id, hoja)
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_VOLANTES) return;
  window._B6_VOLANTES = true;

  /* A4 son 210 mm y el motor lo pinta a 1240 px: ésa es la escala de
     toda la casa, así que las piezas nuevas usan la misma y encajan
     con lo ya existente sin conversiones raras. */
  var PXMM = 1240 / 210;
  function px(mm) { return Math.round(mm * PXMM); }

  var VARIANTES = [
    { id: 'mano', nombre: 'Volante de mano', icono: '🖐️',
      d: 'Se reparte o se buzonea. Una cara, un mensaje, y cómo llegar.' },
    { id: 'mostrador', nombre: 'Cartel de mostrador', icono: '🪧',
      d: 'De barra o escaparate. Se lee de pie y de lejos.' },
    { id: 'orden', nombre: 'Hoja de mando', icono: '📋',
      d: 'La orden de trabajo interna. Se imprime y se rellena a mano.' }
  ];

  var PIEZAS = {
    a6v: { n: 'A6 vertical · 105×148', mm: [105, 148] },
    a5v: { n: 'A5 vertical · 148×210', mm: [148, 210] },
    a5h: { n: 'A5 apaisado · 210×148', mm: [210, 148] },
    a4v: { n: 'A4 vertical · 210×297', mm: [210, 297] },
    a4h: { n: 'A4 apaisado · 297×210', mm: [297, 210] },
    dl: { n: 'DL · 99×210 (tercio de A4)', mm: [99, 210] },
    cua: { n: 'Cuadrado · 148×148', mm: [148, 148] },
    mesa: { n: 'Mesa triangular · 100×210', mm: [100, 210], pliegues: [70, 140] }
  };

  var TODO = { grano: true, vineta: true, filetes: true, sombras: true };
  var LIMPIO = { grano: false, vineta: false, filetes: true, sombras: false };
  var IMPRESO = { grano: false, vineta: false, filetes: true, sombras: true };
  var SUAVE = { grano: true, vineta: false, filetes: true, sombras: true };

  /* ───────────────────────── Las plantillas ─────────────────────────
     mano y mostrador se describen con los mandos del motor de folletos
     (tema · rejilla · troquel de celda · acabados), igual que hace
     FOLLETO_DISENOS. orden lleva en su sitio una lista de bloques. */

  var PLANTILLAS = [

    /* ══ MANO · se reparte en la calle o entra por el buzón ══ */

    { id: 'v_oferta_rayo', variante: 'mano', cat: 'Oferta y promoción', pieza: 'a6v',
      n: '⚡ Oferta relámpago', d: 'Un solo mensaje enorme. Se lee al cogerlo.',
      tema: 'coral', paletaPro: 'coral', rejilla: 'r1', formaCelda: 'recta', adornos: LIMPIO },
    { id: 'v_dos_por_uno', variante: 'mano', cat: 'Oferta y promoción', pieza: 'a6v',
      n: '🎁 Dos servicios', d: 'Dos bloques del mismo peso: la promoción y la condición.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r2a', formaCelda: 'blanda', adornos: IMPRESO },
    { id: 'v_descuento', variante: 'mano', cat: 'Oferta y promoción', pieza: 'a6v',
      n: '🎟️ Vale de descuento', d: 'Tamaño tarjeta. Se guarda en la cartera y vuelve.',
      tema: 'burdeos', paletaPro: 'vino', rejilla: 'r1', formaCelda: 'recta', adornos: TODO },
    { id: 'v_promo_larga', variante: 'mano', cat: 'Oferta y promoción', pieza: 'dl',
      n: '🔥 Promoción en tira', d: 'Tercio de A4: cabe en el buzón sin doblar.',
      tema: 'cian', rejilla: 'r2a', formaCelda: 'recta', adornos: TODO },

    { id: 'v_apertura', variante: 'mano', cat: 'Aviso y apertura', pieza: 'a5v',
      n: '✨ Apertura', d: 'Oro sobre negro y una sola idea: hemos abierto.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r1', formaCelda: 'arco', adornos: TODO },
    { id: 'v_barrio', variante: 'mano', cat: 'Aviso y apertura', pieza: 'a5v',
      n: '🏠 Buzoneo de barrio', d: 'Uno grande arriba y tres debajo. Para repartir por zona.',
      tema: 'coral', rejilla: 'r4b', formaCelda: 'suave', adornos: IMPRESO },
    { id: 'v_evento', variante: 'mano', cat: 'Aviso y apertura', pieza: 'a5v',
      n: '📅 Evento o jornada', d: 'Dos piezas lado a lado: qué es y cuándo.',
      tema: 'violeta', rejilla: 'r2b', formaCelda: 'pildora', adornos: TODO },
    { id: 'v_traslado', variante: 'mano', cat: 'Aviso y apertura', pieza: 'dl',
      n: '📍 Nos mudamos', d: 'Tira vertical con la dirección nueva bien grande.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r2a', formaCelda: 'recta', adornos: LIMPIO },

    { id: 'v_tarifa_bolsillo', variante: 'mano', cat: 'Tarifa en mano', pieza: 'dl',
      n: '💳 Tarifa de bolsillo', d: 'Cuatro precios en tira. Se dobla y se guarda.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r4a', formaCelda: 'recta', adornos: LIMPIO },
    { id: 'v_cuatro_serv', variante: 'mano', cat: 'Tarifa en mano', pieza: 'a5v',
      n: '🌸 Cuatro servicios', d: 'Rejilla 2×2 en rosa. El reparto más equilibrado.',
      tema: 'rosa', rejilla: 'r4a', formaCelda: 'blanda', adornos: SUAVE },
    { id: 'v_seis_serv', variante: 'mano', cat: 'Tarifa en mano', pieza: 'a5v',
      n: '🌿 Seis servicios', d: 'Verde botánico y seis hojas. Cuando ofreces variedad.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r6a', formaCelda: 'hoja', adornos: TODO },
    { id: 'v_lista_precios', variante: 'mano', cat: 'Tarifa en mano', pieza: 'a5v',
      n: '📖 Foto y lista de precios', d: 'Foto a un lado, la tarifa en lista al otro.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'rlista', formaCelda: 'blanda', adornos: IMPRESO },

    /* ══ MOSTRADOR · de pie, sobre la barra o en el cristal ══ */

    { id: 'm_precios', variante: 'mostrador', cat: 'Barra y mostrador', pieza: 'a5v',
      n: '💶 Precios en barra', d: 'Cuatro precios limpios, sin adornos. Se lee de un vistazo.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r4a', formaCelda: 'recta', adornos: LIMPIO },
    { id: 'm_novedad', variante: 'mostrador', cat: 'Barra y mostrador', pieza: 'a5v',
      n: '🆕 Novedad', d: 'Una sola pieza en coral: lo nuevo y nada más.',
      tema: 'coral', paletaPro: 'coral', rejilla: 'r1', formaCelda: 'arco', adornos: LIMPIO },
    { id: 'm_aviso_mesa', variante: 'mostrador', cat: 'Barra y mostrador', pieza: 'a6v',
      n: '⚠️ Aviso de mesa', d: 'Pequeño y contundente. Horario especial, cierre, reforma.',
      tema: 'burdeos', paletaPro: 'vino', rejilla: 'r1', formaCelda: 'recta', adornos: IMPRESO },
    { id: 'm_tent', variante: 'mostrador', cat: 'Barra y mostrador', pieza: 'mesa',
      n: '⛺ Triangular de mesa', d: 'Se dobla en tres y se planta. Dos caras que se leen.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r2a', formaCelda: 'ojiva', adornos: IMPRESO },
    { id: 'm_qr_reserva', variante: 'mostrador', cat: 'Barra y mostrador', pieza: 'a5v',
      n: '📱 QR de reserva', d: 'Sitio despejado abajo para que el QR mande.',
      tema: 'violeta', rejilla: 'r1', formaCelda: 'suave', adornos: TODO },

    { id: 'm_escaparate', variante: 'mostrador', cat: 'Escaparate', pieza: 'cua',
      n: '🛍️ Escaparate cuadrado', d: 'Dos bloques grandes en oro y negro. Se ve desde la acera.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r2b', formaCelda: 'recta', adornos: TODO },
    { id: 'm_escaparate_a4', variante: 'mostrador', cat: 'Escaparate', pieza: 'a4v',
      n: '🏆 Escaparate grande', d: 'A4 con jerarquía: lo caro arriba, las ofertas abajo.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r6b', formaCelda: 'suave', adornos: TODO },
    { id: 'm_horarios', variante: 'mostrador', cat: 'Escaparate', pieza: 'a5v',
      n: '🕐 Horarios', d: 'Dos bloques: entre semana y fin de semana.',
      tema: 'corporativo', paletaPro: 'azul', rejilla: 'r2a', formaCelda: 'recta', adornos: LIMPIO },
    { id: 'm_apaisado', variante: 'mostrador', cat: 'Escaparate', pieza: 'a5h',
      n: '↔️ Apaisado de estante', d: 'Tres piezas en fila. Para baldas y vitrinas.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r3a', formaCelda: 'arco', adornos: IMPRESO },

    /* ══ ORDEN · impresos internos, se rellenan a bolígrafo ══
       Los bloques se dibujan en el orden en que están escritos:
         campos   filas de etiqueta + línea para escribir
         casillas cuadrito + etiqueta, en varias columnas
         tabla    cabecera de columnas y filas vacías
         lineas   renglones libres bajo un título
         nota     letra pequeña de advertencia o instrucción
         firma    recuadros de firma al pie                            */

    { id: 'o_servicio', variante: 'orden', cat: 'Servicio', pieza: 'a5v',
      n: '✂️ Orden de servicio', d: 'La básica: quién, qué, cuándo y cuánto.',
      acento: '#1E5AA8',
      bloques: [
        { t: 'campos', c: ['Cliente', 'Teléfono', 'Fecha', 'Hora'] },
        { t: 'casillas', tit: 'Servicio', c: ['Corte', 'Peinado', 'Color', 'Mechas', 'Tratamiento', 'Recogido'] },
        { t: 'campos', c: ['Profesional', 'Duración prevista'] },
        { t: 'lineas', tit: 'Observaciones', n: 3 },
        { t: 'campos', c: ['Precio', 'Forma de pago'] },
        { t: 'firma', c: ['Profesional', 'Cliente'] }
      ] },

    { id: 'o_formula', variante: 'orden', cat: 'Servicio', pieza: 'a5v',
      n: '🎨 Orden con fórmula de color', d: 'Con la tabla de mezcla: producto, tono, volumen y gramos.',
      acento: '#9B2242',
      bloques: [
        { t: 'campos', c: ['Cliente', 'Fecha', 'Profesional'] },
        { t: 'campos', c: ['Base de partida', 'Objetivo'] },
        { t: 'tabla', tit: 'Fórmula', cols: ['Producto', 'Tono', 'Volumen', 'Gramos'], filas: 5 },
        { t: 'campos', c: ['Tiempo de exposición', 'Temperatura'] },
        { t: 'lineas', tit: 'Resultado y ajuste para la próxima', n: 3 },
        { t: 'nota', txt: 'Guarda esta hoja en la ficha del cliente: la fórmula que funcionó vale más que la que se improvisa.' }
      ] },

    { id: 'o_cabina', variante: 'orden', cat: 'Servicio', pieza: 'a5v',
      n: '🛏️ Hoja de cabina', d: 'Para estética: cabina, camilla, producto y tiempos.',
      acento: '#2E7D5B',
      bloques: [
        { t: 'campos', c: ['Cliente', 'Cabina', 'Fecha', 'Hora'] },
        { t: 'casillas', tit: 'Protocolo', c: ['Limpieza', 'Exfoliación', 'Extracción', 'Masaje', 'Mascarilla', 'Final'] },
        { t: 'tabla', tit: 'Productos usados', cols: ['Producto', 'Zona', 'Cantidad'], filas: 4 },
        { t: 'lineas', tit: 'Reacción de la piel', n: 2 },
        { t: 'firma', c: ['Profesional'] }
      ] },

    { id: 'o_tecnico', variante: 'orden', cat: 'Servicio', pieza: 'a4v',
      n: '🔧 Orden por técnico', d: 'Una hoja, varios trabajos: lista larga y firma al pie.',
      acento: '#17171B',
      bloques: [
        { t: 'campos', c: ['Técnico', 'Fecha', 'Turno'] },
        { t: 'tabla', tit: 'Trabajos del día', cols: ['Hora', 'Cliente', 'Servicio', 'Estado', 'Importe'], filas: 12 },
        { t: 'campos', c: ['Total del turno', 'Incidencias'] },
        { t: 'firma', c: ['Técnico', 'Responsable'] }
      ] },

    { id: 'o_ficha', variante: 'orden', cat: 'Cliente', pieza: 'a4v',
      n: '🗂️ Ficha de cliente', d: 'Alta completa: datos, antecedentes y consentimiento.',
      acento: '#1E5AA8',
      bloques: [
        { t: 'campos', c: ['Nombre y apellidos', 'Fecha de nacimiento'] },
        { t: 'campos', c: ['Teléfono', 'Correo', 'Cómo nos conoció'] },
        { t: 'casillas', tit: 'Antecedentes a tener en cuenta', c: ['Alergias', 'Piel sensible', 'Embarazo', 'Medicación', 'Tratamiento previo', 'Ninguno'] },
        { t: 'lineas', tit: 'Detalle de lo marcado', n: 3 },
        { t: 'tabla', tit: 'Historial', cols: ['Fecha', 'Servicio', 'Profesional', 'Nota'], filas: 8 },
        { t: 'nota', txt: 'Los datos se guardan sólo para la prestación del servicio y el aviso de citas. Puedes pedir su rectificación o borrado cuando quieras.' },
        { t: 'firma', c: ['Cliente', 'Responsable'] }
      ] },

    { id: 'o_consentimiento', variante: 'orden', cat: 'Cliente', pieza: 'a5v',
      n: '✍️ Consentimiento y prueba', d: 'Prueba de sensibilidad y firma antes de un servicio químico.',
      acento: '#9B2242',
      bloques: [
        { t: 'campos', c: ['Cliente', 'Fecha'] },
        { t: 'campos', c: ['Servicio previsto', 'Producto'] },
        { t: 'casillas', tit: 'Prueba de sensibilidad', c: ['Realizada 48 h antes', 'Sin reacción', 'Con reacción', 'El cliente la rechaza'] },
        { t: 'lineas', tit: 'Observaciones', n: 2 },
        { t: 'nota', txt: 'Se ha informado al cliente del procedimiento, del resultado esperable y de sus riesgos. El cliente declara que los datos facilitados son ciertos.' },
        { t: 'firma', c: ['Cliente', 'Profesional'] }
      ] },

    { id: 'o_caja', variante: 'orden', cat: 'Control interno', pieza: 'a4v',
      n: '💰 Parte de caja', d: 'Cierre del día: cobros, forma de pago y descuadre.',
      acento: '#17171B',
      bloques: [
        { t: 'campos', c: ['Fecha', 'Responsable de caja', 'Turno'] },
        { t: 'campos', c: ['Fondo inicial'] },
        { t: 'tabla', tit: 'Cobros', cols: ['Hora', 'Concepto', 'Efectivo', 'Tarjeta', 'Otro'], filas: 14 },
        { t: 'campos', c: ['Total efectivo', 'Total tarjeta', 'Total del día'] },
        { t: 'campos', c: ['Recuento real', 'Descuadre'] },
        { t: 'firma', c: ['Responsable'] }
      ] },

    { id: 'o_material', variante: 'orden', cat: 'Control interno', pieza: 'a4v',
      n: '📦 Control de material', d: 'Qué entra, qué sale y qué hay que pedir.',
      acento: '#2E7D5B',
      bloques: [
        { t: 'campos', c: ['Fecha del recuento', 'Responsable'] },
        { t: 'tabla', tit: 'Existencias', cols: ['Producto', 'Unidad', 'Hay', 'Mínimo', 'Pedir'], filas: 14 },
        { t: 'lineas', tit: 'Proveedor y observaciones', n: 3 },
        { t: 'firma', c: ['Responsable'] }
      ] },

    { id: 'o_comisiones', variante: 'orden', cat: 'Control interno', pieza: 'a4v',
      n: '📊 Reparto de comisiones', d: 'Servicios por profesional, porcentaje y total a liquidar.',
      acento: '#1E5AA8',
      bloques: [
        { t: 'campos', c: ['Periodo', 'Fecha de liquidación'] },
        { t: 'tabla', tit: 'Liquidación', cols: ['Profesional', 'Servicios', 'Facturado', '%', 'A pagar'], filas: 10 },
        { t: 'campos', c: ['Total facturado', 'Total comisiones'] },
        { t: 'lineas', tit: 'Notas', n: 2 },
        { t: 'firma', c: ['Profesional', 'Dirección'] }
      ] }
  ];

  var PORID = {};
  PLANTILLAS.forEach(function (p) { PORID[p.id] = p; });

  function lista(variante) {
    return PLANTILLAS.filter(function (p) { return !variante || p.variante === variante; })
      .map(function (p) {
        var Z = PIEZAS[p.pieza] || PIEZAS.a5v;
        return {
          id: p.id, variante: p.variante, cat: p.cat, nombre: p.n, desc: p.d,
          pieza: p.pieza, piezaN: Z.n, mm: Z.mm.slice()
        };
      });
  }

  function grupos(variante) {
    var vistos = {}, orden = [];
    PLANTILLAS.forEach(function (p) {
      if (variante && p.variante !== variante) return;
      if (!vistos[p.cat]) { vistos[p.cat] = true; orden.push(p.cat); }
    });
    return orden;
  }

  function medidas(id) {
    var p = PORID[id] || PLANTILLAS[0];
    var Z = PIEZAS[p.pieza] || PIEZAS.a5v;
    return {
      mmW: Z.mm[0], mmH: Z.mm[1],
      W: px(Z.mm[0]), H: px(Z.mm[1]),
      pliegues: (Z.pliegues || []).slice(),
      nombre: Z.n
    };
  }

  /* ───────────────────────── El texto de la hoja ─────────────────────────
     mano y mostrador piden al cerebro tantos cuadros como celdas tenga la
     rejilla elegida, para que no sobre ni falte texto. orden no escribe
     nada: es un impreso, y lo que lleva son sus etiquetas. */

  function pagina(id, ctx) {
    var p = PORID[id] || PLANTILLAS[0];
    ctx = ctx || {};
    if (p.variante === 'orden') {
      return {
        orden: true,
        plantilla: p.id,
        titulo: p.n.replace(/^\S+\s/, ''),
        negocio: ctx.negocio || '',
        bloques: p.bloques.map(function (b) { return JSON.parse(JSON.stringify(b)); })
      };
    }
    var M = window.FOLLETO_MOTOR, CB = window.FOLLETO_CEREBRO;
    var R = (M && M.REJILLAS[p.rejilla]) || null;
    var n = p.rejilla === 'rlista' ? 6 : (R ? R.n : 4);
    var pag = CB.generar({
      rubro: ctx.rubro, tono: ctx.tono, n: n,
      negocio: ctx.negocio, ciudad: ctx.ciudad,
      contacto: ctx.contacto, semilla: ctx.semilla
    });
    pag.rejilla = p.rejilla;
    pag.tema = p.tema;
    pag.adornos = Object.assign({}, p.adornos || IMPRESO);
    if (p.formaCelda) pag.formaCelda = p.formaCelda;
    if (ctx.colores) pag.colores = Object.assign({}, ctx.colores);
    else if (p.paletaPro && ctx.paletas) {
      var PP = ctx.paletas.filter(function (x) { return x.id === p.paletaPro; })[0];
      if (PP) { pag.paletaPro = PP.id; pag.colores = Object.assign({}, PP.c); }
    } else if (p.colores) pag.colores = Object.assign({}, p.colores);
    pag.plantilla = p.id;
    return pag;
  }

  /* ───────────────────────── Impreso de mando ─────────────────────────
     Un formulario en papel tiene una regla que no se puede saltar: si el
     hueco para escribir es más estrecho que la letra de una persona, la
     hoja no sirve. Por eso los renglones se miden en milímetros reales
     (9 mm de paso) y, si los bloques no caben, se avisa recortando filas
     de las tablas antes que apretando el renglón.                        */

  function dibujarOrden(g, W, H, pag, p, op) {
    op = op || {};
    var A = p.acento || '#17171B';
    var TINTA = '#15161A', SUAVE2 = '#6B6D75', LINEA = '#B9BCC4';
    var F = 'Manrope, "Segoe UI", Arial, sans-serif';
    var u = W / px(148);                      // escala respecto a un A5 de ancho
    var mm = function (v) { return v * PXMM * (W / px(PIEZAS[p.pieza].mm[0])); };
    mm = function (v) { return v * (W / PIEZAS[p.pieza].mm[0]); };

    g.save();
    g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H);
    g.textBaseline = 'alphabetic';

    var M = mm(12);
    var x = M, y = M, ancho = W - M * 2;

    /* Cabecera: el negocio a la izquierda, el nombre del impreso debajo,
       y a la derecha el número de hoja y la fecha, que es lo primero que
       se rellena y lo primero que se busca al archivar. */
    g.fillStyle = A;
    g.fillRect(x, y, mm(3), mm(14));
    g.font = '700 ' + mm(4.6) + 'px ' + F;
    g.fillStyle = TINTA;
    /* si el nombre del negocio se ha borrado, no se imprime nada */
    if (pag.negocio) g.fillText(String(pag.negocio).toUpperCase(), x + mm(6), y + mm(5.4));
    g.font = '700 ' + mm(7) + 'px ' + F;
    g.fillText(pag.titulo, x + mm(6), y + mm(13.4));

    var cajaW = mm(46);
    g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.3));
    ['Nº', 'Fecha'].forEach(function (et, i) {
      var cx = x + ancho - cajaW + i * (cajaW / 2), cw = cajaW / 2;
      g.strokeRect(cx, y, cw, mm(14));
      g.font = '600 ' + mm(2.9) + 'px ' + F;
      g.fillStyle = SUAVE2;
      g.fillText(et, cx + mm(2), y + mm(4.2));
    });

    y += mm(19);
    g.strokeStyle = A; g.lineWidth = Math.max(1.5, mm(0.6));
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + ancho, y); g.stroke();
    y += mm(7);

    /* Alto natural de cada bloque, para saber si hay que recortar filas. */
    function alto(b) {
      if (b.t === 'campos') return Math.ceil(b.c.length / (b.c.length > 3 ? 2 : b.c.length)) * mm(12);
      if (b.t === 'casillas') return mm(7) + Math.ceil(b.c.length / 3) * mm(8.5);
      if (b.t === 'tabla') return mm(7) + (b.filas + 1) * mm(8.5);
      if (b.t === 'lineas') return mm(7) + b.n * mm(9);
      if (b.t === 'nota') return mm(13);
      if (b.t === 'firma') return mm(26);
      return 0;
    }

    var bloques = pag.bloques.map(function (b) { return b; });
    var disponible = H - y - M;
    var total = bloques.reduce(function (s, b) { return s + alto(b) + mm(5); }, 0);
    /* Si no cabe, se le quitan filas a las tablas más largas — nunca se
       aprieta el renglón por debajo de los 9 mm. */
    var guarda = 0;
    while (total > disponible && guarda++ < 40) {
      var may = null;
      bloques.forEach(function (b) { if (b.t === 'tabla' && b.filas > 3 && (!may || b.filas > may.filas)) may = b; });
      if (!may) break;
      may.filas--;
      total = bloques.reduce(function (s, b) { return s + alto(b) + mm(5); }, 0);
    }

    function titulo(t) {
      g.font = '700 ' + mm(3.2) + 'px ' + F;
      g.fillStyle = A;
      g.fillText(t.toUpperCase(), x, y + mm(4));
      y += mm(7);
    }
    function renglon(cx, cw, et) {
      g.font = '600 ' + mm(2.7) + 'px ' + F;
      g.fillStyle = SUAVE2;
      g.fillText(et.toUpperCase(), cx, y + mm(3.2));
      g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.28));
      g.beginPath();
      g.moveTo(cx, y + mm(10)); g.lineTo(cx + cw - mm(4), y + mm(10));
      g.stroke();
    }

    bloques.forEach(function (b) {
      if (b.t === 'campos') {
        var porFila = b.c.length > 3 ? 2 : b.c.length;
        b.c.forEach(function (et, i) {
          var col = i % porFila;
          if (col === 0 && i) y += mm(12);
          renglon(x + col * (ancho / porFila), ancho / porFila, et);
        });
        y += mm(12) + mm(5);
      } else if (b.t === 'casillas') {
        titulo(b.tit);
        var cols = 3, cw = ancho / cols;
        b.c.forEach(function (et, i) {
          var col = i % cols;
          if (col === 0 && i) y += mm(8.5);
          var cx = x + col * cw;
          g.strokeStyle = TINTA; g.lineWidth = Math.max(1, mm(0.35));
          g.strokeRect(cx, y, mm(4.6), mm(4.6));
          g.font = '400 ' + mm(3.1) + 'px ' + F;
          g.fillStyle = TINTA;
          g.fillText(et, cx + mm(6.6), y + mm(3.8));
        });
        y += mm(8.5) + mm(5);
      } else if (b.t === 'tabla') {
        titulo(b.tit);
        var anchos = b.cols.map(function (c, i) { return i === 0 ? 2 : 1; });
        var suma = anchos.reduce(function (a, v) { return a + v; }, 0);
        var cx0 = x;
        g.fillStyle = A;
        g.globalAlpha = 0.10;
        g.fillRect(x, y, ancho, mm(8.5));
        g.globalAlpha = 1;
        b.cols.forEach(function (c, i) {
          var cw2 = ancho * anchos[i] / suma;
          g.font = '700 ' + mm(2.8) + 'px ' + F;
          g.fillStyle = A;
          g.fillText(c.toUpperCase(), cx0 + mm(2.5), y + mm(5.6));
          cx0 += cw2;
        });
        y += mm(8.5);
        for (var f = 0; f < b.filas; f++) {
          g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.25));
          g.beginPath(); g.moveTo(x, y + mm(8.5)); g.lineTo(x + ancho, y + mm(8.5)); g.stroke();
          y += mm(8.5);
        }
        var cx1 = x;
        g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.25));
        b.cols.forEach(function (c, i) {
          if (i) {
            g.beginPath();
            g.moveTo(cx1, y - b.filas * mm(8.5) - mm(8.5));
            g.lineTo(cx1, y);
            g.stroke();
          }
          cx1 += ancho * anchos[i] / suma;
        });
        y += mm(5);
      } else if (b.t === 'lineas') {
        titulo(b.tit);
        for (var k = 0; k < b.n; k++) {
          g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.25));
          g.beginPath(); g.moveTo(x, y + mm(7)); g.lineTo(x + ancho, y + mm(7)); g.stroke();
          y += mm(9);
        }
        y += mm(5);
      } else if (b.t === 'nota') {
        g.font = '400 ' + mm(2.7) + 'px ' + F;
        g.fillStyle = SUAVE2;
        var pal = b.txt.split(' '), ln = '', yy = y + mm(3.4);
        pal.forEach(function (w) {
          var t2 = ln ? ln + ' ' + w : w;
          if (g.measureText(t2).width > ancho - mm(6)) {
            g.fillText(ln, x + mm(3), yy); ln = w; yy += mm(4);
          } else ln = t2;
        });
        if (ln) g.fillText(ln, x + mm(3), yy);
        g.strokeStyle = A; g.globalAlpha = 0.5; g.lineWidth = Math.max(1, mm(0.5));
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, yy + mm(1.5)); g.stroke();
        g.globalAlpha = 1;
        y = yy + mm(7);
      } else if (b.t === 'firma') {
        var n2 = b.c.length, fw = (ancho - mm(6) * (n2 - 1)) / n2;
        b.c.forEach(function (et, i) {
          var fx = x + i * (fw + mm(6));
          g.strokeStyle = LINEA; g.lineWidth = Math.max(1, mm(0.28));
          g.beginPath(); g.moveTo(fx, y + mm(16)); g.lineTo(fx + fw, y + mm(16)); g.stroke();
          g.font = '600 ' + mm(2.7) + 'px ' + F;
          g.fillStyle = SUAVE2;
          g.fillText('FIRMA · ' + et.toUpperCase(), fx, y + mm(21));
        });
        y += mm(26) + mm(5);
      }
    });

    /* Pie: de dónde salió la hoja. Un impreso sin origen acaba archivado
       sin saber de quién es. */
    g.font = '400 ' + mm(2.5) + 'px ' + F;
    g.fillStyle = '#9A9DA6';
    g.fillText((pag.negocio || '') + (op.contacto ? ' · ' + op.contacto : ''), x, H - mm(6));
    g.restore();
  }

  /* ───────────────────────── La hoja, a tamaño de imprenta ───────────────────────── */

  function hoja(id, pag, op) {
    var p = PORID[id] || PLANTILLAS[0];
    var md = medidas(id);
    var cv = document.createElement('canvas');
    cv.width = md.W; cv.height = md.H;
    var g = cv.getContext('2d');
    if (p.variante === 'orden') dibujarOrden(g, md.W, md.H, pag, p, op || {});
    else {
      var o = Object.assign({ formaCelda: pag.formaCelda || 'suave' }, op || {});
      window.FOLLETO_MOTOR.pintar(g, md.W, md.H, pag, o);
    }
    return cv;
  }

  /* ───────────────────────── Maqueta · en contexto ─────────────────────────
     Tres escenas. Ninguna intenta parecer una fotografía: son puestas en
     escena dibujadas, con la perspectiva y la sombra justas para que se
     entienda el tamaño de la pieza y cómo se va a ver de verdad.          */

  var ESCENAS = [
    { id: 'mesa', n: 'Sobre la mesa', d: 'Vista cenital ligeramente girada, con su sombra.' },
    { id: 'mano', n: 'En la mano', d: 'Sujeto e inclinado, para ver el tamaño real.' },
    { id: 'escaparate', n: 'En el escaparate', d: 'Pegado al cristal, con el reflejo de la calle.' }
  ];

  function sombra(g, x, y, w, h, d, a) {
    g.save();
    g.shadowColor = 'rgba(12,14,22,' + (a == null ? 0.34 : a) + ')';
    g.shadowBlur = d;
    g.shadowOffsetY = d * 0.42;
    g.fillStyle = '#000';
    g.fillRect(x, y, w, h);
    g.restore();
  }

  function contexto(g, W, H, id, hj, escena) {
    var md = medidas(id);
    var e = escena || 'mesa';
    g.save();
    g.clearRect(0, 0, W, H);

    if (e === 'escaparate') {
      /* Cristal: la calle detrás, muy desvaída, y la pieza pegada por dentro. */
      var cielo = g.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, '#C8D4DE');
      cielo.addColorStop(0.55, '#A9B8C6');
      cielo.addColorStop(1, '#7E8C99');
      g.fillStyle = cielo; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(60,72,84,0.30)';
      for (var b = 0; b < 5; b++) {
        var bw = W * (0.10 + (b % 3) * 0.045), bx = W * (0.02 + b * 0.20);
        g.fillRect(bx, H * (0.16 + (b % 2) * 0.08), bw, H * 0.62);
      }
      g.fillStyle = 'rgba(38,46,54,0.42)';
      g.fillRect(0, H * 0.80, W, H * 0.20);
    } else if (e === 'mano') {
      var fon = g.createLinearGradient(0, 0, W, H);
      fon.addColorStop(0, '#E7E4DF');
      fon.addColorStop(1, '#C9C5BE');
      g.fillStyle = fon; g.fillRect(0, 0, W, H);
    } else {
      var mesa = g.createLinearGradient(0, 0, W * 0.4, H);
      mesa.addColorStop(0, '#EDE7DE');
      mesa.addColorStop(1, '#D2C9BC');
      g.fillStyle = mesa; g.fillRect(0, 0, W, H);
      /* Veta de madera, apenas insinuada. */
      g.globalAlpha = 0.055; g.strokeStyle = '#6A5A46';
      for (var v = 0; v < 26; v++) {
        g.lineWidth = 1 + (v % 3);
        g.beginPath();
        g.moveTo(0, H * v / 26 + Math.sin(v) * 6);
        g.bezierCurveTo(W * 0.33, H * v / 26 - 9, W * 0.66, H * v / 26 + 11, W, H * v / 26);
        g.stroke();
      }
      g.globalAlpha = 1;
    }

    /* La pieza, encajada con margen y a su proporción real. */
    var caja = Math.min(W * 0.62, H * 0.78);
    var r = md.W / md.H;
    var pw = r >= 1 ? caja : caja * r, ph = r >= 1 ? caja / r : caja;
    var cx = W * (e === 'mano' ? 0.52 : 0.5), cy = H * (e === 'mano' ? 0.46 : 0.5);

    if (e === 'mano') {
      /* Los dedos por debajo y el pulgar por encima: la pieza queda sujeta,
         que es lo que da la escala. */
      var mx = cx - pw * 0.16, my = cy + ph * 0.30;
      g.save();
      g.fillStyle = '#E0B99A';
      g.beginPath();
      g.ellipse(mx, my + ph * 0.20, pw * 0.46, ph * 0.24, -0.12, 0, Math.PI * 2);
      g.fill();
      for (var d2 = 0; d2 < 4; d2++) {
        g.beginPath();
        g.ellipse(mx - pw * 0.26 + d2 * pw * 0.19, my + ph * 0.05, pw * 0.085, ph * 0.10, -0.12, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    }

    g.save();
    g.translate(cx, cy);
    if (e === 'mesa') g.rotate(-0.055);
    if (e === 'mano') g.rotate(0.045);
    sombra(g, -pw / 2, -ph / 2, pw, ph, Math.max(14, pw * 0.06), e === 'escaparate' ? 0.22 : 0.34);
    g.drawImage(hj, -pw / 2, -ph / 2, pw, ph);
    /* Un brillo diagonal muy leve: sin él el papel parece un rectángulo
       pegado y no una hoja que está en algún sitio. */
    var bri = g.createLinearGradient(-pw / 2, -ph / 2, pw / 2, ph / 2);
    bri.addColorStop(0, 'rgba(255,255,255,0.16)');
    bri.addColorStop(0.45, 'rgba(255,255,255,0.02)');
    bri.addColorStop(1, 'rgba(0,0,0,0.07)');
    g.fillStyle = bri;
    g.fillRect(-pw / 2, -ph / 2, pw, ph);
    g.restore();

    if (e === 'mano') {
      g.save();
      g.fillStyle = '#D9AE8E';
      g.beginPath();
      g.ellipse(cx - pw * 0.40, cy + ph * 0.20, pw * 0.10, ph * 0.15, 0.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }

    if (e === 'escaparate') {
      /* Reflejo del cristal por delante de todo, en diagonal. */
      g.save();
      g.globalCompositeOperation = 'screen';
      var ref = g.createLinearGradient(0, H, W, 0);
      ref.addColorStop(0, 'rgba(255,255,255,0)');
      ref.addColorStop(0.42, 'rgba(255,255,255,0.20)');
      ref.addColorStop(0.52, 'rgba(255,255,255,0.05)');
      ref.addColorStop(0.72, 'rgba(255,255,255,0.14)');
      ref.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = ref; g.fillRect(0, 0, W, H);
      g.restore();
    }

    /* La medida real, siempre a la vista: es la diferencia entre enseñar
       una imagen bonita y enseñar una pieza que se va a imprimir. */
    g.font = '600 ' + Math.round(H * 0.026) + 'px Manrope, "Segoe UI", Arial, sans-serif';
    g.fillStyle = 'rgba(20,22,28,0.55)';
    g.fillText(md.mmW + ' × ' + md.mmH + ' mm', W * 0.04, H * 0.955);
    g.restore();
  }

  /* ───────────────────────── Maqueta · plano de montaje ─────────────────────────
     Lo que se le manda a la imprenta: sangrado de 3 mm por fuera del corte,
     margen de seguridad de 5 mm por dentro, marcas de corte en las cuatro
     esquinas, pliegues marcados y las cotas escritas.                      */

  function montaje(g, W, H, id, hj) {
    var md = medidas(id);
    var SANG = 3, SEG = 5;
    var totalMM = [md.mmW + SANG * 2, md.mmH + SANG * 2];
    var caja = Math.min(W * 0.70 / totalMM[0], H * 0.74 / totalMM[1]);
    var esc = caja;                         // px por mm en el plano
    var tw = totalMM[0] * esc, th = totalMM[1] * esc;
    var ox = (W - tw) / 2, oy = (H - th) / 2 + H * 0.012;
    var cx = ox + SANG * esc, cy = oy + SANG * esc;   // esquina de corte
    var cw = md.mmW * esc, ch = md.mmH * esc;
    var F = 'Manrope, "Segoe UI", Arial, sans-serif';

    g.save();
    g.fillStyle = '#F1F0EE'; g.fillRect(0, 0, W, H);

    /* Cuadrícula de fondo cada 10 mm: da referencia sin robar atención. */
    g.strokeStyle = 'rgba(30,34,44,0.055)'; g.lineWidth = 1;
    for (var q = 0; q * 10 * esc < W; q++) {
      g.beginPath(); g.moveTo(q * 10 * esc, 0); g.lineTo(q * 10 * esc, H); g.stroke();
    }
    for (var q2 = 0; q2 * 10 * esc < H; q2++) {
      g.beginPath(); g.moveTo(0, q2 * 10 * esc); g.lineTo(W, q2 * 10 * esc); g.stroke();
    }

    /* La hoja se dibuja hasta el sangrado: el arte se estira 3 mm por cada
       lado, que es exactamente lo que se pierde en la guillotina. */
    g.save();
    g.shadowColor = 'rgba(16,20,30,0.16)';
    g.shadowBlur = 18; g.shadowOffsetY = 6;
    g.fillStyle = '#fff'; g.fillRect(ox, oy, tw, th);
    g.restore();
    g.drawImage(hj, ox, oy, tw, th);
    g.globalAlpha = 0.10; g.fillStyle = '#E8402A';
    g.fillRect(ox, oy, tw, SANG * esc);
    g.fillRect(ox, oy + th - SANG * esc, tw, SANG * esc);
    g.fillRect(ox, oy, SANG * esc, th);
    g.fillRect(ox + tw - SANG * esc, oy, SANG * esc, th);
    g.globalAlpha = 1;

    /* Línea de corte. */
    g.strokeStyle = '#17171B'; g.lineWidth = 1.4;
    g.strokeRect(cx, cy, cw, ch);

    /* Margen de seguridad: nada importante debe pisarlo. */
    g.save();
    g.setLineDash([7, 6]);
    g.strokeStyle = '#1E5AA8'; g.lineWidth = 1.2;
    g.strokeRect(cx + SEG * esc, cy + SEG * esc, cw - SEG * 2 * esc, ch - SEG * 2 * esc);
    g.restore();

    /* Pliegues, si la pieza los tiene. */
    (md.pliegues || []).forEach(function (mmY) {
      g.save();
      g.setLineDash([3, 4]);
      g.strokeStyle = '#2E7D5B'; g.lineWidth = 1.3;
      g.beginPath();
      g.moveTo(ox, cy + mmY * esc); g.lineTo(ox + tw, cy + mmY * esc);
      g.stroke();
      g.restore();
      g.font = '600 ' + Math.round(H * 0.019) + 'px ' + F;
      g.fillStyle = '#2E7D5B';
      g.fillText('pliegue ' + mmY + ' mm', ox + tw + H * 0.014, cy + mmY * esc + H * 0.006);
    });

    /* Marcas de corte: cuatro esquinas, separadas del corte, como en imprenta. */
    var lar = Math.max(10, esc * 5), sep = Math.max(4, esc * 1.5);
    g.strokeStyle = '#17171B'; g.lineWidth = 1.1;
    [[cx, cy, -1, -1], [cx + cw, cy, 1, -1], [cx, cy + ch, -1, 1], [cx + cw, cy + ch, 1, 1]]
      .forEach(function (m) {
        g.beginPath();
        g.moveTo(m[0] + m[2] * sep, m[1]); g.lineTo(m[0] + m[2] * (sep + lar), m[1]);
        g.moveTo(m[0], m[1] + m[3] * sep); g.lineTo(m[0], m[1] + m[3] * (sep + lar));
        g.stroke();
      });

    /* Cotas. */
    function cota(x1, y1, x2, y2, txt) {
      g.strokeStyle = '#6B6D75'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      var t = Math.max(9, Math.round(H * 0.018));
      g.font = '600 ' + t + 'px ' + F;
      g.fillStyle = '#4A4C55';
      var w = g.measureText(txt).width, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      g.fillStyle = '#F1F0EE';
      g.fillRect(mx - w / 2 - 5, my - t * 0.78, w + 10, t * 1.25);
      g.fillStyle = '#4A4C55';
      g.fillText(txt, mx - w / 2, my + t * 0.34);
    }
    cota(cx, cy - H * 0.055, cx + cw, cy - H * 0.055, md.mmW + ' mm');
    cota(cx - W * 0.045, cy, cx - W * 0.045, cy + ch, md.mmH + ' mm');

    /* Leyenda. */
    var ly = H * 0.955, lx = W * 0.04;
    var leyenda = [
      ['#E8402A', 'sangrado 3 mm'],
      ['#17171B', 'línea de corte'],
      ['#1E5AA8', 'margen de seguridad 5 mm']
    ];
    if ((md.pliegues || []).length) leyenda.push(['#2E7D5B', 'pliegue']);
    g.font = '600 ' + Math.max(9, Math.round(H * 0.019)) + 'px ' + F;
    leyenda.forEach(function (l) {
      g.fillStyle = l[0];
      g.fillRect(lx, ly - H * 0.012, H * 0.016, H * 0.016);
      g.fillStyle = '#4A4C55';
      g.fillText(l[1], lx + H * 0.024, ly + H * 0.002);
      lx += g.measureText(l[1]).width + H * 0.06;
    });

    g.font = '700 ' + Math.max(10, Math.round(H * 0.022)) + 'px ' + F;
    g.fillStyle = '#17171B';
    g.fillText(md.nombre + '  ·  hoja final ' + totalMM[0] + ' × ' + totalMM[1] + ' mm con sangrado',
      W * 0.04, H * 0.055);
    g.restore();
  }

  window.VOLANTES = {
    VARIANTES: VARIANTES,
    PIEZAS: PIEZAS,
    ESCENAS: ESCENAS,
    lista: lista,
    grupos: grupos,
    get: function (id) { return PORID[id] || null; },
    medidas: medidas,
    pagina: pagina,
    hoja: hoja,
    contexto: contexto,
    montaje: montaje
  };
})();
