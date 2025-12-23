/**
 * Scoring Configuration
 * RCF: REQ-003 (Configurable Scoring Models)
 */

export interface ScoringConfigOptions {
  model: 'RASCH' | '1PL' | '2PL' | '3PL' | 'CTT';
  thetaPrior: {
    mean: number;
    variance: number;
  };
  convergenceCriteria: {
    maxIterations: number;
    tolerance: number;
  };
  confidenceLevel: number;
}

export const ScoringConfig = {
  default(): ScoringConfigOptions {
    return {
      model: '3PL',
      thetaPrior: {
        mean: 0.0,
        variance: 1.0,
      },
      convergenceCriteria: {
        maxIterations: 100,
        tolerance: 0.001,
      },
      confidenceLevel: 0.95,
    };
  },

  forModel(model: ScoringConfigOptions['model']): ScoringConfigOptions {
    const config = this.default();
    config.model = model;
    return config;
  },
};

