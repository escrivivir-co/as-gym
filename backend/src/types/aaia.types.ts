/**
 * AAIA Backend Types
 * 
 * Re-exports from @alephscript/mcp-core-sdk for type safety
 * Single Source of Truth: mcp-core-sdk/types/aaia
 * 
 * @épica AAIA-BACKEND-1.0.0 (types unification)
 * @fecha 2026-01-18
 */

// ============================================
// Re-exports from mcp-core-sdk (Single Source of Truth)
// ============================================

export {
    // Core Enums
    RunStateEnum,
    
    // Core Type Aliases
    type FIAParadigma,
    
    // Core Interfaces
    type IPercepto,
    type IEferencia,
    type IFIAInfo,
    type IMundoState,
    
    // Session Types
    type AAIASession,
    type AAIASessionMeta,
    
    // App Types
    type IAAIAApp,
    type IFIAConfig,
    type IMundoConfig,
    
    // MCP Tool Arguments & Results
    type AAIACreateSessionArgs,
    type AAIACreateSessionResult,
    type AAIAListFIAsArgs,
    type AAIAListFIAsResult,
    type AAIAStepFIAArgs,
    type AAIAStepFIAResult,
    type AAIASendPerceptoArgs,
    type AAIASendPerceptoResult,
    type AAIAQueryMundoArgs,
    type AAIAQueryMundoResult,
    type AAIASetFIAStateArgs,
    type AAIASetFIAStateResult,
    
    // Socket.IO / PersefonBot Types
    type PersefonBotCapability,
    type AAIARoomEvent,
    
    // Frontend State Types
    type IMenuState,
    type IRuntimeBlock,
    type IAppState,
    
    // Default Config
    DEFAULT_AAIA_MCP_SERVER_CONFIG,
} from '@alephscript/mcp-core-sdk';
