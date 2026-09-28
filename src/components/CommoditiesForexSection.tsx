import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CommodityItem, ForexItem } from '../types/market.ts';

interface CommoditiesForexSectionProps {
  commodities: CommodityItem[];
  forex: ForexItem[];
  onSelectCommodity: (item: CommodityItem) => void;
  onSelectForex: (item: ForexItem) => void;
}

export const CommoditiesForexSection: React.FC<CommoditiesForexSectionProps> = ({
  commodities,
  forex,
  onSelectCommodity,
  onSelectForex,
}) => {
  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pb-16" id="futures">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Commodities & Futures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <a
              href="#futures"
              className="text-lg sm:text-xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1 tracking-tight"
            >
              <span>Commodities & Futures</span>
              <ChevronRight className="w-5 h-5 text-[#787B86]" />
            </a>
            <button
              onClick={() => onSelectCommodity(commodities[0])}
              className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E0E3EB] shadow-xs space-y-1 font-mono">
            {commodities.map((item) => {
              const isPos = item.changePercent >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => onSelectCommodity(item)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F8F9FD] cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors font-sans">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#787B86] font-sans">{item.exchange}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#131722] text-sm">
                      {item.price.toLocaleString('en-US', {
                        minimumFractionDigits: item.price < 10 ? 3 : 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forex & Currencies */}
        <div id="forex">
          <div className="flex items-center justify-between mb-4">
            <a
              href="#forex"
              className="text-lg sm:text-xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1 tracking-tight"
            >
              <span>Forex & Currencies</span>
              <ChevronRight className="w-5 h-5 text-[#787B86]" />
            </a>
            <button
              onClick={() => onSelectForex(forex[0])}
              className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              See all pairs
            </button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E0E3EB] shadow-xs space-y-1 font-mono">
            {forex.map((item) => {
              const isPos = item.changePercent >= 0;

              return (
                <div
                  key={item.pair}
                  onClick={() => onSelectForex(item)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F8F9FD] cursor-pointer transition-colors group"
                >
                  <div>
                    <div className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors font-sans">
                      {item.pair}
                    </div>
                    <div className="text-xs text-[#787B86] font-sans">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#131722] text-sm">
                      {item.rate.toFixed(4)}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
