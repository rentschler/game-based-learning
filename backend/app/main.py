from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.v1 import landmarks, discoveries, progress, users

app = FastAPI(
    title="City Explorer API",
    description="Backend API for City Explorer game-based learning app",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(landmarks.router, prefix="/api/v1", tags=["landmarks"])
app.include_router(discoveries.router, prefix="/api/v1", tags=["discoveries"])
app.include_router(progress.router, prefix="/api/v1", tags=["progress"])
app.include_router(users.router, prefix="/api/v1", tags=["users"])


@app.get("/")
async def root():
    return {"message": "City Explorer API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
