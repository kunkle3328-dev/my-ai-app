import React, { useState } from 'react';
import { Notebook } from '../types';
import { renameNotebook, removeNotebook } from '../services/notebookOps';
import { useNavigate } from 'react-router-dom';

interface Props {
  notebook: Notebook;
  onNotebookChange: () => void;
}

const SettingsTab: React.FC<Props> = ({ notebook, onNotebookChange }) => {
  const [title, setTitle] = useState(notebook.title);
  const [description, setDescription] = useState(notebook.description || '');
  const navigate = useNavigate();

  const handleSave = () => {
    renameNotebook(notebook.id, title.trim(), description.trim());
    onNotebookChange();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this notebook permanently?')) {
      removeNotebook(notebook.id);
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h3>Notebook Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete} style={{ backgroundColor: 'var(--color-danger)' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;