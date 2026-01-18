/**
 * API Request/Response Types
 * 
 * Types specific to the REST API layer
 */

import { IPercepto, IFIAInfo, IMundoState, AAIASessionMeta, IAAIAApp } from './aaia.types';

// ============================================
// Session Endpoints
// ============================================

export interface CreateSessionRequest {
    appId: string;
    config?: Record<string, unknown>;
}

export interface CreateSessionResponse {
    success: boolean;
    sessionId: string;
    appId: string;
    fiasCount: number;
    error?: string;
}

export interface ListSessionsResponse {
    success: boolean;
    sessions: AAIASessionMeta[];
    count: number;
}

export interface GetSessionResponse {
    success: boolean;
    session: AAIASessionMeta;
    fias: IFIAInfo[];
    mundo: IMundoState;
}

export interface DestroySessionResponse {
    success: boolean;
    sessionId: string;
    message: string;
}

// ============================================
// FIA Endpoints
// ============================================

export interface ListFIAsRequest {
    sessionId: string;  // query param
}

export interface ListFIAsResponse {
    success: boolean;
    sessionId: string;
    fias: IFIAInfo[];
    count: number;
}

export interface StepFIARequest {
    sessionId: string;
}

export interface StepFIAResponse {
    success: boolean;
    fiaId: number;
    eferencia?: {
        tipo: string;
        payload: Record<string, unknown>;
    };
    cycles?: number;
    executionTimeMs?: number;
}

export interface SendPerceptoRequest {
    sessionId: string;
    percepto: IPercepto;
}

export interface SendPerceptoResponse {
    success: boolean;
    processedBy: number[];
    timestamp: string;
}

export interface GetFIAStateResponse {
    success: boolean;
    fiaId: number;
    state: IFIAInfo;
}

// ============================================
// Mundo Endpoints
// ============================================

export interface GetMundoStateResponse {
    success: boolean;
    sessionId: string;
    mundo: IMundoState;
}

export interface QueryMundoRequest {
    sessionId: string;
    query: string;
}

export interface QueryMundoResponse {
    success: boolean;
    sessionId: string;
    result: Record<string, unknown>;
}

// ============================================
// Apps Endpoints
// ============================================

export interface ListAppsResponse {
    success: boolean;
    apps: Array<{
        id: string;
        nombre: string;
        descripcion?: string;
        paradigmaPrincipal: string;
        fiasCount: number;
    }>;
    count: number;
}

export interface GetAppResponse {
    success: boolean;
    app: IAAIAApp;
}

// ============================================
// Error Response
// ============================================

export interface ErrorResponse {
    error: string;
    message?: string;
    code?: string;
    details?: Record<string, unknown>;
}

// ============================================
// Health Check
// ============================================

export interface HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    mcpConnected: boolean;
    socketConnected?: boolean;
    timestamp: string;
}
