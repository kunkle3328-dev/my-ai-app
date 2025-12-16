import { Notebook } from '../types';

const STORAGE_KEY = 'nebula:notebooks';

export function loadNotebooks(): Notebook[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Notebook[];
  } catch {
    return [];
  }
}

export function saveNotebooks(notebooks: Notebook[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notebooks));
}

export function getNotebookById(id: string): Notebook | undefined {
  const notebooks = loadNotebooks();
  return notebooks.find((n) => n.id === id);
}

export function upsertNotebook(nb: Notebook): void {
  const notebooks = loadNotebooks();
  const idx = notebooks.findIndex((n) => n.id === nb.id);
  if (idx >= 0) {
    notebooks[idx] = nb;
  } else {
    notebooks.push(nb);
  }
  saveNotebooks(notebooks);
}

export function deleteNotebook(id: string): void {
  const notebooks = loadNotebooks().filter((n) => n.id !== id);
  saveNotebooks(notebooks);
}