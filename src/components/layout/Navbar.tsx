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
  cmsContent?: Record<string, string>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  activeParam,
  onNavigate,
  onOpenSearch,
  cmsContent = {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Mobile Accordion States for Dropdowns
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);
  const [mobileScheduleOpen, setMobileScheduleOpen] = useState(false);
  const [mobilePrizeBondsOpen, setMobilePrizeBondsOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

  const handleNavClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setMobileResultsOpen(false);
    setMobileScheduleOpen(false);
    setMobilePrizeBondsOpen(false);
    setMobileInfoOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar with Announcement / Government Trust Context */}
      <div className="bg-[#004D26] text-white text-[11px] font-medium py-1.5 px-4 border-b border-[#006633]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>{cmsContent.announcement_text || 'Official Prize Bond Information Platform of Pakistan'}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
              <span>{cmsContent.top_banner_text || 'Next Draw: Rs. 750 — March 15, 2026'}</span>
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
                {cmsContent.header_title || 'PrizeBond'}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
                {cmsContent.header_subtitle || 'Pakistan'}
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

            {/* Results & Lists Dropdown (Desktop) */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('results')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'results' ? null : 'results');
                }}
                className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                  activeView === 'results' || activeView === 'denomination' || activeView === 'newspaper'
                    ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
                    : 'text-slate-600 hover:text-[#006633]'
                }`}
              >
                <span>Results & Lists</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {activeDropdown === 'results' && (
                <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
                      Results & Lists Hub
                    </div>
                    
                    {/* Latest Draw */}
                    <button
                      onClick={() => handleNavClick('results')}
                      className="w-full text-left px-3.5 py-2 text-xs font-black text-[#006633] bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Latest Draw Results</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>

                    {/* Denomination Lists */}
                    {[
                      { label: 'Rs. 100 Draw Results & Lists', val: '100' },
                      { label: 'Rs. 200 Draw Results & Lists', val: '200' },
                      { label: 'Rs. 750 Draw Results & Lists', val: '750' },
                      { label: 'Rs. 1,500 Draw Results & Lists', val: '1500' },
                      { label: 'Rs. 25,000 Premium Gazette', val: '25000' },
                      { label: 'Rs. 40,000 Premium Gazette', val: '40000' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => handleNavClick('results', item.val)}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}

                    <div className="my-1 border-t border-slate-100"></div>
                    <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                      Search Gazette Archive (2020–2026)
                    </div>

                    {/* Archive Sublinks */}
                    {[
                      { label: '2026 Gazette List', param: '2026' },
                      { label: '2025 Gazette List', param: '2025' },
                      { label: '2024 Gazette List', param: '2024' },
                      { label: '2023 Gazette List', param: '2023' },
                    ].map((archive) => (
                      <button
                        key={archive.param}
                        onClick={() => handleNavClick('results', archive.param)}
                        className="w-full text-left px-5 py-1.5 text-xs text-slate-600 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span>{archive.label}</span>
                      </button>
                    ))}

                    <div className="my-1 border-t border-slate-100"></div>

                    {/* Prize Bond Newspaper */}
                    <button
                      onClick={() => handleNavClick('newspaper')}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer"
                    >
                      Prize Bond Newspaper
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'schedule' ? null : 'schedule');
                }}
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
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'prize-bonds' ? null : 'prize-bonds');
                }}
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
                      { label: 'Rs. 100 Bond Details & Rules', val: '100' },
                      { label: 'Rs. 200 Bond Details & Rules', val: '200' },
                      { label: 'Rs. 750 Bond Details & Rules', val: '750' },
                      { label: 'Rs. 1,500 Bond Details & Rules', val: '1500' },
                      { label: 'Rs. 25,000 Premium Bond Info', val: '25000' },
                      { label: 'Rs. 40,000 Premium Bond Info', val: '40000' },
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

            {/* Information / News & Savings Dropdown (Desktop) */}
<div
  className="relative"
  onMouseEnter={() => setActiveDropdown('information')}
  onMouseLeave={() => setActiveDropdown(null)}
>
  <button
    onClick={() => {
      setActiveDropdown(activeDropdown === 'information' ? null : 'information');
      handleNavClick('information', 'hub');
    }}
    className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer ${
      activeView === 'information'
        ? 'text-[#006633] border-b-2 border-[#006633] pb-1'
        : 'text-slate-600 hover:text-[#006633]'
    }`}
  >
    <span>News & Savings</span>
    <ChevronDown className="w-3 h-3 opacity-70" />
  </button>

  {activeDropdown === 'information' && (
    <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
        
        {/* Hub Title Header */}
        <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
          News & Savings Hub
        </div>
        
        {/* Overview / Main Hub Link */}
        <button
          onClick={() => handleNavClick('information', 'hub')}
          className="w-full text-left px-3.5 py-2 text-xs font-black text-[#006633] bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between cursor-pointer"
        >
          <span>News & Savings Hub Overview</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </button>
        <div className="my-1 border-t border-slate-100"></div>

        {/* Sub-Hub Pages / Guides List with correct slugs mapping */}
        {[
          { label: "Prize Bond Basics (Beginner's Guide)", param: "prize-bond-basics-pakistan" },
          { label: "How Prize Bonds Work", param: "how-prize-bonds-work" },
          { label: "How to Buy Prize Bonds", param: "how-to-buy-prize-bonds" },
          { label: "How to Check Prize Bonds", param: "how-to-check-prize-bonds" },
          { label: "Prize Bond Rules", param: "prize-bond-rules" },
          { label: "Prize Money & Tax Rates", param: "prize-money-and-tax" },
          { label: "How to Claim a Prize", param: "how-to-claim-a-prize" },
          { label: "Frequently Asked Questions", param: "frequently-asked-questions" },
        ].map((subItem, index) => (
          <button
            key={index}
            onClick={() => handleNavClick('information', subItem.param)}
            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#006633] transition-colors cursor-pointer font-medium"
          >
            {subItem.label}
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
              className="p-2.5 rounded-lg bg-slate-100 text-slate-700 lg:hidden border border-slate-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-5 space-y-4 max-h-[82vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left font-extrabold text-sm text-slate-800 py-2 border-b border-slate-100 flex items-center justify-between cursor-pointer"
          >
            <span>Home</span>
          </button>

          {/* Results & Lists Section (Mobile Accordion) */}
          <div className="py-2 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileResultsOpen(!mobileResultsOpen)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#004D26] uppercase tracking-wider cursor-pointer py-1"
              >
                <span>Results & Lists Hub</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResultsOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {mobileResultsOpen && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('results')}
                  className="w-full text-left text-xs font-bold text-[#006633] mb-2 px-1 hover:underline cursor-pointer"
                >
                  View Latest Results →
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Rs. 100 List', val: '100' },
                    { label: 'Rs. 200 List', val: '200' },
                    { label: 'Rs. 750 List', val: '750' },
                    { label: 'Rs. 1,500 List', val: '1500' },
                    { label: '25K Premium', val: '25000' },
                    { label: '40K Premium', val: '40000' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => handleNavClick('results', item.val)}
                      className="text-left text-xs font-bold px-3 py-2.5 bg-emerald-50/60 text-[#004D26] rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100/70 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Archive Sub-links for Mobile */}
                <div className="pt-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Gazette Archive (2020–2026)
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { label: '2026 List', param: '2026' },
                      { label: '2025 List', param: '2025' },
                      { label: '2024 List', param: '2024' },
                      { label: '2023 List', param: '2023' },
                    ].map((archive) => (
                      <button
                        key={archive.param}
                        onClick={() => handleNavClick('results', archive.param)}
                        className="text-left text-xs font-semibold px-3 py-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 cursor-pointer hover:bg-emerald-50 hover:text-[#006633] transition-colors"
                      >
                        {archive.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newspaper Link */}
                <div className="pt-1">
                  <button
                    onClick={() => handleNavClick('newspaper')}
                    className="w-full text-center text-xs font-black py-2.5 bg-slate-900 text-white rounded-lg cursor-pointer shadow-xs hover:bg-slate-800 transition-colors"
                  >
                    Prize Bond Newspaper Scans
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('checker')}
            className="w-full text-left font-bold text-sm bg-[#006633] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Prize Bond Checker
            </span>
            <span className="text-xs bg-[#004D26] px-2 py-0.5 rounded">Check Now</span>
          </button>

          {/* Schedule Section */}
          <div className="py-2 border-b border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setMobileScheduleOpen(!mobileScheduleOpen)}
              className="w-full flex items-center justify-between text-xs font-extrabold text-[#004D26] uppercase tracking-wider cursor-pointer py-1"
            >
              <span>Draw Schedules</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileScheduleOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileScheduleOpen && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('schedule')}
                  className="w-full text-left text-xs font-bold text-[#006633] mb-1 px-1 hover:underline cursor-pointer"
                >
                  View Full Schedule →
                </button>
                <div className="grid grid-cols-1 gap-1.5">
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
                      className="text-xs bg-slate-50 px-3 py-2.5 rounded-lg text-slate-700 font-bold text-left cursor-pointer hover:bg-emerald-50 hover:text-[#006633] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prize Bonds Hub Section */}
          <div className="py-2 border-b border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setMobilePrizeBondsOpen(!mobilePrizeBondsOpen)}
              className="w-full flex items-center justify-between text-xs font-extrabold text-[#004D26] uppercase tracking-wider cursor-pointer py-1"
            >
              <span className="flex items-center gap-1">
                <span>Prize Bonds Hub</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePrizeBondsOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobilePrizeBondsOpen && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('prizebonds')}
                  className="w-full text-left text-xs font-bold text-[#006633] mb-1 px-1 hover:underline cursor-pointer"
                >
                  Hub (All) →
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Rs. 100 Bond Details & Rules', val: '100' },
                    { label: 'Rs. 200 Bond Details & Rules', val: '200' },
                    { label: 'Rs. 750 Bond Details & Rules', val: '750' },
                    { label: 'Rs. 1,500 Bond Details & Rules', val: '1500' },
                    { label: 'Rs. 25,000 Premium Bond Info', val: '25000' },
                    { label: 'Rs. 40,000 Premium Bond Info', val: '40000' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => handleNavClick('denomination', item.val)}
                      className="text-left text-xs font-bold px-3 py-2.5 bg-emerald-50/60 text-[#004D26] rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100/70 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

      {/* News & Savings Section (Mobile Drawer) */}
<div className="py-2 space-y-1.5 border-b border-slate-100 pb-3">
  <button
    type="button"
    onClick={() => setMobileInfoOpen(!mobileInfoOpen)}
    className="w-full flex items-center justify-between text-xs font-extrabold text-[#004D26] uppercase tracking-wider cursor-pointer py-1 mb-1"
  >
    <span>News & Savings</span>
    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileInfoOpen ? 'rotate-180' : ''}`} />
  </button>

  {mobileInfoOpen && (
    <div className="space-y-1.5 pt-1 animate-in fade-in duration-150 bg-slate-50/70 p-2 rounded-xl border border-slate-200">
      
      {/* Hub Title Header */}
      <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
        News & Savings Hub
      </div>

      {/* Overview / Main Hub Link */}
      <button
        onClick={() => handleNavClick('information', 'hub')}
        className="w-full text-left px-3.5 py-2.5 text-xs font-black text-[#006633] bg-emerald-50/80 hover:bg-emerald-100/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between border border-emerald-200 shadow-2xs"
      >
        <span>News & Savings Hub Overview</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
      </button>

      <div className="my-1 border-t border-slate-200"></div>

      {/* Sub-Hub Pages / Guides List matching desktop view */}
      <div className="space-y-1">
        {[
          { label: "Prize Bond Basics (Beginner's Guide)", param: "prize-bond-basics-pakistan" },
          { label: "How Prize Bonds Work", param: "how-prize-bonds-work" },
          { label: "How to Buy Prize Bonds", param: "how-to-buy-prize-bonds" },
          { label: "How to Check Prize Bonds", param: "how-to-check-prize-bonds" },
          { label: "Prize Bond Rules", param: "prize-bond-rules" },
          { label: "Prize Money & Tax Rates", param: "prize-money-and-tax" },
          { label: "How to Claim a Prize", param: "how-to-claim-a-prize" },
          { label: "Frequently Asked Questions", param: "frequently-asked-questions" },
        ].map((subItem, index) => (
          <button
            key={index}
            onClick={() => handleNavClick('information', subItem.param)}
            className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#006633] rounded-lg cursor-pointer transition-colors"
          >
            {subItem.label}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
          {/* Latest Draw CTA */}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('latest-draw')}
              className="w-full bg-[#006633] text-white py-3.5 rounded-xl font-black text-xs text-center shadow-xs cursor-pointer hover:bg-[#004D26] transition-colors"
            >
              LATEST DRAW
            </button>
          </div>
        </div>
      )}
    </header>
  );
};