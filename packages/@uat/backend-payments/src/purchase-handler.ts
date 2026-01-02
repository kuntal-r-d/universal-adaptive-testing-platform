// RCF: REQ-029 - One-time exam purchase handling
import type Stripe from 'stripe';
import { getStripeClient } from './stripe-client.js';
import type { CheckoutSession } from './types.js';

export class PurchaseHandler {
  private stripe: Stripe;

  constructor() {
    this.stripe = getStripeClient();
  }

  async createPurchaseCheckout(
    userId: string,
    examProfileId: string,
    examName: string,
    priceCents: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: examName,
              description: `One-time purchase - Lifetime access to ${examName}`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        examProfileId,
        type: 'exam_purchase',
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async createBundleCheckout(
    userId: string,
    examProfileIds: string[],
    bundleName: string,
    priceCents: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: bundleName,
              description: `Bundle purchase - Includes ${examProfileIds.length} exams`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        examProfileIds: JSON.stringify(examProfileIds),
        type: 'bundle_purchase',
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}

