/**
 * AAIA Models - Types for AAIAGallery frontend
 * 
 * Re-exported from @alephscript/mcp-core-sdk/browser
 * following the PrologEditor pattern.
 * 
 * @see PrologEditor/frontend/src/app/models/ for reference pattern
 */

// Core types
export type {
  FIAParadigma,
  IPercepto,
  IEferencia,
  IFIAInfo,
  IMundoState,
  AAIASession,
  AAIASessionMeta,
  IAAIAApp,
  IFIAConfig,
  IMundoConfig,
} from '@alephscript/mcp-core-sdk/browser';

// Enum (value export, not just type)
export { RunStateEnum } from '@alephscript/mcp-core-sdk/browser';

// MCP Tool Args/Results
export type {
  AAIACreateSessionArgs,
  AAIACreateSessionResult,
  AAIAListFIAsArgs,
  AAIAListFIAsResult,
  AAIAStepFIAArgs,
  AAIAStepFIAResult,
  AAIASendPerceptoArgs,
  AAIASendPerceptoResult,
} from '@alephscript/mcp-core-sdk/browser';

// API Response Types (for HTTP client usage)
export type {
  AAIACreateSessionResponse,
  AAIAListSessionsResponse,
  AAIAGetSessionResponse,
  AAIADestroySessionResponse,
  AAIAListFIAsResponse,
  AAIAStepFIAResponse,
  AAIAGetFIAStateResponse,
  AAIASendPerceptoResponse,
  AAIAGetMundoStateResponse,
  AAIAQueryMundoResponse,
  AAIAListAppsResponse,
  AAIAErrorResponse,
} from '@alephscript/mcp-core-sdk/browser';

// Frontend state types (for ServerService)
export type {
  IMenuState,
  IRuntimeBlock,
  IAppState,
  AAIARoomEvent,
  PersefonBotCapability,
} from '@alephscript/mcp-core-sdk/browser';

// ============================================
// Local Extended Types (Domain-Specific)
// ============================================

/**
 * Extended modelo type with known domain properties
 * Used in templates that access specific model fields
 */
export interface IModeloExtended {
    dia?: number;
    muerte?: number;
    dominio?: {
        base?: Record<string, unknown>;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

/**
 * Extended mundo state with typed modelo
 */
export interface IMundoStateExtended {
    nombre: string;
    vivo: boolean;
    runState: import('@alephscript/mcp-core-sdk/browser').RunStateEnum;
    modelo: IModeloExtended;
    fiasCount: number;
    renderer?: string;
}

/**
 * Extended menu state with typed mundo
 */
export interface IMenuStateExtended {
    index: number;
    name: string;
    state: import('@alephscript/mcp-core-sdk/browser').RunStateEnum;
    mundo?: Partial<IMundoStateExtended>;
    bots?: import('@alephscript/mcp-core-sdk/browser').IFIAInfo[];
}

// Socket.IO / Server types
export type {
  IServerState,
} from '@alephscript/mcp-core-sdk/browser';
