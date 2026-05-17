export interface KnowledgeBase {
  id: string;
  name: string;
  documentCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface SourceDocument {
  id: string;
  title: string;
  sourceType: string;
  snippet: string;
  similarity: 'high' | 'medium' | 'low';
  updatedAt: string;
}

export interface Session {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export type SearchMode = 'vector' | 'keyword' | 'hybrid';
