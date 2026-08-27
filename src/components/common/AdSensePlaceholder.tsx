import React from 'react';

interface AdSensePlaceholderProps {
  slot?: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  slot = 'banner',
  className = '',
}) => {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative my-6 p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 text-center select-none overflow-hidden ${
        slot === 'sidebar'
          ? 'min-h-[250px] flex flex-col justify-center items-center'
          : 'min-h-[90px] flex flex-col justify-center items-center'
      } ${className}`}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
        Advertisement Space
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
      </div>
      <p className="text-xs text-slate-500 max-w-sm">
        Official AdSense Reserved Slot (100% Policy Compliant — Non-interfering UI Area)
      </p>
    </aside>
  );
};