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
  TrendingUp,
  HelpCircle,
  FileText,
  ChevronDown,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  DENOMINATIONS,
  SCHEDULE_2026,
  LATEST_DRAWS,
  ARTICLES,
  FAQS,
} from '@/data/mockData';
import { BondCheckerTool } from '@/components/checker/BondCheckerTool';
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
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Pakistan Prize Bond Results & Draw Schedule 2026
            </h1>

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
                <span>Check Prize Bond</span>
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

      {/* 03. EMBEDDED BOND CHECKER TOOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BondCheckerTool onNavigate={onNavigate} />
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSensePlaceholder slot="banner" />
      </div>

      {/* 04. LATEST DRAW HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Gazette Highlights
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Prize Bond Draw Results
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Results Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LATEST_DRAWS.slice(0, 3).map((dr: DrawRecord) => (
            <div
              key={dr.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-100 text-[#004D26] font-black text-xs rounded-lg">
                    Rs. {dr.denomination} Bond
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Draw #{dr.drawNo}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-bold uppercase">1st Prize Winner:</div>
                  <div className="text-xl font-black text-[#006633] font-mono tracking-wider">
                    {dr.firstPrizeNumbers[0]}
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Amount: {dr.prizeStructure.firstAmountFormatted}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                  <div>Date: <strong className="text-slate-800">{dr.formattedDate}</strong></div>
                  <div>City: <strong className="text-slate-800">{dr.city}</strong></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigate('results', dr.denomination)}
                  className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Winning List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('checker', dr.denomination)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Check In Tool
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05. PRIZE BOND DENOMINATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Active Bond Types
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Prize Bond Denominations
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Denominations Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DENOMINATIONS.map((denom: DenominationInfo) => (
            <div
              key={denom.value}
              onClick={() => onNavigate('denomination', denom.value)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#006633] hover:shadow-xs transition-all cursor-pointer space-y-2 group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    denom.isPremium ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-[#004D26]'
                  }`}
                >
                  {denom.isPremium ? 'Premium' : 'Bearer'}
                </span>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                  {denom.formattedAmount}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  1st: {denom.firstPrize.split(' ')[0]}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-bold text-[#006633] group-hover:underline flex items-center justify-between">
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
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