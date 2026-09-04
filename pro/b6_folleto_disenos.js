/* ═══════════════════════════════════════════════════════════════════════════
   CEREBRO DE DISEÑO · Folletos Pro (Bloque 6)
   ───────────────────────────────────────────────────────────────────────────
   Estilos profesionales listos para elegir con un clic. Cada estilo es una
   combinación armónica de PALETA + CUADRÍCULA + HOJA + ACABADOS que ya sabe
   dibujar el motor (b6_folleto_motor.js). La persona elige el tipo de diseño
   que quiere y la plantilla se coloca sola; después puede seguir cambiando
   cualquier cosa a mano.

   No inventa nada nuevo en el lienzo: sólo mueve los mandos que ya existen,
   así que lo que promete es exactamente lo que sale. 100% en el dispositivo,
   sin coste, sin internet.

   API pública:
     FOLLETO_DISENOS.lista()   → [{id, nombre, desc, cat, tema, rejilla, formato, adornos}]
     FOLLETO_DISENOS.grupos()  → ['Catálogo y tarifa', 'Redes sociales', …]
     FOLLETO_DISENOS.get(id)   → un estilo, o null
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_DISENOS_LOADED) return;
  window._B6_FOLLETO_DISENOS_LOADED = true;

  var TODO = { grano: true, vineta: true, filetes: true, sombras: true };
  var LIMPIO = { grano: false, vineta: false, filetes: true, sombras: false };
  var IMPRESO = { grano: false, vineta: false, filetes: true, sombras: true };
  var SUAVE = { grano: true, vineta: false, filetes: true, sombras: true };

  /* cat = grupo para el desplegable · tema/rejilla/formato = mandos del motor */
  var DISENOS = [

    /* ── Carta y cartel (una sola pieza: foto grande + texto) ── */
    { id: 'carta_presentacion', cat: 'Carta y cartel', nombre: '💌 Carta de presentación',
      desc: 'Una sola pieza limpia: foto grande, tu nombre y tu mensaje.',
      tema: 'minimal', rejilla: 'r1', formato: 'a4v', adornos: LIMPIO },
    { id: 'cartel_anuncio', cat: 'Carta y cartel', nombre: '📢 Cartel de anuncio',
      desc: 'Pieza única llamativa en oro sobre negro, para anunciar algo.',
      tema: 'oro_negro', rejilla: 'r1', formato: 'a4v', adornos: TODO },
    { id: 'anuncio_historia', cat: 'Carta y cartel', nombre: '📱 Anuncio para historia',
      desc: 'Pieza única vertical para stories y estados de WhatsApp.',
      tema: 'violeta', rejilla: 'r1', formato: 'historia', adornos: TODO },
    { id: 'anuncio_cuadrado', cat: 'Carta y cartel', nombre: '📸 Anuncio cuadrado',
      desc: 'Pieza única para el feed de Instagram, cálida y clara.',
      tema: 'coral', rejilla: 'r1', formato: 'cuadrado', adornos: SUAVE },

    /* ── Catálogo y tarifa (para imprimir o PDF) ── */
    { id: 'catalogo_lujo', cat: 'Catálogo y tarifa', nombre: '👑 Catálogo lujo',
      desc: 'Oro sobre negro, seis servicios. El más elegante.',
      tema: 'oro_negro', rejilla: 'r6a', formato: 'a4v', adornos: TODO },
    { id: 'tarifa_clasica', cat: 'Catálogo y tarifa', nombre: '📋 Tarifa clásica',
      desc: 'Rejilla 2×2 en tonos nude. La de toda la vida, bien hecha.',
      tema: 'nude', rejilla: 'r4a', formato: 'a4v', adornos: IMPRESO },
    { id: 'carta_completa', cat: 'Catálogo y tarifa', nombre: '🍷 Carta completa',
      desc: 'Ocho servicios en burdeos. Cuando ofreces de todo.',
      tema: 'burdeos', rejilla: 'r8a', formato: 'a4v', adornos: TODO },
    { id: 'revista', cat: 'Catálogo y tarifa', nombre: '📰 Portada de revista',
      desc: 'Un servicio estrella grande arriba y tres debajo.',
      tema: 'violeta', rejilla: 'r4b', formato: 'a4v', adornos: TODO },
    { id: 'lista_precios', cat: 'Catálogo y tarifa', nombre: '📖 Foto + lista de precios',
      desc: 'Foto grande a un lado y la tarifa en lista al otro. Muy de peluquería.',
      tema: 'nude', rejilla: 'rlista', formato: 'a4v', adornos: IMPRESO },

    /* ── Redes sociales (cuadrado e historia) ── */
    { id: 'ig_post', cat: 'Redes sociales', nombre: '📸 Post de Instagram',
      desc: 'Cuadrado, cuatro cuadros, coral cálido. Para el feed.',
      tema: 'coral', rejilla: 'r4a', formato: 'cuadrado', adornos: IMPRESO },
    { id: 'ig_historia', cat: 'Redes sociales', nombre: '📲 Historia / WhatsApp',
      desc: 'Vertical, seis cuadros. Para estados y stories.',
      tema: 'violeta', rejilla: 'r6a', formato: 'historia', adornos: TODO },
    { id: 'neon_redes', cat: 'Redes sociales', nombre: '⚡ Neón para redes',
      desc: 'Cian brillante que llama la atención en el móvil.',
      tema: 'cian', rejilla: 'r4a', formato: 'cuadrado', adornos: TODO },
    { id: 'promo_oferta', cat: 'Redes sociales', nombre: '🔥 Cartel de oferta',
      desc: 'Dúo grande vertical, para anunciar una promoción.',
      tema: 'coral', rejilla: 'r2a', formato: 'historia', adornos: TODO },

    /* ── Bodas (el grupo que más se pide) ── */
    { id: 'boda_invitacion', cat: 'Bodas', nombre: '💍 Invitación de boda',
      desc: 'Pieza única en rosa suave: la foto de los novios y vuestro texto.',
      tema: 'rosa', rejilla: 'r1', formato: 'a4v', adornos: SUAVE },
    { id: 'boda_clasica', cat: 'Bodas', nombre: '🤍 Boda clásica',
      desc: 'Rosa suave, dos piezas lado a lado. Fino y romántico.',
      tema: 'rosa', rejilla: 'r2b', formato: 'a4v', adornos: SUAVE },
    { id: 'boda_dorada', cat: 'Bodas', nombre: '✨ Boda dorada',
      desc: 'Oro sobre negro, cuatro cuadros. Elegante y de noche.',
      tema: 'oro_negro', rejilla: 'r4a', formato: 'a4v', adornos: TODO },
    { id: 'boda_nude', cat: 'Bodas', nombre: '🕊️ Boda nude',
      desc: 'Tonos tierra y seis servicios. Sereno y natural.',
      tema: 'nude', rejilla: 'r6a', formato: 'a4v', adornos: IMPRESO },
    { id: 'boda_campestre', cat: 'Bodas', nombre: '🌿 Boda campestre',
      desc: 'Verde botánico, estilo revista. Bodas al aire libre.',
      tema: 'botanico', rejilla: 'r4b', formato: 'a4v', adornos: TODO },
    { id: 'boda_programa', cat: 'Bodas', nombre: '📜 Programa del día',
      desc: 'Ocho momentos del día, en nude. Ceremonia, banquete, baile…',
      tema: 'nude', rejilla: 'r8a', formato: 'a4v', adornos: IMPRESO },
    { id: 'boda_historia', cat: 'Bodas', nombre: '💐 Boda para historia',
      desc: 'Vertical y romántico, para anunciarlo por WhatsApp.',
      tema: 'rosa', rejilla: 'r2a', formato: 'historia', adornos: SUAVE },
    { id: 'boda_mesa', cat: 'Bodas', nombre: '🥂 Detalle de mesa',
      desc: 'Cuadrado y elegante, para el photocall o la mesa.',
      tema: 'burdeos', rejilla: 'r2b', formato: 'cuadrado', adornos: TODO },

    /* ── Elegante y eventos ── */
    { id: 'minimal', cat: 'Elegante y eventos', nombre: '◻️ Minimal blanco',
      desc: 'Limpio, sin adornos, negro sobre blanco. Muy pro.',
      tema: 'minimal', rejilla: 'r4a', formato: 'a4v', adornos: LIMPIO },
    { id: 'corporativo', cat: 'Elegante y eventos', nombre: '💼 Corporativo',
      desc: 'Azul serio, seis cuadros. Para empresa y servicios.',
      tema: 'corporativo', rejilla: 'r6a', formato: 'a4v', adornos: IMPRESO },
    { id: 'botanico', cat: 'Elegante y eventos', nombre: '🌿 Verde natural',
      desc: 'Botánico, seis cuadros. Bienestar, spa, ecológico.',
      tema: 'botanico', rejilla: 'r6a', formato: 'a4v', adornos: TODO },

    /* ── Escaparate (con jerarquía) ── */
    { id: 'escaparate', cat: 'Escaparate', nombre: '🛍️ Escaparate',
      desc: 'Lo caro grande arriba, las ofertas pequeñas abajo.',
      tema: 'oro_negro', rejilla: 'r6b', formato: 'a4v', adornos: TODO },
    { id: 'lookbook', cat: 'Escaparate', nombre: '📖 Lookbook',
      desc: 'Ocho piezas con jerarquía, estilo catálogo de moda.',
      tema: 'burdeos', rejilla: 'r8b', formato: 'a4v', adornos: TODO },

    /* ═══ TENDENCIA · seis estilos × cinco piezas ═══════════════════════════
       Cada una llega con su paleta fina (paletaPro o colores propios) y su
       troquel de celda (formaCelda) ya puestos, así que se abre y ya está.
       Todo se puede seguir cambiando a mano después. */

    /* ── Botánico dorado ── */
    { id: 't_bot_carta', cat: 'Tendencia · Botánico dorado', nombre: '🌿 Carta botánica',
      desc: 'Verde profundo y dorado, seis servicios en hoja.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r6a', formato: 'a4v', formaCelda: 'hoja', adornos: TODO },
    { id: 't_bot_menu', cat: 'Tendencia · Botánico dorado', nombre: '🍃 Menú de tratamientos',
      desc: 'Ocho tratamientos en ojiva, para spa y bienestar.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r8a', formato: 'a4v', formaCelda: 'ojiva', adornos: TODO },
    { id: 't_bot_post', cat: 'Tendencia · Botánico dorado', nombre: '🌱 Post botánico',
      desc: 'Cuadrado para el muro, cuatro cuadros redondos.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r4a', formato: 'cuadrado', formaCelda: 'circulo', adornos: TODO },
    { id: 't_bot_historia', cat: 'Tendencia · Botánico dorado', nombre: '🌾 Historia botánica',
      desc: 'Vertical con arco superior. Para estados y stories.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'r2a', formato: 'historia', formaCelda: 'arco', adornos: TODO },
    { id: 't_bot_precios', cat: 'Tendencia · Botánico dorado', nombre: '🌳 Tarifa en verde',
      desc: 'Foto grande y la lista de precios al lado.',
      tema: 'botanico', paletaPro: 'verde', rejilla: 'rlista', formato: 'a4v', formaCelda: 'blanda', adornos: IMPRESO },

    /* ── Editorial serif claro ── */
    { id: 't_ed_portada', cat: 'Tendencia · Editorial claro', nombre: '📄 Portada editorial',
      desc: 'Crema, mucho aire y un servicio grande arriba.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r4b', formato: 'a4v', formaCelda: 'recta', adornos: LIMPIO },
    { id: 't_ed_indice', cat: 'Tendencia · Editorial claro', nombre: '🗒️ Índice de servicios',
      desc: 'Ocho entradas alineadas, como un índice de revista.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r8a', formato: 'a4v', formaCelda: 'recta', adornos: LIMPIO },
    { id: 't_ed_retrato', cat: 'Tendencia · Editorial claro', nombre: '⚪ Retratos en círculo',
      desc: 'Cuatro retratos redondos sobre crema. Muy limpio.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r4a', formato: 'a4v', formaCelda: 'circulo', adornos: LIMPIO },
    { id: 't_ed_arco', cat: 'Tendencia · Editorial claro', nombre: '⌒ Arcos editoriales',
      desc: 'Tres arcos en fila, tendencia de catálogo actual.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r3a', formato: 'a4v', formaCelda: 'arco', adornos: LIMPIO },
    { id: 't_ed_post', cat: 'Tendencia · Editorial claro', nombre: '◽ Post editorial',
      desc: 'Cuadrado sobrio para el muro, en píldoras.',
      tema: 'minimal', paletaPro: 'editorial', rejilla: 'r2b', formato: 'cuadrado', formaCelda: 'pildora', adornos: LIMPIO },

    /* ── Romántico rosa ── */
    { id: 't_ros_corazones', cat: 'Tendencia · Romántico rosa', nombre: '💗 Cuatro corazones',
      desc: 'Cuatro corazones con tus fotos dentro. Para bodas y detalles.',
      tema: 'rosa', colores: { fondo: '#FDF1F2', panel: '#FFFFFF', acento: '#C97B8E', acento2: '#F3C6CE', tinta: '#3C2028', tinta2: '#8A6070' },
      rejilla: 'r4a', formato: 'a4v', formaCelda: 'corazon', adornos: SUAVE },
    { id: 't_ros_rosas', cat: 'Tendencia · Romántico rosa', nombre: '🌹 Seis rosas',
      desc: 'Seis rosas con foto. Muy pedido para floristería y novias.',
      tema: 'rosa', colores: { fondo: '#FBECEF', panel: '#FFF7F8', acento: '#B0324B', acento2: '#EFB9C4', tinta: '#3A1620', tinta2: '#8B5567' },
      rejilla: 'r6a', formato: 'a4v', formaCelda: 'rosa', adornos: SUAVE },
    { id: 't_ros_petalos', cat: 'Tendencia · Romántico rosa', nombre: '🌸 Pétalos en fila',
      desc: 'Tres pétalos, aire y tipografía fina.',
      tema: 'rosa', colores: { fondo: '#FDF3F0', panel: '#FFFFFF', acento: '#D08A76', acento2: '#F6CFC2', tinta: '#3B241D', tinta2: '#8C6659' },
      rejilla: 'r3a', formato: 'a4v', formaCelda: 'petalo', adornos: SUAVE },
    { id: 't_ros_historia', cat: 'Tendencia · Romántico rosa', nombre: '💐 Historia romántica',
      desc: 'Vertical con dos corazones grandes. Para anunciarlo.',
      tema: 'rosa', colores: { fondo: '#FCEFF3', panel: '#FFFFFF', acento: '#C0637E', acento2: '#F2C2D0', tinta: '#371A24', tinta2: '#875668' },
      rejilla: 'r2a', formato: 'historia', formaCelda: 'corazon', adornos: SUAVE },
    { id: 't_ros_invitacion', cat: 'Tendencia · Romántico rosa', nombre: '💌 Invitación en corazón',
      desc: 'Una sola pieza: un corazón grande con vuestra foto.',
      tema: 'rosa', colores: { fondo: '#FDF1F2', panel: '#FFFFFF', acento: '#B8455E', acento2: '#F2C4CD', tinta: '#351A21', tinta2: '#875361' },
      rejilla: 'r1', formato: 'a4v', formaCelda: 'corazon', adornos: SUAVE },

    /* ── Minimal nude ── */
    { id: 't_nu_tarifa', cat: 'Tendencia · Minimal nude', nombre: '🤎 Tarifa nude',
      desc: 'Beige y tipografía fina, seis servicios muy suaves.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r6a', formato: 'a4v', formaCelda: 'blanda', adornos: IMPRESO },
    { id: 't_nu_gotas', cat: 'Tendencia · Minimal nude', nombre: '💧 Gotas nude',
      desc: 'Cuatro gotas: cosmética, uñas, cuidado de la piel.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r4a', formato: 'a4v', formaCelda: 'gota', adornos: IMPRESO },
    { id: 't_nu_pildoras', cat: 'Tendencia · Minimal nude', nombre: '⬭ Píldoras nude',
      desc: 'Ocho píldoras en columna. Lista larga y ordenada.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r8a', formato: 'a4v', formaCelda: 'pildora', adornos: LIMPIO },
    { id: 't_nu_post', cat: 'Tendencia · Minimal nude', nombre: '🟤 Post nude',
      desc: 'Cuadrado con dos cuadros redondos y mucho aire.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r2b', formato: 'cuadrado', formaCelda: 'circulo', adornos: LIMPIO },
    { id: 't_nu_historia', cat: 'Tendencia · Minimal nude', nombre: '🧴 Historia nude',
      desc: 'Vertical con ojivas. Serena, para producto.',
      tema: 'nude', paletaPro: 'nude', rejilla: 'r3a', formato: 'historia', formaCelda: 'ojiva', adornos: IMPRESO },

    /* ── Bold moderno ── */
    { id: 't_bo_rombos', cat: 'Tendencia · Bold moderno', nombre: '◆ Rombos coral',
      desc: 'Color plano y rombos grandes. Se ve de lejos.',
      tema: 'coral', paletaPro: 'coral', rejilla: 'r4a', formato: 'a4v', formaCelda: 'rombo', adornos: LIMPIO },
    { id: 't_bo_hex', cat: 'Tendencia · Bold moderno', nombre: '⬡ Panal',
      desc: 'Seis hexágonos. Barbería, gimnasio, técnico.',
      tema: 'corporativo', paletaPro: 'azul', rejilla: 'r6a', formato: 'a4v', formaCelda: 'hexagono', adornos: TODO },
    { id: 't_bo_oferta', cat: 'Tendencia · Bold moderno', nombre: '🔥 Oferta a bocajarro',
      desc: 'Dos bloques enormes en vertical, para una promoción.',
      tema: 'coral', paletaPro: 'coral', rejilla: 'r2a', formato: 'historia', formaCelda: 'recta', adornos: LIMPIO },
    { id: 't_bo_feed', cat: 'Tendencia · Bold moderno', nombre: '🟥 Feed contundente',
      desc: 'Cuadrado, cuatro bloques a sangre, sin adornos.',
      tema: 'coral', paletaPro: 'coral', rejilla: 'r4a', formato: 'cuadrado', formaCelda: 'recta', adornos: LIMPIO },
    { id: 't_bo_escaparate', cat: 'Tendencia · Bold moderno', nombre: '🛒 Escaparate azul',
      desc: 'Lo importante grande arriba y las ofertas abajo.',
      tema: 'corporativo', paletaPro: 'azul', rejilla: 'r6b', formato: 'a4v', formaCelda: 'suave', adornos: IMPRESO },

    /* ── Lujo oscuro ── */
    { id: 't_lu_catalogo', cat: 'Tendencia · Lujo oscuro', nombre: '👑 Catálogo de noche',
      desc: 'Negro y oro, seis servicios en ojiva. El más elegante.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r6a', formato: 'a4v', formaCelda: 'ojiva', adornos: TODO },
    { id: 't_lu_carta', cat: 'Tendencia · Lujo oscuro', nombre: '🥂 Carta de ocho',
      desc: 'Ocho servicios sobre negro. Cuando ofreces de todo.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r8a', formato: 'a4v', formaCelda: 'suave', adornos: TODO },
    { id: 't_lu_retrato', cat: 'Tendencia · Lujo oscuro', nombre: '⭕ Retrato en oro',
      desc: 'Una sola pieza redonda con foto, sobre negro.',
      tema: 'oro_negro', paletaPro: 'noche_oro', rejilla: 'r1', formato: 'a4v', formaCelda: 'circulo', adornos: TODO },
    { id: 't_lu_vino', cat: 'Tendencia · Lujo oscuro', nombre: '🍷 Vino y crema',
      desc: 'Burdeos profundo, cuatro cuadros en arco.',
      tema: 'burdeos', paletaPro: 'vino', rejilla: 'r4a', formato: 'a4v', formaCelda: 'arco', adornos: TODO },
    { id: 't_lu_grafito', cat: 'Tendencia · Lujo oscuro', nombre: '⚫ Grafito y cal',
      desc: 'Gris piedra y blanco cal. Sobrio y muy actual.',
      tema: 'minimal', paletaPro: 'grafito', rejilla: 'r6a', formato: 'cuadrado', formaCelda: 'recta', adornos: LIMPIO }
  ];

  var PORID = {};
  DISENOS.forEach(function (d) { PORID[d.id] = d; });

  function grupos() {
    var vistos = {}, orden = [];
    DISENOS.forEach(function (d) { if (!vistos[d.cat]) { vistos[d.cat] = true; orden.push(d.cat); } });
    return orden;
  }

  window.FOLLETO_DISENOS = {
    lista: function () { return DISENOS.slice(); },
    grupos: grupos,
    get: function (id) { return PORID[id] || null; }
  };
})();
