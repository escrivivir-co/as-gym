/**
 * PersefonBot - Socket.IO client for AAIA Backend mesh communication
 * 
 * 👑 Perséfone (Περσεφόνη) - Reina del Inframundo, hija de Deméter
 * 
 * Es el bot que conecta el AAIA Backend con el AlephScript mesh,
 * actuando como MASTER de AAIA_ROOM para orquestar las sesiones de FIAs.
 * 
 * Panteón de Bots AlephScript:
 * - AracneBot 🕷️ (tejedora) → VS Code Extension
 * - ProserpinaBot 🌸 (primavera) → DevOps Server
 * - EuridiceBot 🎭 (lira) → Prolog Server
 * - PersefonBot 👑 (reina) → AAIA Backend ← Este
 * - HefestoBot 🔨 (forja) → Node-RED/Wiring
 * - HermesBot ⚡ (mensajero) → ws-server central
 * 
 * Capacidades:
 * - MASTER de AAIA_ROOM: Orquesta eventos de FIAs
 * - Responde a ENGINE_THREADS: GET_LIST_OF_THREADS, GET_THREAD_STATE
 * - Emite eventos: fia_step, percepto, eferencia, mundo_state
 * 
 * @épica AAIA-BACKEND-1.0.0
 * @fecha 2026-01-18
 */

import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';

// ============================================
// Configuration
// ============================================

export interface PersefonBotConfig {
    socketUrl: string;
    namespace: string;
    autoConnect: boolean;
    reconnection: boolean;
    reconnectionAttempts: number;
}

export const DEFAULT_PERSEFON_CONFIG: PersefonBotConfig = {
    socketUrl: process.env.SOCKET_URL || 'http://localhost:3010',
    namespace: '/runtime',
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
};

// ============================================
// Room Constants
// ============================================

const AAIA_ROOM = 'AAIA_ROOM';
const ENGINE_THREADS_ROOM = 'ENGINE_THREADS';

const PERSEFON_CAPABILITIES = [
    'GET_LIST_OF_THREADS',
    'GET_THREAD_STATE',
    'THREAD_STEP',
    'THREAD_PERCEPTO',
    'SESSION_CREATE',
    'SESSION_DESTROY',
];

// ============================================
// Event Types (AsyncAPI aligned)
// ============================================

export interface FIAStepEvent {
    sessionId: string;
    fiaIndex: number;
    runState: string;
    ciclo: number;
    timestamp: string;
}

export interface PerceptoEvent {
    sessionId: string;
    percepto: {
        tipo: string;
        fuente?: string;
        payload: Record<string, unknown>;
    };
    timestamp: string;
}

export interface EferenciaEvent {
    sessionId: string;
    fiaIndex: number;
    eferencia: {
        tipo: string;
        payload: Record<string, unknown>;
    };
    timestamp: string;
}

export interface MundoStateEvent {
    sessionId: string;
    mundo: {
        nombre: string;
        vivo: boolean;
        modelo: Record<string, unknown>;
    };
    timestamp: string;
}

export interface SessionEvent {
    sessionId: string;
    appId: string;
    fiasCount: number;
    timestamp: string;
}

// ============================================
// PersefonBot Class
// ============================================

export class PersefonBot extends EventEmitter {
    private socket: Socket | null = null;
    private config: PersefonBotConfig;
    private connected: boolean = false;
    private readonly botName = 'PersefonBot';

    constructor(config: Partial<PersefonBotConfig> = {}) {
        super();
        this.config = { ...DEFAULT_PERSEFON_CONFIG, ...config };
        this.setMaxListeners(50);
    }

    // ============================================
    // Connection Management
    // ============================================

