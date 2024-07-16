# Bienvenida a FIA y TLP

Saludos, te presenta este repositorio un estudiante...

Dentro de la **Ingeniería Informática**, este repositorio contiene material relativo a las asignaturas:

- **FIA**, fundamentos de inteligencia artificial
- **TLP**, teoría de los lenguajes de programación

La *Prueba de Evaluación a Distancia* (PEC) de FIA es en *Prolog* y la de *TLP* en *Haskell*. En ambos casos se trata de *programación declarativa*. No se encuentra aquí la solución a las prácticas del curso académico 2023-24 (si acaso se subirán en junio) sino material de apoyo y profundización.

Como se ha indicado, alejándonos del contenido concreto de las PECs (al que volveremos en febrero para ceñirnos a la confección), hoy, finales de otoño, anticipándonos, me he cuestionado dos objetos:

- Comprender cuáles son los fundamentos de la inteligencia artificial
- Desarrollar un lenguaje (o un traductor, o un compilador, o un IDE, o un framework,...) que permita programar sistemas inteligentes.

Los manuales de referencia son:

- Inteligencia Artificial, JT Palma Méndez y R. Marín Morales (McGrawHill)
- Teoría de los lenguajes de programación, de F. López Ostenero y AMª García Serrano (Editorial Ramón Areces)

Volveré sobre esta introducción, la concretaré las próximas semanas.

AlephScript es una tecnología pensada para ahondar en esa laya específica dentro del contexto donde se puede decir que la Ingeniería del Conocimiento establece el conjunto de guías, métodos y técnicas para desarollar de manera formal sistemas capaces de resolver problemas, en cierta forma complejos, que no aborda la Ingeniería del Software tradicional y cuyo principal recurso es el tratamiento del conocimiento.

Dicho esto, manos a la obra,...

# Este repositorio: el lenguaje AlephScript

El proyecto desarrollado en la [carpeta FIA](src/FIA) implementará (o servirá de apoyo y extensión) la PED de la asignatura mediante una modelización de las distintas IAs usando *programación estructurada, orientada a objetos y eventos*. El objeto de la PED (aún no ha salido el enunciado) será previsiblemente implementar **un árbol de búsquedas** y un **sistema de reglas básico**. De forma similar, la de TLP será implementar un pequeño **algoritmo de gestión o manejo de estados**. Ambas serán, como se indicó, usando prolog (**paradigma lógico**) y haskell (**paradigma funcional**), ambos, **programación declarativa**. También se indicó que el contenido de este repositorio excederá a los otros paradigmas de programación.

