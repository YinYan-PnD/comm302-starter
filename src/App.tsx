import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSwitcher } from './components/HeroSwitcher.tsx';
import { IndicesSection } from './components/IndicesSection.tsx';
import { WorldIndicesTable } from './components/WorldIndicesTable.tsx';
import { USStocksSection } from './components/USStocksSection.tsx';
import { WorldBiggestSection } from './components/WorldBiggestSection.tsx';
import { CryptoSection } from './components/CryptoSection.tsx';
import { CommoditiesForexSection } from './components/CommoditiesForexSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FullChartModal } from './components/FullChartModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { WatchlistDrawer } from './components/WatchlistDrawer.tsx';
import { UserAccountModal } from './components/UserAccountModal.tsx';

import {
  INDICES_DATA,
  WORLD_INDICES,
  HIGHEST_VOLUME_STOCKS,
  MOST_VOLATILE_STOCKS,
  TOP_GAINERS_STOCKS,
  WORLD_BIGGEST_COMPANIES,
  CRYPTO_TOP,
  CRYPTO_GAINERS,
  CRYPTO_TVL,
  COMMODITIES,
  FOREX_PAIRS,
} from './data/marketData.ts';
import { IndexItem, WorldIndex, StockMover, CompanyGiant, WatchlistItem, SearchResultItem } from './types/market.ts';

