import React, { useState } from 'react';
import { createNotebook } from '../services/notebookOps';

interface Props {
  onClose: () => void;
  onCreate: () => void;
}

const NotebookCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createNotebook(title.trim(), description.trim());
    onCreate();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Notebook</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--color-text-secondary)' }}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotebookCreateModal;