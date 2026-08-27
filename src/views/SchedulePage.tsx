'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Info,
  HelpCircle,
  Check,
  ExternalLink,
  MapPin,
  ListFilter,
  Award,
  FileText,
  AlertCircle,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { DenominationValue, ScheduleItem } from '../types/prizebond';
import { SCHEDULE_2026, DENOMINATIONS, LATEST_DRAWS } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';

interface SchedulePageProps {
  initialFilter?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({
  initialFilter = 'all',
  onNavigate,
}) => {
  // Filter States
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedDenom, setSelectedDenom] = useState<string>(
    initialFilter !== 'all' && DENOMINATIONS.some((d) => d.value === initialFilter)
      ? initialFilter
      : 'all'
  );
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [statusTab, setStatusTab] = useState<'all' | 'Upcoming' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Scroll to section based on navbar dropdown parameter
  useEffect(() => {
    if (!initialFilter) return;

    const timer = setTimeout(() => {
      let targetId = '';
      if (initialFilter === 'upcoming') {
        targetId = 'upcoming-section';
      } else if (initialFilter === 'previous' || initialFilter === '2026') {
        targetId = 'annual-schedule-section';
      } else if (initialFilter === 'cities') {
        targetId = 'cities-section';
      } else if (initialFilter === 'calendar') {
        targetId = 'calendar-section';
      }

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [initialFilter]);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('sch-faq-1');

  // Live Countdown State for Next Draw
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 32, hours: 14, minutes: 22, seconds: 45 });

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

  // Identify Next Scheduled Draw
  const nextDraw = useMemo(() => {
    return (
      SCHEDULE_2026.find((s) => s.isNextDraw) ||
      SCHEDULE_2026.find((s) => s.status === 'Upcoming') ||
      SCHEDULE_2026[15]
    );
  }, []);

  // Host Cities derived from schedule
  const cities = useMemo(() => {
    const citySet = new Set(SCHEDULE_2026.map((s) => s.city));
    return Array.from(citySet).sort();
  }, []);

  // Monthly Breakdown of Draws for Calendar Roadmap
  const monthsList = [
    { name: 'Jan', full: 'January 2026', key: '2026-01' },
    { name: 'Feb', full: 'February 2026', key: '2026-02' },
    { name: 'Mar', full: 'March 2026', key: '2026-03' },
    { name: 'Apr', full: 'April 2026', key: '2026-04' },
    { name: 'May', full: 'May 2026', key: '2026-05' },
    { name: 'Jun', full: 'June 2026', key: '2026-06' },
    { name: 'Jul', full: 'July 2026', key: '2026-07' },
    { name: 'Aug', full: 'August 2026', key: '2026-08' },
    { name: 'Sep', full: 'September 2026', key: '2026-09' },
    { name: 'Oct', full: 'October 2026', key: '2026-10' },
    { name: 'Nov', full: 'November 2026', key: '2026-11' },
    { name: 'Dec', full: 'December 2026', key: '2026-12' },
  ];

  // Filtering Logic
  const filteredSchedule = useMemo(() => {
    return SCHEDULE_2026.filter((item) => {
      if (selectedYear !== '2026' && selectedYear !== 'all') {
        return false;
      }
      if (selectedDenom !== 'all' && item.denomination !== selectedDenom) return false;
      if (selectedCity !== 'all' && item.city !== selectedCity) return false;
      if (statusTab !== 'all' && item.status !== statusTab) return false;
      if (selectedMonth !== 'all' && !item.date.startsWith(selectedMonth)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCity = item.city.toLowerCase().includes(q);
        const matchesDate = item.date.includes(q) || item.day.toLowerCase().includes(q);
        const matchesDenom = item.denomination.includes(q);
        const matchesDrawNo = item.drawNo.toString().includes(q);
        if (!matchesCity && !matchesDate && !matchesDenom && !matchesDrawNo) return false;
      }
      return true;
    });
  }, [selectedYear, selectedDenom, selectedCity, statusTab, selectedMonth, searchQuery]);

  // Counts
  const upcomingCount = useMemo(
    () => SCHEDULE_2026.filter((s) => s.status === 'Upcoming').length,
    []
  );
  const completedCount = useMemo(
    () => SCHEDULE_2026.filter((s) => s.status === 'Completed').length,
    []
  );

  const clearAllFilters = () => {
    setSelectedYear('2026');
    setSelectedDenom('all');
    setSelectedCity('all');
    setStatusTab('all');
    setSelectedMonth('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedYear !== '2026' ||
    selectedDenom !== 'all' ||
    selectedCity !== 'all' ||
    statusTab !== 'all' ||
    selectedMonth !== 'all' ||
    searchQuery !== '';

  const scheduleFaqs = [
    {
      id: 'sch-faq-1',
      question: 'What is the official Prize Bond draw schedule?',
      answer:
        'The official Prize Bond draw schedule is an annual calendar released by the Central Directorate of National Savings (CDNS) and the State Bank of Pakistan (SBP). It specifies exact dates, day of the week, denomination value, draw number, and host city for all 36+ draw events held each calendar year.',
    },
    {
      id: 'sch-faq-2',
      question: 'When is the next Prize Bond draw taking place?',
      answer: `The next scheduled draw is for Rs. ${nextDraw.denomination} Prize Bond (Draw #${nextDraw.drawNo}), taking place on ${nextDraw.date} (${nextDraw.day}) at ${nextDraw.city}. Results are published on the same day after official gazette release by SBP BSC.`,
    },
    {
      id: 'sch-faq-3',
      question: 'How often are Prize Bond draws held in Pakistan?',
      answer:
        'Draws for each of the six official Prize Bond denominations (Rs. 100, 200, 750, 1500, 25,000 Premium, and 40,000 Premium) are held once every 3 months (quarterly). In total, there are approximately 36 draw events throughout the year.',
    },
    {
      id: 'sch-faq-4',
      question: 'Where are Prize Bond draws conducted?',
      answer:
        'Draws take place at State Bank of Pakistan Banking Services Corporation (SBP BSC) field offices located across major provincial cities, including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Sialkot, Hyderabad, and Muzaffarabad.',
    },
    {
      id: 'sch-faq-5',
      question: 'How do I check a previous or historical draw result?',
      answer:
        'You can filter our schedule table by switching to "Completed Draws" or choosing a specific year and denomination. Each completed draw record features a direct "View Gazette" link leading to the complete official winning list.',
    },
    {
      id: 'sch-faq-6',
      question: 'When are draw results published online?',
      answer:
        'Draw gazettes are officially compiled by SBP draw committees on the day of the event. PrizeBond Pakistan updates draw lists within hours of official SBP BSC publication, allowing instant online verification.',
    },
    {
      id: 'sch-faq-7',
      question: 'What happens if a scheduled draw date falls on a public holiday?',
      answer:
        'If a scheduled draw date coincides with an official gazetted public holiday (e.g. Independence Day or Kashmir Day), the draw is held on the very next working day at the same host SBP field office venue.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 02. BREADCRUMBS */}
      <Breadcrumbs
        items={[
          { label: 'Draw Schedule', onClick: () => onNavigate('schedule') },
          { label: '2026 Schedule & Calendar' },
        ]}
      />

      {/* 03. HERO SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20 opacity-70" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#004D26] text-xs font-black uppercase tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-[#006633]" /> Official Annual Calendar • CDNS & SBP Gazette
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Prize Bond Draw Schedule 2026
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            View upcoming and previous Prize Bond draws in Pakistan, including draw dates, denominations, host cities, and direct gazette results. Verified against State Bank of Pakistan records.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> 24 Annual Draws
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> 6 Denominations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> 11 SBP Venue Cities
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" /> Verified Gazette Archive
            </span>
          </div>
        </div>
      </div>

      {/* 04 & 05. NEXT DRAW — PRIMARY FEATURE CARD WITH COUNTDOWN */}
      <section className="bg-gradient-to-r from-[#003B1D] via-[#004D26] to-[#003B1D] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-600/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left info */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /> Next Prize Bond Draw Spotlight
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rs. {nextDraw.denomination} Prize Bond — Draw #{nextDraw.drawNo}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#002B15] p-3.5 rounded-xl border border-emerald-700/60 text-xs">
              <div>
                <span className="text-emerald-300 font-medium block">Denomination</span>
                <strong className="text-white text-sm font-extrabold">
                  Rs. {nextDraw.denomination}
                </strong>
              </div>
              <div>
                <span className="text-emerald-300 font-medium block">Draw Date</span>
                <strong className="text-white text-sm font-extrabold">{nextDraw.date}</strong>
              </div>
              <div>
                <span className="text-emerald-300 font-medium block">Day</span>
                <strong className="text-white text-sm font-extrabold">{nextDraw.day}</strong>
              </div>
              <div>
                <span className="text-emerald-300 font-medium block">Host City</span>
                <strong className="text-white text-sm font-extrabold">{nextDraw.city}</strong>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Official SBP BSC venue: <strong>State Bank of Pakistan, {nextDraw.city} Branch</strong>. Draw results will be uploaded immediately following gazette publication.
            </p>
          </div>

          {/* Right Live Countdown Widget */}
          <div className="w-full lg:w-auto bg-[#002B15]/90 p-5 rounded-2xl border border-emerald-600/50 flex flex-col items-center justify-center space-y-3 shrink-0">
            <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Remaining To Draw
            </span>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#003B1D] px-3 py-2 rounded-xl border border-emerald-600/60 min-w-16">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-emerald-200 uppercase font-bold">Days</div>
              </div>

              <div className="bg-[#003B1D] px-3 py-2 rounded-xl border border-emerald-600/60 min-w-16">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-emerald-200 uppercase font-bold">Hours</div>
              </div>

              <div className="bg-[#003B1D] px-3 py-2 rounded-xl border border-emerald-600/60 min-w-16">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-emerald-200 uppercase font-bold">Mins</div>
              </div>

              <div className="bg-[#003B1D] px-3 py-2 rounded-xl border border-emerald-600/60 min-w-16">
                <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-emerald-200 uppercase font-bold">Secs</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
              <button
                type="button"
                onClick={() => onNavigate('draw-detail', nextDraw.id)}
                className="w-full px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer"
              >
                View Draw Details
              </button>

              <button
                type="button"
                onClick={() => onNavigate('checker')}
                className="w-full px-4 py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl border border-emerald-500/50 transition-colors text-center cursor-pointer"
              >
                Check Your Bond
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADSENSE PLACEHOLDER */}
      <AdSensePlaceholder slot="banner" />

      {/* 06 & 07. UPCOMING DRAWS GRID */}
      <section id="upcoming-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
              Upcoming Schedule Events
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Upcoming Prize Bond Draws 2026
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled draw events for September, October, November, and December 2026.
            </p>
          </div>

          <span className="text-xs font-bold text-[#006633] bg-emerald-100 px-3 py-1 rounded-full shrink-0">
            {upcomingCount} Upcoming Events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCHEDULE_2026.filter((s) => s.status === 'Upcoming').map((draw) => (
            <div
              key={draw.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                draw.isNextDraw
                  ? 'bg-gradient-to-r from-amber-500/10 via-white to-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-slate-50/60 hover:bg-white hover:border-emerald-300 hover:shadow-xs border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#006633] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Rs. {draw.denomination}
                  </span>
                  {draw.isNextDraw ? (
                    <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded uppercase">
                      Next Up
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase">
                      Upcoming
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-900">
                  Draw #{draw.drawNo} — {draw.city}
                </h3>

                <div className="text-xs text-slate-600 mt-2 space-y-1 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#006633]" />
                    <span>
                      <strong>{draw.date}</strong> ({draw.day})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>SBP BSC {draw.city} Field Office</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Status: Scheduled</span>
                <button
                  type="button"
                  onClick={() => onNavigate('draw-detail', draw.id)}
                  className="px-3 py-1.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 08, 09, 10. SCHEDULE FILTER BAR */}
      <div id="schedule-filter-section" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#006633]" />
            <div>
              <h3 className="text-base font-black text-slate-900">Filter Annual Schedule</h3>
              <p className="text-xs text-slate-500">
                Filter by year, denomination, city venue, or search draw numbers.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search draw #, city, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#006633]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Year Selector */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Select Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="2026">2026 Schedule</option>
              <option value="2025">2025 Schedule</option>
              <option value="2024">2024 Schedule</option>
              <option value="2023">2023 Schedule</option>
              <option value="2022">2022 Schedule</option>
            </select>
          </div>

          {/* Denomination Filter */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Select Denomination
            </label>
            <select
              value={selectedDenom}
              onChange={(e) => setSelectedDenom(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="all">All Denominations (6)</option>
              {DENOMINATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  Rs. {d.value} ({d.formattedAmount})
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Select City Venue
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="all">All Pakistan Host Cities ({cities.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Filter by Status
            </label>
            <select
              value={statusTab}
              onChange={(e) => setStatusTab(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#006633] cursor-pointer"
            >
              <option value="all">All Statuses (Upcoming & Completed)</option>
              <option value="Upcoming">Upcoming Draws Only ({upcomingCount})</option>
              <option value="Completed">Completed Draws Gazette ({completedCount})</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Bar */}
        {hasActiveFilters && (
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500 font-medium">
              Active Filters Applied: Showing <strong>{filteredSchedule.length}</strong> matching draw(s).
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 11, 12, 13, 14. ANNUAL SCHEDULE TABLE & MOBILE STACKED CARDS */}
      <section id="annual-schedule-section" className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-0">
        {/* Table Toolbar Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {selectedYear} Prize Bond Draw Schedule ({filteredSchedule.length})
            </h2>
            <span className="text-xs font-bold bg-emerald-100 text-[#004D26] px-2.5 py-0.5 rounded-full">
              Annual Calendar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#006633] text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Desktop Table View
            </button>

            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#006633] text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Grid Cards View
            </button>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 pt-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusTab('all')}
            className={`px-4 py-2 rounded-t-xl border-t border-x transition-colors cursor-pointer ${
              statusTab === 'all'
                ? 'bg-white border-slate-200 text-[#006633] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All Draws ({SCHEDULE_2026.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusTab('Upcoming')}
            className={`px-4 py-2 rounded-t-xl border-t border-x transition-colors cursor-pointer ${
              statusTab === 'Upcoming'
                ? 'bg-white border-slate-200 text-[#006633] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Draws ({upcomingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusTab('Completed')}
            className={`px-4 py-2 rounded-t-xl border-t border-x transition-colors cursor-pointer ${
              statusTab === 'Completed'
                ? 'bg-white border-slate-200 text-[#006633] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Previous / Completed Gazette ({completedCount})
          </button>
        </div>

        {/* TABLE CONTENT */}
        {filteredSchedule.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">
              No Prize Bond Draws Match Your Filter Criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your year, denomination, or city selection to view scheduled draw events.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 bg-[#006633] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80 text-slate-700 font-black uppercase text-[11px] tracking-wider">
                  <th className="p-3.5">Draw #</th>
                  <th className="p-3.5">Denomination</th>
                  <th className="p-3.5">Draw Date</th>
                  <th className="p-3.5">Day</th>
                  <th className="p-3.5">City Venue</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredSchedule.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      item.isNextDraw ? 'bg-amber-50/70 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold text-slate-900">
                      #{item.drawNo}
                      {item.isNextDraw && (
                        <span className="ml-2 text-[10px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase">
                          Next
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => onNavigate('denomination', item.denomination)}
                        className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-[#004D26] font-bold hover:underline cursor-pointer"
                      >
                        Rs. {item.denomination}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{item.date}</td>
                    <td className="p-3.5 text-slate-600">{item.day}</td>
                    <td className="p-3.5 font-bold text-slate-800">{item.city}</td>
                    <td className="p-3.5">
                      {item.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#006633] bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" /> Upcoming
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {item.status === 'Completed' ? (
                        <button
                          type="button"
                          onClick={() => onNavigate('results', item.denomination)}
                          className="px-3 py-1.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold rounded-lg transition-colors text-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>View Result</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate('draw-detail', item.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg transition-colors text-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchedule.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                  item.isNextDraw
                    ? 'bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 bg-[#006633] text-white font-extrabold text-xs rounded-md">
                      Rs. {item.denomination}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-[#004D26]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    Draw #{item.drawNo} — {item.city}
                  </h3>

                  <div className="text-xs text-slate-600 mt-2 space-y-1">
                    <div>
                      Date: <strong>{item.date}</strong> ({item.day})
                    </div>
                    <div>Venue: SBP BSC {item.city}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {item.status === 'Completed' ? 'Gazette Published' : 'Scheduled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('results', item.denomination)}
                    className="px-3 py-1.5 bg-[#006633] text-white hover:bg-[#004D26] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <span>{item.status === 'Completed' ? 'View Result' : 'View Draw'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 21. DRAW CALENDAR / TIMELINE ROADMAP */}
      <section id="calendar-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            2026 Calendar Roadmap
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Monthly Prize Bond Draw Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Click on any month to filter scheduled draw events instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {monthsList.map((m) => {
            const countInMonth = SCHEDULE_2026.filter((s) => s.date.startsWith(m.key)).length;
            const isSelected = selectedMonth === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => {
                  setSelectedMonth(isSelected ? 'all' : m.key);
                }}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006633] text-white border-[#006633] shadow-md ring-2 ring-[#006633]/30 scale-102'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="font-black text-sm">{m.name}</div>
                <div className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                  {countInMonth} Draws
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 22 & 23. DRAW CITIES SECTION */}
      <section id="cities-section" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Official SBP Host Venues
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Prize Bond Draw Host Cities
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Draw events are rotated across State Bank of Pakistan Banking Services Corporation field offices. Click a city to filter.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cities.map((city) => {
            const countInCity = SCHEDULE_2026.filter((s) => s.city === city).length;
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSelectedCity(isSelected ? 'all' : city);
                  const el = document.getElementById('schedule-filter-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006633] text-white border-[#006633] shadow-sm'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#006633]'}`} />
                  <span>{city}</span>
                </div>
                <div className={`text-[11px] mt-1 font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {countInCity} Scheduled Draw(s)
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 11 & 35. LATEST DRAW CONNECTION */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-4 border border-emerald-600/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-300" /> Latest Published Draw Gazette
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Rs. {LATEST_DRAWS[0].denomination} Prize Bond — Draw #{LATEST_DRAWS[0].drawNo}
            </h2>
            <p className="text-xs text-emerald-100">
              Held on {LATEST_DRAWS[0].formattedDate} at {LATEST_DRAWS[0].city} • 1st Prize Winner: <strong className="text-amber-300 font-mono text-sm">{LATEST_DRAWS[0].firstPrizeNumbers[0]}</strong> ({LATEST_DRAWS[0].prizeStructure.firstAmountFormatted})
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('results', LATEST_DRAWS[0].denomination)}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>View Full Winning Gazette</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 36 & 37. CHECKER & DENOMINATIONS CROSS CONNECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHECKER CONNECTION CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#006633]" />
              <span>Automated Verification</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Want to check if your Prize Bond has won?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use our instant Prize Bond Checker to evaluate single numbers, bulk lists, or series ranges against official published draw gazettes in one click.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Free, fast & secure</span>
            <button
              type="button"
              onClick={() => onNavigate('checker')}
              className="px-5 py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Check Prize Bond Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DENOMINATIONS CONNECTION CARD */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-black text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#006633]" />
              <span>Explore All Bonds</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Explore Prize Bond Denominations & Specs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn about prize structures, 1st prize amounts, draw frequencies, and tax rules for all 6 official National Savings bond types.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {DENOMINATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => onNavigate('denomination', d.value)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-[#004D26] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Rs. {d.value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 26 & 27. AEO DIRECT ANSWERS */}
      <section className="bg-emerald-50/80 rounded-2xl p-6 sm:p-8 border border-emerald-200 space-y-6">
        <div className="flex items-center gap-2 text-[#006633] font-black text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#006633]" />
          <span>Direct Answer / Search Summary</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              When is the next Prize Bond draw?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              The next scheduled Prize Bond draw is for <strong>Rs. {nextDraw.denomination} Prize Bond (Draw #{nextDraw.drawNo})</strong>, scheduled for <strong>{nextDraw.date} ({nextDraw.day})</strong> at the <strong>State Bank of Pakistan, {nextDraw.city}</strong> field office. Official winning results will be published immediately following SBP gazette release.
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-emerald-200/60">
            <h3 className="text-base font-extrabold text-slate-900">
              How often are Prize Bond draws held in Pakistan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Prize Bond draws for each individual denomination are conducted once every 3 months (quarterly) by the Central Directorate of National Savings (CDNS). With six official denominations available (Rs. 100, 200, 750, 1500, 25,000 Premium, and 40,000 Premium), a total of 36 draw events take place annually across major cities in Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* 28. SEO SUPPORTING CONTENT AREA */}
      <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          About the Prize Bond Draw Schedule in Pakistan
        </h2>
        <p>
          The official National Prize Bond draw schedule is issued annually by the Central Directorate of National Savings (CDNS) under the Ministry of Finance, Government of Pakistan. The calendar details the precise draw dates, venue cities, and draw numbers for all six active Prize Bond denominations.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">
          How to Read the Draw Schedule
        </h3>
        <p>
          Each record in the schedule displays five critical attributes: the draw serial number, denomination value (Rs. 100 to Rs. 40,000 Premium), scheduled date, day of the week, and the host SBP BSC field office city. Draw events typically take place around the 10th or 15th day of every month. If a draw date coincides with an official gazetted public holiday, the draw automatically moves to the next working day.
        </p>

        <h3 className="text-base font-bold text-slate-900 pt-2">
          Draw Venues and Gazette Dissemination
        </h3>
        <p>
          Draws are rotated among eleven provincial centers: Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad, Sialkot, Hyderabad, and Muzaffarabad. A committee formed by SBP and local dignitaries oversees the computerized draw process. Winning lists are published as official gazettes on the same evening and remain claimable for six years under national savings regulations.
        </p>
      </article>

      {/* 51 / 16. FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="text-xs font-extrabold text-[#006633] uppercase tracking-wider mb-1">
            Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Prize Bond Schedule FAQs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding draw calendars, dates, venues, and gazette releases.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {scheduleFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
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

      {/* VIDEO GUIDE TUTORIAL WIDGET */}
      <VideoGuideWidget
        categoryBadge="🎬 DRAW SCHEDULE TUTORIAL"
        title="Video Guide: How to Read & Track the Annual Prize Bond Schedule"
        subtitle="Watch our quick guide on tracking upcoming draw dates, host city venues, and gazette release times."
        summaryTitle="📌 Annual Draw Schedule Summary"
        summaryItems={[
          {
            title: 'Annual Draw Calendar',
            desc: 'Official dates released annually by Central Directorate of National Savings.',
          },
          {
            title: 'Public Holiday Adjustments',
            desc: 'If a draw falls on a public holiday, it moves to the next working day.',
          },
          {
            title: 'Rotating Host Cities',
            desc: 'Draws rotate across 11 major State Bank field offices nationwide.',
          },
          {
            title: 'Gazette Publication Time',
            desc: 'Official winning lists published on the evening of the draw date.',
          },
        ]}
        duration="02:15"
        onNavigate={onNavigate}
      />

      {/* 29 & 30. TRUST, DATA SOURCE & LAST UPDATED FOOTER BLOCK */}
      <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#006633] shrink-0" />
          <div>
            <div className="font-extrabold text-slate-900">
              Official Data Source & Transparency Statement
            </div>
            <div className="text-[11px] text-slate-500">
              Schedule information is compiled directly from official gazettes issued by Central Directorate of National Savings (CDNS) & State Bank of Pakistan (SBP BSC).
            </div>
          </div>
        </div>

        <LastUpdatedBadge
          date="15 August 2026"
          source="CDNS Annual Gazette"
          className="shrink-0"
        />
      </div>
    </div>
  );
};