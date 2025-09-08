# AlephScript FIA – Checklist de Migración de Paradigmas

Fecha: 2025-09-08

Leyenda:
- Tipo: archivo | directorio | imagen | script | modelo
- Migrado: marque [x] cuando el elemento esté migrado y verificado

## Global

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| Global | I18n base | `alephscript-i18.ts` | archivo | [ ] | Texto i18n global |

## científica

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| científica | I18n | `cientifica/cientifica-i18.ts` | archivo | [ ] | |
| científica | Núcleo | `cientifica/paradigma.ts` | archivo | [ ] | Contrato/entrada del paradigma |

## conexionista

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| conexionista | I18n | `conexionista/as-conexionista-i18.ts` | archivo | [ ] | |
| conexionista | Núcleo | `conexionista/fia-conexionista.ts` | archivo | [ ] | Orquestación/conector |
| conexionista | Núcleo | `conexionista/paradigma.ts` | archivo | [ ] | Contrato del paradigma |
| conexionista | Componentes | `conexionista/canalizacion.ts` | archivo | [ ] | Pipeline/IO |
| conexionista | Componentes | `conexionista/clasificador.ts` | archivo | [ ] | Wrapper de clasificación |
| conexionista | ONNX | `conexionista/model.onnx` | modelo | [ ] | Peso del modelo |
| conexionista | ONNX | `conexionista/onnx.ts` | archivo | [ ] | Carga/evaluación ONNX |
| conexionista | Arquitectura RN | `conexionista/red-neuronal.ts` | archivo | [ ] | Definición/arquitectura |
| conexionista | Submódulo: rna | `conexionista/rna/activacion.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/entrenar.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/neurona.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/problema.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/README.md` | archivo | [ ] | Doc |
| conexionista | Submódulo: rna | `conexionista/rna/red-clasificacion.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/red-regresion.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/red.ts` | archivo | [ ] | |
| conexionista | Submódulo: rna | `conexionista/rna/perceptron/` | directorio | [ ] | Contenido no listado |
| conexionista | Submódulo: modelos-lenguaje | `conexionista/modelos-lenguaje/inferencia-modelo-lenguaje.ts` | archivo | [ ] | |
| conexionista | Submódulo: modelos-lenguaje | `conexionista/modelos-lenguaje/inferencia-oai.ts` | archivo | [ ] | |
| conexionista | Submódulo: modelos-lenguaje | `conexionista/modelos-lenguaje/Inferencia-open-ai.ts` | archivo | [ ] | |
| conexionista | Submódulo: modelos-lenguaje | `conexionista/modelos-lenguaje/oai/` | directorio | [ ] | Contenido no listado |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/datos.ts` | archivo | [ ] | |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/estudiante.ts` | archivo | [ ] | |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/mimetico.ts` | archivo | [ ] | |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/modelo.ts` | archivo | [ ] | |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/oraculo.ts` | archivo | [ ] | |
| conexionista | Submódulo: aprendize-mimetico | `conexionista/aprendize-mimetico/README.md` | archivo | [ ] | Doc |
| conexionista | Submódulo: mixxer | `conexionista/mixxer/README.md` | archivo | [ ] | Doc |
| conexionista | Submódulo: mixxer | `conexionista/mixxer/PoCs/` | directorio | [ ] | Experimentos (no listados) |

## gramáticas

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| gramáticas | Núcleo | `gramaticas/automata.ts` | archivo | [ ] | |
| gramáticas | Núcleo | `gramaticas/gramatica.ts` | archivo | [ ] | |
| gramáticas | Núcleo | `gramaticas/lexico.ts` | archivo | [ ] | |
| gramáticas | Núcleo | `gramaticas/paradigma.ts` | archivo | [ ] | |
| gramáticas | Diccionarios | `gramaticas/diccionarios/base-dic.ts` | archivo | [ ] | |
| gramáticas | Diccionarios | `gramaticas/diccionarios/get-free-dict.sh` | script | [ ] | |
| gramáticas | Diccionarios | `gramaticas/diccionarios/data/` | directorio | [ ] | Datos léxicos |
| gramáticas | TLP Compiler | `gramaticas/tlp-compiler/README.md` | archivo | [ ] | Doc |
| gramáticas | TLP Compiler | `gramaticas/tlp-compiler/alephscript-tlp-compiler-cartel.png` | imagen | [ ] | |
| gramáticas | TLP Compiler | `gramaticas/tlp-compiler/alephscript-uml.png` | imagen | [ ] | |
| gramáticas | TLP Compiler | `gramaticas/tlp-compiler/reto_plugin_tlp_compiler.png` | imagen | [ ] | |
| gramáticas | TLP Compiler | `gramaticas/tlp-compiler/tlp-compiler-alephscript-plugin.png` | imagen | [ ] | |

## híbrido

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| híbrido | I18n | `hibrido/as-hibrida-i18.ts` | archivo | [ ] | |
| híbrido | Núcleo | `hibrido/fia-hibrida.ts` | archivo | [ ] | |
| híbrido | Núcleo | `hibrido/paradigma.ts` | archivo | [ ] | |
| híbrido | Semilla | `hibrido/semilla/situada.ts` | archivo | [ ] | Bootstrap situada |

## lógica

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| lógica | Documentación | `logica/README.md` | archivo | [ ] | |
| lógica | Hilos | `logica/resolucion-thread.ts` | archivo | [ ] | |
| lógica | Hilos | `logica/unificador-thread.ts` | archivo | [ ] | |
| lógica | Resolución | `logica/resolucion/arbol.ts` | archivo | [ ] | |
| lógica | Resolución | `logica/resolucion/parser.ts` | archivo | [ ] | |
| lógica | Resolución | `logica/resolucion/programa-test.ts` | archivo | [ ] | Test |
| lógica | Resolución | `logica/resolucion/resolver.ts` | archivo | [ ] | |
| lógica | Unificación | `logica/unificador/IDeclaracion.ts` | archivo | [ ] | |
| lógica | Unificación | `logica/unificador/dT.ts` | archivo | [ ] | |
| lógica | Unificación | `logica/unificador/dTF.ts` | archivo | [ ] | |
| lógica | Unificación | `logica/unificador/unificacion-general.ts` | archivo | [ ] | |
| lógica | Unificación (assets) | `logica/unificador/00001unificador-general.png` | imagen | [ ] | |
| lógica | Unificación (assets) | `logica/unificador/00002unificador-general.png` | imagen | [ ] | |

## sbc

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| sbc | I18n | `sbc/as-sbc-i18.ts` | archivo | [ ] | |
| sbc | Núcleo | `sbc/fia-sbc.ts` | archivo | [ ] | |
| sbc | Estudio | `sbc/estudio.ts` | archivo | [ ] | |
| sbc | Documentación | `sbc/README.md` | archivo | [ ] | |
| sbc | Docs (assets) | `sbc/docs/commonkads_tooling.gif` | imagen | [ ] | |
| sbc | Implementaciones | `sbc/implementaciones/common-kads/` | directorio | [ ] | Contenido no listado |

## sbr

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| sbr | Documentación | `sbr/README.md` | archivo | [ ] | |
| sbr | Script | `sbr/server.sh` | script | [ ] | |
| sbr | App base | `sbr/app/aleph-null.ts` | archivo | [ ] | |
| sbr | App módulo | `sbr/app/algoritmo/` | directorio | [ ] | |
| sbr | App módulo | `sbr/app/prolog/` | directorio | [ ] | |
| sbr | App módulo | `sbr/app/src/` | directorio | [ ] | |
| sbr | App módulo | `sbr/app/swipl-stdio/` | directorio | [ ] | SWI-Prolog IO |

## simbólica

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| simbólica | I18n | `simbolica/as-simbolica-i18.ts` | archivo | [ ] | |
| simbólica | Núcleo | `simbolica/fia-simbolica.ts` | archivo | [ ] | |
| simbólica | Motor | `simbolica/inferencia.ts` | archivo | [ ] | |
| simbólica | Núcleo | `simbolica/paradigma.ts` | archivo | [ ] | |
| simbólica | Reglas | `simbolica/regla.ts` | archivo | [ ] | |
| simbólica | Automático | `simbolica/automatico/data.ts` | archivo | [ ] | |
| simbólica | Automático (assets) | `simbolica/automatico/espacioversiones_data.png` | imagen | [ ] | |
| simbólica | Automático (assets) | `simbolica/automatico/espacioversiones_data_2.png` | imagen | [ ] | |
| simbólica | Automático (assets) | `simbolica/automatico/espacioversiones_data_3.png` | imagen | [ ] | |
| simbólica | Modelos | `simbolica/modelos/computable/` | directorio | [ ] | |
| simbólica | Modelos | `simbolica/modelos/conceptual/` | directorio | [ ] | |
| simbólica | Modelos | `simbolica/modelos/formal/` | directorio | [ ] | |
| simbólica | Ontologías | `simbolica/ontologias/README.md` | archivo | [ ] | Doc |

## sistemas

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| sistemas | Documentación | `sistemas/README.md` | archivo | [ ] | |
| sistemas | AA | `sistemas/aprendizaje-automatico/supervisado/` | directorio | [ ] | |
| sistemas | Búsquedas | `sistemas/busquedas/AEstrella.ts` | archivo | [ ] | |
| sistemas | Búsquedas | `sistemas/busquedas/BestFirst.ts` | archivo | [ ] | |
| sistemas | Búsquedas | `sistemas/busquedas/agbg.ts` | archivo | [ ] | |
| sistemas | Búsquedas (asset) | `sistemas/busquedas/arbol.png` | imagen | [ ] | |
| sistemas | Búsquedas | `sistemas/busquedas/...` | — | [ ] | Faltan más archivos (no listados) |
| sistemas | Modelica | `sistemas/modelica/README.md` | archivo | [ ] | |
| sistemas | Modelica | `sistemas/modelica/...` | — | [ ] | Faltan más archivos (no listados) |
| sistemas | Scraper | `sistemas/scraper/` | directorio | [ ] | Contenido no listado |

## situada

| Paradigma | Elemento principal | Ruta | Tipo | Migrado | Notas |
|---|---|---|---|---|---|
| situada | I18n | `situada/as-situada-i18.ts` | archivo | [ ] | |
| situada | Núcleo | `situada/fia-situada.ts` | archivo | [ ] | |
| situada | Núcleo | `situada/paradigma.ts` | archivo | [ ] | |
| situada | Estados | `situada/automata.ts` | archivo | [ ] | |
| situada | Estados | `situada/estado.ts` | archivo | [ ] | |
| situada | Estados | `situada/IEstado.ts` | archivo | [ ] | |
| situada | Estados | `situada/IEstadoT.ts` | archivo | [ ] | |
| situada | Estados | `situada/tabla-estado.ts` | archivo | [ ] | |
| situada | Documentación | `situada/README.md` | archivo | [ ] | |
| situada | Documentación | `situada/docs/` | directorio | [ ] | Contenido no listado |
