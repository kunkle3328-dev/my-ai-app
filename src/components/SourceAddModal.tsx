import React, { useState } from 'react';
import { generateId } from '../lib/utils';
import { Source } from '../types';
import { extract } from '../services/apiClient';

interface Props {
  onClose: () => void;
  onSave: (source: Source) => void;
}

const SourceAddModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [mode, setMode] = useState<'text' | 'url' | 'file'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (mode === 'text') {
        const src: Source = {
          id: generateId(),
          type: 'copiedText',
          title: title || 'Pasted Text',
          content: content,
          metadata: { createdAt: Date.now() },
        };
        onSave(src);
      } else if (mode === 'url') {
        if (!url) throw new Error('URL required');
        const res = await fetch(url);
        const html = await res.text();
        // basic extraction: remove tags
        const text = html.replace(/<[^>]+>/g, ' ');
        const src: Source = {
          id: generateId(),
          type: 'website',
          title: title || url,
          content: text.slice(0, 10000),
          metadata: { originalUrl: url, createdAt: Date.now() },
        };
        onSave(src);
      } else if (mode === 'file') {
        if (!file) throw new Error('File required');
        const res = await extract(file);
        const src: Source = {
          id: generateId(),
          type: res.type || 'pdf',
          title: title || res.title || file.name,
          content: res.content,
          metadata: { filename: file.name, size: file.size, createdAt: Date.now() },
        };
        onSave(src);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Source</h2>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              backgroundColor: mode === 'text' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: mode === 'text' ? 'var(--color-background)' : 'var(--color-text-secondary)',
            }}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              backgroundColor: mode === 'url' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: mode === 'url' ? 'var(--color-background)' : 'var(--color-text-secondary)',
            }}
          >
            Website URL
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            style={{
              backgroundColor: mode === 'file' ? 'var(--color-accent)' : 'var(--color-surface)',
              color: mode === 'file' ? 'var(--color-background)' : 'var(--color-text-secondary)',
            }}
          >
            File
          </button>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>
            Title (optional)
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          {mode === 'text' && (
            <label>
              Text
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            </label>
          )}
          {mode === 'url' && (
            <label>
              URL
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
            </label>
          )}
          {mode === 'file' && (
            <label>
              File
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>
        {error && <p style={{ color: 'var(--color-danger)', marginTop: '8px' }}>{error}</p>}
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--color-text-secondary)' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceAddModal;