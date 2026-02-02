# Transaction Processor

**Transaction Processor** es un microservicio diseñado para manejar transacciones financieras de manera eficiente y confiable. Permite consultar balances de merchants, procesar pagos y mantener un registro histórico de transacciones con consistencia y sin race conditions.

---

## Tabla de Contenidos
- [Características](#tecnologías)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Consideraciones](#consideraciones)
---

## Características

- API RESTful con respuestas consistentes y claras
- Prevención de race conditions en operaciones concurrentes
- Operaciones de pago idempontentes 
- Registro de transacciones asociadas a cada merchant

---
## Tecnologías

- **Node.js (v20.19.6)** con **NestJS**
- **TypeScript**
- **Prisma** (ORM para PostgreSQL)
- **PostgreSQL** como base de datos
- **Docker** (opcional, para despliegue)

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/chavezzCS/transactionProcessor
   cd transaction-processor
   npm install
   ```
   ---

2. Configurar .env con variable 
    ```bash
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/payments" 
    ```
3. Correr Postgres Dockerizado y ejecutar migracion
    ```bash
    docker compose up -d
    npx prisma migrate deploy
    ```
4. Ejecutar aplicación
    ```bash
    npm run start
    ```

