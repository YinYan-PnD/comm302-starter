import React, { useState } from 'react';
import {
  X,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  BarChart2,
  LineChart,
  Activity,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { IndexItem, Timeframe, ChartPoint } from '../types/market.ts';

interface FullChartModalProps {
  asset: {
    symbol: string;
    name: string;
    exchange?: string;
    price: number;
    change: number;
    changePercent: number;
    timeframes?: IndexItem['timeframes'];
  };
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onExecuteTrade?: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
}

export const FullChartModal: React.FC<FullChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'candles' | 'area' | 'line'>('candles');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Trade Panel State
  const [shares, setShares] = useState(10);
  const [tradeSuccessToast, setTradeSuccessToast] = useState<string | null>(null);

  // Generate realistic OHLC candlesticks for the active timeframe
  const pointsCount = 28;
  const basePrice = asset.price;

  const candleData = React.useMemo(() => {
    const list: Array<ChartPoint & { sma?: number }> = [];
    let currentClose = basePrice * 0.985;
    const factor = asset.changePercent >= 0 ? 0.001 : -0.0008;

    for (let i = 0; i < pointsCount; i++) {
      const open = currentClose;
      const change = (Math.random() - 0.47) * (basePrice * 0.006) + basePrice * factor;
      const close = Math.max(basePrice * 0.8, open + change);
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.004);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.004);
      const volume = Math.floor(Math.random() * 8000000 + 1500000);

      currentClose = close;
      list.push({
        time: `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || '00'}`,
        price: parseFloat(close.toFixed(2)),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        volume,
      });
    }

    // Ensure last point aligns with asset current price
    list[list.length - 1].price = asset.price;
    list[list.length - 1].high = Math.max(list[list.length - 1].high || asset.price, asset.price * 1.002);

    // Compute simple moving average (SMA 5)
    for (let i = 0; i < list.length; i++) {
      const start = Math.max(0, i - 4);
      const slice = list.slice(start, i + 1);
      const avg = slice.reduce((sum, item) => sum + item.price, 0) / slice.length;
      list[i].sma = parseFloat(avg.toFixed(2));
    }

    return list;
  }, [basePrice, asset.changePercent, timeframe]);

  // Active hover point or default to latest
  const activePoint = hoveredIndex !== null ? candleData[hoveredIndex] : candleData[candleData.length - 1];

  const minVal = Math.min(...candleData.map((d) => d.low ?? d.price));
  const maxVal = Math.max(...candleData.map((d) => d.high ?? d.price));
  const range = maxVal - minVal || 1;
  const maxVolume = Math.max(...candleData.map((d) => d.volume ?? 1));

  const chartWidth = 900;
  const chartHeight = 360;
  const paddingBottom = 70; // area for volume bars
  const priceHeight = chartHeight - paddingBottom - 30;

  const handleOrder = (type: 'BUY' | 'SELL') => {
    if (onExecuteTrade) {
      onExecuteTrade(asset.symbol, type, shares, activePoint.price);
    }
    setTradeSuccessToast(`Simulated Order Filled: ${type} ${shares} shares of ${asset.symbol} @ $${activePoint.price.toFixed(2)}`);
    setTimeout(() => setTradeSuccessToast(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl border border-[#E0E3EB] flex flex-col overflow-hidden max-h-[95vh]">
        {/* Top Bar / Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#E0E3EB] bg-[#F8F9FD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#131722] text-white flex items-center justify-center font-bold text-sm font-sans">
              {asset.symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#131722] font-sans">{asset.symbol}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#ebedfa] text-[#787B86]">
                  {asset.exchange || 'INDEX'}
                </span>
                <span className="text-xs text-[#787B86] font-medium hidden sm:inline">{asset.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 font-mono">
                <span className="text-xl font-extrabold text-[#131722]">
                  ${activePoint.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                    asset.changePercent >= 0 ? 'bg-[#E6F4F1] text-[#089981]' : 'bg-[#FDEBED] text-[#F23645]'
                  }`}
                >
                  {asset.changePercent >= 0 ? '+' : ''}
                  {asset.change.toFixed(2)} ({asset.changePercent >= 0 ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatchlist}
              className="p-2 rounded-full hover:bg-[#ebedfa] text-[#787B86] hover:text-[#2962ff] transition-colors"
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isWatchlisted ? (
                <BookmarkCheck className="w-5 h-5 text-[#2962ff]" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#ebedfa] text-[#787B86] hover:text-[#131722] transition-colors"
              title="Close Full Chart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-white border-b border-[#E0E3EB] text-xs font-semibold">
          {/* Timeframe Buttons */}
          <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded-full">
            {(['1D', '1W', '1M', '1Y', '5Y', 'All'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                  timeframe === tf ? 'bg-white text-[#131722] shadow-xs font-bold' : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F0F3FA] p-0.5 rounded-full">
              <button
                onClick={() => setChartType('candles')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
                  chartType === 'candles' ? 'bg-white text-[#131722] shadow-xs font-bold' : 'text-[#787B86]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
                  chartType === 'area' ? 'bg-white text-[#131722] shadow-xs font-bold' : 'text-[#787B86]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Area</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
                  chartType === 'line' ? 'bg-white text-[#131722] shadow-xs font-bold' : 'text-[#787B86]'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Line</span>
              </button>
            </div>

            {/* Indicator Toggles */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                  showSMA ? 'border-[#F7931A] text-[#F7931A] bg-[#FFF8EE]' : 'border-[#E0E3EB] text-[#787B86]'
                }`}
              >
                SMA 5
              </button>
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-colors ${
                  showVolume ? 'border-[#2962ff] text-[#2962ff] bg-[#F0F3FA]' : 'border-[#E0E3EB] text-[#787B86]'
                }`}
              >
                Volume
              </button>
            </div>
          </div>
        </div>

        {/* OHLCV Readout Banner */}
        <div className="flex flex-wrap items-center gap-4 px-5 py-2 bg-[#FAF9FF] border-b border-[#E0E3EB] text-xs font-mono text-[#787B86]">
          <div>
            <span>Time: </span>
            <span className="font-bold text-[#131722]">{activePoint.time}</span>
          </div>
          <div>
            <span>O: </span>
            <span className="font-bold text-[#131722]">${activePoint.open?.toFixed(2)}</span>
          </div>
          <div>
            <span>H: </span>
            <span className="font-bold text-[#089981]">${activePoint.high?.toFixed(2)}</span>
          </div>
          <div>
            <span>L: </span>
            <span className="font-bold text-[#F23645]">${activePoint.low?.toFixed(2)}</span>
          </div>
          <div>
            <span>C: </span>
            <span className="font-bold text-[#131722]">${activePoint.price.toFixed(2)}</span>
          </div>
          {showVolume && (
            <div>
              <span>Vol: </span>
              <span className="font-bold text-[#131722]">
                {(activePoint.volume! / 1000000).toFixed(2)}M
              </span>
            </div>
          )}
          {showSMA && activePoint.sma && (
            <div>
              <span className="text-[#F7931A]">SMA(5): </span>
              <span className="font-bold text-[#F7931A]">${activePoint.sma.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Interactive SVG Chart Viewport */}
        <div className="p-4 sm:p-6 bg-white relative flex-1 min-h-[360px] flex flex-col justify-center">
          <svg
            className="w-full h-[320px] overflow-visible cursor-crosshair"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="full-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#089981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#089981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
              const y = priceHeight * ratio + 15;
              const priceLevel = maxVal - ratio * range;
              return (
                <g key={ratio}>
                  <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#F0F3FA" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={chartWidth - 5} y={y - 4} fill="#787B86" fontSize="10" fontFamily="monospace" textAnchor="end">
                    ${priceLevel.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Volume Histogram Bars */}
            {showVolume &&
              candleData.map((d, i) => {
                const step = chartWidth / candleData.length;
                const barWidth = Math.max(3, step * 0.65);
                const x = i * step + step / 2;
                const volHeight = ((d.volume || 1) / maxVolume) * (paddingBottom - 15);
                const y = chartHeight - volHeight;
                const isGreen = (d.price >= (d.open ?? d.price));

                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={volHeight}
                    fill={isGreen ? '#089981' : '#F23645'}
                    opacity={0.35}
                  />
                );
              })}

            {/* Candlestick Rendering */}
            {chartType === 'candles' &&
              candleData.map((d, i) => {
                const step = chartWidth / candleData.length;
                const barWidth = Math.max(6, step * 0.7);
                const x = i * step + step / 2;

                const open = d.open ?? d.price;
                const close = d.price;
                const high = d.high ?? Math.max(open, close);
                const low = d.low ?? Math.min(open, close);

                const isBullish = close >= open;
                const color = isBullish ? '#089981' : '#F23645';

                const yHigh = 15 + ((maxVal - high) / range) * priceHeight;
                const yLow = 15 + ((maxVal - low) / range) * priceHeight;
                const yOpen = 15 + ((maxVal - open) / range) * priceHeight;
                const yClose = 15 + ((maxVal - close) / range) * priceHeight;

                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                return (
                  <g
                    key={`candle-${i}`}
                    onMouseEnter={() => setHoveredIndex(i)}
                    className="cursor-pointer"
                  >
                    {/* Wick Line */}
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                    {/* Candle Body */}
                    <rect
                      x={x - barWidth / 2}
                      y={bodyTop}
                      width={barWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })}

            {/* Line / Area Rendering */}
            {(chartType === 'line' || chartType === 'area') && (() => {
              const coords = candleData.map((d, idx) => {
                const x = (idx / (candleData.length - 1)) * chartWidth;
                const y = 15 + ((maxVal - d.price) / range) * priceHeight;
                return { x, y };
              });

              let pathD = `M ${coords[0].x} ${coords[0].y}`;
              for (let i = 1; i < coords.length; i++) {
                const prev = coords[i - 1];
                const curr = coords[i];
                const midX = (prev.x + curr.x) / 2;
                pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
              }

              const areaD = `${pathD} L ${chartWidth} ${chartHeight - paddingBottom} L 0 ${chartHeight - paddingBottom} Z`;

              return (
                <g>
                  {chartType === 'area' && <path d={areaD} fill="url(#full-chart-grad)" />}
                  <path d={pathD} fill="none" stroke="#089981" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              );
            })()}

            {/* SMA Line */}
            {showSMA && (() => {
              const smaCoords = candleData.map((d, idx) => {
                const x = (idx / (candleData.length - 1)) * chartWidth;
                const y = 15 + ((maxVal - (d.sma || d.price)) / range) * priceHeight;
                return { x, y };
              });

              let smaD = `M ${smaCoords[0].x} ${smaCoords[0].y}`;
              for (let i = 1; i < smaCoords.length; i++) {
                smaD += ` L ${smaCoords[i].x} ${smaCoords[i].y}`;
              }

              return <path d={smaD} fill="none" stroke="#F7931A" strokeWidth="1.8" strokeDasharray="4 2" />;
            })()}

            {/* Active Crosshair */}
            {hoveredIndex !== null && (() => {
              const step = chartWidth / candleData.length;
              const x = hoveredIndex * step + step / 2;
              const target = candleData[hoveredIndex];
              const y = 15 + ((maxVal - target.price) / range) * priceHeight;

              return (
                <g pointerEvents="none">
                  <line x1={x} y1={0} x2={x} y2={chartHeight} stroke="#787B86" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#787B86" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx={x} cy={y} r="5" fill="#2962ff" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Bottom Trading & Execution Drawer */}
        <div className="bg-[#F8F9FD] border-t border-[#E0E3EB] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-[#787B86]">Paper Trading Quantity:</span>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 5, 10, 50, 100].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setShares(qty)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold cursor-pointer transition-colors ${
                      shares === qty ? 'bg-[#131722] text-white' : 'bg-white border border-[#E0E3EB] text-[#131722]'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono pl-4 border-l border-[#E0E3EB]">
              <span className="text-[#787B86]">Estimated Total:</span>
              <div className="text-sm font-bold text-[#131722]">
                ${(shares * activePoint.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Buy / Sell Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOrder('BUY')}
              className="px-6 py-2 rounded-full font-bold text-xs text-white bg-[#089981] hover:bg-[#067a67] shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>BUY @ ${activePoint.price.toFixed(2)}</span>
            </button>
            <button
              onClick={() => handleOrder('SELL')}
              className="px-6 py-2 rounded-full font-bold text-xs text-white bg-[#F23645] hover:bg-[#d42534] shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>SELL @ ${activePoint.price.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {tradeSuccessToast && (
          <div className="bg-[#089981] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{tradeSuccessToast}</span>
            </div>
            <button onClick={() => setTradeSuccessToast(null)} className="hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
