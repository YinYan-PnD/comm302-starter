import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ArrowUpDown, Bookmark, BookmarkCheck } from 'lucide-react';
import { WorldIndex } from '../types/market.ts';

interface WorldIndicesTableProps {
  indices: WorldIndex[];
  onSelectIndexRow: (index: WorldIndex) => void;
  watchlistSymbols: string[];
  onToggleWatchlist: (symbol: string, name: string, type: string, price: number, chg: number) => void;
}

type SortField = 'symbol' | 'last' | 'chgPercent' | 'chg';
type SortOrder = 'asc' | 'desc';

export const WorldIndicesTable: React.FC<WorldIndicesTableProps> = ({
  indices,
  onSelectIndexRow,
  watchlistSymbols,
  onToggleWatchlist,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Americas' | 'Europe' | 'Asia-Pacific'>('All');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filtered = indices.filter(
    (item) => selectedRegion === 'All' || item.region === selectedRegion
  );

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'symbol') {
      comparison = a.symbol.localeCompare(b.symbol);
    } else if (sortField === 'last') {
      comparison = a.last - b.last;
    } else if (sortField === 'chgPercent') {
      comparison = a.chgPercent - b.chgPercent;
    } else if (sortField === 'chg') {
      comparison = a.chg - b.chg;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pb-14" id="world-stocks">
      {/* Title & See all link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <a
            href="#world-stocks"
            className="text-lg sm:text-xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors flex items-center gap-1"
          >
            <span>World indices</span>
            <ChevronRight className="w-5 h-5 text-[#787B86]" />
          </a>

          {/* Region Tabs */}
          <div className="hidden sm:flex items-center bg-[#F0F3FA] p-0.5 rounded-full ml-3 text-xs font-semibold">
            {(['All', 'Europe', 'Asia-Pacific', 'Americas'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-white text-[#131722] shadow-xs font-bold'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSelectedRegion('All')}
          className="text-xs sm:text-sm font-semibold text-[#2962ff] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>See all major indices</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* World Indices Table */}
      <div className="w-full overflow-x-auto bg-white rounded-2xl border border-[#E0E3EB] shadow-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-[#787B86] text-xs uppercase bg-[#F0F3FA] border-b border-[#E0E3EB] select-none">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-[#131722]"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th
                onClick={() => handleSort('last')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('chgPercent')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg %</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('chg')}
                className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#131722]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg</span>
                  <ArrowUpDown className="w-3 h-3 text-[#787B86]" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-center w-36">Past 7 days</th>
              <th className="py-3 px-3 w-10 text-center"></th>
            </tr>
          </thead>

          <tbody className="font-mono text-sm divide-y divide-[#F0F3FA]">
            {sorted.map((item) => {
              const isPos = item.chgPercent >= 0;
              const strokeColor = isPos ? '#089981' : '#F23645';
              const isWatched = watchlistSymbols.includes(item.symbol);

              // Build smooth SVG sparkline path
              const pts = item.sparkline;
              const minVal = Math.min(...pts);
              const maxVal = Math.max(...pts);
              const range = maxVal - minVal || 1;
              const w = 100;
              const h = 24;

              const sparkCoords = pts.map((val, idx) => ({
                x: (idx / (pts.length - 1)) * (w - 6) + 3,
                y: h - 4 - ((val - minVal) / range) * (h - 8),
              }));

              let sparkPath = `M ${sparkCoords[0].x} ${sparkCoords[0].y}`;
              for (let i = 1; i < sparkCoords.length; i++) {
                const prev = sparkCoords[i - 1];
                const curr = sparkCoords[i];
                const midX = (prev.x + curr.x) / 2;
                sparkPath += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
              }

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectIndexRow(item)}
                  className="hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
                >
                  {/* Symbol with Country Tag */}
                  <td className="py-3.5 px-4 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#ebedfa] flex items-center justify-center text-[10px] font-bold text-[#131722] shrink-0 font-sans">
                      {item.countryCode}
                    </span>
                    <span className="font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="py-3.5 px-4 text-[#787B86] font-sans font-medium text-xs sm:text-sm">
                    {item.name}
                  </td>

                  {/* Last Price */}
                  <td className="py-3.5 px-4 text-right font-bold text-[#131722]">
                    {item.last.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Chg % */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {item.chgPercent.toFixed(2)}%
                  </td>

                  {/* Chg */}
                  <td
                    className={`py-3.5 px-4 text-right font-medium ${
                      isPos ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {item.chg.toFixed(2)}
                  </td>

                  {/* Past 7 days Sparkline */}
                  <td className="py-3.5 px-4">
                    <svg className="w-28 h-6 mx-auto overflow-visible" fill="none" viewBox={`0 0 ${w} ${h}`}>
                      <path
                        d={sparkPath}
                        stroke={strokeColor}
                        strokeLinecap="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </td>

                  {/* Watchlist Star */}
                  <td
                    className="py-3.5 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.symbol, item.name, 'index', item.last, item.chgPercent);
                    }}
                  >
                    <button
                      className="text-[#787B86] hover:text-[#2962ff] transition-colors p-1"
                      title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      type="button"
                    >
                      {isWatched ? (
                        <BookmarkCheck className="w-4 h-4 text-[#2962ff]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
