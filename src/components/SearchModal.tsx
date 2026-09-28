import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bookmark, BookmarkCheck } from 'lucide-react';
import { ALL_SEARCHABLE_ASSETS } from '../data/marketData.ts';
import { SearchResultItem } from '../types/market.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: SearchResultItem) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string, name: string, type: string, price: number, chg: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  watchlistSymbols,
  onToggleWatchlist,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'crypto' | 'index' | 'forex' | 'commodity'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = ALL_SEARCHABLE_ASSETS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.exchange.toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'stock', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'index', label: 'Indices' },
    { id: 'forex', label: 'Forex' },
    { id: 'commodity', label: 'Futures' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E0E3EB] gap-3">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, currency or crypto..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#131722] placeholder-[#787B86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787B86] hover:text-[#131722] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]"
          >
            ESC
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#E0E3EB] bg-[#F8F9FD] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#131722] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-[#F0F3FA]">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-[#787B86] text-sm">
              No matching symbols found for "{query}".
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPos = asset.changePercent >= 0;
              const isWatched = watchlistSymbols.includes(asset.symbol);

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FD] cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ebedfa] flex items-center justify-center font-bold text-xs text-[#131722]">
                      {asset.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-[#F0F3FA] text-[#787B86] rounded">
                          {asset.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-[220px] sm:max-w-xs">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="font-bold text-sm text-[#131722]">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(
                          asset.symbol,
                          asset.name,
                          asset.type,
                          asset.price,
                          asset.changePercent
                        );
                      }}
                      className="p-1.5 rounded-full hover:bg-[#ebedfa] text-[#787B86] hover:text-[#2962ff] transition-colors"
                      title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      {isWatched ? (
                        <BookmarkCheck className="w-4 h-4 text-[#2962ff]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
