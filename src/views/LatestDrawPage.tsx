'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Award,
  FileText,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  SlidersHorizontal,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { DenominationValue, DrawRecord, ScheduleItem } from '../types/prizebond';
import { LATEST_DRAWS, DENOMINATIONS, SCHEDULE_2026 } from '../data/mockData';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LastUpdatedBadge } from '../components/common/LastUpdatedBadge';
import { AdSensePlaceholder } from '../components/common/AdSensePlaceholder';

interface LatestDrawPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export type ResultStatusMode = 'COMPLETED' | 'RESULT PENDING' | 'UPDATING' | 'UNAVAILABLE';

export const LatestDrawPage: React.FC<LatestDrawPageProps> = ({ onNavigate }) => {
  // Selected Denomination Filter (Defaults to '1500')
  const [selectedDenom, setSelectedDenom] = useState<DenominationValue>('1500');

  // Simulated Result Status State for testing/verification
  const [statusMode, setStatusMode] = useState<ResultStatusMode>('COMPLETED');

  // Interactive Quick Check input
  const [quickCheckNum, setQuickCheckNum] = useState<string>('');

  // Copy Feedback state
  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  // Find the primary draw for selected denomination, or fallback to first draw in LATEST_DRAWS
  const currentDraw = useMemo<DrawRecord | undefined>(() => {
    return (
      LATEST_DRAWS.find((d) => d.denomination === selectedDenom) || LATEST_DRAWS[0]
    );
  }, [selectedDenom]);

  // Find denomination metadata
  const denomInfo = useMemo(() => {
    return (
      DENOMINATIONS.find((d) => d.value === (currentDraw?.denomination || selectedDenom)) ||
      DENOMINATIONS[3]
    );
  }, [currentDraw, selectedDenom]);

  // Find next upcoming draw for this denomination or overall next draw
  const nextScheduledDraw = useMemo<ScheduleItem | undefined>(() => {
    const denomNext = SCHEDULE_2026.find(
      (s) => s.denomination === (currentDraw?.denomination || selectedDenom) && s.status === 'Upcoming'
    );
    if (denomNext) return denomNext;
    return SCHEDULE_2026.find((s) => s.isNextDraw || s.status === 'Upcoming');
  }, [currentDraw, selectedDenom]);

  // Previous completed draws (excluding current active draw)
  const previousDraws = useMemo<DrawRecord[]>(() => {
    return LATEST_DRAWS.filter((d) => d.id !== currentDraw?.id).slice(0, 3);
  }, [currentDraw]);

  // Copy number helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNum(text);
    setTimeout(() => setCopiedNum(null), 2000);
  };

  // Quick Check submit
  const handleQuickCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCheckNum.trim()) {
      onNavigate('checker', quickCheckNum.trim());
    } else {
      onNavigate('checker');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 01. BREADCRUMBS & COMPLIANCE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: () => onNavigate('home') },
            { label: 'Latest Draw' },
          ]}
        />
        <div className="flex items-center gap-3">
          <LastUpdatedBadge date="15 August 2026" />
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            ← Home
          </button>
        </div>
      </div>

      {/* 02. HERO SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-[#004D26] text-xs font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> LATEST COMPLETED DRAW
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Data Updated: 15 August 2026</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Latest Prize Bond Draw Results
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
          View the most recent completed Prize Bond draw held by the State Bank of Pakistan Banking Services Corporation, including winning numbers, location, prize breakdown, and verified gazette details.
        </p>

        {/* Status Preview Selector / Filter Toolbar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-700 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#006633]" /> Denomination:
            </span>
            {DENOMINATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => {
                  setSelectedDenom(d.value as DenominationValue);
                  setStatusMode('COMPLETED');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedDenom === d.value
                    ? 'bg-[#006633] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Rs. {d.value === '25000' || d.value === '40000' ? `${d.value} Prem` : d.value}
              </button>
            ))}
          </div>

          {/* Test Status Switcher */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-400 px-1">Status:</span>
            {(['COMPLETED', 'RESULT PENDING', 'UNAVAILABLE'] as ResultStatusMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStatusMode(mode)}
                className={`px-2 py-0.5 rounded text-[10px] font-black transition-colors cursor-pointer ${
                  statusMode === mode
                    ? 'bg-slate-800 text-white'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 03. AEO DIRECT ANSWER BLOCK */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#004D26] to-[#006633] text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Direct Answer Summary
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {statusMode === 'COMPLETED' && currentDraw ? (
            <>
              The latest completed draw is <strong className="text-amber-300 font-black">Rs. {denomInfo.value} (Draw #{currentDraw.drawNo})</strong>, held on <strong className="text-amber-300 font-black">{currentDraw.formattedDate}</strong> at <strong className="text-amber-300 font-black">{currentDraw.city}</strong>. The 1st prize of {currentDraw.prizeStructure.firstAmountFormatted} was awarded to winning serial number <strong className="text-amber-300 font-mono font-black">{currentDraw.firstPrizeNumbers[0]}</strong>.
            </>
          ) : statusMode === 'RESULT PENDING' && currentDraw ? (
            <>
              The draw for <strong className="text-amber-300 font-black">Rs. {denomInfo.value} (Draw #{currentDraw.drawNo})</strong> was conducted on <strong className="text-amber-300 font-black">{currentDraw.formattedDate}</strong> at <strong className="text-amber-300 font-black">{currentDraw.city}</strong>. Verified winning numbers are currently undergoing official SBP gazette audit.
            </>
          ) : (
            <>
              Verified latest draw information for <strong className="text-amber-300 font-black">Rs. {denomInfo.value}</strong> is currently undergoing system update or gazette synchronization.
            </>
          )}
        </p>
      </div>

      {/* 04. MAIN LATEST DRAW DISPLAY GRID */}
      {statusMode === 'COMPLETED' && currentDraw ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-Column Result Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* PRIMARY LATEST DRAW CARD */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black text-[#006633] uppercase tracking-wider block">
                    Denomination & Draw Number
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      Rs. {denomInfo.value}
                    </span>
                    <span className="text-base font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      Draw #{currentDraw.drawNo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-100 text-[#004D26] text-xs font-black rounded-xl border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#006633]" /> COMPLETED
                  </span>
                </div>
              </div>

              {/* Draw Meta Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#006633]" /> Draw Date
                  </span>
                  <span className="text-slate-900 font-black text-sm">{currentDraw.formattedDate}</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#006633]" /> Location
                  </span>
                  <span className="text-slate-900 font-black text-sm">{currentDraw.city}</span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#006633]" /> 1st Prize
                  </span>
                  <span className="text-emerald-800 font-black text-sm">
                    {currentDraw.prizeStructure.firstAmountFormatted}
                  </span>
                </div>
              </div>

              {/* RESULT SUMMARY: WINNING NUMBERS */}
              <div className="space-y-4 pt-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#006633]" />
                  Winning Numbers Summary
                </h2>

                {/* 1st Prize */}
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#004D26] uppercase tracking-wider">
                      1st Prize — {currentDraw.prizeStructure.firstAmountFormatted} ({currentDraw.prizeStructure.firstCount} Winner)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Official Gazette
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {currentDraw.firstPrizeNumbers.map((num) => (
                      <div
                        key={num}
                        className="px-4 py-2 bg-white rounded-xl border border-emerald-300 shadow-2xs font-mono font-black text-xl text-[#004D26] tracking-wider flex items-center gap-3"
                      >
                        <span>{num}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(num)}
                          className="text-slate-400 hover:text-[#006633] cursor-pointer"
                          title="Copy Winning Number"
                        >
                          {copiedNum === num ? (
                            <Check className="w-4 h-4 text-[#006633]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2nd Prize */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      2nd Prize — {currentDraw.prizeStructure.secondAmountFormatted} ({currentDraw.prizeStructure.secondCount} Winners)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {currentDraw.secondPrizeNumbers.map((num) => (
                      <div
                        key={num}
                        className="px-3.5 py-1.5 bg-white rounded-xl border border-slate-300 font-mono font-black text-base text-slate-900 tracking-wider flex items-center gap-2"
                      >
                        <span>{num}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(num)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {copiedNum === num ? (
                            <Check className="w-3.5 h-3.5 text-[#006633]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3rd Prize Preview */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      3rd Prize — {currentDraw.prizeStructure.thirdAmountFormatted} ({currentDraw.prizeStructure.thirdCount.toLocaleString()} Winners)
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Sample Display</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Showing first 12 winning serial numbers out of {currentDraw.prizeStructure.thirdCount.toLocaleString()} total 3rd prize winners:
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono font-bold text-xs text-slate-800">
                    {currentDraw.thirdPrizeSampleNumbers.slice(0, 12).map((num) => (
                      <div
                        key={num}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-center"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRIMARY & SECONDARY CTAS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('results', currentDraw.denomination)}
                  className="flex-1 py-3.5 px-6 bg-[#006633] hover:bg-[#004D26] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>VIEW FULL RESULT LIST ({currentDraw.prizeStructure.thirdCount + currentDraw.prizeStructure.firstCount + currentDraw.prizeStructure.secondCount} WINNERS)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('draw-detail', currentDraw.id)}
                  className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>VIEW DRAW DETAILS</span>
                </button>
              </div>
            </div>

            {/* CONTEXT SECTION: ABOUT THIS DRAW */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#006633]" />
                About Draw #{currentDraw.drawNo} ({denomInfo.label})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 font-medium leading-relaxed">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Conducting Authority</div>
                  <div>State Bank of Pakistan Banking Services Corporation (SBP BSC), {currentDraw.city} field office.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Draw System</div>
                  <div>Computerized randomized draw machinery supervised by an independent public draw committee.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Tax Deductions</div>
                  <div>15% Withholding Tax for active Filer accounts; 30% for Non-Filers per FBR Income Tax Ordinance.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Claim Validity</div>
                  <div>Winning prize claims remain valid for submission within 6 years from draw date.</div>
                </div>
              </div>
            </div>

            {/* QUICK CHECK CONVERSION TOOL */}
            <div className="bg-gradient-to-r from-emerald-900 via-[#004D26] to-[#006633] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  Instant Verification Tool
                </span>
                <h2 className="text-xl font-black text-white">
                  Want to check your Prize Bond against this draw?
                </h2>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Enter your 6-digit bond number to instantly check against Draw #{currentDraw.drawNo} and 10+ years of official SBP gazette archives.
                </p>
              </div>

              <form onSubmit={handleQuickCheckSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                <input
                  type="text"
                  maxLength={6}
                  value={quickCheckNum}
                  onChange={(e) => setQuickCheckNum(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit number (e.g. 452819)"
                  className="p-3 bg-white text-slate-900 font-mono font-bold text-sm rounded-xl focus:outline-none placeholder-slate-400 flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>CHECK NOW</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* ABOUT THIS DENOMINATION */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Award className="w-4 h-4 text-[#006633]" />
                About {denomInfo.label}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                {denomInfo.description}
              </p>

              <div className="space-y-2 pt-1 font-bold text-slate-800">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">Draw Frequency:</span>
                  <span>{denomInfo.drawFrequency}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500 font-medium">1st Prize:</span>
                  <span className="text-[#006633]">{denomInfo.firstPrize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">2nd Prize:</span>
                  <span>{denomInfo.secondPrize}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('denomination', denomInfo.value)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold rounded-xl transition-colors cursor-pointer text-center"
              >
                VIEW DENOMINATION DETAILS →
              </button>
            </div>

            {/* WHAT'S NEXT: UPCOMING SCHEDULE */}
            {nextScheduledDraw && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#006633]" />
                    What&apos;s Next?
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded">
                    UPCOMING
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-base font-black text-slate-900">
                    Rs. {nextScheduledDraw.denomination} — Draw #{nextScheduledDraw.drawNo}
                  </div>
                  <div className="text-slate-600 font-bold">
                    {nextScheduledDraw.date} ({nextScheduledDraw.day})
                  </div>
                  <div className="text-slate-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Venue: {nextScheduledDraw.city}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('schedule')}
                  className="w-full py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold rounded-xl transition-colors cursor-pointer text-center"
                >
                  VIEW FULL 2026 SCHEDULE →
                </button>
              </div>
            )}

            {/* AD PLACEHOLDER */}
            <AdSensePlaceholder slot="sidebar" />

            {/* DATA SOURCE / TRUST BLOCK */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#006633]" /> Gazette Source & Disclaimer
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Result data verified against official printed gazettes issued by SBP BSC. Displayed for user convenience and informational checking.
              </p>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Found an issue?</span>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-xs font-black text-[#006633] hover:underline cursor-pointer"
                >
                  Report Discrepancy →
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : statusMode === 'RESULT PENDING' ? (
        /* RESULT PENDING STATE DISPLAY */
        <div className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-amber-300 shadow-xs text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-950 font-black text-xs rounded-md uppercase">
              RESULT PENDING GAZETTE PUBLICATION
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Draw #{currentDraw?.drawNo || 103} (Rs. {denomInfo.value}) Conducted
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              The draw was held on {currentDraw?.formattedDate || '15 August 2026'} at {currentDraw?.city || 'Faisalabad'}. Official signed gazette sheets are currently being processed by SBP BSC prior to public release.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 max-w-md mx-auto">
            Winning numbers will be published immediately upon official verification.
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('schedule')}
              className="px-6 py-3 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl cursor-pointer"
            >
              VIEW SCHEDULE DETAILS
            </button>
            <button
              type="button"
              onClick={() => setStatusMode('COMPLETED')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl cursor-pointer"
            >
              REFRESH PAGE
            </button>
          </div>
        </div>
      ) : (
        /* UNAVAILABLE / ERROR STATE DISPLAY */
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Latest Draw Information Currently Unavailable
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              We are currently synchronizing our gazette repository with the State Bank of Pakistan server. Please check the Results Hub or Schedule for verified records.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="px-6 py-3 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl cursor-pointer"
            >
              GO TO RESULTS HUB
            </button>
            <button
              type="button"
              onClick={() => setStatusMode('COMPLETED')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* 05. LATEST DRAWS BY DENOMINATION GRID */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-[#006633]" />
              Latest Draws by Denomination
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Quick access to the most recent draw for each active Pakistani Prize Bond series.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="text-xs font-black text-[#006633] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Results Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DENOMINATIONS.map((d) => {
            const draw = LATEST_DRAWS.find((ld) => ld.denomination === d.value);
            return (
              <div
                key={d.value}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{d.label}</span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {draw ? `Draw #${draw.drawNo}` : 'Active'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 font-medium">
                  <div>Latest Date: <span className="text-slate-900 font-bold">{draw?.formattedDate || 'Quarterly'}</span></div>
                  <div>City: <span className="text-slate-900 font-bold">{draw?.city || 'SBP Branch'}</span></div>
                  <div>1st Prize: <span className="text-[#006633] font-extrabold">{d.firstPrize}</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('results', d.value)}
                  className="w-full py-2 bg-white hover:bg-emerald-50 text-[#006633] border border-slate-200 hover:border-emerald-300 font-extrabold text-xs rounded-lg transition-colors cursor-pointer text-center"
                >
                  View Result Details →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 06. PREVIOUS RECENT DRAWS */}
      {previousDraws.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-[#006633]" />
            Previous Recent Completed Draws
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {previousDraws.map((pd) => (
              <div
                key={pd.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">
                    Rs. {pd.denomination} — Draw #{pd.drawNo}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{pd.city}</span>
                </div>
                <div className="text-slate-600 font-medium">
                  Held on: <strong className="text-slate-800">{pd.formattedDate}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('results', pd.denomination)}
                  className="text-xs font-black text-[#006633] hover:underline cursor-pointer block pt-1"
                >
                  View Result →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 07. INTERNAL LINKING CROSS-SILO GATEWAY */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4 border border-slate-800">
        <h2 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-5 h-5" /> Explore Prize Bond Network
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => onNavigate('prizebonds')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Prize Bonds Hub
          </button>
          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Results Hub
          </button>
          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Draw Schedule
          </button>
          <button
            type="button"
            onClick={() => onNavigate('checker')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Bulk Checker
          </button>
          <button
            type="button"
            onClick={() => onNavigate('faqs')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Prize Bond FAQs
          </button>
          <button
            type="button"
            onClick={() => onNavigate('information', 'how-prize-bonds-work')}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-center text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            Bond Guides
          </button>
        </div>
      </div>
    </div>
  );
};