import type { KnowledgeBase, Message, SearchMode, SourceDocument } from '../types';
import { TopBar } from './TopBar';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import './ChatPanel.css';

interface ChatPanelProps {
  currentKb: KnowledgeBase | null;
  messages: Message[];
  sources: SourceDocument[];
  isLoading: boolean;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
  onSendMessage: (message: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  onClear: () => void;
  onToggleSources: () => void;
}

export function ChatPanel({
  currentKb,
  messages,
  sources,
  isLoading,
  searchMode,
  onSearchModeChange,
  onSendMessage,
  onRefresh,
  onExport,
  onClear,
  onToggleSources,
}: ChatPanelProps) {
  return (
    <div className="chat-panel">
      <TopBar
        currentKb={currentKb}
        searchMode={searchMode}
        onSearchModeChange={onSearchModeChange}
        onRefresh={onRefresh}
        onExport={onExport}
        onClear={onClear}
        onToggleSources={onToggleSources}
      />
      <MessageList messages={messages} isLoading={isLoading} />
      <Composer
        onSend={onSendMessage}
        disabled={isLoading}
        selectedKbId={currentKb?.id || null}
      />
    </div>
  );
}
