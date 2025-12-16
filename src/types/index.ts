export type Notebook = {
  id: string;
  title: string;
  description?: string;
  sources: Source[];
  artifacts: Artifact[];
  createdAt: number;
  updatedAt: number;
};

export type SourceType =
  | 'copiedText'
  | 'website'
  | 'pdf'
  | 'image'
  | 'audioRef'
  | 'youtubeRef';

export type Source = {
  id: string;
  type: SourceType;
  title: string;
  content: string;
  metadata: {
    originalUrl?: string;
    filename?: string;
    size?: number;
    createdAt: number;
  };
};

export type ArtifactType = 'flashcards' | 'quiz' | 'outline' | 'brief';

export type Artifact = {
  id: string;
  type: ArtifactType;
  title: string;
  content: string;
  sourceIdsUsed: string[];
  createdAt: number;
};

export type ChatTurn = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  createdAt: number;
};

export type AudioScriptTurn = {
  speaker: 'Nova' | 'Atlas';
  text: string;
  pauseMsAfter: number;
};

export type AudioScript = {
  title: string;
  coldOpen: string;
  turns: AudioScriptTurn[];
};