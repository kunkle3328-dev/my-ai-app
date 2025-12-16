import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Notebook } from '../types';
import { getNotebookById, loadNotebooks } from '../services/storage';
import Tabs from './Tabs';
import SourcesTab from './SourcesTab';
import ChatTab from './ChatTab';
import StudioTab from './StudioTab';
import AudioOverviewTab from './AudioOverviewTab';
import JoinLiveTab from './JoinLiveTab';
import SettingsTab from './SettingsTab';

const NotebookPage: React.FC = () => {
  const { notebookId } = useParams();
  const [notebook, setNotebook] = useState<Notebook | undefined>(undefined);
  const [tab, setTab] = useState('sources');

  useEffect(() => {
    const nb = getNotebookById(notebookId || '');
    setNotebook(nb);
  }, [notebookId]);

  if (!notebook) {
    return <div style={{ padding: '16px' }}>Notebook not found.</div>;
  }

  const tabs = [
    { id: 'sources', label: 'Sources', content: <SourcesTab notebook={notebook} onUpdate={() => setNotebook(getNotebookById(notebook.id))} /> },
    { id: 'chat', label: 'Chat', content: <ChatTab notebook={notebook} /> },
    { id: 'studio', label: 'Studio', content: <StudioTab notebook={notebook} /> },
    { id: 'audio', label: 'Audio', content: <AudioOverviewTab notebook={notebook} /> },
    { id: 'live', label: 'Live', content: <JoinLiveTab /> },
    { id: 'settings', label: 'Settings', content: <SettingsTab notebook={notebook} onNotebookChange={() => setNotebook(getNotebookById(notebook.id))} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs activeTab={tab} onSelect={setTab} tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} />
      <div style={{ flex: 1, overflow: 'auto', marginTop: '16px' }}>
        {tabs.find((t) => t.id === tab)?.content}
      </div>
    </div>
  );
};

export default NotebookPage;