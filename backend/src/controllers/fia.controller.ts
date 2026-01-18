/**
 * FIA Controller - Manages FIA operations
 * 
 * Endpoints (OpenAPI spec aligned - nested under sessions):
 *   GET    /api/sessions/:sid/fias               → listFIAs
 *   GET    /api/sessions/:sid/fias/:idx          → getFIA
 *   POST   /api/sessions/:sid/fias/:idx/start    → startFIA
 *   POST   /api/sessions/:sid/fias/:idx/stop     → stopFIA
 *   POST   /api/sessions/:sid/fias/:idx/step     → stepFIA
 *   GET    /api/sessions/:sid/fias/:idx/eferencia → getEferencia
 */

import { Request, Response } from 'express';
import { fiaService } from '../services/fia.service';
import { logger } from '../utils/logger';
import {
  ListFIAsResponse,
  StepFIAResponse,
  GetFIAStateResponse,
  ErrorResponse,
} from '../types';

// Request params types
interface SessionParams {
  sid: string;
}

interface FIAParams extends SessionParams {
  idx: string;
}

export class FIAController {
  /**
   * GET /api/sessions/:sid/fias
   * List FIAs in session
   */
  async list(req: Request<SessionParams>, res: Response<ListFIAsResponse | ErrorResponse>): Promise<void> {
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

      const result = await fiaService.listFIAs(sid);
      res.json(result);
    } catch (error) {
      logger.error('Failed to list FIAs:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/sessions/:sid/fias/:idx
   * Get FIA info
   */
  async get(req: Request<FIAParams>, res: Response<GetFIAStateResponse | ErrorResponse>): Promise<void> {
    try {
      const { sid, idx } = req.params;
      const fiaIndex = parseInt(idx, 10);
      
      if (isNaN(fiaIndex)) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'FIA index must be a number',
          code: 'INVALID_FIA_INDEX',
        });
        return;
      }

      const result = await fiaService.getFIA(sid, fiaIndex);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to get FIA:`, error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          code: 'FIA_NOT_FOUND',
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
   * POST /api/sessions/:sid/fias/:idx/start
   * Start FIA (set to PLAY state)
   */
  async start(req: Request<FIAParams>, res: Response): Promise<void> {
    try {
      const { sid, idx } = req.params;
      const fiaIndex = parseInt(idx, 10);
      
      if (isNaN(fiaIndex)) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'FIA index must be a number',
          code: 'INVALID_FIA_INDEX',
        });
        return;
      }

      const result = await fiaService.startFIA(sid, fiaIndex);
      
      logger.info(`FIA ${fiaIndex} started in session ${sid}`);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to start FIA:`, error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/sessions/:sid/fias/:idx/stop
   * Stop FIA (set to STOP state)
   */
  async stop(req: Request<FIAParams>, res: Response): Promise<void> {
    try {
      const { sid, idx } = req.params;
      const fiaIndex = parseInt(idx, 10);
      
      if (isNaN(fiaIndex)) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'FIA index must be a number',
          code: 'INVALID_FIA_INDEX',
        });
        return;
      }

      const result = await fiaService.stopFIA(sid, fiaIndex);
      
      logger.info(`FIA ${fiaIndex} stopped in session ${sid}`);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to stop FIA:`, error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * POST /api/sessions/:sid/fias/:idx/step
   * Execute one reasoning step
   */
  async step(req: Request<FIAParams>, res: Response<StepFIAResponse | ErrorResponse>): Promise<void> {
    try {
      const { sid, idx } = req.params;
      const fiaIndex = parseInt(idx, 10);
      
      if (isNaN(fiaIndex)) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'FIA index must be a number',
          code: 'INVALID_FIA_INDEX',
        });
        return;
      }

      const result = await fiaService.stepFIA(sid, fiaIndex);
      
      logger.debug(`FIA ${fiaIndex} stepped in session ${sid}, cycles: ${result.cycles}`);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to step FIA:`, error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/sessions/:sid/fias/:idx/eferencia
   * Get last eferencia (output) from FIA
   */
  async getEferencia(req: Request<FIAParams>, res: Response): Promise<void> {
    try {
      const { sid, idx } = req.params;
      const fiaIndex = parseInt(idx, 10);
      
      if (isNaN(fiaIndex)) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'FIA index must be a number',
          code: 'INVALID_FIA_INDEX',
        });
        return;
      }

      const result = await fiaService.getEferencia(sid, fiaIndex);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to get eferencia:`, error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
