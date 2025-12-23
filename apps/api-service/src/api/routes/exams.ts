/**
 * Exam Routes
 * RCF: REQ-001 (Polymorphic Exam Engine)
 */

import { Router } from 'express';
import {
  getExamProfiles,
  getExamProfile,
  createExamProfile,
  updateExamProfile,
} from '../controllers/exams.controller.js';

const examRoutes = Router();

// GET /api/exams - List all exam profiles
examRoutes.get('/', getExamProfiles);

// GET /api/exams/:id - Get exam profile by ID
examRoutes.get('/:id', getExamProfile);

// POST /api/exams - Create new exam profile
examRoutes.post('/', createExamProfile);

// PUT /api/exams/:id - Update exam profile
examRoutes.put('/:id', updateExamProfile);

export { examRoutes };

