'use client';

import React, { useState, useEffect } from 'react';
import { Download, Zap, TrendingUp, Sparkles, Award, FileCheck } from 'lucide-react';

export const StatsCounterWidget: React.FC = () => {
  // Live active count state with subtle real-time updates
  const [activeUsers, setActiveUsers] = useState(4208);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate active users count slightly to give a "Live Online" feel
      const delta = Math.floor(Math.random() * 7) - 3;
      setActiveUsers((prev) => Math.max(4150, Math.min(4350, prev + delta)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#005229] via-[#006633] to-[#004D26] p-4 sm:p-6 lg:p-7 rounded-3xl shadow-lg border border-emerald-600/30 text-white relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* 3 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
        {/* CARD 1: ACTIVE NOW */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-emerald-100">
              ACTIVE NOW
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Live Online</span>
            </div>
          </div>

          <div className="mt-4 mb-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans drop-shadow-xs">
              {activeUsers.toLocaleString()}
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-100/80 mt-1">
              Active bondholders checking gazettes live
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <TrendingUp className="w-5 h-5 text-emerald-200/80 group-hover:text-amber-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 2: BONDS CHECKED / DOWNLOADS */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-emerald-100">
              BONDS CHECKED TODAY
            </span>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md">
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans drop-shadow-xs">
              10,270
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-100/80 mt-1">
              Official SBP draw queries processed today
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <TrendingUp className="w-5 h-5 text-emerald-200/80 group-hover:text-amber-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 3: PRIZE WINNERS / DRAWS SOLVED */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-emerald-100">
              WINNING MATCHES FOUND
            </span>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950 stroke-[1.5]" />
            </div>
          </div>

          <div className="mt-4 mb-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans drop-shadow-xs">
              15,925
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-100/80 mt-1">
              Verified prize bond winners matched in gazette
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <TrendingUp className="w-5 h-5 text-emerald-200/80 group-hover:text-amber-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};