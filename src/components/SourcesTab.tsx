import React, { useState } from 'react';
import { Notebook, Source } from '../types';
import SourceAddModal from './SourceAddModal';
import DiscoverModal from './DiscoverModal';
import SourceCard from './SourceCard';
import { addSourceToNotebook } from '../services/notebookOps';

interface Props {
  notebook: Notebook;
  onUpdate: () => void;
}

const SourcesTab: React.FC<Props> = ({ notebook, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);

  const handleAddSource = (source: Source) => {
    addSourceToNotebook(notebook.id, source);
    onUpdate();
  };

  return (
    <div>
      <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
        <button onClick={() => setShowAdd(true)}>Add Source</button>
        <button onClick={() => setShowDiscover(true)}>Discover</button>
      </div>
      {notebook.sources.length === 0 && <p>No sources added yet.</p>}
      {notebook.sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
      {showAdd && (
        <SourceAddModal
          onClose={() => setShowAdd(false)}
          onSave={(src) => {
            handleAddSource(src);
            setShowAdd(false);
          }}
        />
      )}
      {showDiscover && (
        <DiscoverModal
          onClose={() => setShowDiscover(false)}
          onSelect={(sources) => {
            sources.forEach((s) => handleAddSource(s));
            setShowDiscover(false);
          }}
        />
      )}
    </div>
  );
};

export default SourcesTab;