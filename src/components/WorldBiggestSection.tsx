import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { CompanyGiant } from '../types/market.ts';

interface WorldBiggestSectionProps {
  companies: CompanyGiant[];
  onSelectCompany: (company: CompanyGiant) => void;
}

export const WorldBiggestSection: React.FC<WorldBiggestSectionProps> = ({
  companies,
  onSelectCompany,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? companies : companies.slice(0, 6);

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pb-14">
      {/* Title & See All Link */}
      <div className="flex items-center justify-between mb-5">
        <a
          href="#world-stocks"
          className="text-lg sm:text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1 tracking-tight"
        >
          <span>World biggest companies</span>
          <ChevronRight className="w-5 h-5 text-[#787B86]" />
        </a>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:underline cursor-pointer"
        >
          {showAll ? 'Show top 6' : 'See all world major companies'}
        </button>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {displayed.map((comp) => {
          const isPos = comp.changePercent >= 0;

          return (
            <div
              key={comp.symbol}
              onClick={() => onSelectCompany(comp)}
              className="bg-white p-4 rounded-2xl border border-[#E0E3EB] shadow-xs hover:bg-[#F8F9FD] hover:border-[#c3c5d8] transition-all duration-150 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ebedfa] flex items-center justify-center font-bold text-xs font-sans text-[#131722] shrink-0 group-hover:scale-105 transition-transform">
                  {comp.symbol.slice(0, 5)}
                </div>
                <div>
                  <div className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors">
                    {comp.name}
                  </div>
                  <div className="text-xs text-[#787B86] mt-0.5">
                    Market Cap {comp.marketCap}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="font-bold text-[#131722] text-sm">
                  ${comp.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isPos ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {comp.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
