import { generateId } from '../lib/utils';
import { Notebook, Source, Artifact } from '../types';
import {
  loadNotebooks,
  saveNotebooks,
  getNotebookById,
} from './storage';

export function createNotebook(
  title: string,
  description = '',
): Notebook {
  const notebooks = loadNotebooks();
  const nb: Notebook = {
    id: generateId(),
    title,
    description,
    sources: [],
    artifacts: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  notebooks.push(nb);
  saveNotebooks(notebooks);
  return nb;
}

export function renameNotebook(
  id: string,
  title: string,
  description = '',
): Notebook | undefined {
  const notebooks = loadNotebooks();
  const idx = notebooks.findIndex((n) => n.id === id);
  if (idx < 0) return undefined;
  notebooks[idx] = { ...notebooks[idx], title, description, updatedAt: Date.now() };
  saveNotebooks(notebooks);
  return notebooks[idx];
}

export function removeNotebook(id: string): void {
  const notebooks = loadNotebooks().filter((n) => n.id !== id);
  saveNotebooks(notebooks);
}

export function addSourceToNotebook(
  notebookId: string,
  source: Source,
): Notebook | undefined {
  const notebook = getNotebookById(notebookId);
  if (!notebook) return undefined;
  const updated: Notebook = {
    ...notebook,
    sources: [...notebook.sources, source],
    updatedAt: Date.now(),
  };
  upsert(updated);
  return updated;
}

export function addArtifactToNotebook(
  notebookId: string,
  artifact: Artifact,
): Notebook | undefined {
  const notebook = getNotebookById(notebookId);
  if (!notebook) return undefined;
  const updated: Notebook = {
    ...notebook,
    artifacts: [...notebook.artifacts, artifact],
    updatedAt: Date.now(),
  };
  upsert(updated);
  return updated;
}

function upsert(nb: Notebook) {
  const notebooks = loadNotebooks();
  const idx = notebooks.findIndex((n) => n.id === nb.id);
  if (idx >= 0) {
    notebooks[idx] = nb;
  } else {
    notebooks.push(nb);
  }
  saveNotebooks(notebooks);
}