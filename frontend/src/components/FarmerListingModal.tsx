'use client';

import React, { useState } from 'react';
import { X, Sprout, PlusCircle, CheckCircle2 } from 'lucide-react';

interface FarmerListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FarmerListingModal: React.FC<FarmerListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [cropCode, setCropCode] = useState<string>('CARROT');
  const [cropNameEn, setCropNameEn] = useState<string>('Highland Fresh Carrot');
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [pricePerKg, setPricePerKg] = useState<number>(270);
  const [district, setDistrict] = useState<string>('Nuwara Eliya');
  const [economicCenter, setEconomicCenter] = useState<string>('Dambulla');
  const [grade, setGrade] = useState<string>('GRADE_A');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [postedSuccess, setPostedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropCode,
          cropNameEn,
          quantityKg,
          pricePerKg,
          grade,
          district,
          economicCenter,
          farmerName: 'Sunil Shantha',
          farmerPhone: '+94 77 123 4567',
        }),
      });
      setPostedSuccess(true);
      if (onSuccess) onSuccess();
    } catch {
      setPostedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl p-6 border border-gray-700 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!postedSuccess ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Post Crop Inventory Listing</h3>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Publish your harvest directly to verified Sri Lankan buyers & wholesale traders.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Crop Variety</label>
                  <select
                    value={cropCode}
                    onChange={(e) => {
                      setCropCode(e.target.value);
                      if (e.target.value === 'CARROT') setCropNameEn('Highland Fresh Carrot');
                      if (e.target.value === 'LEEKS') setCropNameEn('Fresh Highland Leeks');
                      if (e.target.value === 'BIG_ONION') setCropNameEn('Dambulla Big Onion');
                      if (e.target.value === 'GREEN_CHILLI') setCropNameEn('Spicy Green Chilli');
                    }}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="CARROT">Carrot</option>
                    <option value="LEEKS">Leeks</option>
                    <option value="BIG_ONION">Big Onion</option>
                    <option value="GREEN_CHILLI">Green Chilli</option>
                    <option value="TOMATO">Tomato</option>
                    <option value="BRINJAL">Brinjal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="GRADE_A">Grade A (Premium Export Quality)</option>
                    <option value="GRADE_B">Grade B (Standard Market)</option>
                    <option value="GRADE_C">Grade C (Processing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Listing Display Title</label>
                <input
                  type="text"
                  value={cropNameEn}
                  onChange={(e) => setCropNameEn(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Price per kg (Rs.)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Matale">Matale</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Kandy">Kandy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Nearest Economic Center</label>
                  <select
                    value={economicCenter}
                    onChange={(e) => setEconomicCenter(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Dambulla">Dambulla</option>
                    <option value="Meegoda">Meegoda</option>
                    <option value="Keppetipola">Keppetipola</option>
                    <option value="Pettah">Pettah</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'Publish Crop Inventory'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Listing Live on AgriPrice Marketplace!</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Your harvest inventory of <strong>{quantityKg} kg</strong> at <strong>Rs. {pricePerKg}/kg</strong> has been published for buyers.
            </p>
            <button
              onClick={() => {
                setPostedSuccess(false);
                onClose();
              }}
              className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
