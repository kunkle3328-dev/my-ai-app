import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContextChunk {
  id: string;
  chunk: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { question, context, instruction } = req.body || {};
  if (!question || !Array.isArray(context)) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  // If API key is not set, fallback to simple heuristic answer.
  if (!apiKey) {
    // Join the first few context chunks and truncate
    const text = (context as ContextChunk[])
      .map((c) => c.chunk)
      .join(' ')
      .slice(0, 1000);
    const answer = text
      ? `Here's what I found based on your sources: ${text.substring(0, 400)}...`
      : 'I could not find relevant information in the provided sources.';
    const citations = Array.from(new Set((context as ContextChunk[]).map((c) => c.id)));
    res.status(200).json({ answer, citations });
    return;
  }
  try {
    // Use Gemini API to generate a grounded answer.
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const messages = [
      {
        role: 'user',
        content: [
          { text: `Answer the question strictly from the provided context. Cite the sources by id at the end. Question: ${question}` },
        ],
      },
      {
        role: 'assistant',
        content: [
          {
            text: context
              .map((c: ContextChunk) => `Source ${c.id}: ${c.chunk}`)
              .join('\n\n'),
          },
        ],
      },
    ];
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: messages }),
    });
    const data = await geminiRes.json();
    const answer =
      data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || 'No answer.';
    // Extract citations: look for [id] patterns or fallback to all ids
    const ids = (context as ContextChunk[]).map((c) => c.id);
    res.status(200).json({ answer, citations: ids });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gemini call failed' });
  }
}