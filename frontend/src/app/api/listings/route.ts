import { NextResponse } from 'next/server';

export interface CropListing {
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

const mockListings: CropListing[] = [
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
    cropNameTa: 'புதிய லීக்ஸ்',
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop');
  const district = searchParams.get('district');

  let filtered = [...mockListings];
  if (crop && crop !== 'ALL') {
    filtered = filtered.filter((l) => l.cropCode.toLowerCase() === crop.toLowerCase());
  }
  if (district && district !== 'ALL') {
    filtered = filtered.filter((l) => l.district.toLowerCase() === district.toLowerCase());
  }

  return NextResponse.json({ count: filtered.length, listings: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cropCode, cropNameEn, quantityKg, pricePerKg, grade, district, economicCenter } = body;

    if (!cropCode || !quantityKg || !pricePerKg || !district) {
      return NextResponse.json({ error: 'Missing required listing fields' }, { status: 400 });
    }

    const newListing: CropListing = {
      id: `lst_${Math.random().toString(36).substring(2, 9)}`,
      farmerName: body.farmerName || 'Registered Farmer',
      farmerPhone: body.farmerPhone || '+94 77 000 0000',
      cropCode: cropCode.toUpperCase(),
      cropNameEn: cropNameEn || cropCode,
      cropNameSi: body.cropNameSi || cropCode,
      cropNameTa: body.cropNameTa || cropCode,
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

    return NextResponse.json({ message: 'Listing created successfully', listing: newListing }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create crop listing' }, { status: 500 });
  }
}
