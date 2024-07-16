# App: Simulación "cadena de montaje" (con lenguaje AlephScript)

- **Primera FIA: Situada**. Gemelo digital de la cinta transportadora
   - El autómata y la máquina de estados
   - La máquina de estados
   - El autómata
   - Una FIA Situada con un autómata y una máquina de estados
   - Cadena de producción: la cinta transportadora
- Logs "El motor de la cinta de transporte, FIA Situada"

## Primera FIA: Situada. Gemelo digital de la cinta transportadora

Acometida, en los pasos anteriores, la creación de una app, es posible agregar tantas FIAs como se requieran para la solución. Por su **sencillez a la par que versatilidad, las FIAs Situadas** son candidato principal para comenzar a construir el sistema.

Para crear un [autómata](./cadena-automata.ts) situado (aferente/eferente), **en AlephScript se instancia la clase [FIASituada](../../../paradigmas/situada/fia-situada.ts)**. Funcionando como **máquina de estados**, esta FIA inicializa un Mundo y se suscribe al ciclo circadiano. A cada pulso del ciclo, hará una **transición gestionando el motor de la cinta transportadora** según se especifique en la [definición de estados](./cadena-estado.ts).

```ts
export enum CadenaEstados {
   PARADA = "PARADA",
   ARRANCAR = "ARRANCAR",
   AVANZAR = "AVANZAR",
   PARAR = "PARAR",
   FUERA_SERVICIO = "FUERA_SERVICIO"
}
```

### El autómata y la máquina de estados

En AlephScript se extiende la clase [EstadoT<T>](../../../paradigmas/situada/estado.ts) y se implementa la **función de transición** según la conveniencia de la lógica de negocio. En esta transición, el mundo envía y recibe una instantánea o un fragmento de su modelo. El autómata puede entonces mutarlo antes de devolverlo. 

Por ejemplo, la **función de transición** dummy del [Autómata](../../../paradigmas/situada/automata.ts) base de AlephScript es una transición por defecto de pulso:

```ts
export class Automata<T> implements IAutomataT<T> {

// (...)

    async inicializar() {

      this.mundo.eferencia.subscribe((m) => {

         console.log(agentMessage(this.nombre,
            i18.SITUADA.AUTOMATA.RECEPCION_AFERENCIA_LABEL));

         /**
         * Procesar aferencia: Modelo (m)
         * */

         const aferencia = new EstadoT<T>(m.modelo);

         /**
         * Ejecución de las transiciones de ciclo
         * */
         this.estado.transicion(aferencia);

         this.mundo.modelo = this.estado.comoModelo();

         /**
         * Lanzar eferencia de regreso al mundo
         * */
         console.log(agentMessage(this.nombre,
            i18.SITUADA.AUTOMATA.ENVIO_EFERENCIA_LABEL));
         this.eferencia.next(this.mundo);

      });

      // Invocación génesis...
      // pone en marcha al mundo (o se suma si no estaba parado)
      // queda esperando a que el mundo complete la promesa await
      // escuchando en el observable de arriba.
      await this.mundo.ciclo();
   }

}
```

### La máquina de estados

Como se vio en el punto anterior, el autómata ejecutará la función de transición del estado en curso. Esta misma [**función de transición**](.//cadena-estado.ts) escrita para la aplicación de la cadena, **codificaría los estados de la cinta transportadora** arriba enumerados.

A continuación se ejemplifica una dummy **función de transición**. La máquina de estados gemelo digital del motor de la cinta transportadora pasará por los distintos estados mediante una estructura de flujo de tipo SWITCH.

**Nota**: no se aconseja agregar la lógica de negocio en el switch de estado. La FIA Situada ofrece rxjs pub/sup event-driven para recibir las actualizaciones en otros componentes. La FIA Situada ejecuta **Promise.all** para que **todos los consumidores procesen la aferencia y devuelvan su transición del modelo para la eferencia**; la lista de actualizaciones será devuelta sin o con transformación (concat, merge, accum,...) al mundo.

```ts
export class CadenaEstado<CadenaEstados> extends EstadoT<CadenaEstados> {

   modelo: CadenaModelo;

   transicion(): void {

      switch(this.modelo.motor) {
         case CadenaEstados.PARADA:
            this.modelo.motor = CadenaEstados.ARRANCAR;
            break;
         case CadenaEstados.ARRANCAR:
            this.modelo.motor = CadenaEstados.AVANZAR;
            break;
         case CadenaEstados.AVANZAR:

            /**
             * Procesar la aferencia
             **/

            // La cinta trabajará con la luz apagada la primera mitad del día
            // y con la luz encendida la segunda.
            const iluminacion = this.modelo.dia % 2 == 0;

            /**
             *  Construir la eferencia
             **/
            this.modelo.posicion++;
            this.modelo.iluminacion = iluminacion;

            /**
             * Construir la condición de salida
             **/

            // El autómata detendrá la simulación
            // con tiempo de parar la máquina;
            // teniendo en cuenta el tiempo de arranque y de parada
            const tiempoArranque = 2;
            const tiempoParada = 2;
            if (this.modelo.posicion === (
               this.modelo.muerte - tiempoArranque - tiempoParada
            )) {
               this.modelo.motor = CadenaEstados.PARAR;
            }

            break;
         case CadenaEstados.PARAR:
            this.modelo.posicion = 0;
            this.modelo.iluminacion = false;
            this.modelo.motor = CadenaEstados.FUERA_SERVICIO;
            break;
         default:
            this.modelo.iluminacion = false;
            this.modelo.motor = CadenaEstados.PARADA;
         }
      }
   }
}
```

### El autómata

Instanciando la [clase Automata](../../../paradigmas/situada/automata.ts) se ha creado [uno para la FIA Situada](./cadena-automata.ts), autómata para manejar los estados del motor de la cinta en la cadena de producción.

Este autómata será creado de tipo T "[CadenaEstados](./cadena-estado.ts)" con la especificación particular de los estados por los que transita el motor de la cinta.

A partir de los elementos de arriba, el [autómata](./cadena-automata.ts) de la aplicación podrá inicializar creando (o a partir de) un [mundo](./mundo/cadena-mundo.ts) [nótese: compartido con el resto de FIAs de la aplicación]. Mundo a su vez, que tendrá un [modelo](./modelo/cadena-modelo.ts) mutable en el proceso aferencia/eferencia.

```ts
export class CadenaAutomata<CadenaEstados> extends Automata<CadenaEstados> {

   nombre = i18.APPS.CADENA.SITUADA.AUTOMATA.NOMBRE;

   configurar(): void {

      this.mundo = new CadenaMundo();
      this.mundo.modelo = new CadenaModelo();
      this.mundo.nombre = i18.APPS.CADENA.SITUADA.NOMBRE;
      this.mundo.modelo.muerte = TOPE_POSICION;

      this.estado = new CadenaEstado<CadenaEstados>(this.mundo.modelo);

      this.nombre = i18.APPS.CADENA.SITUADA.AUTOMATA.NOMBRE;

      super.configurar();

   }
}
```

### Una FIA Situada con un autómata y una máquina de estados 

Una vez armada la inteligencia de la aplicación, podemos completar una FIA Situada, gemelo digital del motor de la cinta de producción, que, al inicializarse, instancie al autómata, que este instancia un mundo nuevo (en otros casos podría entregársele uno creeado), y arranque su ciclo circadiano.

```ts
export class CadenaFIASituada extends FIASituada implements IFIASituada {

   nombre = i18.APPS.CADENA.SITUADA.NOMBRE;
   runAsync = true;

   /**
    * Definición de la máquina de estados
    */
   automata = new CadenaAutomata<CadenaEstados>();

   async instanciar(): Promise<string> {

      console.log(agentMessage(this.nombre, i18.SITUADA.SIMULATION_START));

      /**
       * Autómata que representa la cinta transportadora de la cadena de producción
       */
      this.automata.configurar();
      await this.automata.inicializar();

      console.log(
            agentMessage(this.nombre,
            `${i18.SITUADA.SIMULATION_BODY}:${this.automata.mundo.modelo.imprimir()}`)
      );
      console.log(i18.SISTEMA.ENTER_PARA_SEGUIR);
      return `${i18.SITUADA.SIMULATION_END}`;
   }
}

```

### Cadena de producción: la cinta transportadora

El último paso, antes de regresar a la consola para ejecutar la aplicación, consistirá en agregar la nueva FIA Situada a la piscina de promesas de la app.

```ts
import { i18 } from "../../i18/aleph-script-i18";
import { agentMessage } from "../../thread";
import { App } from "../../engine/apps/app";

import { CadenaFIASituada } from "./cadena-fia-situada";
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

      this.situada = new CadenaFIASituada();
      // this.simbolica = new CadenaFIARedSemantica();
      // this.conexionista = new CadenaFiaRedNeuronal();

      const salidas = await Promise.all(
         [
               this.situada.instanciar(),
               // this.simbolica.instanciar(),
               // this.conexionista.instanciar()
         ]
      );

      return `${salidas.join("\n\t - ")}${i18.APPS.CADENA.SIMULATION_END}`;
   }
}
```

## Logs "El motor de la cinta de transporte, FIA Situada"

```
sistema> Transfiriendo el prompt a: cadena-app
cadena-app> Modelización cadena de producción. ¡Arrancando simulación!
cadena.situada> Hola soy un autómata situado. Voy a ejemplificar mi forma de razonar. 
...Para ello operaré un serie de pasos recibiendo señales con mis sensores y enviando acciones.
cadena.situada> ¡Mundo iniciado!
cadena.situada> Hoy es el día: 1
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 1
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 0
                 -iluminacion: false
                 -motor: PARADA
cadena.situada> Hoy es el día: 2
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 2
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 0
                 -iluminacion: false
                 -motor: ARRANCAR
cadena.situada> Hoy es el día: 3
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 3
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 0
                 -iluminacion: false
                 -motor: AVANZAR
cadena.situada> Hoy es el día: 4
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 4
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 1
                 -iluminacion: true
                 -motor: AVANZAR
cadena.situada> Hoy es el día: 5
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 5
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 2
                 -iluminacion: false
                 -motor: PARAR
cadena.situada> Hoy es el día: 6
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
cadena.situada> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
                 -dia: 6
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 0
                 -iluminacion: false
                 -motor: FUERA_SERVICIO
cadena.situada> ¡Mundo acabado!
cadena.situada> Modelo resultante.
:nombre: Cadena de producción
                 -dia: 6
                 -muerte: 6
                 -pulso: 1000
                 -posicion: 0
                 -iluminacion: false
                 -motor: FUERA_SERVICIO
PULSA ENTER PARA CONTINUAR 
```
