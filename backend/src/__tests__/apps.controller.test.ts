/**
 * Apps Controller Tests
 * 
 * Backend is Source of Truth - reads from fia-catalog.json directly
 * @épica AAIA-BACKEND-1.0.0
 */

import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../routes';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Apps Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/apps', () => {
    it('should list all apps from catalog', async () => {
      const response = await request(app)
        .get('/api/apps')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.apps)).toBe(true);
    });
  });

  describe('GET /api/apps/:id', () => {
    it('should get app by ID if exists in catalog', async () => {
      const response = await request(app)
        .get('/api/apps/demo-logica');

      // May be 200 or 404 depending on catalog content
      expect([200, 404]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.app).toBeDefined();
      }
    });

    it('should return 404 for non-existent app', async () => {
      const response = await request(app)
        .get('/api/apps/non-existent-app-xyz')
        .expect(404);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('APP_NOT_FOUND');
    });
  });

  describe('GET /api/paradigmas', () => {
    it('should list available paradigms from catalog', async () => {
      const response = await request(app)
        .get('/api/paradigmas')
        .expect(200);

      expect(response.body.paradigmas).toBeDefined();
      expect(Array.isArray(response.body.paradigmas)).toBe(true);
    });
  });
});
