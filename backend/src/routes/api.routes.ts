import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { getListings, createListing, createEscrowOrder } from '../controllers/listing.controller';
import { getEconomicCenters, getCrops, getDailyMarketPrices } from '../controllers/market.controller';
import { getForecast } from '../controllers/forecast.controller';

const router = Router();

// Auth routes (Name & Password authentication)
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', getCurrentUser);

// Market Price routes
router.get('/market-prices/centers', getEconomicCenters);
router.get('/market-prices/crops', getCrops);
router.get('/market-prices/daily', getDailyMarketPrices);

// Forecast route
router.get('/forecast', getForecast);

// Marketplace Listing routes
router.get('/listings', getListings);
router.post('/listings', createListing);
router.post('/listings/order', createEscrowOrder);

export default router;
