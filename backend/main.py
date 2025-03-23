from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import screener
import os

from fastapi import FastAPI
import sentry_sdk

sentry_sdk.init(
    dsn="https://839080870438ef7e4696022f2ef4ca92@o4505936244506624.ingest.us.sentry.io/4509024876756992",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)


app = FastAPI(title="Take Home Assessment API")

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://68.183.58.119",  # Production
        "http://localhost:5173", # Local development
        "http://localhost:3000"  # Alternative local port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(screener.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Take Home Assessment API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0
