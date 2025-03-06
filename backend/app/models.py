from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from .database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    sender = Column(String, nullable=False)  # 'user' or 'bot'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    parent_message_id = Column(Integer, ForeignKey("messages.id"), nullable=True)
