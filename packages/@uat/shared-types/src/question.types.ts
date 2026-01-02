// RCF: REQ-004, REQ-005, REQ-006, REQ-025, REQ-026 - Question types

export type QuestionStatus = 'draft' | 'pending_review' | 'active' | 'retired';

export type QuestionType = 'MCQ' | 'SATA' | 'FILL_BLANK' | 'DRAG_DROP' | 'ESSAY' | 'HOTSPOT';

export interface Question {
  id: string;
  content: QuestionContentFull;
  psychometrics: PsychometricParams;
  tags: QuestionTag[];
  status: QuestionStatus;
  authorId: string;
  questionBankIds: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface QuestionContentFull {
  stem: string;
  type: QuestionType;
  options?: QuestionOptionFull[];
  correctAnswer?: unknown; // Format depends on question type
  explanation?: string;
  media?: MediaItemFull[];
  hints?: string[];
}

export interface QuestionOptionFull {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface MediaItemFull {
  type: 'image' | 'audio' | 'video';
  url: string;
  alt?: string;
  caption?: string;
}

export interface PsychometricParams {
  difficulty: number; // beta (b parameter) - typically -4 to +4
  discrimination: number; // alpha (a parameter) - typically 0.5 to 2.5
  guessing: number; // gamma (c parameter) - typically 0 to 0.35
  exposureCount: number;
  lastCalibrationDate: Date | null;
}

export interface QuestionTag {
  category: string;
  value: string;
  level?: number; // For hierarchical tags
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  category: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionBankStats {
  bankId: string;
  totalQuestions: number;
  byStatus: Record<QuestionStatus, number>;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  coverageByTopic: Record<string, number>;
}

export interface CreateQuestionRequest {
  content: QuestionContentFull;
  psychometrics?: Partial<PsychometricParams>;
  tags: QuestionTag[];
  questionBankIds: string[];
}

export interface UpdateQuestionRequest {
  content?: Partial<QuestionContentFull>;
  psychometrics?: Partial<PsychometricParams>;
  tags?: QuestionTag[];
  status?: QuestionStatus;
}

export interface BulkImportResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

