/**
 * Session Service - Business logic for session management
 * 
 * Source of Truth for AAIA Sessions.
 * Uses FileCollection for MongoDB-style persistence.
 * Notifies socketIOService for real-time events.
 * 
 * @épica AAIA-BACKEND-1.0.0
 * @fecha 2026-01-18
 */

import * as path from 'path';
import { promises as fs } from 'fs';
import { logger } from '../utils/logger';
import { socketIOService } from './socketio.service';
import { fiaCatalog } from './apps.service';
import {
    AAIASessionMeta,
    IFIAInfo,
    IMundoState,
    CreateSessionResponse,
    ListSessionsResponse,
    GetSessionResponse,
    DestroySessionResponse,
    RunStateEnum,
    IAAIAApp,
} from '../types';

// ============================================
// Session Data Model (for persistence)
// ============================================

interface SessionDocument {
    id: string;
    appId: string;
    createdAt: number;
    updatedAt: number;
    fias: IFIAInfo[];
    mundo: IMundoState;
}

// ============================================
// FileCollection - MongoDB-style JSON persistence
// @see mcp-mesh-sdk/managers/FilePersistenceManager.ts
// ============================================

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_DIR = path.join(DATA_DIR, 'aaia-backend', 'sessions');

class FileCollection<T extends { id: string }> {
    private cache: Map<string, T> = new Map();
    private initialized: boolean = false;
    private collectionPath: string;

    constructor(collectionPath: string) {
        this.collectionPath = collectionPath;
    }

    async init(): Promise<void> {
        if (this.initialized) return;
        await fs.mkdir(this.collectionPath, { recursive: true });
        await this.loadAll();
        this.initialized = true;
        logger.info(`📁 FileCollection initialized at ${this.collectionPath}`);
    }

    private async loadAll(): Promise<void> {
        try {
            const files = await fs.readdir(this.collectionPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.collectionPath, file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const doc = JSON.parse(content) as T;
                    this.cache.set(doc.id, doc);
                }
            }
            logger.info(`📁 Loaded ${this.cache.size} sessions from disk`);
        } catch (error: any) {
            if (error.code !== 'ENOENT') throw error;
        }
    }

    private getDocPath(id: string): string {
        const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '_');
        return path.join(this.collectionPath, `${sanitized}.json`);
    }

    async insert(doc: T): Promise<void> {
        await this.init();
        const docPath = this.getDocPath(doc.id);
        await fs.writeFile(docPath, JSON.stringify(doc, null, 2), 'utf-8');
        this.cache.set(doc.id, doc);
    }

    async findById(id: string): Promise<T | null> {
        await this.init();
        return this.cache.get(id) || null;
    }

    async findAll(): Promise<T[]> {
        await this.init();
        return Array.from(this.cache.values());
    }

    async update(id: string, updates: Partial<T>): Promise<void> {
        await this.init();
        const existing = this.cache.get(id);
        if (existing) {
            const updated = { ...existing, ...updates, updatedAt: Date.now() } as T;
            const docPath = this.getDocPath(id);
            await fs.writeFile(docPath, JSON.stringify(updated, null, 2), 'utf-8');
            this.cache.set(id, updated);
        }
    }

    async delete(id: string): Promise<boolean> {
        await this.init();
        if (!this.cache.has(id)) return false;
        const docPath = this.getDocPath(id);
        try {
            await fs.unlink(docPath);
        } catch (error: any) {
            if (error.code !== 'ENOENT') throw error;
        }
        this.cache.delete(id);
        return true;
    }

    async count(): Promise<number> {
        await this.init();
        return this.cache.size;
    }
}

// ============================================
// Session Service Class
// ============================================

export class SessionService {
    private store: FileCollection<SessionDocument>;

    constructor() {
        this.store = new FileCollection<SessionDocument>(SESSIONS_DIR);
        logger.info('👑 SessionService initialized (FileCollection persistence)');
    }

