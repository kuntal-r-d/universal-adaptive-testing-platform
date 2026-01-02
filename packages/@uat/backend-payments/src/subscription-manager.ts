// RCF: REQ-028 - Subscription management
import type Stripe from 'stripe';
import { getStripeClient } from './stripe-client.js';
import { SUBSCRIPTION_PLANS, type SubscriptionPlan, type CheckoutSession } from './types.js';

export class SubscriptionManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = getStripeClient();
  }

  async createCheckoutSession(
    userId: string,
    plan: SubscriptionPlan,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const pricing = SUBSCRIPTION_PLANS[plan];

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: pricing.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
        plan,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.cancel(stripeSubscriptionId);
  }

  async updateSubscription(
    stripeSubscriptionId: string,
    newPlan: SubscriptionPlan
  ): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const pricing = SUBSCRIPTION_PLANS[newPlan];

    return this.stripe.subscriptions.update(stripeSubscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: pricing.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
  }

  async getSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(stripeSubscriptionId);
  }

  async listCustomerSubscriptions(stripeCustomerId: string): Promise<Stripe.Subscription[]> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
    });
    return subscriptions.data;
  }
}

