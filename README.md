# Estuda — Plataforma de Métodos de Estudo

O **Estuda** é uma plataforma web educacional voltada para estudantes que desejam aplicar diferentes técnicas de aprendizagem e produtividade em um único ambiente. Nesta versão inicial, a plataforma oferece um **cronômetro Pomodoro** integrado com registro persistente de tempo de estudo e um **sistema completo de Flashcards** para prática de recordação ativa e memorização, alimentados por uma API RESTful e um banco de dados PostgreSQL hospedado no Neon.

---

## 🏛️ Arquitetura do Sistema

A arquitetura do projeto foi desenhada seguindo o princípio de separação clara de responsabilidades em três camadas independentes:

```
┌─────────────────────────────────┐
│     Frontend (SPA React)        │  - React 18, Vite, CSS Modules / Vanilla
│     http://localhost:5173       │  - Consome a API REST via fetch() com JSON
└────────────────┬────────────────┘
                 │ HTTP (JSON)
                 ▼
┌─────────────────────────────────┐
│     Backend (API RESTful)       │  - Node.js, Express, ES Modules
│     http://localhost:3001       │  - Validação de entrada, regras de negócio
└────────────────┬────────────────┘
                 │ TCP / SSL (@neondatabase/serverless)
                 ▼
┌─────────────────────────────────┐
│   Banco de Dados (PostgreSQL)   │  - Neon Serverless PostgreSQL
│   Neon Database (Nuvem)         │  - Tabelas: flashcards, study_sessions
└─────────────────────────────────┘
```

1. **Frontend (Cliente)**:
   - Desenvolvido com **React 18** e **Vite**.
   - Gerencia a experiência do usuário, navegação SPA (React Router), estado local do cronômetro Pomodoro e interface responsiva com feedback visual.
   - Comunica-se exclusivamente com a API através de requisições HTTP e payloads JSON. **Nunca acessa o banco de dados diretamente nem armazena credenciais de banco**.

2. **Backend (Servidor de Aplicação)**:
   - Desenvolvido em **Node.js** com **Express** utilizando módulos nativos ES (`import`/`export`).
   - Fornece endpoints RESTful estruturados, validação rigorosa de payloads, tratamento global de erros (sem vazamento de stack traces) e CORS configurado para a origem do frontend.
   - Conecta-se ao banco via driver oficial `@neondatabase/serverless` utilizando consultas estritamente parametrizadas (tagged templates).

3. **Banco de Dados (Armazenamento Persistente)**:
   - Instância de **PostgreSQL** hospedada na nuvem pelo **Neon Database**.
   - Armazena flashcards (com triggers automáticos de atualização de timestamps) e histórico de sessões de estudo finalizadas.
   - Consultas de agregação diária respeitam o fuso horário oficial brasileiro (`America/Sao_Paulo`).

---

## 📁 Estrutura de Diretórios

