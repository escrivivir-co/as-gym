/**
 * Percepto route - Sibling of mundo under /sessions/:sid
 * 
 * Endpoint:
 *   POST   /sessions/:sid/percepto → sendPercepto
 */

import { Router } from 'express';
import { MundoController } from '../controllers/mundo.controller';

const router = Router({ mergeParams: true });
const controller = new MundoController();

// Send percepto to world
router.post('/', controller.sendPercepto.bind(controller));

export { router as perceptoRoutes };
