from database import Base, engine
from models import Message

def init_database():
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")
