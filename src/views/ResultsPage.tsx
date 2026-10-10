'use client';

import { supabase } from '@/lib/supabase';
import React, { useState, useEffect, useMemo } from 'react';
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
  // Real Data State from Supabase
  const [drawsList, setDrawsList] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // Filter States
  const [selectedDenom, setSelectedDenom] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [drawNoSearch, setDrawNoSearch] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal / Detail Gazette View State
  const [selectedDrawForModal, setSelectedDrawForModal] = useState<DrawRecord | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Simulation UI States for Verification (Loading / Error testing)
  const [isLoadingSim, setIsLoadingSim] = useState<boolean>(false);
  const [isErrorSim, setIsErrorSim] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>('results-faq-1');

  // Sync initialDenomination prop (handles both Denominations and Archive Years)
  useEffect(() => {
    if (!initialDenomination || initialDenomination === 'all') {
      setSelectedDenom('all');
      setSelectedYear('all');
    } else if (['2026', '2025', '2024', '2023'].includes(initialDenomination)) {
      setSelectedYear(initialDenomination);
      setSelectedDenom('all');
    } else {
      setSelectedDenom(initialDenomination);
      setSelectedYear('all');
    }
  }, [initialDenomination]);

  // Fetch Real Draw Results from Supabase on Mount
  useEffect(() => {
    async function fetchDrawResults() {
      setIsDataLoading(true);
      try {
        const { data, error } = await supabase
          .from('draws')
          .select('*');

        if (error) {
          console.error('Error fetching draws from Supabase:', error.message);
        } else if (data) {
          const mappedData = data.map((item: any) => ({
            ...item,
            formattedDate: item.formattedDate || item.date || item.draw_date || item.created_at?.substring(0, 10) || 'N/A',
            city: item.city || item.draw_city || item.location || item.city_name || item.venue || 'N/A',
            denomination: String(item.denomination || item.bond_value || '100'),
          }));
          setDrawsList(mappedData);
        }
      } catch (err) {
        console.error('Unexpected error fetching draws:', err);
      } finally {
        setIsDataLoading(false);
      }
    }

    fetchDrawResults();
  }, []);

  // Filtered Results Calculation
  const filteredResults = useMemo(() => {
    return drawsList.filter((draw) => {
      // Denomination
      const drawDenom = String(draw.denomination || '');
      if (selectedDenom !== 'all' && drawDenom !== String(selectedDenom)) {
        return false;
      }
      // Year
      if (selectedYear !== 'all') {
        const drawDate = draw.formattedDate || draw.date || '';
        const drawYear = drawDate.substring(0, 4);
        if (selectedYear === 'older') {
          if (parseInt(drawYear, 10) >= 2023) return false;
        } else if (drawYear !== selectedYear) {
          return false;
        }
      }
      // Draw Number Search
      if (drawNoSearch.trim() !== '') {
        const query = drawNoSearch.trim();
        const matchesDrawNo = draw.drawNo?.toString().includes(query) || draw.draw_number?.toString().includes(query);
        const matchesFirstPrize = draw.firstPrizeNumbers?.some((num: string) => num.includes(query));
        if (!matchesDrawNo && !matchesFirstPrize) return false;
      }

      return true;
    });
  }, [drawsList, selectedDenom, selectedYear, drawNoSearch]);

  // Paginated Results
  const totalResults = filteredResults.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredResults.slice(startIndex, startIndex + pageSize);
  }, [filteredResults, currentPage, pageSize]);

  // Reset pagination when filters change
  const handleFilterChange = (type: 'denom' | 'year' | 'search', value: string) => {
    setCurrentPage(1);
    if (type === 'denom') setSelectedDenom(value);
    if (type === 'year') setSelectedYear(value);
    if (type === 'search') setDrawNoSearch(value);
  };

  const clearAllFilters = () => {
    setSelectedDenom('all');
    setSelectedYear('all');
    setDrawNoSearch('');
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleSimulateLoading = () => {
    setIsLoadingSim(true);
    setTimeout(() => {
      setIsLoadingSim(false);
    }, 800);
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Results', onClick: () => onNavigate('results') },
            ...(selectedDenom !== 'all'
              ? [{ label: `Rs. ${selectedDenom} Results` }]
              : selectedYear !== 'all'
              ? [{ label: `${selectedYear} Archive` }]
              : [{ label: 'All Results Hub' }]),
          ]}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#004D26] via-[#006633] to-[#003B1D]"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006633] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#006633]" />
                <span>State Bank of Pakistan & National Savings Verified Results</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Prize Bond Results Pakistan
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                View the latest and historical Prize Bond results in Pakistan, including winning
                numbers, draw dates, draw cities and official gazette results for major Prize Bond
                denominations.
              </p>
            </div>

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
            </div>
          </div>
        </div>
      </section>

      {/* RESULT FILTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#006633]" />
                <span>Search & Filter Results Database</span>
              </h2>
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
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
          </div>
        </div>
      </section>

      {/* RESULTS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
          </div>

          {isDataLoading ? (
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
                      <th className="p-4 font-extrabold uppercase">Denomination</th>
                      <th className="p-4 font-extrabold uppercase">Draw Date</th>
                      <th className="p-4 font-extrabold uppercase">Draw City</th>
                      <th className="p-4 font-extrabold uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedResults.map((draw) => (
                      <tr
                        key={draw.id}
                        className="hover:bg-emerald-50/60 transition-colors group"
                      >
                        <td className="p-4 font-bold text-slate-900">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-100 text-[#004D26] font-extrabold">
                            Rs. {draw.denomination}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700 font-bold">{draw.formattedDate}</td>
                        <td className="p-4 text-slate-700 font-semibold">{draw.city}</td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const queryParam = `denom=${draw.denomination}&date=${encodeURIComponent(draw.formattedDate)}&city=${encodeURIComponent(draw.city)}`;
                              onNavigate('draw-detail', queryParam);
                            }}
                            className="px-4 py-2 bg-[#006633] text-white hover:bg-[#004D26] rounded-lg font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>View List</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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
                        Draw #{draw.drawNo || 'N/A'}
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

                    <button
                      onClick={() => {
                        const queryParam = `denom=${draw.denomination}&date=${encodeURIComponent(draw.formattedDate)}&city=${encodeURIComponent(draw.city)}`;
                        onNavigate('draw-detail', queryParam);
                      }}
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

          {/* PAGINATION CONTROLS */}
          {totalResults > 0 && !isDataLoading && (
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
    </div>
  );
};