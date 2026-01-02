// RCF: REQ-009, REQ-020, REQ-021, REQ-022, REQ-024 - Analytics types

export interface UserProgress {
  userId: string;
  examProfileId: string;
  currentTheta: number;
  targetTheta: number;
  totalAttempts: number;
  bestScore: number | null;
  averageScore: number | null;
  topicScores: TopicScore[];
  lastActivityAt: Date;
  estimatedReadinessDate: Date | null;
}

export interface TopicScore {
  topic: string;
  currentLevel: number; // -4 to +4
  targetLevel: number;
  gapPercentage: number;
  questionsAttempted: number;
  correctPercentage: number;
}

export interface DashboardData {
  user: UserDashboardSummary;
  recentActivity: RecentActivityItem[];
  progressCharts: ProgressChartData[];
  recommendations: StudyRecommendation[];
  upcomingExams: UpcomingExam[];
}

export interface UserDashboardSummary {
  totalExamsTaken: number;
  averageScore: number;
  currentStreak: number; // Days of consecutive study
  totalStudyTimeMinutes: number;
  certificationsEarned: number;
}

export interface RecentActivityItem {
  type: 'exam_completed' | 'practice_completed' | 'course_started' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ProgressChartData {
  examProfileId: string;
  examName: string;
  dataPoints: ProgressDataPoint[];
}

export interface ProgressDataPoint {
  date: Date;
  theta: number;
  standardError: number;
}

export interface StudyRecommendation {
  id: string;
  type: 'topic_practice' | 'review_material' | 'take_exam' | 'rest';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTimeMinutes: number;
  topicId?: string;
  examProfileId?: string;
}

export interface UpcomingExam {
  id: string;
  examName: string;
  scheduledDate: Date | null;
  estimatedReadiness: number; // 0-100 percentage
  status: 'scheduled' | 'recommended' | 'not_ready';
}

export interface PostExamAnalytics {
  sessionId: string;
  examName: string;
  completedAt: Date;
  overallScore: OverallScore;
  topicBreakdown: TopicBreakdown[];
  timeAnalysis: TimeAnalysis;
  comparison: HistoricalComparison | null;
  recommendations: PostExamRecommendation[];
}

export interface OverallScore {
  theta: number;
  standardError: number;
  percentileRank: number | null;
  passed: boolean | null;
  passThreshold: number | null;
  correctCount: number;
  totalQuestions: number;
  correctPercentage: number;
}

export interface TopicBreakdown {
  topic: string;
  questionsAttempted: number;
  correctCount: number;
  correctPercentage: number;
  performance: 'strong' | 'adequate' | 'needs_work' | 'weak';
  averageTimeMs: number;
}

export interface TimeAnalysis {
  totalDurationSeconds: number;
  averageTimePerQuestionMs: number;
  fastestQuestionMs: number;
  slowestQuestionMs: number;
  timePerTopic: Record<string, number>;
}

export interface HistoricalComparison {
  previousAttempts: number;
  previousBestTheta: number;
  improvement: number;
  topicImprovements: Array<{
    topic: string;
    previousScore: number;
    currentScore: number;
    change: number;
  }>;
}

export interface PostExamRecommendation {
  type: 'study_topic' | 'practice_more' | 'schedule_exam' | 'review_material';
  title: string;
  description: string;
  estimatedHours: number;
  priority: 'high' | 'medium' | 'low';
  topicId?: string;
}

export interface StudyTimeRecommendation {
  userId: string;
  examProfileId: string;
  targetExamDate: Date | null;
  totalEstimatedHours: number;
  topicBreakdown: Array<{
    topic: string;
    currentLevel: number;
    targetLevel: number;
    estimatedHours: number;
    priority: number; // 1 = highest
  }>;
  weeklySchedule: WeeklySchedule | null;
}

export interface WeeklySchedule {
  hoursPerWeek: number;
  dayBreakdown: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    topics: string[];
    estimatedMinutes: number;
  }>;
}

export interface ExamSchedulingSuggestion {
  suggestedDate: Date;
  confidenceLevel: number; // 0-100
  currentReadiness: number; // 0-100
  requiredStudyHours: number;
  riskFactors: string[];
  alternativeDates: Array<{
    date: Date;
    readiness: number;
  }>;
}

