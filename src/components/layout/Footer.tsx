import React from 'react';
import { Award, ShieldCheck, Landmark } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111827] text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="pb-8 mb-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#006633] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
              P
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight uppercase">PrizeBond Pakistan</div>
              <div className="text-xs text-slate-400">
                Official Gazette Results & Schedules Utility
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006633]" />
              <span>National Savings Gazette Synced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#006633]" />
              <span>State Bank of Pakistan Guidelines</span>
            </div>
          </div>
        </div>

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Column 1: Results & Tools */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              Results & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Latest Results
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Prize Bond Results
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('checker')}
                  className="hover:text-amber-300 font-semibold text-emerald-300 transition-colors cursor-pointer"
                >
                  Prize Bond Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Draw Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('latest-draw')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Latest Draw
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Prize Bonds */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              Prize Bonds
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('prizebonds')}
                  className="hover:text-amber-300 font-bold text-emerald-300 transition-colors cursor-pointer"
                >
                  Prize Bonds Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '100')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  100 Prize Bond
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '200')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  200 Prize Bond
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '750')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  750 Prize Bond
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '1500')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  1,500 Prize Bond
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '25000')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  25,000 Premium Prize Bond
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('denomination', '40000')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  40,000 Premium Prize Bond
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('information', 'hub')}
                  className="hover:text-amber-300 font-bold text-emerald-300 transition-colors cursor-pointer"
                >
                  Information Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'how-prize-bonds-work')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How Prize Bonds Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'how-to-buy-prize-bonds')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How to Buy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'how-to-check-prize-bonds')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How to Check
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'prize-bond-rules')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Prize Bond Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'prize-money-and-tax')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Prize Money & Tax
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('information', 'how-to-claim-a-prize')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How to Claim Prize
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: About & Legal */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              About & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('editorial-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Editorial Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sitemap')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Site Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            Prize Bond information, results, schedules and checking tools for Pakistan.
          </p>
          <p className="text-center sm:text-right font-medium">
            © 2026 PrizeBond Pakistan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};