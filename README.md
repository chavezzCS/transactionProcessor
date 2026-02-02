# Transaction Processor

**Transaction Processor** es un microservicio diseñado para manejar transacciones financieras de manera eficiente y confiable. Permite consultar balances de merchants, procesar pagos y mantener un registro histórico de transacciones con consistencia y sin race conditions.

---

## Tabla de Contenidos
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Prueba de concurrencia](#prueba-de-concurrencia)
- [Endpoints](#endpoints)
- [Decisiones de diseño](#decisiones-de-diseño)
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
3. Correr Postgres Dockerizado y ejecutar aplicación
    ```bash
    docker compose up -d
    npm run start
    ```
## Prueba de concurrencia
1. Ejecutar el siguiente comando
    ```bash
        npm run concurrency
    ```
## Endpoints 
(Colección postman adjunto en proyecto)
1. Procesar Pago (POST)
    ```bash
    http://localhost:3000/payment
    ```
2. Listar Usuarios (GET)
    ```bash
    http://localhost:3000/users
    ```
3. Listar Merchants (GET)
    ```bash
    http://localhost:3000/merchants
    ```
4. Listar Payments (GET)
    ```bash
    http://localhost:3000/payment
    ```

## Decisiones de diseño
- Base de datos
    - Se eligió PostgreSQL por se la opción mas robusta y consistente, ofreciendo transacciones ACID, soporte nativo para tipos numéricos de alta precisón y buena integración con PrismaORM
- Estrategia de concurrencia
    - Se garantizó la consistencia de los balances frente a transacciones simultaneas a través de transacciones de base de datos y control de concurrencia a nivel de BD
    - Se optó por agrupar operaciones críticas (lectura del balance, validación y actualización) en transacciones ACID, aprovechando el row-level locking de PostgreSQL
    - Esta estrategía asegura consistencia eliminando riesgos de race conditions
- Explicación del Diagrama
    - La arquitectura se diseñó pensando en el despliegue en entorno productivo haciendo uso de la nube de AWS
    - Los servicios escogidos fueron:
        - API Gateway: Como solución efectiva para ser el punto de entrada único del sistema ya que maneja autenticación, rate limiting y enruta las solicitudes a las Lambdas correspondientes.
        - AWS Lambda (Escritura):Enfocado exclusivamente en las operaciones críticas, es la solución  de implementación de servicios serverless por excelencia
        - AWS Lambda (Lectura): Apoyandose de ElastiCache para reducir latencia mientras que la persistencia continua siendo dependiendo enteramente de la data almacenada en BD
        - AWS Aurora: Siendo la solución mas robusta y resiliento, dando mas disponibilidad de read-replicas, Multi-AZ y velocidad, sería la opción ideal para un flujo de cobros
        - Amazon SQS (plus): Permite desacoplar procesos, escalamiento, manejar picos de tráfico y procesar operaciones de forma asincrónica cuando es necesario.



