import { splitIntoChunks } from './utils';

/**
 * Chunk all sources into text blocks for retrieval.
 */
export function chunkSources(sources: { id: string; content: string }[]):
  { id: string; chunk: string }[] {
  const result: { id: string; chunk: string }[] = [];
  for (const src of sources) {
    const parts = splitIntoChunks(src.content);
    parts.forEach((chunk) => {
      result.push({ id: src.id, chunk });
    });
  }
  return result;
}