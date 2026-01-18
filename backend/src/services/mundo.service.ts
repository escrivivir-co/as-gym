/**
 * Mundo Service - Business logic for world operations
 * 
 * Source of Truth for Mundo state.
 * Uses sessionService for persistence.
 * Notifies socketIOService for real-time events.
 * 
 * @épica AAIA-BACKEND-1.0.0
 * @fecha 2026-01-18
 */

import { logger } from '../utils/logger';
import { sessionService } from './session.service';
import { socketIOService } from './socketio.service';
import {
  IMundoState,
  IPercepto,
  GetMundoStateResponse,
  QueryMundoResponse,
  SendPerceptoResponse,
} from '../types';

export class MundoService {
  /**
   * Get current world state
   */
  async getState(sessionId: string): Promise<GetMundoStateResponse> {
    logger.debug(`Getting mundo state for session: ${sessionId}`);
    
    const mundo = await sessionService.getMundo(sessionId);
    
    return {
      success: true,
      sessionId,
      mundo,
    };
  }

  /**
   * Execute arbitrary query on world model
   * Supports JSONPath-like queries or simple key access
   */
  async query(sessionId: string, query: string): Promise<QueryMundoResponse> {
    logger.debug(`Querying mundo in session ${sessionId}: ${query}`);
    
    const mundo = await sessionService.getMundo(sessionId);
    
    // Simple query implementation: dot-notation access
    // e.g., "modelo.ciclo" returns mundo.modelo.ciclo
    let result: Record<string, unknown> = {};
    
    if (!query || query === '*' || query === 'all') {
      // Return full mundo state
      result = {
        nombre: mundo.nombre,
        vivo: mundo.vivo,
        runState: mundo.runState,
        modelo: mundo.modelo,
        fiasCount: mundo.fiasCount,
      };
    } else {
      // Parse dot-notation query
      const parts = query.split('.');
      let current: unknown = mundo;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = undefined;
          break;
        }
      }
      
      result = { [query]: current };
    }
    
    return {
      success: true,
      sessionId,
      result,
    };
  }

  /**
   * Update mundo model with new data
   */
  async updateModelo(
    sessionId: string,
    updates: Record<string, unknown>
  ): Promise<GetMundoStateResponse> {
    logger.info(`Updating mundo modelo in session: ${sessionId}`);
    
    const mundo = await sessionService.getMundo(sessionId);
    
    const newModelo = {
      ...mundo.modelo,
      ...updates,
    };
    
    const updatedMundo = await sessionService.updateMundo(sessionId, {
      modelo: newModelo,
    });
    
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
    
    return {
      success: true,
      sessionId,
      mundo: updatedMundo,
    };
  }

  /**
   * Send percepto to the world (broadcast to all FIAs)
   * Delegates to fiaService.sendPercepto for unified handling
   */
  async sendPercepto(sessionId: string, percepto: IPercepto): Promise<SendPerceptoResponse> {
    logger.info(`Sending percepto to session ${sessionId}:`, percepto.tipo);
    
    // Get current state
    const fias = await sessionService.getFIAs(sessionId);
    const mundo = await sessionService.getMundo(sessionId);
    const ciclo = (mundo.modelo?.ciclo as number || 0) + 1;
    
    // Update mundo with percepto
    await sessionService.updateMundo(sessionId, {
      modelo: {
        ...mundo.modelo,
        ciclo,
        ultimoPercepto: percepto,
      },
    });
    
    // All FIAs process the percepto
    const processedBy = fias.map(fia => fia.index);
    
    // Notify via Socket.IO
    socketIOService.notifyPercepto({
      sessionId,
      percepto: {
        tipo: percepto.tipo,
        fuente: percepto.fuente,
        payload: percepto.payload,
      },
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      processedBy,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton
export const mundoService = new MundoService();
