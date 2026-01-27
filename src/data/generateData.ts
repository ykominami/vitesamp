import type { DailyMetrics, FilterState, AggregatedMetrics, ChartDataPoint } from '../types';
import { format, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns';

// Random number generator using current timestamp as seed for different data on each server start
function createRandom(): () => number {
  let seed = Date.now() % 233280;
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const random = createRandom();

// Additional randomness using Math.random for more variation
function randomVariance(base: number, range: number): number {
  return base + (random() - 0.5) * range * 2;
}

function generateDailyData(): DailyMetrics[] {
  const data: DailyMetrics[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const platforms: Array<'ios' | 'android'> = ['ios', 'android'];
  const planTypes: Array<'monthly' | 'yearly'> = ['monthly', 'yearly'];

  // Randomize base values within realistic ranges
  const baseValues = {
    ios: {
      monthly: {
        active: Math.round(randomVariance(8000, 2000)),
        new: Math.round(randomVariance(120, 30)),
        churn: Math.round(randomVariance(80, 20))
      },
      yearly: {
        active: Math.round(randomVariance(3000, 800)),
        new: Math.round(randomVariance(30, 10)),
        churn: Math.round(randomVariance(15, 5))
      }
    },
    android: {
      monthly: {
        active: Math.round(randomVariance(6000, 1500)),
        new: Math.round(randomVariance(100, 25)),
        churn: Math.round(randomVariance(70, 18))
      },
      yearly: {
        active: Math.round(randomVariance(2000, 500)),
        new: Math.round(randomVariance(25, 8)),
        churn: Math.round(randomVariance(12, 4))
      }
    },
  };

  // Price per plan with slight random variation
  const prices = {
    monthly: randomVariance(9.99, 2),
    yearly: randomVariance(79.99, 15) / 12,
  };

  // Randomize spike events timing and intensity
  const spikeEvents = [
    { start: '2024-01-15', end: '2024-01-20', multiplier: randomVariance(1.8, 0.3), type: 'new' },
    { start: '2024-03-01', end: '2024-03-07', multiplier: randomVariance(2.0, 0.4), type: 'new' },
    { start: '2024-05-10', end: '2024-05-15', multiplier: randomVariance(1.5, 0.3), type: 'churn' },
    { start: '2024-06-20', end: '2024-06-30', multiplier: randomVariance(2.2, 0.5), type: 'new' },
    { start: '2024-09-01', end: '2024-09-10', multiplier: randomVariance(1.8, 0.4), type: 'new' },
    { start: '2024-11-25', end: '2024-12-02', multiplier: randomVariance(2.5, 0.6), type: 'new' },
    { start: '2024-12-20', end: '2024-12-31', multiplier: randomVariance(1.6, 0.3), type: 'new' },
  ];

  // Random growth factor for the year
  const yearlyGrowthRate = randomVariance(0.3, 0.15);

  days.forEach((day, dayIndex) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayOfWeek = day.getDay();
    const monthProgress = day.getMonth() / 11;

    let newMultiplier = 1;
    let churnMultiplier = 1;
    spikeEvents.forEach(event => {
      if (isWithinInterval(day, { start: parseISO(event.start), end: parseISO(event.end) })) {
        if (event.type === 'new') newMultiplier = event.multiplier;
        if (event.type === 'churn') churnMultiplier = event.multiplier;
      }
    });

    // Weekend effect with random variation
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? randomVariance(0.85, 0.1) : 1;

    // Growth trend with randomized rate
    const growthTrend = 1 + monthProgress * yearlyGrowthRate;

    platforms.forEach(platform => {
      planTypes.forEach(planType => {
        const base = baseValues[platform][planType];

        // Higher variance for more realistic fluctuations
        const variance = () => 0.7 + random() * 0.6;

        const newSubs = Math.round(
          base.new * variance() * weekendFactor * newMultiplier * growthTrend
        );

        const churned = Math.round(
          base.churn * variance() * churnMultiplier * (1 + monthProgress * 0.1)
        );

        const activeBase = base.active * growthTrend;
        const activeSubs = Math.round(activeBase + (dayIndex * (base.new - base.churn) * randomVariance(0.3, 0.1)));

        // Trial conversions with more randomness
        const trialStarts = Math.round(newSubs * (1.3 + random() * 0.7));
        const trialConversions = Math.round(trialStarts * (0.2 + random() * 0.2));

        const mrr = activeSubs * prices[planType];

        data.push({
          date: dateStr,
          platform,
          planType,
          activeSubscriptions: activeSubs,
          newSubscriptions: newSubs,
          churned,
          mrr: Math.round(mrr * 100) / 100,
          trialStarts,
          trialConversions,
        });
      });
    });
  });

  return data;
}

// Generate data once on module load (changes on each server restart)
const allData = generateDailyData();

// Export raw data for viewing
export function getRawData(): DailyMetrics[] {
  return allData;
}

export function filterData(filters: FilterState): DailyMetrics[] {
  return allData.filter(item => {
    const dateInRange = item.date >= filters.startDate && item.date <= filters.endDate;
    const platformMatch = filters.platform === 'all' || item.platform === filters.platform;
    const planMatch = filters.planType === 'all' || item.planType === filters.planType;
    return dateInRange && platformMatch && planMatch;
  });
}

export function aggregateMetrics(data: DailyMetrics[], _filters: FilterState): AggregatedMetrics {
  if (data.length === 0) {
    return {
      totalActiveSubscriptions: 0,
      totalNewSubscriptions: 0,
      totalChurned: 0,
      totalMRR: 0,
      trialConversionRate: 0,
      activeChange: 0,
      newChange: 0,
      churnedChange: 0,
      mrrChange: 0,
      conversionChange: 0,
    };
  }

  const byDate = new Map<string, { active: number; new: number; churned: number; mrr: number; trialStarts: number; trialConversions: number }>();

  data.forEach(item => {
    const existing = byDate.get(item.date) || { active: 0, new: 0, churned: 0, mrr: 0, trialStarts: 0, trialConversions: 0 };
    byDate.set(item.date, {
      active: existing.active + item.activeSubscriptions,
      new: existing.new + item.newSubscriptions,
      churned: existing.churned + item.churned,
      mrr: existing.mrr + item.mrr,
      trialStarts: existing.trialStarts + item.trialStarts,
      trialConversions: existing.trialConversions + item.trialConversions,
    });
  });

  const sortedDates = Array.from(byDate.keys()).sort();
  const latestDate = sortedDates[sortedDates.length - 1];
  const latestMetrics = byDate.get(latestDate)!;

  let totalNew = 0;
  let totalChurned = 0;
  let totalTrialStarts = 0;
  let totalTrialConversions = 0;

  byDate.forEach(metrics => {
    totalNew += metrics.new;
    totalChurned += metrics.churned;
    totalTrialStarts += metrics.trialStarts;
    totalTrialConversions += metrics.trialConversions;
  });

  const periodLength = sortedDates.length;
  const halfPoint = Math.floor(periodLength / 2);

  let firstHalfNew = 0, secondHalfNew = 0;
  let firstHalfChurned = 0, secondHalfChurned = 0;
  let firstHalfMrr = 0, secondHalfMrr = 0;
  let firstHalfActive = 0, secondHalfActive = 0;
  let firstHalfConversions = 0, secondHalfConversions = 0;
  let firstHalfTrialStarts = 0, secondHalfTrialStarts = 0;

  sortedDates.forEach((date, index) => {
    const metrics = byDate.get(date)!;
    if (index < halfPoint) {
      firstHalfNew += metrics.new;
      firstHalfChurned += metrics.churned;
      firstHalfMrr += metrics.mrr;
      firstHalfActive += metrics.active;
      firstHalfConversions += metrics.trialConversions;
      firstHalfTrialStarts += metrics.trialStarts;
    } else {
      secondHalfNew += metrics.new;
      secondHalfChurned += metrics.churned;
      secondHalfMrr += metrics.mrr;
      secondHalfActive += metrics.active;
      secondHalfConversions += metrics.trialConversions;
      secondHalfTrialStarts += metrics.trialStarts;
    }
  });

  const calcChange = (first: number, second: number) => {
    if (first === 0) return second > 0 ? 100 : 0;
    return ((second - first) / first) * 100;
  };

  const firstHalfConvRate = firstHalfTrialStarts > 0 ? (firstHalfConversions / firstHalfTrialStarts) * 100 : 0;
  const secondHalfConvRate = secondHalfTrialStarts > 0 ? (secondHalfConversions / secondHalfTrialStarts) * 100 : 0;

  return {
    totalActiveSubscriptions: latestMetrics.active,
    totalNewSubscriptions: totalNew,
    totalChurned: totalChurned,
    totalMRR: latestMetrics.mrr,
    trialConversionRate: totalTrialStarts > 0 ? (totalTrialConversions / totalTrialStarts) * 100 : 0,
    activeChange: calcChange(firstHalfActive / Math.max(halfPoint, 1), secondHalfActive / Math.max(periodLength - halfPoint, 1)),
    newChange: calcChange(firstHalfNew, secondHalfNew),
    churnedChange: calcChange(firstHalfChurned, secondHalfChurned),
    mrrChange: calcChange(firstHalfMrr / Math.max(halfPoint, 1), secondHalfMrr / Math.max(periodLength - halfPoint, 1)),
    conversionChange: secondHalfConvRate - firstHalfConvRate,
  };
}

export function getChartData(data: DailyMetrics[]): ChartDataPoint[] {
  const byDate = new Map<string, ChartDataPoint>();

  data.forEach(item => {
    const existing = byDate.get(item.date);
    if (existing) {
      existing.activeSubscriptions += item.activeSubscriptions;
      existing.newSubscriptions += item.newSubscriptions;
      existing.churned += item.churned;
      existing.mrr += item.mrr;
    } else {
      byDate.set(item.date, {
        date: item.date,
        displayDate: format(parseISO(item.date), 'M/d'),
        activeSubscriptions: item.activeSubscriptions,
        newSubscriptions: item.newSubscriptions,
        churned: item.churned,
        mrr: item.mrr,
        trialConversionRate: 0,
      });
    }
  });

  const trialData = new Map<string, { starts: number; conversions: number }>();
  data.forEach(item => {
    const existing = trialData.get(item.date) || { starts: 0, conversions: 0 };
    trialData.set(item.date, {
      starts: existing.starts + item.trialStarts,
      conversions: existing.conversions + item.trialConversions,
    });
  });

  byDate.forEach((point, date) => {
    const trial = trialData.get(date);
    if (trial && trial.starts > 0) {
      point.trialConversionRate = Math.round((trial.conversions / trial.starts) * 1000) / 10;
    }
  });

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function getDefaultFilters(): FilterState {
  return {
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    platform: 'all',
    planType: 'all',
  };
}
