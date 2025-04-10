# Veggie Quiz API

A full-stack quiz application with a Python FastAPI backend and Next.js frontend.

## Project Structure

```
veggie-quiz-api/
├── app/                 # FastAPI backend
│   ├── routes/         # API endpoints
│   ├── models.py       # Database models
│   ├── schemas.py      # Pydantic schemas
│   └── database.py     # Database configuration
├── client/             # Next.js frontend
└── db/                 # Database files
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL

## Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/veggie-quiz
```

4. Initialize the database:
```bash
psql -f init.sql
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## API Documentation

### Base URL
`http://localhost:8000/api`

### Endpoints

#### Quizzes

##### Get All Quizzes
- **URL:** `/quizzes`
- **Method:** `GET`
- **URL Parameters:**
  - `category` (optional): Filter quizzes by category
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of quiz objects

##### Get Quiz by ID
- **URL:** `/quizzes/{quiz_id}`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** Quiz object with questions

##### Get Categories
- **URL:** `/quizzes/categories`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** List of categories

##### Get Category Samples
- **URL:** `/quizzes/category-samples`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** 3 sample quizzes from each category

##### Create Quiz with Questions
- **URL:** `/quizzes/with-questions`
- **Method:** `POST`
- **Data Parameters:**
  ```json
  {
    "quiz": {
      "name": "Quiz Name",
      "description": "Quiz Description",
      "image": "image_url",
      "category": "Category",
      "difficulty": "Easy"
    },
    "questions": [
      {
        "question_text": "Question text",
        "choices": ["choice1", "choice2", "choice3", "choice4"],
        "correct_answer_index": 0,
        "explanation": "Explanation",
        "category": "Category",
        "difficulty": "Easy",
        "image": "image_url"
      }
    ]
  }
  ```

##### Delete Quiz
- **URL:** `/quizzes/{quiz_id}`
- **Method:** `DELETE`
- **Success Response:**
  - **Code:** 200
  - **Content:** Success message and count of deleted questions

## Database Schema

### Quiz Table
```sql
CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
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
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);
```

## Development

### Running Tests
```bash
# Backend tests
pytest

# Frontend tests
cd client
npm test
```

### Linting
```bash
# Backend linting
flake8

# Frontend linting
cd client
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.