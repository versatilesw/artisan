from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import chat
from .database import Base, engine
from . import models  # Import models to ensure they are registered with SQLAlchemy
from .init_db import init_database

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Artisan Chatbot API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow Create React App default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat routes
app.include_router(chat.router, prefix="/api", tags=["chat"])
init_database()

@app.get("/")
async def root():
    return {"message": "Welcome to Artisan Chatbot API"}
