import type { SourceDocument } from '../types';
import './SourcesPanel.css';

interface SourcesPanelProps {
  sources: SourceDocument[];
  selectedSourceId: string | null;
  onSelectSource: (id: string) => void;
}

export function SourcesPanel({ sources, selectedSourceId, onSelectSource }: SourcesPanelProps) {
  if (sources.length === 0) {
    return (
      <aside className="sources-panel">
        <div className="sources-header">
          <h3>引用来源</h3>
        </div>
        <div className="sources-empty">
          <p>等待回答后显示引用来源</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sources-panel">
      <div className="sources-header">
        <h3>引用来源</h3>
        <span className="sources-count">{sources.length}</span>
      </div>
      <div className="sources-list">
        {sources.map((source) => (
          <div
            key={source.id}
            className={`source-card ${selectedSourceId === source.id ? 'selected' : ''}`}
            onClick={() => onSelectSource(source.id)}
          >
            <div className="source-card-header">
              <span className="source-title">{source.title}</span>
              <span className="source-type">{source.sourceType}</span>
            </div>
            <p className="source-snippet">{source.snippet}</p>
            <div className="source-card-footer">
              <span className={`similarity-tag ${source.similarity}`}>
                {getSimilarityText(source.similarity)}
              </span>
              <span className="source-updated">{source.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function getSimilarityText(similarity: 'high' | 'medium' | 'low'): string {
  switch (similarity) {
    case 'high':
      return '高匹配';
    case 'medium':
      return '中匹配';
    case 'low':
      return '低匹配';
  }
}
