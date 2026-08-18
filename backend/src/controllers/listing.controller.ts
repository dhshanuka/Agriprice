import { Request, Response } from 'express';

export interface CropListingMock {
  id: string;
  farmerName: string;
  farmerPhone: string;
  cropCode: string;
  cropNameEn: string;
  cropNameSi: string;
  cropNameTa: string;
  quantityKg: number;
  pricePerKg: number;
  grade: 'GRADE_A' | 'GRADE_B' | 'GRADE_C';
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED';
  district: string;
  economicCenter: string;
  harvestDate: string;
  createdAt: string;
}

const mockListings: CropListingMock[] = [
  {
    id: 'lst_001',
    farmerName: 'Sunil Shantha',
    farmerPhone: '+94 77 123 4567',
    cropCode: 'CARROT',
    cropNameEn: 'Nuwara Eliya Carrot',
    cropNameSi: 'නුවරඑළිය කැරට්',
    cropNameTa: 'நுவரெலியா கேரட்',
    quantityKg: 1500,
    pricePerKg: 260,
    grade: 'GRADE_A',
    status: 'ACTIVE',
    district: 'Nuwara Eliya',
    economicCenter: 'Dambulla',
    harvestDate: '2026-08-16',
    createdAt: '2026-08-17T08:30:00Z',
  },
  {
    id: 'lst_002',
    farmerName: 'K. Sivalingam',
    farmerPhone: '+94 71 987 6543',
    cropCode: 'LEEKS',
    cropNameEn: 'Fresh Highland Leeks',
    cropNameSi: 'අලුත් ලීක්ස්',
    cropNameTa: 'புதிய லீக்ஸ்',
    quantityKg: 800,
    pricePerKg: 210,
    grade: 'GRADE_A',
    status: 'ACTIVE',
    district: 'Badulla',
    economicCenter: 'Keppetipola',
    harvestDate: '2026-08-17',
    createdAt: '2026-08-17T10:15:00Z',
  },
  {
    id: 'lst_003',
    farmerName: 'Mohamed Rizwan',
    farmerPhone: '+94 76 555 4321',
    cropCode: 'BIG_ONION',
    cropNameEn: 'Dambulla Harvest Big Onion',
    cropNameSi: 'ලොකු ළූණු',
    cropNameTa: 'பெரிய வெங்காயம்',
    quantityKg: 3000,
    pricePerKg: 330,
    grade: 'GRADE_A',
    status: 'ACTIVE',
    district: 'Matale',
    economicCenter: 'Dambulla',
    harvestDate: '2026-08-15',
    createdAt: '2026-08-17T06:00:00Z',
  },
  {
    id: 'lst_004',
    farmerName: 'Bandara Herath',
    farmerPhone: '+94 70 333 2211',
    cropCode: 'GREEN_CHILLI',
    cropNameEn: 'Spicy Green Chilli',
    cropNameSi: 'අමු මිරිස්',
    cropNameTa: 'பச்சை மிளகாய்',
    quantityKg: 650,
    pricePerKg: 440,
    grade: 'GRADE_B',
    status: 'ACTIVE',
    district: 'Anuradhapura',
    economicCenter: 'Dambulla',
    harvestDate: '2026-08-17',
    createdAt: '2026-08-18T07:00:00Z',
  },
  {
    id: 'lst_005',
    farmerName: 'Kamal Perera',
    farmerPhone: '+94 78 444 1122',
    cropCode: 'TOMATO',
    cropNameEn: 'Ripe Red Tomato',
    cropNameSi: 'තක්කාලි',
    cropNameTa: 'தக்காளி',
    quantityKg: 1200,
    pricePerKg: 185,
    grade: 'GRADE_A',
    status: 'ACTIVE',
    district: 'Kandy',
    economicCenter: 'Meegoda',
    harvestDate: '2026-08-16',
    createdAt: '2026-08-18T09:20:00Z',
  },
];

export const getListings = async (req: Request, res: Response) => {
  try {
    const { crop, center, district, minPrice, maxPrice } = req.query;

    let filtered = [...mockListings];

    if (crop) {
      filtered = filtered.filter((l) => l.cropCode.toLowerCase() === (crop as string).toLowerCase());
    }
    if (center) {
      filtered = filtered.filter((l) => l.economicCenter.toLowerCase() === (center as string).toLowerCase());
    }
    if (district) {
      filtered = filtered.filter((l) => l.district.toLowerCase() === (district as string).toLowerCase());
    }
    if (minPrice) {
      filtered = filtered.filter((l) => l.pricePerKg >= parseFloat(minPrice as string));
    }
    if (maxPrice) {
      filtered = filtered.filter((l) => l.pricePerKg <= parseFloat(maxPrice as string));
    }

    return res.status(200).json({
      count: filtered.length,
      listings: filtered,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch crop listings' });
  }
};

export const createListing = async (req: Request, res: Response) => {
  try {
    const { cropCode, cropNameEn, quantityKg, pricePerKg, grade, district, economicCenter } = req.body;

    if (!cropCode || !quantityKg || !pricePerKg || !district) {
      return res.status(400).json({ error: 'Missing required listing fields' });
    }

    const newListing: CropListingMock = {
      id: `lst_${Math.random().toString(36).substring(2, 9)}`,
      farmerName: req.body.farmerName || 'Registered Farmer',
      farmerPhone: req.body.farmerPhone || '+94 77 000 0000',
      cropCode: cropCode.toUpperCase(),
      cropNameEn: cropNameEn || cropCode,
      cropNameSi: req.body.cropNameSi || cropCode,
      cropNameTa: req.body.cropNameTa || cropCode,
      quantityKg: parseFloat(quantityKg),
      pricePerKg: parseFloat(pricePerKg),
      grade: grade || 'GRADE_A',
      status: 'ACTIVE',
      district,
      economicCenter: economicCenter || 'Dambulla',
      harvestDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    mockListings.unshift(newListing);

    return res.status(201).json({
      message: 'Listing created successfully',
      listing: newListing,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create crop listing' });
  }
};

export const createEscrowOrder = async (req: Request, res: Response) => {
  try {
    const { listingId, quantityKg, deliveryAddress } = req.body;

    const listing = mockListings.find((l) => l.id === listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const qty = parseFloat(quantityKg);
    const totalAmount = qty * listing.pricePerKg;

    const order = {
      id: `ord_${Math.random().toString(36).substring(2, 9)}`,
      listingId,
      cropName: listing.cropNameEn,
      quantityKg: qty,
      pricePerKg: listing.pricePerKg,
      totalAmount,
      escrowStatus: 'HELD_IN_ESCROW',
      deliveryAddress: deliveryAddress || 'Colombo Wholesale Hub',
      createdAt: new Date().toISOString(),
    };

    return res.status(201).json({
      message: 'Order created and payment held securely in AgriPrice Escrow',
      order,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to place escrow order' });
  }
};
