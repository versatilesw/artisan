# Artisan Chatbot

A full-stack chatbot application that allows users to interact with a knowledge base from the Artisan website.

## Features

- Send messages to chatbot
- Receive intelligent responses
- Edit sent messages (triggers new bot response)
- Delete messages
- Persistent conversation history
- RESTful API endpoints

## Tech Stack

### Backend

- Python 3.x
- FastAPI
- SQLAlchemy (SQLite database)
- Pydantic for data validation
- Pytest for testing

### Frontend

- React 18
- TypeScript
- Vite
- Modern UI components

## Project Structure

```
artisan/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application entry
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database configuration
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   └── tests/              # Backend tests
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API client
    │   ├── types/         # TypeScript types
    │   └── utils/         # Utility functions
    └── public/            # Static assets
```

## Getting Started

### Backend Setup

1. Create a Python virtual environment:

   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate  # Windows
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`. API documentation can be accessed at `http://localhost:8000/docs`.

### Frontend Setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

The frontend will be available at `http://localhost:3000`.

## Testing

### Backend Tests

Run the backend tests using pytest:

```bash
cd backend
python -m pytest tests/ -v
```

## API Endpoints

- `POST /api/messages` - Create a new message
- `GET /api/messages` - Get all messages
- `PUT /api/messages/{message_id}` - Update a message
- `DELETE /api/messages/{message_id}` - Delete a message

## Development Status

- [x] Backend API implementation
- [x] Database models and persistence
- [x] API endpoint testing
- [x] Frontend implementation
- [x] Frontend testing
- [x] Integration testing
- [ ] Production deployment
