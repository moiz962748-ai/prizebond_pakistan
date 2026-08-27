'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Menu,
  X,
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  activeParam?: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  activeParam,
  onNavigate,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar with Announcement / Government Trust Context */}
      <div className="bg-[#004D26] text-white text-[11px] font-medium py-1.5 px-4 border-b border-[#006633]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>Official Prize Bond Information Platform of Pakistan</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              Next Draw: <strong>Rs. 750 — March 15, 2026</strong>
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-emerald-200">Last Updated: Today, 04:30 PM</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            aria-label="PrizeBond Pakistan Home"
          >
            <div className="w-10 h-10 bg-[#006633] rounded flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:bg-[#004D26] transition-colors">
              P
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#004D26] text-lg uppercase tracking-tight group-hover:text-[#006633] transition-colors">
                PrizeBond
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                Pakistan
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                  : 'text-slate-600 hover:text-[#006633]'
              }`}
            >
              Home
            </button>

            {/* Results Button */}
            <button
              onClick={() => handleNavClick('results')}
              className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors cursor-pointer ${
                activeView === 'results'
                  ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                  : 'text-slate-600 hover:text-[#006633]'
              }`}
            >
              Results
            </button>

            {/* Prize Bond Checker */}
            <button
              onClick={() => handleNavClick('checker')}
              className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeView === 'checker'
                  ? 'text-[#006633] border-b-2 border-[#006633] pb-1 font-bold'
                  : 'text-slate-600 hover:text-[#006633]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" />
              <span>Checker</span>
            </button>

            {/* Draw Schedule Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('schedule')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('schedule')}
                className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  activeView === 'schedule'
                    ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                    : 'text-slate-600 hover:text-[#006633]'
                }`}
              >
                <span>Schedule</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'schedule' && (
                <div className="absolute top-full left-0 w-60 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                      Draw Schedules
                    </div>
                    {[
                      { label: '2026 Draw Schedule', param: '2026' },
                      { label: 'Upcoming Draw', param: 'upcoming' },
                      { label: 'Previous Draws', param: 'previous' },
                      { label: 'Draw Cities', param: 'cities' },
                      { label: 'Draw Calendar', param: 'calendar' },
                    ].map((item) => (
                      <button
                        key={item.param}
                        onClick={() => handleNavClick('schedule', item.param)}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="mt-1 pt-1.5 border-t border-slate-100 px-3.5">
                      <button
                        onClick={() => handleNavClick('schedule')}
                        className="text-[11px] font-bold text-[#006633] hover:underline cursor-pointer"
                      >
                        View Full Schedule →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prize Bonds Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('prize-bonds')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('prizebonds')}
                className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  activeView === 'prizebonds' || activeView === 'prize-bonds' || activeView === 'denomination'
                    ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                    : 'text-slate-600 hover:text-[#006633]'
                }`}
              >
                <span>Prize Bonds</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'prize-bonds' && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                      Prize Bonds Hub
                    </div>
                    <button
                      onClick={() => handleNavClick('prizebonds')}
                      className="w-full text-left px-3.5 py-2 text-xs font-black text-[#006633] bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Prize Bonds Hub (All)</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    {[
                      { label: '100 Prize Bond', val: '100' },
                      { label: '200 Prize Bond', val: '200' },
                      { label: '750 Prize Bond', val: '750' },
                      { label: '1,500 Prize Bond', val: '1500' },
                      { label: '25,000 Premium Bond', val: '25000' },
                      { label: '40,000 Premium Bond', val: '40000' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => handleNavClick('denomination', item.val)}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Information Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('information')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('information', 'hub')}
                className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  activeView === 'information'
                    ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                    : 'text-slate-600 hover:text-[#006633]'
                }`}
              >
                <span>Information</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'information' && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                      Information Hub
                    </div>
                    <button
                      onClick={() => handleNavClick('information', 'hub')}
                      className="w-full text-left px-3.5 py-2 text-xs font-black text-[#006633] bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Information Hub Overview</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    {[
                      { label: 'How Prize Bonds Work', slug: 'how-prize-bonds-work' },
                      { label: 'How to Buy Prize Bonds', slug: 'how-to-buy-prize-bonds' },
                      { label: 'How to Check Prize Bonds', slug: 'how-to-check-prize-bonds' },
                      { label: 'Prize Bond Rules', slug: 'prize-bond-rules' },
                      { label: 'Prize Money & Tax Rates', slug: 'prize-money-and-tax' },
                      { label: 'How to Claim a Prize', slug: 'how-to-claim-a-prize' },
                      { label: 'Frequently Asked Questions', slug: 'faqs' },
                    ].map((item) => (
                      <button
                        key={item.slug}
                        onClick={() =>
                          item.slug === 'faqs'
                            ? handleNavClick('faqs')
                            : handleNavClick('information', item.slug)
                        }
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Latest Draw CTA button */}
            <button
              onClick={() => handleNavClick('latest-draw')}
              className="bg-[#006633] text-white px-4 py-2 rounded font-semibold text-xs transition-colors hover:bg-[#004D26] cursor-pointer shadow-xs ml-2"
            >
              LATEST DRAW
            </button>
          </nav>

          {/* Search Trigger & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-[#006633] text-slate-600 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Search PrizeBond Pakistan"
            >
              <Search className="w-4 h-4 text-[#006633]" />
              <span className="hidden sm:inline">Search...</span>
              <span className="hidden md:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                ⌘K
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-slate-100 text-slate-700 lg:hidden border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left font-bold text-sm text-slate-800 py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('results')}
            className="w-full text-left font-bold text-sm text-slate-800 py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span>Results</span>
          </button>

          <button
            onClick={() => handleNavClick('checker')}
            className="w-full text-left font-bold text-sm bg-[#006633] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Prize Bond Checker
            </span>
            <span className="text-xs bg-[#004D26] px-2 py-0.5 rounded">Check Now</span>
          </button>

          {/* Schedule Accordion */}
          <div className="py-2 border-b border-slate-100">
            <div className="text-xs font-extrabold text-[#004D26] uppercase tracking-wider mb-2">
              Draw Schedule
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '2026 Schedule', param: '2026' },
                { label: 'Upcoming Draw', param: 'upcoming' },
                { label: 'Previous Draws', param: 'previous' },
                { label: 'Draw Cities', param: 'cities' },
                { label: 'Draw Calendar', param: 'calendar' },
              ].map((item) => (
                <button
                  key={item.param}
                  onClick={() => handleNavClick('schedule', item.param)}
                  className="text-xs bg-slate-50 p-2 rounded-lg text-slate-700 font-semibold cursor-pointer hover:bg-emerald-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Denominations */}
          <div className="py-2 border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#004D26] uppercase tracking-wider">
                Denomination Hubs
              </span>
              <button
                type="button"
                onClick={() => handleNavClick('prizebonds')}
                className="text-[11px] font-bold text-[#006633] hover:underline"
              >
                View Hub Page →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['100', '200', '750', '1500', '25000', '40000'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleNavClick('denomination', val)}
                  className="text-center text-xs font-bold py-2 bg-emerald-50 text-[#004D26] rounded-lg border border-emerald-100"
                >
                  Rs. {val}
                </button>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#004D26] uppercase tracking-wider">
                Information & Guides
              </span>
              <button
                type="button"
                onClick={() => handleNavClick('information', 'hub')}
                className="text-[11px] font-bold text-[#006633] hover:underline"
              >
                Information Hub →
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('information', 'hub')}
                className="w-full text-left px-3 py-2 text-xs font-black text-[#006633] bg-emerald-50 rounded-lg flex items-center justify-between"
              >
                <span>Prize Bond Information Hub</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </button>
              {[
                { label: 'How Prize Bonds Work', slug: 'how-prize-bonds-work' },
                { label: 'How to Buy Prize Bonds', slug: 'how-to-buy-prize-bonds' },
                { label: 'Prize Money Tax Rates', slug: 'prize-money-and-tax' },
                { label: 'How to Claim a Prize', slug: 'how-to-claim-a-prize' },
                { label: 'FAQs', slug: 'faqs' },
              ].map((item) => (
                <button
                  key={item.slug}
                  onClick={() =>
                    item.slug === 'faqs'
                      ? handleNavClick('faqs')
                      : handleNavClick('information', item.slug)
                  }
                  className="block w-full text-left text-xs text-slate-700 py-1.5 px-2 hover:bg-slate-50 rounded"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};