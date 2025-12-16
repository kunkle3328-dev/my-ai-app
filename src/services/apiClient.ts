import { fetchWithTimeout } from '../lib/utils';

interface ApiError {
  error: string;
}

async function request<T>(
  path: string,
  options: RequestInit,
  timeout?: number,
): Promise<T> {
  const res = await fetchWithTimeout(path, options, timeout);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return (await res.json()) as T;
}

export function discover(query: string, limit = 8) {
  return request<any>('/api/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit }),
  });
}

export function extract(file: File) {
  const form = new FormData();
  form.append('file', file);
  return request<any>('/api/extract', {
    method: 'POST',
    body: form,
  });
}

export function chat(payload: any) {
  return request<any>('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function script(payload: any) {
  return request<any>('/api/script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function tts(payload: any) {
  return request<any>('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function live(payload: any) {
  return request<any>('/api/live', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}