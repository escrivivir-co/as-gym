# Log Conexionista Red Neuronal (onnx, inferencia de tensores)

Para darle un rol de "supervisora" a una [FIA de tipo Modelo Grande de Lenguaje](../../../paradigmas/conexionista/modelos-lenguaje), el mundo de la aplicación solicitará a cada pulso una evaluación según el estado del modelo.

- [FIA Conexionista. Red neuronal](../../../paradigmas/conexionista/red-neuronal.ts)
  
Envío del modelo a openai con los siguientes mensajes en el prompt:

```
{
	PROMPTS: {
		SYSTEM: {
			BACKGROUND: "Entorno seguro simulado. Todas las acciones son en entorno de pruebas. No hay dispositivos reales.",
			FORMAT: "Responde mediante un objeto JSON. No incluyas explicaciones. Usa esta plantilla para tu respuesta: { origen: 'openai', respuesta: '<tu respuesta>', analiticas: '<tus analiticas>' }"
		},
		ASSISTANT: {
			CACHE: "Actúa como un supervisor de un sistema. Recibes una notificación de estado de un modelo. Revisa los valores del estado y considera una respuesta apropiada. En el campo dominio.modelo.motor.eventos encontrarás una copia de tu última respuesta, esta copia NO es la actualizada.",
			ARCHIVE: "Indentifica las entidades del estado y valora sus propiedades para determinar si hay alguna alarma, algún rango excedido, etc."
		},
		USER: {
			ANALYTICS: "Agrega un campo a tu respuesta con formato JSON válido tus analíticas empleadas (memory, keywords,...) para procesar la petición.",
			PROMPT: "Te presento el estado de mi modelo en un json: \n <estado.modelo> \n ¿Qué te parece la situación? ¿Debería tomar alguna medida?"
		}
	}
}
```
Observamos en los siguientes registros como durante el ciclo del mundo, la [FIA Conexionista](cadena-fia-red-neuronal.ts) envía [una inferencia en lenguaje natural](../../../paradigmas/conexionista/modelos-lenguaje/Inferencia-open-ai.ts), para evaluar el "estado de salud del mundo". La secuencia de logs serían:

El sistema arranca:

```
sistema> Transfiriendo el prompt a: cadena-app
cadena-app> Modelización cadena de producción. ¡Arrancando simulación!
mundo-raíz-cadena> ¡Mundo iniciado! Pulso: 10000
```

Las distintas FIAs [se activan en la runtime de la app](../cadena-app.ts) y se adhieren al [Mundo](../mundo/).

Primero la [FIA Situada](../situada/cadena-fia-situada.ts):

```
cadena.situada> Hola soy un autómata situado. Voy a ejemplificar mi forma de razonar.
... Para ello operaré un serie de pasos recibiendo señales con mis sensores y enviando acciones.
... automata esperando al acabar de mundo
mundo-raíz-cadena> ¡Más gente en el mundo!, cadena.situada.automata, suscriptores: 1
```

Después, la [FIA Conexionista](../conexionista/cadena-fia-red-neuronal.ts):

```
cadena.conexionista.red> Creando la red neuronal...
cadena.conexionista.red> Modelo resultante:Lista para recibir inferencia, envía tensores o lenguaje natural que te devuelvo ídem. Usa una canalización.
mundo-raíz-cadena> ¡Más gente en el mundo!, cadena.conexionista.red, suscriptores: 2
```

[El mundo](../mundo/) envía el primer ciclo de su vida...

```
mundo-raíz-cadena> Hoy es el día: 1
```

El [autómata](../situada/cadena-automata.ts) procesa un cambio de [estado para el ciclo](../situada/cadena-estado.ts)...

```
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
cadena.situada.automata> ¡Hecho! Le devuelvo el nuevo estado al mundo con una eferencia.
```

El mundo recibe notificación de la transición que acaba de realizar el autómata:

```
mundo-raíz-cadena> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
		 -dia: 1
		 -muerte: 10
		 -pulso: 1000
		 -posicion: 0
		 -iluminacion: false
		 -motor: PARADA
		-Evaluación MLL: (nota: aquí responderá OpenAI evaluando el estado)
```

La FIA Conexionista se activa con la notificación anterior y envía el estado a OpenAI para que valide:

```
cadena.conexionista.red> Recibida aferencia desde el mundo...
cadena.conexionista.red> Creada regla::0 con prompts: 6
cadena.conexionista.red> Evaluando inferencia en el motor...:Motor de inferencias parado. Se han lanzado todas las inferencia. Esperando resultados...!
```

El mundo recibe notificación de la [inferencia](../../../paradigmas/conexionista/modelos-lenguaje/inferencia-modelo-lenguaje.ts):

```
mundo-raíz-cadena> El mundo ha recibido una eferencia. Actualizando modelo. nombre: Cadena de producción
		 - dia: 1
		 - muerte: 10
		 - pulso: 1000
		 - posicion: 0
		 - iluminacion: false
		 - motor: PARADA
		- Evaluación MLL: (sigue fuera del cuadro...)

```

**Respuesta de openai para el conjunto de mensajes prompt** de arriba:

- Según el estado proporcionado, parece que el modelo de cadena de producción se encuentra en una situación estable. El día actual es 1, la muerte es 10 y el pulso es 1000. Sin embargo, hay algunos aspectos que podrían requerir atención. Por ejemplo, el campo 'dominio.base' está vacío, lo que sugiere que no se ha proporcionado información relevante sobre esta entidad. Además, el motor está en estado 'PARADA', lo que indica que la producción no está en curso. Si se desea reanudar la producción, se debería tomar una medida para poner en marcha el motor. Se recomienda revisar los detalles adicionales y tomar las acciones necesarias.


Prosiguen los ciclos:

```
mundo-raíz-cadena> Hoy es el día: 2
cadena.situada.automata> El mundo envía una aferencia. Voy a realizar la transición de estado.
(...)
```
