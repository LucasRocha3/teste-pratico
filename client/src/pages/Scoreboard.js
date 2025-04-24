import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const ScoreboardContainer = styled.div`
  background: linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 800px;
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
    background: #3498db);
  }
`;

const Title = styled.h2`
  margin-bottom: 30px;
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

const ScoreTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 25px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background: white;
  
  th, td {
    padding: 16px;
    text-align: left;
  }
  
  th {
    background: rgba(52, 152, 219, 0.8);
    color: white;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: 14px;
    position: relative;
    
    &:first-child {
      border-top-left-radius: 12px;
    }
    
    &:last-child {
      border-top-right-radius: 12px;
    }
  }
  
  tr:nth-child(even) {
    background-color: rgba(236, 240, 241, 0.5);
  }
  
  tr:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
  
  td {
    border-bottom: 1px solid #ecf0f1;
    color: #34495e;
    transition: all 0.3s ease;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  /* Coluna de posição estilizada */
  td:first-child {
    font-weight: 700;
    color: #2c3e50;
    font-size: 18px;
  }
  
  /* Coluna de tentativas estilizada */
  td:nth-child(3) {
    font-weight: 600;
    color: #9b59b6;
  }
  
  /* Estilização para os 3 primeiros lugares */
  tr:nth-child(1) td:first-child {
    color: #f1c40f;
    position: relative;
    
    &::after {
      content: '🥇';
      margin-left: 5px;
    }
  }
  
  tr:nth-child(2) td:first-child {
    color: #95a5a6;
    position: relative;
    
    &::after {
      content: '🥈';
      margin-left: 5px;
    }
  }
  
  tr:nth-child(3) td:first-child {
    color: #d35400;
    position: relative;
    
    &::after {
      content: '🥉';
      margin-left: 5px;
    }
  }
  
  @media (max-width: 500px) {
    font-size: 14px;
    
    th, td {
      padding: 10px;
    }
    
    th {
      font-size: 12px;
    }
  }
`;

const Message = styled.div`
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  background-color: ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  color: ${props => props.error ? '#c0392b' : '#2980b9'};
  border-left: 5px solid ${props => props.error ? '#c0392b' : '#2980b9'};
  font-weight: 500;
  display: flex;
  align-items: center;
  
  &::before {
    content: '${props => props.error ? '✗' : 'ℹ'}';
    font-size: 20px;
    margin-right: 12px;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #3498db;
  font-weight: 600;
  position: relative;
  
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 12px;
    border: 3px solid rgba(52, 152, 219, 0.3);
    border-radius: 50%;
    border-top-color: #3498db;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const RefreshButton = styled.button`
  padding: 12px 24px;
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
  margin: 25px auto 0;
  
  &::before {
    content: '🔄';
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
`;

const DateCell = styled.td`
  font-size: 14px;
  color: #7f8c8d !important;
`;

function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/scores');
      setScores(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar pontuações:', err);
      setError('Não foi possível carregar o placar. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ScoreboardContainer>
      <Title>Ranking de Jogadores</Title>
      
      {loading && <LoadingIndicator>Carregando ranking...</LoadingIndicator>}
      
      {error && <Message error>{error}</Message>}
      
      {!loading && !error && scores.length === 0 && (
        <Message>Ainda não há pontuações registradas. Seja o primeiro a jogar!</Message>
      )}
      
      {!loading && !error && scores.length > 0 && (
        <ScoreTable>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Tentativas</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.playerName}</td>
                <td>{score.attempts}</td>
                <DateCell>{formatDate(score.gameDate)}</DateCell>
              </tr>
            ))}
          </tbody>
        </ScoreTable>
      )}
      
      <RefreshButton onClick={fetchScores} disabled={loading}>
        Atualizar Ranking
      </RefreshButton>
    </ScoreboardContainer>
  );
}

export default Scoreboard;