import json
from fastapi import APIRouter, HTTPException, Body
from typing import Optional

from src.models import (
    Session, SessionCreate, SessionResponse,
    Message, MessageResponse, SendMessageRequest
)
from src.app.core.database import (
    create_session, get_session, get_all_sessions,
    create_message, get_messages_by_session
)
from src.services.llm import get_llm_service


router = APIRouter(prefix="/api", tags=["chat"])


@router.get("/sessions", response_model=list[SessionResponse])
async def list_sessions():
    sessions = get_all_sessions()
    result = []
    for s in sessions:
        result.append(SessionResponse(
            session_id=s["session_id"],
            session_name=s["session_name"],
            message_ids=json.loads(s["message_ids"]) if s["message_ids"] else [],
            created_at=s["created_at"],
            updated_at=s["updated_at"]
        ))
    return result


@router.post("/sessions", response_model=SessionResponse)
async def create_new_session(session_name: Optional[str] = Body(None, embed=True)):
    session = create_session(session_name or "新会话")
    return SessionResponse(
        session_id=session["session_id"],
        session_name=session["session_name"],
        message_ids=session["message_ids"],
        created_at=session["created_at"],
        updated_at=session["updated_at"]
    )


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session_by_id(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionResponse(
        session_id=session["session_id"],
        session_name=session["session_name"],
        message_ids=json.loads(session["message_ids"]) if session["message_ids"] else [],
        created_at=session["created_at"],
        updated_at=session["updated_at"]
    )


@router.get("/sessions/{session_id}/messages", response_model=list[MessageResponse])
async def list_messages(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = get_messages_by_session(session_id)
    return [
        MessageResponse(
            message_id=m["message_id"],
            session_id=m["session_id"],
            role=m["role"],
            content=m["content"],
            created_at=m["created_at"]
        )
        for m in messages
    ]


@router.post("/sessions/{session_id}/messages", response_model=MessageResponse)
async def send_message(session_id: str, request: SendMessageRequest):
    try:
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        user_message = create_message(session_id, "user", request.content)

        messages = get_messages_by_session(session_id)
        chat_history = [
            {"role": m["role"], "content": m["content"]}
            for m in messages
        ]

        llm = get_llm_service()
        ai_content = llm.chat(chat_history)

        ai_message = create_message(session_id, "ai", ai_content)

        return MessageResponse(
            message_id=ai_message["message_id"],
            session_id=ai_message["session_id"],
            role=ai_message["role"],
            content=ai_message["content"],
            created_at=ai_message["created_at"]
        )
    except Exception as e:
        import logging
        logging.error(f"Error in send_message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
