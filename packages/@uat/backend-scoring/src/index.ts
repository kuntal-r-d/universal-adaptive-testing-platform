/**
 * Backend Scoring - IRT Algorithms for UAT Platform
 * RCF: REQ-003 (Configurable Scoring Models)
 */

// Scoring Models
export { RaschModel } from './module/scoring/core/rasch.js';
export { ThreePLModel } from './module/scoring/core/three-pl.js';
export { ThetaEstimator } from './module/scoring/core/theta-estimator.js';

// Types
export type * from './module/scoring/types/index.js';

// Config
export { ScoringConfig } from './module/scoring/config/scoring.config.js';

// Validators
export { validateScoringModel, validateItemParameters } from './module/scoring/validators/index.js';

