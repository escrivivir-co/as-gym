/**
 * FIA Service - Business logic for FIA operations
 * 
 * Handles FIA lifecycle and cognitive cycles through MCP Gateway
 */

import { mcpGateway } from './mcp-gateway';
import { logger } from '../utils/logger';
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
    
    const result = await mcpGateway.callTool('aaia_list_fias', { sessionId });
    
    const fias = (result.fias || []) as IFIAInfo[];
    
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
    
    const result = await mcpGateway.callTool('aaia_list_fias', { sessionId });
    const fias = (result.fias || []) as IFIAInfo[];
    
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
   * Start a FIA (set to PLAY state)
   */
  async startFIA(sessionId: string, fiaIndex: number): Promise<{ success: boolean; previousState: RunStateEnum; newState: RunStateEnum }> {
    logger.info(`Starting FIA ${fiaIndex} in session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_set_fia_state', { 
      sessionId, 
      fiaIndex,
      state: RunStateEnum.PLAY,
    });
    
    return {
      success: result.success as boolean,
      previousState: result.previousState as RunStateEnum,
      newState: result.newState as RunStateEnum,
    };
  }

  /**
   * Stop a FIA (set to STOP state)
   */
  async stopFIA(sessionId: string, fiaIndex: number): Promise<{ success: boolean; previousState: RunStateEnum; newState: RunStateEnum }> {
    logger.info(`Stopping FIA ${fiaIndex} in session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_set_fia_state', { 
      sessionId, 
      fiaIndex,
      state: RunStateEnum.STOP,
    });
    
    return {
      success: result.success as boolean,
      previousState: result.previousState as RunStateEnum,
      newState: result.newState as RunStateEnum,
    };
  }

  /**
   * Execute one reasoning step for a FIA
   */
  async stepFIA(sessionId: string, fiaIndex: number): Promise<StepFIAResponse> {
    logger.info(`Stepping FIA ${fiaIndex} in session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_step_fia', { 
      sessionId, 
      fiaIndex,
    });
    
    const eferencia = result.eferencia as IEferencia | undefined;
    
    return {
      success: result.success as boolean,
      fiaId: fiaIndex,
      eferencia: eferencia ? {
        tipo: eferencia.tipo,
        payload: eferencia.payload,
      } : undefined,
      cycles: result.cycles as number | undefined,
      executionTimeMs: result.executionTimeMs as number | undefined,
    };
  }

  /**
   * Get the last eferencia (output) from a FIA
   */
  async getEferencia(sessionId: string, fiaIndex: number): Promise<{ success: boolean; eferencia: IEferencia | null }> {
    logger.debug(`Getting eferencia for FIA ${fiaIndex} in session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_get_eferencia', { 
      sessionId, 
      fiaIndex,
    });
    
    return {
      success: result.success as boolean,
      eferencia: (result.eferencia as IEferencia) || null,
    };
  }

  /**
   * Send a percepto to a FIA
   */
  async sendPercepto(sessionId: string, percepto: IPercepto): Promise<SendPerceptoResponse> {
    logger.info(`Sending percepto to session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_send_percepto', { 
      sessionId, 
      percepto,
    });
    
    return {
      success: result.success as boolean,
      processedBy: (result.processedBy || []) as number[],
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton
export const fiaService = new FIAService();
