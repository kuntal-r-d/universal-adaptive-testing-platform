/**
 * Global Type Declarations
 */

import type { Logger } from '../services/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var logger: Logger | undefined;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface SessionState {
  sessionId: string;
  examProfileId: string;
  userId: string;
  currentQuestionIndex: number;
  remainingTimeSeconds: number;
  theta: number;
  answeredItems: string[];
  navigationHistory: string[];
  startedAt: string;
  lastActivityAt: string;
}

