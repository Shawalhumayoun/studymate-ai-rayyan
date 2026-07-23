export interface SummaryResult {
  title: string;
  keyTakeaways: string[];
  detailedSummary: string;
  estimatedReadTimeMinutes: number;
}

export interface MCQItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VocabItem {
  term: string;
  simpleDefinition: string;
  contextExample: string;
  analogyOrSynonym: string;
}

export interface StudySession {
  id: string;
  timestamp: string;
  title: string;
  snippet: string;
  notes: string;
  summary?: SummaryResult;
  mcqs?: MCQItem[];
  vocabulary?: VocabItem[];
}

export type ActiveTab = 'notes' | 'summary' | 'mcqs' | 'vocabulary' | 'all';
