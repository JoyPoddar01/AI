export enum OutputType {
  SUMMARY = 'summary',
  FLASHCARDS = 'flashcards',
  QUIZ = 'quiz',
  FEEDBACK = 'writing_feedback'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface StudyRequest {
  topic: string;
  type: OutputType;
  level: DifficultyLevel;
  details: string;
}

export interface HistoryItem extends StudyRequest {
  id: string;
  timestamp: number;
  response: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  error?: string;
}
