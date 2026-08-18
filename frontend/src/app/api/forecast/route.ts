import { NextResponse } from 'next/server';

interface ForecastPoint {
  date: string;
  historicalAvg?: number;
  forecastAvg: number;
  lowerBound: number;
  upperBound: number;
  minPrice: number;
  maxPrice: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cropCode = (searchParams.get('crop') || 'CARROT').toUpperCase();
  const centerCode = (searchParams.get('center') || 'DAMBULLA').toUpperCase();
  const horizonDays = parseInt(searchParams.get('horizon') || '14', 10);

  const basePrices: Record<string, number> = {
    CARROT: 280,
    LEEKS: 220,
    BIG_ONION: 340,
    GREEN_CHILLI: 450,
    TOMATO: 190,
    BRINJAL: 160,
  };

  const basePrice = basePrices[cropCode] || 200;
  const centerFactor = centerCode === 'DAMBULLA' ? 0.95 : 1.05;
  const targetPrice = basePrice * centerFactor;

  const history: ForecastPoint[] = [];
  const today = new Date();

  // 30 days historical data
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const sineVal = Math.sin(i / 4) * 18;
    const noise = (Math.random() - 0.48) * 12;
    const avg = Math.max(40, Math.round((targetPrice + sineVal + noise) * 100) / 100);

    history.push({
      date: dateStr,
      historicalAvg: avg,
      forecastAvg: avg,
      lowerBound: Math.round(avg * 0.95 * 100) / 100,
      upperBound: Math.round(avg * 1.05 * 100) / 100,
      minPrice: Math.round(avg * 0.9 * 100) / 100,
      maxPrice: Math.round(avg * 1.1 * 100) / 100,
    });
  }

  // Double Exponential Smoothing (Holt's Linear Trend)
  const prices = history.map((h) => h.historicalAvg || 150);
  const n = prices.length;
  const alpha = 0.35;
  const beta = 0.15;

  let level = prices[0];
  let trend = prices[1] - prices[0];

  for (let i = 1; i < n; i++) {
    const prevLevel = level;
    const obs = prices[i];
    level = alpha * obs + (1 - alpha) * (prevLevel + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  let sumSquaredResiduals = 0;
  for (let i = 0; i < n; i++) {
    sumSquaredResiduals += Math.pow(prices[i] - level, 2);
  }
  const stdDev = Math.sqrt(sumSquaredResiduals / Math.max(1, n - 1));

  const forecastData: ForecastPoint[] = [];
  const lastDateStr = history[history.length - 1].date;
  const lastDate = new Date(lastDateStr);
  let forecastEndAvg = level;

  for (let h = 1; h <= horizonDays; h++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + h);
    const dateStr = nextDate.toISOString().split('T')[0];

    const trendDamping = Math.pow(0.95, h);
    const forecastVal = Math.max(20, Math.round((level + h * trend * trendDamping) * 100) / 100);

    const marginOfError = Math.round(1.96 * stdDev * Math.sqrt(1 + h * 0.15) * 100) / 100;
    const lowerBound = Math.max(10, Math.round((forecastVal - marginOfError) * 100) / 100);
    const upperBound = Math.round((forecastVal + marginOfError) * 100) / 100;

    const minPrice = Math.round(forecastVal * 0.92 * 100) / 100;
    const maxPrice = Math.round(forecastVal * 1.08 * 100) / 100;

    if (h === horizonDays) forecastEndAvg = forecastVal;

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

  const combinedSeries = [
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

  return NextResponse.json({
    cropCode,
    centerCode,
    horizonDays,
    trend: trendLabel,
    percentageChange,
    confidenceScore,
    currentAvgPrice,
    predictedAvgPriceEnd: forecastEndAvg,
    historicalData: history,
    forecastData,
    combinedSeries,
  });
}
