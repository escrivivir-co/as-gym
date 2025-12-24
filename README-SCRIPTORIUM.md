# AS-GYM: Integración con ALEPH Scriptorium

> **Rama**: `integration/beta/scriptorium`  
> **Versión de integración**: 1.0.0  
> **Fecha**: 2025-12-24

---

## Propósito

Este submódulo proporciona **"almas"** para los agentes del Scriptorium: paradigmas de Inteligencia Artificial que dan capacidad de razonamiento estructurado a los personajes creados con AGENT_CREATOR.

---

## Catálogo de Paradigmas

Ver: [fia-catalog.json](fia-catalog.json)

| Paradigma | Bandera Afín | Nivel | Descripción |
|-----------|--------------|-------|-------------|
| `logica` | @blueflag | Estable | Razonamiento proposicional y de predicados |
| `conexionista` | @yellowflag | Experimental | Redes neuronales, patrones emergentes |
| `simbolica` | @aleph | Estable | IA clásica, redes semánticas, frames |
| `sbc` | @revisor | Parcial | Razonamiento basado en casos |
| `sbr` | @blackflag | Estable | Sistemas basados en reglas IF-THEN |
| `situada` | @redflag | Experimental | IA embodied, reactiva |
| `hibrido` | @aleph | Experimental | Combinación de paradigmas |
| `cientifica` | @blueflag | Parcial | Método científico automatizado |
| `gramaticas` | @orangeflag | Estable | Gramáticas formales, parsing |
| `sistemas` | @redflag | Parcial | Teoría de sistemas, feedback |

---

## Modelo Destacado: Red Semántica

**Ubicación**: `alephscript/src/FIA/paradigmas/simbolica/modelos/formal/sistema/semantica/`

### Qué es

Una **red semántica** es un grafo de conceptos (entidades) conectados por arcos que representan relaciones. Permite:

- **Herencia de propiedades**: Un concepto hereda atributos de sus superclases
- **Inferencia por equiparación**: Buscar patrones en la red
- **Explicabilidad**: El razonamiento es trazable

### Arcos disponibles

| Tipo | Relación | Ejemplo |
|------|----------|---------|
| Estructural | SUBCLASE | `Perro` es subclase de `Mamífero` |
| Estructural | PARTE_DE | `Motor` es parte de `Coche` |
| Estructural | INSTANCIA_DE | `Rex` es instancia de `Perro` |
| Descriptivo | Propiedad | `Perro` tiene propiedad `ladra` |

### Interfaz TypeScript

```typescript
export interface IRedSemantica extends IModeloFormal {
    baseR: Base;
    cargar(red: any, entidades: IGrafo[]): void;
    crearNodosEntidad(clave: string): void;
    crearArcosSubclase(clase_hija: string): void;
    crearArcosParteDe(clase_padre: string): void;
    crearArcosInstanciaDe(clase_hija: string): void;
    crearArcosDescriptivos(clase_padre: string): void;
}
```

### Uso en Scriptorium

Un personaje con alma de "Red Semántica" puede operar en dos **épocas**:

1. **Época de Edición**: El usuario construye la red con ayuda del personaje
2. **Época de Consulta**: El personaje responde usando solo los conceptos de la red

---

## Integración con AGENT_CREATOR

### Flujo de 4 Ingredientes

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT_CREATOR (4 Ingredientes)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. METODOLOGÍA      2. CONOCIMIENTO    3. RAZONAMIENTO         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │ Agente Base  │   │ Fuente Datos │   │ Paradigma    │         │
│  │ @blueflag    │   │ DISCO/foro/  │   │ FIA          │         │
│  │ @blackflag   │   │ ENCICLOPEDIA │   │ ← AS-GYM     │         │
│  │ @yellowflag  │   │ ARCHIVO/     │   │              │         │
│  └──────────────┘   └──────────────┘   └──────────────┘         │
│                                                                  │
│                    4. HERRAMIENTAS                               │
│                    ┌──────────────┐                              │
│                    │ Preset MCP   │                              │
│                    │ tools, etc.  │                              │
│                    └──────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Ejemplo de Recipe con FIA

```json
{
  "name": "tutatix",
  "agentes_base": [
    { "id": "blueflag", "elementos_heredados": ["evidencia", "falsificabilidad"] }
  ],
  "fuentes_datos": [],
  "fia_paradigmas": [
    {
      "id": "simbolica",
      "modelo": "red_semantica",
      "capacidades_usadas": ["definir_entidades", "crear_arcos"]
    }
  ],
  "mcp_presets": [],
  "epochs": [
    { "id": "edicion", "modo": "write" },
    { "id": "consulta", "modo": "read" }
  ]
}
```

---

## Archivos de Integración

| Archivo | Propósito |
|---------|-----------|
| `fia-catalog.json` | Catálogo consultable por AGENT_CREATOR |
| `BACKLOG-SCRIPTORIUM.md` | Suposiciones y tasks de integración |
| `README-SCRIPTORIUM.md` | Este documento |

---

## No modificamos

Esta integración **NO modifica** el código fuente de `alephscript/src/FIA/`. Solo añade archivos de configuración y documentación para el consumo por el Scriptorium.

---

## Referencias

- **Proyecto padre**: [ALEPH Scriptorium](https://github.com/escrivivir-co/aleph-scriptorium)
- **Plugin AGENT_CREATOR**: `.github/plugins/agent-creator/`
- **Backlog de integración**: `ARCHIVO/DISCO/BACKLOG_BORRADORES/AS-GYM/`
