import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="message-list-empty">
        <div className="empty-hint">
          <p>👋 欢迎使用 DeepMemo 智能问答助手</p>
          <p className="empty-sub">选择一个知识库后，输入您的问题开始咨询</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list" ref={containerRef}>
      <div className="message-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message message-${message.role}`}
          >
            <div className="message-content">
              {message.role === 'ai' ? (
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                />
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-ai">
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  let html = text;

  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n(\d+)\. /g, '\n<li>$2</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
  html = html.replace(/\[(\d+)\]/g, '<span class="citation">[$1]</span>');
  html = html.replace(/\| (.+) \|/g, '<tr><td>$1</td></tr>');
  html = html.replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>');
  html = html.replace(/\n/g, '<br>');

  return html;
}
