import React, { useEffect, useRef, useState } from 'react';

interface Segment {
  speaker: string;
  url: string;
  pause: number;
}

interface Props {
  segments: Segment[];
}

const AudioPlayer: React.FC<Props> = ({ segments }) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (index < segments.length - 1) {
        setTimeout(() => setIndex((i) => i + 1), segments[index].pause);
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [index, segments]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = segments[index]?.url || '';
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [index]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const next = () => {
    if (index < segments.length - 1) setIndex(index + 1);
  };
  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <audio ref={audioRef} src={segments[index]?.url || ''} preload="auto" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button onClick={prev} disabled={index === 0}>&lt;</button>
        <button onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={next} disabled={index === segments.length - 1}>&gt;</button>
      </div>
      <div style={{ marginTop: '4px', fontSize: '12px' }}>
        {segments[index]?.speaker || ''} - {index + 1}/{segments.length}
      </div>
    </div>
  );
};

export default AudioPlayer;