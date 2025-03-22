# Take Home Assessment

This project consists of a FastAPI backend and a React frontend built with Vite.

## Project Structure

```
.
├── backend/         # FastAPI backend
└── frontend/        # React frontend with Vite
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn main:app --reload`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Development

- Backend API runs on: http://localhost:8000
- Frontend development server runs on: http://localhost:5173
- API documentation available at: http://localhost:8000/docs
