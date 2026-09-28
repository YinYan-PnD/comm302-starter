import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF]">
      {/* Comprehensive TradingView Product Site Map Grid */}
      <div className="w-full bg-[#F0F3FA] py-14 sm:py-16 border-t border-[#E0E3EB]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-xs sm:text-sm">
            {/* Col 1: Products */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Products</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#indices">Supercharts</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#indices">Pine Script®</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#us-stocks">Stock Screener</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#indices">ETF Screener</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#crypto">Crypto Screener</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#world-stocks">Heatmaps</a></li>
              </ul>
            </div>

            {/* Col 2: Community */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Community</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#community">Social network</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#community">Trading Ideas</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#community">Educational ideas</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#community">Scripts & Strategies</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#community">House Rules</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#community">Wall of Love</a></li>
              </ul>
            </div>

            {/* Col 3: Markets */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Markets</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#world-stocks">World stocks</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#crypto">Crypto coins</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#futures">Futures</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#futures">Bonds</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#forex">Forex</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#indices">Economic Calendar</a></li>
              </ul>
            </div>

            {/* Col 4: Business */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Business</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#">Charting libraries</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Lightweight Charts™</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Advanced Charts</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Brokerage integration</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Partner program</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Advertising</a></li>
              </ul>
            </div>

            {/* Col 5: Company */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Company</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#">About us</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Space mission</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Media kit</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">TradingView Store</a></li>
              </ul>
            </div>

            {/* Col 6: Apps */}
            <div>
              <h5 className="text-sm font-bold text-[#131722] mb-3">Apps</h5>
              <ul className="space-y-2.5 text-[#787B86]">
                <li><a className="hover:text-[#131722] transition-colors" href="#">Desktop app</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">iOS app</a></li>
                <li><a className="hover:text-[#131722] transition-colors" href="#">Android app</a></li>
                <li className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[#131722] font-bold">
                    <Heart className="w-3.5 h-3.5 fill-[#F23645] text-[#F23645]" />
                    <span>Made by humans</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer copyright & legal links */}
      <div className="w-full bg-[#FFFFFF] py-8 border-t border-[#E0E3EB]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[#787B86] text-xs">
          <div>© 2024 TradingView, Inc. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-6">
            <a className="hover:text-[#131722] transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-[#131722] transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-[#131722] transition-colors" href="#">Cookies</a>
            <a className="hover:text-[#131722] transition-colors" href="#">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
