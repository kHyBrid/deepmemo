import { Database, Clock, Tag, Settings, Upload, User } from 'lucide-react';
import type { KnowledgeBase } from '../types';
import './Sidebar.css';

interface SidebarProps {
  knowledgeBases: KnowledgeBase[];
  selectedKbId: string | null;
  onSelectKb: (id: string) => void;
}

export function Sidebar({ knowledgeBases, selectedKbId, onSelectKb }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">DeepMemo</h1>
        <span className="sidebar-env">开发环境</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <Database size={16} />
            知识库
          </div>
          <ul className="kb-list">
            {knowledgeBases.map((kb) => (
              <li
                key={kb.id}
                className={`kb-item ${selectedKbId === kb.id ? 'selected' : ''}`}
                onClick={() => onSelectKb(kb.id)}
              >
                <span className="kb-name">{kb.name}</span>
                <span className="kb-meta">
                  {kb.documentCount} 文档 · {kb.updatedAt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <Clock size={16} />
            最近会话
          </div>
          <ul className="session-list">
            <li className="session-item">暂无会话记录</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <Tag size={16} />
            标签筛选
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-btn">
          <Upload size={18} />
          数据导入
        </button>
        <button className="sidebar-btn">
          <Settings size={18} />
          设置
        </button>
        <button className="sidebar-btn">
          <User size={18} />
          用户
        </button>
      </div>
    </aside>
  );
}
