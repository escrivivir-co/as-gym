# App: Simulación "cadena de montaje" (con lenguaje AlephScript)

- **Segunda FIA: Simbólica**. Red semántica de la cadena de producción
   - Modelo semántico de la cadena de producción: entidades
   - Arcos Estructurales: de instancia, subclase y parte
   - Arcos Descriptivos
   - La red semántica
- Logs "FIA Simbolica arrancando..."
   - Logs "FIA Simbolica creando el grafo a partir del dominio..."
- Logs FIASimbolicaFormalRedSemantica.imprimir()



## Segunda FIA: Simbolica. Red semántica de la cadena de producción

AlephScript permite superponer tantas FIAs como sea necesario para cubrir la solución. En el presente tutorial, agregaremos [una segunda inteligencia artificial](./cadena-fia-simbolica.ts), en este caso, para modelizar el problema con una [red semántica](./formal/cadena-fia-red-semantica.ts).

Crearemos una instancia de [FIA Simbolica](../../../paradigmas/simbolica), de modelo [Formal](../../../paradigmas/simbolica/modelos/formal), que implementa un sistema representacional de [Red Semántica](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/).

Por definición: una [red remántica](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/red) es un [grafo dirigido](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/grafo.ts) cuyas aristas son [arcos](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/arco.ts) con [etiquetas](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/etiqueta.ts) que, mediante una [regla](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/regla.ts) establecen una relación.

## El modelo semántico de la cadena de producción: entidades

La construcción de la red puede iniciarse fuera del entorno AlephScript. Dado que la red es un cuerpo mutante, se necesita **un lenguaje de etiquetado capaz de codificar la estructura**. La FIA Simbolica leerá la red en lenguaje etiquetado y la venteará dinámicamente para poder lanzar inferencias sobre esa base de conocimiento. Proceso que consistirá en la búsqueda de "caminos" dentro del grafo.

Nota: Para **definir el modelo**, AlephScript en su v. 0000 opta por **JSON, clave/valor** (con posibilidad de que valor sea, a su vez, *clave/valor*). Sería interesante extender la compatibilidad otros lenguaje de etiquetado (xsd, gltf ...).

¿Qué **entidades podrían ser los primeros nodos de una red semántica que modele una nave industrial** dentro de la cual hay una cinta transportadora que mueve unidades-de-trabajo desde el almacén de entrada al almacén de salida; siendo estas unidades interceptadas por PLCs de robots que harán trabajos sobre ellas?

```
{
   ENTIDADES: {
      robot: "robot",
      objeto: "objeto",
      propiedad: "propiedad",
      cadena: "cadena",
      almacen: "almacen",
      tarea: "tarea"
   }
}
```
AlephScript considera tarea interna de la [FIA Simbolica.Forma.Semantica.Red](./formal/cadena-fia-red-semantica.ts) mantener la [descripción de la red en formato i18](./formal/cadena-dominio.ts) como traducciones.

La definción del **dominio** deberá registar **entidades** y **arcos**. A su vez, entre estos, **arcos descriptivos** y **estructurales**. Y entre estos, de **parte** o de **subclase** o de **instancia**.

```ts
export const CADENA_DOMINIO_i18 = {

   DOMINIO: {

      ENTIDADES: {
         tarea: "tarea",
         robot: "robot",
         objeto: "objeto",
         propiedad: "propiedad",
         cadena: "cadena",
         almacen: "almacen",
      },
      ARCOS: {
         DESCRIPTIVOS: {},
         ESTRUCTURALES: {
               INSTANCIA: {},
               PARTE: {},
               SUBCLASE: {}
         }
      }
   }
}
```

### Arcos Estructurales: de instancia, subclase y parte

La red de semántica debe definir las naturalezas de las entidades implicadas y relacionarlas entre ellas mediante reglas de **subclase** o de **parte**. Definida la ontología de la red, podrán crearse tantas **instancias** como se requieran.

La aplicación requiere **instanciar** a la cadena de producción (con la cinta transportadora).

Para facilitar la aplicación, definimos una relación dummy de entidades y relaciones:

