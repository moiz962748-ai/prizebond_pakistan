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

  // Sync activeDenom with prop changes and scroll to top for independent page feel
  useEffect(() => {
    if (denomination) {
      setActiveDenom(denomination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

              {effectiveStatus === 'Upcoming' && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Next Scheduled Draw
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

        <div className="overflow-x-auto">
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
                <td className="p-3.5 font-black text-[#006633] text-sm">1st Prize</td>
                <td className="p-3.5 font-bold">{prizeBreakdown?.first.count} Winner</td>
                <td className="p-3.5 font-black text-slate-900 text-sm">{prizeBreakdown?.first.formatted}</td>
                <td className="p-3.5 font-extrabold text-slate-700">{prizeBreakdown?.first.total}</td>
              </tr>
              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="p-3.5 font-black text-[#006633] text-sm">2nd Prize</td>
                <td className="p-3.5 font-bold">{prizeBreakdown?.second.count} Winners</td>
                <td className="p-3.5 font-black text-slate-900 text-sm">{prizeBreakdown?.second.formatted}</td>
                <td className="p-3.5 font-extrabold text-slate-700">{prizeBreakdown?.second.total}</td>
              </tr>
              <tr className="hover:bg-emerald-50/50 transition-colors">
                <td className="p-3.5 font-black text-[#006633] text-sm">3rd Prize</td>
                <td className="p-3.5 font-bold">{prizeBreakdown?.third.count} Winners</td>
                <td className="p-3.5 font-black text-slate-900 text-sm">{prizeBreakdown?.third.formatted}</td>
                <td className="p-3.5 font-extrabold text-slate-700">{prizeBreakdown?.third.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />

      {/* INSTANT CHECKER SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-black text-[#006633] uppercase tracking-wider mb-1">
            Instant Automated Search
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Check Your {denomInfo.label}
          </h2>
        </div>

        <BondCheckerTool
          initialDenomination={denomInfo.value as DenominationValue}
          onNavigate={onNavigate}
        />
      </section>

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
            onClick={() => onNavigate('prizebonds')}
            className="text-xs font-bold text-[#006633] hover:underline cursor-pointer"
          >
            Explore All Bonds Hub →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DENOMINATIONS.map((d) => (
            <div
              key={d.value}
              onClick={() => onNavigate('denomination', d.value)}
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
    </div>
  );
};