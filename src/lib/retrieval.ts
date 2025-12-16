/**
 * Very simple keyword matching retrieval.
 * Scores each chunk by counting overlapping words with the query.
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: { id: string; chunk: string }[],
  topK = 5,
): { id: string; chunk: string; score: number }[] {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const scored = chunks.map((c) => {
    const text = c.chunk.toLowerCase();
    let score = 0;
    for (const k of keywords) {
      if (text.includes(k)) score += 1;
    }
    return { ...c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}