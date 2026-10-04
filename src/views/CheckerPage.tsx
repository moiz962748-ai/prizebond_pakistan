'use client';

import React, { useState } from 'react';
import { BondCheckerTool } from '../components/checker/BondCheckerTool';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';
import {
  ShieldCheck,
  Calendar,
  ArrowRight,
  Search,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  BookOpen,
  ExternalLink,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Info,
  Check,
  Building2,
  ListChecks,
} from 'lucide-react';
import { DENOMINATIONS, FAQS, ARTICLES, SCHEDULE_2026 } from '../data/mockData';
import { ALL_DRAW_RESULTS } from '../data/resultsData';
import { DenominationValue } from '../types/prizebond';

interface CheckerPageProps {
  initialNumber?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const CheckerPage: React.FC<CheckerPageProps> = ({ initialNumber = '', onNavigate }) => {
  // Historical drawer progressive disclosure state
  const [histDenom, setHistDenom] = useState<DenominationValue>('1500');
  const [histYear, setHistYear] = useState<string>('2026');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Filter historical draws for selected denomination and year
  const historicalDraws = ALL_DRAW_RESULTS.filter(
    (d) => d.denomination === histDenom && d.date.startsWith(histYear)
  );

  // Next upcoming draw info for schedule banner
  const nextDraw = SCHEDULE_2026.find((s) => s.isNextDraw) || SCHEDULE_2026[15];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 02. BREADCRUMB NAVIGATION */}
      <Breadcrumbs
        items={[
          { label: 'Prize Bond Checker' },
        ]}
      />

      {/* 03. HERO SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-60" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" /> Official Gazette Verification Tool
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Prize Bond Checker
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Check your Prize Bond number against published Prize Bond draw results in Pakistan. Fast, accurate, and updated directly from Central Directorate of National Savings (CDNS) & State Bank of Pakistan records.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> Single & Bulk Check
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> Series Range Search
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> 10+ Years Draw Archives
            </span>
          </div>
        </div>
      </div>

      {/* 04 & 05. PRIMARY CHECKER TOOL & RESULT AREA */}
      <BondCheckerTool initialNumber={initialNumber} onNavigate={onNavigate} />

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />



      {/* 08 & 09. HOW THE CHECKER WORKS & WHAT INFORMATION YOU NEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* How the Checker Works */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
              User Instruction Guide
            </div>
            <h2 className="text-xl font-black text-slate-900">
              How the Prize Bond Checker Works
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your winning status in 3 simple, fast steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#006633] text-white font-black text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-xs text-slate-900">Select Denomination</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose your exact Prize Bond value (Rs. 100, 200, 750, 1500, 25k or 40k).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#006633] text-white font-black text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-xs text-slate-900">Enter Bond Number</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Type your 6-digit number, paste a bulk list, or define a range series.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#006633] text-white font-black text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-xs text-slate-900">Check Results</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Click Check to compare against official CDNS published winning gazettes instantly.
              </p>
            </div>
          </div>
        </div>

        {/* What Information You Need */}
        <div className="bg-[#003B1D] text-white rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              <Info className="w-3 h-3" /> Quick Checklist
            </div>
            <h3 className="text-lg font-black text-white">
              What Information You Need
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Physical Prize Bond Certificate face value</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>6-digit serial number printed on bond face</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Draw date or year (Optional for general search)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-emerald-800">
            <button
              type="button"
              onClick={() => onNavigate('information', 'how-to-check-prize-bonds')}
              className="text-amber-300 hover:text-white font-extrabold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Read Detailed Checking Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      
      {/* 12. DRAW SCHEDULE CONNECTION BANNER */}
      <section className="bg-gradient-to-r from-[#003B1D] via-[#004D26] to-[#003B1D] text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-600/40">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-900 border border-emerald-600/50 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-300" /> Upcoming Draw Schedule
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            When is the Next Prize Bond Draw?
          </h2>

          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Next Draw: <strong>Rs. {nextDraw.denomination} Prize Bond (Draw #{nextDraw.drawNo})</strong> scheduled for <strong>{nextDraw.date}</strong> at <strong>{nextDraw.city}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('schedule')}
          className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shrink-0 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <span>View 2026 Full Draw Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      
      
      {/* 16. FAQ ACCORDION SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Prize Bond Checker FAQs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Answers to common questions about checking Prize Bonds online.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left font-black text-sm text-slate-900 flex items-center justify-between gap-4 hover:text-[#006633] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#006633] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* VIDEO GUIDE WIDGET */}
      <VideoGuideWidget
        categoryBadge="🎬 BOND CHECKER TUTORIAL"
        title="Video Guide: How to Check Prize Bond Numbers Online in Bulk"
        subtitle="Watch our 1-minute walkthrough to learn how to search single numbers, range series, or upload lists to verify winning results instantly."
        summaryTitle="📌 Online Checker Protocol Summary"
        summaryItems={[
          {
            title: 'Bulk & Series Search',
            desc: 'Search individual numbers or continuous series (e.g., 100000 to 100999) across 10+ years of draws.',
          },
          {
            title: 'Instant Gazette Match',
            desc: 'Direct comparison against signed official gazette lists published by SBP BSC.',
          },
          {
            title: 'FBR Tax Calculation',
            desc: 'Auto-calculate 15% Filer vs 30% Non-Filer withholding tax deductions on prize claims.',
          },
          {
            title: 'Claim Record Export',
            desc: 'Save your winning search results for submission at State Bank offices.',
          },
        ]}
        duration="02:30"
        onNavigate={onNavigate}
      />

      {/* 17. TRUST / SOURCE / LAST UPDATED FOOTER BLOCK */}
      <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#006633] shrink-0" />
          <div>
            <div className="font-extrabold text-slate-900">
              Official Source Verification & Transparency Statement
            </div>
            <div className="text-[11px] text-slate-500">
              Draw results are compiled directly from gazettes published by CDNS & SBP BSC. Not affiliated with SBP.
            </div>
          </div>
        </div>

        <div className="text-right text-[11px] font-bold text-slate-500 shrink-0">
          Last Database Update: 15 August 2026
        </div>
      </div>
    </div>
  );
};