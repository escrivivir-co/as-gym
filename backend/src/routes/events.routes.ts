/**
 * Events Routes - SSE subscriptions
 */

import { Router } from 'express';
import * as eventsController from '../controllers/events.controller';

const router = Router();

// GET /events - Subscribe to all events
router.get('/', eventsController.subscribeAll);

// GET /events/status - Get events service status
router.get('/status', eventsController.getEventsStatus);

export default router;
