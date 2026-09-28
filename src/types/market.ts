export type Timeframe = '1D' | '1W' | '1M' | '1Y' | '5Y' | 'All';

export interface ChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface IndexItem {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  badge: string;
  badgeColor: string;
  price: number;
  change: number;
  changePercent: number;
  timeframes: Record<Timeframe, {
    points: ChartPoint[];
    high: number;
    low: number;
    open: number;
    volume: string;
    change: number;
    changePercent: number;
  }>;
}

export interface WorldIndex {
  symbol: string;
  countryCode: string;
  name: string;
  last: number;
  chgPercent: number;
  chg: number;
  sparkline: number[];
  region: 'Americas' | 'Europe' | 'Asia-Pacific';
}

export interface StockMover {
  symbol: string;
  name: string;
  subtext: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
  avatarBg?: string;
  avatarText?: string;
}

export interface CompanyGiant {
  symbol: string;
  name: string;
  marketCap: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
  sector?: string;
}

export interface CryptoCoin {
  symbol: string;
  symbolGlyph: string;
  name: string;
  price: number;
  changePercent: number;
  color: string;
}

export interface CryptoGainer {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export interface CryptoTVL {
  symbol: string;
  name: string;
  tvl: string;
  changePercent: number;
}

export interface CommodityItem {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
}

export interface ForexItem {
  pair: string;
  name: string;
  rate: number;
  changePercent: number;
  isPositive: boolean;
}

export interface SearchResultItem {
  symbol: string;
  name: string;
  type: 'index' | 'stock' | 'crypto' | 'forex' | 'commodity';
  exchange: string;
  price: number;
  changePercent: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  type: string;
  price: number;
  changePercent: number;
  addedAt: number;
}
