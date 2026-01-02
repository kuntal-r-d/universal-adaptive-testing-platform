// RCF: REQ-020, REQ-028, REQ-029 - User types

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  auth0Id: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'student' | 'admin' | 'content_author' | 'psychometrician';

export interface UserSubscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'unlimited';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  stripeSubscriptionId: string;
}

export interface UserExamAccess {
  examProfileId: string;
  accessType: 'subscription' | 'purchased';
  expiresAt: Date | null; // null = permanent access
}

export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string | null; // HH:MM format
  timezone: string;
}

