
### PoC 1: Chat GPT en modo "asistente Rasa OS"

El objetivo de esta prueba de concepto busca crear un componente que incluir en el Graph de Rasa de modo que, mediante una Policy, pueda ayudar en la tarea de reducir el prompt a entities/intents.

#### Metodología y objeto

##### Construcción del modo para Chat GPT

El objetivo de este punto consiste en redactar un prompt que configure el asistente ChatGPT en modo "intérprete para Agent Rasa OS". De este modo se obtendrán respuestas formateadas y compatibles con la Policy del Graph de Rasa.

Ejemplo:

- Activa modo json. Actúa como un asistente experto en RASA OS. Recibirás prompts y deberás devolver un objeto JSON indicando las entidades e intenciones que detectadas en el prompt. Basándote en análisis de predicados no binarios deberás procesar la entrada separando sujetos de verbos de modo que el Agent de Rasa recibe información precisa para rellanar sus formularios con los slots encontrados separando entidades y acciones. ¿Estás listo?

A partir de esta configuración incial, para la prueba, ensayo y error, se procederá secuencialmente aportando prompts, observando la salida y agregando restricciones al prompt-constructor-del-modo-chat-gpt de modo que se consiga acople perfecto con el Agent Rasa OS y el Components Graph.

##### Ejemplo de prompt

Deseo obtener información del sensor_3 en la estancia número 1. En concreto deseo saber el valor medio de su valor 56 en los últimos 10 minutos.

###### Extracción de entidades

```json
{
  "intent": "obtener_informacion_sensor",
  "entities": {
    "sensor_id": "sensor_3",
    "estancia_id": "1",
    "metrica": "valor medio",
    "valor_referencia": 56,
    "periodo_tiempo": "últimos 10 minutos"
  }
}
```


##### Ejemplo de prompt

User
He recibido una alerta externa de mi sistema. Se indica humo en el sector a. Quisiera un informe de estado del sector para evaluar posibles causas.

###### Extracción de entidades

```json
{
  "intent": "solicitar_informe_estado",
  "entities": {
    "tipo_alerta": "humo",
    "ubicacion": "sector a"
  }
}
```


##### Ejemplo de prompt

Acaba de llegar un grupo de visitantes al edificio. Tengo que recibirlo y guiarlo. Consulta el calendario y dame el número de referencia y el cuaderno de visita con las fichas de los visitantes.


###### Extracción de entidades

```json
{
  "intent": "consulta_calendario",
  "entities": {
    "accion": "recibir y guiar grupo de visitantes",
    "tipo_documento": ["número de referencia", "cuaderno de visita"],
    "detalle_documento": "fichas de los visitantes"
  }
}
```

#### Refinamiento

##### Contexto

Prompt:

A partir de ahora, agregamos un nuevo componente a tus características como agente que asiste al Agent de Rasa. 

Nuevo componente: consideras un contexto sobre el que realizar las respuestas, de modo que estandarices los intents y las entities al Agente de Rasa. Este contexto modeliza un edificio. 

Está dividido en 4 plantas iguales. Cada planta tiene dos salones, tres despachos y un laboratorio. De modo que cada estancia disponga de un detector de humos con una señal (% obturación). Aglutinando detector_humos en sensores y agrega un actuador irragador_agua que tenga un valor de señal (caudal).

Crea un archivo json que modelice esta estructura asumiendo que cada localización tiene al menos: a) nombre, b) metros cuadrados, c) código de entrada. Inventa nombres por defecto y valores de metros y códigos.

