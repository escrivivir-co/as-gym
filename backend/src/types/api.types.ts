/**
 * API Request/Response Types
 * 
 * Re-exports from @alephscript/mcp-core-sdk for REST API layer
 * Plus backend-specific types not in core
 * 
 * @épica AAIA-BACKEND-1.0.0 (types unification)
 * @fecha 2026-01-18
 */

// ============================================
// Re-exports from mcp-core-sdk
// ============================================

export {
    // API Response Types (AAIA-prefixed)
    type AAIACreateSessionResponse,
    type AAIAListSessionsResponse,
    type AAIAGetSessionResponse,
    type AAIADestroySessionResponse,
    type AAIAListFIAsResponse,
    type AAIAStepFIAResponse,
    type AAIAGetFIAStateResponse,
    type AAIASendPerceptoResponse,
    type AAIAGetMundoStateResponse,
    type AAIAQueryMundoResponse,
    type AAIAListAppsResponse,
    type AAIAErrorResponse,
} from '@alephscript/mcp-core-sdk';

// Re-export core types needed by API
export {
    type IPercepto,
    type IFIAInfo,
    type IMundoState,
    type AAIASessionMeta,
    type IAAIAApp,
} from './aaia.types';

// ============================================
// Backend-Specific Request Types
// ============================================

export interface CreateSessionRequest {
    appId: string;
    config?: Record<string, unknown>;
}

export interface ListFIAsRequest {
    sessionId: string;
}

export interface StepFIARequest {
    sessionId: string;
}

export interface SendPerceptoRequest {
    sessionId: string;
    percepto: import('./aaia.types').IPercepto;
}

export interface QueryMundoRequest {
    sessionId: string;
    query: string;
}

// ============================================
// Backend-Specific Response Types (not in core)
// ============================================

export interface GetAppResponse {
    success: boolean;
    app: import('./aaia.types').IAAIAApp;
}

export interface HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    mcpConnected: boolean;
    socketConnected?: boolean;
    timestamp: string;
}

// ============================================
// Type Aliases for backward compatibility
// (map old names to new AAIA-prefixed names)
// ============================================

export type { AAIACreateSessionResponse as CreateSessionResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAListSessionsResponse as ListSessionsResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAGetSessionResponse as GetSessionResponse } from '@alephscript/mcp-core-sdk';
export type { AAIADestroySessionResponse as DestroySessionResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAListFIAsResponse as ListFIAsResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAStepFIAResponse as StepFIAResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAGetFIAStateResponse as GetFIAStateResponse } from '@alephscript/mcp-core-sdk';
export type { AAIASendPerceptoResponse as SendPerceptoResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAGetMundoStateResponse as GetMundoStateResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAQueryMundoResponse as QueryMundoResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAListAppsResponse as ListAppsResponse } from '@alephscript/mcp-core-sdk';
export type { AAIAErrorResponse as ErrorResponse } from '@alephscript/mcp-core-sdk';
