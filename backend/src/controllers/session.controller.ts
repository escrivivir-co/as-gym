/**
 * Session Controller - Manages AAIA sessions
 * 
 * Endpoints (OpenAPI spec aligned):
 *   POST   /api/sessions       → createSession
 *   GET    /api/sessions       → listSessions
 *   GET    /api/sessions/:id   → getSession
 *   DELETE /api/sessions/:id   → destroySession
 */

import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import { logger } from '../utils/logger';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  ListSessionsResponse,
  GetSessionResponse,
  DestroySessionResponse,
  ErrorResponse,
} from '../types';

export class SessionController {
  /**
   * POST /api/sessions
   * Create a new AAIA session
   * 
   * @body { appId: string } - ID of the app to load
   * @returns CreateSessionResponse
   */
  async create(req: Request<object, CreateSessionResponse | ErrorResponse, CreateSessionRequest>, res: Response): Promise<void> {
    try {
      const { appId } = req.body;
      
      if (!appId) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'appId is required',
          code: 'MISSING_APP_ID',
        });
        return;
      }

      const result = await sessionService.createSession(appId);

      if (!result.success) {
        res.status(400).json({
          error: 'Failed to create session',
          message: result.error,
          code: 'SESSION_CREATE_FAILED',
        });
        return;
      }

      logger.info(`Session created: ${result.sessionId} for app ${appId}`);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Failed to create session:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/sessions
   * List all active sessions
   * 
   * @returns ListSessionsResponse
   */
  async list(_req: Request, res: Response<ListSessionsResponse | ErrorResponse>): Promise<void> {
    try {
      const result = await sessionService.listSessions();
      res.json(result);
    } catch (error) {
      logger.error('Failed to list sessions:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/sessions/:id
   * Get session details including FIAs and Mundo state
   * 
   * @param id - Session ID (UUID)
   * @returns GetSessionResponse
   */
  async get(req: Request<{ id: string }>, res: Response<GetSessionResponse | ErrorResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'Session ID is required',
          code: 'MISSING_SESSION_ID',
        });
        return;
      }

      const result = await sessionService.getSession(id);
      
      if (!result.success) {
        res.status(404).json({
          error: 'Not Found',
          message: `Session ${id} not found`,
          code: 'SESSION_NOT_FOUND',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      logger.error(`Failed to get session ${req.params.id}:`, error);
      
      // Check if it's a "not found" error
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          code: 'SESSION_NOT_FOUND',
        });
        return;
      }
      
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * DELETE /api/sessions/:id
   * Destroy a session and free resources
   * 
   * @param id - Session ID (UUID)
   * @returns DestroySessionResponse or 204 No Content
   */
  async destroy(req: Request<{ id: string }>, res: Response<DestroySessionResponse | ErrorResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'Session ID is required',
          code: 'MISSING_SESSION_ID',
        });
        return;
      }

      const result = await sessionService.destroySession(id);
      
      if (!result.success) {
        res.status(404).json({
          error: 'Not Found',
          message: `Session ${id} not found`,
          code: 'SESSION_NOT_FOUND',
        });
        return;
      }

      logger.info(`Session destroyed: ${id}`);
      
      // OpenAPI spec says 204, but we return body for debugging
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Failed to destroy session ${req.params.id}:`, error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
