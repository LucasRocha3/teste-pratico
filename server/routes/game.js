const express = require('express');
const router = express.Router();

// Armazenar jogos ativos com seus números secretos
const activeGames = new Map();

// Iniciar um novo jogo
router.post('/new', (req, res) => {
  // Gerar um ID único para o jogo
  const gameId = Date.now().toString();
  
  // Gerar número aleatório entre 1 e 100
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  
  // Armazenar o jogo
  activeGames.set(gameId, {
    secretNumber,
    attempts: 0,
    startTime: new Date(),
    guesses: []
  });
  
  res.status(201).json({ 
    gameId,
    message: 'Novo jogo iniciado! Tente adivinhar o número entre 1 e 100.'
  });
});

// Fazer uma tentativa
router.post('/:gameId/guess', (req, res) => {
  const { gameId } = req.params;
  const { guess } = req.body;
  
  // Validar parâmetros
  if (!gameId || !activeGames.has(gameId)) {
    return res.status(404).json({ error: 'Jogo não encontrado' });
  }
  
  if (!guess || isNaN(guess) || guess < 1 || guess > 100) {
    return res.status(400).json({ error: 'Por favor, forneça um número válido entre 1 e 100' });
  }
  
  const game = activeGames.get(gameId);
  const numGuess = parseInt(guess);
  
  // Incrementar tentativas
  game.attempts += 1;
  game.guesses.push(numGuess);
  
  // Verificar resultado
  if (numGuess === game.secretNumber) {
    const result = {
      correct: true,
      message: `Parabéns! Você acertou o número ${game.secretNumber} em ${game.attempts} tentativas!`,
      attempts: game.attempts,
      guesses: game.guesses
    };
    
    return res.json(result);
  } else if (numGuess < game.secretNumber) {
    return res.json({
      correct: false,
      message: 'Tente um número maior!',
      attempts: game.attempts
    });
  } else {
    return res.json({
      correct: false,
      message: 'Tente um número menor!',
      attempts: game.attempts
    });
  }
});

// Obter status do jogo atual
router.get('/:gameId', (req, res) => {
  const { gameId } = req.params;
  
  if (!gameId || !activeGames.has(gameId)) {
    return res.status(404).json({ error: 'Jogo não encontrado' });
  }
  
  const game = activeGames.get(gameId);
  
  res.json({
    gameId,
    attempts: game.attempts,
    guesses: game.guesses,
    startTime: game.startTime
  });
});

module.exports = router;

