import React, { useState } from 'react';
import { Notebook, AudioScript } from '../types';
import { generateScript, generateAudioFromScript } from '../services/audioOverview';
import AudioPlayer from './AudioPlayer';

interface Props {
  notebook: Notebook;
}

const AudioOverviewTab: React.FC<Props> = ({ notebook }) => {
  const [script, setScript] = useState<AudioScript | null>(null);
  const [segments, setSegments] = useState<{ speaker: string; url: string; pause: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const sc = await generateScript(notebook);
      if (!sc) {
        throw new Error(
          'Unable to generate script. This feature may require deployment with API keys.',
        );
      }
      setScript(sc);
      const audios = await generateAudioFromScript(sc);
      setSegments(audios);
    } catch (err: any) {
      setError(err.message || 'Failed to generate audio overview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Audio Overview'}
      </button>
      {error && <p style={{ color: 'var(--color-danger)', marginTop: '8px' }}>{error}</p>}
      {script && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ color: 'var(--color-accent)' }}>{script.title}</h3>
          <p style={{ fontStyle: 'italic' }}>{script.coldOpen}</p>
          {segments.length > 0 ? (
            <AudioPlayer segments={segments} />
          ) : (
            <p>Loading audio…</p>
          )}
          <div style={{ marginTop: '16px' }}>
            {script.turns.map((t, idx) => (
              <p key={idx} style={{ marginBottom: '4px' }}>
                <strong>{t.speaker}: </strong>
                {t.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioOverviewTab;