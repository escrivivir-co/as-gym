/**
 * Events Controller - SSE endpoints for real-time updates
 * 
 * Exposes Server-Sent Events for frontend clients
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { socketIOService, SSEClient } from '../services/socketio.service';
import { logger } from '../utils/logger';

/**
 * Subscribe to all AAIA events via SSE
 * GET /events
 */
export const subscribeAll = (req: Request, res: Response): void => {
  setupSSE(req, res, null);
};

/**
 * Subscribe to events for a specific session via SSE
 * GET /sessions/:sid/events
 */
export const subscribeSession = (req: Request, res: Response): void => {
  const sessionId = req.params.sid as string;
  setupSSE(req, res, sessionId);
};

/**
 * Setup SSE connection
 */
function setupSSE(req: Request, res: Response, sessionId: string | null): void {
  const clientId = uuidv4();

  logger.info(`SSE client connecting: ${clientId} (session: ${sessionId || 'all'})`);

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  
  // Flush headers
  res.flushHeaders();

  // Send initial connection event
  sendSSE(res, 'connected', { clientId, sessionId, timestamp: new Date().toISOString() });

  // Create SSE client
  const client: SSEClient = {
    id: clientId,
    sessionId,
    send: (event: string, data: unknown) => {
      sendSSE(res, event, data);
    },
    close: () => {
      res.end();
    },
  };

  // Register with Socket.IO service
  socketIOService.registerSSEClient(client);

  // Send keepalive every 30 seconds
  const keepalive = setInterval(() => {
    sendSSE(res, 'keepalive', { timestamp: new Date().toISOString() });
  }, 30000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(keepalive);
    socketIOService.unregisterSSEClient(clientId);
    logger.info(`SSE client disconnected: ${clientId}`);
  });

  req.on('error', (error) => {
    clearInterval(keepalive);
    socketIOService.unregisterSSEClient(clientId);
    logger.error(`SSE client error: ${clientId}`, error);
  });
}

/**
 * Send SSE event to client
 */
function sendSSE(res: Response, event: string, data: unknown): void {
  try {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch (error) {
    // Connection probably closed
  }
}

/**
 * Get events status
 * GET /events/status
 */
export const getEventsStatus = (_req: Request, res: Response): void => {
  res.json({
    success: true,
    socketio: socketIOService.getStatus(),
    timestamp: new Date().toISOString(),
  });
};