Mínimo un **almacen de entrada y otro de salida**. Las unidades-de-trabajo serán transportadas de uno a otro almacén por la **cinta**.

Instancia de un **robot reponedor** y quizás otro que saque de la cinta.

Más los robots funcionales apostados en la cinta, que actuarán sobre esas **unidades-de-trabajo** (objetos).

Para el ejemplo, habrá un par de **robots, 1 y 2**, cuya funcionalidad será:

- Criptosellar (agregar una firma a una unidad-de-trabajo).

Otro par de **robots, 3 y 4**, que hagan:

- Parsear los datos que vienen en la unidad-de-trabajo, de hexa a decimal.

Para ello, el dominio definirá...

- cuatro **objetos: 2 parseables, 1 criptosellable**. Y **compuesto** que admite ambas actuaciones.

Los objetos criptosellables necesitarán...

- una **propiedad "cripta"**.

Los parseables:

- una **propiedad "estado"**.

Por último, la red contendrá la información de operativa que permitirá a los distintos FIAs obtener órdenes precisas sobre el estado de la cadena. Definimos Entidades Tarea, y las nombramos según los parámetros que necesiten para ejecutarse. Por ejemplo, AlephScript permite definir: 

- algunas **tareas** tipo, con claves como: "tarea_cadena_robot_objeto"...

... una instancia de este tipo podría ser:

- Un *robot* examina la *cadena* (cinta) y toma un *objeto* de ella cuando localiza una unidad-de-trabajo (*objeto*) afín a sus capacidades.

Nótese: En la actual implementación (en previsión de integrar Marcos en la aplicación) las terminaciones de los pares clave/valor son strings dummy (deberán ser ejecutables).

A continuación se indican los arcos estructurales para la implementación dummy:

(léase: 'clave' es subclase de 'valor')
[CADENA_DOMINIO_i18](./formal/cadena-dominio.ts).DOMINIO.ARCOS.ESTRUCTURALES.SUBCLASE...

```
{
   texto: "<clave> es subclase de <valor>",

   reponedor: { robot: "robot" },
   criptoselladora: { robot: "robot" },
   parseadora: { robot: "robot" },

   objeto_criptosellable: { objeto: "objeto" },
   objeto_parseable: { objeto: "objeto" },

   objeto_compuesto: { objeto: "objeto" }
}
```

(léase: 'clave' tiene la parte: 'valor')
[CADENA_DOMINIO_i18](./formal/cadena-dominio.ts).DOMINIO.ARCOS.ESTRUCTURALES.PARTE...

```
{
   texto: "<clave> tiene la parte: <valor>",
   objeto: {
      propiedad_estado: "propiedad"
   },
   objeto_criptosellable: {
      propiedad_cripta: "propiedad"
   },
   objeto_parseable: {
      propiedad_cadena: "propiedad"
   },
   objeto_compuesto: {
      objeto_parseable: "objeto",
      objeto_criptosellable: "objeto"
   },
   robot: {
      tarea_cadena_robot_objeto: "tarea",
      tarea_robot_objeto: "tarea",
      tarea_robot_objeto_propiedad: "tarea",
   }
}
```
(léase: 'clave' es instancia de 'valor')
[CADENA_DOMINIO_i18](./formal/cadena-dominio.ts).DOMINIO.ARCOS.ESTRUCTURALES.INSTANCIA...

```
{
   texto: "<clave> es instancia de <valor>",

   cadena_1: { cadena: "cadena" },

   almacen_1: { almacen: "almacen" },

   entrada: { almacen: "almacen" },
   salida: { almacen: "almacen" },
   basura: { almacen: "almacen"},

   reponerdor: { reponedor: "reponedor"},

   robot_1: { criptoselladora: "criptoselladora"},
   robot_2: { criptoselladora: "criptoselladora"},

   robot_3: { parseadora: "parseadora"},
   robot_4: { parseadora: "parseadora"},

   objeto_1: { objeto_parseable: "objeto_parseable"},
   objeto_2: { objeto_criptosellable: "objeto_criptosellable"},
   objeto_3: { objeto_parseable: "objeto_parseable"},
   objeto_4: { objeto_compuesto: "objeto_compuesto"},

   propiedad_cripta: { propiedad: "propiedad"},
   propiedad_cadena: { propiedad: "propiedad"},
   propiedad_estado: { propiedad: "propiedad" }
}
```

