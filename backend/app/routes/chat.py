from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..services import chat_service
from ..schemas import MessageCreate, MessageResponse, MessageUpdate

router = APIRouter()

@router.post("/messages", response_model=MessageResponse)
async def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    return chat_service.create_message(db=db, message=message)

@router.get("/messages", response_model=List[MessageResponse])
async def get_messages(db: Session = Depends(get_db)):
    return chat_service.get_messages(db)

@router.put("/messages/{message_id}", response_model=MessageResponse)
async def update_message(message_id: int, message: MessageUpdate, db: Session = Depends(get_db)):
    return chat_service.update_message(db=db, message_id=message_id, message=message)

@router.delete("/messages/{message_id}")
async def delete_message(message_id: int, db: Session = Depends(get_db)):
    return chat_service.delete_message(db=db, message_id=message_id)

@router.post("/messages/regenerate/{message_id}", response_model=MessageResponse)
async def regenerate_message(message_id: int, db: Session = Depends(get_db)):
    return chat_service.regenerate_message(db=db, message_id=message_id)