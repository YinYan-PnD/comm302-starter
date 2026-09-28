import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { CryptoCoin, CryptoGainer, CryptoTVL } from '../types/market.ts';

interface CryptoSectionProps {
  topCoins: CryptoCoin[];
  gainers: CryptoGainer[];
  tvlList: CryptoTVL[];
  onSelectCoin: (coin: { symbol: string; name: string; price: number; changePercent: number }) => void;
}

export const CryptoSection: React.FC<CryptoSectionProps> = ({
  topCoins,
  gainers,
  tvlList,
  onSelectCoin,
}) => {
  const [showAllCoinsModal, setShowAllCoinsModal] = useState(false);

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pb-14" id="crypto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <a
          href="#crypto"
          className="text-lg sm:text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1 tracking-tight"
        >
          <span>Crypto</span>
          <ChevronRight className="w-5 h-5 text-[#787B86]" />
        </a>
        <button
          onClick={() => setShowAllCoinsModal(true)}
          className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:underline cursor-pointer"
        >
          See all coins
        </button>
      </div>

      {/* Top Coins Live Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {topCoins.slice(0, 5).map((coin) => {
          const isPos = coin.changePercent >= 0;

          return (
            <div
              key={coin.symbol}
              onClick={() => onSelectCoin(coin)}
              className="bg-white p-3.5 rounded-2xl border border-[#E0E3EB] shadow-xs hover:bg-[#F8F9FD] hover:border-[#c3c5d8] cursor-pointer transition-all duration-150 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-[10px] font-sans shrink-0 shadow-xs"
                  style={{ backgroundColor: coin.color }}
                >
                  {coin.symbolGlyph}
                </div>
                <span className="font-bold text-xs sm:text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors truncate">
                  {coin.name}
                </span>
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-[#131722]">
                ${coin.price.toLocaleString('en-US', { minimumFractionDigits: coin.price < 2 ? 2 : 2 })}
              </div>
              <div
                className={`text-xs font-mono font-semibold mt-0.5 ${
                  isPos ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPos ? '+' : ''}
                {coin.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Crypto Gainers & TVL Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Crypto Gainers (24h) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0E3EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#131722]">Crypto Gainers (24h)</h4>
            <span className="text-xs text-[#787B86] font-medium">Top daily performers</span>
          </div>
          <div className="space-y-2 font-mono">
            {gainers.map((g) => (
              <div
                key={g.symbol}
                onClick={() => onSelectCoin(g)}
                className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-[#F8F9FD] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#ebedfa] flex items-center justify-center text-[10px] font-bold font-sans text-[#131722]">
                    {g.symbol}
                  </span>
                  <span className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors font-sans">
                    {g.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#131722] font-bold text-sm">
                    ${g.price < 1 ? g.price.toFixed(3) : g.price.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4F1] text-[#089981] font-bold text-xs">
                    +{g.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Total Value Locked (TVL) */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0E3EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#131722]">Highest Total Value Locked (TVL)</h4>
            <span className="text-xs text-[#787B86] font-medium">DeFi Protocol Ranking</span>
          </div>
          <div className="space-y-2 font-mono">
            {tvlList.map((tvl) => (
              <div
                key={tvl.symbol}
                onClick={() =>
                  onSelectCoin({
                    symbol: tvl.symbol,
                    name: tvl.name,
                    price: 24.5,
                    changePercent: tvl.changePercent,
                  })
                }
                className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-[#F8F9FD] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#ebedfa] flex items-center justify-center text-[10px] font-bold font-sans text-[#131722]">
                    {tvl.symbol}
                  </span>
                  <span className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors font-sans">
                    {tvl.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#787B86] text-xs font-sans">TVL {tvl.tvl}</span>
                  <span
                    className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      tvl.changePercent >= 0
                        ? 'bg-[#E6F4F1] text-[#089981]'
                        : 'bg-[#FDEBED] text-[#F23645]'
                    }`}
                  >
                    {tvl.changePercent >= 0 ? '+' : ''}
                    {tvl.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* See All Coins Modal */}
      {showAllCoinsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E0E3EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#131722]">Top Cryptocurrencies</h3>
              <button
                onClick={() => setShowAllCoinsModal(false)}
                className="text-sm font-semibold text-[#787B86] hover:text-[#131722] px-2 py-1 rounded-md"
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {topCoins.map((coin) => (
                <div
                  key={coin.symbol}
                  onClick={() => {
                    onSelectCoin(coin);
                    setShowAllCoinsModal(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FD] cursor-pointer border border-[#F0F3FA] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: coin.color }}
                    >
                      {coin.symbolGlyph}
                    </div>
                    <div>
                      <div className="font-bold text-[#131722] text-sm">{coin.name}</div>
                      <div className="text-xs text-[#787B86]">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-[#131722] text-sm">
                      ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        coin.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {coin.changePercent >= 0 ? '+' : ''}
                      {coin.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