export default function App() {
  // Navigation & Category states
  const [activeNav, setActiveNav] = useState('markets');
  const [activeCategory, setActiveCategory] = useState('indices');
  const [currentScope, setCurrentScope] = useState('Markets, everywhere');
  const [currentLang, setCurrentLang] = useState('EN');

  // Selected active hero index
  const [indices, setIndices] = useState<IndexItem[]>(INDICES_DATA);
  const [selectedIndex, setSelectedIndex] = useState<IndexItem>(INDICES_DATA[0]);

  // Modal views
  const [fullChartAsset, setFullChartAsset] = useState<{
    symbol: string;
    name: string;
    exchange?: string;
    price: number;
    change: number;
    changePercent: number;
  } | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Watchlist State (with default items from screenshot)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { symbol: 'S&P 500', name: 'S&P 500 Index', type: 'index', price: 5864.67, changePercent: 0.42, addedAt: Date.now() },
    { symbol: 'NVDA', name: 'NVIDIA Corp', type: 'stock', price: 141.20, changePercent: 2.84, addedAt: Date.now() },
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 92450.00, changePercent: 2.15, addedAt: Date.now() },
  ]);

  // Paper Trading Account State
  const [userBalance, setUserBalance] = useState(100000);
  const [userPositions, setUserPositions] = useState<
    Array<{ symbol: string; shares: number; avgPrice: number; currentPrice: number }>
  >([
    { symbol: 'AAPL', shares: 25, avgPrice: 228.50, currentPrice: 231.40 },
    { symbol: 'NVDA', shares: 50, avgPrice: 136.20, currentPrice: 141.20 },
  ]);

  // Live simulation toggle
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(true);

  // Live price ticks simulation
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      // Pick a random index or stock to tick
      setIndices((prev) =>
        prev.map((idx) => {
          if (Math.random() > 0.4) return idx;
          const delta = (Math.random() - 0.49) * 1.5;
          const newPrice = Math.max(10, idx.price + delta);
          return {
            ...idx,
            price: parseFloat(newPrice.toFixed(2)),
          };
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  // Sync selected index with updated price
  useEffect(() => {
    const updated = indices.find((i) => i.id === selectedIndex.id);
    if (updated) {
      setSelectedIndex(updated);
    }
  }, [indices]);

  // Watchlist toggle handler
  const handleToggleWatchlist = (
    symbol: string,
    name: string,
    type: string,
    price: number,
    changePercent: number
  ) => {
    setWatchlist((prev) => {
      const exists = prev.some((w) => w.symbol === symbol);
      if (exists) {
        return prev.filter((w) => w.symbol !== symbol);
      } else {
        return [
          { symbol, name, type, price, changePercent, addedAt: Date.now() },
          ...prev,
        ];
      }
    });
  };

  const handleRemoveWatchlistItem = (symbol: string) => {
    setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
  };

  const handleClearWatchlist = () => {
    setWatchlist([]);
  };

  // Trade Execution Simulation
  const handleExecuteTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const orderCost = shares * price;
    if (type === 'BUY') {
      if (userBalance < orderCost) {
        alert('Insufficient cash for this order.');
        return;
      }
      setUserBalance((b) => b - orderCost);
      setUserPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing) {
          const totalShares = existing.shares + shares;
          const totalPaid = existing.shares * existing.avgPrice + orderCost;
          return prev.map((p) =>
            p.symbol === symbol
              ? { ...p, shares: totalShares, avgPrice: totalPaid / totalShares, currentPrice: price }
              : p
          );
        } else {
          return [...prev, { symbol, shares, avgPrice: price, currentPrice: price }];
        }
      });
    } else {
      // SELL
      const existing = userPositions.find((p) => p.symbol === symbol);
      if (!existing || existing.shares < shares) {
        alert(`You do not own ${shares} shares of ${symbol} to sell.`);
        return;
      }
      setUserBalance((b) => b + orderCost);
      setUserPositions((prev) => {
        return prev
          .map((p) => {
            if (p.symbol === symbol) {
              return { ...p, shares: p.shares - shares, currentPrice: price };
            }
            return p;
          })
          .filter((p) => p.shares > 0);
      });
    }
  };

  // Category navigation scroll handler
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const targetElement = document.getElementById(catId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open full chart for different asset types
  const openFullChartForIndex = (index: IndexItem) => {
    setFullChartAsset({
      symbol: index.symbol,
      name: index.name,
      exchange: index.exchange,
      price: index.price,
      change: index.change,
      changePercent: index.changePercent,
    });
  };

  const openFullChartForWorldIndex = (index: WorldIndex) => {
    setFullChartAsset({
      symbol: index.symbol,
      name: index.name,
      exchange: `${index.countryCode}: INDEX`,
      price: index.last,
      change: index.chg,
      changePercent: index.chgPercent,
    });
  };

  const openFullChartForStock = (stock: StockMover) => {
    setFullChartAsset({
      symbol: stock.symbol,
      name: stock.name,
      exchange: 'NASDAQ',
      price: stock.price,
      change: parseFloat(((stock.price * stock.changePercent) / 100).toFixed(2)),
      changePercent: stock.changePercent,
    });
  };

  const openFullChartForCompany = (comp: CompanyGiant) => {
    setFullChartAsset({
      symbol: comp.symbol,
      name: comp.name,
      exchange: 'NASDAQ',
      price: comp.price,
      change: parseFloat(((comp.price * comp.changePercent) / 100).toFixed(2)),
      changePercent: comp.changePercent,
    });
  };

  const openFullChartForCoin = (coin: { symbol: string; name: string; price: number; changePercent: number }) => {
    setFullChartAsset({
      symbol: coin.symbol,
      name: coin.name,
      exchange: 'BINANCE: CRYPTO',
      price: coin.price,
      change: parseFloat(((coin.price * coin.changePercent) / 100).toFixed(2)),
      changePercent: coin.changePercent,
    });
  };

  const openFullChartForCommodity = (item: { symbol: string; name: string; exchange: string; price: number; changePercent: number }) => {
    setFullChartAsset({
      symbol: item.symbol,
      name: item.name,
      exchange: item.exchange,
      price: item.price,
      change: parseFloat(((item.price * item.changePercent) / 100).toFixed(2)),
      changePercent: item.changePercent,
    });
  };

  const openFullChartForForex = (item: { pair: string; name: string; rate: number; changePercent: number }) => {
    setFullChartAsset({
      symbol: item.pair.replace(' / ', ''),
      name: item.name,
      exchange: 'FX_IDC',
      price: item.rate,
      change: parseFloat(((item.rate * item.changePercent) / 100).toFixed(4)),
      changePercent: item.changePercent,
    });
  };

  const openFullChartForSearchResult = (item: SearchResultItem) => {
    setFullChartAsset({
      symbol: item.symbol,
      name: item.name,
      exchange: item.exchange,
      price: item.price,
      change: parseFloat(((item.price * item.changePercent) / 100).toFixed(2)),
      changePercent: item.changePercent,
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#131722] flex flex-col font-sans selection:bg-[#2962ff] selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        watchlistCount={watchlist.length}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
      />

      {/* Main View Area */}
      <main className="w-full pt-16 flex-1 bg-[#FFFFFF]">
        {activeNav === 'markets' && (
          <>
            {/* Markets Hero Title & Market Switcher Pill Navigation */}
            <HeroSwitcher
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              currentScope={currentScope}
              onSelectScope={setCurrentScope}
            />

            {/* Indices Section (Interactive Hero + Index Carousel) */}
            <IndicesSection
              indices={indices}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              onLaunchFullChart={openFullChartForIndex}
            />

            {/* World Indices Table */}
            <WorldIndicesTable
              indices={WORLD_INDICES}
              onSelectIndexRow={openFullChartForWorldIndex}
              watchlistSymbols={watchlist.map((w) => w.symbol)}
              onToggleWatchlist={handleToggleWatchlist}
            />

            {/* US Stocks Bento Grid (Highest Vol, Most Volatile, Top Gainers) */}
            <USStocksSection
              highestVolume={HIGHEST_VOLUME_STOCKS}
              mostVolatile={MOST_VOLATILE_STOCKS}
              topGainers={TOP_GAINERS_STOCKS}
              onSelectStock={openFullChartForStock}
            />

            {/* World Biggest Companies (Apple, NVIDIA, Microsoft, Alphabet, etc.) */}
            <WorldBiggestSection
              companies={WORLD_BIGGEST_COMPANIES}
              onSelectCompany={openFullChartForCompany}
            />

            {/* Crypto Section (Top Coins, 24h Gainers, TVL Ranking) */}
            <CryptoSection
              topCoins={CRYPTO_TOP}
              gainers={CRYPTO_GAINERS}
              tvlList={CRYPTO_TVL}
              onSelectCoin={openFullChartForCoin}
            />

            {/* Commodities & Futures + Forex Currencies */}
            <CommoditiesForexSection
              commodities={COMMODITIES}
              forex={FOREX_PAIRS}
              onSelectCommodity={openFullChartForCommodity}
              onSelectForex={openFullChartForForex}
            />
          </>
        )}

        {/* Secondary Views (Products, Community, Brokers) for complete experience */}
        {activeNav === 'products' && (
          <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-12">
            <h2 className="text-3xl font-extrabold text-[#131722] mb-3">TradingView Supercharts & Screener Products</h2>
            <p className="text-[#787B86] text-sm mb-8 max-w-2xl">
              Professional-grade financial analysis tools trusted by over 60 million active traders and investors worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => openFullChartForIndex(selectedIndex)}
                className="p-6 rounded-3xl border border-[#E0E3EB] bg-[#F8F9FD] hover:border-[#2962ff] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#2962ff] text-white flex items-center justify-center font-bold mb-4">
                  SC
                </div>
                <h3 className="text-lg font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                  Supercharts™
                </h3>
                <p className="text-xs text-[#787B86] mt-1 mb-4">
                  Multi-timeframe candlestick and area charts with hundreds of built-in technical indicators and drawing tools.
                </p>
                <span className="text-xs font-bold text-[#2962ff]">Open Supercharts →</span>
              </div>

              <div
                onClick={() => {
                  setActiveNav('markets');
                  handleSelectCategory('us-stocks');
                }}
                className="p-6 rounded-3xl border border-[#E0E3EB] bg-[#F8F9FD] hover:border-[#2962ff] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#089981] text-white flex items-center justify-center font-bold mb-4">
                  SS
                </div>
                <h3 className="text-lg font-bold text-[#131722] group-hover:text-[#089981] transition-colors">
                  Stock Screener 2.0
                </h3>
                <p className="text-xs text-[#787B86] mt-1 mb-4">
                  Filter thousands of global equities by market capitalization, dividend yield, PE ratio, and volatility.
                </p>
                <span className="text-xs font-bold text-[#089981]">View Screeners →</span>
              </div>

              <div
                onClick={() => {
                  setActiveNav('markets');
                  handleSelectCategory('crypto');
                }}
                className="p-6 rounded-3xl border border-[#E0E3EB] bg-[#F8F9FD] hover:border-[#2962ff] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#F7931A] text-white flex items-center justify-center font-bold mb-4">
                  CS
                </div>
                <h3 className="text-lg font-bold text-[#131722] group-hover:text-[#F7931A] transition-colors">
                  Crypto & DeFi Screener
                </h3>
                <p className="text-xs text-[#787B86] mt-1 mb-4">
                  Real-time coin metrics, Total Value Locked (TVL) tracking, and on-chain liquidation indicators.
                </p>
                <span className="text-xs font-bold text-[#F7931A]">Explore Coins →</span>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'community' && (
          <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-12">
            <h2 className="text-3xl font-extrabold text-[#131722] mb-3">Trader Community & Ideas</h2>
            <p className="text-[#787B86] text-sm mb-8">
              Explore market breakdowns, trading setups, and educational scripts published by the world's best analysts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl border border-[#E0E3EB] bg-white shadow-xs">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E6F4F1] text-[#089981]">
                  BULLISH SETUP
                </span>
                <h3 className="text-base font-bold text-[#131722] mt-2 mb-1">
                  S&P 500 Breaches New All-Time Highs with Breadth Expansion
                </h3>
                <p className="text-xs text-[#787B86] mb-3">
                  Analysis indicates continuous volume inflow into broad-market index funds supported by strong quarterly tech earnings.
                </p>
                <div className="flex items-center justify-between text-xs text-[#787B86] pt-3 border-t border-[#F0F3FA]">
                  <span>by @AlphaTradingDesk</span>
                  <button
                    onClick={() => openFullChartForIndex(indices[0])}
                    className="font-bold text-[#2962ff] hover:underline"
                  >
                    View Chart
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-[#E0E3EB] bg-white shadow-xs">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ebedfa] text-[#2962ff]">
                  CRYPTO MACRO
                </span>
                <h3 className="text-base font-bold text-[#131722] mt-2 mb-1">
                  Bitcoin $92k Consolidation and Post-Halving Supply Squeeze
                </h3>
                <p className="text-xs text-[#787B86] mb-3">
                  Institutional ETF cumulative inflows maintain solid floor as spot exchange balances test multi-year lows.
                </p>
                <div className="flex items-center justify-between text-xs text-[#787B86] pt-3 border-t border-[#F0F3FA]">
                  <span>by @QuantMacro</span>
                  <button
                    onClick={() => openFullChartForCoin(CRYPTO_TOP[0])}
                    className="font-bold text-[#2962ff] hover:underline"
                  >
                    View Chart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'brokers' && (
          <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-12">
            <h2 className="text-3xl font-extrabold text-[#131722] mb-3">Integrated Brokers</h2>
            <p className="text-[#787B86] text-sm mb-8">
              Connect your favorite brokerage account to execute real trades directly from TradingView charts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Interactive Brokers', 'TradeStation', 'OANDA', 'Pepperstone'].map((broker) => (
                <div key={broker} className="p-5 rounded-2xl border border-[#E0E3EB] bg-white shadow-xs text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0F3FA] text-[#131722] font-bold flex items-center justify-center mx-auto mb-3 text-sm">
                    {broker.slice(0, 2)}
                  </div>
                  <h4 className="font-bold text-sm text-[#131722]">{broker}</h4>
                  <p className="text-xs text-[#787B86] mt-1 mb-4">Official Verified Partner</p>
                  <button
                    onClick={() => setIsAccountOpen(true)}
                    className="w-full py-1.5 rounded-full text-xs font-bold border border-[#2962ff] text-[#2962ff] hover:bg-[#2962ff] hover:text-white transition-colors"
                  >
                    Connect Broker
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Comprehensive Site Map Footer */}
      <Footer />

      {/* Full Superchart Modal */}
      {fullChartAsset && (
        <FullChartModal
          asset={fullChartAsset}
          onClose={() => setFullChartAsset(null)}
          isWatchlisted={watchlist.some((w) => w.symbol === fullChartAsset.symbol)}
          onToggleWatchlist={() =>
            handleToggleWatchlist(
              fullChartAsset.symbol,
              fullChartAsset.name,
              'asset',
              fullChartAsset.price,
              fullChartAsset.changePercent
            )
          }
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* Search Dialog (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={openFullChartForSearchResult}
        watchlistSymbols={watchlist.map((w) => w.symbol)}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Watchlist Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveItem={handleRemoveWatchlistItem}
        onSelectAsset={(item) =>
          setFullChartAsset({
            symbol: item.symbol,
            name: item.name,
            exchange: 'MARKET',
            price: item.price,
            change: parseFloat(((item.price * item.changePercent) / 100).toFixed(2)),
            changePercent: item.changePercent,
          })
        }
        onClearAll={handleClearWatchlist}
      />

      {/* User Account & Paper Trading Profile Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        balance={userBalance}
        positions={userPositions}
        onResetBalance={() => {
          setUserBalance(100000);
          setUserPositions([]);
        }}
        liveUpdatesEnabled={liveUpdatesEnabled}
        onToggleLiveUpdates={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
      />
    </div>
  );
}