```
projectcc/
├── backend/                        # Aplicação de Servidor Node.js
│   ├── src/
│   │   ├── controllers/            # Controladores REST das rotas
│   │   │   ├── dashboardController.js    # Agregação de estatísticas do painel
│   │   │   ├── flashcardController.js    # CRUD de flashcards
│   │   │   ├── healthController.js       # Verificação de saúde e conectividade
│   │   │   └── studySessionController.js # Registro e listagem de sessões
│   │   ├── db/
│   │   │   └── connection.js       # Conexão singleton com o Neon Database
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Tratamento centralizado de erros
│   │   │   └── validateRequest.js  # Validação de esquemas e entradas
│   │   ├── routes/
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── flashcardRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── studySessionRoutes.js
│   │   │   └── index.js            # Agrupador central de rotas (/api)
│   │   └── server.js               # Ponto de entrada do servidor Express
│   ├── .env.example                # Modelo de variáveis de ambiente do backend
│   └── package.json
│
├── frontend/                       # Aplicação Cliente React + Vite
│   ├── src/
│   │   ├── components/             # Componentes visuais modulares
│   │   │   ├── ConfirmDialog.jsx   # Modal de confirmação
│   │   │   ├── EmptyState.jsx      # Estado de lista vazia
│   │   │   ├── ErrorMessage.jsx    # Alerta de erro com botão de repetição
│   │   │   ├── FlashcardForm.jsx   # Formulário de criação/edição com validação
│   │   │   ├── FlashcardItem.jsx   # Card interativo de pergunta/resposta
│   │   │   ├── Header.jsx          # Barra de navegação e identidade visual
│   │   │   ├── LoadingSpinner.jsx  # Indicador de carregamento
│   │   │   ├── MethodCard.jsx      # Card de método de estudo
│   │   │   ├── SearchBar.jsx       # Campo de busca rápida
│   │   │   └── StatsCard.jsx       # Indicador numérico de progresso
│   │   ├── hooks/
│   │   │   └── usePomodoro.js      # Hook desacoplado com temporizador e fases
│   │   ├── pages/
│   │   │   ├── FlashcardsPage.jsx  # Gerenciador completo de flashcards
│   │   │   ├── HomePage.jsx        # Painel principal, busca e estatísticas
│   │   │   └── PomodoroPage.jsx    # Cronômetro Pomodoro integrado
│   │   ├── services/
│   │   │   └── api.js              # Camada de comunicação HTTP (fetch)
│   │   ├── styles/                 # Estilização CSS modular e responsiva
│   │   ├── App.jsx                 # Roteador e layout raiz
│   │   └── main.jsx                # Ponto de entrada React
│   ├── .env.example                # Modelo de variáveis de ambiente do frontend
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/                       # Scripts SQL
│   ├── schema.sql                  # Definição das tabelas, índices e triggers
│   └── seed.sql                    # Dados iniciais educativos em português
│
├── .gitignore                      # Regras para ignorar dependências e segredos
└── README.md                       # Documentação técnica do projeto
```

---

## ⚙️ Pré-requisitos

Para executar este projeto localmente, você precisará de:

