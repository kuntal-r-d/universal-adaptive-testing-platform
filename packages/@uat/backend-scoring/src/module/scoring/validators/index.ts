/**
 * Scoring Validators
 * RCF: REQ-003 (Configurable Scoring Models)
 */

import type { ItemParameters } from '../types/index.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateScoringModel(model: string): ValidationResult {
  const validModels = ['RASCH', '1PL', '2PL', '3PL', 'CTT'];
  const errors: string[] = [];

  if (!validModels.includes(model)) {
    errors.push(`Invalid scoring model: ${model}. Valid models: ${validModels.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateItemParameters(params: ItemParameters, model: string): ValidationResult {
  const errors: string[] = [];

  // Difficulty parameter validation
  if (params.difficulty < -5 || params.difficulty > 5) {
    errors.push(`Difficulty parameter out of range [-5, 5]: ${params.difficulty}`);
  }

  // Discrimination parameter validation
  if (model !== 'RASCH' && model !== '1PL') {
    if (params.discrimination <= 0 || params.discrimination > 5) {
      errors.push(`Discrimination parameter out of range (0, 5]: ${params.discrimination}`);
    }
  }

  // Guessing parameter validation for 3PL
  if (model === '3PL') {
    const guessing = params.guessing ?? 0;
    if (guessing < 0 || guessing > 0.5) {
      errors.push(`Guessing parameter out of range [0, 0.5]: ${guessing}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateThetaRange(theta: number): ValidationResult {
  const errors: string[] = [];

  if (theta < -6 || theta > 6) {
    errors.push(`Theta estimate out of practical range [-6, 6]: ${theta}`);
  }

  return { valid: errors.length === 0, errors };
}