    async connect(): Promise<void> {
        if (this.socket?.connected) {
            logger.debug('👑 PersefonBot already connected');
            return;
        }

        return new Promise((resolve, reject) => {
            const url = `${this.config.socketUrl}${this.config.namespace}`;
            logger.info(`👑 PersefonBot connecting to ${url}`);

            this.socket = io(url, {
                transports: ['websocket', 'polling'],
                autoConnect: this.config.autoConnect,
                reconnection: this.config.reconnection,
                reconnectionAttempts: this.config.reconnectionAttempts,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 10000,
                timeout: 10000,
                auth: {
                    botId: this.botName,
                    botType: 'aaia-backend',
                },
            });

            const timeout = setTimeout(() => {
                reject(new Error('👑 PersefonBot connection timeout'));
            }, 15000);

            this.socket.on('connect', () => {
                clearTimeout(timeout);
                this.connected = true;
                logger.info(`👑 PersefonBot connected (socket.id: ${this.socket?.id})`);
                this.registerAsBot();
                this.setupEventHandlers();
                resolve();
            });

            this.socket.on('connect_error', (error) => {
                clearTimeout(timeout);
                logger.error('👑 PersefonBot connection error:', error.message);
                reject(error);
            });

            this.socket.on('disconnect', (reason) => {
                this.connected = false;
                logger.warn(`👑 PersefonBot disconnected: ${reason}`);
                this.emit('disconnected', reason);
            });

            this.socket.on('reconnect', (attempt) => {
                this.connected = true;
                logger.info(`👑 PersefonBot reconnected after ${attempt} attempts`);
                this.registerAsBot();
            });
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            logger.info('👑 PersefonBot disconnected');
        }
    }

    isConnected(): boolean {
        return this.connected && !!this.socket?.connected;
    }

    // ============================================
    // Bot Registration
    // ============================================

    private registerAsBot(): void {
        if (!this.socket) return;

        // 1. Register client identity
        const sessionHash = `persefon_${Date.now().toString(36)}`;
        this.socket.emit('CLIENT_REGISTER', {
            usuario: this.botName,
            sesion: sessionHash,
        });

        // 2. Join AAIA_ROOM
        this.socket.emit('CLIENT_SUSCRIBE', { room: AAIA_ROOM });
        logger.info(`👑 PersefonBot joined ${AAIA_ROOM}`);

        // 3. Join ENGINE_THREADS
        this.socket.emit('CLIENT_SUSCRIBE', { room: ENGINE_THREADS_ROOM });
        logger.info(`👑 PersefonBot joined ${ENGINE_THREADS_ROOM}`);

        // 4. Declare as MASTER of AAIA_ROOM
        this.room('MAKE_MASTER', {
            features: PERSEFON_CAPABILITIES,
            metadata: {
                serverType: 'aaia-backend',
                version: '1.0.0',
                registeredAt: new Date().toISOString(),
            },
        }, AAIA_ROOM);

        logger.info(`👑 PersefonBot is MASTER of ${AAIA_ROOM}`, {
            capabilities: PERSEFON_CAPABILITIES,
        });
    }

    // ============================================
    // Event Handlers (REQUEST/REPLY pattern)
    // ============================================

    private setupEventHandlers(): void {
        if (!this.socket) return;

        // Handle GET_LIST_OF_THREADS requests
        this.socket.on('GET_LIST_OF_THREADS', (payload: any) => {
            logger.debug('👑 Received GET_LIST_OF_THREADS', payload);
            this.emit('get_threads_request', payload);
        });

        // Handle GET_THREAD_STATE requests
        this.socket.on('GET_THREAD_STATE', (payload: any) => {
            logger.debug('👑 Received GET_THREAD_STATE', payload);
            this.emit('get_thread_state_request', payload);
        });

        // Handle THREAD_STEP requests
        this.socket.on('THREAD_STEP', (payload: any) => {
            logger.debug('👑 Received THREAD_STEP', payload);
            this.emit('thread_step_request', payload);
        });

        // Handle THREAD_PERCEPTO requests
        this.socket.on('THREAD_PERCEPTO', (payload: any) => {
            logger.debug('👑 Received THREAD_PERCEPTO', payload);
            this.emit('thread_percepto_request', payload);
        });

        // Generic room message handler
        this.socket.on('ROOM_MESSAGE', (message: any) => {
            logger.debug('👑 Received ROOM_MESSAGE', message);
            this.emit('room_message', message);
        });
    }

    // ============================================
    // Emit Methods (Backend → Clients)
    // ============================================

    /**
     * Send message to a room
     */
    room(event: string, data: any, roomName: string = AAIA_ROOM): void {
        if (!this.socket) {
            logger.warn('👑 PersefonBot not connected, cannot send to room');
            return;
        }

        this.socket.emit('ROOM_MESSAGE', {
            event,
            room: roomName,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Emit FIA step event
     */
    emitFIAStep(event: FIAStepEvent): void {
        this.room('FIA_STEP', event, AAIA_ROOM);
        logger.debug('👑 Emitted FIA_STEP', event);
    }

    /**
     * Emit percepto event
     */
    emitPercepto(event: PerceptoEvent): void {
        this.room('PERCEPTO', event, AAIA_ROOM);
        logger.debug('👑 Emitted PERCEPTO', event);
    }

    /**
     * Emit eferencia event
     */
    emitEferencia(event: EferenciaEvent): void {
        this.room('EFERENCIA', event, AAIA_ROOM);
        logger.debug('👑 Emitted EFERENCIA', event);
    }

    /**
     * Emit mundo state change
     */
    emitMundoState(event: MundoStateEvent): void {
        this.room('MUNDO_STATE', event, AAIA_ROOM);
        logger.debug('👑 Emitted MUNDO_STATE', event);
    }

    /**
     * Emit session created event
     */
    emitSessionCreated(event: SessionEvent): void {
        this.room('SESSION_CREATED', event, AAIA_ROOM);
        logger.info('👑 Emitted SESSION_CREATED', { sessionId: event.sessionId });
    }

    /**
     * Emit session destroyed event
     */
    emitSessionDestroyed(event: SessionEvent): void {
        this.room('SESSION_DESTROYED', event, AAIA_ROOM);
        logger.info('👑 Emitted SESSION_DESTROYED', { sessionId: event.sessionId });
    }

    /**
     * Reply to GET_LIST_OF_THREADS
     */
    replyListOfThreads(threads: any[], requesterSocketId?: string): void {
        this.room('SET_LIST_OF_THREADS', { threads }, ENGINE_THREADS_ROOM);
        logger.debug('👑 Replied SET_LIST_OF_THREADS', { count: threads.length });
    }

    /**
     * Reply to GET_THREAD_STATE
     */
    replyThreadState(sessionId: string, state: any): void {
        this.room('SET_THREAD_STATE', { sessionId, state }, ENGINE_THREADS_ROOM);
        logger.debug('👑 Replied SET_THREAD_STATE', { sessionId });
    }

    // ============================================
    // Status
    // ============================================

    getStatus(): { connected: boolean; socketId: string | null; room: string } {
        return {
            connected: this.connected,
            socketId: this.socket?.id || null,
            room: AAIA_ROOM,
        };
    }
}

// ============================================
// Singleton Instance
// ============================================

let persefonBotInstance: PersefonBot | null = null;

export function getPersefonBot(config?: Partial<PersefonBotConfig>): PersefonBot {
    if (!persefonBotInstance) {
        persefonBotInstance = new PersefonBot(config);
    }
    return persefonBotInstance;
}

export function createPersefonBot(config?: Partial<PersefonBotConfig>): PersefonBot {
    return new PersefonBot(config);
}
