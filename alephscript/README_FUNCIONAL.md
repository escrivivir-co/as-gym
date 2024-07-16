# Justificación del proyecto

Cuentan que Ada Lovelace flirteraba con Babagge; en un momento de la historia en que la inteligencia artificial no se concebía. 

## Los albores de la programación

El profesor simplemente quería activar la potencia de análisis en las modernas calculadoras de ecuaciones que la matemática había fundado en máquinas teóricas de cálculo diferencial; que medían, con sistemas de ecuaciones computados al unísono, el cambio de estado a lo largo del tiempo. El profesor, a parte de medir el cambio de estado, quería inferir tanto los estados anteriores como los que devendrían. Ada, que participaba en su proyecto, además, entendía que, si las disquisiciones analíticas de Babbage funcionaban, entonces, se necesitarían órdenes analíticas para que la máquina procediera a la inferencia y su consecuente actividad. Es decir, Ada sintió la necesidad de inventar "lenguajes de programación".

La electricidad tuvo que aparecer en nuestro entramado industrial antes de que arreciara la electrónica (no digital) a pie de máquina, programando lógica concreta para sus capacidades, entrecruzando sabiamente circuiteria lógica de puertas digitales, dentro de un entramado de control que, en su esencia, cuenta de a uno para escoger turno en una lista de instrucciones esperando ser ejecutadas. Soportado tal dinamismo en un pequeño o enorme banco de registros, la concepción de placa madre culmina esta época electrónica inventando la orquesta perfecta. Con la que, desde entonces, se tocan las más variopintas músicas digitales. Entradas, operaciones, salidas. Muy similar a como cuando soplamos, modulamos acorde y oímos nuestros instrumentos. Una misma herramienta, un infinito de canciones.

## Del álgebra matemático a la programación orientada a objetos

Desde tiempos de programación procedural a pie de máquina hasta el punto temporal en que alguien plantea la necesidad de crear un lenguaje específico para orquestar inteligencias artificiales han pasado distintos estados de TLP (teorías de los lenguajes de programación) y FIA (fundamientos de la inteligencia artificial) que tendré el gusto de otear con mirada de estudiante el 2ndo cuatrimestre 2023-2024, y que me permtirán continuar con esta sección del documento con mayor solvencia. Solo remarcar, por el momento, mi absoluta especialización en programación estructurada orientada a objetos (digno sucesor de la teoría de marcos de Minksy) si bien reconozco la importancia y el hype que lenguajes declarativos como Prolog (lenguaje que practicaré con FIA) suponen hoy día para la inteligencia artificial. Haskell, otro ejemplo, en este caso, quizás, más académico, (de TLP) y la técnica de backtraking como principio motor semántico para convertir gramáticas en producciones concretas que permitan derivar cadenas concretas, deterministas, expresiones del sistema y su estado. Durante los próximos meses, se espera, consolidaré el arte de crear lenguajes.

## De los paradigmas algorítmicos de la inteligencia artificial: vuelta-atrás.

La vuelta atrás, inspiración en bucles o motivos de recursividad, explora un espacio valorando las opciones en un movimiento de va y viene recorriendo exhaustivamente el árbol de probabilidad. Naturaleza esencial en una derivación gramátical desde las producciones a las cadenas de lenguaje resultantes. El árbol tiene las ramas que tiene, y son las happys. El resto, de vacío, inefable, ignoto, son las unhappys. Así, cuando hablamos de inteligencia artificial, en rigor, valoramos, o, al menos un enfoque cuantitativo así lo apostaría: el tamaño de la inteligencia en este modelos grandes del lenguaje se mide o cuantifica proporcional a las dimensiones de un modelo de dominio, que, en esencia, es grafo (ora conexo, ora cíclico, ora árbol...), a tantos nodos y tantas aristas por gramo de inteligencia. Un enfoque cualitativo, por complementar, apostaría a un más vale nodo como referente claro y conciso que ciento spaguetti-like barullo semántico. La navaja de Occam para el arte del CDD supone lo mismo que una navaja de Albacete en el arte del bandolero. (nota, borrar última frase por 'trozo lírico').

## Las redes neuronales

Aunque las redes neuronales artificiales, y las redes convulacionales como sus estrellas más brillantes, se hayan desplegado en el cielo de repositorios de la nube en un millar de modelos (capas y capas de perceptrones, más o menos ponderados, tras su entrenamiento), el mundo de la inteligencia artificial hunde sus raíces en los sistemas de agentes aprendiendo por refuerzo (metas/recompensa) en un contexto de inventario y agentes pugnando/colaborando por él.

El proceso mimético bioinformático establece generaciones que disponen de un tiempo de vida (pugna por el inventario) antes de ser seleccionados/descartados genéticamente (solo pasan a la siguiente época un subconjunto de esos agentes, el de aquellos agentes cuyas decisiones maximizaron o minimizaron la recompensa).

Los dos grandes superpoderes de estas redes neuronales: separar los elementos de un hiperplano mediante una línea que los diverge (clasificación); situar una línea de referencia media en ese espacio de modo que evidencie la desviación de las muestras respecto del patrón (regresión).

Las dos super técnicas que dan superpoderes de clasficación y regresión, que es una: optimización, la minimización o la maximización de un problema escogiendo, entre sus posibles soluciones, la óptima. Para ello, se ha explicado, backtracking, habrá que navegar con inteligencia el grafo del modelo de dominio y operar comparativas entre instancias de su estado a lo largo del tiempo.

## Los asistentes conversacionales

La ocurrencia de Ada: "programar algoritmos para que hagan cosas", hoy día, pasó a una fase de "programar algoritmos para que programen otros algoritmos que hagan cosas" para así proveer de casos de asistencia en los que actúan human-like y son persona-friendly.

La propuesta Alephscript va a la definición de una grámátícá totalmente determinista. Un lenguaje contenido en el lenguaje natural, que sea sub-clase. Pero aportando n grados de libertad, configurable según necesidad de producto, en su pretensión de modelar lenguaje artificial para el proceso consersacional interfaz a un sistema informático esperto (BIM, SCADA,...).

Una gramática se compone de cuatro elementos: dos listas de léxico (terminales y no), un conjunto inicial y una lista de reglas (producciones).

Las gramática entonces pueden ser expandidas (derivadas) para producir todas los textos que ese lenguaje puede producir y que serían válidos. ¿Podría AlephScript proveer una gramática que permita un lenguaje con el que escribir programas para apps que, aprovechándose de la interfaz al BIM o al SCADA, aprovechándose de esta definición generalmente poco estocástica, ofrecieran asistencia total?

Las listas de léxico: una contiene elementos terminales; y la otra toma la forma de arcos de relación entre aquellos. Una cadena de lenguaje que sea derivable desde la definición de su gramática y el elemento inicial será válida para entregársela a una máquina, instancia del sueño de Ada ahora aplicado a las FIAs. Derivar, entonces, supone recorrer el árbol gramatical y reunir en una frase los nodos resultantes del recorrido.

## AlephScript: gramáticas para producir lenguajes para escribir interfaces a sistemas informacionales

¿Podría el equipo de desarrollo crear un bot capaz de derivar esa gramática y pre-generar el modelo de la interfaz? ¿Cómo sería una red de asistencia artificial si contara a priori, como soporte para el usuario, todo el cuerpo posible de la conversación, todo el árbol conversacional, que cubra todos y cada uno de los ladrillos que hay en un BIM o todos y cada uno de los tornillos de un SCADA?

Para devirvar, bastaría con operar, a partir del conjunto incial, todas las combinaciones posibles de los elementos terminales expresados según las reglas y operados con los no terminales. Esta tarea, para la mayoría de lenguajes es de naturaleza no-polinomial. ¿Cuanto se tardaría en derivar la gramática del lenguaje español, es decir, escribir todos los textos posibles a partir de la frase: Yo escribo? Por el principio de inducción, un mecanismo que, a partir de la unidad, adhiere unidades secuencial y cronológicamente, la tarea es no-polinomial porque tiene orden de Aleph, es decir, de conjunto infinito, es decir, de conjunto que tiene tantos elementos que no se pueden enumerar todos polinomialmente (donde polinomial, que se expresa como polinomio, esto es, una ecuación que a partir de una constante, agrega variables de orden inductivo, por ejemplo: y = a + bx^1 + cx^2 + dx^3 + ... + nx^n).

Pero, entonces, sin embargo, a pesar del problema no-polinomial (es muy difícil crear algoritmos np, y, mucho más: correrlos) existe, en el modelo de dominio, una ontología finita. Un BIM o un SCADA de por sí, a diferencia del estocástico mundo real, son estructuras informacionales (se las presupone) perfectamente definidas. Son finitas. AlephScript, un lenguaje infinito para interfaces a sistemas expertos finitos.