# App: Simulación "cadena de montaje" (con lenguaje AlephScript)

Contenido del documento:

- Logs: "Entrada al sistema"
- Diseño de la aplicación
   - La app y las FIAs
   - AlephScript i18 "internacionalización"
- Logs "Arrancando la aplicación"
- Mundo
- **Primera FIA: Situada**. Gemelo digital de la cinta transportadora
   - El autómata y la máquina de estados
   - La máquina de estados
   - El autómata
   - Una FIA Situada con un autómata y una máquina de estados
   - Cadena de producción: la cinta transportadora
- Logs "El motor de la cinta de transporte, FIA Situada"

- **Segunda FIA: Simbólica**. Red semántica de la cadena de producción
   - Modelo semántico de la cadena de producción: entidades
   - Arcos Estructurales: de instancia, subclase y parte
   - Arcos Descriptivos
   - La red semántica
- Logs "FIA Simbolica arrancando..."
   - Logs "FIA Simbolica creando el grafo a partir del dominio..."
- Logs FIASimbolicaFormalRedSemantica.imprimir()

- **Tercera FIA: Conexionista**. Red neuronal de la cadena de producción
   - Modelo semántico de la cadena de producción: entidades
   - Arcos Estructurales: de instancia, subclase y parte
   - Arcos Descriptivos
   - La red semántica
- Logs "FIA Simbolica arrancando..."
   - Logs "FIA Simbolica creando el grafo a partir del dominio..."
- Logs FIASimbolicaFormalRedSemantica.imprimir()

