import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-xs text-emerald-900/70 font-medium py-2 overflow-x-auto whitespace-nowrap">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" />
          {item.onClick && index < items.length - 1 ? (
            <button
              onClick={item.onClick}
              className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-emerald-950 font-semibold text-slate-800">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};