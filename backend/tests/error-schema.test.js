const request = require('supertest');
const app = require('../app');

describe('Error Schema', () => {
  test('POST /api/dictionary (invalid body) returns 400 + VALIDATION_ERROR schema', async () => {
    const res = await request(app)
      .post('/api/dictionary')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('requestId');
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(res.body.error).toHaveProperty('message', 'Validation failed');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  test('GET /api/unknown returns 404 + NOT_FOUND schema', async () => {
    const res = await request(app).get('/api/unknown');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('requestId');
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(res.body.error).toHaveProperty('message', 'Not Found');
  });

  test('POST /api/upload (invalid file type) returns 400 + UPLOAD_ERROR schema', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('image', Buffer.from('not an image'), 'a.txt');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('requestId');
    expect(res.body.error).toHaveProperty('code', 'UPLOAD_ERROR');
    expect(res.body.error).toHaveProperty('message', 'Invalid file type');
    expect(res.body.error).toHaveProperty('details');
  });
});

