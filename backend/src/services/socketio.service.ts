/**
 * Socket.IO Service - Real-time communication with AlephScript mesh
 * 
 * Refactored to use PersefonBot (👑 Perséfone) for mesh communication.
 * This service now acts as a thin wrapper that:
 * - Instantiates and manages PersefonBot lifecycle
 * - Manages SSE clients for HTTP streaming to frontend
 * - Bridges PersefonBot events to SSE clients
 * 
 * @épica AAIA-BACKEND-1.0.0
 * @fecha 2026-01-18
 */

import { EventEmitter } from 'events';
import { config } from '../config';
import { logger } from '../utils/logger';
import { 
    PersefonBot, 
    getPersefonBot,
    FIAStepEvent,
    PerceptoEvent,
    EferenciaEvent,
    MundoStateEvent,
    SessionEvent,
} from '../bots/PersefonBot';

// ============================================
// SSE Client Management
// ============================================

export interface SSEClient {
    id: string;
    sessionId: string | null; // null = all sessions
    send: (event: string, data: unknown) => void;
    close: () => void;
}

// ============================================
// Event Types (re-export from PersefonBot)
// ============================================

export type { FIAStepEvent, PerceptoEvent, EferenciaEvent, MundoStateEvent, SessionEvent };

// Union type for all events
export type AAIAEvent = 
    | { type: 'fia_step'; data: FIAStepEvent }
    | { type: 'percepto'; data: PerceptoEvent }
    | { type: 'eferencia'; data: EferenciaEvent }
    | { type: 'mundo_state'; data: MundoStateEvent }
    | { type: 'session_created'; data: SessionEvent }
    | { type: 'session_destroyed'; data: SessionEvent };

// ============================================
// Socket.IO Service Class
// ============================================

class SocketIOService extends EventEmitter {
    private bot: PersefonBot;
    private sseClients: Map<string, SSEClient> = new Map();
    private eventBuffer: AAIAEvent[] = [];
    private readonly BUFFER_SIZE = 100;

    constructor() {
        super();
        this.setMaxListeners(50);
        
        // Get singleton PersefonBot instance
        this.bot = getPersefonBot({
            socketUrl: config.socketio.url,
            namespace: '/runtime',
            autoConnect: false, // We control connection
        });

        this.setupBotEventHandlers();
    }

    // ============================================
    // Connection Management (delegates to PersefonBot)
    // ============================================

    async connect(): Promise<void> {
        logger.info('👑 SocketIOService: Connecting via PersefonBot...');
        
        try {
            await this.bot.connect();
            logger.info('👑 SocketIOService: PersefonBot connected successfully');
        } catch (error) {
            logger.error('👑 SocketIOService: PersefonBot connection failed', error);
            throw error;
        }
    }

    disconnect(): void {
        this.bot.disconnect();
        logger.info('👑 SocketIOService: PersefonBot disconnected');
    }

    isConnected(): boolean {
        return this.bot.isConnected();
    }

    // ============================================
    // Bot Event Handlers
    // ============================================

    private setupBotEventHandlers(): void {
        // Handle ENGINE_THREADS requests (PersefonBot emits these)
        this.bot.on('get_threads_request', (payload) => {
            this.handleGetThreadsRequest(payload);
        });

        this.bot.on('get_thread_state_request', (payload) => {
            this.handleGetThreadStateRequest(payload);
        });

        this.bot.on('thread_step_request', (payload) => {
            this.handleThreadStepRequest(payload);
        });

        this.bot.on('thread_percepto_request', (payload) => {
            this.handleThreadPerceptoRequest(payload);
        });

        // Handle disconnection
        this.bot.on('disconnected', (reason) => {
            logger.warn(`👑 SocketIOService: Bot disconnected - ${reason}`);
            this.emit('disconnected', reason);
        });
    }

    // ============================================
    // ENGINE_THREADS Request Handlers
    // ============================================

    private async handleGetThreadsRequest(payload: any): Promise<void> {
        logger.info('👑 Handling GET_LIST_OF_THREADS request');
        
        // TODO: Get from SessionService when implemented
        // For now, return FIA catalog as fallback
        const threads = this.getFIACatalogAsMenuItems();
        this.bot.replyListOfThreads(threads);
    }

    private async handleGetThreadStateRequest(payload: { sessionId: string }): Promise<void> {
        logger.info('👑 Handling GET_THREAD_STATE request', payload);
        
        // TODO: Get from SessionService when implemented
        this.bot.replyThreadState(payload.sessionId, { estado: 'STOP' });
    }

    private async handleThreadStepRequest(payload: any): Promise<void> {
        logger.info('👑 Handling THREAD_STEP request', payload);
        // This will be handled by FIAService when implemented
        this.emit('thread_step', payload);
    }

    private async handleThreadPerceptoRequest(payload: any): Promise<void> {
        logger.info('👑 Handling THREAD_PERCEPTO request', payload);
        // This will be handled by MundoService when implemented
        this.emit('thread_percepto', payload);
    }

