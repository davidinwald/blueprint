# Blueprint Diagnostic Screener Takehome Assessment

_David Inwald, Mar '25_

A web application for conducting mental health screenings using a question-by-question interface. The application collects patient responses and provides recommendations for further assessments based on domain-specific scoring.

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
```

### Frontend Setup

```bash
cd frontend
npm i
npm run dev
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
- **Axios**: For reliable HTTP requests with interceptors for error handling
- **CSS Modules**: For scoped styling without conflicts
- **Environment-aware Configuration**: Handles both development and production settings

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

### High Availability & Performance

Current setup is basic but functional:

1. **Container Management**

   - Docker Compose managing container lifecycle
   - Automatic container restarts on failure
   - Nginx load balancing between frontend and API

2. **Resource Management**

   - Docker resource limits for containers
   - Nginx caching for static assets
   - Frontend build optimization

3. **Backup & Recovery**
   - DigitalOcean Droplet snapshots
   - Docker volume persistence
   - Container logs retained

### Security Measures

1. **Infrastructure**

   - DigitalOcean firewall rules
   - SSH key authentication
   - Regular system updates

2. **Application**
   - CORS configuration
   - Input validation
   - Rate limiting through Nginx
   - Environment variables for secrets

### Monitoring & Troubleshooting

1. **Logging**

   - Docker container logs
   - Nginx access and error logs
   - Application-level logging

2. **Monitoring**
   - DigitalOcean monitoring basics
   - Container health checks
   - Resource usage metrics

### Future Production Improvements

For a more robust production environment, consider:

1. **Infrastructure**

   - Add domain name and SSL certificates
   - Implement CDN for static assets
   - Set up proper load balancing
   - Add database persistence

2. **High Availability**

   - Multiple droplets across regions
   - Database replication
   - Container orchestration (e.g., Kubernetes)
   - Automated backups

3. **Security**

   - SSL/TLS encryption
   - Web Application Firewall
   - Regular security audits
   - Proper secrets management

4. **Monitoring**
   - Advanced monitoring solution
   - Automated alerting
   - Performance tracking
   - Error tracking service

## Trade-offs and Future Improvements

### Current Trade-offs

1. **Simple Data Storage**

   - Currently using JSON files for configuration
   - Would need a proper database for production

2. **Basic Authentication**

   - No user authentication implemented
   - Would need proper auth system for production

3. **Limited Error Recovery**
   - Basic error handling implemented
   - Could be more sophisticated with retry mechanisms

### Future Improvements

1. **Features**

   - User authentication and authorization
   - Save partial progress
   - Multiple language support
   - Offline capability
   - PDF report generation
   - Analytics dashboard

2. **Technical**

   - Database integration
   - Test coverage improvement
   - E2E testing
   - Performance optimization
   - Accessibility improvements
   - Mobile app version

3. **UX/UI**

   - More interactive question types
   - Better progress visualization
   - Customizable themes
   - Keyboard navigation
   - Screen reader support

4. **Business**
   - Analytics integration
   - A/B testing capability
   - User feedback system
   - Integration with EHR systems
   - Custom scoring rules interface

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
