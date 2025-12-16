import React from 'react';

interface Props {
  progress: number; // 0 to 1
}

const Waveform: React.FC<Props> = ({ progress }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'var(--color-border)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '8px',
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: '100%',
          backgroundColor: 'var(--color-accent)',
        }}
      />
    </div>
  );
};

export default Waveform;