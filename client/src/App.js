import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';
import Game from './pages/Game';
import Scoreboard from './pages/Scoreboard';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