### Arcos Descriptivos

En esta aplicación, usamos algunas definiciones con arcos descriptivos que permitirán relacionar las tareas con las entidades que participarán en ella. 

Por ejemplo, una FIA Situada que está produciendo en la cadena (**una criptoselladora**) puede consultar la red semántica para saber si **debe o no coger un objeto** que le llega en la cadena de producción. 

La FIA le indicaría a la red semántica sus capacidades y la red le aclararía si el objeto que llega es una tarea válida para sus capacidades. Si existe un camino que salga de la clave y halle todos los valores.

(léase: según el valor de las definiciones.)
[CADENA_DOMINIO_i18](./formal/cadena-dominio.ts).DOMINIO.ARCOS.DESCRIPTIVOS...
```
{
   tarea_cadena_robot_objeto_almacen: {
      parametros: {
         tarea: "",
         cadena: "",
         robot: "",
         objeto: "",
         almacen: ""
      },
      desencadenar: "Tarea: <clave>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>.",
      encadenar: "Tarea: <clave>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>."
   },
   tarea_robot_objeto_almacen:  {
      parametros: {
         robot: "",
         objeto: "",
         almacen: ""
      },
      deshechar: "Tarea: <clave>. Agente <robot>: <tarea>: <objeto> al lugar <almacen>.",
   },
   tarea_robot_objeto_propiedad:  {
      parametros: {
         robot: "",
         objeto: "",
         propiedad: ""
      },
      operar: "Tarea: <clave>. Agente <robot>: <tarea>: <propiedad> de <objeto>",
   }
}
```
### La red semántica

![](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/vistas/docs/red-tree-grafo.png)

Procediendo de forma homóloga a la primera FIA, instalamos esta nueva FIA en la [app](./cadena-app.ts). Como es habitual, todos los textos se configurarán según requerimientos en el conjunto [cadena-simbolica-i18](./cadena-simbolica-i18.ts).

El [método **instanciar** de la FIA](./formal/cadena-fia-red-semantica.ts), en **esta aplicación dummy cargará la red a partir del dominio**. Y, a renglón seguido, **lanzará un juego de pruebas dummy**, haciendo inferencias sobre la relación entre las entidades.

```ts
import { i18 } from "../../../../i18/aleph-script-i18";
import { Grafo } from "../../../../paradigmas/simbolica/modelos/formal/sistema/semantica/grafo";
import { RedSemantica } from "../../../../paradigmas/simbolica/modelos/formal/sistema/semantica/red";
import { agentMessage } from "../../../../thread";
import { CadenaFIASimbolica } from "../cadena-fia-simbolica";

export class CadenaGrafo extends Grafo {}

export class CadenaFIARedSemantica extends CadenaFIASimbolica {

    modelo = new RedSemantica();
    nombre = i18.APPS.CADENA.SIMBOLICA.RED.NOMBRE;

    constructor() {

        super();

        const grafo = new CadenaGrafo();

        this.modelo.nombre = i18.APPS.CADENA.SIMBOLICA.SEMANTICA.NOMBRE;
        this.modelo.base = grafo;

    }

    async instanciar(): Promise<string> {

        console.log(agentMessage(this.nombre, i18.APPS.CADENA.SIMBOLICA.SIMULATION_START));

        await this.cargaRed();

        console.log(
            agentMessage(this.nombre, `${i18.APPS.CADENA.SIMULATION_BODY}:${this.imprimir()}`)
        );

        await this.probar();

        return `${i18.APPS.CADENA.SIMBOLICA.SIMULATION_END}`;
    }

    async cargaRed() {

        const red = i18.APPS.CADENA.SIMBOLICA.DOMINIO;
        this.modelo.cargar(red);

    }

    imprimir(): string {}

    async probar(): Promise<void> { /* (...) * /}
}

```

