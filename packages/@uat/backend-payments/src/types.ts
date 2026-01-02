// RCF: REQ-028, REQ-029 - Payment types

export type SubscriptionPlan = 'basic' | 'premium' | 'unlimited';

export interface SubscriptionPricing {
  plan: SubscriptionPlan;
  priceId: string;
  monthlyPriceCents: number;
  annualPriceCents: number;
  examLimit: number | null; // null = unlimited
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  createdAt: Date;
}

export interface ExamPurchase {
  id: string;
  userId: string;
  examProfileId: string;
  stripePaymentId: string;
  amountCents: number;
  purchasedAt: Date;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPricing> = {
  basic: {
    plan: 'basic',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    monthlyPriceCents: 1900,
    annualPriceCents: 19000,
    examLimit: 3,
  },
  premium: {
    plan: 'premium',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    monthlyPriceCents: 4900,
    annualPriceCents: 49000,
    examLimit: 10,
  },
  unlimited: {
    plan: 'unlimited',
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || '',
    monthlyPriceCents: 9900,
    annualPriceCents: 99000,
    examLimit: null,
  },
};

