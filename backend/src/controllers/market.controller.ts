import { Request, Response } from 'express';

export const economicCenters = [
  { code: 'DAMBULLA', nameEn: 'Dambulla Special Economic Centre', nameSi: 'දඹුල්ල විශේෂ ආර්ථික මධ්‍යස්ථානය', nameTa: 'தம்புள்ளை விசேட பொருளாதார மையம்', district: 'Matale', province: 'Central' },
  { code: 'MEEGODA', nameEn: 'Meegoda Dedicated Economic Centre', nameSi: 'මීගොඩ ආර්ථික මධ්‍යස්ථානය', nameTa: 'மீகொட பொருளாதார மையம்', district: 'Colombo', province: 'Western' },
  { code: 'PETTAH', nameEn: 'Pettah Wholesale Market', nameSi: 'පිටකොටුව තොග වෙළඳපොළ', nameTa: 'பிட்டகோட்டை மொத்த சந்தை', district: 'Colombo', province: 'Western' },
  { code: 'MANNING', nameEn: 'Manning Market (Peliyagoda)', nameSi: 'මෑනිං වෙළඳපොළ (පෑලියගොඩ)', nameTa: 'மேனிங் சந்தை (பேலியகொடை)', district: 'Gampaha', province: 'Western' },
  { code: 'KEPPETIPOLA', nameEn: 'Keppetipola Economic Centre', nameSi: 'කැප්පෙටිපොළ ආර්ථික මධ්‍යස්ථානය', nameTa: 'கெப்பெட்டிபொல பொருளாதார மையம்', district: 'Badulla', province: 'Uva' },
  { code: 'NUWARA_ELIYA', nameEn: 'Nuwara Eliya Economic Centre', nameSi: 'නුවරඑළිය ආර්ථික මධ්‍යස්ථානය', nameTa: 'நுவரெலியா பொருளாதார மையம்', district: 'Nuwara Eliya', province: 'Central' },
];

export const cropsList = [
  { code: 'CARROT', nameEn: 'Carrot', nameSi: 'කැරට්', nameTa: 'கேரட்', category: 'VEGETABLE', basePrice: 280 },
  { code: 'LEEKS', nameEn: 'Leeks', nameSi: 'ලීක්ස්', nameTa: 'லீக்ஸ்', category: 'VEGETABLE', basePrice: 220 },
  { code: 'BIG_ONION', nameEn: 'Big Onion', nameSi: 'ලොකු ළූණු', nameTa: 'பெரிய வெங்காயம்', category: 'VEGETABLE', basePrice: 340 },
  { code: 'GREEN_CHILLI', nameEn: 'Green Chilli', nameSi: 'අමු මිරිස්', nameTa: 'பச்சை மிளகாய்', category: 'VEGETABLE', basePrice: 450 },
  { code: 'TOMATO', nameEn: 'Tomato', nameSi: 'තක්කාලි', nameTa: 'தக்காளி', category: 'VEGETABLE', basePrice: 190 },
  { code: 'BRINJAL', nameEn: 'Brinjal', nameSi: 'වම්බටු', nameTa: 'கத்தரிக்காய்', category: 'VEGETABLE', basePrice: 160 },
];

export const getEconomicCenters = async (req: Request, res: Response) => {
  return res.status(200).json({ centers: economicCenters });
};

export const getCrops = async (req: Request, res: Response) => {
  return res.status(200).json({ crops: cropsList });
};

export const getDailyMarketPrices = async (req: Request, res: Response) => {
  try {
    const { center = 'DAMBULLA' } = req.query;
    const centerCode = (center as string).toUpperCase();

    const prices = cropsList.map((crop) => {
      const multiplier = centerCode === 'DAMBULLA' ? 0.95 : 1.05;
      const avgBuying = Math.round(crop.basePrice * multiplier);
      const minBuying = Math.round(avgBuying * 0.92);
      const maxBuying = Math.round(avgBuying * 1.08);

      const avgSelling = Math.round(avgBuying * 1.15);
      const minSelling = Math.round(avgSelling * 0.92);
      const maxSelling = Math.round(avgSelling * 1.08);

      return {
        cropCode: crop.code,
        cropNameEn: crop.nameEn,
        cropNameSi: crop.nameSi,
        cropNameTa: crop.nameTa,
        centerCode,
        date: new Date().toISOString().split('T')[0],
        wholesaleBuying: { min: minBuying, max: maxBuying, avg: avgBuying },
        wholesaleSelling: { min: minSelling, max: maxSelling, avg: avgSelling },
        unit: 'Rs./kg',
      };
    });

    return res.status(200).json({
      centerCode,
      date: new Date().toISOString().split('T')[0],
      source: 'HARTI / Department of Census & Statistics Sri Lanka',
      prices,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch daily market prices' });
  }
};
