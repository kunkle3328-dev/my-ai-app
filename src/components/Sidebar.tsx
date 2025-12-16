import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Notebook } from '../types';
import { loadNotebooks } from '../services/storage';
import NotebookCreateModal from './NotebookCreateModal';

const Sidebar: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setNotebooks(loadNotebooks());
    const handle = () => setNotebooks(loadNotebooks());
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '18px', marginBottom: '8px' }}>Nebula Mind</h1>
        <button onClick={() => setShowCreate(true)}>+ New Notebook</button>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {notebooks.map((nb) => {
          const active = location.pathname.includes(nb.id);
          return (
            <Link
              key={nb.id}
              to={`/notebook/${nb.id}`}
              style={{
                display: 'block',
                padding: '8px 16px',
                backgroundColor: active ? 'var(--color-background)' : 'transparent',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              }}
            >
              {nb.title || 'Untitled'}
            </Link>
          );
        })}
      </nav>
      {showCreate && (
        <NotebookCreateModal onClose={() => setShowCreate(false)} onCreate={() => {
          setNotebooks(loadNotebooks());
          setShowCreate(false);
          // Navigate to the latest created notebook
          const latest = loadNotebooks().slice(-1)[0];
          if (latest) navigate(`/notebook/${latest.id}`);
        }} />
      )}
    </aside>
  );
};

export default Sidebar;