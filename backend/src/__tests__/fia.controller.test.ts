/**
 * FIA Controller Tests
 * 
 * Backend is Source of Truth - uses fiaService with sessionService
 * @épica AAIA-BACKEND-1.0.0
 */

import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../routes';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('FIA Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/sessions/:sid/fias', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/sessions/non-existent/fias')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/step', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .post('/api/sessions/non-existent/fias/0/step')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/start', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .post('/api/sessions/non-existent/fias/0/start')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/sessions/:sid/fias/:idx/stop', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .post('/api/sessions/non-existent/fias/0/stop')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
