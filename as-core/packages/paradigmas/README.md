# @fia/paradigmas

Los 10 paradigmas de Inteligencia Artificial del framework FIA.

## Instalación

```bash
npm install @fia/paradigmas
```

## Paradigmas Disponibles

| Paradigma | Estado | Descripción |
|-----------|--------|-------------|
| `logica` | ✅ Completo | Resolución SLD (Prolog) |
| `simbolica` | 📝 Stub | Marcos y redes semánticas |
| `conexionista` | 📝 Stub | Redes neuronales |
| `sbc` | 📝 Stub | Sistemas basados en conocimiento |
| `sbr` | 📝 Stub | Sistemas basados en reglas |
| `situada` | 📝 Stub | IA embodied y robótica |
| `cientifica` | 📝 Stub | Descubrimiento automatizado |
| `gramaticas` | 📝 Stub | NLP con gramáticas formales |
| `sistemas` | 📝 Stub | Multi-agente |
| `hibrido` | ✅ Parcial | Combinación de paradigmas |

## Uso Básico

```typescript
import { createFIA, FIAFactory } from '@fia/paradigmas';

// Crear FIA con paradigma lógico
const fia = await createFIA({
    nombre: 'mi-fia',
    paradigma: 'logica',
    paradigmaConfig: {
        programa: [
            'padre(juan, maria).',
            'padre(juan, pedro).',
            'hermano(X, Y) := padre(Z, X) and padre(Z, Y).'
        ]
    }
});

// Ejecutar ciclo de razonamiento
const resultado = await fia.ciclo({
    tipo: 'query',
    payload: { query: 'hermano(maria, Y)' }
});

console.log(resultado.acciones); 
// [{ tipo: 'solucion', payload: { bindings: { Y: 'pedro' } } }]
```

## API

### FIAFactory

```typescript
const factory = FIAFactory.getInstance();

// Crear FIA genérica
const fia = await factory.crear({ nombre, paradigma, mundo?, paradigmaConfig? });

// Crear FIA lógica (atajo)
const fiaLogica = await factory.crearLogica(nombre, programa, mundo?);

// Crear FIA híbrida
const fiaHibrida = await factory.crearHibrido(nombre, ['logica', 'simbolica'], mundo?);

// Listar paradigmas
const paradigmas = factory.listarParadigmas();
```

### ParadigmaLogica

```typescript
import { ParadigmaLogica } from '@fia/paradigmas';

const logica = new ParadigmaLogica();
await logica.inicializar({ programa: [...] });

// Consulta directa
const { exito, soluciones } = logica.consultar('padre(juan, X)');

// Añadir hecho
logica.assertz('madre(ana, maria).');
```

## Migración desde alephscript

Este paquete es la migración modular de `alephscript/src/FIA/paradigmas`.

| Origen | Destino |
|--------|---------|
| `alephscript/src/FIA/paradigmas/logica/` | `@fia/paradigmas/logica` |
| `alephscript/src/FIA/paradigmas/simbolica/` | `@fia/paradigmas/simbolica` |
| ... | ... |

## Épica

- **Épica**: ALEPHSCRIPT-MIGRATION-1.0.0
- **Fase**: 1 - Completar Monorepo
- **Puntos**: 21 pts (de 55 total)

## Licencia

AIPL v1.0 - Ver LICENSE.md
