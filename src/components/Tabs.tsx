import React from 'react';

interface TabDef {
  id: string;
  label: string;
}

interface Props {
  tabs: TabDef[];
  activeTab: string;
  onSelect: (id: string) => void;
}

const Tabs: React.FC<Props> = ({ tabs, activeTab, onSelect }) => {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              backgroundColor: active ? 'var(--color-background)' : 'transparent',
              borderBottom: active ? `2px solid var(--color-accent)` : '2px solid transparent',
              color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              marginRight: '8px',
              padding: '8px 12px',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;