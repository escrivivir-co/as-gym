/**
 * Mundo routes - Nested under /sessions/:sid
 * 
 * Endpoints:
 *   GET    /sessions/:sid/mundo          → getState
 *   POST   /sessions/:sid/mundo/query    → query
 *   POST   /sessions/:sid/percepto       → sendPercepto
 * 
 * Note: percepto is a sibling route, not under /mundo
 */

import { Router } from 'express';
import { MundoController } from '../controllers/mundo.controller';

const router = Router({ mergeParams: true }); // Important: merge params from parent router
const controller = new MundoController();

// Get world state
router.get('/', controller.getState.bind(controller));

// Custom query on world model
router.post('/query', controller.query.bind(controller));

export { router as mundoRoutes };
