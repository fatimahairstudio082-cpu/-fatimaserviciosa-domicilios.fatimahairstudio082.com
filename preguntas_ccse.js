/* ─────────────────────────────────────────────────────────────────────────
   PREGUNTAS_CCSE — Banco de preguntas para el examen CCSE de Nacionalidad
   Basado en el pool oficial del Instituto Cervantes (2024-2025)
   120 preguntas · 7 temas
   ───────────────────────────────────────────────────────────────────────── */

window.TEMAS_CCSE = {
  constitucion: 'Constitución y Derecho',
  gobierno:     'Gobierno e Instituciones',
  historia:     'Historia de España',
  geografia:    'Geografía y Territorio',
  cultura:      'Cultura y Sociedad',
  ue:           'Unión Europea',
  economia:     'Economía y Sociedad'
};

window.PREGUNTAS_CCSE = [

  /* ── CONSTITUCIÓN Y DERECHO (20 preguntas) ─────────────────────────── */

  { id:'c001', tema:'constitucion',
    p:'¿En qué año se aprobó en referéndum la Constitución española vigente?',
    o:['1975','1977','1978','1981'], c:2,
    exp:'La Constitución española fue aprobada en referéndum el 6 de diciembre de 1978. Entró en vigor el 29 de diciembre de 1978.' },

  { id:'c002', tema:'constitucion',
    p:'¿Cuántos artículos tiene la Constitución española?',
    o:['136','155','169','200'], c:2,
    exp:'La Constitución española consta de 169 artículos, organizados en un Título Preliminar y diez Títulos.' },

  { id:'c003', tema:'constitucion',
    p:'¿Cuál es la forma política del Estado español según la Constitución?',
    o:['República federal','Monarquía parlamentaria','Monarquía absoluta','República presidencial'], c:1,
    exp:'El artículo 1.3 de la Constitución establece que "La forma política del Estado español es la Monarquía parlamentaria".' },

  { id:'c004', tema:'constitucion',
    p:'Según la Constitución, ¿cuál es el idioma oficial del Estado español?',
    o:['El catalán','El castellano','El gallego','El euskera'], c:1,
    exp:'El artículo 3 establece que "El castellano es la lengua española oficial del Estado". Las demás lenguas españolas también son oficiales en sus respectivas Comunidades Autónomas.' },

  { id:'c005', tema:'constitucion',
    p:'¿Qué artículo de la Constitución establece los colores de la bandera española?',
    o:['Artículo 1','Artículo 2','Artículo 4','Artículo 6'], c:2,
    exp:'El artículo 4 de la Constitución describe la bandera de España: franjas horizontales roja, amarilla y roja, siendo la amarilla de doble anchura que cada una de las rojas.' },

  { id:'c006', tema:'constitucion',
    p:'¿Qué establece el artículo 1.1 de la Constitución española sobre los valores superiores del ordenamiento jurídico?',
    o:['La libertad, la igualdad, la justicia y el pluralismo político','La paz, la democracia, la libertad y la solidaridad','La justicia, la paz, el progreso y la igualdad','La soberanía, la libertad, la seguridad y la justicia'], c:0,
    exp:'El artículo 1.1 propugna como valores superiores del ordenamiento jurídico "la libertad, la justicia, la igualdad y el pluralismo político".' },

  { id:'c007', tema:'constitucion',
    p:'¿Dónde reside la soberanía nacional según la Constitución española?',
    o:['En el Rey','En el Parlamento','En el pueblo español','En el Gobierno'], c:2,
    exp:'El artículo 1.2 establece que "La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado".' },

  { id:'c008', tema:'constitucion',
    p:'¿Cuál es el símbolo que representa la unidad e identidad permanente de España según la Constitución?',
    o:['El himno nacional','La bandera','El escudo','El Rey'], c:1,
    exp:'El artículo 4 establece que la bandera de España representa la unidad e identidad permanente del Estado.' },

  { id:'c009', tema:'constitucion',
    p:'¿Cuántos Títulos, además del Título Preliminar, contiene la Constitución española?',
    o:['8','9','10','12'], c:2,
    exp:'La Constitución española tiene un Título Preliminar y diez Títulos (del I al X), además de las disposiciones adicionales, transitorias, derogatoria y final.' },

  { id:'c010', tema:'constitucion',
    p:'¿Qué mayoría se requiere para reformar los artículos fundamentales de la Constitución (artículos 1, 2 y Título II)?',
    o:['Mayoría simple','Mayoría absoluta','Dos tercios de cada Cámara y posterior referéndum','Mayoría de tres quintos de cada Cámara'], c:2,
    exp:'El artículo 168 establece un procedimiento agravado: dos tercios de cada Cámara, disolución de las Cortes, aprobación de nuevo y referéndum obligatorio.' },

  { id:'c011', tema:'constitucion',
    p:'¿Qué artículo de la Constitución reconoce el derecho a la vida?',
    o:['Artículo 14','Artículo 15','Artículo 16','Artículo 17'], c:1,
    exp:'El artículo 15 establece que "Todos tienen derecho a la vida y a la integridad física y moral".' },

  { id:'c012', tema:'constitucion',
    p:'¿Qué garantiza el artículo 14 de la Constitución española?',
    o:['La libertad de expresión','La igualdad ante la ley sin discriminación','El derecho a la educación','La libertad religiosa'], c:1,
    exp:'El artículo 14 garantiza que "Los españoles son iguales ante la ley, sin que pueda prevalecer discriminación alguna por razón de nacimiento, raza, sexo, religión, opinión o cualquier otra condición".' },

  { id:'c013', tema:'constitucion',
    p:'¿Cuál es el órgano supremo consultivo del Gobierno según la Constitución española?',
    o:['El Tribunal Constitucional','El Tribunal Supremo','El Consejo de Estado','El Defensor del Pueblo'], c:2,
    exp:'El Consejo de Estado es el órgano consultivo supremo del Gobierno, según establece el artículo 107 de la Constitución.' },

  { id:'c014', tema:'constitucion',
    p:'¿Qué institución vela por los derechos fundamentales de los ciudadanos ante la Administración?',
    o:['El Fiscal General del Estado','El Defensor del Pueblo','El Tribunal Constitucional','El Tribunal Supremo'], c:1,
    exp:'El Defensor del Pueblo es el alto comisionado de las Cortes Generales para la defensa de los derechos fundamentales, tal y como recoge el artículo 54 de la Constitución.' },

  { id:'c015', tema:'constitucion',
    p:'¿Qué edad mínima se requiere para ser elegido diputado al Congreso en España?',
    o:['16 años','18 años','21 años','25 años'], c:1,
    exp:'La Ley Orgánica del Régimen Electoral General (LOREG) establece que se requiere tener cumplidos 18 años para ser elegible como diputado.' },

  { id:'c016', tema:'constitucion',
    p:'¿Qué Título de la Constitución regula los derechos y deberes fundamentales?',
    o:['Título I','Título II','Título III','Título IV'], c:0,
    exp:'El Título I, "De los derechos y deberes fundamentales" (artículos 10 a 55), regula los derechos fundamentales, libertades públicas y principios rectores de la política social.' },

  { id:'c017', tema:'constitucion',
    p:'¿Cuántas lenguas cooficiales existen en España además del castellano?',
    o:['Dos','Tres','Cuatro','Cinco'], c:1,
    exp:'Además del castellano, son lenguas cooficiales el catalán (Cataluña, Islas Baleares, Comunidad Valenciana como valenciano), el gallego (Galicia) y el euskera (País Vasco y parte de Navarra).' },

  { id:'c018', tema:'constitucion',
    p:'¿Qué principio recoge el artículo 2 de la Constitución respecto a la organización territorial?',
    o:['El centralismo administrativo','La unidad de la Nación española y el derecho a la autonomía','La federación de comunidades soberanas','La descentralización absoluta'], c:1,
    exp:'El artículo 2 reconoce la indisoluble unidad de la Nación española y garantiza el derecho a la autonomía de las nacionalidades y regiones que la integran.' },

  { id:'c019', tema:'constitucion',
    p:'¿Qué artículo de la Constitución española reconoce el derecho a la huelga?',
    o:['Artículo 25','Artículo 28','Artículo 35','Artículo 40'], c:1,
    exp:'El artículo 28.2 reconoce el derecho a la huelga de los trabajadores para la defensa de sus intereses.' },

  { id:'c020', tema:'constitucion',
    p:'¿Qué establece el artículo 27 de la Constitución española?',
    o:['El derecho al trabajo','El derecho a la educación','El derecho a la sanidad','El derecho a la vivienda'], c:1,
    exp:'El artículo 27 reconoce el derecho a la educación y la libertad de enseñanza, y establece que la educación básica es obligatoria y gratuita.' },

  /* ── GOBIERNO E INSTITUCIONES (20 preguntas) ────────────────────────── */

  { id:'g001', tema:'gobierno',
    p:'¿Quién es el Jefe del Estado español?',
    o:['El Presidente del Gobierno','El Rey','El Presidente del Congreso','El Presidente del Senado'], c:1,
    exp:'El Título II de la Constitución establece que el Jefe del Estado es el Rey. Desde el 19 de junio de 2014, el Rey es Felipe VI.' },

  { id:'g002', tema:'gobierno',
    p:'¿Cómo se denomina el Parlamento español?',
    o:['Las Cortes Generales','La Asamblea Nacional','El Parlamento Nacional','Las Cámaras Legislativas'], c:0,
    exp:'El artículo 66 de la Constitución denomina Cortes Generales al Parlamento bicameral español, compuesto por el Congreso de los Diputados y el Senado.' },

  { id:'g003', tema:'gobierno',
    p:'¿Cuántas cámaras forman las Cortes Generales?',
    o:['Una','Dos','Tres','Cuatro'], c:1,
    exp:'Las Cortes Generales son bicamerales: el Congreso de los Diputados (cámara baja) y el Senado (cámara alta), según el artículo 66 de la Constitución.' },

  { id:'g004', tema:'gobierno',
    p:'¿Cuántos diputados tiene el Congreso de los Diputados?',
    o:['300','350','400','450'], c:1,
    exp:'El Congreso de los Diputados tiene 350 diputados, elegidos por sufragio universal, libre, igual, directo y secreto, con mandato de 4 años.' },

  { id:'g005', tema:'gobierno',
    p:'¿Cuántos senadores aproximadamente tiene el Senado español?',
    o:['208','265','300','350'], c:1,
    exp:'El Senado tiene 265 senadores: 208 elegidos directamente y el resto designados por las Comunidades Autónomas (4 por CA más uno adicional por millón de habitantes).' },

  { id:'g006', tema:'gobierno',
    p:'¿Cuántos años dura el mandato del Presidente del Gobierno?',
    o:['3 años','4 años','5 años','6 años'], c:1,
    exp:'El mandato del Presidente del Gobierno dura 4 años, coincidiendo con la legislatura parlamentaria, aunque puede finalizar antes por moción de censura, cuestión de confianza o disolución anticipada.' },

  { id:'g007', tema:'gobierno',
    p:'¿Qué órgano del Estado interpreta la Constitución española?',
    o:['El Tribunal Supremo','El Consejo de Estado','El Tribunal Constitucional','El Consejo General del Poder Judicial'], c:2,
    exp:'El Tribunal Constitucional es el intérprete supremo de la Constitución, según el artículo 1 de la Ley Orgánica del Tribunal Constitucional. Sus sentencias son vinculantes para todos los poderes públicos.' },

  { id:'g008', tema:'gobierno',
    p:'¿Cuántas Comunidades Autónomas tiene España?',
    o:['15','16','17','18'], c:2,
    exp:'España tiene 17 Comunidades Autónomas, además de las ciudades autónomas de Ceuta y Melilla.' },

  { id:'g009', tema:'gobierno',
    p:'¿Cuántas provincias tiene España?',
    o:['47','50','52','55'], c:1,
    exp:'España tiene 50 provincias, más las ciudades autónomas de Ceuta y Melilla, que no son provincias.' },

  { id:'g010', tema:'gobierno',
    p:'¿Quién nombra al Presidente del Gobierno?',
    o:['El Rey','El Congreso de los Diputados','El Senado','Las Cortes Generales'], c:0,
    exp:'Según el artículo 99 de la Constitución, el Rey, tras las consultas con los representantes de los grupos parlamentarios, propone un candidato a Presidente del Gobierno y lo nombra una vez investido por el Congreso.' },

  { id:'g011', tema:'gobierno',
    p:'¿Qué es el Consejo de Ministros?',
    o:['El órgano que reúne al Rey con los presidentes autonómicos','El órgano colegiado de gobierno formado por el Presidente y los ministros','El órgano máximo del poder judicial','La cámara alta del Parlamento'], c:1,
    exp:'El Consejo de Ministros es el órgano colegiado del Poder Ejecutivo, presidido por el Presidente del Gobierno y formado por los vicepresidentes y los ministros.' },

  { id:'g012', tema:'gobierno',
    p:'¿Cuántos miembros tiene el Tribunal Constitucional?',
    o:['9','12','15','17'], c:1,
    exp:'El Tribunal Constitucional está integrado por 12 magistrados nombrados por el Rey, a propuesta del Congreso (4), el Senado (4), el Gobierno (2) y el Consejo General del Poder Judicial (2).' },

  { id:'g013', tema:'gobierno',
    p:'¿Cuál es el órgano máximo del poder judicial en España?',
    o:['El Tribunal Constitucional','El Tribunal Supremo','La Audiencia Nacional','El Consejo General del Poder Judicial'], c:1,
    exp:'El Tribunal Supremo, con jurisdicción en toda España, es el órgano jurisdiccional superior en todos los órdenes, salvo lo dispuesto en materia de garantías constitucionales (artículo 123 CE).' },

  { id:'g014', tema:'gobierno',
    p:'¿Qué institución tiene la competencia para aprobar los Presupuestos Generales del Estado?',
    o:['El Gobierno','El Consejo de Ministros','Las Cortes Generales','El Banco de España'], c:2,
    exp:'Los Presupuestos Generales del Estado son elaborados por el Gobierno y aprobados por las Cortes Generales (Congreso y Senado).' },

  { id:'g015', tema:'gobierno',
    p:'¿Qué es un Estatuto de Autonomía?',
    o:['La constitución de una Comunidad Autónoma','El reglamento interno del Congreso','El conjunto de normas municipales','La ley que regula los partidos políticos'], c:0,
    exp:'El Estatuto de Autonomía es la norma institucional básica de cada Comunidad Autónoma, que recoge sus competencias, instituciones y funcionamiento.' },

  { id:'g016', tema:'gobierno',
    p:'¿Cómo se llama el presidente de una Comunidad Autónoma en la Comunidad de Madrid?',
    o:['Lehendakari','President','Presidente','Xunta'], c:2,
    exp:'En la Comunidad de Madrid, el jefe del ejecutivo autonómico se denomina Presidente. En el País Vasco es Lehendakari, en Cataluña es President y en Galicia, el ejecutivo autonómico se llama Xunta, pero el jefe es el Presidente de la Xunta.' },

  { id:'g017', tema:'gobierno',
    p:'¿Qué organismo gestiona la Seguridad Social en España?',
    o:['El Ministerio de Economía','El Instituto Nacional de la Seguridad Social (INSS)','El Banco de España','El SEPE'], c:1,
    exp:'El Instituto Nacional de la Seguridad Social (INSS) es el organismo que gestiona las prestaciones económicas del sistema de la Seguridad Social en España.' },

  { id:'g018', tema:'gobierno',
    p:'¿Qué organismo gestiona las prestaciones por desempleo en España?',
    o:['El INSS','El SEPE (Servicio Público de Empleo Estatal)','El Ministerio de Trabajo','El Banco de España'], c:1,
    exp:'El SEPE (Servicio Público de Empleo Estatal), anteriormente llamado INEM, gestiona las prestaciones por desempleo en España.' },

  { id:'g019', tema:'gobierno',
    p:'¿Cuántos magistrados propone el Senado para el Tribunal Constitucional?',
    o:['2','3','4','6'], c:2,
    exp:'El Senado propone 4 de los 12 magistrados del Tribunal Constitucional, al igual que el Congreso. El Gobierno propone 2 y el Consejo General del Poder Judicial otros 2.' },

  { id:'g020', tema:'gobierno',
    p:'¿Qué artículo de la Constitución regula la moción de censura?',
    o:['Artículo 99','Artículo 112','Artículo 113','Artículo 116'], c:2,
    exp:'El artículo 113 regula la moción de censura constructiva: el Congreso puede retirar la confianza al Presidente del Gobierno mediante una moción que debe incluir un candidato alternativo.' },

  /* ── HISTORIA DE ESPAÑA (20 preguntas) ─────────────────────────────── */

  { id:'h001', tema:'historia',
    p:'¿En qué año comenzó la guerra civil española?',
    o:['1931','1933','1936','1939'], c:2,
    exp:'La Guerra Civil española comenzó el 17-18 de julio de 1936 con el alzamiento militar contra la Segunda República, y terminó el 1 de abril de 1939.' },

  { id:'h002', tema:'historia',
    p:'¿En qué año murió el dictador Francisco Franco?',
    o:['1973','1975','1977','1978'], c:1,
    exp:'Francisco Franco murió el 20 de noviembre de 1975. Su muerte marcó el inicio de la Transición española a la democracia.' },

  { id:'h003', tema:'historia',
    p:'¿Qué periodo histórico siguió a la muerte de Franco en España?',
    o:['La Segunda República','La Transición democrática','La Restauración borbónica','El reinado de Juan Carlos I'], c:1,
    exp:'El periodo conocido como la Transición española (1975-1982) siguió a la muerte de Franco y llevó al establecimiento de la democracia parlamentaria actual.' },

  { id:'h004', tema:'historia',
    p:'¿En qué año se celebraron las primeras elecciones democráticas en España tras la dictadura?',
    o:['1975','1977','1978','1979'], c:1,
    exp:'Las primeras elecciones democráticas después de la dictadura franquista se celebraron el 15 de junio de 1977.' },

  { id:'h005', tema:'historia',
    p:'¿En qué año se proclamó la Segunda República española?',
    o:['1923','1929','1931','1936'], c:2,
    exp:'La Segunda República española fue proclamada el 14 de abril de 1931, tras la renuncia del rey Alfonso XIII.' },

  { id:'h006', tema:'historia',
    p:'¿En qué año descubrió América Cristóbal Colón?',
    o:['1488','1492','1496','1502'], c:1,
    exp:'Cristóbal Colón llegó a América el 12 de octubre de 1492, financiado por los Reyes Católicos, Isabel I de Castilla y Fernando II de Aragón.' },

  { id:'h007', tema:'historia',
    p:'¿Cómo se llamaban los monarcas que unificaron España y financiaron el descubrimiento de América?',
    o:['Carlos I y Juana la Loca','Felipe II y María Tudor','Los Reyes Católicos (Fernando e Isabel)','Alfonso X y Berenguela'], c:2,
    exp:'Los Reyes Católicos, Fernando II de Aragón e Isabel I de Castilla, unificaron los reinos de España y patrocinaron el viaje de Colón en 1492.' },

  { id:'h008', tema:'historia',
    p:'¿Cuándo tuvo lugar el intento de golpe de Estado del 23-F?',
    o:['1978','1979','1981','1982'], c:2,
    exp:'El 23 de febrero de 1981, el teniente coronel Tejero asaltó el Congreso de los Diputados durante la investidura de Leopoldo Calvo-Sotelo. El golpe fracasó gracias a la intervención del Rey Juan Carlos I.' },

  { id:'h009', tema:'historia',
    p:'¿En qué año entró España en la OTAN?',
    o:['1978','1982','1986','1989'], c:1,
    exp:'España ingresó en la OTAN el 30 de mayo de 1982, durante el gobierno de Leopoldo Calvo-Sotelo. En 1986 se celebró un referéndum que confirmó la permanencia en la alianza.' },

  { id:'h010', tema:'historia',
    p:'¿En qué año se celebraron en España los Juegos Olímpicos de verano?',
    o:['1988','1990','1992','1996'], c:2,
    exp:'Los Juegos Olímpicos de Verano de 1992 se celebraron en Barcelona, siendo uno de los eventos deportivos más importantes de la historia reciente de España.' },

  { id:'h011', tema:'historia',
    p:'¿En qué año tuvo lugar la Exposición Universal de Sevilla?',
    o:['1988','1990','1992','1995'], c:2,
    exp:'La Expo 92 se celebró en Sevilla del 20 de abril al 12 de octubre de 1992, coincidiendo con el V Centenario del Descubrimiento de América.' },

  { id:'h012', tema:'historia',
    p:'¿Cuándo fue el atentado terrorista en Madrid conocido como el 11-M?',
    o:['2001','2003','2004','2005'], c:2,
    exp:'Los atentados del 11 de marzo de 2004 en Madrid fueron una serie de explosiones en trenes de cercanías que causaron 193 muertos y más de 2.000 heridos, siendo el mayor atentado terrorista en la historia de España.' },

  { id:'h013', tema:'historia',
    p:'¿Qué rey reinó en España durante la dictadura franquista?',
    o:['Alfonso XII','Alfonso XIII','Juan Carlos I','Felipe VI'], c:1,
    exp:'Alfonso XIII fue el último rey antes de la dictadura. Durante el franquismo no hubo rey; Franco era el Jefe del Estado. Después de Franco, Juan Carlos I fue proclamado rey en 1975.' },

  { id:'h014', tema:'historia',
    p:'¿Qué fue el "Desastre del 98"?',
    o:['La derrota en la Guerra Civil','La pérdida de las últimas colonias (Cuba, Puerto Rico y Filipinas)','La crisis económica de 1898','La caída de la monarquía'], c:1,
    exp:'En 1898, España perdió sus últimas colonias ultramarinas: Cuba, Puerto Rico y Filipinas, tras la guerra con Estados Unidos. Este hecho se conoce como el "Desastre del 98".' },

  { id:'h015', tema:'historia',
    p:'¿En qué año abdicó el rey Juan Carlos I en favor de su hijo Felipe VI?',
    o:['2012','2013','2014','2015'], c:2,
    exp:'El rey Juan Carlos I abdicó el 2 de junio de 2014. Su hijo le sucedió como Felipe VI el 19 de junio de 2014.' },

  { id:'h016', tema:'historia',
    p:'¿En qué año España recuperó la democracia con las primeras elecciones municipales libres?',
    o:['1977','1979','1981','1982'], c:1,
    exp:'Las primeras elecciones municipales democráticas desde la Segunda República se celebraron el 3 de abril de 1979.' },

  { id:'h017', tema:'historia',
    p:'¿Quién fue el primer Presidente del Gobierno de la democracia española?',
    o:['Felipe González','Adolfo Suárez','Leopoldo Calvo-Sotelo','Santiago Carrillo'], c:1,
    exp:'Adolfo Suárez fue el primer Presidente del Gobierno de la democracia española, cargo que ocupó de 1976 a 1981. Fue clave en la Transición democrática.' },

  { id:'h018', tema:'historia',
    p:'¿Cuándo comenzó la Reconquista de la Península Ibérica?',
    o:['Siglo VII','Siglo VIII','Siglo IX','Siglo X'], c:1,
    exp:'La Reconquista comenzó tras la invasión musulmana de 711 y la batalla de Covadonga (722), considerada el inicio de la resistencia cristiana. Concluyó en 1492 con la toma de Granada.' },

  { id:'h019', tema:'historia',
    p:'¿En qué año concluyó la Reconquista con la toma del último reino musulmán?',
    o:['1480','1488','1492','1500'], c:2,
    exp:'La Reconquista concluyó el 2 de enero de 1492 con la rendición del reino nazarí de Granada ante los Reyes Católicos.' },

  { id:'h020', tema:'historia',
    p:'¿Qué fue la "Constitución de Cádiz" de 1812?',
    o:['La primera constitución liberal española','El tratado de paz con Napoleón','El estatuto municipal de Cádiz','La ley de abolición de la esclavitud'], c:0,
    exp:'La Constitución de 1812, conocida como "La Pepa", fue la primera constitución liberal española. Fue aprobada por las Cortes de Cádiz durante la guerra de la Independencia contra Napoleón.' },

  /* ── GEOGRAFÍA Y TERRITORIO (15 preguntas) ──────────────────────────── */

  { id:'geo001', tema:'geografia',
    p:'¿Cuál es la capital de España?',
    o:['Barcelona','Sevilla','Madrid','Valencia'], c:2,
    exp:'Madrid es la capital de España y la ciudad más poblada del país, con aproximadamente 3,3 millones de habitantes en el municipio.' },

  { id:'geo002', tema:'geografia',
    p:'¿Cuáles son los dos archipiélagos que forman parte del territorio español?',
    o:['Canarias y Azores','Baleares y Canarias','Baleares y Madeira','Canarias y Malta'], c:1,
    exp:'España cuenta con dos archipiélagos: el archipiélago balear (Islas Baleares), en el mar Mediterráneo, y el archipiélago canario (Islas Canarias), en el océano Atlántico.' },

  { id:'geo003', tema:'geografia',
    p:'¿Cuál es el río más largo de España?',
    o:['El Ebro','El Tajo','El Duero','El Guadiana'], c:0,
    exp:'El Ebro, con 930 km, es el río más largo que discurre íntegramente por España. El Tajo es el más largo de la Península Ibérica, pero nace en España y desemboca en Portugal (Lisboa).' },

  { id:'geo004', tema:'geografia',
    p:'¿Cuál es la montaña más alta de España?',
    o:['El Mulhacén','El Teide','Los Picos de Europa','La Maladeta'], c:1,
    exp:'El Teide, en Tenerife (Islas Canarias), con 3.718 metros, es el pico más alto de España y el tercero más alto del mundo sobre una isla oceánica.' },

  { id:'geo005', tema:'geografia',
    p:'¿Cuántas ciudades autónomas tiene España?',
    o:['Una','Dos','Tres','Cuatro'], c:1,
    exp:'España tiene dos ciudades autónomas: Ceuta y Melilla, situadas en el norte de África. Tienen Estatuto de Autonomía propio pero no son Comunidades Autónomas.' },

  { id:'geo006', tema:'geografia',
    p:'¿Con qué países tiene frontera terrestre España en la Península?',
    o:['Francia y Portugal','Francia, Portugal y Andorra','Francia, Portugal, Andorra y Gibraltar','Portugal, Andorra y Marruecos'], c:1,
    exp:'España comparte frontera terrestre con Francia (en el norte, a través de los Pirineos), Andorra y Portugal (en el oeste). Gibraltar es un territorio británico, no un país.' },

  { id:'geo007', tema:'geografia',
    p:'¿Cuál es la Comunidad Autónoma más grande de España?',
    o:['Andalucía','Castilla y León','Castilla-La Mancha','Aragón'], c:1,
    exp:'Castilla y León, con más de 94.000 km², es la Comunidad Autónoma más extensa de España y la mayor región de la Unión Europea.' },

  { id:'geo008', tema:'geografia',
    p:'¿Qué cadena montañosa separa España de Francia?',
    o:['La Cordillera Cantábrica','El Sistema Ibérico','Los Pirineos','La Sierra Nevada'], c:2,
    exp:'Los Pirineos son la cadena montañosa que forma la frontera natural entre España y Francia, extendiéndose desde el golfo de Vizcaya hasta el mar Mediterráneo.' },

  { id:'geo009', tema:'geografia',
    p:'¿Cuál es la ciudad más poblada de España después de Madrid?',
    o:['Valencia','Sevilla','Barcelona','Bilbao'], c:2,
    exp:'Barcelona es la segunda ciudad más poblada de España, con aproximadamente 1,6 millones de habitantes, y es la capital de Cataluña.' },

  { id:'geo010', tema:'geografia',
    p:'¿En qué mar se encuentra el archipiélago de las Islas Baleares?',
    o:['Océano Atlántico','Mar Cantábrico','Mar Mediterráneo','Mar Adriático'], c:2,
    exp:'Las Islas Baleares (Mallorca, Menorca, Ibiza, Formentera y otras) se encuentran en el mar Mediterráneo occidental, frente a las costas de Cataluña y Valencia.' },

  { id:'geo011', tema:'geografia',
    p:'¿Cuál es la extensión aproximada de España?',
    o:['300.000 km²','400.000 km²','505.000 km²','600.000 km²'], c:2,
    exp:'España tiene una extensión de aproximadamente 505.990 km², siendo el segundo país más grande de la Unión Europea, después de Francia.' },

  { id:'geo012', tema:'geografia',
    p:'¿Cuál es el estrecho que separa España de África?',
    o:['Estrecho de Gibraltar','Estrecho de Magallanes','Canal de la Mancha','Estrecho de Messina'], c:0,
    exp:'El estrecho de Gibraltar separa la Península Ibérica de África (Marruecos) y conecta el océano Atlántico con el mar Mediterráneo, con una anchura mínima de 14 km.' },

  { id:'geo013', tema:'geografia',
    p:'¿En qué océano están las Islas Canarias?',
    o:['Océano Índico','Mar Mediterráneo','Océano Atlántico','Mar Cantábrico'], c:2,
    exp:'Las Islas Canarias se encuentran en el océano Atlántico, frente a las costas de Marruecos y el Sáhara Occidental, a unos 1.500 km de la Península Ibérica.' },

  { id:'geo014', tema:'geografia',
    p:'¿Cuál es la meseta central española y cuál es su altitud media?',
    o:['La Meseta Central, a unos 600-700 metros','La Llanura Manchega, a unos 400 metros','La Depresión del Ebro, a unos 200 metros','Los Llanos de Castilla, a unos 800 metros'], c:0,
    exp:'La Meseta Central es la gran planicie que ocupa el centro de la Península Ibérica, con una altitud media de 600-700 metros sobre el nivel del mar. Es una de las mesetas más elevadas de Europa.' },

  { id:'geo015', tema:'geografia',
    p:'¿Cuál es la Comunidad Autónoma con mayor número de habitantes?',
    o:['Madrid','Cataluña','Andalucía','Valencia'], c:2,
    exp:'Andalucía, con más de 8,4 millones de habitantes, es la Comunidad Autónoma más poblada de España. Le siguen Cataluña y Madrid.' },

  /* ── CULTURA Y SOCIEDAD (20 preguntas) ─────────────────────────────── */

  { id:'cu001', tema:'cultura',
    p:'¿Quién pintó el cuadro "El Guernica"?',
    o:['Salvador Dalí','Joan Miró','Pablo Picasso','Francisco de Goya'], c:2,
    exp:'El Guernica fue pintado por Pablo Picasso en 1937, como respuesta al bombardeo de la ciudad vasca de Guernica durante la Guerra Civil española. Se exhibe en el Museo Reina Sofía de Madrid.' },

  { id:'cu002', tema:'cultura',
    p:'¿En qué ciudad se celebra la famosa Feria de Abril?',
    o:['Madrid','Granada','Sevilla','Málaga'], c:2,
    exp:'La Feria de Abril se celebra en Sevilla cada primavera, generalmente dos semanas después de Semana Santa. Es una de las fiestas populares más importantes de España.' },

  { id:'cu003', tema:'cultura',
    p:'¿Cómo se llama la famosa danza flamenca originaria de Andalucía?',
    o:['La sardana','El chotis','El flamenco','La jota'], c:2,
    exp:'El flamenco es un arte escénico originario de Andalucía que comprende el cante, el toque (guitarra) y el baile. Fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2010.' },

  { id:'cu004', tema:'cultura',
    p:'¿Cómo se llama la obra maestra literaria de Miguel de Cervantes?',
    o:['La Celestina','El Quijote','El Lazarillo de Tormes','La Regenta'], c:1,
    exp:'"El ingenioso hidalgo don Quijote de la Mancha" (1605-1615) de Miguel de Cervantes es considerada la primera novela moderna y la obra cumbre de la literatura en español.' },

  { id:'cu005', tema:'cultura',
    p:'¿Cuándo se celebra la fiesta nacional de España?',
    o:['25 de julio','12 de octubre','1 de noviembre','6 de diciembre'], c:1,
    exp:'El 12 de octubre, Fiesta Nacional de España, conmemora la llegada de Cristóbal Colón a América en 1492. También es conocido como el Día de la Hispanidad.' },

  { id:'cu006', tema:'cultura',
    p:'¿Quién fue Salvador Dalí?',
    o:['Un escritor surrealista catalán','Un pintor surrealista catalán','Un compositor catalán','Un arquitecto catalán'], c:1,
    exp:'Salvador Dalí (1904-1989) fue un pintor surrealista nacido en Figueres (Girona, Cataluña). Es uno de los artistas más influyentes del siglo XX, conocido por obras como "La persistencia de la memoria".' },

  { id:'cu007', tema:'cultura',
    p:'¿Quién es el arquitecto español famoso por la Sagrada Familia de Barcelona?',
    o:['Santiago Calatrava','Rafael Moneo','Ricardo Bofill','Antoni Gaudí'], c:3,
    exp:'Antoni Gaudí (1852-1926) es el arquitecto modernista catalán que diseñó la Sagrada Familia de Barcelona, entre otras obras declaradas Patrimonio Mundial de la UNESCO.' },

  { id:'cu008', tema:'cultura',
    p:'¿Qué premio literario de habla hispana es equivalente al Nobel?',
    o:['Premio Cervantes','Premio Planeta','Premio Nacional de Narrativa','Premio Príncipe de Asturias'], c:0,
    exp:'El Premio Cervantes, otorgado anualmente por el Ministerio de Cultura de España, es el reconocimiento literario más importante en lengua española.' },

  { id:'cu009', tema:'cultura',
    p:'¿En qué ciudad se encuentra el museo del Prado?',
    o:['Barcelona','Sevilla','Bilbao','Madrid'], c:3,
    exp:'El Museo Nacional del Prado, ubicado en Madrid, es uno de los museos de arte más importantes del mundo, con obras de Velázquez, Goya, El Greco y maestros europeos.' },

  { id:'cu010', tema:'cultura',
    p:'¿Cuándo se celebra la Navidad en España?',
    o:['24 de diciembre','25 de diciembre','26 de diciembre','31 de diciembre'], c:1,
    exp:'La Navidad se celebra el 25 de diciembre. Sin embargo, en España la noche del 24 (Nochebuena) tiene especial importancia familiar. Los Reyes Magos traen regalos el 6 de enero.' },

  { id:'cu011', tema:'cultura',
    p:'¿Qué es la Semana Santa?',
    o:['Una fiesta pagana de primavera','La conmemoración de la Pasión, Muerte y Resurrección de Jesucristo','La semana de fiestas previas a la Navidad','Una festividad del solsticio de verano'], c:1,
    exp:'La Semana Santa es la conmemoración de la Pasión, Muerte y Resurrección de Jesucristo, celebrada entre el Domingo de Ramos y el Domingo de Resurrección. Es especialmente famosa en Sevilla y Málaga.' },

  { id:'cu012', tema:'cultura',
    p:'¿Cuál es el deporte más popular en España?',
    o:['El baloncesto','El tenis','El fútbol','El ciclismo'], c:2,
    exp:'El fútbol es el deporte más popular en España. La Liga española es una de las más seguidas del mundo, y la selección española fue campeona del mundo en 2010 y de Europa en 2008 y 2012.' },

  { id:'cu013', tema:'cultura',
    p:'¿Qué fiesta se celebra en Valencia quemando grandes figuras de cartón piedra?',
    o:['Las Fallas','La Tomatina','Los Sanfermines','La Feria de Abril'], c:0,
    exp:'Las Fallas de Valencia se celebran en marzo (hasta el 19, día de San José) y consisten en la exposición y quema de grandes monumentos de cartón y madera (las "fallas"). Están declaradas Patrimonio Inmaterial de la Humanidad.' },

  { id:'cu014', tema:'cultura',
    p:'¿En qué ciudad se celebra el festival de los Sanfermines, famoso por el encierro de toros?',
    o:['Pamplona','Bilbao','San Sebastián','Logroño'], c:0,
    exp:'Los Sanfermines se celebran en Pamplona (Navarra) del 6 al 14 de julio. El encierro, en el que los toros recorren calles de la ciudad, es conocido mundialmente.' },

  { id:'cu015', tema:'cultura',
    p:'¿Cómo se llama el baile típico de Cataluña que se baila en corro?',
    o:['La jota','El flamenco','La sardana','El chotis'], c:2,
    exp:'La sardana es el baile tradicional de Cataluña. Se baila en grupos (corro) con los brazos entrelazados y está considerado símbolo de identidad catalana.' },

  { id:'cu016', tema:'cultura',
    p:'¿Quién es el pintor español más conocido por sus "pinturas negras"?',
    o:['El Greco','Velázquez','Francisco de Goya','Pablo Picasso'], c:2,
    exp:'Francisco de Goya (1746-1828) pintó sus famosas "pinturas negras" en los últimos años de su vida, entre ellas "Saturno devorando a su hijo". También fue pintor de la corte real.' },

  { id:'cu017', tema:'cultura',
    p:'¿Cuántos españoles han ganado el Premio Nobel de Literatura?',
    o:['1','2','3','5'], c:1,
    exp:'Dos escritores en lengua española con nacionalidad española han ganado el Nobel de Literatura: José Echegaray (1904) y Jacinto Benavente (1922). Juan Ramón Jiménez (1956) fue el tercero.' },

  { id:'cu018', tema:'cultura',
    p:'¿Cuál es el plato más conocido de la gastronomía española?',
    o:['El cocido madrileño','La paella','El gazpacho','La tortilla de patatas'], c:1,
    exp:'La paella, originaria de Valencia, es el plato más internacionalmente conocido de la gastronomía española. Hay diferentes variedades: valenciana (con pollo y conejo), de marisco, mixta, etc.' },

  { id:'cu019', tema:'cultura',
    p:'¿Qué monarca español fue representado por Velázquez en "Las Meninas"?',
    o:['Carlos II','Felipe III','Felipe IV','Carlos III'], c:2,
    exp:'"Las Meninas" (1656), de Diego Velázquez, retrata a la infanta Margarita Teresa rodeada de sus damas de honor, con Felipe IV y Mariana de Austria reflejados en un espejo al fondo.' },

  { id:'cu020', tema:'cultura',
    p:'¿En qué ciudad se encuentra el Museo Guggenheim, diseñado por Frank Gehry?',
    o:['Madrid','Barcelona','San Sebastián','Bilbao'], c:3,
    exp:'El Museo Guggenheim de Bilbao, diseñado por el arquitecto Frank Gehry e inaugurado en 1997, es uno de los edificios más emblemáticos del siglo XX y ha contribuido a la regeneración de la ciudad.' },

  /* ── UNIÓN EUROPEA (15 preguntas) ───────────────────────────────────── */

  { id:'ue001', tema:'ue',
    p:'¿En qué año ingresó España en la Comunidad Económica Europea (actual Unión Europea)?',
    o:['1982','1984','1986','1992'], c:2,
    exp:'España ingresó en la Comunidad Económica Europea el 1 de enero de 1986, junto con Portugal. Este ingreso supuso una gran transformación económica y social para el país.' },

  { id:'ue002', tema:'ue',
    p:'¿En qué año adoptó España el euro como moneda?',
    o:['1999','2000','2002','2004'], c:2,
    exp:'España adoptó el euro como moneda de curso legal el 1 de enero de 2002, sustituyendo a la peseta. Aunque el euro entró en vigor contable en 1999, las monedas y billetes comenzaron a circular en 2002.' },

  { id:'ue003', tema:'ue',
    p:'¿Cuántos países forman actualmente la Unión Europea?',
    o:['25','27','28','30'], c:1,
    exp:'Tras la salida del Reino Unido (Brexit), la Unión Europea cuenta con 27 estados miembros. España es miembro fundador del proceso de integración europeo, aunque se unió en 1986.' },

  { id:'ue004', tema:'ue',
    p:'¿Cuál es la sede del Parlamento Europeo?',
    o:['Bruselas','Luxemburgo','Estrasburgo','Ginebra'], c:2,
    exp:'El Parlamento Europeo tiene su sede principal en Estrasburgo (Francia), aunque también tiene instalaciones en Bruselas y la Secretaría General está en Luxemburgo.' },

  { id:'ue005', tema:'ue',
    p:'¿Qué es el espacio Schengen?',
    o:['El mercado único europeo','La zona de libre circulación de personas sin controles en fronteras internas','El acuerdo monetario del euro','La zona de libre comercio con EE.UU.'], c:1,
    exp:'El Acuerdo de Schengen (1985) estableció una zona de libre circulación de personas entre los países firmantes, eliminando los controles en las fronteras internas. España se incorporó en 1991.' },

  { id:'ue006', tema:'ue',
    p:'¿Qué institución de la UE representa a los Gobiernos de los Estados miembros?',
    o:['El Parlamento Europeo','La Comisión Europea','El Consejo de la Unión Europea','El Tribunal de Justicia de la UE'], c:2,
    exp:'El Consejo de la Unión Europea (o Consejo de Ministros) reúne a los ministros de los Gobiernos nacionales según el tema a tratar. Comparte el poder legislativo y presupuestario con el Parlamento Europeo.' },

  { id:'ue007', tema:'ue',
    p:'¿Qué institución europea vela por que los tratados de la UE sean respetados?',
    o:['El Parlamento Europeo','La Comisión Europea','El Consejo Europeo','El Tribunal de Cuentas'], c:1,
    exp:'La Comisión Europea es la "guardiana de los tratados": supervisa la aplicación del derecho de la UE y puede iniciar procedimientos de infracción contra los Estados que incumplan.' },

  { id:'ue008', tema:'ue',
    p:'¿Dónde se encuentra la sede de la Comisión Europea?',
    o:['París','Estrasburgo','Bruselas','Luxemburgo'], c:2,
    exp:'La sede principal de la Comisión Europea está en Bruselas (Bélgica), que es también la capital administrativa de facto de la Unión Europea.' },

  { id:'ue009', tema:'ue',
    p:'¿Cuándo se firmó el Tratado de Maastricht, que creó la Unión Europea?',
    o:['1986','1990','1992','1997'], c:2,
    exp:'El Tratado de Maastricht se firmó el 7 de febrero de 1992 y entró en vigor el 1 de noviembre de 1993. Creó formalmente la Unión Europea y sentó las bases para la unión económica y monetaria.' },

  { id:'ue010', tema:'ue',
    p:'¿Cuántos ciudadanos de la UE pueden impulsar una Iniciativa Ciudadana Europea para proponer legislación?',
    o:['500.000','1.000.000','2.000.000','5.000.000'], c:1,
    exp:'Un millón de ciudadanos de la UE de al menos 7 países miembros pueden presentar una Iniciativa Ciudadana Europea para invitar a la Comisión a proponer legislación en un ámbito de su competencia.' },

  { id:'ue011', tema:'ue',
    p:'¿Qué derechos fundamentales tienen los ciudadanos de la UE reconocidos en la Carta de Derechos Fundamentales?',
    o:['Solo derechos económicos','Solo derechos políticos','Derechos civiles, políticos, económicos, sociales y culturales','Solo derechos laborales'], c:2,
    exp:'La Carta de Derechos Fundamentales de la UE (2000) reconoce una amplia gama de derechos: dignidad, libertades, igualdad, solidaridad, ciudadanía y justicia.' },

  { id:'ue012', tema:'ue',
    p:'¿Qué significa el acrónimo "TFUE"?',
    o:['Tratado de Funcionamiento de la Unión Europea','Tribunal Federal de la Unión Europea','Tratado de Fundación de la Unión Europea','Tribunal de Finanzas de la Unión Europea'], c:0,
    exp:'El Tratado de Funcionamiento de la Unión Europea (TFUE) es uno de los dos tratados fundamentales de la UE (junto con el Tratado de la UE). Regula el funcionamiento de las instituciones y políticas comunitarias.' },

  { id:'ue013', tema:'ue',
    p:'¿Qué es el Banco Central Europeo y dónde tiene su sede?',
    o:['El banco de los estados miembros, con sede en Bruselas','El banco central de la zona euro, con sede en Fráncfort','El banco de inversiones de la UE, con sede en Luxemburgo','El banco comercial europeo, con sede en París'], c:1,
    exp:'El Banco Central Europeo (BCE), con sede en Fráncfort (Alemania), es responsable de la política monetaria en la zona euro, con el objetivo principal de mantener la estabilidad de precios.' },

  { id:'ue014', tema:'ue',
    p:'¿Cuántos eurodiputados tiene España en el Parlamento Europeo (aproximadamente)?',
    o:['35','59','70','85'], c:1,
    exp:'España tiene aproximadamente 59 eurodiputados en el Parlamento Europeo (el número varía ligeramente según los cálculos de representación proporcional). Es el cuarto país con más eurodiputados.' },

  { id:'ue015', tema:'ue',
    p:'¿Qué son los fondos estructurales de la UE?',
    o:['Fondos para la defensa europea','Instrumentos financieros para reducir las desigualdades entre regiones','Fondos para financiar a los países en recesión','Fondos para las instituciones europeas'], c:1,
    exp:'Los fondos estructurales (principalmente el FEDER y el FSE) son los principales instrumentos de la política de cohesión de la UE, destinados a reducir las disparidades económicas entre regiones.' },

  /* ── ECONOMÍA Y SOCIEDAD (10 preguntas) ─────────────────────────────── */

  { id:'eco001', tema:'economia',
    p:'¿Cuál es la moneda oficial de España?',
    o:['La peseta','El euro','El franco','La libra'], c:1,
    exp:'El euro es la moneda oficial de España desde el 1 de enero de 2002, cuando sustituyó a la peseta. España forma parte de la zona euro desde su creación en 1999.' },

  { id:'eco002', tema:'economia',
    p:'¿Cuál es uno de los principales sectores económicos de España?',
    o:['La minería','El turismo','La industria pesada','La pesca de altura'], c:1,
    exp:'El turismo es uno de los pilares de la economía española. España es uno de los países más visitados del mundo, con más de 80 millones de turistas antes de la pandemia.' },

  { id:'eco003', tema:'economia',
    p:'¿Qué porcentaje aproximado del PIB representa el turismo en España?',
    o:['5%','8%','12%','20%'], c:2,
    exp:'El turismo representa aproximadamente el 12-13% del PIB español, siendo uno de los sectores más importantes de la economía. España es el segundo país del mundo en ingresos turísticos.' },

  { id:'eco004', tema:'economia',
    p:'¿Cuándo fue la gran crisis económica que afectó gravemente a España?',
    o:['2000-2003','2005-2008','2008-2014','2015-2018'], c:2,
    exp:'La crisis económica que comenzó en 2008 afectó especialmente a España, con tasas de desempleo que llegaron al 27% en 2013. La recuperación fue progresiva a partir de 2014.' },

  { id:'eco005', tema:'economia',
    p:'¿Cuál es la principal autoridad bancaria en España?',
    o:['El Ministerio de Hacienda','El Banco de España','El Banco Central Europeo','La CNMV'], c:1,
    exp:'El Banco de España es el banco central nacional y supervisor del sistema financiero español. Actúa como parte del Sistema Europeo de Bancos Centrales (SEBC) y del Mecanismo Único de Supervisión (MUS).' },

  { id:'eco006', tema:'economia',
    p:'¿Qué es la Comisión Nacional del Mercado de Valores (CNMV)?',
    o:['El organismo que regula el mercado inmobiliario','El organismo supervisor de los mercados de valores e instrumentos financieros','La comisión de precios del Gobierno','El consejo de bolsas de España'], c:1,
    exp:'La CNMV es el organismo encargado de la supervisión e inspección de los mercados de valores españoles y de la actividad de cuantos intervienen en los mismos.' },

  { id:'eco007', tema:'economia',
    p:'¿Cuál es el sistema de pensiones en España?',
    o:['Un sistema privado de capitalización individual','Un sistema mixto','Un sistema público de reparto basado en la solidaridad intergeneracional','Un sistema voluntario'], c:2,
    exp:'El sistema de pensiones español es público y de reparto: las cotizaciones de los trabajadores activos financian las pensiones de los jubilados actuales (solidaridad intergeneracional).' },

  { id:'eco008', tema:'economia',
    p:'¿Qué es el SMI (Salario Mínimo Interprofesional)?',
    o:['El salario medio en España','El salario mínimo legal que debe percibir cualquier trabajador en España','El salario de los funcionarios','El salario máximo fijado por el Gobierno'], c:1,
    exp:'El SMI es el salario mínimo que por ley debe percibir cualquier trabajador, independientemente de su sector o categoría. Lo fija el Gobierno anualmente, previa consulta con sindicatos y empresarios.' },

  { id:'eco009', tema:'economia',
    p:'¿Qué organismos son los principales representantes de los trabajadores en España?',
    o:['Los partidos políticos','Los sindicatos (CC.OO. y UGT principalmente)','Las cámaras de comercio','Las asociaciones profesionales'], c:1,
    exp:'Los principales sindicatos en España son Comisiones Obreras (CC.OO.) y la Unión General de Trabajadores (UGT), ambos con representación mayoritaria y reconocidos como interlocutores sociales.' },

  { id:'eco010', tema:'economia',
    p:'¿Cuándo se elaboran los Presupuestos Generales del Estado?',
    o:['Cada dos años','Cada año, con entrada en vigor el 1 de enero','Cada cuatro años','Cuando lo decide el Gobierno'], c:1,
    exp:'Los Presupuestos Generales del Estado son anuales: el Gobierno elabora el proyecto antes del 1 de octubre para que las Cortes los aprueben antes de que termine el año y entren en vigor el 1 de enero.' }

]; // fin PREGUNTAS_CCSE
