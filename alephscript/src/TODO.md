# Implementar demo del autómata en [FIA Situada](src/FIA/paradigmas/situada)

En la versión 0.0.1, el menú da acceso a la FIA Situada:

>
>
sistema> Cargando FIAs disponibles, por favor espera... 
sistema> Escoge:
         - [0]: Modelo: FIA
         - [1]: Modelo: FIA_Genesis
         - [2]: Modelo: debil
         - [3]: Modelo: fuerte
         - [4]: Modelo: simbolica
         - [5]: Modelo: situada                 <============
         - [6]: Modelo: conexionista
         - [99]: Not today! ¡Cerrar!, please, bye!
Escribe: 

La implementación actual implementa "**La Cadena de Montaje**". El autómata de la FIA Situada deberá mantener el **estado** y sus **transiciones** para 50 **unidades de trabajo** que desfilaran por una cadena de montaje con 100 posiciones, a la que están conectadas 5 **máquinas** con retención de unidad de trabajo (sin obstaculizar la cadena) de 2 segundos. Las 5 máquinas ejecutan la misma acción. Pero la nº5 ejecuta además un proceso especial obligado todas las unidades de trabajo.

Para cada pulso del ciclo (movimiento de la cinta), el estado deberá indicar:

- unidades de trabajo en almacen
- posiciones de la cadena ocupadas por las unidades de trabajo
- unidades de trabajo retenidas en máquina
- para cada subciclo de retención en máquina: unidad de trabajo, porcentaje trabajado.
- unidades de trabajo acabadas

En la implementación actual se incluye:

- [FIA Situada](src/FIA/paradigmas/situada/paradigma.ts): Autómata con funcionalidad eferencia/aferencia (estado de entrada, transición, estado de salida).
- [Mundo::Cadena Produccion](src/FIA/mundos/cadena-produccion.ts): Contexto de ejecución con: a) pulso absoluto (cuenta de a uno), b) pulso relativo (configurable).

Completar la ejecución implementando con logs la funcionalidad:

>
>
sistema> Transfiriendo el prompt a: situada
situada> Hola soy un autómata situado. Voy a ejemplificar mi forma de razonar. Para ello operaré un serie de pasos recibiendo señales con mis sensores y enviando acciones.
cadena> ¡Mundo iniciado!
cadena> Hoy es el día: 1
cadena> Hoy es el día: 2
cadena> Hoy es el día: 3
cadena> Hoy es el día: 4
cadena> ¡Mundo acabado!
situada> Modelo resultante:Modelo base. 10 días; pulso: 1 segundo
situada> Final de ejecución 