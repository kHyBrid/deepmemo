const API_BASE_URL = "http://localhost:8081";

export interface Session {
  session_id: string;
  session_name: string;
  message_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: string;
  session_id: string;
  role: "user" | "ai";
  content: string;
  created_at: string;
}

export async function createSession(sessionName?: string): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_name: sessionName }),
  });
  if (!response.ok) {
    throw new Error("Failed to create session");
  }
  return response.json();
}

export async function getSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE_URL}/api/sessions`);
  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }
  return response.json();
}

export async function getSessionMessages(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`);
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

export async function sendMessage(sessionId: string, content: string): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return response.json();
}
