// RCF: REQ-001, REQ-027 - Exam types

export type ExamMethodology = 'CAT' | 'LOFT' | 'LINEAR' | 'SECTION_ADAPTIVE';

export type ScoringModel = '1PL' | '2PL' | '3PL';

export interface StoppingCriteria {
  type: 'SEM' | 'FIXED_LENGTH' | 'COMBINED';
  semThreshold?: number;
  minItems: number;
  maxItems: number;
}

export interface ExamConfig {
  methodology: ExamMethodology;
  scoringModel: ScoringModel;
  stoppingCriteria: StoppingCriteria;
  navigationAllowed: boolean;
  timeLimitMinutes: number | null;
  exposureControlEnabled: boolean;
}

export interface ExamProfile {
  id: string;
  name: string;
  description: string;
  config: ExamConfig;
  priceCents: number | null;
  subscriptionTier: 'basic' | 'premium' | 'unlimited' | null;
  thumbnailUrl: string | null;
  rating: number | null;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  methodology: ExamMethodology;
  priceCents: number | null;
  subscriptionTier: 'basic' | 'premium' | 'unlimited' | null;
  thumbnailUrl: string | null;
  rating: number | null;
  totalRatings: number;
  estimatedDurationMinutes: number;
  questionCount: number;
}

export interface ExamDetailResponse {
  exam: ExamProfile;
  sampleQuestions: SampleQuestion[];
  topics: string[];
  hasAccess: boolean;
  accessType: 'subscription' | 'purchased' | 'none';
}

export interface SampleQuestion {
  id: string;
  content: QuestionContent;
}

export interface QuestionContent {
  stem: string;
  options?: QuestionOption[];
  type: 'MCQ' | 'SATA' | 'FILL_BLANK' | 'DRAG_DROP' | 'ESSAY';
  media?: MediaItem[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only included for sample questions
}

export interface MediaItem {
  type: 'image' | 'audio' | 'video';
  url: string;
  alt?: string;
}

