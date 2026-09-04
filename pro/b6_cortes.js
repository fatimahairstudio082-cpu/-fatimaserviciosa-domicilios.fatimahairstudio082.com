/* ═════════════════════════════════════════════════════════════════
   BIBLIOTECA DE CORTES · el catálogo que alimenta <guias-3d>
   ─────────────────────────────────────────────────────────────────
   Cuarenta cortes, diez familias. Cada corte trae sus pasos ya
   escritos: cara, zona, partición, pila de elevaciones, tipo de
   corte, herramienta, dirección y narración.

   La regla que manda sobre todo lo demás es la del CABELLO:

     · liso extremo (indio) → se corta HORIZONTAL. En vertical el
       filo deja escalón visible: se ve trasquilado.
     · ondulado y rizado   → se corta VERTICAL. En horizontal la
       onda salta y el borde queda trasquilado.

   Por eso `guiaDe(corteId, cabelloId)` reescribe la partición de los
   pasos de corte según el cabello y añade el aviso en la ficha. El
   corte pone la geometría; el cabello pone la dirección del filo.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Pilas de elevación: siete zonas, Z0 nuca/borde → Z6 coronilla. */
  function plana(v) { return [v, v, v, v, v, v, v]; }
  function pila() { return Array.prototype.slice.call(arguments); }

  /* ══════════════════════════════════════════════════════════════
     1 · EL CABELLO Y SU REGLA DE FILO
     ══════════════════════════════════════════════════════════════ */
  var CABELLOS = [
    {
      id: 'liso_extremo', n: 'Liso extremo · indio', part: 'horizontal', seco: false,
      aviso: 'Cabello liso extremo: TODA sección de corte va horizontal. En vertical el filo deja escalón y se ve trasquilado.',
      corto: 'Horizontal siempre'
    },
    {
      id: 'liso', n: 'Liso normal', part: 'horizontal', seco: false,
      aviso: 'Liso normal: horizontal para el perímetro y la línea guía. La vertical solo para vaciar por dentro, nunca en el borde.',
      corto: 'Horizontal en el borde'
    },
    {
      id: 'ondulado', n: 'Ondulado', part: 'vertical', seco: false,
      aviso: 'Cabello ondulado: las secciones de corte van verticales. En horizontal la onda salta al secar y el borde queda trasquilado.',
      corto: 'Vertical'
    },
    {
      id: 'rizado', n: 'Rizado', part: 'vertical', seco: true,
      aviso: 'Rizado: vertical y en seco, mecha a mecha y sin tensión. El horizontal marca peldaño en cuanto el rizo se recoge.',
      corto: 'Vertical y en seco'
    },
    {
      id: 'afro', n: 'Afro · muy rizado', part: 'vertical', seco: true,
      aviso: 'Afro: vertical o radial, en seco y sin estirar. Se corta la forma, no la longitud: el peine sostiene y la tijera sigue la silueta.',
      corto: 'Vertical/radial en seco'
    },
    {
      id: 'fino', n: 'Fino · poca densidad', part: 'horizontal', seco: false,
      aviso: 'Cabello fino: horizontal y línea cerrada. Nada de desfilar el borde: cada punta que se quita se ve.',
      corto: 'Horizontal, línea cerrada'
    },
    {
      id: 'poblado', n: 'Muy poblado', part: 'vertical', seco: false,
      aviso: 'Cabello muy poblado: vertical para repartir el peso y entresacado por dentro. El horizontal cerrado le da forma de campana.',
      corto: 'Vertical + vaciado interno'
    }
  ];

  var FAMILIAS = [
    { id: 'melenas', n: 'Melenas y bob' },
    { id: 'capas', n: 'Capas y desfilados' },
    { id: 'cortos', n: 'Cortos de dama' },
    { id: 'media', n: 'Media melena · shag y wolf' },
    { id: 'flequillos', n: 'Flequillos' },
    { id: 'cab_tijera', n: 'Caballero a tijera' },
    { id: 'cab_maquina', n: 'Caballero a máquina' },
    { id: 'ninos', n: 'Niños y niñas' },
    { id: 'rizado', n: 'Rizado y afro' },
    { id: 'moda', n: 'Cortes de moda' }
  ];

  /* ══════════════════════════════════════════════════════════════
     2 · LOS PASOS
     Un paso se escribe corto: p(titulo, {…}). `corte: true` marca
     los pasos cuya partición decide el cabello.
     ══════════════════════════════════════════════════════════════ */
  function p(titulo, o) {
    o = o || {};
    o.titulo = titulo;
    return o;
  }

  /* Cuatro pasos por corte: replanteo · guía · construcción · acabado.
     `c` da el carácter del corte y `n` sus cuatro notas. */
  function juego(c) {
    var e = c.elev || plana(0);
    var eb = c.elevB || e, ef = c.elevF || e;
    var n = c.notas || ['', '', '', ''];
    var her = c.herramienta || 'Tijera';
    return [
      p('1 · Replanteo y particiones', {
        cara: 'posterior', foco: 'posterior', zonaB: 0, zonaF: 0,
        particionB: c.replanteo || 'diagAtras', particionF: 'horizontal',
        elevB: plana(0), elevF: plana(0),
        tipoCorte: 'Recto', herramienta: 'Tijera',
        direccion: 'Caída natural', tecnica: c.n,
        texto: n[0], resultado: 'Cabeza dividida y peinada en su caída.', seg: 5
      }),
      p('2 · Línea guía en la nuca', {
        cara: 'posterior', foco: 'posterior', zonaB: 0, zonaF: 0,
        particionB: c.part || 'horizontal', particionF: c.part || 'horizontal',
        elevB: plana(c.guiaElev == null ? 0 : c.guiaElev), elevF: plana(0),
        tipoCorte: c.tipo || 'Recto', herramienta: her,
        direccion: c.dir || 'Caída natural', tecnica: c.n,
        texto: n[1], resultado: 'Longitud madre marcada: manda en todo el corte.',
        corte: true, seg: 6
      }),
      p('3 · Construcción de la forma', {
        cara: 'posterior', foco: 'posterior', zonaB: 4, zonaF: 3,
        particionB: c.part || 'horizontal', particionF: c.part || 'horizontal',
        elevB: eb, elevF: ef,
        tipoCorte: c.tipo || 'Diagonal', herramienta: her,
        direccion: c.dir || 'Caída natural', tecnica: c.n,
        texto: n[2], resultado: c.resultado || 'La forma ya se lee en el espejo.',
        corte: true, seg: 7
      }),
      p('4 · Frontal, contorno y acabado', {
        cara: 'frontal', foco: 'frontal', zonaB: 5, zonaF: 5,
        particionB: c.part || 'horizontal', particionF: c.partF || c.part || 'horizontal',
        elevB: eb, elevF: ef,
        tipoCorte: c.acabado || 'Punteado', herramienta: c.herAcabado || 'Tijera',
        direccion: c.dirF || 'Hacia el rostro', tecnica: c.n,
        texto: n[3], resultado: 'Contorno limpio y peso comprobado en seco.',
        corte: true, seg: 6
      })
    ];
  }

  /* ══════════════════════════════════════════════════════════════
     3 · LOS CUARENTA CORTES
     ══════════════════════════════════════════════════════════════ */
  var C = [
    /* ── Melenas y bob ── */
    {
      id: 'bob_recto', fam: 'melenas', n: 'Bob recto clásico',
      d: 'Un solo largo, borde cerrado a la altura del maxilar. Todo el peso se queda en la línea.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural', acabado: 'Recto',
        resultado: 'Borde macizo, brillo continuo en la línea.',
        notas: [
          'Cuatro secciones y raya media. La cabeza se peina en su caída, sin tirar.',
          'Línea guía en la nuca a 0°: el largo madre. Cada mecha baja al filo sin elevar.',
          'Se sube capa a capa comprobando que cada mecha llega a la guía. Cero elevación: cero escalón.',
          'Los laterales se igualan con la nuca y el contorno se puntea apenas para quitar dureza.'
        ] }
    },
    {
      id: 'lob', fam: 'melenas', n: 'Long bob · lob',
      d: 'Bob largo a la clavícula, con la línea ligeramente adelantada.',
      mejor: ['liso', 'ondulado'],
      g: { part: 'horizontal', tipo: 'Diagonal', elev: plana(0), guiaElev: 0, dir: 'Caída natural',
        resultado: 'Línea a la clavícula, un dedo más larga delante.',
        notas: [
          'Raya media y cuatro cuartos. La clavícula es la referencia, no la mandíbula.',
          'Guía en la nuca a la altura elegida, diagonal suave hacia adelante.',
          'Se levanta la diagonal capa a capa: delante gana un centímetro por cada sección.',
          'Delante se comprueba a espejo que las dos puntas caen iguales.'
        ] }
    },
    {
      id: 'bob_asimetrico', fam: 'melenas', n: 'Bob asimétrico',
      d: 'Un lado corto, el otro largo. La diagonal cruza toda la nuca.',
      mejor: ['liso_extremo', 'liso'],
      g: { part: 'diagAdelante', tipo: 'Diagonal', elev: plana(0), dir: 'Hacia el rostro',
        replanteo: 'diagAdelante', resultado: 'Diferencia clara entre los dos lados, sin peldaño.',
        notas: [
          'Raya lateral marcada: la asimetría se decide aquí, no al final.',
          'Guía en el lado corto. Todo el corte va a buscar esa longitud.',
          'La diagonal se mantiene sección a sección: la mano no cambia el ángulo a medio camino.',
          'El lado largo se peina hacia el rostro y se cierra en punta.'
        ] }
    },
    {
      id: 'carre_a', fam: 'melenas', n: 'Carré en línea A',
      d: 'Nuca corta y frente larga: la línea sube por detrás y avanza hacia la cara.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Diagonal', elev: plana(0), dir: 'Hacia el rostro',
        resultado: 'La A se lee de perfil: nuca corta, delante largo.',
        notas: [
          'Cuatro secciones. En la nuca se marca hasta dónde sube la línea.',
          'Guía corta en la nuca, pegada al nacimiento.',
          'Cada sección se corta un poco más larga que la de abajo, siempre en horizontal.',
          'Delante marca el largo máximo: se comprueba con la barbilla como tope.'
        ] }
    },

    /* ── Capas y desfilados ── */
    {
      id: 'capas_largas', fam: 'capas', n: 'Capas largas clásicas',
      d: 'Melena larga con movimiento repartido y el largo intacto.',
      mejor: ['liso', 'ondulado', 'poblado'],
      g: { part: 'vertical', tipo: 'Diagonal', elev: pila(0, 20, 35, 50, 65, 80, 90),
        dir: 'Caída natural', acabado: 'Desfilado',
        resultado: 'Movimiento sin perder longitud.',
        notas: [
          'Se respeta el largo: la primera capa nunca toca el perímetro.',
          'Guía en la nuca a 0° solo para igualar el borde.',
          'Las capas suben en rampa hasta 90° en la coronilla: el peso se reparte.',
          'Delante, capas cara que arrancan del pómulo hacia abajo.'
        ] }
    },
    {
      id: 'capas_90', fam: 'capas', n: 'Capas uniformes a 90°',
      d: 'Todas las mechas a la misma elevación: forma redonda y peso igualado.',
      mejor: ['ondulado', 'rizado', 'poblado'],
      g: { part: 'vertical', tipo: 'Recto', elev: plana(90), guiaElev: 90, dir: 'Perpendicular',
        resultado: 'Silueta redonda, mismo largo en toda la cabeza.',
        notas: [
          'Secciones radiales desde la coronilla: la cabeza se trabaja como una esfera.',
          'La guía se saca en la coronilla, no en la nuca: manda desde arriba.',
          'Cada mecha sale a 90° del cráneo y se corta a la misma medida que la anterior.',
          'Se comprueba en seco girando la cabeza: no debe haber esquinas.'
        ] }
    },
    {
      id: 'desfilado_punta', fam: 'capas', n: 'Desfilado en punta de tijera',
      d: 'El borde se abre con la punta para quitar dureza sin quitar largo.',
      mejor: ['liso', 'poblado'],
      g: { part: 'vertical', tipo: 'Punteado', elev: pila(0, 10, 20, 30, 45, 60, 75),
        dir: 'Caída natural', acabado: 'Punteado',
        resultado: 'Borde blando, largo intacto.',
        notas: [
          'El corte ya está hecho: aquí solo se trabaja la textura del borde.',
          'Se comprueba la línea antes de abrirla: lo que no está recto no se desfila.',
          'Punta de tijera en el último centímetro, con la mecha en su caída.',
          'Delante se puntea menos: el contorno de la cara necesita línea.'
        ] }
    },
    {
      id: 'capas_cara', fam: 'capas', n: 'Capas cara · face frame',
      d: 'Solo el contorno del rostro. Enmarca sin tocar el resto del corte.',
      mejor: ['liso', 'ondulado', 'rizado'],
      g: { part: 'horizontal', partF: 'vertical', tipo: 'Deslizado', elev: pila(0, 0, 0, 20, 40, 60, 70),
        dir: 'Hacia el rostro', acabado: 'Deslizado',
        resultado: 'Marco suave que arranca donde pide la cara.',
        notas: [
          'Se aísla la media luna del contorno: el resto de la melena queda pinzado.',
          'La guía es el largo existente: no se acorta el perímetro.',
          'La mecha se peina hacia el rostro y se corta deslizada, de arriba abajo.',
          'Se comprueba de frente que los dos lados arrancan a la misma altura.'
        ] }
    },

    /* ── Cortos de dama ── */
    {
      id: 'pixie', fam: 'cortos', n: 'Pixie clásico',
      d: 'Nuca y laterales cortos, coronilla con algo de largo para peinar.',
      mejor: ['liso', 'fino', 'ondulado'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(45, 60, 75, 90, 90, 90, 90),
        guiaElev: 45, dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Cabeza redonda, nuca limpia, movimiento arriba.',
        notas: [
          'Se separa el casquete con la herradura: dentro va el largo, fuera el corto.',
          'Guía en la nuca a 45°, pegada al nacimiento.',
          'El casquete se trabaja a 90° con secciones verticales; la coronilla marca el peinado.',
          'Contorno de orejas y patillas a tijera y peine, en seco.'
        ] }
    },
    {
      id: 'pixie_desfilado', fam: 'cortos', n: 'Pixie desfilado',
      d: 'El mismo pixie con el borde abierto: más movimiento y menos peso.',
      mejor: ['poblado', 'ondulado'],
      g: { part: 'vertical', tipo: 'Desfilado', elev: pila(45, 60, 90, 90, 90, 90, 90),
        guiaElev: 45, dir: 'Perpendicular', acabado: 'Desgrafilado', herAcabado: 'Tijera de entresacar',
        resultado: 'Puntas abiertas, silueta viva.',
        notas: [
          'Herradura marcada y nuca peinada hacia abajo.',
          'Guía corta a 45°: el punto de partida no cambia respecto al pixie.',
          'Cada sección se desfila con la punta: se abre el borde, no se acorta.',
          'Entresacar solo por dentro, nunca en el contorno visible.'
        ] }
    },
    {
      id: 'garzon', fam: 'cortos', n: 'Garzón',
      d: 'Corto con perímetro cerrado y flequillo largo. Línea marcada, no desfilada.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: pila(0, 15, 30, 45, 60, 75, 90),
        dir: 'Caída natural', acabado: 'Recto',
        resultado: 'Perímetro rotundo y casquete con volumen.',
        notas: [
          'Cuatro secciones y herradura: el garzón vive del contorno.',
          'Guía en la nuca a 0°: la línea de abajo se ve siempre.',
          'El casquete sube en rampa para dar volumen sin abrir el borde.',
          'Flequillo largo cortado en horizontal, a la altura de la ceja.'
        ] }
    },
    {
      id: 'mixie', fam: 'cortos', n: 'Mixie',
      d: 'Mezcla de pixie y mullet: coronilla corta con textura y nuca algo más larga.',
      mejor: ['ondulado', 'liso', 'poblado'],
      g: { part: 'vertical', tipo: 'Desfilado', elev: pila(20, 40, 70, 90, 90, 90, 90),
        guiaElev: 20, dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Nuca con presencia y coronilla texturizada.',
        notas: [
          'Se separan tres zonas: nuca, laterales y casquete.',
          'La nuca guarda largo: la guía se marca a 20°, no al ras.',
          'Los laterales y la coronilla se vacían a 90° con secciones verticales.',
          'El flequillo se puntea corto y el contorno se deja irregular a propósito.'
        ] }
    },

    /* ── Media melena, shag y wolf ── */
    {
      id: 'media_45', fam: 'media', n: 'Media melena en 45°',
      d: 'La clásica: línea diagonal que adelanta el peso hacia la cara.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Diagonal', elev: plana(0), dir: 'Hacia el rostro',
        replanteo: 'diagAdelante',
        resultado: 'Diagonal limpia de la nuca a la barbilla.',
        notas: [
          'Particiones diagonales adelante en las dos mitades de atrás.',
          'Guía corta en la nuca: desde ahí la línea solo puede alargar.',
          'Cada sección respeta el mismo ángulo: 45° comprobados con el peine.',
          'Delante, la línea llega a la barbilla y se cierra recta.'
        ] }
    },
    {
      id: 'shag', fam: 'media', n: 'Shag',
      d: 'Capas cortas y borde abierto: mucho movimiento y poco peso.',
      mejor: ['ondulado', 'rizado', 'poblado'],
      g: { part: 'vertical', tipo: 'Desfilado', elev: pila(20, 45, 70, 90, 110, 120, 130),
        dir: 'Perpendicular', acabado: 'Desfilado',
        resultado: 'Silueta rota, coronilla ligera.',
        notas: [
          'Secciones radiales: el shag se construye desde la coronilla hacia fuera.',
          'La guía se saca arriba y es corta: manda el volumen, no el largo.',
          'Las capas pasan de 90°: por encima de la horizontal se vacía de verdad.',
          'Puntas desfiladas y flequillo abierto: se comprueba en seco.'
        ] }
    },
    {
      id: 'wolf', fam: 'media', n: 'Wolf cut',
      d: 'Coronilla muy ligera sobre largos intactos. Shag y mullet en el mismo corte.',
      mejor: ['ondulado', 'rizado', 'poblado'],
      g: { part: 'vertical', tipo: 'Desfilado', elev: pila(0, 30, 60, 100, 130, 150, 170),
        dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Volumen arriba, largo abajo, transición marcada.',
        notas: [
          'Tres zonas: nuca larga, capas medias y casquete corto.',
          'El perímetro se toca lo mínimo: solo se iguala.',
          'La coronilla se eleva hasta 170°: ahí está todo el vaciado.',
          'La transición se puntea a mano alzada, sin buscar la línea.'
        ] }
    },
    {
      id: 'butterfly', fam: 'media', n: 'Butterfly',
      d: 'Dos largos que conviven: capas cortas al nivel del pómulo y melena larga.',
      mejor: ['liso', 'ondulado'],
      g: { part: 'vertical', tipo: 'Deslizado', elev: pila(0, 0, 20, 50, 80, 100, 110),
        dir: 'Hacia el rostro', acabado: 'Deslizado',
        resultado: 'Efecto de melena doble, con el largo entero.',
        notas: [
          'Se separa la zona de capas: de la coronilla al pómulo, nada más.',
          'El largo no se corta: la guía es el perímetro existente.',
          'Las capas internas se cortan deslizadas y sobredirigidas hacia adelante.',
          'Al secar, las capas deben caer sobre el largo sin marcar peldaño.'
        ] }
    },

    /* ── Flequillos ── */
    {
      id: 'fleq_recto', fam: 'flequillos', n: 'Flequillo recto',
      d: 'Línea cerrada a la altura de la ceja. Todo el peso en el borde.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural',
        acabado: 'Recto', resultado: 'Borde macizo y paralelo a la ceja.',
        notas: [
          'Triángulo frontal: del vértice a las dos sienes, nunca más abierto.',
          'La primera mecha, la más cercana a la cara, marca el largo.',
          'Se corta en horizontal, con el peine sujetando y sin tensar.',
          'Se comprueba seco y de frente: el flequillo se acorta al secar.'
        ] }
    },
    {
      id: 'fleq_cortina', fam: 'flequillos', n: 'Flequillo cortina',
      d: 'Abierto al medio, corto en el centro y largo hacia los lados.',
      mejor: ['liso', 'ondulado', 'rizado'],
      g: { part: 'vertical', tipo: 'Diagonal', elev: pila(0, 0, 0, 30, 45, 45, 45),
        dir: 'Hacia el rostro', acabado: 'Deslizado',
        resultado: 'Cortina que abre desde el pómulo.',
        notas: [
          'Triángulo frontal repartido en dos mitades desde la raya.',
          'El punto corto se marca en el centro, a la altura de la ceja.',
          'Cada mitad se peina hacia su lado y se corta en diagonal descendente.',
          'Se desliza el último centímetro para que la cortina caiga sola.'
        ] }
    },
    {
      id: 'fleq_desfilado', fam: 'flequillos', n: 'Flequillo desfilado',
      d: 'Ligero y transparente: se ve la frente entre las puntas.',
      mejor: ['poblado', 'liso', 'ondulado'],
      g: { part: 'horizontal', tipo: 'Punteado', elev: plana(0), dir: 'Caída natural',
        acabado: 'Punteado', resultado: 'Borde abierto, sin línea dura.',
        notas: [
          'Triángulo frontal más estrecho: menos pelo, más transparencia.',
          'Primero la línea recta a la altura buscada, un dedo más larga.',
          'Se puntea de abajo hacia arriba, con la tijera casi vertical.',
          'Se retira el peine y se mira de frente antes de volver a tocar.'
        ] }
    },
    {
      id: 'fleq_baby', fam: 'flequillos', n: 'Flequillo baby',
      d: 'Muy corto, por encima de la ceja. No hay margen de error.',
      mejor: ['liso_extremo', 'liso'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural',
        acabado: 'Punteado', resultado: 'Línea corta y limpia sobre la ceja.',
        notas: [
          'Triángulo pequeño y peinado en seco: el baby se mide seco, siempre.',
          'Se marca el largo un centímetro por debajo del final buscado.',
          'Corte horizontal en dos pasadas: primero largo, luego el ajuste.',
          'Las esquinas se puntean apenas para que no marquen ángulo.'
        ] }
    },

    /* ── Caballero a tijera ── */
    {
      id: 'cab_clasico', fam: 'cab_tijera', n: 'Clásico con raya',
      d: 'Tijera y peine. Laterales cerrados, arriba con largo para peinar.',
      mejor: ['liso', 'liso_extremo', 'fino'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(30, 45, 60, 90, 90, 90, 90),
        guiaElev: 30, dir: 'Perpendicular', acabado: 'Recto',
        resultado: 'Silueta limpia y raya que se sostiene.',
        notas: [
          'Se marca la línea de la herradura: arriba el largo, abajo tijera y peine.',
          'Guía en la nuca a 30°, sobre el peine.',
          'Los laterales se cierran a peine y la parte alta se iguala a 90°.',
          'Contorno de patillas, orejas y nuca en seco, a tijera.'
        ] }
    },
    {
      id: 'cab_ejecutivo', fam: 'cab_tijera', n: 'Ejecutivo con volumen',
      d: 'Corto pero con cuerpo arriba: el peine deja altura en la coronilla.',
      mejor: ['liso', 'fino', 'ondulado'],
      g: { part: 'vertical', tipo: 'Diagonal', elev: pila(30, 50, 70, 90, 110, 120, 130),
        guiaElev: 30, dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Altura en la coronilla y laterales pegados.',
        notas: [
          'Tres zonas: laterales, transición y casquete.',
          'Guía baja a tijera y peine, sin marcar escalón.',
          'La coronilla se eleva por encima de 90° para dejar altura.',
          'La transición se puntea hasta que no se vea el cambio.'
        ] }
    },
    {
      id: 'cab_escolar', fam: 'cab_tijera', n: 'Escolar a tijera y peine',
      d: 'Corto parejo, sin máquina. El peine marca toda la medida.',
      mejor: ['liso', 'liso_extremo', 'ondulado'],
      g: { part: 'vertical', tipo: 'Recto', elev: plana(45), guiaElev: 45, dir: 'Perpendicular',
        acabado: 'Recto', resultado: 'Medida uniforme en toda la cabeza.',
        notas: [
          'Sin herradura: la cabeza se trabaja entera con el peine.',
          'La guía es el peine apoyado en el cráneo, nunca los dedos.',
          'Se avanza en secciones verticales solapadas, siempre en el mismo sentido.',
          'Contorno y nuca al final, con el peine de púa fina.'
        ] }
    },
    {
      id: 'cab_casquete', fam: 'cab_tijera', n: 'Casquete corto',
      d: 'Muy corto y redondo, todo a la misma distancia del cráneo.',
      mejor: ['liso', 'poblado', 'ondulado'],
      g: { part: 'vertical', tipo: 'Recto', elev: plana(90), guiaElev: 90, dir: 'Perpendicular',
        acabado: 'Punteado', resultado: 'Esfera perfecta, sin planos.',
        notas: [
          'Secciones radiales desde la coronilla: el casquete es una esfera.',
          'Guía en la coronilla: todo lo demás la iguala.',
          'Cada mecha sale a 90° y se corta a la misma medida.',
          'Se busca el plano con la palma: donde se hunda, falta corte.'
        ] }
    },

    /* ── Caballero a máquina ── */
    {
      id: 'fade_bajo', fam: 'cab_maquina', n: 'Fade bajo',
      d: 'El degradado arranca por encima de la oreja y muere en la nuca.',
      mejor: ['liso', 'poblado', 'afro'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(0, 20, 45, 70, 90, 90, 90),
        guiaElev: 0, dir: 'Perpendicular', herramienta: 'Máquina', acabado: 'Punteado',
        resultado: 'Transición invisible, línea baja.',
        notas: [
          'Se marca con el peine hasta dónde sube el degradado: un dedo sobre la oreja.',
          'Primera pasada al ras en la nuca, de abajo hacia arriba y saliendo.',
          'Se cambia de número cada franja y se difumina el borde con la muñeca.',
          'Arriba se une a tijera y peine; el contorno se cierra al final.'
        ] }
    },
    {
      id: 'fade_medio', fam: 'cab_maquina', n: 'Fade medio',
      d: 'El degradado sube hasta media cabeza. El más equilibrado.',
      mejor: ['liso', 'poblado', 'afro'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(0, 30, 60, 90, 90, 90, 90),
        guiaElev: 0, dir: 'Perpendicular', herramienta: 'Máquina', acabado: 'Punteado',
        resultado: 'Degradado limpio a media altura.',
        notas: [
          'La línea del fade se marca a la altura de la sien.',
          'Guía al ras en la base, con la máquina saliendo del cráneo.',
          'Tres franjas de número creciente, cada una difuminada con la anterior.',
          'La parte alta se trabaja a tijera y se une con punteado.'
        ] }
    },
    {
      id: 'fade_alto', fam: 'cab_maquina', n: 'Fade alto · skin',
      d: 'Piel abajo y contraste marcado con la parte de arriba.',
      mejor: ['liso', 'poblado', 'afro'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(0, 45, 90, 90, 110, 120, 130),
        guiaElev: 0, dir: 'Perpendicular', herramienta: 'Máquina', acabado: 'Punteado',
        resultado: 'Contraste fuerte, transición corta.',
        notas: [
          'El fade sube por encima de la sien: la línea se marca antes de tocar la máquina.',
          'Se abre a piel en la base, sin guarda y a contrapelo.',
          'Las franjas son estrechas: mucho número en poco espacio, y se difuminan a fondo.',
          'Arriba se deja largo para el contraste y se puntea el borde de unión.'
        ] }
    },
    {
      id: 'buzz', fam: 'cab_maquina', n: 'Buzz cut · rapado uniforme',
      d: 'Un solo número en toda la cabeza. Todo depende del contorno.',
      mejor: ['liso', 'poblado', 'afro', 'fino'],
      g: { part: 'vertical', tipo: 'Recto', elev: plana(0), guiaElev: 0, dir: 'Perpendicular',
        herramienta: 'Máquina', acabado: 'Recto', resultado: 'Medida idéntica en toda la cabeza.',
        notas: [
          'No hay secciones: hay recorrido. Se decide el orden y no se cambia.',
          'Primera pasada en la nuca, a contrapelo y sin levantar la máquina.',
          'Se cubre la cabeza en franjas solapadas hasta que no queden crestas.',
          'Contorno de nuca, orejas y sienes: aquí está todo el resultado.'
        ] }
    },

    /* ── Niños y niñas ── */
    {
      id: 'nino_escolar', fam: 'ninos', n: 'Niño escolar',
      d: 'Corto sencillo y rápido: laterales a máquina, arriba a tijera.',
      mejor: ['liso', 'ondulado', 'poblado'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(20, 40, 60, 90, 90, 90, 90),
        guiaElev: 20, dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Corto cómodo que aguanta el crecimiento.',
        notas: [
          'Se trabaja en pocas secciones: el tiempo del niño manda.',
          'Guía baja en la nuca, sin apurar el ras.',
          'Los laterales se cierran y la parte alta se iguala a 90°.',
          'Contorno rápido y punteado del flequillo, siempre con la cabeza recta.'
        ] }
    },
    {
      id: 'nino_flequillo', fam: 'ninos', n: 'Niño con flequillo',
      d: 'Largo suficiente para peinar y flequillo recto sobre la ceja.',
      mejor: ['liso_extremo', 'liso', 'ondulado'],
      g: { part: 'horizontal', tipo: 'Recto', elev: pila(0, 20, 40, 60, 80, 90, 90),
        dir: 'Caída natural', acabado: 'Punteado',
        resultado: 'Flequillo limpio y casquete con movimiento.',
        notas: [
          'Herradura marcada y triángulo frontal separado desde el principio.',
          'Guía en la nuca a 0°: se respeta el largo de atrás.',
          'El casquete sube en rampa hasta la coronilla.',
          'Flequillo en horizontal, un dedo sobre la ceja, y esquinas punteadas.'
        ] }
    },
    {
      id: 'nina_recta', fam: 'ninos', n: 'Niña · melena recta',
      d: 'Un solo largo, borde cerrado. La forma más limpia de crecer.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural',
        acabado: 'Recto', resultado: 'Línea recta y pareja en toda la melena.',
        notas: [
          'Raya media y cuatro secciones; la cabeza recta y el mentón bajo.',
          'Guía en la nuca a 0°, a la altura acordada con la madre.',
          'Todo el corte en horizontal, sin elevar nada.',
          'Se comprueba de espaldas que las dos mitades caen iguales.'
        ] }
    },
    {
      id: 'nina_capas', fam: 'ninos', n: 'Niña · capas suaves',
      d: 'Melena con movimiento ligero y el largo respetado.',
      mejor: ['ondulado', 'liso', 'rizado'],
      g: { part: 'vertical', tipo: 'Diagonal', elev: pila(0, 15, 30, 45, 60, 70, 80),
        dir: 'Caída natural', acabado: 'Punteado',
        resultado: 'Movimiento suave sin perder melena.',
        notas: [
          'Se separa la coronilla: las capas viven ahí, no en el borde.',
          'El perímetro se iguala primero, en horizontal.',
          'Las capas suben en rampa suave, sin pasar de 80°.',
          'Nada de desfilar el borde: en cabello de niña se ve enseguida.'
        ] }
    },

    /* ── Rizado y afro ── */
    {
      id: 'rizo_seco', fam: 'rizado', n: 'Corte en seco rizo a rizo',
      d: 'Se corta cada rizo en su forma, sin peine y sin tensión.',
      mejor: ['rizado', 'afro', 'ondulado'],
      g: { part: 'vertical', tipo: 'Punteado', elev: pila(0, 0, 20, 40, 60, 70, 80),
        dir: 'Caída natural', acabado: 'Punteado',
        resultado: 'Forma limpia con el rizo intacto.',
        notas: [
          'Cabello seco, definido y sin producto pesado. No se peina.',
          'La guía es el rizo más largo: se corta uno y se compara.',
          'Cada rizo se corta en su propio muelle, con la tijera vertical.',
          'Se comprueba de lejos, en el espejo grande, antes de rematar.'
        ] }
    },
    {
      id: 'curly_bob', fam: 'rizado', n: 'Curly bob',
      d: 'Bob para rizo: se corta más largo porque el rizo sube al secar.',
      mejor: ['rizado', 'ondulado'],
      g: { part: 'vertical', tipo: 'Recto', elev: pila(0, 10, 25, 40, 55, 70, 80),
        dir: 'Caída natural', acabado: 'Punteado',
        resultado: 'Bob redondo que no se abre en triángulo.',
        notas: [
          'Se marca el largo contando el encogimiento: hasta un tercio más largo.',
          'Guía en la nuca sin estirar el rizo: se corta donde cae.',
          'Las secciones verticales reparten el peso y evitan el triángulo.',
          'Se vacía por dentro, nunca en el contorno.'
        ] }
    },
    {
      id: 'afro_redondo', fam: 'rizado', n: 'Afro redondo',
      d: 'La forma se corta a peine alto: una esfera medida desde el cráneo.',
      mejor: ['afro', 'rizado'],
      g: { part: 'vertical', tipo: 'Recto', elev: plana(90), guiaElev: 90, dir: 'Perpendicular',
        acabado: 'Punteado', resultado: 'Esfera pareja, sin planos ni huecos.',
        notas: [
          'Cabello seco y peinado con peine de púa ancha hasta ganar volumen.',
          'La guía se saca arriba: la esfera se mide desde la coronilla.',
          'Se corta sobre el peine, a la misma distancia del cráneo en toda la cabeza.',
          'Se busca el hueco con la palma y se rellena con la silueta, no con largo.'
        ] }
    },
    {
      id: 'afro_capas', fam: 'rizado', n: 'Afro con capas y perfilado',
      d: 'Volumen repartido y contorno definido en frente y sienes.',
      mejor: ['afro', 'rizado'],
      g: { part: 'vertical', tipo: 'Desfilado', elev: pila(30, 60, 90, 110, 120, 130, 140),
        guiaElev: 30, dir: 'Perpendicular', acabado: 'Recto', herAcabado: 'Máquina',
        resultado: 'Forma con movimiento y línea de contorno nítida.',
        notas: [
          'Se divide en radiales y se trabaja en seco, sin estirar.',
          'La guía baja marca hasta dónde llega el volumen inferior.',
          'Las capas altas se elevan por encima de 90° para aligerar la coronilla.',
          'Perfilado de frente, sienes y nuca a máquina, con la línea decidida antes.'
        ] }
    },

    /* ── Cortes de moda ── */
    {
      id: 'blunt', fam: 'moda', n: 'Blunt cut',
      d: 'Borde absolutamente cerrado, sin una punta desfilada.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural',
        acabado: 'Recto', resultado: 'Línea maciza que refleja la luz entera.',
        notas: [
          'Secciones finas, de medio centímetro: el blunt se ve en la limpieza.',
          'Guía en la nuca a 0°, con el cabello húmedo y sin tensión desigual.',
          'Cada mecha llega a la guía y se corta recta, sin deslizar la tijera.',
          'Ni una punta se abre: el acabado es la misma línea, repasada en seco.'
        ] }
    },
    {
      id: 'italian_bob', fam: 'moda', n: 'Italian bob',
      d: 'Bob a la mandíbula con las puntas hacia dentro y algo de cuerpo.',
      mejor: ['liso', 'ondulado'],
      g: { part: 'horizontal', tipo: 'Diagonal', elev: pila(0, 0, 15, 30, 45, 55, 60),
        dir: 'Hacia el rostro', acabado: 'Punteado',
        resultado: 'Puntas que giran hacia dentro y raíz con cuerpo.',
        notas: [
          'Raya media y cuatro secciones; la mandíbula es el tope.',
          'Guía en la nuca ligeramente más corta: el bob italiano sube por detrás.',
          'Capas internas suaves para que la punta gire, sin abrir el borde.',
          'Se seca con cepillo redondo y se comprueba el giro antes de rematar.'
        ] }
    },
    {
      id: 'bixie', fam: 'moda', n: 'Bixie',
      d: 'Entre bob y pixie: corto con textura y flequillo largo.',
      mejor: ['liso', 'ondulado', 'fino'],
      g: { part: 'vertical', tipo: 'Punteado', elev: pila(20, 45, 70, 90, 100, 110, 120),
        guiaElev: 20, dir: 'Perpendicular', acabado: 'Punteado',
        resultado: 'Corto con movimiento y flequillo que enmarca.',
        notas: [
          'Herradura y triángulo frontal: el flequillo se decide antes de cortar.',
          'Guía en la nuca a 20°, con largo suficiente para peinar.',
          'Se vacía la coronilla por encima de 90° y se puntea la transición.',
          'Flequillo largo, deslizado hacia el pómulo, y contorno en seco.'
        ] }
    },
    {
      id: 'french_bob', fam: 'moda', n: 'French bob',
      d: 'Bob corto a la altura de la barbilla, con flequillo recto.',
      mejor: ['liso_extremo', 'liso', 'fino'],
      g: { part: 'horizontal', tipo: 'Recto', elev: plana(0), dir: 'Caída natural',
        acabado: 'Punteado', resultado: 'Bob corto y flequillo en su sitio.',
        notas: [
          'Cuatro secciones y triángulo frontal marcado desde el principio.',
          'Guía a la altura de la barbilla, ni un dedo más abajo.',
          'Todo el bob en horizontal, con el borde cerrado.',
          'Flequillo recto a media frente y esquinas apenas punteadas.'
        ] }
    }
  ];

  /* Cada corte se completa con sus pasos al cargarse. */
  var PORID = {};
  C.forEach(function (c) {
    c.g = c.g || {};
    c.g.n = c.n;
    PORID[c.id] = c;
  });

  function cabelloDe(id) {
    for (var i = 0; i < CABELLOS.length; i++) if (CABELLOS[i].id === id) return CABELLOS[i];
    return CABELLOS[1];
  }

  var API = {
    familias: function () { return FAMILIAS.slice(); },

    cabellos: function () { return CABELLOS.slice(); },

    lista: function (fam) {
      return C.filter(function (c) { return !fam || c.fam === fam; })
        .map(function (c) {
          return { id: c.id, n: c.n, fam: c.fam, d: c.d, mejor: c.mejor.slice() };
        });
    },

    get: function (id) {
      var c = PORID[id];
      if (!c) return null;
      return { id: c.id, n: c.n, fam: c.fam, d: c.d, mejor: c.mejor.slice() };
    },

    /* ¿Le va este corte a este cabello? Para avisar sin prohibir. */
    encaja: function (corteId, cabelloId) {
      var c = PORID[corteId];
      return !!(c && c.mejor.indexOf(cabelloId) >= 0);
    },

    reglaDe: function (cabelloId) {
      var t = cabelloDe(cabelloId);
      return { id: t.id, n: t.n, part: t.part, seco: t.seco, aviso: t.aviso, corto: t.corto };
    },

    /* La guía completa, lista para asignar a <guias-3d>. La partición de los
       pasos de corte la decide el cabello, no el corte: es la regla que evita
       el escalón en liso extremo y el salto de onda en ondulado. */
    guiaDe: function (corteId, cabelloId) {
      var c = PORID[corteId];
      if (!c) return null;
      var t = cabelloDe(cabelloId);
      var pasos = juego(c.g).map(function (ps, j) {
        var q = {};
        for (var k in ps) if (ps.hasOwnProperty(k)) q[k] = ps[k];
        if (q.corte) {
          q.particionB = t.part;
          q.particionF = t.part;
          q.observaciones = t.aviso;
        } else {
          q.observaciones = t.seco ? 'Cabello seco y definido: no se peina antes de cortar.' : '';
        }
        delete q.corte;
        q.titulo = q.titulo;
        q.texto = (q.texto || '') + (q.corte === false ? '' : '');
        return q;
      });
      /* El primer paso lleva el nombre del corte y la regla, que es lo que se
         lee en la portada de la lámina y se narra en el vídeo. */
      pasos[0].texto = c.n + '. ' + c.d + ' ' + pasos[0].texto;
      return {
        nombre: c.n + ' · ' + t.n,
        autora: '',
        tecnica: c.n + ' — ' + t.corto,
        refs: { orejas: true, media: true, cresta: true, diagonal: false },
        pasos: pasos,
        aviso: t.aviso,
        encaja: c.mejor.indexOf(t.id) >= 0
      };
    }
  };

  window.EU_CORTES = API;
})();
