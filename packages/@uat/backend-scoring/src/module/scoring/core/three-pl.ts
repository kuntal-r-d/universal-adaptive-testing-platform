/**
 * Three-Parameter Logistic (3PL) Model
 * RCF: REQ-003 (Configurable Scoring Models)
 */

import type { ItemParameters, ResponseData, ThetaEstimate } from '../types/index.js';

export class ThreePLModel {
  /**
   * Calculate probability of correct response
   * P(X=1|θ,a,b,c) = c + (1-c) * exp(Da(θ-b)) / (1 + exp(Da(θ-b)))
   */
  probability(theta: number, item: ItemParameters): number {
    const D = 1.702; // Scaling constant
    const c = item.guessing ?? 0;
    const a = item.discrimination;
    const b = item.difficulty;

    const exponent = D * a * (theta - b);
    const logistic = Math.exp(exponent) / (1 + Math.exp(exponent));

    return c + (1 - c) * logistic;
  }

  /**
   * Calculate Fisher information for an item at given theta
   */
  information(theta: number, item: ItemParameters): number {
    const D = 1.702;
    const c = item.guessing ?? 0;
    const a = item.discrimination;
    const b = item.difficulty;

    const p = this.probability(theta, item);
    const exponent = D * a * (theta - b);
    const logistic = Math.exp(exponent) / (1 + Math.exp(exponent));

    const numerator = D * D * a * a * (1 - c) * (1 - c) * logistic * logistic * (1 - logistic) * (1 - logistic);
    const denominator = p * (1 - p);

    return denominator > 0 ? numerator / denominator : 0;
  }

  /**
   * Estimate theta using Expected A Posteriori (EAP)
   */
  estimateTheta(
    responses: ResponseData[],
    items: Map<string, ItemParameters>,
    priorMean = 0,
    priorVariance = 1,
    quadraturePoints = 41
  ): ThetaEstimate {
    // Generate quadrature points
    const thetaRange = { min: -4, max: 4 };
    const step = (thetaRange.max - thetaRange.min) / (quadraturePoints - 1);
    const thetas: number[] = [];
    for (let i = 0; i < quadraturePoints; i++) {
      thetas.push(thetaRange.min + i * step);
    }

    // Calculate likelihood and posterior for each theta
    const posteriors: number[] = [];
    for (const t of thetas) {
      let logLikelihood = 0;

      for (const response of responses) {
        const item = items.get(response.itemId);
        if (!item) continue;

        const p = this.probability(t, item);
        logLikelihood += response.response === 1 ? Math.log(p) : Math.log(1 - p);
      }

      // Add prior (normal distribution)
      const priorLogDensity = -0.5 * Math.pow(t - priorMean, 2) / priorVariance;
      posteriors.push(Math.exp(logLikelihood + priorLogDensity));
    }

    // Normalize posteriors
    const sum = posteriors.reduce((a, b) => a + b, 0);
    const normalized = posteriors.map((p) => p / sum);

    // Calculate EAP estimate
    let thetaEAP = 0;
    for (let i = 0; i < thetas.length; i++) {
      thetaEAP += thetas[i] * normalized[i];
    }

    // Calculate posterior standard deviation
    let variance = 0;
    for (let i = 0; i < thetas.length; i++) {
      variance += Math.pow(thetas[i] - thetaEAP, 2) * normalized[i];
    }
    const standardError = Math.sqrt(variance);

    const z = 1.96;
    return {
      theta: thetaEAP,
      standardError,
      confidence: {
        lower: thetaEAP - z * standardError,
        upper: thetaEAP + z * standardError,
      },
    };
  }
}

