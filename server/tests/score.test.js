const request = require('supertest');
const app = require('../server');

describe('Score API', () => {
  test('Deve adicionar nova pontuação', async () => {
    const scoreData = {
      playerName: 'TestPlayer',
      attempts: 5
    };
    
    const response = await request(app)
      .post('/api/scores')
      .send(scoreData)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.playerName).toBe(scoreData.playerName);
    expect(response.body.attempts).toBe(scoreData.attempts);
  });
  
  test('Deve rejeitar pontuação inválida', async () => {
    const invalidScore = {
      // Falta playerName
      attempts: 5
    };
    
    const response = await request(app)
      .post('/api/scores')
      .send(invalidScore)
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
  
  test('Deve retornar lista de pontuações', async () => {
    const response = await request(app)
      .get('/api/scores')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});