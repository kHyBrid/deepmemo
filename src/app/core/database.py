import sqlite3
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional


DATABASE_PATH = Path(__file__).parent.parent.parent / "data" / "deepmemo.db"
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS session (
            session_id TEXT PRIMARY KEY,
            session_name TEXT NOT NULL,
            message_ids TEXT DEFAULT '[]',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS message (
            message_id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES session(session_id)
        )
    """)

    conn.commit()
    conn.close()


def create_session(session_name: str = "新会话") -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    session_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    cursor.execute(
        "INSERT INTO session (session_id, session_name, message_ids, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (session_id, session_name, "[]", now, now)
    )

    conn.commit()
    conn.close()

    return {
        "session_id": session_id,
        "session_name": session_name,
        "message_ids": [],
        "created_at": now,
        "updated_at": now
    }


def get_session(session_id: str) -> Optional[dict]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM session WHERE session_id = ?", (session_id,))
    row = cursor.fetchone()

    conn.close()

    if row:
        return dict(row)
    return None


def get_all_sessions() -> list[dict]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM session ORDER BY updated_at DESC")
    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]


def update_session_message_ids(session_id: str, message_ids: list[str]):
    conn = get_connection()
    cursor = conn.cursor()

    now = datetime.now().isoformat()
    message_ids_json = json.dumps(message_ids)

    cursor.execute(
        "UPDATE session SET message_ids = ?, updated_at = ? WHERE session_id = ?",
        (message_ids_json, now, session_id)
    )

    conn.commit()
    conn.close()


def create_message(session_id: str, role: str, content: str) -> dict:
    message_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO message (message_id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
        (message_id, session_id, role, content, now)
    )
    conn.commit()
    conn.close()

    session = get_session(session_id)
    if session:
        message_ids = json.loads(session["message_ids"])
        message_ids.append(message_id)
        update_session_message_ids(session_id, message_ids)

    return {
        "message_id": message_id,
        "session_id": session_id,
        "role": role,
        "content": content,
        "created_at": now
    }


def get_messages_by_session(session_id: str) -> list[dict]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM message WHERE session_id = ? ORDER BY created_at ASC", (session_id,))
    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]
