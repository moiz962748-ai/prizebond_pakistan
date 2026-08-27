import React from 'react';
import { ShieldCheck, Clock, Landmark } from 'lucide-react';

interface LastUpdatedBadgeProps {
  date?: string;
  source?: string;
  className?: string;
}

export const LastUpdatedBadge: React.FC<LastUpdatedBadgeProps> = ({
  date = '15 August 2026',
  source = 'National Savings Gazette & SBP BSC Official Record',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 bg-emerald-50/70 border border-emerald-200/80 px-3.5 py-2 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-1.5 font-medium text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Official Verification</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-600">
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Last Updated: <strong>{date}</strong></span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500 hidden sm:flex">
        <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Source: {source}</span>
      </div>
    </div>
  );
};