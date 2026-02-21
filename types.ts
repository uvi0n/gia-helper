export interface TaskResult {
  taskNumber?: number | string;
  taskText: string;
  answer: string;
  explanation: string;
}

export interface AnalysisResults {
  tasks: TaskResult[];
  sources: Array<{ title: string; uri: string }>;
}

export interface Subject {
  id: string;
  name: string;
  subdomain: string;
  icon: string;
  maxTasks: number;
}

export interface HistoryItem {
  id: string;
  subject: Subject;
  timestamp: number;
  queryType: SearchMode;
  queryPreview: string;
  results: AnalysisResults;
}

export type SearchMode = 'all' | 'specific' | 'text' | 'variant';
export type GradeLevel = 'oge' | 'ege';

export interface ProcessingState {
  status: 'selecting_subject' | 'idle' | 'selecting_task' | 'ready_to_upload' | 'text_input' | 'loading' | 'success' | 'error' | 'viewing_history' | 'ai_assistant';
  message?: string;
}