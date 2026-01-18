/**
 * AAIAGallery Backend - REST API Gateway
 * 
 * Architecture:
 *   Angular Frontend <--HTTP--> This Backend <--MCP--> MCPAAIAServer (3007)
 *                     <--SSE-->              <--WS--> AlephScriptClient (3000)
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
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { apiRoutes } from './routes';
import { mcpGateway } from './services/mcp-gateway';
import { socketIOService } from './services/socketio.service';

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
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    mcp: mcpGateway.getStatus(),
    socketio: socketIOService.getStatus(),
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
    // Initialize MCP Gateway
    await mcpGateway.initialize();
    logger.info('MCP Gateway initialized');

    // Initialize Socket.IO connection (non-blocking)
    socketIOService.connect().then(() => {
      logger.info('Socket.IO connected to AlephScriptClient');
    }).catch((error) => {
      logger.warn('Socket.IO connection failed (will retry):', error.message);
    });

    // Start HTTP server
    app.listen(port, () => {
      logger.info(`AAIA Backend running on http://localhost:${port}`);
      logger.info(`Health check: http://localhost:${port}/health`);
      logger.info(`SSE events: http://localhost:${port}/api/events`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app };
