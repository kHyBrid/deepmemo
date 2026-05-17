from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    session_id: str


class Message(MessageBase):
    message_id: str
    session_id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message_id: str
    session_id: str
    role: str
    content: str
    created_at: datetime


class SendMessageRequest(BaseModel):
    content: str
