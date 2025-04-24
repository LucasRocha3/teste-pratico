const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

function initDb() {
  db.serialize(() => {
    // Criar tabela de pontuações se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        gameDate DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Banco de dados inicializado com sucesso');
  });
}

module.exports = {
  db,
  initDb
};