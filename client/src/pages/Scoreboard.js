import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const ScoreboardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const ScoreTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 500px) {
    font-size: 14px;
    
    th, td {
      padding: 8px;
    }
  }
`;

const Message = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  background-color: ${props => props.error ? '#f8d7da' : '#cce5ff'};
  color: ${props => props.error ? '#721c24' : '#004085'};
  border: 1px solid ${props => props.error ? '#f5c6cb' : '#b8daff'};
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
      
      {loading && <p>Carregando...</p>}
      
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
                <td>{formatDate(score.gameDate)}</td>
              </tr>
            ))}
          </tbody>
        </ScoreTable>
      )}
    </ScoreboardContainer>
  );
}

export default Scoreboard;