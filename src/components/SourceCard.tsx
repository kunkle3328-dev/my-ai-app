import React from 'react';
import { Source } from '../types';

interface Props {
  source: Source;
}

const SourceCard: React.FC<Props> = ({ source }) => {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <h3 style={{ marginBottom: '4px', color: 'var(--color-accent)' }}>{source.title || 'Untitled Source'}</h3>
      {source.metadata.originalUrl && (
        <a href={source.metadata.originalUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>
          {source.metadata.originalUrl}
        </a>
      )}
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        {source.content.slice(0, 200)}{source.content.length > 200 && '...'}
      </p>
    </div>
  );
};

export default SourceCard;