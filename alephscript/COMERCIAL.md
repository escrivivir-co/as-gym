**Alephscript AS** es un marco de desarrollo y operación para sistemas inteligentes de propósito general. Implementa el bucle CD/CI. Implementa CommonKADS (configurable otros métodos, por plugin-like) para la gestión de aplicaciones inteligentes ejecutables. La versión Alpha de AS (año 2023) aspira a calidad agnóstica respecto de la plataforma (candidato inicial, NodeJS) paradigma WEB-HTTP y cuenta con los siguientes componentes:

- **@alephscript/semilla**: distribuído como un paquete npm, representa la inyección del marco de desarrollo en un proyecto nuevo. Típicamente:

```
npm init
/*
configurar nueva app:
    - name: mi-aplicacion-basada-en-alephscript
    ...
*/

npm install --save @alephscript/semilla

```

Implementación del fichero índice (dummy):

```ts
import { Semilla } from "@alephscript/semilla";

export const semilla = new Semilla();

await semilla.iniciar();

```

Ejemplo de ejecución en este punto:

```
npm start

as-semilla-asistente: La semilla se ha iniciado.
as-semilla-asistente: Estado actual: no inicialidado.
as-semilla-asistente: Estado actual: ¿Inicializar?
```

- **@alephscript/contexto**: distribuído como servicio de virtualización, bajo el estandard JSON, supone una **pseudo tabla de particiones (árbol de bloques, treechains)** para soportar distintos formatos de almacenamiento; típicamente funcionando sobre la *Track* y la *Lock stores* y el *FileSystem* de RASA (configurable) para cachear los ídems en la Assitantant API (gestor de file_ids).

- **@alephscript/gimnasio**: distribuido como ejecutable, permite la inyección de aplicaciones basadas en @alephscript/semilla; y permite vincular distintas fuentes de @alephscript/contexto; implementa un patrón básico de simulador gimnasio: **servicio de oráculo y entrenador** para asistentes inteligentes.

## @alephscript/semilla

Los componentes que el paquete semilla arranca, a partir de una instancia, son los siguientes y ocupan las siguientes funcionalidades (nótese, una semilla puede imbrincarse con otras, estilo-tienda-de-aplicaciones, y una semilla puede implicar la instancia e inicio de otras):

- **ASFIA Situada - Autómata CommonKADS**: Se trata de un servicio que mantiene y gestiona el estado del ciclo productivo. Ofrece puntos de entrada y movimientos a los distintos órganos del sistema para completar y avanzar el ciclo como sistema gestor del árbol de formularios en el espacio @alephscript/contexto asignado.

- **ASFIA Simbolica - Clausurador de Kleene para escribir REST APIs completas**: Se trata de un servicio que dado un lenguaje, simula aleatoriamente su clausura positiva, mapeando los eventos para cada ocurrencia válida del lenguaje en la pretensión de codificar exhaustivamente un dominio conformante con la definición Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content. RFC 7231 y siguientes para producir especificaciones compabtibles con uso uniforme de identificadores que permita la transferencia representacional del estado aprovechando los métodos HTTP descritos por Protocolo RFC 2616, (versión 2023, uso de componente de terceros swagger.io para la conversión de los ficheros generados a distintos lenguajes de programación).

- **ASFIA Situada - Máquina de Turing - Assistant API**: Se trata de un servicio que mantiene y gestiona el estado de comunicación con la API  OpenAI (configurable por plugin a modelos de lenguaje locales). Mantiene la caché y la paridad de threads y runs. Este proceso se asemeja al de una máquina de turing moviendo el cabezal (runs) por la cinta (threads). Por inferencia/aferencia mediante reglas de tipo si/entonces, mantiene la sincronía actuando como Action Server de RASA (configurable por plugin). El acceso y consultas al Modelo de Lenguaje se realiza utilizando Alephscript como lenguaje de interacción a partir de los siguientes ingredientes:
    - Elementos terminales: dominio CommonKADS (organizaciones, tareas, conceptos/comunicaciones, diseño, aplicaciones). Formularios ontológicos.
    - Elementos configurables o intermedios: son herramientas como Funciones, recuperaciones o compiladores (Assistant API Herramientas)
    - Producciones: derivan a partir de la activación en Assistants API de su "modo JSON". Mantenimiento y gestión del árbol de objetos ontológico.
    - Semilla (temperatura, huellas de modelos): elemento inicial en la producción aleatoria (ver especificación Assistant API) reguladoras del determinismo en las interacciones con el modelo de lenguaje.


## **@alephscript/contexto**

En la versión 2023 de AS se restringe la producción de información al formato JSON en lo semántico y HTML en su modelado (configurable por plugin). La funcionalidad de este paquete no incluye las actividades que típicamente implementa RASA (Track, Lock, Files) sino que provee virtualización y tabla de particiones para el acceso distribuido e independiente.

**Visitar Alephscript-Repositorios-Contextos para plantillas**. Lema comercial: "no hagas aprender un nuevo lenguaje, que la aplicación aprenda el lenguaje del usuario".

Virtualiza la expansión física de árboles de datos en el sistema de archivos, así como "la cinta" de turing (threads) y el cabezal (runs) de las stores. Canaliza y ditribuye tanto archivos comprensibles-por-humanos como embeddings. Ontología: listados y guiones; estructuras relacionales, tipadas o no; gestiona redes y marcos semánticos (árboles, grafos,...), así como etiquetas y conjuntos de datos. Herramienta que analiza y tokeniza expresiones naturales para compilarlas a lenguaje alephscript válido.

### **.../derivador-gramatica**

Este paquete provee interfaz al agente central de la arquitectura RASA OpenSource (configurable por plug-in) en su comunicación con el Servidor de Aciones Rasa SDK. Provee una funcionalidad de análisis y validación (compilado a lenguaje Alephscript) de la interacción con el usuario en Rasa OS. **Compilador** del lenguaje natural procesado en RASA (etiquetado, parametrizado, orquestado) **al lenguaje de las ASFIAs**.

## **@alephscript/gimnasio**

- **ASFIA Conexionista - Entrenador - productor del gimnasio**: Virtualización del campo-de-juego Assistant API. Implementando el bucle CD/CI, el agente raíz monitoriza los entornos encargado tanto de abrir el gimnasio, como asistir en su actividad, o cerrarlo respuestuosamente para con sus datos, máquinas y usuarios implicados.  **Servicio de oráculo y entrenador** para asistentes inteligentes.

Implica la modelización de una red semántica típica que describe la red de ASFIAs operativas, así como sus tareas-conceptos-y-comunicaciones.

Vela propagando eventos en el sistema por el correcto proceder de cada etapa, último responsable de administrar el acceso a CPU/GPU/TPU o interfaz I/O.

Entrenado ad-hoc (fine-tuneable para especialización) a partir canalizaciones formales en lenguaje as procedentes de **@alephscript/contexto**. Este modelo fundamental, "entrenador", admite meta-prompting sobre el lenguaje natural para administradores (dev u ops) abriendo una vía de interacción y control del sistema. 

La construcción del motor de decisión en este modelo se limita a la correcta inicialización, ejecución y clausura de las distintas ASFIA bloqueando deterministamente al modelo para restringuir su operativa en el marco de las restricciones gramaticales Alephscript escritas por sus administradores. Bloqueando, especialmente, filtrando en correcto lenguaje alephscript: la modificación del árbol de contexto o el acceso a los servidores de acción.