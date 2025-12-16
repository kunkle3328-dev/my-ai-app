import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID for notebooks, sources and artifacts.
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Perform a fetch with a timeout in milliseconds.
 * If the fetch does not complete before the timeout, the promise rejects.
 */
export async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 30000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Split a string into chunks of approximately equal size with overlap.
 * Used for simple retrieval algorithms.
 */
export function splitIntoChunks(
  text: string,
  maxLength = 1000,
  overlap = 100,
): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLength - overlap) {
    const chunk = text.substring(i, i + maxLength);
    chunks.push(chunk.trim());
  }
  return chunks;
}