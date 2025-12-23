/**
 * Session Routes
 * RCF: REQ-002 (Session State Management)
 */

import { Router } from 'express';
import {
  getSessions,
  getSession,
  createSession,
  submitAnswer,
  resumeSession,
} from '../controllers/sessions.controller.js';

const sessionRoutes = Router();

// GET /api/sessions - List sessions for user
sessionRoutes.get('/', getSessions);

// GET /api/sessions/:id - Get session by ID
sessionRoutes.get('/:id', getSession);

// POST /api/sessions - Create new exam session
sessionRoutes.post('/', createSession);

// POST /api/sessions/:id/answer - Submit answer
sessionRoutes.post('/:id/answer', submitAnswer);

// POST /api/sessions/:id/resume - Resume interrupted session
sessionRoutes.post('/:id/resume', resumeSession);

export { sessionRoutes };

