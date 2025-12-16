import React from 'react';
import { Notebook } from '../types';

interface Props {
  citations: string[];
  notebook: Notebook;
}

const CitationPills: React.FC<Props> = ({ citations, notebook }) => {
  return (
    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {citations.map((cid, idx) => {
        const source = notebook.sources.find((s) => s.id === cid);
        return (
          <span
            key={idx}
            title={source?.title || cid}
            style={{
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'default',
            }}
          >
            [{idx + 1}]
          </span>
        );
      })}
    </div>
  );
};

export default CitationPills;