'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ShieldCheck, Landmark } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  cmsContent?: Record<string, string>;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, cmsContent = {} }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Trust Banner */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 p-3 rounded-xl shadow-sm">
              <Trophy className="h-8 w-8 text-emerald-950" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {cmsContent.footer_brand_title || 'PRIZEBOND PAKISTAN'}
              </h2>
              <p className="text-emerald-400 text-sm font-medium mt-1">
                {cmsContent.footer_brand_subtitle || 'Official Gazette Results, Online Checker & Schedule Utility'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>National Savings Gazette Synced</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>State Bank of Pakistan Guidelines</span>
            </div>
          </div>
        </div>

        {/* Middle Section: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-12">
          
          {/* Column 1: QUICK CHECK & LISTS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 mb-4">
              Quick Check & Lists
            </h3>
            
            <button
              type="button"
              onClick={() => onNavigate('checker')}
              className="group flex items-center text-sm text-slate-300 hover:text-emerald-400 transition-colors mb-5 cursor-pointer text-left w-full"
            >
              <span className="group-hover:translate-x-1 transition-transform flex items-center font-medium">
                Online Prize Bond Checker
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold leading-none tracking-wide ml-2">TOOL</span>
              </span>
            </button>

            <h4 className="text-[11px] font-semibold uppercase text-slate-400 mt-5 mb-3 tracking-wider">
              Denomination Lists
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button onClick={() => onNavigate('denomination', '100')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">100 List</button>
              <button onClick={() => onNavigate('denomination', '200')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">200 List</button>
              <button onClick={() => onNavigate('denomination', '750')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">750 List</button>
              <button onClick={() => onNavigate('denomination', '1500')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">1,500 List</button>
              <button onClick={() => onNavigate('denomination', '25000')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">25K Premium</button>
              <button onClick={() => onNavigate('denomination', '40000')} className="bg-slate-800/60 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 text-xs px-2.5 py-1.5 rounded border border-slate-700/50 transition-colors text-center font-medium shadow-sm cursor-pointer">40K Premium</button>
            </div>

            <h4 className="text-[11px] font-semibold uppercase text-slate-400 mt-5 mb-3 tracking-wider">
              Archives
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => onNavigate('results')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  <span className="group-hover:translate-x-1 transition-transform">2024 Gazette List</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('results')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  <span className="group-hover:translate-x-1 transition-transform">2023 Gazette List</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('newspaper')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  <span className="group-hover:translate-x-1 transition-transform flex items-center">
                    Prize Bond Newspaper
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold leading-none tracking-wide ml-2">NEW</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: DRAW SCHEDULES */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 mb-4">
              Draw Schedules
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li>
                <button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">
                  <span className="group-hover:translate-x-1 transition-transform flex items-center font-medium">
                    2026 Prize Bond Schedule
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold leading-none tracking-wide ml-2">2026</span>
                  </span>
                </button>
              </li>
              <li><button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">2025 Schedule Archive</span></button></li>
              <li><button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Next Draw Countdown</span></button></li>
              <li><button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Draw Schedule by City</span></button></li>
              <li><button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Karachi Draw Schedule</span></button></li>
              <li><button onClick={() => onNavigate('schedule')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Lahore Draw Schedule</span></button></li>
              <li><button onClick={() => onNavigate('information', 'state-bank-rules')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">State Bank Schedule Rules</span></button></li>
            </ul>
          </div>

          {/* Column 3: SAVINGS & NEWS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 mb-4">
              Savings & News
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li><button onClick={() => onNavigate('information', 'national-savings-rates')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">National Savings Rates</span></button></li>
              <li><button onClick={() => onNavigate('information', 'qaumi-bachat')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Qaumi Bachat Bank Info</span></button></li>
              <li><button onClick={() => onNavigate('news')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Prize Bond News Today</span></button></li>
              <li><button onClick={() => onNavigate('information', 'how-to-buy-prize-bonds')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">How to Buy & Claim Prize</span></button></li>
              <li><button onClick={() => onNavigate('information', 'prize-money-and-tax')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Tax Rates & Deductions</span></button></li>
              <li><button onClick={() => onNavigate('guess-papers')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">7 Star Formula Papers</span></button></li>
            </ul>
          </div>

          {/* Column 4: ABOUT & LEGAL */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 mb-4">
              About & Legal
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li><button onClick={() => onNavigate('about')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">About Us</span></button></li>
              <li><button onClick={() => onNavigate('contact')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Contact Us</span></button></li>
              <li><button onClick={() => onNavigate('editorial-policy')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Editorial Policy</span></button></li>
              <li><button onClick={() => onNavigate('sitemap')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Site Map</span></button></li>
              <li><button onClick={() => onNavigate('privacy')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Privacy Policy</span></button></li>
              <li><button onClick={() => onNavigate('terms')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Terms & Conditions</span></button></li>
              <li><button onClick={() => onNavigate('disclaimer')} className="group flex items-center text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"><span className="group-hover:translate-x-1 transition-transform">Disclaimer</span></button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Sub-Footer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p className="font-medium text-slate-400">
            {cmsContent.footer_copyright || `© ${new Date().getFullYear()} PrizeBond Pakistan. All rights reserved.`}
          </p>
          <p className="text-center lg:text-right max-w-3xl leading-relaxed text-xs">
            <strong className="text-slate-400 font-semibold">Disclaimer:</strong> {cmsContent.footer_disclaimer || 'This portal is for informational purposes and provides utility tools. We are not officially affiliated with the State Bank of Pakistan or National Savings. Always verify results with the official government gazette.'}
          </p>
        </div>
        
      </div>
    </footer>
  );
};