import React from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/request';
import '../globals.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AgriPrice SL - Sri Lanka Crop Price Forecasting & Direct Farmer-Buyer Marketplace',
  description:
    'Real-time daily wholesale prices for Sri Lankan Special Economic Centres (Dambulla, Meegoda, Pettah), AI time-series price forecasts, and escrow-protected direct trade.',
  keywords: ['Sri Lanka Agriculture', 'HARTI prices', 'Dambulla market', 'Crop price forecasting', 'AgriPrice SL', 'Farmer marketplace'],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = useMessages();

  return (
    <html lang={locale} className="dark scroll-smooth">
      <body className="bg-[#090d16] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
