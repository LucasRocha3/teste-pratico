# Teste Prático DTI - Jogo de Adivinhação

Aplicação web onde o usuário tenta adivinhar um número aleatório gerado pelo sistema. Desenvolvido com Node.js e React.

## Tecnologias utilizadas

### Backend
- Node.js
- SQLite para banco de dados
- Arquitetura RESTful API
- Jest para testes automatizados

### Frontend
- React
- Styled Components para estilização
- Axios para comunicação com a API

## Premissas assumidas

- O usuário joga sozinho, tentando adivinhar o número com o menor número de tentativas possível
- É interessante manter um histórico das melhores pontuações para estimular competição
- A interface deve ser simples e intuitiva, focada na experiência de jogo
- O backend deve validar as entradas para garantir a segurança e integridade dos dados
- O jogo deve fornecer feedback claro para o usuário (se o número é maior ou menor)

## Decisões de projeto

1. **Arquitetura separada**: Backend e frontend completamente separados, comunicando-se via API RESTful.

2. **Persistência de dados**: Utilização do SQLite para armazenar as pontuações dos jogadores.

3. **Gerenciamento de estado dos jogos**: Os jogos ativos são mantidos em memória no servidor (em produção, seria melhor usar Redis ou outra solução de cache).

4. **Design responsivo**: Interface adaptável a diferentes tamanhos de tela.

5. **Funcionalidades extras implementadas**:
   - Sistema de ranking dos melhores jogadores
   - Contador de tentativas
   - Feedback visual intuitivo ao usuário
   - Testes automatizados

6. **Padrões RESTful**:
   - Uso adequado dos métodos HTTP (GET, POST)
   - Status HTTP apropriados para cada resposta
   - Nomenclatura clara nas rotas da API

## Instruções para executar o sistema

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Configuração do Backend

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd testepratico
   ```

2. Instale as dependências do servidor:
   ```bash
   cd server
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```
   O servidor estará rodando na porta 5000 (http://localhost:5000).

### Configuração do Frontend

1. Em um novo terminal, instale as dependências do cliente:
   ```bash
   cd client
   npm install
   ```

2. Inicie a aplicação React:
   ```bash
   npm start
   ```
   O aplicativo estará disponível em http://localhost:3000.

### Rodando os testes

```bash
cd server
npm test
```

## Uso da IA no projeto

Para este projeto, utilizei ferramentas de IA (Claude) como auxílio para realização de testes com o jest e estruturação do projeto. Isso me ajudou a:

1. Definir a arquitetura inicial e estrutura de diretórios
2. Implementar os testes automatizados básicos

No entanto, todo o código gerado foi revisado, adaptado e complementado por mim para garantir que atendesse aos requisitos específicos do projeto e seguisse as melhores práticas de desenvolvimento.