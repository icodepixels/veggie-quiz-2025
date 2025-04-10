-- First, connect to PostgreSQL
psql postgres

-- Create the database (if it doesn't exist)
CREATE DATABASE "veggie-quiz";

-- Connect to the veggie-quiz database
\c "veggie-quiz"

-- Now run the table creation script
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quiz;

CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    choices JSONB NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    CHECK (correct_answer_index >= 0)
);

CREATE INDEX idx_quiz_category ON quiz(category);
CREATE INDEX idx_quiz_difficulty ON quiz(difficulty);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);