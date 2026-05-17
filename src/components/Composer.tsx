import { useState } from 'react';
import { Send, Upload, Search } from 'lucide-react';
import './Composer.css';

interface ComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  selectedKbId: string | null;
}

export function Composer({ onSend, disabled, selectedKbId }: ComposerProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="composer">
      <form className="composer-form" onSubmit={handleSubmit}>
        <div className="composer-input-wrapper">
          <textarea
            className="composer-input"
            placeholder="输入您的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
        </div>

        <div className="composer-actions">
          <button type="button" className="action-btn" title="上传文件">
            <Upload size={18} />
          </button>
          <button type="button" className="action-btn" title="检索范围">
            <Search size={18} />
          </button>
          <button
            type="submit"
            className="send-btn"
            disabled={disabled || !input.trim()}
          >
            <Send size={18} />
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
