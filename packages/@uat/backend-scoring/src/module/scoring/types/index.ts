/**
 * Scoring Module Types
 * RCF: REQ-003 (Configurable Scoring Models)
 */

export interface ItemParameters {
  /** Item discrimination (a-parameter) */
  discrimination: number;
  /** Item difficulty (b-parameter) */
  difficulty: number;
  /** Guessing parameter (c-parameter) */
  guessing?: number;
}

export interface ResponseData {
  itemId: string;
  response: 0 | 1;
  responseTime?: number;
}

export interface ThetaEstimate {
  theta: number;
  standardError: number;
  confidence: {
    lower: number;
    upper: number;
  };
}

export interface ScoringModelType {
  RASCH: 'RASCH';
  ONE_PL: '1PL';
  TWO_PL: '2PL';
  THREE_PL: '3PL';
  CTT: 'CTT';
}

export interface ItemSelectionCriteria {
  theta: number;
  contentConstraints?: Record<string, number>;
  exposureControl?: boolean;
  excludeItems?: string[];
}

export interface SelectedItem {
  itemId: string;
  information: number;
  exposureRate?: number;
}

