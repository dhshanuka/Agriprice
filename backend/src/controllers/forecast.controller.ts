import { Request, Response } from 'express';
import { ForecastService } from '../services/forecast.service';

const forecastService = new ForecastService();

export const getForecast = async (req: Request, res: Response) => {
  try {
    const { crop = 'CARROT', center = 'DAMBULLA', horizon = '14' } = req.query;

    const cropCode = (crop as string).toUpperCase();
    const centerCode = (center as string).toUpperCase();
    const horizonDays = parseInt(horizon as string, 10) || 14;

    const result = await forecastService.getForecast(cropCode, centerCode, horizonDays);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[ForecastController Error]:', error);
    return res.status(500).json({ error: 'Failed to compute price forecast projection' });
  }
};
