'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { PriceDashboard } from '@/components/PriceDashboard';
import { MarketplaceListings } from '@/components/MarketplaceListings';
import { FarmerListingModal } from '@/components/FarmerListingModal';
import { Footer } from '@/components/Footer';
import { TrendingUp, ShieldCheck, Zap, Award, ChevronRight, ArrowUpRight } from 'lucide-react';

interface PageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: PageProps) {
  const t = useTranslations('Hero');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100">
      {/* Navigation Header */}
      <Header locale={locale} onOpenListingModal={() => setIsListingModalOpen(true)} />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-gray-800/60 bg-gradient-to-b from-[#090d16] via-[#0d1627] to-[#090d16]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3.5 h-3.5" />
                <span>{t('badge')}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {t('titlePrefix')}{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 bg-clip-text text-transparent">
                  {t('titleHighlight')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 mt-6 leading-relaxed">
                {t('subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#dashboard"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950 hover:shadow-emerald-800"
                >
                  <span>{t('exploreDashboard')}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

                <a
                  href="#marketplace"
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-gray-800 transition-colors"
                >
                  <span>{t('browseMarketplace')}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </a>
              </div>

              {/* Highlight Stats Row */}
              <div className="mt-12 pt-8 border-t border-gray-800/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">{t('stat1')}</div>
                  <div className="text-xs text-gray-400 mt-1">Dambulla, Meegoda, Manning...</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">{t('stat2')}</div>
                  <div className="text-xs text-gray-400 mt-1">Holt-Winters Time Series</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-400">{t('stat3')}</div>
                  <div className="text-xs text-gray-400 mt-1">Escrow Direct Farmer Trade</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commodity Price Dashboard Section */}
        <PriceDashboard />

        {/* Farmer-Buyer Direct Marketplace Section */}
        <MarketplaceListings />
      </main>

      {/* Modal for posting new crop inventory */}
      <FarmerListingModal
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
