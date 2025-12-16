import { Notebook, AudioScript, AudioScriptTurn } from '../types';
import { script as scriptApi, tts as ttsApi } from './apiClient';

/**
 * Generate an audio overview script for a notebook.
 */
export async function generateScript(notebook: Notebook): Promise<AudioScript | null> {
  try {
    const res = await scriptApi({
      title: notebook.title,
      sources: notebook.sources.map((s) => ({ id: s.id, content: s.content })),
    });
    return res as AudioScript;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}

/**
 * Generate audio buffers for each turn using TTS.
 * Returns an array of objects with speaker, url and pause.
 */
export async function generateAudioFromScript(
  script: AudioScript,
): Promise<{ speaker: string; url: string; pause: number }[]> {
  const results: { speaker: string; url: string; pause: number }[] = [];
  for (const turn of script.turns) {
    try {
      const res = await ttsApi({ speaker: turn.speaker, text: turn.text });
      results.push({ speaker: turn.speaker, url: res.url, pause: turn.pauseMsAfter });
    } catch (err: any) {
      results.push({ speaker: turn.speaker, url: '', pause: turn.pauseMsAfter });
    }
  }
  return results;
}