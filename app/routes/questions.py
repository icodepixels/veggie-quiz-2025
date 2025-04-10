from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/questions",
    tags=["questions"]
)

@router.post("/", response_model=List[schemas.QuestionResponse], status_code=status.HTTP_201_CREATED)
def create_questions(questions: List[schemas.QuestionCreate], db: Session = Depends(get_db)):
    db_questions = []
    for question in questions:
        db_question = models.Question(
            quiz_id=question.quiz_id,
            question_text=question.question_text,
            choices=question.choices,
            correct_answer_index=question.correct_answer_index,
            explanation=question.explanation,
            category=question.category,
            difficulty=question.difficulty,
            image=question.image
        )
        db.add(db_question)
        db_questions.append(db_question)

    db.commit()
    for question in db_questions:
        db.refresh(question)
    return db_questions

@router.get("/quiz/{quiz_id}", response_model=List[schemas.QuestionResponse])
def get_questions_by_quiz(quiz_id: int, db: Session = Depends(get_db)):
    questions = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).all()
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this quiz")
    return questions

@router.get("/{question_id}", response_model=schemas.QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
    return None