import { Notebook, ChatTurn } from '../types';
import { chunkSources } from '../lib/chunking';
import { retrieveRelevantChunks } from '../lib/retrieval';
import { chat as chatApi } from './apiClient';

/**
 * Ask a question within a notebook using retrieval‑augmented generation.
 * Returns a ChatTurn representing the assistant response.
 */
export async function askQuestion(
  notebook: Notebook,
  question: string,
): Promise<ChatTurn> {
  const chunks = chunkSources(
    notebook.sources.map((s) => ({ id: s.id, content: s.content })),
  );
  const top = retrieveRelevantChunks(question, chunks, 8);
  // Prepare payload for serverless function
  try {
    const res = await chatApi({
      question,
      context: top.map((c) => ({ id: c.id, chunk: c.chunk })),
    });
    return {
      id: res.id || '',
      role: 'assistant',
      content: res.answer,
      citations: res.citations,
      createdAt: Date.now(),
    };
  } catch (err: any) {
    return {
      id: '',
      role: 'assistant',
      content: err.message ||
        'Unable to generate answer. This feature may require deployment with API keys.',
      createdAt: Date.now(),
    };
  }
}