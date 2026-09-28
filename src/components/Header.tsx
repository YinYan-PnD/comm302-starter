import React, { useState } from 'react';
import { Search, Globe, Bookmark, User, ChevronDown, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenAccount: () => void;
  watchlistCount: number;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  onOpenAccount,
  watchlistCount,
  activeNav,
  setActiveNav,
  currentLang,
  onChangeLang,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  const navItems = [
    { id: 'products', label: 'Products' },
    { id: 'community', label: 'Community' },
    { id: 'markets', label: 'Markets' },
    { id: 'brokers', label: 'Brokers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFFFFF] border-b border-[#E0E3EB] shadow-[0_1px_8px_rgba(19,23,34,0.03)]">
      <div className="h-16 max-w-[1320px] mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Left: TV Logo + Search Trigger + Nav Links */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => {
              setActiveNav('markets');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 select-none cursor-pointer group focus:outline-none"
            aria-label="TradingView Home"
          >
            <div className="w-9 h-9 bg-[#131722] rounded flex items-center justify-center transition-transform duration-150 group-hover:scale-105 shadow-sm">
              <span className="text-white text-base font-bold tracking-tighter font-sans">TV</span>
            </div>
          </button>

          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            type="button"
            className="hidden md:flex items-center h-9 px-3 bg-[#F0F3FA] hover:bg-[#ebedfa] rounded-full text-[#787B86] hover:text-[#131722] cursor-pointer transition-colors gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2962ff]/30"
          >
            <Search className="w-4 h-4 text-[#787B86]" />
            <span className="text-xs text-[#787B86] pr-2">Search markets, stocks, crypto</span>
            <kbd className="px-1.5 py-0.5 text-[11px] font-medium text-[#787B86] bg-white rounded border border-[#E0E3EB] shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Primary Navigation */}
          <nav className="relative hidden lg:flex items-center h-16 space-x-1">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative flex items-center h-full px-3 text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#2962ff] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2962ff]'
                      : 'text-[#787B86] hover:text-[#131722] font-semibold'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                onBlur={() => setTimeout(() => setMoreMenuOpen(false), 200)}
                className={`relative flex items-center gap-1 h-full px-3 text-sm font-semibold transition-colors cursor-pointer ${
                  moreMenuOpen ? 'text-[#131722]' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                More
                <ChevronDown className="w-3.5 h-3.5 text-[#787B86]" />
              </button>
              {moreMenuOpen && (
                <div className="absolute top-12 left-0 w-48 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a href="#economy" className="block px-4 py-2 text-xs font-medium text-[#131722] hover:bg-[#F8F9FD]">
                    Economic Calendar
                  </a>
                  <a href="#futures" className="block px-4 py-2 text-xs font-medium text-[#131722] hover:bg-[#F8F9FD]">
                    Futures & Commodities
                  </a>
                  <a href="#forex" className="block px-4 py-2 text-xs font-medium text-[#131722] hover:bg-[#F8F9FD]">
                    Forex Currencies
                  </a>
                  <div className="h-px bg-[#E0E3EB] my-1" />
                  <a href="#bonds" className="block px-4 py-2 text-xs font-medium text-[#131722] hover:bg-[#F8F9FD]">
                    Government Bonds
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0F3FA] text-[#787B86] transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition-colors"
            title="Your Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] text-xs font-semibold transition-colors"
              type="button"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-10 w-40 bg-white border border-[#E0E3EB] rounded-xl shadow-lg py-1 z-50 animate-in fade-in duration-100">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left text-[#131722] hover:bg-[#F8F9FD] transition-colors"
                  >
                    <span>{l.name}</span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Paper Trading Profile Button */}
          <button
            onClick={onOpenAccount}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition-colors"
            title="Account & Paper Trading"
            type="button"
          >
            <User className="w-4 h-4" />
          </button>

          {/* "Get started" CTA Button */}
          <button
            onClick={onOpenAccount}
            className="inline-flex items-center justify-center h-9 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#2962ff] via-[#0049db] to-[#5b32e6] hover:opacity-95 shadow-xs transition-opacity cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>

          {/* Mini Avatar */}
          <div
            onClick={onOpenAccount}
            className="w-8 h-8 rounded-full bg-[#0049db] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#2962ff]/40 transition-all"
            title="User Profile"
          >
            <span className="text-white text-xs font-bold">TV</span>
          </div>
        </div>
      </div>
    </header>
  );
};
