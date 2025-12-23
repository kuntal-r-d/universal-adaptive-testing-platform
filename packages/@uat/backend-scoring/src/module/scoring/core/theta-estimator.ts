/**
 * Unified Theta Estimator
 * RCF: REQ-003 (Configurable Scoring Models)
 */

import type { ItemParameters, ResponseData, ThetaEstimate } from '../types/index.js';
import { RaschModel } from './rasch.js';
import { ThreePLModel } from './three-pl.js';

export type ScoringModelType = 'RASCH' | '1PL' | '2PL' | '3PL';

export interface EstimatorConfig {
  model: ScoringModelType;
  priorMean?: number;
  priorVariance?: number;
}

export class ThetaEstimator {
  private readonly raschModel = new RaschModel();
  private readonly threePLModel = new ThreePLModel();
  private readonly config: EstimatorConfig;

  constructor(config: EstimatorConfig) {
    this.config = {
      priorMean: 0,
      priorVariance: 1,
      ...config,
    };
  }

  /**
   * Estimate theta based on responses
   */
  estimate(responses: ResponseData[], items: Map<string, ItemParameters>): ThetaEstimate {
    if (responses.length === 0) {
      return {
        theta: this.config.priorMean ?? 0,
        standardError: Math.sqrt(this.config.priorVariance ?? 1),
        confidence: { lower: -1.96, upper: 1.96 },
      };
    }

    switch (this.config.model) {
      case 'RASCH':
      case '1PL':
        return this.raschModel.estimateTheta(responses, items, this.config.priorMean);
      case '2PL':
      case '3PL':
        return this.threePLModel.estimateTheta(
          responses,
          items,
          this.config.priorMean,
          this.config.priorVariance
        );
    }
  }

  /**
   * Select optimal next item based on maximum information
   * RCF: REQ-005 (Item Selection Algorithm)
   */
  selectNextItem(
    currentTheta: number,
    availableItems: Map<string, ItemParameters>,
    excludeIds: string[] = []
  ): { itemId: string; information: number } | null {
    let maxInfo = -Infinity;
    let selectedId: string | null = null;

    for (const [itemId, params] of availableItems) {
      if (excludeIds.includes(itemId)) continue;

      const info =
        this.config.model === 'RASCH' || this.config.model === '1PL'
          ? this.raschModel.information(currentTheta, params)
          : this.threePLModel.information(currentTheta, params);

      if (info > maxInfo) {
        maxInfo = info;
        selectedId = itemId;
      }
    }

    return selectedId ? { itemId: selectedId, information: maxInfo } : null;
  }
}

