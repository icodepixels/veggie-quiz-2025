from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quiz.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    choices = Column(JSON, nullable=False)  # Store as JSON
    correct_answer_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    image = Column(String(255), nullable=False)