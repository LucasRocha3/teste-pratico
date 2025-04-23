const express = require('express');
const router = express.Router();
const { addScore, getTopScores } = require('../database/scoreModel');

// Adicionar uma nova pontuação
router.post('/', async (req, res) => {
  try {
    const { playerName, attempts } = req.body;
    
    // Validar dados
    if (!playerName || !attempts || isNaN(attempts)) {
      return res.status(400).json({ error: 'Nome do jogador e número de tentativas são obrigatórios' });
    }
    
    const newScore = await addScore(playerName, attempts);
    res.status(201).json(newScore);
  } catch (err) {
    console.error('Erro ao salvar pontuação:', err);
    res.status(500).json({ error: 'Erro ao salvar pontuação' });
  }
});

// Obter o ranking de melhores pontuações
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const scores = await getTopScores(limit);
    res.json(scores);
  } catch (err) {
    console.error('Erro ao obter pontuações:', err);
    res.status(500).json({ error: 'Erro ao obter pontuações' });
  }
});

module.exports = router;