## Logs "FIA Simbolica arrancando..."

Tras escoger la aplicación en el menú de sistema, la consola muestra:

```
sistema> Transfiriendo el prompt a: cadena-app
cadena-app> Modelización cadena de producción. ¡Arrancando simulación!
cadena.simbolica.red> Creando la red semántica...
```

### La creación del Grafo a partir del Dominio

El método cargar de la Red Semántica procesa el dominio e instancia el grafo. En el código siguiente:

red = [CADENA_DOMINIO_i18](./formal/cadena-dominio.ts).DOMINIO;

```ts
export class RedSemantica extends Formal implements IRedSemantica {

   entidades: IGrafo[] = [];

   nombre = i18.SIMBOLICA.SEMANTICA.NOMBRE;

   base = new Grafo();
   motor = new MotorInferencia();

   cargar(red: any) {
      const entidades = this.entidades; // árbol a grafo

     /**
      * Añadir entidades maestras
      */
      Object.keys(red.ENTIDADES).forEach(i => { /* (...) */

      /**
      * Añadir entidades del arco "subclase-de"
      */
      Object.keys(red.ARCOS.ESTRUCTURALES.SUBCLASE).forEach(clase_hija => { /* (...) */

      /**
      * Añadir entidades del arco "subclase-de"
      */
      Object.keys(red.ARCOS.ESTRUCTURALES.SUBCLASE).forEach(clase_hija => { /* (...) */

      /**
       * Añadir entidades del arco "instancia-de"
       */
      Object.keys(red.ARCOS.ESTRUCTURALES.INSTANCIA).forEach(clase_hija => { /* (...) */

     /**
      * Añadir entidades del arco "descriptivo"
      */
      Object.keys(red.ARCOS.DESCRIPTIVOS).forEach(clase_padre => {

         /* (...) */

         const relacion = new RelacionDescriptiva();
         relacion.nombre =  new Traductor().crearTextoAyuda(clase_hijo, parametros, etiqueta_texto);;

         const etiqueta = new EtiquetaDescriptiva();
         etiqueta.estado = relacion;

         const arco = new ArcoDescriptivo();
         arco.destino = grafoPadre;
         arco.etiqueta = etiqueta;
         grafoHijo.arcos.estado.push(arco);

         console.log(agentMessage(this.nombre,
            `${i18.APPS.CADENA.SIMBOLICA.AGREGANDO_ARCOS_DESCRIPTIVOS_LABEL}
             ${grafoHijo.nombre}/${grafoPadre.nombre}`

         /* (...) */


     /**
      * Convertir las entidades hoja en hijas de un nodo raíz
      */
      this.base = new Grafo();

      this.entidades.forEach(
         e =>
         {
               const relacion = new RelacionEstructural();

               relacion.nombre =  "relacion.raiz";

               const etiqueta = new EtiquetaEstructural();
               etiqueta.estado = relacion;

               const arco = new ArcoEstructural();
               arco.destino = e;
               arco.etiqueta = etiqueta;
               this.base.arcos.estado.push(arco);
      });

```

## Logs "FIA Simbolica creando el grafo a partir del dominio..."

