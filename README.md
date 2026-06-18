The **Online Food Order Processing System** is a micro‑services based application that enables customers to browse menus, place orders, and manage payments seamlessly. It demonstrates a full‑stack architecture with:
- **Frontend** – React with modern UI/UX patterns.
- **Order Service** – Handles order lifecycle, validation, and persistence.
- **Payment Service** – Manages payment processing and integrates with external gateways.
- **Camunda Service** – Orchestrates workflow events (e.g., order creation, payment confirmation).
- **API Gateway** – (Optional) central entry point for routing and security.

Designed for educational purposes, the project showcases:
- Spring Boot + Maven multi‑module setup.
- RESTful APIs with OpenAPI documentation.
- Event‑driven communication via Camunda BPM.
- Docker‑Compose for local development.
- CI/CD pipelines (GitHub Actions) ready to be extended.

---

## ✨ Features

- Browse restaurant menus and items.
- Create, update, and cancel orders.
- Secure payment handling with validation.
- Real‑time order status updates via Camunda workflow.
- Dockerised services for easy spin‑up.
- Comprehensive test suite (JUnit, Mockito, React Testing Library).
- Swagger UI for API exploration.

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | React, Vite, TailwindCSS | Fast, component‑driven UI with utility‑first styling |
| **API** | Spring Boot 3, Spring MVC, Spring Data JPA | Robust Java ecosystem, easy micro‑service creation |
| **Database** | PostgreSQL (Docker) | Production‑grade relational DB |
| **Workflow** | Camunda BPM | Visual workflow modelling & event handling |
| **Payments** | Spring Cloud Stripe (or mock) | Demonstrates external service integration |
| **Build** | Maven, npm | Standard build tools for Java & JS |
| **Containerisation** | Docker, Docker‑Compose | Consistent dev environments |
| **Testing** | JUnit 5, Mockito, React Testing Library | Unit & integration coverage |

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** (or higher)
- **Maven 3.9+**
- **Node.js 20.x** and **npm**
- **Docker Desktop** (for containers)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/likhi0805/Online-Food-Order-Processing-System.git
cd Online-Food-Order-Processing-System
```

### Run with Docker‑Compose

The quickest way to start all services:

```bash
docker compose up --build
```

The services will be available at:
- Frontend: <http://localhost:5173>
- Order Service API: <http://localhost:8081>
- Payment Service API: <http://localhost:8082>
- Camunda Dashboard: <http://localhost:8083>
- Swagger UI (Order Service): <http://localhost:8081/swagger-ui.html>

### Run Locally (without Docker)

1. **Start PostgreSQL** (or use the Docker container).
2. **Backend services**:
   ```bash
   cd order-service && mvn spring-boot:run
   cd ../payment-service && mvn spring-boot:run
   cd ../camunda-service && mvn spring-boot:run
   ```
3. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📚 API Documentation

Each service exposes a Swagger UI.
- **Order Service** – `http://localhost:8081/swagger-ui.html`
- **Payment Service** – `http://localhost:8082/swagger-ui.html`

OpenAPI specifications are located in `order-service/src/main/resources/openapi.yaml` and `payment-service/src/main/resources/openapi.yaml`.

---

## 🧪 Testing

### Backend

```bash
cd order-service
mvn test
cd ../payment-service
mvn test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Write code **and** add/update tests.
4. Ensure the full test suite passes.
5. Open a Pull Request with a clear description.

Read the full [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on commit style, branch naming, and code review.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

Maintainer: **Likhitha P** – [GitHub](https://github.com/likhi0805)

