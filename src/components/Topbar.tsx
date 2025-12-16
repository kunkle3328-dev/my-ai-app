import React from 'react';

const Topbar: React.FC = () => {
  return (
    <header
      style={{
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <span style={{ fontSize: '18px' }}>Notebook</span>
    </header>
  );
};

export default Topbar;