```
cadena.simbolica.red> Creando la red semántica...
cadena.simbolica.semantica.red> Agregando entidad: tarea
cadena.simbolica.semantica.red> Agregando entidad: robot
cadena.simbolica.semantica.red> Agregando entidad: objeto
cadena.simbolica.semantica.red> Agregando entidad: propiedad
cadena.simbolica.semantica.red> Agregando entidad: cadena
cadena.simbolica.semantica.red> Agregando entidad: almacen
cadena.simbolica.semantica.red> Agregando arco subclase/clase: reponedor/robot
cadena.simbolica.semantica.red> Agregando arco subclase/clase: criptoselladora/robot
cadena.simbolica.semantica.red> Agregando arco subclase/clase: parseadora/robot
cadena.simbolica.semantica.red> Agregando arco subclase/clase: objeto_criptosellable/objeto
cadena.simbolica.semantica.red> Agregando arco subclase/clase: objeto_parseable/objeto
cadena.simbolica.semantica.red> Agregando arco subclase/clase: objeto_compuesto/objeto
cadena.simbolica.semantica.red> Agregando arco parte/clase: tarea_cadena_robot_objeto/robot
cadena.simbolica.semantica.red> Agregando arco parte/clase: tarea_robot_objeto/robot
cadena.simbolica.semantica.red> Agregando arco parte/clase: tarea_robot_objeto_propiedad/robot
cadena.simbolica.semantica.red> Agregando arco parte/clase: propiedad_estado/objeto
cadena.simbolica.semantica.red> Agregando arco parte/clase: propiedad_cripta/objeto_criptosellable
cadena.simbolica.semantica.red> Agregando arco parte/clase: propiedad_cadena/objeto_parseable
cadena.simbolica.semantica.red> Agregando arco parte/clase: objeto_parseable/objeto_compuesto
cadena.simbolica.semantica.red> Agregando arco parte/clase: objeto_criptosellable/objeto_compuesto
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: cadena/cadena_1
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: almacen/almacen_1
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: almacen/entrada
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: almacen/salida
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: almacen/basura
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: reponedor/reponerdor
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: criptoselladora/robot_1
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: criptoselladora/robot_2
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: parseadora/robot_3
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: parseadora/robot_4
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: objeto_parseable/objeto_1
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: objeto_criptosellable/objeto_2
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: objeto_parseable/objeto_3
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: objeto_compuesto/objeto_4
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: propiedad/propiedad_cripta
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: propiedad/propiedad_cadena
cadena.simbolica.semantica.red> Agregando arco instancia hija/padre: propiedad/propiedad_estado
cadena.simbolica.semantica.red> Agregando arco descriptivo destino/origen: desencadenar/tarea_cadena_robot_objeto_almacen
cadena.simbolica.semantica.red> Agregando arco descriptivo destino/origen: encadenar/tarea_cadena_robot_objeto_almacen
cadena.simbolica.semantica.red> Agregando arco descriptivo destino/origen: deshechar/tarea_robot_objeto_almacen
cadena.simbolica.semantica.red> Agregando arco descriptivo destino/origen: operar/tarea_robot_objeto_propiedad
```

### Logs FIASimbolicaFormalRedSemantica.imprimir()

```
cadena.simbolica.red> Modelo resultante:
	 - (grafo) -tarea; arcos
	 - (grafo) -robot; arcos
	 - (grafo) -objeto; arcos
	 - (grafo) -propiedad; arcos
	 - (grafo) -cadena; arcos
	 - (grafo) -almacen; arcos
	 - (grafo) -reponedor; arcos
		 - <reponedor> es subclase de <robot>
	 - (grafo) -criptoselladora; arcos
		 - <criptoselladora> es subclase de <robot>
	 - (grafo) -parseadora; arcos
		 - <parseadora> es subclase de <robot>
	 - (grafo) -objeto_criptosellable; arcos
		 - <objeto_criptosellable> es subclase de <objeto>
		 - <objeto_compuesto> tiene la parte: <objeto_criptosellable>
	 - (grafo) -objeto_parseable; arcos
		 - <objeto_parseable> es subclase de <objeto>
		 - <objeto_compuesto> tiene la parte: <objeto_parseable>
	 - (grafo) -objeto_compuesto; arcos
		 - <objeto_compuesto> es subclase de <objeto>
	 - (grafo) -tarea_cadena_robot_objeto; arcos
		 - <robot> tiene la parte: <tarea_cadena_robot_objeto>
	 - (grafo) -tarea_robot_objeto; arcos
		 - <robot> tiene la parte: <tarea_robot_objeto>
	 - (grafo) -tarea_robot_objeto_propiedad; arcos
		 - <robot> tiene la parte: <tarea_robot_objeto_propiedad>
	 - (grafo) -propiedad_estado; arcos
		 - <objeto> tiene la parte: <propiedad_estado>
		 - <propiedad_estado> es instancia de <propiedad>
	 - (grafo) -propiedad_cripta; arcos
		 - <objeto_criptosellable> tiene la parte: <propiedad_cripta>
		 - <propiedad_cripta> es instancia de <propiedad>
	 - (grafo) -propiedad_cadena; arcos
		 - <objeto_parseable> tiene la parte: <propiedad_cadena>
		 - <propiedad_cadena> es instancia de <propiedad>
	 - (grafo) -cadena_1; arcos
		 - <cadena_1> es instancia de <cadena>
	 - (grafo) -almacen_1; arcos
		 - <almacen_1> es instancia de <almacen>
	 - (grafo) -entrada; arcos
		 - <entrada> es instancia de <almacen>
	 - (grafo) -salida; arcos
		 - <salida> es instancia de <almacen>
	 - (grafo) -basura; arcos
		 - <basura> es instancia de <almacen>
	 - (grafo) -reponerdor; arcos
		 - <reponerdor> es instancia de <reponedor>
	 - (grafo) -robot_1; arcos
		 - <robot_1> es instancia de <criptoselladora>
	 - (grafo) -robot_2; arcos
		 - <robot_2> es instancia de <criptoselladora>
	 - (grafo) -robot_3; arcos
		 - <robot_3> es instancia de <parseadora>
	 - (grafo) -robot_4; arcos
		 - <robot_4> es instancia de <parseadora>
	 - (grafo) -objeto_1; arcos
		 - <objeto_1> es instancia de <objeto_parseable>
	 - (grafo) -objeto_2; arcos
		 - <objeto_2> es instancia de <objeto_criptosellable>
	 - (grafo) -objeto_3; arcos
		 - <objeto_3> es instancia de <objeto_parseable>
	 - (grafo) -objeto_4; arcos
		 - <objeto_4> es instancia de <objeto_compuesto>
	 - (grafo) -tarea_cadena_robot_objeto_almacen; arcos
	 - (grafo) -desencadenar; arcos
		 - Tarea: <desencadenar>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>.
	 - (grafo) -encadenar; arcos
		 - Tarea: <encadenar>. Agente <robot>: <tarea> <objeto> entre <almacen> y <cadena>.
	 - (grafo) -tarea_robot_objeto_almacen; arcos
	 - (grafo) -deshechar; arcos
		 - Tarea: <deshechar>. Agente <robot>: <tarea>: <objeto> al lugar <almacen>.
	 - (grafo) -operar; arcos
		 - Tarea: <operar>. Agente <robot>: <tarea>: <propiedad> de <objeto>
```

### Lanzando inferencias a la red: en busca de un camino

Una vez cargada la red, la FIA Simbolica Red Semantica lanzara un juego de pruebas. El mecanismo  para inferir la red se aplica instanciando la [clase ReglaRed](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/regla.ts) que a su vez extiende a la [clase InferenciaRelacion](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/regla.ts).

Si la FIA Situada incorporaba un autómata, la FIA Semántica por el momento incluye una cola de reglas en [un motor simple de procesamiento secuencial](../../../paradigmas/simbolica/modelos/formal/sistema/semantica/motor-inferencia.ts): tomar regla de la cola, evaluarla, repetir.

```ts
export class MotorInferencia implements IMotorInferencia {

   reglas: Inferencia[] = []

   arrancar(log: (string) => void): void {

      this.reglas.forEach(regla => {

         const inferencia = regla.evaluar();

         log(inferencia);

      })
   }

   trasDetenerse(log: (string: any) => void): void {
      log("MotorInferencia.Detenido");
   }
}
```

Una implementación simple del proceso test, usaría el método probar de para lanzar casos de prueba:

