import React, { useState } from 'react';
import { Notebook, Artifact, ArtifactType } from '../types';
import { chat as chatApi } from '../services/apiClient';
import { addArtifactToNotebook } from '../services/notebookOps';
import { generateId } from '../lib/utils';

interface Props {
  notebook: Notebook;
}

const artifactLabels: Record<ArtifactType, string> = {
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  outline: 'Outline',
  brief: 'Briefing',
};

const StudioTab: React.FC<Props> = ({ notebook }) => {
  const [loadingType, setLoadingType] = useState<ArtifactType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: ArtifactType) => {
    setLoadingType(type);
    setError(null);
    try {
      const res = await chatApi({
        question: `Generate a ${type} based on the following sources`,
        context: notebook.sources.map((s) => ({ id: s.id, chunk: s.content.slice(0, 1200) })),
        instruction: `Return only the ${type} without commentary`,
      });
      const artifact: Artifact = {
        id: generateId(),
        type,
        title: `${artifactLabels[type]} for ${notebook.title}`,
        content: res.answer,
        sourceIdsUsed: res.citations || [],
        createdAt: Date.now(),
      };
      addArtifactToNotebook(notebook.id, artifact);
    } catch (err: any) {
      setError(err.message || 'Failed to generate artifact.');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {(['flashcards', 'quiz', 'outline', 'brief'] as ArtifactType[]).map((type) => (
          <button key={type} onClick={() => handleGenerate(type)} disabled={loadingType !== null}>
            {loadingType === type ? 'Generating…' : artifactLabels[type]}
          </button>
        ))}
      </div>
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notebook.artifacts.length === 0 && <p>No artefacts yet.</p>}
        {notebook.artifacts.map((a) => (
          <div key={a.id} style={{ border: '1px solid var(--color-border)', borderRadius: '6px', padding: '8px', marginBottom: '8px' }}>
            <h4 style={{ color: 'var(--color-accent)' }}>{a.title}</h4>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{a.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudioTab;