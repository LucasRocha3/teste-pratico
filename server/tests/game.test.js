const request = require('supertest');
const app = require('../server');

describe('Game API', () => {
  let gameId;
  
  test('Deve iniciar um novo jogo', async () => {
    const response = await request(app)
      .post('/api/game/new')
      .expect(201);
    
    expect(response.body).toHaveProperty('gameId');
    expect(response.body).toHaveProperty('message');
    
    gameId = response.body.gameId;
  });
  
  test('Deve rejeitar tentativa inválida', async () => {
    // Primeiro cria um jogo
    const newGame = await request(app)
      .post('/api/game/new')
      .expect(201);
    
    const gameId = newGame.body.gameId;
    
    // Tenta enviar um número inválido
    const response = await request(app)
      .post(`/api/game/${gameId}/guess`)
      .send({ guess: 101 }) // Número fora do intervalo 1-100
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
  
  test('Deve obter status do jogo', async () => {
    // Primeiro cria um jogo
    const newGame = await request(app)
      .post('/api/game/new')
      .expect(201);
    
    const gameId = newGame.body.gameId;
    
    // Obtém status do jogo
    const response = await request(app)
      .get(`/api/game/${gameId}`)
      .expect(200);
    
    expect(response.body).toHaveProperty('gameId');
    expect(response.body).toHaveProperty('attempts');
    expect(response.body).toHaveProperty('guesses');
    expect(response.body).toHaveProperty('startTime');
  });
});