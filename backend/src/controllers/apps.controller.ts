/**
 * Apps Controller - App catalog management
 * 
 * Endpoints (OpenAPI spec aligned):
 *   GET    /api/apps           → listApps
 *   GET    /api/apps/:id       → getApp
 *   GET    /api/paradigmas     → listParadigmas
 */

import { Request, Response } from 'express';
import { appsService } from '../services/apps.service';
import { logger } from '../utils/logger';
import {
  ListAppsResponse,
  GetAppResponse,
  ErrorResponse,
} from '../types';

export class AppsController {
  /**
   * GET /api/apps
   * List available apps from catalog
   */
  async list(_req: Request, res: Response<ListAppsResponse | ErrorResponse>): Promise<void> {
    try {
      const result = await appsService.listApps();
      res.json(result);
    } catch (error) {
      logger.error('Failed to list apps:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/apps/:id
   * Get app details by ID
   */
  async get(req: Request<{ id: string }>, res: Response<GetAppResponse | ErrorResponse>): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ 
          error: 'Validation Error',
          message: 'App ID is required',
          code: 'MISSING_APP_ID',
        });
        return;
      }

      const result = await appsService.getApp(id);
      res.json(result);
    } catch (error) {
      logger.error(`Failed to get app ${req.params.id}:`, error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
          code: 'APP_NOT_FOUND',
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
   * GET /api/paradigmas
   * List FIA paradigms (alternative endpoint)
   */
  async listParadigmas(_req: Request, res: Response): Promise<void> {
    try {
      const result = await appsService.listParadigmas();
      res.json(result);
    } catch (error) {
      logger.error('Failed to list paradigmas:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
