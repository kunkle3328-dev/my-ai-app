import React, { useState } from 'react';
import { discover } from '../services/apiClient';
import { generateId } from '../lib/utils';
import { Source } from '../types';

interface Props {
  onClose: () => void;
  onSelect: (sources: Source[]) => void;
}

interface DiscoverResult {
  title: string;
  url: string;
  summary: string;
  content: string;
}

const DiscoverModal: React.FC<Props> = ({ onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoverResult[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await discover(query.trim(), 8);
      if (!Array.isArray(res.results)) {
        throw new Error(res.error || 'No results');
      }
      setResults(res.results);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const chosen = results.filter((_, idx) => selected[idx]);
    const sources: Source[] = chosen.map((r) => ({
      id: generateId(),
      type: 'website',
      title: r.title,
      content: r.content,
      metadata: { originalUrl: r.url, createdAt: Date.now() },
    }));
    onSelect(sources);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: '600px', width: '90%' }}>
        <h2>Discover Sources</h2>
        <div style={{ display: 'flex', marginTop: '8px', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search the web..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p style={{ color: 'var(--color-danger)', marginTop: '8px' }}>{error}</p>}
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '12px' }}>
          {results.map((r, idx) => (
            <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'start' }}>
                <input
                  type="checkbox"
                  checked={!!selected[idx]}
                  onChange={(e) => setSelected({ ...selected, [idx]: e.target.checked })}
                  style={{ marginRight: '8px', marginTop: '4px' }}
                />
                <div>
                  <h4 style={{ color: 'var(--color-accent)' }}>{r.title}</h4>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>{r.url}</a>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{r.summary}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '8px' }}>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--color-text-secondary)' }}>Cancel</button>
          <button onClick={handleAdd} disabled={Object.values(selected).every((v) => !v)}>
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverModal;