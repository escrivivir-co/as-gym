(**English** version projected, please request.)

Nota: Se ha codificado el software usando dominio **spanish**-like. Contactar para una versión anglosajona.

Estado de construcción (build status): Falso.

AlephScript es un lenguaje de operativa para conectar a una ranura virtual en las placas madres de los PCs convencionales las modernas interfaces BIM/SCADA; de modo que los usuarios puedan usarlas (conversacionalmente) junto al resto de periféricos.

Ventaja y desventaja del desarrollo contra interfaces se encuentra en el aspecto "bien definido" de estas. Al final, deberá construirse una modelización para el lenguaje capaz de interactuar según la definición. BIM o SCADA, ambas interfaces proveen un domino y un histórico de estados (diferencial) para operar con el usuario.

En el vertiginoso tren de las IA generativas, y, de lleno en las que aquí atañen: las converacionales multimodal, hoy día se está recomendando públicamente dos premisas:

- Trabajar con datos sintéticos en lugar de muestrados (no argumentamos aquí)
- CD/CI bucle continuo, generativo semántico.

En el paradigma tradicional o convencional en el que las IA generativas han llegado para ponerlo todo patas arriba, los desarrolladores intentaban saltar la distancia entre sus laboratorios y sus códigos compilados a binario escritos en lenguajes de más o menos altura (más o menos necesidad de interpretación y/o traducción) antes de la compilación corriendo en máquinas (virtuales) en cualquier punto de la faz terrestre. Escindida (por el bucle CD/CI) esa distancia, los desarradores hoy puedan hacer "algo" más en el "tiempo de ejecución" que, simplemente, hacer debug. Ese "algo" más, a todas luces, es "aprender". La reflexión, capacidad de un algoritmo de evolucionar creando nuevo código, es una característica instrínsica a cualquier lenguaje, y, de ella, parte ese "algo".

En un proyecto CDD, comunmente, siguiendo aquellos dos principios, serán bots menores de propósito general quienes se sumen a los usuarios tras la publicación del producto mínimo viable a la hora de expandir y podar el árbol de caminos conversacionales "felices". El aprendizaje, en la forma de recoleción-anotación-entrenamiento, se producirá, como decimos, semánticamente.


Histórico:

- release v: 0.0.1, Sábado, 25 de noviembre de 2024, version info: *"The Seed, an **npm library**"*.

- release v: 1.0.0, Sábado, 01 de febrero de 2024, version info: *"The AlephScript, an npm package that provides a **framework to lint, translate, compile and run** consersacional assistants algoritms"*.

- release v: 1.1.0, no liberada, version info: *"The Runtime, a **docker cluster** to run AlephScripts algoritms".*

- release v: 1.2.0, no liberada, version info: *"The BIM Interface, an **SDK to develop apps for buildings information models** assistance through conversations".*

- release v: 1.3.0, no liberada, version info: *"The Automation Interface, an **SDK to develop apps for SCADA information systems** assistance through conversations".*

En el contexto del proyecto [JE2.0](https://jsanchezamai.github.io/je20/), para un final de grado; en el marco de las asignaturas TLP y FIA, [aleph-script](https://github.com/jsanchezamai/je20-aleph-script-language) supone un intento (dummy, naife) de crear un lenguaje para desarrollar y operar aplicaciones de inteligencia artificial en el ámbito de la asistencia conversacional.

Aunque la cabecera anterior excluye el contenido de este repositorio para cualquier uso fuera de entornos controlados, desde un [punto de vista comercial](./COMERCIAL.md), se ha intentado aproximar un entorno de bucle contínuo (CD/CI) sobre las tecnologías RASA y OpenAI en representación concreta de los servicios de IA que el lenguaje Alephscript, en adelante AS, necesitaría poder manipular actuando como interfaz a un BIM (building information modeling).

**Alephscript, un lenguaje TDD/CDD para IAs conversacionales** (Nota: primer SDK; consultar framework, orientado a BIM. Se espera SDK SCADA) interfaz de asistencia a modelos informacionales de los edificios. Nota: require versionado semántico, y bucle de rotación contínua CD/CI.




## AlephScript StarterKit: The modelo-de-chen Parser (CDD over RASA OpenSource)

¿Es posible darle de comer a este sistema un modelo de chen y un conjunto de datos mock para que, automáticamente, derivara la asistencia integral sobre el BIM o SCADA del que provienen?

¿Acaso una IA no es capaz de conjugar la jerarquía relacional de la base de datos usándola como red-semántica y operando vuelta-atrás sobre su instancia a partir de esos datos mock crear, a priori, el bosque completo de frases **(intents)** que cargan entidades **(entities)** que pueden almacenarse en variables **(slots)** mediante bucles de recolección **(forms)** para crear flujos **(stories)** vertebrando una conversación de respuestas **(responses)** a acciones **(actions)** disparadas en reglas **(rules)** compuestas por secuencias de pasos **(steps)** o trozos de lógica de negocio **(si-entonces, and, or)** o lógica algoritmica **(functions)**, que, cuando corren, despliegan una nube de trayectos **(subscriptions)** y eventos **(events)** en una miriada de conversaciones **(domain model)** asíncronas (aunque estrictamente secunciales) **(conversations)** orquestadas por un maestro de ceremonias **(agent)** que se habla con distintos usuarios **(botusers)** y se apoya en circuitería experta en el procesamiento de redes neuronales: **NPU**s, Neural Processing Unit capaces de realizar ambas operaciones: NLU (**Natural language understanding**) y NLG (**Generating**) que son toma y daca en una conversación: escuchar y hablar para, operando contra la interfaz BIM o SCADA, asistir al usuario?

Nota: Estas NPUs, son nuevo hito computacional, progresión que expande sobre CPU y GPU para, sobre el sistema operativo, interoperar conversacionalmente (**multimodal**) con el usario vía los periféricos conectados a la placa. Sobre los tradicionales procesadores que manejan operaciones en coma flotante y los que calculan el diferencial de las gráficas mediante matrices de ecuaciones, estos nuevos procesadores son eficaces en el cómputo de redes neuronales.

¿Acaso no sería automática la creación de un cuerpo narrativo hilvanando con un si-entoces-ir-a-la-página-x **(breakpoints)** los distintos contextos **(session)** que requieran los usuarios; no se podría derivar el libro de todas las conversaciones posibles que los usuarios requerirán para manipular la interfaz al BIM o al SCADA y crear una máquina simple de turing que mueva una cabeza lectora por una cinta algorítmica, en este caso, la cinta sería el libro **(Tracking Store)** y la cabeza lectora **(Lock Store)** saltaría de página a página?

AlephScript: un lenguaje CDD para la producción de interfaces a sistemas informacionales; AlephScript StarterKit, un asistente para la traducción (interpretación) de modelos relacionales a protocolos de asistencia, incluye plugin modelo-de-chen-parser. 

# Mapa del camino

Laboratorios y versión experimental en AlephScript: [un lenguaje para FIAs](https://github.com/jsanchezamai/je20-aleph-script-language/blob/alephscript_v0001/README_TECNICO.md) (unidades fundamentales de inteligencia artificial). Primer ejemplo de uso: [Modelización cadena de montaje (robots Kuka)](https://github.com/jsanchezamai/je20-aleph-script-language/blob/alephscript_v0001/src/FIA/aplicaciones/cadena/README.md).

