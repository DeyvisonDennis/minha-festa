# Minha Festa

Plataforma web para organizar eventos como casamentos, aniversários e formaturas: cronograma de tarefas, gestão de convidados com confirmação de presença (RSVP) por link individual e envio de convites por e-mail.

## O que já funciona

- Cadastro, login (e-mail e senha, ou Google), recuperação de senha por e-mail e renovação automática da sessão
- Assistente de primeiro acesso para criar o evento
- Dashboard do evento, com imagem de capa escolhida entre fotos prontas
- Cronograma de tarefas em Lista, Kanban (arrastar e soltar) e Calendário
- Convidados: cadastro, busca, filtros e envio de convites por e-mail
- Link individual de RSVP por convidado e página pública (`/rsvp/<código>`) onde ele confirma ou recusa a presença

Em desenvolvimento: fornecedores, financeiro, presentes, convites digitais e publicação (deploy).

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Banco de dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (access e refresh token) em cookies HttpOnly, login social com Google

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20.9 ou superior
- [PostgreSQL](https://www.postgresql.org/download/) 17 (ou compatível), rodando localmente, com acesso ao psql (veja a observação em "Banco de dados").
- Opcionais: credenciais do Google (login social) e uma conta Gmail com [senha de app](https://support.google.com/accounts/answer/185833) (envio de e-mails). Sem elas, essas duas funções ficam indisponíveis e o restante funciona normalmente.

## Banco de dados

Crie o banco e restaure a estrutura. Use o `psql`, e não o Query Tool do pgAdmin, porque o arquivo contém comandos próprios do `psql`:

> **Windows:** o instalador do PostgreSQL normalmente não adiciona o `psql` ao PATH. Se o comando não for reconhecido, use o caminho completo (por exemplo `& "C:\Program Files\PostgreSQL\17\bin\psql.exe"`), abra o "SQL Shell (psql)" pelo menu Iniciar ou use a ferramenta **PSQL Tool** do pgAdmin (menu Tools).

```bash
psql -U postgres -c 'CREATE DATABASE "Minha_Festa";'
psql -U postgres -d Minha_Festa -f database/schema.sql
```

O nome `Minha_Festa` tem letras maiúsculas e por isso vai entre aspas na criação.

**Já tinha um banco criado antes?** Rode, em ordem, os scripts de `database/migrations/`. Eles são seguros de repetir:

```bash
psql -U postgres -d Minha_Festa -f database/migrations/001-login-google.sql
psql -U postgres -d Minha_Festa -f database/migrations/002-eventos-tarefas.sql
```

## Backend

```bash
cd backend
npm install
```

Crie o arquivo de ambiente a partir do modelo (no PowerShell: `Copy-Item .env.example .env`; no macOS/Linux: `cp .env.example .env`) e preencha:

- `DATABASE_URL`: a conexão com o seu PostgreSQL
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` e `PASSWORD_RESET_SECRET`: gere cada um com `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `FRONTEND_URL`: endereço do frontend, usado nos links dos e-mails
- `EMAIL_*` e `GOOGLE_*`: opcionais, veja os pré-requisitos

```bash
npx prisma generate
npm run start:dev
```

O backend sobe em `http://localhost:3001`.

## Frontend

```bash
cd frontend
npm install
```

Crie o `.env.local` a partir do modelo (`Copy-Item .env.example .env.local` ou `cp .env.example .env.local`) e rode:

```bash
npm run dev
```

O frontend sobe em `http://localhost:3000`.

## Rotas do frontend

| Rota | Tela |
|---|---|
| `/` | Landing page (pública), com acesso ao login e ao cadastro |
| `/login` | Entrar |
| `/cadastro` | Criar conta |
| `/esqueci-senha` | Pedir a redefinição de senha |
| `/redefinir-senha` | Definir uma nova senha (link do e-mail) |
| `/onboarding` | Assistente para criar o primeiro evento |
| `/dashboard` | Visão geral do evento |
| `/cronograma` | Tarefas em Lista, Kanban e Calendário |
| `/convidados` | Lista de convidados e envio de convites |
| `/rsvp/<código>` | Página pública onde o convidado responde ao convite |
| `/termos` | Termos de uso (público) |
| `/privacidade` | Política de privacidade (pública) |

## Estrutura

```
minha-festa/
├── backend/    # API NestJS (auth, eventos, tarefas, convidados, rsvp, email)
├── frontend/   # Aplicação Next.js
└── database/   # schema.sql (banco novo) e migrations/ (banco já existente)
```

## Comandos úteis

```bash
npm run lint          # em backend/ e frontend/
npx tsc --noEmit      # checagem de tipos do frontend
npm run build         # build de produção (backend e frontend)
```

## Observações

- **Links de convite e `localhost`:** os links enviados usam o `FRONTEND_URL`. Enquanto ele for `http://localhost:3000`, só abrem na máquina que roda o projeto. Para convidados de verdade, o app precisa estar publicado.
- **E-mail:** o Gmail serve para desenvolvimento. Em produção, use um serviço de e-mail transacional com domínio próprio, porque e-mails enviados pelo Gmail tendem a cair em spam.
- **Segredos:** nunca versione os arquivos `.env`. Cada ambiente deve ter os seus próprios segredos.