import React, { useState } from 'react';
import { Notebook, ChatTurn } from '../types';
import { askQuestion } from '../services/rag';
import CitationPills from './CitationPills';

interface Props {
  notebook: Notebook;
}

const ChatTab: React.FC<Props> = ({ notebook }) => {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userTurn: ChatTurn = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userTurn]);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const assistant = await askQuestion(notebook, userTurn.content);
      setMessages((prev) => [...prev, assistant]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', marginBottom: '8px' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '12px',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <div
              style={{
                backgroundColor: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface)',
                color: m.role === 'user' ? 'var(--color-background)' : 'var(--color-text-primary)',
                padding: '8px 12px',
                borderRadius: '8px',
              }}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
              {m.citations && m.citations.length > 0 && (
                <CitationPills citations={m.citations} notebook={notebook} />
              )}
            </div>
          </div>
        ))}
        {loading && <p>Thinking...</p>}
        {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={!input.trim() || loading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatTab;