import React from 'react';
import { X, Wallet, TrendingUp, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  positions: Position[];
  onResetBalance: () => void;
  liveUpdatesEnabled: boolean;
  onToggleLiveUpdates: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  balance,
  positions,
  onResetBalance,
  liveUpdatesEnabled,
  onToggleLiveUpdates,
}) => {
  if (!isOpen) return null;

  const positionsValue = positions.reduce((acc, p) => acc + p.shares * p.currentPrice, 0);
  const totalValue = balance + positionsValue;
  const initialCapital = 100000;
  const totalReturn = totalValue - initialCapital;
  const totalReturnPercent = (totalReturn / initialCapital) * 100;
  const isPos = totalReturn >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E0E3EB] flex items-center justify-between bg-[#F8F9FD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0049db] text-white flex items-center justify-center font-bold text-sm">
              TV
            </div>
            <div>
              <h3 className="font-bold text-base text-[#131722]">Pro Trader Account</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#089981] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulated Paper Trading (Active)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#ebedfa] text-[#787B86] hover:text-[#131722] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Balances Card */}
        <div className="p-5 space-y-4">
          <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-[#E0E3EB]">
            <div className="text-xs text-[#787B86] font-medium mb-1">Total Account Net Worth</div>
            <div className="font-mono text-3xl font-extrabold text-[#131722]">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1.5 font-mono text-xs font-semibold">
              <span className={isPos ? 'text-[#089981]' : 'text-[#F23645]'}>
                {isPos ? '+' : ''}${totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({isPos ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
              </span>
              <span className="text-[#787B86] font-sans font-normal">All-Time Performance</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E0E3EB] text-xs font-mono">
              <div>
                <span className="text-[#787B86] font-sans">Available Cash:</span>
                <div className="font-bold text-[#131722]">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <span className="text-[#787B86] font-sans">Invested Assets:</span>
                <div className="font-bold text-[#131722]">
                  ${positionsValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Active Positions */}
          <div>
            <div className="text-xs font-bold text-[#787B86] uppercase tracking-wider mb-2">
              Portfolio Holdings ({positions.length})
            </div>
            {positions.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#F8F9FD] text-center text-xs text-[#787B86]">
                No open positions. Use "Launch full chart view" on any asset to execute simulated buy or sell orders.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {positions.map((p) => {
                  const pnl = (p.currentPrice - p.avgPrice) * p.shares;
                  const pnlPos = pnl >= 0;
                  return (
                    <div
                      key={p.symbol}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FD] border border-[#E0E3EB] text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-sm text-[#131722]">{p.symbol}</span>
                        <div className="text-[#787B86]">{p.shares} shares @ ${p.avgPrice.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#131722]">
                          ${(p.shares * p.currentPrice).toFixed(2)}
                        </div>
                        <div className={`font-semibold ${pnlPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                          {pnlPos ? '+' : ''}${pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings & Controls */}
          <div className="pt-2 border-t border-[#E0E3EB] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#131722] font-semibold">Simulated Real-time Price Ticks</span>
              <button
                onClick={onToggleLiveUpdates}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  liveUpdatesEnabled ? 'bg-[#089981]' : 'bg-[#E0E3EB]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                    liveUpdatesEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onResetBalance}
                className="text-xs text-[#787B86] hover:text-[#F23645] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to $100,000 Initial Cash</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#131722] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
