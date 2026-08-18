'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sprout, ShieldCheck, Database, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 text-gray-400 py-12 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Sprout className="w-6 h-6 text-emerald-400" />
            <span>AgriPrice SL</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI-driven agricultural price intelligence & escrow direct trade platform tailored for Sri Lanka.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Protected Platform</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Economic Centers
          </h4>
          <ul className="text-xs space-y-2 text-gray-400">
            <li>Dambulla Special Economic Centre</li>
            <li>Meegoda Dedicated Economic Centre</li>
            <li>Manning Market (Peliyagoda)</li>
            <li>Keppetipola Economic Centre</li>
            <li>Nuwara Eliya Economic Centre</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-3 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-amber-400" />
            Key Commodities
          </h4>
          <ul className="text-xs space-y-2 text-gray-400">
            <li>Highland Vegetables (Carrot, Leeks)</li>
            <li>Lowland Produce (Tomato, Brinjal)</li>
            <li>Essential Spices & Chilli</li>
            <li>Big Onion (Dambulla Harvest)</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200">Official Ingestion Sync</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('disclaimer')}
          </p>
          <div className="pt-2 text-[11px] text-gray-500">
            Node.js ML Pipeline • Redis 1h Cache • Next.js Standalone
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-900 text-center text-xs text-gray-500">
        © 2026 AgriPrice SL. {t('rights')}
      </div>
    </footer>
  );
};
