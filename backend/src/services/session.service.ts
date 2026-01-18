/**
 * Session Service - Business logic for session management
 * 
 * Handles session lifecycle through MCP Gateway
 */

import { mcpGateway } from './mcp-gateway';
import { logger } from '../utils/logger';
import {
  AAIASessionMeta,
  IFIAInfo,
  IMundoState,
  CreateSessionResponse,
  ListSessionsResponse,
  GetSessionResponse,
  DestroySessionResponse,
} from '../types';

export class SessionService {
  /**
   * Create a new AAIA session
   */
  async createSession(appId: string): Promise<CreateSessionResponse> {
    logger.info(`Creating session for app: ${appId}`);
    
    const result = await mcpGateway.callTool('aaia_create_session', { appId });
    
    return {
      success: result.success as boolean,
      sessionId: result.sessionId as string,
      appId: result.appId as string,
      fiasCount: result.fiasCount as number,
      error: result.error as string | undefined,
    };
  }

  /**
   * List all active sessions
   */
  async listSessions(): Promise<ListSessionsResponse> {
    logger.debug('Listing sessions');
    
    const result = await mcpGateway.callTool('aaia_list_sessions', {});
    
    const sessions = (result.sessions || []) as AAIASessionMeta[];
    
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
    
    // Get session meta
    const sessionResult = await mcpGateway.callTool('aaia_get_session', { sessionId });
    
    if (!sessionResult.success) {
      throw new Error(sessionResult.error as string || 'Session not found');
    }

    // Get FIAs
    const fiasResult = await mcpGateway.callTool('aaia_list_fias', { sessionId });
    const fias = (fiasResult.fias || []) as IFIAInfo[];

    // Get Mundo state
    const mundoResult = await mcpGateway.callTool('aaia_query_mundo', { sessionId });
    const mundo = mundoResult.mundo as IMundoState;

    return {
      success: true,
      session: sessionResult.session as AAIASessionMeta,
      fias,
      mundo,
    };
  }

  /**
   * Destroy a session
   */
  async destroySession(sessionId: string): Promise<DestroySessionResponse> {
    logger.info(`Destroying session: ${sessionId}`);
    
    const result = await mcpGateway.callTool('aaia_destroy_session', { sessionId });
    
    return {
      success: result.success as boolean,
      sessionId,
      message: result.success ? 'Session destroyed' : (result.error as string),
    };
  }
}

// Singleton
export const sessionService = new SessionService();
