import type { VercelRequest, VercelResponse } from '@vercel/node';

interface TavilyResult {
  title: string;
  url: string;
}

// Simple HTML tag stripper
function stripHtml(html: string): string {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
}

function summarize(text: string): { summary: string; keyPoints: string[] } {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  const summary = sentences.slice(0, 3).join(' ');
  const keyPoints = sentences.slice(3, 9).map((s) => s.trim()).slice(0, 4);
  return { summary, keyPoints };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { query, limit = 8 } = req.body || {};
  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Invalid query' });
    return;
  }
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Discover feature requires TAVILY_API_KEY' });
    return;
  }
  try {
    const searchRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ query, source: 'news', max_results: limit }),
    });
    if (!searchRes.ok) {
      const txt = await searchRes.text();
      throw new Error(txt);
    }
    const data = await searchRes.json();
    const results: TavilyResult[] = data.results || [];
    const good: any[] = [];
    for (const r of results) {
      try {
        const resp = await fetch(r.url);
        const html = await resp.text();
        const text = stripHtml(html);
        if (text.length < 200) continue;
        const { summary, keyPoints } = summarize(text);
        good.push({
          title: r.title,
          url: r.url,
          summary,
          content: text.slice(0, 5000),
          keyPoints,
        });
        if (good.length >= 5) break;
      } catch (e) {
        // skip
      }
    }
    res.status(200).json({ results: good });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch discover results' });
  }
}