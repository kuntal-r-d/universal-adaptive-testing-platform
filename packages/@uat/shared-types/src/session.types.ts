// RCF: REQ-002, REQ-003, REQ-031 - Session types

export type SessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface ExamSession {
  id: string;
  userId: string;
  examProfileId: string;
  status: SessionStatus;
  currentTheta: number;
  standardError: number;
  currentQuestionIndex: number;
  totalQuestionsAnswered: number;
  remainingTimeMs: number | null;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt: Date | null;
  syncToken: string; // For cross-device sync
}

export interface SessionResponse {
  id: string;
  questionId: string;
  response: unknown; // Flexible response format
  isCorrect: boolean;
  timeTakenMs: number;
  thetaAfter: number;
  answeredAt: Date;
}

export interface StartSessionRequest {
  examProfileId: string;
  resumeSessionId?: string; // To resume interrupted session
}

export interface StartSessionResponse {
  session: ExamSession;
  currentQuestion: QuestionDelivery;
}

export interface QuestionDelivery {
  id: string;
  index: number;
  totalQuestions: number | null; // null for CAT (unknown total)
  content: QuestionContentDelivery;
  timeRemainingMs: number | null;
}

export interface QuestionContentDelivery {
  stem: string;
  options?: Array<{
    id: string;
    text: string;
  }>;
  type: 'MCQ' | 'SATA' | 'FILL_BLANK' | 'DRAG_DROP' | 'ESSAY';
  media?: Array<{
    type: 'image' | 'audio' | 'video';
    url: string;
    alt?: string;
  }>;
}

export interface SubmitAnswerRequest {
  questionId: string;
  response: unknown;
  timeTakenMs: number;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  nextQuestion: QuestionDelivery | null; // null if exam complete
  sessionComplete: boolean;
  feedback?: string; // Only for practice mode
}

export interface EndSessionRequest {
  reason: 'completed' | 'timeout' | 'abandoned';
}

export interface SessionResultResponse {
  sessionId: string;
  examName: string;
  finalTheta: number;
  standardError: number;
  passed: boolean | null;
  percentileRank: number | null;
  totalQuestions: number;
  correctCount: number;
  duration: number; // in seconds
  topicPerformance: TopicPerformance[];
  completedAt: Date;
}

export interface TopicPerformance {
  topic: string;
  questionsAttempted: number;
  correctCount: number;
  proficiency: 'weak' | 'developing' | 'proficient' | 'advanced';
}

export interface SyncStateRequest {
  syncToken: string;
  deviceId: string;
}

export interface SyncStateResponse {
  session: ExamSession;
  currentQuestion: QuestionDelivery | null;
  newSyncToken: string;
  conflictDetected: boolean;
}

