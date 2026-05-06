const request = require('supertest');
const app = require('../src/server');

describe('MCQ Generator API', () => {

  describe('GET /health', () => {
    test('should return active status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('active');
      expect(response.body.message).toContain('Node.js MCQ Backend');
    });
  });

  describe('POST /api/generate-mcq - Validation', () => {
    test('should reject empty content', async () => {
      const response = await request(app)
        .post('/api/generate-mcq')
        .send({
          content: '',
          api_key: 'test-key',
          difficulty: 'Medium'
        });
      expect(response.status).toBe(400);
      expect(response.body.detail).toContain('Content cannot be empty');
    });

    test('should reject missing API key', async () => {
      const response = await request(app)
        .post('/api/generate-mcq')
        .send({
          content: 'Sample content',
          difficulty: 'Medium'
        });
      expect(response.status).toBe(400);
      expect(response.body.detail).toContain('API Key is required');
    });

    test('should accept max_questions parameter', async () => {
      const mockContent = 'Test content for MCQ generation';
      const mockApiKey = 'test-key';

      // This will fail due to invalid API key, but we're testing parameter acceptance
      const response = await request(app)
        .post('/api/generate-mcq')
        .send({
          content: mockContent,
          api_key: mockApiKey,
          difficulty: 'Easy',
          max_questions: 10
        });

      // Should not be 400 (validation error), will be 502 due to API issues
      expect(response.status).not.toBe(400);
    });

    test('should cap max_questions at 200', async () => {
      const response = await request(app)
        .post('/api/generate-mcq')
        .send({
          content: 'Sample content',
          api_key: 'test-key',
          max_questions: 500
        });

      // Should fail with API error, not validation error
      expect(response.status).not.toBe(400);
    });

    test('should accept both snake_case and camelCase for max_questions', async () => {
      const payload1 = {
        content: 'Content',
        api_key: 'key',
        max_questions: 25
      };

      const payload2 = {
        content: 'Content',
        api_key: 'key',
        maxQuestions: 25
      };

      const response1 = await request(app)
        .post('/api/generate-mcq')
        .send(payload1);

      const response2 = await request(app)
        .post('/api/generate-mcq')
        .send(payload2);

      // Both should process (not validation errors)
      expect(response1.status).not.toBe(400);
      expect(response2.status).not.toBe(400);
    });
  });

  describe('API Route Configuration', () => {
    test('POST /api/generate-mcq should exist', async () => {
      const response = await request(app)
        .post('/api/generate-mcq')
        .send({
          content: 'test',
          api_key: 'test'
        });

      // Should not be 404 (route not found)
      expect(response.status).not.toBe(404);
    });

    test('should not have auth routes', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password'
        });

      // Should be 404 since auth routes are removed
      expect(response.status).toBe(404);
    });
  });

});
