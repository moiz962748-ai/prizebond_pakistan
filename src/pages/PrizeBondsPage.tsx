'use client';

import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Search,
  Sparkles,
  ArrowRight,
  Info,
  ExternalLink,
  Layers,
  Banknote,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { DENOMINATIONS, SCHEDULE_2026, LATEST_DRAWS, FAQS } from '../data/mockData';
import { DenominationInfo } from '../types/prizebond';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { BondCheckerTool } from '../components/checker/BondCheckerTool';

interface PrizeBondsPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const PrizeBondsPage: React.FC<PrizeBondsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bearer' | 'premium'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-hub-1');

  // Filter denominations based on selected tab
  const filteredDenominations = DENOMINATIONS.filter((d) => {
    if (selectedCategory === 'bearer') return !d.isPremium;
    if (selectedCategory === 'premium') return d.isPremium;
    return true;
  });

  const hubFaqs = [
    {
      id: 'faq-hub-1',
      question: 'What are Prize Bonds in Pakistan?',
      answer:
        'Prize Bonds are government-backed bearer and registered financial securities issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP). They offer prize money awards through quarterly randomized draws without risking the principal investment amount.',
    },
    {
      id: 'faq-hub-2',
      question: 'What is the difference between Bearer Prize Bonds and Registered Premium Prize Bonds?',
      answer:
        'Bearer Bonds (Rs. 100, 200, 750, 1,500) belong to whoever holds the physical paper bond note and pay prizes only. Premium Prize Bonds (Rs. 25,000 & Rs. 40,000) are registered directly to your CNIC and bank account, offering dual benefits: bi-annual direct profit interest transfers plus quarterly draw prizes.',
    },
    {
      id: 'faq-hub-3',
      question: 'Where can I purchase or cash Prize Bonds in Pakistan?',
      answer:
        'You can purchase or cash Prize Bonds at State Bank of Pakistan Banking Services Corporation (SBP BSC) offices, authorized commercial bank branches, and National Savings Centers across Pakistan.',
    },
    {
      id: 'faq-hub-4',
      question: 'What is the tax rate on Prize Bond winning prizes?',
      answer:
        'Prize Bond winnings are subject to 15% Withholding Tax (WHT) for Active Tax Filers (appearing on the FBR Active Taxpayer List) and 30% WHT for Non-Filers, deducted automatically at source when claiming the prize.',
    },
    {
      id: 'faq-hub-5',
      question: 'How long are winning prize claims valid?',
      answer:
        'Under CDNS rules, you can claim winning prizes up to 6 years from the official draw date. Unclaimed prizes after 6 years lapse in accordance with government rules.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* BREADCRUMBS */}
      <Breadcrumbs items={[{ label: 'Home', onClick: () => onNavigate('home') }, { label: 'Prize Bonds Hub' }]} />

      {/* HERO SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-80" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" /> Official SBP & CDNS Information Hub
              </span>
              <LastUpdatedBadge date="15 August 2026" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Pakistan Prize Bonds Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              Explore complete information, official prize money distribution, annual draw schedules, and instant checking tools for all 6 active Prize Bond denominations in Pakistan.
            </p>
          </div>

          <div className="shrink-0 bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-center md:text-left min-w-[220px]">
            <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider block">
              Active Denominations
            </span>
            <div className="text-2xl font-black text-white">6 Categories</div>
            <div className="text-[11px] text-slate-300 font-medium">
              Rs. 100 to Rs. 40,000 Premium
            </div>
          </div>
        </div>

        {/* HERO QUICK STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Lowest Denomination
            </span>
            <strong className="text-sm font-black text-slate-900 block mt-0.5">Rs. 100</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Highest Prize Award
            </span>
            <strong className="text-sm font-black text-[#006633] block mt-0.5">Rs. 8 Crore</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Draw Frequency
            </span>
            <strong className="text-sm font-black text-slate-900 block mt-0.5">Quarterly (4/yr)</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Claim Validity
            </span>
            <strong className="text-sm font-black text-slate-900 block mt-0.5">6 Years</strong>
          </div>
        </div>
      </div>

      {/* QUICK CHECKER TOOL EMBED */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Instant Gazette Search
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Check Any Prize Bond Number
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-emerald-50 text-[#004D26] px-3 py-1 rounded-full w-max">
            Instant Database Match
          </span>
        </div>

        <BondCheckerTool onNavigate={onNavigate} />
      </section>

      {/* DENOMINATIONS HUB SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Explore Denominations
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              All Prize Bond Categories
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Bonds (6)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('bearer')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'bearer'
                  ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Regular Bearer (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('premium')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'premium'
                  ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registered Premium (2)
            </button>
          </div>
        </div>

        {/* DENOMINATION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDenominations.map((denom) => {
            const nextDraw = SCHEDULE_2026.find((s) => s.denomination === denom.value);

            return (
              <div
                key={denom.value}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        denom.isPremium
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-[#004D26]'
                      }`}
                    >
                      {denom.isPremium ? 'Registered Premium' : 'Regular Bearer'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      PKR {denom.value}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#006633] transition-colors">
                      {denom.label}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {denom.description}
                    </p>
                  </div>

                  {/* Prize breakdown highlight */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">1st Prize Award:</span>
                      <strong className="text-[#006633] font-black text-sm">{denom.firstPrize}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
                      <span className="text-slate-500 font-bold">2nd Prize Award:</span>
                      <strong className="text-slate-800 font-bold">{denom.secondPrize}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
                      <span className="text-slate-500 font-bold">3rd Prize Award:</span>
                      <strong className="text-slate-800 font-bold">{denom.thirdPrize}</strong>
                    </div>
                  </div>

                  {/* Next Draw info */}
                  {nextDraw && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                      <Calendar className="w-4 h-4 text-[#006633] shrink-0" />
                      <span>
                        Next Draw: <strong>{nextDraw.date}</strong> ({nextDraw.city})
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigate('denomination', denom.value)}
                    className="w-full py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View {denom.formattedAmount} Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('results', denom.value)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center block"
                  >
                    View Gazette Results
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADSENSE BANNER */}
      <AdSensePlaceholder slot="banner" />

      {/* SIDE-BY-SIDE COMPARISON MATRIX TABLE */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Comprehensive Matrix
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Prize Money & Structure Comparison
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max">
            Verified SBP Gazette Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-3.5">Denomination</th>
                <th className="p-3.5">Bond Type</th>
                <th className="p-3.5">1st Prize</th>
                <th className="p-3.5">2nd Prize</th>
                <th className="p-3.5">3rd Prize</th>
                <th className="p-3.5">Draw Cycle</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {DENOMINATIONS.map((d) => (
                <tr key={d.value} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="p-3.5 font-black text-slate-900 text-sm">
                    {d.label}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.isPremium ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {d.isPremium ? 'Premium' : 'Bearer'}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-[#006633]">
                    {d.firstPrize}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {d.secondPrize}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {d.thirdPrize}
                  </td>
                  <td className="p-3.5 font-medium text-slate-600">
                    {d.drawFrequency}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onNavigate('denomination', d.value)}
                      className="px-3 py-1.5 bg-[#006633] text-white font-bold rounded-lg hover:bg-[#004D26] cursor-pointer text-[11px]"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* BEARER VS PREMIUM COMPARISON GUIDANCE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Standard Bearer Prize Bonds
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Issued in Rs. 100, 200, 750, and 1,500 values. Bearer bonds are unregistered paper certificates available for purchase at any bank or savings center without requiring CNIC registration. They pay no regular profit interest, but participate in 4 quarterly prize draws every year.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0" />
              <span>100% principal money backed by Federal Government</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0" />
              <span>Instant liquidity & easy over-the-counter transfer</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006633] shrink-0" />
              <span>Eligible for 1st, 2nd, and 3rd draw prizes</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black">
            <Banknote className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-white">
            Registered Premium Prize Bonds
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Issued in Rs. 25,000 and Rs. 40,000 denominations. Registered directly under your CNIC with direct profit interest transfers to your bank account every 6 months, plus entry into quarterly draw prizes up to Rs. 8 Crore.
          </p>
          <ul className="space-y-2 text-xs text-amber-200/90 pt-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>CNIC registered security protected against loss or theft</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bi-annual profit credited directly to investor bank accounts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Highest draw prize awards in Pakistan (up to Rs. 80 Million)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#006633]" />
            <span>Prize Bonds Hub FAQs</span>
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('faqs')}
            className="text-xs font-bold text-[#006633] hover:underline cursor-pointer"
          >
            View All FAQs →
          </button>
        </div>

        <div className="space-y-3">
          {hubFaqs.map((faq) => {
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
    </div>
  );
};