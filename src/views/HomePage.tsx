'use client';

import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Search,
  Sparkles,
  Bookmark,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  FileText,
  ChevronDown,
  Building2,
  MapPin,
  Link,
  Banknote,    // <-- Yeh add karein
  Calculator,  // <-- Yeh add karein
  Newspaper,   // <-- Yeh add karein
} from 'lucide-react';
import {
  DENOMINATIONS,
  SCHEDULE_2026,
  LATEST_DRAWS,
  ARTICLES,
  FAQS,
} from '@/data/mockData';
import { AdSensePlaceholder } from '@/components/common/AdSensePlaceholder';
import { LastUpdatedBadge } from '@/components/common/LastUpdatedBadge';
import { StatsCounterWidget } from '@/components/common/StatsCounterWidget';
import { VideoGuideWidget } from '@/components/common/VideoGuideWidget';
import {
  DenominationInfo,
  DrawRecord,
  ScheduleItem,
  InfoArticle,
  FaqItem,
} from '@/types/prizebond';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  cmsContent?: Record<string, string>;
  isAdmin?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, cmsContent = {}, isAdmin = false }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Next scheduled draw lookup
  const nextDraw: ScheduleItem =
    SCHEDULE_2026.find((s: ScheduleItem) => s.isNextDraw) || SCHEDULE_2026[0];

  return (
    <div className="space-y-10 pb-16">
      {/* 01. HERO SECTION */}
      <section className="bg-gradient-to-r from-[#003B1D] via-[#004D26] to-[#003B1D] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Official National Savings & SBP Information Portal</span>
            </div>

            {/* Dynamic Hero Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {cmsContent.hero_title || 'Pakistan Prize Bond Results & Draw Schedule 2026'}
            </h1>

            {/* Dynamic Hero Subtitle */}
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Instantly check single numbers, bulk lists, and serial ranges against official State Bank of Pakistan gazettes. Access 2026 draw schedules, prize breakdowns, and tax rates.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {/* Dynamic Button Text */}
                <span>
                  Check Prize Bond →
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('results')}
                className="px-6 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs sm:text-sm rounded-xl border border-emerald-500/50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Results</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>2026 Schedule</span>
              </button>
            </div>
          </div>

          {/* Hero Quick Next Draw Card */}
          <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Next Draw Alert
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#006633] text-emerald-100 text-[10px] font-black uppercase">
                {nextDraw.day}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-white">
                Rs. {nextDraw.denomination} Prize Bond
              </div>
              <div className="text-xs font-mono font-bold text-amber-300">
                Draw #{nextDraw.drawNo} • {nextDraw.date}
              </div>
              <div className="text-xs text-emerald-100 flex items-center gap-1 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>SBP BSC {nextDraw.city} Field Office</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('draw-detail', nextDraw.id)}
              className="w-full py-2.5 bg-white hover:bg-emerald-50 text-[#004D26] font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              View Draw Schedule Specs →
            </button>
          </div>
        </div>
      </section>

      {/* 02. STATS COUNTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounterWidget />
      </div>

      {/* 03. CHECK PRIZE BOND TEASER & CTA CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#004D26] text-white p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-emerald-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Verified CDNS & SBP Gazette Checker Engine
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>Data Updated: 15 Aug 2026</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Check Your Prize Bond
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-medium">
                  Evaluate your 6-digit bond numbers against 10+ years of official State Bank of Pakistan gazettes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Launch Full Checker Tool →</span>
              </button>
            </div>
          </div>

          {/* Quick Option Cards */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50">
            <div
              onClick={() => onNavigate('checker')}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#006633] hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center font-bold">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#006633] transition-colors">
                Single Bond Check
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check an individual 6-digit bond number against the latest or historical draw gazette lists.
              </p>
              <div className="text-[11px] font-bold text-[#006633] pt-1 flex items-center gap-1">
                <span>Check Single Bond</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('checker')}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#006633] hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#006633] transition-colors">
                Multiple / Bulk List
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste up to 500 serial numbers at once to evaluate your entire prize bond collection.
              </p>
              <div className="text-[11px] font-bold text-[#006633] pt-1 flex items-center gap-1">
                <span>Check Bulk Numbers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('checker')}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#006633] hover:shadow-xs transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006633] flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#006633] transition-colors">
                By Series Range
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter continuous series brackets (e.g., 100001 to 100100) to search serial ranges in bulk.
              </p>
              <div className="text-[11px] font-bold text-[#006633] pt-1 flex items-center gap-1">
                <span>Search by Range</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSensePlaceholder slot="banner" />
      </div>

