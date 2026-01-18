/**
 * FIA Service - Business logic for FIA operations
 * 
 * Source of Truth for FIA state.
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
  IFIAInfo,
  IEferencia,
  IPercepto,
  RunStateEnum,
  ListFIAsResponse,
  StepFIAResponse,
  SendPerceptoResponse,
  GetFIAStateResponse,
} from '../types';

export class FIAService {
  /**
   * List all FIAs in a session
   */
  async listFIAs(sessionId: string): Promise<ListFIAsResponse> {
    logger.debug(`Listing FIAs for session: ${sessionId}`);
    
    const fias = await sessionService.getFIAs(sessionId);
    
    return {
      success: true,
      sessionId,
      fias,
      count: fias.length,
    };
  }

  /**
   * Get a specific FIA info
   */
  async getFIA(sessionId: string, fiaIndex: number): Promise<GetFIAStateResponse> {
    logger.debug(`Getting FIA ${fiaIndex} for session: ${sessionId}`);
    
    const fias = await sessionService.getFIAs(sessionId);
    const fia = fias.find(f => f.index === fiaIndex);
    
    if (!fia) {
      throw new Error(`FIA ${fiaIndex} not found in session ${sessionId}`);
    }
    
    return {
      success: true,
      fiaId: fiaIndex,
      state: fia,
    };
  }

  /**
   * Set FIA run state (PLAY, PAUSE, STOP, PLAY_STEP)
   */
  async setFIAState(
    sessionId: string,
    fiaIndex: number,
    newState: RunStateEnum
  ): Promise<{ success: boolean; previousState: RunStateEnum; newState: RunStateEnum }> {
    logger.info(`Setting FIA ${fiaIndex} state to ${newState} in session: ${sessionId}`);
    
    const fias = await sessionService.getFIAs(sessionId);
    const fia = fias[fiaIndex];
    
    if (!fia) {
      throw new Error(`FIA ${fiaIndex} not found in session ${sessionId}`);
    }
    
    const previousState = fia.runState;
    
    // Update via sessionService
    await sessionService.updateFIA(sessionId, fiaIndex, { runState: newState });
    
    // Notify via Socket.IO
    socketIOService.notifyFIAStep({
      sessionId,
      fiaIndex,
      runState: newState,
      ciclo: 0, // State change doesn't increment ciclo
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      previousState,
      newState,
    };
  }

  /**
   * Start a FIA (set to PLAY state)
   */
  async startFIA(sessionId: string, fiaIndex: number): Promise<{ success: boolean; previousState: RunStateEnum; newState: RunStateEnum }> {
    return this.setFIAState(sessionId, fiaIndex, RunStateEnum.PLAY);
  }

  /**
   * Stop a FIA (set to STOP state)
   */
  async stopFIA(sessionId: string, fiaIndex: number): Promise<{ success: boolean; previousState: RunStateEnum; newState: RunStateEnum }> {
    return this.setFIAState(sessionId, fiaIndex, RunStateEnum.STOP);
  }

  /**
   * Execute one reasoning step for a FIA
   * This is where the actual cognitive cycle happens
   */
  async stepFIA(sessionId: string, fiaIndex: number): Promise<StepFIAResponse> {
    logger.info(`Stepping FIA ${fiaIndex} in session: ${sessionId}`);
    const startTime = Date.now();
    
    // Get current state
    const fias = await sessionService.getFIAs(sessionId);
    const fia = fias[fiaIndex];
    
    if (!fia) {
      throw new Error(`FIA ${fiaIndex} not found in session ${sessionId}`);
    }
    
    // Get mundo for cycle count
    const mundo = await sessionService.getMundo(sessionId);
    const ciclo = (mundo.modelo?.ciclo as number || 0) + 1;
    
    // Update FIA to PLAY_STEP
    await sessionService.updateFIA(sessionId, fiaIndex, { runState: RunStateEnum.PLAY_STEP });
    
    // Simulate FIA step - in real implementation, this would call AAIAGallery runtime
    // TODO: Connect to actual FIA engine when available
    const eferencia: IEferencia = {
      tipo: 'estado',
      payload: {
        fiaIndex,
        nombre: fia.nombre,
        paradigma: fia.paradigma,
        ciclo,
        simulated: true,
      },
      timestamp: new Date().toISOString(),
    };
    
    // Update mundo with new cycle
    await sessionService.updateMundo(sessionId, {
      modelo: { ...mundo.modelo, ciclo, ultimaEferencia: eferencia },
    });
    
    const executionTimeMs = Date.now() - startTime;
    
    // Notify via Socket.IO
    socketIOService.notifyFIAStep({
      sessionId,
      fiaIndex,
      runState: RunStateEnum.PLAY_STEP,
      ciclo,
      timestamp: new Date().toISOString(),
    });
    
    socketIOService.notifyEferencia({
      sessionId,
      fiaIndex,
      eferencia,
      timestamp: new Date().toISOString(),
    });
    
    logger.info(`FIA ${fiaIndex} stepped in ${executionTimeMs}ms, ciclo=${ciclo}`);
    
    return {
      success: true,
      fiaId: fiaIndex,
      eferencia: {
        tipo: eferencia.tipo,
        payload: eferencia.payload,
      },
      cycles: ciclo,
      executionTimeMs,
    };
  }

  /**
   * Get the last eferencia (output) from a FIA
   */
  async getEferencia(sessionId: string, fiaIndex: number): Promise<{ success: boolean; eferencia: IEferencia | null }> {
    logger.debug(`Getting eferencia for FIA ${fiaIndex} in session: ${sessionId}`);
    
    const mundo = await sessionService.getMundo(sessionId);
    const ultimaEferencia = mundo.modelo?.ultimaEferencia as IEferencia | undefined;
    
    return {
      success: true,
      eferencia: ultimaEferencia || null,
    };
  }

  /**
   * Send a percepto to the mundo (broadcast to all FIAs)
   */
  async sendPercepto(sessionId: string, percepto: IPercepto): Promise<SendPerceptoResponse> {
    logger.info(`Sending percepto to session: ${sessionId}, tipo=${percepto.tipo}`);
    
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
    
    logger.info(`Percepto processed by ${processedBy.length} FIAs, ciclo=${ciclo}`);
    
    return {
      success: true,
      processedBy,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton
export const fiaService = new FIAService();
