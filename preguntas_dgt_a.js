/* ─────────────────────────────────────────────────────────────────────────
   PREGUNTAS_DGT_A — Banco de preguntas para Carnet A (motos) y AM (ciclomotores)
   Basado en el pool oficial de la DGT España
   100 preguntas: 70 Carnet A · 30 exclusivas AM
   ───────────────────────────────────────────────────────────────────────── */

window.TEMAS_DGT_A = {
  tecnica:   'Técnica de conducción de moto',
  senales:   'Señales y normas específicas de moto',
  seguridad: 'Equipamiento y seguridad del motorista',
  mecanica:  'Mecánica de la motocicleta',
  auxilios:  'Primeros auxilios para motoristas'
};

window.PREGUNTAS_DGT_A = [

  /* ── TÉCNICA DE CONDUCCIÓN (25 preguntas) ───────────────────────────── */

  { id:'a_t001', tema:'tecnica',
    p:'¿Qué efecto produce el frenado brusco en una motocicleta?',
    o:['Ninguno especial respecto a un coche','Puede provocar el bloqueo de ruedas y la caída del motorista','Mejora la estabilidad en curva','Solo afecta a motos con neumáticos blandos'], c:1,
    exp:'El frenado brusco en moto puede bloquear las ruedas, provocando una pérdida de control y caída. Debe frenarse de forma progresiva, usando tanto freno delantero como trasero correctamente.' },

  { id:'a_t002', tema:'tecnica',
    p:'¿Cuál es la técnica correcta de frenada en curva con una motocicleta?',
    o:['Frenar con fuerza solo con el freno trasero','Frenar con fuerza solo con el freno delantero','Evitar frenar en curva; si es necesario, hacerlo suavemente antes de iniciarla','Acelerar ligeramente para mejorar la estabilidad'], c:2,
    exp:'En curva, frenar con fuerza puede provocar la caída. Lo ideal es frenar antes de entrar en la curva para reducir la velocidad adecuada, y si es necesario frenar en curva, hacerlo muy suavemente.' },

  { id:'a_t003', tema:'tecnica',
    p:'¿Qué es el "contraataque" o "contramanillar" en moto?',
    o:['Girar el manillar en sentido contrario en emergencias','Técnica avanzada para iniciar un giro presionando el manillar hacia el lado contrario al que se quiere girar','Solo lo usan motoristas expertos en competición','La técnica de frenada de emergencia'], c:1,
    exp:'El contramanillar (o contraataque) consiste en ejercer presión en el manillar hacia el lado contrario a la curva para iniciar el giro. Es la técnica natural de dirección de todas las motos a partir de cierta velocidad.' },

  { id:'a_t004', tema:'tecnica',
    p:'¿Por qué es especialmente peligroso circular en moto sobre suelo mojado o con hojas?',
    o:['Por el mayor ruido del motor en mojado','Porque la adherencia de los neumáticos se reduce drásticamente','Porque la moto pesa más en mojado','Porque los frenos dejan de funcionar'], c:1,
    exp:'En superficies resbaladizas (agua, hojas, barro, arena), la adherencia de los neumáticos de moto se reduce mucho más que en coche. La moto tiene solo dos puntos de contacto y la pérdida de tracción es más peligrosa.' },

  { id:'a_t005', tema:'tecnica',
    p:'¿Dónde debe posicionarse el motorista dentro de su carril para ser más visible?',
    o:['Siempre a la izquierda del carril','Siempre a la derecha del carril','Variando la posición según la situación para ser visto y tener mejor visibilidad','Siempre en el centro del carril'], c:2,
    exp:'El motorista debe variar su posición dentro del carril para maximizar su visibilidad (ser visto) y la visibilidad de la vía por delante. En rectas, el centro o ligeramente a la izquierda; en curvas, posición adecuada.' },

  { id:'a_t006', tema:'tecnica',
    p:'¿Qué distancia de seguridad debe mantener una motocicleta respecto al vehículo de delante?',
    o:['La misma que un turismo','Mayor que un turismo, ya que la moto tiene menos estabilidad y sus frenos son distintos','Menor, porque la moto frena mejor','Solo 3 metros en ciudad'], c:1,
    exp:'Las motos deben mantener una distancia de seguridad mayor o igual que los turismos. A pesar de frenar bien, la moto es menos visible y ante una emergencia necesita la misma o mayor distancia.' },

  { id:'a_t007', tema:'tecnica',
    p:'¿Cuándo es especialmente peligroso circular en moto tras una lluvia leve?',
    o:['Inmediatamente después de que empiece a llover ligero, porque el agua arrastra el aceite y suciedad acumulados','Solo cuando llueve mucho','Cuando el suelo está completamente seco','Solo en carretera, no en ciudad'], c:0,
    exp:'Los primeros minutos de lluvia leve son los más peligrosos, porque el agua emulsiona el aceite, el polvo y la suciedad del asfalto, creando una capa extremadamente resbaladiza.' },

  { id:'a_t008', tema:'tecnica',
    p:'¿Qué es la "zona de separación" cuando dos motos circulan en grupo?',
    o:['La distancia lateral entre motos en la misma fila','La posición escalonada que adoptan las motos para mantener la distancia de seguridad circular','La zona de descanso','El carril por donde circulan'], c:1,
    exp:'En grupo, las motos circulan en formación escalonada (en zig-zag dentro del carril): el primero a la izquierda, el segundo a la derecha del primero, el tercero a la izquierda del segundo, etc. Así mantienen la distancia de seguridad.' },

  { id:'a_t009', tema:'tecnica',
    p:'¿Cómo afecta el viento lateral a una motocicleta en autopista?',
    o:['No afecta por su menor superficie','Puede desestabilizarla bruscamente, especialmente al pasar junto a camiones o bajo puentes','Solo afecta en curva','Mejora la estabilidad'], c:1,
    exp:'Las motos son especialmente vulnerables al viento lateral, que puede desplazarlas de su trayectoria. Al rebasar camiones o pasar bajo puentes, las turbulencias son especialmente peligrosas.' },

  { id:'a_t010', tema:'tecnica',
    p:'¿Por qué las líneas de pintura del suelo (marcas viales) son peligrosas para los motoristas?',
    o:['Porque son resbaladizas, especialmente con lluvia o humedad','Porque son difíciles de ver','Porque distorsionan la visión de la vía','Porque dañan los neumáticos'], c:0,
    exp:'Las marcas viales pintadas (líneas, pasos de peatones) son más resbaladizas que el asfalto, especialmente cuando están mojadas. Los motoristas deben cruzarlas en ángulo recto si es posible.' },

  { id:'a_t011', tema:'tecnica',
    p:'¿Qué es el "congelamiento" del motorista en una emergencia?',
    o:['Cuando el motorista se queda paralizado sin reaccionar','Cuando la moto se congela por bajas temperaturas','Cuando el motor se apaga por frío','Cuando los frenos se bloquean en invierno'], c:0,
    exp:'El "congelamiento" es la parálisis momentánea del motorista ante una emergencia, donde no logra reaccionar. La formación y práctica sistemática ayuda a generar respuestas automáticas correctas.' },

  { id:'a_t012', tema:'tecnica',
    p:'¿Cómo se debe pasar un obstáculo (bache, piedra) con la moto?',
    o:['Frenar a fondo antes del obstáculo','Pasar con velocidad reducida, ligeramente flexionados los brazos y las piernas para absorber el impacto, sin frenar sobre el obstáculo','Acelerar para pasarlo rápido','Girar bruscamente para esquivarlo siempre'], c:1,
    exp:'Al pasar un obstáculo con la moto, se reduce la velocidad antes, luego se pasa con brazos y piernas flexionadas para absorber el impacto. No se frena encima del obstáculo porque puede desestabilizar.' },

  { id:'a_t013', tema:'tecnica',
    p:'¿Cuándo está permitido a una motocicleta circular entre los carriles de tráfico?',
    o:['Siempre que el tráfico esté detenido o muy lento','Nunca, está prohibido en España','Solo en autopistas','Solo si los carriles son muy anchos'], c:1,
    exp:'En España, circular entre carriles ("filtrar") está prohibido por la normativa de tráfico. Aunque en algunos países está permitido, en España es una infracción.' },

  { id:'a_t014', tema:'tecnica',
    p:'¿Qué efecto tiene llevar un pasajero en la conducción de la moto?',
    o:['No tiene efectos significativos','Cambia el centro de gravedad, aumenta la inercia y alarga la distancia de frenado','Mejora la estabilidad por mayor peso','Permite ir más rápido'], c:1,
    exp:'Un pasajero cambia el centro de gravedad de la moto, aumenta el peso total y la inercia, lo que alarga la distancia de frenado y modifica el comportamiento en curvas. Hay que adaptar la conducción.' },

  { id:'a_t015', tema:'tecnica',
    p:'¿Qué es el "punto de entrada" en una curva con moto?',
    o:['El inicio de la curva señalizado en el suelo','El punto donde el motorista inicia el giro del manillar o aplica la presión','La señal de aviso de la curva','El punto más externo de la curva'], c:1,
    exp:'El punto de entrada en curva es donde el motorista inicia la acción de giro (presión de manillar). Entrar tarde en la curva permite ver más e iniciar el giro con mejor información.' },

  { id:'a_t016', tema:'tecnica',
    p:'¿Es legal llevar pasajero en una moto sin asiento trasero homologado?',
    o:['Sí, si el pasajero va de pie','No, el asiento trasero debe estar homologado y la moto debe estar autorizada para pasajero','Sí, si va a baja velocidad','Sí, si se circula en ciudad'], c:1,
    exp:'Para transportar pasajero, la moto debe tener asiento trasero homologado, reposapiés homologados para el pasajero, y estar así autorizado en el permiso de circulación.' },

  { id:'a_t017', tema:'tecnica',
    p:'¿Qué distancia existe entre el freno delantero y el trasero en una moto con ABS?',
    o:['Solo tiene freno delantero','El ABS actúa en los dos frenos de forma independiente, evitando el bloqueo','Los frenos son distintos e independientes, el ABS los iguala','El ABS solo actúa en el freno trasero de motos'], c:1,
    exp:'El ABS en motos funciona de forma similar al de los coches: evita el bloqueo de las ruedas durante la frenada, permitiendo mantener la dirección. Actúa en los frenos delantero y trasero de forma independiente.' },

  { id:'a_t018', tema:'tecnica',
    p:'¿Por qué es importante mirar lejos en moto?',
    o:['Para ver mejor las señales','Para anticipar situaciones y distribuir el tiempo de reacción, dado que la velocidad reduce el campo visual','Solo para evitar mareos','Porque la luz del casco reduce la visión cercana'], c:1,
    exp:'En moto, mirar lejos es fundamental porque a mayor velocidad, el tiempo disponible para reaccionar es menor. Anticipar situaciones viendo lejos permite adaptarse con tiempo suficiente.' },

  { id:'a_t019', tema:'tecnica',
    p:'¿Qué se debe hacer cuando la moto comienza a derrapar la rueda trasera?',
    o:['Frenar a fondo','Girar el manillar hacia el lado contrario del derrape','Mantener el acelerador suave y dirigir la mirada hacia donde se quiere ir','Soltar el manillar'], c:2,
    exp:'Si la rueda trasera derrapa, no hay que frenar ni hacer movimientos bruscos. Se suelta suavemente el acelerador, se mantiene la moto derecha y se dirige la mirada hacia donde se quiere ir.' },

  { id:'a_t020', tema:'tecnica',
    p:'¿Cómo se protege un motorista ante el "punto ciego" de los camiones?',
    o:['Circulando muy cerca del camión por detrás','Evitando circular en los ángulos muertos del camión, siendo visible para el conductor','Adelantando siempre por la derecha','Circulando entre el camión y la mediana'], c:1,
    exp:'Los motoristas deben evitar los ángulos muertos de los camiones (puntos ciegos) y asegurarse de ser visibles. Si no ves al conductor del camión en sus espejos, el conductor tampoco te ve.' },

  { id:'a_t021', tema:'tecnica',
    p:'¿Cuándo se debe cambiar a una marcha más corta (reducir marcha) en moto?',
    o:['Solo al frenar de emergencia','Antes de una curva, al reducir la velocidad, al arrancar y en subidas pronunciadas','Solo cuando el motor revoluciona mucho','Solo en ciudad'], c:1,
    exp:'Se reduce la marcha (desaceleración activa o "engine braking") antes de curvas, al reducir la velocidad, al iniciar la marcha, y en pendientes pronunciadas para tener más control y potencia disponible.' },

  { id:'a_t022', tema:'tecnica',
    p:'¿A partir de qué cilindrada se puede conducir el carnet A en España?',
    o:['A partir de 125cc','A partir de 250cc','Con el carnet A se puede conducir cualquier motocicleta sin límite de cilindrada','A partir de 400cc'], c:2,
    exp:'Con el permiso A (sin restricciones, a partir de los 24 años o 2 años con A2), se puede conducir cualquier motocicleta sin límite de potencia ni cilindrada.' },

  { id:'a_t023', tema:'tecnica',
    p:'¿Qué limitaciones tiene el permiso A2?',
    o:['No hay limitaciones','Potencia máxima de 35 kW (47,5 CV) y relación potencia/peso máxima de 0,2 kW/kg','Cilindrada máxima de 250cc','Velocidad máxima de 100 km/h'], c:1,
    exp:'El permiso A2 limita la potencia a 35 kW (aproximadamente 47,5 CV) y la relación potencia/peso a 0,2 kW/kg. No puede ser una moto de mayor potencia reducida por más del 50%.' },

  { id:'a_t024', tema:'tecnica',
    p:'¿Qué edad mínima se requiere para obtener el carnet de moto AM (ciclomotores)?',
    o:['14 años','15 años','16 años','18 años'], c:1,
    exp:'El permiso AM para ciclomotores (dos y tres ruedas y cuadriciclos ligeros hasta 45 km/h) se puede obtener a partir de los 15 años de edad.' },

  { id:'a_t025', tema:'tecnica',
    p:'¿Qué velocidad máxima pueden alcanzar los ciclomotores para ser clasificados como tales?',
    o:['30 km/h','45 km/h','50 km/h','70 km/h'], c:1,
    exp:'Los ciclomotores son vehículos de motor de dos, tres o cuatro ruedas cuya velocidad máxima por construcción no supera los 45 km/h y con cilindrada máxima de 50cc (o potencia equivalente para eléctricos).' },

  /* ── SEÑALES Y NORMAS ESPECÍFICAS DE MOTO (20 preguntas) ──────────── */

  { id:'a_s001', tema:'senales',
    p:'¿Con qué permiso se puede conducir una motocicleta de hasta 125cc sin haber cumplido 18 años?',
    o:['Con el permiso AM','Con el permiso A1 a partir de los 16 años','Con el permiso B si se tienen más de 18 años','No es posible conducir motos de 125cc antes de los 18 años'], c:1,
    exp:'El permiso A1 permite conducir motocicletas de hasta 125cc y 11 kW, ciclomotores de tres ruedas y triciclos ligeros. Se puede obtener a partir de los 16 años.' },

  { id:'a_s002', tema:'senales',
    p:'¿Pueden circular las motos por el arcén en autopista?',
    o:['Sí, siempre','Sí, cuando el tráfico está detenido','No, el arcén es solo para emergencias y paradas autorizadas','Sí, si son de menos de 125cc'], c:2,
    exp:'El arcén está reservado para paradas de emergencia y vehículos de asistencia. Ningún tipo de vehículo puede circular por el arcén como norma general, incluidas las motos.' },

  { id:'a_s003', tema:'senales',
    p:'¿Cuál es la velocidad máxima para ciclomotores en vía interurbana?',
    o:['45 km/h','60 km/h','70 km/h','80 km/h'], c:0,
    exp:'Los ciclomotores tienen una velocidad máxima por construcción de 45 km/h. En vías interurbanas, deben respetar este límite y nunca pueden superar la velocidad indicada por las señales.' },

  { id:'a_s004', tema:'senales',
    p:'¿Pueden circular los ciclomotores por autopistas?',
    o:['Sí, con precaución','Sí, si llevan casco','No, los ciclomotores no pueden circular por autopistas ni autovías','Sí, solo en el arcén'], c:2,
    exp:'Los ciclomotores tienen prohibido circular por autopistas y autovías. Tampoco pueden circular por las vías que el reglamento prohíbe específicamente para este tipo de vehículos.' },

  { id:'a_s005', tema:'senales',
    p:'¿Está permitido llevar pasajero en un ciclomotor?',
    o:['Sí, siempre','No, nunca se permite pasajero en ciclomotores','Solo si el ciclomotor está homologado para ello y el pasajero lleva casco','Solo si el conductor tiene más de 18 años'], c:2,
    exp:'Se puede llevar pasajero en un ciclomotor solo si el vehículo está homologado para ello (tiene asiento y reposapiés traseros), el conductor tiene los permisos necesarios y el pasajero lleva casco.' },

  { id:'a_s006', tema:'senales',
    p:'¿Pueden los ciclomotores circular por carriles bici?',
    o:['Sí, siempre que los ciclistas lo permitan','No, los carriles bici son exclusivos para bicicletas','Solo cuando no hay ciclistas','Sí, si llevan casco'], c:1,
    exp:'Los carriles bici están destinados a bicicletas y otros vehículos similares no motorizados (y patinetes en algunos casos). Los ciclomotores no pueden circular por ellos.' },

  { id:'a_s007', tema:'senales',
    p:'¿En qué situaciones puede circular una moto junto a otra moto en el mismo carril?',
    o:['Siempre que las dos motos quepan en el carril','Solo cuando el carril tenga más de 3,5 m de ancho','Nunca; cada moto debe ocupar su propio carril de forma exclusiva','Solo en autopistas'], c:2,
    exp:'Está prohibido que dos motocicletas o ciclomotores circulen en paralelo en el mismo carril. Cada vehículo debe utilizar su propio carril o parte de la calzada correspondiente.' },

  { id:'a_s008', tema:'senales',
    p:'¿Cuándo puede una moto adelantar por la derecha?',
    o:['Nunca está permitido','Solo en ciudad con tráfico denso','Cuando hay atascos y el carril de la derecha avanza más rápido','Solo si el de delante va a girar a la izquierda, en determinados supuestos reglamentarios'], c:3,
    exp:'Adelantar por la derecha está prohibido excepto en supuestos muy concretos regulados por la ley (carril derecho libre y el de delante va a girar a la izquierda, en vías con varios carriles por sentido, etc.).' },

  { id:'a_s009', tema:'senales',
    p:'¿Qué señal triangular advierte específicamente de un peligro para motoristas?',
    o:['No hay señales específicas para motoristas','La señal P-14 (resalto en la calzada) es especialmente importante para motos','La señal P-1 (curva)','La señal P-25 (prioridad de paso)'], c:1,
    exp:'La señal P-14 "Resalto o badén" advierte de un desnivel en la calzada que puede ser especialmente peligroso para motoristas, ya que puede provocar la pérdida de contacto de las ruedas.' },

  { id:'a_s010', tema:'senales',
    p:'¿Qué norma regula la obligatoriedad del casco en España?',
    o:['El Código Penal','El Reglamento General de Circulación y la Ley de Tráfico','Solo el Reglamento de la DGT','El Código Civil'], c:1,
    exp:'La obligatoriedad del casco homologado para motoristas y sus pasajeros está establecida en el Reglamento General de Circulación (RGC) y en la Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial.' },

  { id:'a_s011', tema:'senales',
    p:'¿Puede una moto circular en sentido contrario al establecido en una vía de sentido único?',
    o:['Sí, si va a baja velocidad','Sí, por el arcén','No, las motos deben respetar el sentido de circulación como cualquier vehículo','Sí, si hay una bici-calle'], c:2,
    exp:'Las motocicletas deben respetar el sentido de circulación establecido, como cualquier otro vehículo. Solo en vías con autorización específica para circular en sentido contrario (algunos carriles bici) se permite la excepción.' },

  { id:'a_s012', tema:'senales',
    p:'¿Cuándo deben llevar las motos la luz delantera encendida?',
    o:['Solo de noche','Solo en condiciones de baja visibilidad','Siempre, tanto de día como de noche','Solo en autopistas y autovías'], c:2,
    exp:'Las motocicletas y ciclomotores deben circular con la luz delantera siempre encendida, tanto de día como de noche. Esta obligación mejora la visibilidad del motorista ante otros conductores.' },

  { id:'a_s013', tema:'senales',
    p:'¿Qué ocurre si se conduce una moto con el permiso caducado?',
    o:['Solo es una infracción leve','Es una infracción muy grave que puede implicar multa y retirada del vehículo','No tiene consecuencias si es por pocos días','Solo es sancionable si hay accidente'], c:1,
    exp:'Conducir con el permiso caducado es una infracción muy grave en la normativa de tráfico española, con sanción de multa y posible retirada del vehículo.' },

  { id:'a_s014', tema:'senales',
    p:'¿Cuál es la velocidad máxima en autopista para una motocicleta?',
    o:['100 km/h','110 km/h','120 km/h','140 km/h'], c:2,
    exp:'La velocidad máxima en autopista para motocicletas es de 120 km/h, igual que para turismos. Sin embargo, en condiciones adversas o con señalización específica, se reducirá.' },

  { id:'a_s015', tema:'senales',
    p:'¿Qué documentos debe llevar siempre un motorista?',
    o:['Solo el carnet de conducir','Permiso de circulación, ITV, seguro obligatorio y permiso de conducir','Solo el seguro y el carnet','El carnet y la ficha técnica'], c:1,
    exp:'Un motorista debe llevar siempre: permiso de conducción, permiso de circulación del vehículo, certificado de la ITV en vigor, y tarjeta de identificación del seguro obligatorio (o certificado de seguro).' },

  { id:'a_s016', tema:'senales',
    p:'¿Puede una motocicleta circular en vías exclusivas para bicicletas?',
    o:['Sí, si la velocidad no supera los 20 km/h','Sí, si la moto es eléctrica','No, las vías ciclistas son exclusivas para bicicletas y vehículos no motorizados','Solo las motos eléctricas de menos de 11 kW'], c:2,
    exp:'Las vías ciclistas y carriles bici son exclusivos para bicicletas y, en algunos casos, patinetes u otros vehículos de movilidad personal no motorizados. Las motocicletas no pueden circular por ellas.' },

  { id:'a_s017', tema:'senales',
    p:'¿Qué tasa de alcoholemia máxima se aplica a los motoristas en España?',
    o:['La misma que para cualquier conductor: 0,5 g/l','Una más baja: 0,3 g/l solo para noveles','La misma que conductores en general (0,5 g/l) pero se aplica con mayor rigor','No hay tasa específica para motoristas'], c:0,
    exp:'La tasa de alcoholemia para motoristas es la misma que para cualquier conductor: 0,5 g/l en sangre (0,25 mg/l en aire). Los noveles (menos de 2 años de permiso) tienen el límite en 0,3 g/l.' },

  { id:'a_s018', tema:'senales',
    p:'¿Puede una moto estacionar sobre la acera en zona urbana?',
    o:['Sí, si no molesta a los peatones','Sí, si la acera es ancha','No, salvo que haya una señal que lo permita expresamente','Solo motos de menos de 125cc'], c:2,
    exp:'Las motos no pueden estacionar en la acera como norma general. Solo se permite si hay una señal expresa que autorice el aparcamiento de vehículos de dos ruedas sobre la acera, respetando el espacio peatonal.' },

  { id:'a_s019', tema:'senales',
    p:'¿Necesita pasar la ITV una moto nueva de 3 años?',
    o:['Sí, al primer año','No, hasta los 4 años no es obligatoria la primera ITV','Solo si tiene más de 50cc','Sí, a los 2 años'], c:1,
    exp:'Las motocicletas nuevas tienen la primera ITV a los 4 años de la fecha de matriculación. A partir de entonces, cada 2 años hasta los 10 años, y después anualmente.' },

  { id:'a_s020', tema:'senales',
    p:'¿Qué permiso se necesita para conducir un triciclo de motor de más de 15 kW?',
    o:['El permiso B','El permiso A','El permiso AM','El permiso A1'], c:1,
    exp:'Para conducir un triciclo de motor cuya potencia supere los 15 kW se requiere el permiso A. Los triciclos de hasta 15 kW pueden conducirse con el permiso B.' },

  /* ── EQUIPAMIENTO Y SEGURIDAD DEL MOTORISTA (20 preguntas) ─────────── */

  { id:'a_e001', tema:'seguridad',
    p:'¿Es obligatorio el uso del casco para motoristas y ciclomotoristas?',
    o:['Solo en autopistas y autovías','Solo de noche','Sí, siempre es obligatorio para el conductor y pasajero','Solo para menores de 18 años'], c:2,
    exp:'El uso del casco homologado es obligatorio para todos los motoristas y sus pasajeros, en cualquier tipo de vía y a cualquier hora del día.' },

  { id:'a_e002', tema:'seguridad',
    p:'¿Qué norma deben cumplir los cascos para ser legales en España?',
    o:['Cualquier casco es válido si protege la cabeza','Deben tener el marcado CE y cumplir la normativa ECE 22.06 o equivalente','Solo los homologados por la DGT','Deben ser de color claro para mayor visibilidad'], c:1,
    exp:'Los cascos deben estar homologados según las normas europeas (marcado CE, norma ECE 22.06 o equivalente). No es válido cualquier casco: debe estar certificado para uso en vehículos de motor.' },

  { id:'a_e003', tema:'seguridad',
    p:'¿Por qué se recomienda que los motoristas usen ropa específica de moto?',
    o:['Solo por estética','Porque la ropa de moto con protecciones reduce significativamente las lesiones en caso de caída','Porque el reglamento lo exige para todos los motoristas','Solo en circuito, no en vía pública'], c:1,
    exp:'La ropa específica de moto (chaqueta, pantalón, guantes, botas) lleva protecciones en zonas críticas (espalda, hombros, codos, rodillas, tobillos) que reducen significativamente las lesiones en accidente.' },

  { id:'a_e004', tema:'seguridad',
    p:'¿Qué ocurre si un motorista lleva el casco sin abrochar la correa?',
    o:['No supone peligro adicional','En un impacto, el casco puede salir proyectado, perdiendo toda su función protectora','Solo es una infracción administrativa leve','El casco protege igual aunque no esté abrochado'], c:1,
    exp:'Un casco sin abrochar puede salir proyectado durante un impacto, dejando la cabeza sin protección en el momento más peligroso. La correa debe estar siempre bien abrochada.' },

  { id:'a_e005', tema:'seguridad',
    p:'¿Cuándo debe renovarse el casco de moto?',
    o:['Cada 5 años sin excepciones','Tras sufrir un impacto significativo, y se recomienda cada 5 años aunque parezca en buen estado','Solo cuando está visiblemente dañado','Nunca, si está en buen estado exterior'], c:1,
    exp:'El casco debe renovarse tras sufrir cualquier impacto significativo (aunque no se vean daños exteriores, los materiales internos se comprimen y pierden eficacia). También se recomienda renovarlo cada 5 años.' },

  { id:'a_e006', tema:'seguridad',
    p:'¿Qué es el "airbag de moto"?',
    o:['Un airbag en el manillar','Un sistema de bolsa de aire que se despliega en el traje del motorista al detectar una colisión','Un airbag en las alforjas','El airbag delantero de la moto'], c:1,
    exp:'Los airbags para motoristas son sistemas integrados en el traje o chaleco que detectan una colisión y despliegan bolsas de aire para proteger el cuello, torso y caderas del motorista.' },

  { id:'a_e007', tema:'seguridad',
    p:'¿Por qué los motoristas son más vulnerables en accidentes que los ocupantes de turismos?',
    o:['Porque las motos son más rápidas','Porque carecen de la carrocería protectora del coche, dejando el cuerpo expuesto al impacto','Porque los motoristas reaccionan más lento','Porque las motos no tienen airbags'], c:1,
    exp:'Los motoristas no tienen carrocería que absorba el impacto. En un accidente, el cuerpo queda expuesto directamente a las fuerzas del choque, haciendo que las lesiones sean mucho más graves.' },

  { id:'a_e008', tema:'seguridad',
    p:'¿Qué son los guantes de moto y por qué son importantes?',
    o:['Solo son un accesorio estético','Protegen las manos y muñecas, que son las primeras zonas que impactan en una caída al intentar parar la moto con las manos','Son obligatorios en autopista','Solo útiles en frío'], c:1,
    exp:'En una caída, el instinto lleva a poner las manos para amortiguar el golpe. Los guantes de moto protegen las manos y muñecas, reduciendo abrasiones y fracturas.' },

  { id:'a_e009', tema:'seguridad',
    p:'¿Qué ventaja aportan las botas de moto frente a las zapatillas normales?',
    o:['Solo protegen del frío','Protegen el tobillo de torsiones, cubren los maleólos y tienen suela antideslizante específica','Son más cómodas para conducir','No aportan ninguna ventaja especial'], c:1,
    exp:'Las botas de moto protegen el tobillo (muy vulnerable en caídas), los maleólos y el pie. Tienen sistemas de refuerzo, son antideslizantes y resisten el calor del motor.' },

  { id:'a_e010', tema:'seguridad',
    p:'¿Está permitido llevar auriculares o cascos de música mientras se conduce una moto?',
    o:['Sí, si es a bajo volumen','No, está prohibido usar auriculares que impidan oír el entorno','Sí, si es un solo auricular','Sí, si se usa el manos libres del teléfono'], c:1,
    exp:'Está prohibido usar auriculares o cascos que aislen acústicamente al motorista del entorno. El motorista debe poder escuchar sirenas de emergencia, claxons y otros sonidos del tráfico.' },

  { id:'a_e011', tema:'seguridad',
    p:'¿Qué tipo de casco ofrece mayor protección: integral, jet o de enduro?',
    o:['El jet, por ser más ligero','El integral, al cubrir toda la cabeza y la mandíbula','El de enduro, por tener visera solar','El jet con mentonera añadida'], c:1,
    exp:'El casco integral (o full-face) cubre toda la cabeza, incluyendo la mandíbula y el mentón. Ofrece la mayor protección en impactos frontales o en caídas sobre la mandíbula.' },

  { id:'a_e012', tema:'seguridad',
    p:'¿Por qué es importante usar ropa reflectante o con elementos reflectantes en moto?',
    o:['Por moda','Por obligación legal en autopistas','Para ser visto por otros conductores, especialmente de noche o con poca visibilidad','Solo es útil en carretera secundaria'], c:2,
    exp:'Los motoristas son difíciles de ver para otros conductores. La ropa con elementos reflectantes aumenta significativamente la visibilidad en condiciones de poca luz, reduciendo el riesgo de ser golpeados.' },

  { id:'a_e013', tema:'seguridad',
    p:'¿Puede el peso del equipamiento del motorista (casco, chaqueta, botas) afectar a la conducción?',
    o:['No, el equipamiento es siempre neutro','Puede causar fatiga en viajes largos, pero la protección que ofrece justifica su uso','Solo el casco puede afectar a la concentración','Solo en verano por el calor'], c:1,
    exp:'El equipamiento puede causar algo de incomodidad o fatiga en viajes muy largos (especialmente en verano), pero la protección que ofrece supera con creces cualquier inconveniencia.' },

  { id:'a_e014', tema:'seguridad',
    p:'¿Es recomendable llevar una protección dorsal en la chaqueta de moto?',
    o:['No, ya que limita el movimiento','Sí, es muy recomendable porque la columna vertebral es muy vulnerable en caídas','Solo para carrera en circuito','No existe equipamiento específico para la espalda'], c:1,
    exp:'La protección dorsal (airbag o rígida) protege la columna vertebral en caídas. Las lesiones de columna en accidentes de moto pueden ser muy graves o fatales, por lo que la protección es muy recomendable.' },

  { id:'a_e015', tema:'seguridad',
    p:'¿Qué debe hacer un motorista si su visera del casco se empaña?',
    o:['Quitarse el casco para ver mejor','Abrir ligeramente la visera o usar sistemas antivaho (pinlock, visera doble) para desempañarla','Frenar y detenerse inmediatamente','Acelerar para generar calor'], c:1,
    exp:'La visera empañada reduce gravemente la visibilidad. Los sistemas antivaho (láminas Pinlock, viseras dobles) previenen el vaho. Si se empaña, se puede abrir la visera ligeramente hasta que se desempañe.' },

  { id:'a_e016', tema:'seguridad',
    p:'¿Qué riesgo específico existe para motoristas en condiciones de frío intenso?',
    o:['Las motos no arrancan en frío','La hipotermia y el entumecimiento de manos y pies pueden reducir reflejos y la capacidad de controlar la moto','El aceite se congela y el motor se daña','El casco pierde sus propiedades protectoras'], c:1,
    exp:'El frío intenso puede causar hipotermia y entumecimiento de extremidades, lo que reduce la capacidad de reacción y el control de los mandos de la moto. Es fundamental vestir adecuadamente para el frío.' },

  { id:'a_e017', tema:'seguridad',
    p:'¿Por qué se recomienda no conducir en moto cuando se está fatigado?',
    o:['Solo por normativa legal','La fatiga reduce la concentración, los reflejos y aumenta el tiempo de reacción, factores especialmente críticos en moto','Porque el seguro no cubre accidentes por fatiga','Solo si se lleva pasajero'], c:1,
    exp:'La fatiga afecta gravemente a la concentración y los reflejos. En moto, donde el equilibrio y la reacción rápida son esenciales, la fatiga puede ser fatal. Se recomienda parar cada 1,5-2 horas.' },

  { id:'a_e018', tema:'seguridad',
    p:'¿Qué calzado está prohibido usar al conducir una moto?',
    o:['Los zapatos de cuero','Las zapatillas deportivas','Los chanclas, sandalias o calzado que no sujete el pie correctamente y no proteja el tobillo','Las botas de agua'], c:2,
    exp:'Está desaconsejado (y en algunos contextos sancionable) circular en moto con calzado que no proteja el pie y el tobillo adecuadamente (chanclas, sandalias, calzado abierto).' },

  { id:'a_e019', tema:'seguridad',
    p:'¿Dónde es más peligroso circular en moto en términos estadísticos?',
    o:['En autopistas','En carreteras secundarias de una sola vía con curvas','En ciudad','En polígonos industriales'], c:1,
    exp:'Las carreteras secundarias (convencionales de un carril por sentido) concentran la mayoría de los accidentes mortales de moto en España, por las curvas, la alta velocidad permitida y los cruces sin señalizar.' },

  { id:'a_e020', tema:'seguridad',
    p:'¿Qué sistema de frenada es obligatorio en los nuevos ciclomotores y motos matriculados desde 2016 en Europa?',
    o:['El ABS o CBS (freno combinado) es obligatorio','Los frenos de disco en ambas ruedas','Solo el ABS en motos de más de 125cc','No hay obligación de ningún sistema específico'], c:0,
    exp:'Desde 2016, todos los nuevos ciclomotores y motos deben tener el sistema ABS (antibloqueo de frenos) o, en el caso de ciclomotores y motos de menos de 125cc, CBS (freno combinado) como mínimo.' },

  /* ── MECÁNICA DE LA MOTOCICLETA (20 preguntas) ─────────────────────── */

  { id:'a_m001', tema:'mecanica',
    p:'¿Qué función tiene la cadena de transmisión de una moto?',
    o:['Conectar el motor al sistema de frenos','Transmitir la fuerza del motor a la rueda trasera','Conectar el embrague al motor','Controlar la suspensión trasera'], c:1,
    exp:'La cadena de transmisión transmite la fuerza del motor (a través de la caja de cambios) a la rueda trasera. Debe mantenerse limpia, lubricada y con la tensión adecuada.' },

  { id:'a_m002', tema:'mecanica',
    p:'¿Con qué frecuencia debe lubricarse la cadena de transmisión?',
    o:['Nunca, es autolubricante','Cada 500-1.000 km o después de circular bajo la lluvia','Solo cuando se escuchen ruidos','Cada 10.000 km'], c:1,
    exp:'La cadena debe lubricarse cada 500-1.000 km de media, y siempre después de circular bajo la lluvia. Una cadena bien lubricada y con la tensión correcta dura más y mejora la transmisión.' },

  { id:'a_m003', tema:'mecanica',
    p:'¿Qué indica un neumático de moto con grietas en los flancos?',
    o:['Es normal por el uso','Indica un desgaste normal que no afecta a la seguridad','Indica envejecimiento o deterioro; el neumático debe cambiarse','Solo es un problema estético'], c:2,
    exp:'Las grietas en los flancos de un neumático indican envejecimiento y deterioro del compuesto de goma. Un neumático así puede fallar en la conducción y debe sustituirse inmediatamente.' },

  { id:'a_m004', tema:'mecanica',
    p:'¿Cómo afecta el desgaste asimétrico de los neumáticos de moto?',
    o:['No afecta mientras el dibujo sea visible','Provoca inestabilidad, especialmente en curvas','Solo afecta al consumo de combustible','Mejora la adherencia en un lado'], c:1,
    exp:'El desgaste asimétrico (más en un lado que en otro) desequilibra el comportamiento de la moto, especialmente al inclinarse en curvas. Puede provocar inestabilidad y debe corregirse.' },

  { id:'a_m005', tema:'mecanica',
    p:'¿Qué función cumple la suspensión de una motocicleta?',
    o:['Solo dar comodidad al motorista','Absorber las irregularidades del terreno y mantener el contacto de las ruedas con el asfalto','Regular la dirección','Controlar la velocidad de la moto'], c:1,
    exp:'La suspensión absorbe los impactos y desigualdades del terreno, manteniendo el contacto de las ruedas con el suelo, lo que es fundamental para el control y la seguridad de la moto.' },

  { id:'a_m006', tema:'mecanica',
    p:'¿Qué es el "guardabarros" de una moto?',
    o:['La pieza que cubre y protege las ruedas de la suciedad y el agua proyectada','El sistema de protección del motor','La cubierta del escape','El protector de la cadena'], c:0,
    exp:'El guardabarros cubre la parte superior de las ruedas para proteger al motorista y las partes de la moto de la suciedad y el agua proyectada por las ruedas durante la circulación.' },

  { id:'a_m007', tema:'mecanica',
    p:'¿Qué es la "caja de cambios" en una moto y cómo se maneja?',
    o:['Es automática en todas las motos','Se maneja con el pie izquierdo (pedal de cambio) y la mano izquierda (embrague)','Se maneja solo con las manos','Se maneja con el pie derecho'], c:1,
    exp:'La caja de cambios de una moto manual se maneja con el pedal de cambio (pie izquierdo) y el palancón del embrague (mano izquierda). El pie sube o baja las marchas mientras el embrague desacopla el motor.' },

  { id:'a_m008', tema:'mecanica',
    p:'¿Qué puede ocurrir si los frenos de una moto están desgastados y no se reemplazan?',
    o:['Solo reducen la comodidad de frenada','Pueden fallar o reducir drásticamente la eficacia de frenado, aumentando el riesgo de accidente','Solo afectan a la distancia de frenada en mojado','Son un problema estético'], c:1,
    exp:'Los frenos desgastados reducen significativamente la eficacia de frenado y pueden fallar en momentos críticos. Las pastillas, discos y líquido de frenos deben revisarse periódicamente.' },

  { id:'a_m009', tema:'mecanica',
    p:'¿Qué función tiene el filtro de aire de una moto?',
    o:['Filtrar el combustible','Filtrar el aire que entra al motor para eliminar partículas que podrían dañarlo','Enfriar el motor','Reducir el ruido del motor'], c:1,
    exp:'El filtro de aire retiene el polvo y partículas del aire antes de que entre al motor. Un filtro sucio o dañado puede afectar al rendimiento y causar daños internos.' },

  { id:'a_m010', tema:'mecanica',
    p:'¿Qué es el "sistema de refrigeración" de una moto?',
    o:['Solo el ventilador','El conjunto de componentes que mantiene la temperatura del motor dentro de los límites de funcionamiento (agua/aceite/aire)','Solo el radiador','El sistema de escape'], c:1,
    exp:'El sistema de refrigeración mantiene la temperatura del motor. Puede ser por aire (corriente de aire al circular), por líquido (refrigerante + radiador + bomba) o por aceite. Los motores modernos suelen ser mixtos.' },

  { id:'a_m011', tema:'mecanica',
    p:'¿Cuándo se nota que la cadena de una moto está muy tensa?',
    o:['La moto no puede girar a la izquierda','El motor hace más ruido','Se puede notar resistencia a la rodadura, y puede haber ruidos o vibraciones','La moto consume más gasolina'], c:2,
    exp:'Una cadena demasiado tensa aumenta la resistencia a la rodadura, puede forzar los rodamientos y producir ruidos o vibraciones. Debe revisarse la tensión periódicamente.' },

  { id:'a_m012', tema:'mecanica',
    p:'¿Qué deben hacer los neumáticos de moto nuevos antes de usarse a pleno rendimiento?',
    o:['Se usan directamente al máximo','Tienen un rodaje (normalmente 100-200 km) para eliminar el desmoldeante y asentar el compuesto','Solo deben inflarse correctamente','Se deben calentar con agua caliente'], c:1,
    exp:'Los neumáticos nuevos llevan un agente desmoldeante de fábrica que los hace resbaladizos. Se recomienda un período de rodaje suave (100-200 km) hasta eliminar ese recubrimiento.' },

  { id:'a_m013', tema:'mecanica',
    p:'¿Qué es la "batería" de una moto y cuándo suele fallar?',
    o:['El depósito de combustible','El componente eléctrico que almacena energía para arrancar el motor y alimentar el sistema eléctrico; falla especialmente en frío o por envejecimiento','El sistema de encendido','El carburador'], c:1,
    exp:'La batería de la moto almacena energía eléctrica. Puede fallar por envejecimiento (3-5 años de vida media), por bajas temperaturas, por la moto sin usar mucho tiempo, o por defecto del alternador.' },

  { id:'a_m014', tema:'mecanica',
    p:'¿Qué indica un aumento inusual en el consumo de combustible de la moto?',
    o:['Normal por el desgaste del tiempo','Puede indicar un problema en el sistema de inyección/carburación, la cadena, los frenos o el motor','Solo ocurre en invierno','Solo si hay una fuga visible'], c:1,
    exp:'Un aumento notable del consumo puede indicar problemas en el sistema de alimentación de combustible, frenos que rozan, cadena muy tensa, filtros sucios o problemas mecánicos más graves.' },

  { id:'a_m015', tema:'mecanica',
    p:'¿Qué es el "embrague" de una moto y para qué sirve?',
    o:['El freno manual','El dispositivo que acopla y desacopla el motor de la transmisión para cambiar de marcha o arrancar','El acelerador de la moto','El control del ABS'], c:1,
    exp:'El embrague desacopla momentáneamente el motor de la transmisión, permitiendo cambiar de marcha sin dañar la caja de cambios y arrancar suavemente desde parado.' },

  /* ── PRIMEROS AUXILIOS ESPECÍFICOS MOTORISTAS (15 preguntas) ────────── */

  { id:'a_au001', tema:'auxilios',
    p:'¿Cuáles son las lesiones más frecuentes en accidentes de moto?',
    o:['Lesiones en la cabeza y el cuello','Fracturas en las extremidades, lesiones de cabeza (si no hay casco) y lesiones torácicas','Solo contusiones leves','Lesiones en la espalda exclusivamente'], c:1,
    exp:'Los motoristas sufren principalmente: fracturas de extremidades (brazos, piernas), lesiones de cabeza y cuello (si no hay casco o está mal puesto), lesiones torácicas y abdominaleses, y lesiones de columna.' },

  { id:'a_au002', tema:'auxilios',
    p:'¿Debe retirarse el casco a un motorista accidentado inconsciente?',
    o:['Siempre, para comprobar el estado de la cabeza','Solo si hay hemorragia visible en la cabeza','Solo si es necesario para practicar la RCP o el casco impide respirar, y siempre entre dos personas','Nunca, bajo ninguna circunstancia'], c:2,
    exp:'El casco solo se retira cuando es imprescindible para la RCP o para desobstruir la vía aérea, siempre entre dos personas: una sujeta la cabeza y cuello mientras la otra retira el casco lentamente.' },

  { id:'a_au003', tema:'auxilios',
    p:'¿Cómo debe sujetarse la cabeza de un motorista accidentado al retirar el casco?',
    o:['De cualquier forma, lo importante es rapidez','Una persona sujeta firmemente la cabeza y el cuello en posición neutra mientras otra retira el casco lentamente','Solo una persona, desde el lateral del accidentado','Con el casco puesto, moviendo solo la mentonera'], c:1,
    exp:'Se necesitan dos personas: la primera sujeta firmemente la cabeza y el cuello del accidentado en posición neutra (sin rotación ni flexión), mientras la segunda retira el casco lentamente.' },

  { id:'a_au004', tema:'auxilios',
    p:'¿Qué tipo de lesión debe sospecharse siempre en un accidentado de moto?',
    o:['Fractura de muñeca','Lesión medular o cervical hasta que se descarte','Solo heridas cutáneas','Conmoción cerebral si hay casco puesto'], c:1,
    exp:'Ante todo accidente de moto, debe sospecharse lesión medular o cervical hasta que los servicios médicos lo descarten. Por eso es tan importante no mover al accidentado salvo peligro inminente.' },

  { id:'a_au005', tema:'auxilios',
    p:'¿Qué es más frecuente en un motorista que sale despedido: lesión de cabeza o lesión de extremidades?',
    o:['Lesión de cabeza si lleva casco','Lesión de extremidades (brazos y piernas), que son las partes más expuestas al impactar con el suelo','Son igual de frecuentes','Solo lesiones internas'], c:1,
    exp:'Las extremidades son las partes más expuestas en una caída de moto: se usan para frenar la caída y golpean primero el suelo. Las lesiones de extremidades son muy frecuentes en motoristas.' },

  { id:'a_au006', tema:'auxilios',
    p:'¿Cuándo se puede mover a un accidentado de moto?',
    o:['Nunca hay que moverle','Cuando el accidentado pide que le muevan','Solo cuando hay peligro inmediato e inminente (fuego, riesgo de explosión, tráfico que no puede pararse)','Siempre, para evitar daños por el frío del suelo'], c:2,
    exp:'Solo se mueve a un accidentado cuando hay un peligro inmediato que no puede evitarse de otra forma (fuego, riesgo de explosión, etc.). El movimiento sin precauciones puede agravar lesiones de columna.' },

  { id:'a_au007', tema:'auxilios',
    p:'¿Qué se hace con la ropa (chaqueta, pantalón de moto) de un accidentado?',
    o:['Se retira siempre para explorar las lesiones','No se retira salvo que sea imprescindible para controlar hemorragias o practicar la RCP; puede haberse contraído en torno a lesiones y su retirada puede agravar','Se corta siempre con tijeras','Se deja puesta siempre sin excepción'], c:1,
    exp:'La ropa de moto solo se retira si es imprescindible (hemorragia, RCP). Puede haberse contraído en torno a miembros o huesos fracturados, y su retirada incorrecta puede agravar las lesiones.' },

  { id:'a_au008', tema:'auxilios',
    p:'¿Qué señal de alarma indica posible lesión medular en un accidentado?',
    o:['Solo el dolor de espalda','Incapacidad para mover extremidades, hormigueo o pérdida de sensibilidad en piernas o brazos, o el accidentado dice no sentir las piernas','Solo si el accidentado está inconsciente','Un chichón en la cabeza'], c:1,
    exp:'Son señales de posible lesión medular: incapacidad para mover las extremidades, pérdida de sensibilidad, hormigueo en piernas o brazos, o que el accidentado diga que no siente las piernas.' },

  { id:'a_au009', tema:'auxilios',
    p:'¿Qué se hace si el motorista accidentado tiene hemorragia en una extremidad y no puede retirarse la ropa?',
    o:['Hacer un torniquete sobre la ropa inmediatamente','Aplicar presión directa sobre la ropa en la zona de la herida','Ignorar la hemorragia hasta que llegue la ambulancia','Mojar la ropa para ver la herida'], c:1,
    exp:'Si no puede retirarse la ropa, se aplica presión directa sobre la tela en la zona de sangrado. Si la hemorragia es masiva y en una extremidad que no puede controlarse de otra forma, se puede hacer torniquete sobre la ropa.' },

  { id:'a_au010', tema:'auxilios',
    p:'¿Cómo se sabe si un accidentado de moto tiene fractura de costillas?',
    o:['Por el sonido del crujido','Por el dolor al respirar (que puede llevar a respirar de forma superficial), dificultad respiratoria y deformidad visible','Por la incapacidad de mover los brazos','Por el color de la piel'], c:1,
    exp:'Las fracturas de costillas producen dolor intenso al respirar, lo que lleva al accidentado a respirar de forma superficial. Puede haber dificultad respiratoria y, a veces, deformidad visible en el tórax.' },

  { id:'a_au011', tema:'auxilios',
    p:'¿Qué es un "neumotórax" y por qué es urgente?',
    o:['Un tipo de herida en la pierna','La acumulación de aire en la cavidad pleural que colapsa el pulmón, dificultando la respiración','Una fractura costal complicada','Un derrame cerebral traumático'], c:1,
    exp:'El neumotórax ocurre cuando el aire entra en la cavidad pleural (entre el pulmón y la pared torácica), colapsando el pulmón. En traumatismos torácicos de moto es posible. Es una emergencia médica.' },

  { id:'a_au012', tema:'auxilios',
    p:'¿Qué se debe hacer para mantener caliente a un accidentado de moto en espera de la ambulancia?',
    o:['No es necesario si hace buen tiempo','Cubrirlo con una manta térmica o lo que haya disponible, sin moverle más de lo necesario','Darle bebidas calientes','Frotar las extremidades para activar la circulación'], c:1,
    exp:'El shock y la hemorragia pueden provocar hipotermia incluso en condiciones no frías. Se debe cubrir al accidentado (mantas isotérmicas del botiquín o cualquier manta) para conservar el calor, sin moverle.' },

  { id:'a_au013', tema:'auxilios',
    p:'¿En qué posición se debe mantener a un motorista accidentado con sospecha de lesión medular?',
    o:['Posición lateral de seguridad siempre','En decúbito supino (boca arriba) con la cabeza y el cuello alineados en posición neutra, sin moverlos','Sentado para facilitar la respiración','Boca abajo para evitar el ahogamiento'], c:1,
    exp:'Con sospecha de lesión medular, el accidentado se mantiene boca arriba con la cabeza y cuello en posición neutra (alineados). Solo se cambia a PLS si existe riesgo de ahogamiento con vómitos y no hay otra opción.' },

  { id:'a_au014', tema:'auxilios',
    p:'¿Qué información es necesario dar al 112 al comunicar un accidente de moto?',
    o:['Solo la dirección del accidente','Localización exacta, número de víctimas, tipo de accidente y estado aproximado de los heridos','Solo si hay heridos graves','El nombre y DNI del motorista'], c:1,
    exp:'Al llamar al 112, se debe proporcionar: localización exacta (km de carretera, calle, referencia próxima), número de víctimas, tipo de accidente (moto, coche, camión) y estado de los heridos (conscientes, inconscientes, hemorragias).' },

  { id:'a_au015', tema:'auxilios',
    p:'¿Cómo se actúa si un motorista accidentado está consciente pero atrapado bajo la moto?',
    o:['Intentar sacarle tirando de las piernas','Levantar la moto entre varios para liberarle, con cuidado de no moverle la columna, y mantenerle calmado hasta que llegue la ambulancia','Dejarle ahí hasta que llegue la ambulancia sin hacer nada','Tirar de los brazos del motorista para sacarlo'], c:1,
    exp:'Se puede intentar levantar o retirar la moto entre varios con cuidado, sin mover al motorista de forma brusca. Se mantiene al accidentado tranquilo y se espera a la ambulancia, controlando su estado.' }

]; // fin PREGUNTAS_DGT_A


