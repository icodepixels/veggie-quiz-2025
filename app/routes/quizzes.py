from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/quizzes",
    tags=["quizzes"]
)

@router.get("/", response_model=List[schemas.QuizResponse])
def get_quizzes(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Quiz)
    if category:
        query = query.filter(models.Quiz.category == category)
    quizzes = query.offset(skip).limit(limit).all()
    return quizzes

@router.get("/categories", response_model=schemas.CategoriesResponse)
def get_categories(db: Session = Depends(get_db)):
    # Get unique categories from the quiz table
    categories = db.query(models.Quiz.category).distinct().all()
    # Extract category strings from the result
    category_list = [category[0] for category in categories]
    return {
        "categories": category_list,
        "total_categories": len(category_list)
    }

@router.get("/category-samples", response_model=schemas.CategorySamplesResponse)
def get_category_samples(db: Session = Depends(get_db)):
    # Get all unique categories
    categories = db.query(models.Quiz.category).distinct().all()
    category_list = [category[0] for category in categories]

    # Initialize the response dictionary
    samples = {}

    # For each category, get up to 3 quizzes
    for category in category_list:
        quizzes = db.query(models.Quiz)\
            .filter(models.Quiz.category == category)\
            .limit(3)\
            .all()

        # Add the quizzes to the samples dictionary
        samples[category] = quizzes

    return {
        "success": True,
        "samples": samples,
        "total_categories": len(category_list)
    }

@router.get("/{quiz_id}", response_model=schemas.QuizResponse)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    # Get the quiz
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Get all questions for this quiz
    questions = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).all()

    # Convert quiz to dict and add questions
    quiz_dict = quiz.__dict__
    quiz_dict['questions'] = questions

    return quiz_dict

@router.delete("/{quiz_id}", status_code=status.HTTP_200_OK)
def delete_quiz(quiz_id: int, db: Session = Depends(get_db)):
    # First check if quiz exists
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Get count of questions to be deleted
    question_count = db.query(models.Question).filter(models.Question.quiz_id == quiz_id).count()

    # Delete the quiz (questions will be deleted automatically due to ON DELETE CASCADE)
    db.delete(quiz)
    db.commit()

    return {
        "success": True,
        "message": f"Quiz with ID {quiz_id} was deleted successfully",
        "questions_deleted": question_count
    }

@router.post("/with-questions", response_model=schemas.QuizWithQuestionsResponse, status_code=status.HTTP_201_CREATED)
def create_quiz_with_questions(quiz_data: schemas.QuizWithQuestionsCreate, db: Session = Depends(get_db)):
    print("start create_quiz_with_questions")
    # Create the quiz first
    db_quiz = models.Quiz(
        name=quiz_data.quiz.name,
        description=quiz_data.quiz.description,
        image=quiz_data.quiz.image,
        category=quiz_data.quiz.category,
        difficulty=quiz_data.quiz.difficulty
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    print("db_quiz", db_quiz)

    # Create questions with the quiz_id
    db_questions = []
    for question in quiz_data.questions:
        db_question = models.Question(
            quiz_id=db_quiz.id,
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

    return {
        "success": True,
        "quiz": db_quiz,
        "questions": db_questions,
        "total_questions": len(db_questions)
    }