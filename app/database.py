from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

# Try to get DATABASE_URL first (for production/Railway)
DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not set, construct it from individual variables (for local development)
if not DATABASE_URL:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DB_CONNECT_TIMEOUT = os.getenv("DB_CONNECT_TIMEOUT", "10")
    DB_SSLMODE = os.getenv("DB_SSLMODE", "prefer")

    if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
        raise ValueError(
            "Database configuration not found. Either set DATABASE_URL or all individual DB_* variables"
        )

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # Add connection parameters
    DATABASE_URL += f"?connect_timeout={DB_CONNECT_TIMEOUT}&sslmode={DB_SSLMODE}"

# Parse the URL to ensure it's valid
parsed_url = urlparse(DATABASE_URL)

# Ensure the URL has all required components
if not all([parsed_url.scheme, parsed_url.hostname]):
    raise ValueError("Invalid DATABASE_URL format")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()