```json
{
  "edificio": {
    "plantas": [
      {
        "numero": 1,
        "salones": [
          {
            "nombre": "Salón 101",
            "metros_cuadrados": 50,
            "codigo_entrada": "ABC123",
            "sensores": {
              "detector_humos": {
                "porcentaje_obturacion": 0
              }
            },
            "actuadores": {
              "irrigador_agua": {
                "caudal": 0
              }
            }
          },
          {
            "nombre": "Salón 102",
            "metros_cuadrados": 45,
            "codigo_entrada": "DEF456",
            "sensores": {
              "detector_humos": {
                "porcentaje_obturacion": 0
              }
            },
            "actuadores": {
              "irrigador_agua": {
                "caudal": 0
              }
            }
          }
        ],
        "despachos": [
          {
            "nombre": "Despacho 101",
            "metros_cuadrados": 20,
            "codigo_entrada": "GHI789",
            "sensores": {
              "detector_humos": {
                "porcentaje_obturacion": 0
              }
            },
            "actuadores": {
              "irrigador_agua": {
                "caudal": 0
              }
            }
          },
          {
            "nombre": "Despacho 102",
            "metros_cuadrados": 18,
            "codigo_entrada": "JKL012",
            "sensores": {
              "detector_humos": {
                "porcentaje_obturacion": 0
              }
            },
            "actuadores": {
              "irrigador_agua": {
                "caudal": 0
              }
            }
          },
          {
            "nombre": "Despacho 103",
            "metros_cuadrados": 25,
            "codigo_entrada": "MNO345",
            "sensores": {
              "detector_humos": {
                "porcentaje_obturacion": 0
              }
            },
            "actuadores": {
              "irrigador_agua": {
                "caudal": 0
              }
            }
          }
        ],
        "laboratorio": {
          "nombre": "Laboratorio 101",
          "metros_cuadrados": 40,
          "codigo_entrada": "PQR678",
          "sensores": {
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          },
          "actuadores": {
            "irrigador_agua": {
              "caudal": 0
            }
          }
        }
      }
      // Plantas 2, 3 y 4 seguirían con la misma estructura
    ]
  }
}

```

### Casos de uso:

El prompt a resolver:

Huele a humo. 

```json
{
  "intent": "detectar_humo",
  "entities": {},
  "contexto_relevante": {
    "posibles_ubicaciones_investigar": [
      {
        "nombre": "Salón 101",
        "codigo_entrada": "ABC123",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      },
      {
        "nombre": "Salón 102",
        "codigo_entrada": "DEF456",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      },
      {
        "nombre": "Despacho 101",
        "codigo_entrada": "GHI789",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      },
      {
        "nombre": "Despacho 102",
        "codigo_entrada": "JKL012",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      },
      {
        "nombre": "Despacho 103",
        "codigo_entrada": "MNO345",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      },
      {
        "nombre": "Laboratorio 101",
        "codigo_entrada": "PQR678",
        "sensores": {
          "detector_humos": {
            "porcentaje_obturacion": "revisar"
          }
        }
      }
      // Similar para plantas 2, 3 y 4
    ]
  }
}
```

Simulación de las intents/entities anteriores:

En base al dominio, monta un objeto json que simule la respuesta de un servicio de telemetrías que el Agent Rasa Os ha recibido tras tu detección anterior. La respuesta contiene todos los porcentajes de obturación a 0, menos el del Laboratorio 202.

```json
{
  "respuesta_telemetria": {
    "plantas": [
      {
        "numero": 1,
        "salones": [
          {
            "nombre": "Salón 101",
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          },
          {
            "nombre": "Salón 102",
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          }
        ],
        "despachos": [
          {
            "nombre": "Despacho 101",
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          },
          {
            "nombre": "Despacho 102",
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          },
          {
            "nombre": "Despacho 103",
            "detector_humos": {
              "porcentaje_obturacion": 0
            }
          }
        ],
        "laboratorio": {
          "nombre": "Laboratorio 101",
          "detector_humos": {
            "porcentaje_obturacion": 0
          }
        }
      },
      // Simulando respuesta para la planta con el laboratorio afectado
      {
        "numero": 2,
        "laboratorio": {
          "nombre": "Laboratorio 202",
          "detector_humos": {
            "porcentaje_obturacion": 75
          }
        }
      }
      // Las plantas 3 y 4 tendrían una estructura similar con todos los detectores a 0
    ]
  }
}
```

A partir de la respuesta anterior, procesa la respuesta para ayudar al Agente Rasa a operar en función de los valores recibidos.

```
{
  "intent": "actuar_sobre_alerta_humo",
  "entities": {
    "ubicacion_critica": "Laboratorio 202",
    "accion_recomendada": "activar_irrigador_agua"
  },
  "contexto_relevante": {
    "accion_especifica": {
      "codigo_entrada": "EFG789", // Ejemplo de código para Laboratorio 202
      "irrigador_agua": {
        "accion": "activar",
        "parametros": {
          "caudal_requerido": "máximo"
        }
      }
    }
  }
}
```