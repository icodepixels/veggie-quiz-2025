from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, ForwardRef, Any

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    name: str
    description: str
    image: str
    category: str
    difficulty: str

class QuizCreate(QuizBase):
    pass

class QuestionBase(BaseModel):
    question_text: str
    choices: List[str]
    correct_answer_index: int
    explanation: str
    category: str
    difficulty: str
    image: str

class QuestionCreate(QuestionBase):
    quiz_id: Optional[int] = None

class QuestionResponse(QuestionBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

# Create forward reference for QuizResponse
QuizResponse = ForwardRef('QuizResponse')

class QuizResponse(QuizBase):
    id: int
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True

# Resolve forward references
QuizResponse.model_rebuild()

class QuizWithQuestionsCreate(BaseModel):
    quiz: QuizCreate
    questions: List[QuestionCreate]

class QuizWithQuestionsResponse(BaseModel):
    success: bool
    quiz: QuizResponse
    questions: List[QuestionResponse]
    total_questions: int

    class Config:
        from_attributes = True

class CategoriesResponse(BaseModel):
    categories: List[str]
    total_categories: int

    class Config:
        from_attributes = True

class CategorySamplesResponse(BaseModel):
    success: bool
    samples: dict[str, List[QuizResponse]]
    total_categories: int

    class Config:
        from_attributes = True

# Add these quiz result schemas
class QuizResultCreate(BaseModel):
    quiz_id: int
    score: float
    correct_answers: int
    total_questions: int

class QuizResultResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    score: float
    correct_answers: int
    total_questions: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class QuizResultsListResponse(BaseModel):
    results: List[QuizResultResponse]
    total: int

    model_config = {
        "from_attributes": True
    }