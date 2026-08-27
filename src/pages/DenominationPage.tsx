'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ChevronRight,
  Building2,
  MapPin,
  FileText,
  Search,
  Sparkles,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
  Info,
  ExternalLink,
  Layers,
  Banknote,
  Percent,
  Check,
  BookOpen,
  History,
} from 'lucide-react';
import { DenominationValue, ScheduleItem, DrawRecord } from '../types/prizebond';
import { DENOMINATIONS, LATEST_DRAWS, SCHEDULE_2026 } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';
import { BondCheckerTool } from '../components/checker/BondCheckerTool';

interface DenominationPageProps {
  denomination?: string;
  onNavigate: (view: string, param?: string) => void;
}

export type DenomStateOverride =
  | 'auto'
  | 'Upcoming'
  | 'Draw Today'
  | 'Completed'
  | 'Result Pending'
  | 'Rescheduled'
  | 'NotFound';

export const DenominationPage: React.FC<DenominationPageProps> = ({
  denomination = '1500',
  onNavigate,
}) => {
  // Current active denomination value state
  const [activeDenom, setActiveDenom] = useState<string>(denomination);

  // State Override Switcher for preview & testing of all status variations
  const [stateOverride, setStateOverride] = useState<DenomStateOverride>('auto');

  // Selected year filter for historical schedules
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-dn-1');

  // Sync activeDenom with prop changes
  useEffect(() => {
    if (denomination) {
      setActiveDenom(denomination);
    }
  }, [denomination]);

  // Denomination Info lookup
  const denomInfo = useMemo(() => {
    if (activeDenom === 'invalid-404') return null;
    return DENOMINATIONS.find((d) => d.value === activeDenom) || null;
  }, [activeDenom]);

  // Get Latest Draw for this denomination
  const latestDrawRecord = useMemo(() => {
    if (!denomInfo) return null;
    return LATEST_DRAWS.find((d) => d.denomination === denomInfo.value) || LATEST_DRAWS[0];
  }, [denomInfo]);

  // Get Next Draw from 2026 schedule for this denomination
  const nextScheduledDraw = useMemo<ScheduleItem>(() => {
    if (!denomInfo) return SCHEDULE_2026[0];
    return (
      SCHEDULE_2026.find((s) => s.denomination === denomInfo.value && s.status === 'Upcoming') ||
      SCHEDULE_2026.find((s) => s.denomination === denomInfo.value) ||
      SCHEDULE_2026[0]
    );
  }, [denomInfo]);

  // Filter 2026 schedule for this denomination
  const denominationSchedule = useMemo(() => {
    if (!denomInfo) return [];
    return SCHEDULE_2026.filter((s) => s.denomination === denomInfo.value);
  }, [denomInfo]);

  // Effective Status calculation based on override or schedule data
  const effectiveStatus = useMemo(() => {
    if (stateOverride === 'NotFound' || !denomInfo) return 'NotFound';
    if (stateOverride !== 'auto') return stateOverride;
    if (nextScheduledDraw.isNextDraw) return 'Upcoming';
    return nextScheduledDraw.status === 'Completed' ? 'Completed' : 'Upcoming';
  }, [denomInfo, stateOverride, nextScheduledDraw]);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 14,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Prize Structure calculations based on denomination
  const prizeBreakdown = useMemo(() => {
    if (!denomInfo) return null;

    if (denomInfo.value === '100') {
      return {
        first: { count: 1, amount: 700000, formatted: 'Rs. 700,000', total: 'Rs. 700,000' },
        second: { count: 3, amount: 200000, formatted: 'Rs. 200,000', total: 'Rs. 600,000' },
        third: { count: 1199, amount: 1000, formatted: 'Rs. 1,000', total: 'Rs. 1,199,000' },
        totalWinners: 1203,
        totalPayout: 'Rs. 2,499,000',
      };
    }
    if (denomInfo.value === '200') {
      return {
        first: { count: 1, amount: 750000, formatted: 'Rs. 750,000', total: 'Rs. 750,000' },
        second: { count: 5, amount: 250000, formatted: 'Rs. 250,000', total: 'Rs. 1,250,000' },
        third: { count: 2394, amount: 1250, formatted: 'Rs. 1,250', total: 'Rs. 2,992,500' },
        totalWinners: 2400,
        totalPayout: 'Rs. 4,992,500',
      };
    }
    if (denomInfo.value === '750') {
      return {
        first: { count: 1, amount: 1500000, formatted: 'Rs. 1,500,000', total: 'Rs. 1,500,000' },
        second: { count: 3, amount: 500000, formatted: 'Rs. 500,000', total: 'Rs. 1,500,000' },
        third: { count: 1696, amount: 9300, formatted: 'Rs. 9,300', total: 'Rs. 15,772,800' },
        totalWinners: 1700,
        totalPayout: 'Rs. 18,772,800',
      };
    }
    if (denomInfo.value === '1500') {
      return {
        first: { count: 1, amount: 3000000, formatted: 'Rs. 3,000,000', total: 'Rs. 3,000,000' },
        second: { count: 3, amount: 1000000, formatted: 'Rs. 1,000,000', total: 'Rs. 3,000,000' },
        third: { count: 1696, amount: 18500, formatted: 'Rs. 18,500', total: 'Rs. 31,376,000' },
        totalWinners: 1700,
        totalPayout: 'Rs. 37,376,000',
      };
    }
    if (denomInfo.value === '25000') {
      return {
        first: { count: 2, amount: 30000000, formatted: 'Rs. 30,000,000', total: 'Rs. 60,000,000' },
        second: { count: 5, amount: 10000000, formatted: 'Rs. 10,000,000', total: 'Rs. 50,000,000' },
        third: { count: 700, amount: 30000, formatted: 'Rs. 300,000', total: 'Rs. 210,000,000' },
        totalWinners: 707,
        totalPayout: 'Rs. 320,000,000',
      };
    }
    // 40000 Premium
    return {
      first: { count: 1, amount: 80000000, formatted: 'Rs. 80,000,000', total: 'Rs. 80,000,000' },
      second: { count: 3, amount: 30000000, formatted: 'Rs. 30,000,000', total: 'Rs. 90,000,000' },
      third: { count: 660, amount: 500000, formatted: 'Rs. 500,000', total: 'Rs. 330,000,000' },
      totalWinners: 664,
      totalPayout: 'Rs. 500,000,000',
    };
  }, [denomInfo]);

  // Handle 404 / Invalid Denomination view
  if (effectiveStatus === 'NotFound' || !denomInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* PREVIEW TOOLBAR */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Denomination Template Preview Controls:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeDenom}
              onChange={(e) => {
                setActiveDenom(e.target.value);
                setStateOverride('auto');
              }}
              className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded border border-slate-700 font-bold"
            >
              {DENOMINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
              <option value="invalid-404">Invalid Denomination (404 Test)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setActiveDenom('1500');
                setStateOverride('auto');
              }}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black rounded hover:bg-amber-300 cursor-pointer"
            >
              Reset to Rs. 1,500
            </button>
          </div>
        </div>

        <Breadcrumbs
          items={[
            { label: 'Prize Bonds', onClick: () => onNavigate('denomination', '1500') },
            { label: 'Denomination Not Found' },
          ]}
        />

        <div className="bg-white rounded-2xl p-10 sm:p-16 border border-slate-200 text-center space-y-5 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Prize Bond Denomination Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The Prize Bond denomination you are looking for is not recognized or is no longer in circulation under State Bank of Pakistan rules. Supported values include Rs. 100, 200, 750, 1,500, 25,000 Premium, and 40,000 Premium.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('denomination', '1500')}
              className="w-full sm:w-auto px-6 py-3 bg-[#006633] text-white font-black text-xs rounded-xl hover:bg-[#004D26] cursor-pointer"
            >
              View Rs. 1,500 Prize Bond
            </button>
            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              View Full 2026 Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draw Cities list
  const drawCities = [
    'Lahore',
    'Karachi',
    'Rawalpindi',
    'Peshawar',
    'Quetta',
    'Multan',
    'Faisalabad',
    'Sialkot',
    'Hyderabad',
    'Muzaffarabad',
  ];

  // Tailored FAQs for this denomination
  const denominationFaqs = [
    {
      id: 'faq-dn-1',
      question: `What is the ${denomInfo.label}?`,
      answer: denomInfo.isPremium
        ? `The ${denomInfo.label} is an official registered Premium Prize Bond issued by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan. Unlike standard bearer bonds, Premium Bonds are registered in the investor's CNIC/name, offering bi-annual profit transfers directly to bank accounts plus eligibility for 1st, 2nd, and 3rd draw prize cash awards.`
        : `The ${denomInfo.label} is an official bearer Prize Bond issued by National Savings Pakistan. It offers quarterly draw prizes with a 1st prize of ${denomInfo.firstPrize}, 2nd prize of ${denomInfo.secondPrize}, and 3rd prizes of ${denomInfo.thirdPrize}. It is fully transferable and backed by the Government of Pakistan.`,
    },
    {
      id: 'faq-dn-2',
      question: `What are the winning prize amounts for ${denomInfo.label}?`,
      answer: `For ${denomInfo.label}, the 1st prize award is ${denomInfo.firstPrize}, the 2nd prize award is ${denomInfo.secondPrize}, and the 3rd prize award is ${denomInfo.thirdPrize}.`,
    },
    {
      id: 'faq-dn-3',
      question: `When is the next draw for ${denomInfo.label}?`,
      answer: `The next draw for ${denomInfo.label} (Draw #${nextScheduledDraw.drawNo}) is scheduled for ${nextScheduledDraw.date} (${nextScheduledDraw.day}) in ${nextScheduledDraw.city}, Pakistan.`,
    },
    {
      id: 'faq-dn-4',
      question: `Where are ${denomInfo.label} draws held?`,
      answer: `Draws for ${denomInfo.label} are held quarterly at State Bank of Pakistan (SBP BSC) field offices on a rotating schedule across major cities including Lahore, Karachi, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Sialkot, Hyderabad, and Muzaffarabad.`,
    },
    {
      id: 'faq-dn-5',
      question: `How can I check if my ${denomInfo.label} won a prize?`,
      answer: `You can use our automated Prize Bond Checker tool to enter your 6-digit bond number or bulk series range. Our database instantly checks your numbers against official published gazette records.`,
    },
    {
      id: 'faq-dn-6',
      question: `What is the withholding tax rate on ${denomInfo.label} winnings?`,
      answer: `Under Pakistan Federal Board of Revenue (FBR) income tax regulations, prize bond winnings are subject to 15% Withholding Tax (WHT) for Active Tax Filers and 30% WHT for Non-Filers, deducted directly at source upon claim clearance.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 00. PREVIEW SWITCHER TOOLBAR */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Denomination Template Preview Controls:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Select Denomination */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Denomination:</span>
            <select
              value={activeDenom}
              onChange={(e) => {
                setActiveDenom(e.target.value);
                setStateOverride('auto');
              }}
              className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {DENOMINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label} {d.isPremium ? '(Premium)' : ''}
                </option>
              ))}
              <option value="invalid-404">Invalid Denomination (404 Test)</option>
            </select>
          </div>

          {/* Select Status Override */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Status State:</span>
            <select
              value={stateOverride}
              onChange={(e) => setStateOverride(e.target.value as DenomStateOverride)}
              className="bg-slate-800 text-amber-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-extrabold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="auto">Auto (Schedule Dataset)</option>
              <option value="Upcoming">State: Upcoming Draw</option>
              <option value="Draw Today">State: Draw Conducted Today</option>
              <option value="Completed">State: Result Published</option>
              <option value="Result Pending">State: Result Gazette Pending</option>
              <option value="Rescheduled">State: Rescheduled / Postponed</option>
              <option value="NotFound">State: 404 Denomination Not Found</option>
            </select>
          </div>
        </div>
      </div>

      {/* 02. BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: 'Prize Bonds', onClick: () => onNavigate('denomination', '1500') },
          { label: denomInfo.label },
        ]}
      />

      {/* 03. DENOMINATION HERO */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-80" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  denomInfo.isPremium
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-[#004D26]'
                }`}
              >
                {denomInfo.isPremium ? 'Registered Premium Bond' : 'Regular Bearer Prize Bond'}
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006633]" /> SBP Guaranteed
              </span>

              {/* DYNAMIC STATUS BADGE */}
              {effectiveStatus === 'Upcoming' && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Next Scheduled Draw
                </span>
              )}

              {effectiveStatus === 'Draw Today' && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-700" /> Draw Conducted Today
                </span>
              )}

              {effectiveStatus === 'Completed' && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" /> Result Gazette Published
                </span>
              )}

              {effectiveStatus === 'Result Pending' && (
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-700" /> Gazette Pending
                </span>
              )}

              {effectiveStatus === 'Rescheduled' && (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-700" /> Rescheduled
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {denomInfo.label}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              {denomInfo.description} Complete specifications, official prize money distribution, annual draw calendar, previous gazette results, and automated checking portal.
            </p>
          </div>

          <div className="shrink-0 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
              1st Prize Award
            </span>
            <strong className="text-xl sm:text-2xl font-black text-[#006633] block">
              {denomInfo.firstPrize}
            </strong>
            <span className="text-[10px] font-bold text-slate-500 block">
              Quarterly Draw Event
            </span>
          </div>
        </div>

        {/* 04. DENOMINATION SUMMARY OVERVIEW GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Denomination
            </span>
            <strong className="text-sm font-black text-slate-900 block mt-0.5">
              Rs. {denomInfo.value}
            </strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Type
            </span>
            <strong className="text-xs font-black text-slate-900 block mt-0.5 truncate">
              {denomInfo.isPremium ? 'Premium Registered' : 'Regular Bearer'}
            </strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Currency
            </span>
            <strong className="text-xs font-black text-slate-900 block mt-0.5">
              PKR (Pakistani Rupee)
            </strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Draw Frequency
            </span>
            <strong className="text-xs font-black text-slate-900 block mt-0.5">
              {denomInfo.drawFrequency}
            </strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Next Scheduled Draw
            </span>
            <strong className="text-xs font-black text-[#006633] block mt-0.5 font-mono">
              {nextScheduledDraw.date}
            </strong>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Latest Result
            </span>
            <strong className="text-xs font-black text-slate-900 block mt-0.5">
              Draw #{latestDrawRecord?.drawNo} ({latestDrawRecord?.city})
            </strong>
          </div>
        </div>
      </div>

      {/* 05. PRIMARY ACTION GROUP */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-[#006633] rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Quick Actions for {denomInfo.label}
            </h3>
            <p className="text-xs text-slate-500">
              Instant access to checking tool, gazette results, and draw schedule.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('checker', activeDenom)}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Check {denomInfo.formattedAmount} Bond</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('results', activeDenom)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            View Gazette Results
          </button>

          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            2026 Schedule
          </button>
        </div>
      </div>

      {/* 06. QUICK FACTS GRID */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#006633]" />
            <span>{denomInfo.label} at a Glance</span>
          </h2>
          <LastUpdatedBadge date="15 August 2026" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              1st Prize Award
            </span>
            <strong className="text-base font-black text-[#006633] block">
              {denomInfo.firstPrize}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {prizeBreakdown?.first.count} Lucky Winner per Draw
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              2nd Prize Award
            </span>
            <strong className="text-base font-black text-slate-900 block">
              {denomInfo.secondPrize}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {prizeBreakdown?.second.count} Winners per Draw
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              3rd Prize Award
            </span>
            <strong className="text-base font-black text-slate-900 block">
              {denomInfo.thirdPrize}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {prizeBreakdown?.third.count} Winners per Draw
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Total Draw Prize Pool
            </span>
            <strong className="text-base font-black text-emerald-900 block">
              {prizeBreakdown?.totalPayout}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              {prizeBreakdown?.totalWinners} Total Winners
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Draw Frequency
            </span>
            <strong className="text-base font-black text-slate-900 block">
              {denomInfo.drawFrequency}
            </strong>
            <span className="text-[11px] text-slate-500 block">
              4 Official Draws Per Year
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Claim Eligibility Period
            </span>
            <strong className="text-base font-black text-slate-900 block">
              6 Years
            </strong>
            <span className="text-[11px] text-slate-500 block">
              From Draw Announcement Date
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Tax Rates (WHT)
            </span>
            <strong className="text-base font-black text-slate-900 block">
              15% / 30%
            </strong>
            <span className="text-[11px] text-slate-500 block">
              15% Filers • 30% Non-Filers
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Issuer Authority
            </span>
            <strong className="text-base font-black text-slate-900 block">
              CDNS & SBP
            </strong>
            <span className="text-[11px] text-slate-500 block">
              Govt. of Pakistan Backed
            </span>
          </div>
        </div>
      </section>

      {/* 07. WHAT IS THIS PRIZE BOND? */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
          Denomination Overview
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          What is the {denomInfo.label}?
        </h2>
        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-3">
          <p>
            The <strong>{denomInfo.label}</strong> is an official government security issued by the Central Directorate of National Savings (CDNS) in collaboration with the State Bank of Pakistan (SBP). Designed for public capital mobilization and secure wealth preservation, it operates under strict federal regulations.
          </p>
          <p>
            {denomInfo.isPremium ? (
              <>
                As a <strong>Registered Premium Prize Bond</strong>, bonds are issued directly in the investor&apos;s name and CNIC. Holders receive direct bi-annual profit payments credited straight to their linked bank accounts, alongside eligibility for quarterly draw cash awards. Premium bonds offer complete security against loss, theft, or damage.
              </>
            ) : (
              <>
                As a standard <strong>Bearer Prize Bond</strong>, ownership is established by physical possession of the genuine bond note. Draws are conducted every three months across SBP BSC field offices, selecting winning numbers via computerized randomized draw machinery overseen by an independent public draw committee.
              </>
            )}
          </p>
        </div>

        {/* Financial Safety Note */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Informational Disclaimer:</strong> PrizeBond Pakistan is an independent informational platform providing official gazette schedules and results. Prize Bond draws are non-interest lottery prize schemes governed by federal rules. We do not provide financial advice, sell bonds, or charge fees for checking.
          </p>
        </div>
      </section>

      {/* 08 & 09. PRIZE STRUCTURE TABLE */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Official Prize Money Distribution
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {denomInfo.label} Prize Structure
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-max">
            Verified SBP Gazette Rule
          </span>
        </div>

        {/* DESKTOP FINANCIAL TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider">
                <th className="p-3.5">Prize Category</th>
                <th className="p-3.5">Number of Prizes</th>
                <th className="p-3.5">Prize Amount per Winner</th>
                <th className="p-3.5">Total Prize Pool Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="p-3.5 font-black text-[#006633] text-sm">
                  1st Prize
                </td>
                <td className="p-3.5 font-bold">
                  {prizeBreakdown?.first.count} Winner
                </td>
                <td className="p-3.5 font-black text-slate-900 text-sm">
                  {prizeBreakdown?.first.formatted}
                </td>
                <td className="p-3.5 font-extrabold text-slate-700">
                  {prizeBreakdown?.first.total}
                </td>
              </tr>

              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="p-3.5 font-black text-[#006633] text-sm">
                  2nd Prize
                </td>
                <td className="p-3.5 font-bold">
                  {prizeBreakdown?.second.count} Winners
                </td>
                <td className="p-3.5 font-black text-slate-900 text-sm">
                  {prizeBreakdown?.second.formatted}
                </td>
                <td className="p-3.5 font-extrabold text-slate-700">
                  {prizeBreakdown?.second.total}
                </td>
              </tr>

              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="p-3.5 font-black text-[#006633] text-sm">
                  3rd Prize
                </td>
                <td className="p-3.5 font-bold">
                  {prizeBreakdown?.third.count} Winners
                </td>
                <td className="p-3.5 font-black text-slate-900 text-sm">
                  {prizeBreakdown?.third.formatted}
                </td>
                <td className="p-3.5 font-extrabold text-slate-700">
                  {prizeBreakdown?.third.total}
                </td>
              </tr>

              <tr className="bg-slate-900 text-white font-extrabold">
                <td className="p-3.5 uppercase tracking-wider text-amber-300">
                  Total Draw Allocation
                </td>
                <td className="p-3.5 text-white">
                  {prizeBreakdown?.totalWinners} Total Winners
                </td>
                <td className="p-3.5 text-slate-300">
                  Per Series Distribution
                </td>
                <td className="p-3.5 text-amber-300 text-sm font-black">
                  {prizeBreakdown?.totalPayout}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* MOBILE RESPONSIVE STACKED CARDS */}
        <div className="block md:hidden space-y-3">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#006633]">1st Prize Award</span>
              <span className="px-2 py-0.5 bg-emerald-200 text-[#004D26] text-[10px] font-bold rounded">
                {prizeBreakdown?.first.count} Winner
              </span>
            </div>
            <div className="text-xl font-black text-slate-900">
              {prizeBreakdown?.first.formatted}
            </div>
            <div className="text-[11px] text-slate-600 font-medium border-t border-emerald-200/60 pt-2">
              Total Category Allocation: <strong>{prizeBreakdown?.first.total}</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800">2nd Prize Award</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded">
                {prizeBreakdown?.second.count} Winners
              </span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {prizeBreakdown?.second.formatted}
            </div>
            <div className="text-[11px] text-slate-600 font-medium border-t border-slate-200 pt-2">
              Total Category Allocation: <strong>{prizeBreakdown?.second.total}</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800">3rd Prize Award</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded">
                {prizeBreakdown?.third.count} Winners
              </span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {prizeBreakdown?.third.formatted}
            </div>
            <div className="text-[11px] text-slate-600 font-medium border-t border-slate-200 pt-2">
              Total Category Allocation: <strong>{prizeBreakdown?.third.total}</strong>
            </div>
          </div>
        </div>

        {/* Prize Disclaimer Note */}
        <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
          Prize information is presented for informational purposes. Please verify current information from the relevant official source (Central Directorate of National Savings).
        </div>
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />

      {/* 11, 12, 13. UPCOMING DRAW & COUNTDOWN WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
            Draw Calendar Specifications
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How Often Are {denomInfo.label} Draws Held?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Draws for {denomInfo.label} are conducted every 3 months in accordance with the annual draw schedule released by the Central Directorate of National Savings. Each year features 4 quarterly draw events held across State Bank of Pakistan field offices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                Draw Frequency
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5">
                {denomInfo.drawFrequency}
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                Annual Draws
              </span>
              <strong className="text-sm font-black text-slate-900 block mt-0.5">
                4 Draws / Year
              </strong>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                Next Scheduled Draw
              </span>
              <strong className="text-sm font-black text-[#006633] block mt-0.5 font-mono">
                {nextScheduledDraw.date}
              </strong>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between space-y-5">
          {effectiveStatus === 'Upcoming' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Upcoming Draw Countdown
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Next {denomInfo.label} Draw #{nextScheduledDraw.drawNo}
                </h3>
                <div className="text-xs text-amber-300 font-bold mt-1">
                  {nextScheduledDraw.date} ({nextScheduledDraw.day}) • {nextScheduledDraw.city}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-amber-300 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Days</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-amber-300 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Hours</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-amber-300 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Mins</div>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <div className="text-lg font-black text-amber-300 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Secs</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('draw-detail', nextScheduledDraw.id)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center block"
              >
                View Draw Details & Venue
              </button>
            </div>
          )}

          {effectiveStatus === 'Draw Today' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-black uppercase tracking-wider animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" /> Draw Being Held Today
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Draw Proceedings In Progress
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The draw is taking place today at SBP BSC {nextScheduledDraw.city}. Gazette lists will be uploaded immediately after official release.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('results', activeDenom)}
                className="w-full py-3 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Refresh Result Page
              </button>
            </div>
          )}

          {effectiveStatus === 'Completed' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Gazette Result Available
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Draw #{latestDrawRecord?.drawNo} Completed
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Official gazette winning numbers for {denomInfo.label} are published and ready for online verification.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('results', activeDenom)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>View Full Result Gazette</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {effectiveStatus === 'Result Pending' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-white" /> Gazette Compilation Pending
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Draw Completed — Awaiting Gazette
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The draw event was conducted today. SBP BSC draw committee is currently finalizing the official gazette.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('results', activeDenom)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Check Result Availability
              </button>
            </div>
          )}

          {effectiveStatus === 'Rescheduled' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5 text-white" /> Postponed / Rescheduled
              </div>

              <div>
                <h3 className="text-lg font-black text-white">
                  Scheduled Date Moved
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Due to an official gazetted public holiday, this draw has been rescheduled to the next working day under CDNS rules.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('schedule')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                View Updated Schedule
              </button>
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-800 pt-3">
            Source: Central Directorate of National Savings & SBP BSC Gazette
          </div>
        </div>
      </div>

      {/* 14. COMPLETE DRAW SCHEDULE PREVIEW */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              2026 Annual Calendar
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {denomInfo.label} Draw Schedule
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="text-xs font-extrabold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Complete 2026 Schedule</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider">
                <th className="p-3">Draw No</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3">Day</th>
                <th className="p-3">Host City Venue</th>
                <th className="p-3">Draw Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {denominationSchedule.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-black text-slate-900">Draw #{item.drawNo}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{item.date}</td>
                  <td className="p-3 text-slate-600">{item.day}</td>
                  <td className="p-3 text-slate-800">{item.city}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-[#004D26]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('draw-detail', item.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors text-[11px] cursor-pointer"
                    >
                      Draw Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 15, 16, 17. PREVIOUS DRAWS & LATEST RESULT */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              Official Gazette Archive
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest {denomInfo.label} Draw Result
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('results', activeDenom)}
            className="text-xs font-extrabold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All {denomInfo.formattedAmount} Results</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* LATEST RESULT HIGHLIGHT CARD */}
        {latestDrawRecord && (
          <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-[#006633] tracking-wider block">
                  Latest Published Gazette
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Draw #{latestDrawRecord.drawNo} — {latestDrawRecord.city}
                </h3>
              </div>
              <div className="text-xs font-bold text-slate-600 font-mono">
                Date: {latestDrawRecord.formattedDate}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-extrabold text-[#006633] uppercase block">
                  1st Prize Winner Number ({latestDrawRecord.prizeStructure.firstAmountFormatted})
                </span>
                <div className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                  {latestDrawRecord.firstPrizeNumbers.join(', ')}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-xs font-extrabold text-slate-700 uppercase block">
                  2nd Prize Winners ({latestDrawRecord.prizeStructure.secondAmountFormatted} Each)
                </span>
                <div className="font-mono text-sm font-bold text-slate-800">
                  {latestDrawRecord.secondPrizeNumbers.join(', ')}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Verified against State Bank of Pakistan Gazette Records
              </span>
              <button
                type="button"
                onClick={() => onNavigate('results', activeDenom)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Full Result Gazette</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 18 & 19. CHECKER UTILITY SECTION & HOW TO CHECK */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-black text-[#006633] uppercase tracking-wider mb-1">
            Instant Automated Search
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Check Your {denomInfo.label}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-selected for {denomInfo.formattedAmount}. Enter single numbers, bulk lists, or series ranges to check against all draw gazette records instantly.
          </p>
        </div>

        {/* EMBEDDED BOND CHECKER TOOL */}
        <BondCheckerTool
          initialDenomination={denomInfo.value as DenominationValue}
          onNavigate={onNavigate}
        />

        {/* HOW TO CHECK INSTRUCTIONS */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#006633]" />
            <span>How to Check an {denomInfo.label}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="w-6 h-6 bg-emerald-100 text-[#006633] font-black rounded-full flex items-center justify-center text-xs">
                1
              </div>
              <strong className="font-extrabold text-slate-900 block">Confirm Denomination</strong>
              <p className="text-slate-600 text-[11px]">
                Ensure {denomInfo.formattedAmount} is pre-selected in the checker input field.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="w-6 h-6 bg-emerald-100 text-[#006633] font-black rounded-full flex items-center justify-center text-xs">
                2
              </div>
              <strong className="font-extrabold text-slate-900 block">Input Serial Numbers</strong>
              <p className="text-slate-600 text-[11px]">
                Type single 6-digit number, paste bulk lists, or select a start to end series.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="w-6 h-6 bg-emerald-100 text-[#006633] font-black rounded-full flex items-center justify-center text-xs">
                3
              </div>
              <strong className="font-extrabold text-slate-900 block">Select Draw Gazette</strong>
              <p className="text-slate-600 text-[11px]">
                Choose latest draw or search across 6 years of historical SBP gazette archives.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="w-6 h-6 bg-emerald-100 text-[#006633] font-black rounded-full flex items-center justify-center text-xs">
                4
              </div>
              <strong className="font-extrabold text-slate-900 block">View Instant Match</strong>
              <p className="text-slate-600 text-[11px]">
                Get immediate breakdown of winning category (1st, 2nd, 3rd) and prize amount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 20. DRAW LOCATIONS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
          Official Draw Host Venues
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {denomInfo.label} Draw Locations
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Official draws for {denomInfo.label} take place at State Bank of Pakistan (SBP BSC) field offices on a rotating schedule across major administrative hubs in Pakistan.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {drawCities.map((city) => (
            <span
              key={city}
              className="px-3.5 py-1.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200"
            >
              <MapPin className="w-3.5 h-3.5 text-[#006633]" />
              <span>SBP {city}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 21. YEAR NAVIGATION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
          Historical Schedule & Archive Navigation
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {denomInfo.label} Schedule by Year
        </h2>

        <div className="flex flex-wrap gap-2">
          {[2026, 2025, 2024, 2023].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-[#006633] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              Year {yr} Schedule
            </button>
          ))}
        </div>
      </section>

      {/* 22 & 23. REGULAR / PREMIUM SPECIFIC FLEXIBILITY */}
      {denomInfo.isPremium ? (
        <section className="bg-amber-50/80 rounded-2xl p-6 sm:p-8 border border-amber-200 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Registered Premium Bond Features</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Key Advantages of {denomInfo.label}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1">
              <strong className="font-extrabold text-slate-900 block">Direct Bank Profit</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Bi-annual profit rates paid directly into investor linked IBAN bank accounts every 6 months.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1">
              <strong className="font-extrabold text-slate-900 block">Loss & Theft Protection</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Registered in holder&apos;s CNIC name; lost or damaged certificates are easily reissued by CDNS.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-amber-200 space-y-1">
              <strong className="font-extrabold text-slate-900 block">Direct Prize Transfer</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Winning draw awards are credited directly to holder&apos;s verified bank account without counter hassle.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-emerald-50/80 rounded-2xl p-6 sm:p-8 border border-emerald-200 space-y-4">
          <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
            <Banknote className="w-4 h-4 text-[#006633]" />
            <span>Standard Bearer Bond Information</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Ownership & Transferability for {denomInfo.label}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Standard Bearer Prize Bonds are fully transferable paper instruments backed by National Savings. Prizes up to Rs. 18,500 can be claimed directly over commercial bank counters, while higher awards are cleared through State Bank of Pakistan (SBP-BSC) field offices.
          </p>
        </section>
      )}

      {/* 24. RELATED DENOMINATIONS CARDS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider">
              National Savings Portfolio
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Other Prize Bond Denominations
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('denomination', '1500')}
            className="text-xs font-bold text-[#006633] hover:underline cursor-pointer"
          >
            Explore All Bonds →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DENOMINATIONS.map((d) => (
            <div
              key={d.value}
              onClick={() => {
                setActiveDenom(d.value);
                setStateOverride('auto');
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                d.value === activeDenom
                  ? 'bg-emerald-50 border-[#006633] ring-2 ring-[#006633] shadow-xs'
                  : 'bg-slate-50 hover:bg-white hover:border-emerald-300 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900">Rs. {d.value}</span>
                {d.value === activeDenom && (
                  <span className="text-[9px] font-black uppercase bg-[#006633] text-white px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
              <div className="text-[11px] font-bold text-emerald-900 truncate">
                {d.firstPrize}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {d.isPremium ? 'Premium' : 'Bearer'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 25 - 29. AEO DIRECT ANSWERS */}
      <section className="bg-emerald-50/80 rounded-2xl p-6 sm:p-8 border border-emerald-200 space-y-6">
        <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#006633]" />
          <span>Direct Answers & Key Summary</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              What is the {denomInfo.label}?
            </h2>
            <p className="leading-relaxed">
              The {denomInfo.label} is an official government-backed security issued by National Savings Pakistan. It offers quarterly draw prizes including a 1st prize of {denomInfo.firstPrize}, 2nd prize of {denomInfo.secondPrize}, and 3rd prizes of {denomInfo.thirdPrize}.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              When is the next {denomInfo.label} draw?
            </h2>
            <p className="leading-relaxed">
              The next {denomInfo.label} draw (Draw #{nextScheduledDraw.drawNo}) is scheduled for <strong>{nextScheduledDraw.date} ({nextScheduledDraw.day})</strong> in <strong>{nextScheduledDraw.city}</strong>, Pakistan.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              What are the prizes for the {denomInfo.label}?
            </h2>
            <p className="leading-relaxed">
              The prize distribution for {denomInfo.label} consists of 1st Prize ({denomInfo.firstPrize}), 2nd Prize ({denomInfo.secondPrize}), and 3rd Prize ({denomInfo.thirdPrize}).
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              How can I check an {denomInfo.label}?
            </h2>
            <p className="leading-relaxed">
              You can check your {denomInfo.formattedAmount} Prize Bond by entering your 6-digit serial number in our automated Prize Bond Checker tool above to match against official SBP gazette results.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Where can I find {denomInfo.label} results?
            </h2>
            <p className="leading-relaxed">
              Complete official winning gazette result lists for {denomInfo.label} are published on PrizeBond Pakistan immediately following State Bank release on draw day.
            </p>
          </div>
        </div>
      </section>

      {/* 30 & 55. SUPPORTING INFORMATION & FAQ ACCORDION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-black text-[#006633] uppercase tracking-wider mb-1">
            Knowledge Base & Answers
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {denominationFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-3 font-extrabold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#006633] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
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
      </section>

      {/* VIDEO GUIDE TUTORIAL WIDGET */}
      <VideoGuideWidget
        categoryBadge="🎬 DENOMINATION GUIDE TUTORIAL"
        title={`Video Guide: Understanding ${denomInfo.label} Draw Rules & Prize Amounts`}
        subtitle="Learn how draw frequencies, prize amounts, and tax deduction rules work for Pakistani Prize Bonds."
        summaryTitle="📌 Denomination & Prize Rules Summary"
        summaryItems={[
          {
            title: 'Quarterly Draw Cycles',
            desc: 'Denominations are drawn every 3 months on a rotating SBP BSC city schedule.',
          },
          {
            title: 'Prize Value Structure',
            desc: 'Distinct 1st, 2nd, and 3rd cash prize awards per denomination.',
          },
          {
            title: 'Registered vs Bearer',
            desc: 'Premium bonds feature direct bank transfer; standard bonds require gazette verification.',
          },
          {
            title: '6-Year Claim Window',
            desc: 'Submit winning claim forms to State Bank field offices within 6 years.',
          },
        ]}
        duration="02:45"
        onNavigate={onNavigate}
      />

      {/* 40 & 41. DATA SOURCE & TRUST BLOCK */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Data Integrity & Trust Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Primary Source</span>
            <strong className="text-white text-sm font-black block">Central Directorate of National Savings</strong>
            <p className="text-slate-400 text-[11px]">State Bank of Pakistan (SBP-BSC)</p>
          </div>

          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Gazette Verification</span>
            <strong className="text-emerald-400 text-sm font-black block">100% Match Verified</strong>
            <p className="text-slate-400 text-[11px]">Audited against official government press releases</p>
          </div>

          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Data Update</span>
            <strong className="text-amber-300 text-sm font-black block">15 August 2026</strong>
            <p className="text-slate-400 text-[11px]">Real-time synchronization enabled</p>
          </div>
        </div>
      </section>
    </div>
  );
};