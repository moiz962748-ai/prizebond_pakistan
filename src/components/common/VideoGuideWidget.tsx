import React, { useState } from 'react';
import { Play, CheckCircle2, X, Pin, Sparkles, Video, ShieldCheck } from 'lucide-react';

export interface VideoGuideItem {
  title: string;
  desc: string;
}

export interface VideoGuideWidgetProps {
  categoryBadge?: string;
  title?: string;
  subtitle?: string;
  summaryTitle?: string;
  summaryItems?: VideoGuideItem[];
  duration?: string;
  onNavigate?: (view: string, param?: string) => void;
}

export const VideoGuideWidget: React.FC<VideoGuideWidgetProps> = ({
  categoryBadge = '🎬 PRIZE BOND VERIFICATION GUIDE',
  title = 'Video Guide: How to Verify Prize Bond Numbers & Calculate Tax Deductions',
  subtitle = 'Watch our expert walkthrough and review the official State Bank verification protocol below for your prize bond holdings.',
  summaryTitle = '📌 Official Gazette Strategy Summary',
  summaryItems = [
    {
      title: 'Bulk & Series Check',
      desc: 'Enter individual numbers or continuous series (e.g., 100000 to 100999) to scan all historical draws simultaneously.',
    },
    {
      title: 'SBP Gazette Audit',
      desc: 'Every winning record is verified against official signed SBP BSC gazette publications.',
    },
    {
      title: 'Tax Deduction Calculation',
      desc: 'Automatically applies 15% withholding tax for Filer accounts and 30% for Non-Filer accounts.',
    },
    {
      title: '6-Year Claim Window',
      desc: 'Ensure winning prize claims are submitted within the 6-year statutory limit from the draw date.',
    },
  ],
  duration = '03:45',
  onNavigate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {/* OUTER WRAPPER CONTAINER MATCHING SCREENSHOT */}
      <div className="bg-slate-50/80 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
        {/* 1. EYEBROW TAG */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/60 text-xs font-black uppercase tracking-wider">
            {categoryBadge}
          </span>
        </div>

        {/* 2. HEADING & SUBTITLE */}
        <div className="space-y-2 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3. TWO-COLUMN MAIN CONTENT (LEFT: VIDEO THUMBNAIL, RIGHT: SUMMARY BOX) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
          
          {/* LEFT COLUMN: VIDEO PLAYER PLACEHOLDER */}
          <div
            onClick={() => setIsPlaying(true)}
            className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-slate-200/80 hover:bg-slate-300/70 border border-slate-300/70 shadow-xs cursor-pointer group transition-all duration-300 min-h-[260px] sm:min-h-[300px] flex items-center justify-center p-6"
          >
            {/* Dark gradient backdrop with SBP branding green highlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#003B1D] via-[#005229] to-[#006633] opacity-95 group-hover:opacity-100 transition-opacity"></div>

            {/* Subtle glow effect */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[11px] font-black text-amber-300 border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SBP TUTORIAL</span>
            </div>

            {/* BIG PLAY BUTTON (MATCHING SCREENSHOT ORANGE/AMBER ACCENT) */}
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 group-hover:bg-amber-400 text-slate-950 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
              <span className="text-xs sm:text-sm font-black text-white tracking-wide drop-shadow-xs group-hover:text-amber-200 transition-colors">
                Click to Watch Video Guide
              </span>
            </div>

            {/* Bottom Right Duration Badge */}
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-white/10">
              <span>⏰</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY BOX CARD */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                <Pin className="w-4 h-4 text-amber-500 rotate-45 shrink-0" />
                <span>{summaryTitle}</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600">
                {summaryItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <div>
                      <strong className="font-extrabold text-slate-900">{item.title}: </strong>
                      <span className="font-medium text-slate-600">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional action button */}
            {onNavigate && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate('checker')}
                  className="w-full py-2.5 bg-[#006633] hover:bg-[#004D26] text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>LAUNCH AUTOMATED BOND CHECKER →</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* INTERACTIVE VIDEO MODAL WHEN CLICKED */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#006633]">
                <Video className="w-4.5 h-4.5 text-red-600" />
                <span>{title}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Demo Box */}
            <div className="aspect-video w-full rounded-2xl bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300 animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-black text-white">
                  PrizeBond Pakistan Step-by-Step Guide
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  1. Select your Prize Bond denomination (Rs. 100 to Rs. 40,000 Premium).<br />
                  2. Input single 6-digit numbers or continuous series range.<br />
                  3. Instant cross-reference against State Bank official gazette lists.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  if (onNavigate) onNavigate('checker');
                }}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                OPEN ONLINE CHECKER NOW →
              </button>
            </div>

            {/* Modal Footer Note */}
            <div className="text-[11px] text-slate-500 font-medium text-center pt-1">
              Official verification protocol approved by SBP BSC & Central Directorate of National Savings.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
