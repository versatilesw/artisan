from .database import Base, engine, SessionLocal
from .models import Message

def init_database():
    Base.metadata.create_all(bind=engine)
    # Seed data
    db = SessionLocal()
    if not db.query(Message).first():  # Avoid duplicate inserts
        messages = [
            Message(id=0, content="Hi John, Thanks for signing up for Artisan! Where would you like to start?", sender="bot"),
        ]
        db.add_all(messages)
        db.commit()
    db.close()
    print("Database initialized successfully")
