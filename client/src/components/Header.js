import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
`;

const Logo = styled.h1`
  color: #4a90e2;
  font-size: 24px;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    
    li {
      margin-left: 20px;
      
      a {
        text-decoration: none;
        color: #333;
        font-weight: bold;
        transition: color 0.3s;
        
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <Logo>Guess the Number</Logo>
      <Nav>
        <ul>
          <li>
            <Link to="/">Jogar</Link>
          </li>
          <li>
            <Link to="/scoreboard">Placar</Link>
          </li>
        </ul>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;