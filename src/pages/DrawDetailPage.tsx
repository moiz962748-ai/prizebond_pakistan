'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ShieldCheck,
  Award,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  ExternalLink,
  ListFilter,
  Check,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { DenominationValue, ScheduleItem, DrawRecord } from '../types/prizebond';
import { SCHEDULE_2026, DENOMINATIONS, LATEST_DRAWS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';

interface DrawDetailPageProps {
  drawId?: string;
  onNavigate: (view: string, param?: string) => void;
}

export type DrawStateOverride =
  | 'auto'
  | 'Upcoming'
  | 'Next Draw'
  | 'Draw Today'
  | 'Completed'
  | 'Result Pending'
  | 'Rescheduled'
  | 'NotFound';

export const DrawDetailPage: React.FC<DrawDetailPageProps> = ({
  drawId = 'sch-21',
  onNavigate,
}) => {
  // Selected Draw ID State
  const [currentDrawId, setCurrentDrawId] = useState<string>(drawId);

  // State Override Switcher for Preview & Verification of All Prompt Requirements
  const [stateOverride, setStateOverride] = useState<DrawStateOverride>('auto');

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-dt-1');

  // Update currentDrawId when prop changes
  useEffect(() => {
    if (drawId) {
      setCurrentDrawId(drawId);
    }
  }, [drawId]);

  // Find active schedule item from SCHEDULE_2026 or fallback
  const scheduleItem = useMemo(() => {
    if (!currentDrawId || currentDrawId === 'invalid-404') return null;

    // Direct match by ID
    let found = SCHEDULE_2026.find((s) => s.id === currentDrawId);
    if (found) return found;

    // Match by drawNo and denomination e.g. "draw-1500-104" or "104"
    if (currentDrawId.includes('-')) {
      const parts = currentDrawId.split('-');
      const numPart = parts.find((p) => !isNaN(Number(p)) && Number(p) > 0);
      const denomPart = parts.find((p) => DENOMINATIONS.some((d) => d.value === p));
      if (numPart) {
        found = SCHEDULE_2026.find(
          (s) =>
            s.drawNo === Number(numPart) && (!denomPart || s.denomination === denomPart)
        );
      }
    } else if (!isNaN(Number(currentDrawId))) {
      found = SCHEDULE_2026.find((s) => s.drawNo === Number(currentDrawId));
    }

    // Default fallback if not found or empty
    return found || SCHEDULE_2026.find((s) => s.id === 'sch-21') || SCHEDULE_2026[0];
  }, [currentDrawId]);

  // Denomination details
  const denomInfo = useMemo(() => {
    if (!scheduleItem) return DENOMINATIONS[3]; // default Rs. 1500
    return (
      DENOMINATIONS.find((d) => d.value === scheduleItem.denomination) || DENOMINATIONS[3]
    );
  }, [scheduleItem]);

  // Find corresponding result record if completed
  const publishedRecord = useMemo(() => {
    if (!scheduleItem) return null;
    return LATEST_DRAWS.find(
      (r) =>
        r.denomination === scheduleItem.denomination && r.drawNo === scheduleItem.drawNo
    );
  }, [scheduleItem]);

  // Effective Status calculation
  const effectiveStatus = useMemo(() => {
    if (stateOverride === 'NotFound') return 'NotFound';
    if (stateOverride !== 'auto') return stateOverride;
    if (!scheduleItem) return 'NotFound';
    if (scheduleItem.isNextDraw) return 'Next Draw';
    if (scheduleItem.status === 'Completed') {
      return publishedRecord ? 'Completed' : 'Result Pending';
    }
    return 'Upcoming';
  }, [scheduleItem, stateOverride, publishedRecord]);

  // Find Timeline: Previous, Current, Next draws for the same denomination or overall schedule
  const timelineDraws = useMemo(() => {
    if (!scheduleItem) return { prev: null, next: null, sameDenomDraws: [] };

    const sameDenom = SCHEDULE_2026.filter(
      (s) => s.denomination === scheduleItem.denomination
    ).sort((a, b) => a.drawNo - b.drawNo);

    const currentIndex = sameDenom.findIndex((s) => s.id === scheduleItem.id);

    const prev = currentIndex > 0 ? sameDenom[currentIndex - 1] : null;
    const next =
      currentIndex >= 0 && currentIndex < sameDenom.length - 1
        ? sameDenom[currentIndex + 1]
        : null;

    return {
      prev,
      next,
      sameDenomDraws: sameDenom,
    };
  }, [scheduleItem]);

  // Countdown timer for Upcoming / Next Draw states
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 18,
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

  // Handle 404 Not Found state rendering
  if (effectiveStatus === 'NotFound' || !scheduleItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* State Previewer Bar */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Draw Template State Switcher:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentDrawId}
              onChange={(e) => {
                setCurrentDrawId(e.target.value);
                setStateOverride('auto');
              }}
              className="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 font-medium"
            >
              {SCHEDULE_2026.map((s) => (
                <option key={s.id} value={s.id}>
                  Draw #{s.drawNo} — Rs. {s.denomination} ({s.city}) [{s.status}]
                </option>
              ))}
              <option value="invalid-404">Invalid ID (404 Test)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setCurrentDrawId('sch-21');
                setStateOverride('auto');
              }}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black rounded hover:bg-amber-300"
            >
              Reset to Draw #104
            </button>
          </div>
        </div>

        <Breadcrumbs
          items={[
            { label: 'Draw Schedule', onClick: () => onNavigate('schedule') },
            { label: 'Draw Not Found' },
          ]}
        />

        <div className="bg-white rounded-2xl p-10 sm:p-16 border border-slate-200 text-center space-y-5 max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Prize Bond Draw Record Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The requested draw record could not be found or has not been published in the annual schedule. Please verify the draw number and denomination or explore the complete schedule hub.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="w-full sm:w-auto px-6 py-3 bg-[#006633] text-white font-black text-xs rounded-xl hover:bg-[#004D26] cursor-pointer"
            >
              View Annual Draw Schedule
            </button>
            <button
              type="button"
              onClick={() => onNavigate('checker')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Check Your Bond Number
            </button>
          </div>
        </div>
      </div>
    );
  }

  // City SBP Field Office details mapping
  const sbpVenues: Record<string, string> = {
    Lahore: 'State Bank of Pakistan, SBP BSC Lahore Branch, Shahrah-e-Quaid-e-Azam',
    Karachi: 'State Bank of Pakistan, SBP BSC Main Building, I.I. Chundrigar Road, Karachi',
    Rawalpindi: 'State Bank of Pakistan, SBP BSC Rawalpindi Branch, The Mall, Rawalpindi',
    Peshawar: 'State Bank of Pakistan, SBP BSC Peshawar Field Office, Saddar Road',
    Quetta: 'State Bank of Pakistan, SBP BSC Quetta Branch, Shahrah-e-Gulistan',
    Multan: 'State Bank of Pakistan, SBP BSC Multan Field Office, LMQ Road',
    Faisalabad: 'State Bank of Pakistan, SBP BSC Faisalabad Branch, University Road',
    Sialkot: 'State Bank of Pakistan, SBP BSC Sialkot Office, Paris Road',
    Hyderabad: 'State Bank of Pakistan, SBP BSC Hyderabad Office, Thandi Sarak',
    Muzaffarabad: 'State Bank of Pakistan, SBP BSC Muzaffarabad Field Office, Bank Road',
    Islamabad: 'State Bank of Pakistan, SBP BSC Islamabad Office, Sector G-5/2',
  };

  const venueAddress =
    sbpVenues[scheduleItem.city] ||
    `State Bank of Pakistan, SBP BSC ${scheduleItem.city} Field Office`;

  const faqs = [
    {
      id: 'faq-dt-1',
      question: `What is Rs. ${scheduleItem.denomination} Prize Bond Draw #${scheduleItem.drawNo}?`,
      answer: `Draw #${scheduleItem.drawNo} is an official quarterly draw conducted for the Rs. ${scheduleItem.denomination} Prize Bond by the Central Directorate of National Savings (CDNS) and State Bank of Pakistan (SBP). Holders of valid Rs. ${scheduleItem.denomination} bonds are automatically eligible for 1st, 2nd, and 3rd prize cash awards.`,
    },
    {
      id: 'faq-dt-2',
      question: `When and where is Draw #${scheduleItem.drawNo} held?`,
      answer: `Draw #${scheduleItem.drawNo} is scheduled for ${scheduleItem.date} (${scheduleItem.day}) at the ${venueAddress}. Draw proceedings commence at 9:00 AM under supervision of an independent draw committee.`,
    },
    {
      id: 'faq-dt-3',
      question: `When will the winning results for Draw #${scheduleItem.drawNo} be published?`,
      answer: `Winning gazette lists are officially compiled on draw day. PrizeBond Pakistan updates the complete winning serial numbers online on ${scheduleItem.date} immediately following official SBP gazette release.`,
    },
    {
      id: 'faq-dt-4',
      question: `How can I check if my bond won in Draw #${scheduleItem.drawNo}?`,
      answer: `You can use our automated Prize Bond Checker tool to enter your serial number or bulk series range. The checker compares your numbers against official published gazette records instantly.`,
    },
    {
      id: 'faq-dt-5',
      question: `What happens if ${scheduleItem.date} is declared a public holiday?`,
      answer: `Under CDNS regulations, if a scheduled draw date falls on an official government public holiday, the draw takes place on the immediate next official working day at the same SBP field office.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* TOOLBAR: STATE OVERRIDE SWITCHER FOR VERIFICATION */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Draw Template Preview Controls:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Select Draw */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Select Draw:</span>
            <select
              value={currentDrawId}
              onChange={(e) => {
                setCurrentDrawId(e.target.value);
                setStateOverride('auto');
              }}
              className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {SCHEDULE_2026.map((s) => (
                <option key={s.id} value={s.id}>
                  Draw #{s.drawNo} — Rs. {s.denomination} ({s.city}) [{s.status}]
                </option>
              ))}
            </select>
          </div>

          {/* Select Status Override */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium hidden sm:inline">Status State:</span>
            <select
              value={stateOverride}
              onChange={(e) => setStateOverride(e.target.value as DrawStateOverride)}
              className="bg-slate-800 text-amber-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-extrabold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="auto">Auto (From Dataset)</option>
              <option value="Upcoming">State: Upcoming</option>
              <option value="Next Draw">State: Next Draw Spotlight</option>
              <option value="Draw Today">State: Draw Conducted Today</option>
              <option value="Completed">State: Completed + Result Available</option>
              <option value="Result Pending">State: Completed + Result Pending</option>
              <option value="Rescheduled">State: Rescheduled / Cancelled</option>
              <option value="NotFound">State: 404 Draw Not Found</option>
            </select>
          </div>
        </div>
      </div>

      {/* 02. BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: 'Draw Schedule', onClick: () => onNavigate('schedule') },
          { label: '2026 Schedule', onClick: () => onNavigate('schedule') },
          {
            label: `Rs. ${scheduleItem.denomination} Draw #${scheduleItem.drawNo}`,
          },
        ]}
      />

      {/* 03. DRAW HERO & IDENTITY */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-80" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider">
                Rs. {scheduleItem.denomination} {denomInfo.isPremium ? 'Premium' : 'Bearer'} Bond
              </span>

              {/* DYNAMIC STATUS BADGE */}
              {effectiveStatus === 'Next Draw' && (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Next Scheduled Draw Spotlight
                </span>
              )}

              {effectiveStatus === 'Upcoming' && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Scheduled Upcoming
                </span>
              )}

              {effectiveStatus === 'Draw Today' && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-700" /> Draw Conducted Today
                </span>
              )}

              {effectiveStatus === 'Completed' && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#006633]" /> Result Published
                </span>
              )}

              {effectiveStatus === 'Result Pending' && (
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-700" /> Result Gazette Pending
                </span>
              )}

              {effectiveStatus === 'Rescheduled' && (
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-red-700" /> Rescheduled / Postponed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Rs. {scheduleItem.denomination} Prize Bond Draw #{scheduleItem.drawNo}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#006633]" /> {scheduleItem.date} ({scheduleItem.day})
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#006633]" /> {scheduleItem.city}, Pakistan
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" /> SBP BSC {scheduleItem.city} Field Office
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
            {timelineDraws.prev && (
              <button
                type="button"
                onClick={() => setCurrentDrawId(timelineDraws.prev!.id)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                title={`Previous Draw #${timelineDraws.prev.drawNo}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev Draw #{timelineDraws.prev.drawNo}</span>
              </button>
            )}

            {timelineDraws.next && (
              <button
                type="button"
                onClick={() => setCurrentDrawId(timelineDraws.next!.id)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                title={`Next Draw #${timelineDraws.next.drawNo}`}
              >
                <span className="hidden sm:inline">Next Draw #{timelineDraws.next.drawNo}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Comprehensive schedule specifications and gazette verification portal for Prize Bond Draw #{scheduleItem.drawNo} of Rs. {scheduleItem.denomination} denomination, held at SBP BSC {scheduleItem.city}. Verified against CDNS and State Bank of Pakistan records.
        </p>
      </div>

      {/* 04 & 05. PRIMARY DRAW SUMMARY CARD & COUNTDOWN / STATUS BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Summary Card Data */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#006633]" />
              <span>Official Draw Specifications</span>
            </h2>
            <LastUpdatedBadge date="15 August 2026" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Denomination
              </span>
              <strong className="text-base font-black text-slate-900 block">
                Rs. {scheduleItem.denomination}
              </strong>
              <button
                type="button"
                onClick={() => onNavigate('denomination', scheduleItem.denomination)}
                className="text-[11px] font-bold text-[#006633] hover:underline cursor-pointer"
              >
                View Bond Specs →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Draw Serial Number
              </span>
              <strong className="text-base font-black text-slate-900 block">
                Draw #{scheduleItem.drawNo}
              </strong>
              <span className="text-[11px] text-slate-500 font-medium block">
                Quarterly Cycle
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Scheduled Date
              </span>
              <strong className="text-base font-black text-slate-900 font-mono block">
                {scheduleItem.date}
              </strong>
              <span className="text-[11px] text-slate-500 font-medium block">
                Day: {scheduleItem.day}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Host City Venue
              </span>
              <strong className="text-base font-black text-slate-900 block">
                {scheduleItem.city}
              </strong>
              <span className="text-[11px] text-slate-500 font-medium block">
                SBP BSC Field Office
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                First Prize Award
              </span>
              <strong className="text-base font-black text-[#006633] block">
                {denomInfo.firstPrize}
              </strong>
              <span className="text-[11px] text-slate-500 font-medium block">
                1st Winner Award
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Current Status
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                  effectiveStatus === 'Completed'
                    ? 'bg-emerald-100 text-[#004D26]'
                    : effectiveStatus === 'Result Pending'
                    ? 'bg-purple-100 text-purple-900'
                    : effectiveStatus === 'Rescheduled'
                    ? 'bg-red-100 text-red-900'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {effectiveStatus}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Official Gazette
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 space-y-1">
            <div className="font-extrabold text-[#006633] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006633]" />
              <span>Official National Savings Draw Rules</span>
            </div>
            <p className="leading-relaxed">
              All Prize Bond draws in Pakistan are conducted by a committee appointed by the Central Directorate of National Savings. Draw entries are computerised and open to all valid series of Rs. {scheduleItem.denomination} Prize Bonds in circulation.
            </p>
          </div>
        </div>

        {/* Right Column (1 col): Status Action Banner / Countdown Widget */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between space-y-5">
          {/* STATE 1: UPCOMING / NEXT DRAW COUNTDOWN */}
          {(effectiveStatus === 'Upcoming' || effectiveStatus === 'Next Draw') && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" /> Upcoming Draw Countdown
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Draw Conducted On {scheduleItem.date}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Time remaining until draw proceedings begin at SBP BSC {scheduleItem.city}.
                </p>
              </div>

              {/* Countdown numbers */}
              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-xl font-black text-amber-300 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Days</div>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-xl font-black text-amber-300 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Hours</div>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-xl font-black text-amber-300 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Mins</div>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <div className="text-xl font-black text-amber-300 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Secs</div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  Check Your Bond Number
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('schedule')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Return To Full Schedule
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: DRAW TODAY */}
          {effectiveStatus === 'Draw Today' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-black uppercase tracking-wider animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" /> Draw Being Held Today
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Draw Proceedings In Progress
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The draw is taking place today at SBP BSC {scheduleItem.city}. Gazette lists will be uploaded immediately after release.
                </p>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
                <div className="text-amber-300 font-bold">Expected Publication:</div>
                <div className="text-slate-300">Today around 5:00 PM PKT</div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('results', scheduleItem.denomination)}
                className="w-full py-3 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Refresh Result Page
              </button>
            </div>
          )}

          {/* STATE 3: COMPLETED + RESULT AVAILABLE */}
          {effectiveStatus === 'Completed' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Result Gazette Published
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Draw Completed & Verified
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Official gazette winning numbers for Draw #{scheduleItem.drawNo} are published and ready for online verification.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-950/80 rounded-xl border border-emerald-700/60 text-xs space-y-1">
                <span className="text-emerald-300 font-bold block">Winning Gazette Status:</span>
                <span className="text-white font-extrabold block">1st, 2nd & 3rd Prizes Available</span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('results', scheduleItem.denomination)}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span>View Rs. {scheduleItem.denomination} Draw #{scheduleItem.drawNo} Result</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Check Your Bond Number
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: RESULT PENDING */}
          {effectiveStatus === 'Result Pending' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-white" /> Gazette Compilation Pending
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Draw Completed — Awaiting Gazette
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  The draw event was conducted on {scheduleItem.date}. SBP BSC draw committee is currently finalizing the official gazette.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('results', scheduleItem.denomination)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Check Result Availability
              </button>
            </div>
          )}

          {/* STATE 5: RESCHEDULED / CANCELLED */}
          {effectiveStatus === 'Rescheduled' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5 text-white" /> Postponed / Rescheduled
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
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

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />

      {/* 07. DRAW LOCATION CARD */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-[#006633]" />
          <span>Official Host Field Office Venue</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">
              State Bank of Pakistan — {scheduleItem.city} Field Office
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {venueAddress}
            </p>
            <p className="text-[11px] text-slate-500">
              Draw Auditorium • Open to Public & Authorized Gazette Committee
            </p>
          </div>

          <span className="text-xs font-bold bg-emerald-100 text-[#004D26] px-3 py-1 rounded-full shrink-0">
            {scheduleItem.city}, Pakistan
          </span>
        </div>
      </section>

      {/* 08, 15, 16. DRAW TIMELINE */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Schedule Context & Timeline
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rs. {scheduleItem.denomination} Draw Timeline 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Navigate seamlessly between previous, current, and upcoming draws for Rs. {scheduleItem.denomination} Prize Bond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PREVIOUS DRAW */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              timelineDraws.prev
                ? 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300 cursor-pointer'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
            onClick={() => {
              if (timelineDraws.prev) {
                setCurrentDrawId(timelineDraws.prev.id);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                ← Previous Draw
              </span>
              <span className="text-xs font-bold text-[#006633] bg-emerald-100 px-2 py-0.5 rounded">
                Rs. {scheduleItem.denomination}
              </span>
            </div>

            {timelineDraws.prev ? (
              <>
                <h3 className="text-base font-black text-slate-900">
                  Draw #{timelineDraws.prev.drawNo} — {timelineDraws.prev.city}
                </h3>
                <div className="text-xs text-slate-600 font-medium">
                  Date: <strong>{timelineDraws.prev.date}</strong> ({timelineDraws.prev.day})
                </div>
                <div className="pt-2 text-xs font-bold text-[#006633] flex items-center gap-1">
                  <span>View Draw #{timelineDraws.prev.drawNo} Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 py-4 font-medium">
                No earlier 2026 draw recorded for this denomination.
              </div>
            )}
          </div>

          {/* CURRENT DRAW */}
          <div className="p-5 rounded-2xl border-2 border-[#006633] bg-emerald-50/80 shadow-sm space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#006633] bg-emerald-200 px-2 py-0.5 rounded">
                ● Current Focus Draw
              </span>
              <span className="text-xs font-black text-[#006633]">
                Rs. {scheduleItem.denomination}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">
              Draw #{scheduleItem.drawNo} — {scheduleItem.city}
            </h3>

            <div className="text-xs text-slate-700 font-bold">
              Date: {scheduleItem.date} ({scheduleItem.day})
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Status: <span className="font-extrabold uppercase text-[#006633]">{effectiveStatus}</span>
            </div>
          </div>

          {/* NEXT DRAW */}
          <div
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              timelineDraws.next
                ? 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300 cursor-pointer'
                : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}
            onClick={() => {
              if (timelineDraws.next) {
                setCurrentDrawId(timelineDraws.next.id);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Next Draw →
              </span>
              <span className="text-xs font-bold text-[#006633] bg-emerald-100 px-2 py-0.5 rounded">
                Rs. {scheduleItem.denomination}
              </span>
            </div>

            {timelineDraws.next ? (
              <>
                <h3 className="text-base font-black text-slate-900">
                  Draw #{timelineDraws.next.drawNo} — {timelineDraws.next.city}
                </h3>
                <div className="text-xs text-slate-600 font-medium">
                  Date: <strong>{timelineDraws.next.date}</strong> ({timelineDraws.next.day})
                </div>
                <div className="pt-2 text-xs font-bold text-[#006633] flex items-center gap-1">
                  <span>View Draw #{timelineDraws.next.drawNo} Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 py-4 font-medium">
                No subsequent 2026 draw scheduled for this denomination.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10 & 11. ABOUT THIS DENOMINATION & CHECKER CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#006633]" />
              <span>Denomination Specifications</span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              About Rs. {scheduleItem.denomination} Prize Bond
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium block">1st Prize Amount:</span>
                <strong className="text-slate-900 text-sm font-black">{denomInfo.firstPrize}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">2nd Prize Amount:</span>
                <strong className="text-slate-900 text-sm font-black">{denomInfo.secondPrize}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Draw Frequency:</span>
                <strong className="text-slate-800 font-bold">{denomInfo.drawFrequency}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Bond Form:</span>
                <strong className="text-slate-800 font-bold">{denomInfo.isPremium ? 'Premium Registered' : 'Bearer Bond'}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('denomination', scheduleItem.denomination)}
              className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Rs. {scheduleItem.denomination} Bond Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" />
              <span>Instant Verification Tool</span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Have a Prize Bond for Rs. {scheduleItem.denomination}?
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Check your bond serial number or complete multi-series list against all official gazette draw records in one click. Free, fast, and 100% confidential.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Auto-preselects Rs. {scheduleItem.denomination}</span>
            <button
              type="button"
              onClick={() => onNavigate('checker', scheduleItem.denomination)}
              className="px-5 py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Check Prize Bond Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 23. OTHER DRAWS FOR SAME DENOMINATION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              More Rs. {scheduleItem.denomination} Prize Bond Draws
            </h2>
            <p className="text-xs text-slate-500">
              Complete annual scheduled events for Rs. {scheduleItem.denomination} denomination.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="text-xs font-bold text-[#006633] hover:underline cursor-pointer"
          >
            View Complete 2026 Schedule →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timelineDraws.sameDenomDraws.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentDrawId(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                item.id === scheduleItem.id
                  ? 'bg-emerald-50 border-[#006633] ring-1 ring-[#006633]'
                  : 'bg-slate-50 hover:bg-white hover:border-emerald-300 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900">Draw #{item.drawNo}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.status === 'Completed'
                      ? 'bg-emerald-100 text-[#004D26]'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-xs text-slate-700 font-semibold">{item.date}</div>
              <div className="text-[11px] text-slate-500">City: {item.city}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 25 & 26. AEO DIRECT ANSWERS */}
      <section className="bg-emerald-50/80 rounded-2xl p-6 sm:p-8 border border-emerald-200 space-y-6">
        <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#006633]" />
          <span>Direct Answers & Key Summary</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              When is the Rs. {scheduleItem.denomination} Prize Bond Draw #{scheduleItem.drawNo}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              The Rs. {scheduleItem.denomination} Prize Bond Draw #{scheduleItem.drawNo} is scheduled for <strong>{scheduleItem.date} ({scheduleItem.day})</strong> at the State Bank of Pakistan field office in <strong>{scheduleItem.city}</strong>.
            </p>
          </div>

          <div className="space-y-1 pt-3 border-t border-emerald-200/60">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Where is this Prize Bond draw being held?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              The draw is being held at the <strong>{venueAddress}</strong> in {scheduleItem.city}, Pakistan, under the supervision of the Central Directorate of National Savings committee.
            </p>
          </div>

          <div className="space-y-1 pt-3 border-t border-emerald-200/60">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Has the result for Draw #{scheduleItem.drawNo} been announced?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {effectiveStatus === 'Completed'
                ? `Yes. The official winning gazette for Rs. ${scheduleItem.denomination} Draw #${scheduleItem.drawNo} has been published and is available for instant online checking.`
                : `The result will be published on ${scheduleItem.date} immediately following official release by SBP BSC.`}
            </p>
          </div>
        </div>
      </section>

      {/* 28. SUPPORTING INFORMATION */}
      <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          How to Verify Your Prize Bond for Draw #{scheduleItem.drawNo}
        </h2>

        <p>
          Follow these practical steps to verify your Rs. {scheduleItem.denomination} bond numbers accurately against official National Savings records:
        </p>

        <ol className="list-decimal list-inside space-y-1.5 font-medium pl-1 text-slate-800">
          <li>Confirm that your bond denomination matches Rs. {scheduleItem.denomination}.</li>
          <li>Verify that your bond serial number was issued prior to {scheduleItem.date}.</li>
          <li>Check the published winning numbers for 1st Prize, 2nd Prize, or 3rd Prize categories.</li>
          <li>Use our instant online Checker to search entire series ranges automatically.</li>
          <li>Claim legitimate prize awards within the 6-year claim window at any SBP BSC office.</li>
        </ol>
      </article>

      {/* 55. FAQ ACCORDION SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Draw Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            FAQs for Draw #{scheduleItem.drawNo}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#006633] shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
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

      {/* 29. DATA SOURCE / TRUST BLOCK */}
      <div className="bg-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#006633] shrink-0" />
          <div>
            <strong className="text-slate-800 font-bold block">Verified National Schedule Data</strong>
            <span>
              Sources: Central Directorate of National Savings (CDNS) & State Bank of Pakistan (SBP BSC).
            </span>
          </div>
        </div>

        <LastUpdatedBadge date="15 August 2026" />
      </div>
    </div>
  );
};