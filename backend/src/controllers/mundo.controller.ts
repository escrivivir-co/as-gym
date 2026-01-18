/**
 * Mundo Controller - World state management
 * 
 * Endpoints (OpenAPI spec aligned - nested under sessions):
 *   GET    /api/sessions/:sid/mundo          → queryMundo (get state)
 *   POST   /api/sessions/:sid/mundo/query    → queryMundo (custom query)
 *   POST   /api/sessions/:sid/percepto       → sendPercepto
 */

import { Request, Response } from 'express';
import { mundoService } from '../services/mundo.service';
import { logger } from '../utils/logger';
import {
  GetMundoStateResponse,
  QueryMundoRequest,
  QueryMundoResponse,
  SendPerceptoRequest,
  SendPerceptoResponse,
  ErrorResponse,
  IPercepto,
} from '../types';

// Request params types
interface SessionParams {
  sid: string;
}

export class MundoController {
  /**
   * GET /api/sessions/:sid/mundo
   * Get current world state
   */
  async getState(req: Request<SessionParams>, res: Response<GetMundoStateResponse | ErrorResponse>): Promise<void> {
    try {
      const { sid } = req.params;

      if (!sid) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'Session ID is required',
          code: 'MISSING_SESSION_ID',
        });
        return;
      }

      const result = await mundoService.getState(sid);
      
      if (!result.success) {
        res.status(404).json({
          error: 'Not Found',
          message: `Session ${sid} not found`,
          code: 'SESSION_NOT_FOUND',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      logger.error('Failed to get mundo state:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/sessions/:sid/mundo/query
   * Execute custom query on world model
   */
  async query(req: Request<SessionParams, QueryMundoResponse | ErrorResponse, { query: string }>, res: Response): Promise<void> {
    try {
      const { sid } = req.params;
      const { query } = req.body;

      if (!query) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'query is required in body',
          code: 'MISSING_QUERY',
        });
        return;
      }

      const result = await mundoService.query(sid, query);
      res.json(result);
    } catch (error) {
      logger.error('Failed to query mundo:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/sessions/:sid/percepto
   * Send percepto to the world (broadcast to all FIAs)
   */
  async sendPercepto(req: Request<SessionParams, SendPerceptoResponse | ErrorResponse, { percepto: IPercepto }>, res: Response): Promise<void> {
    try {
      const { sid } = req.params;
      const { percepto } = req.body;

      if (!percepto) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'percepto is required in body',
          code: 'MISSING_PERCEPTO',
        });
        return;
      }

      if (!percepto.tipo || !percepto.payload) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'percepto must have tipo and payload',
          code: 'INVALID_PERCEPTO',
        });
        return;
      }

      const result = await mundoService.sendPercepto(sid, percepto);
      
      logger.info(`Percepto sent to session ${sid}, processed by ${result.processedBy.length} FIAs`);
      res.json(result);
    } catch (error) {
      logger.error('Failed to send percepto:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
