from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Take Home Assessment API")

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://68.183.58.119", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Take Home Assessment API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 