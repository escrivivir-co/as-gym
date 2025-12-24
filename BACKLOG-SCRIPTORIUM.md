# Backlog de Integración: AS-GYM ↔ Scriptorium

> **Submódulo**: as-gym  
> **Rama**: integration/beta/scriptorium  
> **Proyecto padre**: ALEPH Scriptorium  
> **Épica padre**: SCRIPT-1.10.0 (Almas para Agentes)

---

## Propósito

Este backlog documenta las **suposiciones y decisiones** tomadas al integrar AS-GYM con el plugin AGENT_CREATOR del Scriptorium.

**Objetivo principal**: Exponer los paradigmas FIA como "almas" seleccionables para agentes personalizados.

---

## Suposiciones Documentadas

### S1: Estructura del Catálogo FIA

**Suposición**: Se crea un archivo `fia-catalog.json` en la raíz del submódulo que actúa como índice consultable de paradigmas.

**Razón**: El Scriptorium necesita una interfaz declarativa para ofrecer paradigmas al usuario, sin requerir conocimiento de la estructura interna de TypeScript.

**Impacto**: Si la estructura de `paradigmas/` cambia, `fia-catalog.json` debe actualizarse.

---

### S2: Modelos dentro de Paradigmas

**Suposición**: Algunos paradigmas contienen **sub-modelos** (ej: `simbolica` → `red_semantica`, `frames`).

**Razón**: El caso de uso Tutatix requiere seleccionar la Red Semántica específicamente, no solo el paradigma simbólico general.

**Impacto**: El catálogo incluye un campo `modelos` por paradigma que lista los modelos concretos disponibles.

---

### S3: Persistencia de Estado FIA

**Suposición**: Los modelos FIA pueden generar **estado persistente** que se guarda por agente.

**Razón**: Una red semántica construida en "época de edición" debe persistir para usarse en "época de conversación".

**Impacto**: Se define una convención de carpeta `fia/` dentro de cada agente creado.

```
ARCHIVO/PLUGINS/AGENT_CREATOR/agents/created/{agente}/
├── {agente}.agent.md
├── {agente}.recipe.json
└── fia/
    └── {modelo}.json    # Estado persistido (ej: red_semantica.json)
```

---

### S4: Afinidad Paradigma ↔ Bandera

**Suposición**: Cada paradigma tiene afinidad natural con ciertas banderas del Scriptorium.

**Razón**: Guía al usuario en la selección de paradigma según el tipo de auditoría que desea.

**Tabla de afinidades**:

| Paradigma | Bandera Primaria | Razón |
|-----------|------------------|-------|
| `logica` | @blueflag | Verdad formal |
| `conexionista` | @yellowflag | Patrones emergentes |
| `simbolica` | @aleph | Producción de símbolos |
| `sbc` | @revisor | Casos precedentes |
| `sbr` | @blackflag | Reglas de poder |
| `situada` | @redflag | Contexto material |
| `hibrido` | @aleph | Orquestación |
| `cientifica` | @blueflag | Falsificabilidad |
| `gramaticas` | @orangeflag | Registro formal |
| `sistemas` | @redflag | Emergencia, escala |

---

### S5: No se modifica código TypeScript

**Suposición**: La integración NO modifica el código fuente de `alephscript/src/FIA/`.

**Razón**: Mantener compatibilidad con el proyecto as-gym original.

**Impacto**: Toda la integración es mediante archivos de configuración y documentación.

---

## Tasks del Submódulo

| ID | Descripción | Status |
|----|-------------|--------|
| ASGYM-001 | Crear `fia-catalog.json` con 10 paradigmas | ✅ |
| ASGYM-002 | Añadir campo `modelos` a paradigma `simbolica` | ✅ |
| ASGYM-003 | Documentar interfaz `IRedSemantica` | ✅ |
| ASGYM-004 | Crear README de integración | ✅ |
| ASGYM-005 | Documentar schema de estado persistido | ⏳ |

---

## Archivos Añadidos (Scriptorium Integration)

| Archivo | Propósito |
|---------|-----------|
| `fia-catalog.json` | Catálogo de paradigmas para AGENT_CREATOR |
| `BACKLOG-SCRIPTORIUM.md` | Este archivo |
| `README-SCRIPTORIUM.md` | Guía de integración |

---

## Sincronización con Proyecto Padre

**Épica padre**: SCRIPT-1.10.0 en `.github/BACKLOG-SCRIPTORIUM.md`

**Backlog borrador**: `ARCHIVO/DISCO/BACKLOG_BORRADORES/AS-GYM/02_backlog-sprint-asgym.md`

**Análisis de gaps**: `ARCHIVO/DISCO/BACKLOG_BORRADORES/AS-GYM/03_gap-analysis-tutatix.md`

---

## Changelog

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-12-24 | Crear BACKLOG-SCRIPTORIUM.md | @scrum |
| 2025-12-24 | Crear fia-catalog.json | @scrum |
| 2025-12-24 | Crear README-SCRIPTORIUM.md | @scrum |
