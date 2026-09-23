# Minha Festa

Plataforma web para auxiliar organizadores de eventos no planejamento, controle financeiro, gestão de convidados, fornecedores, presentes, convites digitais e acompanhamento de cronogramas.

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Banco de dados:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT (access + refresh token) via cookies HttpOnly, login social com Google

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- [PostgreSQL](https://www.postgresql.org/download/) 17 (ou compatível) rodando localmente
- Uma conta Google (para configurar login social — opcional, veja abaixo)
- Uma conta Gmail (para envio de e-mails de recuperação de senha — opcional, veja abaixo)

## Configuração do banco de dados

1. Crie um banco PostgreSQL chamado `Minha_Festa`
2. Restaure a estrutura a partir do arquivo `database/schema.sql`:

```bash
psql -U postgres -d Minha_Festa -f database/schema.sql
```

## Configuração do Backend

```bash
cd backend
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o `.env` preenchendo:

- `DATABASE_URL`: sua conexão com o PostgreSQL local
- `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET`: gere com `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `PASSWORD_RESET_SECRET`: gere da mesma forma
- `EMAIL_*`: configure uma conta Gmail com senha de app (veja [documentação do Google](https://support.google.com/accounts/answer/185833))
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: crie credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/)

Gere o Prisma Client e rode o servidor:

```bash
npx prisma generate
npm run start:dev
```

O backend sobe em `http://localhost:3001`.

## Configuração do Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

O frontend sobe em `http://localhost:3000`.

## Estrutura do projeto

```
minha-festa/
├── backend/    # API NestJS
├── frontend/   # Aplicação Next.js
└── database/   # Estrutura do banco (schema.sql)
```