import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          <Outlet />
        </main>
        <footer
          style={{
            padding: '8px 16px',
            textAlign: 'center',
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          © 2025 Created By Corey Dean
        </footer>
      </div>
    </div>
  );
};

export default Layout;