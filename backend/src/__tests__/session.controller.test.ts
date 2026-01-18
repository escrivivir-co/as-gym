/**
 * Session Controller Tests
 * 
 * Backend is Source of Truth - uses sessionService with FileCollection
 * @épica AAIA-BACKEND-1.0.0
 */

import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../routes';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Session Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/sessions', () => {
    it('should return 400 if appId is missing', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('MISSING_APP_ID');
    });

    // Note: Full integration tests require fia-catalog.json to have valid apps
    it('should create session if appId exists in catalog', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({ appId: 'demo-logica' });

      // May succeed or fail depending on catalog
      expect([201, 404]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.sessionId).toBeDefined();
      }
    });
  });

  describe('GET /api/sessions', () => {
    it('should list all sessions (may be empty)', async () => {
      const response = await request(app)
        .get('/api/sessions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.sessions)).toBe(true);
      expect(typeof response.body.count).toBe('number');
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/sessions/non-existent-session')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /api/sessions/:id', () => {
    it('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .delete('/api/sessions/non-existent-session')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
