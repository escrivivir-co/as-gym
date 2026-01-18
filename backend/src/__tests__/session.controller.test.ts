/**
 * Session Controller Tests
 */

import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../routes';
import { mcpGateway } from '../services/mcp-gateway';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Session Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        sessionId: 'test-session-123',
        appId: 'demo-logica',
        fiasCount: 2,
      });

      const response = await request(app)
        .post('/api/sessions')
        .send({ appId: 'demo-logica' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.sessionId).toBe('test-session-123');
      expect(response.body.appId).toBe('demo-logica');
      expect(mcpGateway.callTool).toHaveBeenCalledWith('aaia_create_session', { appId: 'demo-logica' });
    });

    it('should return 400 if appId is missing', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('MISSING_APP_ID');
    });
  });

  describe('GET /api/sessions', () => {
    it('should list all sessions', async () => {
      const mockSessions = [
        { sessionId: 'session-1', appId: 'app-1', createdAt: '2026-01-18T10:00:00Z' },
        { sessionId: 'session-2', appId: 'app-2', createdAt: '2026-01-18T11:00:00Z' },
      ];

      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        sessions: mockSessions,
      });

      const response = await request(app)
        .get('/api/sessions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.sessions).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should get session by ID', async () => {
      const mockSession = {
        sessionId: 'test-session-123',
        appId: 'demo-logica',
        fias: [{ index: 0, paradigma: 'logica' }],
        mundo: { state: {} },
      };

      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        session: mockSession,
        fias: mockSession.fias,
        mundo: mockSession.mundo,
      });

      const response = await request(app)
        .get('/api/sessions/test-session-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.session.sessionId).toBe('test-session-123');
    });
  });

  describe('DELETE /api/sessions/:id', () => {
    it('should destroy session', async () => {
      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
      });

      const response = await request(app)
        .delete('/api/sessions/test-session-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mcpGateway.callTool).toHaveBeenCalledWith('aaia_destroy_session', { sessionId: 'test-session-123' });
    });
  });
});