- **Node.js**: Versão 18.x ou superior (recomenda-se LTS 20.x).
- **npm**: Versão 9.x ou superior (incluso com o Node.js).
- **Conta no Neon Database**: Gratuita em [neon.tech](https://neon.tech).

---

## 🚀 Como Configurar o Banco no Neon Database

1. Acesse [https://neon.tech](https://neon.tech) e crie uma conta (ou faça login).
2. Clique em **"Create Project"**.
3. Escolha um nome para o projeto (ex: `estuda-db`) e selecione a região mais próxima (ex: `AWS / us-east-1` ou `sa-east-1` se disponível).
4. Ao criar, o Neon fornecerá a string de conexão (`Connection string`).
   - Ela terá o formato:
     ```
     postgresql://usuario:senha@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - Guarde essa URL para o arquivo `.env` do backend.
5. No painel do Neon, clique na aba **"SQL Editor"**:
   - Abra o arquivo `database/schema.sql` deste projeto, copie todo o conteúdo e cole no SQL Editor do Neon. Clique em **Run**.
   - Abra o arquivo `database/seed.sql`, copie o conteúdo e cole no SQL Editor. Clique em **Run** para inserir os 10 flashcards de exemplo.

---

## 🔧 Configuração dos Arquivos de Ambiente (.env)

### 1. Backend

No diretório `backend/`, crie um arquivo chamado `.env` baseado no arquivo `.env.example`:

```bash
cd backend
cp .env.example .env
```

Preencha as variáveis em `backend/.env`:
```env
# URL de conexão fornecida pelo Neon Database
DATABASE_URL=postgresql://usuario:senha@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require

# Porta onde o servidor Node.js irá rodar
PORT=3001

# Origem autorizada no CORS (URL do frontend Vite)
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend

No diretório `frontend/`, crie um arquivo chamado `.env` baseado no arquivo `.env.example`:

```bash
cd ../frontend
cp .env.example .env
```

Preencha a variável em `frontend/.env`:
```env
# Endereço base da API REST
VITE_API_URL=http://localhost:3001/api
```

---

## 📦 Instalação e Execução

### Passo 1: Instalar dependências

Abra dois terminais (um para o backend e outro para o frontend).

**No Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**No Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

### Passo 2: Iniciar as aplicações

**No Terminal 1 (Backend):**
```bash
cd backend
npm start
```
> O servidor iniciará em `http://localhost:3001` exibindo: `Servidor Estuda rodando na porta 3001`.

**No Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
> A aplicação estará acessível no navegador em `http://localhost:5173`.

---

## 📡 Endpoints da API REST

| Método | Endpoint | Descrição | Status de Sucesso |
|---|---|---|---|
| `GET` | `/api/health` | Verifica saúde da API e conectividade com o Neon | `200 OK` / `503` |
| `GET` | `/api/flashcards` | Lista flashcards (filtros opcionais `?search=` e `?subject=`) | `200 OK` |
| `GET` | `/api/flashcards/:id` | Retorna um flashcard específico | `200 OK` / `404` |
| `POST` | `/api/flashcards` | Cria um novo flashcard (valida matéria, pergunta e resposta) | `201 Created` |
| `PATCH` | `/api/flashcards/:id` | Atualiza campos de um flashcard existente | `200 OK` |
| `DELETE` | `/api/flashcards/:id` | Remove um flashcard do banco de dados | `204 No Content` |
| `GET` | `/api/study-sessions` | Lista histórico de sessões (filtro opcional `?date=YYYY-MM-DD`) | `200 OK` |
| `POST` | `/api/study-sessions` | Registra uma sessão de foco concluída (`type`, `duration_minutes`) | `201 Created` |
| `GET` | `/api/dashboard` | Retorna indicadores de progresso consolidados de hoje e total | `200 OK` |

---

## 🧪 Testando as Funcionalidades

1. **Saúde e Banco**:
   - Abra no navegador `http://localhost:3001/api/health`.
   - Se a `DATABASE_URL` estiver configurada, retornará `{"status":"ok","database":"connected"}`.
2. **Página Inicial**:
   - Acesse `http://localhost:5173`.
   - Verifique os indicadores reais de progresso carregados da API.
   - Utilize a barra de pesquisa rápida para filtrar assuntos e perguntas cadastradas.
3. **Pomodoro**:
   - Acesse a aba **Pomodoro**.
   - Inicie o cronômetro. É possível pausar, retomar ou reiniciar.
   - É possível ajustar os minutos nas **Configurações** (ex: testar com 1 minuto).
   - Ao zerar a contagem de foco, a aplicação dispara o alerta sonoro e envia a sessão para a API (`POST /api/study-sessions`), atualizando automaticamente o total no painel.
4. **Flashcards**:
   - Acesse a aba **Flashcards**.
   - Visualize os flashcards de exemplo vindos do banco de dados.
   - Clique em "Ver resposta" / "Ocultar resposta".
   - Filtre por matéria ou digite uma busca.
   - Crie um novo flashcard usando o formulário.
   - Edite um flashcard e salve as alterações.
   - Exclua um flashcard com a confirmação de segurança.

---

## 🚢 Preparação para Implantação Futura

- **Frontend**:
  - Execute `npm run build` na pasta `frontend`.
  - A pasta gerada `dist/` pode ser implantada diretamente na Vercel, Netlify, Cloudflare Pages ou Render Static Site.
  - Defina a variável de ambiente de produção `VITE_API_URL` apontando para o domínio público da API.
- **Backend**:
  - Pode ser implantado em serviços como Render, Fly.io, Railway ou AWS Elastic Beanstalk.
  - Configure as variáveis `DATABASE_URL`, `PORT` e `FRONTEND_URL` no painel da plataforma.

---

## ⚠️ Limitações Conhecidas desta Versão Inicial

1. **Ausência de Autenticação / Login**:
   - Conforme especificado no escopo deste protótipo acadêmico, o sistema não implementa autenticação ou contas individuais.
   - Os flashcards e as sessões de estudo são globais e compartilhados por qualquer usuário que acesse a aplicação.
   - A estrutura do banco de dados e da API foi organizada de modo modular para permitir a futura adição de uma tabela `users` e `user_id` sem retrabalho arquitetural.
2. **Criação Manual de Conteúdo**:
   - Não há geração de flashcards por inteligência artificial nesta versão; todo o conteúdo é criado e gerenciado pelo próprio estudante através do formulário da plataforma.
3. **Métodos Futuros Sinalizados**:
   - Os métodos "Revisão Ativa" e "Plano de Estudos" estão exibidos na página inicial com o rótulo "Em breve" para indicar a evolução futura do produto, sem ações enganosas.

