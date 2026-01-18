/**
 * AAIAGallery Backend - REST API Gateway
 * 
 * Architecture (v2 - Backend as Source of Truth):
 *   Angular Frontend <--HTTP--> This Backend (SoT) <--Socket.IO--> ws-server (3010)
 *                     <--SSE-->                                         │
 *   MCP AAIA Server  <--HTTP--> This Backend (SoT)                      │
 *   (3007, thin)                                                         │
 *                                                    👑 PersefonBot ─────┘
 * 
 * Endpoints:
 *   /api/sessions    - Session management (CRUD)
 *   /api/fias        - FIA operations (step, percepto)
 *   /api/mundo       - World queries
 *   /api/apps        - App catalog
 *   /api/events      - SSE stream for real-time updates
 *   /health          - Health check
 * 
 * @module @alephscript/aaia-backend
 * @épica AAIA-BACKEND-1.0.0
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { apiRoutes } from './routes';
import { socketIOService } from './services/socketio.service';
import { sessionService } from './services/session.service';

const app: Application = express();
const port = process.env.PORT || 8007;

// ============================================
// Middleware
// ============================================

app.use(cors());
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`, { 
    query: req.query, 
    body: req.method !== 'GET' ? req.body : undefined 
  });
  next();
});

// ============================================
// Routes
// ============================================

app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const sessions = await sessionService.listSessions();
  res.json({
    status: 'healthy',
    version: '2.0.0',
    architecture: 'Backend as Source of Truth',
    persistence: 'FileCollection (data/aaia-backend/sessions/)',
    socketio: socketIOService.getStatus(),
    activeSessions: sessions.count,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Error handling
// ============================================

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================
// Startup
// ============================================

async function startServer() {
  try {
    // Initialize Socket.IO connection via PersefonBot (non-blocking)
    socketIOService.connect().then(() => {
      logger.info('👑 PersefonBot connected to ws-server (3010)');
    }).catch((error) => {
      logger.warn('Socket.IO connection failed (will retry):', error.message);
    });

    // Start HTTP server
    app.listen(port, () => {
      logger.info(`🏛️  AAIA Backend (Source of Truth) running on http://localhost:${port}`);
      logger.info(`💾 Persistence: data/aaia-backend/sessions/`);
      logger.info(`❤️  Health check: http://localhost:${port}/health`);
      logger.info(`📡 SSE events: http://localhost:${port}/api/events`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app };
