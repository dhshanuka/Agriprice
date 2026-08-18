import Redis from 'ioredis';

export interface ForecastPoint {
  date: string;
  historicalAvg?: number;
  forecastAvg: number;
  lowerBound: number;
  upperBound: number;
  minPrice: number;
  maxPrice: number;
}

export interface ForecastResult {
  cropCode: string;
  centerCode: string;
  horizonDays: number;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  percentageChange: number;
  confidenceScore: number;
  currentAvgPrice: number;
  predictedAvgPriceEnd: number;
  historicalData: ForecastPoint[];
  forecastData: ForecastPoint[];
  combinedSeries: ForecastPoint[];
}

export class ForecastService {
  private redis: Redis | null = null;
  private readonly CACHE_TTL_SECONDS = 3600; // 1 hour TTL

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
      });

      // Suppress unhandled ioredis connection errors when Redis container isn't active
      this.redis.on('error', (err) => {
        // Silent fallback to memory mode
      });

      this.redis.connect().catch((err) => {
        console.warn('[ForecastService] Redis connection skipped (using memory cache fallback)');
        this.redis = null;
      });
    } catch {
      this.redis = null;
    }
  }

  /**
   * Main entry point for generating crop price forecasts
   */
  async getForecast(cropCode: string, centerCode: string, horizonDays: number = 14): Promise<ForecastResult> {
    const cacheKey = `forecast:${cropCode.toUpperCase()}:${centerCode.toUpperCase()}:${horizonDays}`;

    // 1. Try Redis cache
    if (this.redis && this.redis.status === 'ready') {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        // Continue to computation on Redis error
      }
    }

    // 2. Fetch/Generate historical time series
    const historicalPoints = this.generateBaseHistoricalData(cropCode, centerCode, 30);

    // 3. Apply Holt's Linear Exponential Smoothing forecasting
    const result = this.computeHoltForecast(cropCode, centerCode, historicalPoints, horizonDays);

    // 4. Set Redis cache
    if (this.redis && this.redis.status === 'ready') {
      try {
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', this.CACHE_TTL_SECONDS);
      } catch (err) {
        // Non-blocking write failure
      }
    }

    return result;
  }

  /**
   * Holt's Linear Exponential Smoothing algorithm (Double Exponential Smoothing)
   */
  private computeHoltForecast(
    cropCode: string,
    centerCode: string,
    history: ForecastPoint[],
    horizonDays: number,
    alpha: number = 0.35,
    beta: number = 0.15
  ): ForecastResult {
    const prices = history.map((h) => h.historicalAvg || 150);
    const n = prices.length;

    // Initialize Level and Trend
    let level = prices[0];
    let trend = prices[1] - prices[0];

    // Calculate level and trend across historical data
    for (let i = 1; i < n; i++) {
      const prevLevel = level;
      const obs = prices[i];
      level = alpha * obs + (1 - alpha) * (prevLevel + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
    }

    // Compute standard deviation of historical errors (residuals) for confidence intervals
    let sumSquaredResiduals = 0;
    for (let i = 0; i < n; i++) {
      sumSquaredResiduals += Math.pow(prices[i] - level, 2);
    }
    const stdDev = Math.sqrt(sumSquaredResiduals / Math.max(1, n - 1));

    // Forecast future horizon
    const lastDateStr = history[history.length - 1].date;
    const lastDate = new Date(lastDateStr);
    const forecastData: ForecastPoint[] = [];

    let forecastEndAvg = level;

    for (let h = 1; h <= horizonDays; h++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + h);
      const dateStr = nextDate.toISOString().split('T')[0];

      // Forecast value with slight damping factor on trend
      const trendDamping = Math.pow(0.95, h);
      const forecastVal = Math.max(20, Math.round((level + h * trend * trendDamping) * 100) / 100);

      // Uncertainty expands over the horizon h
      const marginOfError = Math.round(1.96 * stdDev * Math.sqrt(1 + h * 0.15) * 100) / 100;
      const lowerBound = Math.max(10, Math.round((forecastVal - marginOfError) * 100) / 100);
      const upperBound = Math.round((forecastVal + marginOfError) * 100) / 100;

      const minPrice = Math.round(forecastVal * 0.92 * 100) / 100;
      const maxPrice = Math.round(forecastVal * 1.08 * 100) / 100;

      if (h === horizonDays) {
        forecastEndAvg = forecastVal;
      }

      forecastData.push({
        date: dateStr,
        forecastAvg: forecastVal,
        lowerBound,
        upperBound,
        minPrice,
        maxPrice,
      });
    }

    const currentAvgPrice = prices[n - 1];
    const percentageChange = Math.round(((forecastEndAvg - currentAvgPrice) / currentAvgPrice) * 10000) / 100;

    let trendLabel: 'UPWARD' | 'DOWNWARD' | 'STABLE' = 'STABLE';
    if (percentageChange > 2.5) trendLabel = 'UPWARD';
    else if (percentageChange < -2.5) trendLabel = 'DOWNWARD';

    const confidenceScore = Math.min(96, Math.max(72, Math.round(92 - stdDev * 0.5)));

    // Combined series for dashboard UI display
    const combinedSeries: ForecastPoint[] = [
      ...history.map((h) => ({
        ...h,
        forecastAvg: h.historicalAvg || 0,
        lowerBound: Math.round((h.historicalAvg || 0) * 0.95 * 100) / 100,
        upperBound: Math.round((h.historicalAvg || 0) * 1.05 * 100) / 100,
        minPrice: Math.round((h.historicalAvg || 0) * 0.9 * 100) / 100,
        maxPrice: Math.round((h.historicalAvg || 0) * 1.1 * 100) / 100,
      })),
      ...forecastData,
    ];

    return {
      cropCode: cropCode.toUpperCase(),
      centerCode: centerCode.toUpperCase(),
      horizonDays,
      trend: trendLabel,
      percentageChange,
      confidenceScore,
      currentAvgPrice,
      predictedAvgPriceEnd: forecastEndAvg,
      historicalData: history,
      forecastData,
      combinedSeries,
    };
  }

  /**
   * Generates realistic baseline historical daily price records for Sri Lankan crops & economic centers
   */
  private generateBaseHistoricalData(cropCode: string, centerCode: string, days: number): ForecastPoint[] {
    const basePrices: Record<string, number> = {
      CARROT: 280,
      LEEKS: 220,
      BIG_ONION: 340,
      GREEN_CHILLI: 450,
      TOMATO: 190,
      BRINJAL: 160,
    };

    const basePrice = basePrices[cropCode.toUpperCase()] || 200;
    const centerFactor = centerCode.toUpperCase() === 'DAMBULLA' ? 0.95 : 1.05;
    const targetPrice = basePrice * centerFactor;

    const points: ForecastPoint[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Seasonal wave + pseudo-random variance
      const sineVal = Math.sin(i / 4) * 18;
      const noise = (Math.random() - 0.48) * 12;
      const avg = Math.max(40, Math.round((targetPrice + sineVal + noise) * 100) / 100);

      points.push({
        date: dateStr,
        historicalAvg: avg,
        forecastAvg: avg,
        lowerBound: Math.round(avg * 0.95 * 100) / 100,
        upperBound: Math.round(avg * 1.05 * 100) / 100,
        minPrice: Math.round(avg * 0.9 * 100) / 100,
        maxPrice: Math.round(avg * 1.1 * 100) / 100,
      });
    }

    return points;
  }
}
