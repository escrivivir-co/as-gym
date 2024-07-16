# Base experta

Ejecutar simulacion con la función [BaseExpertaSimulacion](./simuacion.ts):

## Descripción

El módulo [Base Experta](./) implementa un **asistente experto** para proveer servicios de mantenimiento y supervisión. Para ello, se parte de una **base de datos experta** que el asistente carga dinámicamente a partir de una **especificación en lenguaje natural** en una hoja de Excel. 

El asistente comunicará **la salud del sistema** según las telemetrías cambien el estado.

## Especificación de la base experta

Se considera un archivo Excel con grados de libertad tanto en filas como algunas columnas, especificado de la siguiente forma:

- Cabecera:
    - Columna 1: Etiqueta Componente. (título, nombre de la clase, i.e. : "Componentes")
    - Columna 2: Etiqueta Alteración. (i.e. : "Alteraciones")
    - Columna 3: Etiqueta Tipo. (i.e. : "Tipos")

    - Columnas desde 4 a A: Etiquetas Valor. (i.e.: "V01 - Estructural", "V02 - Perenne")

    - Columnas desde (A+1) a B: Etiquetas Sensor-Regulado.  (i.e.: "S01 - Temperatura.Leve", "S02 - Temperatura.Grave")

    - Columnas desde (B+1) a C: Etiquetas Diagnósticos. (i.e.: "D01 - Recomendaciones básicas", "D02 - Recomendaciones periódicas")

Y cuyo contenido con las siguiente líneas:

- Lineas:
    - Columna 1: Componente. (i.e.: "MiComponente1")
    - Columna 2: Alteración. (i.e.: "A01 - Rotura MiElemento1")
    - Columna 3: Tipo.  (i.e.: "T01 - Roturas por desgaste")

    - Columnas 4-A: Ocurrencias por Valor. (i.e.: [true, false])

    - Columnas (A+1)-B: Criterios expresados en lenguaje natural (solo en las columnas que aplique).
        (i.e.: ["tendencia decreciente con pérdida del 20% Nmax", "tendencia decreciente con pérdida del 80% Nmax"])

    - Columnas (B+1)-C: Etiquetas Diagnósticos
        (i.e.: [
        [ "F01 apagar ventilador", 
        "F01 iniciar procesos mantenimiento"],
        [ "F01 apagar máquina"]
    ])

## Crear la base de datos experta

```ts

const procesador = new CargadorBaseExperta({
      cabecera: CabeceraPC,
      lineas: [PC1, PC2],
      red: null
    });

await procesador.crearBase();

```

Logs de ejecución:

Supóngase [la Cabecera y las líneas PC1, PC2](./dominio/ejemplo.ts) definidas como ejempo.

```
Procesador estado> Analizando Cabecera
Procesador estado> 	 - Cabecera: componente
Procesador estado> 	 - Cabecera: alteracion
Procesador estado> 	 - Cabecera: tipos_tabla
Procesador estado> 	 - Cabecera: valores
Procesador estado> 	 - Cabecera: sensores
Procesador estado> 		 0 - Crear guid
Procesador estado> 		 0 - Almacenar
Procesador estado> 		 1 - Crear guid
Procesador estado> 		 1 - Almacenar
Procesador estado> 	 - Cabecera: diagnosticos
Procesador estado> Analizando Cuerpo
Procesador estado> 	 0 - Linea: Componente
Procesador estado> 	 0 - Linea: Alteracion
Procesador estado> 	 0 - Linea: Tipo
Procesador estado> 	 0 - Linea: Valores
Procesador estado> 		 0 - Agregar valor
Procesador estado> 		 1 - Agregar valor
Procesador estado> 	 0 - Linea: sensores
Procesador estado> 		 0 - Crear regla de sensor
Procesador estado> 			 0 - Crear guid criterio
Procesador estado> 			 0 - Almacenar criterio
Procesador estado> 		 1 - Crear regla de sensor
Procesador estado> 			 1 - Crear guid criterio
Procesador estado> 			 1 - Almacenar criterio
Procesador estado> 	 0 - Linea: Diagnósticos
Procesador estado> 		 0 - Agregar diagnóstico
Procesador estado> 		 1 - Agregar diagnóstico
Procesador estado> 	 1 - Linea: Componente
Procesador estado> 	 1 - Linea: Alteracion
Procesador estado> 	 1 - Linea: Tipo
Procesador estado> 	 1 - Linea: Valores
Procesador estado> 		 0 - Agregar valor
Procesador estado> 	 1 - Linea: sensores
Procesador estado> 		 0 - Crear regla de sensor
Procesador estado> 			 0 - Crear guid criterio
Procesador estado> 			 0 - Almacenar criterio
Procesador estado> 		 1 - Crear regla de sensor
Procesador estado> 			 1 - Crear guid criterio
Procesador estado> 			 1 - Almacenar criterio
Procesador estado> 	 1 - Linea: Diagnósticos
Procesador estado> 		 0 - Agregar diagnóstico
Procesador estado> 		 1 - Agregar diagnóstico
```

## Realizar inferencia de salud

```ts

const GuidSensor = "temperatura";
const Lectura = 151;
const Historico = [48, 49, 50];

const estado: Aferencia = {
    GuidSensor,
    Lectura,
    Historico
}
procesador.aferencia(estado);

```

Ejemplo de salida:

```
Procesador estado> Iniciando Aferencia
Procesador estado> 	 - Buscando sensor
Procesador estado> 		 - Sensor temperatura/dGVtcGVyYXR1cmE
Procesador estado> 	 - Buscando reglas
Procesador estado> 		 - Reglas encontradas: 2
Procesador estado> Procesando criterios
Procesador estado> 		 - Positivos encontrados: 2
Procesador estado> Positivos encontrados
Procesador estado> 	 - Lineas afectadas: 2
Procesador estado> 		 - CPU/F01-sistema-ventilacion/Temperatura fuera de rango, diag: 2
Procesador estado> 			 - 0: Diag1
Procesador estado> 				 - 0: F01-apagar-ventilador
Procesador estado> 				 - 1: F01-iniciar-procesos-mantenimiento
Procesador estado> 			 - 1: Diag2
Procesador estado> 		 - CPU/F02-sistema-ventilacion/Temperatura fuera de rango, diag: 2
Procesador estado> 			 - 0: Diag1
Procesador estado> 				 - 0: F01-encender-ventilador
Procesador estado> 			 - 1: Diag2
Procesador estado> 				 - 0: F01-apagar-procesos-mantenimiento
```