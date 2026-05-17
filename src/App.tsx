import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { SourcesPanel } from './components/SourcesPanel';
import { mockKnowledgeBases, getMockResponse } from './data/mock';
import type { Message, SourceDocument, SearchMode, KnowledgeBase } from './types';
import './App.css';

function App() {
  const [selectedKbId, setSelectedKbId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('vector');
  const [showSources, setShowSources] = useState(true);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const currentKb = mockKnowledgeBases.find((kb) => kb.id === selectedKbId) || null;

  const handleSelectKb = (id: string) => {
    setSelectedKbId(id);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const response = getMockResponse(content);
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: response.content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSources(response.sources);
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
      if (lastUserMessage) {
        setIsLoading(true);
        setTimeout(() => {
          const response = getMockResponse(lastUserMessage.content);
          const aiMessage: Message = {
            id: `msg-${Date.now()}-ai`,
            role: 'ai',
            content: response.content,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setSources(response.sources);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleExport = () => {
    console.log('Export conversation');
  };

  const handleClear = () => {
    setMessages([]);
    setSources([]);
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
