import React from 'react';
import { X, Trash2, ArrowUpRight, Bookmark } from 'lucide-react';
import { WatchlistItem } from '../types/market.ts';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistItem[];
  onRemoveItem: (symbol: string) => void;
  onSelectAsset: (item: WatchlistItem) => void;
  onClearAll: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveItem,
  onSelectAsset,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E0E3EB] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#E0E3EB] flex items-center justify-between bg-[#F8F9FD]">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#2962ff]" />
              <h3 className="text-lg font-bold text-[#131722]">My Watchlist</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ebedfa] text-[#2962ff] font-bold">
                {watchlist.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#ebedfa] text-[#787B86] hover:text-[#131722] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {watchlist.length === 0 ? (
              <div className="py-16 text-center text-[#787B86] flex flex-col items-center justify-center">
                <Bookmark className="w-12 h-12 text-[#E0E3EB] mb-3 stroke-[1.5]" />
                <p className="font-semibold text-sm text-[#131722] mb-1">Your watchlist is empty</p>
                <p className="text-xs max-w-xs text-[#787B86]">
                  Click the bookmark icon on any index, stock, crypto coin, or currency pair to monitor it live.
                </p>
              </div>
            ) : (
              watchlist.map((item) => {
                const isPos = item.changePercent >= 0;

                return (
                  <div
                    key={item.symbol}
                    onClick={() => {
                      onSelectAsset(item);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E0E3EB] hover:bg-[#F8F9FD] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#ebedfa] flex items-center justify-center font-bold text-xs text-[#131722]">
                        {item.symbol.slice(0, 4)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                          <span>{item.symbol}</span>
                          <span className="text-[10px] uppercase font-bold text-[#787B86] bg-[#F0F3FA] px-1.5 py-0.5 rounded">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-[#787B86] truncate max-w-[150px]">
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className="font-bold text-sm text-[#131722]">
                          ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item.symbol);
                        }}
                        className="p-1 text-[#787B86] hover:text-[#F23645] transition-colors opacity-70 hover:opacity-100"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {watchlist.length > 0 && (
            <div className="p-4 border-t border-[#E0E3EB] bg-[#F8F9FD] flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-[#F23645] hover:underline"
              >
                Clear all watchlist
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#131722] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
