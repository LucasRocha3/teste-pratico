import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const GameContainer = styled.div`
  background: linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: #3498db;
  }
`;

const Title = styled.h2`
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 32px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #3498db;
    border-radius: 3px;
  }
`;

const GameForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
  
  input {
    flex: 1;
    padding: 14px 18px;
    border-radius: 8px;
    border: 2px solid #dce4ec;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: #fff;
    color: #34495e;
    
    &:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      outline: none;
    }
    
    &:disabled {
      background-color: #ecf0f1;
      cursor: not-allowed;
    }
    
    &::placeholder {
      color: #95a5a6;
    }
  }
  
  button {
    padding: 14px 24px;
    border-radius: 8px;
    border: none;
    background: #3498db;
    color: white;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    text-transform: uppercase;
    letter-spacing: 1px;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  }
`;

const Message = styled.div`
  padding: 18px;
  margin: 20px 0;
  border-radius: 10px;
  background-color: ${props => props.success ? 'rgba(46, 204, 113, 0.2)' : props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  color: ${props => props.success ? '#27ae60' : props.error ? '#c0392b' : '#2980b9'};
  border-left: 5px solid ${props => props.success ? '#27ae60' : props.error ? '#c0392b' : '#2980b9'};
  font-weight: 500;
  display: flex;
  align-items: center;
  
  &::before {
    content: '${props => props.success ? '✓' : props.error ? '✗' : 'ℹ'}';
    font-size: 20px;
    margin-right: 12px;
  }
`;

const AttemptsCounter = styled.p`
  font-size: 18px;
  margin: 25px 0;
  text-align: center;
  color: #34495e;
  
  span {
    font-weight: 700;
    color: #9b59b6;
    font-size: 24px;
    display: inline-block;
    min-width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background-color: rgba(155, 89, 182, 0.1);
    border-radius: 50%;
    margin: 0 5px;
  }
`;

const SaveScoreForm = styled.div`
  margin-top: 35px;
  padding-top: 25px;
  border-top: 2px dashed #bdc3c7;
  position: relative;
  
  &::before {
    content: '🏆';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f5f7fa;
    font-size: 24px;
    padding: 0 10px;
  }
`;

const GameControls = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  
  button {
    padding: 14px 30px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(90deg, #2ecc71, #1abc9c);
    color: white;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &::before {
      content: '🎮';
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  }
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
        <GameControls>
          <button onClick={startNewGame} disabled={loading}>
            Novo Jogo
          </button>
        </GameControls>
      )}
    </GameContainer>
  );
}

export default Game;