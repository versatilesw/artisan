from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException
import random

def get_messages(db: Session):
    return db.query(models.Message).order_by(models.Message.created_at).all()

def create_message(db: Session, message: schemas.MessageCreate):
    # Create the user message
    db_message = models.Message(
        content=message.content,
        sender=message.sender,
        parent_message_id=message.parent_message_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Generate bot response
    bot_response = generate_bot_response(db_message.content)
    bot_message = models.Message(
        content=bot_response,
        sender="bot",
        parent_message_id=db_message.id
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    
    return db_message

def update_message(db: Session, message_id: int, message: schemas.MessageUpdate):
    db_message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if db_message.sender != "user":
        raise HTTPException(status_code=403, detail="Can only edit user messages")
    
    # Update message
    db_message.content = message.content
    db.commit()
    db.refresh(db_message)
    
    # Generate new bot response
    bot_message = db.query(models.Message).filter(
        models.Message.parent_message_id == message_id
    ).first()
    
    bot_response = generate_bot_response(message.content)
    bot_message.content = bot_response
    db.commit()
    db.refresh(bot_message)

    return db_message

def delete_message(db: Session, message_id: int):
    db_message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if db_message.sender != "user":
        raise HTTPException(status_code=403, detail="Can only delete user messages")
    
    # Delete associated bot response if it exists
    bot_message = db.query(models.Message).filter(
        models.Message.parent_message_id == message_id
    ).first()
    if bot_message:
        db.delete(bot_message)
    
    db.delete(db_message)
    db.commit()
    return {"message": "Message deleted successfully"}

def regenerate_message(db: Session, message_id: int):
    bot_message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not bot_message:
        raise HTTPException(status_code=404, detail="Message not found")
    user_message = db.query(models.Message).filter(models.Message.id == bot_message.parent_message_id).first()
        
    bot_response = generate_bot_response(user_message.content)
    # Update message
    bot_message.content = bot_response
    db.commit()
    db.refresh(bot_message)
    return bot_message

def generate_bot_response(user_message: str) -> str:
    # Placeholder for actual chatbot logic
    # This will be enhanced with actual knowledge base from Artisan website
    responses = [
        "Thanks for your message! I'm here to help with any questions about Artisan.",
        "I understand you're interested in learning more about Artisan. What specific aspects would you like to know about?",
        "That's a great question about Artisan. Let me help you with that.",
        "I'm processing your request about Artisan. Could you provide more details?",
    ]
    return random.choice(responses)
