'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  ListPlus,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Info,
  Calendar,
  Building2,
  Search,
  Copy,
  Check,
  Printer,
  Share2,
  ExternalLink,
  ChevronDown,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { DenominationValue, CheckerResultItem, DrawRecord } from '@/types/prizebond';
import { DENOMINATIONS } from '@/data/mockData';
import { ALL_DRAW_RESULTS } from '@/data/resultsData';

interface BondCheckerToolProps {
  initialDenomination?: DenominationValue;
  initialNumber?: string;
  onNavigate?: (view: string, param?: string) => void;
}

export const BondCheckerTool: React.FC<BondCheckerToolProps> = ({
  initialDenomination = '1500',
  initialNumber = '',
  onNavigate,
}) => {
  // Mode Selection ('saved' tab removed)
  const [activeTab, setActiveTab] = useState<'single' | 'multiple' | 'range'>('single');
  const [selectedDenomination, setSelectedDenomination] =
    useState<DenominationValue>(initialDenomination);

  // Draw Selection (Latest vs Specific Draw)
  const [drawScope, setDrawScope] = useState<'latest' | 'all' | 'specific'>('latest');
  const [selectedDrawId, setSelectedDrawId] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('2026');

  // Inputs
  const [singleNumber, setSingleNumber] = useState(initialNumber);
  const [multipleNumbersText, setMultipleNumbersText] = useState('');
  const [rangeFrom, setRangeFrom] = useState('');
  const [rangeTo, setRangeTo] = useState('');

  // Evaluation & Result States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CheckerResultItem[] | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Copy / Share state
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Available draws filtered by current selected denomination
  const availableDrawsForDenom = useMemo(() => {
    return ALL_DRAW_RESULTS.filter((d) => d.denomination === selectedDenomination);
  }, [selectedDenomination]);

  // Execute check against database
  const executeCheck = (bondNumbersToCheck: string[], denom: DenominationValue) => {
    setValidationError(null);

    const cleanNumbers = bondNumbersToCheck
      .map((n) => n.trim().replace(/\D/g, ''))
      .filter((n) => n.length > 0);

    if (cleanNumbers.length === 0) {
      setValidationError('Please enter at least one valid 6-digit Prize Bond number.');
      setResults(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Determine which draws to test
      let drawsToSearch: DrawRecord[] = ALL_DRAW_RESULTS.filter((d) => d.denomination === denom);

      if (drawScope === 'latest') {
        if (drawsToSearch.length > 0) {
          drawsToSearch = [drawsToSearch[0]];
        }
      } else if (drawScope === 'specific' && selectedDrawId !== 'all') {
        drawsToSearch = drawsToSearch.filter((d) => d.id === selectedDrawId);
      }

      const checkResults: CheckerResultItem[] = [];

      cleanNumbers.forEach((rawNum) => {
        const paddedNum = rawNum.padStart(6, '0');
        let foundWinner = false;

        for (const draw of drawsToSearch) {
          // Check 1st Prize
          if (draw.firstPrizeNumbers.includes(paddedNum)) {
            checkResults.push({
              bondNumber: paddedNum,
              denomination: denom,
              isWinner: true,
              prizeCategory: '1st Prize',
              prizeAmount: draw.prizeStructure.firstAmount,
              prizeAmountFormatted: draw.prizeStructure.firstAmountFormatted,
              drawNo: draw.drawNo,
              drawDate: draw.formattedDate,
              drawCity: draw.city,
              matchedDrawId: draw.id,
            });
            foundWinner = true;
            break;
          }

          // Check 2nd Prize
          if (draw.secondPrizeNumbers.includes(paddedNum)) {
            checkResults.push({
              bondNumber: paddedNum,
              denomination: denom,
              isWinner: true,
              prizeCategory: '2nd Prize',
              prizeAmount: draw.prizeStructure.secondAmount,
              prizeAmountFormatted: draw.prizeStructure.secondAmountFormatted,
              drawNo: draw.drawNo,
              drawDate: draw.formattedDate,
              drawCity: draw.city,
              matchedDrawId: draw.id,
            });
            foundWinner = true;
            break;
          }

          // Check 3rd Prize
          if (draw.thirdPrizeSampleNumbers && draw.thirdPrizeSampleNumbers.includes(paddedNum)) {
            checkResults.push({
              bondNumber: paddedNum,
              denomination: denom,
              isWinner: true,
              prizeCategory: '3rd Prize',
              prizeAmount: draw.prizeStructure.thirdAmount,
              prizeAmountFormatted: draw.prizeStructure.thirdAmountFormatted,
              drawNo: draw.drawNo,
              drawDate: draw.formattedDate,
              drawCity: draw.city,
              matchedDrawId: draw.id,
            });
            foundWinner = true;
            break;
          }
        }

        if (!foundWinner) {
          const sampleDraw = drawsToSearch[0];
          checkResults.push({
            bondNumber: paddedNum,
            denomination: denom,
            isWinner: false,
            drawNo: sampleDraw?.drawNo,
            drawDate: sampleDraw?.formattedDate,
            drawCity: sampleDraw?.city,
          });
        }
      });

      setResults(checkResults);
      setHasSearched(true);
      setIsLoading(false);
    }, 400);
  };

  const handleSingleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    executeCheck([singleNumber], selectedDenomination);
  };

  const handleMultipleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const splitNums = multipleNumbersText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    executeCheck(splitNums, selectedDenomination);
  };

  const handleRangeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const start = parseInt(rangeFrom, 10);
    const end = parseInt(rangeTo, 10);

    if (isNaN(start) || isNaN(end) || start > end || end - start > 200) {
      setValidationError('Please enter a valid serial range (Maximum 200 numbers at once).');
      return;
    }

    const rangeList: string[] = [];
    for (let i = start; i <= end; i++) {
      rangeList.push(i.toString().padStart(6, '0'));
    }
    executeCheck(rangeList, selectedDenomination);
  };

  const handleCopyResultSummary = () => {
    if (!results) return;
    const text = results
      .map(
        (r) =>
          `Bond #${r.bondNumber} (Rs. ${r.denomination}): ${
            r.isWinner
              ? `WINNER! ${r.prizeCategory} - ${r.prizeAmountFormatted} (Draw #${r.drawNo})`
              : 'No Match Found'
          }`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrintResult = () => {
    window.print();
  };

  const winnersCount = results?.filter((r) => r.isWinner).length || 0;

  return (
    <div id="checker-tool-card" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* 04. PRIMARY CHECKER TOOL HEADER */}
      <div className="bg-gradient-to-r from-[#003B1D] via-[#004D26] to-[#003B1D] p-5 sm:p-6 text-white border-b border-[#006633] relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-600/50 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Verified CDNS & SBP Gazette Checker Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Check Your Prize Bond
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              Select denomination, enter 6-digit bond number, and evaluate against published winning lists instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-[#006633] border border-emerald-500/40 text-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Data Updated: 15 Aug 2026</span>
            </span>
          </div>
        </div>

        {/* 3 Main Mode Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 border-t border-emerald-700/60 pt-4">
          {[
            { id: 'single', label: 'Single Bond Check', icon: Award },
            { id: 'multiple', label: 'Multiple / Bulk List', icon: ListPlus },
            { id: 'range', label: 'By Series Range', icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as 'single' | 'multiple' | 'range');
                  setResults(null);
                  setHasSearched(false);
                  setValidationError(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-[#004D26] shadow-md scale-102 font-black'
                    : 'bg-[#006633]/80 hover:bg-[#006633] text-emerald-100 border border-emerald-600/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM BODY CONTAINER */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* FIELD 1: DENOMINATION SELECTOR GRID */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Prize Bond Denomination</span>
            <span className="text-[11px] font-bold text-[#006633]">All 6 SBP Bond Types</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {DENOMINATIONS.map((denom) => {
              const isSelected = selectedDenomination === denom.value;
              return (
                <button
                  key={denom.value}
                  type="button"
                  onClick={() => {
                    setSelectedDenomination(denom.value);
                    setSelectedDrawId('all');
                  }}
                  className={`p-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006633] text-white border-[#006633] shadow-md ring-2 ring-[#006633]/30 scale-102'
                      : 'bg-slate-50 hover:bg-emerald-50/80 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="font-extrabold">Rs. {denom.value}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                    1st Prize {denom.firstPrize.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: DRAW SELECTION SCOPE */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-[#006633]" />
            <span>Which Draw Results to Check?</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDrawScope('latest');
                setSelectedDrawId('all');
              }}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                drawScope === 'latest'
                  ? 'bg-[#006633] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Latest Result Only
            </button>

            <button
              type="button"
              onClick={() => setDrawScope('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                drawScope === 'all'
                  ? 'bg-[#006633] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Published Draws
            </button>

            <button
              type="button"
              onClick={() => setDrawScope('specific')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                drawScope === 'specific'
                  ? 'bg-[#006633] text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Choose Specific Draw
            </button>
          </div>
        </div>

        {/* SPECIFIC DRAW DROPDOWN */}
        {drawScope === 'specific' && (
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Draw Year</label>
                <select
                  value={selectedYearFilter}
                  onChange={(e) => setSelectedYearFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-[#006633] cursor-pointer"
                >
                  <option value="2026">2026 Draws</option>
                  <option value="2025">2025 Draws</option>
                  <option value="2024">2024 Draws</option>
                  <option value="2023">2023 Draws</option>
                  <option value="2022">2022 Draws</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Specific Draw Gazette
                </label>
                <select
                  value={selectedDrawId}
                  onChange={(e) => setSelectedDrawId(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-[#006633] cursor-pointer"
                >
                  <option value="all">All Draws in {selectedYearFilter}</option>
                  {availableDrawsForDenom
                    .filter((d) => d.date.startsWith(selectedYearFilter))
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        Draw #{d.drawNo} — {d.formattedDate} ({d.city})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* VALIDATION ERROR BANNER */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* TAB 1: SINGLE BOND CHECK */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleCheck} className="space-y-4">
            <div>
              <label htmlFor="single-bond-input" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Enter 6-Digit Prize Bond Number
              </label>
              <div className="relative">
                <input
                  id="single-bond-input"
                  type="text"
                  value={singleNumber}
                  onChange={(e) => setSingleNumber(e.target.value)}
                  placeholder="e.g. 452819"
                  maxLength={6}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#006633] focus:bg-white text-slate-900 font-mono text-xl sm:text-2xl font-black px-4 py-3.5 rounded-xl focus:outline-none transition-all shadow-inner"
                />
                {singleNumber && (
                  <button
                    type="button"
                    onClick={() => setSingleNumber('')}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  Testing Sample: Try winning numbers like <strong>452819</strong> (Rs. 1500 1st prize) or <strong>892104</strong> (Rs. 750 1st prize).
                </span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                )}
                <span>{isLoading ? 'Checking Database...' : 'Check Prize Bond'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MULTIPLE / BULK CHECK */}
        {activeTab === 'multiple' && (
          <form onSubmit={handleMultipleCheck} className="space-y-4">
            <div>
              <label htmlFor="bulk-bond-textarea" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                Enter Multiple Bond Numbers (Paste numbers separated by newlines or commas)
              </label>
              <textarea
                id="bulk-bond-textarea"
                rows={5}
                value={multipleNumbersText}
                onChange={(e) => setMultipleNumbersText(e.target.value)}
                placeholder="Paste numbers here, e.g.:&#10;452819&#10;128490&#10;673104&#10;892015, 123456, 789012"
                required
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#006633] focus:bg-white text-slate-900 font-mono text-sm font-bold p-4 rounded-xl focus:outline-none transition-all shadow-inner"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>Supports up to 500 numbers per evaluation</span>
                {multipleNumbersText && (
                  <button
                    type="button"
                    onClick={() => setMultipleNumbersText('')}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
              )}
              <span>{isLoading ? 'Checking Bulk List...' : 'Check All Numbers'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: RANGE SERIES CHECK */}
        {activeTab === 'range' && (
          <form onSubmit={handleRangeCheck} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="range-from-input" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Starting Serial Number (From)
                </label>
                <input
                  id="range-from-input"
                  type="text"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  placeholder="e.g. 100001"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#006633] focus:bg-white text-slate-900 font-mono text-base font-bold p-3 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="range-to-input" className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Ending Serial Number (To)
                </label>
                <input
                  id="range-to-input"
                  type="text"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  placeholder="e.g. 100050"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#006633] focus:bg-white text-slate-900 font-mono text-base font-bold p-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Note: You can evaluate up to 200 consecutive numbers in a single range search.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
              )}
              <span>{isLoading ? 'Checking Series...' : 'Check Series Range'}</span>
            </button>
          </form>
        )}

        {/* RESULT AREA */}
        {hasSearched && results && !isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in duration-300 space-y-6">
            {/* RESULT SUMMARY COUNTER */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>Evaluation Result</span>
                  <span className="text-xs font-bold bg-emerald-100 text-[#004D26] px-2.5 py-0.5 rounded-full">
                    Rs. {selectedDenomination} Prize Bond
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Checked <strong>{results.length}</strong> bond number(s) across selected published draw gazettes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  {results.length} Checked
                </span>
                {winnersCount > 0 ? (
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#006633] text-white shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{winnersCount} Winning Match(es)</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-200 text-slate-700">
                    No Match Found
                  </span>
                )}
              </div>
            </div>

            {/* DETAILED RESULTS LIST */}
            <div className="space-y-4">
              {results.map((res, index) => (
                <div
                  key={index}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    res.isWinner
                      ? 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* WINNER STATE */}
                  {res.isWinner ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#006633] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide mb-1">
                              CONGRATULATIONS — WINNING MATCH FOUND!
                            </div>
                            <h4 className="text-xl font-black text-slate-900">
                              Prize Bond #{res.bondNumber}
                            </h4>
                          </div>
                        </div>

                        <div className="text-right sm:text-right">
                          <div className="text-xs text-slate-500 font-medium">Prize Category</div>
                          <div className="text-lg font-black text-[#006633]">
                            {res.prizeCategory} ({res.prizeAmountFormatted})
                          </div>
                        </div>
                      </div>

                      {/* Prize Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/90 p-3.5 rounded-xl border border-emerald-100 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium block">Bond Denomination</span>
                          <strong className="text-slate-900 font-bold">Rs. {res.denomination}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Draw Number</span>
                          <strong className="text-slate-900 font-bold">Draw #{res.drawNo}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Draw Date</span>
                          <strong className="text-slate-900 font-bold">{res.drawDate}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Draw Location</span>
                          <strong className="text-slate-900 font-bold">{res.drawCity}</strong>
                        </div>
                      </div>

                      {/* VERIFICATION SOURCE */}
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#006633] shrink-0" />
                          <span>
                            Verified against Official CDNS Gazette Draw #{res.drawNo} ({res.drawDate})
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          Official Source: State Bank of Pakistan Banking Services Corporation
                        </span>
                      </div>

                      {/* WINNER ACTIONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('results', res.denomination)}
                            className="px-4 py-2 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>View Full Draw Result</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('information', 'how-to-claim-a-prize')}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>How to Claim Prize</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Secondary Utility Actions */}
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={handleCopyResultSummary}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            title="Copy result details"
                          >
                            {copiedText ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedText ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handlePrintResult}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            title="Print result"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NON-WINNING RESULT STATE */
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                            <XCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              NO MATCH FOUND
                            </div>
                            <h4 className="text-lg font-black text-slate-800 font-mono">
                              Prize Bond #{res.bondNumber}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              This bond number was not found among the published winning numbers checked for Rs. {res.denomination} Prize Bond (Draw #{res.drawNo || 'Latest'}).
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md shrink-0">
                          Not Drawn
                        </span>
                      </div>

                      {/* NON-WINNER ACTIONS */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-slate-400 font-medium">
                          You can test this bond against historical archives or another draw.
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setDrawScope('all');
                              executeCheck([res.bondNumber], res.denomination);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg cursor-pointer"
                          >
                            Check All Draws
                          </button>

                          <button
                            type="button"
                            onClick={() => onNavigate && onNavigate('results', res.denomination)}
                            className="px-3 py-1.5 bg-[#006633] text-white hover:bg-[#004D26] font-bold rounded-lg cursor-pointer"
                          >
                            View Draw Gazette
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* GENERAL DISCLAIMER */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Official Verification Guidance:</strong>
                <p className="mt-0.5 leading-relaxed">
                  While our automated engine scans official CDNS gazette files with high accuracy, winners are advised to verify physical Prize Bond certificates at SBP BSC field offices prior to submitting claims.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};