Generalmente, alejándose desde el lenguaje máquina, y siempre volviendo a él como ahora ocurre con [WebAssembly](https://www.velneo.com/blog/por-que-todo-el-mundo-esta-hablando-de-web-assembly#:~:text=El%20código%20de%20WebAssembly%20se,los%20que%20se%20puede%20ejecutar.) (que ejecuta código binario en el navegador, ¡¡¡¡¡junto a javascript!!!!!!!), distintas capas se superponen exigiendo además de compilador, traductor o intérprete. En nuestro caso, siguiendo estas capas, para modelizar sistemas inteligentes proponemos **usar Typescript** que es un lenguaje transpilado-traducido-compilado (**transpilado**: de typescript a javascript; **traducido**: de javascript a c++; **compilado**: de c++ a binario) y agregar una cuarta etapa en la secuencia.

El objetivo, por tanto, será usar programación estructurada, orientada a objetos y eventos para modelizar un lenguaje que pueda usarse desde los paradigmas declarativos a la hora de representar procesos inteligentes. Por supuesto, a no ser que salte al Proyecto Final de Grado, el ámbito de esta pretensión se limita a lo didáctico, pedagógico, siempre con miras a la entrega de las PECs y los exámenes.

Buscando los elementos mínimos de este lenguaje, he identificado casos de uso como:

- Modelizar [un mundo](src/FIA/mundos) con agentes y cosas. Ponerlo en marcha y agregarle inercias. Contexto con un tiempo de ejecución circadiano. Ambiente compartido por todas las FIAs. Único para la aplicación. Los mundos, con estructura fractal, pueden expandirse internamente.
- Instanciar un [autómata de un tipo concreto de inteligencia](src/FIA/paradigmas) y solicitarle una actuación en ese mundo.
- Un [motor de ejecución](src/FIA/engine/kernel/runtime.ts) capaz de correrlos.

He identificado tipos fundamentales de IA, a saber:

- [Situada](src/FIA/paradigmas/situada): redes lógicas (máquinas de estado);
- [Simbólica](src/FIA/paradigmas/simbolica): (hechos y reglas) redes semánticas y marcos;
- [Conexionista](src/FIA/paradigmas/conexionista): tiras de tokens y redes neuronales reductoras o transformadoras.

Además, desde un [punto de vista científico](src/FIA/paradigmas/cientifica), esta inteligencia puede ser:

- Fuerte: imita al humano (pasa el [test de turing](src/FIA/agents/turing-test.ts)).
- Débil: resuelve problemas concretos o limitados.

Desde el punto de vista de la ingeniería del conocimiento, se investigará la implementación de [SBC](./src/FIA/paradigmas/sbc/)s: sistemas basados en conocimiento, por ejemplo: [CommonKADS](./src/FIA/paradigmas/sbc/implementaciones/common-kads/) para el desarrollo de [sistemas](./src/FIA/paradigmas/sbc/implementaciones/common-kads/sistema.ts) y [aplicaciones](./src/FIA/paradigmas/sbc/modelos/disenyo/aplicacion.ts) que corran las FIAs.

El plan de estas dos semanas ha sido montar el setup y arrancar las primeras interfaces. A parte de empezar a conocer los puntos calientes de ambas asignaturas, aquí en el repositorio traje un [preset Typescript NodeJs](package.json), dispuse las intefaces mínimas, un [menú para consola](src/FIA/navigation), el [archivo de traducciones](src/FIA/i18), y armé un primer prototipo del núcleo-nodo principal de este "nuevo" lenguaje sobre Typescript que buscamos. Se trata del [Bloque Génesis](src/FIA/genesis-block.ts) una primera "entidad mínima" de nuestro lenguaje, por ejemplo:

Arrancando [AlephRuntime](src/FIA/engine)...

```ts
    const rt = new Runtime();
    rt.start();
    await rt.demo();
```
Cargando unidades de inteligencia en la runtime:
```ts

    static threads: iFIA[] = [];

    start() {

        const fia = new FIA();
        Runtime.threads.push(fia);

        const gb = new GenesisBlock();
        Runtime.threads.push(gb);

        /**
         * BASE
         */
        Runtime.threads.push(IACientifica.fiaDebil);
        Runtime.threads.push(IACientifica.fiaFuerte);

        Runtime.threads.push(FIASimbolica.fiaSimbolica);
        Runtime.threads.push(IASituada.fiaSituada);
        Runtime.threads.push(FIAConexionista.fiaConexionista);

        Runtime.threads.push(new FIA_SBC());

        /**
         * APPS
         */
        const cadenaApp = new CadenaApp();
        Runtime.threads.push(cadenaApp);

    }
```

Cediéndole el tiempo de CPU a una inteligencia:

```ts
                        const fia = Runtime.threads[index];

                        console.clear();
                        console.log(systemMessage(`${i18.LOOP.LAUNCH_FIA_LABEL}: ${fia.nombre}`));

                        if (fia.runAsync) {

                            const instancia = await fia.instanciar();
                            console.log(agentMessage(fia.nombre, instancia));

                        } else {
                            console.log(agentMessage(fia.nombre, fia.imprimir()));
                        }
```
Llamaré a este [lenguaje AlephScript](src/FIA) y, de momento, se encuentra ya en su versión: 0.0.0.0.0.0.0.0.1 con el nombre de versión "FIA".

```
**sistema>** Se está ejecutando AlephRuntime, la máquina virtual que corre el lenguaje AlephScript...
**sistema>** Cargando FIAs disponibles, por favor espera... 
**sistema>** Escoge:
         - [0]: Modelo: FIA
         - [1]: Modelo: FIA_Genesis
         - [2]: Modelo: debil
         - [3]: Modelo: fuerte
         - [4]: Modelo: simbolica
         - [5]: Modelo: situada
         - [6]: Modelo: conexionista
         - [7]: Modelo: sbc
         - [8]: Modelo: cadena-app              <<=====================
         - [99]: Not today! ¡Cerrar!, please, bye!
Escribe:
```

![](./AlephScript_UML.png)

# Quincena 1ra

Una vez armado el prototipo de lenguaje (v001), ¿cómo usarlo?

Vamos a implementar una cadena de producción mediante este lenguaje.

Sigo en su [README](src/FIA/aplicaciones/cadena/README.md)...

Otro punto de avance será la [Inteligencia Artificial Conexionista](src/FIA/paradigmas/conexionista). El objeto de carga de modelos para el paso de Tensores (ristras de número) queda bien resuelto en onnx estableciéndose como posible estándar a la hora de convertir cualquier fuente de red neuronal a un formato inferible por nuestra aplcación. En eso sentido se agregó tanto el paquete nodo como el web y se trajeron los [ejemplos oficiales onnxjs-ort](src/FIA/engine/onnx).

Además, el [paquete smartpy](src/FIA/engine/smartpy) implementa el mismo servicio de carga de modelos.onnx y gestiona una inferencia por llamada.

He podido hacer una implementación mínima, al menos para dejar constancia, de la IA Conexionista. El log:

```
sistema> Transfiriendo el prompt a: cadena-app
cadena-app> Esta aplicación simula una cadena de producción. ¡Arrancando simulación!
cadena.conexionista.red> Creando la red neuronal...
cadena.conexionista.red> Modelo resultante: Lista para recibir inferencia, usa una canalización.
red-neuronal> Creando sesión de inferencia para el modelo: :/FIA/aplicaciones/cadena/conexionista/model.onnx
red-neuronal> Tensores de entrada: :1,2,3,4,5,6,7,8,9,10,11,12, 10,20,30,40,50,60,70,80,90,100,110,120
red-neuronal> La inferencia acabó con éxito, tensor de salida: :700,800,900,1580,1840,2100,2460,2880,3300
cadena.conexionista.red> ¡Simulación finalizada!
cadena-app> ¡La aplicación ha concluído y se cierra!

```

En el log se aprecia la evolución de la app una vez se ha seleccionado simular la FIA Conexionista. Se envía una orden a partir de la configuración dinámica de la canalización:

```ts

    async probar(): Promise<void> {

        const dato_a = Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const dato_b = Float32Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]);

        await this.modelo.clasificador.canalizacion.canalizarDe2Parametros({
            modelo: "FIA/aplicaciones/cadena/conexionista/model.onnx" ,
            dato_a,
            dato_b
        })

    }
```

La estrategia ha sido implementar un [clasificador](src/FIA/paradigmas/conexionista/clasificador.ts) capaz de usar [src/FIA/paradigmas/conexionista/onnx.ts](onnx) para cargar un modelo precompilado que represente una [red neuronal](src/FIA/paradigmas/conexionista/red-neuronal.ts) a la que podamos solicitarle, mediante una [canalización](src/FIA/paradigmas/conexionista/canalizacion.ts), la inferencia de un tensor a partir de otros tensores.

Una vez implementados los elementos del lenguaje AlephScript [agregar a la app de ejemplo una FIA](src/FIA/aplicaciones/cadena/conexionista/cadena-fia-red-neuronal.ts) que los use para inferir a su red neuronal.

Una estructura competente del tipo model-in-the-loop (MiL), software-in-the-loop (SiL) y hardware-in-the-loop (HiL) coherente y continua.

## AS Framework half-no-code IDE

![](./build_info_pics/AS_FK_IDE.png)

![](./build_info_pics/master-screen-load-data-1-loaded.png)
