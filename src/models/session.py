from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SessionBase(BaseModel):
    session_name: str


class SessionCreate(BaseModel):
    session_name: Optional[str] = None


class SessionUpdate(BaseModel):
    session_name: Optional[str] = None
    message_ids: Optional[str] = None


class Session(SessionBase):
    session_id: str
    message_ids: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SessionResponse(BaseModel):
    session_id: str
    session_name: str
    message_ids: list[str]
    created_at: datetime
    updated_at: datetime