    /**
     * Create a new AAIA session
     */
    async createSession(appId: string): Promise<CreateSessionResponse> {
        logger.info(`Creating session for app: ${appId}`);

        // Get app definition from catalog
        const app = fiaCatalog.getAppById(appId);
        if (!app) {
            return {
                success: false,
                sessionId: '',
                appId,
                fiasCount: 0,
                error: `App not found: ${appId}`,
            };
        }

        // Generate session ID
        const sessionId = `aaia_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        // Create FIA instances from app config
        const fias: IFIAInfo[] = app.fias.map((fiaConfig, index) => ({
            index,
            nombre: fiaConfig.nombre,
            paradigma: fiaConfig.paradigma,
            runState: RunStateEnum.STOP,
            runAsync: fiaConfig.runAsync || false,
            capacidades: [],
        }));

        // Create Mundo state
        const mundo: IMundoState = {
            nombre: app.mundoConfig?.nombre || `Mundo_${appId}`,
            vivo: true,
            runState: RunStateEnum.STOP,
            modelo: app.mundoConfig?.modeloInicial || {},
            fiasCount: fias.length,
            renderer: app.mundoConfig?.renderer,
        };

        // Create session document
        const session: SessionDocument = {
            id: sessionId,
            appId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            fias,
            mundo,
        };

        // Persist
        await this.store.insert(session);

        // Notify via Socket.IO
        socketIOService.notifySessionCreated({
            sessionId,
            appId,
            fiasCount: fias.length,
            timestamp: new Date().toISOString(),
        });

        logger.info(`Session created: ${sessionId} (${fias.length} FIAs)`);

        return {
            success: true,
            sessionId,
            appId,
            fiasCount: fias.length,
        };
    }

    /**
     * List all active sessions
     */
    async listSessions(): Promise<ListSessionsResponse> {
        logger.debug('Listing sessions');

        const docs = await this.store.findAll();
        const now = Date.now();

        const sessions: AAIASessionMeta[] = docs.map(doc => ({
            sessionId: doc.id,
            appId: doc.appId,
            createdAt: new Date(doc.createdAt).toISOString(),
            lastUsedAt: new Date(doc.updatedAt).toISOString(),
            ageMinutes: Math.floor((now - doc.createdAt) / 60000),
            fiasCount: doc.fias.length,
            mundoState: doc.mundo.runState,
        }));

        return {
            success: true,
            sessions,
            count: sessions.length,
        };
    }

    /**
     * Get session details by ID
     */
    async getSession(sessionId: string): Promise<GetSessionResponse> {
        logger.debug(`Getting session: ${sessionId}`);

        const doc = await this.store.findById(sessionId);
        if (!doc) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        const now = Date.now();
        const session: AAIASessionMeta = {
            sessionId: doc.id,
            appId: doc.appId,
            createdAt: new Date(doc.createdAt).toISOString(),
            lastUsedAt: new Date(doc.updatedAt).toISOString(),
            ageMinutes: Math.floor((now - doc.createdAt) / 60000),
            fiasCount: doc.fias.length,
            mundoState: doc.mundo.runState,
        };

        return {
            success: true,
            session,
            fias: doc.fias,
            mundo: doc.mundo,
        };
    }

    /**
     * Destroy a session
     */
    async destroySession(sessionId: string): Promise<DestroySessionResponse> {
        logger.info(`Destroying session: ${sessionId}`);

        const doc = await this.store.findById(sessionId);
        if (!doc) {
            return {
                success: false,
                sessionId,
                message: `Session not found: ${sessionId}`,
            };
        }

        await this.store.delete(sessionId);

        // Notify via Socket.IO
        socketIOService.notifySessionDestroyed({
            sessionId,
            appId: doc.appId,
            fiasCount: doc.fias.length,
            timestamp: new Date().toISOString(),
        });

        return {
            success: true,
            sessionId,
            message: 'Session destroyed',
        };
    }

    /**
     * Update session's last used timestamp
     */
    async touchSession(sessionId: string): Promise<void> {
        await this.store.update(sessionId, { updatedAt: Date.now() });
    }

    /**
     * Get FIAs for a session
     */
    async getFIAs(sessionId: string): Promise<IFIAInfo[]> {
        const doc = await this.store.findById(sessionId);
        if (!doc) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        return doc.fias;
    }

    /**
     * Get Mundo state for a session
     */
    async getMundo(sessionId: string): Promise<IMundoState> {
        const doc = await this.store.findById(sessionId);
        if (!doc) {
            throw new Error(`Session not found: ${sessionId}`);
        }
        return doc.mundo;
    }

    /**
     * Update FIA state
     */
    async updateFIA(sessionId: string, fiaIndex: number, updates: Partial<IFIAInfo>): Promise<IFIAInfo> {
        const doc = await this.store.findById(sessionId);
        if (!doc) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        const fia = doc.fias[fiaIndex];
        if (!fia) {
            throw new Error(`FIA not found at index ${fiaIndex}`);
        }

        const updatedFIA = { ...fia, ...updates };
        doc.fias[fiaIndex] = updatedFIA;
        await this.store.update(sessionId, { fias: doc.fias });

        return updatedFIA;
    }

    /**
     * Update Mundo state
     */
    async updateMundo(sessionId: string, updates: Partial<IMundoState>): Promise<IMundoState> {
        const doc = await this.store.findById(sessionId);
        if (!doc) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        const updatedMundo = { ...doc.mundo, ...updates };
        await this.store.update(sessionId, { mundo: updatedMundo });

        // Notify via Socket.IO
        socketIOService.notifyMundoState({
            sessionId,
            mundo: {
                nombre: updatedMundo.nombre,
                vivo: updatedMundo.vivo,
                modelo: updatedMundo.modelo,
            },
            timestamp: new Date().toISOString(),
        });

        return updatedMundo;
    }
}

// Singleton
export const sessionService = new SessionService();
