/**
 * Apps routes - App catalog
 * 
 * Endpoints:
 *   GET    /apps           → listApps
 *   GET    /apps/:id       → getApp
 */

import { Router } from 'express';
import { AppsController } from '../controllers/apps.controller';

const router = Router();
const controller = new AppsController();

// List all apps
router.get('/', controller.list.bind(controller));

// Get app by ID
router.get('/:id', controller.get.bind(controller));

export { router as appsRoutes };
