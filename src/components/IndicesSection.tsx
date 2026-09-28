import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { IndexItem, Timeframe, ChartPoint } from '../types/market.ts';

interface IndicesSectionProps {
  indices: IndexItem[];
  selectedIndex: IndexItem;
  onSelectIndex: (index: IndexItem) => void;
  onLaunchFullChart: (index: IndexItem) => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  selectedIndex,
  onSelectIndex,
  onLaunchFullChart,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1W');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const activeTfData = selectedIndex.timeframes[timeframe] || selectedIndex.timeframes['1D'];
  const points = activeTfData.points;
  const isPositive = activeTfData.changePercent >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  // SVG Chart Calculations
  const minPrice = Math.min(...points.map((p) => p.price));
  const maxPrice = Math.max(...points.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;
  const width = 1000;
  const height = 160;
  const paddingY = 20;

  // Convert points to SVG coordinates
  const coords = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - paddingY - ((p.price - minPrice) / priceRange) * (height - 2 * paddingY);
    return { x, y, point: p };
  });

  // Construct SVG Path (smooth bezier approximation or polyline)
  let linePath = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const midX = (prev.x + curr.x) / 2;
    linePath += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const pointIdx = Math.round(ratio * (points.length - 1));
    const targetPoint = points[pointIdx];
    if (targetPoint) {
      setHoveredPoint(targetPoint);
      setHoverPosition({
        x: coords[pointIdx].x,
        y: coords[pointIdx].y,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverPosition(null);
  };

  const timeframesList: Timeframe[] = ['1D', '1W', '1M', '1Y', '5Y', 'All'];

  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 md:px-6 pt-2 pb-12" id="indices">
      {/* Header with Title and Scroll Arrows */}
      <div className="flex items-center justify-between mb-4">
        <a
          href="#indices"
          className="inline-flex items-center gap-1 text-xl sm:text-2xl text-[#131722] hover:text-[#2962ff] transition-colors group font-bold tracking-tight"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 text-[#787B86] group-hover:text-[#2962ff] transition-colors" />
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-8 h-8 rounded-full bg-[#F0F3FA] hover:bg-[#ebedfa] flex items-center justify-center text-[#787B86] hover:text-[#131722] transition-colors cursor-pointer"
            type="button"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="w-8 h-8 rounded-full bg-[#F0F3FA] hover:bg-[#ebedfa] flex items-center justify-center text-[#787B86] hover:text-[#131722] transition-colors cursor-pointer"
            type="button"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Index Pill Cards Strip */}
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[180px] sm:auto-cols-[190px] lg:grid-flow-row lg:grid-cols-6 gap-3 mb-6 overflow-x-auto no-scrollbar py-1"
      >
        {indices.map((idx) => {
          const isSelected = selectedIndex.id === idx.id;
          const isPos = idx.changePercent >= 0;
          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-150 select-none border ${
                isSelected
                  ? 'bg-[#F8F9FD] border-[#2962ff]/40 shadow-xs ring-1 ring-[#2962ff]/20'
                  : 'bg-white border-[#E0E3EB] hover:bg-[#F8F9FD] hover:border-[#c3c5d8]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold font-mono shrink-0 shadow-xs"
                  style={{
                    backgroundColor: idx.badgeColor,
                    color: idx.badgeColor === '#e0e2ee' ? '#131722' : '#ffffff',
                  }}
                >
                  {idx.badge}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#131722] truncate">
                  {idx.symbol}
                </div>
              </div>

              <div className="font-mono text-sm sm:text-base font-bold text-[#131722] tracking-tight">
                {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs">
                <span className={`font-semibold ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {isPos ? '+' : ''}
                  {idx.changePercent.toFixed(2)}%
                </span>
                <span className="text-[#787B86]">
                  {isPos ? '+' : ''}
                  {idx.change.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Index Interactive Showcase Panel */}
      <div className="bg-[#F8F9FD] rounded-3xl p-5 sm:p-7 border border-[#E0E3EB] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-bold text-sm sm:text-base font-mono shadow-xs shrink-0"
              style={{
                backgroundColor: selectedIndex.badgeColor,
                color: selectedIndex.badgeColor === '#e0e2ee' ? '#131722' : '#ffffff',
              }}
            >
              {selectedIndex.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#131722] tracking-tight">
                  {selectedIndex.symbol}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#ebedfa] text-[#787B86] uppercase tracking-wide">
                  {selectedIndex.exchange}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#131722] tracking-tight">
                  {hoveredPoint ? hoveredPoint.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : selectedIndex.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 font-mono text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full ${
                    isPositive ? 'bg-[#E6F4F1] text-[#089981]' : 'bg-[#FDEBED] text-[#F23645]'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {isPositive ? '+' : ''}
                  {activeTfData.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {activeTfData.changePercent.toFixed(2)}%)
                </span>
                {hoveredPoint && (
                  <span className="text-xs text-[#787B86] font-medium hidden sm:inline">
                    · {hoveredPoint.time}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Switcher */}
            <div className="flex items-center bg-[#ebedfa] p-1 rounded-full text-xs font-semibold">
              {timeframesList.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-[#131722] shadow-xs font-bold'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Launch Full Chart View Button */}
            <button
              onClick={() => onLaunchFullChart(selectedIndex)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#2962ff] hover:bg-[#0049db] shadow-xs transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Launch full chart view</span>
            </button>
          </div>
        </div>

        {/* Realtime Vector SVG Interactive Micro Chart */}
        <div className="w-full relative flex flex-col justify-end pt-2">
          <div className="w-full h-44 relative">
            <svg
              className="w-full h-full overflow-visible cursor-crosshair"
              preserveAspectRatio="none"
              viewBox={`0 0 ${width} ${height}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id={`gradient-${selectedIndex.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Area Under Curve */}
              <path d={areaPath} fill={`url(#gradient-${selectedIndex.id})`} />

              {/* Stroke Curve */}
              <path
                d={linePath}
                fill="none"
                stroke={strokeColor}
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* End Point Pulsing Dot */}
              {!hoverPosition && (
                <circle
                  cx={coords[coords.length - 1].x}
                  cy={coords[coords.length - 1].y}
                  fill={strokeColor}
                  r="4.5"
                  className="animate-pulse"
                />
              )}

              {/* Interactive Crosshair & Hover Dot */}
              {hoverPosition && (
                <>
                  <line
                    x1={hoverPosition.x}
                    y1={0}
                    x2={hoverPosition.x}
                    y2={height}
                    stroke="#787B86"
                    strokeDasharray="3 3"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={hoverPosition.x}
                    cy={hoverPosition.y}
                    fill={strokeColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    r="5"
                  />
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && hoverPosition && (
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2 bg-[#131722] text-white text-[11px] font-mono py-1 px-2.5 rounded-lg shadow-lg z-20 flex items-center gap-2 whitespace-nowrap"
                style={{
                  left: `${(hoverPosition.x / width) * 100}%`,
                  top: `${(hoverPosition.y / height) * 100}%`,
                }}
              >
                <span className="font-bold">${hoveredPoint.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="text-[#c3c5d8]">|</span>
                <span className="text-[#a0a5b8]">{hoveredPoint.time}</span>
              </div>
            )}
          </div>

          {/* Time Axis Labels */}
          <div className="flex items-center justify-between text-xs font-mono text-[#787B86] pt-3 border-t border-[#E0E3EB]/60">
            {points.map((p, i) => {
              // Show about 5 evenly spaced labels
              if (
                i === 0 ||
                i === Math.floor(points.length * 0.25) ||
                i === Math.floor(points.length * 0.5) ||
                i === Math.floor(points.length * 0.75) ||
                i === points.length - 1
              ) {
                return <span key={i}>{p.time}</span>;
              }
              return null;
            })}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-3 border-t border-[#E0E3EB]/60 text-xs">
            <div>
              <span className="text-[#787B86]">Open: </span>
              <span className="font-mono font-bold text-[#131722]">
                ${activeTfData.open.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[#787B86]">High: </span>
              <span className="font-mono font-bold text-[#131722]">
                ${activeTfData.high.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[#787B86]">Low: </span>
              <span className="font-mono font-bold text-[#131722]">
                ${activeTfData.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[#787B86]">Volume: </span>
              <span className="font-mono font-bold text-[#131722]">{activeTfData.volume}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
