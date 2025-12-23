/**
 * Rasch Model Implementation
 * RCF: REQ-003 (Configurable Scoring Models)
 */

import type { ItemParameters, ResponseData, ThetaEstimate } from '../types/index.js';

export class RaschModel {
  /**
   * Calculate probability of correct response
   * P(X=1|θ,b) = exp(θ-b) / (1 + exp(θ-b))
   */
  probability(theta: number, item: ItemParameters): number {
    const exponent = theta - item.difficulty;
    return Math.exp(exponent) / (1 + Math.exp(exponent));
  }

  /**
   * Calculate Fisher information for an item at given theta
   * I(θ) = P(θ) * Q(θ)
   */
  information(theta: number, item: ItemParameters): number {
    const p = this.probability(theta, item);
    return p * (1 - p);
  }

  /**
   * Estimate theta using Maximum Likelihood Estimation
   */
  estimateTheta(
    responses: ResponseData[],
    items: Map<string, ItemParameters>,
    priorMean = 0,
    maxIterations = 100,
    tolerance = 0.001
  ): ThetaEstimate {
    let theta = priorMean;

    for (let i = 0; i < maxIterations; i++) {
      let numerator = 0;
      let denominator = 0;

      for (const response of responses) {
        const item = items.get(response.itemId);
        if (!item) continue;

        const p = this.probability(theta, item);
        numerator += response.response - p;
        denominator += p * (1 - p);
      }

      if (denominator === 0) break;

      const delta = numerator / denominator;
      theta += delta;

      if (Math.abs(delta) < tolerance) break;
    }

    // Calculate standard error
    let totalInfo = 0;
    for (const response of responses) {
      const item = items.get(response.itemId);
      if (item) {
        totalInfo += this.information(theta, item);
      }
    }

    const standardError = totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : 1;
    const z = 1.96; // 95% confidence

    return {
      theta,
      standardError,
      confidence: {
        lower: theta - z * standardError,
        upper: theta + z * standardError,
      },
    };
  }
}

