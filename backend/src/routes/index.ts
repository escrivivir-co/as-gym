/**
 * API Routes aggregator
 * 
 * Structure aligned with OpenAPI spec:
 *   /sessions                      → Session CRUD
 *   /sessions/:sid/fias            → FIA operations (nested)
 *   /sessions/:sid/mundo           → World queries (nested)
 *   /sessions/:sid/percepto        → Send percepto (nested)
 *   /sessions/:sid/events          → SSE stream for session (nested)
 *   /apps                          → App catalog
 *   /paradigmas                    → Paradigm list
 *   /events                        → SSE stream for all events
 */

import { Router } from 'express';
import { sessionRoutes } from './session.routes';
import { fiaRoutes } from './fia.routes';
import { mundoRoutes } from './mundo.routes';
import { perceptoRoutes } from './percepto.routes';
import { appsRoutes } from './apps.routes';
import eventsRoutes from './events.routes';
import { AppsController } from '../controllers/apps.controller';
import * as eventsController from '../controllers/events.controller';

const router = Router();
const appsController = new AppsController();

// Session routes (includes nested FIA and Mundo routes)
router.use('/sessions', sessionRoutes);

// Nested routes under sessions
router.use('/sessions/:sid/fias', fiaRoutes);
router.use('/sessions/:sid/mundo', mundoRoutes);
router.use('/sessions/:sid/percepto', perceptoRoutes);

// SSE events for specific session
router.get('/sessions/:sid/events', eventsController.subscribeSession);

// App catalog (standalone)
router.use('/apps', appsRoutes);

// Global events SSE stream
router.use('/events', eventsRoutes);

// Paradigmas endpoint (OpenAPI spec)
router.get('/paradigmas', appsController.listParadigmas.bind(appsController));

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'AAIA Backend API',
    version: '1.0.0',
    spec: 'OpenAPI 3.0 aligned',
    endpoints: {
      sessions: '/api/sessions',
      fias: '/api/sessions/:sid/fias',
      mundo: '/api/sessions/:sid/mundo',
      events: '/api/events',
      apps: '/api/apps',
    },
  });
});

export { router as apiRoutes };
