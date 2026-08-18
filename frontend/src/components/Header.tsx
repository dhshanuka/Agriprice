'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Sprout, TrendingUp, ShoppingBag, Globe, PlusCircle, UserCheck, LogIn, LogOut, User } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  locale: string;
  onOpenListingModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ locale, onOpenListingModal }) => {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('agriprice_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        // ignore error
      }
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    localStorage.removeItem('agriprice_token');
    localStorage.removeItem('agriprice_user');
    setCurrentUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-green-400 bg-clip-text text-transparent">
                  AgriPrice SL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <a href="#dashboard" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t('dashboard')}
            </a>
            <a href="#marketplace" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {t('marketplace')}
            </a>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            {/* Post Crop Listing Button */}
            <button
              onClick={onOpenListingModal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-all shadow-md shadow-emerald-950 hover:shadow-emerald-800"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postListing')}</span>
            </button>

            {/* User Auth Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-gray-900/80 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-xs text-gray-200">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-gray-900 hover:bg-rose-950/80 text-gray-400 hover:text-rose-300 rounded-lg border border-gray-800 hover:border-rose-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Login</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-gray-900/90 border border-gray-800 rounded-lg px-2 py-1.5">
              <Globe className="w-4 h-4 text-gray-400" />
              <select
                value={locale}
                onChange={handleLanguageChange}
                className="bg-transparent text-xs text-gray-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-gray-900 text-white">EN</option>
                <option value="si" className="bg-gray-900 text-white">SI</option>
                <option value="ta" className="bg-gray-900 text-white">TA</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </>
  );
};
