import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface HeroSwitcherProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  currentScope: string;
  onSelectScope: (scope: string) => void;
}

export const HeroSwitcher: React.FC<HeroSwitcherProps> = ({
  activeCategory,
  onSelectCategory,
  currentScope,
  onSelectScope,
}) => {
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);

  const categories = [
    { id: 'indices', label: 'Indices' },
    { id: 'us-stocks', label: 'US stocks' },
    { id: 'world-stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Government bonds' },
    { id: 'corp-bonds', label: 'Corporate bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  const scopes = [
    { id: 'Markets, everywhere', desc: 'All Global Assets' },
    { id: 'US Markets', desc: 'Wall Street & Tech Leaders' },
    { id: 'World Stocks', desc: 'Europe, Asia & Emerging' },
    { id: 'Crypto & Digital Assets', desc: 'Bitcoin, DeFi & Layer 1s' },
    { id: 'Futures & Forex', desc: 'Commodities, Currencies & Energy' },
  ];

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pt-10 pb-4">
      {/* Markets Header with Dropdown Switcher */}
      <div className="relative inline-block mb-6">
        <button
          onClick={() => setScopeDropdownOpen(!scopeDropdownOpen)}
          onBlur={() => setTimeout(() => setScopeDropdownOpen(false), 200)}
          className="flex items-center justify-start gap-2.5 cursor-pointer select-none group text-left focus:outline-none"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[60px] text-[#131722] tracking-tight font-extrabold flex items-center gap-2.5">
            {currentScope}
            <ChevronDown
              className={`w-7 h-7 sm:w-9 sm:h-9 text-[#131722] transition-transform duration-200 ${
                scopeDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
            />
          </h1>
        </button>

        {scopeDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#E0E3EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
              Select Market View
            </div>
            {scopes.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectScope(s.id);
                  setScopeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  currentScope === s.id ? 'bg-[#F0F3FA] text-[#2962ff]' : 'hover:bg-[#F8F9FD] text-[#131722]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{s.id}</div>
                  <div className="text-xs text-[#787B86]">{s.desc}</div>
                </div>
                {currentScope === s.id && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Pill Strip (Segmented Navigation) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center bg-[#F0F3FA] p-1 rounded-full shadow-xs shrink-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
