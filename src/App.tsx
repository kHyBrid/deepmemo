import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { SourcesPanel } from './components/SourcesPanel';
import { mockKnowledgeBases } from './data/mock';
import type { Message, SourceDocument, SearchMode, KnowledgeBase } from './types';
import type { Session } from './services/api';
import * as api from './services/api';
import './App.css';

function App() {
  const [selectedKbId, setSelectedKbId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('vector');
  const [showSources, setShowSources] = useState(true);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const currentKb = mockKnowledgeBases.find((kb) => kb.id === selectedKbId) || null;

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessions = await api.getSessions();
        if (sessions.length > 0) {
          setCurrentSession(sessions[0]);
          const msgs = await api.getSessionMessages(sessions[0].session_id);
          setMessages(msgs.map(m => ({
            id: m.message_id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at,
          })));
        } else {
          const newSession = await api.createSession('默认会话');
          setCurrentSession(newSession);
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };
    initSession();
  }, []);

  const handleSelectKb = (id: string) => {
    setSelectedKbId(id);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSession || isLoading) return;

    const userMessage: Message = {
      id: `temp-${Date.now()}-user`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(currentSession.session_id, content);
      const aiMessage: Message = {
        id: response.message_id,
        role: response.role,
        content: response.content,
        createdAt: response.created_at,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSources([]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'ai',
        content: '抱歉，发生了错误，请检查后端服务是否正常运行。',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentSession || messages.length === 0 || isLoading) return;

    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    if (lastUserMessage) {
      setIsLoading(true);
      try {
        const response = await api.sendMessage(currentSession.session_id, lastUserMessage.content);
        const aiMessage: Message = {
          id: response.message_id,
          role: response.role,
          content: response.content,
          createdAt: response.created_at,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setSources([]);
      } catch (error) {
        console.error('Failed to refresh:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = () => {
    console.log('Export conversation');
  };

  const handleClear = async () => {
    if (!currentSession) return;
    try {
      const newSession = await api.createSession('新会话');
      setCurrentSession(newSession);
      setMessages([]);
      setSources([]);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  const handleToggleSources = () => {
    setShowSources((prev) => !prev);
  };

  const handleSelectSource = (id: string) => {
    setSelectedSourceId(id);
  };

  return (
    <div className="app">
      <Sidebar
        knowledgeBases={mockKnowledgeBases}
        selectedKbId={selectedKbId}
        onSelectKb={handleSelectKb}
      />
      <main className="main-content">
        <ChatPanel
          currentKb={currentKb}
          messages={messages}
          sources={sources}
          isLoading={isLoading}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          onSendMessage={handleSendMessage}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onClear={handleClear}
          onToggleSources={handleToggleSources}
        />
      </main>
      {showSources && (
        <SourcesPanel
          sources={sources}
          selectedSourceId={selectedSourceId}
          onSelectSource={handleSelectSource}
        />
      )}
    </div>
  );
}

export default App;
