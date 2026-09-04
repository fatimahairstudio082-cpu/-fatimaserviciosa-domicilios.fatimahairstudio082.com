/* ══════════════════════════════════════════════════════════════════════════
   LÁMINAS DE EXPOSICIÓN · catálogo
   ──────────────────────────────────────────────────────────────────────────
   Noventa plantillas: treinta de mapa conceptual, treinta de mandala y
   treinta de carrusel. Ninguna es «la misma con otro color»: cada una fija
   estructura, paleta, formato, forma de nodo y un CONTENIDO de ejemplo de una
   materia concreta, para que al abrirla ya se vea una lámina de verdad y no
   un esqueleto con «Lorem».

   El contenido de ejemplo es punto de partida editable, no decoración: se
   sustituye escribiendo o pegando el esquema propio.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_LAMINAS_DISENOS) return;
  window._B6_LAMINAS_DISENOS = true;

  /* ─────────── Contenidos de ejemplo, por materia ───────────
     n(nivel, título, detalle). El nivel 0 es el centro, 1 la rama, 2 el
     detalle que cuelga de la rama anterior. */
  function n0(t, d) { return { nivel: 0, t: t, d: d || '' }; }
  function n1(t, d) { return { nivel: 1, t: t, d: d || '' }; }
  function n2(t, d) { return { nivel: 2, t: t, d: d || '' }; }

  var CONT = {

    corte: [
      n0('El corte de cabello', 'Geometría, textura y herramienta'),
      n1('Elevación', '0° a 180°'), n2('0°: peso en la línea'), n2('90°: peso repartido'),
      n1('Partición', 'Horizontal o vertical'), n2('Liso: horizontal'), n2('Rizado: vertical'),
      n1('Textura', 'Manda sobre el filo'), n2('Rizo y afro en seco'),
      n1('Herramienta', 'Tijera, navaja, máquina'), n2('Entresacar por dentro'),
      n1('Contorno', 'Nuca, orejas y patillas'),
      n1('Comprobación', 'Siempre en seco')
    ],

    color: [
      n0('Colorimetría', 'La rueda y la neutralización'),
      n1('Primarios', 'Amarillo, rojo, azul'),
      n1('Secundarios', 'Naranja, verde, violeta'),
      n1('Complementarios', 'Se anulan entre sí'), n2('Verde neutraliza rojo'), n2('Violeta neutraliza amarillo'),
      n1('Altura de tono', 'Del 1 al 10'),
      n1('Reflejo', 'El segundo número'),
      n1('Oxidante', 'Volúmenes 10 a 40')
    ],

    piel: [
      n0('La piel', 'Órgano y sus capas'),
      n1('Epidermis', 'Barrera exterior'), n2('Queratinocitos'), n2('Melanocitos'),
      n1('Dermis', 'Sostén y elasticidad'), n2('Colágeno y elastina'),
      n1('Hipodermis', 'Reserva de grasa'),
      n1('Funciones', 'Protege y regula'),
      n1('Cuidado', 'Limpiar, hidratar, proteger')
    ],

    celula: [
      n0('La célula', 'Unidad de la vida'),
      n1('Membrana', 'Controla la entrada'),
      n1('Citoplasma', 'Medio interno'),
      n1('Núcleo', 'Guarda el ADN'), n2('Cromosomas'), n2('Nucleolo'),
      n1('Mitocondrias', 'Producen energía'),
      n1('Ribosomas', 'Fabrican proteínas'),
      n1('Vacuolas', 'Almacenan')
    ],

    agua: [
      n0('El ciclo del agua', 'Un circuito sin principio'),
      n1('Evaporación', 'El sol calienta el mar'),
      n1('Condensación', 'Se forman las nubes'),
      n1('Precipitación', 'Lluvia, nieve, granizo'),
      n1('Infiltración', 'El suelo la absorbe'),
      n1('Escorrentía', 'Vuelve al río'),
      n1('Transpiración', 'Las plantas la devuelven')
    ],

    lengua: [
      n0('La oración', 'Sujeto y predicado'),
      n1('Sujeto', 'De quién se habla'), n2('Núcleo: sustantivo'), n2('Determinantes'),
      n1('Predicado', 'Qué se dice'), n2('Núcleo: verbo'),
      n1('Complementos', 'Directo, indirecto, circunstancial'),
      n1('Concordancia', 'Número y persona'),
      n1('Análisis', 'Primero el verbo')
    ],

    literatura: [
      n0('Géneros literarios', 'Cómo se organiza lo escrito'),
      n1('Narrativa', 'Cuenta una historia'), n2('Novela y cuento'),
      n1('Lírica', 'Expresa un sentimiento'), n2('Verso y estrofa'),
      n1('Dramática', 'Escrita para representarse'), n2('Diálogo y acotación'),
      n1('Ensayo', 'Piensa en voz alta')
    ],

    mates: [
      n0('Fracciones', 'Partes de una unidad'),
      n1('Numerador', 'Partes que tomamos'),
      n1('Denominador', 'Partes de la unidad'),
      n1('Equivalentes', 'Distinto nombre, mismo valor'),
      n1('Suma y resta', 'Mismo denominador'), n2('Buscar el mínimo común'),
      n1('Multiplicar', 'Recta: arriba por arriba'),
      n1('Dividir', 'Se invierte la segunda')
    ],

    geometria: [
      n0('Triángulos', 'Clasificación'),
      n1('Por lados', 'Equilátero, isósceles, escaleno'),
      n1('Por ángulos', 'Acutángulo, rectángulo, obtusángulo'),
      n1('Suma de ángulos', 'Siempre 180°'),
      n1('Área', 'Base por altura entre dos'),
      n1('Pitágoras', 'Sólo en el rectángulo')
    ],

    historia: [
      n0('Revolución Industrial', 'Del taller a la fábrica'),
      n1('Causas', 'Población y capital'), n2('Cercamientos del campo'),
      n1('Energía', 'Carbón y vapor'),
      n1('Industria textil', 'La primera en mecanizarse'),
      n1('Transporte', 'Ferrocarril y barco de vapor'),
      n1('Sociedad', 'Burguesía y proletariado'),
      n1('Consecuencias', 'Ciudad, sindicatos, contaminación')
    ],

    edadmedia: [
      n0('La sociedad feudal', 'Tres órdenes'),
      n1('Nobleza', 'Combate y gobierna'),
      n1('Clero', 'Reza y enseña'),
      n1('Campesinado', 'Trabaja la tierra'), n2('Siervos'), n2('Villanos libres'),
      n1('El feudo', 'Tierra y vasallaje'),
      n1('Vasallaje', 'Homenaje e investidura')
    ],

    fp: [
      n0('Prevención en el salón', 'Riesgos y medidas'),
      n1('Riesgo químico', 'Tintes y decolorantes'), n2('Ventilación y guantes'),
      n1('Riesgo eléctrico', 'Secadores y planchas'),
      n1('Postura', 'Espalda y muñeca'), n2('Silla regulable'),
      n1('Higiene', 'Desinfección del material'),
      n1('Residuos', 'Separación y retirada')
    ],

    empresa: [
      n0('Montar el negocio', 'Del plan a la apertura'),
      n1('Idea y servicio', 'Qué vendes y a quién'),
      n1('Plan económico', 'Inversión y punto de equilibrio'),
      n1('Trámites', 'Alta, licencia, seguros'),
      n1('Local', 'Zona, reforma, mobiliario'),
      n1('Precios', 'Coste, tiempo, margen'),
      n1('Clientela', 'Captar y fidelizar')
    ],

    infantil: [
      n0('Los animales', '¿Dónde viven?'),
      n1('En la granja', 'Vaca, gallina, oveja'),
      n1('En el bosque', 'Ciervo, búho, ardilla'),
      n1('En el agua', 'Pez, rana, delfín'),
      n1('En casa', 'Perro, gato, canario'),
      n1('Muy lejos', 'León, elefante, pingüino')
    ],

    estaciones: [
      n0('Las estaciones', 'El año da la vuelta'),
      n1('Primavera', 'Flores y lluvia'),
      n1('Verano', 'Calor y días largos'),
      n1('Otoño', 'Hojas y viento'),
      n1('Invierno', 'Frío y noches largas')
    ],

    neutro: [
      n0('Tema central', 'Escribe aquí tu tema'),
      n1('Primera idea', 'Su explicación'), n2('Un detalle'),
      n1('Segunda idea', 'Su explicación'), n2('Un detalle'),
      n1('Tercera idea', 'Su explicación'),
      n1('Cuarta idea', 'Su explicación'),
      n1('Quinta idea', 'Su explicación')
    ],

    estudio: [
      n0('Método de estudio', 'Cinco pasos que funcionan'),
      n1('Lectura general', 'Entender de qué va'),
      n1('Subrayado', 'Sólo lo que responde a una pregunta'),
      n1('Esquema', 'Del papel a la memoria'),
      n1('Repaso espaciado', 'Hoy, mañana, en una semana'),
      n1('Autoevaluación', 'Explicarlo sin mirar')
    ],

    /* Contenidos pensados para carrusel: pocas ideas y bien cortas. */
    car_corte: [
      n0('Cómo se lee un corte', 'Tres claves que se ven en la primera pasada'),
      n1('La elevación manda', 'A 0° el peso se queda en la línea; a 90° se reparte por toda la cabeza.'),
      n1('El cabello decide el filo', 'Liso, horizontal. Ondulado y rizado, vertical: si no, el borde queda trasquilado.'),
      n1('Se comprueba en seco', 'El rizo sube hasta un tercio al secar. Lo que mides mojado no es lo que se ve.'),
      n1('Guarda esta serie', 'Y dime qué corte quieres que desmonte en la próxima.')
    ],

    car_color: [
      n0('Neutralizar sin miedo', 'La rueda de color en cuatro hojas'),
      n1('Los complementarios se anulan', 'Verde contra rojo. Violeta contra amarillo. Azul contra naranja.'),
      n1('Primero la altura', 'Sin la altura de tono correcta, el reflejo no aparece.'),
      n1('El oxidante decide', '10 para tono sobre tono, 20 para cubrir, 30 y 40 para aclarar.'),
      n1('¿Te sirvió?', 'Guárdalo para tu próximo cliente.')
    ],

    car_estudio: [
      n0('Estudiar menos y mejor', 'Lo que dice la evidencia'),
      n1('Releer no funciona', 'Reconocer un texto no es recordarlo.'),
      n1('Pregúntate en voz alta', 'Recuperar la información es lo que la fija.'),
      n1('Reparte el repaso', 'Hoy, mañana y en una semana vale más que tres horas seguidas.'),
      n1('Explícalo a alguien', 'Si no puedes explicarlo, aún no lo sabes.')
    ],

    /* Contenidos de cartel: frases cortas, pensadas para leerse de pie. */
    higiene: [
      n0('Higiene y desinfección', 'Antes y después de cada cliente'),
      n1('Lavado de manos', 'Cuarenta segundos, agua y jabón'),
      n1('Material metálico', 'Desinfectante de alto nivel'),
      n1('Peines y cepillos', 'Retirar pelo y sumergir'),
      n1('Superficies', 'Sillón, tocador y lavacabezas'),
      n1('Ropa de trabajo', 'Toalla limpia por servicio'),
      n1('Residuos', 'Bolsa cerrada y retirada diaria')
    ],

    tarifas: [
      n0('Servicios y tarifas', 'Precios con IVA incluido'),
      n1('Corte', 'Lavado, corte y peinado'),
      n1('Color raíz', 'Retoque de crecimiento'),
      n1('Mechas', 'Según largo y densidad'),
      n1('Tratamiento', 'Diagnóstico previo'),
      n1('Recogido', 'Con cita previa'),
      n1('Asesoramiento', 'Sin coste con servicio')
    ],

    jornada: [
      n0('Jornada de puertas abiertas', 'Ciclo de Peluquería y Estética'),
      n1('Viernes 17, 10:00', 'Aula taller, planta baja'),
      n1('Demostraciones', 'Corte, color y barbería en directo'),
      n1('Matrícula', 'Información y plazas'),
      n1('Entrada libre', 'Hasta completar aforo')
    ],

    evacuacion: [
      n0('Plan de evacuación', 'Qué hacer al sonar la alarma'),
      n1('Mantén la calma', 'No corras y no grites'),
      n1('Deja todo', 'Bolsos y material se quedan'),
      n1('Sal en fila', 'Por la salida señalizada más cercana'),
      n1('No uses el ascensor', 'Siempre por la escalera'),
      n1('Punto de encuentro', 'Patio exterior, zona marcada'),
      n1('Espera el recuento', 'No vuelvas a entrar sin aviso')
    ],

    normas: [
      n0('Normas del aula', 'Para que la clase funcione'),
      n1('Puntualidad', 'Entramos y empezamos a la hora'),
      n1('Respeto', 'Se escucha a quien habla'),
      n1('Material', 'Cada uno cuida el suyo'),
      n1('Silencio de trabajo', 'Se pregunta levantando la mano'),
      n1('Limpieza', 'La mesa se deja como se encuentra'),
      n1('Móviles', 'Guardados salvo que se pidan')
    ],

    reciclaje: [
      n0('Dónde va cada cosa', 'Separar bien es la mitad del trabajo'),
      n1('Amarillo', 'Envases, latas y briks'),
      n1('Azul', 'Papel y cartón'),
      n1('Verde', 'Vidrio sin tapas'),
      n1('Marrón', 'Restos de comida'),
      n1('Gris', 'Lo que no va en ningún otro')
    ],

    /* Cronologías: el detalle es la fecha o la etapa. */
    crono_pelu: [
      n0('Historia del peinado', 'De Egipto al salón de hoy'),
      n1('Egipto', 'Pelucas de fibra y trenzas'),
      n1('Roma', 'Rizado con calamistro'),
      n1('Versalles', 'Volumen, polvo y postizos'),
      n1('1872 · Marcel', 'La onda al hierro'),
      n1('1920 · Garzon', 'El corte corto se hace moda'),
      n1('1963 · Geometría', 'El corte se construye'),
      n1('Hoy', 'Textura, diálogo y diagnóstico')
    ],

    crono_esp: [
      n0('España en el siglo XX', 'Siete fechas para situarse'),
      n1('1898', 'Pérdida de las últimas colonias'),
      n1('1931', 'Segunda República'),
      n1('1936', 'Comienza la Guerra Civil'),
      n1('1939', 'Empieza la dictadura'),
      n1('1975', 'Muerte de Franco'),
      n1('1978', 'Constitución'),
      n1('1986', 'Entrada en la CEE')
    ],

    crono_tierra: [
      n0('La historia de la Tierra', 'Cuatro mil quinientos millones de años'),
      n1('Precámbrico', 'Se forma el planeta y la vida simple'),
      n1('Paleozoico', 'Vida en el mar y salida a tierra'),
      n1('Mesozoico', 'Los dinosaurios'),
      n1('Cenozoico', 'Mamíferos y aves'),
      n1('Cuaternario', 'Glaciaciones y ser humano')
    ],

    crono_lit: [
      n0('Literatura española', 'Las etapas y su voz'),
      n1('Edad Media', 'Mester de juglaría y clerecía'),
      n1('Siglo de Oro', 'Cervantes, Lope, Quevedo'),
      n1('Ilustración', 'Razón y ensayo'),
      n1('Romanticismo', 'Bécquer y Espronceda'),
      n1('Generación del 98', 'El paisaje y el problema de España'),
      n1('Generación del 27', 'Lorca, Alberti, Salinas'),
      n1('Actualidad', 'Narrativa y voces nuevas')
    ],

    crono_curso: [
      n0('El curso, mes a mes', 'Para verlo entero desde el primer día'),
      n1('Septiembre', 'Presentación y diagnóstico'),
      n1('Diciembre', 'Primera evaluación'),
      n1('Marzo', 'Segunda evaluación y prácticas'),
      n1('Junio', 'Evaluación final y proyecto')
    ],

    /* Procesos: cada nodo es un paso, en orden. */
    proc_color: [
      n0('Servicio de coloración', 'De la consulta al acabado'),
      n1('Diagnóstico', 'Cuero cabelludo, historial y expectativa'),
      n1('Prueba de sensibilidad', '48 horas antes si procede'),
      n1('Mezcla', 'Proporción exacta de tinte y oxidante'),
      n1('Aplicación', 'Medios y puntas o raíz según el caso'),
      n1('Tiempo de pausa', 'Reloj, no vista'),
      n1('Emulsión y lavado', 'Champú post·color'),
      n1('Acabado y consejo', 'Mantenimiento en casa')
    ],

    proc_cita: [
      n0('Atención al cliente', 'La misma secuencia en cada visita'),
      n1('Recibir', 'Saludo y percha'),
      n1('Escuchar', '¿Qué quiere y qué espera?'),
      n1('¿Es viable?', 'Sí: adelante. No: se propone alternativa'),
      n1('Ejecutar', 'Explicando lo que se hace'),
      n1('Cobrar', 'Y recomendar producto'),
      n1('Reservar', 'Próxima cita antes de salir')
    ],

    proc_cientifico: [
      n0('El método científico', 'Cómo se comprueba una idea'),
      n1('Observación', 'Algo llama la atención'),
      n1('Pregunta', '¿Por qué ocurre?'),
      n1('Hipótesis', 'Una respuesta que se pueda poner a prueba'),
      n1('Experimento', 'Con variable controlada'),
      n1('Análisis', 'Los datos, no la intuición'),
      n1('¿Se confirma?', 'Sí: conclusión. No: nueva hipótesis'),
      n1('Comunicación', 'Se publica para que otros lo repitan')
    ],

    proc_texto: [
      n0('Escribir un texto', 'Seis pasos, siempre los mismos'),
      n1('Elegir el tema', 'Y a quién va dirigido'),
      n1('Buscar información', 'Fuentes fiables'),
      n1('Hacer el esquema', 'Antes de la primera frase'),
      n1('Escribir el borrador', 'Sin corregir mientras se escribe'),
      n1('Revisar', 'Ortografía, orden y repeticiones'),
      n1('Pasar a limpio', 'Formato y entrega')
    ],

    proc_problema: [
      n0('Resolver un problema', 'Antes de coger la calculadora'),
      n1('Leer dos veces', 'La segunda, subrayando'),
      n1('Anotar los datos', 'Y qué se pregunta'),
      n1('Elegir la operación', 'Y escribirla'),
      n1('Calcular', 'Con unidades'),
      n1('¿Tiene sentido?', 'Sí: respuesta. No: revisar'),
      n1('Responder', 'Con una frase completa')
    ],

    proc_pedido: [
      n0('Gestión de un pedido', 'Del proveedor a la estantería'),
      n1('Detectar la falta', 'Control de stock semanal'),
      n1('Pedir presupuesto', 'Al menos dos proveedores'),
      n1('Cursar el pedido', 'Con número de referencia'),
      n1('Recepción', 'Comprobar albarán y estado'),
      n1('Registro', 'Alta en inventario'),
      n1('Pago', 'Según condiciones acordadas')
    ],

    /* Datos: la cifra va en el detalle y la barra la lee de ahí. */
    dat_salon: [
      n0('El salón en cifras', 'Media del último trimestre'),
      n1('Ocupación de agenda', '78 %'),
      n1('Clientela que repite', '62 %'),
      n1('Servicios de color', '45 %'),
      n1('Venta de producto', '18 %'),
      n1('Citas por teléfono', '31 %')
    ],

    dat_estudio: [
      n0('Cuánto se retiene', 'Según cómo se estudia'),
      n1('Releyendo', '20 %'),
      n1('Subrayando', '30 %'),
      n1('Haciendo esquemas', '50 %'),
      n1('Autoevaluándose', '70 %'),
      n1('Explicándoselo a otro', '90 %')
    ],

    dat_agua: [
      n0('En qué gastamos el agua', 'Consumo doméstico medio'),
      n1('Ducha y baño', '34 %'),
      n1('Cisterna', '27 %'),
      n1('Lavadora', '14 %'),
      n1('Cocina', '12 %'),
      n1('Limpieza', '8 %'),
      n1('Beber', '5 %')
    ],

    dat_residuos: [
      n0('Qué tiramos', 'Composición de la bolsa de basura'),
      n1('Materia orgánica', '42 %'),
      n1('Papel y cartón', '18 %'),
      n1('Envases', '14 %'),
      n1('Vidrio', '8 %'),
      n1('Resto', '18 %')
    ],

    dat_tiempo: [
      n0('El tiempo del día', 'Un día de clase, hora a hora'),
      n1('Clase', '6 h'),
      n1('Estudio en casa', '2 h'),
      n1('Pantallas', '3 h'),
      n1('Deporte', '1 h'),
      n1('Sueño', '8 h')
    ],

    car_ciencia: [
      n0('El ciclo del agua', 'La misma agua desde hace millones de años'),
      n1('El sol la levanta', 'Evaporación en mares, ríos y suelo.'),
      n1('El aire la enfría', 'Condensación: aparecen las nubes.'),
      n1('Vuelve a caer', 'Lluvia, nieve o granizo según la temperatura.'),
      n1('Y otra vez', 'Ríos, acuíferos y de nuevo al mar.')
    ],

    /* Comparativas: dos ramas de nivel 1, cada una con lo suyo debajo. */
    cmp_tintes: [
      n0('Tinte permanente o semipermanente', 'Qué elegir en cada caso'),
      n1('Permanente', 'Abre la cutícula'),
      n2('Cubre cana al cien por cien'), n2('Aclara hasta tres tonos'),
      n2('Raíz visible al mes'), n2('Necesita prueba de alergia'),
      n1('Semipermanente', 'Deposita color'),
      n2('No cubre cana blanca entera'), n2('No aclara'),
      n2('Se va en veinte lavados'), n2('Menos daño en fibra')
    ],

    cmp_celulas: [
      n0('Célula animal y vegetal', 'En qué se parecen y en qué no'),
      n1('Animal', 'Sin pared ni cloroplastos'),
      n2('Membrana flexible'), n2('Vacuolas pequeñas'), n2('Centriolos'),
      n1('Vegetal', 'Fabrica su alimento'),
      n2('Pared de celulosa'), n2('Vacuola central grande'), n2('Cloroplastos'),
      n1('En común', 'Núcleo, citoplasma y mitocondrias')
    ],

    cmp_estudio: [
      n0('Estudiar solo o en grupo', 'Cada cosa sirve para algo distinto'),
      n1('Solo', 'Para memorizar y practicar'),
      n2('Ritmo propio'), n2('Sin distracciones'), n2('Detecta lo que no sabes'),
      n1('En grupo', 'Para explicar y contrastar'),
      n2('Explicar fija el concepto'), n2('Dudas resueltas al momento'),
      n2('Riesgo de charla')
    ],

    cmp_dafo: [
      n0('Análisis DAFO', 'El salón antes de abrir'),
      n1('Fortalezas', 'Lo que ya tenemos'),
      n2('Formación técnica actualizada'), n2('Local a pie de calle'),
      n1('Debilidades', 'Lo que nos falta'),
      n2('Sin cartera de clientes'), n2('Presupuesto ajustado'),
      n1('Oportunidades', 'Lo que hay fuera'),
      n2('Barrio sin salón de color'), n2('Demanda de servicio masculino'),
      n1('Amenazas', 'Lo que puede venir'),
      n2('Cadenas de bajo precio'), n2('Subida del alquiler')
    ],

    cmp_generos: [
      n0('Narrativa y lírica', 'Dos formas de contar'),
      n1('Narrativa', 'Cuenta hechos'),
      n2('Narrador y personajes'), n2('Prosa habitualmente'), n2('Tiempo y espacio'),
      n1('Lírica', 'Expresa un estado'),
      n2('Yo poético'), n2('Verso y ritmo'), n2('Figuras retóricas')
    ],

    cmp_forma: [
      n0('Sociedad o autónomo', 'Cómo montar el negocio'),
      n1('Autónomo', 'Trámite rápido'),
      n2('Alta en días'), n2('Responsabilidad ilimitada'), n2('Cuota mensual fija'),
      n1('Sociedad limitada', 'Patrimonio protegido'),
      n2('Capital social mínimo'), n2('Responsabilidad limitada'), n2('Más contabilidad')
    ],

    cmp_area: [
      n0('Área y perímetro', 'Dos preguntas distintas'),
      n1('Perímetro', 'Cuánto mide el borde'),
      n2('Se suman los lados'), n2('En centímetros'), n2('Vallar un huerto'),
      n1('Área', 'Cuánto cabe dentro'),
      n2('Base por altura'), n2('En centímetros cuadrados'), n2('Poner césped')
    ],

    cmp_antes: [
      n0('Antes y después del servicio', 'Diagnóstico y resultado'),
      n1('Al llegar', 'Lo que encontramos'),
      n2('Puntas abiertas'), n2('Raíz de cuatro centímetros'), n2('Fondo naranja'),
      n1('Al terminar', 'Lo que entregamos'),
      n2('Corte saneado'), n2('Raíz igualada'), n2('Tono neutralizado')
    ],

    cmp_animales: [
      n0('Mamíferos y aves', '¿En qué se diferencian?'),
      n1('Mamíferos', 'Pelo y leche'),
      n2('Nacen del vientre'), n2('Tienen pelo'), n2('Maman'),
      n1('Aves', 'Plumas y huevos'),
      n2('Ponen huevos'), n2('Tienen plumas'), n2('Pico sin dientes')
    ],

    cmp_tabla_prod: [
      n0('Tres decolorantes', 'Comparados por criterio'),
      n1('Criterio', 'Polvo · Crema · Aceite'),
      n2('Polvo'), n2('Crema'), n2('Aceite'),
      n1('Velocidad'), n2('Rápida'), n2('Media'), n2('Lenta'),
      n1('Control'), n2('Bajo'), n2('Alto'), n2('Muy alto'),
      n1('Cuidado de la fibra'), n2('Escaso'), n2('Medio'), n2('Alto'),
      n1('Uso típico'), n2('Mechas con papel'), n2('Balayage'), n2('Cabello sensible')
    ],

    /* Pirámides y jerarquías: el primer nodo es la cima o el núcleo. */
    pir_maslow: [
      n0('Pirámide de Maslow', 'Las necesidades, por orden'),
      n1('Autorrealización', 'Desarrollo personal'),
      n1('Reconocimiento', 'Estima y respeto'),
      n1('Afiliación', 'Amistad y pertenencia'),
      n1('Seguridad', 'Empleo, salud, vivienda'),
      n1('Fisiológicas', 'Comer, dormir, respirar')
    ],

    pir_alimentos: [
      n0('Pirámide de la alimentación', 'De lo ocasional a lo diario'),
      n1('Ocasional', 'Dulces y bollería'),
      n1('Semanal', 'Carnes y pescados'),
      n1('Diario moderado', 'Lácteos y aceite'),
      n1('Diario', 'Fruta y verdura'),
      n1('Base', 'Cereales, legumbres y agua')
    ],

    pir_bloom: [
      n0('Niveles de aprendizaje', 'Qué se pide en cada examen'),
      n1('Crear', 'Diseñar algo nuevo'),
      n1('Evaluar', 'Justificar una elección'),
      n1('Analizar', 'Distinguir las partes'),
      n1('Aplicar', 'Usarlo en un caso'),
      n1('Comprender', 'Explicarlo con tus palabras'),
      n1('Recordar', 'Nombrar y definir')
    ],

    pir_vida: [
      n0('Niveles de organización', 'De la célula al organismo'),
      n1('Organismo', 'El ser vivo completo'),
      n1('Sistema', 'Órganos que colaboran'),
      n1('Órgano', 'Tejidos con una función'),
      n1('Tejido', 'Células iguales juntas'),
      n1('Célula', 'La unidad de la vida')
    ],

    pir_tierra: [
      n0('Capas de la Tierra', 'De la superficie al centro'),
      n1('Corteza', 'De 5 a 70 km'),
      n1('Manto superior', 'Rocas parcialmente fundidas'),
      n1('Manto inferior', 'Sólido y muy caliente'),
      n1('Núcleo externo', 'Hierro líquido'),
      n1('Núcleo interno', 'Hierro sólido, 5000 °C')
    ],

    pir_texto: [
      n0('De la letra al texto', 'Unidades de la lengua'),
      n1('Texto', 'Mensaje completo'),
      n1('Párrafo', 'Una idea desarrollada'),
      n1('Oración', 'Sujeto y predicado'),
      n1('Palabra', 'Unidad con significado'),
      n1('Letra', 'Signo del sonido')
    ],

    org_salon: [
      n0('Organigrama del salón', 'Quién responde de qué'),
      n1('Dirección', 'Cuentas y proveedores'),
      n2('Compras'), n2('Horarios'),
      n1('Técnica', 'Color y corte'),
      n2('Oficiala'), n2('Ayudante'),
      n1('Recepción', 'Agenda y cobro'),
      n2('Citas'), n2('Caja')
    ],

    org_centro: [
      n0('Organigrama del centro', 'Estructura del instituto'),
      n1('Dirección', 'Equipo directivo'),
      n2('Jefatura de estudios'), n2('Secretaría'),
      n1('Departamentos', 'Coordinación docente'),
      n2('Imagen personal'), n2('Ciencias'),
      n1('Tutorías', 'Seguimiento del grupo'),
      n2('Familias'), n2('Orientación')
    ],

    pir_prioridad: [
      n0('Prioridades de la semana', 'Antes de abrir la agenda'),
      n1('Urgente e importante', 'Hoy mismo'),
      n1('Importante no urgente', 'Con fecha en el calendario'),
      n1('Urgente no importante', 'Delegar o acortar'),
      n1('Ni urgente ni importante', 'Fuera de la lista')
    ],

    pir_derecho: [
      n0('Jerarquía de las normas', 'Cuál manda sobre cuál'),
      n1('Constitución', 'Norma suprema'),
      n1('Leyes orgánicas y ordinarias', 'Aprobadas en las Cortes'),
      n1('Reglamentos', 'Desarrollan la ley'),
      n1('Convenios y contratos', 'Dentro del marco anterior')
    ],

    /* Fichas de estudio: el detalle es la explicación, no un adorno. */
    fic_verbo: [
      n0('El verbo', 'Resumen para el examen'),
      n1('Definición', 'Palabra que expresa acción, estado o proceso y admite conjugación.'),
      n1('Persona y número', 'Tres personas y dos números: canto, cantas, cantamos.'),
      n1('Tiempo', 'Sitúa la acción: pasado, presente o futuro.'),
      n1('Modo', 'Indicativo para hechos, subjuntivo para deseos, imperativo para órdenes.'),
      n1('Perífrasis', 'Dos verbos con un solo significado: voy a salir, tengo que ir.')
    ],

    fic_tildes: [
      n0('Reglas de acentuación', 'Tres reglas y las excepciones'),
      n1('Agudas', 'Llevan tilde si terminan en vocal, n o s: canción, café, además.'),
      n1('Llanas', 'Llevan tilde si NO terminan en vocal, n o s: árbol, lápiz.'),
      n1('Esdrújulas', 'Siempre llevan tilde: música, teléfono, sábado.'),
      n1('Diptongo e hiato', 'Vocal fuerte y débil juntas; si la débil es tónica, tilde: día.'),
      n1('Tilde diacrítica', 'Distingue palabras iguales: tú y tu, él y el, sé y se.')
    ],

    fic_fotosintesis: [
      n0('La fotosíntesis', 'Cómo fabrica su alimento la planta'),
      n1('Qué entra', 'Agua por la raíz, dióxido de carbono por las hojas y luz del sol.'),
      n1('Dónde ocurre', 'En los cloroplastos, gracias a la clorofila.'),
      n1('Qué sale', 'Glucosa para la planta y oxígeno al aire.'),
      n1('Por qué importa', 'Es la base de casi todas las cadenas alimentarias.'),
      n1('Error común', 'La planta también respira: la fotosíntesis no sustituye a la respiración.')
    ],

    fic_ecuaciones: [
      n0('Ecuaciones de primer grado', 'El método, paso a paso'),
      n1('Quitar denominadores', 'Multiplica todo por el mínimo común múltiplo.'),
      n1('Quitar paréntesis', 'Cuidado con el signo menos delante.'),
      n1('Agrupar', 'Incógnitas a un lado, números al otro; al pasar, cambia el signo.'),
      n1('Despejar', 'Divide por el número que acompaña a la incógnita.'),
      n1('Comprobar', 'Sustituye el resultado en la ecuación original.')
    ],

    fic_examen: [
      n0('Repaso antes del examen', 'Marca lo que ya dominas'),
      n1('Sé definir cada concepto sin mirar'),
      n1('Puedo explicarlo en voz alta a alguien'),
      n1('He hecho al menos cinco ejercicios de cada tipo'),
      n1('Reconozco los errores típicos y sé evitarlos'),
      n1('He repasado lo que fallé en el examen anterior'),
      n1('Tengo el material preparado para mañana')
    ],

    fic_glosario_pelu: [
      n0('Glosario de peluquería', 'Términos que salen en el examen'),
      n1('Elevación', 'Ángulo al que se levanta el mechón respecto a la cabeza.'),
      n1('Fondo de aclaración', 'Color que queda al retirar pigmento; va del rojo al amarillo pálido.'),
      n1('Volumen', 'Concentración del oxidante: a más volumen, más aclaración.'),
      n1('Desfilado', 'Corte que reduce peso sin quitar longitud.'),
      n1('Neutralizar', 'Aplicar el color opuesto para anular un reflejo no deseado.')
    ],

    fic_glosario_cien: [
      n0('Glosario de ciencias', 'Vocabulario básico del tema'),
      n1('Hipótesis', 'Explicación provisional que se puede poner a prueba.'),
      n1('Variable', 'Aquello que cambia y se mide en un experimento.'),
      n1('Control', 'Grupo de comparación en el que no se aplica el cambio.'),
      n1('Evidencia', 'Dato observable que apoya o refuta la hipótesis.'),
      n1('Teoría', 'Explicación comprobada muchas veces, no una simple suposición.')
    ],

    fic_pregunta_hist: [
      n0('¿Por qué cae el Antiguo Régimen?', 'Responde con tres causas y un ejemplo'),
      n1('Crisis económica', 'Malas cosechas y hacienda arruinada.'),
      n1('Ideas ilustradas', 'Soberanía nacional frente a derecho divino.'),
      n1('Burguesía sin poder', 'Peso económico sin peso político.'),
      n1('Ejemplo', '1789: Estados Generales y toma de la Bastilla.')
    ],

    fic_cornell_corte: [
      n0('El corte, en apuntes', 'Resumen: la elevación decide el peso'),
      n1('Elevación', 'A 0° el peso se queda abajo; a 90° se reparte; por encima, se vacía.'),
      n1('Línea de corte', 'Horizontal pesa, diagonal alarga, cóncava enmarca el rostro.'),
      n1('Tensión', 'Constante en todo el mechón o la línea saldrá desigual.'),
      n1('Textura', 'Entresacar quita volumen; desfilar quita peso sin quitar largo.'),
      n1('Comprobación', 'Verificar con el peine y a cabeza levantada antes de secar.')
    ],

    fic_seguridad: [
      n0('Antes de aplicar un químico', 'Lista de comprobación'),
      n1('Prueba de sensibilidad hecha 48 horas antes'),
      n1('Ficha del cliente revisada y firmada'),
      n1('Guantes puestos y zona ventilada'),
      n1('Producto dentro de fecha y bien mezclado'),
      n1('Tiempo de exposición cronometrado'),
      n1('Protocolo de lavado de ojos localizado')
    ]
  };

  /* ═══════════════════════ MAPAS CONCEPTUALES · 30 ═══════════════════════ */

  var MAPAS = [
    /* Peluquería y estética */
    { id: 'm_corte_radial', cat: 'Peluquería y estética', n: '💇 Corte · radial', d: 'El corte en el centro y sus cinco decisiones alrededor.', est: 'radial', pal: 'editorial_edu', fmt: 'a4v', cont: 'corte' },
    { id: 'm_corte_arbol', cat: 'Peluquería y estética', n: '💇 Corte · árbol', d: 'Jerarquía descendente: decisión, criterio y ejemplo.', est: 'arbol', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'corte' },
    { id: 'm_color_rueda', cat: 'Peluquería y estética', n: '🎨 Colorimetría · burbujas', d: 'La rueda de color en círculos, como se enseña en clase.', est: 'burbujas', pal: 'pastel', fmt: 'cuadrado', cont: 'color' },
    { id: 'm_color_red', cat: 'Peluquería y estética', n: '🎨 Complementarios · red', d: 'Todos los tonos conectados: se ve qué anula qué.', est: 'red', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'color' },
    { id: 'm_piel_niveles', cat: 'Peluquería y estética', n: '🧴 La piel · bandas', d: 'Tres bandas: epidermis, dermis e hipodermis.', est: 'niveles', pal: 'editorial_edu', fmt: 'a4v', cont: 'piel' },
    { id: 'm_fp_espina', cat: 'Peluquería y estética', n: '🦴 Riesgos · espina', d: 'Causa y efecto: por qué falla la prevención en el salón.', est: 'espina', pal: 'semaforo', fmt: 'a4h', cont: 'fp' },

    /* Ciencias */
    { id: 'm_celula_radial', cat: 'Ciencias', n: '🔬 La célula · radial', d: 'Orgánulos alrededor del núcleo, con su función.', est: 'radial', pal: 'cientifico', fmt: 'a4v', cont: 'celula' },
    { id: 'm_celula_columnas', cat: 'Ciencias', n: '🔬 La célula · columnas', d: 'Una columna por orgánulo. Para texto largo.', est: 'columnas', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'celula' },
    { id: 'm_agua_cadena', cat: 'Ciencias', n: '💧 Ciclo del agua · cadena', d: 'Las seis fases con flechas: el circuito se cierra.', est: 'cadena', pal: 'cientifico', fmt: 'a4h', forma: 'pildora', cont: 'agua' },
    { id: 'm_agua_sol', cat: 'Ciencias', n: '💧 Ciclo del agua · sol', d: 'Rayos desde el centro: fase y explicación en el rayo.', est: 'sol', pal: 'pizarra', fmt: 'cuadrado', cont: 'agua' },
    { id: 'm_celula_lateral', cat: 'Ciencias', n: '🔬 Célula · árbol lateral', d: 'Se lee de izquierda a derecha, como un índice.', est: 'arbol_lateral', pal: 'editorial_edu', fmt: 'a4h', cont: 'celula' },
    { id: 'm_agua_burbujas', cat: 'Ciencias', n: '💧 Agua · burbujas', d: 'Todo en círculos, para primeros cursos.', est: 'burbujas', pal: 'infantil', fmt: 'cuadrado', cont: 'agua' },

    /* Lengua y literatura */
    { id: 'm_oracion_arbol', cat: 'Lengua y literatura', n: '📝 La oración · árbol', d: 'El análisis sintáctico como organigrama.', est: 'arbol', pal: 'cuaderno', fmt: 'a4v', forma: 'recta', cont: 'lengua' },
    { id: 'm_oracion_lateral', cat: 'Lengua y literatura', n: '📝 La oración · lateral', d: 'Sujeto y predicado abriéndose a la derecha.', est: 'arbol_lateral', pal: 'editorial_edu', fmt: 'a4h', cont: 'lengua' },
    { id: 'm_generos_radial', cat: 'Lengua y literatura', n: '📚 Géneros · radial', d: 'Los cuatro géneros y sus formas.', est: 'radial', pal: 'humanidades', fmt: 'a4v', forma: 'pildora', cont: 'literatura' },
    { id: 'm_generos_columnas', cat: 'Lengua y literatura', n: '📚 Géneros · columnas', d: 'Comparativa en columnas con ejemplos debajo.', est: 'columnas', pal: 'humanidades', fmt: 'a4h', cont: 'literatura' },

    /* Matemáticas */
    { id: 'm_frac_radial', cat: 'Matemáticas', n: '➗ Fracciones · radial', d: 'Las operaciones alrededor del concepto.', est: 'radial', pal: 'cuadricula', fmt: 'a4v', forma: 'caja', cont: 'mates' },
    { id: 'm_frac_cadena', cat: 'Matemáticas', n: '➗ Fracciones · pasos', d: 'Procedimiento paso a paso, con flechas.', est: 'cadena', pal: 'semaforo', fmt: 'a4h', cont: 'mates' },
    { id: 'm_tri_niveles', cat: 'Matemáticas', n: '📐 Triángulos · bandas', d: 'Clasificación por lados y por ángulos.', est: 'niveles', pal: 'cuadricula', fmt: 'a4v', cont: 'geometria' },
    { id: 'm_tri_hex', cat: 'Matemáticas', n: '📐 Triángulos · hexágonos', d: 'Nodos hexagonales sobre cuadrícula técnica.', est: 'radial', pal: 'cuadricula', fmt: 'cuadrado', forma: 'hexagono', cont: 'geometria' },

    /* Historia y sociales */
    { id: 'm_indus_espina', cat: 'Historia y sociales', n: '🏭 Industrial · espina', d: 'Causas arriba y abajo, consecuencia al final del eje.', est: 'espina', pal: 'humanidades', fmt: 'a4h', cont: 'historia' },
    { id: 'm_indus_arbol', cat: 'Historia y sociales', n: '🏭 Industrial · árbol', d: 'Causas, desarrollo y consecuencias por niveles.', est: 'arbol', pal: 'editorial_edu', fmt: 'a4v', cont: 'historia' },
    { id: 'm_feudal_niveles', cat: 'Historia y sociales', n: '🏰 Sociedad feudal · bandas', d: 'Los tres órdenes en tres bandas, de arriba abajo.', est: 'niveles', pal: 'humanidades', fmt: 'a4v', cont: 'edadmedia' },
    { id: 'm_feudal_red', cat: 'Historia y sociales', n: '🏰 Vasallaje · red', d: 'Relaciones cruzadas: quién debe qué a quién.', est: 'red', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'edadmedia' },

    /* Formación profesional */
    { id: 'm_empresa_cadena', cat: 'Formación profesional', n: '💼 Montar el negocio · pasos', d: 'De la idea a la apertura, en orden.', est: 'cadena', pal: 'cuadricula', fmt: 'a4h', cont: 'empresa' },
    { id: 'm_empresa_columnas', cat: 'Formación profesional', n: '💼 Plan de empresa · columnas', d: 'Un bloque por área, con sus puntos.', est: 'columnas', pal: 'editorial_edu', fmt: 'a4h', cont: 'empresa' },
    { id: 'm_estudio_sol', cat: 'Formación profesional', n: '🎯 Método de estudio · sol', d: 'Cinco pasos saliendo del centro.', est: 'sol', pal: 'pizarra_negra', fmt: 'cuadrado', cont: 'estudio' },

    /* Infantil y primaria */
    { id: 'm_animales_burbujas', cat: 'Infantil y primaria', n: '🐾 Animales · burbujas', d: 'Círculos grandes con hueco para foto en cada uno.', est: 'burbujas', pal: 'infantil', fmt: 'a4h', cont: 'infantil' },
    { id: 'm_estaciones_radial', cat: 'Infantil y primaria', n: '🍂 Estaciones · radial', d: 'Cuatro nodos en cruz y el año en el centro.', est: 'radial', pal: 'pastel', fmt: 'cuadrado', forma: 'nube', cont: 'estaciones' },
    { id: 'm_neutro_pizarra', cat: 'Plantilla en blanco', n: '⬜ En blanco · pizarra', d: 'Estructura radial vacía, lista para tu tema.', est: 'radial', pal: 'pizarra', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ═══════════════════════ MANDALAS · 30 ═══════════════════════ */

  var MANDALAS = [
    { id: 'd_corte_petalos', cat: 'Peluquería y estética', n: '💇 Corte · pétalos', d: 'Cada decisión del corte en un pétalo.', est: 'mandala_petalos', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'corte' },
    { id: 'd_corte_cunas', cat: 'Peluquería y estética', n: '💇 Corte · cuñas', d: 'La rueda partida en sectores iguales.', est: 'mandala_cunas', pal: 'editorial_edu', fmt: 'cuadrado', cont: 'corte' },
    { id: 'd_color_roseton', cat: 'Peluquería y estética', n: '🎨 Color · rosetón', d: 'Círculos tangentes: la rueda cromática hecha mandala.', est: 'mandala_roseton', pal: 'pastel', fmt: 'cuadrado', cont: 'color' },
    { id: 'd_color_cunas', cat: 'Peluquería y estética', n: '🎨 Color · sectores', d: 'Doce sectores para el círculo cromático.', est: 'mandala_cunas', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'color' },
    { id: 'd_piel_anillos', cat: 'Peluquería y estética', n: '🧴 La piel · anillos', d: 'Capas concéntricas: la piel se lee de fuera adentro.', est: 'mandala_anillos', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'piel' },
    { id: 'd_fp_reloj', cat: 'Peluquería y estética', n: '🦺 Jornada segura · reloj', d: 'Las horas del salón y su riesgo en cada tramo.', est: 'mandala_reloj', pal: 'semaforo', fmt: 'cuadrado', cont: 'fp' },

    { id: 'd_celula_anillos', cat: 'Ciencias', n: '🔬 Célula · anillos', d: 'Del núcleo a la membrana, en aros.', est: 'mandala_anillos', pal: 'cientifico', fmt: 'cuadrado', cont: 'celula' },
    { id: 'd_celula_petalos', cat: 'Ciencias', n: '🔬 Célula · pétalos', d: 'Orgánulos en pétalos alrededor del núcleo.', est: 'mandala_petalos', pal: 'cientifico', fmt: 'cuadrado', cont: 'celula' },
    { id: 'd_agua_reloj', cat: 'Ciencias', n: '💧 Ciclo del agua · reloj', d: 'El ciclo como esfera de reloj: nunca se acaba.', est: 'mandala_reloj', pal: 'cientifico', fmt: 'cuadrado', cont: 'agua' },
    { id: 'd_agua_espiral', cat: 'Ciencias', n: '💧 Ciclo del agua · espiral', d: 'La secuencia enrollada, de dentro hacia fuera.', est: 'mandala_espiral', pal: 'pizarra', fmt: 'cuadrado', cont: 'agua' },
    { id: 'd_agua_mosaico', cat: 'Ciencias', n: '💧 Agua · mosaico', d: 'Teselas radiales: la más decorativa para exponer.', est: 'mandala_mosaico', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'agua' },
    { id: 'd_celula_estrella', cat: 'Ciencias', n: '🔬 Célula · estrella', d: 'Puntas geométricas, aire técnico.', est: 'mandala_estrella', pal: 'cuadricula', fmt: 'cuadrado', cont: 'celula' },

    { id: 'd_oracion_cunas', cat: 'Lengua y literatura', n: '📝 La oración · cuñas', d: 'Los complementos repartidos en sectores.', est: 'mandala_cunas', pal: 'cuaderno', fmt: 'cuadrado', cont: 'lengua' },
    { id: 'd_generos_petalos', cat: 'Lengua y literatura', n: '📚 Géneros · pétalos', d: 'Cuatro pétalos, uno por género.', est: 'mandala_petalos', pal: 'humanidades', fmt: 'cuadrado', cont: 'literatura' },
    { id: 'd_generos_roseton', cat: 'Lengua y literatura', n: '📚 Géneros · rosetón', d: 'Rosetón de biblioteca, en tonos tierra.', est: 'mandala_roseton', pal: 'humanidades', fmt: 'cuadrado', cont: 'literatura' },
    { id: 'd_oracion_anillos', cat: 'Lengua y literatura', n: '📝 Sintaxis · anillos', d: 'Núcleo, complementos y ejemplos en tres aros.', est: 'mandala_anillos', pal: 'editorial_edu', fmt: 'cuadrado', cont: 'lengua' },

    { id: 'd_frac_cunas', cat: 'Matemáticas', n: '➗ Fracciones · sectores', d: 'La unidad partida: el mandala ES la fracción.', est: 'mandala_cunas', pal: 'cuadricula', fmt: 'cuadrado', cont: 'mates' },
    { id: 'd_tri_estrella', cat: 'Matemáticas', n: '📐 Triángulos · estrella', d: 'Puntas rectas sobre cuadrícula.', est: 'mandala_estrella', pal: 'cuadricula', fmt: 'cuadrado', cont: 'geometria' },
    { id: 'd_tri_mosaico', cat: 'Matemáticas', n: '📐 Geometría · mosaico', d: 'Simetría radial: teselado y ángulos.', est: 'mandala_mosaico', pal: 'cuadricula', fmt: 'cuadrado', cont: 'geometria' },
    { id: 'd_frac_anillos', cat: 'Matemáticas', n: '➗ Fracciones · anillos', d: 'Aros de equivalencia, uno dentro de otro.', est: 'mandala_anillos', pal: 'semaforo', fmt: 'cuadrado', cont: 'mates' },

    { id: 'd_feudal_cunas', cat: 'Historia y sociales', n: '🏰 Sociedad feudal · cuñas', d: 'Los órdenes como porciones de la sociedad.', est: 'mandala_cunas', pal: 'humanidades', fmt: 'cuadrado', cont: 'edadmedia' },
    { id: 'd_feudal_roseton', cat: 'Historia y sociales', n: '🏰 Feudalismo · rosetón', d: 'Rosetón de vidriera, tonos de noche.', est: 'mandala_roseton', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'edadmedia' },
    { id: 'd_indus_espiral', cat: 'Historia y sociales', n: '🏭 Industrial · espiral', d: 'Cronología enrollada: causa, proceso, efecto.', est: 'mandala_espiral', pal: 'humanidades', fmt: 'cuadrado', cont: 'historia' },
    { id: 'd_indus_reloj', cat: 'Historia y sociales', n: '🏭 Industrial · reloj', d: 'El siglo repartido en horas.', est: 'mandala_reloj', pal: 'editorial_edu', fmt: 'cuadrado', cont: 'historia' },

    { id: 'd_empresa_cunas', cat: 'Formación profesional', n: '💼 Áreas del negocio · cuñas', d: 'Seis áreas, seis sectores.', est: 'mandala_cunas', pal: 'cuadricula', fmt: 'cuadrado', cont: 'empresa' },
    { id: 'd_estudio_espiral', cat: 'Formación profesional', n: '🎯 Método · espiral', d: 'Los pasos en espiral: se vuelve a pasar por ellos.', est: 'mandala_espiral', pal: 'pizarra_negra', fmt: 'cuadrado', cont: 'estudio' },
    { id: 'd_estudio_petalos', cat: 'Formación profesional', n: '🎯 Método · pétalos', d: 'Cinco pétalos y el hábito en el centro.', est: 'mandala_petalos', pal: 'pastel', fmt: 'cuadrado', cont: 'estudio' },

    { id: 'd_estaciones_reloj', cat: 'Infantil y primaria', n: '🍂 Estaciones · reloj', d: 'El año como esfera: cuatro cuartos.', est: 'mandala_reloj', pal: 'infantil', fmt: 'cuadrado', cont: 'estaciones' },
    { id: 'd_animales_roseton', cat: 'Infantil y primaria', n: '🐾 Animales · rosetón', d: 'Círculos grandes para pegar una foto en cada uno.', est: 'mandala_roseton', pal: 'infantil', fmt: 'cuadrado', cont: 'infantil' },
    { id: 'd_neutro_mosaico', cat: 'Plantilla en blanco', n: '⬜ En blanco · mosaico', d: 'Mandala vacío con ocho teselas.', est: 'mandala_mosaico', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'neutro' }
  ];

  /* ═══════════════════════ CARRUSEL · 30 ═══════════════════════
     Un carrusel es una SERIE: cada plantilla define el papel de cada hoja.
     `serie` son las estructuras de hoja, en orden. */

  var S_CLASICA = ['car_portada', 'car_punto', 'car_punto', 'car_punto', 'car_cierre'];
  var S_LISTA = ['car_portada', 'car_lista', 'car_punto', 'car_dato', 'car_cierre'];
  var S_CITA = ['car_portada', 'car_cita', 'car_punto', 'car_punto', 'car_cierre'];
  var S_DATOS = ['car_portada', 'car_dato', 'car_dato', 'car_punto', 'car_cierre'];
  var S_CORTA = ['car_portada', 'car_punto', 'car_cierre'];
  var S_LARGA = ['car_portada', 'car_punto', 'car_punto', 'car_lista', 'car_cita', 'car_dato', 'car_cierre'];

  var CARRUSELES = [
    { id: 'c_corte_ig', cat: 'Peluquería y estética', n: '💇 Corte · clásico IG', d: 'Cinco hojas cuadradas: portada, tres claves y cierre.', est: 'car_portada', serie: S_CLASICA, pal: 'editorial_edu', fmt: 'cuadrado', cont: 'car_corte' },
    { id: 'c_corte_historia', cat: 'Peluquería y estética', n: '💇 Corte · historia 9:16', d: 'Vertical para stories y estados.', est: 'car_portada', serie: S_CLASICA, pal: 'mandala_noche', fmt: 'historia', cont: 'car_corte' },
    { id: 'c_corte_larga', cat: 'Peluquería y estética', n: '💇 Corte · serie larga', d: 'Siete hojas: incluye lista, cita y dato.', est: 'car_portada', serie: S_LARGA, pal: 'editorial_edu', fmt: 'cuadrado', cont: 'car_corte' },
    { id: 'c_color_datos', cat: 'Peluquería y estética', n: '🎨 Color · con cifras', d: 'Dos hojas de dato grande: volúmenes y tiempos.', est: 'car_portada', serie: S_DATOS, pal: 'pastel', fmt: 'cuadrado', cont: 'car_color' },
    { id: 'c_color_historia', cat: 'Peluquería y estética', n: '🎨 Color · historia', d: 'Vertical con fondo de foto y velo.', est: 'car_portada', serie: S_CLASICA, pal: 'mandala_tierra', fmt: 'historia', cont: 'car_color' },
    { id: 'c_color_corta', cat: 'Peluquería y estética', n: '🎨 Color · tres hojas', d: 'Lo mínimo: portada, idea y cierre.', est: 'car_portada', serie: S_CORTA, pal: 'editorial_edu', fmt: 'cuadrado', cont: 'car_color' },
    { id: 'c_corte_cita', cat: 'Peluquería y estética', n: '💇 Corte · con cita', d: 'Una frase grande como respiro en medio.', est: 'car_portada', serie: S_CITA, pal: 'humanidades', fmt: 'cuadrado', cont: 'car_corte' },
    { id: 'c_corte_lista', cat: 'Peluquería y estética', n: '💇 Corte · con lista', d: 'Una hoja de lista corta y una de dato.', est: 'car_portada', serie: S_LISTA, pal: 'cuadricula', fmt: 'cuadrado', cont: 'car_corte' },

    { id: 'c_agua_clasica', cat: 'Ciencias', n: '💧 Ciclo del agua · clásico', d: 'Portada, tres fases y cierre.', est: 'car_portada', serie: S_CLASICA, pal: 'cientifico', fmt: 'cuadrado', cont: 'car_ciencia' },
    { id: 'c_agua_historia', cat: 'Ciencias', n: '💧 Agua · historia', d: 'Vertical, para clase por móvil.', est: 'car_portada', serie: S_CLASICA, pal: 'pizarra', fmt: 'historia', cont: 'car_ciencia' },
    { id: 'c_agua_datos', cat: 'Ciencias', n: '💧 Agua · con cifras', d: 'Dos datos grandes: litros y años.', est: 'car_portada', serie: S_DATOS, pal: 'cientifico', fmt: 'cuadrado', cont: 'car_ciencia' },
    { id: 'c_agua_larga', cat: 'Ciencias', n: '💧 Agua · serie larga', d: 'Siete hojas para una unidad completa.', est: 'car_portada', serie: S_LARGA, pal: 'cuadricula', fmt: 'cuadrado', cont: 'car_ciencia' },
    { id: 'c_agua_pantalla', cat: 'Ciencias', n: '💧 Agua · pantalla 16:9', d: 'Para proyector: las mismas hojas en apaisado.', est: 'car_portada', serie: S_CLASICA, pal: 'cientifico', fmt: 'pizarra', cont: 'car_ciencia' },
    { id: 'c_agua_lista', cat: 'Ciencias', n: '💧 Agua · con lista', d: 'Las fases en una sola hoja de lista.', est: 'car_portada', serie: S_LISTA, pal: 'pizarra', fmt: 'cuadrado', cont: 'car_ciencia' },

    { id: 'c_estudio_clasica', cat: 'Estudio y método', n: '🎯 Estudiar mejor · clásico', d: 'La serie que más funciona: portada, tres claves, cierre.', est: 'car_portada', serie: S_CLASICA, pal: 'pizarra_negra', fmt: 'cuadrado', cont: 'car_estudio' },
    { id: 'c_estudio_historia', cat: 'Estudio y método', n: '🎯 Estudiar mejor · historia', d: 'Vertical, tipografía grande.', est: 'car_portada', serie: S_CLASICA, pal: 'pizarra_negra', fmt: 'historia', cont: 'car_estudio' },
    { id: 'c_estudio_cita', cat: 'Estudio y método', n: '🎯 Método · con cita', d: 'Cita central en serif, aire alrededor.', est: 'car_portada', serie: S_CITA, pal: 'editorial_edu', fmt: 'cuadrado', cont: 'car_estudio' },
    { id: 'c_estudio_datos', cat: 'Estudio y método', n: '🎯 Método · con cifras', d: 'El repaso espaciado en dos datos.', est: 'car_portada', serie: S_DATOS, pal: 'semaforo', fmt: 'cuadrado', cont: 'car_estudio' },
    { id: 'c_estudio_larga', cat: 'Estudio y método', n: '🎯 Método · serie larga', d: 'Siete hojas: la clase entera en un carrusel.', est: 'car_portada', serie: S_LARGA, pal: 'cuaderno', fmt: 'cuadrado', cont: 'car_estudio' },
    { id: 'c_estudio_corta', cat: 'Estudio y método', n: '🎯 Método · tres hojas', d: 'Una idea sola, bien dicha.', est: 'car_portada', serie: S_CORTA, pal: 'pastel', fmt: 'cuadrado', cont: 'car_estudio' },
    { id: 'c_estudio_pantalla', cat: 'Estudio y método', n: '🎯 Método · pantalla', d: '16:9 para proyectar en el aula.', est: 'car_portada', serie: S_CLASICA, pal: 'pizarra', fmt: 'pizarra', cont: 'car_estudio' },
    { id: 'c_estudio_lista', cat: 'Estudio y método', n: '🎯 Método · con lista', d: 'Los cinco pasos en una hoja.', est: 'car_portada', serie: S_LISTA, pal: 'cuaderno', fmt: 'cuadrado', cont: 'car_estudio' },

    { id: 'c_lengua_clasica', cat: 'Lengua y humanidades', n: '📝 Sintaxis · clásico', d: 'Tres reglas de análisis, una por hoja.', est: 'car_portada', serie: S_CLASICA, pal: 'cuaderno', fmt: 'cuadrado', cont: 'lengua' },
    { id: 'c_lengua_cita', cat: 'Lengua y humanidades', n: '📚 Literatura · con cita', d: 'Cita en Cormorant, tonos de biblioteca.', est: 'car_portada', serie: S_CITA, pal: 'humanidades', fmt: 'cuadrado', cont: 'literatura' },
    { id: 'c_historia_datos', cat: 'Lengua y humanidades', n: '🏭 Historia · con cifras', d: 'Fechas grandes y su explicación corta.', est: 'car_portada', serie: S_DATOS, pal: 'humanidades', fmt: 'cuadrado', cont: 'historia' },
    { id: 'c_historia_historia', cat: 'Lengua y humanidades', n: '🏰 Historia · vertical', d: 'Los tres órdenes en tres hojas.', est: 'car_portada', serie: S_CLASICA, pal: 'mandala_tierra', fmt: 'historia', cont: 'edadmedia' },

    { id: 'c_mates_lista', cat: 'Matemáticas y técnica', n: '➗ Fracciones · con lista', d: 'Reglas en lista y un dato de repaso.', est: 'car_portada', serie: S_LISTA, pal: 'cuadricula', fmt: 'cuadrado', cont: 'mates' },
    { id: 'c_mates_clasica', cat: 'Matemáticas y técnica', n: '📐 Triángulos · clásico', d: 'Clasificación en tres hojas.', est: 'car_portada', serie: S_CLASICA, pal: 'cuadricula', fmt: 'cuadrado', cont: 'geometria' },

    { id: 'c_infantil_corta', cat: 'Infantil y primaria', n: '🐾 Animales · tres hojas', d: 'Colores primarios y letra grande.', est: 'car_portada', serie: S_CORTA, pal: 'infantil', fmt: 'cuadrado', cont: 'infantil' },
    { id: 'c_neutro_clasica', cat: 'Plantilla en blanco', n: '⬜ En blanco · cinco hojas', d: 'Serie vacía lista para tu contenido.', est: 'car_portada', serie: S_CLASICA, pal: 'editorial_edu', fmt: 'cuadrado', cont: 'neutro' }
  ];

  /* ═══════════════════════ PÓSTER · 30 ═══════════════════════
     El póster se lee de pie y de lejos: pocas piezas, muy grandes. Cuando la
     estructura pone su propio titular, la plantilla marca `sincab` para que la
     cabecera general no lo repita. */

  var POSTERS = [
    { id: 'p_higiene_aviso', cat: 'Peluquería y estética', n: '🧼 Higiene · aviso', d: 'Cabecera maciza y renglones cortos para colgar en cabina.', est: 'pos_aviso', pal: 'semaforo', fmt: 'a3v', cont: 'higiene', sincab: true },
    { id: 'p_higiene_numeros', cat: 'Peluquería y estética', n: '🧼 Desinfección · numerado', d: 'Protocolo en pasos numerados, uno por línea.', est: 'pos_numeros', pal: 'cientifico', fmt: 'a3v', cont: 'higiene', sincab: true },
    { id: 'p_tarifas_indice', cat: 'Peluquería y estética', n: '💶 Tarifas · índice', d: 'Lista reglada de servicios para la entrada del salón.', est: 'pos_indice', pal: 'editorial_edu', fmt: 'a3v', cont: 'tarifas', sincab: true },
    { id: 'p_corte_columnas', cat: 'Peluquería y estética', n: '💇 Corte · columnas', d: 'Póster de aula: título ancho y el temario en columnas.', est: 'pos_columnas', pal: 'cuadricula', fmt: 'a3v', cont: 'corte', sincab: true },
    { id: 'p_color_foco', cat: 'Peluquería y estética', n: '🎨 Color · foco central', d: 'La rueda en el centro y las etiquetas a los lados.', est: 'pos_foco', pal: 'mandala_noche', fmt: 'a3v', cont: 'color' },
    { id: 'p_jornada_evento', cat: 'Peluquería y estética', n: '📣 Puertas abiertas · evento', d: 'Título, fecha grande y los detalles al pie.', est: 'pos_evento', pal: 'editorial_edu', fmt: 'a3v', cont: 'jornada', sincab: true },
    { id: 'p_fp_bandas', cat: 'Peluquería y estética', n: '🦺 Prevención · bandas', d: 'Una franja por riesgo, con su medida.', est: 'pos_bandas', pal: 'semaforo', fmt: 'a4v', cont: 'fp', sincab: true },
    { id: 'p_corte_cartel', cat: 'Peluquería y estética', n: '💇 Corte · cartel', d: 'Titular enorme y tres claves al pie.', est: 'pos_cartel', pal: 'mandala_tierra', fmt: 'a3v', cont: 'car_corte', sincab: true },

    { id: 'p_celula_foco', cat: 'Ciencias', n: '🔬 Célula · foco', d: 'El núcleo en el centro y los orgánulos etiquetados.', est: 'pos_foco', pal: 'cientifico', fmt: 'a3v', cont: 'celula' },
    { id: 'p_agua_numeros', cat: 'Ciencias', n: '💧 Ciclo del agua · numerado', d: 'Las seis fases en orden, con su cifra.', est: 'pos_numeros', pal: 'cientifico', fmt: 'a3v', cont: 'agua', sincab: true },
    { id: 'p_celula_columnas', cat: 'Ciencias', n: '🔬 Célula · columnas', d: 'Póster científico clásico: título y tres columnas.', est: 'pos_columnas', pal: 'cuadricula', fmt: 'a3v', cont: 'celula', sincab: true },
    { id: 'p_agua_rejilla', cat: 'Ciencias', n: '💧 Agua · rejilla', d: 'Fichas del mismo peso, apaisado para el pasillo.', est: 'pos_rejilla', pal: 'pizarra', fmt: 'a3h', cont: 'agua', sincab: true },
    { id: 'p_reciclaje_cartel', cat: 'Ciencias', n: '♻️ Reciclaje · cartel', d: 'Contenedor por contenedor, en color plano.', est: 'pos_cartel', pal: 'infantil', fmt: 'a3v', cont: 'reciclaje', sincab: true },

    { id: 'p_oracion_columnas', cat: 'Lengua y literatura', n: '📝 La oración · columnas', d: 'Sintaxis a la vista durante todo el trimestre.', est: 'pos_columnas', pal: 'cuaderno', fmt: 'a3v', cont: 'lengua', sincab: true },
    { id: 'p_generos_rejilla', cat: 'Lengua y literatura', n: '📚 Géneros · rejilla', d: 'Cuatro fichas grandes, una por género.', est: 'pos_rejilla', pal: 'humanidades', fmt: 'a3v', cont: 'literatura', sincab: true },
    { id: 'p_literatura_franja', cat: 'Lengua y literatura', n: '📚 Literatura · franja', d: 'Bloque de color con el tema y el detalle a la derecha.', est: 'pos_franja', pal: 'humanidades', fmt: 'a3h', cont: 'literatura' },

    { id: 'p_frac_rejilla', cat: 'Matemáticas', n: '➗ Fracciones · rejilla', d: 'Cada operación en su ficha.', est: 'pos_rejilla', pal: 'cuadricula', fmt: 'a3v', cont: 'mates', sincab: true },
    { id: 'p_tri_mosaico', cat: 'Matemáticas', n: '📐 Triángulos · mosaico', d: 'Una pieza grande arriba y cuatro menores debajo.', est: 'pos_mosaico', pal: 'cuadricula', fmt: 'a3v', cont: 'geometria', sincab: true },
    { id: 'p_frac_numeros', cat: 'Matemáticas', n: '➗ Fracciones · numerado', d: 'Procedimiento en pasos, para tenerlo delante.', est: 'pos_numeros', pal: 'semaforo', fmt: 'a4v', cont: 'mates', sincab: true },

    { id: 'p_indus_bandas', cat: 'Historia y sociales', n: '🏭 Industrial · bandas', d: 'Causas, proceso y consecuencias en franjas.', est: 'pos_bandas', pal: 'humanidades', fmt: 'a3v', cont: 'historia', sincab: true },
    { id: 'p_feudal_franja', cat: 'Historia y sociales', n: '🏰 Sociedad feudal · franja', d: 'Los tres órdenes junto a un bloque de color.', est: 'pos_franja', pal: 'mandala_tierra', fmt: 'a3v', cont: 'edadmedia' },
    { id: 'p_indus_indice', cat: 'Historia y sociales', n: '🏭 Industrial · índice', d: 'Cronología reglada, línea a línea.', est: 'pos_indice', pal: 'editorial_edu', fmt: 'a3v', cont: 'historia', sincab: true },

    { id: 'p_empresa_columnas', cat: 'Formación profesional', n: '💼 Plan de empresa · columnas', d: 'El plan entero en una hoja para el aula taller.', est: 'pos_columnas', pal: 'editorial_edu', fmt: 'a3v', cont: 'empresa', sincab: true },
    { id: 'p_estudio_numeros', cat: 'Formación profesional', n: '🎯 Método · numerado', d: 'Los cinco pasos, grandes y en orden.', est: 'pos_numeros', pal: 'pizarra_negra', fmt: 'a3v', cont: 'estudio', sincab: true },
    { id: 'p_estudio_cartel', cat: 'Formación profesional', n: '🎯 Estudiar mejor · cartel', d: 'Titular y tres claves: para el tablón de la biblioteca.', est: 'pos_cartel', pal: 'pizarra_negra', fmt: 'a3v', cont: 'car_estudio', sincab: true },
    { id: 'p_evacuacion_aviso', cat: 'Formación profesional', n: '🚨 Evacuación · aviso', d: 'Instrucciones cortas, alto contraste, junto a la puerta.', est: 'pos_aviso', pal: 'semaforo', fmt: 'a3v', cont: 'evacuacion', sincab: true },

    { id: 'p_normas_numeros', cat: 'Infantil y primaria', n: '📋 Normas del aula · numerado', d: 'Seis normas con su número, en letra grande.', est: 'pos_numeros', pal: 'infantil', fmt: 'a3v', cont: 'normas', sincab: true },
    { id: 'p_animales_rejilla', cat: 'Infantil y primaria', n: '🐾 Animales · rejilla', d: 'Fichas grandes con hueco para foto.', est: 'pos_rejilla', pal: 'infantil', fmt: 'a3h', cont: 'infantil', sincab: true },
    { id: 'p_estaciones_mosaico', cat: 'Infantil y primaria', n: '🍂 Estaciones · mosaico', d: 'Una estación grande y las otras tres debajo.', est: 'pos_mosaico', pal: 'pastel', fmt: 'a3v', cont: 'estaciones', sincab: true },

    { id: 'p_neutro_bandas', cat: 'Plantilla en blanco', n: '⬜ En blanco · bandas', d: 'Cartel vacío de cinco franjas, listo para tu tema.', est: 'pos_bandas', pal: 'editorial_edu', fmt: 'a3v', cont: 'neutro', sincab: true }
  ];

  /* ═══════════════ LÍNEA DE TIEMPO · 30 ═══════════════ */

  var TIEMPOS = [
    { id: 't_pelu_hor', cat: 'Peluquería y estética', n: '💇 Historia del peinado · eje', d: 'Ocho hitos alternando sobre la línea.', est: 'tl_horizontal', pal: 'editorial_edu', fmt: 'a4h', cont: 'crono_pelu' },
    { id: 't_pelu_ver', cat: 'Peluquería y estética', n: '💇 Peinado · eje vertical', d: 'De arriba abajo, para colgar en el aula.', est: 'tl_vertical', pal: 'mandala_tierra', fmt: 'a4v', cont: 'crono_pelu' },
    { id: 't_pelu_indice', cat: 'Peluquería y estética', n: '💇 Peinado · cronología reglada', d: 'Fecha y hecho, línea a línea.', est: 'tl_indice', pal: 'humanidades', fmt: 'a4v', cont: 'crono_pelu' },
    { id: 't_color_esc', cat: 'Peluquería y estética', n: '🎨 Servicio de color · escalera', d: 'Cada fase, un escalón del servicio.', est: 'tl_escalera', pal: 'pastel', fmt: 'a4h', cont: 'proc_color' },
    { id: 't_pelu_serp', cat: 'Peluquería y estética', n: '💇 Peinado · serpentina', d: 'Cronología larga repartida en filas.', est: 'tl_serpiente', pal: 'editorial_edu', fmt: 'a4h', cont: 'crono_pelu' },
    { id: 't_pelu_arco', cat: 'Peluquería y estética', n: '💇 Peinado · arco', d: 'Las etapas sobre media circunferencia.', est: 'tl_arco', pal: 'mandala_noche', fmt: 'a4h', cont: 'crono_pelu' },

    { id: 't_tierra_hor', cat: 'Ciencias', n: '🌍 Historia de la Tierra · eje', d: 'Las cinco eras en su orden.', est: 'tl_horizontal', pal: 'cientifico', fmt: 'a4h', cont: 'crono_tierra' },
    { id: 't_tierra_ver', cat: 'Ciencias', n: '🌍 Eras · eje vertical', d: 'Columna geológica, de lo antiguo a hoy.', est: 'tl_vertical', pal: 'cientifico', fmt: 'a4v', cont: 'crono_tierra' },
    { id: 't_agua_arco', cat: 'Ciencias', n: '💧 Ciclo del agua · arco', d: 'Las fases descritas como recorrido.', est: 'tl_arco', pal: 'pizarra', fmt: 'a4h', cont: 'agua' },
    { id: 't_tierra_indice', cat: 'Ciencias', n: '🌍 Eras · reglada', d: 'Era y descripción con filete.', est: 'tl_indice', pal: 'cuadricula', fmt: 'a4v', cont: 'crono_tierra' },
    { id: 't_metodo_esc', cat: 'Ciencias', n: '🔬 Método científico · escalera', d: 'Cada paso apoyado en el anterior.', est: 'tl_escalera', pal: 'cientifico', fmt: 'a4h', cont: 'proc_cientifico' },

    { id: 't_lit_hor', cat: 'Lengua y literatura', n: '📚 Literatura · eje', d: 'Las etapas de la literatura española.', est: 'tl_horizontal', pal: 'humanidades', fmt: 'a4h', cont: 'crono_lit' },
    { id: 't_lit_indice', cat: 'Lengua y literatura', n: '📚 Literatura · reglada', d: 'Etapa y autores, línea a línea.', est: 'tl_indice', pal: 'humanidades', fmt: 'a4v', cont: 'crono_lit' },
    { id: 't_lit_serp', cat: 'Lengua y literatura', n: '📚 Literatura · serpentina', d: 'Ocho etapas repartidas en dos filas.', est: 'tl_serpiente', pal: 'cuaderno', fmt: 'a4h', cont: 'crono_lit' },

    { id: 't_texto_esc', cat: 'Matemáticas y método', n: '➗ Resolver un problema · escalera', d: 'Del enunciado a la respuesta.', est: 'tl_escalera', pal: 'cuadricula', fmt: 'a4h', cont: 'proc_problema' },
    { id: 't_estudio_hor', cat: 'Matemáticas y método', n: '🎯 Método de estudio · eje', d: 'Los cinco pasos en línea.', est: 'tl_horizontal', pal: 'pizarra_negra', fmt: 'a4h', cont: 'estudio' },

    { id: 't_esp_hor', cat: 'Historia y sociales', n: '🇪🇸 Siglo XX · eje', d: 'Siete fechas para situar el siglo.', est: 'tl_horizontal', pal: 'humanidades', fmt: 'a4h', cont: 'crono_esp' },
    { id: 't_esp_ver', cat: 'Historia y sociales', n: '🇪🇸 Siglo XX · vertical', d: 'Para el pasillo o el cuaderno.', est: 'tl_vertical', pal: 'editorial_edu', fmt: 'a4v', cont: 'crono_esp' },
    { id: 't_esp_indice', cat: 'Historia y sociales', n: '🇪🇸 Siglo XX · reglada', d: 'Año y acontecimiento.', est: 'tl_indice', pal: 'editorial_edu', fmt: 'a4v', cont: 'crono_esp' },
    { id: 't_esp_serp', cat: 'Historia y sociales', n: '🇪🇸 Siglo XX · serpentina', d: 'Cronología larga en dos filas.', est: 'tl_serpiente', pal: 'humanidades', fmt: 'a4h', cont: 'crono_esp' },
    { id: 't_indus_esc', cat: 'Historia y sociales', n: '🏭 Industrial · escalera', d: 'Causas, energía, industria y consecuencias.', est: 'tl_escalera', pal: 'humanidades', fmt: 'a4h', cont: 'historia' },
    { id: 't_feudal_arco', cat: 'Historia y sociales', n: '🏰 Feudalismo · arco', d: 'Los órdenes como recorrido de lectura.', est: 'tl_arco', pal: 'mandala_tierra', fmt: 'a4h', cont: 'edadmedia' },
    { id: 't_indus_indice', cat: 'Historia y sociales', n: '🏭 Industrial · reglada', d: 'Etapa y explicación con filete.', est: 'tl_indice', pal: 'cuaderno', fmt: 'a4v', cont: 'historia' },

    { id: 't_curso_hor', cat: 'Formación profesional', n: '📅 El curso · eje', d: 'Septiembre a junio de un vistazo.', est: 'tl_horizontal', pal: 'cuadricula', fmt: 'a4h', cont: 'crono_curso' },
    { id: 't_empresa_esc', cat: 'Formación profesional', n: '💼 Montar el negocio · escalera', d: 'De la idea a la apertura, subiendo.', est: 'tl_escalera', pal: 'editorial_edu', fmt: 'a4h', cont: 'empresa' },
    { id: 't_pedido_ver', cat: 'Formación profesional', n: '📦 Pedido · eje vertical', d: 'Del proveedor a la estantería.', est: 'tl_vertical', pal: 'cuadricula', fmt: 'a4v', cont: 'proc_pedido' },
    { id: 't_curso_indice', cat: 'Formación profesional', n: '📅 El curso · reglada', d: 'Mes y qué toca ese mes.', est: 'tl_indice', pal: 'editorial_edu', fmt: 'a4v', cont: 'crono_curso' },

    { id: 't_estaciones_arco', cat: 'Infantil y primaria', n: '🍂 Estaciones · arco', d: 'El año como recorrido, en color plano.', est: 'tl_arco', pal: 'infantil', fmt: 'a4h', cont: 'estaciones' },
    { id: 't_agua_serp', cat: 'Infantil y primaria', n: '💧 Agua · serpentina', d: 'Fases grandes, letra grande.', est: 'tl_serpiente', pal: 'pastel', fmt: 'a4h', cont: 'agua' },

    { id: 't_neutro_hor', cat: 'Plantilla en blanco', n: '⬜ En blanco · eje', d: 'Línea de tiempo vacía, lista para tus fechas.', est: 'tl_horizontal', pal: 'editorial_edu', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ═══════════════ PROCESO Y FLUJO · 30 ═══════════════ */

  var FLUJOS = [
    { id: 'f_color_cadena', cat: 'Peluquería y estética', n: '🎨 Coloración · cadena', d: 'El servicio completo, paso a paso con flechas.', est: 'fl_cadena', pal: 'editorial_edu', fmt: 'a4h', cont: 'proc_color' },
    { id: 'f_color_serp', cat: 'Peluquería y estética', n: '🎨 Coloración · serpentina', d: 'Ocho pasos que no caben en una fila.', est: 'fl_serpiente', pal: 'pastel', fmt: 'a4v', cont: 'proc_color' },
    { id: 'f_cita_decision', cat: 'Peluquería y estética', n: '🤝 Atención al cliente · decisiones', d: 'Rombos donde hay que decidir algo.', est: 'fl_decision', pal: 'cuadricula', fmt: 'a4v', cont: 'proc_cita' },
    { id: 'f_cita_carriles', cat: 'Peluquería y estética', n: '🤝 Atención · dos carriles', d: 'Qué hace el salón y qué hace el cliente.', est: 'fl_carriles', pal: 'editorial_edu', fmt: 'a4h', cont: 'proc_cita' },
    { id: 'f_higiene_ciclo', cat: 'Peluquería y estética', n: '🧼 Higiene · ciclo', d: 'Se repite con cada cliente: no tiene fin.', est: 'fl_ciclo', pal: 'semaforo', fmt: 'cuadrado', cont: 'higiene' },
    { id: 'f_captacion_embudo', cat: 'Peluquería y estética', n: '📣 Captación · embudo', d: 'De la visita al perfil a la cita reservada.', est: 'fl_embudo', pal: 'mandala_tierra', fmt: 'a4v', cont: 'empresa' },

    { id: 'f_metodo_cadena', cat: 'Ciencias', n: '🔬 Método científico · cadena', d: 'Observación, hipótesis, experimento, conclusión.', est: 'fl_cadena', pal: 'cientifico', fmt: 'a4h', cont: 'proc_cientifico' },
    { id: 'f_metodo_decision', cat: 'Ciencias', n: '🔬 Método · con decisiones', d: '¿Se confirma la hipótesis? El rombo lo dice.', est: 'fl_decision', pal: 'cientifico', fmt: 'a4v', cont: 'proc_cientifico' },
    { id: 'f_agua_ciclo', cat: 'Ciencias', n: '💧 Ciclo del agua · ciclo', d: 'Flechas curvas: el circuito se cierra solo.', est: 'fl_ciclo', pal: 'cientifico', fmt: 'cuadrado', cont: 'agua' },
    { id: 'f_metodo_serp', cat: 'Ciencias', n: '🔬 Método · serpentina', d: 'Siete pasos en dos filas.', est: 'fl_serpiente', pal: 'pizarra', fmt: 'a4h', cont: 'proc_cientifico' },
    { id: 'f_agua_cadena', cat: 'Ciencias', n: '💧 Agua · cadena', d: 'Las fases en fila, con flecha entre ellas.', est: 'fl_cadena', pal: 'pizarra', fmt: 'a4h', cont: 'agua' },

    { id: 'f_texto_cadena', cat: 'Lengua y literatura', n: '📝 Escribir un texto · cadena', d: 'Del tema al texto entregado.', est: 'fl_cadena', pal: 'cuaderno', fmt: 'a4h', cont: 'proc_texto' },
    { id: 'f_texto_serp', cat: 'Lengua y literatura', n: '📝 Escribir · serpentina', d: 'Seis pasos en dos filas, con flechas.', est: 'fl_serpiente', pal: 'cuaderno', fmt: 'a4v', cont: 'proc_texto' },
    { id: 'f_texto_embudo', cat: 'Lengua y literatura', n: '📝 Del borrador al limpio · embudo', d: 'Se descarta hasta quedarse con lo que vale.', est: 'fl_embudo', pal: 'humanidades', fmt: 'a4v', cont: 'proc_texto' },

    { id: 'f_problema_decision', cat: 'Matemáticas', n: '➗ Resolver · con decisiones', d: '¿Tiene sentido el resultado? Se comprueba.', est: 'fl_decision', pal: 'cuadricula', fmt: 'a4v', cont: 'proc_problema' },
    { id: 'f_problema_cadena', cat: 'Matemáticas', n: '➗ Resolver · cadena', d: 'Leer, datos, operación, respuesta.', est: 'fl_cadena', pal: 'semaforo', fmt: 'a4h', cont: 'proc_problema' },
    { id: 'f_frac_serp', cat: 'Matemáticas', n: '➗ Fracciones · serpentina', d: 'El procedimiento repartido en filas.', est: 'fl_serpiente', pal: 'cuadricula', fmt: 'a4h', cont: 'mates' },

    { id: 'f_indus_cadena', cat: 'Historia y sociales', n: '🏭 Industrial · cadena', d: 'Causas, energía, industria, sociedad.', est: 'fl_cadena', pal: 'humanidades', fmt: 'a4h', cont: 'historia' },
    { id: 'f_feudal_ciclo', cat: 'Historia y sociales', n: '🏰 Vasallaje · ciclo', d: 'Obligaciones que vuelven al punto de partida.', est: 'fl_ciclo', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'edadmedia' },
    { id: 'f_indus_embudo', cat: 'Historia y sociales', n: '🏭 Del campo a la fábrica · embudo', d: 'La población se concentra en la ciudad.', est: 'fl_embudo', pal: 'editorial_edu', fmt: 'a4v', cont: 'historia' },

    { id: 'f_pedido_cadena', cat: 'Formación profesional', n: '📦 Pedido · cadena', d: 'Del control de stock al pago.', est: 'fl_cadena', pal: 'cuadricula', fmt: 'a4h', cont: 'proc_pedido' },
    { id: 'f_pedido_carriles', cat: 'Formación profesional', n: '📦 Pedido · dos carriles', d: 'Qué hace el salón y qué el proveedor.', est: 'fl_carriles', pal: 'editorial_edu', fmt: 'a4h', cont: 'proc_pedido' },
    { id: 'f_empresa_cadena', cat: 'Formación profesional', n: '💼 Montar el negocio · cadena', d: 'Los trámites en orden.', est: 'fl_cadena', pal: 'editorial_edu', fmt: 'a4h', cont: 'empresa' },
    { id: 'f_estudio_ciclo', cat: 'Formación profesional', n: '🎯 Método · ciclo', d: 'El repaso vuelve siempre al principio.', est: 'fl_ciclo', pal: 'pizarra_negra', fmt: 'cuadrado', cont: 'estudio' },
    { id: 'f_evac_decision', cat: 'Formación profesional', n: '🚨 Evacuación · decisiones', d: 'Qué hacer y qué comprobar en cada paso.', est: 'fl_decision', pal: 'semaforo', fmt: 'a4v', cont: 'evacuacion' },
    { id: 'f_empresa_embudo', cat: 'Formación profesional', n: '💼 Clientela · embudo', d: 'De la audiencia a la clientela fiel.', est: 'fl_embudo', pal: 'cuadricula', fmt: 'a4v', cont: 'empresa' },

    { id: 'f_normas_ciclo', cat: 'Infantil y primaria', n: '📋 Rutina del aula · ciclo', d: 'La jornada que se repite cada día.', est: 'fl_ciclo', pal: 'infantil', fmt: 'cuadrado', cont: 'normas' },
    { id: 'f_reciclaje_cadena', cat: 'Infantil y primaria', n: '♻️ Reciclaje · cadena', d: 'De la mano al contenedor correcto.', est: 'fl_cadena', pal: 'infantil', fmt: 'a4h', cont: 'reciclaje' },
    { id: 'f_higiene_serp', cat: 'Infantil y primaria', n: '🧼 Lavado de manos · serpentina', d: 'Los pasos en filas y con letra grande.', est: 'fl_serpiente', pal: 'pastel', fmt: 'a4h', cont: 'higiene' },

    { id: 'f_neutro_cadena', cat: 'Plantilla en blanco', n: '⬜ En blanco · cadena', d: 'Proceso vacío de cinco pasos.', est: 'fl_cadena', pal: 'editorial_edu', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ════════════ INFOGRAFÍA DE DATOS · 30 ════════════
     La cifra se escribe en el detalle del nodo: «Venta de producto · 18 %». */

  var DATOS = [
    { id: 'g_salon_barras', cat: 'Peluquería y estética', n: '📊 Salón · barras', d: 'Los indicadores del trimestre, comparados.', est: 'dt_barras', pal: 'editorial_edu', fmt: 'a4h', cont: 'dat_salon' },
    { id: 'g_salon_cifras', cat: 'Peluquería y estética', n: '📊 Salón · cifras grandes', d: 'Cinco números para la reunión de equipo.', est: 'dt_cifras', pal: 'pizarra_negra', fmt: 'a4h', cont: 'dat_salon' },
    { id: 'g_salon_donut', cat: 'Peluquería y estética', n: '📊 Servicios · anillo', d: 'Reparto de la facturación por servicio.', est: 'dt_donut', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'dat_salon' },
    { id: 'g_salon_progreso', cat: 'Peluquería y estética', n: '📊 Objetivos · progreso', d: 'Una pista por objetivo y su avance.', est: 'dt_progreso', pal: 'semaforo', fmt: 'a4v', cont: 'dat_salon' },
    { id: 'g_salon_columnas', cat: 'Peluquería y estética', n: '📊 Salón · columnas', d: 'Barras verticales sobre su línea de base.', est: 'dt_columnas', pal: 'cuadricula', fmt: 'a4h', cont: 'dat_salon' },
    { id: 'g_salon_picto', cat: 'Peluquería y estética', n: '📊 Salón · pictograma', d: 'Diez casillas por fila: se cuenta de un vistazo.', est: 'dt_pictograma', pal: 'pastel', fmt: 'a4h', cont: 'dat_salon' },

    { id: 'g_agua_donut', cat: 'Ciencias', n: '💧 Consumo de agua · anillo', d: 'En qué se va el agua de casa.', est: 'dt_donut', pal: 'cientifico', fmt: 'cuadrado', cont: 'dat_agua' },
    { id: 'g_agua_barras', cat: 'Ciencias', n: '💧 Consumo · barras', d: 'Comparativa directa entre usos.', est: 'dt_barras', pal: 'cientifico', fmt: 'a4h', cont: 'dat_agua' },
    { id: 'g_residuos_donut', cat: 'Ciencias', n: '♻️ Residuos · anillo', d: 'Qué hay dentro de la bolsa de basura.', est: 'dt_donut', pal: 'pizarra', fmt: 'cuadrado', cont: 'dat_residuos' },
    { id: 'g_residuos_columnas', cat: 'Ciencias', n: '♻️ Residuos · columnas', d: 'Cinco columnas y su línea de base.', est: 'dt_columnas', pal: 'cuadricula', fmt: 'a4h', cont: 'dat_residuos' },
    { id: 'g_agua_picto', cat: 'Ciencias', n: '💧 Agua · pictograma', d: 'Casillas llenas: proporción sin leer números.', est: 'dt_pictograma', pal: 'pizarra', fmt: 'a4h', cont: 'dat_agua' },

    { id: 'g_estudio_barras', cat: 'Estudio y método', n: '🎯 Cuánto se retiene · barras', d: 'Releer contra explicar: se ve solo.', est: 'dt_barras', pal: 'pizarra_negra', fmt: 'a4h', cont: 'dat_estudio' },
    { id: 'g_estudio_columnas', cat: 'Estudio y método', n: '🎯 Retención · columnas', d: 'La escalera de la evidencia, en vertical.', est: 'dt_columnas', pal: 'cientifico', fmt: 'a4h', cont: 'dat_estudio' },
    { id: 'g_estudio_cifras', cat: 'Estudio y método', n: '🎯 Retención · cifras', d: 'Cinco porcentajes enormes.', est: 'dt_cifras', pal: 'pizarra_negra', fmt: 'a4h', cont: 'dat_estudio' },
    { id: 'g_estudio_progreso', cat: 'Estudio y método', n: '🎯 Retención · progreso', d: 'Una pista por técnica de estudio.', est: 'dt_progreso', pal: 'editorial_edu', fmt: 'a4v', cont: 'dat_estudio' },
    { id: 'g_estudio_picto', cat: 'Estudio y método', n: '🎯 Retención · pictograma', d: 'Diez casillas por técnica.', est: 'dt_pictograma', pal: 'cuaderno', fmt: 'a4h', cont: 'dat_estudio' },
    { id: 'g_tiempo_donut', cat: 'Estudio y método', n: '⏱ El día · anillo', d: 'Las horas del día repartidas.', est: 'dt_donut', pal: 'pastel', fmt: 'cuadrado', cont: 'dat_tiempo' },
    { id: 'g_tiempo_barras', cat: 'Estudio y método', n: '⏱ El día · barras', d: 'Cuántas horas se van en qué.', est: 'dt_barras', pal: 'cuadricula', fmt: 'a4h', cont: 'dat_tiempo' },
    { id: 'g_tiempo_cifras', cat: 'Estudio y método', n: '⏱ El día · cifras', d: 'Horas grandes con su etiqueta.', est: 'dt_cifras', pal: 'infantil', fmt: 'a4h', cont: 'dat_tiempo' },

    { id: 'g_lengua_columnas', cat: 'Lengua y humanidades', n: '📝 Géneros · columnas', d: 'Presencia de cada género en el temario.', est: 'dt_columnas', pal: 'humanidades', fmt: 'a4h', cont: 'literatura' },
    { id: 'g_historia_barras', cat: 'Lengua y humanidades', n: '🏭 Industrial · barras', d: 'Peso de cada factor en el cambio.', est: 'dt_barras', pal: 'humanidades', fmt: 'a4h', cont: 'historia' },
    { id: 'g_feudal_donut', cat: 'Lengua y humanidades', n: '🏰 Sociedad feudal · anillo', d: 'Los tres órdenes como porciones.', est: 'dt_donut', pal: 'mandala_tierra', fmt: 'cuadrado', cont: 'edadmedia' },

    { id: 'g_frac_donut', cat: 'Matemáticas', n: '➗ Fracciones · anillo', d: 'La unidad partida: el anillo ES la fracción.', est: 'dt_donut', pal: 'cuadricula', fmt: 'cuadrado', cont: 'mates' },
    { id: 'g_frac_picto', cat: 'Matemáticas', n: '➗ Fracciones · pictograma', d: 'Casillas llenas y vacías para ver la parte.', est: 'dt_pictograma', pal: 'semaforo', fmt: 'a4h', cont: 'mates' },
    { id: 'g_tri_columnas', cat: 'Matemáticas', n: '📐 Triángulos · columnas', d: 'Clasificación en columnas comparables.', est: 'dt_columnas', pal: 'cuadricula', fmt: 'a4h', cont: 'geometria' },

    { id: 'g_empresa_cifras', cat: 'Formación profesional', n: '💼 Plan de empresa · cifras', d: 'Los números que hay que defender.', est: 'dt_cifras', pal: 'editorial_edu', fmt: 'a4h', cont: 'empresa' },
    { id: 'g_empresa_progreso', cat: 'Formación profesional', n: '💼 Puesta en marcha · progreso', d: 'Qué está hecho y qué falta.', est: 'dt_progreso', pal: 'cuadricula', fmt: 'a4v', cont: 'empresa' },

    { id: 'g_normas_picto', cat: 'Infantil y primaria', n: '📋 Normas · pictograma', d: 'Casillas grandes y color primario.', est: 'dt_pictograma', pal: 'infantil', fmt: 'a4h', cont: 'normas' },
    { id: 'g_estaciones_donut', cat: 'Infantil y primaria', n: '🍂 Estaciones · anillo', d: 'El año partido en cuatro.', est: 'dt_donut', pal: 'pastel', fmt: 'cuadrado', cont: 'estaciones' },

    { id: 'g_neutro_barras', cat: 'Plantilla en blanco', n: '⬜ En blanco · barras', d: 'Escribe la cifra en el detalle y la barra crece.', est: 'dt_barras', pal: 'editorial_edu', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ════════════ COMPARATIVA Y MATRIZ · 30 ════════════
     Dos ramas de nivel 1 con sus detalles debajo hacen las dos columnas.
     Si se pega una lista plana, se parte por la mitad. */

  var COMPARATIVAS = [
    { id: 'c_tintes_col', cat: 'Peluquería y estética', n: '⚖️ Tintes · dos columnas', d: 'Permanente contra semipermanente, punto por punto.', est: 'cp_columnas', pal: 'editorial_edu', fmt: 'a4h', cont: 'cmp_tintes' },
    { id: 'c_tintes_venn', cat: 'Peluquería y estética', n: '⚖️ Tintes · Venn', d: 'Lo propio de cada uno y lo que comparten.', est: 'cp_venn', pal: 'pastel', fmt: 'cuadrado', cont: 'cmp_tintes' },
    { id: 'c_tintes_tabla', cat: 'Peluquería y estética', n: '⚖️ Tintes · tabla', d: 'Criterios en filas para decidir en consulta.', est: 'cp_tabla', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'cmp_tintes' },
    { id: 'c_prod_tabla', cat: 'Peluquería y estética', n: '📋 Decolorantes · tabla', d: 'Tres productos comparados por cinco criterios.', est: 'cp_tabla', pal: 'editorial_edu', fmt: 'a4h', forma: 'recta', cont: 'cmp_tabla_prod' },
    { id: 'c_prod_balanza', cat: 'Peluquería y estética', n: '📋 Producto · a favor y en contra', d: 'Dos platillos con el eje al medio.', est: 'cp_balanza', pal: 'semaforo', fmt: 'a4h', cont: 'cmp_tabla_prod' },
    { id: 'c_antes_paneles', cat: 'Peluquería y estética', n: '🔄 Antes y después', d: 'Diagnóstico a la izquierda, resultado a la derecha.', est: 'cp_antes', pal: 'mandala_tierra', fmt: 'a4h', cont: 'cmp_antes' },
    { id: 'c_antes_col', cat: 'Peluquería y estética', n: '🔄 Antes y después · columnas', d: 'La misma comparación, sin flecha.', est: 'cp_columnas', pal: 'pastel', fmt: 'a4v', cont: 'cmp_antes' },
    { id: 'c_dafo_salon', cat: 'Peluquería y estética', n: '🧭 DAFO del salón', d: 'Cuatro cuadrantes antes de abrir.', est: 'cp_cuadrantes', pal: 'editorial_edu', fmt: 'a4h', cont: 'cmp_dafo' },

    { id: 'c_celulas_venn', cat: 'Ciencias', n: '🔬 Célula animal y vegetal · Venn', d: 'El clásico: dos círculos y lo común en medio.', est: 'cp_venn', pal: 'cientifico', fmt: 'cuadrado', cont: 'cmp_celulas' },
    { id: 'c_celulas_col', cat: 'Ciencias', n: '🔬 Células · dos columnas', d: 'Listas enfrentadas, fáciles de copiar.', est: 'cp_columnas', pal: 'cientifico', fmt: 'a4h', cont: 'cmp_celulas' },
    { id: 'c_celulas_tabla', cat: 'Ciencias', n: '🔬 Células · tabla', d: 'Estructura por estructura.', est: 'cp_tabla', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'cmp_celulas' },
    { id: 'c_celulas_pizarra', cat: 'Ciencias', n: '🔬 Células · Venn en pizarra', d: 'Sobre fondo oscuro, para proyectar.', est: 'cp_venn', pal: 'pizarra_negra', fmt: 'a4h', cont: 'cmp_celulas' },
    { id: 'c_animales_venn', cat: 'Ciencias', n: '🐄 Mamíferos y aves · Venn', d: 'Círculos grandes y palabras cortas.', est: 'cp_venn', pal: 'infantil', fmt: 'cuadrado', cont: 'cmp_animales' },

    { id: 'c_generos_col', cat: 'Lengua y humanidades', n: '📖 Narrativa y lírica · columnas', d: 'Dos bloques con sus rasgos.', est: 'cp_columnas', pal: 'humanidades', fmt: 'a4h', cont: 'cmp_generos' },
    { id: 'c_generos_tabla', cat: 'Lengua y humanidades', n: '📖 Géneros · tabla', d: 'Rasgo a rasgo, en rejilla.', est: 'cp_tabla', pal: 'cuaderno', fmt: 'a4h', forma: 'recta', cont: 'cmp_generos' },
    { id: 'c_generos_venn', cat: 'Lengua y humanidades', n: '📖 Géneros · Venn', d: 'Lo que comparten queda en el cruce.', est: 'cp_venn', pal: 'humanidades', fmt: 'cuadrado', cont: 'cmp_generos' },
    { id: 'c_hist_cuad', cat: 'Lengua y humanidades', n: '🏭 Industrial · cuadrantes', d: 'Cuatro factores en rejilla de dos por dos.', est: 'cp_cuadrantes', pal: 'humanidades', fmt: 'a4h', cont: 'historia' },

    { id: 'c_area_col', cat: 'Matemáticas', n: '📐 Área y perímetro · columnas', d: 'Dos preguntas distintas, lado a lado.', est: 'cp_columnas', pal: 'cuadricula', fmt: 'a4h', cont: 'cmp_area' },
    { id: 'c_area_tabla', cat: 'Matemáticas', n: '📐 Área y perímetro · tabla', d: 'Qué mide, en qué unidad, para qué sirve.', est: 'cp_tabla', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'cmp_area' },
    { id: 'c_area_venn', cat: 'Matemáticas', n: '📐 Área y perímetro · Venn', d: 'Para deshacer la confusión de siempre.', est: 'cp_venn', pal: 'pizarra', fmt: 'cuadrado', cont: 'cmp_area' },
    { id: 'c_tri_cuad', cat: 'Matemáticas', n: '📐 Triángulos · cuadrantes', d: 'Clasificación cruzada en cuatro casillas.', est: 'cp_cuadrantes', pal: 'cuadricula', fmt: 'cuadrado', cont: 'geometria' },

    { id: 'c_forma_balanza', cat: 'Formación profesional', n: '💼 Autónomo o sociedad · balanza', d: 'Ventajas e inconvenientes de cada figura.', est: 'cp_balanza', pal: 'editorial_edu', fmt: 'a4h', cont: 'cmp_forma' },
    { id: 'c_forma_col', cat: 'Formación profesional', n: '💼 Autónomo o sociedad · columnas', d: 'Dos bloques para decidir.', est: 'cp_columnas', pal: 'cuadricula', fmt: 'a4v', cont: 'cmp_forma' },
    { id: 'c_dafo_empresa', cat: 'Formación profesional', n: '🧭 DAFO · cuadrantes', d: 'El análisis de siempre, en rejilla limpia.', est: 'cp_cuadrantes', pal: 'pizarra_negra', fmt: 'a4h', cont: 'cmp_dafo' },
    { id: 'c_empresa_cuad', cat: 'Formación profesional', n: '💼 Plan de empresa · cuadrantes', d: 'Cuatro bloques del plan en una hoja.', est: 'cp_cuadrantes', pal: 'editorial_edu', fmt: 'a4h', cont: 'empresa' },

    { id: 'c_estudio_balanza', cat: 'Estudio y método', n: '🎯 Solo o en grupo · balanza', d: 'Cuándo compensa cada uno.', est: 'cp_balanza', pal: 'pizarra_negra', fmt: 'a4h', cont: 'cmp_estudio' },
    { id: 'c_estudio_col', cat: 'Estudio y método', n: '🎯 Solo o en grupo · columnas', d: 'Listas enfrentadas para la tutoría.', est: 'cp_columnas', pal: 'cuaderno', fmt: 'a4v', cont: 'cmp_estudio' },

    { id: 'c_animales_col', cat: 'Infantil y primaria', n: '🐄 Animales · columnas', d: 'Letra grande y color primario.', est: 'cp_columnas', pal: 'infantil', fmt: 'a4h', cont: 'cmp_animales' },

    { id: 'c_estaciones_cuad', cat: 'Infantil y primaria', n: '🍂 Estaciones · cuadrantes', d: 'Las cuatro estaciones, una en cada casilla.', est: 'cp_cuadrantes', pal: 'pastel', fmt: 'cuadrado', cont: 'estaciones' },

    { id: 'c_neutro_col', cat: 'Plantilla en blanco', n: '⬜ En blanco · dos columnas', d: 'Dos ramas y sus puntos: el resto lo escribes tú.', est: 'cp_columnas', pal: 'editorial_edu', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ════════════ PIRÁMIDE Y JERARQUÍA · 30 ════════════
     El primer nodo es la cima (o el núcleo) y el último, la base. */

  var PIRAMIDES = [
    { id: 'p_maslow_pir', cat: 'Estudio y método', n: '🔺 Maslow · pirámide', d: 'Las cinco necesidades, de la base a la cima.', est: 'pr_piramide', pal: 'editorial_edu', fmt: 'a4h', cont: 'pir_maslow' },
    { id: 'p_maslow_capas', cat: 'Estudio y método', n: '🔺 Maslow · capas', d: 'Bandas numeradas de ancho completo.', est: 'pr_capas', pal: 'pastel', fmt: 'a4v', cont: 'pir_maslow' },
    { id: 'p_bloom_pir', cat: 'Estudio y método', n: '🎓 Niveles de aprendizaje · pirámide', d: 'Qué se pide en cada tipo de pregunta.', est: 'pr_piramide', pal: 'pizarra_negra', fmt: 'a4h', cont: 'pir_bloom' },
    { id: 'p_bloom_escal', cat: 'Estudio y método', n: '🎓 Aprendizaje · escalones', d: 'Peldaños que suben hacia crear.', est: 'pr_escalones', pal: 'cuadricula', fmt: 'a4h', cont: 'pir_bloom' },
    { id: 'p_prior_cuad', cat: 'Estudio y método', n: '⏱ Prioridades · pirámide invertida', d: 'De lo urgente a lo prescindible.', est: 'pr_invertida', pal: 'semaforo', fmt: 'a4h', cont: 'pir_prioridad' },
    { id: 'p_prior_escal', cat: 'Estudio y método', n: '⏱ Prioridades · escalones', d: 'Cuatro peldaños para ordenar la semana.', est: 'pr_escalones', pal: 'editorial_edu', fmt: 'a4v', cont: 'pir_prioridad' },
    { id: 'p_metodo_capas', cat: 'Estudio y método', n: '📚 Método de estudio · capas', d: 'Los cinco pasos como bandas apiladas.', est: 'pr_capas', pal: 'cuaderno', fmt: 'a4v', cont: 'estudio' },

    { id: 'p_aliment_pir', cat: 'Ciencias', n: '🥗 Alimentación · pirámide', d: 'De lo diario a lo ocasional.', est: 'pr_piramide', pal: 'mandala_tierra', fmt: 'a4h', cont: 'pir_alimentos' },
    { id: 'p_aliment_capas', cat: 'Ciencias', n: '🥗 Alimentación · capas', d: 'Bandas con su índice al lado.', est: 'pr_capas', pal: 'pastel', fmt: 'a4v', cont: 'pir_alimentos' },
    { id: 'p_vida_pir', cat: 'Ciencias', n: '🔬 Organización de la vida · pirámide', d: 'De la célula al organismo.', est: 'pr_piramide', pal: 'cientifico', fmt: 'a4v', cont: 'pir_vida' },
    { id: 'p_vida_conc', cat: 'Ciencias', n: '🔬 Organización · concéntrico', d: 'Círculos que se envuelven, de dentro afuera.', est: 'pr_concentrico', pal: 'cientifico', fmt: 'cuadrado', cont: 'pir_vida' },
    { id: 'p_tierra_capas', cat: 'Ciencias', n: '🌍 Capas de la Tierra · capas', d: 'Corteza, manto y núcleo, en orden.', est: 'pr_capas', pal: 'mandala_tierra', fmt: 'a4v', cont: 'pir_tierra' },
    { id: 'p_tierra_conc', cat: 'Ciencias', n: '🌍 Capas de la Tierra · concéntrico', d: 'La sección del planeta, en círculos.', est: 'pr_concentrico', pal: 'mandala_noche', fmt: 'cuadrado', cont: 'pir_tierra' },
    { id: 'p_piel_capas', cat: 'Peluquería y estética', n: '🧴 La piel · capas', d: 'Epidermis, dermis e hipodermis apiladas.', est: 'pr_capas', pal: 'editorial_edu', fmt: 'a4v', cont: 'piel' },
    { id: 'p_piel_conc', cat: 'Peluquería y estética', n: '🧴 La piel · concéntrico', d: 'Las capas vistas desde fuera hacia dentro.', est: 'pr_concentrico', pal: 'pastel', fmt: 'cuadrado', cont: 'piel' },

    { id: 'p_salon_org', cat: 'Peluquería y estética', n: '🏛 Salón · organigrama', d: 'Dirección, técnica y recepción con sus tareas.', est: 'pr_organigrama', pal: 'editorial_edu', fmt: 'a4h', cont: 'org_salon' },
    { id: 'p_salon_escal', cat: 'Peluquería y estética', n: '🏛 Salón · escalones', d: 'Los niveles de responsabilidad, en peldaños.', est: 'pr_escalones', pal: 'cuadricula', fmt: 'a4h', cont: 'org_salon' },
    { id: 'p_centro_org', cat: 'Formación profesional', n: '🏛 Centro · organigrama', d: 'La estructura del instituto en una hoja.', est: 'pr_organigrama', pal: 'cuadricula', fmt: 'a4h', forma: 'recta', cont: 'org_centro' },
    { id: 'p_empresa_org', cat: 'Formación profesional', n: '💼 Empresa · organigrama', d: 'Cabeza y áreas, con sus funciones debajo.', est: 'pr_organigrama', pal: 'pizarra_negra', fmt: 'a4h', cont: 'empresa' },
    { id: 'p_derecho_pir', cat: 'Formación profesional', n: '⚖️ Jerarquía de normas · pirámide', d: 'Cuál manda sobre cuál.', est: 'pr_piramide', pal: 'humanidades', fmt: 'a4v', cont: 'pir_derecho' },
    { id: 'p_derecho_capas', cat: 'Formación profesional', n: '⚖️ Normas · capas', d: 'Cuatro bandas, de la Constitución al contrato.', est: 'pr_capas', pal: 'editorial_edu', fmt: 'a4v', cont: 'pir_derecho' },

    { id: 'p_texto_pir', cat: 'Lengua y humanidades', n: '📝 De la letra al texto · pirámide invertida', d: 'La unidad grande arriba y la mínima abajo.', est: 'pr_invertida', pal: 'cuaderno', fmt: 'a4v', cont: 'pir_texto' },
    { id: 'p_texto_escal', cat: 'Lengua y humanidades', n: '📝 Unidades de la lengua · escalones', d: 'Cada nivel se apoya en el anterior.', est: 'pr_escalones', pal: 'humanidades', fmt: 'a4h', cont: 'pir_texto' },
    { id: 'p_feudal_pir', cat: 'Lengua y humanidades', n: '🏰 Sociedad feudal · pirámide', d: 'Los tres órdenes, con la base ancha.', est: 'pr_piramide', pal: 'mandala_tierra', fmt: 'a4h', cont: 'edadmedia' },
    { id: 'p_feudal_org', cat: 'Lengua y humanidades', n: '🏰 Feudalismo · organigrama', d: 'Vasallaje: quién debe qué a quién.', est: 'pr_organigrama', pal: 'humanidades', fmt: 'a4h', cont: 'edadmedia' },
    { id: 'p_lit_capas', cat: 'Lengua y humanidades', n: '📖 Géneros · capas', d: 'Narrativa, lírica y dramática apiladas.', est: 'pr_capas', pal: 'cuaderno', fmt: 'a4v', cont: 'literatura' },

    { id: 'p_frac_conc', cat: 'Matemáticas', n: '➗ Números · concéntrico', d: 'Conjuntos que se contienen unos a otros.', est: 'pr_concentrico', pal: 'cuadricula', fmt: 'cuadrado', cont: 'mates' },
    { id: 'p_estaciones_conc', cat: 'Infantil y primaria', n: '🍂 Estaciones · concéntrico', d: 'El año en círculos, con color suave.', est: 'pr_concentrico', pal: 'infantil', fmt: 'cuadrado', cont: 'estaciones' },
    { id: 'p_normas_escal', cat: 'Infantil y primaria', n: '📋 Normas · escalones', d: 'Peldaños grandes y letra clara.', est: 'pr_escalones', pal: 'infantil', fmt: 'a4v', cont: 'normas' },

    { id: 'p_neutro_pir', cat: 'Plantilla en blanco', n: '⬜ En blanco · pirámide', d: 'Cinco niveles vacíos, de la cima a la base.', est: 'pr_piramide', pal: 'editorial_edu', fmt: 'a4h', cont: 'neutro' }
  ];

  /* ════════════ FICHA DE ESTUDIO · 30 ════════════
     Formato de apunte: el detalle del nodo es la explicación completa. */

  var FICHAS = [
    { id: 'f_verbo_cornell', cat: 'Lengua y humanidades', n: '📔 El verbo · Cornell', d: 'Claves a la izquierda, notas a la derecha, resumen abajo.', est: 'fc_cornell', pal: 'cuaderno', fmt: 'a4v', cont: 'fic_verbo' },
    { id: 'f_verbo_tarjetas', cat: 'Lengua y humanidades', n: '📔 El verbo · tarjetas', d: 'Una tarjeta por apartado.', est: 'fc_tarjetas', pal: 'humanidades', fmt: 'a4h', cont: 'fic_verbo' },
    { id: 'f_tildes_cornell', cat: 'Lengua y humanidades', n: '✏️ Acentuación · Cornell', d: 'Las tres reglas y sus excepciones.', est: 'fc_cornell', pal: 'cuaderno', fmt: 'a4v', cont: 'fic_tildes' },
    { id: 'f_tildes_def', cat: 'Lengua y humanidades', n: '✏️ Acentuación · glosario', d: 'Regla a la izquierda, ejemplo a la derecha.', est: 'fc_definiciones', pal: 'editorial_edu', fmt: 'a4v', cont: 'fic_tildes' },
    { id: 'f_tildes_repaso', cat: 'Lengua y humanidades', n: '✏️ Acentuación · repaso', d: 'Casillas para marcar lo dominado.', est: 'fc_repaso', pal: 'cuadricula', fmt: 'a4v', cont: 'fic_tildes' },
    { id: 'f_lit_resumen', cat: 'Lengua y humanidades', n: '📖 Géneros · resumen', d: 'Idea principal, puntos y frase de cierre.', est: 'fc_resumen', pal: 'humanidades', fmt: 'a4v', cont: 'literatura' },
    { id: 'f_hist_pregunta', cat: 'Lengua y humanidades', n: '❓ Antiguo Régimen · pregunta', d: 'Enunciado grande y respuestas numeradas.', est: 'fc_pregunta', pal: 'humanidades', fmt: 'a4v', cont: 'fic_pregunta_hist' },
    { id: 'f_hist_cornell', cat: 'Lengua y humanidades', n: '🏭 Industrial · Cornell', d: 'Apunte de clase con resumen abajo.', est: 'fc_cornell', pal: 'editorial_edu', fmt: 'a4v', cont: 'historia' },

    { id: 'f_foto_cornell', cat: 'Ciencias', n: '🌱 Fotosíntesis · Cornell', d: 'Qué entra, dónde ocurre, qué sale.', est: 'fc_cornell', pal: 'cientifico', fmt: 'a4v', cont: 'fic_fotosintesis' },
    { id: 'f_foto_tarjetas', cat: 'Ciencias', n: '🌱 Fotosíntesis · tarjetas', d: 'Cinco tarjetas para repasar de pie.', est: 'fc_tarjetas', pal: 'cientifico', fmt: 'a4h', cont: 'fic_fotosintesis' },
    { id: 'f_foto_resumen', cat: 'Ciencias', n: '🌱 Fotosíntesis · resumen', d: 'Lo esencial en una hoja.', est: 'fc_resumen', pal: 'pizarra', fmt: 'a4v', cont: 'fic_fotosintesis' },
    { id: 'f_glocien_def', cat: 'Ciencias', n: '🔬 Glosario de ciencias', d: 'Término y definición, en dos columnas.', est: 'fc_definiciones', pal: 'cientifico', fmt: 'a4v', cont: 'fic_glosario_cien' },
    { id: 'f_glocien_tarj', cat: 'Ciencias', n: '🔬 Vocabulario · tarjetas', d: 'Rejilla de conceptos con su explicación.', est: 'fc_tarjetas', pal: 'cuadricula', fmt: 'a4h', cont: 'fic_glosario_cien' },
    { id: 'f_celula_cornell', cat: 'Ciencias', n: '🔬 La célula · Cornell', d: 'Orgánulo y función, listos para repasar.', est: 'fc_cornell', pal: 'cientifico', fmt: 'a4v', cont: 'celula' },
    { id: 'f_agua_resumen', cat: 'Ciencias', n: '💧 Ciclo del agua · resumen', d: 'Las fases numeradas y una frase final.', est: 'fc_resumen', pal: 'pizarra', fmt: 'a4v', cont: 'agua' },

    { id: 'f_ecua_cornell', cat: 'Matemáticas', n: '➗ Ecuaciones · Cornell', d: 'El método paso a paso, con resumen.', est: 'fc_cornell', pal: 'cuadricula', fmt: 'a4v', cont: 'fic_ecuaciones' },
    { id: 'f_ecua_resumen', cat: 'Matemáticas', n: '➗ Ecuaciones · resumen', d: 'Cinco pasos numerados y la comprobación.', est: 'fc_resumen', pal: 'pizarra_negra', fmt: 'a4v', cont: 'fic_ecuaciones' },
    { id: 'f_ecua_repaso', cat: 'Matemáticas', n: '➗ Ecuaciones · repaso', d: 'Marca lo que ya sabes hacer sin mirar.', est: 'fc_repaso', pal: 'cuadricula', fmt: 'a4v', cont: 'fic_ecuaciones' },
    { id: 'f_geom_tarjetas', cat: 'Matemáticas', n: '📐 Triángulos · tarjetas', d: 'Una tarjeta por criterio de clasificación.', est: 'fc_tarjetas', pal: 'cuadricula', fmt: 'a4h', cont: 'geometria' },

    { id: 'f_corte_cornell', cat: 'Peluquería y estética', n: '💇 El corte · Cornell', d: 'Apunte de taller: clave, nota y resumen.', est: 'fc_cornell', pal: 'editorial_edu', fmt: 'a4v', cont: 'fic_cornell_corte' },
    { id: 'f_corte_tarjetas', cat: 'Peluquería y estética', n: '💇 El corte · tarjetas', d: 'Cinco claves en rejilla.', est: 'fc_tarjetas', pal: 'pastel', fmt: 'a4h', cont: 'fic_cornell_corte' },
    { id: 'f_glopelu_def', cat: 'Peluquería y estética', n: '📔 Glosario de peluquería', d: 'Término y definición para el examen.', est: 'fc_definiciones', pal: 'editorial_edu', fmt: 'a4v', cont: 'fic_glosario_pelu' },
    { id: 'f_glopelu_tarj', cat: 'Peluquería y estética', n: '📔 Glosario · tarjetas', d: 'Vocabulario técnico en tarjetas.', est: 'fc_tarjetas', pal: 'mandala_tierra', fmt: 'a4h', cont: 'fic_glosario_pelu' },
    { id: 'f_seguridad_repaso', cat: 'Peluquería y estética', n: '🧤 Antes del químico · repaso', d: 'Lista de comprobación con casillas.', est: 'fc_repaso', pal: 'semaforo', fmt: 'a4v', cont: 'fic_seguridad' },
    { id: 'f_color_cornell', cat: 'Peluquería y estética', n: '🎨 Colorimetría · Cornell', d: 'La rueda, en formato apunte.', est: 'fc_cornell', pal: 'pastel', fmt: 'a4v', cont: 'color' },

    { id: 'f_examen_repaso', cat: 'Estudio y método', n: '✅ Antes del examen · repaso', d: 'Seis comprobaciones antes de cerrar el libro.', est: 'fc_repaso', pal: 'editorial_edu', fmt: 'a4v', cont: 'fic_examen' },
    { id: 'f_metodo_resumen', cat: 'Estudio y método', n: '📚 Método de estudio · resumen', d: 'Los pasos numerados y la idea de cierre.', est: 'fc_resumen', pal: 'cuaderno', fmt: 'a4v', cont: 'estudio' },
    { id: 'f_metodo_tarjetas', cat: 'Estudio y método', n: '📚 Método · tarjetas', d: 'Un paso por tarjeta.', est: 'fc_tarjetas', pal: 'pizarra_negra', fmt: 'a4h', cont: 'estudio' },

    { id: 'f_empresa_pregunta', cat: 'Formación profesional', n: '❓ Plan de empresa · pregunta', d: 'Una pregunta de defensa y sus respuestas.', est: 'fc_pregunta', pal: 'editorial_edu', fmt: 'a4v', cont: 'empresa' },

    { id: 'f_neutro_cornell', cat: 'Plantilla en blanco', n: '⬜ En blanco · Cornell', d: 'Columna de claves y cuerpo vacíos.', est: 'fc_cornell', pal: 'cuaderno', fmt: 'a4v', cont: 'neutro' }
  ];

  /* ─────────── Montaje ─────────── */

  var FAMILIAS = [
    { id: 'mapa', nombre: 'Mapa conceptual', icono: '🧠', d: 'Nodos y relaciones: radial, árbol, espina, red…' },
    { id: 'mandala', nombre: 'Mandala', icono: '🌀', d: 'Radial simétrico: pétalos, cuñas, anillos, rosetón…' },
    { id: 'carrusel', nombre: 'Carrusel', icono: '🎠', d: 'Una serie de hojas con papel distinto cada una.' },
    { id: 'poster', nombre: 'Póster', icono: '📌', d: 'Cartel de pared: bandas, rejilla, numerado, aviso, evento…' },
    { id: 'tiempo', nombre: 'Línea de tiempo', icono: '⏳', d: 'Eje y hitos: horizontal, vertical, escalera, arco…' },
    { id: 'flujo', nombre: 'Proceso y flujo', icono: '🔀', d: 'Pasos con flechas: cadena, ciclo, decisiones, embudo…' },
    { id: 'datos', nombre: 'Infografía de datos', icono: '📊', d: 'Cifras que se ven: barras, columnas, anillo, pictograma…' },
    { id: 'comparar', nombre: 'Comparativa y matriz', icono: '⚖️', d: 'Dos o cuatro lados: columnas, tabla, Venn, cuadrantes…' },
    { id: 'piramide', nombre: 'Pirámide y jerarquía', icono: '🔺', d: 'Niveles y dependencias: pirámide, capas, organigrama…' },
    { id: 'ficha', nombre: 'Ficha de estudio', icono: '📔', d: 'Formato apunte: Cornell, tarjetas, glosario, repaso…' }
  ];

  var TODOS = [];
  function meter(lista, fam) {
    lista.forEach(function (d) {
      d.fam = fam;
      TODOS.push(d);
    });
  }
  meter(MAPAS, 'mapa');
  meter(MANDALAS, 'mandala');
  meter(CARRUSELES, 'carrusel');
  meter(POSTERS, 'poster');
  meter(TIEMPOS, 'tiempo');
  meter(FLUJOS, 'flujo');
  meter(DATOS, 'datos');
  meter(COMPARATIVAS, 'comparar');
  meter(PIRAMIDES, 'piramide');
  meter(FICHAS, 'ficha');

  var PORID = {};
  TODOS.forEach(function (d) { PORID[d.id] = d; });

  function clonarNodos(clave) {
    var base = CONT[clave] || CONT.neutro;
    return base.map(function (x) { return { nivel: x.nivel, t: x.t, d: x.d }; });
  }

  /* La lámina lista para el editor. Todo lo que el motor necesita, ya resuelto:
     nada de leer la plantilla a mitad del dibujo. */
  function lamina(id) {
    var d = PORID[id] || TODOS[0];
    var nodos = clonarNodos(d.cont);
    var raiz = nodos[0] || { t: '' };
    return {
      diseno: d.id,
      familia: d.fam,
      estructura: d.est,
      serie: d.serie ? d.serie.slice() : null,
      paleta: d.pal,
      formato: d.fmt,
      opciones: {
        forma: d.forma || 'caja', formaCentro: d.formaCentro || null,
        formaHijo: d.formaHijo || null, sinCab: !!d.sincab
      },
      titulo: d.fam === 'carrusel' || d.sincab ? '' : raiz.t,
      subtitulo: d.fam === 'carrusel' || d.sincab ? '' : (raiz.d || ''),
      rotulo: '',
      pie: '',
      animacion: d.fam === 'mandala' ? 'rotar' : d.fam === 'carrusel' ? 'pasar'
        : (d.fam === 'flujo' || d.fam === 'tiempo') ? 'dibujar' : 'aparecer',
      nodos: nodos,
      sombras: true,
      vineta: true,
      segPorNodo: 1.6
    };
  }

  function lista(fam) {
    return TODOS.filter(function (d) { return !fam || d.fam === fam; })
      .map(function (d) {
        return {
          id: d.id, fam: d.fam, cat: d.cat, nombre: d.n, desc: d.d,
          est: d.est, pal: d.pal, fmt: d.fmt, hojas: d.serie ? d.serie.length : 1
        };
      });
  }

  function grupos(fam) {
    var vistos = {}, orden = [];
    TODOS.forEach(function (d) {
      if (fam && d.fam !== fam) return;
      if (!vistos[d.cat]) { vistos[d.cat] = true; orden.push(d.cat); }
    });
    return orden;
  }

  window.LAMINAS_DISENOS = {
    FAMILIAS: FAMILIAS,
    CONTENIDOS: CONT,
    lista: lista,
    grupos: grupos,
    get: function (id) { return PORID[id] || null; },
    lamina: lamina,
    contenido: clonarNodos
  };
})();
