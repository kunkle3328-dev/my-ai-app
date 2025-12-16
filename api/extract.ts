import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // In a real implementation, you would parse multipart/form-data and extract
  // text from PDF or image using Gemini or other services. For this demo we
  // return an error to signal that deployment is required.
  res.status(501).json({ error: 'File extraction requires deployment and API keys.' });
}