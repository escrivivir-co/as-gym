/**
 * ServerService Migration Script
 * 
 * Este archivo documenta los cambios necesarios para migrar
 * ServerService de paths relativos a @alephscript/mcp-core-sdk/browser
 * 
 * ANTES (paths relativos problemáticos):
 * ```typescript
 * import { IServerState } from "../../../../../ws-server/src/alephscript/IServerState";
 * import { IRuntimeBlock } from '../../../../../ws-server/src/alephscript/IRuntimeBlock'
 * import { IAppState } from '../../../../../ws-server/src/alephscript/IAppState'
 * import { IMenuState } from '../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
 * import { SudokuData } from '../../../../../alephscript/src/FIA/engine/kernel/sudoku';
 * ```
 * 
 * DESPUÉS (imports DRY desde SDK):
 * ```typescript
 * import type { 
 *   IServerState, 
 *   IRuntimeBlock, 
 *   IAppState, 
 *   IMenuState 
 * } from '@alephscript/mcp-core-sdk/browser';
 * // o desde modelos locales:
 * import type { 
 *   IServerState, 
 *   IRuntimeBlock, 
 *   IAppState, 
 *   IMenuState 
 * } from '../../models';
 * ```
 * 
 * ARCHIVOS A MIGRAR:
 * 1. src/app/services/socketio/server.service.ts
 * 2. src/app/pages/general/home/home.component.ts
 * 3. src/app/pages/general/about/about.component.ts
 * 
 * NOTA: SudokuData es específico del juego Sudoku y debe mantenerse local
 * o añadirse a un módulo de tipos de juegos.
 */

// Ejemplo de migración completa para ServerService:

/*
// ELIMINAR estas líneas:
import { SocketClient } from '../../../../../ws-server/src/alephscript/socket-client';
import { IMenuState } from '../../../../../alephscript/src/FIA/engine/kernel/IMenuState';
import { IServerState } from "../../../../../ws-server/src/alephscript/IServerState";
import { IRuntimeBlock } from '../../../../../ws-server/src/alephscript/IRuntimeBlock'
import { IAppState } from '../../../../../ws-server/src/alephscript/IAppState'
import { SudokuData } from '../../../../../alephscript/src/FIA/engine/kernel/sudoku';

// AÑADIR estas líneas:
import type { 
  IServerState, 
  IRuntimeBlock, 
  IAppState, 
  IMenuState 
} from '../../models';

// Para SudokuData, crear interface local o en models/game.model.ts
export interface SudokuData {
  // campos según uso actual
}

// Para SocketClient, importar desde mcp-core-sdk client (si disponible)
// o mantener import local
*/

export {};
