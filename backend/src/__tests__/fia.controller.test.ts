/**
 * FIA Controller Tests
 */

import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../routes';
import { mcpGateway } from '../services/mcp-gateway';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('FIA Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/sessions/:sid/fias', () => {
    it('should list FIAs for a session', async () => {
      const mockFias = [
        { index: 0, paradigma: 'logica', runState: 'paused' },
        { index: 1, paradigma: 'reactiva', runState: 'running' },
      ];

      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        fias: mockFias,
      });

      const response = await request(app)
        .get('/api/sessions/test-session/fias')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.fias).toHaveLength(2);
      expect(mcpGateway.callTool).toHaveBeenCalledWith('aaia_list_fias', { sessionId: 'test-session' });
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/step', () => {
    it('should execute a step on FIA', async () => {
      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        eferencia: { accion: 'mover', destino: 'norte' },
      });

      const response = await request(app)
        .post('/api/sessions/test-session/fias/0/step')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mcpGateway.callTool).toHaveBeenCalledWith('aaia_step_fia', {
        sessionId: 'test-session',
        fiaIndex: 0,
      });
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/start', () => {
    it('should start FIA', async () => {
      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        newState: 'running',
      });

      const response = await request(app)
        .post('/api/sessions/test-session/fias/0/start')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/stop', () => {
    it('should stop FIA', async () => {
      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        newState: 'paused',
      });

      const response = await request(app)
        .post('/api/sessions/test-session/fias/0/stop')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/sessions/:sid/fias/:idx/eferencia', () => {
    it('should get latest eferencia', async () => {
      const mockEferencia = {
        accion: 'hablar',
        destino: 'usuario',
        datos: { mensaje: 'Hola' },
      };

      (mcpGateway.callTool as jest.Mock).mockResolvedValue({
        success: true,
        eferencia: mockEferencia,
      });

      const response = await request(app)
        .get('/api/sessions/test-session/fias/0/eferencia')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.eferencia.accion).toBe('hablar');
    });
  });
});
