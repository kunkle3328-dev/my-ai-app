import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomInt } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { title, sources } = req.body || {};
  if (!title || !Array.isArray(sources)) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // naive script generation using sources text
    const allText = sources.map((s: any) => s.content).join(' ');
    const sentences = allText.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 30);
    const turns = [] as { speaker: 'Nova' | 'Atlas'; text: string; pauseMsAfter: number }[];
    for (let i = 0; i < Math.min(6, sentences.length); i++) {
      const speaker = i % 2 === 0 ? 'Nova' : 'Atlas';
      turns.push({ speaker, text: sentences[i], pauseMsAfter: randomInt(300, 700) });
    }
    res.status(200).json({
      title: `Audio overview of ${title}`,
      coldOpen: sentences[0] || '',
      turns,
    });
    return;
  }
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const context = sources
      .map((s: any) => s.content.slice(0, 1000))
      .join('\n');
    const prompt =
      `You are Nova and Atlas hosting a conversation summarizing a notebook titled "${title}". ` +
      `Use a friendly, curious tone with occasional interjections. Strictly ground the conversation in the provided content. ` +
      `Include two curiosity moments and one disagreement resolved by citing sources. Return JSON with keys title, coldOpen, and turns (speaker, text, pauseMsAfter).`;
    const messages = [
      {
        role: 'user',
        content: [
          { text: prompt },
          { text: `Content:\n${context}` },
        ],
      },
    ];
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: messages }),
    });
    const data = await resp.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
    try {
      const parsed = JSON.parse(text);
      res.status(200).json(parsed);
    } catch (e) {
      // If parsing fails, fallback to naive
      res.status(200).json({
        title: `Audio overview of ${title}`,
        coldOpen: '',
        turns: [],
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate script' });
  }
}