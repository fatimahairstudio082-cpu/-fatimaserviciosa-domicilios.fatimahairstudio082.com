/* ═══════════════════════════════════════════════════════════════════════════
   CEREBRO DE REDACCIÓN · Folletos Pro (Bloque 6)
   ───────────────────────────────────────────────────────────────────────────
   Escribe solo los textos del folleto: título, subtítulo, el nombre y la
   descripción de cada cuadro, el precio, la etiqueta, la llamada a la acción
   y el guion que leerá la voz.

   · 100% en el dispositivo. Sin claves, sin internet, sin coste.
   · Humanizado: las frases se construyen, no se copian de una lista fija.
     Ritmo variado, sin repetir pieza dentro del mismo folleto, y con el
     trato (tú / usted) coherente según el tono elegido.
   · Determinista: la misma semilla da el mismo folleto. El botón «Otra
     versión» sólo cambia la semilla.

   API pública:
     FOLLETO_CEREBRO.generar({rubro, tono, n, negocio, ciudad, semilla})
     FOLLETO_CEREBRO.regenerar(campo, ctx)
     FOLLETO_CEREBRO.rubros()  ·  FOLLETO_CEREBRO.tonos()
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_CEREBRO_LOADED) return;
  window._B6_FOLLETO_CEREBRO_LOADED = true;

  /* ───────────────────────── Azar con semilla ───────────────────────── */

  function motorAzar(semilla) {
    var s = (semilla >>> 0) || 1;
    return function () {
      s += 0x6D2B79F5;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function uno(rng, lista) {
    return lista[Math.floor(rng() * lista.length) % lista.length];
  }

  /* Bolsa sin reposición: dentro de un mismo folleto no se repite ninguna
     pieza hasta que se han gastado todas. Es lo que evita que los 8 cuadros
     suenen al mismo texto. */
  function Bolsa(rng, lista) {
    this.rng = rng;
    this.origen = lista.slice();
    this.quedan = [];
  }
  Bolsa.prototype.coger = function () {
    if (!this.origen.length) return '';
    if (!this.quedan.length) {
      this.quedan = this.origen.slice();
      // barajado Fisher-Yates con la misma semilla
      for (var i = this.quedan.length - 1; i > 0; i--) {
        var j = Math.floor(this.rng() * (i + 1));
        var tmp = this.quedan[i]; this.quedan[i] = this.quedan[j]; this.quedan[j] = tmp;
      }
    }
    return this.quedan.pop();
  };

  /* ───────────────────────── Tonos de voz ───────────────────────── */

  var TONOS = {
    elegante: {
      nombre: 'Elegante',
      trato: 'usted',
      ritmo: ['medio', 'largo', 'medio', 'corto'],
      cierres: [
        'Siempre con cita previa.',
        'El tiempo de cada sesión se reserva en exclusiva.',
        'Le asesoramos antes de empezar.',
        'Sin prisas y con el detalle cuidado.'
      ],
      ctas: ['Reserve su cita', 'Consúltenos', 'Pida hora', 'Le esperamos'],
      remates: ['Un trabajo hecho con criterio.', 'Calidad que se nota al tacto.']
    },
    cercano: {
      nombre: 'Cercano',
      trato: 'tu',
      ritmo: ['corto', 'medio', 'corto', 'largo'],
      cierres: [
        'Te lo explicamos todo antes de empezar.',
        'Y si tienes dudas, preguntas y ya está.',
        'Sales sabiendo cómo mantenerlo en casa.',
        'Aquí se viene a estar a gusto.'
      ],
      ctas: ['Pide tu cita', 'Escríbenos', 'Te esperamos', 'Reserva tu hueco'],
      remates: ['Como te gusta a ti.', 'Sencillo y bien hecho.']
    },
    vendedor: {
      nombre: 'Vendedor',
      trato: 'tu',
      ritmo: ['corto', 'corto', 'medio', 'medio'],
      cierres: [
        'Plazas limitadas cada semana.',
        'Precio cerrado, sin sorpresas.',
        'Incluye el diagnóstico previo.',
        'Reserva antes de que se llene.'
      ],
      ctas: ['Reserva hoy', 'Aprovecha ya', 'Coge tu cita', 'Últimas plazas'],
      remates: ['Al mejor precio del mes.', 'Resultado garantizado.']
    },
    informativo: {
      nombre: 'Informativo',
      trato: 'neutro',
      ritmo: ['medio', 'medio', 'largo', 'medio'],
      cierres: [
        'Duración aproximada de una hora.',
        'Incluye lavado, tratamiento y peinado.',
        'Se recomienda repetir cada seis semanas.',
        'Apto para todo tipo de cabello.'
      ],
      ctas: ['Más información', 'Consultar disponibilidad', 'Ver horarios', 'Solicitar cita'],
      remates: ['Servicio realizado por profesional titulado.', 'Producto profesional incluido.']
    },
    lujo: {
      nombre: 'Lujo',
      trato: 'usted',
      ritmo: ['corto', 'corto', 'corto', 'medio'],
      cierres: [
        'Sólo con reserva.',
        'Atención personal, de principio a fin.',
        'Producto de alta gama.',
        'Su tiempo, en exclusiva.'
      ],
      ctas: ['Reserve', 'Solicite su cita', 'Atención exclusiva', 'Agenda privada'],
      remates: ['Excelencia, sin atajos.', 'El detalle lo es todo.']
    }
  };

  /* ───────────────────────── Bancos por rubro ─────────────────────────
     Cada servicio: n = nombre · p = [precio mín, máx] · d = variantes de
     descripción escritas a mano (de ahí sale que no suene a plantilla).   */

  var RUBROS = {

    peluqueria: {
      nombre: 'Peluquería',
      titulos: ['Carta de Servicios', 'Nuestro Salón', 'Tu Pelo, a Punto', 'Servicios de Peluquería'],
      subs: ['Corte, color y cuidado con criterio profesional',
             'Trabajamos cada cabello según lo que necesita',
             'Del diagnóstico al peinado final',
             'Un salón para venir con tiempo'],
      serv: [
        { n: 'Corte con asesoría', p: [18, 30], d: [
          'Miramos tu cara y tu tipo de pelo antes de tocar las tijeras.',
          'Un corte pensado para ti, que aguanta bien entre visita y visita.'] },
        { n: 'Lavado y peinado', p: [12, 22], d: [
          'Lavado con masaje y secado con forma, para salir a la calle.',
          'El peinado que necesitas cuando tienes algo que celebrar.'] },
        { n: 'Color de raíz', p: [28, 45], d: [
          'Cubre la raíz sin cambiar el tono que ya llevas.',
          'Retoque limpio de raíz, respetando el largo trabajado.'] },
        { n: 'Recogido de fiesta', p: [35, 60], d: [
          'Recogidos que aguantan toda la noche sin recolocarse.',
          'Lo probamos antes del día señalado, para ir sobre seguro.'] },
        { n: 'Tratamiento de brillo', p: [20, 38], d: [
          'Sella la fibra y devuelve el brillo que se pierde con el tiempo.',
          'Media hora que cambia cómo refleja la luz tu pelo.'] },
        { n: 'Corte infantil', p: [10, 16], d: [
          'Con paciencia y sin prisas, para que no sea un mal rato.',
          'Rápido, cómodo y con la forma que le queda bien.'] },
        { n: 'Alisado de queratina', p: [60, 120], d: [
          'Domina el encrespado durante meses, sin dejarlo lacio del todo.',
          'Menos secador cada mañana y el pelo más manejable.'] },
        { n: 'Tratamiento anticaída', p: [30, 55], d: [
          'Trabajamos el cuero cabelludo, que es donde está el problema.',
          'Sesiones pautadas y revisión al mes para ver si responde.'] }
      ]
    },

    color: {
      nombre: 'Color',
      titulos: ['Carta de Color', 'Servicios de Coloración', 'Color a Medida', 'Tu Color, Bien Hecho'],
      subs: ['Colorimetría con diagnóstico previo',
             'Cada fórmula se calcula para tu base real',
             'Color que respeta la salud del cabello',
             'Del tono soñado al tono posible, y bien'],
      serv: [
        { n: 'Color completo', p: [40, 70], d: [
          'Fórmula calculada sobre tu base real, no sobre la foto.',
          'Cambiamos el tono de raíz a puntas con una sola aplicación.'] },
        { n: 'Corrección de color', p: [60, 120], d: [
          'Arreglamos naranjas, verdes y tirones de tinte anterior.',
          'Trabajo por fases: primero sanear, después igualar el tono.'] },
        { n: 'Matiz y tonalizado', p: [18, 35], d: [
          'Quita el amarillo y devuelve el tono frío que buscabas.',
          'Un matiz cada pocas semanas mantiene el rubio limpio.'] },
        { n: 'Cobertura de canas', p: [30, 50], d: [
          'Cobertura completa con un resultado natural, no plano.',
          'Elegimos el reflejo para que la cana no vuelva a marcar.'] },
        { n: 'Diagnóstico capilar', p: [0, 15], d: [
          'Miramos porosidad, base y qué aguanta tu pelo antes de decidir.',
          'Media hora de estudio que ahorra disgustos y dinero.'] },
        { n: 'Color fantasía', p: [55, 110], d: [
          'Tonos vivos con la decoloración controlada y por pasos.',
          'Del pastel al intenso, midiendo lo que el cabello soporta.'] },
        { n: 'Baño de color', p: [20, 38], d: [
          'Da brillo y aviva el tono sin usar amoniaco.',
          'Ideal entre color y color, cuando el pelo pide descanso.'] },
        { n: 'Decoloración global', p: [70, 140], d: [
          'Aclarado completo por fases, vigilando la fibra en cada paso.',
          'El cambio grande, hecho con cabeza y con protector.'] }
      ]
    },

    mechas: {
      nombre: 'Mechas y balayage',
      titulos: ['Mechas y Balayage', 'Nuestras Técnicas de Luz', 'Carta de Mechas', 'Luz en tu Pelo'],
      subs: ['Técnicas de aclarado con la fibra cuidada',
             'Luz que crece bonita y sin raíz marcada',
             'Balayage, babylights, mechas y contrastes',
             'Aclarados progresivos, sin castigar el cabello'],
      serv: [
        { n: 'Balayage', p: [70, 130], d: [
          'Luz pintada a mano que crece sin dejar raíz marcada.',
          'Barrido natural, más claro en puntas y suave en la raíz.'] },
        { n: 'Babylights', p: [65, 120], d: [
          'Mechas finísimas que imitan el pelo aclarado por el sol.',
          'Da luz sin que se note la técnica; el efecto es de niña.'] },
        { n: 'Mechas californianas', p: [60, 110], d: [
          'Degradado de medios a puntas, con el largo iluminado.',
          'Ideal si quieres cambio pero sin mantenimiento mensual.'] },
        { n: 'Mechas con papel', p: [50, 90], d: [
          'Aclarado más marcado y uniforme, de raíz a puntas.',
          'Control total del nivel de aclarado en cada mecha.'] },
        { n: 'Retoque de raíz aclarada', p: [45, 80], d: [
          'Mantiene la mecha viva sin repetir todo el largo.',
          'Sólo se trabaja el crecimiento, que es lo que se ve.'] },
        { n: 'Baño de color post-mecha', p: [20, 35], d: [
          'Cierra la cutícula y fija el tono recién aclarado.',
          'El paso que hace que el rubio dure limpio más semanas.'] },
        { n: 'Corrección de mechas', p: [70, 130], d: [
          'Igualamos mechas anchas, manchadas o con la raíz cortada.',
          'Se rescata lo que hay antes de volver a aclarar.'] },
        { n: 'Iluminación de contorno', p: [40, 75], d: [
          'Luz sólo alrededor de la cara, que es donde más se ve.',
          'Cambio pequeño y barato con efecto grande en la foto.'] }
      ]
    },

    unas: {
      nombre: 'Uñas',
      titulos: ['Carta de Manicura', 'Uñas y Cuidado de Manos', 'Nuestros Servicios de Uñas', 'Manos a Punto'],
      subs: ['Manicura, esmaltado y uña esculpida',
             'Trabajo cuidado, con material esterilizado',
             'Del cuidado básico al diseño completo',
             'Uñas que duran y manos cuidadas'],
      serv: [
        { n: 'Manicura completa', p: [15, 25], d: [
          'Limado, cutícula y esmaltado, con las manos hidratadas.',
          'La base de todo: uña sana antes que uña bonita.'] },
        { n: 'Esmaltado semipermanente', p: [18, 30], d: [
          'Color que aguanta tres semanas sin saltarse.',
          'Brillo de primer día durante todo el mes.'] },
        { n: 'Uñas esculpidas', p: [35, 60], d: [
          'Largo y forma a medida, con acabado resistente.',
          'Estructura bien hecha: ni pesan ni se despegan.'] },
        { n: 'Relleno de uñas', p: [25, 40], d: [
          'Mantenimiento cada tres o cuatro semanas.',
          'Se rellena el crecimiento y se revisa la forma.'] },
        { n: 'Nail art', p: [5, 20], d: [
          'Diseños a mano, desde la línea fina al degradado.',
          'Desde un detalle discreto hasta la uña completa.'] },
        { n: 'Pedicura spa', p: [25, 40], d: [
          'Baño, exfoliación, durezas y esmaltado, con masaje.',
          'Una hora de descanso que además se nota al andar.'] },
        { n: 'Manicura rusa', p: [25, 40], d: [
          'Cutícula trabajada al detalle, con acabado muy limpio.',
          'El esmaltado llega al borde y por eso dura más.'] },
        { n: 'Retirada de esmaltado', p: [8, 15], d: [
          'Se quita sin limar de más ni castigar la uña.',
          'Mejor esto que arrancarlo en casa, que deja la uña fina.'] }
      ]
    },

    maquillaje: {
      nombre: 'Maquillaje',
      titulos: ['Servicios de Maquillaje', 'Maquillaje Profesional', 'Tu Día, tu Cara', 'Carta de Maquillaje'],
      subs: ['Maquillaje social, de novia y de fotografía',
             'Producto profesional de larga duración',
             'Prueba previa incluida en los eventos',
             'Te maquillamos y te enseñamos a hacerlo'],
      serv: [
        { n: 'Maquillaje de día', p: [25, 40], d: [
          'Piel luminosa y natural, para que sigas siendo tú.',
          'Lo justo para verte descansada sin parecer maquillada.'] },
        { n: 'Maquillaje de noche', p: [35, 55], d: [
          'Ojo trabajado y fijado para aguantar hasta el final.',
          'Intensidad medida, que se ve bien en foto y en persona.'] },
        { n: 'Maquillaje de novia', p: [80, 160], d: [
          'Con prueba previa, para llegar al día sin sorpresas.',
          'Larga duración, resistente a lágrimas y a horas de fotos.'] },
        { n: 'Clase de automaquillaje', p: [40, 70], d: [
          'Aprendes con tus productos y sobre tu propia cara.',
          'Sales sabiendo repetirlo sola en veinte minutos.'] },
        { n: 'Diseño de cejas', p: [12, 22], d: [
          'La forma cambia la mirada más que cualquier otra cosa.',
          'Medimos la cara y respetamos el grosor natural.'] },
        { n: 'Pestañas postizas', p: [10, 25], d: [
          'Pelo a pelo o en tira, según lo que aguante tu ojo.',
          'Colocación cómoda, que no pesa ni molesta.'] },
        { n: 'Maquillaje de fotografía', p: [50, 95], d: [
          'Preparado para el flash: sin brillos ni polvos que reboten.',
          'Lo que se ve raro en persona es lo que sale bien en foto.'] },
        { n: 'Asesoría de color', p: [25, 45], d: [
          'Qué tonos te encienden la cara y cuáles te apagan.',
          'Sales con tu carta de colores y dejas de fallar comprando.'] }
      ]
    },

    estetica: {
      nombre: 'Estética facial',
      titulos: ['Cabina Facial', 'Tratamientos de Estética', 'Cuidado de tu Piel', 'Carta de Cabina'],
      subs: ['Limpieza, hidratación y tratamiento de cabina',
             'Protocolos según el tipo de piel',
             'Resultados que se ven desde la primera sesión',
             'Diagnóstico de piel antes de cada protocolo'],
      serv: [
        { n: 'Limpieza facial profunda', p: [30, 50], d: [
          'Extracción cuidadosa y piel calmada al terminar.',
          'El tratamiento que descongestiona y prepara la piel.'] },
        { n: 'Hidratación intensiva', p: [35, 55], d: [
          'Devuelve agua y confort a la piel tirante.',
          'Se nota al tacto el mismo día de la sesión.'] },
        { n: 'Tratamiento antiedad', p: [45, 80], d: [
          'Trabaja firmeza y líneas finas por sesiones.',
          'Protocolo progresivo, con resultados acumulativos.'] },
        { n: 'Peeling facial', p: [40, 70], d: [
          'Renueva la superficie y unifica el tono.',
          'Menos marcas, más luz, con la piel protegida después.'] },
        { n: 'Presoterapia facial', p: [25, 45], d: [
          'Descongestiona y desinflama la zona de ojos y mandíbula.',
          'Ideal cuando la cara amanece hinchada.'] },
        { n: 'Bono de 5 sesiones', p: [150, 300], d: [
          'El precio por sesión baja y el resultado se sostiene.',
          'Constancia: es lo que de verdad cambia una piel.'] },
        { n: 'Radiofrecuencia facial', p: [45, 85], d: [
          'Calor controlado que trabaja firmeza en óvalo y cuello.',
          'No duele y se puede volver a la calle al terminar.'] },
        { n: 'Tratamiento antimanchas', p: [45, 80], d: [
          'Aclara la mancha y evita que vuelva con protección diaria.',
          'Requiere constancia y sombra: sin eso no hay resultado.'] }
      ]
    },

    barberia: {
      nombre: 'Barbería',
      titulos: ['Carta de Barbería', 'Servicios de Caballero', 'Barbería Clásica', 'Corte y Barba'],
      subs: ['Corte, barba y afeitado a navaja',
             'Trabajo clásico con producto profesional',
             'Sin cita larga: entras y sales a punto',
             'Del degradado al afeitado tradicional'],
      serv: [
        { n: 'Corte de caballero', p: [12, 20], d: [
          'Tijera y máquina, con el remate de cuello a navaja.',
          'La forma que te va, y que se mantiene sola tres semanas.'] },
        { n: 'Degradado', p: [14, 22], d: [
          'Transición limpia, sin escalones ni cortes de luz.',
          'Del cero al largo, con el degradado a la altura que pidas.'] },
        { n: 'Arreglo de barba', p: [10, 18], d: [
          'Perfilado, largo igualado y aceite al terminar.',
          'La barba deja de parecer descuidada en quince minutos.'] },
        { n: 'Afeitado a navaja', p: [15, 25], d: [
          'Toalla caliente, navaja y bálsamo. El clásico.',
          'Apurado de verdad, con la piel calmada después.'] },
        { n: 'Corte + barba', p: [20, 32], d: [
          'El pack completo, salir listo de una sentada.',
          'Cara y pelo a juego, que es como se nota.'] },
        { n: 'Corte infantil', p: [9, 14], d: [
          'Con paciencia y buen rollo, para que vuelva contento.',
          'Rápido y sin líos, con el resultado que él quiere.'] },
        { n: 'Perfilado de cejas', p: [6, 12], d: [
          'Se quita lo que sobra sin que se note que estás depilado.',
          'Cinco minutos que cambian la cara más de lo que parece.'] },
        { n: 'Coloración de canas', p: [15, 30], d: [
          'Rebaja la cana sin dejarla de un color plano.',
          'Se difumina, no se tapa: queda natural.'] }
      ]
    },

    nutricion: {
      nombre: 'Nutrición',
      titulos: ['Plan de Nutrición', 'Asesoría Nutricional', 'Come Mejor', 'Nuestros Planes'],
      subs: ['Planes reales, para vidas reales',
             'Sin dietas milagro ni pasar hambre',
             'Acompañamiento y seguimiento semanal',
             'Cambios que se sostienen en el tiempo'],
      serv: [
        { n: 'Primera consulta', p: [30, 55], d: [
          'Hablamos de tus horarios, tus gustos y tu punto de partida.',
          'De aquí sale el plan; sin esto, cualquier dieta es a ciegas.'] },
        { n: 'Plan semanal', p: [25, 45], d: [
          'Menú cerrado con lista de la compra incluida.',
          'Comida normal, de supermercado, que se cocina rápido.'] },
        { n: 'Seguimiento mensual', p: [20, 40], d: [
          'Ajustamos el plan según lo que ha funcionado.',
          'Lo que no encaja en tu vida se cambia, no se aguanta.'] },
        { n: 'Educación nutricional', p: [25, 45], d: [
          'Aprendes a leer etiquetas y a montar tu propio plato.',
          'El objetivo es que dejes de necesitarnos.'] },
        { n: 'Plan deportivo', p: [35, 60], d: [
          'Comida ajustada a tus entrenamientos y descansos.',
          'Rendir mejor sin vivir contando gramos.'] },
        { n: 'Bono trimestral', p: [90, 180], d: [
          'Tres meses de acompañamiento con revisiones incluidas.',
          'El tiempo que hace falta para que se vuelva costumbre.'] },
        { n: 'Estudio de composición', p: [20, 40], d: [
          'Miramos músculo, grasa y agua, no sólo lo que marca la báscula.',
          'El número del peso solo, sin esto, engaña.'] },
        { n: 'Plan vegetariano', p: [25, 50], d: [
          'Proteína y hierro cubiertos, sin carne y sin suplementos raros.',
          'Menús completos, pensados para no quedarse corta.'] }
      ]
    },

    fitness: {
      nombre: 'Fitness',
      titulos: ['Entrenamiento', 'Nuestras Clases', 'Muévete con Nosotras', 'Plan de Entrenamiento'],
      subs: ['Rutinas por nivel, con la técnica cuidada',
             'Grupos pequeños y corrección individual',
             'Entrena en casa o en sala, tú eliges',
             'Progresión medida, sin lesiones'],
      serv: [
        { n: 'Entrenamiento personal', p: [25, 45], d: [
          'Una hora sólo para ti, con la técnica corregida.',
          'El plan se adapta a tus molestias y a tu ritmo.'] },
        { n: 'Clase en grupo', p: [8, 15], d: [
          'Grupos pequeños, para que nadie entrene sin mirar.',
          'Sesiones de una hora con calentamiento y vuelta a la calma.'] },
        { n: 'Rutina para casa', p: [15, 30], d: [
          'Sin material o con lo mínimo, en veinte minutos.',
          'Pensada para hacerla los días que no da tiempo a nada.'] },
        { n: 'Suelo pélvico y core', p: [20, 35], d: [
          'Trabajo profundo que se nota en la postura y en el día a día.',
          'Especialmente indicado después del embarazo.'] },
        { n: 'Valoración inicial', p: [0, 20], d: [
          'Miramos movilidad, fuerza y de dónde partes.',
          'Sin valoración no hay progresión, sólo suerte.'] },
        { n: 'Bono mensual', p: [40, 80], d: [
          'Entrenas las veces que quieras dentro del mes.',
          'Sale a cuenta desde la tercera sesión.'] },
        { n: 'Clase de estiramientos', p: [8, 16], d: [
          'Media hora que te quita la espalda cargada del trabajo.',
          'Movilidad de verdad, no cuatro estiramientos sueltos.'] },
        { n: 'Plan de fuerza', p: [30, 60], d: [
          'Progresión por semanas, con las cargas anotadas.',
          'Ganar fuerza es lo que sostiene todo lo demás.'] }
      ]
    },

    cursos: {
      nombre: 'Cursos y academia',
      titulos: ['Formación Profesional', 'Nuestros Cursos', 'Aprende con Nosotras', 'Academia'],
      subs: ['Formación práctica con modelo real',
             'Plazas limitadas y material incluido',
             'De cero a trabajar: temario completo',
             'Certificado al terminar cada módulo'],
      serv: [
        { n: 'Curso de colorimetría', p: [180, 400], d: [
          'Aprendes a calcular la fórmula, no a copiarla.',
          'Base, reflejo, volumen y neutralización, con práctica.'] },
        { n: 'Curso de mechas', p: [200, 450], d: [
          'Balayage, babylights y papel, sobre cabeza real.',
          'Sales con la técnica en la mano, no sólo en apuntes.'] },
        { n: 'Curso de corte', p: [150, 350], d: [
          'Las bases geométricas que sirven para cualquier corte.',
          'Tijera, navaja y máquina, con corrección constante.'] },
        { n: 'Curso de uñas', p: [180, 380], d: [
          'Del limado a la esculpida, con material profesional.',
          'Prácticas suficientes para coger velocidad.'] },
        { n: 'Módulo de bioseguridad', p: [60, 120], d: [
          'Higiene, esterilización y protocolo, que es lo que te protege.',
          'Obligatorio si quieres trabajar en serio.'] },
        { n: 'Clase suelta', p: [40, 90], d: [
          'Una técnica concreta en una tarde.',
          'Para reciclarte sin meterte en un curso entero.'] },
        { n: 'Curso de recogidos', p: [150, 320], d: [
          'Base, sujeción y acabado, que es lo que aguanta la noche.',
          'Novias, comuniones y fiesta, con práctica sobre cabeza.'] },
        { n: 'Curso de barbería', p: [180, 400], d: [
          'Degradados, navaja y barba, de cero a soltarse.',
          'Mucha máquina en la mano, poco apunte.'] }
      ]
    },

    ofertas: {
      nombre: 'Promociones',
      titulos: ['Promociones del Mes', 'Ofertas Especiales', 'Packs y Descuentos', 'Este Mes en el Salón'],
      subs: ['Precios cerrados durante todo el mes',
             'Packs pensados para ahorrar de verdad',
             'Sólo con cita previa y hasta fin de existencias',
             'Las combinaciones que más nos piden'],
      serv: [
        { n: 'Pack corte + color', p: [45, 75], d: [
          'Los dos servicios en la misma cita y a mejor precio.',
          'Ahorras tiempo y ahorras dinero, en una tarde.'] },
        { n: 'Pack novia', p: [120, 250], d: [
          'Prueba, peinado y maquillaje del día, cerrado.',
          'Todo el día señalado resuelto con una sola reserva.'] },
        { n: 'Martes de manicura', p: [12, 20], d: [
          'Precio especial de manicura todos los martes.',
          'El día tranquilo de la semana, al mejor precio.'] },
        { n: 'Trae a una amiga', p: [0, 15], d: [
          'Las dos os lleváis descuento en el servicio.',
          'Venir acompañada sale más barato para las dos.'] },
        { n: 'Bono de 5 servicios', p: [90, 200], d: [
          'Pagas cuatro y te llevas cinco.',
          'Sin caducidad corta: lo gastas cuando puedes.'] },
        { n: 'Primera visita', p: [0, 20], d: [
          'Diagnóstico gratuito si es tu primera vez aquí.',
          'Nos conocemos sin compromiso y decides después.'] },
        { n: 'Pack madre e hija', p: [40, 90], d: [
          'Las dos en la misma cita, cada una con lo suyo.',
          'Una tarde juntas y las dos salís arregladas.'] },
        { n: 'Bono de cabina', p: [100, 220], d: [
          'Cinco sesiones de facial al precio de cuatro.',
          'La piel cambia con la serie, no con una sesión suelta.'] }
      ]
    },

    salon: {
      nombre: 'Salón (general)',
      titulos: ['Nuestro Salón', 'Todo lo que Hacemos', 'Servicios', 'Bienvenida'],
      subs: ['Peluquería, estética y uñas en un mismo sitio',
             'Todo tu cuidado, con una sola cita',
             'Equipo formado y producto profesional',
             'Un espacio para cuidarte con calma'],
      serv: [
        { n: 'Peluquería', p: [15, 60], d: [
          'Corte, color y tratamiento, con diagnóstico antes.',
          'Desde el retoque rápido al cambio completo.'] },
        { n: 'Estética facial', p: [30, 70], d: [
          'Cabina con protocolos según tu tipo de piel.',
          'Limpieza, hidratación y antiedad por sesiones.'] },
        { n: 'Manicura y pedicura', p: [15, 40], d: [
          'Manos y pies cuidados, con material esterilizado.',
          'Del cuidado básico al esmaltado que dura semanas.'] },
        { n: 'Depilación', p: [8, 35], d: [
          'Cera tibia por zonas, rápida y con la piel calmada.',
          'Tratamos la piel antes y después, no sólo el pelo.'] },
        { n: 'Novias y eventos', p: [80, 200], d: [
          'Prueba previa y todo el día resuelto.',
          'Peinado, maquillaje y uñas coordinados.'] },
        { n: 'Asesoría de imagen', p: [30, 60], d: [
          'Qué te favorece y por qué, explicado con calma.',
          'Color, forma y mantenimiento realista para tu día a día.'] },
        { n: 'Tratamiento capilar', p: [25, 60], d: [
          'Elegimos el tratamiento según lo que le falte a tu pelo.',
          'Hidratación, proteína o cuero cabelludo: no es lo mismo.'] },
        { n: 'Maquillaje social', p: [25, 55], d: [
          'Para la boda, la cena o la foto que te toca.',
          'Aguanta las horas y sigue pareciendo tu cara.'] }
      ]
    },

    /* ───────── Sectores fuera de la peluquería ─────────
       Mismo formato que los de arriba: la herramienta ya no es sólo para
       salones. El desplegable se llena solo desde FOLLETO_CEREBRO.rubros(). */

    restaurante: {
      nombre: 'Restaurante y bar',
      titulos: ['Nuestra Carta', 'Carta del Día', 'Lo que Cocinamos', 'Menú de la Casa'],
      subs: ['Cocina de mercado, hecha al momento',
             'Producto de temporada y de cercanía',
             'Para comer aquí o llevar',
             'Reserva tu mesa y ven con hambre'],
      serv: [
        { n: 'Menú del día', p: [11, 18], d: [
          'Primero, segundo, postre y bebida, cambia cada día.',
          'Casero de verdad, del que llena y no repite.'] },
        { n: 'Tapas y raciones', p: [4, 12], d: [
          'Para picar entre varios y probar de todo.',
          'Las de siempre bien hechas, sin florituras.'] },
        { n: 'Carne a la brasa', p: [14, 26], d: [
          'A la parrilla y en su punto, como la pides.',
          'Corte del día según lo que llega fresco.'] },
        { n: 'Pescado del día', p: [15, 28], d: [
          'Lo que ha entrado de la lonja esta mañana.',
          'A la plancha o al horno, respetando el producto.'] },
        { n: 'Menú de grupo', p: [20, 40], d: [
          'Cerrado y a buen precio para celebraciones.',
          'Nos dices cuántos sois y lo dejamos montado.'] },
        { n: 'Postres caseros', p: [4, 7], d: [
          'Hechos aquí, no vienen en caja.',
          'El punto dulce para cerrar la comida.'] },
        { n: 'Comida para llevar', p: [8, 20], d: [
          'La misma cocina, empaquetada para casa.',
          'Pide por teléfono y lo tienes listo al pasar.'] },
        { n: 'Desayunos', p: [2, 6], d: [
          'Café, tostada y zumo para empezar bien.',
          'Barra rápida o mesa con calma, tú eliges.'] }
      ]
    },

    cafeteria: {
      nombre: 'Cafetería y panadería',
      titulos: ['Nuestra Cafetería', 'Café y Dulce', 'Recién Horneado', 'Para Endulzar el Día'],
      subs: ['Café de tueste natural y masa madre',
             'Todo se hornea aquí cada mañana',
             'Para desayunar, merendar o llevar',
             'El rincón para tu pausa del día'],
      serv: [
        { n: 'Café de especialidad', p: [1, 3], d: [
          'Grano seleccionado y molido al momento.',
          'Del espresso corto al flat white cremoso.'] },
        { n: 'Bollería artesana', p: [1, 4], d: [
          'Croissant y napolitana de mantequilla de verdad.',
          'Hojaldre que cruje, hecho aquí de madrugada.'] },
        { n: 'Pan de masa madre', p: [2, 5], d: [
          'Fermentación lenta, corteza fina y miga tierna.',
          'El pan que aguanta bueno hasta el día siguiente.'] },
        { n: 'Tartas por porción', p: [3, 6], d: [
          'De zanahoria, queso o chocolate, cambia cada semana.',
          'La porción justa para acompañar el café.'] },
        { n: 'Desayuno completo', p: [3, 7], d: [
          'Café, zumo natural y tostada con lo que quieras.',
          'Empezar el día como toca, sin prisas.'] },
        { n: 'Tartas por encargo', p: [18, 45], d: [
          'Para el cumple o la celebración, a tu gusto.',
          'Nos dices sabor y personas y la preparamos.'] },
        { n: 'Batidos y zumos', p: [2, 5], d: [
          'Fruta natural exprimida al momento.',
          'Frescos de verdad, sin concentrados.'] },
        { n: 'Merienda para llevar', p: [2, 6], d: [
          'Dulce y bebida listos para el camino.',
          'La parada rápida cuando vas con el tiempo justo.'] }
      ]
    },

    moda: {
      nombre: 'Tienda de ropa y moda',
      titulos: ['Nueva Colección', 'Nuestra Tienda', 'Lo Nuevo de Temporada', 'Estilo para Ti'],
      subs: ['Prendas seleccionadas una a una',
             'Moda que se lleva y no pasa de moda',
             'Tallas y estilos para todas',
             'Cambios y asesoramiento sin compromiso'],
      serv: [
        { n: 'Colección nueva', p: [20, 80], d: [
          'Lo último que ha llegado, en tienda y probador.',
          'Piezas de temporada listas para combinar.'] },
        { n: 'Básicos de fondo de armario', p: [10, 35], d: [
          'Lo que te pones siempre y nunca falla.',
          'Calidad que aguanta lavado tras lavado.'] },
        { n: 'Vestidos de evento', p: [40, 120], d: [
          'Para la boda, la cena o la ocasión especial.',
          'Te ayudamos a elegir el que te favorece.'] },
        { n: 'Complementos', p: [5, 40], d: [
          'Bolsos, pañuelos y bisutería que rematan el look.',
          'El detalle que cambia un conjunto entero.'] },
        { n: 'Asesoría de imagen', p: [0, 30], d: [
          'Te decimos qué te sienta bien y por qué.',
          'Sales sabiendo comprar y dejas de fallar.'] },
        { n: 'Arreglos y ajustes', p: [5, 20], d: [
          'Bajos, cinturas y mangas a tu medida.',
          'Que la prenda te quede como hecha para ti.'] },
        { n: 'Rebajas y outlet', p: [5, 30], d: [
          'Temporada anterior a mitad de precio.',
          'Buenas prendas esperando que las encuentres.'] },
        { n: 'Tarjeta regalo', p: [10, 100], d: [
          'Para acertar seguro cuando no sabes la talla.',
          'Que elija ella lo que de verdad quiere.'] }
      ]
    },

    mascotas: {
      nombre: 'Mascotas y peluquería canina',
      titulos: ['Cuidado de tu Mascota', 'Peluquería Canina', 'Nuestros Servicios', 'Mímalos como Merecen'],
      subs: ['Trato cariñoso y sin estrés para tu peludo',
             'Productos suaves y material esterilizado',
             'Perros y gatos, cada uno a su ritmo',
             'Salen guapos y contentos'],
      serv: [
        { n: 'Baño e higiene', p: [15, 30], d: [
          'Baño, secado y corte de uñas, con champú a su piel.',
          'Sale limpio, oliendo bien y sin nudos.'] },
        { n: 'Corte de raza', p: [20, 45], d: [
          'El corte que le toca según su raza y su pelo.',
          'Respetamos el estándar y lo que pida el dueño.'] },
        { n: 'Deslanado', p: [18, 40], d: [
          'Quitamos el subpelo muerto que da tanto calor.',
          'Menos pelo por casa y su piel respira mejor.'] },
        { n: 'Corte de uñas', p: [5, 12], d: [
          'Rápido y sin hacerle daño, con calma.',
          'Uñas a su punto para que ande cómodo.'] },
        { n: 'Limpieza de oídos', p: [5, 12], d: [
          'Revisión y limpieza suave de la zona.',
          'Prevenimos molestias antes de que vayan a más.'] },
        { n: 'Bono de baños', p: [50, 110], d: [
          'Varios baños a mejor precio a lo largo del mes.',
          'Para razas que necesitan cuidado seguido.'] },
        { n: 'Peluquería felina', p: [25, 50], d: [
          'Manejo tranquilo y adaptado al gato.',
          'Con paciencia, para que el mal rato sea el mínimo.'] },
        { n: 'Antiparasitario', p: [8, 20], d: [
          'Tratamiento de pipeta o baño según necesite.',
          'Protección frente a pulgas y garrapatas.'] }
      ]
    },

    fotografia: {
      nombre: 'Estudio de fotografía',
      titulos: ['Servicios de Fotografía', 'Nuestro Estudio', 'Tus Momentos, en Imagen', 'Sesiones y Reportajes'],
      subs: ['Fotografía cuidada para cada ocasión',
             'Estudio con luz y decorado propio',
             'Entrega editada y en alta calidad',
             'Reserva tu sesión con antelación'],
      serv: [
        { n: 'Sesión de retrato', p: [40, 90], d: [
          'Una hora de estudio con varios fondos y cambios.',
          'Salen las fotos que de verdad te representan.'] },
        { n: 'Reportaje de boda', p: [600, 1500], d: [
          'Desde los preparativos hasta el último baile.',
          'Álbum editado y todas las imágenes en digital.'] },
        { n: 'Fotos de producto', p: [50, 150], d: [
          'Para tu tienda online, con fondo limpio y luz pareja.',
          'Que el producto se vea tal cual, y venda.'] },
        { n: 'Book profesional', p: [80, 200], d: [
          'Para actores, modelos o tu perfil de trabajo.',
          'Seleccionamos y retocamos las mejores tomas.'] },
        { n: 'Fotos de familia', p: [50, 120], d: [
          'En estudio o al aire libre, con niños incluidos.',
          'El recuerdo que dentro de años agradecerás.'] },
        { n: 'Comunión y bautizo', p: [150, 400], d: [
          'Reportaje del día completo, sin perder detalle.',
          'Con álbum impreso si lo quieres.'] },
        { n: 'Fotografía de eventos', p: [200, 600], d: [
          'Cubrimos tu evento de empresa o celebración.',
          'Entrega rápida para que compartas al momento.'] },
        { n: 'Revelado e impresión', p: [5, 40], d: [
          'Tus fotos en papel de calidad, no en el móvil.',
          'Tamaños y acabados a elegir.'] }
      ]
    },

    inmobiliaria: {
      nombre: 'Inmobiliaria',
      titulos: ['Nuestros Servicios', 'Compra, Vende, Alquila', 'Tu Casa te Espera', 'Inmobiliaria de Confianza'],
      subs: ['Acompañamiento en toda la operación',
             'Valoración real y sin humo',
             'Gestionamos el papeleo por ti',
             'Conocemos la zona como nadie'],
      serv: [
        { n: 'Venta de tu vivienda', p: [0, 30], d: [
          'La ponemos en valor y la enseñamos por ti.',
          'Filtramos visitas serias y negociamos el precio.'] },
        { n: 'Búsqueda de piso', p: [0, 30], d: [
          'Nos dices lo que buscas y te lo encontramos.',
          'Te avisamos antes de que salga al portal.'] },
        { n: 'Valoración gratuita', p: [0, 0], d: [
          'Te decimos cuánto vale de verdad, sin compromiso.',
          'Precio de mercado, ni inflado ni regalado.'] },
        { n: 'Gestión de alquiler', p: [0, 30], d: [
          'Buscamos inquilino solvente y firmamos con garantías.',
          'Nos ocupamos de contratos, fianzas y altas.'] },
        { n: 'Reportaje del inmueble', p: [0, 30], d: [
          'Fotos, plano y vídeo para que entre por los ojos.',
          'Una casa bien enseñada se vende antes.'] },
        { n: 'Asesoría hipotecaria', p: [0, 30], d: [
          'Te ayudamos a comparar y a preparar la financiación.',
          'Menos sorpresas el día de la firma.'] },
        { n: 'Gestión de herencias', p: [0, 30], d: [
          'Ordenamos la parte inmobiliaria del papeleo.',
          'Te acompañamos en un trámite que agobia.'] },
        { n: 'Tasación oficial', p: [150, 400], d: [
          'Informe válido para el banco y para notaría.',
          'Firmado por tasador homologado.'] }
      ]
    },

    eventos: {
      nombre: 'Eventos y celebraciones',
      titulos: ['Organización de Eventos', 'Tu Celebración, Resuelta', 'Nuestros Servicios', 'Momentos Inolvidables'],
      subs: ['Nos ocupamos de todo para que disfrutes',
             'Bodas, cumpleaños y eventos de empresa',
             'Presupuesto cerrado y sin sustos',
             'De la idea al último detalle'],
      serv: [
        { n: 'Organización de bodas', p: [800, 2500], d: [
          'Desde la finca hasta el arroz de la salida.',
          'Un solo interlocutor para todo el día.'] },
        { n: 'Cumpleaños infantil', p: [120, 350], d: [
          'Animación, decoración y merienda montadas.',
          'Tú disfrutas de tu hijo y del resto nos ocupamos.'] },
        { n: 'Evento de empresa', p: [300, 1500], d: [
          'Presentaciones, cenas y jornadas sin fallos.',
          'Imagen cuidada para tu marca.'] },
        { n: 'Decoración y ambientación', p: [150, 800], d: [
          'Flores, luces y montaje según tu estilo.',
          'El espacio queda listo y para la foto.'] },
        { n: 'Catering', p: [15, 45], d: [
          'Menú a elegir, servido y recogido.',
          'Para todos los gustos y para todas las dietas.'] },
        { n: 'Alquiler de material', p: [50, 400], d: [
          'Carpas, mesas, sillas y sonido.',
          'Lo que falte para que salga redondo.'] },
        { n: 'Animación y música', p: [200, 700], d: [
          'DJ o música en directo, y actividades.',
          'Que nadie se quede sentado.'] },
        { n: 'Photocall y recuerdos', p: [100, 350], d: [
          'Rincón de fotos y detalle para los invitados.',
          'Se llevan a casa un recuerdo del día.'] }
      ]
    },

    limpieza: {
      nombre: 'Limpieza y hogar',
      titulos: ['Servicios de Limpieza', 'Tu Casa Impecable', 'Lo que Hacemos', 'Limpieza Profesional'],
      subs: ['Personal de confianza y producto propio',
             'Para hogares, oficinas y comunidades',
             'Puntual o por horas, tú decides',
             'Presupuesto claro, sin letra pequeña'],
      serv: [
        { n: 'Limpieza de hogar', p: [12, 20], d: [
          'Por horas, la casa a punto cuando llegas.',
          'Personal fijo para que te conozca la casa.'] },
        { n: 'Limpieza a fondo', p: [80, 200], d: [
          'La grande de temporada, rincón por rincón.',
          'Cristales, azulejos y lo que nunca da tiempo.'] },
        { n: 'Fin de obra', p: [150, 400], d: [
          'Dejamos la reforma lista para entrar a vivir.',
          'Quitamos polvo, restos y manchas de pintura.'] },
        { n: 'Oficinas y locales', p: [15, 30], d: [
          'Mantenimiento diario o varias veces por semana.',
          'Fuera de tu horario, para no molestar.'] },
        { n: 'Comunidades y portales', p: [100, 300], d: [
          'Escaleras, ascensor y zonas comunes al día.',
          'Contrato mensual con parte de trabajo.'] },
        { n: 'Cristales y escaparates', p: [20, 60], d: [
          'Sin marcas ni goteos, dentro y fuera.',
          'Tu escaparate reluciente para vender más.'] },
        { n: 'Tapicería y alfombras', p: [30, 90], d: [
          'Lavado en profundidad de sofás y moquetas.',
          'Quitamos manchas y olores, no sólo la superficie.'] },
        { n: 'Bono de horas', p: [100, 250], d: [
          'Paquete de horas a mejor precio al mes.',
          'Las repartes como mejor te venga.'] }
      ]
    },

    reformas: {
      nombre: 'Reformas y mantenimiento',
      titulos: ['Reformas y Arreglos', 'Nuestros Trabajos', 'Manos a la Obra', 'Tu Casa, a Punto'],
      subs: ['Presupuesto cerrado antes de empezar',
             'Oficios de confianza y trabajo limpio',
             'Desde el arreglo pequeño a la reforma entera',
             'Cumplimos plazos y dejamos todo recogido'],
      serv: [
        { n: 'Reforma de baño', p: [2500, 6000], d: [
          'Fontanería, alicatado y sanitarios, llave en mano.',
          'Te lo dejamos listo para usar y sin sorpresas.'] },
        { n: 'Reforma de cocina', p: [3000, 8000], d: [
          'Muebles, encimera e instalaciones renovadas.',
          'Coordinamos los gremios para que no te agobies.'] },
        { n: 'Pintura de vivienda', p: [500, 1800], d: [
          'Paredes y techos, con la casa protegida.',
          'Color a elegir y acabado parejo.'] },
        { n: 'Fontanería', p: [40, 150], d: [
          'Fugas, grifos y desatascos resueltos.',
          'Vamos, lo vemos y te decimos el precio.'] },
        { n: 'Electricidad', p: [40, 150], d: [
          'Enchufes, cuadros y averías con garantía.',
          'Trabajo seguro y según normativa.'] },
        { n: 'Albañilería', p: [200, 1200], d: [
          'Tabiques, solados y arreglos de obra.',
          'Lo que haga falta picar, con orden.'] },
        { n: 'Carpintería y armarios', p: [300, 2000], d: [
          'Puertas, armarios a medida y tarima.',
          'Madera bien rematada que dura años.'] },
        { n: 'Mantenimiento por horas', p: [30, 50], d: [
          'El manitas para esos arreglos que se acumulan.',
          'Una mañana y tachas media lista de casa.'] }
      ]
    },

    bodas: {
      nombre: 'Bodas y novias',
      titulos: ['Vuestro Gran Día', 'Servicios para Bodas', 'Sí, Quiero', 'Bodas a Medida'],
      subs: ['Cuidamos cada detalle de vuestro día',
             'Prueba previa incluida en todo',
             'Un solo equipo para no agobiaros',
             'De la pedida al último baile'],
      serv: [
        { n: 'Pack novia completo', p: [180, 400], d: [
          'Prueba, peinado y maquillaje del día, cerrado.',
          'Llegas al altar sin una sola sorpresa.'] },
        { n: 'Peinado de novia', p: [70, 150], d: [
          'Recogido que aguanta baile, abrazos y fotos.',
          'Lo probamos antes para ir sobre seguro.'] },
        { n: 'Maquillaje de novia', p: [90, 180], d: [
          'Larga duración, resistente a lágrimas y horas.',
          'Sigues siendo tú, pero en tu mejor versión.'] },
        { n: 'Prueba de novia', p: [40, 90], d: [
          'Ensayamos el look completo con tiempo.',
          'Ajustamos lo que haga falta antes del día.'] },
        { n: 'Madrina e invitadas', p: [30, 70], d: [
          'Peinado y maquillaje para el resto del cortejo.',
          'Todas a juego y a buena hora.'] },
        { n: 'Damas y niñas', p: [20, 45], d: [
          'Peinados sencillos y cómodos para las peques.',
          'Bonitas y sin que les moleste toda la tarde.'] },
        { n: 'Preparativos en casa', p: [50, 150], d: [
          'Vamos a donde te preparas, sin correr.',
          'El desplazamiento incluido y con calma.'] },
        { n: 'Ensayo de recogido', p: [35, 70], d: [
          'Para bodas de tarde o de varios días.',
          'Dejamos elegido el peinado exacto.'] }
      ]
    },

    ventas: {
      nombre: 'Ventas y productos',
      titulos: ['Nuestros Productos', 'Catálogo de Venta', 'Lo que Vendemos', 'Ofertas del Mes'],
      subs: ['Producto seleccionado, precio justo',
             'Envíos y recogida en tienda',
             'Lo que buscas, cuando lo buscas',
             'Pregunta sin compromiso'],
      serv: [
        { n: 'Producto destacado', p: [10, 80], d: [
          'Lo que más se lleva esta temporada.',
          'Calidad probada al mejor precio.'] },
        { n: 'Novedad', p: [15, 100], d: [
          'Recién llegado, unidades limitadas.',
          'De lo último y ya en tienda.'] },
        { n: 'Oferta del mes', p: [5, 50], d: [
          'Precio especial hasta fin de existencias.',
          'El chollo que estabas esperando.'] },
        { n: 'Pack ahorro', p: [20, 120], d: [
          'Varios productos juntos a mejor precio.',
          'Llevas más y pagas menos.'] },
        { n: 'Producto premium', p: [50, 300], d: [
          'La gama alta para quien busca lo mejor.',
          'Materiales y acabado de primera.'] },
        { n: 'Recambios y accesorios', p: [3, 40], d: [
          'Todo lo que le hace falta a tu producto.',
          'Compatible y garantizado.'] },
        { n: 'Envío a domicilio', p: [0, 15], d: [
          'Te lo llevamos a casa en pocos días.',
          'Gratis a partir de cierto importe.'] },
        { n: 'Tarjeta regalo', p: [10, 100], d: [
          'Para acertar seguro con cualquiera.',
          'Que elija la persona lo que quiere.'] }
      ]
    },

    tecnologia: {
      nombre: 'Tecnología y reparación',
      titulos: ['Servicio Técnico', 'Reparación y Venta', 'Tu Móvil, como Nuevo', 'Tecnología'],
      subs: ['Reparamos móviles, tablets y ordenadores',
             'Diagnóstico gratis y presupuesto claro',
             'Repuestos con garantía',
             'Mientras esperas, si es rápido'],
      serv: [
        { n: 'Cambio de pantalla', p: [40, 150], d: [
          'Pantalla nueva y calibrada, en el día.',
          'Se acabaron los cristales rotos.'] },
        { n: 'Cambio de batería', p: [25, 70], d: [
          'Recupera la autonomía de cuando era nuevo.',
          'Batería original o equivalente con garantía.'] },
        { n: 'Liberar móvil', p: [10, 30], d: [
          'Para usarlo con cualquier compañía.',
          'Rápido y sin perder tus datos.'] },
        { n: 'Reparación de ordenador', p: [30, 120], d: [
          'Va lento, no arranca o se apaga: lo vemos.',
          'Limpieza, cambio de disco o memoria.'] },
        { n: 'Recuperar datos', p: [40, 150], d: [
          'Fotos y archivos de un equipo estropeado.',
          'Antes de tirarlo, déjanos intentarlo.'] },
        { n: 'Quitar virus', p: [25, 60], d: [
          'Limpieza a fondo y protección al terminar.',
          'El equipo vuelve a ir fino.'] },
        { n: 'Venta de reacondicionados', p: [80, 400], d: [
          'Equipos revisados a precio de segunda mano.',
          'Con garantía, no una compra a ciegas.'] },
        { n: 'Accesorios', p: [5, 60], d: [
          'Fundas, cargadores y protectores.',
          'Lo que le falta a tu equipo.'] }
      ]
    },

    automovil: {
      nombre: 'Autos y taller',
      titulos: ['Nuestro Taller', 'Servicios del Taller', 'Tu Coche en Buenas Manos', 'Taller Mecánico'],
      subs: ['Mecánica de confianza y presupuesto cerrado',
             'Todas las marcas, sin perder la garantía',
             'Revisión antes de vacaciones o ITV',
             'Te decimos lo que necesita y lo que no'],
      serv: [
        { n: 'Cambio de aceite y filtros', p: [40, 90], d: [
          'El mantenimiento básico que alarga el motor.',
          'Aceite recomendado para tu coche.'] },
        { n: 'Pastillas de freno', p: [60, 180], d: [
          'Frenada segura, revisadas discos incluidos.',
          'No es cosa de dejar para más adelante.'] },
        { n: 'Neumáticos', p: [50, 300], d: [
          'Montaje, equilibrado y válvula nueva.',
          'Te asesoramos según cómo conduces.'] },
        { n: 'Pre-ITV', p: [20, 50], d: [
          'Revisamos lo que suele suspender.',
          'Pasas a la primera y sin sustos.'] },
        { n: 'Diagnóstico electrónico', p: [25, 60], d: [
          'Leemos la centralita y buscamos la avería.',
          'Antes de tocar nada, saber qué pasa.'] },
        { n: 'Aire acondicionado', p: [40, 90], d: [
          'Recarga de gas y revisión de fugas.',
          'Que enfríe otra vez cuando aprieta el calor.'] },
        { n: 'Distribución', p: [250, 600], d: [
          'La correa a tiempo evita una avería grave.',
          'Según los kilómetros que marca la marca.'] },
        { n: 'Chapa y pintura', p: [150, 800], d: [
          'Golpes y arañazos, como si no hubieran pasado.',
          'Igualamos el color exacto de tu coche.'] }
      ]
    },

    salud: {
      nombre: 'Salud y consulta',
      titulos: ['Nuestra Consulta', 'Servicios de Salud', 'Cuidamos de Ti', 'Consulta y Terapias'],
      subs: ['Atención cercana y personalizada',
             'Primera visita con valoración completa',
             'Bonos de sesiones a mejor precio',
             'Pide cita sin esperas largas'],
      serv: [
        { n: 'Primera consulta', p: [30, 60], d: [
          'Te escuchamos y valoramos tu caso con calma.',
          'De aquí sale el plan de tratamiento.'] },
        { n: 'Sesión de fisioterapia', p: [30, 55], d: [
          'Trabajamos la zona y te enseñamos ejercicios.',
          'Menos dolor y mejor movilidad, sesión a sesión.'] },
        { n: 'Masaje terapéutico', p: [30, 60], d: [
          'Descarga de espalda, cuello y cargas.',
          'Alivio de verdad, no sólo un rato.'] },
        { n: 'Revisión de control', p: [25, 50], d: [
          'Seguimiento para ver cómo evolucionas.',
          'Ajustamos lo que haga falta.'] },
        { n: 'Bono de 5 sesiones', p: [130, 250], d: [
          'El precio por sesión baja con el bono.',
          'La constancia es lo que da resultado.'] },
        { n: 'Nutrición y dieta', p: [30, 55], d: [
          'Plan realista para tu vida y tus horarios.',
          'Sin pasar hambre ni dietas milagro.'] },
        { n: 'Terapia psicológica', p: [40, 70], d: [
          'Un espacio seguro para hablar y avanzar.',
          'A tu ritmo y con total confidencialidad.'] },
        { n: 'Domicilio', p: [40, 80], d: [
          'Vamos a tu casa si no puedes desplazarte.',
          'La misma atención, sin salir de casa.'] }
      ]
    },

    clases: {
      nombre: 'Clases y academia',
      titulos: ['Nuestras Clases', 'Aprende con Nosotros', 'Formación', 'Clases Particulares'],
      subs: ['Grupos reducidos y atención personal',
             'Del refuerzo escolar a los idiomas',
             'Presencial o por videollamada',
             'Primera clase de prueba sin compromiso'],
      serv: [
        { n: 'Refuerzo escolar', p: [10, 20], d: [
          'Repaso y deberes de primaria y secundaria.',
          'Recupera lo atrasado antes del examen.'] },
        { n: 'Clases de idiomas', p: [12, 25], d: [
          'Inglés y otros idiomas, hablando desde el día uno.',
          'Preparamos también exámenes oficiales.'] },
        { n: 'Clases de música', p: [15, 30], d: [
          'Guitarra, piano o canto, para cualquier edad.',
          'Empiezas a tocar desde la primera semana.'] },
        { n: 'Informática', p: [12, 28], d: [
          'Desde manejar el móvil a Office o internet.',
          'A tu ritmo y sin agobios.'] },
        { n: 'Preparación de exámenes', p: [15, 35], d: [
          'Selectividad, oposiciones y pruebas oficiales.',
          'Con simulacros y plan de estudio.'] },
        { n: 'Bono mensual', p: [40, 120], d: [
          'Varias clases al mes a mejor precio.',
          'La constancia sale más a cuenta.'] },
        { n: 'Clase de prueba', p: [0, 15], d: [
          'La primera para conocernos, sin compromiso.',
          'Ves si encajamos antes de apuntarte.'] },
        { n: 'Clase online', p: [10, 25], d: [
          'Por videollamada, desde donde estés.',
          'Mismo temario, sin desplazarte.'] }
      ]
    },

    viajes: {
      nombre: 'Viajes y turismo',
      titulos: ['Nuestros Viajes', 'Escápate con Nosotros', 'Ofertas de Viaje', 'Agencia de Viajes'],
      subs: ['Viajes a medida y sin sorpresas',
             'Nos ocupamos de todo el papeleo',
             'Escapadas, playa, ciudad y aventura',
             'Pregunta por tu destino soñado'],
      serv: [
        { n: 'Escapada de fin de semana', p: [80, 250], d: [
          'Dos noches para desconectar cerca de casa.',
          'Hotel y detalles resueltos.'] },
        { n: 'Vacaciones de playa', p: [300, 900], d: [
          'Vuelo, hotel y traslados, todo junto.',
          'Sólo tienes que hacer la maleta.'] },
        { n: 'Circuito cultural', p: [400, 1200], d: [
          'Varias ciudades con guía y visitas incluidas.',
          'Conocer de verdad, no sólo hacer fotos.'] },
        { n: 'Viaje de novios', p: [1000, 3000], d: [
          'El viaje de vuestra vida, a vuestro gusto.',
          'Detalles especiales para la pareja.'] },
        { n: 'Crucero', p: [500, 1800], d: [
          'Varios destinos durmiendo en el mismo sitio.',
          'Todo incluido a bordo.'] },
        { n: 'Billetes y hoteles sueltos', p: [30, 400], d: [
          'Sólo el vuelo o sólo el hotel, si lo prefieres.',
          'Buscamos la mejor combinación.'] },
        { n: 'Seguro de viaje', p: [15, 80], d: [
          'Por si algo se tuerce, ir tranquilo.',
          'Cobertura médica y de cancelación.'] },
        { n: 'Viaje de grupo', p: [200, 700], d: [
          'Precio especial para amigos o empresa.',
          'Organizamos todo para que sólo disfrutéis.'] }
      ]
    },

    jardineria: {
      nombre: 'Jardinería y exteriores',
      titulos: ['Jardinería', 'Cuidamos tu Jardín', 'Nuestros Servicios', 'Verde y a Punto'],
      subs: ['Mantenimiento y diseño de zonas verdes',
             'Puntual o por contrato mensual',
             'Casas, comunidades y empresas',
             'Presupuesto sin compromiso'],
      serv: [
        { n: 'Mantenimiento de jardín', p: [30, 60], d: [
          'Césped, setos y limpieza al día.',
          'Contrato mensual y tu jardín siempre listo.'] },
        { n: 'Poda de árboles', p: [40, 200], d: [
          'Poda segura, con recogida de restos.',
          'Sanea el árbol y evita sustos.'] },
        { n: 'Corte de césped', p: [20, 50], d: [
          'Segado y perfilado de bordes.',
          'Ese verde tupido que da gusto pisar.'] },
        { n: 'Diseño de jardín', p: [150, 800], d: [
          'Proyecto a medida según tu espacio.',
          'Plantas que aguantan tu clima y tu tiempo.'] },
        { n: 'Sistema de riego', p: [200, 900], d: [
          'Riego automático, ni una gota de más.',
          'Ahorras agua y te olvidas de la manguera.'] },
        { n: 'Limpieza de terreno', p: [80, 400], d: [
          'Desbroce de maleza y retirada de restos.',
          'Terreno despejado y sin riesgo de incendio.'] },
        { n: 'Huerto urbano', p: [60, 250], d: [
          'Montamos tu huerto en casa o en la terraza.',
          'Tomates y verduras a un paso de la cocina.'] },
        { n: 'Piscina y exteriores', p: [40, 120], d: [
          'Mantenimiento del agua y la zona de baño.',
          'Lista para el verano sin que tú hagas nada.'] }
      ]
    },

    transporte: {
      nombre: 'Transporte y mudanzas',
      titulos: ['Transporte y Mudanzas', 'Nos Encargamos', 'Servicios de Porte', 'Mudanzas'],
      subs: ['Rápido, cuidadoso y con seguro',
             'Desde un porte pequeño a la casa entera',
             'Embalaje y montaje si lo necesitas',
             'Presupuesto cerrado, sin sorpresas'],
      serv: [
        { n: 'Mudanza completa', p: [200, 900], d: [
          'La casa entera, embalaje y montaje incluidos.',
          'Llegas a la nueva y está todo en su sitio.'] },
        { n: 'Porte pequeño', p: [30, 90], d: [
          'Un mueble, un electrodoméstico o poca cosa.',
          'Rápido y sin pagar de más.'] },
        { n: 'Embalaje', p: [40, 150], d: [
          'Cajas, plástico y protección de lo frágil.',
          'Que no se rompa nada por el camino.'] },
        { n: 'Montaje de muebles', p: [30, 120], d: [
          'Desmontamos y volvemos a montar por ti.',
          'Sin tornillos perdidos ni dolores de cabeza.'] },
        { n: 'Guardamuebles', p: [40, 120], d: [
          'Guardamos tus cosas el tiempo que haga falta.',
          'Seguro y con acceso cuando lo necesites.'] },
        { n: 'Entrega a domicilio', p: [15, 60], d: [
          'Recogemos y llevamos donde digas.',
          'Ideal para tiendas y compras grandes.'] },
        { n: 'Vaciado de pisos', p: [100, 400], d: [
          'Dejamos la vivienda vacía y limpia.',
          'Reciclamos y retiramos lo que no sirve.'] },
        { n: 'Subidas por ventana', p: [80, 300], d: [
          'Con plataforma, para lo que no entra por la escalera.',
          'Muebles grandes sin dañar nada.'] }
      ]
    },

    legal: {
      nombre: 'Abogados y gestoría',
      titulos: ['Asesoría Legal', 'Nuestros Servicios', 'Te Asesoramos', 'Abogados y Gestoría'],
      subs: ['Primera consulta orientativa',
             'Claro con los honorarios desde el principio',
             'Particulares, autónomos y empresas',
             'Cerca de ti para lo que necesites'],
      serv: [
        { n: 'Primera consulta', p: [0, 50], d: [
          'Nos cuentas tu caso y te orientamos.',
          'Sabes a qué atenerte antes de decidir.'] },
        { n: 'Declaración de la renta', p: [30, 90], d: [
          'La hacemos por ti, buscando lo que te desgrava.',
          'Sin errores y sin quebraderos de cabeza.'] },
        { n: 'Alta de autónomo', p: [40, 120], d: [
          'Todo el papeleo para empezar a facturar.',
          'Te explicamos cuotas e impuestos claro.'] },
        { n: 'Contratos y herencias', p: [60, 300], d: [
          'Revisamos y redactamos lo que firmas.',
          'Que ningún papel te pille por sorpresa.'] },
        { n: 'Reclamaciones', p: [50, 250], d: [
          'Bancos, seguros o consumo: reclamamos por ti.',
          'Sólo cobramos si tiene sentido pelearlo.'] },
        { n: 'Divorcios y familia', p: [150, 600], d: [
          'Con tacto y buscando el mejor acuerdo.',
          'Te acompañamos en un momento difícil.'] },
        { n: 'Gestión laboral', p: [30, 120], d: [
          'Nóminas, contratos y seguros sociales.',
          'Tu empresa al día con Hacienda.'] },
        { n: 'Trámites de extranjería', p: [50, 200], d: [
          'Permisos, renovaciones y nacionalidad.',
          'Papeles en regla, sin colas ni líos.'] }
      ]
    },

    /* «✍️ Otra» — para cualquier negocio que no esté en la lista. Trae textos
       neutros y profesionales que la persona cambia por los suyos: la
       herramienta ya deja editar cada palabra, cada precio y la marca. */
    generico: {
      nombre: '✍️ Otra (la escribo yo)',
      titulos: ['Nuestros Servicios', 'Lo que Ofrecemos', 'Nuestro Catálogo', 'Bienvenida'],
      subs: ['Calidad y trato cercano en cada trabajo',
             'Profesionales en lo que hacemos',
             'Cambia estos textos por los tuyos',
             'A tu servicio, con toda la atención'],
      serv: [
        { n: 'Servicio destacado', p: [10, 50], d: [
          'Escribe aquí en qué consiste tu mejor servicio.',
          'Lo que mejor haces y por lo que te buscan.'] },
        { n: 'Nuestro trabajo estrella', p: [20, 80], d: [
          'Cuenta qué te diferencia del resto.',
          'El motivo por el que repiten contigo.'] },
        { n: 'Atención personalizada', p: [0, 40], d: [
          'Explica cómo cuidas a cada cliente.',
          'El trato cercano que marca la diferencia.'] },
        { n: 'Presupuesto sin compromiso', p: [0, 0], d: [
          'Di que asesoras antes y sin coste.',
          'Que pregunten sin miedo a la sorpresa final.'] },
        { n: 'Ofertas y promociones', p: [5, 40], d: [
          'Pon aquí tu oferta del mes.',
          'Un buen gancho para que se decidan.'] },
        { n: 'Bonos y paquetes', p: [40, 150], d: [
          'Agrupa varios servicios a mejor precio.',
          'Fideliza y aseguras las próximas visitas.'] },
        { n: 'Servicio a domicilio', p: [10, 60], d: [
          'Si vas a casa del cliente, cuéntalo aquí.',
          'La comodidad que muchos valoran y pagan.'] },
        { n: 'Novedad', p: [10, 60], d: [
          'Estrena algo y anúncialo en el folleto.',
          'Lo nuevo siempre llama la atención.'] }
      ]
    }
  };

  var ETIQUETAS = ['Nuevo', 'Top ventas', 'Lo más pedido', 'Recomendado', 'Plazas limitadas', '-20%', 'Oferta'];

  /* ───────────────────────── Utilidades de texto ───────────────────────── */

  /* Precios "de salón": ni 37,42 € ni cifras redondas siempre. */
  function precio(rng, rango) {
    var min = rango[0], max = rango[1];
    if (max <= 0) return 'Gratis';
    if (min <= 0) return rng() < 0.5 ? 'Gratis' : (Math.round(max / 5) * 5) + '€';
    var escalones = [];
    for (var v = Math.ceil(min / 5) * 5; v <= max; v += 5) escalones.push(v);
    if (!escalones.length) escalones = [Math.round((min + max) / 2)];
    var p = uno(rng, escalones);
    // de vez en cuando, el clásico terminado en 9
    if (rng() < 0.22 && p > 15) p = p - 1;
    return p + '€';
  }

  function primeraFrase(txt) {
    var i = txt.indexOf('. ');
    return i > 0 ? txt.slice(0, i + 1) : txt;
  }

  /* El ritmo es lo que más delata a una máquina: si todas las descripciones
     miden lo mismo, suena a formulario. Alternamos a propósito. */
  function descripcion(bolsas, servicio, tono, largo) {
    var base = bolsas.desc[servicio.n] ? bolsas.desc[servicio.n].coger() : uno(bolsas.rng, servicio.d);
    if (largo === 'corto') return primeraFrase(base);
    if (largo === 'largo') return base + ' ' + bolsas.cierres.coger();
    return base;
  }

  /* Verbos en segunda persona que de verdad aparecen en el banco de textos.
     Sólo se listan los que no pueden confundirse con un sustantivo: «dudas»,
     «marcas», «partes» o «prisas» se quedan fuera a propósito. */
  var VERBOS_USTED = {
    ahorras: 'ahorra', aprendes: 'aprende', buscabas: 'buscaba', decides: 'decide',
    dejas: 'deja', dejes: 'deje', entrenas: 'entrena', gastas: 'gasta',
    llevas: 'lleva', necesitas: 'necesita', pagas: 'paga', pidas: 'pida',
    puedes: 'puede', quieras: 'quiera', quieres: 'quiere', sales: 'sale',
    sigas: 'siga', tienes: 'tiene'
  };

  /* Pasar de «tú» a «usted». El orden importa: «te lo» se convierte en
     «se lo», no en «le lo», que es lo que salía antes y no es español. */
  function trato(texto, tono) {
    if (!TONOS[tono] || TONOS[tono].trato !== 'usted') return texto;
    return texto
      .replace(/\b(\w+)\b/g, function (m) {
        var bajo = m.toLowerCase();
        if (!VERBOS_USTED[bajo]) return m;
        var v = VERBOS_USTED[bajo];
        return (m[0] === m[0].toUpperCase()) ? v[0].toUpperCase() + v.slice(1) : v;
      })
      .replace(/\btu pelo\b/g, 'su cabello')
      .replace(/\bTu pelo\b/g, 'Su cabello')
      .replace(/\b([Tt])e\s+(lo|la|los|las)\b/g, function (m, T, p) { return (T === 'T' ? 'Se ' : 'se ') + p; })
      .replace(/\bte\b/g, 'le').replace(/\bTe\b/g, 'Le')
      .replace(/\btus\b/g, 'sus').replace(/\bTus\b/g, 'Sus')
      .replace(/\btu\b/g, 'su').replace(/\bTu\b/g, 'Su');
  }

  /* El guion es para la VOZ: sin emojis ni símbolos, con «euros» escrito, y
     con comas donde toca respirar. La voz del navegador lee fatal los signos. */
  function limpiarParaVoz(txt) {
    return String(txt || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ' ')
      .replace(/€/g, ' euros')
      .replace(/%/g, ' por ciento')
      .replace(/[·|•→#*_]/g, ' ')
      .replace(/\s*-\s*(\d)/g, ' menos $1')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,;:])/g, '$1')
      .trim();
  }

  /* ───────────────────────── Generación ───────────────────────── */

  function generar(op) {
    op = op || {};
    var claveRubro = RUBROS[op.rubro] ? op.rubro : 'peluqueria';
    var claveTono = TONOS[op.tono] ? op.tono : 'cercano';
    var R = RUBROS[claveRubro], T = TONOS[claveTono];
    var n = Math.max(1, Math.min(8, parseInt(op.n, 10) || 4));
    var semilla = (op.semilla == null) ? Math.floor(Math.random() * 1e9) : op.semilla;
    var rng = motorAzar(semilla);

    var negocio = String(op.negocio || '').trim() || 'Fátima Hair Studio';
    var ciudad = String(op.ciudad || '').trim();

    // Bolsas: nada se repite dentro del mismo folleto
    var bolsas = {
      rng: rng,
      cierres: new Bolsa(rng, T.cierres),
      etiquetas: new Bolsa(rng, ETIQUETAS),
      desc: {}
    };
    R.serv.forEach(function (s) { bolsas.desc[s.n] = new Bolsa(rng, s.d); });

    var bolsaServ = new Bolsa(rng, R.serv.map(function (s) { return s.n; }));
    var porNombre = {};
    R.serv.forEach(function (s) { porNombre[s.n] = s; });

    var celdas = [];
    for (var i = 0; i < n; i++) {
      var serv = porNombre[bolsaServ.coger()] || R.serv[i % R.serv.length];
      var largo = T.ritmo[i % T.ritmo.length];
      celdas.push({
        titulo: serv.n,
        texto: trato(descripcion(bolsas, serv, claveTono, largo), claveTono),
        precio: precio(rng, serv.p),
        // sólo algunos cuadros llevan etiqueta: si la llevan todos, no destaca ninguno
        etiqueta: (rng() < 0.38) ? bolsas.etiquetas.coger() : ''
      });
    }

    var titulo = uno(rng, R.titulos);
    var subtitulo = uno(rng, R.subs) + (ciudad ? ' · ' + ciudad : '');
    var cta = uno(rng, T.ctas);

    var pagina = {
      cabecera: { marca: negocio, titulo: titulo, subtitulo: subtitulo },
      celdas: celdas,
      pie: { cta: cta, contacto: op.contacto || '' },
      rubro: claveRubro,
      tono: claveTono,
      semilla: semilla
    };
    pagina.guion = guion(pagina, T, rng);
    return pagina;
  }

  function guion(pag, T, rng) {
    var partes = [];
    partes.push(pag.cabecera.marca + '.');
    partes.push(pag.cabecera.titulo + '. ' + pag.cabecera.subtitulo + '.');
    pag.celdas.forEach(function (c) {
      var linea = c.titulo + '. ' + c.texto;
      if (c.precio && c.precio !== 'Gratis') linea += ' Por ' + c.precio + '.';
      else if (c.precio === 'Gratis') linea += ' Sin coste.';
      partes.push(linea);
    });
    partes.push(uno(rng, T.remates));
    partes.push(pag.pie.cta + '.');
    return limpiarParaVoz(partes.join(' '));
  }

  /* Rehacer un solo campo, para el botón 🔁 de cada cuadro. */
  function regenerar(campo, ctx) {
    ctx = ctx || {};
    var R = RUBROS[ctx.rubro] || RUBROS.peluqueria;
    var T = TONOS[ctx.tono] || TONOS.cercano;
    var rng = motorAzar(ctx.semilla == null ? Math.floor(Math.random() * 1e9) : ctx.semilla);

    if (campo === 'titulo') return uno(rng, R.titulos);
    if (campo === 'subtitulo') return uno(rng, R.subs);
    if (campo === 'cta') return uno(rng, T.ctas);
    if (campo === 'etiqueta') return uno(rng, ETIQUETAS);

    var serv = null;
    if (ctx.servicio) {
      R.serv.some(function (s) { if (s.n === ctx.servicio) { serv = s; return true; } return false; });
    }
    if (!serv) serv = uno(rng, R.serv);

    if (campo === 'servicio') return serv.n;
    if (campo === 'precio') return precio(rng, serv.p);
    if (campo === 'texto') {
      var largo = uno(rng, ['corto', 'medio', 'largo']);
      var base = uno(rng, serv.d);
      if (largo === 'corto') return primeraFrase(base);
      if (largo === 'largo') return base + ' ' + uno(rng, T.cierres);
      return base;
    }
    return '';
  }

  function lista(obj) {
    return Object.keys(obj).map(function (k) { return { id: k, nombre: obj[k].nombre }; });
  }

  window.FOLLETO_CEREBRO = {
    generar: generar,
    regenerar: regenerar,
    limpiarParaVoz: limpiarParaVoz,
    rubros: function () { return lista(RUBROS); },
    tonos: function () { return lista(TONOS); }
  };
})();
