/* ═════════════════════════════════════════════════════════════════
   CEREBRO DE TÉCNICAS · el motor de conocimiento (Bloque 6)
   ─────────────────────────────────────────────────────────────────
   Una técnica se escribe UNA VEZ, aquí. De ese mismo registro salen:

     · la ficha técnica editable
     · las divisiones que dibuja el maniquí
     · la animación paso a paso
     · la explicación en pantalla
     · la narración (texto por paso, para leer o para grabar)
     · la evaluación de repaso, siempre formativa

   Ningún módulo copia datos: todos preguntan al Cerebro. Si se cambia
   un tiempo, una fórmula o un paso, cambian todas las salidas a la vez.

   NO confundir con b6_folleto_cerebro.js, que redacta textos comerciales.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE = 'eu_cerebro_v1';

  /* ══════════════════════════════════════════════════════════════
     1 · CATÁLOGO DE DIVISIONES DEL MANIQUÍ
     Cada división es una línea o una zona con nombre propio de oficio.
     El maniquí las dibuja; la técnica solo dice cuáles necesita.
     tipo: 'h' horizontal · 'v' vertical · 'd' diagonal · 'z' zona
     y/x van de 0 a 1 sobre la caja de la cabeza.
     ══════════════════════════════════════════════════════════════ */
  var DIVISIONES = {
    orejas:     { n: 'Oreja a oreja', tipo: 'h', y: 0.42, d: 'De lóbulo a lóbulo pasando por la coronilla. Separa la parte de arriba de la nuca.' },
    media:      { n: 'Línea media', tipo: 'v', x: 0.50, d: 'Del centro de la frente al centro de la nuca. Divide en dos mitades iguales.' },
    parietal:   { n: 'Cresta parietal', tipo: 'h', y: 0.30, d: 'Donde la cabeza deja de subir y empieza a caer. Marca el límite del casquete.' },
    frontal:    { n: 'Zona frontal', tipo: 'z', y: 0.12, d: 'De la línea de nacimiento a la cresta parietal. Es la que se ve de frente.' },
    coronilla:  { n: 'Coronilla', tipo: 'z', y: 0.24, d: 'El remolino y su alrededor. Manda en la caída de todo el peinado.' },
    nuca:       { n: 'Nuca', tipo: 'z', y: 0.72, d: 'Por debajo de la oreja a oreja. Se trabaja primero porque es la más fría.' },
    laterales:  { n: 'Laterales', tipo: 'z', y: 0.50, d: 'Las dos zonas de las sienes hacia la oreja.' },
    diagAdel:   { n: 'Diagonal adelante', tipo: 'd', k: 1, d: 'La partición cae hacia la cara. Acumula peso al frente.' },
    diagAtras:  { n: 'Diagonal atrás', tipo: 'd', k: -1, d: 'La partición cae hacia la nuca. Alarga y descarga la cara.' },
    cuatro:     { n: 'Cuatro secciones', tipo: 'z', d: 'Media + oreja a oreja: los cuatro cuartos clásicos del químico.' },
    nueve:      { n: 'Nueve secciones', tipo: 'z', d: 'Cuatro cuartos más franja central: el mapa del alisado.' },
    mediaLuna:  { n: 'Media luna', tipo: 'h', y: 0.18, d: 'Un arco a un centímetro del nacimiento. Se aparta para no quemar la línea.' },
    herradura:  { n: 'Herradura', tipo: 'z', y: 0.34, d: 'Banda de contorno de sien a sien por detrás de la coronilla. Fuera se trabaja, dentro se reserva.' },
    ladrillo:   { n: 'Ladrillo', tipo: 'z', y: 0.55, d: 'Filas con las mechas desplazadas media anchura. Cada fila tapa el hueco de la anterior.' },
    espiga:     { n: 'Espiga', tipo: 'z', y: 0.60, d: 'Mechas cortas en diagonal que invierten el sentido en cada fila. Funde en cabello muy poblado.' },
    corteV:     { n: 'Corte en V', tipo: 'z', y: 0.78, d: 'Las dos mitades bajan en diagonal hasta juntarse en la línea media. Deja punta en la nuca.' },
    perfil:     { n: 'Perfil de la cara', tipo: 'z', d: 'La franja que enmarca el rostro, de patilla a patilla.' },
    mapeoCeja:  { n: 'Mapeo de tres líneas', tipo: 'z', d: 'Inicio, punto alto y final, medidos desde el ala de la nariz.' },
    zonasOjo:   { n: 'Cinco zonas del ojo', tipo: 'z', d: 'Lagrimal, interna, centro, externa y rabillo.' }
  };

  /* ══════════════════════════════════════════════════════════════
     2 · FAMILIAS
     ══════════════════════════════════════════════════════════════ */
  var FAMILIAS = [
    { id: 'color',       n: 'Colorimetría',        ico: '🎨', lienzo: 'color' },
    { id: 'mechas',      n: 'Mechas',              ico: '🧵', lienzo: 'color' },
    { id: 'hidratacion', n: 'Hidratación',         ico: '💧', lienzo: 'color' },
    { id: 'queratina',   n: 'Queratina y alisado', ico: '🪮', lienzo: 'color' },
    { id: 'quimicos',    n: 'Químicos',            ico: '⚗️', lienzo: 'color' },
    { id: 'cabello',     n: 'Técnicas de cabello', ico: '💨', lienzo: 'color' },
    { id: 'cejas',       n: 'Cejas',               ico: '🪶', lienzo: 'cejas' },
    { id: 'pestanas',    n: 'Pestañas',            ico: '👁', lienzo: 'pestanas' },
    { id: 'maquillaje',  n: 'Maquillaje',          ico: '💄', lienzo: 'cejas' },
    /* "Hacer" no es una técnica de salón: es cómo se aprende una técnica. Sirve
       para cualquier materia, y por eso comparte estructura con las demás — la
       misma ficha, los mismos pasos cronometrados y el mismo repaso. */
    { id: 'hacer',       n: 'Hacer y aprender',    ico: '🧠', lienzo: 'color', universal: true }
  ];

  /* Los nombres de las cinco fases cambian con la familia: en el salón son
     divisiones y fórmula; aprendiendo son preparación y modelo. */
  var FASES_N = {
    normal: { divisiones: 'Divisiones', formula: 'Fórmula y mezcla', aplicacion: 'Aplicación', tiempo: 'Exposición', cierre: 'Cierre' },
    hacer: { divisiones: 'Preparación', formula: 'Modelo', aplicacion: 'Práctica', tiempo: 'Tiempo', cierre: 'Comprobación' }
  };

  /* ══════════════════════════════════════════════════════════════
     3 · LAS TÉCNICAS
     Estructura de cada una:
       id, fam, n (nombre), resumen
       ficha  → los campos que la alumna entrega
       divs   → ids del catálogo de divisiones
       pasos  → [{ t título · n narración · e error común · d segundos · fase }]
       repaso → [{ p pregunta · o opciones · c correcta · x por qué }]
     ══════════════════════════════════════════════════════════════ */
  function f(o) {
    return {
      exalumna: o.exalumna || '', negocio: o.negocio || '', fecha: o.fecha || '',
      formula: o.formula || '', proporciones: o.proporciones || '',
      productos: o.productos || [], cantidades: o.cantidades || '',
      tiempos: o.tiempos || '', temperaturas: o.temperaturas || '',
      herramientas: o.herramientas || [], observaciones: o.observaciones || '',
      seguridad: o.seguridad || [],
      errores: o.errores || [], recomendaciones: o.recomendaciones || [],
      enlace: o.enlace || ''
    };
  }

  var TECNICAS = [

    /* ─────────────── COLORIMETRÍA ─────────────── */
    {
      id: 'color_raiz', fam: 'color', n: 'Retoque de raíz',
      resumen: 'Solo el crecimiento: dos centímetros desde el cuero cabelludo, sin pisar el color anterior.',
      divs: ['cuatro', 'orejas', 'media'],
      ficha: f({
        formula: '6.0 + 6.3 (1:1 entre tonos) · oxidante 20 vol (6 %)',
        proporciones: '1 de color : 1 de oxidante',
        productos: ['Tinte en crema 6.0', 'Tinte en crema 6.3', 'Oxidante 20 vol', 'Champú post-color de pH ácido'],
        cantidades: '30 g de color + 30 ml de oxidante para melena media',
        tiempos: '35 min desde la última pincelada. Con canas, los 35 completos.',
        temperaturas: 'Ambiente. Sin calor añadido.',
        herramientas: ['Bol no metálico', 'Pincel de 4 cm', 'Peine de cola', 'Pinzas de pico', 'Guantes'],
        seguridad: ['Prueba de sensibilidad 48 h antes: el tinte de oxidación lleva PPD y es obligatoria', 'Nunca sobre cuero cabelludo con heridas, irritación o quemadura reciente', 'Bol y utensilios no metálicos: el metal descompone el peróxido'],
        errores: ['Montar el producto sobre el largo ya teñido y oscurecerlo', 'Empezar por el frente, que es la zona más caliente', 'Dejar la raíz sin cubrir en la línea de la cara', 'Mezclar 1:1,5 un tinte de crema: sale líquido, chorrea y no cubre la cana'],
        recomendaciones: ['Trabajar de nuca hacia el frente', 'Secciones de 1 cm para que entre bien', 'Cronómetro en la última pincelada, no en la primera']
      }),
      pasos: [
        { t: 'Cuatro secciones', n: 'Divide en cuatro con la línea media y la de oreja a oreja. Sujeta cada cuarto con su pinza.', e: 'Secciones torcidas: el color entra desigual.', d: 4, fase: 'divisiones' },
        { t: 'Mezcla', n: 'Treinta gramos de color con otros treinta de oxidante veinte volúmenes: uno a uno. Bate hasta crema lisa.', e: 'Bol metálico: oxida la mezcla antes de tiempo.', d: 4, fase: 'formula' },
        { t: 'Nuca primero', n: 'Empieza por la nuca, que es la zona más fría, en secciones de un centímetro.', e: 'Arrancar por el frente y sobreprocesar la cara.', d: 6, fase: 'aplicacion' },
        { t: 'Solo el crecimiento', n: 'Dos centímetros desde el cuero cabelludo. No invadas el largo teñido.', e: 'Pisar el color viejo y crear una banda oscura.', d: 6, fase: 'aplicacion' },
        { t: 'Exposición', n: 'Treinta y cinco minutos desde la última pincelada, a temperatura ambiente.', e: 'Contar desde la primera pincelada y quedarte corta.', d: 5, fase: 'tiempo' },
        { t: 'Emulsión y lavado', n: 'Emulsiona con agua tibia, aclara y lava con champú post-color.', e: 'Aclarar sin emulsionar: quedan restos en la línea del nacimiento.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Desde dónde se cuentan los 35 minutos?', o: ['Desde la primera pincelada', 'Desde la última pincelada', 'Desde que se mezcla el color'], c: 1, x: 'La última mecha aplicada es la que menos tiempo lleva. Si cuentas desde la primera, esa zona se queda corta.' },
        { p: '¿Por qué se empieza por la nuca?', o: ['Porque es más fácil de alcanzar', 'Porque es la zona más fría y necesita más tiempo', 'Porque tiene menos canas'], c: 1, x: 'El calor del cuerpo sale por la coronilla y el frente. La nuca procesa más lento, así que entra primero.' }
      ]
    },
    {
      id: 'color_global', fam: 'color', n: 'Color global',
      resumen: 'Raíz, medios y puntas del mismo tono, en un solo servicio.',
      divs: ['cuatro', 'orejas', 'media'],
      ficha: f({
        formula: '7.0 · oxidante 20 vol (6 %)',
        proporciones: '1 : 1 · con 1:1,5 sólo si el fabricante lo indica para su gama',
        productos: ['Tinte 7.0', 'Oxidante 20 vol', 'Protector de cutícula'],
        cantidades: '60 g + 60 ml para melena por debajo del hombro',
        tiempos: 'Cabello virgen: 10 min en el largo, luego raíz y 30 min más. Sobre color ya hecho, al revés: raíz 25 min y el largo los 10 últimos.',
        temperaturas: 'Ambiente.',
        herramientas: ['Bol', 'Pincel', 'Peine de cola', 'Pinzas'],
        errores: ['Aplicar raíz y largo a la vez: la raíz sale más clara por el calor', 'Cantidad corta y zonas sin cubrir'],
        seguridad: ['Prueba de sensibilidad 48 h antes', 'Sin calor añadido: el 20 vol ya trabaja a temperatura de cuero cabelludo'],
        recomendaciones: ['Largo primero si está virgen, raíz al final', 'Sobre color ya hecho, raíz primero: el largo sólo refresca', 'Saturar bien: el color no estira']
      }),
      pasos: [
        { t: 'Cuatro secciones', n: 'Divide en cuatro cuartos limpios.', e: 'Secciones desiguales.', d: 4, fase: 'divisiones' },
        { t: 'Medios y puntas', n: 'Aplica primero de medios a puntas y deja actuar diez minutos.', e: 'Tocar la raíz ahora: se aclara de más.', d: 6, fase: 'aplicacion' },
        { t: 'Raíz', n: 'Baja a la raíz y satura los dos primeros centímetros.', e: 'Escatimar producto en la línea de la cara.', d: 5, fase: 'aplicacion' },
        { t: 'Exposición', n: 'Treinta minutos más desde la última pincelada.', e: 'Añadir calor sin necesidad.', d: 5, fase: 'tiempo' },
        { t: 'Cierre', n: 'Emulsiona, aclara y sella con acidificante.', e: 'Saltarse el acidificante y perder brillo.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: 'En una melena virgen, ¿qué se aplica primero?', o: ['La raíz', 'Los medios y puntas', 'Todo a la vez'], c: 1, x: 'La raíz procesa más rápido por el calor del cuero cabelludo. Va la última para que todo termine parejo.' }
      ]
    },
    {
      id: 'color_balayage', fam: 'color', n: 'Balayage',
      resumen: 'Raíz intacta y aclarado barrido de medios a puntas, con el porcentaje que decida la lámina.',
      divs: ['orejas', 'media', 'diagAtras', 'nuca'],
      pintado: { desde: 0.42, ajustable: true, min: 0.20, max: 0.90 },
      ficha: f({
        formula: 'Decolorante en polvo + oxidante 20 vol + 1 medida de plex',
        proporciones: '1 : 2',
        productos: ['Decolorante en polvo sin amoníaco', 'Oxidante 20 vol', 'Protector de enlaces', 'Matizador violeta'],
        cantidades: '40 g + 80 ml',
        tiempos: '25 a 45 min a ojo, comprobando cada 10',
        temperaturas: 'Aire libre, sin papel ni calor.',
        herramientas: ['Tabla de balayage', 'Pincel de lengua', 'Peine de cerda', 'Pinzas'],
        seguridad: ['Mascarilla al mezclar el polvo decolorante', 'Plex dentro de la mezcla', 'Nada de calor: al aire, como pide la técnica'],
        errores: ['Empezar el barrido demasiado alto y perder la raíz natural', 'Cargar producto en el borde y marcar una línea dura', 'Tapar con papel: se pierde el efecto barrido'],
        recomendaciones: ['Menos producto en el arranque, más en la punta', 'Comprobar el levantamiento cada diez minutos', 'Matizar siempre después']
      }),
      pasos: [
        { t: 'Oreja a oreja', n: 'Separa el casquete de la nuca con la línea de oreja a oreja.', e: 'Dejar la línea torcida y desnivelar el barrido.', d: 4, fase: 'divisiones' },
        { t: 'Altura de arranque', n: 'Decide desde qué punto arranca el barrido. Cuanto más bajo, más natural.', e: 'Arrancar por encima del cuarenta por ciento sin querer.', d: 5, fase: 'divisiones' },
        { t: 'Mechón sobre tabla', n: 'Coloca el mechón en la tabla y barre con la punta del pincel.', e: 'Aplastar el pincel y cargar el borde.', d: 7, fase: 'aplicacion' },
        { t: 'Degradado', n: 'Poco producto arriba, saturado en la punta. Sin bordes duros.', e: 'Línea dura en el arranque.', d: 6, fase: 'aplicacion' },
        { t: 'Al aire', n: 'Deja actuar al aire y comprueba el levantamiento cada diez minutos.', e: 'Envolver en papel y sobreprocesar.', d: 5, fase: 'tiempo' },
        { t: 'Matiz', n: 'Aclara y matiza en función del fondo de decoloración.', e: 'Saltarse el matizado y quedarse en naranja.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Por qué el balayage se deja al aire?', o: ['Para ahorrar papel', 'Para que el degradado quede suave y sin línea', 'Para que procese más rápido'], c: 1, x: 'El papel concentra calor y marca el borde. Al aire, el aclarado se difumina solo.' },
        { p: 'Un arranque al 30 % da un resultado…', o: ['Más natural y bajo', 'Más contrastado y alto', 'Igual que al 70 %'], c: 0, x: 'Cuanto más bajo el porcentaje, más lejos de la raíz empieza el aclarado y más discreto se ve.' }
      ]
    },
    {
      id: 'color_babylights', fam: 'color', n: 'Babylights',
      resumen: 'Mechas muy finas desde la raíz, del grosor de un cabello de niño.',
      divs: ['orejas', 'media', 'parietal', 'diagAdel'],
      ficha: f({
        formula: 'Decolorante + oxidante 20 vol (6 %) + plex',
        proporciones: '1 : 1,5 · bajo papel la mezcla tiene que quedar espesa',
        productos: ['Decolorante', 'Oxidante 20 vol', 'Protector de enlaces', 'Papel de aluminio', 'Matizador'],
        cantidades: '50 g + 75 ml',
        tiempos: '30 a 40 min bajo papel, comprobando el primer papel a los 25',
        temperaturas: 'Ambiente. El papel ya concentra calor.',
        herramientas: ['Peine de cola fina', 'Aluminio precortado', 'Pincel estrecho'],
        seguridad: ['Mascarilla al mezclar', 'Plex en la mezcla', 'Bajo papel no se cronometra: se abre y se mira'],
        errores: ['Tomar mechas gruesas: deja de ser babylight', 'Doblar mal el papel y manchar la sección de al lado', 'Mezcla líquida bajo papel: mancha la base'],
        recomendaciones: ['Tejido muy fino con la cola del peine', 'Empezar por la nuca y subir en ladrillo']
      }),
      pasos: [
        { t: 'Secciones', n: 'Divide en cuatro y empieza por la nuca.', e: 'Perder el orden y repetir zonas.', d: 4, fase: 'divisiones' },
        { t: 'Tejido fino', n: 'Con la cola del peine, teje mechas finísimas dentro de la sección.', e: 'Mechas gruesas: el efecto se ve rayado.', d: 6, fase: 'divisiones' },
        { t: 'Papel', n: 'Coloca el papel en la raíz y aplica de raíz a punta sin desbordar.', e: 'Producto fuera del papel.', d: 7, fase: 'aplicacion' },
        { t: 'Ladrillo', n: 'Sube en ladrillo para que no se marquen columnas.', e: 'Alinear los papeles y crear rayas verticales.', d: 5, fase: 'aplicacion' },
        { t: 'Exposición y matiz', n: 'De treinta a cuarenta minutos, después aclara y matiza.', e: 'Abrir papeles a destiempo.', d: 5, fase: 'tiempo' }
      ],
      repaso: [
        { p: '¿Qué define a un babylight?', o: ['El tono elegido', 'El grosor mínimo de la mecha', 'El oxidante'], c: 1, x: 'Lo que crea el efecto sol es que la mecha sea casi invisible por sí sola.' }
      ]
    },
    {
      id: 'color_sombre', fam: 'color', n: 'Sombré',
      resumen: 'Raíz fundida en degradado suave hacia las puntas, sin corte visible.',
      divs: ['orejas', 'media', 'nuca'],
      pintado: { desde: 0.35, ajustable: true, min: 0.25, max: 0.60 },
      ficha: f({
        formula: 'Decolorante suave + 20 vol · fundido con 9.1 + 10 vol',
        proporciones: '1 : 2 el aclarado · 1 : 1,5 el fundido',
        productos: ['Decolorante', 'Oxidante 20 vol', 'Oxidante 10 vol', 'Tinte 9.1'],
        cantidades: 'Aclarado 40 g + 80 ml de 20 vol · fundido 30 g de 9.1 + 45 ml de 10 vol',
        tiempos: '30 min de aclarado, 15 de fundido',
        temperaturas: 'Ambiente.',
        herramientas: ['Pincel', 'Peine de cerda', 'Tabla'],
        errores: ['Dejar la transición marcada', 'Subir el aclarado hasta la raíz'],
        recomendaciones: ['Peinar la transición con cerda mientras procesa', 'Fundir siempre al final']
      }),
      pasos: [
        { t: 'Divisiones', n: 'Oreja a oreja y línea media.', e: 'Nuca sin separar.', d: 4, fase: 'divisiones' },
        { t: 'Aclarado', n: 'Arranca a un tercio de la longitud y sube el producto barriendo.', e: 'Empezar demasiado arriba.', d: 6, fase: 'aplicacion' },
        { t: 'Fundido', n: 'Peina la zona de unión con cerda para romper el borde.', e: 'No tocar la transición y dejar un escalón.', d: 6, fase: 'aplicacion' },
        { t: 'Exposición', n: 'Treinta minutos, comprobando el fondo.', e: 'Pasarse y llegar a amarillo pálido.', d: 5, fase: 'tiempo' },
        { t: 'Tono final', n: 'Aclara y aplica el fundido con diez volúmenes quince minutos.', e: 'Saltar el fundido.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: 'La diferencia entre sombré y ombré es…', o: ['El tono', 'La suavidad de la transición', 'El oxidante'], c: 1, x: 'El sombré funde; el ombré marca. Es la misma idea con distinto acabado.' }
      ]
    },

    /* ─────────────── MECHAS ─────────────── */
    {
      id: 'mechas_aluminio', fam: 'mechas', n: 'Mechas con papel de aluminio',
      resumen: 'Tejido clásico en papel, en ladrillo, de nuca a frontal.',
      divs: ['cuatro', 'orejas', 'media', 'parietal'],
      ficha: f({
        formula: 'Decolorante en polvo + oxidante 20 vol (6 %) + plex · 30 vol sólo en cabello resistente y fuera de la raíz',
        proporciones: '1 : 1,5',
        productos: ['Decolorante en polvo', 'Oxidante 20 vol', 'Aluminio', 'Protector de enlaces'],
        cantidades: '60 g + 90 ml',
        tiempos: '35 a 45 min bajo papel. El papel guarda calor y acelera: se mira, no se cronometra.',
        temperaturas: 'Ambiente. Nunca secador sobre el papel.',
        herramientas: ['Peine de cola', 'Aluminio precortado', 'Pincel de 3 cm', 'Pinzas'],
        seguridad: ['El polvo decolorante se respira: mascarilla al mezclar y bol fuera de la cara', 'Nunca decolorar sobre henna o tintes con sales metálicas: reacciona y puede hervir', 'Plex en la mezcla, no después: protege durante el proceso'],
        errores: ['Papel mal doblado y producto que corre', 'Mezclar 1:2 bajo papel: la mezcla corre y mancha la base', 'Mechas alineadas que dejan columnas', 'Oxidante alto en cuero cabelludo sensible'],
        recomendaciones: ['Doblar el borde inferior dos dedos', 'Ladrillo siempre', 'Comprobar el primer papel que se puso']
      }),
      pasos: [
        { t: 'Cuatro secciones', n: 'Cuartea la cabeza con la media y la oreja a oreja.', e: 'Cuartos desiguales.', d: 4, fase: 'divisiones' },
        { t: 'Tejido', n: 'Toma la sección y teje con la cola del peine, grosor parejo.', e: 'Mezclar grosores y ver el resultado a rayas.', d: 6, fase: 'divisiones' },
        { t: 'Colocar el papel', n: 'Papel pegado a la raíz, mecha encima, aplica sin desbordar.', e: 'Producto fuera y manchas en la sección vecina.', d: 7, fase: 'aplicacion' },
        { t: 'Doblar', n: 'Dobla el borde inferior y los laterales. El papel tiene que aguantar solo.', e: 'Doblez flojo que se abre al peinar.', d: 5, fase: 'aplicacion' },
        { t: 'Ladrillo', n: 'La fila siguiente va desplazada media mecha.', e: 'Alinear filas y crear columnas.', d: 5, fase: 'aplicacion' },
        { t: 'Control', n: 'Comprueba el primer papel a los treinta minutos.', e: 'Abrir el último en vez del primero.', d: 5, fase: 'tiempo' },
        { t: 'Aclarado y matiz', n: 'Retira, aclara, lava y matiza según el fondo.', e: 'Matizar sin secar la toalla.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuál se comprueba primero?', o: ['El último papel colocado', 'El primero', 'Cualquiera'], c: 1, x: 'El primero lleva más minutos. Es el que marca el punto de aclarado.' },
        { p: '¿Para qué sirve el ladrillo?', o: ['Para gastar menos papel', 'Para que no se marquen columnas', 'Para ir más rápido'], c: 1, x: 'Si las mechas se alinean en vertical, el pelo cae con rayas visibles.' }
      ]
    },
    {
      id: 'mechas_gorro', fam: 'mechas', n: 'Mechas con gorro',
      resumen: 'El clásico: gorro perforado, ganchillo y aclarado sin tocar el cuero cabelludo.',
      divs: ['perfil', 'coronilla', 'nuca'],
      ficha: f({
        formula: 'Decolorante + oxidante 20 vol',
        proporciones: '1 : 2',
        productos: ['Gorro de mechas', 'Ganchillo', 'Decolorante', 'Oxidante 20 vol'],
        cantidades: '40 g + 80 ml',
        tiempos: '25 a 40 min',
        temperaturas: 'Ambiente. Se puede tapar con gorro térmico.',
        herramientas: ['Gorro perforado', 'Aguja de ganchillo', 'Pincel', 'Algodón perimetral'],
        seguridad: ['Algodón en todo el contorno: el decolorante que se cuela quema la piel', 'Mascarilla al mezclar el polvo', 'El gorro se retira después de aclarar, nunca antes'],
        errores: ['Sacar demasiado pelo por agujero y perder finura', 'Romper el gorro al tirar', 'Producto que se cuela por un agujero mal cerrado'],
        recomendaciones: ['Peinar bien antes de poner el gorro', 'Sacar más cantidad arriba y menos en la nuca', 'Algodón en el contorno para no manchar']
      }),
      pasos: [
        { t: 'Colocar el gorro', n: 'Ajusta el gorro con el pelo bien peinado y liso.', e: 'Gorro flojo que se mueve al sacar mechas.', d: 5, fase: 'divisiones' },
        { t: 'Sacar mechas', n: 'Con el ganchillo, saca hebras finas. Más densidad arriba, menos en la nuca.', e: 'Sacar mechones gruesos y ver puntos.', d: 7, fase: 'divisiones' },
        { t: 'Aplicar', n: 'Cubre bien todo lo que está fuera del gorro, sin tocar la base.', e: 'Producto que entra por un agujero abierto.', d: 6, fase: 'aplicacion' },
        { t: 'Exposición', n: 'De veinticinco a cuarenta minutos, mirando el fondo.', e: 'Fiarse del reloj sin mirar el pelo.', d: 5, fase: 'tiempo' },
        { t: 'Aclarar con gorro puesto', n: 'Aclara sin quitar el gorro, después retíralo con cuidado.', e: 'Quitar el gorro con producto activo y manchar la base.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuándo se retira el gorro?', o: ['Antes de aclarar', 'Después de aclarar', 'A mitad de exposición'], c: 1, x: 'Si lo quitas antes, el decolorante activo cae sobre la base sin aclarar y mancha.' }
      ]
    },

    /* ─────────────── HIDRATACIÓN ─────────────── */
    {
      id: 'hidra_profunda', fam: 'hidratacion', n: 'Hidratación profunda',
      resumen: 'Agua y activos dentro de la fibra, con calor controlado y sellado final.',
      divs: ['cuatro', 'orejas', 'media'],
      ficha: f({
        formula: 'Mascarilla hidratante + ampolla de ácido hialurónico',
        proporciones: '1 nuez de mascarilla por sección + 1 ampolla',
        productos: ['Champú de pH neutro', 'Mascarilla hidratante', 'Ampolla hialurónico', 'Acidificante final'],
        cantidades: '30 ml de mascarilla por melena media',
        tiempos: '20 min con calor · 5 min de reposo frío',
        temperaturas: 'Vapor o climazón a 40 °C. Nunca por encima de 45 °C.',
        herramientas: ['Vaporizador o climazón', 'Bol', 'Pincel', 'Gorro térmico', 'Peine ancho'],
        errores: ['Aplicar sobre pelo goteando: el agua diluye el activo', 'Calor excesivo que abre la cutícula de más', 'Saltarse el sellado y perder todo lo puesto'],
        recomendaciones: ['Escurrir con toalla antes de aplicar', 'Peinar con púa ancha para repartir', 'Cerrar siempre con acidificante o agua fría']
      }),
      pasos: [
        { t: 'Lavado de apertura', n: 'Lava con champú neutro y escurre bien con la toalla.', e: 'Dejar el pelo chorreando y diluir la mascarilla.', d: 5, fase: 'preparacion' },
        { t: 'Cuatro secciones', n: 'Divide en cuatro para no dejar zonas sin producto.', e: 'Aplicar a bulto y dejar la nuca seca.', d: 4, fase: 'divisiones' },
        { t: 'Aplicar de medios a puntas', n: 'Reparte de medios a puntas y sube hacia la raíz solo si el cuero está seco.', e: 'Saturar la raíz en cuero graso.', d: 6, fase: 'aplicacion' },
        { t: 'Calor', n: 'Veinte minutos con vapor o climazón a cuarenta grados.', e: 'Subir la temperatura pensando que penetra más.', d: 6, fase: 'tiempo' },
        { t: 'Reposo frío', n: 'Cinco minutos sin calor para que la fibra se estabilice.', e: 'Aclarar en caliente y perder el activo.', d: 4, fase: 'tiempo' },
        { t: 'Sellado', n: 'Aclara con agua templada y cierra con acidificante.', e: 'Terminar sin sellar la cutícula.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Por qué se escurre el pelo antes de la mascarilla?', o: ['Para no manchar', 'Porque el agua sobrante diluye el activo', 'Para ir más rápido'], c: 1, x: 'La fibra ya está llena de agua. Si no escurres, el producto no tiene dónde entrar.' },
        { p: 'La temperatura máxima recomendada es…', o: ['40-45 °C', '60 °C', 'La que aguante la clienta'], c: 0, x: 'Por encima de 45 °C la cutícula se abre en exceso y la hidratación se escapa al aclarar.' }
      ]
    },
    {
      id: 'hidra_nutricion', fam: 'hidratacion', n: 'Nutrición con aceites',
      resumen: 'Lípidos para pelo poroso y áspero. No es lo mismo que hidratar.',
      divs: ['cuatro', 'nuca'],
      ficha: f({
        formula: 'Baño de aceites vegetales + mascarilla nutritiva',
        proporciones: '3 partes de mascarilla : 1 de aceite',
        productos: ['Aceite de argán', 'Mascarilla nutritiva', 'Champú sin sulfatos'],
        cantidades: '20 ml de aceite en melena media',
        tiempos: '15 min con calor suave',
        temperaturas: '35 a 40 °C.',
        herramientas: ['Bol', 'Pincel', 'Gorro', 'Peine ancho'],
        errores: ['Nutrir un pelo que lo que necesita es agua', 'Exceso de aceite que apelmaza'],
        recomendaciones: ['Prueba de porosidad antes de decidir', 'Solo de medios a puntas']
      }),
      pasos: [
        { t: 'Diagnóstico', n: 'Prueba de porosidad: si el pelo absorbe rápido y se ve áspero, pide grasa.', e: 'Nutrir cuando falta agua y dejarlo pesado.', d: 5, fase: 'preparacion' },
        { t: 'Secciones', n: 'Cuatro secciones y trabaja de nuca a frente.', e: 'Aplicación desigual.', d: 4, fase: 'divisiones' },
        { t: 'Aplicar', n: 'Solo de medios a puntas, sin tocar el cuero cabelludo.', e: 'Aceite en la raíz: pelo grasiento al día siguiente.', d: 6, fase: 'aplicacion' },
        { t: 'Calor suave', n: 'Quince minutos con gorro y calor bajo.', e: 'Calor fuerte que volatiliza el aceite.', d: 5, fase: 'tiempo' },
        { t: 'Aclarado', n: 'Emulsiona con agua antes de aclarar para arrastrar el exceso.', e: 'Aclarar sin emulsionar y dejar residuo.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: 'Hidratar y nutrir…', o: ['Es lo mismo', 'Hidratar aporta agua, nutrir aporta grasa', 'Nutrir es más suave'], c: 1, x: 'Son necesidades distintas. Un pelo hinchado y sin cuerpo no necesita aceite; necesita proteína o agua bien sellada.' }
      ]
    },

    /* ─────────────── QUERATINA Y ALISADO ─────────────── */
    {
      id: 'quera_alisado', fam: 'queratina', n: 'Alisado de queratina',
      resumen: 'Nueve secciones, mechas de medio centímetro y plancha a la temperatura que pida la fibra.',
      divs: ['nueve', 'orejas', 'media', 'parietal', 'nuca'],
      ficha: f({
        formula: 'Queratina líquida sin formol',
        proporciones: 'Producto puro, sin diluir',
        productos: ['Champú de apertura pH 9', 'Queratina líquida', 'Mascarilla de sellado'],
        cantidades: '80 a 120 ml según densidad',
        tiempos: '40 min de reposo · 8 a 10 pasadas de plancha por mecha',
        temperaturas: 'Fino 180 °C · normal 200 °C · grueso o rizado 220 °C. Decolorado nunca más de 180 °C.',
        herramientas: ['Plancha de titanio con control digital', 'Peine de cola', 'Guantes', 'Mascarilla', 'Pinzas', 'Secador'],
        seguridad: ['Sólo producto sin formol y con ficha de seguridad del fabricante a mano', 'Extracción o ventana abierta durante todo el servicio: el vapor se respira', 'Mascarilla FFP2 y guantes; nunca en embarazadas ni en lactancia', 'Cabello decolorado: máximo 180 °C, y prueba de mecha antes'],
        errores: ['Mechas gruesas: la plancha no sella el interior', 'Misma temperatura para todos los cabellos', 'Saltarse el secado previo y hervir el producto', 'Local sin ventilación'],
        recomendaciones: ['Nueve secciones bien marcadas', 'Medio centímetro de grosor', 'Termómetro real, no el número del mando', 'Extractor o ventana abierta siempre']
      }),
      pasos: [
        { t: 'Champú de apertura', n: 'Dos lavados con champú de pH alto para abrir la cutícula.', e: 'Un solo lavado: la queratina no entra.', d: 5, fase: 'preparacion' },
        { t: 'Nueve secciones', n: 'Cuatro cuartos más la franja central. Sujeta cada una.', e: 'Trabajar sin mapa y repetir zonas.', d: 5, fase: 'divisiones' },
        { t: 'Aplicar', n: 'Mechas de medio centímetro, a un centímetro de la raíz, producto parejo.', e: 'Pegar el producto al cuero cabelludo.', d: 7, fase: 'aplicacion' },
        { t: 'Reposo', n: 'Cuarenta minutos. El producto tiene que entrar antes del calor.', e: 'Planchar con el producto recién puesto.', d: 6, fase: 'tiempo' },
        { t: 'Secado', n: 'Seca al ochenta por ciento con secador y cepillo, sin tirar.', e: 'Planchar sobre pelo húmedo: hierve y se rompe.', d: 6, fase: 'aplicacion' },
        { t: 'Plancha', n: 'De ocho a diez pasadas por mecha, a la temperatura de esa fibra.', e: 'Doscientos veinte grados en pelo decolorado.', d: 8, fase: 'aplicacion' },
        { t: 'Sellado', n: 'Deja enfriar, aclara y aplica mascarilla de sellado.', e: 'Aclarar en caliente.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: 'Cabello decolorado: temperatura máxima de plancha.', o: ['180 °C', '200 °C', '220 °C'], c: 0, x: 'La fibra decolorada ya perdió estructura. Por encima de 180 °C se corta.' },
        { p: '¿Qué grosor debe tener la mecha?', o: ['2 cm', '1 cm', '0,5 cm'], c: 2, x: 'Con más grosor la plancha sella solo la superficie y el interior queda crudo.' },
        { p: '¿Se puede planchar con el pelo húmedo?', o: ['Sí, sella mejor', 'No, el agua hierve dentro de la fibra', 'Solo en pelo grueso'], c: 1, x: 'El vapor interno revienta la cutícula. Siempre seco al 80 % como mínimo.' }
      ]
    },
    {
      id: 'quera_botox', fam: 'queratina', n: 'Botox capilar',
      resumen: 'Relleno de fibra sin alisar. Reduce el frizz y devuelve cuerpo.',
      divs: ['cuatro', 'orejas', 'media'],
      ficha: f({
        formula: 'Mascarilla de relleno con aminoácidos',
        proporciones: 'Puro',
        productos: ['Champú clarificante', 'Botox capilar', 'Sellador'],
        cantidades: '60 a 100 ml',
        tiempos: '30 min de reposo',
        temperaturas: 'Plancha a 180 °C, 4 o 5 pasadas.',
        herramientas: ['Plancha', 'Pincel', 'Peine', 'Secador'],
        seguridad: ['Sin formol: comprobarlo en la ficha del fabricante, no en la etiqueta comercial', 'Ventilación durante el planchado'],
        errores: ['Confundirlo con alisado y prometer pelo liso', 'Exceso de producto que apelmaza'],
        recomendaciones: ['Explicar a la clienta que reduce volumen, no alisa', 'Menos pasadas que en queratina']
      }),
      pasos: [
        { t: 'Clarificar', n: 'Un lavado clarificante para retirar residuos.', e: 'Aplicar sobre siliconas.', d: 5, fase: 'preparacion' },
        { t: 'Secciones', n: 'Cuatro secciones limpias.', e: 'Zonas sin producto.', d: 4, fase: 'divisiones' },
        { t: 'Aplicar', n: 'De medios a puntas y raíz muy ligera.', e: 'Cargar la raíz y aplastar.', d: 6, fase: 'aplicacion' },
        { t: 'Reposo', n: 'Treinta minutos.', e: 'Acortar y no rellenar nada.', d: 5, fase: 'tiempo' },
        { t: 'Sellar', n: 'Seca y sella con cuatro pasadas a ciento ochenta grados.', e: 'Diez pasadas como en queratina.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: 'El botox capilar…', o: ['Alisa como la queratina', 'Rellena y reduce frizz, no alisa', 'Decolora'], c: 1, x: 'Es un tratamiento de relleno. Prometer liso genera una reclamación segura.' }
      ]
    },

    /* ─────────────── QUÍMICOS ─────────────── */
    {
      id: 'quim_permanente', fam: 'quimicos', n: 'Permanente',
      resumen: 'Romper y volver a formar el enlace, con la prueba de rizo mandando sobre el reloj.',
      divs: ['nueve', 'orejas', 'media', 'nuca', 'mediaLuna'],
      ficha: f({
        formula: 'Líquido reductor según porosidad + neutralizante',
        proporciones: 'Puro. Neutralizante puro.',
        productos: ['Reductor n.º 1 (cabello natural) o n.º 2 (poroso)', 'Neutralizante', 'Protector de contorno'],
        cantidades: '1 frasco por servicio',
        tiempos: '10 a 20 min de reducción con prueba de rizo cada 5 · 10 min de neutralizado',
        temperaturas: 'Ambiente. Sin calor.',
        herramientas: ['Bigudíes', 'Papelillos', 'Gomas', 'Algodón', 'Guantes', 'Bol aplicador'],
        seguridad: ['Prueba de alergia 48 h antes y revisión del cuero cabelludo', 'Nunca sobre cabello decolorado por encima del fondo 8: se deshace', 'Algodón en el contorno, cambiado en cuanto se empape', 'El reductor no se aplica sobre piel: si escuece, se aclara'],
        errores: ['Fiarse del reloj y no hacer la prueba de rizo', 'Bigudí con demasiado pelo', 'Gomas apretadas que marcan y rompen', 'Neutralizar sin escurrir'],
        recomendaciones: ['Prueba de rizo cada cinco minutos', 'Algodón en el contorno, cambiado si se empapa', 'Escurrir bien antes de neutralizar', 'Prueba de alergia 48 h antes']
      }),
      pasos: [
        { t: 'Diagnóstico y prueba', n: 'Revisa porosidad y elige el número de reductor. Prueba de alergia hecha.', e: 'Usar el número uno en pelo poroso.', d: 6, fase: 'preparacion' },
        { t: 'Nueve secciones', n: 'Marca las nueve secciones y la media luna del contorno.', e: 'Montar bigudíes sin mapa.', d: 5, fase: 'divisiones' },
        { t: 'Montaje', n: 'Bigudíes con papelillo, sin exceso de pelo y con la goma sin marcar.', e: 'Goma apretada que corta la mecha.', d: 8, fase: 'aplicacion' },
        { t: 'Reducción', n: 'Aplica el reductor bigudí por bigudí y protege el contorno con algodón.', e: 'Algodón empapado sin cambiar: quemadura.', d: 7, fase: 'aplicacion' },
        { t: 'Prueba de rizo', n: 'Cada cinco minutos abre un bigudí y mira la ese. El pelo manda.', e: 'Esperar veinte minutos sin mirar.', d: 6, fase: 'tiempo' },
        { t: 'Neutralizar', n: 'Aclara diez minutos, escurre a fondo y neutraliza otros diez.', e: 'Neutralizar con el pelo goteando.', d: 6, fase: 'cierre' },
        { t: 'Retirar', n: 'Quita bigudíes sin estirar y aclara.', e: 'Tirar del rizo recién formado.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Qué manda para saber si el rizo está listo?', o: ['El reloj', 'La prueba de rizo', 'La ficha del producto'], c: 1, x: 'Cada cabello reacciona distinto. La ese formada es la única señal fiable.' },
        { p: '¿Por qué se escurre antes de neutralizar?', o: ['Para gastar menos producto', 'Porque el agua diluye el neutralizante', 'Para secar más rápido'], c: 1, x: 'Si el neutralizante se diluye, el enlace no vuelve a cerrar y el rizo se cae en días.' }
      ]
    },
    {
      id: 'quim_decoloracion', fam: 'quimicos', n: 'Decoloración global',
      resumen: 'Levantar el pigmento con control de fondo y protección de enlaces.',
      divs: ['cuatro', 'orejas', 'media', 'nuca', 'mediaLuna'],
      ficha: f({
        formula: 'Decolorante en polvo + oxidante 20 vol (6 %) en raíz · 30 vol sólo de medios a puntas · plex en la mezcla',
        proporciones: '1 : 2 fuera de la raíz · 1 : 1,5 en raíz, más espeso · dos boles, no uno',
        productos: ['Decolorante', 'Oxidante 20 vol', 'Protector de enlaces', 'Matizador'],
        cantidades: 'Largos 60 g + 120 ml de 30 vol · raíz 30 g + 45 ml de 20 vol, en bol aparte',
        tiempos: 'Hasta el fondo que pida el tono final, comprobando cada 10 min. Nunca más de 50 min de reloj.',
        temperaturas: 'Ambiente. Nada de calor.',
        herramientas: ['Bol', 'Pincel', 'Peine', 'Guantes', 'Pinzas'],
        seguridad: ['Mascarilla al mezclar el polvo y ventilación en la sala', 'Nada de calor: el secador sobre decolorante quema el cuero cabelludo', 'Sobre henna o sales metálicas, no se decolora', 'Si la clienta refiere escozor, se aclara: el picor no es normal'],
        errores: ['Empezar por la raíz en cabello virgen', '40 vol en cuero cabelludo: nunca, y 30 sólo fuera de la raíz', 'Oxidante alto para ganar tiempo', 'No proteger enlaces y romper la fibra'],
        recomendaciones: ['Medios y puntas primero, raíz al final', 'Comprobar el fondo, no el reloj', 'Plex siempre en la mezcla']
      }),
      pasos: [
        { t: 'Diagnóstico', n: 'Mira el fondo natural y el estado de la fibra. Prueba de mechón.', e: 'Saltarse la prueba de mechón.', d: 6, fase: 'preparacion' },
        { t: 'Cuatro secciones', n: 'Cuartea y protege el contorno.', e: 'Sin media luna: se quema la línea.', d: 4, fase: 'divisiones' },
        { t: 'Medios y puntas', n: 'Aplica primero lejos de la raíz, en secciones finas.', e: 'Raíz primero: se aclara de más.', d: 7, fase: 'aplicacion' },
        { t: 'Raíz al final', n: 'Baja a la raíz cuando el largo lleve avanzado.', e: 'Banda clara en la raíz.', d: 6, fase: 'aplicacion' },
        { t: 'Control de fondo', n: 'Cada diez minutos limpia un mechón y mira el color real.', e: 'Fiarse del reloj.', d: 6, fase: 'tiempo' },
        { t: 'Aclarar y matizar', n: 'Aclara, lava con pH ácido y matiza el fondo.', e: 'Matizar sin bajar el pH.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: 'En cabello virgen, ¿por dónde se empieza?', o: ['Por la raíz', 'Por medios y puntas', 'Da igual'], c: 1, x: 'El calor del cuero cabelludo acelera la raíz. Si va primero, termina mucho más clara.' }
      ]
    },

    /* ─────────────── TÉCNICAS DE CABELLO ─────────────── */
    {
      id: 'cab_secado', fam: 'cabello', n: 'Secado con cepillo',
      resumen: 'Brushing por secciones, boquilla dirigida y aire frío para fijar.',
      divs: ['orejas', 'media', 'parietal', 'nuca', 'coronilla'],
      ficha: f({
        formula: 'Protector térmico + espuma de volumen',
        proporciones: 'Una nuez de espuma en melena media',
        productos: ['Protector térmico', 'Espuma', 'Spray de brillo'],
        cantidades: '2 pulverizaciones por sección',
        tiempos: '20 a 30 min según densidad',
        temperaturas: 'Calor medio. Golpe de frío al final de cada mecha.',
        herramientas: ['Secador con boquilla', 'Cepillo redondo', 'Pinzas', 'Peine de cola'],
        errores: ['Secar sin boquilla y levantar la cutícula', 'Cepillo demasiado grande para el largo', 'Soltar la mecha caliente y perder la forma'],
        recomendaciones: ['Preseca al 70 % antes del cepillo', 'Boquilla siempre de raíz a punta', 'Aire frío en cada mecha antes de soltar']
      }),
      pasos: [
        { t: 'Presecado', n: 'Seca al setenta por ciento con la mano, sin cepillo.', e: 'Empezar el brushing con el pelo empapado.', d: 5, fase: 'preparacion' },
        { t: 'Secciones', n: 'Oreja a oreja y línea media. Nuca suelta primero.', e: 'Trabajar sin separar y volver sobre lo seco.', d: 5, fase: 'divisiones' },
        { t: 'Mecha y tensión', n: 'Mechas del ancho del cepillo, con tensión constante.', e: 'Mecha más ancha que el cepillo: no se forma.', d: 6, fase: 'aplicacion' },
        { t: 'Boquilla dirigida', n: 'Aire de raíz a punta, siguiendo el cepillo.', e: 'Aire en contra y frizz garantizado.', d: 6, fase: 'aplicacion' },
        { t: 'Aire frío', n: 'Golpe de frío en cada mecha antes de soltarla.', e: 'Soltar en caliente y perder el cuerpo.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Para qué el aire frío al final de cada mecha?', o: ['Para no quemar', 'Para fijar la forma al cerrar la cutícula', 'Para ir más rápido'], c: 1, x: 'El pelo toma la forma cuando se enfría, no cuando está caliente.' }
      ]
    },
    {
      id: 'cab_planchado', fam: 'cabello', n: 'Planchado',
      resumen: 'Liso de plancha con mecha fina, una pasada continua y temperatura por tipo de fibra.',
      divs: ['nueve', 'orejas', 'media', 'nuca'],
      ficha: f({
        formula: 'Protector térmico en spray',
        proporciones: 'Una pulverización por mecha',
        productos: ['Protector térmico', 'Sérum de acabado'],
        cantidades: 'Según densidad',
        tiempos: '15 a 25 min',
        temperaturas: 'Fino 160 °C · normal 180 °C · grueso 200 °C · decolorado 150 °C.',
        herramientas: ['Plancha de cerámica o titanio', 'Peine de cola', 'Pinzas'],
        errores: ['Pasar la plancha varias veces por la misma mecha', 'Planchar con humedad', 'Temperatura máxima por costumbre'],
        recomendaciones: ['Mecha de 2 a 3 cm', 'Una sola pasada lenta y continua', 'Protector siempre, sin excepción']
      }),
      pasos: [
        { t: 'Pelo seco al cien por cien', n: 'Comprueba que no queda humedad.', e: 'Planchar húmedo y romper la fibra.', d: 5, fase: 'preparacion' },
        { t: 'Secciones', n: 'Nueve secciones, empezando por la nuca.', e: 'Sin orden: zonas dobles y zonas sin planchar.', d: 5, fase: 'divisiones' },
        { t: 'Protector', n: 'Pulveriza protector mecha a mecha.', e: 'Rociar por encima y creer que cubre.', d: 5, fase: 'aplicacion' },
        { t: 'Una pasada', n: 'Mecha de dos a tres centímetros, una pasada lenta de raíz a punta.', e: 'Ir y venir tres veces sobre la misma mecha.', d: 7, fase: 'aplicacion' },
        { t: 'Acabado', n: 'Sérum en puntas, muy poco.', e: 'Exceso de sérum y pelo grasiento.', d: 4, fase: 'cierre' }
      ],
      repaso: [
        { p: 'Cabello decolorado: temperatura de plancha.', o: ['150 °C', '180 °C', '200 °C'], c: 0, x: 'La fibra decolorada tolera mucho menos calor. 150 °C y una sola pasada.' }
      ]
    },
    {
      id: 'cab_derriz', fam: 'cabello', n: 'Derriz',
      resumen: 'Alisado químico progresivo, con la raíz respetada y el reloj corto.',
      divs: ['nueve', 'orejas', 'media', 'nuca', 'mediaLuna'],
      ficha: f({
        formula: 'Crema alisante según fuerza (suave, normal, fuerte)',
        proporciones: 'Pura',
        productos: ['Crema alisante', 'Neutralizante', 'Protector de cuero cabelludo', 'Champú neutro'],
        cantidades: '1 envase por servicio',
        tiempos: '10 a 20 min con prueba de elasticidad cada 5 · neutralizado 8 min',
        temperaturas: 'Ambiente. Nunca calor.',
        herramientas: ['Peine de cola', 'Pincel', 'Guantes', 'Cronómetro', 'Bol'],
        seguridad: ['Protector de contorno antes de empezar: el alisador es muy alcalino y quema', 'Guantes en todo el servicio y aclarado abundante con agua templada', 'Prueba de mecha obligatoria si hay color o decoloración previos', 'Nunca sobre cuero cabelludo rascado o con heridas: no lavar la cabeza las 48 h anteriores'],
        errores: ['Aplicar en la raíz desde el primer minuto', 'Peinar con fuerza mientras actúa', 'Repetir sobre pelo ya alisado'],
        recomendaciones: ['Un centímetro de separación de la raíz', 'Prueba de elasticidad cada cinco minutos', 'Solo el crecimiento en los retoques']
      }),
      pasos: [
        { t: 'Proteger', n: 'Protector en el cuero cabelludo y en el contorno.', e: 'Saltarse el protector y quemar.', d: 5, fase: 'preparacion' },
        { t: 'Nueve secciones', n: 'Marca las nueve secciones.', e: 'Aplicar sin mapa.', d: 5, fase: 'divisiones' },
        { t: 'Aplicar', n: 'A un centímetro de la raíz, de nuca hacia el frente.', e: 'Pegar el producto al cuero.', d: 7, fase: 'aplicacion' },
        { t: 'Prueba de elasticidad', n: 'Cada cinco minutos estira una hebra: si vuelve, aún no está.', e: 'Pasarse de tiempo y romper.', d: 6, fase: 'tiempo' },
        { t: 'Aclarar y neutralizar', n: 'Aclara a fondo y neutraliza ocho minutos.', e: 'Neutralizar con restos de crema.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: 'En un retoque de derriz se aplica…', o: ['En toda la melena', 'Solo en el crecimiento', 'Solo en puntas'], c: 1, x: 'Repetir sobre pelo ya alisado lo rompe. El retoque va únicamente en la raíz nueva.' }
      ]
    },

    /* ─────────────── CEJAS ─────────────── */
    {
      id: 'cejas_diseno', fam: 'cejas', n: 'Diseño y mapeo',
      resumen: 'Tres líneas desde el ala de la nariz: inicio, punto alto y final.',
      divs: ['mapeoCeja'],
      ficha: f({
        formula: 'Sin producto químico. Solo medición.',
        proporciones: 'Inicio en la vertical del ala de la nariz · punto alto en la diagonal del iris externo · final en la diagonal del lagrimal al rabillo',
        productos: ['Lápiz de mapeo', 'Hilo de mapeo', 'Toallitas'],
        cantidades: '—',
        tiempos: '10 min',
        temperaturas: '—',
        herramientas: ['Compás de cejas', 'Lápiz blanco', 'Hilo', 'Pinza de punta', 'Tijera curva'],
        errores: ['Mapear con la clienta tumbada: la cara cambia', 'Fiarse de la simetría perfecta', 'Quitar por encima antes de tiempo'],
        recomendaciones: ['Clienta sentada y con los ojos abiertos', 'Las cejas son hermanas, no gemelas', 'Retirar primero por debajo']
      }),
      pasos: [
        { t: 'Sentar y mirar', n: 'La clienta sentada, mirando al frente. La cara en reposo.', e: 'Mapear tumbada y ver otra cara al levantarse.', d: 5, fase: 'preparacion' },
        { t: 'Línea de inicio', n: 'Vertical desde el ala de la nariz. Ahí arranca la ceja.', e: 'Abrir demasiado el entrecejo.', d: 5, fase: 'divisiones' },
        { t: 'Punto alto', n: 'Diagonal desde el ala pasando por el borde externo del iris.', e: 'Poner el arco en el centro y hacer cara de sorpresa.', d: 5, fase: 'divisiones' },
        { t: 'Final', n: 'Diagonal desde el ala hasta el rabillo del ojo.', e: 'Cola caída que baja la mirada.', d: 5, fase: 'divisiones' },
        { t: 'Contorno', n: 'Une los tres puntos con lápiz y comprueba con la clienta.', e: 'Depilar sin enseñar el diseño.', d: 6, fase: 'aplicacion' },
        { t: 'Retirada', n: 'Quita primero por debajo, después lo justo por encima.', e: 'Vaciar la parte alta y perder la forma.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Dónde va el punto alto?', o: ['En el centro de la ceja', 'En la diagonal del borde externo del iris', 'Sobre el lagrimal'], c: 1, x: 'En el centro queda cara de sorpresa. La diagonal del iris externo es lo que abre la mirada de forma natural.' },
        { p: '¿En qué posición se mapea?', o: ['Tumbada', 'Sentada y con los ojos abiertos', 'Da igual'], c: 1, x: 'Tumbada la piel se desplaza. El diseño se ve distinto al incorporarse.' }
      ]
    },
    {
      id: 'cejas_laminado', fam: 'cejas', n: 'Laminado',
      resumen: 'Peinar el pelo hacia arriba y fijarlo con dos lociones y un nutritivo.',
      divs: ['mapeoCeja'],
      ficha: f({
        formula: 'Loción 1 (reductora) + loción 2 (fijadora) + aceite nutritivo',
        proporciones: 'Capa fina de cada una',
        productos: ['Loción 1', 'Loción 2', 'Aceite de ricino', 'Pegamento de fijación'],
        cantidades: 'Un sobre por servicio',
        tiempos: 'Loción 1: 8 a 12 min · Loción 2: 6 a 8 min · nutritivo 5 min',
        temperaturas: 'Ambiente.',
        herramientas: ['Cepillito', 'Micropincel', 'Film', 'Algodón'],
        errores: ['Pasarse con la loción 1 y quemar el pelo', 'Peinar mal antes de fijar y dejar cruces', 'Mojar en las 24 h siguientes'],
        recomendaciones: ['Cronómetro estricto', 'Peinar en la dirección exacta antes de la loción 2', 'Nutritivo obligatorio al cerrar']
      }),
      pasos: [
        { t: 'Limpieza', n: 'Desengrasa el pelo de la ceja.', e: 'Restos de maquillaje que impiden la fijación.', d: 5, fase: 'preparacion' },
        { t: 'Peinado y pegado', n: 'Peina hacia arriba con pegamento y coloca cada pelo.', e: 'Pelos cruzados que quedarán fijados así.', d: 6, fase: 'aplicacion' },
        { t: 'Loción 1', n: 'Capa fina, film encima, de ocho a doce minutos.', e: 'Exceso de producto y pelo quemado.', d: 6, fase: 'tiempo' },
        { t: 'Loción 2', n: 'Retira, aplica la fijadora de seis a ocho minutos.', e: 'Repeinar entre lociones y romper la forma.', d: 6, fase: 'tiempo' },
        { t: 'Nutritivo', n: 'Aceite de ricino cinco minutos y peinado final.', e: 'Cerrar sin nutrir.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuánto tiempo sin mojar después del laminado?', o: ['2 horas', '24 horas', 'No hace falta esperar'], c: 1, x: 'La fijación tarda un día en asentar. Antes de eso el pelo vuelve a su sitio.' }
      ]
    },

    /* ─────────────── PESTAÑAS ─────────────── */
    {
      id: 'pest_pelo_a_pelo', fam: 'pestanas', n: 'Extensión pelo a pelo',
      resumen: 'Una extensión por pestaña natural, respetando cinco zonas y la densidad real.',
      divs: ['zonasOjo'],
      ficha: f({
        formula: 'Adhesivo de cianoacrilato de secado medio',
        proporciones: '1 extensión : 1 pestaña natural',
        productos: ['Extensiones 0.15 curva C', 'Adhesivo', 'Primer', 'Parches de hidrogel', 'Removedor'],
        cantidades: '60 a 100 extensiones por ojo',
        tiempos: '90 a 120 min · secado 24 h sin agua',
        temperaturas: 'Sala a 20-24 °C, humedad 45-55 %. El adhesivo depende de esto.',
        herramientas: ['Pinza recta', 'Pinza curva', 'Parches', 'Ventilador', 'Lámpara con lupa'],
        errores: ['Pegar dos naturales juntas y crear un tirón', 'Adhesivo tocando la piel', 'Extensión demasiado larga para la pestaña que la sostiene', 'Sala fuera de humedad y adhesivo que no cura'],
        recomendaciones: ['Aislar siempre antes de pegar', 'Un milímetro de separación del párpado', 'Longitud proporcional: nunca más del doble de la natural']
      }),
      pasos: [
        { t: 'Preparación', n: 'Parches colocados, limpieza y primer en la línea.', e: 'Parche que roza la córnea.', d: 6, fase: 'preparacion' },
        { t: 'Cinco zonas', n: 'Divide la línea en lagrimal, interna, centro, externa y rabillo.', e: 'Trabajar sin zonas y perder la curva del diseño.', d: 5, fase: 'divisiones' },
        { t: 'Aislar', n: 'Con la pinza recta, separa una sola pestaña natural.', e: 'Pegar dos naturales: dolor y caída prematura.', d: 7, fase: 'aplicacion' },
        { t: 'Longitud por zona', n: 'Cada zona lleva sus milímetros. El diseño se construye zona a zona.', e: 'Poner la misma longitud en todo el ojo.', d: 6, fase: 'aplicacion' },
        { t: 'Pegar', n: 'Moja la base, espera un segundo y coloca a un milímetro del párpado.', e: 'Adhesivo en la piel: reacción y arranque.', d: 7, fase: 'aplicacion' },
        { t: 'Sellado', n: 'Ventilador suave y comprobación de que no hay pegados.', e: 'Entregar sin revisar y descubrir tirones después.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuál es la separación correcta del párpado?', o: ['Pegada a la piel', '1 mm', '5 mm'], c: 1, x: 'Pegada irrita; demasiado lejos la extensión baila y se cae.' },
        { p: 'La humedad de la sala…', o: ['Da igual', 'Determina el curado del adhesivo', 'Solo importa en verano'], c: 1, x: 'El cianoacrilato cura con la humedad ambiente. Fuera del 45-55 % el pegado falla.' }
      ]
    },
    {
      id: 'pest_lifting', fam: 'pestanas', n: 'Lifting de pestañas',
      resumen: 'Curvar la pestaña natural sobre silicona, con dos lociones y tinte opcional.',
      divs: ['zonasOjo'],
      ficha: f({
        formula: 'Loción 1 rizadora + loción 2 fijadora + nutritivo',
        proporciones: 'Capa fina en el tercio medio',
        productos: ['Loción 1', 'Loción 2', 'Silicona', 'Pegamento', 'Tinte', 'Nutritivo'],
        cantidades: 'Un kit por servicio',
        tiempos: 'Loción 1: 10 min · Loción 2: 8 min · tinte 5 min',
        temperaturas: 'Ambiente.',
        herramientas: ['Siliconas de varios tamaños', 'Micropincel', 'Pinza', 'Parches'],
        errores: ['Silicona de tamaño equivocado para el largo', 'Producto en las puntas: se rompen', 'Pestañas mal colocadas que quedan cruzadas'],
        recomendaciones: ['Elegir silicona según longitud natural', 'Producto en el tercio medio, nunca en la punta', 'Nutritivo al final siempre']
      }),
      pasos: [
        { t: 'Elegir silicona', n: 'Escoge el tamaño según la longitud de la pestaña natural.', e: 'Silicona grande en pestaña corta: no riza.', d: 5, fase: 'preparacion' },
        { t: 'Colocar', n: 'Pega la silicona al párpado y sube cada pestaña bien recta.', e: 'Pestañas cruzadas que se fijan así.', d: 7, fase: 'aplicacion' },
        { t: 'Loción 1', n: 'Tercio medio, diez minutos.', e: 'Producto en la punta y roturas.', d: 6, fase: 'tiempo' },
        { t: 'Loción 2', n: 'Fijadora ocho minutos.', e: 'Acortar y perder la curva.', d: 6, fase: 'tiempo' },
        { t: 'Tinte y nutritivo', n: 'Tinte cinco minutos si procede y cierra con nutritivo.', e: 'Retirar la silicona en seco y arrancar pestañas.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Dónde se aplica la loción?', o: ['En la punta', 'En el tercio medio', 'En la raíz'], c: 1, x: 'La punta es la parte más fina. Si recibe producto, se quiebra.' }
      ]
    },

    /* ─────────────── MAQUILLAJE ─────────────── */
    {
      id: 'maq_social', fam: 'maquillaje', n: 'Maquillaje social',
      resumen: 'Preparación, base al tono real y ojo graduado, pensado para luz de día.',
      divs: ['perfil'],
      ficha: f({
        formula: 'Base al tono del cuello + corrector medio tono más claro',
        proporciones: 'Corrector: dos tonos por encima solo en ojera profunda',
        productos: ['Prebase', 'Base', 'Corrector', 'Polvo suelto', 'Colorete', 'Sombras', 'Máscara', 'Labial'],
        cantidades: 'Una avellana de base',
        tiempos: '45 min',
        temperaturas: '—',
        herramientas: ['Esponja', 'Brochas de base, polvo, colorete y ojo', 'Espejo con luz natural'],
        errores: ['Elegir el tono en la muñeca en vez del cuello', 'Sellar sin esperar a que la base asiente', 'Luz artificial cálida que engaña con el tono'],
        recomendaciones: ['Probar el tono en la mandíbula', 'Capas finas antes que una gruesa', 'Comprobar siempre con luz natural']
      }),
      pasos: [
        { t: 'Preparar la piel', n: 'Limpia, hidrata y espera a que absorba antes de la prebase.', e: 'Base sobre crema fresca: se corta.', d: 6, fase: 'preparacion' },
        { t: 'Tono correcto', n: 'Prueba tres tonos en la mandíbula y mira con luz natural.', e: 'Elegir en la muñeca y ver una máscara.', d: 6, fase: 'preparacion' },
        { t: 'Base', n: 'Capas finas desde el centro hacia fuera.', e: 'Cargar el centro y dejar el borde marcado.', d: 6, fase: 'aplicacion' },
        { t: 'Corrección', n: 'Corrector en triángulo bajo el ojo, poca cantidad.', e: 'Corrector muy claro que marca cada pliegue.', d: 6, fase: 'aplicacion' },
        { t: 'Ojo', n: 'Sombra media en cuenca, oscura en el externo, difuminado sin bordes.', e: 'Bordes duros sin difuminar.', d: 7, fase: 'aplicacion' },
        { t: 'Cierre', n: 'Colorete, labial y comprobación con luz natural.', e: 'Validar el trabajo con luz cálida de gabinete.', d: 5, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Dónde se prueba el tono de base?', o: ['En la muñeca', 'En la mandíbula, junto al cuello', 'En el dorso de la mano'], c: 1, x: 'La cara y el cuello tienen que coincidir. La muñeca no tiene nada que ver con el tono facial.' }
      ]
    },

    /* ─────────────── HACER Y APRENDER ───────────────
       Cómo se aprende una técnica manual. No son consejos: son procedimientos
       con sus tiempos, sus errores y su comprobación, igual que un color. Están
       escritos desde el taller — el material es un maniquí, un cronómetro y una
       compañera que mira — y sirven igual para cualquier oficio que se aprenda
       con las manos. */
    {
      id: 'hacer_ver', fam: 'hacer', n: 'Ver, hacer, explicar',
      resumen: 'El ciclo completo de una destreza manual: observas con una pregunta, la repites en frío y la explicas en voz alta. Sin el tercer paso, no está aprendida.',
      divs: [],
      ficha: f({
        formula: 'Una demostración · dos repeticiones · una explicación en voz alta',
        proporciones: 'Por cada minuto de demostración, cinco de práctica propia',
        productos: ['Maniquí o modelo', 'El material real de la técnica', 'Cronómetro', 'Una compañera que escuche'],
        cantidades: 'Un solo gesto por sesión. No dos.',
        tiempos: '10 min de observación · 25 de práctica · 5 de explicación',
        temperaturas: '—',
        herramientas: ['Cuaderno para los tres puntos de observación', 'Móvil para grabarte de espaldas', 'Espejo'],
        observaciones: 'Explicar en voz alta es lo que convierte el gesto en conocimiento: al ponerle palabras aparecen los huecos que la mano sola no delata.',
        errores: ['Mirar la demostración sin una pregunta concreta y quedarte con "qué bien lo hace"', 'Practicar mientras la profesora todavía habla', 'Dar por sabido el gesto porque salió una vez'],
        recomendaciones: ['Antes de mirar, escribe tres cosas que vas a observar: manos, ángulo y orden', 'Repite en frío al día siguiente, sin volver a ver la demostración', 'Explícaselo a alguien que no sepa: si no lo entiende, no lo sabes']
      }),
      pasos: [
        { t: 'Tres puntos de observación', n: 'Antes de que empiece la demostración, escribe qué vas a mirar: la posición de las manos, el ángulo de la herramienta y el orden de las zonas. Sin eso, la vista se va al resultado y se pierde el procedimiento.', e: 'Mirar sin pregunta: recuerdas que quedó bonito, no cómo se hizo.', d: 5, fase: 'divisiones' },
        { t: 'La demostración, sin tocar', n: 'Mira entera y con las manos quietas. Anota solo lo que no esperabas. La tentación de ir practicando a la vez cuesta la mitad de la información.', e: 'Empezar a hacerlo mientras la profesora todavía explica.', d: 6, fase: 'formula' },
        { t: 'Repetir en caliente', n: 'Hazlo tú inmediatamente, con el modelo delante y consultando tus notas cuando haga falta. Aquí importa el orden, no la velocidad.', e: 'Buscar la velocidad de la profesora en el primer intento.', d: 9, fase: 'aplicacion' },
        { t: 'Repetir en frío', n: 'Al día siguiente, repítelo sin ver la demostración otra vez. Lo que se te olvide aquí es exactamente lo que hay que estudiar.', e: 'Volver a ver el vídeo antes de intentarlo y creer que lo recuerdas.', d: 8, fase: 'tiempo' },
        { t: 'Explicar en voz alta', n: 'Cuéntaselo a una compañera mientras lo haces: qué haces, por qué y qué pasaría si no. Los tropiezos de la explicación son los huecos reales.', e: 'Explicar de memoria el resultado en vez del procedimiento.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuándo se comprueba de verdad si una técnica está aprendida?', o: ['Al terminar la demostración', 'Al repetirla al día siguiente sin ayuda', 'Cuando sale bien una vez'], c: 1, x: 'En caliente te sostiene la memoria de lo que acabas de ver. En frío solo te sostiene lo que aprendiste.' },
        { p: '¿Para qué sirve explicar la técnica en voz alta?', o: ['Para practicar la comunicación con el cliente', 'Para que aparezcan los huecos que la mano sola no delata', 'Para memorizar el vocabulario técnico'], c: 1, x: 'La mano puede repetir un gesto sin entenderlo. Al ponerle palabras se ve dónde falta el porqué.' }
      ]
    },
    {
      id: 'hacer_espaciado', fam: 'hacer', n: 'Repaso espaciado',
      resumen: 'El mismo contenido, cuatro veces, cada vez más separadas. Menos horas totales y más retención que estudiar del tirón.',
      divs: [],
      ficha: f({
        formula: 'Día 1 · día 2 · día 7 · día 21',
        proporciones: 'Cada repaso, la mitad de tiempo que el anterior',
        productos: ['El temario o la ficha técnica', 'Calendario con las cuatro fechas puestas', 'Tarjetas de pregunta'],
        cantidades: 'Bloques de 25 minutos, no sesiones de tres horas',
        tiempos: '40 min el primer día · 20 el segundo · 15 a la semana · 10 a las tres semanas',
        temperaturas: '—',
        herramientas: ['Calendario', 'Cronómetro', 'Las preguntas de repaso de cada técnica'],
        observaciones: 'El olvido no es un fallo: es la señal de cuándo toca repasar. Se repasa justo cuando empieza a costar recordar, no antes.',
        errores: ['Concentrar todo el estudio la víspera', 'Repasar releyendo en vez de preguntándote', 'Dejar las fechas "para cuando pueda" y no ponerlas en el calendario'],
        recomendaciones: ['Pon las cuatro fechas el mismo día que das el tema', 'Si un repaso sale fácil, alarga el siguiente intervalo', 'Si sale difícil, acórtalo: el calendario se ajusta a ti']
      }),
      pasos: [
        { t: 'Fechas antes de estudiar', n: 'El día que se da el tema, apunta las cuatro fechas de repaso en el calendario. Sin fecha escrita, el tercer repaso no ocurre nunca.', e: 'Confiar en acordarte de repasar.', d: 5, fase: 'divisiones' },
        { t: 'Primera vuelta completa', n: 'Cuarenta minutos el mismo día: lee, resume con tus palabras y escribe cinco preguntas sobre lo que crees que caerá.', e: 'Subrayar el libro entero y llamarlo estudiar.', d: 8, fase: 'formula' },
        { t: 'Segunda vuelta, solo preguntas', n: 'Al día siguiente, veinte minutos respondiendo tus cinco preguntas sin mirar. Solo consultas después de haber intentado responder.', e: 'Abrir los apuntes en cuanto dudas.', d: 7, fase: 'aplicacion' },
        { t: 'A la semana', n: 'Quince minutos. Aquí ya cuesta, y ese esfuerzo es el que fija. Anota lo que se te haya caído.', e: 'Saltártelo porque "todavía me acuerdo".', d: 6, fase: 'tiempo' },
        { t: 'A las tres semanas', n: 'Diez minutos sobre lo que fallaste. Lo que aguante hasta aquí llega al examen y al salón.', e: 'Repasar otra vez lo que ya dominas porque da gusto.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Cuándo conviene repasar un contenido?', o: ['En cuanto lo estudias, para que no se olvide', 'Cuando empieza a costar recordarlo', 'Solo la víspera del examen'], c: 1, x: 'Repasar algo que recuerdas sin esfuerzo no añade casi nada. El esfuerzo de recuperarlo es lo que lo fija.' },
        { p: 'Si un repaso te sale muy fácil, ¿qué haces con el siguiente?', o: ['Adelantarlo', 'Alargar el intervalo', 'Repetir el mismo día'], c: 1, x: 'El calendario se ajusta a lo que sabes: si aguanta, se separa; si se cae, se acorta.' }
      ]
    },
    {
      id: 'hacer_error', fam: 'hacer', n: 'Cuaderno de errores',
      resumen: 'Cada fallo del taller se convierte en una entrada con causa, corrección y señal de aviso. Es el material de estudio más rentable que vas a tener.',
      divs: [],
      ficha: f({
        formula: 'Qué pasó · por qué · cómo se corrige · en qué se nota antes',
        proporciones: 'Cinco minutos de cuaderno por cada servicio de práctica',
        productos: ['Cuaderno o archivo propio', 'Fotos del antes y el después', 'La ficha técnica del servicio'],
        cantidades: 'Una entrada por error, aunque el error se repita',
        tiempos: '5 min al terminar cada servicio · 20 min de relectura cada viernes',
        temperaturas: '—',
        herramientas: ['Cuaderno', 'Móvil para las fotos', 'Bolígrafo rojo para la señal de aviso'],
        observaciones: 'Un error escrito con su causa deja de ser un mal recuerdo y pasa a ser un procedimiento. Y los tuyos son los que más te van a enseñar, porque son los que vas a repetir.',
        errores: ['Escribir "salió mal" sin la causa', 'Guardar solo los errores graves y perder los pequeños, que son los frecuentes', 'No releer nunca el cuaderno'],
        recomendaciones: ['Escríbelo el mismo día, en caliente, con la sensación aún fresca', 'Busca la señal que avisaba antes del fallo: casi siempre la hubo', 'Relee el cuaderno antes de cada servicio parecido']
      }),
      pasos: [
        { t: 'En caliente', n: 'Nada más terminar, mientras recoges, escribe qué salió distinto de lo previsto. Dos líneas bastan, pero hoy.', e: 'Dejarlo para casa: por la noche ya se ha suavizado el recuerdo.', d: 5, fase: 'divisiones' },
        { t: 'Buscar la causa real', n: 'Baja del qué al por qué: no "quedó desigual", sino "tomé secciones de tres centímetros y el producto no llegó al centro".', e: 'Quedarte en el síntoma y no poder corregir nada.', d: 8, fase: 'formula' },
        { t: 'Escribir la corrección', n: 'Redacta el gesto exacto que lo evita, en imperativo y con su medida. Tiene que poder leerse y ejecutarse.', e: 'Escribir "tener más cuidado", que no es una instrucción.', d: 7, fase: 'aplicacion' },
        { t: 'La señal de aviso', n: 'Piensa en qué se notaba antes de que el fallo fuera visible: un tacto, un olor, un color. Esa señal es lo que te salva la próxima vez.', e: 'Creer que el error apareció de golpe.', d: 7, fase: 'tiempo' },
        { t: 'Relectura del viernes', n: 'Veinte minutos a la semana releyendo entradas. Las que se repiten marcan el tema que hay que volver a estudiar.', e: 'Escribir el cuaderno y no abrirlo jamás.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Qué convierte un fallo en material de estudio?', o: ['Anotar que ocurrió', 'Anotar su causa, su corrección y la señal que lo avisaba', 'Repetir el servicio hasta que salga'], c: 1, x: 'Sin causa no hay corrección posible, y sin señal de aviso no se puede prevenir: solo lamentar.' },
        { p: '"Quedó desigual" como entrada de cuaderno es…', o: ['Suficiente, describe el resultado', 'Insuficiente: es el síntoma, no la causa', 'Demasiado técnico'], c: 1, x: 'La causa sería, por ejemplo, secciones demasiado gruesas. Eso sí se puede corregir mañana.' }
      ]
    },
    {
      id: 'hacer_intercalado', fam: 'hacer', n: 'Práctica intercalada',
      resumen: 'Mezclar técnicas parecidas en la misma sesión en vez de repetir una sola. Va peor durante la práctica y mucho mejor en el examen y en el salón.',
      divs: [],
      ficha: f({
        formula: 'Tres técnicas parecidas · turnos cortos · orden mezclado',
        proporciones: 'Nunca más de dos repeticiones seguidas de la misma',
        productos: ['Tres maniquíes o tres zonas', 'Las fichas de las tres técnicas', 'Papeles con el orden sorteado'],
        cantidades: 'Nueve turnos de cinco minutos en vez de tres bloques de quince',
        tiempos: '45 min de sesión',
        temperaturas: '—',
        herramientas: ['Cronómetro', 'Las tres fichas técnicas'],
        observaciones: 'Repetir una sola técnica veinte veces da una sensación de dominio que se cae en cuanto cambia el contexto. Mezclar obliga a elegir la técnica, que es lo que de verdad se hace en el salón: allí nadie te dice cuál toca.',
        errores: ['Elegir tres técnicas sin nada en común: entonces no hay nada que discriminar', 'Abandonar porque "así sale peor" — sale peor hoy y mejor en junio', 'Mezclar antes de tener el gesto básico de cada una'],
        recomendaciones: ['Elige técnicas que se confundan entre sí: ahí está el aprendizaje', 'Sortea el orden, no lo decidas tú', 'Antes de cada turno, di en voz alta por qué esa técnica y no otra']
      }),
      pasos: [
        { t: 'Elegir tres que se confundan', n: 'Tres técnicas del mismo grupo que se parezcan lo suficiente como para dudar entre ellas. Si no se confunden, no hay nada que practicar.', e: 'Mezclar cosas sin relación y convertirlo en un batiburrillo.', d: 6, fase: 'divisiones' },
        { t: 'Sortear el orden', n: 'Nueve turnos con el orden sorteado. No lo decidas tú: la previsibilidad es justo lo que hay que quitar.', e: 'Hacer A-A-A, B-B-B, C-C-C y llamarlo intercalado.', d: 5, fase: 'formula' },
        { t: 'Decir antes de hacer', n: 'Al empezar cada turno, di en voz alta qué técnica es y por qué encaja aquí. Esa decisión es la mitad del examen práctico.', e: 'Ejecutar en automático sin nombrar la elección.', d: 8, fase: 'aplicacion' },
        { t: 'Turnos cortos', n: 'Cinco minutos por turno y cambio. Que no dé tiempo a instalarse en la comodidad de la repetición.', e: 'Alargar el turno porque estaba saliendo bien.', d: 8, fase: 'tiempo' },
        { t: 'Aceptar que hoy sale peor', n: 'Al terminar, compara con lo que harías repitiendo una sola. Sale peor hoy: es la señal de que estás aprendiendo a elegir, no solo a repetir.', e: 'Volver al bloque repetido porque da mejor sensación.', d: 6, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Por qué la práctica intercalada sale peor durante la sesión?', o: ['Porque cansa más', 'Porque cada cambio obliga a recuperar la técnica de nuevo, y ese esfuerzo es el que enseña', 'Porque se practica menos tiempo cada una'], c: 1, x: 'La comodidad de repetir viene de no tener que decidir. Al mezclar, cada turno empieza por una decisión, que es lo que luego pide el salón.' },
        { p: 'Tres técnicas para intercalar deben ser…', o: ['Lo más distintas posible', 'Parecidas entre sí, de las que se confunden', 'De materias diferentes'], c: 1, x: 'Se practica la discriminación. Si no hay riesgo de confundirlas, no hay nada que discriminar.' }
      ]
    },
    {
      id: 'hacer_examen', fam: 'hacer', n: 'Simulacro de examen práctico',
      resumen: 'Reproducir las condiciones reales: tiempo tasado, material contado, una observadora con la rúbrica en la mano y nada de segundas oportunidades.',
      divs: [],
      ficha: f({
        formula: 'Tiempo real · material real · rúbrica real · sin pausas',
        proporciones: 'Un simulacro completo por cada tres sesiones de práctica libre',
        productos: ['La rúbrica oficial del módulo', 'Todo el material montado antes de empezar', 'Cronómetro visible', 'Una compañera de observadora'],
        cantidades: 'Un servicio completo, de principio a fin',
        tiempos: 'El tiempo oficial de la prueba, ni un minuto más',
        temperaturas: '—',
        herramientas: ['Rúbrica impresa', 'Cronómetro', 'Cuaderno de errores'],
        observaciones: 'Lo que falla en el examen casi nunca es la técnica: es el orden del carro, el tiempo mal repartido o la higiene que no se practicó porque en clase no puntuaba.',
        errores: ['Parar el cronómetro para consultar una duda', 'Montar el material sobre la marcha', 'Corregir defectos al terminar y contarlos como buenos'],
        recomendaciones: ['Lee la rúbrica antes: se puntúa lo que pone, no lo que tú crees', 'Reparte el tiempo por fases y apunta la hora de cada corte', 'Termina aunque vaya mal: entregar a tiempo puntúa']
      }),
      pasos: [
        { t: 'Leer la rúbrica', n: 'Antes de tocar nada, lee qué se puntúa y con cuánto peso. La higiene y el orden suelen valer más de lo que la gente supone.', e: 'Preparar solo la parte técnica y perder los puntos fáciles.', d: 6, fase: 'divisiones' },
        { t: 'Montar el puesto', n: 'Todo el material colocado y contado antes de arrancar el cronómetro, como en la prueba real.', e: 'Levantarte a buscar algo con el reloj en marcha.', d: 6, fase: 'formula' },
        { t: 'Repartir el tiempo', n: 'Divide el tiempo total por fases y escribe a qué hora debe estar terminada cada una. Es tu única forma de saber si vas tarde antes del final.', e: 'Empezar sin plan y descubrir a falta de cinco minutos que falta la mitad.', d: 7, fase: 'aplicacion' },
        { t: 'Ejecutar sin pausas', n: 'De principio a fin, sin parar, sin consultar y sin repetir. Si algo sale mal, sigues: eso también es la prueba.', e: 'Parar el reloj para arreglar un fallo.', d: 10, fase: 'tiempo' },
        { t: 'Corrección con la rúbrica', n: 'La observadora puntúa apartado por apartado y señala dos cosas: la que más resta y la que sale sola. Al cuaderno de errores.', e: 'Quedarte con la impresión general en vez de la puntuación por apartados.', d: 8, fase: 'cierre' }
      ],
      repaso: [
        { p: 'Si a mitad del simulacro algo sale mal, ¿qué haces?', o: ['Parar y repetir esa parte', 'Seguir hasta el final: terminar a tiempo también puntúa', 'Empezar de cero'], c: 1, x: 'En la prueba real no hay pausa. Aprender a terminar con un fallo encima es parte de lo que se examina.' },
        { p: '¿Cuándo se lee la rúbrica?', o: ['Al terminar, para corregir', 'Antes de empezar, para saber qué se puntúa', 'No hace falta leerla'], c: 1, x: 'Se puntúa lo que pone la rúbrica. Muchos puntos perdidos son de apartados que nadie leyó.' }
      ]
    },
    {
      id: 'hacer_ficha', fam: 'hacer', n: 'Ficha propia de una técnica',
      resumen: 'Reescribir la técnica con tus palabras, tus medidas y tus errores. La ficha que te sirve es la que escribes tú, no la que copias.',
      divs: [],
      ficha: f({
        formula: 'Para qué · qué hace falta · pasos numerados · dónde falla · cómo se comprueba',
        proporciones: 'Una cara de folio. Si no cabe, es que aún no lo entiendes',
        productos: ['Los apuntes de clase', 'La ficha del fabricante', 'Tu cuaderno de errores'],
        cantidades: 'Una ficha por técnica',
        tiempos: '30 min de redacción · 10 de contraste con una compañera',
        temperaturas: '—',
        herramientas: ['Folio o plantilla de ficha', 'Los apuntes originales'],
        observaciones: 'Copiar la ficha del fabricante es tener el papel; escribirla es tener la técnica. Al reducirla a una cara hay que decidir qué es esencial, y esa decisión es el aprendizaje.',
        errores: ['Copiar literal y creer que has estudiado', 'Escribirla sin las medidas concretas', 'No incluir el apartado de comprobación'],
        recomendaciones: ['Ciérrala a una cara de folio', 'Escribe los pasos en imperativo, como se los dirías a otra persona', 'Contrástala con una compañera: lo que ella no entienda está mal explicado']
      }),
      pasos: [
        { t: 'Cerrar los apuntes', n: 'Escribe primero lo que recuerdas, sin mirar. Los huecos que aparezcan son el mapa de lo que hay que repasar.', e: 'Redactar con los apuntes abiertos y copiar sin darte cuenta.', d: 6, fase: 'divisiones' },
        { t: 'Para qué sirve', n: 'Una frase: qué problema resuelve esta técnica y cuándo se elige frente a otra parecida.', e: 'Empezar por los pasos sin saber para qué sirve el conjunto.', d: 6, fase: 'formula' },
        { t: 'Pasos con medida', n: 'Numera los pasos en imperativo y ponle a cada uno su número: centímetros, grados, minutos, volúmenes. Un paso sin medida no es ejecutable.', e: 'Escribir "dejar actuar" sin los minutos.', d: 9, fase: 'aplicacion' },
        { t: 'Dónde falla', n: 'Añade los dos o tres errores que has cometido tú, sacados del cuaderno, con su corrección al lado.', e: 'Poner los errores del libro en vez de los tuyos.', d: 7, fase: 'tiempo' },
        { t: 'Contraste', n: 'Dásela a una compañera y que la ejecute solo con lo que pone. Cada duda suya es una línea que hay que reescribir.', e: 'Darla por buena porque tú la entiendes.', d: 7, fase: 'cierre' }
      ],
      repaso: [
        { p: '¿Por qué se limita la ficha a una cara de folio?', o: ['Para ahorrar papel', 'Porque obliga a decidir qué es esencial, y esa decisión es el aprendizaje', 'Porque es lo que pide la normativa'], c: 1, x: 'Cabe todo si no has jerarquizado. El recorte es lo que te obliga a entender qué manda y qué acompaña.' },
        { p: 'Un paso escrito como "dejar actuar" está…', o: ['Bien: es lo que dice el fabricante', 'Incompleto: le falta la medida en minutos', 'De más: eso ya se sabe'], c: 1, x: 'Una ficha se escribe para ejecutarla sin pensar. Sin el número, hay que volver a buscar el dato justo cuando no hay tiempo.' }
      ]
    }
  ];

  /* ══════════════════════════════════════════════════════════════
     4 · ESTADO Y PERSISTENCIA
     Se guardan solo los PARCHES sobre la base, no la base entera:
     así, si mañana se corrige un dato aquí, la alumna lo recibe.
     ══════════════════════════════════════════════════════════════ */
  var parches = {};
  var propias = [];
  var oyentes = [];

  function cargar() {
    try {
      var raw = localStorage.getItem(CLAVE);
      if (!raw) return;
      var d = JSON.parse(raw);
      parches = d.parches || {};
      propias = d.propias || [];
    } catch (e) { parches = {}; propias = []; }
  }

  function persistir() {
    try { localStorage.setItem(CLAVE, JSON.stringify({ parches: parches, propias: propias })); } catch (e) { }
  }

  function avisar(id) {
    oyentes.forEach(function (fn) { try { fn(id); } catch (e) { } });
  }

  function clon(o) { return JSON.parse(JSON.stringify(o)); }

  function fundir(base, parche) {
    if (!parche) return base;
    var r = clon(base);
    Object.keys(parche).forEach(function (k) {
      if (k === 'ficha' && r.ficha) {
        Object.keys(parche.ficha).forEach(function (c) { r.ficha[c] = parche.ficha[c]; });
      } else r[k] = parche[k];
    });
    return r;
  }

  function todas() {
    return TECNICAS.concat(propias);
  }

  cargar();

  /* ══════════════════════════════════════════════════════════════
     5 · API PÚBLICA
     Nadie copia datos: todo el mundo pregunta aquí.
     ══════════════════════════════════════════════════════════════ */
  var C = {

    familias: function () { return clon(FAMILIAS); },

    /* Cómo se llaman las cinco fases en esta familia. En el salón son divisiones
       y fórmula; aprendiendo, preparación y modelo. */
    fases: function (fam) {
      var F = FAMILIAS.filter(function (x) { return x.id === fam; })[0];
      return clon(F && F.universal ? FASES_N.hacer : FASES_N.normal);
    },

    /* ─────────── Contenido para las láminas de exposición ───────────
       La lámina no sabe de técnicas y el Cerebro no sabe de dibujo: aquí se
       traduce una técnica a la lista plana de nodos que el motor entiende
       (nivel 0 centro, 1 rama, 2 detalle), con la forma que pide cada
       familia de lámina. Se escribe una vez y sirve para las trescientas
       plantillas. */
    laminaDe: function (famLamina, idTecnica) {
      var t = idTecnica ? C.obtener(idTecnica) : null;
      if (!t) {
        var l = C.listar();
        t = l.length ? C.obtener(l[0].id) : null;
      }
      if (!t) return [];

      var out = [];
      var n0 = function (a, b) { out.push({ nivel: 0, t: a, d: b || '' }); };
      var n1 = function (a, b) { out.push({ nivel: 1, t: a, d: b || '' }); };
      var n2 = function (a, b) { out.push({ nivel: 2, t: a, d: b || '' }); };

      var fi = t.ficha || {}, pasos = t.pasos || [];
      var fam = famLamina || 'mapa';

      /* Pasos con flecha: proceso, línea de tiempo y carrusel. */
      if (fam === 'flujo' || fam === 'tiempo' || fam === 'carrusel') {
        n0(t.n, t.resumen);
        pasos.forEach(function (p) { n1(p.t, fam === 'tiempo' ? (p.d + ' s') : p.n); });
        return out;
      }

      /* Cifras reales: lo que dura cada paso, en segundos. La barra las lee
         del detalle, así que van con su número dentro. */
      if (fam === 'datos') {
        n0(t.n, 'Reparto del tiempo de la técnica');
        pasos.forEach(function (p) { n1(p.t, (p.d || 5) + ' s'); });
        return out;
      }

      /* Comparativa: lo que hay que hacer contra lo que sale mal. */
      if (fam === 'comparar') {
        n0(t.n, t.resumen);
        n1('Así se hace', 'Recomendaciones de taller');
        (fi.recomendaciones || []).forEach(function (r) { n2(r); });
        n1('Así se estropea', 'Errores más frecuentes');
        (fi.errores || []).forEach(function (e) { n2(e); });
        return out;
      }

      /* Jerarquía: las fases del servicio, de la primera a la última. */
      if (fam === 'piramide') {
        var ORDEN = ['divisiones', 'formula', 'aplicacion', 'tiempo', 'cierre'];
        var NOM = C.fases(t.fam);
        n0(t.n, t.fam === 'hacer' ? 'Las cinco fases del método' : 'Las fases del servicio');
        ORDEN.forEach(function (f) {
          var ps = pasos.filter(function (p) { return p.fase === f; });
          if (!ps.length) return;
          n1(NOM[f], ps.map(function (p) { return p.t; }).join(' · '));
        });
        if (out.length === 1) pasos.forEach(function (p) { n1(p.t, p.n); });
        return out;
      }

      /* Ficha de estudio: los campos de la ficha, tal cual se entregan. */
      if (fam === 'ficha') {
        n0(t.n, t.resumen);
        var campos = [
          ['Fórmula', fi.formula], ['Proporciones', fi.proporciones],
          ['Productos', (fi.productos || []).join(', ')],
          ['Cantidades', fi.cantidades], ['Tiempos', fi.tiempos],
          ['Temperaturas', fi.temperaturas],
          ['Herramientas', (fi.herramientas || []).join(', ')],
          ['Observaciones', fi.observaciones]
        ];
        campos.forEach(function (c) { if (c[1]) n1(c[0], c[1]); });
        return out;
      }

      /* Cartel: frases cortas para leer de pie. */
      if (fam === 'poster') {
        n0(t.n, t.resumen);
        (fi.recomendaciones || []).forEach(function (r) { n1(r); });
        if (out.length === 1) pasos.forEach(function (p) { n1(p.t); });
        return out;
      }

      /* Mapa, mandala y el resto: la técnica entera repartida en bloques. */
      n0(t.n, t.resumen);
      if (fi.formula) { n1('Fórmula', fi.formula); if (fi.proporciones) n2(fi.proporciones); }
      if ((fi.productos || []).length) {
        n1('Productos', fi.cantidades || '');
        fi.productos.forEach(function (p) { n2(p); });
      }
      if (fi.tiempos) { n1('Tiempos', fi.tiempos); if (fi.temperaturas) n2(fi.temperaturas); }
      if ((fi.herramientas || []).length) {
        n1('Herramientas', '');
        fi.herramientas.forEach(function (h) { n2(h); });
      }
      if ((fi.errores || []).length) {
        n1('Errores frecuentes', '');
        fi.errores.forEach(function (e) { n2(e); });
      }
      if ((fi.seguridad || []).length) {
        n1('Seguridad', 'Lo que no se negocia');
        fi.seguridad.forEach(function (s) { n2(s); });
      }
      if ((fi.recomendaciones || []).length) {
        n1('Recomendaciones', '');
        fi.recomendaciones.forEach(function (r) { n2(r); });
      }
      if (out.length === 1) pasos.forEach(function (p) { n1(p.t, p.n); });
      return out;
    },

    divisionesCatalogo: function () { return clon(DIVISIONES); },

    /* Lista de técnicas, opcionalmente de una familia. */
    listar: function (fam) {
      return todas()
        .filter(function (t) { return !fam || t.fam === fam; })
        .map(function (t) {
          var x = fundir(t, parches[t.id]);
          return { id: x.id, fam: x.fam, n: x.n, resumen: x.resumen, propia: !!x.propia };
        });
    },

    /* La técnica completa, ya con los cambios de la alumna aplicados. */
    obtener: function (id) {
      var b = todas().filter(function (t) { return t.id === id; })[0];
      return b ? fundir(b, parches[id]) : null;
    },

    ficha: function (id) { var t = C.obtener(id); return t ? t.ficha : null; },
    pasos: function (id) { var t = C.obtener(id); return t ? t.pasos : []; },
    repaso: function (id) { var t = C.obtener(id); return t ? t.repaso || [] : []; },

    /* Divisiones resueltas: id + su definición del catálogo. */
    divisiones: function (id) {
      var t = C.obtener(id);
      if (!t) return [];
      return (t.divs || []).map(function (d) {
        var def = DIVISIONES[d] || {};
        return { id: d, n: def.n || d, tipo: def.tipo, y: def.y, x: def.x, k: def.k, d: def.d };
      });
    },

    /* Narración: el texto de todos los pasos, listo para leer o grabar. */
    narracion: function (id) {
      return C.pasos(id).map(function (p) { return p.n; });
    },

    /* La lámina animada pregunta esto: qué toca en el momento t (0-1). */
    pasoEn: function (id, t) {
      var ps = C.pasos(id);
      if (!ps.length) return null;
      var total = ps.reduce(function (a, p) { return a + (p.d || 5); }, 0);
      var acum = 0, corte = t * total;
      for (var i = 0; i < ps.length; i++) {
        var dur = ps[i].d || 5;
        if (corte <= acum + dur) {
          return { i: i, total: ps.length, paso: ps[i], avance: (corte - acum) / dur };
        }
        acum += dur;
      }
      return { i: ps.length - 1, total: ps.length, paso: ps[ps.length - 1], avance: 1 };
    },

    duracion: function (id) {
      return C.pasos(id).reduce(function (a, p) { return a + (p.d || 5); }, 0);
    },

    /* Guardar un cambio. Parcial: solo lo que se toca. */
    guardar: function (id, parche) {
      if (!id || !parche) return;
      var p = parches[id] || (parches[id] = {});
      Object.keys(parche).forEach(function (k) {
        if (k === 'ficha') {
          p.ficha = p.ficha || {};
          Object.keys(parche.ficha).forEach(function (c) { p.ficha[c] = parche.ficha[c]; });
        } else p[k] = parche[k];
      });
      persistir();
      avisar(id);
    },

    /* Un solo campo de la ficha. Lo usa el editor campo a campo. */
    guardarCampo: function (id, campo, valor) {
      var f = {}; f[campo] = valor;
      C.guardar(id, { ficha: f });
    },

    /* Devolver una técnica a su estado original. */
    restaurar: function (id) {
      delete parches[id];
      persistir();
      avisar(id);
    },

    modificada: function (id) { return !!parches[id]; },

    /* Alta de una técnica nueva desde la interfaz. */
    crear: function (t) {
      if (!t || !t.n) return null;
      var id = t.id || ('propia_' + Date.now().toString(36));
      var nueva = {
        id: id, fam: t.fam || 'color', n: t.n, resumen: t.resumen || '',
        propia: true, divs: t.divs || ['orejas', 'media'],
        ficha: f(t.ficha || {}), pasos: t.pasos || [], repaso: t.repaso || []
      };
      propias.push(nueva);
      persistir();
      avisar(id);
      return id;
    },

    borrar: function (id) {
      propias = propias.filter(function (t) { return t.id !== id; });
      delete parches[id];
      persistir();
      avisar(id);
    },

    /* Avisos de cambio: la lámina, la ficha y el vídeo se redibujan solos. */
    suscribir: function (fn) {
      oyentes.push(fn);
      return function () { oyentes = oyentes.filter(function (o) { return o !== fn; }); };
    },

    /* Para la evaluación: nunca bloquea, solo devuelve el porqué. */
    corregir: function (id, respuestas) {
      var qs = C.repaso(id), r = [];
      qs.forEach(function (q, i) {
        var dada = respuestas ? respuestas[i] : null;
        r.push({
          pregunta: q.p, dada: dada, correcta: q.c,
          acierto: dada === q.c, porque: q.x, opciones: q.o
        });
      });
      return { total: qs.length, aciertos: r.filter(function (x) { return x.acierto; }).length, detalle: r, bloquea: false };
    }
  };

  window.EU_CEREBRO = C;
})();