```ts

import { i18 } from "../../../../i18/aleph-script-i18";
import { Grafo } from "../../../../paradigmas/simbolica/modelos/formal/sistema/semantica/grafo";
import { RedSemantica } from "../../../../paradigmas/simbolica/modelos/formal/sistema/semantica/red";
import { agentMessage } from "../../../../thread";
import { CadenaFIASimbolica } from "../cadena-fia-simbolica";

export class CadenaGrafo extends Grafo {}

export class CadenaFIARedSemantica extends CadenaFIASimbolica {

    modelo = new RedSemantica();
    nombre = i18.APPS.CADENA.SIMBOLICA.RED.NOMBRE;

    constructor() { /* (...) */ }

    async instanciar(): Promise<string> { /* (...) */ }

    async cargaRed() { /* (...) */}

    imprimir(): string { /* (...) */ }

    async probar(): Promise<void> {

        const red = i18.APPS.CADENA.SIMBOLICA.DOMINIO;

        const casos = [];

        await this.modelo.probar(casos);

    }
}

```

Los casos propuestos son:

- ¿Es robot_1 instancia de robot? Esperado: Sí.
- ¿Es robot_1 subclase de criptoselladora? Esperado: Sí
- ¿Es propiedad_cripta parte de objeto_1? Esperado: Sí.
- ¿Puede el robot_1 de la cadena_1 ejecutar la encadenar con id tarea_1 en la que están implicados el objeto_1 y el almacen_1? Esperado: Sí.

```ts
const casos = [
   {
         instancia: {
            robot_1: { robot: "robot" }
         }
   },
   {
         subclase: {
            robot_1: { criptoselladora: "criptoselladora" }
         }
   },
   {
         parte: {
            propiedad_cripta: { objeto_1: "objeto_1" }
         }
   },
   {
         tarea_cadena_robot_objeto: {
            encadenar : {
               tarea_1: "tarea",
               cadena_1: "cadena",
               robot_1: "robot",
               objeto_1: "objeto",
               almacen_1: "almacen"
            }
         }
   }
];

```
Para implementar las reglas, la red semántica transforma los casos en Reglas. Las reglas, por definición, son evaluables. La red deberá asegurar que la regla carga tanto los parámetros de inferencia como el propio dominio semántico.

```ts
export class RedSemantica extends Formal implements IRedSemantica {

   // (...)

    cargar(red: any) { /* // (...) */}

    probar(casos: object[]) {

        return new Promise((resolve, reject) => {

            console.log(agentMessage(this.nombre, `${i18.APPS.CADENA.TEST.PROBAR_START_LABEL}:${""}`));

            /**
             *  Encolado de casos a probar
             * */
            casos.forEach((c, index) => {

                console.log(agentMessage(this.nombre, `${i18.APPS.CADENA.TEST.CASO.START_LABEL}:${index}`));

                const regla = new ReglaRed();
                const parametros = new Dominio(c);

                regla.configurar(this.base, parametros);

                console.log(agentMessage(this.nombre,
                    `${i18.APPS.CADENA.TEST.CASO.BUCLE.CREAR_REGLA_LABEL}:${index} con ${regla.imprimir()}`
                ));

                this.motor.reglas.push(regla);

            });

            /**
             *  Arrancar la cola de inferencias
             * */
            this.motor.arrancar((info) => {
                console.log(
                    agentMessage(this.nombre,
                        `${i18.APPS.CADENA.TEST.CASO.BODY_LABEL}:${info}`));
            });

            /**
             *  Capturar evento de parada
             * */
            this.motor.trasDetenerse(() => {
                console.log(agentMessage(this.nombre, `${i18.APPS.CADENA.TEST.PROBAR_END_LABEL}:${""}`));
                resolve("> forma.sistema.semantica.paradigma.RedSemantica.probar, finalizó con éxito");
            });

            /**
             *  Condición de salida
             * */
            setTimeout(
                () => reject("forma.sistema.semantica.paradigma.RedSemantica.probar, tiempo expirado!")
                , 5000
            );


        });

    }

}
```

Las pruebas se codifican, como es usual mediante JSON. Se procesarán en paralelo.

