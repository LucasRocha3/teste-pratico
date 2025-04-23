import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const GameContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const GameForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Message = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  background-color: ${props => props.success ? '#d4edda' : props.error ? '#f8d7da' : '#cce5ff'};
  color: ${props => props.success ? '#155724' : props.error ? '#721c24' : '#004085'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : props.error ? '#f5c6cb' : '#b8daff'};
`;

const AttemptsCounter = styled.p`
  font-size: 18px;
  margin-top: 20px;
  
  span {
    font-weight: bold;
    color: #4a90e2;
  }
`;

const SaveScoreForm = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

function Game() {
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [attempts, setAttempts] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Iniciar um novo jogo quando o componente é montado
  useEffect(() => {
    startNewGame();
  }, []);

  // Iniciar um novo jogo
  const startNewGame = async () => {
    try {
      setLoading(true);
      const response = await api.post('/game/new');
      setGameId(response.data.gameId);
      setMessage('Jogo iniciado! Tente adivinhar o número entre 1 e 100.');
      setMessageType('info');
      setAttempts(0);
      setGameWon(false);
      setGuess('');
      setScoreSaved(false);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
      setMessage('Erro ao iniciar o jogo. Tente novamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Enviar tentativa
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!guess || isNaN(guess) || parseInt(guess) < 1 || parseInt(guess) > 100) {
      setMessage('Por favor, digite um número válido entre 1 e 100.');
      setMessageType('error');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post(`/game/${gameId}/guess`, { guess: parseInt(guess) });
      
      setMessage(response.data.message);
      setAttempts(response.data.attempts);
      
      if (response.data.correct) {
        setMessageType('success');
        setGameWon(true);
      } else {
        setMessageType('info');
        setGuess('');
      }
    } catch (error) {
      console.error('Erro ao enviar tentativa:', error);
      setMessage('Erro ao processar sua tentativa. Tente novamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Salvar a pontuação
  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      setMessage('Por favor, digite seu nome para salvar a pontuação.');
      setMessageType('error');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/scores', { playerName, attempts });
      setMessage('Pontuação salva com sucesso!');
      setMessageType('success');
      setScoreSaved(true);
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      setMessage('Erro ao salvar pontuação. Tente novamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContainer>
      <Title>Adivinhe o Número</Title>
      
      {message && (
        <Message 
          success={messageType === 'success'} 
          error={messageType === 'error'}
        >
          {message}
        </Message>
      )}
      
      <GameForm onSubmit={handleSubmit}>
        <InputGroup>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Digite um número entre 1 e 100"
            min="1"
            max="100"
            disabled={gameWon || !gameId || loading}
          />
          <button type="submit" disabled={gameWon || !gameId || loading}>
            Tentar
          </button>
        </InputGroup>
      </GameForm>
      
      <AttemptsCounter>
        Tentativas: <span>{attempts}</span>
      </AttemptsCounter>
      
      {gameWon && !scoreSaved && (
        <SaveScoreForm>
          <Title>Salvar Pontuação</Title>
          <InputGroup>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite seu nome"
              disabled={loading}
            />
            <button onClick={handleSaveScore} disabled={loading}>
              Salvar
            </button>
          </InputGroup>
        </SaveScoreForm>
      )}
      
      {(gameWon || scoreSaved) && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={startNewGame} disabled={loading}>
            Novo Jogo
          </button>
        </div>
      )}
    </GameContainer>
  );
}

export default Game;
