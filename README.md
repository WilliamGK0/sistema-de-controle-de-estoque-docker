# Sistema de Controle de Estoque (Docker)

Projeto desenvolvido para a disciplina de Ambiente de Software – ADS – IFCE Campus Umirim.

Versão containerizada do Sistema de Controle de Estoque com:

- Docker
- Docker Compose
- Variáveis de ambiente
- Persistência de dados
- GitHub Actions para deploy automático

---

# Como rodar localmente

## Criar arquivo .env

Na raiz do projeto:

```env
JWT_SECRET=seu-segredo-super-seguro
```

---

## Subir a aplicação

```bash
docker compose up --build
```

A API ficará disponível em:

http://localhost:3000

---

## Inicializar o banco

```bash
docker compose run --rm estoque-api npm run db:init
```

---

## Parar a aplicação

```bash
docker compose down
```

---

# Persistência de Dados

O banco SQLite é salvo em:

```
./data/estoque.db
```

Essa pasta é montada como volume Docker:

```
./data:/app/data
```

Assim, os dados não são perdidos ao parar o container.

---

# Variáveis de Ambiente

Variáveis utilizadas:

- PORT → Porta da aplicação (padrão 3000)
- JWT_SECRET → Segredo para geração do token
- DB_FILE → Caminho do banco dentro do container (/app/data/estoque.db)

Nenhum segredo está hardcoded no código.

---

# Healthcheck

O container valida a aplicação através do endpoint:

GET /

Utilizado internamente pelo Docker:

http://localhost:3000/

---

# Deploy Automático (GitHub Actions)

O projeto possui um workflow em:

```
.github/workflows/deploy.yml
```

## Como funciona o deploy

A cada push na branch main:

1. O GitHub Actions é executado
2. A imagem Docker é buildada
3. É feita conexão via SSH com o servidor
4. O projeto é atualizado no servidor
5. São executados os comandos:

```bash
docker compose down
docker compose up -d --build
```

Isso garante atualização automática da aplicação no servidor.

---

# Configuração dos Secrets no GitHub

No repositório, acesse:

Settings → Secrets and variables → Actions → New repository secret

Criar os seguintes secrets:

- SERVER_HOST → IP ou domínio do servidor
- SERVER_USER → Usuário SSH do servidor
- SERVER_SSH_KEY → Chave privada SSH
- JWT_SECRET → Segredo usado no servidor

Esses secrets são utilizados no workflow para autenticação e configuração segura.

---

# Estrutura do Projeto

```
src/
 ├── app.js
 ├── server.js
 ├── db/
 ├── routes/
 ├── controllers/
 └── middlewares/

Dockerfile
docker-compose.yml
.github/workflows/deploy.yml
```

---

# Resumo

Rodar local:
```
docker compose up --build
```

Inicializar banco:
```
docker compose run --rm estoque-api npm run db:init
```

Deploy automático:
Push na branch main.
