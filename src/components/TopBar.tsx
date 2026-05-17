import { RefreshCw, Download, Trash2, PanelRightClose } from 'lucide-react';
import type { KnowledgeBase, SearchMode } from '../types';
import './TopBar.css';

interface TopBarProps {
  currentKb: KnowledgeBase | null;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
  onRefresh: () => void;
  onExport: () => void;
  onClear: () => void;
  onToggleSources: () => void;
}

export function TopBar({
  currentKb,
  searchMode,
  onSearchModeChange,
  onRefresh,
  onExport,
  onClear,
  onToggleSources,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="current-kb-name">{currentKb?.name || '未选择知识库'}</span>
        {currentKb && <span className="kb-status">就绪</span>}
      </div>

      <div className="topbar-center">
        <div className="search-mode-selector">
          <button
            className={`mode-btn ${searchMode === 'vector' ? 'active' : ''}`}
            onClick={() => onSearchModeChange('vector')}
          >
            向量检索
          </button>
          <button
            className={`mode-btn ${searchMode === 'keyword' ? 'active' : ''}`}
            onClick={() => onSearchModeChange('keyword')}
          >
            关键词检索
          </button>
          <button
            className={`mode-btn ${searchMode === 'hybrid' ? 'active' : ''}`}
            onClick={() => onSearchModeChange('hybrid')}
          >
            混合检索
          </button>
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" onClick={onRefresh} title="刷新">
          <RefreshCw size={18} />
        </button>
        <button className="icon-btn" onClick={onExport} title="导出">
          <Download size={18} />
        </button>
        <button className="icon-btn" onClick={onClear} title="清空">
          <Trash2 size={18} />
        </button>
        <button className="icon-btn" onClick={onToggleSources} title="切换来源面板">
          <PanelRightClose size={18} />
        </button>
      </div>
    </header>
  );
}
