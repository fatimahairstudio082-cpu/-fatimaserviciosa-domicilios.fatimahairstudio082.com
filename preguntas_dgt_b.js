/* ─────────────────────────────────────────────────────────────────────────
   PREGUNTAS_DGT_B — Banco de preguntas para el examen Carnet B (turismo)
   Basado en el pool oficial de la DGT España
   150 preguntas · 5 temas
   ───────────────────────────────────────────────────────────────────────── */

window.TEMAS_DGT_B = {
  senales:      'Señales de tráfico',
  normas:       'Normas de circulación',
  mecanica:     'Mecánica y seguridad vial',
  auxilios:     'Primeros auxilios',
  eficiencia:   'Conducción eficiente y medio ambiente'
};

window.PREGUNTAS_DGT_B = [

  /* ── SEÑALES DE TRÁFICO (35 preguntas) ─────────────────────────────── */

  { id:'b_s001', tema:'senales',
    p:'¿Qué forma tienen las señales de advertencia de peligro?',
    o:['Circular','Triangular con borde rojo','Cuadrada','Octogonal'], c:1,
    exp:'Las señales de advertencia o peligro son triangulares, con fondo blanco y borde rojo. Avisan al conductor de un peligro en la vía y no implican ninguna prohibición.' },

  { id:'b_s002', tema:'senales',
    p:'¿Qué forma tienen las señales de prohibición?',
    o:['Triangular con vértice hacia arriba','Circular con borde rojo','Cuadrada azul','Octogonal roja'], c:1,
    exp:'Las señales de prohibición son circulares con borde rojo. Prohíben una determinada maniobra o conducta a los usuarios de la vía.' },

  { id:'b_s003', tema:'senales',
    p:'¿Qué forma tienen las señales de obligación?',
    o:['Triangular','Circular azul','Cuadrada verde','Octogonal'], c:1,
    exp:'Las señales de obligación son circulares con fondo azul. Imponen una obligación al usuario de la vía, como seguir una dirección determinada.' },

  { id:'b_s004', tema:'senales',
    p:'¿Qué indica una señal octogonal de color rojo con letras blancas "STOP"?',
    o:['Reducción de velocidad obligatoria','Detención obligatoria y ceder el paso','Paso de peatones prioritario','Prohibición de entrada'], c:1,
    exp:'La señal STOP (R-2) obliga a detener completamente el vehículo antes de la línea de parada y ceder el paso a los vehículos que circulen por la vía a la que se accede.' },

  { id:'b_s005', tema:'senales',
    p:'¿Qué indica la señal de "Ceda el paso" (triángulo invertido con borde rojo)?',
    o:['Detención obligatoria','Ceder el paso pero sin detención obligatoria si no hay tráfico','Prohibición de adelantar','Zona de obras'], c:1,
    exp:'La señal "Ceda el paso" (R-1) obliga al conductor a ceder el paso a los vehículos que circulan por la vía a la que se accede, debiéndose detener si es necesario, pero sin obligación de parar si no hay tráfico.' },

  { id:'b_s006', tema:'senales',
    p:'¿Qué color tienen las señales de información general (servicios, autopistas, etc.)?',
    o:['Verde','Azul','Blanco','Amarillo'], c:1,
    exp:'Las señales de información tienen fondo azul, excepto las de autopistas y autovías (verde) y las de carreteras convencionales (blanco). Informan sobre servicios, distancias y orientación.' },

  { id:'b_s007', tema:'senales',
    p:'¿Qué indica una señal de tráfico cuadrada con fondo azul y flecha blanca?',
    o:['Prohibición de avanzar','Indicación de dirección obligatoria','Zona de estacionamiento','Señal informativa de servicio'], c:1,
    exp:'Las señales cuadradas azules con flechas blancas son señales de obligación que indican la dirección que deben seguir los vehículos: todo recto, girar a la derecha, etc.' },

  { id:'b_s008', tema:'senales',
    p:'¿Qué indica la señal circular azul con un "P" blanco?',
    o:['Prohibición de aparcar','Estacionamiento permitido','Paso de peatones','Zona de parking de pago'], c:1,
    exp:'La señal circular azul con "P" blanco indica que el estacionamiento está permitido en esa zona, pudiendo estar limitado a determinadas horas o tiempo máximo.' },

  { id:'b_s009', tema:'senales',
    p:'¿Qué indica la señal circular roja con una "P" tachada?',
    o:['Prohibición de parar y estacionar','Prohibición de estacionar','Fin de prohibición de estacionar','Estacionamiento de pago'], c:1,
    exp:'La señal R-307 (círculo rojo con "E" tachada) prohíbe estacionar. Diferente a la R-308 que prohíbe parar y estacionar (círculo rojo con "P" tachada).' },

  { id:'b_s010', tema:'senales',
    p:'Una señal de peligro triangular muestra una figura de niños corriendo. ¿Qué advierte?',
    o:['Zona escolar, posible presencia de niños','Parque infantil próximo','Zona de juegos peligrosa','Prohibición de paso de niños'], c:0,
    exp:'La señal de peligro "Paso de escolares" (P-21) advierte de la posible presencia de niños cruzando la calzada, generalmente cerca de colegios.' },

  { id:'b_s011', tema:'senales',
    p:'¿Qué significa una señal triangular con dibujo de curva hacia la derecha?',
    o:['Curva peligrosa a la derecha','Giro prohibido a la derecha','Paso a nivel','Desvío obligatorio a la derecha'], c:0,
    exp:'La señal P-13 indica curva peligrosa hacia la derecha. El conductor debe reducir la velocidad y circular con precaución.' },

  { id:'b_s012', tema:'senales',
    p:'¿Qué indica la señal de "Paso a nivel con barreras"?',
    o:['Precaución: paso de trenes con barrera','Zona de descarga ferroviaria','Prohibición de paso de vehículos pesados','Desvío por obras ferroviarias'], c:0,
    exp:'La señal P-8 "Paso a nivel con barreras" advierte de la proximidad de un cruce con vía férrea que dispone de barreras o semibarreras automáticas.' },

  { id:'b_s013', tema:'senales',
    p:'¿Qué indica una señal circular con fondo blanco y número 50 dentro de un círculo rojo?',
    o:['Velocidad mínima de 50 km/h','Velocidad máxima de 50 km/h','Velocidad recomendada de 50 km/h','Fin de limitación de velocidad a 50 km/h'], c:1,
    exp:'La señal R-301 limita la velocidad máxima al número indicado. En este caso, 50 km/h, que es la velocidad máxima en zona urbana por defecto.' },

  { id:'b_s014', tema:'senales',
    p:'¿Qué indica una señal circular azul con número 50 en blanco?',
    o:['Velocidad máxima de 50 km/h','Velocidad mínima de 50 km/h','Velocidad recomendada','Fin de zona de 50 km/h'], c:1,
    exp:'La señal circular azul con número blanco es una señal de obligación que indica la velocidad mínima que deben llevar los vehículos.' },

  { id:'b_s015', tema:'senales',
    p:'¿Qué indica una señal circular roja con una "X" o líneas cruzadas?',
    o:['Prohibición de cruce','Prohibición de entrada (dirección prohibida)','Cruce peligroso','Paso a nivel sin barreras'], c:1,
    exp:'La señal R-1 (círculo rojo con línea horizontal blanca) indica "Entrada prohibida". Está colocada al principio de una vía de sentido único en sentido contrario al de circulación.' },

  { id:'b_s016', tema:'senales',
    p:'¿Qué indica una señal rectangular verde con flechas y nombres de ciudades?',
    o:['Zona comercial de la ciudad indicada','Señal de confirmación de autopista o autovía','Señal de peligro en las ciudades indicadas','Desvío recomendado'], c:1,
    exp:'Las señales rectangulares verdes son señales de orientación en autopistas y autovías, indicando destinos, distancias y salidas.' },

  { id:'b_s017', tema:'senales',
    p:'¿Qué indica la señal de tráfico conocida como "radar" o "control de velocidad por radar"?',
    o:['Presencia de radares de velocidad en tramo','Zona de control policial','Vigilancia de velocidad en ciertos horarios','Fin de zona de radar'], c:0,
    exp:'La señal S-7 "Control de velocidad por radar" indica que en ese tramo pueden realizarse controles de velocidad mediante aparatos de radar.' },

  { id:'b_s018', tema:'senales',
    p:'¿Qué prelación tienen las señales de tráfico?',
    o:['Marcas viales > señales verticales > semáforos > agentes','Agentes > semáforos > señales verticales > marcas viales','Semáforos > agentes > señales verticales > marcas viales','Señales verticales > semáforos > agentes > marcas viales'], c:1,
    exp:'El orden de prelación (prioridad) es: 1º Agentes de circulación, 2º Semáforos, 3º Señales verticales de circulación, 4º Marcas viales. Las instrucciones del agente prevalecen siempre.' },

  { id:'b_s019', tema:'senales',
    p:'¿Qué indica la señal de "Fin de todas las prohibiciones y restricciones"?',
    o:['Fin de zona urbana','Fin de todas las restricciones y prohibiciones impuestas a la circulación','Inicio de autopista','Fin de zona de obras'], c:1,
    exp:'La señal R-500 "Fin de todas las prohibiciones" cancela todas las restricciones y prohibiciones anteriores, como límites de velocidad, adelantamiento prohibido, etc.' },

  { id:'b_s020', tema:'senales',
    p:'¿Qué indica la señal triangular con dibujo de dos coches (uno negro, uno rojo)?',
    o:['Prohibición de adelantar','Peligro de adelantamiento prohibido','Cruce peligroso con preferencia','Peligro de colisión frontal'], c:2,
    exp:'La señal P-26 "Semáforos" advierte de la proximidad de un semáforo. Pero la señal con dos coches (R-303) es la prohibición de adelantar. La triangular con colisión frontal advierte del peligro.' },

  { id:'b_s021', tema:'senales',
    p:'¿Qué debe hacer un conductor al encontrar un semáforo en ámbar (amarillo)?',
    o:['Acelerar para pasar antes de que se ponga en rojo','Detenerse si puede hacerlo con seguridad','Continuar a velocidad reducida','Es opcional: puede parar o continuar'], c:1,
    exp:'La luz ámbar del semáforo indica que la luz verde va a extinguirse. El conductor debe detenerse si puede hacerlo con seguridad; si no puede parar de forma segura, puede continuar.' },

  { id:'b_s022', tema:'senales',
    p:'¿Qué indica una marca vial de línea continua en el eje de la calzada?',
    o:['Puede cruzarse para adelantar si hay visibilidad suficiente','Prohibición absoluta de cruzarla o invadirla para adelantar','Solo puede cruzarse en curvas','Se puede cruzar de noche'], c:1,
    exp:'La línea continua en el eje no puede ser franqueada ni invadida. Está en lugares de poca visibilidad, curvas o aproximaciones a cruces donde adelantar sería peligroso.' },

  { id:'b_s023', tema:'senales',
    p:'¿Qué indica una línea discontinua en el eje de la calzada?',
    o:['Prohibición de adelantar siempre','Separación de sentidos, puede cruzarse para adelantar si hay visibilidad y seguridad','Carril reservado para vehículos de emergencia','Zona de frenado de emergencia'], c:1,
    exp:'La línea discontinua en el eje separa los sentidos de circulación pero puede franquearse para adelantar cuando la visibilidad y la situación del tráfico lo permiten.' },

  { id:'b_s024', tema:'senales',
    p:'¿Qué indica una señal circular con borde rojo y número 100 dentro?',
    o:['Velocidad mínima de 100 km/h','Velocidad máxima de 100 km/h','Velocidad recomendada de 100 km/h','Fin de la limitación a 100 km/h'], c:1,
    exp:'La señal R-301 con el número 100 limita la velocidad máxima a 100 km/h. En autopistas y autovías la velocidad máxima general es 120 km/h para turismos.' },

  { id:'b_s025', tema:'senales',
    p:'¿Qué indica una señal rectangular azul con un teléfono?',
    o:['Señal de prohibición de usar el teléfono','Señal informativa de cabina telefónica próxima','Señal de punto de asistencia en carretera','Señal de zona wifi'], c:1,
    exp:'Las señales rectangulares azules con pictogramas son señales de servicios. El pictograma de teléfono indica la proximidad de una cabina o teléfono de emergencia en carretera.' },

  { id:'b_s026', tema:'senales',
    p:'¿Qué indica la flecha amarilla pintada en el suelo en un carril?',
    o:['Carril de alta velocidad','Carril reversible','Reducción de carril, es necesario incorporarse al carril señalizado','Carril para vehículos de emergencia'], c:1,
    exp:'Las flechas amarillas en el suelo indican carriles reversibles que cambian su dirección según la hora del día. En otros contextos, indican desvíos provisionales por obras.' },

  { id:'b_s027', tema:'senales',
    p:'¿Qué significa un semáforo con luz verde en forma de flecha hacia la derecha?',
    o:['Puede girar a la derecha solo si no hay peatones','Puede girar a la derecha sin restricciones en ese momento','Giro obligatorio a la derecha','Prioridad de paso para los peatones que cruzan a la derecha'], c:1,
    exp:'Un semáforo con flecha verde indica que en ese momento está permitido realizar el movimiento indicado por la flecha (en este caso, girar a la derecha).' },

  { id:'b_s028', tema:'senales',
    p:'¿Qué indica una señal rectangular con fondo blanco, borde rojo y la letra "V" en su interior?',
    o:['Velocidad variable','Vehículo de emergencia autorizado','Paso de vehículos pesados','Zona con velocidad vigilada'], c:0,
    exp:'La señal "V" hace referencia a la señalización de vehículos especiales. La señal de velocidad variable (paneles variables) puede mostrar distintos límites según condiciones del tráfico.' },

  { id:'b_s029', tema:'senales',
    p:'¿Qué indica una señal circular roja con línea transversal blanca horizontal?',
    o:['Prohibición de parar','Entrada prohibida (dirección prohibida)','Prohibición de circular a pie','Fin de calzada'], c:1,
    exp:'La señal R-101 "Entrada prohibida" se coloca al principio de vías de sentido único en la dirección contraria a la de circulación. Nadie puede entrar por donde está colocada esta señal.' },

  { id:'b_s030', tema:'senales',
    p:'¿Qué indica la señal triangular con dibujo de semáforo?',
    o:['Semáforo próximo en funcionamiento','Semáforo averiado','Zona con semáforos inteligentes','Semáforo con radar'], c:0,
    exp:'La señal de peligro P-26 advierte de la proximidad de un semáforo que puede estar situado de forma poco visible y el conductor debe estar preparado para detenerse.' },

  { id:'b_s031', tema:'senales',
    p:'¿Qué indica la señal "Zona 30" (rectángulo con "ZONA 30")?',
    o:['Velocidad máxima de 30 km/h en esa zona','Zona con 30 semáforos','Velocidad mínima de 30 km/h','Zona con 30 plazas de aparcamiento'], c:0,
    exp:'La zona 30 establece una velocidad máxima de 30 km/h en todo el ámbito señalizado. En 2021, esta velocidad se extendió a todas las vías urbanas con un solo carril por sentido.' },

  { id:'b_s032', tema:'senales',
    p:'¿Cuándo se puede adelantar sobre una línea discontinua?',
    o:['Siempre que haya visibilidad suficiente y no exista riesgo','Solo de día','Solo en carretera, nunca en ciudad','Solo con la señal de adelantamiento permitido'], c:0,
    exp:'Se puede adelantar sobre una línea discontinua cuando hay visibilidad y espacio suficientes, no hay tráfico contrario que pueda suponer riesgo, y respetando la señalización.' },

  { id:'b_s033', tema:'senales',
    p:'¿Qué indica la señal triangular con dibujo de trabajadores y palas?',
    o:['Obras en la calzada','Zona de construcción de edificios','Obras en arcén','Peligro de desprendimientos'], c:0,
    exp:'La señal P-17 "Obras" advierte al conductor de trabajos en la vía o en sus proximidades que pueden implicar la presencia de trabajadores, maquinaria y reducción de la calzada.' },

  { id:'b_s034', tema:'senales',
    p:'¿Qué indica la señal triangular con dibujo de animal (ciervo o similar)?',
    o:['Caza prohibida','Paso de animales salvajes o domésticos','Zona de safari','Reserva natural próxima'], c:1,
    exp:'Las señales de peligro con animales (P-23 para animales domésticos, P-24 para animales salvajes) advierten del posible cruce de animales por la calzada en esa zona.' },

  { id:'b_s035', tema:'senales',
    p:'¿Qué indica la señal rectangular azul con dibujo de cama?',
    o:['Hotel próximo','Zona de descanso o área de servicio con alojamiento','Zona de acampada','Hospital próximo'], c:0,
    exp:'La señal informativa rectangular azul con pictograma de cama indica la proximidad de un hotel u hospedaje. Es una señal de servicio en carretera.' },

  /* ── NORMAS DE CIRCULACIÓN (50 preguntas) ─────────────────────────── */

  { id:'b_n001', tema:'normas',
    p:'¿Cuál es la velocidad máxima en autopistas y autovías para turismos?',
    o:['100 km/h','110 km/h','120 km/h','130 km/h'], c:2,
    exp:'La velocidad máxima general en autopistas y autovías para turismos es de 120 km/h. En condiciones meteorológicas adversas esta velocidad se reduce.' },

  { id:'b_n002', tema:'normas',
    p:'¿Cuál es la velocidad máxima en vías urbanas con un carril por sentido?',
    o:['20 km/h','30 km/h','40 km/h','50 km/h'], c:1,
    exp:'Desde mayo de 2021, la velocidad máxima en vías urbanas con un carril por sentido es de 30 km/h. En vías con dos o más carriles por sentido, el límite es de 50 km/h.' },

  { id:'b_n003', tema:'normas',
    p:'¿Cuál es la velocidad máxima en carretera convencional (sin separación de carriles) para turismos?',
    o:['80 km/h','90 km/h','100 km/h','110 km/h'], c:1,
    exp:'La velocidad máxima en carretera convencional (con sentidos contrarios no separados) para turismos es de 90 km/h. Para camiones y autobuses es menor.' },

  { id:'b_n004', tema:'normas',
    p:'¿Cuándo es obligatorio llevar puesta el cinturón de seguridad?',
    o:['Solo en autopistas y autovías','Solo en carretera, no en ciudad','Siempre, en ciudad y carretera','Solo si va a más de 50 km/h'], c:2,
    exp:'El cinturón de seguridad es obligatorio siempre, para todos los ocupantes del vehículo, tanto en vías urbanas como interurbanas, delante y detrás.' },

  { id:'b_n005', tema:'normas',
    p:'¿Cuándo deben usarse las luces de posición o de cruce (cortas)?',
    o:['Solo de noche','De noche y en túneles','Siempre que la visibilidad sea reducida, de noche, en túneles y en condiciones adversas','Solo cuando llueve'], c:2,
    exp:'Las luces de cruce son obligatorias de noche, en condiciones de baja visibilidad, en túneles, en caso de lluvia, niebla, nieve o humo, y durante el día en autopistas y autovías.' },

  { id:'b_n006', tema:'normas',
    p:'¿Cuándo está prohibido adelantar?',
    o:['Cuando hay línea discontinua','Cuando hay línea continua en el eje, en curvas sin visibilidad, en intersecciones y pasos a nivel','Solo en ciudad','Solo en autopista'], c:1,
    exp:'Está prohibido adelantar cuando hay línea continua en el eje, al aproximarse a la cima de una colina o en curva sin visibilidad, en intersecciones, pasos a nivel, pasos de peatones y similares.' },

  { id:'b_n007', tema:'normas',
    p:'¿Qué es la tasa de alcoholemia máxima permitida para conductores con carnet de más de 2 años?',
    o:['0,2 g/l en sangre (0,1 mg/l en aire)','0,3 g/l en sangre (0,15 mg/l en aire)','0,5 g/l en sangre (0,25 mg/l en aire)','0,8 g/l en sangre (0,4 mg/l en aire)'], c:2,
    exp:'La tasa máxima de alcoholemia para conductores en general es de 0,5 g/l en sangre (0,25 mg/l en aire espirado). Para conductores noveles (menos de 2 años) y conductores profesionales, el límite es 0,3 g/l (0,15 mg/l).' },

  { id:'b_n008', tema:'normas',
    p:'¿Cuál es la tasa de alcoholemia para conductores noveles (menos de 2 años de carnet)?',
    o:['0,1 g/l en sangre','0,3 g/l en sangre (0,15 mg/l en aire)','0,5 g/l en sangre','0,8 g/l en sangre'], c:1,
    exp:'Los conductores noveles (menos de 2 años de antigüedad del permiso) tienen un límite más estricto: 0,3 g/l en sangre o 0,15 mg/l en aire espirado.' },

  { id:'b_n009', tema:'normas',
    p:'¿Cuántos puntos tiene el carnet de conducir en España al obtenerse por primera vez?',
    o:['6 puntos','8 puntos','12 puntos','15 puntos'], c:1,
    exp:'El permiso de conducción por puntos se inicia con 8 puntos para los conductores noveles. Una vez superado el período de 2 años sin sanciones, se amplía a 12 puntos.' },

  { id:'b_n010', tema:'normas',
    p:'¿Cuántos puntos tiene un conductor consolidado (más de 2 años de carnet)?',
    o:['8 puntos','10 puntos','12 puntos','15 puntos'], c:2,
    exp:'Los conductores con el permiso de conducción ordinario consolidado (más de 2 años sin sanciones graves) tienen 12 puntos. Se pueden recuperar hasta 15 si se realizan cursos.' },

  { id:'b_n011', tema:'normas',
    p:'¿Qué se debe hacer al incorporarse a una autopista desde la vía de aceleración?',
    o:['Ceder el paso a los vehículos que circulan por la autopista','Tener preferencia sobre los que circulan por la autopista','Incorporarse a 60 km/h','Utilizar el carril izquierdo'], c:0,
    exp:'Al incorporarse a una autopista desde un carril de aceleración, el conductor debe ceder el paso a los vehículos que ya circulan por ella, sin entrar bruscamente en el tráfico.' },

  { id:'b_n012', tema:'normas',
    p:'¿Cuándo se pueden usar las luces de emergencia (intermitentes a la vez)?',
    o:['Cuando el coche está aparcado en doble fila','Cuando el vehículo es un peligro para otros por avería, accidente o maniobra peligrosa','Para avisar de atascos','Solo de noche'], c:1,
    exp:'Las luces de emergencia deben usarse cuando el vehículo constituye un peligro para los demás: avería, accidente, parada de emergencia, o cuando se circula muy lentamente de forma inesperada.' },

  { id:'b_n013', tema:'normas',
    p:'¿A qué distancia mínima deben colocarse los triángulos de emergencia?',
    o:['15 metros','30 metros','50 metros','100 metros'], c:3,
    exp:'Los triángulos de emergencia deben colocarse a 50 metros del vehículo averiado, uno delante y otro detrás, visibles desde 100 metros en cada sentido. Deben ser visibles desde 100 m.' },

  { id:'b_n014', tema:'normas',
    p:'¿Qué vehículos tienen preferencia de paso en una vía urbana?',
    o:['Los vehículos de mayor tamaño','Los vehículos de emergencia con sirena y luces activadas','Los autobuses','Los turismos particulares'], c:1,
    exp:'Los vehículos prioritarios (policía, bomberos, ambulancias) con señales acústicas y luminosas en servicio de urgencia tienen prioridad de paso. Los demás conductores deben facilitar su paso.' },

  { id:'b_n015', tema:'normas',
    p:'¿Dónde debe circular un vehículo en una autopista en condiciones normales?',
    o:['Por el carril izquierdo','Por el carril central','Por el carril derecho','Por cualquier carril'], c:2,
    exp:'En condiciones normales, los vehículos deben circular por el carril derecho. Los carriles de la izquierda solo se usan para adelantar. Tras adelantar, se debe volver al carril derecho.' },

  { id:'b_n016', tema:'normas',
    p:'¿Está permitido circular marcha atrás en una autopista?',
    o:['Sí, con las luces de emergencia activadas','Sí, si es para corregir un error','No, nunca está permitido','Sí, si no hay tráfico'], c:2,
    exp:'Está terminantemente prohibido circular marcha atrás en autopistas y autovías, así como realizar cambios de sentido en la calzada principal.' },

  { id:'b_n017', tema:'normas',
    p:'¿Qué debe hacer un conductor que circula por una vía urbana y ve a un peatón esperando en un paso de peatones?',
    o:['Circular a velocidad reducida','Ceder el paso al peatón','Tocar el claxon para avisar al peatón','Acelerar para cruzar antes'], c:1,
    exp:'El conductor debe ceder el paso a los peatones que estén en el paso de peatones o que vayan a cruzarlo. El peatón tiene prioridad absoluta en los pasos señalizados.' },

  { id:'b_n018', tema:'normas',
    p:'¿A qué distancia mínima de un paso de peatones se puede aparcar?',
    o:['3 metros','5 metros','8 metros','10 metros'], c:1,
    exp:'Está prohibido estacionar a menos de 5 metros de los pasos de peatones.' },

  { id:'b_n019', tema:'normas',
    p:'¿En qué carril debe circular para girar a la derecha en una intersección?',
    o:['En el carril más a la izquierda','En cualquier carril','En el carril más a la derecha','En el carril central'], c:2,
    exp:'Para girar a la derecha, el conductor debe colocarse previamente en el carril más a la derecha de los disponibles en su sentido de circulación.' },

  { id:'b_n020', tema:'normas',
    p:'¿Cuándo debe llevar el conductor el chaleco reflectante?',
    o:['Solo cuando hay accidente con heridos','Cuando salga a la vía en caso de avería o accidente','Solo en autopistas','Solo de noche'], c:1,
    exp:'El chaleco reflectante debe ponerse antes de salir del vehículo y situarse en la vía o arcén en caso de avería, accidente o cualquier otra emergencia, independientemente del horario.' },

  { id:'b_n021', tema:'normas',
    p:'¿Qué debe hacer el conductor cuando un autobús escolar está parado con las luces intermitentes encendidas?',
    o:['Continuar a velocidad reducida','Adelantar por la izquierda','Detenerse hasta que el autobús reanude la marcha','Tocar el claxon para apresurar el embarque'], c:2,
    exp:'Cuando un autobús escolar tiene las luces intermitentes encendidas y está recogiendo o dejando niños, el conductor detrás debe detenerse y esperar.' },

  { id:'b_n022', tema:'normas',
    p:'¿Con qué frecuencia debe pasar la ITV un turismo de menos de 4 años?',
    o:['Cada año','Cada 2 años','Cada 3 años','Cada 4 años'], c:3,
    exp:'Los turismos de menos de 4 años están exentos de ITV (hasta los primeros 4 años). Entre 4 y 10 años, pasan ITV cada 2 años. A partir de 10 años, anualmente.' },

  { id:'b_n023', tema:'normas',
    p:'¿Está prohibido usar el teléfono móvil mientras se conduce?',
    o:['No, si se usa manos libres','Sí, absolutamente en todos los casos','Sí, excepto con manos libres sin auriculares','Solo está prohibido si se tiene el teléfono en la mano'], c:2,
    exp:'Está prohibido usar el teléfono móvil sujetándolo con la mano. El uso de manos libres está permitido siempre que no se lleven auriculares o cascos que impidan la audición del entorno.' },

  { id:'b_n024', tema:'normas',
    p:'¿En qué lado del vehículo deben bajar los pasajeros en zona urbana?',
    o:['Por el lado del conductor (izquierda)','Por el lado del arcén o acera (derecha)','Por cualquier lado si la vía está libre','Por el lado que indique el conductor'], c:1,
    exp:'Los pasajeros deben apearse por el lado de la acera o arcén (derecha en España), nunca por el lado de la calzada, para evitar poner en peligro a otros vehículos.' },

  { id:'b_n025', tema:'normas',
    p:'¿Qué distancia de seguridad debe mantenerse respecto al vehículo de delante?',
    o:['Al menos 2 segundos de tiempo de reacción','Al menos 5 metros','La distancia necesaria para detenerse en condiciones normales','Al menos 50 metros siempre'], c:2,
    exp:'Debe mantenerse una distancia de seguridad suficiente para detenerse en caso de frenada brusca del vehículo precedente, sin colisionar. La regla de los 2 segundos es una referencia práctica.' },

  { id:'b_n026', tema:'normas',
    p:'¿Cuándo está permitido circular con las luces de carretera (largas)?',
    o:['Solo en autopistas','En cualquier vía de noche','En vías interurbanas de noche cuando no deslumbran a otros usuarios','De noche en ciudad'], c:2,
    exp:'Las luces de carretera (largas) se usan de noche en vías interurbanas cuando no hay riesgo de deslumbrar a otros conductores. Deben cambiarse a cruce al cruzarse con otro vehículo.' },

  { id:'b_n027', tema:'normas',
    p:'¿A qué velocidad máxima pueden circular los ciclistas por calzadas urbanas?',
    o:['10 km/h','20 km/h','30 km/h','50 km/h'], c:1,
    exp:'Los ciclistas pueden circular por las calzadas y deben respetar los límites de velocidad de la vía. En zonas peatonales con permiso de circulación ciclista, la velocidad máxima es de 10 km/h.' },

  { id:'b_n028', tema:'normas',
    p:'¿Cuándo tiene preferencia un vehículo que sale de una vía secundaria a una principal?',
    o:['Nunca, siempre cede el paso','Siempre, si va a la derecha','Solo si circula más rápido','Siempre que haya señal de STOP o ceda el paso en la vía principal'], c:0,
    exp:'El vehículo que sale de una vía secundaria a una principal nunca tiene preferencia; debe ceder el paso a todos los que circulan por la vía principal, con o sin señal.' },

  { id:'b_n029', tema:'normas',
    p:'¿Qué es la "conducción temeraria"?',
    o:['Conducir por encima de 130 km/h','Conducir con manifiesto desprecio por la vida ajena, poniendo en peligro la vía','Conducir sin carnet','Conducir sin cinturón'], c:1,
    exp:'La conducción temeraria se define como conducir con manifiesto desprecio por la vida de los demás, poniendo en concreto peligro la vida o integridad de las personas. Es un delito penal.' },

  { id:'b_n030', tema:'normas',
    p:'¿Quién tiene preferencia en una rotonda (glorieta)?',
    o:['El que viene a incorporarse a la rotonda','El que ya circula dentro de la rotonda','El vehículo que viene por la derecha','El vehículo más rápido'], c:1,
    exp:'En las rotondas, tienen preferencia los vehículos que ya circulan por el interior sobre los que quieren incorporarse. Hay que ceder el paso al entrar.' },

  { id:'b_n031', tema:'normas',
    p:'¿Cuántos metros antes de una maniobra debe indicarse la señal de cambio de dirección?',
    o:['Al comenzar la maniobra','Al menos 3 segundos antes','Al menos 30 metros antes en vía urbana','Lo antes posible, sin distancia mínima'], c:2,
    exp:'El intermitente debe activarse con suficiente antelación: al menos 30 metros antes en vías urbanas y más tiempo en vías interurbanas. Debe mantenerse durante la maniobra.' },

  { id:'b_n032', tema:'normas',
    p:'¿En qué posición deben estar los espejos retrovisores?',
    o:['Para ver las ruedas traseras del propio vehículo','Para que el conductor pueda ver la mayor parte posible de la vía que queda detrás','Orientados para ver los carriles laterales','No hay posición reglamentaria'], c:1,
    exp:'Los retrovisores deben estar regulados para que el conductor tenga la mayor visibilidad posible de la vía posterior. El retrovisor interior debe mostrar la luneta trasera.' },

  { id:'b_n033', tema:'normas',
    p:'¿Puede un vehículo circular con la carga sobresaliendo por detrás?',
    o:['No, nunca','Sí, hasta 1 metro con señalización obligatoria (panel V-20 y luz roja)','Sí, hasta 50 cm','Sí, hasta 2 metros sin restricciones'], c:1,
    exp:'La carga puede sobresalir hasta 1 metro por la parte trasera. En ese caso, debe señalizarse con el panel reflectante V-20 (tablero bicolor rojo y blanco) y, de noche, con luz roja.' },

  { id:'b_n034', tema:'normas',
    p:'¿Cuándo está permitido estacionar en doble fila?',
    o:['Cuando se trata de una parada breve para cargar/descargar','Nunca está permitido estacionar en doble fila','Solo en zonas de carga y descarga','Solo de noche'], c:1,
    exp:'Estacionar en doble fila está prohibido. La parada para carga/descarga de personas o mercancías puede tolerarse brevemente, pero el conductor debe permanecer al volante o en la proximidad.' },

  { id:'b_n035', tema:'normas',
    p:'¿Qué se entiende por "ceder el paso"?',
    o:['Reducir la velocidad','Detenerse completamente','Dejar pasar a los vehículos con preferencia sin interrumpir ni modificar el ritmo de su marcha','Tocar el claxon y esperar'], c:2,
    exp:'"Ceder el paso" implica dejar pasar a quienes tienen prioridad sin obligarles a modificar ni su trayectoria ni su velocidad. Si es necesario, el conductor que cede el paso debe detenerse.' },

  { id:'b_n036', tema:'normas',
    p:'¿Está prohibido circular en sentido contrario en una autopista?',
    o:['No, si no hay tráfico','Sí, y es un delito grave','No, en caso de emergencia','Sí, salvo en caso de accidente grave'], c:1,
    exp:'Circular en sentido contrario en una autopista o autovía es una infracción muy grave y puede constituir un delito contra la seguridad vial. Está absolutamente prohibido.' },

  { id:'b_n037', tema:'normas',
    p:'¿Qué obligación tiene el conductor al pasar junto a obras en la calzada?',
    o:['Aumentar la velocidad para dejar la zona libre','Reducir la velocidad y extremar la precaución','Usar el carril izquierdo siempre','Tocar el claxon para avisar a los trabajadores'], c:1,
    exp:'Al pasar junto a zonas de obras, el conductor debe reducir la velocidad y extremar la precaución, respetando la señalización provisional que indique itinerarios, velocidades y restricciones.' },

  { id:'b_n038', tema:'normas',
    p:'¿Cuándo tiene preferencia de paso un tranvía?',
    o:['Nunca, los tranvías ceden el paso como cualquier vehículo','Siempre sobre los vehículos de motor','Solo cuando va a mayor velocidad','Solo con señal específica de tranvía'], c:1,
    exp:'Los tranvías tienen preferencia de paso sobre los vehículos de motor, excepto en los casos en que lo indique expresamente la señalización o cuando vengan del sentido contrario.' },

  { id:'b_n039', tema:'normas',
    p:'¿Qué es el "punto ciego" de un vehículo?',
    o:['La zona de la carretera que no se puede ver de noche','La zona lateral que no se aprecia en los espejos retrovisores','El ángulo muerto al girar','La zona delante del capó que no se ve'], c:1,
    exp:'El punto ciego es el ángulo o zona lateral del vehículo que no es visible a través de los retrovisores. Hay que girar la cabeza para comprobarlo antes de cambiar de carril o adelantar.' },

  { id:'b_n040', tema:'normas',
    p:'¿Cuándo está permitido usar el claxon en zona urbana?',
    o:['Para avisar a peatones que cruzan','Para saludar a conocidos','Solo en caso de peligro inminente','Nunca en zona urbana'], c:2,
    exp:'En zona urbana, el uso del claxon está restringido a situaciones de peligro inminente. No está permitido usarlo para saludar, avisar a peatones o expresar molestia.' },

  { id:'b_n041', tema:'normas',
    p:'¿Qué debe hacer el conductor al aproximarse a un paso a nivel sin barreras?',
    o:['Continuar a velocidad normal','Detenerse siempre antes de cruzar','Reducir la velocidad y comprobar que no viene ningún tren antes de cruzar','Solo detenerse si hay señal de STOP'], c:2,
    exp:'Ante un paso a nivel sin barreras, el conductor debe reducir la velocidad, detener el vehículo si es necesario, comprobar que no se aproxima ningún tren y cruzar con precaución.' },

  { id:'b_n042', tema:'normas',
    p:'¿Qué color tienen las marcas viales que señalizan restricciones temporales (obras, etc.)?',
    o:['Blancas','Azules','Verdes','Amarillas'], c:3,
    exp:'Las marcas viales amarillas tienen carácter temporal y señalizan restricciones o modificaciones temporales del tráfico, como desvíos por obras. Prevalecen sobre las marcas blancas permanentes.' },

  { id:'b_n043', tema:'normas',
    p:'¿Qué distancia mínima debe haber entre un vehículo y un ciclista al adelantarlo?',
    o:['0,5 metros','1 metro','1,5 metros','2 metros'], c:2,
    exp:'Al adelantar a ciclistas, el vehículo debe dejar una distancia lateral de seguridad de al menos 1,5 metros entre el vehículo y el ciclista.' },

  { id:'b_n044', tema:'normas',
    p:'¿Qué tipo de luces se usan en caso de niebla densa?',
    o:['Las luces largas o de carretera','Las luces de posición','Las luces antiniebla delanteras y/o traseras','Las luces de emergencia'], c:2,
    exp:'En caso de niebla densa, lluvia intensa o nevada, deben usarse las luces antiniebla. Las luces largas están prohibidas porque reflejan en la niebla y reducen la visibilidad.' },

  { id:'b_n045', tema:'normas',
    p:'¿Cuándo es obligatorio el uso de cadenas en un vehículo?',
    o:['Siempre que nieve','Cuando la calzada está nevada o helada y así lo exija la señalización','Solo en autopistas en invierno','No son obligatorias, son opcionales'], c:1,
    exp:'Las cadenas o neumáticos de invierno son obligatorios cuando la calzada está cubierta de nieve o hielo y la señalización lo exige. Se colocan en las ruedas motrices.' },

  { id:'b_n046', tema:'normas',
    p:'¿Cuándo está permitido circular con un vehículo sin ITV en vigor?',
    o:['Nunca','Si el vehículo es nuevo, los primeros 5 años','Si la ITV caducó hace menos de 1 mes','Solo para ir a pasar la ITV'], c:0,
    exp:'No está permitido circular con la ITV caducada. Si el vehículo suspende la ITV o esta ha caducado, no puede circular. La sanción es una multa de 200€.' },

  { id:'b_n047', tema:'normas',
    p:'¿Qué se entiende por "vía de servicio" en una autopista?',
    o:['El carril de aceleración','La vía lateral paralela a la autopista para acceder a propiedades colindantes','El carril de emergencia','El carril bus'], c:1,
    exp:'La vía de servicio es una vía lateral que discurre paralela a la autopista y permite el acceso a las propiedades o localidades colindantes sin entrar en la autopista.' },

  { id:'b_n048', tema:'normas',
    p:'¿Cuándo se puede conducir en paralelo en dos carriles (caravana)?',
    o:['Nunca está permitido','Solo en autopistas de 3 carriles','No existe restricción para circular en caravana','La caravana de vehículos debe respetar las reglas de circulación normales'], c:3,
    exp:'Conducir en caravana es legal, pero todos los vehículos deben respetar las reglas de circulación: señales, distancia de seguridad, preferencias de paso, etc.' },

  { id:'b_n049', tema:'normas',
    p:'¿Cuál es el límite máximo de horas de conducción continua sin descanso?',
    o:['2 horas','2 horas y 30 minutos','3 horas','4 horas'], c:0,
    exp:'Para conductores particulares, la recomendación es hacer una pausa de al menos 15-20 minutos cada 2 horas. Para conductores profesionales, la normativa es más estricta (4,5 horas máx. continuas).' },

  { id:'b_n050', tema:'normas',
    p:'¿Qué significa que un vehículo lleve la señal "V-7" (vehículo de transporte escolar)?',
    o:['Está transportando niños en ese momento','Puede transportar escolares pero no necesariamente en ese momento','Es un vehículo de la flota escolar permanente','Está parado recogiendo niños'], c:0,
    exp:'La señal V-7 indica que el vehículo está realizando transporte escolar (activo). El vehículo debe respetar normativa especial de velocidad y paradas.' },

  /* ── MECÁNICA Y SEGURIDAD VIAL (30 preguntas) ──────────────────────── */

  { id:'b_m001', tema:'mecanica',
    p:'¿Qué tipo de neumáticos mejoran la conducción en condiciones de nieve o lluvia?',
    o:['Neumáticos de verano de alta prestación','Neumáticos de invierno o "all-season"','Neumáticos de moto adaptados','Neumáticos de karting'], c:1,
    exp:'Los neumáticos de invierno (M+S) tienen compuestos de goma y dibujos especiales para ofrecer mejor adherencia en frío, nieve y barro. Los "all-season" son una solución intermedia.' },

  { id:'b_m002', tema:'mecanica',
    p:'¿Qué indica el testigo rojo de aceite en el cuadro de instrumentos?',
    o:['Que hay demasiado aceite','Que la presión del aceite es baja o que el nivel es insuficiente','Que hay que cambiar el aceite','Que el aceite está muy caliente'], c:1,
    exp:'El testigo rojo de aceite indica presión de aceite insuficiente. Si se enciende durante la conducción, hay que detener el vehículo de forma segura lo antes posible y apagar el motor.' },

  { id:'b_m003', tema:'mecanica',
    p:'¿Qué función tiene el sistema ABS en un vehículo?',
    o:['Aumentar la aceleración','Evitar el bloqueo de ruedas durante el frenado, manteniendo la dirección','Reducir el consumo de combustible','Mejorar la estabilidad en curvas'], c:1,
    exp:'El ABS (Anti-Blocking System) evita que las ruedas se bloqueen durante una frenada de emergencia, permitiendo al conductor mantener el control de la dirección mientras frena.' },

  { id:'b_m004', tema:'mecanica',
    p:'¿Qué ocurre si se conduce con la presión de los neumáticos por debajo de la recomendada?',
    o:['Mejora el agarre','Reduce el consumo de combustible','Aumenta el desgaste y el riesgo de reventón, y empeora el manejo','Mejora la conducción en lluvia'], c:2,
    exp:'Los neumáticos con presión insuficiente se desgastan más en los bordes, aumentan el riesgo de reventón por sobrecalentamiento, incrementan el consumo y deterioran el manejo del vehículo.' },

  { id:'b_m005', tema:'mecanica',
    p:'¿Qué función tiene el líquido de frenos?',
    o:['Lubricar los discos de freno','Transmitir la fuerza de frenado desde el pedal hasta las ruedas','Refrigerar los frenos','Limpiar los frenos'], c:1,
    exp:'El líquido de frenos transmite la presión hidráulica desde el pedal del freno hasta las pinzas o cilindros de freno. Debe cambiarse periódicamente porque absorbe humedad y pierde eficacia.' },

  { id:'b_m006', tema:'mecanica',
    p:'¿Qué significa el símbolo del testigo de motor en el cuadro de mandos?',
    o:['El motor necesita aceite urgentemente','Hay un fallo en el sistema de motor o emisiones que requiere diagnóstico','El motor está sobrecalentado','El filtro de aire está sucio'], c:1,
    exp:'El testigo de motor (motor check) indica un fallo en el motor o en el sistema de control de emisiones. No siempre requiere parada inmediata, pero sí una visita al taller para diagnóstico.' },

  { id:'b_m007', tema:'mecanica',
    p:'¿Qué ocurre con la distancia de frenado cuando el suelo está mojado?',
    o:['Disminuye porque hay más adherencia','Permanece igual','Aumenta considerablemente','Solo varía en pendientes'], c:2,
    exp:'La distancia de frenado aumenta significativamente con el suelo mojado porque el agua reduce la fricción entre el neumático y el asfalto. Por eso los límites de velocidad se reducen con lluvia.' },

  { id:'b_m008', tema:'mecanica',
    p:'¿Qué es el "aquaplaning" o hidrodeslizamiento?',
    o:['Deslizamiento del vehículo sobre hielo','Pérdida de contacto del neumático con el asfalto por acumulación de agua entre la rueda y la calzada','Patinamiento en frenada','Pérdida de adherencia en curva'], c:1,
    exp:'El aquaplaning ocurre cuando hay suficiente agua en la calzada como para que el neumático no la evacúe y pierda contacto con el asfalto. El vehículo "flota" y pierde el control.' },

  { id:'b_m009', tema:'mecanica',
    p:'¿Qué se debe hacer cuando el vehículo empieza a patinar en una curva?',
    o:['Frenar a fondo','Acelerar para ganar estabilidad','Soltar el acelerador suavemente y girar el volante en la dirección del derrape','Gira bruscamente el volante en sentido contrario'], c:2,
    exp:'En caso de derrape o pérdida de adherencia, hay que soltar el acelerador suavemente y, si las ruedas traseras deslizan, girar el volante hacia el lado que va la parte trasera (en el mismo sentido del derrape).' },

  { id:'b_m010', tema:'mecanica',
    p:'¿Con qué frecuencia debe revisarse la presión de los neumáticos?',
    o:['Solo cuando parezcan bajos','Una vez al año','Al menos una vez al mes y antes de viajes largos','Cada 10.000 km'], c:2,
    exp:'Se recomienda revisar la presión de los neumáticos al menos una vez al mes y siempre antes de un viaje largo. Debe hacerse con los neumáticos fríos (no justo después de conducir).' },

  { id:'b_m011', tema:'mecanica',
    p:'¿Qué es el ESP o sistema de control de estabilidad?',
    o:['El sistema de frenos ABS mejorado','Un sistema que detecta y corrige situaciones de pérdida de control del vehículo','El control de crucero adaptativo','El sistema de frenada de emergencia'], c:1,
    exp:'El ESP (Electronic Stability Program) detecta cuándo el vehículo pierde el control y actúa automáticamente sobre los frenos de cada rueda para corregir la trayectoria y evitar derrapes.' },

  { id:'b_m012', tema:'mecanica',
    p:'¿Qué indica el testigo de temperatura del motor?',
    o:['Que el motor está frio y no hay que arrancar','Que el motor ha alcanzado su temperatura de funcionamiento normal','Que el motor está sobrecalentado (temperatura excesiva)','Que el agua del limpiaparabrisas está fría'], c:2,
    exp:'Cuando el testigo de temperatura se ilumina en rojo, el motor está sobrecalentado. Hay que detenerse en lugar seguro, apagar el motor y no abrir el tapón del radiador hasta que se enfríe.' },

  { id:'b_m013', tema:'mecanica',
    p:'¿Qué ventaja ofrecen las ruedas radiales frente a las diagonales?',
    o:['Son más baratas','Mejor adherencia, menor consumo y mayor durabilidad','Menor ruido','Son más fáciles de cambiar'], c:1,
    exp:'Los neumáticos radiales (los más comunes hoy) tienen mejor adherencia lateral, menor resistencia a la rodadura (menos consumo), mayor durabilidad y mejor comportamiento térmico.' },

  { id:'b_m014', tema:'mecanica',
    p:'¿Qué es la "convergencia" de los neumáticos delanteros?',
    o:['El ángulo de inclinación lateral de las ruedas','La orientación en plano horizontal de las ruedas delanteras respecto al eje del vehículo','La presión diferencial entre ruedas','La dureza del neumático'], c:1,
    exp:'La convergencia (o divergencia) es el ángulo que forman las ruedas delanteras respecto a la dirección de marcha del vehículo en el plano horizontal. Afecta al desgaste y a la estabilidad.' },

  { id:'b_m015', tema:'mecanica',
    p:'¿Cuándo debe cambiarse el aceite del motor?',
    o:['Cuando el testigo de aceite se ilumina','Según las recomendaciones del fabricante (km o tiempo)','Cada 50.000 km','Solo cuando el aceite está negro'], c:1,
    exp:'El aceite del motor debe cambiarse según las especificaciones del fabricante del vehículo, generalmente cada 10.000-30.000 km o cada 1-2 años, dependiendo del tipo de aceite y motor.' },

  { id:'b_m016', tema:'mecanica',
    p:'¿Qué función tiene el catalizador en el sistema de escape?',
    o:['Aumentar la potencia del motor','Reducir las emisiones contaminantes de los gases de escape','Reducir el ruido del escape','Aumentar la eficiencia del combustible'], c:1,
    exp:'El catalizador convierte los gases tóxicos del escape (HC, CO, NOx) en gases menos nocivos (CO2, agua y nitrógeno) mediante reacciones químicas, reduciendo las emisiones contaminantes.' },

  { id:'b_m017', tema:'mecanica',
    p:'¿Qué es la DGT-V16 y para qué sirve?',
    o:['Un tipo de carnet de conducir especial','La señal luminosa de emergencia que sustituye o complementa a los triángulos','Un tipo de señalización de obras','El permiso de circulación de vehículos pesados'], c:1,
    exp:'La V-16 es una luz de emergencia de uso portátil homologada. A partir de 2026 sustituirá progresivamente a los triángulos de emergencia. Funciona sin que el conductor tenga que salir del vehículo.' },

  { id:'b_m018', tema:'mecanica',
    p:'¿Qué indica el nivel mínimo de banda de rodadura legal para turismos en España?',
    o:['0,5 mm','1,6 mm','2 mm','3 mm'], c:1,
    exp:'El espesor mínimo legal de la banda de rodadura es de 1,6 mm para turismos. Por debajo de esta medida, el neumático no es apto para circular y debe cambiarse.' },

  { id:'b_m019', tema:'mecanica',
    p:'¿Qué ocurre con el consumo de combustible si se circula con aire acondicionado encendido?',
    o:['Disminuye el consumo','No afecta al consumo','Aumenta el consumo entre un 5% y un 20%','Solo afecta en ciudad'], c:2,
    exp:'El aire acondicionado supone una carga adicional para el motor y puede aumentar el consumo de combustible entre un 5% y un 20%, dependiendo del vehículo y las condiciones de uso.' },

  { id:'b_m020', tema:'mecanica',
    p:'¿Para qué sirve el líquido limpiaparabrisas?',
    o:['Solo para limpiar el parabrisas','Para limpiar el parabrisas y evitar que se congele en invierno','Para refrigerar el motor','Para el circuito de frenos'], c:1,
    exp:'El líquido limpiaparabrisas limpia el parabrisas y puede contener anticongelante para evitar que el depósito o los sistemas de limpiaparabrisas se congelen en temperaturas bajo cero.' },

  { id:'b_m021', tema:'mecanica',
    p:'¿Cuándo se deben encender las luces de niebla traseras?',
    o:['Siempre que llueva','Cuando la visibilidad sea inferior a 50 metros','Cuando la visibilidad sea inferior a 100 metros','Solo cuando hay niebla densa, no con lluvia'], c:1,
    exp:'Las luces de niebla traseras deben encenderse cuando la visibilidad es inferior a 50 metros (niebla densa, ventisca). No deben usarse con lluvia normal o ligera.' },

  { id:'b_m022', tema:'mecanica',
    p:'¿Qué función tiene el freno de mano (freno de estacionamiento)?',
    o:['Frenar el vehículo en emergencias','Mantener el vehículo inmovilizado cuando está aparcado','Aumentar la potencia de frenado','Sustituir al freno principal'], c:1,
    exp:'El freno de mano (o freno de estacionamiento) se usa para mantener el vehículo parado cuando está aparcado, especialmente en pendiente. No debe usarse como freno de emergencia a velocidad.' },

  { id:'b_m023', tema:'mecanica',
    p:'¿Qué tipo de combustible usan los vehículos diésel?',
    o:['Gasolina','Gasóleo (gasoil)','Gas natural','Etanol'], c:1,
    exp:'Los motores diésel utilizan gasóleo (gasoil), un combustible más pesado que la gasolina. Poner gasolina en un motor diésel o viceversa puede causar daños graves.' },

  { id:'b_m024', tema:'mecanica',
    p:'¿Qué es la caja de cambios automática?',
    o:['Una caja de cambios que cambia sola sin pedal de embrague','Una caja de cambios con más marchas','Una transmisión hidráulica exclusiva de camiones','Un sistema de control de tracción'], c:0,
    exp:'La caja de cambios automática gestiona el cambio de marchas sin intervención del conductor (no hay pedal de embrague). Lo hace de forma automática según la velocidad y las revoluciones del motor.' },

  { id:'b_m025', tema:'mecanica',
    p:'¿Qué ventajas tienen los vehículos eléctricos respecto a los de combustión?',
    o:['Mayor autonomía','Cero emisiones en la conducción, menor coste de mantenimiento y mayor silenciosidad','Mayor velocidad máxima','Menores costes de fabricación'], c:1,
    exp:'Los vehículos eléctricos no emiten CO2 ni otros contaminantes durante su uso, tienen menores costes de mantenimiento (sin aceite, sin embrague, menos piezas móviles) y son silenciosos.' },

  { id:'b_m026', tema:'mecanica',
    p:'¿Qué hace el sistema de frenada de emergencia autónoma (AEB)?',
    o:['Avisa cuando la distancia al coche de delante es poca','Frena automáticamente el vehículo si detecta un obstáculo inminente y el conductor no reacciona','Activa el freno de mano automáticamente al aparcar','Aplica más fuerza al freno cuando la velocidad es alta'], c:1,
    exp:'El AEB (Autonomous Emergency Braking) detecta obstáculos mediante sensores y puede aplicar el freno de forma autónoma si el conductor no reacciona a tiempo, reduciendo o evitando el impacto.' },

  { id:'b_m027', tema:'mecanica',
    p:'¿Cada cuántos kilómetros aproximados se debe cambiar la correa de distribución?',
    o:['Cada 30.000 km','Cada 60.000-90.000 km','Cada 150.000-200.000 km','No es necesario cambiarla'], c:1,
    exp:'La correa de distribución suele recomendarse cambiar entre 60.000 y 120.000 km, según el fabricante. Su rotura puede causar daños graves en el motor, por lo que es fundamental respetarlo.' },

  { id:'b_m028', tema:'mecanica',
    p:'¿Qué indica el testigo de batería en un vehículo de combustión?',
    o:['Que la batería está descargada y hay que cargarla','Que el alternador no está cargando la batería correctamente','Que la batería es demasiado antigua','Que el voltaje del sistema es demasiado alto'], c:1,
    exp:'El testigo de batería indica un fallo en el sistema de carga eléctrica del vehículo (normalmente el alternador). Si se ilumina durante la marcha, hay que acudir al taller pronto.' },

  { id:'b_m029', tema:'mecanica',
    p:'¿Qué son las luces LED en un vehículo?',
    o:['Un tipo de luz antiniebla','Tecnología de iluminación de mayor eficiencia y durabilidad','Luces de larga distancia especiales','Luces solo para vehículos de lujo'], c:1,
    exp:'Las luces LED (Light Emitting Diode) son más eficientes energéticamente, tienen mayor durabilidad y ofrecen mejor visibilidad que las bombillas convencionales halógenas.' },

  { id:'b_m030', tema:'mecanica',
    p:'¿Qué función cumple el turbocompresor en un motor?',
    o:['Mejorar el sistema de frenos','Aumentar la potencia del motor aprovechando los gases de escape para comprimir el aire de admisión','Reducir el consumo de combustible en ciudad','Controlar la temperatura del motor'], c:1,
    exp:'El turbocompresor usa los gases de escape para hacer girar una turbina que comprime el aire de admisión, permitiendo al motor quemar más combustible y obtener mayor potencia.' },

  /* ── PRIMEROS AUXILIOS (20 preguntas) ──────────────────────────────── */

  { id:'b_a001', tema:'auxilios',
    p:'¿Cuáles son los pasos del protocolo P-A-S en un accidente de tráfico?',
    o:['Pedir ayuda, Atender heridos, Salir del vehículo','Proteger, Alertar, Socorrer','Parar, Ayudar, Señalizar','Proteger, Auxiliar, Señalizar'], c:1,
    exp:'El protocolo P-A-S establece: Proteger (el lugar del accidente señalizándolo para evitar nuevos accidentes), Alertar (llamar al 112), Socorrer (atender a las víctimas). Este orden es fundamental.' },

  { id:'b_a002', tema:'auxilios',
    p:'¿A qué número hay que llamar en caso de accidente de tráfico en España?',
    o:['091','061','112','062'], c:2,
    exp:'El 112 es el número europeo de emergencias. En España también se puede llamar al 061 (emergencias sanitarias), 091 (policía) o 062 (Guardia Civil), pero el 112 centraliza todas las emergencias.' },

  { id:'b_a003', tema:'auxilios',
    p:'¿Cuándo se debe mover a un accidentado?',
    o:['Siempre que sea posible, para alejarlo del peligro','Solo si hay peligro inminente (fuego, riesgo de explosión) y no es posible esperar al socorro','Siempre, para facilitar la circulación','Nunca, bajo ninguna circunstancia'], c:1,
    exp:'No se debe mover a un accidentado a menos que haya un peligro inminente y real (fuego, vehículo a punto de caer, etc.) porque moverlo puede agravar lesiones de columna.' },

  { id:'b_a004', tema:'auxilios',
    p:'¿Qué posición se debe colocar a una persona inconsciente pero que respira?',
    o:['Boca arriba con las piernas elevadas','Posición lateral de seguridad (PLS)','Sentada contra la pared','Boca abajo con la cabeza de lado'], c:1,
    exp:'La posición lateral de seguridad (PLS) se usa con personas inconscientes pero que respiran para evitar que se ahoguen con vómitos o la lengua. Se coloca de lado con la vía aérea libre.' },

  { id:'b_a005', tema:'auxilios',
    p:'¿Qué es la RCP (Reanimación Cardiopulmonar)?',
    o:['Un medicamento de urgencias','La técnica de compresiones torácicas y ventilaciones para mantener la circulación en parada cardiorrespiratoria','Un protocolo de evacuación de víctimas','El proceso de reconocimiento de heridos'], c:1,
    exp:'La RCP son las maniobras de reanimación cardiopulmonar: compresiones torácicas (masaje cardíaco) y ventilaciones (respiración artificial) para mantener la circulación cuando el corazón se detiene.' },

  { id:'b_a006', tema:'auxilios',
    p:'¿Cuántas compresiones torácicas por minuto se aplican en adultos durante la RCP?',
    o:['60 compresiones/min','80 compresiones/min','100-120 compresiones/min','150 compresiones/min'], c:2,
    exp:'En adultos, la RCP básica consiste en 30 compresiones torácicas a 100-120 por minuto, seguidas de 2 ventilaciones. Las compresiones deben ser profundas (5-6 cm).' },

  { id:'b_a007', tema:'auxilios',
    p:'¿Cómo se debe controlar una hemorragia externa grave?',
    o:['Aplicar hielo sobre la herida','Comprimir la herida con un pañuelo o tela limpia y mantener la presión','Aplicar torniquete inmediatamente en todos los casos','Lavar la herida con agua y jabón'], c:1,
    exp:'Para controlar una hemorragia, se aplica presión directa sobre la herida con un paño limpio. Si el paño se empapa, se añade otro encima sin retirar el primero y se mantiene la presión.' },

  { id:'b_a008', tema:'auxilios',
    p:'¿Qué se debe hacer si una persona tiene quemaduras en la piel tras un accidente?',
    o:['Aplicar pasta de dientes o aceite','Enfriar la quemadura con agua corriente fría durante al menos 10 minutos, sin reventar las ampollas','Cubrir con algodón','Aplicar crema hidratante inmediatamente'], c:1,
    exp:'Las quemaduras deben enfriarse con agua corriente fría (no helada) durante al menos 10-20 minutos. No se deben reventar las ampollas, ni aplicar pasta, aceite ni algodón.' },

  { id:'b_a009', tema:'auxilios',
    p:'¿Qué se debe hacer ante una persona con sospecha de fractura ósea?',
    o:['Intentar colocar el hueso en su posición correcta','Inmovilizar la zona fracturada tal como está y esperar a los servicios de emergencia','Hacer que el herido camamine para comprobar si puede hacerlo','Aplicar calor sobre la fractura'], c:1,
    exp:'Ante una posible fractura, hay que inmovilizar la zona tal y como está (sin intentar reducirla) para evitar más daño, y esperar a los servicios de emergencia.' },

  { id:'b_a010', tema:'auxilios',
    p:'¿Cómo se actúa ante una persona que ha sufrido una descarga eléctrica y sigue en contacto con el cable?',
    o:['Agarrarla con las manos para apartarla del cable','Utilizar un objeto no conductor (madera, plástico) para apartar el cable o a la víctima, sin tocarla directamente','Echar agua para cortar la corriente','Llamar al médico antes de hacer nada'], c:1,
    exp:'Ante una electrocución activa, no se debe tocar a la víctima directamente. Hay que cortar la corriente o usar un objeto no conductor para separar a la víctima del conductor eléctrico.' },

  { id:'b_a011', tema:'auxilios',
    p:'¿Qué significa "shock" o choque en primeros auxilios?',
    o:['Un golpe fuerte en la cabeza','Un estado de insuficiencia circulatoria grave que pone en peligro la vida','Una fractura ósea múltiple','El estado de inconsciencia por golpe'], c:1,
    exp:'El shock es un estado de insuficiencia circulatoria grave (los tejidos no reciben suficiente oxígeno). Puede ser hemorrágico (por pérdida de sangre), cardiogénico, anafiláctico, etc.' },

  { id:'b_a012', tema:'auxilios',
    p:'¿Cuáles son los signos de parada cardiorrespiratoria?',
    o:['Pulso débil y palidez','Ausencia de respiración y ausencia de pulso (o pulso imperceptible)','Pérdida de conocimiento con respiración normal','Convulsiones con pulso fuerte'], c:1,
    exp:'La parada cardiorrespiratoria se identifica por la ausencia de respuesta, ausencia de respiración normal (o jadeos agónicos) y ausencia de pulso. En estos casos hay que iniciar la RCP inmediatamente.' },

  { id:'b_a013', tema:'auxilios',
    p:'¿Qué es el DEA (Desfibrilador Externo Automatizado)?',
    o:['Un equipo de diagnóstico cardíaco para hospitales','Un dispositivo portátil que analiza el ritmo cardíaco y puede aplicar una descarga eléctrica para restablecer el ritmo normal','Un equipo de medición de la presión arterial','Un sistema de alerta de emergencias cardíacas'], c:1,
    exp:'El DEA es un dispositivo portátil que analiza el ritmo cardíaco y puede aplicar una descarga eléctrica (desfibrilación) para restaurar un ritmo cardíaco normal en casos de fibrilación ventricular.' },

  { id:'b_a014', tema:'auxilios',
    p:'¿Cuándo no se debe retirar el casco a un motorista accidentado?',
    o:['Nunca se debe retirar el casco','Solo si el motorista está inconsciente','Solo si hay que hacer RCP o el casco impide respirar; en caso contrario, se deja puesto','Siempre se debe retirar para explorar la cabeza'], c:2,
    exp:'El casco solo se retira si es imprescindible para realizar la RCP o si impide que el herido respire. En caso contrario, se deja puesto para evitar lesiones cervicales.' },

  { id:'b_a015', tema:'auxilios',
    p:'¿Qué se debe hacer si una persona presenta convulsiones?',
    o:['Sujetarla fuerte para que no se mueva','Introducir algo en la boca para que no se muerda la lengua','Protegerla de los golpes, no sujetarla, y colocarla en PLS cuando cesen las convulsiones','Darle agua para que baje la fiebre'], c:2,
    exp:'Durante las convulsiones, no se inmoviliza a la persona. Se retiran objetos peligrosos cercanos, se protege la cabeza con algo blando y, al cesar las convulsiones, se coloca en posición lateral de seguridad.' },

  { id:'b_a016', tema:'auxilios',
    p:'¿Cómo se comprueba si una persona accidentada está consciente?',
    o:['Mirando si tiene los ojos abiertos','Preguntándole cómo se llama y estimulándola con palmadas en los hombros','Comprobando su pulso en el cuello','Levantando sus párpados'], c:1,
    exp:'Para comprobar la conciencia, se habla a la víctima con voz alta y se le estimula con palmadas suaves en los hombros. Si no responde, se considera inconsciente y se procede según el protocolo.' },

  { id:'b_a017', tema:'auxilios',
    p:'¿Qué es la "cadena de supervivencia" en parada cardíaca?',
    o:['Los pasos del protocolo P-A-S','Los cuatro eslabones: reconocimiento precoz y llamada al 112, RCP precoz, desfibrilación precoz y cuidados postresucitación','El equipo médico de urgencias','Los pasos de la reanimación neonatal'], c:1,
    exp:'La cadena de supervivencia son los cuatro eslabones que, si se aplican rápidamente, aumentan las posibilidades de supervivencia en parada cardíaca: reconocimiento + llamada, RCP, desfibrilación y cuidados avanzados.' },

  { id:'b_a018', tema:'auxilios',
    p:'¿Cuándo se aplica un torniquete en primeros auxilios?',
    o:['En cualquier hemorragia importante','Solo en hemorragias de extremidades que no se pueden controlar con presión directa y ponen en peligro la vida','En heridas del tronco','En hemorragias internas'], c:1,
    exp:'El torniquete es el último recurso para hemorragias graves en extremidades que no se controlan con presión directa. Se anota la hora de colocación y no se debe quitar hasta la atención médica.' },

  { id:'b_a019', tema:'auxilios',
    p:'¿Qué hacer si un accidentado tiene un objeto clavado en el cuerpo?',
    o:['Extraer el objeto rápidamente para limpiar la herida','No extraer el objeto; estabilizarlo en su posición y acudir a urgencias','Empujar el objeto para que salga','Cubrir el objeto con un apósito comprimiendo fuerte'], c:1,
    exp:'Nunca se debe extraer un objeto clavado en el cuerpo porque puede estar taponando una hemorragia y su extracción podría provocar un sangrado masivo. Se inmoviliza y se traslada al hospital.' },

  { id:'b_a020', tema:'auxilios',
    p:'¿Qué se debe hacer si alguien se está ahogando con un cuerpo extraño?',
    o:['Darle palmadas en la espalda (5 golpes interescapulares) y si no sale, maniobra de Heimlich','Hacer la maniobra de RCP inmediatamente','Darle agua para que lo baje','Mantenerle la boca cerrada para que la presión lo saque'], c:0,
    exp:'Para una obstrucción de vía aérea en adultos conscientes: 5 palmadas interescapulares; si no funciona, 5 compresiones abdominales (maniobra de Heimlich). Si pierde el conocimiento, llamar al 112 e iniciar RCP.' },

  /* ── CONDUCCIÓN EFICIENTE Y MEDIO AMBIENTE (15 preguntas) ───────────── */

  { id:'b_e001', tema:'eficiencia',
    p:'¿Qué marcha se debe usar para obtener una conducción más eficiente?',
    o:['La primera o segunda siempre','La marcha más corta posible','La marcha más larga posible (la más alta) que permita circular sin que el motor "tire"','La marcha que más ruido hace'], c:2,
    exp:'Para conducir eficientemente, se recomienda circular en la marcha más alta posible (larga) sin que el motor "tire" o trabaje en exceso. Esto reduce el consumo y las emisiones.' },

  { id:'b_e002', tema:'eficiencia',
    p:'¿Cómo afecta el exceso de peso en el vehículo al consumo de combustible?',
    o:['No afecta','Lo reduce porque el motor trabaja más','Lo aumenta porque el motor necesita más energía para mover más peso','Solo afecta en pendientes'], c:2,
    exp:'Cada 100 kg adicionales de peso pueden aumentar el consumo entre un 3% y un 6%. Por eso se recomienda no llevar objetos pesados innecesarios en el maletero.' },

  { id:'b_e003', tema:'eficiencia',
    p:'¿Qué efecto tiene la baca o portaequipajes en el consumo?',
    o:['No tiene efecto','Reduce el consumo al mejorar la aerodinámica','Aumenta el consumo al aumentar la resistencia aerodinámica','Solo afecta en autopistas a alta velocidad'], c:2,
    exp:'Las bacas, portabicicletas y similares aumentan la resistencia aerodinámica del vehículo, incrementando el consumo de combustible. Se recomienda retirarlas cuando no se usen.' },

  { id:'b_e004', tema:'eficiencia',
    p:'¿Por qué se recomienda anticipar las frenadas en la conducción eficiente?',
    o:['Para desgastar menos los frenos','Para recuperar energía cinética y evitar el consumo asociado a la aceleración posterior','Para evitar sustos','Solo porque es más cómodo'], c:1,
    exp:'Anticipar las frenadas permite soltar el acelerador antes (aprovechando el freno motor) y frenar gradualmente, evitando tener que volver a acelerar. Esto reduce el consumo y las emisiones.' },

  { id:'b_e005', tema:'eficiencia',
    p:'¿Cuánto puede aumentar el consumo de combustible por cada 10 km/h de exceso de velocidad por encima de los 90 km/h?',
    o:['No varía','Un 1-2%','Un 5-10%','Un 20-30%'], c:2,
    exp:'La resistencia aerodinámica crece con el cuadrado de la velocidad. Por encima de 90 km/h, cada 10 km/h adicionales pueden aumentar el consumo entre un 5% y un 10%.' },

  { id:'b_e006', tema:'eficiencia',
    p:'¿Qué son las emisiones de CO2 y por qué son importantes?',
    o:['Un gas que mejora la eficiencia del motor','Un gas de efecto invernadero que contribuye al cambio climático','Un gas que solo contamina en ciudad','Un gas inocuo para el medio ambiente'], c:1,
    exp:'El CO2 es el principal gas de efecto invernadero emitido por el transporte. La conducción eficiente y los vehículos más modernos reducen estas emisiones y contribuyen a frenar el cambio climático.' },

  { id:'b_e007', tema:'eficiencia',
    p:'¿Cuál es el etiquetado energético que identifica la eficiencia de los vehículos en España?',
    o:['El etiquetado A-G como en electrodomésticos','El sello de la DGT con categorías CERO, ECO, C y B','El marcado CE europeo','El certificado ISO 14001'], c:1,
    exp:'La DGT ha establecido una clasificación de eficiencia ambiental de vehículos: CERO (eléctricos e hidrógeno), ECO (híbridos y gas), C (gasolina y diésel más eficientes) y B (más contaminantes).' },

  { id:'b_e008', tema:'eficiencia',
    p:'¿Qué vehículos pueden circular por el carril VAO (alta ocupación)?',
    o:['Solo taxis y autobuses','Vehículos con 2 o más ocupantes (o 1 en algunos tramos), y motos','Solo vehículos eléctricos','Cualquier vehículo pagando peaje'], c:1,
    exp:'Los carriles VAO (Vehículo de Alta Ocupación) están reservados a vehículos con 2 o más ocupantes (o 1 en horario Valle en algunos tramos), motocicletas, y vehículos eléctricos o ECO.' },

  { id:'b_e009', tema:'eficiencia',
    p:'¿Qué es un vehículo híbrido?',
    o:['Un vehículo que funciona solo con electricidad','Un vehículo que combina motor de combustión con motor eléctrico','Un vehículo que funciona con gas natural','Un vehículo con dos motores de combustión'], c:1,
    exp:'Un vehículo híbrido combina un motor de combustión interna con uno o más motores eléctricos. El motor eléctrico puede recuperar energía en las frenadas y asistir al de combustión.' },

  { id:'b_e010', tema:'eficiencia',
    p:'¿Qué es la "conducción con motor en punto muerto" y por qué está desaconsejada?',
    o:['Conducir sin encender el motor: está prohibido','Rodar con la marcha desconectada (punto muerto), que desactiva el freno motor y aumenta el consumo en algunos vehículos','Una técnica para ahorrar combustible en bajadas','Conducir con el motor apagado para ahorrar'], c:1,
    exp:'Rodar en punto muerto (con el cambio desengranado) en bajadas puede ser peligroso porque se pierde el freno motor, y en vehículos modernos no ahorra más que rodar con una marcha larga engranada (freno motor con inyección cortada).' },

  { id:'b_e011', tema:'eficiencia',
    p:'¿Cuándo conviene apagar el motor en un semáforo?',
    o:['Nunca, porque gastar el motor de arranque','Cuando la parada va a ser mayor de 60-90 segundos (según fabricante)','Siempre en semáforos','Solo si el vehículo tiene sistema Start-Stop'], c:1,
    exp:'Se recomienda apagar el motor cuando la espera va a ser superior a 60-90 segundos. Los sistemas Start-Stop modernos hacen esto automáticamente. Arrancar y apagar el motor consume muy poco.' },

  { id:'b_e012', tema:'eficiencia',
    p:'¿Qué tipo de conducción reduce más el consumo en ciudad?',
    o:['Aceleraciones y frenadas bruscas para hacer ciclos cortos','Conducción suave, anticipando situaciones, sin aceleraciones ni frenadas bruscas','Circular siempre a 50 km/h exactos','Usar siempre la primera y segunda marcha'], c:1,
    exp:'La conducción eficiente en ciudad se basa en anticipar el tráfico para evitar aceleraciones y frenadas innecesarias, usar las marchas largas antes, y mantener velocidades constantes.' },

  { id:'b_e013', tema:'eficiencia',
    p:'¿Qué significa el dato "l/100km" que aparece en las fichas técnicas de vehículos?',
    o:['Litros de aceite por cada 100.000 km','Litros de combustible consumidos por cada 100 km recorridos','Litros de agua del radiador por 100 km','Litros de limpiaparabrisas por 100 km'], c:1,
    exp:'El consumo de combustible se mide en litros por cada 100 kilómetros recorridos (l/100km). Cuanto menor es el valor, más eficiente es el vehículo.' },

  { id:'b_e014', tema:'eficiencia',
    p:'¿Cuál es la zona de la ciudad más contaminante para un vehículo de combustión?',
    o:['En autopistas urbanas','En el tráfico lento con muchas paradas (atascos y semáforos)','En aparcamientos subterráneos','En zonas industriales'], c:1,
    exp:'El tráfico lento y congestionado (atascos, semáforos) es el más contaminante para los vehículos de combustión, ya que el motor trabaja de forma ineficiente con muchas aceleraciones y frenadas a baja velocidad.' },

  { id:'b_e015', tema:'eficiencia',
    p:'¿Qué son las Zonas de Bajas Emisiones (ZBE)?',
    o:['Zonas donde solo pueden circular vehículos eléctricos','Áreas urbanas donde se restringe la circulación de los vehículos más contaminantes para mejorar la calidad del aire','Zonas de parking gratuito para vehículos eléctricos','Carriles exclusivos para bicicletas'], c:1,
    exp:'Las Zonas de Bajas Emisiones (ZBE) son áreas urbanas donde se limita la circulación de vehículos según su etiqueta ambiental (DGT) para reducir la contaminación del aire.' }

]; // fin PREGUNTAS_DGT_B
