'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Calculator,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Award,
  Calendar,
  Search,
  Sparkles,
  Layers,
  Banknote,
  Info,
  Clock,
  Compass,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  MessageSquare,
  UserCheck,
  Share2,
  Printer,
  X,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { ARTICLES, FAQS, DENOMINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';

interface InformationPageProps {
  slug?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const InformationPage: React.FC<InformationPageProps> = ({
  slug,
  onNavigate,
}) => {
  // If slug is provided and is NOT 'hub' or 'index', we show the guide article view.
  // If slug is null, undefined, 'hub', or 'index', we show the master INFORMATION HUB view.
  const isHubView = !slug || slug === 'hub' || slug === 'index';

  const currentArticle = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];

  // Article Table of Contents Mobile Collapsible state
  const [tocOpenMobile, setTocOpenMobile] = useState<boolean>(true);

  // Correction Modal state
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [correctionNote, setCorrectionNote] = useState<string>('');
  const [correctionSubmitted, setCorrectionSubmitted] = useState<boolean>(false);

  // Quick Checker Mini-Tool state (used on checking articles)
  const [miniDenom, setMiniDenom] = useState<string>('1500');
  const [miniBondNo, setMiniBondNo] = useState<string>('748291');
  const [miniCheckResult, setMiniCheckResult] = useState<{
    searched: boolean;
    isWinner: boolean;
    prizeDetails?: string;
  }>({ searched: false, isWinner: false });

  const handleMiniCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniBondNo.trim()) return;
    // Simple deterministic test
    const num = parseInt(miniBondNo, 10);
    const won = num % 7 === 0 || num === 748291;
    setMiniCheckResult({
      searched: true,
      isWinner: won,
      prizeDetails: won
        ? `1st Prize Winner! Rs. 3,000,000 in Draw #102 (${miniDenom} Denomination)`
        : 'No winnings found for this number in recent draws.',
    });
  };

  // AEO Direct Answer Q&A dataset
  const aeoAnswers = [
    {
      q: 'What are Prize Bonds in Pakistan?',
      a: 'Prize Bonds are capital-guaranteed financial security certificates issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP). The principal money never depreciates, and bondholders participate in quarterly lucky draw events for cash prizes.',
      link: 'prizebonds',
      linkLabel: 'Explore Denominations',
    },
    {
      q: 'How do Prize Bond draws work?',
      a: 'Draws are conducted every 3 months for each active denomination at State Bank field offices on a rotating schedule across major cities. Winning numbers are drawn using computerized randomized machinery under supervision of an independent committee.',
      link: 'schedule',
      linkLabel: 'View Draw Schedule',
    },
    {
      q: 'How can I check a Prize Bond?',
      a: 'You can check your Prize Bond by entering your 6-digit serial number, pasting bulk lists, or entering series ranges on our automated online checker tool, which instantly searches 10+ years of official SBP gazette records.',
      link: 'checker',
      linkLabel: 'Open Prize Bond Checker',
    },
    {
      q: 'Where can I find Prize Bond results?',
      a: 'Official winning numbers are published in government gazettes immediately after each draw. You can view, search, or download complete gazette lists directly on our Results Hub.',
      link: 'results',
      linkLabel: 'View Results Hub',
    },
  ];

  // Tax Calculator State for Tax Article
  const [calcWinnings, setCalcWinnings] = useState<number>(3000000);
  const [isFiler, setIsFiler] = useState<boolean>(true);

  const taxRate = isFiler ? 0.15 : 0.3;
  const taxAmount = calcWinnings * taxRate;
  const netAmount = calcWinnings - taxAmount;

  // Article FAQ Expandable state
  const [openFaqId, setOpenFaqId] = useState<string | null>('art-faq-0');

  // Article prev & next calculation
  const currentIndex = ARTICLES.findIndex((a) => a.slug === currentArticle.slug);
  const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

  // Filter related articles (3-4 items)
  const relatedArticles = ARTICLES.filter((a) => a.slug !== currentArticle.slug).slice(0, 3);

  // Smooth scroll to anchor ID
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // IF USER IS VIEWING A SPECIFIC GUIDE ARTICLE
  if (!isHubView && currentArticle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* 02. BREADCRUMB */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
          <Breadcrumbs
            items={[
              { label: 'Home', onClick: () => onNavigate('home') },
              { label: 'Information', onClick: () => onNavigate('information', 'hub') },
              { label: 'Prize Bond Guides', onClick: () => onNavigate('information', 'hub') },
              { label: currentArticle.title },
            ]}
          />
          <button
            type="button"
            onClick={() => onNavigate('information', 'hub')}
            className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            ← Back to Information Hub
          </button>
        </div>

        {/* 03 & 04 & 05 & 06 & 07: ARTICLE LAYOUT (MAIN CONTENT + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Reading Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 03. ARTICLE HERO */}
            <header className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-[#004D26] text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#006633]" /> {currentArticle.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {currentArticle.readTime}
                  </span>
                  <LastUpdatedBadge date={currentArticle.lastUpdated} />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {currentArticle.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {currentArticle.shortSummary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-[#006633]" /> Official SBP & CDNS Data
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Fact Checked by Financial Editorial Desk
                </span>
              </div>
            </header>

            {/* 04. QUICK ANSWER */}
            <section className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-6 rounded-2xl border-2 border-emerald-200 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#004D26] text-xs sm:text-sm font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Quick Answer</span>
              </div>

              <div className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed bg-white/80 p-4 rounded-xl border border-emerald-100 shadow-xs">
                {currentArticle.shortSummary}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" /> Concise answer optimized for instant search verification.
                </span>

                {/* Primary Quick CTA */}
                {currentArticle.slug === 'how-to-check-prize-bonds' ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('checker')}
                    className="px-3.5 py-1.5 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-extrabold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Open Prize Bond Checker →
                  </button>
                ) : currentArticle.slug === 'prize-money-and-tax' ? (
                  <button
                    type="button"
                    onClick={() => scrollToAnchor('tax-calculator-widget')}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Calculate Your Tax Deduction →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('schedule')}
                    className="px-3.5 py-1.5 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-extrabold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    View Draw Schedule →
                  </button>
                )}
              </div>
            </section>

            {/* 05. TABLE OF CONTENTS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-[#006633]" />
                  <span>On This Page (Table of Contents)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTocOpenMobile(!tocOpenMobile)}
                  className="sm:hidden text-xs font-bold text-[#006633] flex items-center gap-1 cursor-pointer"
                >
                  {tocOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {tocOpenMobile && (
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-1">
                  {currentArticle.sections.map((sec, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToAnchor(`art-section-${idx}`)}
                      className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#006633] border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate pr-2">
                        <span className="text-[#006633] font-mono mr-1.5">{idx + 1}.</span>
                        {sec.heading}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* AdSense Placement */}
            <AdSensePlaceholder slot="banner" />

            {/* INTERACTIVE WIDGET 1: TAX CALCULATOR */}
            {(currentArticle.slug === 'prize-money-and-tax' || currentArticle.slug === 'how-to-claim-a-prize') && (
              <div
                id="tax-calculator-widget"
                className="p-6 rounded-2xl bg-slate-900 text-white shadow-md space-y-4 border border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-black text-white">
                      Interactive Prize Bond Tax Calculator
                    </h3>
                    <p className="text-xs text-slate-300">
                      Compute exact tax deduction and net payout under Section 156 of Income Tax Ordinance 2001.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label htmlFor="tax-prize-amount" className="block text-slate-300 font-bold mb-1">
                      Gross Winning Prize Amount (PKR)
                    </label>
                    <input
                      id="tax-prize-amount"
                      type="number"
                      value={calcWinnings}
                      onChange={(e) => setCalcWinnings(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 text-white font-mono text-sm font-bold p-3 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="taxpayer-status-select" className="block text-slate-300 font-bold mb-1">
                      FBR Taxpayer Status (ATL List)
                    </label>
                    <select
                      id="taxpayer-status-select"
                      value={isFiler ? 'filer' : 'non-filer'}
                      onChange={(e) => setIsFiler(e.target.value === 'filer')}
                      className="w-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold p-3 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="filer">Active Tax Filer (15% Tax Rate)</option>
                      <option value="non-filer">Non-Filer / Inactive (30% Tax Rate)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Gross Winning</div>
                    <div className="text-xs sm:text-sm font-mono font-black text-white mt-0.5">
                      Rs. {calcWinnings.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-amber-400 uppercase">
                      Tax Deduction ({taxRate * 100}%)
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-black text-amber-400 mt-0.5">
                      - Rs. {taxAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">Net Payout</div>
                    <div className="text-xs sm:text-sm font-mono font-black text-emerald-400 mt-0.5">
                      Rs. {netAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INTERACTIVE WIDGET 2: MINI BOND CHECKER */}
            {currentArticle.slug === 'how-to-check-prize-bonds' && (
              <div className="p-6 rounded-2xl bg-emerald-950 text-white shadow-md space-y-4 border border-emerald-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black text-white">
                      Try Quick Prize Bond Check
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900 px-2.5 py-1 rounded-full border border-emerald-700">
                    Live Demo
                  </span>
                </div>

                <form onSubmit={handleMiniCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label htmlFor="mini-denom-select" className="block text-slate-300 font-bold mb-1">
                      Denomination
                    </label>
                    <select
                      id="mini-denom-select"
                      value={miniDenom}
                      onChange={(e) => setMiniDenom(e.target.value)}
                      className="w-full bg-emerald-900 border border-emerald-700 text-white text-xs font-bold p-2.5 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="100">Rs. 100</option>
                      <option value="200">Rs. 200</option>
                      <option value="750">Rs. 750</option>
                      <option value="1500">Rs. 1,500</option>
                      <option value="25000">Rs. 25,000 Premium</option>
                      <option value="40000">Rs. 40,000 Premium</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mini-bond-no-input" className="block text-slate-300 font-bold mb-1">
                      6-Digit Bond Number
                    </label>
                    <input
                      id="mini-bond-no-input"
                      type="text"
                      maxLength={6}
                      value={miniBondNo}
                      onChange={(e) => setMiniBondNo(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 748291"
                      className="w-full bg-emerald-900 border border-emerald-700 text-white font-mono text-sm font-bold p-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Check Number →
                    </button>
                  </div>
                </form>

                {miniCheckResult.searched && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold ${
                      miniCheckResult.isWinner
                        ? 'bg-amber-400 text-slate-950 border border-amber-500'
                        : 'bg-emerald-900/80 text-emerald-100 border border-emerald-700'
                    }`}
                  >
                    {miniCheckResult.prizeDetails}
                  </div>
                )}
              </div>
            )}

            {/* 06. ARTICLE EDITORIAL CONTENT */}
            <article className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentArticle.sections.map((sec, idx) => (
                <section
                  key={idx}
                  id={`art-section-${idx}`}
                  className="space-y-4 scroll-mt-24 border-b border-slate-100 pb-8 last:border-0 last:pb-0"
                >
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#006633] font-mono text-base font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      #{idx + 1}
                    </span>
                    {sec.heading}
                  </h2>

                  <p className="text-slate-700 leading-relaxed font-normal">{sec.content}</p>

                  {/* Bullet Points */}
                  {sec.bulletPoints && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 my-4">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0 mt-0.5" />
                          <span className="font-medium">{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Responsive Table */}
                  {sec.tableData && (
                    <div className="my-5 overflow-hidden border border-slate-200 rounded-2xl shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-900 text-white font-extrabold">
                              {sec.tableData.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3.5 border-b border-slate-800">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium bg-white">
                            {sec.tableData.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-emerald-50/40 transition-colors">
                                {row.map((c, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`p-3.5 ${
                                      cIdx === 0
                                        ? 'font-bold text-slate-900 bg-slate-50/50'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </article>

            {/* 07. CONTEXTUAL CTA */}
            <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#004D26] to-[#006633] text-white shadow-md space-y-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  Verified Government Utility
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Ready to Check Your Prize Bond Winnings?
                </h3>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Search single numbers, series ranges, or bulk lists against 10+ years of official SBP gazette results on our automated checker.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all cursor-pointer text-center"
                >
                  Open Prize Bond Checker →
                </button>
              </div>
            </section>

            {/* 08. SOURCES & REFERENCES */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-[#006633]" />
                <span>Sources & Official References</span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Information in this guide is derived directly from official gazettes and statutory regulations issued by the Government of Pakistan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href="https://www.sbp.org.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-slate-800 font-bold group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-[#006633] shrink-0" />
                    <span className="truncate">State Bank of Pakistan (SBP BSC)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006633] shrink-0" />
                </a>

                <a
                  href="https://savings.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-slate-800 font-bold group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Award className="w-4 h-4 text-[#006633] shrink-0" />
                    <span className="truncate">Central Directorate of National Savings</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006633] shrink-0" />
                </a>

                <a
                  href="https://fbr.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-slate-800 font-bold group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Calculator className="w-4 h-4 text-[#006633] shrink-0" />
                    <span className="truncate">FBR Income Tax Ordinance 2001 (Sec 156)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006633] shrink-0" />
                </a>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Verified Gazette Release Date: {currentArticle.lastUpdated}</span>
                </div>
              </div>
            </section>

            {/* 09. EDITORIAL / AUTHOR INFORMATION */}
            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006633] text-white flex items-center justify-center font-black text-sm shrink-0">
                    PB
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Written & Fact-Checked by PrizeBond Pakistan Research Desk
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Official Gazette Editors & Financial Information Specialists
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(true)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Found an error? Report correction
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                PrizeBond Pakistan is an independent informational portal dedicated to clear, reliable Prize Bond draw results and guidance. We maintain strict separation from commercial gambling and verify all data against State Bank gazettes.
              </p>
            </section>

            {/* 10. FAQ SECTION */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#006633]" />
                <span>Frequently Asked Questions Regarding {currentArticle.title}</span>
              </div>

              <div className="space-y-3">
                {FAQS.slice(0, 4).map((f, fIdx) => {
                  const faqKey = `art-faq-${fIdx}`;
                  const isOpen = openFaqId === faqKey;
                  return (
                    <div
                      key={f.id}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faqKey)}
                        className="w-full text-left p-4 bg-slate-50/80 hover:bg-slate-100 text-xs font-extrabold text-slate-900 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span>{f.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                          {f.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 13. PREVIOUS / NEXT ARTICLE NAVIGATION */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {prevArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate('information', prevArticle.slug)}
                  className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all space-y-1 group cursor-pointer"
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    ← Previous Guide
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#006633] truncate">
                    {prevArticle.title}
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <button
                  type="button"
                  onClick={() => onNavigate('information', nextArticle.slug)}
                  className="p-4 bg-white hover:bg-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-right transition-all space-y-1 group cursor-pointer"
                >
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                    Next Guide →
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#006633] truncate">
                    {nextArticle.title}
                  </div>
                </button>
              ) : (
                <div />
              )}
            </nav>
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-6">
            {/* 12. RELATED TOOLS */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md border border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Useful Tools & Pages
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Access official verification tools and draw result repositories.
              </p>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="w-full p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer shadow-xs"
                >
                  <span>Prize Bond Checker</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('results')}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Draw Results Hub</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('schedule')}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>2026 Draw Schedule</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('prizebonds')}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Prize Bond Denominations</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 11. RELATED ARTICLES */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Related Information Guides
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((art) => (
                  <button
                    key={art.slug}
                    type="button"
                    onClick={() => onNavigate('information', art.slug)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all space-y-1 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span className="text-[#006633] uppercase font-mono">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#006633] transition-colors leading-snug">
                      {art.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AdSense Sidebar Slot */}
            <AdSensePlaceholder slot="sidebar" />
          </aside>
        </div>

        {/* CORRECTION REPORT MODAL */}
        {showCorrectionModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 relative">
              <button
                type="button"
                onClick={() => {
                  setShowCorrectionModal(false);
                  setCorrectionSubmitted(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Report Information Error
                </h3>
              </div>

              {!correctionSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCorrectionSubmitted(true);
                  }}
                  className="space-y-3 text-xs"
                >
                  <p className="text-slate-600 font-medium">
                    Help us maintain 100% factual accuracy. If you noticed an outdated rule or mistake in <strong>{currentArticle.title}</strong>, please describe it below:
                  </p>

                  <textarea
                    rows={4}
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    placeholder="Describe the discrepancy or quote the incorrect paragraph..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:border-[#006633]"
                    required
                  />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCorrectionModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-emerald-50 text-[#004D26] rounded-xl text-xs font-bold space-y-2 text-center">
                  <Check className="w-6 h-6 text-[#006633] mx-auto" />
                  <div>Thank you! Your correction report has been received by our editorial team.</div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCorrectionModal(false);
                      setCorrectionSubmitted(false);
                      setCorrectionNote('');
                    }}
                    className="mt-2 px-4 py-1.5 bg-[#006633] text-white rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // MASTER INFORMATION HUB VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 02. BREADCRUMB */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Information' },
        ]}
      />

      {/* 03. HERO */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-80" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#006633]" /> Official Knowledge & Information Directory
            </span>
            <LastUpdatedBadge date="15 August 2026" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Prize Bond Information
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Understand Prize Bond denominations, prizes, draws, results and how to check your Prize Bond using clear, verified government facts and interactive tools.
          </p>
        </div>
      </section>

      {/* 04. START HERE */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Beginner&apos;s Guidance Path
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              New to Prize Bonds? Start Here
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max">
            5-Step Guided Journey
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('information', 'how-prize-bonds-work')}
            className="p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006633] font-mono bg-emerald-100 px-2 py-0.5 rounded">
                01
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#006633] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-black text-slate-900 group-hover:text-[#006633] transition-colors">
              Understand Prize Bonds
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Learn basics, security guarantee, and ownership rules.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006633] font-mono bg-emerald-100 px-2 py-0.5 rounded">
                02
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#006633] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-black text-slate-900 group-hover:text-[#006633] transition-colors">
              Explore Denominations
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Browse Rs. 100 to Rs. 40,000 Premium categories.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('information', 'prize-money-and-tax')}
            className="p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006633] font-mono bg-emerald-100 px-2 py-0.5 rounded">
                03
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#006633] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-black text-slate-900 group-hover:text-[#006633] transition-colors">
              Understand Draws & Prizes
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Prize amounts, draw cycles, and tax deduction rates.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="p-4 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#006633] font-mono bg-emerald-100 px-2 py-0.5 rounded">
                04
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#006633] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-black text-slate-900 group-hover:text-[#006633] transition-colors">
              Check Gazette Results
            </h3>
            <p className="text-[11px] text-slate-500 leading-snug">
              Access official published SBP draw gazette lists.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('checker')}
            className="p-4 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200 transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white font-mono bg-[#006633] px-2 py-0.5 rounded">
                05
              </span>
              <ArrowRight className="w-4 h-4 text-[#006633] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-xs font-black text-[#004D26] group-hover:text-emerald-950 transition-colors">
              Check Your Bond
            </h3>
            <p className="text-[11px] text-slate-600 leading-snug">
              Enter serial numbers for instant automated matching.
            </p>
          </button>
        </div>
      </section>

      {/* 05. MAIN INFORMATION TOPICS DIRECTORY */}
      <section className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Structured Directory
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Main Information Directory
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Click any topic card to explore factual guides and transition directly to tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Prize Bond Basics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain what Prize Bonds are, capital safety, issuer authority (CDNS & SBP), and ownership rules.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('information', 'how-prize-bonds-work')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                Learn About Prize Bonds
              </button>
              <button
                type="button"
                onClick={() => onNavigate('information', 'how-prize-bonds-work')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: How Bonds Work</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Prize Bond Denominations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore available denominations from Rs. 100 bearer bonds up to Rs. 40,000 Premium registered bonds.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('prizebonds')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                View Prize Bonds
              </button>
              <button
                type="button"
                onClick={() => onNavigate('prizebonds')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: View All Categories</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Prize Bond Draws
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain how quarterly draws work, SBP draw locations, computerized randomized machinery, and committees.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                Learn About Draws
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: View Draw Schedule</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Prize Structure
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain prize categories (1st, 2nd, 3rd) and denomination-specific prize money distribution payouts.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('information', 'prize-money-and-tax')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                View Prize Structure
              </button>
              <button
                type="button"
                onClick={() => onNavigate('prizebonds')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: Prize Bond Hub</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#004D26] text-white rounded-xl flex items-center justify-center font-black text-sm">
                05
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Regular vs Premium
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain factual differences between physical bearer bonds and registered Premium bonds with direct profits.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('information', 'how-prize-bonds-work')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                Compare Prize Bonds
              </button>
              <button
                type="button"
                onClick={() => onNavigate('prizebonds')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: Compare Categories</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#004D26] text-white rounded-xl flex items-center justify-center font-black text-sm">
                06
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                How to Check
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain the automated checking process for single bond numbers, bulk lists, and continuous serial ranges.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('information', 'how-to-check-prize-bonds')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                Learn How to Check
              </button>
              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: Open Checker</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#004D26] text-white rounded-xl flex items-center justify-center font-black text-sm">
                07
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Prize Bond Results
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explain how users can locate official published gazettes, verify 1st/2nd/3rd prize winners, and download PDF lists.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('results')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                View Results
              </button>
              <button
                type="button"
                onClick={() => onNavigate('results')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: View Gazette Results</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-[#004D26] text-white rounded-xl flex items-center justify-center font-black text-sm">
                08
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                Knowledge FAQs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Common questions regarding taxes, claim deadlines, lost bonds, encashment banks, and CDNS regulations.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('faqs')}
                className="w-full py-2 bg-[#006633] hover:bg-[#004D26] text-white text-xs font-black rounded-xl transition-colors cursor-pointer text-center block"
              >
                View FAQs
              </button>
              <button
                type="button"
                onClick={() => onNavigate('faqs')}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-[#006633] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Functional Bridge: Open All FAQs</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 06. PRIZE BOND DENOMINATIONS PREVIEW */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Denomination Preview
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Active Prize Bond Denominations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="px-4 py-2 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 w-max"
          >
            <span>View All Prize Bonds</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DENOMINATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => onNavigate('denomination', d.value)}
              className="p-3.5 bg-slate-50 hover:bg-emerald-50/80 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left space-y-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    d.isPremium ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {d.isPremium ? 'Premium' : 'Bearer'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006633] transition-colors" />
              </div>

              <div>
                <strong className="text-xs font-black text-slate-900 group-hover:text-[#006633] block">
                  {d.label}
                </strong>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  1st: {d.firstPrize}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 07. HOW THE SYSTEM WORKS */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
            System Process Workflow
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How PrizeBonds Pakistan Works
          </h2>
          <p className="text-xs text-slate-300">
            A simple 4-step workflow guiding users from selecting denominations to verifying prize status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 text-center space-y-2 relative">
            <div className="w-8 h-8 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Choose Denomination
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Select your bond value (Rs. 100 to 40,000 Premium) to view specifications.
            </p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 text-center space-y-2 relative">
            <div className="w-8 h-8 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Find Draw
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Check upcoming draw schedules and field office venue announcements.
            </p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 text-center space-y-2 relative">
            <div className="w-8 h-8 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              View Result
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Access published official SBP winning gazette lists for any draw date.
            </p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 text-center space-y-2 relative">
            <div className="w-8 h-8 bg-emerald-500 text-white font-black text-xs rounded-full flex items-center justify-center mx-auto">
              4
            </div>
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              Check Bond
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Run automated matching for single, bulk, or sequential series numbers.
            </p>
          </div>
        </div>
      </section>

      {/* 08. QUICK ACCESS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
            Direct Utility Shortcuts
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Need Something Specific?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('checker')}
            className="p-5 bg-emerald-50 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200 text-left space-y-3 transition-all cursor-pointer group shadow-xs"
          >
            <div className="w-10 h-10 bg-[#006633] text-white rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#006633]">
                Check a Prize Bond
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Automated database verification tool.
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#006633] flex items-center gap-1 pt-1">
              <span>Open Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="p-5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left space-y-3 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#006633]">
                View Latest Results
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Official gazette lists & PDF updates.
              </p>
            </div>
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1 pt-1">
              <span>View Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="p-5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left space-y-3 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#006633]">
                View Draw Schedule
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Complete 2026 draw calendar & cities.
              </p>
            </div>
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1 pt-1">
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="p-5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-left space-y-3 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#006633]">
                Find a Denomination
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Browse all 6 active bond categories.
              </p>
            </div>
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1 pt-1">
              <span>Browse Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />

      {/* 09. FEATURED GUIDES */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Knowledge Base
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Prize Bond Guides
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {ARTICLES.length} Educational Guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((art) => (
            <div
              key={art.slug}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#004D26] font-black uppercase">
                    {art.category}
                  </span>
                  <span className="text-slate-500 font-medium">{art.readTime}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#006633] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {art.shortSummary}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-medium">
                  Updated: {art.lastUpdated}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('information', art.slug)}
                  className="font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ PREVIEW & AEO DIRECT ANSWERS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Direct Answers & Knowledge
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('faqs')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer w-max"
          >
            View All FAQs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aeoAnswers.map((aeo, idx) => (
            <div
              key={idx}
              className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2"
            >
              <h3 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0" />
                <span>{aeo.q}</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {aeo.a}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate(aeo.link)}
                  className="text-[11px] font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{aeo.linkLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          {FAQS.slice(0, 5).map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 font-extrabold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* VIDEO GUIDE TUTORIAL WIDGET */}
      <VideoGuideWidget
        categoryBadge="🎬 PRIZE BOND KNOWLEDGE TUTORIAL"
        title="Video Guide: How to Buy, Hold, & Claim Prize Bonds in Pakistan"
        subtitle="Watch our expert guide on purchasing bonds from SBP field offices, maintaining registers, and filing prize claims."
        summaryTitle="📌 National Savings Guide Summary"
        summaryItems={[
          {
            title: 'Authorized Purchase Points',
            desc: 'Buy genuine bonds at SBP BSC branches, Commercial Banks, or National Savings Centers.',
          },
          {
            title: 'Claim Verification Standards',
            desc: 'Physical bonds must be clean, un-tampered, and match official gazette serials.',
          },
          {
            title: 'WHT Tax Deductions',
            desc: 'FBR withholding tax applies automatically at payout time (15% Filer / 30% Non-Filer).',
          },
          {
            title: 'Claim Processing Buffer',
            desc: 'Small prizes paid over counter; large prizes processed via SBP Treasury within 15-30 days.',
          },
        ]}
        duration="03:40"
        onNavigate={onNavigate}
      />

      {/* 11. TRUST / DATA TRANSPARENCY APPROACH */}
      <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
          <ShieldCheck className="w-5 h-5 text-[#006633]" />
          <span>Information & Data Approach</span>
        </div>
        <p className="leading-relaxed">
          PrizeBond Pakistan is an independent informational and research portal. All Prize Bond specifications, draw calendars, and winning gazette lists displayed on this site are extracted directly from official gazettes issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP). Information is updated continuously as new official gazettes are released.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200/80">
          <span>Data Sources: CDNS Gazette Publications & SBP BSC Official Announcements</span>
          <span>•</span>
          <span>Last Updated: 15 August 2026</span>
        </div>
      </section>

      {/* 12. INTERNAL LINKING */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Quick Internal Navigation Links
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Explore Prize Bond Denominations
          </button>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            View Complete Gazette Results
          </button>
          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            View Official Draw Schedule
          </button>
          <button
            type="button"
            onClick={() => onNavigate('checker')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Check Your Prize Bond Serial Numbers
          </button>
          <button
            type="button"
            onClick={() => onNavigate('faqs')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] font-extrabold rounded-lg transition-colors cursor-pointer"
          >
            Browse Prize Bond FAQs
          </button>
        </div>
      </section>
    </div>
  );
};