/* ── PREGUNTAS EXCLUSIVAS CARNET AM (ciclomotores) ────────────────────── */
window.PREGUNTAS_DGT_AM = [

  { id:'am_001', tema:'tecnica',
    p:'¿Cuál es la cilindrada máxima de un ciclomotor de dos ruedas?',
    o:['25cc','50cc','75cc','100cc'], c:1,
    exp:'Los ciclomotores de dos ruedas tienen una cilindrada máxima de 50cc (o equivalente eléctrico de hasta 4 kW de potencia nominal continua) y velocidad máxima de 45 km/h.' },

  { id:'am_002', tema:'tecnica',
    p:'¿Qué permiso se necesita mínimo para conducir un ciclomotor en España?',
    o:['El permiso AM (desde 15 años)','El permiso A1','El permiso B','No se necesita permiso'], c:0,
    exp:'El permiso AM es el mínimo requerido para conducir ciclomotores. Se puede obtener a partir de los 15 años. Los titulares del permiso B también pueden conducir ciclomotores.' },

  { id:'am_003', tema:'normas',
    p:'¿Pueden circular los ciclomotores por autopistas?',
    o:['Sí, pero solo por el arcén','Sí, a la velocidad máxima de 45 km/h','No, los ciclomotores tienen prohibido circular por autopistas y autovías','Sí, si la velocidad del tráfico lo permite'], c:2,
    exp:'Los ciclomotores no pueden circular por autopistas, autovías ni variantes de población. Tampoco por vías expresas ni por calzadas que los señales prohíban específicamente.' },

  { id:'am_004', tema:'senales',
    p:'¿Qué velocidad máxima puede alcanzar un ciclomotor en vía interurbana?',
    o:['30 km/h','45 km/h','60 km/h','80 km/h'], c:1,
    exp:'Los ciclomotores tienen una velocidad máxima de construcción de 45 km/h, que es también su límite en vías interurbanas. En vías urbanas se rige por los límites de la vía.' },

  { id:'am_005', tema:'seguridad',
    p:'¿Es obligatorio el casco para el conductor de un ciclomotor?',
    o:['Solo si va a más de 30 km/h','Solo en carretera','Sí, siempre, en cualquier vía','Solo para menores de 16 años'], c:2,
    exp:'El uso del casco homologado es obligatorio para el conductor de un ciclomotor siempre y en cualquier tipo de vía, tanto urbana como interurbana.' },

  { id:'am_006', tema:'normas',
    p:'¿Cuándo puede un ciclomotor circular por el carril bici?',
    o:['Siempre','Nunca; los carriles bici son exclusivos para bicicletas','Solo si no hay bicicletas','Si la señal lo permite expresamente'], c:1,
    exp:'Los ciclomotores no pueden circular por carriles bici, que son exclusivos para bicicletas y vehículos de movilidad personal no motorizados.' },

  { id:'am_007', tema:'mecanica',
    p:'¿Cuál es la potencia máxima de un ciclomotor eléctrico para ser considerado como tal?',
    o:['1 kW','2 kW','4 kW de potencia nominal continua','10 kW'], c:2,
    exp:'Un vehículo eléctrico es considerado ciclomotor si su potencia nominal continua no supera los 4 kW y su velocidad máxima no supera los 45 km/h.' },

  { id:'am_008', tema:'normas',
    p:'¿Necesita pasar la ITV un ciclomotor?',
    o:['No, los ciclomotores están exentos','Sí, pero a partir de los 10 años','Sí, la primera ITV a los 3 años y luego cada 2 años','Sí, cada año desde el primer año'], c:2,
    exp:'Los ciclomotores pasan la primera ITV a los 3 años de matriculación y posteriormente cada 2 años.' },

  { id:'am_009', tema:'normas',
    p:'¿Con qué permiso puede una persona de 18 años conducir un ciclomotor si no tiene el AM?',
    o:['Con el permiso A1','Con el permiso B o superior','Con el permiso de moto antigua','No puede, es necesario el AM'], c:1,
    exp:'Los titulares del permiso B (y todos los permisos superiores) están habilitados para conducir ciclomotores sin necesidad del permiso AM.' },

  { id:'am_010', tema:'seguridad',
    p:'¿Puede un ciclomotor circular por zonas peatonales?',
    o:['Sí, siempre que vaya despacio','Sí, si la vía es suficientemente ancha','No, salvo que haya señal que lo autorice o para acceder a garajes en esa zona','Sí, los ciclomotores son asimilables a bicicletas'], c:2,
    exp:'Los ciclomotores no pueden circular por zonas peatonales salvo que haya una señal que lo autorice expresamente, o para acceder a un garaje ubicado en esa zona.' },

  { id:'am_011', tema:'normas',
    p:'¿Es necesario el seguro obligatorio para un ciclomotor?',
    o:['No, están exentos por su pequeño tamaño','Solo si circulan por vías interurbanas','Sí, el seguro obligatorio de responsabilidad civil es exigible para ciclomotores','Solo si tienen más de 5 años'], c:2,
    exp:'El seguro de responsabilidad civil (seguro obligatorio) es exigible para todos los vehículos a motor, incluidos los ciclomotores, independientemente de su tamaño o uso.' },

  { id:'am_012', tema:'tecnica',
    p:'¿Cuántos pasajeros puede transportar un ciclomotor de dos ruedas?',
    o:['Ninguno, nunca está permitido','Uno, si el ciclomotor está homologado para ello','Dos, en asiento trasero','Tantos como quepan en el asiento'], c:1,
    exp:'Un ciclomotor de dos ruedas puede transportar como máximo un pasajero, siempre que el vehículo esté homologado para ello (asiento trasero y reposapiés) y el pasajero lleve casco.' },

  { id:'am_013', tema:'senales',
    p:'¿Puede el conductor de un ciclomotor usar el teléfono móvil mientras conduce?',
    o:['Sí, si va despacio','No, está prohibido igual que para cualquier otro conductor','Solo si usa manos libres con auriculares','Sí, en zona urbana'], c:1,
    exp:'Está prohibido usar el teléfono móvil sujetándolo con la mano mientras se conduce un ciclomotor, igual que para cualquier otro conductor.' },

  { id:'am_014', tema:'normas',
    p:'¿Qué ocurre si un menor de 15 años conduce un ciclomotor?',
    o:['No tiene consecuencias, es un menor','Se multa a los padres o tutores por permitirlo','Se sanciona como conducción sin permiso, con responsabilidad en los padres o tutores','Solo se le retira el ciclomotor'], c:2,
    exp:'Conducir un ciclomotor sin tener el permiso AM (o permiso habilitante) es una infracción muy grave. La responsabilidad legal puede recaer en los padres o tutores del menor.' },

  { id:'am_015', tema:'mecanica',
    p:'¿Qué es un cuadriciclo ligero y con qué permiso se conduce?',
    o:['Un vehículo de cuatro ruedas de más de 400 kg, con permiso B','Un vehículo de cuatro ruedas de masa en vacío inferior a 350 kg y velocidad máxima de 45 km/h, que se conduce con permiso AM','Un quad de competición','Un kart con motor de 50cc'], c:1,
    exp:'El cuadriciclo ligero es un vehículo de 4 ruedas con masa en vacío inferior a 350 kg, velocidad máxima de 45 km/h y potencia máxima de 4 kW (o 6 kW en eléctrico). Se conduce con el permiso AM.' },

  { id:'am_016', tema:'seguridad',
    p:'¿Qué riesgo específico tiene el conductor de un ciclomotor que no lleva casco?',
    o:['Multa económica solamente','Además de la multa, en un accidente queda totalmente desprotegida la cabeza, aumentando el riesgo de muerte o lesión grave','Solo riesgo de multa elevada','El motor puede averiarse más'], c:1,
    exp:'La cabeza es la zona más vulnerable y la más expuesta. Sin casco, en cualquier caída o impacto, el conductor queda totalmente desprotegido, con altísimo riesgo de traumatismo craneoencefálico grave o fatal.' },

  { id:'am_017', tema:'normas',
    p:'¿Dónde deben circular los ciclomotores que van más lentos que el tráfico en una vía interurbana?',
    o:['En el centro del carril','Por el arcén cuando exista, si la vía no lo prohíbe','Por el carril izquierdo','Por la acera si la vía es peligrosa'], c:1,
    exp:'Los ciclomotores que circulan más lentos que el flujo normal de tráfico deben utilizar el arcén de la vía siempre que exista y las condiciones lo permitan, para no interferir con el tráfico.' },

  { id:'am_018', tema:'tecnica',
    p:'¿Puede un ciclomotor remolcar un remolque?',
    o:['Sí, cualquier tipo de remolque','Sí, solo remolques de menos de 100 kg','No, los ciclomotores no pueden remolcar remolques','Solo puede remolcar si el remolque es del mismo fabricante'], c:2,
    exp:'Los ciclomotores no pueden remolcar remolques o semirremolques. Solo los vehículos con la correspondiente homologación y permiso de conducción adecuado pueden hacerlo.' },

  { id:'am_019', tema:'normas',
    p:'¿Necesita matrícula un ciclomotor en España?',
    o:['No, los ciclomotores están exentos de matrícula','Sí, todos los ciclomotores deben matricularse','Solo los de más de 25cc','Solo a partir de los 3 años de antigüedad'], c:1,
    exp:'Sí, todos los ciclomotores (y sus conductores) deben estar matriculados e identificados. La matrícula es obligatoria e imprescindible para circular legalmente.' },

  { id:'am_020', tema:'mecanica',
    p:'¿Con qué frecuencia debe revisarse el nivel de aceite de un ciclomotor de dos tiempos (si lo usa)?',
    o:['No usan aceite','El aceite se mezcla con la gasolina y hay que verificar el depósito de aceite antes de cada uso o según la autonomía del depósito','Solo en la ITV','Cada 10.000 km'], c:1,
    exp:'Los ciclomotores de dos tiempos utilizan aceite mezclado con la gasolina. El depósito de aceite debe revisarse frecuentemente (según la autonomía, puede necesitarse en cada repostaje). Los de cuatro tiempos tienen circuito de aceite separado.' }

]; // fin PREGUNTAS_DGT_AM