```
cadena.simbolica.semantica.red> ¡Arrancando secuencia de pruebas!:
cadena.simbolica.semantica.red>
	 - Lanzando caso: :0
cadena.simbolica.semantica.red> Creada regla::0 con "instancia"
cadena.simbolica.semantica.red>
	 - Lanzando caso: :1
cadena.simbolica.semantica.red> Creada regla::1 con "subclase"
cadena.simbolica.semantica.red>
	 - Lanzando caso: :2
cadena.simbolica.semantica.red> Creada regla::2 con "parte"
cadena.simbolica.semantica.red>
	 - Lanzando caso: :3
cadena.simbolica.semantica.red> Creada regla::3 con "tarea_cadena_robot_objeto"

```

La resolución de la regla, pasa por:

- Cargar el domino de la red (grafo)
- Cargar el conjunto de parámetros
- Cargar el grafo semántico
- Operar la búsqueda en el grafo.

```ts

export class ReglaRed extends InferenciaRelacion implements IReglaRed {

    async evaluar(): Promise<IInferencia> {

        const activar = this.activar();

        const tipo = Object.keys(activar.parametros)[0];

        const agentes = Object.keys(activar.parametros[tipo]);

        const sujetos = Object
            .keys(activar.parametros[tipo])
            .map(parametro => activar.parametros[tipo][parametro])
            .map(sujeto => {
                return Object.keys(sujeto);
            })
            .flat();

        const entidades = activar
            .contexto
            .arcos
            .estado
            .map(arco => arco.destino)
            .filter(destino => agentes.concat(sujetos).indexOf(destino.nombre) > -1)
            .flat();

        const traductor = new Traductor();

        console.log(
            i18.SIMBOLICA.SEMANTICA.REGLA + ">",
            i18.SIMBOLICA.SEMANTICA.INFERENCIA
                .replace("<clave>", tipo)
                .replace("<agentes>", agentes.join(" - "))
                .replace("<sujetos>", sujetos.join(" - "))
                .replace("<entidades>", entidades.map(e => e.nombre).join(" - ")),
        );

        switch(tipo) {
            case "instancia":
            case "subclase":
            case "parte":

               /* (...) */

               // Búsquedas ad hoc en el grafo
                break;
            default:


        }
        return this;
    }
}
```
Un ejemplo dummy de búsqueda simple recursiva:

```ts

export class ReglaRed extends InferenciaRelacion implements IReglaRed {

    async evaluar(): Promise<IInferencia> {

        /* (...) */

        switch(tipo) {
            case "instancia":
            case "subclase":
            case "parte":

                const agente = agentes[0];
                const sujeto = sujetos[0];

                console.log(
                    i18.SIMBOLICA.SEMANTICA.REGLA + ">",
                    i18.SIMBOLICA.SEMANTICA.INFERENCIA_NATURAL_LABEL
                        .replace("agente", agente)
                        .replace("sujeto", sujeto)
                        .replace("arco", tipo),
                );

                const busqueda_inicio = entidades.find(e => e.nombre === agente);
                console.log("Empieza la búsqueda en", busqueda_inicio.nombre);

                const camino = [];
                const buscar = await busqueda_inicio.encontrar(sujeto, tipo, camino);

                console.log("Resultado búsqueda:", buscar?.nombre);
                break;
            default:
               //
        }
        return this;
    }
}
```

## Logs (dummys): FIASimbolicaFormalRedSemantica.inferir()

Logs del caso 1:

```ts
const casos = [
   {
         instancia: {
            robot_1: { robot: "robot" }
         }
   }
];
```

Busqueda parcial, logs inválidos:

```
regla.de.red.semantica>
	 - Tipo de inferencia: instancia
	 - agentes: robot_1
	 - sujetos: robot
	 - Entidades: robot - robot_1
regla.de.red.semantica> ¿Existe un camino que lleve desde <robot_1> hasta <robot> pasando por <instancia>
Empieza la búsqueda en robot_1...
      - Avance a nodo criptoselladora...
RelacionEstructural {
  nombre: '<robot_1> es instancia de <criptoselladora>',
  valor: 'instancia'
}
   - Avance a nodo robot...
RelacionEstructural {
  nombre: '<criptoselladora> es subclase de <robot>',
  valor: 'subclase'
}
Fin de rama. El destino: robot fallido.
```
