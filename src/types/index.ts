export type Platform = 'ios' | 'android' | 'all';
export type PlanType = 'monthly' | 'yearly' | 'all';

export interface DailyMetrics {
  date: string;
  activeSubscriptions: number;
  newSubscriptions: number;
  churned: number;
  mrr: number;
  trialConversions: number;
  trialStarts: number;
  platform: 'ios' | 'android';
  planType: 'monthly' | 'yearly';
}

export interface FilterState {
  startDate: string;
  endDate: string;
  platform: Platform;
  planType: PlanType;
}

export interface AggregatedMetrics {
  totalActiveSubscriptions: number;
  totalNewSubscriptions: number;
  totalChurned: number;
  totalMRR: number;
  trialConversionRate: number;
  activeChange: number;
  newChange: number;
  churnedChange: number;
  mrrChange: number;
  conversionChange: number;
}

export interface ChartDataPoint {
  date: string;
  displayDate: string;
  activeSubscriptions: number;
  newSubscriptions: number;
  churned: number;
  mrr: number;
  trialConversionRate: number;
}
