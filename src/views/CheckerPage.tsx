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

      {/* 07. HISTORICAL DRAW CHECKER SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
              Historical Draw Archives
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Check Previous Draw Results by Year
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Access published winning lists for past draws from 2022 through 2026 for all denominations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={histDenom}
              onChange={(e) => setHistDenom(e.target.value as DenominationValue)}
              className="bg-slate-50 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl text-slate-800 focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              {DENOMINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  Rs. {d.value}
                </option>
              ))}
            </select>

            <select
              value={histYear}
              onChange={(e) => setHistYear(e.target.value)}
              className="bg-slate-50 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl text-slate-800 focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="2026">2026 Draws</option>
              <option value="2025">2025 Draws</option>
              <option value="2024">2024 Draws</option>
              <option value="2023">2023 Draws</option>
              <option value="2022">2022 Draws</option>
            </select>
          </div>
        </div>

        {/* Historical Draws Grid */}
        {historicalDraws.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historicalDraws.map((draw) => (
              <div
                key={draw.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#006633] bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Draw #{draw.drawNo}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{draw.formattedDate}</span>
                </div>

                <div>
                  <div className="text-sm font-black text-slate-900">
                    Rs. {draw.denomination} — {draw.city}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    1st Prize: <strong>{draw.prizeStructure.firstAmountFormatted}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    1st No: <strong>{draw.firstPrizeNumbers[0]}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('results', draw.denomination)}
                    className="text-[#006633] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Gazette</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No specific draw records found for Rs. {histDenom} in {histYear}. Select another year or denomination above.
          </div>
        )}
      </section>

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

      {/* 10. SUPPORTED PRIZE BONDS GRID */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            All Pakistani Denominations
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Supported Prize Bond Denominations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Our automated checker fully supports all 6 National Savings & State Bank of Pakistan Prize Bonds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DENOMINATIONS.map((denom) => (
            <div
              key={denom.value}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#006633] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {denom.formattedAmount}
                  </span>
                  {denom.isPremium && (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                      Premium
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900">{denom.label}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{denom.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs space-y-1 text-slate-700 font-semibold">
                  <div>1st Prize: <strong className="text-[#006633]">{denom.firstPrize}</strong></div>
                  <div>Frequency: <span className="text-slate-500">{denom.drawFrequency}</span></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('checker-tool-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 bg-[#006633] text-white hover:bg-[#004D26] font-bold rounded-lg cursor-pointer"
                >
                  Check Rs. {denom.value}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('denomination', denom.value)}
                  className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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

      {/* 13. PRIZE BOND INFORMATION & GUIDES */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Knowledge Base & Educational Guides
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Essential Guides for Prize Bond Holders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Learn about claim procedures, tax deductions, and official SBP regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.slice(0, 3).map((art) => (
            <div
              key={art.slug}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006633] bg-emerald-100 px-2.5 py-0.5 rounded">
                  {art.category}
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{art.readTime}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('information', art.slug)}
                  className="text-[#006633] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 14. AEO / DIRECT ANSWER BLOCK */}
      <section className="bg-emerald-50/80 rounded-2xl p-6 sm:p-8 border border-emerald-200 space-y-3">
        <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-[#006633]" />
          <span>Direct Answer / Search Summary</span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          How does the Prize Bond Checker work?
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          The PrizeBond Pakistan online checker compares user-submitted 6-digit bond numbers against the official published winning draw lists issued by the Central Directorate of National Savings (CDNS) and the State Bank of Pakistan (SBP). Users can select their denomination (Rs. 100, 200, 750, 1500, 25,000, 40,000) and evaluate single bonds, bulk lists, or serial ranges against latest or historical draw gazettes instantly.
        </p>
      </section>

      {/* 15. SEO CONTENT & EDUCATIONAL SECTION */}
      <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Prize Bond Checker Pakistan — Fast & Accurate Results Verification
        </h2>
        <p>
          Checking Prize Bond draw results in Pakistan has evolved significantly. Historically, bondholders relied on physical printed gazettes or local newspaper supplements published days after draw events. PrizeBond Pakistan provides an online utility to evaluate bond numbers against official gazette databases instantly.
        </p>
        
        <h3 className="text-base font-bold text-slate-900 pt-2">
          Supported Denominations and Coverage
        </h3>
        <p>
          Our checker engine supports all six official National Prize Bond denominations issued by the Government of Pakistan under CDNS and SBP-BSC rules: Rs. 100, Rs. 200, Rs. 750, Rs. 1,500, Rs. 25,000 Premium, and Rs. 40,000 Premium Registered Bonds.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">
          Data Integrity & Safety
        </h3>
        <p>
          All draw records are cross-verified against official gazettes released at State Bank of Pakistan field offices in Karachi, Lahore, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Hyderabad, Sialkot, and Muzaffarabad. Unclaimed prize money remains claimable for up to six years from the date of draw publication under Central Directorate rules.
        </p>
      </article>

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