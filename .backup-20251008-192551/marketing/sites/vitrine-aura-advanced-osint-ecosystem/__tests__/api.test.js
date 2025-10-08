const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }
  
  res.json({ success: true, message: 'Message envoyé avec succès' });
});

app.get('/api/services/status', (req, res) => {
  const services = [
    { name: 'TikTok Engine', status: 'online' },
    { name: 'Analytics API', status: 'online' }
  ];
  res.json({ services });
});

describe('API Tests', () => {
  test('POST /api/contact - success', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('POST /api/contact - validation error', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Champs requis manquants');
  });

  test('GET /api/services/status', async () => {
    const response = await request(app)
      .get('/api/services/status');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.services)).toBe(true);
  });
});