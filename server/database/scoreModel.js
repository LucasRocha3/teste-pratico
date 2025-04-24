const { db } = require('./db');

// Adicionar nova pontuação
function addScore(playerName, attempts) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO scores (playerName, attempts) VALUES (?, ?)';
    db.run(query, [playerName, attempts], function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, playerName, attempts });
    });
  });
}

// Obter todas as pontuações, ordenadas por menor número de tentativas
function getTopScores(limit = 10) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM scores ORDER BY attempts ASC, gameDate DESC LIMIT ?';
    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  addScore,
  getTopScores
};