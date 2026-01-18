/**
 * Session management routes
 * 
 * Endpoints:
 *   POST   /api/sessions       - Create new session
 *   GET    /api/sessions       - List all sessions  
 *   GET    /api/sessions/:id   - Get session by ID
 *   DELETE /api/sessions/:id   - Destroy session
 */

import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

const router = Router();
const controller = new SessionController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.get.bind(controller));
router.delete('/:id', controller.destroy.bind(controller));

export { router as sessionRoutes };
