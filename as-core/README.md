# FIA AI Framework Monorepo

This is a TypeScript monorepo containing multiple AI libraries and frameworks for FIA (Fundamentos de Inteligencia Artificial).

> ✅ **Migración ALEPHSCRIPT-MIGRATION-1.0.0**: Los paradigmas de `alephscript/` han sido migrados aquí.  
> Ver `packages/paradigmas/` para los 10 paradigmas de IA.

## Architecture

The FIA framework implements various AI paradigms and provides a runtime environment for executing them using World objects as data domains.

## Structure

### Packages
- **@fia/core** - Core interfaces and types (iFIA, IPercepto, IAccion, IMundo)
- **@fia/paradigmas** - 10 AI paradigms (logica, simbolica, conexionista, sbc, sbr, situada, cientifica, gramaticas, sistemas, hibrido) ✅ NEW
- **@fia/runtime** - Execution runtime and kernel
- **@fia/mundo** - World and data domains
- **@fia/search-algorithms** - Search algorithms (BFS, DFS, A*, etc.)
- **@fia/machine-learning** - Machine learning components (supervised/unsupervised)
- **@fia/grammars** - Grammar systems and dictionaries
- **@fia/devops** - DevOps utilities and file management
- **@fia/i18n** - Internationalization system

### Applications
- **@fia/launcher** - Thread launcher application

## Thread Types

The launcher can execute different types of AI threads:

- `runtime` - Basic runtime execution
- `sb` - Search algorithms (Search-Based)  
- `aa` - Machine learning (Automatic Learning)
- `grammar` - Grammar processing
- `ops` - DevOps operations
- `dic` - Dictionary operations
- `seed` - Seed/boilerplate operations
- `sdk` - SDK operations

## Usage

### Building the project
```bash
# Manual build (since workspaces have symlink issues on Windows)
./build.sh

# Or build individually
cd packages/core && npm install && npm run build
cd packages/runtime && npm install && npm run build
# ... continue for each package
```

### Running the launcher
```bash
cd apps/launcher
npm install
npm run build
npm start [thread-type]
```

Examples:
```bash
npm start runtime    # Run basic runtime
npm start aa         # Run machine learning thread
npm start grammar    # Run grammar processing thread
```

### Individual package usage
```typescript
import { Runtime } from '@fia/runtime';
import { CandidateElimination } from '@fia/machine-learning';
import { automataAritmeticoX } from '@fia/grammars';

const rt = new Runtime();
rt.start();
await rt.demo();
```

## Development

Each package can be developed independently:

```bash
cd packages/[package-name]
npm run dev    # Watch mode
npm run test   # Run tests
npm run lint   # Lint code
```

## Migration from Original

This monorepo structure replaces the original `alephscript/src/FIA` directory structure, organizing the various AI paradigms into focused, reusable packages while maintaining the original functionality through the launcher application.
