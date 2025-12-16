import React, { useState } from 'react';
import { live as liveApi } from '../services/apiClient';
import Waveform from './Waveform';

const JoinLiveTab: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'live' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleConnect = async () => {
    setStatus('connecting');
    setError(null);
    try {
      const res = await liveApi({});
      if (res && res.message) {
        throw new Error(res.message);
      }
      setStatus('live');
    } catch (err: any) {
      setError(
        err.message ||
          'Live is unavailable. This feature requires deployment and configuration.',
      );
      setStatus('idle');
    }
  };

  // simulate waveform progress when speaking
  React.useEffect(() => {
    let interval: any;
    if (status === 'speaking') {
      interval = setInterval(() => {
        setProgress((p) => (p + 0.05) % 1);
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleConnect} disabled={status !== 'idle'}>
        {status === 'idle' ? 'Join Live' : status === 'connecting' ? 'Connecting…' : 'Connected'}
      </button>
      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
      {status === 'live' && (
        <div style={{ marginTop: '16px' }}>
          <p>Press the mic button and speak to interrupt playback.</p>
          <button
            onMouseDown={() => setStatus('speaking')}
            onMouseUp={() => setStatus('live')}
            style={{ marginTop: '8px' }}
          >
            🎤
          </button>
          <Waveform progress={progress} />
        </div>
      )}
    </div>
  );
};

export default JoinLiveTab;