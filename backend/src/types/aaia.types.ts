/**
 * AAIA Backend Types
 * 
 * Re-exports from @alephscript/mcp-core-sdk for type safety
 * Local types for backend-specific concerns
 */

// ============================================
// Re-exports from mcp-core-sdk (when available via npm link)
// ============================================

// For now, inline the types until npm link is configured
// TODO: Replace with: export * from '@alephscript/mcp-core-sdk/types/aaia';

// ============================================
// Core Enums
// ============================================

export enum RunStateEnum {
    PLAY = "PLAY",
    PLAY_STEP = "PLAY_STEP",
    PAUSE = "PAUSE",
    STOP = "STOP"
}

export type FIAParadigma = 
    | 'logica'
    | 'simbolica'
    | 'conexionista'
    | 'sbc'
    | 'sbr'
    | 'situada'
    | 'sistemas'
    | 'cientifica'
    | 'gramaticas'
    | 'hibrido';

// ============================================
// Core Interfaces
// ============================================

export interface IPercepto {
    tipo: 'sensor' | 'evento' | 'comando';
    fuente?: string;
    payload: Record<string, unknown>;
    timestamp?: string;
}

export interface IEferencia {
    tipo: 'accion' | 'dato' | 'evento' | 'estado' | 'noop';
    payload: Record<string, unknown>;
    timestamp?: string;
}

export interface IFIAInfo {
    index: number;
    nombre: string;
    paradigma: FIAParadigma;
    runState: RunStateEnum;
    runAsync: boolean;
    capacidades?: string[];
}

export interface IMundoState {
    nombre: string;
    vivo: boolean;
    runState: RunStateEnum;
    modelo: Record<string, unknown>;
    fiasCount: number;
    renderer?: string;
}

// ============================================
// Session Types
// ============================================

export interface AAIASession {
    sessionId: string;
    appId: string;
    createdAt: Date;
    lastUsedAt: Date;
    mundo: IMundoState;
    fias: IFIAInfo[];
}

export interface AAIASessionMeta {
    sessionId: string;
    appId: string;
    createdAt: string;
    lastUsedAt: string;
    ageMinutes: number;
    fiasCount: number;
    mundoState: RunStateEnum;
}

// ============================================
// App Types
// ============================================

export interface IAAIAApp {
    id: string;
    nombre: string;
    descripcion?: string;
    paradigmaPrincipal: FIAParadigma;
    fias: IFIAConfig[];
    mundoConfig?: IMundoConfig;
}

export interface IFIAConfig {
    nombre: string;
    paradigma: FIAParadigma;
    clase: string;
    modulo?: string;
    runAsync?: boolean;
    config?: Record<string, unknown>;
}

export interface IMundoConfig {
    nombre: string;
    modeloInicial?: Record<string, unknown>;
    renderer?: string;
}

// ============================================
// MCP Tool Arguments & Results
// ============================================

export interface AAIACreateSessionArgs {
    appId: string;
}

export interface AAIACreateSessionResult {
    success: boolean;
    sessionId?: string;
    appId?: string;
    error?: string;
    fiasCount?: number;
}

export interface AAIAListFIAsArgs {
    sessionId: string;
}

export interface AAIAListFIAsResult {
    success: boolean;
    sessionId: string;
    fias?: IFIAInfo[];
    error?: string;
}

export interface AAIAStepFIAArgs {
    sessionId: string;
    fiaIndex: number;
}

export interface AAIAStepFIAResult {
    success: boolean;
    fiaIndex: number;
    runState: RunStateEnum;
    cycles?: number;
    eferencia?: IEferencia;
    executionTimeMs?: number;
    error?: string;
}

export interface AAIASendPerceptoArgs {
    sessionId: string;
    percepto: IPercepto;
}

export interface AAIASendPerceptoResult {
    success: boolean;
    sessionId: string;
    percepto?: IPercepto;
    processedBy?: number[];
    error?: string;
}

export interface AAIAQueryMundoArgs {
    sessionId: string;
}

export interface AAIAQueryMundoResult {
    success: boolean;
    sessionId: string;
    mundo?: IMundoState;
    error?: string;
}

export interface AAIASetFIAStateArgs {
    sessionId: string;
    fiaIndex: number;
    state: RunStateEnum;
}

export interface AAIASetFIAStateResult {
    success: boolean;
    fiaIndex: number;
    previousState?: RunStateEnum;
    newState?: RunStateEnum;
    error?: string;
}

// ============================================
// Socket.IO / PersefonBot Types
// ============================================

export type PersefonBotCapability =
    | 'AAIA_GET_APPS'
    | 'AAIA_CREATE_SESSION'
    | 'AAIA_LIST_SESSIONS'
    | 'AAIA_DESTROY_SESSION'
    | 'AAIA_LIST_FIAS'
    | 'AAIA_START_FIA'
    | 'AAIA_STOP_FIA'
    | 'AAIA_STEP_FIA'
    | 'AAIA_PLAY_FIA'
    | 'AAIA_PAUSE_FIA'
    | 'AAIA_SEND_PERCEPTO'
    | 'AAIA_GET_EFERENCIA'
    | 'AAIA_QUERY_MUNDO';

export interface AAIARoomEvent {
    eventType: PersefonBotCapability;
    sessionId?: string;
    payload?: Record<string, unknown>;
    timestamp: string;
}

// ============================================
// Frontend State Types
// ============================================

export interface IMenuState {
    index: number;
    name: string;
    state: RunStateEnum;
    mundo?: Partial<IMundoState>;
    bots?: IFIAInfo[];
}

export interface IRuntimeBlock {
    id: string;
    estado: Record<string, unknown>;
    fecha: Date | string;
}

export interface IAppState {
    index: number;
    name: string;
    fase?: string;
}
