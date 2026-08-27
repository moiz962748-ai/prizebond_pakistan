'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet,
  Filter,
  Sparkles,
  X,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Clock,
  SlidersHorizontal,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { DenominationValue, DrawRecord } from '../types/prizebond';
import { DENOMINATIONS, FAQS } from '../data/mockData';
import { ALL_DRAW_RESULTS } from '../data/resultsData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';
import { VideoGuideWidget } from '../components/common/VideoGuideWidget';

interface ResultsPageProps {
  initialDenomination?: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  initialDenomination = 'all',
  onNavigate,
}) => {
  // Filter States
  const [selectedDenom, setSelectedDenom] = useState<string>(initialDenomination || 'all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [drawNoSearch, setDrawNoSearch] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal / Detail Gazette View State
  const [selectedDrawForModal, setSelectedDrawForModal] = useState<DrawRecord | null>(null);
  const [thirdPrizeModalFilter, setThirdPrizeModalFilter] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Simulation UI States for Verification (Loading / Error testing)
  const [isLoadingSim, setIsLoadingSim] = useState<boolean>(false);
  const [isErrorSim, setIsErrorSim] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('results-faq-1');

  // Cities List for Filter Dropdown
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    ALL_DRAW_RESULTS.forEach((d) => citiesSet.add(d.city));
    return Array.from(citiesSet).sort();
  }, []);

  // Filtered Results Calculation
  const filteredResults = useMemo(() => {
    return ALL_DRAW_RESULTS.filter((draw) => {
      // Denomination
      if (selectedDenom !== 'all' && draw.denomination !== selectedDenom) {
        return false;
      }
      // Year
      if (selectedYear !== 'all') {
        const drawYear = draw.date.substring(0, 4);
        if (selectedYear === 'older') {
          if (parseInt(drawYear, 10) >= 2023) return false;
        } else if (drawYear !== selectedYear) {
          return false;
        }
      }
      // City
      if (selectedCity !== 'all' && draw.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // Draw Number Search
      if (drawNoSearch.trim() !== '') {
        const query = drawNoSearch.trim();
        const matchesDrawNo = draw.drawNo.toString().includes(query);
        const matchesFirstPrize = draw.firstPrizeNumbers.some((num) => num.includes(query));
        if (!matchesDrawNo && !matchesFirstPrize) return false;
      }

      return true;
    });
  }, [selectedDenom, selectedYear, selectedCity, drawNoSearch]);

  // Paginated Results
  const totalResults = filteredResults.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredResults.slice(startIndex, startIndex + pageSize);
  }, [filteredResults, currentPage, pageSize]);

  // Reset pagination when filters change
  const handleFilterChange = (type: 'denom' | 'year' | 'city' | 'search', value: string) => {
    setCurrentPage(1);
    if (type === 'denom') setSelectedDenom(value);
    if (type === 'year') setSelectedYear(value);
    if (type === 'city') setSelectedCity(value);
    if (type === 'search') setDrawNoSearch(value);
  };

  const clearAllFilters = () => {
    setSelectedDenom('all');
    setSelectedYear('all');
    setSelectedCity('all');
    setDrawNoSearch('');
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  // Toggle Loading Simulation
  const handleSimulateLoading = () => {
    setIsLoadingSim(true);
    setTimeout(() => {
      setIsLoadingSim(false);
    }, 800);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 02. BREADCRUMB CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Results', onClick: () => onNavigate('results') },
            ...(selectedDenom !== 'all'
              ? [{ label: `Rs. ${selectedDenom} Results` }]
              : [{ label: 'All Results Hub' }]),
          ]}
        />
      </div>

      {/* 03 & 04. HERO / PAGE INTRODUCTION & AEO DIRECT ANSWER BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle Accent Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004D26] via-[#006633] to-[#003B1D]"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006633] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#006633]" />
                <span>State Bank of Pakistan & National Savings Verified Results</span>
              </div>

              {/* H1 */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Prize Bond Results Pakistan
              </h1>

              {/* Supporting Text */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                View the latest and historical Prize Bond results in Pakistan, including winning
                numbers, draw dates, draw cities and official gazette results for major Prize Bond
                denominations.
              </p>

              {/* AEO Direct Answer Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-3 mt-4">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block mb-1">
                    Direct Answer Summary:
                  </strong>
                  Looking for the latest Prize Bond result? Select a Prize Bond denomination below
                  to view recent and previous draw results, or use the Prize Bond Checker to verify
                  your bond number across official gazettes.
                </div>
              </div>
            </div>

            {/* 05. PRIMARY ACTIONS & TRUST STAMP */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
              <button
                onClick={() => onNavigate('checker')}
                className="px-6 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                <span>Check Your Prize Bond</span>
              </button>

              <button
                onClick={() => onNavigate('latest-draw')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#006633]" />
                <span>View Latest Draw</span>
              </button>

              <div className="text-center pt-1">
                <LastUpdatedBadge date="15 August 2026" source="National Savings Gazette" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. FEATURED / LATEST PRIZE BOND RESULTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Featured Gazette Highlights
            </div>
            <h2 className="text-xl font-black text-slate-900">Latest Prize Bond Draws</h2>
          </div>
          <button
            onClick={() => handleFilterChange('year', '2026')}
            className="text-xs font-bold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All 2026 Draws</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_DRAW_RESULTS.slice(0, 6).map((draw) => (
            <div
              key={draw.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-[#004D26]">
                    Rs. {draw.denomination} Bond
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Draw #{draw.drawNo}
                  </span>
                </div>

                <div className="font-mono text-lg font-black text-slate-900 mb-1">
                  1st Prize: {draw.prizeStructure.firstAmountFormatted}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{draw.formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{draw.city}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1 mb-3">
                  Winning Number: <strong className="font-mono text-slate-800">{draw.firstPrizeNumbers.join(', ')}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedDrawForModal(draw)}
                className="w-full py-2 bg-slate-100 hover:bg-[#006633] hover:text-white text-slate-800 font-bold text-xs rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Official Gazette</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ADSENSE AD PLACEHOLDER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSensePlaceholder slot="banner" />
      </div>

      {/* 07. RESULT FILTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#006633]" />
                <span>Search & Filter Results Database</span>
              </h2>
              <p className="text-xs text-slate-500">
                Filter by denomination, draw year, city, or search specific draw number.
              </p>
            </div>

            {/* Quick Dev Simulation Controls */}
            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={handleSimulateLoading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-200 font-medium flex items-center gap-1 cursor-pointer"
                title="Test skeleton loading state"
              >
                <RefreshCw className="w-3 h-3" /> Simulate Loading
              </button>
              <button
                onClick={() => setIsErrorSim(!isErrorSim)}
                className={`px-2.5 py-1 rounded border font-medium flex items-center gap-1 cursor-pointer ${
                  isErrorSim
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Test error boundary state"
              >
                <AlertTriangle className="w-3 h-3" /> {isErrorSim ? 'Error Active' : 'Test Error State'}
              </button>
            </div>
          </div>

          {/* Denomination Selector Tabs / Pills */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Denomination
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('denom', 'all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedDenom === 'all'
                    ? 'bg-[#006633] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                }`}
              >
                All Prize Bonds
              </button>
              {DENOMINATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => handleFilterChange('denom', d.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDenom === d.value
                      ? 'bg-[#006633] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                  }`}
                >
                  Rs. {d.value} {d.isPremium ? 'Premium' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Search Input */}
            <div className="relative">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Search Draw / Winning #
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 104 or 452819"
                  value={drawNoSearch}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-[#006633] focus:bg-white"
                />
                {drawNoSearch && (
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Draw Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-[#006633] focus:bg-white cursor-pointer"
              >
                <option value="all">All Draw Years</option>
                <option value="2026">2026 Draws</option>
                <option value="2025">2025 Draws</option>
                <option value="2024">2024 Draws</option>
                <option value="2023">2023 Draws</option>
                <option value="2022">2022 Draws</option>
                <option value="older">2021 & Previous Years</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Draw City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-[#006633] focus:bg-white cursor-pointer"
              >
                <option value="all">All Pakistan Draw Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-end">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  showAdvancedFilters
                    ? 'bg-emerald-50 text-[#006633] border-[#006633]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvancedFilters ? 'Hide Advanced' : 'More Filters'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showAdvancedFilters ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Expanded Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Status Filter</span>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded text-[#006633]" />
                    <span>Official Gazette Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded text-[#006633]" />
                    <span>Historical Archive Results</span>
                  </label>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Result Type</span>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded text-[#006633]" />
                    <span>Standard Bearer Bonds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" defaultChecked className="rounded text-[#006633]" />
                    <span>Registered Premium Bonds</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <span className="font-bold text-slate-700 block mb-1">Active Filter Badges</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDenom !== 'all' && (
                    <span className="bg-emerald-100 text-[#004D26] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Rs. {selectedDenom}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedDenom('all')}
                      />
                    </span>
                  )}
                  {selectedYear !== 'all' && (
                    <span className="bg-emerald-100 text-[#004D26] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      Year: {selectedYear}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedYear('all')} />
                    </span>
                  )}
                  {selectedCity !== 'all' && (
                    <span className="bg-emerald-100 text-[#004D26] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      City: {selectedCity}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCity('all')} />
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-[11px] font-bold text-red-600 hover:underline text-left cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 08. MAIN RESULTS TABLE (DESKTOP) & MOBILE RESULT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Bar */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#006633]" />
                <span>Prize Bond Results Database</span>
              </h3>
              <p className="text-xs text-slate-500">
                Showing {totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, totalResults)} of {totalResults} draw records
              </p>
            </div>

            {/* Results per Page Selector */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold">Per Page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 px-2 py-1 rounded text-xs font-bold focus:outline-none focus:border-[#006633]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* CONDITIONAL RENDERING FOR UI STATES */}
          {isErrorSim ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-lg font-bold text-slate-900">We couldn&apos;t load the results right now</h4>
                <p className="text-xs text-slate-500">
                  A temporary connection issue occurred while fetching the National Savings database archive.
                </p>
              </div>
              <button
                onClick={() => setIsErrorSim(false)}
                className="px-5 py-2 bg-[#006633] text-white font-bold text-xs rounded-lg hover:bg-[#004D26] cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : isLoadingSim ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg w-full"></div>
              ))}
            </div>
          ) : paginatedResults.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-lg font-bold text-slate-900">No results found for the selected filters</h4>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query, denomination filter, or year selection to view official draw records.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 bg-[#006633] text-white font-bold text-xs rounded-lg hover:bg-[#004D26] cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3.5 font-extrabold uppercase">Denomination</th>
                      <th className="p-3.5 font-extrabold uppercase">Draw #</th>
                      <th className="p-3.5 font-extrabold uppercase">Draw Date</th>
                      <th className="p-3.5 font-extrabold uppercase">Draw City</th>
                      <th className="p-3.5 font-extrabold uppercase">1st Prize Winner</th>
                      <th className="p-3.5 font-extrabold uppercase">Status</th>
                      <th className="p-3.5 font-extrabold uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedResults.map((draw) => (
                      <tr
                        key={draw.id}
                        className="hover:bg-emerald-50/60 transition-colors group cursor-pointer"
                        onClick={() => setSelectedDrawForModal(draw)}
                      >
                        <td className="p-3.5 font-bold text-slate-900">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-[#004D26] font-extrabold">
                            Rs. {draw.denomination}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          Draw #{draw.drawNo}
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{draw.formattedDate}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{draw.city}</td>
                        <td className="p-3.5 font-mono font-black text-[#006633]">
                          {draw.firstPrizeNumbers[0]}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Official Gazette
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrawForModal(draw);
                            }}
                            className="px-3 py-1.5 bg-[#006633] text-white hover:bg-[#004D26] rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs"
                          >
                            View Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE RESULT CARDS VIEW */}
              <div className="md:hidden divide-y divide-slate-100 p-4 space-y-4">
                {paginatedResults.map((draw) => (
                  <div
                    key={draw.id}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-[#004D26] font-black text-xs">
                        Rs. {draw.denomination} Prize Bond
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-700">
                        Draw #{draw.drawNo}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-bold">
                          Draw Date
                        </span>
                        <span className="font-semibold text-slate-800">{draw.formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-bold">
                          Draw City
                        </span>
                        <span className="font-semibold text-slate-800">{draw.city}</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block font-bold">
                          1st Prize Winning Number
                        </span>
                        <span className="font-mono font-black text-[#006633] text-sm">
                          {draw.firstPrizeNumbers[0]}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {draw.prizeStructure.firstAmountFormatted}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDrawForModal(draw)}
                      className="w-full py-2 bg-[#006633] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>View Full Draw Result</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 09. PAGINATION CONTROLS */}
          {totalResults > 0 && !isErrorSim && !isLoadingSim && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-700">
              <div>
                Showing Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                        currentPage === p
                          ? 'bg-[#006633] text-white border-[#006633]'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 10. BROWSE RESULTS BY PRIZE BOND (DENOMINATION HUB CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-xs font-bold text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Denomination Hubs
          </div>
          <h2 className="text-2xl font-black text-slate-900">Browse Results by Prize Bond</h2>
          <p className="text-xs text-slate-500">
            Select a specific Prize Bond denomination to view all official draw results and winning records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DENOMINATIONS.map((denom) => {
            const latestForDenom = ALL_DRAW_RESULTS.find((d) => d.denomination === denom.value);
            return (
              <div
                key={denom.value}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#006633] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-50 text-[#004D26] border border-emerald-200">
                      {denom.isPremium ? 'Premium Registered' : 'Standard Bearer'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {denom.drawFrequency}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    Rs. {denom.formattedAmount}
                  </h3>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">1st Prize Payout:</span>
                      <strong className="text-slate-900 font-bold">{denom.firstPrize}</strong>
                    </div>
                    {latestForDenom && (
                      <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-500">Latest Draw #{latestForDenom.drawNo}:</span>
                        <span className="font-bold text-[#006633]">{latestForDenom.formattedDate}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {denom.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleFilterChange('denom', denom.value)}
                    className="text-xs font-extrabold text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Rs. {denom.value} Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('denomination', denom.value)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Bond Specs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12 & 13. LATEST DRAW CONNECTION & CHECKER CROSS-LINK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Latest Draw Connection */}
          <div className="bg-gradient-to-br from-emerald-950 via-[#004D26] to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-md flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs font-bold inline-block mb-3">
                Most Recent Draw Gazette
              </span>
              <h3 className="text-xl font-black text-white">Looking for the Most Recent Draw?</h3>
              <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                Rs. 1,500 Draw #103 was held on 15 August 2026 at Faisalabad. View complete winning lists for 1st, 2nd, and 3rd prize numbers immediately.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-emerald-800/80 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">Draw #103 — Faisalabad</span>
              <button
                onClick={() => onNavigate('latest-draw')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-[#004D26] font-black text-xs rounded-lg shadow-sm transition-transform active:scale-98 cursor-pointer"
              >
                View Latest Draw
              </button>
            </div>
          </div>

          {/* Banner 2: Checker Cross-Link */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-[#006633] text-xs font-bold inline-block mb-3 border border-slate-200">
                Instant Verification Tool
              </span>
              <h3 className="text-xl font-black text-slate-900">Have a Prize Bond Number?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Check whether your bond numbers have won 1st, 2nd, or 3rd prize across multiple historical draws using our automated bulk checker.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Supports Single, Series & Bulk Check</span>
              <button
                onClick={() => onNavigate('checker')}
                className="px-4 py-2 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Check Prize Bond Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 14. RELATED PRIZE BOND INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-xs font-bold text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Educational Knowledge Base
          </div>
          <h2 className="text-2xl font-black text-slate-900">Prize Bond Guides & Rules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              slug: 'how-prize-bonds-work',
              title: 'How Prize Bond Results Work',
              desc: 'Learn how computerised draw series are generated and verified under State Bank regulations.',
            },
            {
              slug: 'how-to-check-prize-bonds',
              title: 'How to Check Prize Bonds',
              desc: 'Step-by-step tutorial on searching single numbers, series ranges, and bulk lists online.',
            },
            {
              slug: 'prize-bond-rules',
              title: 'Official Prize Bond Rules',
              desc: 'Important guidelines on 6-year claim limits, lost bond policies, and draw eligibility rules.',
            },
            {
              slug: 'prize-money-and-tax',
              title: 'Prize Money & Tax Deductions',
              desc: 'Complete 15% (Filer) and 30% (Non-Filer) withholding tax breakdown under Income Tax Ordinance 2001.',
            },
            {
              slug: 'how-to-claim-a-prize',
              title: 'How to Claim a Prize',
              desc: 'Official SBP-BSC claim submission process, PB-1 forms, and IBAN bank transfer guidelines.',
            },
            {
              slug: 'how-to-buy-prize-bonds',
              title: 'How to Buy Prize Bonds',
              desc: 'Where to buy authentic bearer and Premium registered Prize Bonds across Pakistan.',
            },
          ].map((item) => (
            <div
              key={item.slug}
              onClick={() => onNavigate('information', item.slug)}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#006633] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.desc}</p>
              </div>
              <div className="mt-3 pt-2 text-[11px] font-bold text-[#006633] hover:underline flex items-center gap-1">
                <span>Read Full Article</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15. FAQ ACCORDION FOR RESULTS USERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="mb-6">
            <div className="text-xs font-bold text-[#006633] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Results Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'results-faq-1',
                q: 'How can I check the latest Prize Bond result?',
                a: 'You can check the latest results on this page by selecting your bond denomination (e.g. Rs. 1500) or by entering your 6-digit bond number in the Prize Bond Checker tool.',
              },
              {
                id: 'results-faq-2',
                q: 'Where can I find previous Prize Bond results?',
                a: 'Use our Draw Year filter above or browse the Historical Results by Year grid to view official gazette lists from 2022 to 2026.',
              },
              {
                id: 'results-faq-3',
                q: 'How do I find a result by Prize Bond denomination?',
                a: 'Click on any denomination pill (100, 200, 750, 1500, 25000, 40000) at the top of the Results Hub to instantly isolate draws for that bond.',
              },
              {
                id: 'results-faq-4',
                q: 'How can I check an old Prize Bond draw?',
                a: 'Enter the draw number (e.g. #102) into the "Search Draw #" input or filter by the year the draw was held.',
              },
              {
                id: 'results-faq-5',
                q: 'Where can I find Prize Bond draw dates and cities?',
                a: 'Each result card and table row displays the official draw date and host city (Lahore, Karachi, Islamabad, Faisalabad, Peshawar, Quetta, Multan, etc.). You can also visit our Draw Schedule section.',
              },
              {
                id: 'results-faq-6',
                q: 'How can I check whether my Prize Bond number has won?',
                a: 'Navigate to our Prize Bond Checker, enter your 6-digit number, and our system will query 10+ years of official gazette winning lists automatically.',
              },
            ].map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#006633]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIDEO GUIDE TUTORIAL WIDGET */}
      <VideoGuideWidget
        categoryBadge="🎬 GAZETTE RESULTS TUTORIAL"
        title="Video Guide: How to Access & Verify Official Prize Bond Draw Lists"
        subtitle="Watch our walkthrough to learn how to filter official gazettes by denomination, draw year, or city."
        summaryTitle="📌 Gazette Results Verification Summary"
        summaryItems={[
          {
            title: '1st, 2nd & 3rd Prize Lists',
            desc: 'View complete winning lists for all active Pakistani Prize Bond series.',
          },
          {
            title: 'City & Year Filters',
            desc: 'Easily filter results across 10+ years of SBP BSC draw archives.',
          },
          {
            title: 'Full Gazette Search',
            desc: 'Search specific 6-digit serials directly inside full draw gazettes.',
          },
          {
            title: 'Certified SBP Data',
            desc: 'Every result is verified directly against official National Savings publications.',
          },
        ]}
        duration="03:15"
        onNavigate={onNavigate}
      />

      {/* 16. TRUST / SOURCE / LAST UPDATED FOOTER NOTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <div className="p-4 bg-white rounded-xl border border-slate-200 max-w-3xl mx-auto">
          <strong className="font-bold text-slate-800">Verification & Sourcing Policy:</strong> Prize Bond
          result information is synchronized against official gazettes published by the State Bank of
          Pakistan Banking Services Corporation (SBP-BSC) and National Savings Pakistan. Please verify your physical winning bonds before filing official claims.
        </div>
      </section>

      {/* FULL DRAW GAZETTE MODAL OVERLAY */}
      {selectedDrawForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="bg-[#003B1D] text-white p-6 rounded-t-3xl border-b border-[#006633] flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider block mb-1">
                  Official Gazette Draw List
                </span>
                <h3 className="text-xl font-black text-white">
                  Rs. {selectedDrawForModal.denomination} Prize Bond — Draw #{selectedDrawForModal.drawNo}
                </h3>
                <div className="text-xs text-emerald-100 mt-1 flex items-center gap-3">
                  <span>Date: {selectedDrawForModal.formattedDate}</span>
                  <span>•</span>
                  <span>City: {selectedDrawForModal.city}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDrawForModal(null)}
                className="p-2 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* 1st Prize */}
              <div className="bg-yellow-500/10 border-2 border-yellow-400 p-5 rounded-2xl">
                <div className="text-xs font-black uppercase text-yellow-800 bg-yellow-400 px-2.5 py-0.5 rounded inline-block mb-2">
                  1st Prize ({selectedDrawForModal.prizeStructure.firstCount} Winner)
                </div>
                <div className="text-lg font-black text-slate-900 mb-2">
                  Prize Amount: {selectedDrawForModal.prizeStructure.firstAmountFormatted}
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedDrawForModal.firstPrizeNumbers.map((num) => (
                    <div
                      key={num}
                      className="bg-white border-2 border-yellow-400 px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-3"
                    >
                      <span className="font-mono text-2xl font-black text-slate-900 tracking-widest">
                        {num}
                      </span>
                      <button
                        onClick={() => copyToClipboard(num)}
                        className="p-1 text-slate-400 hover:text-[#006633] cursor-pointer"
                        title="Copy Number"
                      >
                        {copiedNumber === num ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2nd Prize */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <div className="text-xs font-extrabold uppercase bg-[#006633] text-white px-2.5 py-0.5 rounded inline-block mb-2">
                  2nd Prize ({selectedDrawForModal.prizeStructure.secondCount} Winners)
                </div>
                <div className="text-base font-black text-slate-900 mb-3">
                  Prize Amount: {selectedDrawForModal.prizeStructure.secondAmountFormatted} Each
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedDrawForModal.secondPrizeNumbers.map((num) => (
                    <div
                      key={num}
                      className="bg-white border border-emerald-300 p-2.5 rounded-lg font-mono font-black text-slate-900 text-lg flex items-center justify-between"
                    >
                      <span>{num}</span>
                      <button
                        onClick={() => copyToClipboard(num)}
                        className="text-slate-400 hover:text-[#006633] cursor-pointer"
                      >
                        {copiedNumber === num ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3rd Prize */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase bg-slate-800 text-white px-2.5 py-0.5 rounded inline-block mb-1">
                      3rd Prize Gazette Numbers ({selectedDrawForModal.prizeStructure.thirdCount} Winners)
                    </span>
                    <div className="text-sm font-bold text-slate-900">
                      Prize Amount: {selectedDrawForModal.prizeStructure.thirdAmountFormatted} Each
                    </div>
                  </div>

                  {/* 3rd Prize Filter Search */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter 3rd prize list..."
                      value={thirdPrizeModalFilter}
                      onChange={(e) => setThirdPrizeModalFilter(e.target.value)}
                      className="w-full bg-white border border-slate-300 pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-[#006633]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 text-center">
                  {selectedDrawForModal.thirdPrizeSampleNumbers
                    .filter((n) => n.includes(thirdPrizeModalFilter.trim()))
                    .map((num, i) => (
                      <div
                        key={i}
                        onClick={() => copyToClipboard(num)}
                        className="p-1.5 rounded hover:bg-emerald-100 hover:text-[#004D26] transition-colors cursor-pointer"
                        title="Click to copy"
                      >
                        {num}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 rounded-b-3xl border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                Want to check another bond number against this draw?
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const draw = selectedDrawForModal;
                    setSelectedDrawForModal(null);
                    onNavigate('checker', draw.denomination);
                  }}
                  className="px-4 py-2 bg-[#006633] text-white font-bold rounded-lg hover:bg-[#004D26] cursor-pointer"
                >
                  Check Bond in Checker
                </button>
                <button
                  onClick={() => setSelectedDrawForModal(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};