{/* 5. DENOMINATION HUBS */}
<section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-12 space-y-6">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
    <div>
      <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
        <Banknote className="w-4 h-4 text-emerald-600" /> Denomination Hubs
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
        Browse All Categories
      </h2>
    </div>
    <button
      type="button"
      onClick={() => onNavigate('results')}
      className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
    >
      <span>Browse All Categories &rarr;</span>
    </button>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {[
      { val: "100", label: "Rs. 100", date: "Aug 15, 2026", winner: "Rs. 700,000" },
      { val: "200", label: "Rs. 200", date: "Sep 15, 2026", winner: "Rs. 750,000" },
      { val: "750", label: "Rs. 750", date: "Oct 15, 2026", winner: "Rs. 1,500,000" },
      { val: "1500", label: "Rs. 1,500", date: "Nov 15, 2026", winner: "Rs. 3,000,000" },
      { val: "25000", label: "Rs. 25,000 Premium", date: "Dec 10, 2026", winner: "Rs. 30,000,000", premium: true },
      { val: "40000", label: "Rs. 40,000 Premium", date: "Sep 10, 2026", winner: "Rs. 80,000,000", premium: true }
    ].map((bond) => (
      <div
        key={bond.val}
        onClick={() => onNavigate('denomination', bond.val)}
        className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between group shadow-xs"
      >
        <div className="flex justify-between items-start">
          <span className={`text-xl font-black ${bond.premium ? 'text-amber-600' : 'text-slate-900'} group-hover:text-[#006633] transition-colors`}>
            {bond.label}
          </span>
          <span className="bg-emerald-50 text-[#004D26] text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
            Hub
          </span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span>Next Draw:</span>
            <strong className="text-slate-800">{bond.date}</strong>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
            <span>1st Prize:</span>
            <strong className="text-[#006633] font-mono">{bond.winner}</strong>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006633]">
          <span className="group-hover:underline">View Results</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    ))}
  </div>
</section>

{/* 6. FEATURE SHOWCASE CARDS */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-16">
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
      Explore Platform Features
    </h2>
  </div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {/* Card 1 */}
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs flex flex-col items-start text-left group">
      <div className="p-2.5 rounded-xl bg-emerald-50 text-[#006633] mb-4">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <h4 className="text-slate-900 font-extrabold text-base mb-1.5 group-hover:text-[#006633] transition-colors">Digital Bond Locker</h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-1">Save your bond numbers securely in browser storage and get auto-match alerts.</p>
      <button
        type="button"
        onClick={() => onNavigate('locker')}
        className="w-full bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs py-3 rounded-xl text-center transition-colors cursor-pointer shadow-xs"
      >
        Open My Locker
      </button>
    </div>
    {/* Card 2 */}
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs flex flex-col items-start text-left group">
      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 mb-4">
        <Calculator className="w-6 h-6" />
      </div>
      <h4 className="text-slate-900 font-extrabold text-base mb-1.5 group-hover:text-[#006633] transition-colors">Filer Net Tax Calculator</h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-1">Calculate exact FBR 15% vs 30% tax deductions on all prize tiers.</p>
      <button
        type="button"
        onClick={() => onNavigate('calculator')}
        className="w-full bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs py-3 rounded-xl text-center transition-colors cursor-pointer shadow-xs"
      >
        Calculate Tax
      </button>
    </div>
    {/* Card 3 */}
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs flex flex-col items-start text-left group">
      <div className="p-2.5 rounded-xl bg-emerald-50 text-[#006633] mb-4">
        <Newspaper className="w-6 h-6" />
      </div>
      <h4 className="text-slate-900 font-extrabold text-base mb-1.5 group-hover:text-[#006633] transition-colors">Print Gazette Scans</h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-1">Download official high-resolution newspaper scans and SBP PDFs.</p>
      <button
        type="button"
        onClick={() => onNavigate('newspaper')}
        className="w-full bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs py-3 rounded-xl text-center transition-colors cursor-pointer shadow-xs"
      >
        Browse Archives
      </button>
    </div>
    {/* Card 4 */}
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs flex flex-col items-start text-left group">
      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 mb-4">
        <MapPin className="w-6 h-6" />
      </div>
      <h4 className="text-slate-900 font-extrabold text-base mb-1.5 group-hover:text-[#006633] transition-colors">Draw Schedule 2026</h4>
      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 flex-1">Complete calendar of upcoming draws across Lahore, Karachi, Quetta & Peshawar.</p>
      <button
        type="button"
        onClick={() => onNavigate('schedule')}
        className="w-full bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs py-3 rounded-xl text-center transition-colors cursor-pointer shadow-xs"
      >
        View Calendar
      </button>
    </div>
  </div>
</section>
    
      {/* VIDEO GUIDE WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VideoGuideWidget onNavigate={onNavigate} />
      </section>

      {/* 06. EDUCATIONAL ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Educational Guides
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Prize Bond Guides & Rules
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('information', 'hub')}
            className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Knowledge Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.slice(0, 3).map((art: InfoArticle) => (
            <div
              key={art.slug}
              onClick={() => onNavigate('information', art.slug)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#006633] bg-emerald-100 px-2.5 py-0.5 rounded">
                  {art.category}
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {art.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006633]">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 07. FAQS ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" /> FAQ Knowledge Desk
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('faqs')}
              className="text-xs font-bold text-[#006633] hover:underline cursor-pointer"
            >
              View All FAQs →
            </button>
          </div>

          <div className="space-y-3">
            {FAQS.slice(0, 4).map((faq: FaqItem) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#006633]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 08. TRUST FOOTER STAMP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#006633] shrink-0" />
            <div>
              <div className="font-extrabold text-slate-900">
                Official CDNS & SBP Gazette Data Synchronization
              </div>
              <div className="text-[11px] text-slate-500">
                All draw results and schedule records are cross-audited against signed official government publications.
              </div>
            </div>
          </div>
          <LastUpdatedBadge date="15 August 2026" />
        </div>
      </div>
    </div>
  );
};