    /**
     * Get FIA catalog as menu items (fallback)
     */
    private getFIACatalogAsMenuItems(): Record<string, unknown>[] {
        const paradigmas = [
            { id: 'logica', nombre: 'Lógica Formal', estado: 'STOP' },
            { id: 'conexionista', nombre: 'Redes Neuronales', estado: 'STOP' },
            { id: 'hibrido', nombre: 'Híbrido', estado: 'STOP' },
            { id: 'simbolico', nombre: 'Simbólico', estado: 'STOP' },
            { id: 'situado', nombre: 'Situado', estado: 'STOP' },
            { id: 'reactivo', nombre: 'Reactivo', estado: 'STOP' },
            { id: 'deliberativo', nombre: 'Deliberativo', estado: 'STOP' },
            { id: 'bdi', nombre: 'BDI (Belief-Desire-Intention)', estado: 'STOP' },
            { id: 'subsuncion', nombre: 'Subsunción', estado: 'STOP' },
            { id: 'multiagente', nombre: 'Multi-Agente', estado: 'STOP' },
        ];

        return paradigmas.map((p, index) => ({
            index,
            name: p.nombre,
            state: p.estado,
            mundo: {
                nombre: `FIA ${p.id}`,
                renderer: 'about',
                runState: 'STOP',
                modelo: { nombre: p.id, pulso: 1000, dia: 0, muerte: 100 },
            },
            bots: [],
        }));
    }

    // ============================================
    // SSE Client Management
    // ============================================

    registerSSEClient(client: SSEClient): void {
        this.sseClients.set(client.id, client);
        logger.debug(`SSE client registered: ${client.id} (session: ${client.sessionId || 'all'})`);

        // Send buffered events
        this.eventBuffer.forEach(event => {
            if (this.shouldSendToClient(client, event)) {
                client.send(event.type, event.data);
            }
        });
    }

    unregisterSSEClient(clientId: string): void {
        const client = this.sseClients.get(clientId);
        if (client) {
            client.close();
            this.sseClients.delete(clientId);
            logger.debug(`SSE client unregistered: ${clientId}`);
        }
    }

    private shouldSendToClient(client: SSEClient, event: AAIAEvent): boolean {
        if (!client.sessionId) return true;
        const sessionId = 'sessionId' in event.data ? event.data.sessionId : null;
        return sessionId === client.sessionId;
    }

    private broadcastToSSEClients(event: AAIAEvent): void {
        this.sseClients.forEach(client => {
            if (this.shouldSendToClient(client, event)) {
                try {
                    client.send(event.type, event.data);
                } catch (error) {
                    logger.warn(`Failed to send event to SSE client ${client.id}:`, error);
                    this.unregisterSSEClient(client.id);
                }
            }
        });
    }

    // ============================================
    // Event Emission (Backend Services → Clients)
    // ============================================

    /**
     * Called by SessionService when session is created
     */
    notifySessionCreated(event: SessionEvent): void {
        this.bot.emitSessionCreated(event);
        this.bufferAndBroadcast({ type: 'session_created', data: event });
    }

    /**
     * Called by SessionService when session is destroyed
     */
    notifySessionDestroyed(event: SessionEvent): void {
        this.bot.emitSessionDestroyed(event);
        this.bufferAndBroadcast({ type: 'session_destroyed', data: event });
    }

    /**
     * Called by FIAService when FIA executes a step
     */
    notifyFIAStep(event: FIAStepEvent): void {
        this.bot.emitFIAStep(event);
        this.bufferAndBroadcast({ type: 'fia_step', data: event });
    }

    /**
     * Called by MundoService when percepto is received
     */
    notifyPercepto(event: PerceptoEvent): void {
        this.bot.emitPercepto(event);
        this.bufferAndBroadcast({ type: 'percepto', data: event });
    }

    /**
     * Called by FIAService when eferencia is generated
     */
    notifyEferencia(event: EferenciaEvent): void {
        this.bot.emitEferencia(event);
        this.bufferAndBroadcast({ type: 'eferencia', data: event });
    }

    /**
     * Called by MundoService when world state changes
     */
    notifyMundoState(event: MundoStateEvent): void {
        this.bot.emitMundoState(event);
        this.bufferAndBroadcast({ type: 'mundo_state', data: event });
    }

    private bufferAndBroadcast(event: AAIAEvent): void {
        // Add to buffer
        this.eventBuffer.push(event);
        if (this.eventBuffer.length > this.BUFFER_SIZE) {
            this.eventBuffer.shift();
        }

        // Emit to internal listeners
        this.emit('aaia_event', event);
        this.emit(event.type, event.data);

        // Broadcast to SSE clients
        this.broadcastToSSEClients(event);
    }

    // ============================================
    // Status
    // ============================================

    getStatus(): {
        connected: boolean;
        botStatus: ReturnType<PersefonBot['getStatus']>;
        sseClients: number;
        bufferedEvents: number;
    } {
        return {
            connected: this.isConnected(),
            botStatus: this.bot.getStatus(),
            sseClients: this.sseClients.size,
            bufferedEvents: this.eventBuffer.length,
        };
    }

    /**
     * Get the underlying PersefonBot instance
     * Use this to access bot methods directly if needed
     */
    getBot(): PersefonBot {
        return this.bot;
    }
}

// Singleton instance
export const socketIOService = new SocketIOService();
