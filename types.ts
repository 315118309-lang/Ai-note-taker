export enum Tab {
  TODAY = 'TODAY',
  JOURNAL = 'JOURNAL'
}

export interface Task {
  id: string;
  content: string;
  isCompleted: boolean;
  dueDate: Date; // For MVP, we primarily focus on "Today"
  timeString?: string; // e.g., "15:00"
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  wordCount: number;
  hasAudio: boolean; // Simulator flag
}

export enum VoiceState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AiParseResult {
  intent: 'CREATE_TASK' | 'CREATE_JOURNAL';
  content: string;
  timeString?: string; // Extracted entity
  dateOffset?: number; // 0 for today, 1 for tomorrow
}