from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    sender: str = "user"
    parent_message_id: Optional[int] = None

class MessageUpdate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    sender: str
    created_at: datetime
    updated_at: datetime
    parent_message_id: Optional[int] = None

    class Config:
        from_attributes = True
