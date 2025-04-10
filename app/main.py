from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import users, auth, quizzes, questions

# Create tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="Veggie Quiz API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(quizzes.router)
app.include_router(questions.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Veggie Quiz API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}