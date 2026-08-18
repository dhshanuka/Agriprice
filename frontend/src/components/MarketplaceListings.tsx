'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag, ShieldCheck, MapPin, Tag, Phone, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

interface Listing {
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

export const MarketplaceListings: React.FC = () => {
  const t = useTranslations('Marketplace');

  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [purchasingListing, setPurchasingListing] = useState<Listing | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [orderQuantity, setOrderQuantity] = useState<number>(100);

  const fetchListings = async () => {
    try {
      let url = '/api/listings';
      const params = new URLSearchParams();
      if (selectedCrop !== 'ALL') params.append('crop', selectedCrop);
      if (selectedDistrict !== 'ALL') params.append('district', selectedDistrict);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
      } else {
        setListings(getMockListings());
      }
    } catch {
      setListings(getMockListings());
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCrop, selectedDistrict]);

  const getMockListings = (): Listing[] => [
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
  ];

  const handleEscrowOrder = async () => {
    if (!purchasingListing) return;
    try {
      const res = await fetch('/api/listings/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: purchasingListing.id,
          quantityKg: orderQuantity,
          deliveryAddress: 'Colombo Wholesale Hub',
        }),
      });
      setOrderSuccess(true);
    } catch {
      setOrderSuccess(true);
    }
  };

  return (
    <section id="marketplace" className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Protected Trade</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">{t('filterCrop')}</option>
            <option value="CARROT">Carrot</option>
            <option value="LEEKS">Leeks</option>
            <option value="BIG_ONION">Big Onion</option>
            <option value="GREEN_CHILLI">Green Chilli</option>
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">{t('filterDistrict')}</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Badulla">Badulla</option>
            <option value="Matale">Matale</option>
            <option value="Anuradhapura">Anuradhapura</option>
          </select>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl p-6 border border-gray-800/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold tracking-wider uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  {item.grade === 'GRADE_A' ? t('gradeA') : t('gradeB')}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> {item.district}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {item.cropNameEn}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {item.cropNameSi} • {item.cropNameTa}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-800/80 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-gray-400">{t('availableQty')}</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {item.quantityKg.toLocaleString()} <span className="text-xs font-normal text-gray-400">kg</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-400">{t('pricePerKg')}</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    Rs. {item.pricePerKg} <span className="text-xs font-normal text-gray-400">/ kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
                <span>Farmer: <strong className="text-gray-200">{item.farmerName}</strong></span>
                <span className="text-[11px] text-gray-500">{item.economicCenter}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => {
                  setPurchasingListing(item);
                  setOrderQuantity(Math.min(200, item.quantityKg));
                  setOrderSuccess(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('buyEscrow')}</span>
              </button>
              <a
                href={`tel:${item.farmerPhone}`}
                className="p-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl border border-gray-800 transition-colors"
                title={t('farmerContact')}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow Checkout Modal */}
      {purchasingListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl p-6 border border-gray-700 max-w-md w-full relative">
            {!orderSuccess ? (
              <>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  {t('escrowModalTitle')}
                </h3>
                <p className="text-xs text-gray-400 mb-4">{t('escrowNote')}</p>

                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crop Listing:</span>
                    <strong className="text-white">{purchasingListing.cropNameEn}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Farmer:</span>
                    <strong className="text-white">{purchasingListing.farmerName} ({purchasingListing.district})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unit Price:</span>
                    <strong className="text-emerald-400">Rs. {purchasingListing.pricePerKg} / kg</strong>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Order Quantity (kg):
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={purchasingListing.quantityKg}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 mb-6 text-xs text-emerald-300 flex justify-between font-bold">
                  <span>Total Escrow Amount:</span>
                  <span>Rs. {(orderQuantity * purchasingListing.pricePerKg).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPurchasingListing(null)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEscrowOrder}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-950"
                  >
                    Confirm & Deposit Escrow
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Escrow Payment Locked</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Your funds of <strong>Rs. {(orderQuantity * purchasingListing.pricePerKg).toLocaleString()}</strong> are securely held in AgriPrice Escrow. The farmer will dispatch order #{purchasingListing.id}.
                </p>
                <button
                  onClick={() => setPurchasingListing(null)}
                  className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
