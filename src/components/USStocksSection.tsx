import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { StockMover } from '../types/market.ts';

interface USStocksSectionProps {
  highestVolume: StockMover[];
  mostVolatile: StockMover[];
  topGainers: StockMover[];
  onSelectStock: (stock: StockMover) => void;
}

export const USStocksSection: React.FC<USStocksSectionProps> = ({
  highestVolume,
  mostVolatile,
  topGainers,
  onSelectStock,
}) => {
  const [sessionMode, setSessionMode] = useState<'regular' | 'premarket'>('regular');
  const [selectedTickerFilter, setSelectedTickerFilter] = useState<string | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);

  const quickTickers = ['NVDA', 'AAPL', 'AMZN', 'GOOGL', 'TSLA'];

  // Apply slight variation when in pre-market mode
  const transformItem = (item: StockMover) => {
    if (sessionMode === 'premarket') {
      const pmFactor = (item.symbol.charCodeAt(0) % 5) * 0.15;
      const pmChg = item.isPositive ? item.changePercent + pmFactor : item.changePercent - pmFactor;
      const pmPrice = item.price * (1 + pmFactor / 100);
      return {
        ...item,
        price: parseFloat(pmPrice.toFixed(2)),
        changePercent: parseFloat(pmChg.toFixed(2)),
        isPositive: pmChg >= 0,
      };
    }
    return item;
  };

  const renderStockList = (items: StockMover[]) => {
    const list = selectedTickerFilter
      ? items.filter((i) => i.symbol === selectedTickerFilter || items.indexOf(i) < 4)
      : items.slice(0, 4);

    return (
      <div className="flex flex-col space-y-1.5 font-mono">
        {list.map((item) => {
          const transformed = transformItem(item);
          const isPos = transformed.isPositive;

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectStock(transformed)}
              className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] font-sans shrink-0 shadow-xs"
                  style={{
                    backgroundColor: item.avatarBg || '#ebedfa',
                    color: item.avatarText || '#131722',
                  }}
                >
                  {item.symbol.slice(0, 4)}
                </div>
                <div>
                  <div className="font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors font-sans">
                    {item.name}
                  </div>
                  <div className="text-[#787B86] text-xs font-sans">{item.subtext}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-[#131722] text-sm">
                  ${transformed.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    isPos ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {transformed.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pb-14" id="us-stocks">
      {/* Header with Title, Quick Tickers & Session Hours Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href="#us-stocks"
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1 tracking-tight"
          >
            <span>US stocks</span>
            <ChevronRight className="w-5 h-5 text-[#787B86]" />
          </a>

          {/* Quick Ticker Filter Pills */}
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
            {quickTickers.map((ticker) => {
              const isSelected = selectedTickerFilter === ticker;
              return (
                <button
                  key={ticker}
                  onClick={() => setSelectedTickerFilter(isSelected ? null : ticker)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#131722] text-white shadow-xs'
                      : 'bg-[#F0F3FA] hover:bg-[#ebedfa] text-[#131722]'
                  }`}
                >
                  {ticker}
                </button>
              );
            })}
          </div>
        </div>

        {/* Regular Hours vs Pre-Market Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#F0F3FA] p-1 rounded-full text-xs">
          <button
            onClick={() => setSessionMode('regular')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer font-semibold ${
              sessionMode === 'regular'
                ? 'bg-white text-[#131722] shadow-xs'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Regular hours
          </button>
          <button
            onClick={() => setSessionMode('premarket')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer font-semibold ${
              sessionMode === 'premarket'
                ? 'bg-[#131722] text-white shadow-xs'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Pre-market
          </button>
        </div>
      </div>

      {/* 3-Column Movers Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Highest Volume Stocks */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E3EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#131722]">Highest volume</h4>
            <button
              onClick={() => setModalCategory('Highest volume')}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>
          {renderStockList(highestVolume)}
        </div>

        {/* Most Volatile Stocks */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E3EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#131722]">Most volatile</h4>
            <button
              onClick={() => setModalCategory('Most volatile')}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>
          {renderStockList(mostVolatile)}
        </div>

        {/* Top Gainers Spotlight */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E3EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-[#131722]">Top Gainers</h4>
            <button
              onClick={() => setModalCategory('Top Gainers')}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>
          {renderStockList(topGainers)}
        </div>
      </div>

      {/* "See All" Category Modal Drawer */}
      {modalCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E0E3EB]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#131722]">{modalCategory} - Full List</h3>
              <button
                onClick={() => setModalCategory(null)}
                className="text-sm font-semibold text-[#787B86] hover:text-[#131722] px-2 py-1 rounded-md"
              >
                Close
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {(modalCategory === 'Highest volume'
                ? highestVolume
                : modalCategory === 'Most volatile'
                ? mostVolatile
                : topGainers
              ).map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.symbol}
                    onClick={() => {
                      onSelectStock(stock);
                      setModalCategory(null);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FD] cursor-pointer border border-[#F0F3FA] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#ebedfa] flex items-center justify-center font-bold text-xs text-[#131722]">
                        {stock.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] text-sm">{stock.name}</div>
                        <div className="text-[#787B86] text-xs">{stock.subtext}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-[#131722] text-sm">
                        ${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
