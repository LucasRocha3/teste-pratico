// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { initDb } = require('./database/db');

// Importar rotas
const gameRoutes = require('./routes/game');
const scoreRoutes = require('./routes/score');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Inicializar banco de dados
initDb();

// Rotas
app.use('/api/game', gameRoutes);
app.use('/api/scores', scoreRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'API do jogo Guess the Number' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro no servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;