Usando varios tipos de IA conjugados, la [modelización de la cadena](modelo[) situada en el contexto de [un mundo](mundo), permitirá instanciar 1 o n objetos de:
- [IA Situada](./situada), para modelar IAs como [autómatas](./situada/cadena-automata.ts) (máquina de [estados](./situada/cadena-estado.ts)) con aferencia/eferencia (suscriptores/publicadores) desde/hacia el [mundo](./mundo/cadena-mundo.ts).
- [IA Simbolica](./simbolica), para representar el negocio de la aplicación mediante [redes semánticas](./simbolica/formal/cadena-fia-red-semantica.ts), marcos...
- [IA Conexionista](./conexionista), para acoplar modelos pre-entrenados [redes neuronales](./conexionista/cadena-fia-red-neuronal.ts) bayesianas.

El producto mínimo viable no implementa toda la funcionalidad (Ver bajo enunciado).

## Logs: "Entrada al sistema"

```
[INFO] 16:42:00 ts v. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 5.2.2)
sistema> Arrancando el sistema
sistema> Cargando FIAs disponibles, por favor espera...
sistema> Escoge:
	 - [0]: Modelo: FIA
	 - [1]: Modelo: FIA_Genesis
	 - [2]: Modelo: debil
	 - [3]: Modelo: fuerte
	 - [4]: Modelo: simbolica
	 - [5]: Modelo: situada
	 - [6]: Modelo: conexionista
	 - [7]: Modelo: cadena-app                      <----------- Escoger app
	 - [99]: Not today! ¡Cerrar!, please, bye!
Escribe: _
```

## Diseño de la aplicación

### La app y las FIAs

La creación de una aplicación en lenguaje AlephScript pasa por **extender la [clase App](../../engine/apps/app.ts)** y preparar la carga de las FIAs necesarias creando una [App propia: "Cadena"](./cadena-app.ts).

```ts
import { i18 } from "../../i18/labels";
import { agentMessage } from "../../thread";
import { App } from "../../engine/apps/app";

// import { CadenaFIASituada } from "./situada/cadena-fia-situada";
// import { CadenaFIARedSemantica } from "./simbolica/formal/cadena-fia-red-semantica";
// import { CadenaFiaRedNeuronal } from "./conexionista/cadena-fia-red-neuronal";


export class CadenaApp extends App {

   runAsync: true;

   constructor() {
      super();
      this.nombre = i18.APPS.CADENA.NOMBRE;
   }

   async instanciar(): Promise<string> {

      console.log(agentMessage(this.nombre, i18.APPS.CADENA.SIMULATION_START));

      /**
      * APLICACIÓN PARA EL ESTUDIO DEL APRENDIZAJE INTELIGENTE
      *
      */

      // this.situada = new CadenaFIASituada();
      // this.simbolica = new CadenaFIARedSemantica();
      // this.conexionista = new CadenaFiaRedNeuronal();

      const salidas = await Promise.all(
         [
               // this.situada.instanciar(),
               // this.simbolica.instanciar(),
               // this.conexionista.instanciar()
         ]
      );

      return `${salidas.join("\n\t - ")}${i18.APPS.CADENA.SIMULATION_END}`;
   }
}
```

### AlephScript i18 "internacionalización"

AlephScript usa un patron JSON para todos los **textos sensibles de internacionalización**. A parte de importar las [traducciones de AlephScript-i18](../../i18/aleph-script-i18.ts), nuestra aplicación inicializa una raíz para su espacio de traducciones: [cadena-app-i18](./cadena-app-i18.ts).

Igualmente, las traducciones i18 de todas FIAs que se programen en la aplicación deberán estar enlazadas a este nodo raíz, por ejemplo:

```ts
import { CADENA_MUNDO_i18 } from "./mundo/cadena-mundo-i18";
import { CADENA_SITUADA_i18 } from "./situada/cadena-situada-i18";
import { CADENA_SIMBOLICA_i18 } from "./simbolica/cadena-simbolica-i18";
import { CADENA_CONEXIONISTA_i18 } from "./conexionista/cadena-conexionista-i18";

export const APP_CADENA_i18 = {

   CADENA: {

      NOMBRE: "cadena-app",

      SIMULATION_START: "Modelización cadena de producción. ¡Arrancando simulación!",
      SIMULATION_BODY: "Modelo resultante",
      SIMULATION_END: "¡La aplicación ha concluído y se cierra!",

      TEST: {
         PROBAR_START_LABEL: "¡Arrancando secuencia de pruebas!",
         PROBAR_END_LABEL: "¡La secuencia de pruebas ha concluído!",

         CASO: {
               START_LABEL: "\n\t - Lanzando caso: ",
               BODY_LABEL: "\n\t - Evaluando caso: ",
               END_LABEL: "\n\t - Resultado caso: ",

               BUCLE: {
                  CREAR_REGLA_LABEL: "Creada regla:"
               }
         }

      },

      ...CADENA_MUNDO_i18,

      ...CADENA_SITUADA_i18,
      ...CADENA_SIMBOLICA_i18,
      ...CADENA_CONEXIONISTA_i18
   }
}
```

## Logs "Arrancando la aplicación"

```
[INFO] 16:42:00 ts v. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 5.2.2)
sistema> Arrancando el sistema
sistema> Cargando FIAs disponibles, por favor espera...
sistema> Escoge:
	 - [0]: Modelo: FIA
	 - [1]: Modelo: FIA_Genesis
	 - [2]: Modelo: debil
	 - [3]: Modelo: fuerte
	 - [4]: Modelo: simbolica
	 - [5]: Modelo: situada
	 - [6]: Modelo: conexionista
	 - [7]: Modelo: cadena-app                      <----------- Escogida app
	 - [99]: Not today! ¡Cerrar!, please, bye!
Escribe: 7

sistema> Transfiriendo el prompt a: cadena-app
cadena-app> Modelización cadena de producción. ¡Arrancando simulación!
cadena-app> ¡La aplicación ha concluído y se cierra!
```

## Mundo

En AlephScript se añade un mundo a la aplicación **[instanciando la clase Mundo](../../mundos/mundo.ts)**. Cualquier actividad de la aplicación transcurrirá asociada a un Mundo, que, para esta aplicación, **sin originalidad, puede llamarse [CadenaMundo](./mundo/cadena-mundo.ts)**. Y tendrá todos sus textos internacionalizados en su nodo de **traducciones** [cadena-mundo-i18](./mundo/cadena-mundo-i18.ts). Por definición:

- Un mundo es un contexto con un tiempo de ejecución circadiano. Contexto compartido por todas las FIAs. Único para la aplicación. Los mundos, con estructura fractal, pueden expandirse internamente.

La simulación de esta aplicación considera **un contexto circadiano donde ubicar los gemelos digitales de la cadena de producción: operadores, máquinas, unidades de producción, la propia cinta, iluminación y otras condiciones de climatización**. Una primera aproximación al concepto de mundo apropiado para la aplicación cadena de producción podría ser determinar **una nave industrial** donde se ubica. A partir de esta determinación, podrá configurarse un modelo que represente la concreción de la cadena.

El mundo tendrá la responsabilidad de **emitir su pulso y publicar su estado**; así como **recibir actualizaciones del mismo**.

En lo concerniente al **mantenimiento del estado**, la aplicación necesitará que se habilite una cadena de bloques [no implementado] para funcionalidad de trazabilidad modo *history*. Será interesante para un operador regresar sobre el histórico para comprender o analizar el tráfico en la cadena de producción. El mundo será responsable de mantener su propia blockchain así como identificarse en la blockchain que la invocó, la de las FIAs a partir del [FIA GenesisBlock](../../genesis-block.ts).

**NOTA:** PUNTO: **APRENDIZAJE**: 

- Será objetivo de esta aplicación usar las **cadenas de bloques**, el histórico, para "enseñar" en el entrenado de FIAs que, con posterioridad, nazcan o aterricen en el mundo. Este proceso de entrenamiento en tiempo de ejecución supondría que **un Mundo le entrega una cadena de bloques a una FIA para inicializarlo**, y así invocarlo en su interior con un aprendizaje. La FIA procesa la cadena-de-bloques desplegando la información contenida transformándola en su pauta de configuración, puesta en marcha y ciclo de funcionamiento.

Se agrega, por tanto a la APP un mundo compartido:

```ts

export class CadenaApp extends App {

// (...)

   async instanciar(): Promise<string> {

      /**
      * CREACIÓN DEL MUNDO RAÍZ
      */
      this.mundo = new CadenaMundo();
      this.mundo.modelo = new CadenaModelo();
      this.mundo.nombre = i18.APPS.CADENA.MUNDO.NOMBRE;

// (...)
```

Las FIAs que se invoquen podrán entonces ejecutarse unidas al mundo:

```ts

// (...)

this.situada = new CadenaFIASituada(this.mundo);

// (...)

``````
- Sigue [Primera FIA: Situada**. Gemelo digital de la cinta transportadora](./situada/README.md)

- Sigue [Segunda FIA: Simbólica**. Red semántica de la cadena de producción](./simbolica/README.md)

- Sigue [Tercera FIA: Conexionista**. Red neuronal de la cadena de producción](./conexionista/README.md)
