# Blueprint Coding Exercise

_David Inwald, Mar '25_

A web application for conducting mental health screenings using a question-by-question interface. The application collects patient responses and provides recommendations for further assessments based on domain-specific scoring.

## Live Demo

[View the live application](http://68.183.58.119/) at http://68.183.58.119/

## "Production" Access

The application is currently deployed on a DigitalOcean Droplet using Docker Compose:

- Single droplet running both frontend and backend containers
- Nginx serving the frontend and proxying API requests

## Local Development Setup

### Prerequisites

- Node.js (v18+)
- Python (3.8+)
- Docker and Docker Compose (optional)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# tests
pytest tests/ -v
```

### Frontend Setup

```bash
cd frontend
npm i
npm run dev
# tests
npm run test
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Docker Setup (Alternative)

```bash
docker-compose up --build
```

## Problem and Solution

### The Problem

Mental health screening needs to be accessible, user-friendly, and accurate. The challenge was to create a system that could:

- Present questions one at a time to reduce cognitive load
- Track answers and calculate domain-specific scores
- Provide appropriate assessment recommendations
- Handle the screening process reliably and securely

### The Solution

A full-stack web application with:

#### Backend (FastAPI)

- RESTful API endpoints for screener data and submission
- Domain-based scoring system
- Modular assessment rules
- Validation and error handling

#### Frontend (React)

- Single-question display interface
- Progress tracking
- Responsive design
- Error handling and loading states

## Technical Choices

### Backend

- **FastAPI**: Chosen for its performance, automatic OpenAPI documentation, and type validation
- **Pydantic**: For robust data validation and serialization
- **JSON-based Configuration**: Allows easy modification of domain mappings and assessment rules

### Frontend

- **React**: For its component-based architecture and efficient rendering
- **ChakraUI**: For a modern, responsive UI with built-in components and a clean design

## Production Deployment Strategy

### Current Infrastructure (DigitalOcean)

```
[DigitalOcean Droplet]
├── Docker
│   ├── Frontend Container (Nginx + React)
│   └── Backend Container (FastAPI)
└── Docker Compose for orchestration
```

The application is currently deployed on a DigitalOcean Droplet using Docker Compose:

- Single droplet running both frontend and backend containers
- Nginx serving the frontend and proxying API requests
- Direct IP access (e.g., http://droplet-ip:80)

### "As a True Production App"

1. separate frontend and backend containers
2. use a proper database
3. "secure it" by implementing RBAC
4. add logging, monitoring / observability with benchmarking strategy
5. Ensure domain + regulatory compliance (HIPPA, GDPR, etc best practices where data is decoupled from PII)
6. Add CI/CD pipeline with code scanning, linting, testing, etc
7. re: Bug RCA I already hooked up Sentry to frontend and backend, it's great for error tracking and alerting for prod apps

### "With More Time"

1. improve accessibility, ensure keyboard nav is smooth
2. integrate with other services (persisting + sharing results, etc)
3. Study user interactions with the app, study results, study recommendations, study user engagement, study user experience
4. flesh out DB schema, models, add persistence
5. "Security" seems like a weak spot here, as there is no authentication
   - would also like to add rate limiting

### Code Samples

- While I don't have publicly available code to share, I can provide detailed technical documentation, architecture diagrams, and implementation overviews that demonstrate my technical capabilities and approach to problem-solving. I can also discuss specific technical challenges and their solutions in detail.
- Blog where I occasionally share some domain-specific technical content: https://inwald.com/blog/
- Public TS/JS lib for generating mock dataframes: https://github.com/davidinwald/data_generator
- https://github.com/inwald (private, but shows contribution history)
- LinkedIn: https://www.linkedin.com/in/david-inwald-29074511/
- Email: david.inwald@gmail.com
