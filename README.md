# 🛠️ Mini Marketplace de Serviços

Sistema completo de marketplace para conexão entre prestadores de serviços (diaristas, pintores, manicures, etc.) e clientes. O projeto utiliza uma arquitetura moderna com backend e frontend containerizados e orquestrados via Docker.

## 🚀 Tecnologias Utilizadas

**Backend:**
- **NestJS** (Framework API)
- **Prisma ORM** (Banco de dados PostgreSQL)
- **Redis** (Cache de alta performance para agendamentos e categorias)
- **Elasticsearch** (Motor de busca textual avançado)
- **JWT** (Autenticação segura com Refresh Token)

**Frontend:**
- **SvelteKit** (Framework Fullstack/Frontend)
- **TailwindCSS** (Estilização responsiva)
- **TypeScript** (Tipagem estática)

**Infraestrutura:**
- **Docker & Docker Compose** (Ambiente isolado e reprodutível)

---

## 📋 Pré-requisitos

Para rodar este projeto, você precisa apenas de:
- [Docker](https://www.docker.com/) e Docker Compose instalados.
- Git.

*(Não é necessário ter Node.js, Postgres ou Redis instalados na máquina local, pois tudo roda via containers).*

---

## ⚙️ Como Rodar o Projeto (Passo a Passo)

Siga os passos abaixo para subir a aplicação completa em poucos minutos.

### 1. Configurar Variáveis de Ambiente
Na raiz do projeto, crie um arquivo chamado `.env` e cole o seguinte conteúdo (essas configurações são compatíveis com o ambiente Docker):

```env
# Banco de Dados
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=marketplace

# Conexão Prisma (Aponta para o serviço 'postgres' do Docker na porta 5432)
DATABASE_URL="postgresql://user:password@postgres:5432/marketplace?schema=public"

# Segurança (Token JWT)
JWT_SECRET="f0a850d6c9965f8ae74a1ca895c738d0"

# Serviços Externos (Nomes dos containers no Docker)
REDIS_HOST=redis
ELASTICSEARCH_NODE=http://elasticsearch:9200

# Porta da Aplicação
PORT=3000
```
### 2. Subir a Aplicação
No terminal, execute o comando abaixo na raiz do projeto. Isso irá construir as imagens do Backend e Frontend e baixar os bancos de dados.

```bash
docker-compose up -d --build
```

### 3. Vídeo de Apresentação
- [Apresentação em vídeo](https://drive.google.com/drive/folders/1R8Vvpq0NGo-KihHXXzmlybzsOyI7UvFK?usp=drive_link)
