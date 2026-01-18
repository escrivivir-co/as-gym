/**
 * FIA routes - Nested under /sessions/:sid
 * 
 * Endpoints:
 *   GET    /sessions/:sid/fias               → listFIAs
 *   GET    /sessions/:sid/fias/:idx          → getFIA
 *   POST   /sessions/:sid/fias/:idx/start    → startFIA
 *   POST   /sessions/:sid/fias/:idx/stop     → stopFIA
 *   POST   /sessions/:sid/fias/:idx/step     → stepFIA
 *   GET    /sessions/:sid/fias/:idx/eferencia → getEferencia
 */

import { Router } from 'express';
import { FIAController } from '../controllers/fia.controller';

const router = Router({ mergeParams: true }); // Important: merge params from parent router
const controller = new FIAController();

// List all FIAs in session
router.get('/', controller.list.bind(controller));

// Get specific FIA
router.get('/:idx', controller.get.bind(controller));

// Start FIA
router.post('/:idx/start', controller.start.bind(controller));

// Stop FIA
router.post('/:idx/stop', controller.stop.bind(controller));

// Step FIA (execute one reasoning cycle)
router.post('/:idx/step', controller.step.bind(controller));

// Get last eferencia
router.get('/:idx/eferencia', controller.getEferencia.bind(controller));

export { router as fiaRoutes };
